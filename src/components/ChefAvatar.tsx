import { ChefHat } from 'lucide-react';
import './ChefAvatar.css';

export type ChefAvatarId =
  | 'shrimp'
  | 'dachshund'
  | 'tomato'
  | 'chef-woman'
  | 'chef-man'
  | 'avocado'
  | 'teapot'
  | 'chili'
  | 'banana'
  | 'mushroom'
  | 'lemon'
  | 'crab'
  | 'moka'
  | 'potato'
  | 'cupcake'
  | 'pan';

export const CHEF_AVATARS: Array<{ id: ChefAvatarId; label: string }> = [
  { id: 'shrimp', label: 'Langostino' },
  { id: 'dachshund', label: 'Perro' },
  { id: 'tomato', label: 'Tomate' },
  { id: 'chef-woman', label: 'Cocinera' },
  { id: 'chef-man', label: 'Cocinero' },
  { id: 'avocado', label: 'Aguacate' },
  { id: 'teapot', label: 'Tetera' },
  { id: 'chili', label: 'Pimiento picante' },
  { id: 'banana', label: 'Plátano' },
  { id: 'mushroom', label: 'Champiñón' },
  { id: 'lemon', label: 'Limón' },
  { id: 'crab', label: 'Centollo' },
  { id: 'moka', label: 'Cafetera' },
  { id: 'potato', label: 'Patata' },
  { id: 'cupcake', label: 'Magdalena' },
  { id: 'pan', label: 'Sartén' }
];

