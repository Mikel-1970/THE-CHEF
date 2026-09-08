import { ChefHat } from 'lucide-react';
import './ChefAvatar.css';

export type ChefAvatarId = 'chef-man' | 'chef-woman' | 'dachshund' | 'tomato' | 'lemon' | 'aubergine' | 'shrimp' | 'crab' | 'cow' | 'croissant' | 'banana' | 'potato' | 'teapot' | 'moka' | 'egg' | 'fish';

export const CHEF_AVATARS: Array<{ id: ChefAvatarId; label: string }> = [
  { id: 'chef-man', label: 'Cocinero' },
  { id: 'chef-woman', label: 'Cocinera' },
  { id: 'dachshund', label: 'Teckel' },
  { id: 'tomato', label: 'Tomate' },
  { id: 'lemon', label: 'Limón' },
  { id: 'aubergine', label: 'Berenjena' },
  { id: 'shrimp', label: 'Langostino' },
  { id: 'crab', label: 'Cangrejo' },
  { id: 'cow', label: 'Vaca' },
  { id: 'croissant', label: 'Cruasán' },
  { id: 'banana', label: 'Plátano' },
  { id: 'potato', label: 'Patata' },
  { id: 'teapot', label: 'Tetera' },
  { id: 'moka', label: 'Cafetera' },
  { id: 'egg', label: 'Huevo' },
  { id: 'fish', label: 'Pescado' }
];

const LEGACY: Record<string, ChefAvatarId> = {
  '👨‍🍳': 'chef-man', '👩‍🍳': 'chef-woman', '🍅': 'tomato', '🍋': 'lemon', '🍆': 'aubergine',
  '🦐': 'shrimp', '🦀': 'crab', '🐄': 'cow', '🥐': 'croissant', '🍌': 'banana'
};

export function normalizeChefAvatar(value?: string): ChefAvatarId {
  if (!value) return 'chef-man';
  return LEGACY[value] ?? (CHEF_AVATARS.some(item => item.id === value) ? value as ChefAvatarId : 'chef-man');
}

