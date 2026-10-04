import { useEffect, useMemo, useState } from 'react';
import type { Recipe } from '../domain/types';
import { getRecipeThumbnail } from '../services/mediaGateway';

export function RecipeThumbnail({ recipe }: { recipe: Recipe }) {
  const fallback=useMemo(()=>fallbackImage(recipe.id),[recipe.id]);
  const [url, setUrl] = useState<string>(fallback);

  useEffect(() => {
    setUrl(fallback);
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
  }, [recipe.id,fallback]);

  return <span className="library-emoji library-photo">
    <img
      src={url}
      alt=""
      loading="lazy"
      decoding="async"
      onError={event=>{const img=event.currentTarget;if(img.src!==fallback)img.src=fallback}}
    />
  </span>;
}

function fallbackImage(id:string){
  const candidates=['home-photo-recipe.png','home-magret.png','home-desire.jpg'];
  let hash=0;for(let i=0;i<id.length;i++)hash=(hash*31+id.charCodeAt(i))>>>0;
  return `${import.meta.env.BASE_URL}${candidates[hash%candidates.length]}`;
}