const LEGACY: Record<string, ChefAvatarId> = {
  '👨‍🍳': 'chef-man',
  '👩‍🍳': 'chef-woman',
  '🍅': 'tomato',
  '🍋': 'lemon',
  '🦐': 'shrimp',
  '🦀': 'crab',
  '🍌': 'banana',
  '🥔': 'potato',
  '🥑': 'avocado',
  '🌶️': 'chili',
  '🍄': 'mushroom',
  '🧁': 'cupcake'
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

function Face({ x = 32, y = 35 }: { x?: number; y?: number }) {
  return <><circle cx={x - 6} cy={y - 3} r="1.6" fill="#2f3825"/><circle cx={x + 6} cy={y - 3} r="1.6" fill="#2f3825"/><path d={`M${x - 5} ${y + 5}c3 3 7 3 10 0`} fill="none" stroke="#2f3825" strokeWidth="1.8" strokeLinecap="round"/></>;
}

function CorporateHat({ x = 32, y = 11 }: { x?: number; y?: number }) {
  return <g transform={`translate(${x - 14} ${y - 6})`}><path d="M4 10C0 5 5 0 10 3c2-5 10-4 11 1 5-2 9 4 5 8H4Z" fill="#fff" stroke="#d9d8d2" strokeWidth="1.2"/><path d="M5 11h21v5H5Z" rx="2" fill="#fff" stroke="#d9d8d2" strokeWidth="1.2"/><circle cx="16" cy="13.5" r="1.5" fill="#405626"/></g>;
}

function CorporateScarf({ x = 32, y = 52 }: { x?: number; y?: number }) {
  return <g><path d={`M${x - 9} ${y - 3}h18l-3 7-6 5-6-5-3-7Z`} fill="#405626"/><path d={`M${x - 3} ${y - 2}h6l2 5-5 4-5-4 2-5Z`} fill="#d6a028"/></g>;
}

function AvatarArt({ id }: { id: ChefAvatarId }) {
  if (id === 'chef-man' || id === 'chef-woman') return (
    <svg viewBox="0 0 64 64" role="presentation">
      <circle cx="32" cy="32" r="31" fill={id === 'chef-man' ? '#dce6c8' : '#f1d7c8'} />
      <CorporateHat x={32} y={11}/>
      <circle cx="32" cy="33" r="15" fill="#efc7a4" />
      <Face y={34}/>
      {id === 'chef-man'
        ? <><path d="M22 23c3-10 17-10 20 0" fill="#5c4639"/><path d="M24 39c2 7 14 7 16 0-3 3-13 3-16 0Z" fill="#6e5b49" opacity=".82" /></>
        : <path d="M18 32c0-12 6-18 14-18 9 0 15 7 15 18-3-7-8-11-15-11-6 0-11 4-14 11Z" fill="#705245" />}
      <path d="M15 64c4-15 11-22 17-22s13 7 17 22" fill="#f8f7f2" stroke="#d8d7d0" strokeWidth="1"/>
      <path d="M25 46h14v17H25Z" fill="#fff"/><CorporateScarf x={32} y={50}/>
    </svg>
  );

  if (id === 'dachshund') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#ead7bd"/><CorporateHat x={32} y={9}/><path d="M15 27c-5 5-4 18 2 24 3 3 7 1 8-3l-2-18c-1-5-5-7-8-3Zm34 0c5 5 4 18-2 24-3 3-7 1-8-3l2-18c1-5 5-7 8-3Z" fill="#4d3529"/><ellipse cx="32" cy="36" rx="16" ry="18" fill="#9b613d"/><path d="M23 24c3-6 15-6 18 0" fill="#36271f"/><circle cx="26" cy="34" r="2" fill="#241b17"/><circle cx="38" cy="34" r="2" fill="#241b17"/><ellipse cx="32" cy="41" rx="4" ry="3" fill="#201915"/><path d="M27 46c3 3 7 3 10 0" fill="none" stroke="#2b211c" strokeWidth="1.7" strokeLinecap="round"/><CorporateScarf x={32} y={51}/></svg>;

  if (id === 'shrimp') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#f7e5da"/><CorporateHat x={36} y={10}/><path d="M48 21c-15-9-31 1-31 16 0 11 9 18 19 16 8-2 13-10 10-18-2-5-7-8-12-7-4 1-7 5-6 9 1 3 4 5 7 4" fill="none" stroke="#e9845f" strokeWidth="9" strokeLinecap="round"/><circle cx="48" cy="21" r="3" fill="#35422c"/><CorporateScarf x={34} y={49}/></svg>;

  if (id === 'tomato') return <svg viewBox="0 0 64 64"><circle cx="32" cy="34" r="23" fill="#f4ded7"/><CorporateHat x={32} y={8}/><circle cx="32" cy="36" r="20" fill="#df654d"/><path d="M32 16l4 7 8-3-5 6 8 2-9 1-6 7-2-7-9-1 8-3-5-6 8 4 0-7Z" fill="#56783b"/><Face y={38}/><CorporateScarf x={32} y={50}/></svg>;

  if (id === 'avocado') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#e5ead3"/><CorporateHat x={32} y={8}/><path d="M32 16c10 0 20 19 20 31 0 9-8 14-20 14S12 56 12 47c0-12 10-31 20-31Z" fill="#4f7d3d"/><path d="M32 22c8 0 14 16 14 25 0 6-6 10-14 10s-14-4-14-10c0-9 6-25 14-25Z" fill="#a7c85f"/><circle cx="32" cy="44" r="8" fill="#92633f"/><Face y={34}/><CorporateScarf x={32} y={53}/></svg>;

  if (id === 'teapot') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#e8eef2"/><CorporateHat x={32} y={8}/><path d="M18 25h31v25c0 5-6 9-15 9s-16-4-16-9V25Z" fill="#f3eee2" stroke="#7c9bb1" strokeWidth="2"/><path d="M49 30c10-2 12 5 7 10-2 2-5 3-7 3M18 32 7 28c-2-1-3 2-1 4l12 10" fill="none" stroke="#7c9bb1" strokeWidth="3"/><path d="M25 19h17l4 6H21l4-6Z" fill="#f3eee2" stroke="#7c9bb1" strokeWidth="2"/><Face x={34} y={39}/><CorporateScarf x={34} y={52}/></svg>;

  if (id === 'chili') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#f5e1dc"/><CorporateHat x={27} y={9}/><path d="M18 24c9-5 25-1 30 9 5 11-3 20-18 23 6-7 7-13 4-18-4-7-10-9-16-14Z" fill="#d94f42"/><path d="M17 24c-1-6 3-10 9-11-2 4-1 8 2 11" fill="none" stroke="#56783b" strokeWidth="4" strokeLinecap="round"/><circle cx="30" cy="34" r="1.6" fill="#2f3825"/><circle cx="39" cy="37" r="1.6" fill="#2f3825"/><path d="M31 43c3 2 6 2 9 0" fill="none" stroke="#722f2a" strokeWidth="1.7"/><CorporateScarf x={35} y={50}/></svg>;

  if (id === 'banana') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#f5edc8"/><CorporateHat x={34} y={9}/><path d="M12 43c15 4 30-7 34-24 6 4 8 8 7 13-3 15-20 26-36 22-5-1-8-6-5-11Z" fill="#e7c74c"/><path d="M46 19c1-5 4-8 9-9" stroke="#608144" strokeWidth="4" strokeLinecap="round"/><circle cx="30" cy="40" r="1.6" fill="#393526"/><circle cx="40" cy="36" r="1.6" fill="#393526"/><CorporateScarf x={30} y={49}/></svg>;

  if (id === 'mushroom') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#eee7dc"/><CorporateHat x={32} y={8}/><path d="M13 34c2-14 11-22 19-22s17 8 19 22H13Z" fill="#a87c5d"/><path d="M23 34h18l3 21c-6 5-18 5-24 0l3-21Z" fill="#f1e5d0"/><circle cx="26" cy="43" r="1.6" fill="#2f3825"/><circle cx="38" cy="43" r="1.6" fill="#2f3825"/><path d="M27 50c3 2 7 2 10 0" fill="none" stroke="#705847" strokeWidth="1.7"/><CorporateScarf x={32} y={52}/></svg>;

  if (id === 'lemon') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#f4efc8"/><CorporateHat x={32} y={8}/><ellipse cx="32" cy="35" rx="23" ry="18" transform="rotate(-22 32 35)" fill="#e9c94f"/><path d="M45 15c5-4 9-3 12 0-5 1-8 4-10 8" fill="#648545"/><Face y={37}/><CorporateScarf x={32} y={50}/></svg>;

  if (id === 'crab') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#f4dfda"/><CorporateHat x={32} y={9}/><ellipse cx="32" cy="38" rx="18" ry="13" fill="#d96855"/><circle cx="25" cy="33" r="2" fill="#2f3929"/><circle cx="39" cy="33" r="2" fill="#2f3929"/><path d="M14 34 7 27m43 7 7-7M16 43 8 49m40-6 8 6" stroke="#d96855" strokeWidth="5" strokeLinecap="round"/><circle cx="8" cy="26" r="5" fill="#d96855"/><circle cx="56" cy="26" r="5" fill="#d96855"/><path d="M27 41c3 2 7 2 10 0" fill="none" stroke="#6d3028" strokeWidth="1.7"/><CorporateScarf x={32} y={50}/></svg>;

  if (id === 'moka') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#e3e6e7"/><CorporateHat x={30} y={8}/><path d="M23 13h19l4 13-4 8 4 21H19l4-21-4-8 4-13Z" fill="#c9ced0" stroke="#657075" strokeWidth="2"/><path d="M46 29h8v17h-9" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round"/><path d="M22 34h22" stroke="#7d8588" strokeWidth="2"/><Face x={32} y={43}/><CorporateScarf x={32} y={51}/></svg>;

  if (id === 'potato') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#eadfce"/><CorporateHat x={32} y={8}/><path d="M13 36c0-15 9-25 22-24 12 1 19 10 17 24-2 14-9 20-21 20-12 0-18-7-18-20Z" fill="#b78a58"/><circle cx="23" cy="22" r="2" fill="#936b45"/><circle cx="45" cy="44" r="2" fill="#936b45"/><Face y={37}/><CorporateScarf x={32} y={51}/></svg>;

  if (id === 'cupcake') return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#f5e2e7"/><CorporateHat x={32} y={8}/><path d="M17 36h30l-4 22H21l-4-22Z" fill="#d7a466"/><path d="M16 36c-2-8 5-12 10-9 0-7 11-8 13-2 6-3 12 3 9 11H16Z" fill="#e99bb4"/><circle cx="25" cy="31" r="2" fill="#f5d75e"/><circle cx="39" cy="29" r="2" fill="#7bb088"/><Face y={43}/><CorporateScarf x={32} y={52}/></svg>;

  return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="#e3e6e3"/><CorporateHat x={29} y={8}/><circle cx="28" cy="37" r="18" fill="#3e4748"/><circle cx="28" cy="37" r="14" fill="#555f60"/><path d="M43 38h15c4 0 4 6 0 6H43Z" fill="#3e4748"/><Face x={28} y={38}/><CorporateScarf x={28} y={50}/></svg>;
}
