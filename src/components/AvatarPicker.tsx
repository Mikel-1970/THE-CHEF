import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { CHEF_AVATARS, ChefAvatar, normalizeChefAvatar } from './ChefAvatar';
export function AvatarPicker({value,onChange}:{value:string;onChange:(value:string)=>void}) {
 const panel=useRef<HTMLDetailsElement>(null);
 const current=CHEF_AVATARS.find(a=>a.id===normalizeChefAvatar(value))!;
 return <details ref={panel} className="registration-avatar-picker"><summary><ChefAvatar avatar={current.id} size={48}/><span><strong>Escoge tu avatar</strong><small>{current.label}</small></span><ChevronDown size={20}/></summary><div className="registration-avatar-grid" aria-label="Avatares disponibles">{CHEF_AVATARS.map(a=><button key={a.id} type="button" aria-label={`Elegir avatar ${a.label}`} aria-pressed={a.id===current.id} onClick={()=>{onChange(a.id);if(panel.current)panel.current.open=false}}><ChefAvatar avatar={a.id} size={64}/><span>{a.label}</span></button>)}</div></details>
}
