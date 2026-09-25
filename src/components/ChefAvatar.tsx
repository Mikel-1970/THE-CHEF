import {BrandCrop} from './BrandMark';
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
  { id: 'shrimp', label: 'Prawny' },
  { id: 'dachshund', label: 'Voldi' },
  { id: 'tomato', label: 'Tom' },
  { id: 'chef-woman', label: 'La Chef' },
  { id: 'chef-man', label: 'El Chef' },
  { id: 'avocado', label: 'Avo' },
  { id: 'teapot', label: 'Ketty' },
  { id: 'chili', label: 'Chilly' },
  { id: 'banana', label: 'Platanito' },
  { id: 'mushroom', label: 'Champi' },
  { id: 'lemon', label: 'Citronio' },
  { id: 'crab', label: 'Centollu' },
  { id: 'moka', label: 'Cafetín' },
  { id: 'potato', label: 'Pot' },
  { id: 'cupcake', label: 'Cupcake' },
  { id: 'pan', label: 'Sartenio' }
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

export function ChefAvatar({ avatar, image, size = 64, showHat: _showHat = true, className = '' }: { avatar?: string; image?: string; size?: number; showHat?: boolean; className?: string }) {
  const id = normalizeChefAvatar(avatar);
  return (
    <span className={`chef-avatar chef-avatar-${id} ${image ? '' : 'chef-avatar-official'} ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {!image && id === 'dachshund' ? <BrandCrop part="icon"/> : <img src={image || `${import.meta.env.BASE_URL}avatars/${id}.png`} alt="" decoding="async" />}
    </span>
  );
}
