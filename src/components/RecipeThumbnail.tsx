import { useEffect, useState } from 'react';
import type { Recipe } from '../domain/types';
import { getRecipeThumbnail } from '../services/mediaGateway';

export function RecipeThumbnail({ recipe }: { recipe: Recipe }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    setUrl(undefined);
    let disposed = false;
    let objectUrl: string | undefined;
    getRecipeThumbnail(recipe.id).then(result => {
      objectUrl = result;
      if (!disposed && result) setUrl(result);
    }).catch(() => undefined);
    return () => {
      disposed = true;
      if (objectUrl?.startsWith('blob:')) URL.revokeObjectURL(objectUrl);
    };
  }, [recipe.id]);

  return url
    ? <span className="library-emoji library-photo"><img src={url} alt="" loading="lazy" decoding="async" /></span>
    : <span className="library-emoji">{recipe.emoji}</span>;
}
