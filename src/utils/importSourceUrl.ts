import type {RecipeSourcePlatform} from '../domain/types';

export function isYouTubeUrl(value:string):boolean{
 try{const host=new URL(value).hostname.toLowerCase().replace(/\.$/,'');return ['youtube.com','youtu.be','youtube-nocookie.com'].some(domain=>host===domain||host.endsWith('.'+domain));}catch{return false;}
}
export function sourcePlatformFromUrl(value:string):RecipeSourcePlatform{
 try{
  const host=new URL(value).hostname.toLowerCase().replace(/^www\./,'');
  if(host==='youtu.be'||host.endsWith('youtube.com')||host.endsWith('youtube-nocookie.com'))return 'youtube';
  if(host==='instagram.com'||host.endsWith('.instagram.com'))return 'instagram';
  if(host==='tiktok.com'||host.endsWith('.tiktok.com'))return 'tiktok';
  if(host==='facebook.com'||host.endsWith('.facebook.com')||host==='fb.watch')return 'facebook';
  return 'web';
 }catch{return 'web';}
}
export function sourceLabelFromUrl(value:string){
 const platform=sourcePlatformFromUrl(value);
 return platform==='web'?'Receta web':platform[0].toUpperCase()+platform.slice(1);
}
