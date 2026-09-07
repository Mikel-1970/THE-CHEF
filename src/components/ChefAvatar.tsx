import { ChefHat } from 'lucide-react';
import './ChefAvatar.css';

export type ChefAvatarId = 'chef-man' | 'chef-woman' | 'tomato' | 'lemon' | 'aubergine' | 'shrimp' | 'crab' | 'cow' | 'croissant' | 'banana';

export const CHEF_AVATARS: Array<{ id: ChefAvatarId; label: string }> = [
  { id: 'chef-man', label: 'Chef' },
  { id: 'chef-woman', label: 'Chef' },
  { id: 'tomato', label: 'Tomate' },
  { id: 'lemon', label: 'Limón' },
  { id: 'aubergine', label: 'Berenjena' },
  { id: 'shrimp', label: 'Langostino' },
  { id: 'crab', label: 'Cangrejo' },
  { id: 'cow', label: 'Vaca' },
  { id: 'croissant', label: 'Cruasán' },
  { id: 'banana', label: 'Plátano' }
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

function AvatarArt({ id }: { id: ChefAvatarId }) {
  if (id === 'chef-man' || id === 'chef-woman') return (
    <svg viewBox="0 0 64 64" role="presentation">
      <circle cx="32" cy="32" r="31" fill={id === 'chef-man' ? '#dce6c8' : '#f1d7c8'} />
      <circle cx="32" cy="31" r="17" fill="#efc7a4" />
      <circle cx="26" cy="29" r="1.6" fill="#344229" /><circle cx="38" cy="29" r="1.6" fill="#344229" />
      <path d="M27 37c3 2.5 7 2.5 10 0" fill="none" stroke="#9b6046" strokeWidth="1.8" strokeLinecap="round" />
      {id === 'chef-man' ? <path d="M24 36c2 7 14 7 16 0-3 3-13 3-16 0Z" fill="#6e5b49" opacity=".85" /> : <path d="M18 30c0-12 6-18 14-18 9 0 15 7 15 18-3-7-8-11-15-11-6 0-11 4-14 11Z" fill="#705245" />}
      <path d="M18 54c4-9 10-13 14-13s10 4 14 13" fill="#405626" />
    </svg>
  );
  if (id === 'tomato') return <svg viewBox="0 0 64 64"><circle cx="32" cy="34" r="22" fill="#df654d"/><path d="M32 10l4 9 10-4-6 8 9 3-11 1-6 9-2-9-11-1 9-4-6-7 9 4 1-9Z" fill="#56783b"/></svg>;
  if (id === 'lemon') return <svg viewBox="0 0 64 64"><ellipse cx="32" cy="33" rx="23" ry="17" transform="rotate(-22 32 33)" fill="#e9c94f"/><path d="M45 13c5-4 9-3 12 0-5 1-8 4-10 8" fill="#648545"/></svg>;
  if (id === 'aubergine') return <svg viewBox="0 0 64 64"><ellipse cx="33" cy="36" rx="16" ry="24" transform="rotate(38 33 36)" fill="#735397"/><path d="M41 13c8-2 12 2 14 7-6-1-10 2-13 6-1-6-4-9-8-11 2-1 4-2 7-2Z" fill="#5f7d3f"/></svg>;
  if (id === 'shrimp') return <svg viewBox="0 0 64 64"><path d="M47 18c-15-9-31 1-31 16 0 11 9 18 19 16 8-2 13-10 10-18-2-5-7-8-12-7-4 1-7 5-6 9 1 3 4 5 7 4" fill="none" stroke="#e9845f" strokeWidth="9" strokeLinecap="round"/><circle cx="47" cy="18" r="3" fill="#35422c"/></svg>;
  if (id === 'crab') return <svg viewBox="0 0 64 64"><ellipse cx="32" cy="35" rx="18" ry="13" fill="#d96855"/><circle cx="25" cy="30" r="2" fill="#2f3929"/><circle cx="39" cy="30" r="2" fill="#2f3929"/><path d="M14 31 7 24m43 7 7-7M16 40 8 46m40-6 8 6" stroke="#d96855" strokeWidth="5" strokeLinecap="round"/><circle cx="8" cy="23" r="5" fill="#d96855"/><circle cx="56" cy="23" r="5" fill="#d96855"/></svg>;
  if (id === 'cow') return <svg viewBox="0 0 64 64"><path d="M16 18 8 12l2 12m38-6 8-6-2 12" stroke="#8a6b4a" strokeWidth="5" strokeLinecap="round"/><rect x="14" y="15" width="36" height="38" rx="18" fill="#f2eadc"/><path d="M19 21c6-6 11-4 13 2-5 2-8 5-9 10-5-2-7-7-4-12Zm26 16c-4-5-9-5-12-2 3 3 4 7 3 11 6 1 10-3 9-9Z" fill="#5d574f"/><ellipse cx="32" cy="42" rx="10" ry="7" fill="#dca6a0"/><circle cx="25" cy="31" r="2" fill="#343a30"/><circle cx="39" cy="31" r="2" fill="#343a30"/></svg>;
  if (id === 'croissant') return <svg viewBox="0 0 64 64"><path d="M10 35c8-18 36-22 45-2-4-4-10-6-15-3 4 3 4 8 1 12-5 7-16 8-23 3-5-4-6-8-8-10Z" fill="#d79b4e"/><path d="M24 24c-2 7-2 13 1 20m12-22c2 7 2 13-1 20" stroke="#b97937" strokeWidth="3" strokeLinecap="round"/></svg>;
  return <svg viewBox="0 0 64 64"><path d="M13 43c15 4 30-7 34-24 6 4 8 8 7 13-3 15-20 26-36 22-5-1-8-6-5-11Z" fill="#e7c74c"/><path d="M47 19c1-5 4-8 9-9" stroke="#608144" strokeWidth="4" strokeLinecap="round"/></svg>;
}
