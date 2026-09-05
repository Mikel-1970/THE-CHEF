import { ExternalLink, Globe2, Image as ImageIcon, RefreshCw, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Recipe, RecipeSource } from '../domain/types';
import { getRecipeImage } from '../services/mediaGateway';
import '../recipe-source.css';

export function RecipeSourceNote({ recipe }: { recipe: Recipe }) {
  const source: RecipeSource = recipe.source ?? { kind: 'local', label: 'Catálogo El Chef' };
  const isWeb = source.kind === 'web';
  const isAi = source.kind === 'ai';
  const Icon = isWeb ? Globe2 : isAi ? Sparkles : ShieldCheck;
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string>();

  const loadImage = async () => {
    if (!isAi || imageLoading) return;
    setImageLoading(true);
    setImageError(undefined);
    try {
      const url = await getRecipeImage(recipe);
      if (url) setImageUrl(url);
      else setImageError('No se ha recibido una imagen utilizable.');
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'No se ha podido generar la imagen.');
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    setImageUrl(undefined);
    setImageError(undefined);
    if (isAi) void loadImage();
  }, [recipe.id, isAi]);

  const shareText = buildRecipeShareText(recipe);

  const shareRecipe = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${recipe.title} · El Chef`, text: shareText });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await navigator.clipboard?.writeText(shareText);
    window.alert('Receta copiada. Ya puedes pegarla donde quieras.');
  };

  const sendWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {isAi && (
        <section className="generated-recipe-photo" aria-label="Imagen generada de la receta">
          {imageUrl ? (
            <img src={imageUrl} alt={`Presentación sugerida de ${recipe.title}`} />
          ) : (
            <div className="generated-recipe-photo-placeholder">
              {imageLoading ? <><Sparkles size={22} /><span>Creando la imagen del plato…</span></> : <><ImageIcon size={22} /><span>Imagen no disponible</span></>}
            </div>
          )}
          {imageError && <button type="button" className="secondary-button" onClick={() => void loadImage()}><RefreshCw size={16} /> Reintentar imagen</button>}
        </section>
      )}

      <div className="recipe-share-actions">
        <button type="button" className="secondary-button" onClick={() => void shareRecipe()}><Share2 size={17} /> Compartir receta</button>
        <button type="button" className="secondary-button whatsapp-share-button" onClick={sendWhatsApp}>WhatsApp</button>
      </div>

      <section className="trust-strip recipe-source-note">
        <Icon size={18} />
        <div>
          <strong>{isWeb ? 'Fuente web adaptada' : isAi ? 'Receta generada por IA y comprobada automáticamente' : 'Receta del catálogo El Chef'}</strong>
          <span>
            {source.publisher || source.label}
            {source.adapted ? ' · Adaptada automáticamente por El Chef' : ''}
            {source.url && (
              <> · <a href={source.url} target="_blank" rel="noreferrer">Ver fuente <ExternalLink size={12} /></a></>
            )}
          </span>
        </div>
      </section>
    </>
  );
}

function buildRecipeShareText(recipe: Recipe): string {
  const ingredients = recipe.ingredients.map(item => `• ${item.quantity} ${item.unit} ${item.name}`.replace(/\s+/g, ' ').trim());
  const steps = recipe.steps.map(step => `${step.number}. ${step.instruction}`);
  return [
    `👨‍🍳 ${recipe.title} · El Chef`,
    recipe.description,
    '',
    `⏱ ${recipe.prepMinutes + recipe.cookMinutes} min · ${recipe.difficulty} · ${recipe.baseServings} raciones`,
    '',
    'INGREDIENTES',
    ...ingredients,
    '',
    'ELABORACIÓN',
    ...steps,
    '',
    'Compartida desde El Chef'
  ].join('\n');
}
