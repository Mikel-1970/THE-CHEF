export const AVATAR_NAMES: Record<string, string> = {
  shrimp: 'Prawny', dachshund: 'Voldi', tomato: 'Tom', 'chef-woman': 'La Chef', 'chef-man': 'El Chef', avocado: 'Avo', teapot: 'Ketty', chili: 'Chilly', banana: 'Platanito', mushroom: 'Champi', lemon: 'Citronio', crab: 'Centollu', moka: 'Cafetín', potato: 'Pot', cupcake: 'Cupcake', pan: 'Sartenio'
};
export function avatarName(id?: string) { return id ? (AVATAR_NAMES[id] ?? 'The Chef') : 'The Chef'; }