export function ChefAvatar({ avatar, image, size = 64, showHat = true, className = '' }: { avatar?: string; image?: string; size?: number; showHat?: boolean; className?: string }) {
  const id = normalizeChefAvatar(avatar);
  return (
    <span className={`chef-avatar chef-avatar-${id} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {image ? <img src={image} alt="" /> : <AvatarArt id={id} />}
      {showHat && <i className="chef-avatar-hat"><ChefHat size={Math.max(18, Math.round(size * .34))} strokeWidth={1.8} /></i>}
    </span>
  );
}

function Face({ x = 32, y = 33 }: { x?: number; y?: number }) {
  return <><circle cx={x - 6} cy={y - 3} r="1.6" fill="#2f3825"/><circle cx={x + 6} cy={y - 3} r="1.6" fill="#2f3825"/><path d={`M${x - 5} ${y + 5}c3 3 7 3 10 0`} fill="none" stroke="#2f3825" strokeWidth="1.8" strokeLinecap="round"/></>;
}

function AvatarArt({ id }: { id: ChefAvatarId }) {
  if (id === 'chef-man' || id === 'chef-woman') return (
    <svg viewBox="0 0 64 64" role="presentation">
      <circle cx="32" cy="32" r="31" fill={id === 'chef-man' ? '#dce6c8' : '#f1d7c8'} />
      <path d="M19 21c2-12 24-13 27 0" fill="#fff" stroke="#d8d8d1" strokeWidth="1.5"/><path d="M20 20c-5-8 5-13 10-8 3-8 15-6 14 3 7-1 9 8 3 11H18c-5-1-5-7 2-6Z" fill="#fff" stroke="#d8d8d1" strokeWidth="1.5"/>
      <circle cx="32" cy="33" r="15" fill="#efc7a4" />
      <Face y={34}/>
      {id === 'chef-man' ? <path d="M24 39c2 7 14 7 16 0-3 3-13 3-16 0Z" fill="#6e5b49" opacity=".82" /> : <path d="M18 32c0-12 6-18 14-18 9 0 15 7 15 18-3-7-8-11-15-11-6 0-11 4-14 11Z" fill="#705245" />}
      <path d="M16 61c4-13 11-19 16-19s12 6 16 19" fill="#405626" /><path d="M28 45h8l3 8-7 5-7-5 3-8Z" fill="#d6a12b"/>
    </svg>
  );
  if (id === 'dachshund') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#ead7bd"/><path d="M15 26c-5 5-4 18 2 24 3 3 7 1 8-3l-2-18c-1-5-5-7-8-3Zm34 0c5 5 4 18-2 24-3 3-7 1-8-3l2-18c1-5 5-7 8-3Z" fill="#4d3529"/><ellipse cx="32" cy="35" rx="16" ry="18" fill="#9b613d"/><path d="M23 23c3-6 15-6 18 0" fill="#36271f"/><circle cx="26" cy="33" r="2" fill="#241b17"/><circle cx="38" cy="33" r="2" fill="#241b17"/><ellipse cx="32" cy="40" rx="4" ry="3" fill="#201915"/><path d="M27 45c3 3 7 3 10 0" fill="none" stroke="#2b211c" strokeWidth="1.7" strokeLinecap="round"/><path d="M20 18c-4-7 4-12 10-8 3-7 14-5 14 3 6 0 7 7 2 10H19c-5-1-5-5 1-5Z" fill="#fff" stroke="#d4d4cd" strokeWidth="1.3"/></svg>;
  if (id === 'tomato') return <svg viewBox="0 0 64 64"><circle cx="32" cy="35" r="22" fill="#df654d"/><path d="M32 10l4 9 10-4-6 8 9 3-11 1-6 9-2-9-11-1 9-4-6-7 9 4 1-9Z" fill="#56783b"/><Face y={36}/></svg>;
  if (id === 'lemon') return <svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="23" ry="18" transform="rotate(-22 32 34)" fill="#e9c94f"/><path d="M45 13c5-4 9-3 12 0-5 1-8 4-10 8" fill="#648545"/><Face y={35}/></svg>;
  if (id === 'aubergine') return <svg viewBox="0 0 64 64"><ellipse cx="33" cy="37" rx="16" ry="24" transform="rotate(38 33 37)" fill="#735397"/><path d="M41 13c8-2 12 2 14 7-6-1-10 2-13 6-1-6-4-9-8-11 2-1 4-2 7-2Z" fill="#5f7d3f"/><Face x={31} y={38}/></svg>;
  if (id === 'shrimp') return <svg viewBox="0 0 64 64"><path d="M47 18c-15-9-31 1-31 16 0 11 9 18 19 16 8-2 13-10 10-18-2-5-7-8-12-7-4 1-7 5-6 9 1 3 4 5 7 4" fill="none" stroke="#e9845f" strokeWidth="9" strokeLinecap="round"/><circle cx="47" cy="18" r="3" fill="#35422c"/><path d="M47 13c-2-5 3-8 6-5 2-4 7-2 6 2" fill="#fff" stroke="#ddd" strokeWidth="1"/></svg>;
  if (id === 'crab') return <svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="18" ry="13" fill="#d96855"/><circle cx="25" cy="31" r="2" fill="#2f3929"/><circle cx="39" cy="31" r="2" fill="#2f3929"/><path d="M14 32 7 25m43 7 7-7M16 41 8 47m40-6 8 6" stroke="#d96855" strokeWidth="5" strokeLinecap="round"/><circle cx="8" cy="24" r="5" fill="#d96855"/><circle cx="56" cy="24" r="5" fill="#d96855"/><path d="M27 39c3 2 7 2 10 0" fill="none" stroke="#6d3028" strokeWidth="1.7"/></svg>;
  if (id === 'cow') return <svg viewBox="0 0 64 64"><path d="M16 18 8 12l2 12m38-6 8-6-2 12" stroke="#8a6b4a" strokeWidth="5" strokeLinecap="round"/><rect x="14" y="15" width="36" height="38" rx="18" fill="#f2eadc"/><path d="M19 21c6-6 11-4 13 2-5 2-8 5-9 10-5-2-7-7-4-12Zm26 16c-4-5-9-5-12-2 3 3 4 7 3 11 6 1 10-3 9-9Z" fill="#5d574f"/><ellipse cx="32" cy="43" rx="10" ry="7" fill="#dca6a0"/><circle cx="25" cy="31" r="2" fill="#343a30"/><circle cx="39" cy="31" r="2" fill="#343a30"/></svg>;
  if (id === 'croissant') return <svg viewBox="0 0 64 64"><path d="M10 36c8-18 36-22 45-2-4-4-10-6-15-3 4 3 4 8 1 12-5 7-16 8-23 3-5-4-6-8-8-10Z" fill="#d79b4e"/><path d="M24 25c-2 7-2 13 1 20m12-22c2 7 2 13-1 20" stroke="#b97937" strokeWidth="3" strokeLinecap="round"/><Face y={37}/></svg>;
  if (id === 'banana') return <svg viewBox="0 0 64 64"><path d="M13 44c15 4 30-7 34-24 6 4 8 8 7 13-3 15-20 26-36 22-5-1-8-6-5-11Z" fill="#e7c74c"/><path d="M47 20c1-5 4-8 9-9" stroke="#608144" strokeWidth="4" strokeLinecap="round"/><circle cx="31" cy="40" r="1.6" fill="#393526"/><circle cx="41" cy="36" r="1.6" fill="#393526"/></svg>;
  if (id === 'potato') return <svg viewBox="0 0 64 64"><path d="M13 35c0-15 9-25 22-24 12 1 19 10 17 24-2 14-9 20-21 20-12 0-18-7-18-20Z" fill="#b78a58"/><circle cx="23" cy="21" r="2" fill="#936b45"/><circle cx="45" cy="43" r="2" fill="#936b45"/><Face y={35}/></svg>;
  if (id === 'teapot') return <svg viewBox="0 0 64 64"><path d="M18 24h31v25c0 5-6 9-15 9s-16-4-16-9V24Z" fill="#f3eee2" stroke="#7c9bb1" strokeWidth="2"/><path d="M49 29c10-2 12 5 7 10-2 2-5 3-7 3M18 31 7 27c-2-1-3 2-1 4l12 10" fill="none" stroke="#7c9bb1" strokeWidth="3"/><path d="M25 18h17l4 6H21l4-6Z" fill="#f3eee2" stroke="#7c9bb1" strokeWidth="2"/><Face x={34} y={38}/></svg>;
  if (id === 'moka') return <svg viewBox="0 0 64 64"><path d="M23 11h19l4 13-4 8 4 21H19l4-21-4-8 4-13Z" fill="#c9ced0" stroke="#657075" strokeWidth="2"/><path d="M46 27h8v17h-9" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round"/><path d="M22 32h22" stroke="#7d8588" strokeWidth="2"/><Face x={32} y={42}/></svg>;
  if (id === 'egg') return <svg viewBox="0 0 64 64"><path d="M32 8c10 0 20 19 20 32 0 11-8 18-20 18S12 51 12 40C12 27 22 8 32 8Z" fill="#fffaf0" stroke="#d8d3c8" strokeWidth="2"/><Face y={39}/></svg>;
  return <svg viewBox="0 0 64 64"><path d="M10 34c10-15 27-19 41-8l7-7-1 15 1 15-8-7c-14 11-31 7-40-8Z" fill="#5b9fc1"/><circle cx="22" cy="30" r="2.2" fill="#253b45"/><path d="M14 38c8 5 18 5 26 1" fill="none" stroke="#347895" strokeWidth="2"/><path d="M25 13c-2-5 3-8 6-5 2-4 7-2 6 2 5-1 7 4 3 7H23c-4-1-4-4 2-4Z" fill="#fff" stroke="#ddd" strokeWidth="1"/></svg>;
}
