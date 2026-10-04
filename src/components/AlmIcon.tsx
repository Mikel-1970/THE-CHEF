import type { CSSProperties } from 'react';

export type AlmIconName =
  | 'home'|'heart'|'book'|'chef'|'pantry'|'cart'|'settings'|'help'
  | 'camera'|'play'|'clock'|'users'|'globe'|'leaf'|'tomato'|'prep'
  | 'bulb'|'warning'|'share'|'back'|'search'|'history'|'sparkles';

export function AlmIcon({name,size=24,className='',style}:{name:AlmIconName;size?:number;className?:string;style?:CSSProperties}){
  const common={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.9,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,ariaHidden:true};
  const p:Record<AlmIconName,React.ReactNode>={
    home:<><path d="M3.5 10.8 12 4l8.5 6.8"/><path d="M5.5 10v9h13v-9"/><path d="M9.5 19v-5h5v5"/></>,
    heart:<><path d="M12 20.2 4.3 12.8C.4 9.1 2.4 3.8 7.2 4.1c2 .1 3.3 1.2 4.8 3 1.5-1.8 2.8-2.9 4.8-3 4.8-.3 6.8 5 2.9 8.7L12 20.2Z"/></>,
    book:<><path d="M4 5.2c3.1-.7 5.3-.1 8 1.7v12c-2.7-1.8-4.9-2.4-8-1.7Z"/><path d="M20 5.2c-3.1-.7-5.3-.1-8 1.7v12c2.7-1.8 4.9-2.4 8-1.7Z"/></>,
    chef:<><path d="M7.3 9.2c-1.9-.4-3-1.7-2.9-3.4.1-1.8 1.6-3 3.3-2.7.8-1.5 2.6-2.2 4.3-1.4 1.7-.8 3.5-.1 4.3 1.4 1.7-.3 3.2.9 3.3 2.7.1 1.7-1 3-2.9 3.4"/><path d="M7.2 9.2h9.6v8.4H7.2z"/><path d="M8.2 20h7.6"/><path d="M10 12.5v2.5M14 12.5v2.5"/></>,
    pantry:<><rect x="5" y="6" width="14" height="13" rx="2"/><path d="M7 6h10l-1-3H8Z"/><path d="M9 10h6M9 14h6"/></>,
    cart:<><path d="M3 5h2l1.6 9.2a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.3L21 8H7"/><circle cx="10" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.8-1.8l.9-1.9-2.2-2.2-1.9.9a7 7 0 0 0-1.8-.8L10.5 2h-3l-.7 2a7 7 0 0 0-1.8.8l-1.9-.9L.9 6.1 1.8 8A7 7 0 0 0 1 9.8l-2 .7v3l2 .7a7 7 0 0 0 .8 1.8l-.9 1.9 2.2 2.2 1.9-.9a7 7 0 0 0 1.8.8l.7 2h3l.7-2a7 7 0 0 0 1.8-.8l1.9.9 2.2-2.2-.9-1.9a7 7 0 0 0 .8-1.8Z" transform="translate(3 0) scale(.75)"/></>,
    help:<><circle cx="12" cy="12" r="9"/><path d="M9.7 9.2a2.5 2.5 0 1 1 3.7 2.2c-1 .6-1.4 1.1-1.4 2.1"/><path d="M12 17h.01"/></>,
    camera:<><rect x="3" y="6.5" width="18" height="13" rx="3"/><path d="m8 6.5 1.5-2h5l1.5 2"/><circle cx="12" cy="13" r="3.2"/></>,
    play:<><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z" fill="currentColor" stroke="none"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    users:<><circle cx="9" cy="9" r="3"/><path d="M3.5 19c.4-3.5 2.4-5.3 5.5-5.3s5.1 1.8 5.5 5.3"/><circle cx="17" cy="10" r="2.3"/><path d="M15.3 14.2c2.8-.5 4.8 1 5.2 4.1"/></>,
    globe:<><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.5 2.7 3.7 5.7 3.7 9S14.5 18.3 12 21M12 3C9.5 5.7 8.3 8.7 8.3 12S9.5 18.3 12 21"/></>,
    leaf:<><path d="M4 17c8 1 13-3 16-12-9 1-14 5-16 12Z"/><path d="M6 16c3-3 6-5 10-7"/></>,
    tomato:<><circle cx="12" cy="13" r="7"/><path d="M12 6V3M12 6l-3-2M12 6l3-2"/><path d="M5.7 10.5c1.7.1 2.8-.5 3.6-1.5.8.8 1.7 1.2 2.7 1.2 1.1 0 2-.4 2.8-1.2.8 1 1.9 1.6 3.5 1.5"/></>,
    prep:<><path d="M5 8h14l-1 11H6Z"/><path d="M9 8 8 5h8l-1 3"/><path d="M10 12h4M10 15h4"/></>,
    bulb:<><path d="M9 17h6M10 20h4"/><path d="M8.4 14.5A6 6 0 1 1 15.6 14.5c-1 .8-1.6 1.5-1.6 2.5h-4c0-1-.6-1.7-1.6-2.5Z"/></>,
    warning:<><path d="M12 3 22 20H2Z"/><path d="M12 9v5M12 17h.01"/></>,
    share:<><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></>,
    back:<><path d="m15 18-6-6 6-6"/></>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>,
    history:<><path d="M4 7v5h5"/><path d="M4.8 8.1A8 8 0 1 1 5 16"/><path d="M12 7v5l3 2"/></>,
    sparkles:<><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2Z"/><path d="m18.5 14 .7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7Z"/></>
  };
  return <svg {...common} className={className} style={style} aria-hidden="true">{p[name]}</svg>;
}
