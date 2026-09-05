import { ExternalLink, Globe2, Image as ImageIcon, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
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
