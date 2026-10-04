import { useEffect, useMemo, useState } from 'react';
import type { Recipe } from '../domain/types';
import { libraryImage } from '../data/library';
import { getRecipeThumbnail } from '../services/mediaGateway';

export function RecipeThumbnail({ recipe }: { recipe: Recipe }) {
  const initialImage=useMemo(()=>libraryImage(recipe.id,true),[recipe.id]);
  const [image, setImage] = useState<{recipeId:string;url?:string}>(()=>({recipeId:recipe.id,url:initialImage}));
  const url=image.recipeId===recipe.id?image.url:initialImage;

  useEffect(() => {
    setImage({recipeId:recipe.id,url:initialImage});
    let disposed = false;
    let objectUrl: string | undefined;
    getRecipeThumbnail(recipe.id).then(result => {
      objectUrl = result;
      if (disposed && result?.startsWith('blob:')) URL.revokeObjectURL(result);
      if (!disposed && result) setImage({recipeId:recipe.id,url:result});
    }).catch(() => undefined);
    return () => {
      disposed = true;
      if (objectUrl?.startsWith('blob:')) URL.revokeObjectURL(objectUrl);
    };
  }, [recipe.id,initialImage]);

  return <span className="library-emoji library-photo">
    {url ? <img
      src={url}
      alt=""
      loading="lazy"
      decoding="async"
      onError={()=>setImage({recipeId:recipe.id})}
    /> : <span className="recipe-photo-unavailable" role="img" aria-label={`Sin foto de ${recipe.title}`}><span aria-hidden="true">🍽️</span><small>Sin foto</small></span>}
  </span>;
}
