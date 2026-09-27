import { ExternalLink, Globe2, Image as ImageIcon, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Recipe, RecipeSource } from '../domain/types';
import { getRecipeImage } from '../services/mediaGateway';
import '../recipe-source.css';

export function RecipeSourceNote({ recipe, showImage = true }: { recipe: Recipe; showImage?: boolean }) {
  const source: RecipeSource = recipe.source ?? { kind: 'local', label: 'Catálogo El Chef' };
  const isWeb = source.kind === 'web';
  const isSocial = source.kind === 'social';
  const isAi = source.kind === 'ai';
  const Icon = isWeb || isSocial ? Globe2 : isAi ? Sparkles : ShieldCheck;
  const evidence=Object.values(source.fieldEvidence??{});
  const interpreted=evidence.filter(item=>item.state==='interpreted'||item.state==='estimated').length;
  const platform=source.platform&&source.platform!=='web'?source.platform[0].toUpperCase()+source.platform.slice(1):undefined;
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
    if (isAi && showImage) void loadImage();
  }, [recipe.id, isAi, showImage]);

  return (
    <>
      {isAi && showImage && (
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
          <strong>{isSocial ? 'Fuente social importada' : isWeb ? 'Fuente web adaptada' : isAi ? 'Receta generada por IA' : source.kind === 'user' ? 'Receta de tu biblioteca' : 'Receta del repositorio El Chef'}</strong>
          <span>
            {platform ? `${platform} · ` : ''}{source.label}{source.publisher && source.publisher !== source.label ? ` · ${source.publisher}` : ''}
            {source.adapted ? ' · Adaptación de Chef Voldi' : ''}{interpreted ? ` · ${interpreted} datos interpretados/estimados` : ''}
            {source.url && (
              <> · <a href={source.url} target="_blank" rel="noreferrer">Ver fuente <ExternalLink size={12} /></a></>
            )}
          </span>
        </div>
      </section>
    </>
  );
}
