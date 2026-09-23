import type { Recipe, RecipeStep } from '../domain/types';

export type CookingTipPriority='P1'|'P2'|'P3';
export type CookingTipLevel='básico'|'intermedio'|'avanzado';
export type CookingTip={
 id:string;
 code:string;
 icon:string;
 title:string;
 category:string;
 primaryType:string;
 secondaryType:string;
 priority:CookingTipPriority;
 text:string;
 shortTip:string;
 explanation:string;
 whyItWorks:string;
 appliesTo:string[];
 techniques:string[];
 useMoment:string[];
 level:CookingTipLevel;
 commonError:string;
 sensorySignal:string;
 chefQuickTip:string;
 tags:string[];
 source?:string;
 triggers:{
  ingredients:string[];
  techniques:string[];
  actions:string[];
  equipment:string[];
  situations:string[];
 };
};

// Biblioteca editorial v2: 150 fichas estructuradas y preparadas para selección contextual.
export const cookingTips:CookingTip[] = [
  {
    "id": "tip-v2-001",
    "code": "TIP-001",
    "icon": "🧭",
    "title": "Lee la receta completa",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Lee toda la receta antes de empezar y localiza tiempos, reposos y puntos críticos.",
    "shortTip": "Lee toda la receta antes de empezar y localiza tiempos, reposos y puntos críticos.",
    "explanation": "Antes de sacar ingredientes, recorre la receta de principio a fin. Identifica pasos que ocurren en paralelo, tiempos de reposo, precalentados y técnicas que exigen atención inmediata.",
    "whyItWorks": "Anticipar dependencias evita interrupciones y permite coordinar mejor temperatura, tiempos y utensilios.",
    "appliesTo": [
      "cualquier receta"
    ],
    "techniques": [
      "mise en place",
      "organizar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Empezar sin detectar un reposo o precalentado importante.",
    "sensorySignal": "La secuencia de trabajo queda clara antes de encender el fuego.",
    "chefQuickTip": "Primero entiende; después cocina.",
    "tags": [
      "cualquier receta",
      "mise en place",
      "organizar",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [],
      "techniques": [
        "mise en place",
        "organizar"
      ],
      "actions": [
        "mise en place",
        "organizar"
      ],
      "equipment": [
        "temporizador"
      ],
      "situations": [
        "Empezar sin detectar un reposo o precalentado importante."
      ]
    }
  },
  {
    "id": "tip-v2-002",
    "code": "TIP-002",
    "icon": "🧭",
    "title": "Agrupa por elaboraciones",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Separa ingredientes por salsa, guarnición, masa o elaboración antes de cocinar.",
    "shortTip": "Separa ingredientes por salsa, guarnición, masa o elaboración antes de cocinar.",
    "explanation": "Coloca juntos los ingredientes que pertenecen a cada parte del plato. Si una receta tiene salsa, guarnición y elemento principal, prepara tres grupos diferenciados.",
    "whyItWorks": "Reduce errores de dosificación y hace más fácil seguir recetas con varias preparaciones simultáneas.",
    "appliesTo": [
      "recetas con varias elaboraciones"
    ],
    "techniques": [
      "mise en place",
      "organizar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Usar un ingrediente en la elaboración equivocada.",
    "sensorySignal": "Cada grupo de ingredientes corresponde visualmente a una elaboración.",
    "chefQuickTip": "Una elaboración, un grupo.",
    "tags": [
      "recetas con varias elaboraciones",
      "mise en place",
      "organizar",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [],
      "techniques": [
        "mise en place",
        "organizar"
      ],
      "actions": [
        "mise en place",
        "organizar"
      ],
      "equipment": [
        "boles"
      ],
      "situations": [
        "Usar un ingrediente en la elaboración equivocada."
      ]
    }
  },
  {
    "id": "tip-v2-003",
    "code": "TIP-003",
    "icon": "🧭",
    "title": "Pesa antes de empezar",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Pesa primero los ingredientes sensibles a proporción, especialmente en masas, salsas y repostería.",
    "shortTip": "Pesa primero los ingredientes sensibles a proporción, especialmente en masas, salsas y repostería.",
    "explanation": "Deja medidos los ingredientes cuyo exceso o defecto puede cambiar la textura. En preparaciones flexibles puedes reservar ajustes finales, pero en masas, emulsiones o espesados conviene partir de cantidades controladas.",
    "whyItWorks": "Las proporciones determinan hidratación, emulsión, estructura y espesor.",
    "appliesTo": [
      "harinas",
      "líquidos",
      "grasas",
      "espesantes"
    ],
    "techniques": [
      "pesar",
      "mise en place"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Corregir tarde una proporción desequilibrada.",
    "sensorySignal": "Los ingredientes críticos están listos y medidos antes de mezclarlos.",
    "chefQuickTip": "Lo sensible, pesado primero.",
    "tags": [
      "harinas",
      "líquidos",
      "grasas",
      "pesar",
      "mise en place",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "harinas",
        "líquidos",
        "grasas",
        "espesantes"
      ],
      "techniques": [
        "pesar",
        "mise en place"
      ],
      "actions": [
        "pesar",
        "mise en place"
      ],
      "equipment": [
        "báscula"
      ],
      "situations": [
        "Corregir tarde una proporción desequilibrada."
      ]
    }
  },
  {
    "id": "tip-v2-004",
    "code": "TIP-004",
    "icon": "🧭",
    "title": "Precalienta con propósito",
    "category": "Preparación, organización y mise en place",
    "primaryType": "temperatura",
    "secondaryType": "organización",
    "priority": "P2",
    "text": "Precalienta horno, sartén o plancha solo cuando la receta realmente lo necesite.",
    "shortTip": "Precalienta horno, sartén o plancha solo cuando la receta realmente lo necesite.",
    "explanation": "Pon a calentar el equipo con la antelación suficiente para que alcance una temperatura estable justo cuando vayas a usarlo. Evita precalentar demasiado pronto si solo supone consumo innecesario.",
    "whyItWorks": "Una superficie o cámara estable hace más reproducible la cocción inicial.",
    "appliesTo": [
      "asados",
      "salteados",
      "panes",
      "repostería"
    ],
    "techniques": [
      "precalentar",
      "hornear",
      "saltear"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Introducir alimentos en un equipo aún frío.",
    "sensorySignal": "El equipo alcanza la temperatura objetivo antes de recibir el alimento.",
    "chefQuickTip": "Calor listo, alimento después.",
    "tags": [
      "asados",
      "salteados",
      "panes",
      "precalentar",
      "hornear",
      "saltear",
      "temperatura",
      "organización"
    ],
    "triggers": {
      "ingredients": [
        "asados",
        "salteados",
        "panes",
        "repostería"
      ],
      "techniques": [
        "precalentar",
        "hornear",
        "saltear"
      ],
      "actions": [
        "precalentar",
        "hornear",
        "saltear"
      ],
      "equipment": [
        "horno",
        "sartén",
        "plancha"
      ],
      "situations": [
        "Introducir alimentos en un equipo aún frío."
      ]
    }
  },
  {
    "id": "tip-v2-005",
    "code": "TIP-005",
    "icon": "🧭",
    "title": "Ten un bol de descarte",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "aprovechamiento",
    "priority": "P2",
    "text": "Usa un recipiente pequeño para pieles, recortes y residuos mientras preparas.",
    "shortTip": "Usa un recipiente pequeño para pieles, recortes y residuos mientras preparas.",
    "explanation": "Coloca junto a la tabla un bol para restos que no vayas a utilizar. Separa, cuando proceda, los recortes aprovechables de los residuos reales.",
    "whyItWorks": "Mantiene la superficie despejada y reduce desplazamientos, cruces y distracciones durante la preparación.",
    "appliesTo": [
      "verduras",
      "frutas",
      "carnes",
      "pescados"
    ],
    "techniques": [
      "mise en place",
      "limpiar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Acumular residuos en la tabla y perder espacio de trabajo.",
    "sensorySignal": "La tabla permanece libre y ordenada.",
    "chefQuickTip": "Tabla limpia, trabajo fluido.",
    "tags": [
      "verduras",
      "frutas",
      "carnes",
      "mise en place",
      "limpiar",
      "organización",
      "aprovechamiento"
    ],
    "triggers": {
      "ingredients": [
        "verduras",
        "frutas",
        "carnes",
        "pescados"
      ],
      "techniques": [
        "mise en place",
        "limpiar"
      ],
      "actions": [
        "mise en place",
        "limpiar"
      ],
      "equipment": [
        "tabla",
        "bol"
      ],
      "situations": [
        "Acumular residuos en la tabla y perder espacio de trabajo."
      ]
    }
  },
  {
    "id": "tip-v2-006",
    "code": "TIP-006",
    "icon": "🧭",
    "title": "Ordena por tiempo de cocción",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Corta y reserva los ingredientes según el orden en que entrarán en la receta.",
    "shortTip": "Corta y reserva los ingredientes según el orden en que entrarán en la receta.",
    "explanation": "Agrupa primero los ingredientes de cocción larga y después los que necesitan menos tiempo. En salteados y guisos, este orden simplifica la incorporación progresiva.",
    "whyItWorks": "Cada alimento recibe el tiempo que necesita sin obligar a retirar o sobrecocer otros componentes.",
    "appliesTo": [
      "verduras",
      "carnes",
      "guisos",
      "salteados"
    ],
    "techniques": [
      "mise en place",
      "saltear",
      "guisar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Añadir todo a la vez y obtener puntos de cocción desiguales.",
    "sensorySignal": "Los ingredientes llegan al punto al mismo tiempo.",
    "chefQuickTip": "Ordena por minutos, no por aspecto.",
    "tags": [
      "verduras",
      "carnes",
      "guisos",
      "mise en place",
      "saltear",
      "guisar",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "verduras",
        "carnes",
        "guisos",
        "salteados"
      ],
      "techniques": [
        "mise en place",
        "saltear",
        "guisar"
      ],
      "actions": [
        "mise en place",
        "saltear",
        "guisar"
      ],
      "equipment": [
        "tabla",
        "boles"
      ],
      "situations": [
        "Añadir todo a la vez y obtener puntos de cocción desiguales."
      ]
    }
  },
  {
    "id": "tip-v2-007",
    "code": "TIP-007",
    "icon": "🧭",
    "title": "Reserva antes de rectificar",
    "category": "Preparación, organización y mise en place",
    "primaryType": "sabor",
    "secondaryType": "organización",
    "priority": "P2",
    "text": "Guarda una pequeña parte sin ajustar cuando vayas a añadir sal, picante o ácido intensos.",
    "shortTip": "Guarda una pequeña parte sin ajustar cuando vayas a añadir sal, picante o ácido intensos.",
    "explanation": "Si un condimento puede dominar el plato, reserva una pequeña porción o añade en etapas. Así podrás comparar y corregir antes de comprometer toda la preparación.",
    "whyItWorks": "Los sabores intensos son fáciles de añadir y difíciles de retirar una vez incorporados.",
    "appliesTo": [
      "salsas",
      "guisos",
      "cremas",
      "aliños"
    ],
    "techniques": [
      "condimentar",
      "mezclar"
    ],
    "useMoment": [
      "durante la cocción",
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Pasarse de sal, picante o acidez en un único ajuste.",
    "sensorySignal": "El sabor mejora por etapas sin saltos bruscos.",
    "chefQuickTip": "Intenso: siempre poco a poco.",
    "tags": [
      "salsas",
      "guisos",
      "cremas",
      "condimentar",
      "mezclar",
      "sabor",
      "organización"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "guisos",
        "cremas",
        "aliños"
      ],
      "techniques": [
        "condimentar",
        "mezclar"
      ],
      "actions": [
        "condimentar",
        "mezclar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Pasarse de sal, picante o acidez en un único ajuste."
      ]
    }
  },
  {
    "id": "tip-v2-008",
    "code": "TIP-008",
    "icon": "🧭",
    "title": "Usa recipientes del tamaño justo",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Elige boles, cazuelas y fuentes proporcionales al volumen real de la preparación.",
    "shortTip": "Elige boles, cazuelas y fuentes proporcionales al volumen real de la preparación.",
    "explanation": "Evita recipientes diminutos que dificultan mezclar y recipientes enormes que dispersan demasiado el calor o la salsa. Deja margen para remover sin derramar.",
    "whyItWorks": "El tamaño del recipiente modifica evaporación, profundidad, facilidad de mezcla y transferencia de calor.",
    "appliesTo": [
      "salsas",
      "guisos",
      "masas",
      "asados"
    ],
    "techniques": [
      "mezclar",
      "reducir",
      "asar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Derramar, reducir demasiado rápido o mezclar mal.",
    "sensorySignal": "Puedes remover con comodidad y la preparación ocupa una proporción razonable del recipiente.",
    "chefQuickTip": "Recipiente justo, control mejor.",
    "tags": [
      "salsas",
      "guisos",
      "masas",
      "mezclar",
      "reducir",
      "asar",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "guisos",
        "masas",
        "asados"
      ],
      "techniques": [
        "mezclar",
        "reducir",
        "asar"
      ],
      "actions": [
        "mezclar",
        "reducir",
        "asar"
      ],
      "equipment": [
        "bol",
        "cazuela",
        "fuente"
      ],
      "situations": [
        "Derramar, reducir demasiado rápido o mezclar mal."
      ]
    }
  },
  {
    "id": "tip-v2-009",
    "code": "TIP-009",
    "icon": "🧭",
    "title": "Prepara utensilios críticos",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Ten a mano pinzas, espátula, colador o termómetro antes de iniciar un paso rápido.",
    "shortTip": "Ten a mano pinzas, espátula, colador o termómetro antes de iniciar un paso rápido.",
    "explanation": "En elaboraciones que cambian en segundos, prepara el utensilio que necesitarás para girar, colar, emulsionar o medir. No esperes al último momento para buscarlo.",
    "whyItWorks": "Evita que el alimento siga cocinándose mientras abandonas el puesto de trabajo.",
    "appliesTo": [
      "frituras",
      "salteados",
      "salsas",
      "caramelo"
    ],
    "techniques": [
      "mise en place",
      "freír",
      "saltear"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Perder el punto por buscar un utensilio.",
    "sensorySignal": "Puedes completar el paso sin abandonar el fuego.",
    "chefQuickTip": "Utensilio listo antes del momento crítico.",
    "tags": [
      "frituras",
      "salteados",
      "salsas",
      "mise en place",
      "freír",
      "saltear",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "frituras",
        "salteados",
        "salsas",
        "caramelo"
      ],
      "techniques": [
        "mise en place",
        "freír",
        "saltear"
      ],
      "actions": [
        "mise en place",
        "freír",
        "saltear"
      ],
      "equipment": [
        "pinzas",
        "espátula",
        "colador",
        "termómetro"
      ],
      "situations": [
        "Perder el punto por buscar un utensilio."
      ]
    }
  },
  {
    "id": "tip-v2-010",
    "code": "TIP-010",
    "icon": "🧭",
    "title": "Limpia mientras esperas",
    "category": "Preparación, organización y mise en place",
    "primaryType": "organización",
    "secondaryType": "seguridad",
    "priority": "P3",
    "text": "Aprovecha reposos y cocciones pasivas para ordenar y limpiar sin descuidar el fuego.",
    "shortTip": "Aprovecha reposos y cocciones pasivas para ordenar y limpiar sin descuidar el fuego.",
    "explanation": "Cuando una elaboración tenga minutos de espera real, recoge utensilios ya usados y despeja la encimera. No lo hagas durante un paso que exige vigilancia continua.",
    "whyItWorks": "Una cocina ordenada reduce cruces, contaminación y errores en las etapas finales.",
    "appliesTo": [
      "cualquier receta"
    ],
    "techniques": [
      "organizar",
      "limpiar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Llegar al emplatado con una superficie saturada.",
    "sensorySignal": "La zona de trabajo queda despejada antes del final.",
    "chefQuickTip": "Espera útil, cocina limpia.",
    "tags": [
      "cualquier receta",
      "organizar",
      "limpiar",
      "organización",
      "seguridad"
    ],
    "triggers": {
      "ingredients": [],
      "techniques": [
        "organizar",
        "limpiar"
      ],
      "actions": [
        "organizar",
        "limpiar"
      ],
      "equipment": [
        "fregadero"
      ],
      "situations": [
        "Llegar al emplatado con una superficie saturada."
      ]
    }
  },
  {
    "id": "tip-v2-011",
    "code": "TIP-011",
    "icon": "🔪",
    "title": "Afila antes de cortar",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "seguridad",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Un cuchillo afilado requiere menos fuerza y ofrece más control.",
    "shortTip": "Un cuchillo afilado requiere menos fuerza y ofrece más control.",
    "explanation": "Comprueba el filo antes de una sesión de corte. Si el cuchillo aplasta tomate, resbala sobre cebolla o exige presión excesiva, afílalo o utiliza uno en mejores condiciones.",
    "whyItWorks": "Un filo eficiente entra en el alimento con menor fuerza y disminuye movimientos bruscos.",
    "appliesTo": [
      "verduras",
      "frutas",
      "carnes",
      "pescados"
    ],
    "techniques": [
      "cortar",
      "picar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Forzar un cuchillo romo y perder control.",
    "sensorySignal": "El cuchillo corta con presión moderada y trayectoria estable.",
    "chefQuickTip": "Menos fuerza, más control.",
    "tags": [
      "verduras",
      "frutas",
      "carnes",
      "cortar",
      "picar",
      "seguridad",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "verduras",
        "frutas",
        "carnes",
        "pescados"
      ],
      "techniques": [
        "cortar",
        "picar"
      ],
      "actions": [
        "cortar",
        "picar"
      ],
      "equipment": [
        "cuchillo",
        "afilador"
      ],
      "situations": [
        "Forzar un cuchillo romo y perder control."
      ]
    }
  },
  {
    "id": "tip-v2-012",
    "code": "TIP-012",
    "icon": "🔪",
    "title": "Estabiliza la tabla",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "seguridad",
    "secondaryType": "organización",
    "priority": "P1",
    "text": "Coloca un paño húmedo o base antideslizante bajo la tabla.",
    "shortTip": "Coloca un paño húmedo o base antideslizante bajo la tabla.",
    "explanation": "Antes de cortar, comprueba que la tabla no se desplaza. Una base ligeramente húmeda o antideslizante evita movimientos inesperados.",
    "whyItWorks": "La fricción adicional mantiene fija la superficie y permite aplicar fuerza con mayor seguridad.",
    "appliesTo": [
      "cualquier corte"
    ],
    "techniques": [
      "cortar",
      "picar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Que la tabla se mueva mientras cortas.",
    "sensorySignal": "La tabla permanece inmóvil al empujarla lateralmente.",
    "chefQuickTip": "Tabla quieta, corte seguro.",
    "tags": [
      "cualquier corte",
      "cortar",
      "picar",
      "seguridad",
      "organización"
    ],
    "triggers": {
      "ingredients": [],
      "techniques": [
        "cortar",
        "picar"
      ],
      "actions": [
        "cortar",
        "picar"
      ],
      "equipment": [
        "tabla",
        "paño"
      ],
      "situations": [
        "Que la tabla se mueva mientras cortas."
      ]
    }
  },
  {
    "id": "tip-v2-013",
    "code": "TIP-013",
    "icon": "🔪",
    "title": "Forma una base plana",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "seguridad",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Crea una cara plana en alimentos redondos antes de cortarlos.",
    "shortTip": "Crea una cara plana en alimentos redondos antes de cortarlos.",
    "explanation": "En cebollas, patatas, calabacines o frutas redondas, realiza primero un corte que permita apoyar el alimento de forma estable. Continúa el resto de cortes desde esa base.",
    "whyItWorks": "Una superficie plana reduce el balanceo y mejora precisión y seguridad.",
    "appliesTo": [
      "cebolla",
      "patata",
      "calabacín",
      "frutas"
    ],
    "techniques": [
      "cortar",
      "picar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Cortar piezas que ruedan sobre la tabla.",
    "sensorySignal": "El alimento queda estable sin sujetarlo con fuerza excesiva.",
    "chefQuickTip": "Primero estabilidad, después velocidad.",
    "tags": [
      "cebolla",
      "patata",
      "calabacín",
      "cortar",
      "picar",
      "seguridad",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "cebolla",
        "patata",
        "calabacín",
        "frutas"
      ],
      "techniques": [
        "cortar",
        "picar"
      ],
      "actions": [
        "cortar",
        "picar"
      ],
      "equipment": [
        "cuchillo",
        "tabla"
      ],
      "situations": [
        "Cortar piezas que ruedan sobre la tabla."
      ]
    }
  },
  {
    "id": "tip-v2-014",
    "code": "TIP-014",
    "icon": "🔪",
    "title": "Iguala el tamaño de corte",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Corta piezas destinadas a cocinarse juntas con tamaño parecido.",
    "shortTip": "Corta piezas destinadas a cocinarse juntas con tamaño parecido.",
    "explanation": "No hace falta precisión milimétrica, pero sí suficiente regularidad para que todas las piezas alcancen un punto similar. Ajusta el corte a la técnica: más pequeño para cocción rápida, mayor para cocciones largas.",
    "whyItWorks": "Piezas semejantes tienen una relación superficie-volumen parecida y se cocinan a ritmos similares.",
    "appliesTo": [
      "verduras",
      "carnes",
      "patatas"
    ],
    "techniques": [
      "cortar",
      "brunoise",
      "juliana"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Mezclar piezas crudas y sobrecocidas en el mismo plato.",
    "sensorySignal": "Las piezas presentan tamaño y grosor visualmente homogéneos.",
    "chefQuickTip": "Mismo tamaño, mismo punto.",
    "tags": [
      "verduras",
      "carnes",
      "patatas",
      "cortar",
      "brunoise",
      "juliana",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "verduras",
        "carnes",
        "patatas"
      ],
      "techniques": [
        "cortar",
        "brunoise",
        "juliana"
      ],
      "actions": [
        "cortar",
        "brunoise",
        "juliana"
      ],
      "equipment": [
        "cuchillo",
        "tabla"
      ],
      "situations": [
        "Mezclar piezas crudas y sobrecocidas en el mismo plato."
      ]
    }
  },
  {
    "id": "tip-v2-015",
    "code": "TIP-015",
    "icon": "🔪",
    "title": "Corta contra la fibra",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "En piezas de carne, corta transversalmente a la dirección principal de las fibras.",
    "shortTip": "En piezas de carne, corta transversalmente a la dirección principal de las fibras.",
    "explanation": "Observa las líneas musculares de la pieza cocinada y realiza el corte aproximadamente perpendicular a ellas. Es especialmente útil en cortes con fibras largas.",
    "whyItWorks": "Acortar las fibras reduce la resistencia al masticar y mejora la percepción de terneza.",
    "appliesTo": [
      "vacuno",
      "cerdo",
      "aves"
    ],
    "techniques": [
      "cortar",
      "trinchar"
    ],
    "useMoment": [
      "antes de servir"
    ],
    "level": "intermedio",
    "commonError": "Servir carne aparentemente dura por un corte paralelo a la fibra.",
    "sensorySignal": "Las fibras quedan cortas en la superficie de cada loncha.",
    "chefQuickTip": "Fibra larga, corte cruzado.",
    "tags": [
      "vacuno",
      "cerdo",
      "aves",
      "cortar",
      "trinchar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "vacuno",
        "cerdo",
        "aves"
      ],
      "techniques": [
        "cortar",
        "trinchar"
      ],
      "actions": [
        "cortar",
        "trinchar"
      ],
      "equipment": [
        "cuchillo"
      ],
      "situations": [
        "Servir carne aparentemente dura por un corte paralelo a la fibra."
      ]
    }
  },
  {
    "id": "tip-v2-016",
    "code": "TIP-016",
    "icon": "🔪",
    "title": "Usa garra con los dedos",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "seguridad",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Recoge las yemas y guía el cuchillo con los nudillos de la mano que sujeta.",
    "shortTip": "Recoge las yemas y guía el cuchillo con los nudillos de la mano que sujeta.",
    "explanation": "Mantén las yemas ligeramente hacia dentro y utiliza los nudillos como referencia lateral para la hoja. Practica despacio antes de aumentar ritmo.",
    "whyItWorks": "Aleja las yemas de la trayectoria de corte y crea una guía estable.",
    "appliesTo": [
      "verduras",
      "hierbas"
    ],
    "techniques": [
      "cortar",
      "picar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Exponer las yemas delante del filo.",
    "sensorySignal": "Los nudillos guían la hoja y las yemas quedan retrasadas.",
    "chefQuickTip": "Yemas dentro, nudillos delante.",
    "tags": [
      "verduras",
      "hierbas",
      "cortar",
      "picar",
      "seguridad",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "verduras",
        "hierbas"
      ],
      "techniques": [
        "cortar",
        "picar"
      ],
      "actions": [
        "cortar",
        "picar"
      ],
      "equipment": [
        "cuchillo",
        "tabla"
      ],
      "situations": [
        "Exponer las yemas delante del filo."
      ]
    }
  },
  {
    "id": "tip-v2-017",
    "code": "TIP-017",
    "icon": "🔪",
    "title": "No serruches las hierbas",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "técnica",
    "secondaryType": "sabor",
    "priority": "P2",
    "text": "Pica hierbas tiernas con cortes limpios y pocas pasadas.",
    "shortTip": "Pica hierbas tiernas con cortes limpios y pocas pasadas.",
    "explanation": "Agrupa las hojas sin aplastarlas y corta con una hoja afilada. Evita repasar muchas veces el mismo montón hasta convertirlo en una pasta.",
    "whyItWorks": "El exceso de presión rompe más células, libera humedad y acelera oscurecimiento y pérdida aromática.",
    "appliesTo": [
      "perejil",
      "cilantro",
      "albahaca",
      "cebollino"
    ],
    "techniques": [
      "picar",
      "cortar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Hierbas machacadas, húmedas y ennegrecidas.",
    "sensorySignal": "Los bordes quedan definidos y las hojas mantienen color vivo.",
    "chefQuickTip": "Corta; no machaques.",
    "tags": [
      "perejil",
      "cilantro",
      "albahaca",
      "picar",
      "cortar",
      "técnica",
      "sabor"
    ],
    "triggers": {
      "ingredients": [
        "perejil",
        "cilantro",
        "albahaca",
        "cebollino"
      ],
      "techniques": [
        "picar",
        "cortar"
      ],
      "actions": [
        "picar",
        "cortar"
      ],
      "equipment": [
        "cuchillo",
        "tabla"
      ],
      "situations": [
        "Hierbas machacadas, húmedas y ennegrecidas."
      ]
    }
  },
  {
    "id": "tip-v2-018",
    "code": "TIP-018",
    "icon": "🔪",
    "title": "Usa cuchillo adecuado",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "técnica",
    "secondaryType": "seguridad",
    "priority": "P3",
    "text": "Elige la hoja según la tarea: chef para picar, puntilla para detalle, sierra para panes.",
    "shortTip": "Elige la hoja según la tarea: chef para picar, puntilla para detalle, sierra para panes.",
    "explanation": "No fuerces una misma herramienta para todos los trabajos. Una hoja adecuada mejora apoyo, recorrido y precisión sin exigir posiciones incómodas.",
    "whyItWorks": "La geometría del cuchillo está diseñada para tipos de corte diferentes.",
    "appliesTo": [
      "pan",
      "verduras",
      "frutas",
      "carnes"
    ],
    "techniques": [
      "cortar",
      "picar",
      "rebanar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Resbalar o aplastar por usar una hoja inadecuada.",
    "sensorySignal": "El corte se realiza con un movimiento natural y controlado.",
    "chefQuickTip": "La hoja correcta hace media tarea.",
    "tags": [
      "pan",
      "verduras",
      "frutas",
      "cortar",
      "picar",
      "rebanar",
      "técnica",
      "seguridad"
    ],
    "triggers": {
      "ingredients": [
        "pan",
        "verduras",
        "frutas",
        "carnes"
      ],
      "techniques": [
        "cortar",
        "picar",
        "rebanar"
      ],
      "actions": [
        "cortar",
        "picar",
        "rebanar"
      ],
      "equipment": [
        "cuchillo de chef",
        "puntilla",
        "cuchillo de sierra"
      ],
      "situations": [
        "Resbalar o aplastar por usar una hoja inadecuada."
      ]
    }
  },
  {
    "id": "tip-v2-019",
    "code": "TIP-019",
    "icon": "🔪",
    "title": "Seca lo que vayas a sujetar",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "seguridad",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Seca alimentos resbaladizos antes de cortarlos o manipularlos.",
    "shortTip": "Seca alimentos resbaladizos antes de cortarlos o manipularlos.",
    "explanation": "Retira humedad superficial de pescado, carne, frutas peladas o verduras muy mojadas antes de sujetarlas con la mano o apoyarlas en la tabla.",
    "whyItWorks": "Menos agua entre mano, alimento y tabla aumenta la fricción y mejora el control.",
    "appliesTo": [
      "pescado",
      "carne",
      "verduras",
      "frutas"
    ],
    "techniques": [
      "cortar",
      "filetear"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Que el alimento resbale al aplicar el cuchillo.",
    "sensorySignal": "La pieza queda firme al sujetarla sin exceso de presión.",
    "chefQuickTip": "Seco se controla mejor.",
    "tags": [
      "pescado",
      "carne",
      "verduras",
      "cortar",
      "filetear",
      "seguridad",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pescado",
        "carne",
        "verduras",
        "frutas"
      ],
      "techniques": [
        "cortar",
        "filetear"
      ],
      "actions": [
        "cortar",
        "filetear"
      ],
      "equipment": [
        "papel de cocina",
        "tabla"
      ],
      "situations": [
        "Que el alimento resbale al aplicar el cuchillo."
      ]
    }
  },
  {
    "id": "tip-v2-020",
    "code": "TIP-020",
    "icon": "🔪",
    "title": "Deja reposar antes de trinchar",
    "category": "Cuchillos, cortes y manipulación",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Espera unos minutos antes de cortar piezas grandes recién cocinadas.",
    "shortTip": "Espera unos minutos antes de cortar piezas grandes recién cocinadas.",
    "explanation": "Retira la pieza del calor y déjala reposar un tiempo proporcional a su tamaño antes de trinchar. Evita cubrirla herméticamente si quieres conservar una superficie crujiente.",
    "whyItWorks": "Durante el reposo se estabilizan gradientes de temperatura y presión interna, reduciendo la salida inmediata de jugos.",
    "appliesTo": [
      "asados",
      "aves",
      "piezas grandes de carne"
    ],
    "techniques": [
      "asar",
      "trinchar"
    ],
    "useMoment": [
      "final de cocción",
      "antes de servir"
    ],
    "level": "intermedio",
    "commonError": "Perder gran cantidad de jugos al cortar inmediatamente.",
    "sensorySignal": "Al cortar, sale menos líquido y la carne mantiene mejor humedad.",
    "chefQuickTip": "Reposo antes del cuchillo.",
    "tags": [
      "asados",
      "aves",
      "piezas grandes de carne",
      "asar",
      "trinchar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "asados",
        "aves",
        "piezas grandes de carne"
      ],
      "techniques": [
        "asar",
        "trinchar"
      ],
      "actions": [
        "asar",
        "trinchar"
      ],
      "equipment": [
        "cuchillo",
        "tabla"
      ],
      "situations": [
        "Perder gran cantidad de jugos al cortar inmediatamente."
      ]
    }
  },
  {
    "id": "tip-v2-021",
    "code": "TIP-021",
    "icon": "🔥",
    "title": "Seca antes de dorar",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Seca la superficie si buscas un dorado intenso.",
    "shortTip": "Seca la superficie si buscas un dorado intenso.",
    "explanation": "Antes de cocinar carne, pescado, setas o determinadas verduras a alta temperatura, elimina el exceso de humedad superficial con papel de cocina. Después introdúcelos en una superficie ya caliente.",
    "whyItWorks": "El agua debe evaporarse antes de que la superficie alcance temperaturas de dorado; demasiada humedad favorece vapor.",
    "appliesTo": [
      "carne",
      "pescado",
      "marisco",
      "verduras",
      "setas"
    ],
    "techniques": [
      "marcar",
      "saltear",
      "dorar",
      "asar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Que el alimento cueza al vapor en lugar de dorarse.",
    "sensorySignal": "La superficie toma color con rapidez y se forma costra.",
    "chefQuickTip": "Seco por fuera, mejor dorado.",
    "tags": [
      "carne",
      "pescado",
      "marisco",
      "marcar",
      "saltear",
      "dorar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "carne",
        "pescado",
        "marisco",
        "verduras",
        "setas"
      ],
      "techniques": [
        "marcar",
        "saltear",
        "dorar",
        "asar"
      ],
      "actions": [
        "marcar",
        "saltear",
        "dorar",
        "asar"
      ],
      "equipment": [
        "sartén",
        "plancha"
      ],
      "situations": [
        "alta temperatura",
        "búsqueda de dorado"
      ]
    }
  },
  {
    "id": "tip-v2-022",
    "code": "TIP-022",
    "icon": "🔥",
    "title": "No satures la sartén",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Deja espacio entre piezas cuando busques dorado.",
    "shortTip": "Deja espacio entre piezas cuando busques dorado.",
    "explanation": "Si la sartén queda cubierta por completo, cocina en tandas. Mantén espacio suficiente para que el vapor escape y la superficie recupere temperatura.",
    "whyItWorks": "Demasiado alimento enfría la sartén y aumenta la humedad ambiental, reduciendo el dorado.",
    "appliesTo": [
      "carne",
      "verduras",
      "setas",
      "marisco"
    ],
    "techniques": [
      "saltear",
      "dorar",
      "marcar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Obtener alimentos pálidos y húmedos.",
    "sensorySignal": "Oyes un chisporroteo estable y las piezas se doran sin acumular agua.",
    "chefQuickTip": "Espacio para dorar.",
    "tags": [
      "carne",
      "verduras",
      "setas",
      "saltear",
      "dorar",
      "marcar",
      "temperatura",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "carne",
        "verduras",
        "setas",
        "marisco"
      ],
      "techniques": [
        "saltear",
        "dorar",
        "marcar"
      ],
      "actions": [
        "saltear",
        "dorar",
        "marcar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Obtener alimentos pálidos y húmedos."
      ]
    }
  },
  {
    "id": "tip-v2-023",
    "code": "TIP-023",
    "icon": "🔥",
    "title": "Calienta antes de añadir",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Precalienta la sartén antes de incorporar alimentos que deben marcarse o saltearse.",
    "shortTip": "Precalienta la sartén antes de incorporar alimentos que deben marcarse o saltearse.",
    "explanation": "Deja que la superficie alcance una temperatura estable. Añade la grasa cuando corresponda y después el alimento, evitando largos minutos de humo.",
    "whyItWorks": "Una superficie caliente inicia rápidamente evaporación y dorado y reduce el tiempo en la zona de adherencia.",
    "appliesTo": [
      "carne",
      "pescado",
      "verduras",
      "huevos"
    ],
    "techniques": [
      "saltear",
      "marcar",
      "plancha"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "básico",
    "commonError": "Empezar en frío y obtener cocción desigual o pegado.",
    "sensorySignal": "Al añadir el alimento aparece un chisporroteo claro, no violento.",
    "chefQuickTip": "Sartén lista antes del alimento.",
    "tags": [
      "carne",
      "pescado",
      "verduras",
      "saltear",
      "marcar",
      "plancha",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "carne",
        "pescado",
        "verduras",
        "huevos"
      ],
      "techniques": [
        "saltear",
        "marcar",
        "plancha"
      ],
      "actions": [
        "saltear",
        "marcar",
        "plancha"
      ],
      "equipment": [
        "sartén",
        "plancha"
      ],
      "situations": [
        "Empezar en frío y obtener cocción desigual o pegado."
      ]
    }
  },
  {
    "id": "tip-v2-024",
    "code": "TIP-024",
    "icon": "🔥",
    "title": "Ajusta el fuego durante la receta",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "No mantengas la misma potencia desde el principio hasta el final.",
    "shortTip": "No mantengas la misma potencia desde el principio hasta el final.",
    "explanation": "Usa fuego alto para arrancar cuando interese dorar, medio para controlar cocción y bajo para mantener o terminar preparaciones delicadas. Ajusta según lo que ves, no solo según el reloj.",
    "whyItWorks": "La necesidad de energía cambia a medida que el alimento pierde agua, se calienta o espesa.",
    "appliesTo": [
      "salsas",
      "guisos",
      "carnes",
      "verduras"
    ],
    "techniques": [
      "saltear",
      "reducir",
      "guisar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Quemar el exterior o prolongar innecesariamente la cocción.",
    "sensorySignal": "La cocción mantiene el ritmo deseado sin humos ni ebullición excesiva.",
    "chefQuickTip": "El fuego también se cocina.",
    "tags": [
      "salsas",
      "guisos",
      "carnes",
      "saltear",
      "reducir",
      "guisar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "guisos",
        "carnes",
        "verduras"
      ],
      "techniques": [
        "saltear",
        "reducir",
        "guisar"
      ],
      "actions": [
        "saltear",
        "reducir",
        "guisar"
      ],
      "equipment": [
        "fogón",
        "sartén",
        "cazuela"
      ],
      "situations": [
        "Quemar el exterior o prolongar innecesariamente la cocción."
      ]
    }
  },
  {
    "id": "tip-v2-025",
    "code": "TIP-025",
    "icon": "🔥",
    "title": "Escucha el chisporroteo",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "técnica",
    "secondaryType": "temperatura",
    "priority": "P2",
    "text": "Usa el sonido como indicador del equilibrio entre calor y humedad.",
    "shortTip": "Usa el sonido como indicador del equilibrio entre calor y humedad.",
    "explanation": "Un chisporroteo vivo y regular suele indicar buena evaporación en un salteado. Si desaparece, quizá cayó la temperatura; si se vuelve agresivo y aparece humo, puede haber exceso de calor.",
    "whyItWorks": "El sonido refleja la velocidad de evaporación del agua y el comportamiento de la grasa.",
    "appliesTo": [
      "salteados",
      "frituras",
      "plancha"
    ],
    "techniques": [
      "saltear",
      "freír",
      "marcar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Cocinar solo por tiempo sin reaccionar a cambios de temperatura.",
    "sensorySignal": "El sonido es estable y acorde con la técnica.",
    "chefQuickTip": "Escucha la sartén.",
    "tags": [
      "salteados",
      "frituras",
      "plancha",
      "saltear",
      "freír",
      "marcar",
      "técnica",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "salteados",
        "frituras",
        "plancha"
      ],
      "techniques": [
        "saltear",
        "freír",
        "marcar"
      ],
      "actions": [
        "saltear",
        "freír",
        "marcar"
      ],
      "equipment": [
        "sartén",
        "freidora"
      ],
      "situations": [
        "Cocinar solo por tiempo sin reaccionar a cambios de temperatura."
      ]
    }
  },
  {
    "id": "tip-v2-026",
    "code": "TIP-026",
    "icon": "🔥",
    "title": "No gires demasiado pronto",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Espera a que se forme costra antes de intentar despegar una pieza marcada.",
    "shortTip": "Espera a que se forme costra antes de intentar despegar una pieza marcada.",
    "explanation": "Cuando una carne, pescado o vegetal está desarrollando costra, evita moverlo continuamente. Prueba a girar cuando se despegue con menos resistencia.",
    "whyItWorks": "A medida que la superficie se dora y pierde humedad, suele reducirse la adherencia inicial.",
    "appliesTo": [
      "carne",
      "pescado",
      "verduras"
    ],
    "techniques": [
      "marcar",
      "plancha",
      "dorar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Romper la pieza o perder la costra por moverla antes de tiempo.",
    "sensorySignal": "La pieza se libera con facilidad al introducir la espátula.",
    "chefQuickTip": "Dale tiempo a despegarse.",
    "tags": [
      "carne",
      "pescado",
      "verduras",
      "marcar",
      "plancha",
      "dorar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "carne",
        "pescado",
        "verduras"
      ],
      "techniques": [
        "marcar",
        "plancha",
        "dorar"
      ],
      "actions": [
        "marcar",
        "plancha",
        "dorar"
      ],
      "equipment": [
        "sartén",
        "espátula"
      ],
      "situations": [
        "Romper la pieza o perder la costra por moverla antes de tiempo."
      ]
    }
  },
  {
    "id": "tip-v2-027",
    "code": "TIP-027",
    "icon": "🔥",
    "title": "Controla el humo del aceite",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "seguridad",
    "priority": "P2",
    "text": "Si el aceite humea de forma persistente, baja el fuego o cambia de grasa.",
    "shortTip": "Si el aceite humea de forma persistente, baja el fuego o cambia de grasa.",
    "explanation": "Una ligera señal puntual puede aparecer al trabajar fuerte, pero humo continuo indica temperatura excesiva para esa grasa. Retira del fuego unos segundos si hace falta.",
    "whyItWorks": "El sobrecalentamiento degrada grasas y puede aportar sabores desagradables.",
    "appliesTo": [
      "salteados",
      "frituras",
      "plancha"
    ],
    "techniques": [
      "freír",
      "saltear",
      "marcar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Trabajar con grasa degradada y sabor quemado.",
    "sensorySignal": "El aceite está fluido y brillante sin humo persistente.",
    "chefQuickTip": "Caliente sí; quemado no.",
    "tags": [
      "salteados",
      "frituras",
      "plancha",
      "freír",
      "saltear",
      "marcar",
      "temperatura",
      "seguridad"
    ],
    "triggers": {
      "ingredients": [
        "salteados",
        "frituras",
        "plancha"
      ],
      "techniques": [
        "freír",
        "saltear",
        "marcar"
      ],
      "actions": [
        "freír",
        "saltear",
        "marcar"
      ],
      "equipment": [
        "sartén",
        "freidora"
      ],
      "situations": [
        "Trabajar con grasa degradada y sabor quemado."
      ]
    }
  },
  {
    "id": "tip-v2-028",
    "code": "TIP-028",
    "icon": "🔥",
    "title": "Usa calor residual",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Retira del fuego un poco antes cuando el alimento siga cocinándose con su propio calor.",
    "shortTip": "Retira del fuego un poco antes cuando el alimento siga cocinándose con su propio calor.",
    "explanation": "En huevos, pescados, carnes finas y salsas delicadas, ten en cuenta que la temperatura no cae a cero al apagar el fuego. Termina unos instantes antes si buscas un punto preciso.",
    "whyItWorks": "La energía acumulada en alimento y recipiente continúa transfiriéndose tras retirar la fuente de calor.",
    "appliesTo": [
      "huevos",
      "pescado",
      "carnes",
      "salsas"
    ],
    "techniques": [
      "cuajar",
      "plancha",
      "reducir"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Pasarse de punto después de apagar.",
    "sensorySignal": "La textura termina de asentarse fuera del fuego.",
    "chefQuickTip": "Apaga antes del exceso.",
    "tags": [
      "huevos",
      "pescado",
      "carnes",
      "cuajar",
      "plancha",
      "reducir",
      "temperatura",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "huevos",
        "pescado",
        "carnes",
        "salsas"
      ],
      "techniques": [
        "cuajar",
        "plancha",
        "reducir"
      ],
      "actions": [
        "cuajar",
        "plancha",
        "reducir"
      ],
      "equipment": [
        "sartén",
        "cazuela"
      ],
      "situations": [
        "Pasarse de punto después de apagar."
      ]
    }
  },
  {
    "id": "tip-v2-029",
    "code": "TIP-029",
    "icon": "🔥",
    "title": "Reduce con recipiente ancho",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "técnica",
    "secondaryType": "temperatura",
    "priority": "P2",
    "text": "Usa una superficie amplia cuando quieras evaporar líquido con rapidez.",
    "shortTip": "Usa una superficie amplia cuando quieras evaporar líquido con rapidez.",
    "explanation": "Para concentrar una salsa o caldo, una sartén o cazuela ancha acelera la evaporación. Si necesitas conservar líquido, elige un recipiente más estrecho o tapa parcialmente.",
    "whyItWorks": "Una mayor superficie expuesta facilita la salida de vapor.",
    "appliesTo": [
      "salsas",
      "fondos",
      "jugos"
    ],
    "techniques": [
      "reducir"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Tardar demasiado en reducir o concentrar en exceso.",
    "sensorySignal": "El volumen baja de forma regular y la salsa gana cuerpo.",
    "chefQuickTip": "Más superficie, más reducción.",
    "tags": [
      "salsas",
      "fondos",
      "jugos",
      "reducir",
      "técnica",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "fondos",
        "jugos"
      ],
      "techniques": [
        "reducir"
      ],
      "actions": [
        "reducir"
      ],
      "equipment": [
        "sartén",
        "cazuela"
      ],
      "situations": [
        "Tardar demasiado en reducir o concentrar en exceso."
      ]
    }
  },
  {
    "id": "tip-v2-030",
    "code": "TIP-030",
    "icon": "🔥",
    "title": "Tapa para conservar humedad",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Tapa cuando quieras limitar evaporación; destapa cuando necesites concentrar.",
    "shortTip": "Tapa cuando quieras limitar evaporación; destapa cuando necesites concentrar.",
    "explanation": "Usa la tapa como herramienta de control. En guisos, tapar conserva agua y calor; al final, destapar permite reducir y concentrar.",
    "whyItWorks": "La tapa retiene vapor y disminuye la pérdida de humedad al ambiente.",
    "appliesTo": [
      "guisos",
      "arroces",
      "verduras"
    ],
    "techniques": [
      "guisar",
      "hervir",
      "reducir"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Tener una salsa aguada o, al contrario, quedarse sin líquido.",
    "sensorySignal": "La cantidad de líquido evoluciona según el objetivo.",
    "chefQuickTip": "Tapa conserva; destapa concentra.",
    "tags": [
      "guisos",
      "arroces",
      "verduras",
      "guisar",
      "hervir",
      "reducir",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "guisos",
        "arroces",
        "verduras"
      ],
      "techniques": [
        "guisar",
        "hervir",
        "reducir"
      ],
      "actions": [
        "guisar",
        "hervir",
        "reducir"
      ],
      "equipment": [
        "cazuela",
        "tapa"
      ],
      "situations": [
        "Tener una salsa aguada o, al contrario, quedarse sin líquido."
      ]
    }
  },
  {
    "id": "tip-v2-031",
    "code": "TIP-031",
    "icon": "🔥",
    "title": "Hierve suave los fondos",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Mantén fondos y caldos en hervor moderado, no violento.",
    "shortTip": "Mantén fondos y caldos en hervor moderado, no violento.",
    "explanation": "Después de alcanzar temperatura, reduce la potencia para mantener movimiento suave. Evita una ebullición agresiva durante largos periodos.",
    "whyItWorks": "La agitación intensa emulsiona grasas e impurezas en el líquido y puede enturbiar el resultado.",
    "appliesTo": [
      "caldos",
      "fondos"
    ],
    "techniques": [
      "hervir",
      "cocer"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Caldo turbio y sabores más bastos.",
    "sensorySignal": "Pequeñas burbujas suben de forma regular sin borbotones fuertes.",
    "chefQuickTip": "Fondo tranquilo, sabor limpio.",
    "tags": [
      "caldos",
      "fondos",
      "hervir",
      "cocer",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "caldos",
        "fondos"
      ],
      "techniques": [
        "hervir",
        "cocer"
      ],
      "actions": [
        "hervir",
        "cocer"
      ],
      "equipment": [
        "olla"
      ],
      "situations": [
        "Caldo turbio y sabores más bastos."
      ]
    }
  },
  {
    "id": "tip-v2-032",
    "code": "TIP-032",
    "icon": "🔥",
    "title": "Deja recuperar temperatura",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Entre tandas, espera a que sartén, plancha o aceite recuperen calor.",
    "shortTip": "Entre tandas, espera a que sartén, plancha o aceite recuperen calor.",
    "explanation": "Después de retirar una tanda, elimina restos quemados si los hay y concede unos instantes al recipiente antes de cargarlo de nuevo.",
    "whyItWorks": "Cada tanda absorbe energía; empezar la siguiente demasiado pronto reduce la temperatura de trabajo.",
    "appliesTo": [
      "frituras",
      "salteados",
      "carnes"
    ],
    "techniques": [
      "freír",
      "saltear",
      "marcar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Que la primera tanda dore y las siguientes queden blandas.",
    "sensorySignal": "La segunda tanda produce un sonido y dorado similares a la primera.",
    "chefQuickTip": "Cada tanda necesita su calor.",
    "tags": [
      "frituras",
      "salteados",
      "carnes",
      "freír",
      "saltear",
      "marcar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "frituras",
        "salteados",
        "carnes"
      ],
      "techniques": [
        "freír",
        "saltear",
        "marcar"
      ],
      "actions": [
        "freír",
        "saltear",
        "marcar"
      ],
      "equipment": [
        "sartén",
        "freidora"
      ],
      "situations": [
        "Que la primera tanda dore y las siguientes queden blandas."
      ]
    }
  },
  {
    "id": "tip-v2-033",
    "code": "TIP-033",
    "icon": "🔥",
    "title": "Mide cuando el punto importa",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Usa termómetro cuando una cocción precisa sea más fiable que estimar a ojo.",
    "shortTip": "Usa termómetro cuando una cocción precisa sea más fiable que estimar a ojo.",
    "explanation": "En piezas gruesas, asados, azúcar, aceite o preparaciones sensibles, la temperatura interna o del medio puede darte una referencia más reproducible que el tiempo por sí solo.",
    "whyItWorks": "El tiempo varía con tamaño, potencia y material; la temperatura describe mejor el estado térmico real.",
    "appliesTo": [
      "asados",
      "caramelo",
      "frituras",
      "pan"
    ],
    "techniques": [
      "asar",
      "freír",
      "cocer"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Confiar en minutos fijos pese a tamaños o equipos distintos.",
    "sensorySignal": "La lectura térmica coincide con el punto buscado en la receta.",
    "chefQuickTip": "Cuando importa, mide.",
    "tags": [
      "asados",
      "caramelo",
      "frituras",
      "asar",
      "freír",
      "cocer",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "asados",
        "caramelo",
        "frituras",
        "pan"
      ],
      "techniques": [
        "asar",
        "freír",
        "cocer"
      ],
      "actions": [
        "asar",
        "freír",
        "cocer"
      ],
      "equipment": [
        "termómetro"
      ],
      "situations": [
        "Confiar en minutos fijos pese a tamaños o equipos distintos."
      ]
    }
  },
  {
    "id": "tip-v2-034",
    "code": "TIP-034",
    "icon": "🔥",
    "title": "Desglasa antes de que se queme",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Añade líquido cuando el fondo está dorado, no negro.",
    "shortTip": "Añade líquido cuando el fondo está dorado, no negro.",
    "explanation": "Tras marcar carne o verduras, retira el exceso de grasa si procede y añade vino, caldo o agua para disolver los jugos adheridos mientras aún son aromáticos.",
    "whyItWorks": "Los compuestos dorados aportan sabor; si se carbonizan, predominan notas amargas.",
    "appliesTo": [
      "carnes",
      "verduras",
      "salsas"
    ],
    "techniques": [
      "desglasar",
      "reducir"
    ],
    "useMoment": [
      "durante la cocción",
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Incorporar restos quemados a una salsa.",
    "sensorySignal": "El fondo está marrón dorado y se disuelve al añadir líquido.",
    "chefQuickTip": "Dorado se aprovecha; negro se descarta.",
    "tags": [
      "carnes",
      "verduras",
      "salsas",
      "desglasar",
      "reducir",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "carnes",
        "verduras",
        "salsas"
      ],
      "techniques": [
        "desglasar",
        "reducir"
      ],
      "actions": [
        "desglasar",
        "reducir"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Incorporar restos quemados a una salsa."
      ]
    }
  },
  {
    "id": "tip-v2-035",
    "code": "TIP-035",
    "icon": "🔥",
    "title": "Evita choques innecesarios",
    "category": "Fuego, temperatura y control de cocción",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "No enfríes una cocción intensa añadiendo grandes cantidades de líquido frío sin motivo.",
    "shortTip": "No enfríes una cocción intensa añadiendo grandes cantidades de líquido frío sin motivo.",
    "explanation": "Cuando necesites mantener hervor o sellado, incorpora líquidos templados o en cantidades controladas. En otras recetas, un choque térmico puede ser deliberado; sigue el objetivo concreto.",
    "whyItWorks": "Una adición fría reduce la temperatura del sistema y puede detener temporalmente la cocción.",
    "appliesTo": [
      "guisos",
      "salsas",
      "arroces"
    ],
    "techniques": [
      "guisar",
      "reducir",
      "hervir"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Perder ritmo de cocción y alargar tiempos de forma innecesaria.",
    "sensorySignal": "La preparación recupera el hervor rápidamente tras la adición.",
    "chefQuickTip": "No enfríes sin querer.",
    "tags": [
      "guisos",
      "salsas",
      "arroces",
      "guisar",
      "reducir",
      "hervir",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "guisos",
        "salsas",
        "arroces"
      ],
      "techniques": [
        "guisar",
        "reducir",
        "hervir"
      ],
      "actions": [
        "guisar",
        "reducir",
        "hervir"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Perder ritmo de cocción y alargar tiempos de forma innecesaria."
      ]
    }
  },
  {
    "id": "tip-v2-036",
    "code": "TIP-036",
    "icon": "🥩",
    "title": "Templa piezas gruesas con criterio",
    "category": "Carnes",
    "primaryType": "temperatura",
    "secondaryType": "seguridad",
    "priority": "P3",
    "text": "Evita cocinar una pieza muy gruesa directamente desde un frío extremo si buscas cocción uniforme.",
    "shortTip": "Evita cocinar una pieza muy gruesa directamente desde un frío extremo si buscas cocción uniforme.",
    "explanation": "Saca del frigorífico la pieza solo el tiempo razonable de preparación y puesta a punto; no la dejes olvidada a temperatura ambiente. Seca y cocina según el método elegido.",
    "whyItWorks": "Reducir el gradiente térmico extremo puede ayudar a una cocción más homogénea, pero la seguridad alimentaria sigue siendo prioritaria.",
    "appliesTo": [
      "vacuno",
      "cerdo",
      "cordero"
    ],
    "techniques": [
      "asar",
      "plancha",
      "marcar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "intermedio",
    "commonError": "Exterior muy hecho con centro aún demasiado frío.",
    "sensorySignal": "La pieza entra al fuego sin estar helada en superficie.",
    "chefQuickTip": "Templar no es abandonar.",
    "tags": [
      "vacuno",
      "cerdo",
      "cordero",
      "asar",
      "plancha",
      "marcar",
      "temperatura",
      "seguridad"
    ],
    "triggers": {
      "ingredients": [
        "vacuno",
        "cerdo",
        "cordero"
      ],
      "techniques": [
        "asar",
        "plancha",
        "marcar"
      ],
      "actions": [
        "asar",
        "plancha",
        "marcar"
      ],
      "equipment": [
        "rejilla"
      ],
      "situations": [
        "Exterior muy hecho con centro aún demasiado frío."
      ]
    }
  },
  {
    "id": "tip-v2-037",
    "code": "TIP-037",
    "icon": "🥩",
    "title": "Sala según el método",
    "category": "Carnes",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Adapta el momento de salar a la pieza y la técnica, evitando reglas absolutas.",
    "shortTip": "Adapta el momento de salar a la pieza y la técnica, evitando reglas absolutas.",
    "explanation": "En carnes secas para plancha puedes salar justo antes o con antelación controlada. En guisos, sazona por etapas y ajusta al final.",
    "whyItWorks": "La sal modifica sabor y movimiento de agua con el tiempo; su efecto depende de grosor, duración y método.",
    "appliesTo": [
      "vacuno",
      "cerdo",
      "aves",
      "cordero"
    ],
    "techniques": [
      "sazonar",
      "asar",
      "guisar"
    ],
    "useMoment": [
      "antes de cocinar",
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Aplicar una regla única de salado a cualquier carne.",
    "sensorySignal": "El sabor está integrado sin superficie excesivamente húmeda.",
    "chefQuickTip": "Sal con método, no por dogma.",
    "tags": [
      "vacuno",
      "cerdo",
      "aves",
      "sazonar",
      "asar",
      "guisar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "vacuno",
        "cerdo",
        "aves",
        "cordero"
      ],
      "techniques": [
        "sazonar",
        "asar",
        "guisar"
      ],
      "actions": [
        "sazonar",
        "asar",
        "guisar"
      ],
      "equipment": [
        "sartén",
        "cazuela"
      ],
      "situations": [
        "Aplicar una regla única de salado a cualquier carne."
      ]
    }
  },
  {
    "id": "tip-v2-038",
    "code": "TIP-038",
    "icon": "🥩",
    "title": "Marca sin aplastar",
    "category": "Carnes",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "No presiones hamburguesas, filetes o piezas a la plancha salvo que la técnica lo requiera.",
    "shortTip": "No presiones hamburguesas, filetes o piezas a la plancha salvo que la técnica lo requiera.",
    "explanation": "Deja que la carne contacte con la superficie por su propio peso. Presionar de forma repetida no acelera un buen dorado y puede expulsar jugos.",
    "whyItWorks": "La presión mecánica fuerza la salida de líquido y grasa hacia la superficie caliente.",
    "appliesTo": [
      "hamburguesa",
      "filete",
      "pollo"
    ],
    "techniques": [
      "marcar",
      "plancha"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Perder jugos por apretar continuamente.",
    "sensorySignal": "La carne dora mientras mantiene volumen y humedad.",
    "chefQuickTip": "Dora, no exprimas.",
    "tags": [
      "hamburguesa",
      "filete",
      "pollo",
      "marcar",
      "plancha",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "hamburguesa",
        "filete",
        "pollo"
      ],
      "techniques": [
        "marcar",
        "plancha"
      ],
      "actions": [
        "marcar",
        "plancha"
      ],
      "equipment": [
        "espátula",
        "plancha"
      ],
      "situations": [
        "Perder jugos por apretar continuamente."
      ]
    }
  },
  {
    "id": "tip-v2-039",
    "code": "TIP-039",
    "icon": "🥩",
    "title": "Dora antes de guisar",
    "category": "Carnes",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Cuando la receta busque profundidad, dora la carne en tandas antes de añadir líquido.",
    "shortTip": "Cuando la receta busque profundidad, dora la carne en tandas antes de añadir líquido.",
    "explanation": "Seca la carne, marca pequeñas tandas y reserva. Desglasa el fondo antes de continuar con verduras o líquido.",
    "whyItWorks": "El dorado genera compuestos aromáticos distintos de los de una cocción húmeda directa.",
    "appliesTo": [
      "ternera",
      "cerdo",
      "cordero"
    ],
    "techniques": [
      "dorar",
      "guisar",
      "desglasar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Guiso correcto pero con sabor plano.",
    "sensorySignal": "La carne presenta zonas doradas y el fondo conserva jugos caramelizados.",
    "chefQuickTip": "Primero color, luego guiso.",
    "tags": [
      "ternera",
      "cerdo",
      "cordero",
      "dorar",
      "guisar",
      "desglasar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "ternera",
        "cerdo",
        "cordero"
      ],
      "techniques": [
        "dorar",
        "guisar",
        "desglasar"
      ],
      "actions": [
        "dorar",
        "guisar",
        "desglasar"
      ],
      "equipment": [
        "cazuela",
        "sartén"
      ],
      "situations": [
        "Guiso correcto pero con sabor plano."
      ]
    }
  },
  {
    "id": "tip-v2-040",
    "code": "TIP-040",
    "icon": "🥩",
    "title": "Retira tendones duros visibles",
    "category": "Carnes",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Limpia membranas y tendones gruesos que no vayan a ablandarse con la técnica elegida.",
    "shortTip": "Limpia membranas y tendones gruesos que no vayan a ablandarse con la técnica elegida.",
    "explanation": "En piezas de cocción rápida, elimina tejido conectivo superficial muy resistente. En guisos largos, algunos tejidos ricos en colágeno pueden conservarse porque se transforman durante la cocción.",
    "whyItWorks": "El tejido conectivo responde de forma distinta al calor según tiempo y humedad.",
    "appliesTo": [
      "vacuno",
      "cerdo",
      "aves"
    ],
    "techniques": [
      "limpiar",
      "cortar",
      "guisar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Masticación dura en una pieza de cocción rápida.",
    "sensorySignal": "La superficie queda limpia de membranas gruesas no deseadas.",
    "chefQuickTip": "Limpia según la cocción.",
    "tags": [
      "vacuno",
      "cerdo",
      "aves",
      "limpiar",
      "cortar",
      "guisar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "vacuno",
        "cerdo",
        "aves"
      ],
      "techniques": [
        "limpiar",
        "cortar",
        "guisar"
      ],
      "actions": [
        "limpiar",
        "cortar",
        "guisar"
      ],
      "equipment": [
        "cuchillo",
        "tabla"
      ],
      "situations": [
        "Masticación dura en una pieza de cocción rápida."
      ]
    }
  },
  {
    "id": "tip-v2-041",
    "code": "TIP-041",
    "icon": "🥩",
    "title": "Cocina piezas similares juntas",
    "category": "Carnes",
    "primaryType": "técnica",
    "secondaryType": "temperatura",
    "priority": "P2",
    "text": "Agrupa trozos de carne con grosor parecido en la misma tanda.",
    "shortTip": "Agrupa trozos de carne con grosor parecido en la misma tanda.",
    "explanation": "Si una bandeja contiene piezas muy desiguales, separa por tamaño o retira las pequeñas antes. En brochetas, intenta mantener cubos de grosor similar.",
    "whyItWorks": "El grosor determina el tiempo que tarda el calor en alcanzar el centro.",
    "appliesTo": [
      "pollo",
      "cerdo",
      "vacuno"
    ],
    "techniques": [
      "asar",
      "saltear",
      "brocheta"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Piezas secas junto a otras aún crudas.",
    "sensorySignal": "Los trozos alcanzan un punto parecido al mismo tiempo.",
    "chefQuickTip": "Grosor parecido, cocción pareja.",
    "tags": [
      "pollo",
      "cerdo",
      "vacuno",
      "asar",
      "saltear",
      "brocheta",
      "técnica",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "pollo",
        "cerdo",
        "vacuno"
      ],
      "techniques": [
        "asar",
        "saltear",
        "brocheta"
      ],
      "actions": [
        "asar",
        "saltear",
        "brocheta"
      ],
      "equipment": [
        "bandeja",
        "sartén"
      ],
      "situations": [
        "Piezas secas junto a otras aún crudas."
      ]
    }
  },
  {
    "id": "tip-v2-042",
    "code": "TIP-042",
    "icon": "🥩",
    "title": "Usa reposo sin ablandar la costra",
    "category": "Carnes",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Deja reposar la carne sobre rejilla o superficie que no atrape demasiado vapor.",
    "shortTip": "Deja reposar la carne sobre rejilla o superficie que no atrape demasiado vapor.",
    "explanation": "Después de marcar o asar, evita encerrar inmediatamente la pieza bajo una cobertura hermética si quieres conservar la costra. Puedes cubrir de forma ligera cuando convenga conservar calor.",
    "whyItWorks": "El vapor condensado humedece la superficie y reblandece el dorado.",
    "appliesTo": [
      "filetes",
      "asados",
      "chuletas"
    ],
    "techniques": [
      "marcar",
      "asar",
      "reposar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Perder una costra crujiente durante el reposo.",
    "sensorySignal": "La superficie sigue seca y dorada al servir.",
    "chefQuickTip": "Reposo sí, sauna no.",
    "tags": [
      "filetes",
      "asados",
      "chuletas",
      "marcar",
      "asar",
      "reposar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "filetes",
        "asados",
        "chuletas"
      ],
      "techniques": [
        "marcar",
        "asar",
        "reposar"
      ],
      "actions": [
        "marcar",
        "asar",
        "reposar"
      ],
      "equipment": [
        "rejilla"
      ],
      "situations": [
        "Perder una costra crujiente durante el reposo."
      ]
    }
  },
  {
    "id": "tip-v2-043",
    "code": "TIP-043",
    "icon": "🥩",
    "title": "Lacados al final",
    "category": "Carnes",
    "primaryType": "sabor",
    "secondaryType": "temperatura",
    "priority": "P2",
    "text": "Aplica salsas dulces o glaseados con azúcar en la fase final de calor fuerte.",
    "shortTip": "Aplica salsas dulces o glaseados con azúcar en la fase final de calor fuerte.",
    "explanation": "Si una salsa contiene miel, azúcar o componentes muy concentrados, úsala cerca del final o con temperatura controlada. Haz varias capas finas si buscas brillo.",
    "whyItWorks": "Los azúcares se caramelizan y después se queman antes que la carne complete una cocción larga.",
    "appliesTo": [
      "costillas",
      "pollo",
      "cerdo"
    ],
    "techniques": [
      "glasear",
      "asar",
      "lacado"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Salsa negra y amarga antes de que la carne esté lista.",
    "sensorySignal": "El glaseado queda brillante y oscuro sin olor quemado.",
    "chefQuickTip": "Dulce fuerte, tarde.",
    "tags": [
      "costillas",
      "pollo",
      "cerdo",
      "glasear",
      "asar",
      "lacado",
      "sabor",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "costillas",
        "pollo",
        "cerdo"
      ],
      "techniques": [
        "glasear",
        "asar",
        "lacado"
      ],
      "actions": [
        "glasear",
        "asar",
        "lacado"
      ],
      "equipment": [
        "horno",
        "parrilla"
      ],
      "situations": [
        "Salsa negra y amarga antes de que la carne esté lista."
      ]
    }
  },
  {
    "id": "tip-v2-044",
    "code": "TIP-044",
    "icon": "🥩",
    "title": "Pica carne muy fría",
    "category": "Carnes",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Mantén carne y utensilios fríos al picar para hamburguesas o rellenos.",
    "shortTip": "Mantén carne y utensilios fríos al picar para hamburguesas o rellenos.",
    "explanation": "Trabaja la carne fría y evita manipularla durante demasiado tiempo. Si se calienta, vuelve a enfriar antes de continuar.",
    "whyItWorks": "La grasa firme se distribuye mejor y se unta menos, ayudando a una textura más definida.",
    "appliesTo": [
      "carne picada",
      "hamburguesa",
      "rellenos"
    ],
    "techniques": [
      "picar",
      "mezclar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Masa pastosa y grasa untada.",
    "sensorySignal": "La mezcla mantiene partículas visibles y no se vuelve pegajosa en exceso.",
    "chefQuickTip": "Frío para picar, calor para cocinar.",
    "tags": [
      "carne picada",
      "hamburguesa",
      "rellenos",
      "picar",
      "mezclar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "carne picada",
        "hamburguesa",
        "rellenos"
      ],
      "techniques": [
        "picar",
        "mezclar"
      ],
      "actions": [
        "picar",
        "mezclar"
      ],
      "equipment": [
        "picadora",
        "bol"
      ],
      "situations": [
        "Masa pastosa y grasa untada."
      ]
    }
  },
  {
    "id": "tip-v2-045",
    "code": "TIP-045",
    "icon": "🥩",
    "title": "Mezcla hamburguesa lo justo",
    "category": "Carnes",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Une carne picada y condimentos sin amasar de forma prolongada.",
    "shortTip": "Une carne picada y condimentos sin amasar de forma prolongada.",
    "explanation": "Mezcla hasta repartir el sazonado y formar la pieza. No trabajes la carne como si fuera una masa de pan.",
    "whyItWorks": "El exceso de manipulación compacta proteínas y puede producir una textura más densa.",
    "appliesTo": [
      "hamburguesa",
      "albóndigas"
    ],
    "techniques": [
      "mezclar",
      "formar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Hamburguesas compactas y gomosas.",
    "sensorySignal": "La mezcla se mantiene suelta y se forma sin convertirse en pasta.",
    "chefQuickTip": "Une, no amases.",
    "tags": [
      "hamburguesa",
      "albóndigas",
      "mezclar",
      "formar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "hamburguesa",
        "albóndigas"
      ],
      "techniques": [
        "mezclar",
        "formar"
      ],
      "actions": [
        "mezclar",
        "formar"
      ],
      "equipment": [
        "bol"
      ],
      "situations": [
        "Hamburguesas compactas y gomosas."
      ]
    }
  },
  {
    "id": "tip-v2-046",
    "code": "TIP-046",
    "icon": "🥩",
    "title": "Sella roulades y rellenos",
    "category": "Carnes",
    "primaryType": "técnica",
    "secondaryType": "presentación",
    "priority": "P3",
    "text": "Coloca primero la unión o cierre contra la sartén cuando una pieza rellena pueda abrirse.",
    "shortTip": "Coloca primero la unión o cierre contra la sartén cuando una pieza rellena pueda abrirse.",
    "explanation": "En rollos de carne, aves rellenas o piezas enrolladas, empieza por el lado de cierre siempre que la técnica lo permita. Usa hilo o pinchos si hace falta.",
    "whyItWorks": "El calor inicial fija proteínas de la superficie y ayuda a mantener la forma.",
    "appliesTo": [
      "rollos de carne",
      "aves rellenas"
    ],
    "techniques": [
      "marcar",
      "rellenar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Que el relleno se salga al girar.",
    "sensorySignal": "El cierre queda fijado antes de manipular la pieza.",
    "chefQuickTip": "Primero fija el cierre.",
    "tags": [
      "rollos de carne",
      "aves rellenas",
      "marcar",
      "rellenar",
      "técnica",
      "presentación"
    ],
    "triggers": {
      "ingredients": [
        "rollos de carne",
        "aves rellenas"
      ],
      "techniques": [
        "marcar",
        "rellenar"
      ],
      "actions": [
        "marcar",
        "rellenar"
      ],
      "equipment": [
        "sartén",
        "hilo de cocina"
      ],
      "situations": [
        "Que el relleno se salga al girar."
      ]
    }
  },
  {
    "id": "tip-v2-047",
    "code": "TIP-047",
    "icon": "🥩",
    "title": "Aprovecha el fondo de asado",
    "category": "Carnes",
    "primaryType": "sabor",
    "secondaryType": "aprovechamiento",
    "priority": "P1",
    "text": "Convierte los jugos dorados de la bandeja en salsa.",
    "shortTip": "Convierte los jugos dorados de la bandeja en salsa.",
    "explanation": "Retira exceso de grasa, añade un líquido adecuado y desprende los restos dorados. Reduce y ajusta el sabor antes de servir.",
    "whyItWorks": "El fondo concentra proteínas, azúcares y jugos caramelizados con gran intensidad aromática.",
    "appliesTo": [
      "asados",
      "aves",
      "cerdo",
      "vacuno"
    ],
    "techniques": [
      "desglasar",
      "reducir"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Desechar la parte más sabrosa del asado.",
    "sensorySignal": "Los restos dorados se disuelven y forman una salsa brillante.",
    "chefQuickTip": "El fondo también es ingrediente.",
    "tags": [
      "asados",
      "aves",
      "cerdo",
      "desglasar",
      "reducir",
      "sabor",
      "aprovechamiento"
    ],
    "triggers": {
      "ingredients": [
        "asados",
        "aves",
        "cerdo",
        "vacuno"
      ],
      "techniques": [
        "desglasar",
        "reducir"
      ],
      "actions": [
        "desglasar",
        "reducir"
      ],
      "equipment": [
        "bandeja",
        "cazo"
      ],
      "situations": [
        "Desechar la parte más sabrosa del asado."
      ]
    }
  },
  {
    "id": "tip-v2-048",
    "code": "TIP-048",
    "icon": "🥩",
    "title": "Corta pechuga transversalmente",
    "category": "Carnes",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "En pechugas y filetes, corta las porciones finales cruzando la fibra.",
    "shortTip": "En pechugas y filetes, corta las porciones finales cruzando la fibra.",
    "explanation": "Una vez reposada la carne, observa la dirección de las fibras y corta lonchas contra ella, especialmente en pechugas grandes o cortes planos.",
    "whyItWorks": "Acortar las fibras mejora la percepción de terneza sin cambiar el punto de cocción.",
    "appliesTo": [
      "pollo",
      "pavo",
      "vacuno"
    ],
    "techniques": [
      "cortar",
      "trinchar"
    ],
    "useMoment": [
      "antes de servir"
    ],
    "level": "básico",
    "commonError": "Servir una carne correcta que parece más dura al masticar.",
    "sensorySignal": "Las fibras visibles quedan cortas en cada loncha.",
    "chefQuickTip": "El corte también ablanda.",
    "tags": [
      "pollo",
      "pavo",
      "vacuno",
      "cortar",
      "trinchar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pollo",
        "pavo",
        "vacuno"
      ],
      "techniques": [
        "cortar",
        "trinchar"
      ],
      "actions": [
        "cortar",
        "trinchar"
      ],
      "equipment": [
        "cuchillo"
      ],
      "situations": [
        "Servir una carne correcta que parece más dura al masticar."
      ]
    }
  },
  {
    "id": "tip-v2-049",
    "code": "TIP-049",
    "icon": "🥩",
    "title": "No hiervas un estofado agresivamente",
    "category": "Carnes",
    "primaryType": "temperatura",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Mantén una cocción húmeda suave para piezas destinadas a ablandarse lentamente.",
    "shortTip": "Mantén una cocción húmeda suave para piezas destinadas a ablandarse lentamente.",
    "explanation": "Una vez iniciado el guiso, reduce a un hervor tranquilo. Revisa líquido y tapa según la evaporación que necesites.",
    "whyItWorks": "La cocción prolongada y húmeda transforma colágeno; un hervor violento no acelera de forma útil y puede endurecer o deshacer irregularmente.",
    "appliesTo": [
      "ternera",
      "cordero",
      "cerdo"
    ],
    "techniques": [
      "estofar",
      "guisar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Carne seca por fuera y salsa reducida demasiado pronto.",
    "sensorySignal": "La superficie apenas burbujea y la carne se ablanda progresivamente.",
    "chefQuickTip": "Estofado lento, no furioso.",
    "tags": [
      "ternera",
      "cordero",
      "cerdo",
      "estofar",
      "guisar",
      "temperatura",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "ternera",
        "cordero",
        "cerdo"
      ],
      "techniques": [
        "estofar",
        "guisar"
      ],
      "actions": [
        "estofar",
        "guisar"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Carne seca por fuera y salsa reducida demasiado pronto."
      ]
    }
  },
  {
    "id": "tip-v2-050",
    "code": "TIP-050",
    "icon": "🥩",
    "title": "Termina por temperatura y textura",
    "category": "Carnes",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "No juzgues una pieza gruesa solo por color exterior o minutos.",
    "shortTip": "No juzgues una pieza gruesa solo por color exterior o minutos.",
    "explanation": "Combina observación, tacto y, cuando convenga, termómetro. El tamaño, forma y temperatura inicial cambian el tiempo real.",
    "whyItWorks": "La transferencia de calor al centro depende de muchas variables que el reloj no representa por sí solo.",
    "appliesTo": [
      "asados",
      "piezas gruesas"
    ],
    "techniques": [
      "asar",
      "plancha"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Sobrepasar el punto por seguir un tiempo rígido.",
    "sensorySignal": "La lectura interna y la resistencia al tacto concuerdan con el punto buscado.",
    "chefQuickTip": "El reloj orienta; la pieza decide.",
    "tags": [
      "asados",
      "piezas gruesas",
      "asar",
      "plancha",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "asados",
        "piezas gruesas"
      ],
      "techniques": [
        "asar",
        "plancha"
      ],
      "actions": [
        "asar",
        "plancha"
      ],
      "equipment": [
        "termómetro"
      ],
      "situations": [
        "Sobrepasar el punto por seguir un tiempo rígido."
      ]
    }
  },
  {
    "id": "tip-v2-051",
    "code": "TIP-051",
    "icon": "🐟",
    "title": "Seca la piel del pescado",
    "category": "Pescados y mariscos",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Seca muy bien la piel antes de cocinarla para que quede crujiente.",
    "shortTip": "Seca muy bien la piel antes de cocinarla para que quede crujiente.",
    "explanation": "Retira humedad con papel justo antes de salar y cocinar. Coloca la piel contra una sartén caliente con una película de grasa.",
    "whyItWorks": "La humedad debe evaporarse antes de que la piel pueda dorarse y volverse crujiente.",
    "appliesTo": [
      "pescado con piel"
    ],
    "techniques": [
      "plancha",
      "marcar",
      "dorar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Piel blanda o pegada.",
    "sensorySignal": "La piel se vuelve dorada y rígida, con sonido crujiente.",
    "chefQuickTip": "Piel seca, piel crujiente.",
    "tags": [
      "pescado con piel",
      "plancha",
      "marcar",
      "dorar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pescado con piel"
      ],
      "techniques": [
        "plancha",
        "marcar",
        "dorar"
      ],
      "actions": [
        "plancha",
        "marcar",
        "dorar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Piel blanda o pegada."
      ]
    }
  },
  {
    "id": "tip-v2-052",
    "code": "TIP-052",
    "icon": "🐟",
    "title": "Empieza por la piel",
    "category": "Pescados y mariscos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "En filetes con piel, cocina primero la mayor parte del tiempo por ese lado.",
    "shortTip": "En filetes con piel, cocina primero la mayor parte del tiempo por ese lado.",
    "explanation": "Coloca el pescado con la piel hacia abajo y mantenlo estable al inicio. Gira solo para terminar la cara de la carne cuando sea necesario.",
    "whyItWorks": "La piel protege la carne y necesita más tiempo para perder humedad y quedar crujiente.",
    "appliesTo": [
      "lubina",
      "dorada",
      "salmón",
      "merluza con piel"
    ],
    "techniques": [
      "plancha",
      "marcar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Piel gomosa y carne pasada.",
    "sensorySignal": "La piel está firme y la cocción asciende desde abajo.",
    "chefQuickTip": "La piel hace de escudo.",
    "tags": [
      "lubina",
      "dorada",
      "salmón",
      "plancha",
      "marcar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "lubina",
        "dorada",
        "salmón",
        "merluza con piel"
      ],
      "techniques": [
        "plancha",
        "marcar"
      ],
      "actions": [
        "plancha",
        "marcar"
      ],
      "equipment": [
        "sartén",
        "espátula"
      ],
      "situations": [
        "Piel gomosa y carne pasada."
      ]
    }
  },
  {
    "id": "tip-v2-053",
    "code": "TIP-053",
    "icon": "🐟",
    "title": "Presiona solo al principio",
    "category": "Pescados y mariscos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "En pescado con piel, una presión breve inicial evita que el filete se arquee.",
    "shortTip": "En pescado con piel, una presión breve inicial evita que el filete se arquee.",
    "explanation": "Durante los primeros segundos, presiona suavemente con una espátula para mantener toda la piel en contacto. Después deja de presionar.",
    "whyItWorks": "El calor contrae la piel al inicio y puede curvar la pieza, reduciendo contacto y dorado.",
    "appliesTo": [
      "pescado con piel"
    ],
    "techniques": [
      "plancha",
      "marcar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Piel dorada solo en zonas.",
    "sensorySignal": "Toda la superficie de la piel toca la sartén y queda uniforme.",
    "chefQuickTip": "Presiona al inicio, luego suelta.",
    "tags": [
      "pescado con piel",
      "plancha",
      "marcar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pescado con piel"
      ],
      "techniques": [
        "plancha",
        "marcar"
      ],
      "actions": [
        "plancha",
        "marcar"
      ],
      "equipment": [
        "espátula",
        "sartén"
      ],
      "situations": [
        "Piel dorada solo en zonas."
      ]
    }
  },
  {
    "id": "tip-v2-054",
    "code": "TIP-054",
    "icon": "🐟",
    "title": "Retira antes del exceso",
    "category": "Pescados y mariscos",
    "primaryType": "temperatura",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Saca el pescado del calor cuando está casi en el punto; terminará con calor residual.",
    "shortTip": "Saca el pescado del calor cuando está casi en el punto; terminará con calor residual.",
    "explanation": "Especialmente en filetes finos, retira un poco antes de la textura final deseada. Sirve pronto.",
    "whyItWorks": "La baja masa del pescado permite que el calor residual continúe coagulación rápidamente.",
    "appliesTo": [
      "pescado blanco",
      "salmón",
      "atún"
    ],
    "techniques": [
      "plancha",
      "hornear",
      "asar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Pescado seco por unos minutos extra.",
    "sensorySignal": "Las lascas se separan con facilidad sin expulsar mucho líquido.",
    "chefQuickTip": "El pescado no espera.",
    "tags": [
      "pescado blanco",
      "salmón",
      "atún",
      "plancha",
      "hornear",
      "asar",
      "temperatura",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pescado blanco",
        "salmón",
        "atún"
      ],
      "techniques": [
        "plancha",
        "hornear",
        "asar"
      ],
      "actions": [
        "plancha",
        "hornear",
        "asar"
      ],
      "equipment": [
        "sartén",
        "horno"
      ],
      "situations": [
        "Pescado seco por unos minutos extra."
      ]
    }
  },
  {
    "id": "tip-v2-055",
    "code": "TIP-055",
    "icon": "🐟",
    "title": "Descongela sobre rejilla",
    "category": "Pescados y mariscos",
    "primaryType": "seguridad",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Descongela pescado en frío y evita que quede sumergido en su propio líquido.",
    "shortTip": "Descongela pescado en frío y evita que quede sumergido en su propio líquido.",
    "explanation": "Coloca el pescado en un recipiente sobre rejilla o superficie que permita separar el líquido. Mantén refrigerado y seca antes de cocinar.",
    "whyItWorks": "Evitar el contacto prolongado con el exudado mejora textura superficial y facilita el dorado.",
    "appliesTo": [
      "pescado congelado",
      "marisco"
    ],
    "techniques": [
      "descongelar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Superficie acuosa y textura blanda.",
    "sensorySignal": "La pieza descongelada queda húmeda pero no sumergida.",
    "chefQuickTip": "Descongela frío y escurrido.",
    "tags": [
      "pescado congelado",
      "marisco",
      "descongelar",
      "seguridad",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pescado congelado",
        "marisco"
      ],
      "techniques": [
        "descongelar"
      ],
      "actions": [
        "descongelar"
      ],
      "equipment": [
        "rejilla",
        "frigorífico"
      ],
      "situations": [
        "Superficie acuosa y textura blanda."
      ]
    }
  },
  {
    "id": "tip-v2-056",
    "code": "TIP-056",
    "icon": "🐟",
    "title": "Abre moluscos por tandas",
    "category": "Pescados y mariscos",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Retira almejas o mejillones a medida que se abran en la cocción.",
    "shortTip": "Retira almejas o mejillones a medida que se abran en la cocción.",
    "explanation": "Cocina con vapor o líquido aromático y ve retirando los ejemplares abiertos. No prolongues toda la tanda esperando indefinidamente a los últimos.",
    "whyItWorks": "Los moluscos ya abiertos continúan perdiendo agua y pueden volverse correosos.",
    "appliesTo": [
      "almejas",
      "mejillones",
      "berberechos"
    ],
    "techniques": [
      "cocer al vapor",
      "saltear"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Moluscos secos por sobrecocción.",
    "sensorySignal": "Las conchas se abren y la carne permanece jugosa.",
    "chefQuickTip": "Abierto, fuera.",
    "tags": [
      "almejas",
      "mejillones",
      "berberechos",
      "cocer al vapor",
      "saltear",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "almejas",
        "mejillones",
        "berberechos"
      ],
      "techniques": [
        "cocer al vapor",
        "saltear"
      ],
      "actions": [
        "cocer al vapor",
        "saltear"
      ],
      "equipment": [
        "cazuela",
        "tapa"
      ],
      "situations": [
        "Moluscos secos por sobrecocción."
      ]
    }
  },
  {
    "id": "tip-v2-057",
    "code": "TIP-057",
    "icon": "🐟",
    "title": "Cuela el jugo de moluscos",
    "category": "Pescados y mariscos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Filtra el líquido de almejas o mejillones antes de incorporarlo a una salsa.",
    "shortTip": "Filtra el líquido de almejas o mejillones antes de incorporarlo a una salsa.",
    "explanation": "Tras abrir los moluscos, pasa su jugo por un colador fino o filtro si contiene arena o impurezas. Úsalo como base salina y aromática.",
    "whyItWorks": "El líquido concentra sabor marino, pero puede arrastrar partículas del fondo.",
    "appliesTo": [
      "almejas",
      "mejillones",
      "berberechos"
    ],
    "techniques": [
      "colar",
      "reducir"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Introducir arena en la salsa.",
    "sensorySignal": "El líquido queda limpio y aromático.",
    "chefQuickTip": "Sabor sí, arena no.",
    "tags": [
      "almejas",
      "mejillones",
      "berberechos",
      "colar",
      "reducir",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "almejas",
        "mejillones",
        "berberechos"
      ],
      "techniques": [
        "colar",
        "reducir"
      ],
      "actions": [
        "colar",
        "reducir"
      ],
      "equipment": [
        "colador"
      ],
      "situations": [
        "Introducir arena en la salsa."
      ]
    }
  },
  {
    "id": "tip-v2-058",
    "code": "TIP-058",
    "icon": "🐟",
    "title": "Marisco: cocción corta y precisa",
    "category": "Pescados y mariscos",
    "primaryType": "textura",
    "secondaryType": "temperatura",
    "priority": "P2",
    "text": "Evita alargar la cocción de gambas, langostinos o calamar cuando la técnica es rápida.",
    "shortTip": "Evita alargar la cocción de gambas, langostinos o calamar cuando la técnica es rápida.",
    "explanation": "Trabaja con fuego suficiente y tandas pequeñas. Retira cuando la carne cambie de aspecto y alcance la textura buscada.",
    "whyItWorks": "Las proteínas del marisco se contraen rápidamente; un exceso de calor expulsa agua y endurece.",
    "appliesTo": [
      "gambas",
      "langostinos",
      "calamar"
    ],
    "techniques": [
      "saltear",
      "plancha"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Marisco gomoso y seco.",
    "sensorySignal": "La carne está opaca y firme, pero aún jugosa.",
    "chefQuickTip": "Marisco rápido, no eterno.",
    "tags": [
      "gambas",
      "langostinos",
      "calamar",
      "saltear",
      "plancha",
      "textura",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "gambas",
        "langostinos",
        "calamar"
      ],
      "techniques": [
        "saltear",
        "plancha"
      ],
      "actions": [
        "saltear",
        "plancha"
      ],
      "equipment": [
        "sartén",
        "plancha"
      ],
      "situations": [
        "Marisco gomoso y seco."
      ]
    }
  },
  {
    "id": "tip-v2-059",
    "code": "TIP-059",
    "icon": "🐟",
    "title": "Calamar: rápido o largo",
    "category": "Pescados y mariscos",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Para calamar, elige cocción muy breve o prolongada; evita zonas intermedias sin control.",
    "shortTip": "Para calamar, elige cocción muy breve o prolongada; evita zonas intermedias sin control.",
    "explanation": "A la plancha, cocina con intensidad y poco tiempo. En guiso, deja que la cocción prolongada ablande de nuevo el tejido.",
    "whyItWorks": "El tejido del calamar se endurece inicialmente con el calor y necesita una cocción distinta para volver a ablandarse.",
    "appliesTo": [
      "calamar",
      "sepia"
    ],
    "techniques": [
      "plancha",
      "guisar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Calamar correoso por cocción intermedia.",
    "sensorySignal": "En plancha queda tierno y dorado; en guiso vuelve a ablandarse.",
    "chefQuickTip": "Calamar: muy poco o bastante.",
    "tags": [
      "calamar",
      "sepia",
      "plancha",
      "guisar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "calamar",
        "sepia"
      ],
      "techniques": [
        "plancha",
        "guisar"
      ],
      "actions": [
        "plancha",
        "guisar"
      ],
      "equipment": [
        "plancha",
        "cazuela"
      ],
      "situations": [
        "Calamar correoso por cocción intermedia."
      ]
    }
  },
  {
    "id": "tip-v2-060",
    "code": "TIP-060",
    "icon": "🐟",
    "title": "Sala el pescado con moderación",
    "category": "Pescados y mariscos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Recuerda que salsas, fondos y productos marinos pueden aportar sal adicional.",
    "shortTip": "Recuerda que salsas, fondos y productos marinos pueden aportar sal adicional.",
    "explanation": "Sazona de forma progresiva y prueba la salsa antes del ajuste final. Especial atención si utilizas caldo concentrado, anchoas, salsa de soja o jugo de moluscos.",
    "whyItWorks": "La sal total se acumula desde distintos componentes y puede concentrarse al reducir.",
    "appliesTo": [
      "pescado",
      "marisco",
      "salsas marinas"
    ],
    "techniques": [
      "sazonar",
      "reducir"
    ],
    "useMoment": [
      "durante la cocción",
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Pasarse de sal al combinar ingredientes salinos.",
    "sensorySignal": "El plato mantiene sabor marino sin resultar agresivamente salado.",
    "chefQuickTip": "Cuenta toda la sal.",
    "tags": [
      "pescado",
      "marisco",
      "salsas marinas",
      "sazonar",
      "reducir",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pescado",
        "marisco",
        "salsas marinas"
      ],
      "techniques": [
        "sazonar",
        "reducir"
      ],
      "actions": [
        "sazonar",
        "reducir"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Pasarse de sal al combinar ingredientes salinos."
      ]
    }
  },
  {
    "id": "tip-v2-061",
    "code": "TIP-061",
    "icon": "🐟",
    "title": "Espinas para fumet corto",
    "category": "Pescados y mariscos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Usa espinas y cabezas limpias para extraer sabor sin prolongar innecesariamente la cocción.",
    "shortTip": "Usa espinas y cabezas limpias para extraer sabor sin prolongar innecesariamente la cocción.",
    "explanation": "Enjuaga cuando proceda, retira branquias o restos que aporten amargor y cocina a hervor suave. Cuela cuando el fondo tenga aroma limpio.",
    "whyItWorks": "Las estructuras del pescado liberan sabor con rapidez; cocciones excesivas pueden extraer notas más ásperas.",
    "appliesTo": [
      "espinas de pescado",
      "cabezas"
    ],
    "techniques": [
      "hacer fondo",
      "colar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Fumet turbio o con notas amargas.",
    "sensorySignal": "El caldo huele limpio a pescado y mantiene color claro.",
    "chefQuickTip": "Fumet: extracción breve y limpia.",
    "tags": [
      "espinas de pescado",
      "cabezas",
      "hacer fondo",
      "colar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "espinas de pescado",
        "cabezas"
      ],
      "techniques": [
        "hacer fondo",
        "colar"
      ],
      "actions": [
        "hacer fondo",
        "colar"
      ],
      "equipment": [
        "olla",
        "colador"
      ],
      "situations": [
        "Fumet turbio o con notas amargas."
      ]
    }
  },
  {
    "id": "tip-v2-062",
    "code": "TIP-062",
    "icon": "🐟",
    "title": "Deja espacio al marisco",
    "category": "Pescados y mariscos",
    "primaryType": "textura",
    "secondaryType": "temperatura",
    "priority": "P3",
    "text": "Saltea marisco en tandas para que dore en vez de soltar agua.",
    "shortTip": "Saltea marisco en tandas para que dore en vez de soltar agua.",
    "explanation": "Usa una sartén amplia y evita cubrir toda la superficie con producto frío. Retira una tanda y deja recuperar calor antes de la siguiente.",
    "whyItWorks": "La saturación reduce temperatura y aumenta vapor, perjudicando dorado y textura.",
    "appliesTo": [
      "gambas",
      "langostinos",
      "vieiras"
    ],
    "techniques": [
      "saltear",
      "marcar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Marisco cocido en su propio líquido.",
    "sensorySignal": "Las piezas toman color rápidamente sin charco en la sartén.",
    "chefQuickTip": "Marisco con espacio dora mejor.",
    "tags": [
      "gambas",
      "langostinos",
      "vieiras",
      "saltear",
      "marcar",
      "textura",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "gambas",
        "langostinos",
        "vieiras"
      ],
      "techniques": [
        "saltear",
        "marcar"
      ],
      "actions": [
        "saltear",
        "marcar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Marisco cocido en su propio líquido."
      ]
    }
  },
  {
    "id": "tip-v2-063",
    "code": "TIP-063",
    "icon": "🥬",
    "title": "Corta según densidad",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Ajusta el tamaño del corte a la dureza y tiempo de cocción de cada verdura.",
    "shortTip": "Ajusta el tamaño del corte a la dureza y tiempo de cocción de cada verdura.",
    "explanation": "Corta más pequeñas las verduras densas si deben cocinarse junto a otras tiernas. También puedes incorporarlas antes.",
    "whyItWorks": "Densidad, grosor y contenido de agua determinan la velocidad a la que se ablandan.",
    "appliesTo": [
      "zanahoria",
      "patata",
      "calabacín",
      "pimiento"
    ],
    "techniques": [
      "cortar",
      "saltear",
      "asar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Verduras con puntos de cocción muy distintos.",
    "sensorySignal": "Todos los vegetales alcanzan textura agradable a la vez.",
    "chefQuickTip": "Más duro, antes o más pequeño.",
    "tags": [
      "zanahoria",
      "patata",
      "calabacín",
      "cortar",
      "saltear",
      "asar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "zanahoria",
        "patata",
        "calabacín",
        "pimiento"
      ],
      "techniques": [
        "cortar",
        "saltear",
        "asar"
      ],
      "actions": [
        "cortar",
        "saltear",
        "asar"
      ],
      "equipment": [
        "cuchillo"
      ],
      "situations": [
        "Verduras con puntos de cocción muy distintos."
      ]
    }
  },
  {
    "id": "tip-v2-064",
    "code": "TIP-064",
    "icon": "🥬",
    "title": "No laves setas en remojo",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Limpia setas con rapidez y evita dejarlas sumergidas en agua.",
    "shortTip": "Limpia setas con rapidez y evita dejarlas sumergidas en agua.",
    "explanation": "Retira tierra con cepillo, paño o lavado breve según la seta y sécalas antes de cocinar. No las dejes horas absorbiendo agua.",
    "whyItWorks": "El exceso de agua superficial dificulta el dorado y aumenta el vapor en la sartén.",
    "appliesTo": [
      "setas",
      "champiñones"
    ],
    "techniques": [
      "limpiar",
      "saltear"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Setas húmedas que cuecen en lugar de dorarse.",
    "sensorySignal": "Las setas llegan a la sartén limpias y secas.",
    "chefQuickTip": "Seta limpia, no empapada.",
    "tags": [
      "setas",
      "champiñones",
      "limpiar",
      "saltear",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "setas",
        "champiñones"
      ],
      "techniques": [
        "limpiar",
        "saltear"
      ],
      "actions": [
        "limpiar",
        "saltear"
      ],
      "equipment": [
        "cepillo",
        "papel de cocina"
      ],
      "situations": [
        "Setas húmedas que cuecen en lugar de dorarse."
      ]
    }
  },
  {
    "id": "tip-v2-065",
    "code": "TIP-065",
    "icon": "🥬",
    "title": "Sala setas al final del dorado",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Cuando busques color intenso, deja que pierdan agua y sazona después.",
    "shortTip": "Cuando busques color intenso, deja que pierdan agua y sazona después.",
    "explanation": "Cocina las setas con espacio y fuego suficiente. Una vez que hayan reducido su humedad y comiencen a dorarse, ajusta la sal.",
    "whyItWorks": "Reducir agua disponible favorece que la superficie alcance temperaturas de dorado.",
    "appliesTo": [
      "setas",
      "champiñones"
    ],
    "techniques": [
      "saltear",
      "dorar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Sartén llena de líquido y setas pálidas.",
    "sensorySignal": "Primero sueltan agua; después toman color.",
    "chefQuickTip": "Primero dora, luego ajusta.",
    "tags": [
      "setas",
      "champiñones",
      "saltear",
      "dorar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "setas",
        "champiñones"
      ],
      "techniques": [
        "saltear",
        "dorar"
      ],
      "actions": [
        "saltear",
        "dorar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Sartén llena de líquido y setas pálidas."
      ]
    }
  },
  {
    "id": "tip-v2-066",
    "code": "TIP-066",
    "icon": "🥬",
    "title": "Verduras verdes: cocción breve",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Controla el tiempo de judías, brócoli o guisantes para conservar color y textura.",
    "shortTip": "Controla el tiempo de judías, brócoli o guisantes para conservar color y textura.",
    "explanation": "Cocina hasta que estén tiernos pero aún tengan estructura. Si no se sirven de inmediato, enfría o corta la cocción según la receta.",
    "whyItWorks": "El calor prolongado degrada pigmentos y ablanda en exceso las paredes celulares.",
    "appliesTo": [
      "brócoli",
      "judías verdes",
      "guisantes"
    ],
    "techniques": [
      "hervir",
      "cocer al vapor",
      "saltear"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Verduras apagadas y blandas.",
    "sensorySignal": "Color vivo y mordida tierna con ligera resistencia.",
    "chefQuickTip": "Verde vivo, cocción corta.",
    "tags": [
      "brócoli",
      "judías verdes",
      "guisantes",
      "hervir",
      "cocer al vapor",
      "saltear",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "brócoli",
        "judías verdes",
        "guisantes"
      ],
      "techniques": [
        "hervir",
        "cocer al vapor",
        "saltear"
      ],
      "actions": [
        "hervir",
        "cocer al vapor",
        "saltear"
      ],
      "equipment": [
        "olla",
        "vaporera"
      ],
      "situations": [
        "Verduras apagadas y blandas."
      ]
    }
  },
  {
    "id": "tip-v2-067",
    "code": "TIP-067",
    "icon": "🥬",
    "title": "Asa con espacio",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Distribuye verduras en una sola capa para que asen y doren.",
    "shortTip": "Distribuye verduras en una sola capa para que asen y doren.",
    "explanation": "Usa una bandeja lo bastante grande y evita montones. Si hay demasiada cantidad, reparte en dos bandejas.",
    "whyItWorks": "El espacio permite evaporación y exposición al calor; el amontonamiento retiene vapor.",
    "appliesTo": [
      "patata",
      "calabaza",
      "coliflor",
      "zanahoria"
    ],
    "techniques": [
      "asar",
      "dorar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Verduras blandas y pálidas en el horno.",
    "sensorySignal": "Los bordes toman color y la bandeja no acumula líquido.",
    "chefQuickTip": "Una capa, mejor asado.",
    "tags": [
      "patata",
      "calabaza",
      "coliflor",
      "asar",
      "dorar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "patata",
        "calabaza",
        "coliflor",
        "zanahoria"
      ],
      "techniques": [
        "asar",
        "dorar"
      ],
      "actions": [
        "asar",
        "dorar"
      ],
      "equipment": [
        "horno",
        "bandeja"
      ],
      "situations": [
        "Verduras blandas y pálidas en el horno."
      ]
    }
  },
  {
    "id": "tip-v2-068",
    "code": "TIP-068",
    "icon": "🥬",
    "title": "Seca patatas antes de asar",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Elimina humedad exterior antes de hornear o freír patatas.",
    "shortTip": "Elimina humedad exterior antes de hornear o freír patatas.",
    "explanation": "Después de lavar, remojar o precocer, escurre y seca muy bien. Añade grasa y condimentos solo cuando la superficie no esté mojada.",
    "whyItWorks": "Menos humedad superficial acelera evaporación y facilita una corteza crujiente.",
    "appliesTo": [
      "patata"
    ],
    "techniques": [
      "asar",
      "freír"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Patatas blandas y poco doradas.",
    "sensorySignal": "La superficie queda seca antes de recibir la grasa.",
    "chefQuickTip": "Patata seca, borde crujiente.",
    "tags": [
      "patata",
      "asar",
      "freír",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "patata"
      ],
      "techniques": [
        "asar",
        "freír"
      ],
      "actions": [
        "asar",
        "freír"
      ],
      "equipment": [
        "papel de cocina",
        "bandeja"
      ],
      "situations": [
        "Patatas blandas y poco doradas."
      ]
    }
  },
  {
    "id": "tip-v2-069",
    "code": "TIP-069",
    "icon": "🥬",
    "title": "No amontones hojas al saltear",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Cocina espinaca, acelga u hojas en tandas si el volumen es grande.",
    "shortTip": "Cocina espinaca, acelga u hojas en tandas si el volumen es grande.",
    "explanation": "Añade una cantidad que puedas mover con facilidad y espera a que baje de volumen antes de incorporar más.",
    "whyItWorks": "Las hojas liberan mucha agua y un exceso de volumen enfría rápidamente la sartén.",
    "appliesTo": [
      "espinaca",
      "acelga",
      "kale"
    ],
    "techniques": [
      "saltear"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Hojas aguadas y cocción desigual.",
    "sensorySignal": "Las hojas se marchitan rápidamente sin formar un charco grande.",
    "chefQuickTip": "Hojas por tandas.",
    "tags": [
      "espinaca",
      "acelga",
      "kale",
      "saltear",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "espinaca",
        "acelga",
        "kale"
      ],
      "techniques": [
        "saltear"
      ],
      "actions": [
        "saltear"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Hojas aguadas y cocción desigual."
      ]
    }
  },
  {
    "id": "tip-v2-070",
    "code": "TIP-070",
    "icon": "🥬",
    "title": "Tuesta verduras para crema",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Dora parte de las verduras antes de añadir líquido si buscas una crema más intensa.",
    "shortTip": "Dora parte de las verduras antes de añadir líquido si buscas una crema más intensa.",
    "explanation": "Sofríe o asa cebolla, puerro, calabaza, zanahoria u otras verduras hasta desarrollar color, y después añade el caldo.",
    "whyItWorks": "El dorado genera nuevos aromas que permanecen en la crema tras triturar.",
    "appliesTo": [
      "calabaza",
      "zanahoria",
      "puerro",
      "cebolla"
    ],
    "techniques": [
      "dorar",
      "sofreír",
      "triturar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Crema correcta pero plana de sabor.",
    "sensorySignal": "Las verduras tienen zonas doradas antes de añadir líquido.",
    "chefQuickTip": "Una crema también puede dorarse.",
    "tags": [
      "calabaza",
      "zanahoria",
      "puerro",
      "dorar",
      "sofreír",
      "triturar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "calabaza",
        "zanahoria",
        "puerro",
        "cebolla"
      ],
      "techniques": [
        "dorar",
        "sofreír",
        "triturar"
      ],
      "actions": [
        "dorar",
        "sofreír",
        "triturar"
      ],
      "equipment": [
        "cazuela",
        "horno"
      ],
      "situations": [
        "Crema correcta pero plana de sabor."
      ]
    }
  },
  {
    "id": "tip-v2-071",
    "code": "TIP-071",
    "icon": "🥬",
    "title": "Añade ácido después de dorar",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "En verduras salteadas, termina con limón o vinagre cuando quieras frescura.",
    "shortTip": "En verduras salteadas, termina con limón o vinagre cuando quieras frescura.",
    "explanation": "Dora primero sin exceso de líquido y añade el componente ácido cerca del final. Ajusta poco a poco.",
    "whyItWorks": "El ácido aporta contraste pero, añadido pronto en cantidad, puede interferir con el dorado y modificar textura.",
    "appliesTo": [
      "coles",
      "judías",
      "espárragos",
      "setas"
    ],
    "techniques": [
      "saltear",
      "aliñar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Verduras pálidas y ácidas sin dorado.",
    "sensorySignal": "El plato gana frescura sin perder color tostado.",
    "chefQuickTip": "Dorado primero, ácido después.",
    "tags": [
      "coles",
      "judías",
      "espárragos",
      "saltear",
      "aliñar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "coles",
        "judías",
        "espárragos",
        "setas"
      ],
      "techniques": [
        "saltear",
        "aliñar"
      ],
      "actions": [
        "saltear",
        "aliñar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Verduras pálidas y ácidas sin dorado."
      ]
    }
  },
  {
    "id": "tip-v2-072",
    "code": "TIP-072",
    "icon": "🥬",
    "title": "Aprovecha tallos tiernos",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "aprovechamiento",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "No descartes automáticamente tallos de brócoli, acelga o hierbas si son comestibles.",
    "shortTip": "No descartes automáticamente tallos de brócoli, acelga o hierbas si son comestibles.",
    "explanation": "Pela o corta fino cuando la parte exterior sea fibrosa y cocina según dureza. Reserva los tallos de hierbas para caldos, salsas o picados cuando su sabor sea adecuado.",
    "whyItWorks": "Muchas partes descartadas tienen sabor y textura aprovechables con un corte distinto.",
    "appliesTo": [
      "brócoli",
      "acelga",
      "perejil",
      "cilantro"
    ],
    "techniques": [
      "pelar",
      "cortar",
      "saltear"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Desechar partes útiles o cocinarlas sin adaptar su textura.",
    "sensorySignal": "El interior del tallo queda tierno tras el corte o pelado.",
    "chefQuickTip": "Antes de tirar, prueba el tallo.",
    "tags": [
      "brócoli",
      "acelga",
      "perejil",
      "pelar",
      "cortar",
      "saltear",
      "aprovechamiento",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "brócoli",
        "acelga",
        "perejil",
        "cilantro"
      ],
      "techniques": [
        "pelar",
        "cortar",
        "saltear"
      ],
      "actions": [
        "pelar",
        "cortar",
        "saltear"
      ],
      "equipment": [
        "cuchillo"
      ],
      "situations": [
        "Desechar partes útiles o cocinarlas sin adaptar su textura."
      ]
    }
  },
  {
    "id": "tip-v2-073",
    "code": "TIP-073",
    "icon": "🥬",
    "title": "Escurre antes de saltear",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Verduras hervidas o al vapor deben estar bien escurridas antes de pasar a la sartén.",
    "shortTip": "Verduras hervidas o al vapor deben estar bien escurridas antes de pasar a la sartén.",
    "explanation": "Deja salir el exceso de agua y, si buscas dorado, seca superficialmente antes de añadir grasa y calor.",
    "whyItWorks": "El agua residual consume energía al evaporarse y diluye salsas o aliños.",
    "appliesTo": [
      "brócoli",
      "judías",
      "patata",
      "coliflor"
    ],
    "techniques": [
      "hervir",
      "saltear"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Sartén aguada y falta de dorado.",
    "sensorySignal": "Las verduras llegan a la sartén sin goteo visible.",
    "chefQuickTip": "Escurrido también es técnica.",
    "tags": [
      "brócoli",
      "judías",
      "patata",
      "hervir",
      "saltear",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "brócoli",
        "judías",
        "patata",
        "coliflor"
      ],
      "techniques": [
        "hervir",
        "saltear"
      ],
      "actions": [
        "hervir",
        "saltear"
      ],
      "equipment": [
        "colador",
        "sartén"
      ],
      "situations": [
        "Sartén aguada y falta de dorado."
      ]
    }
  },
  {
    "id": "tip-v2-074",
    "code": "TIP-074",
    "icon": "🥬",
    "title": "Saltea aromáticos sin quemarlos",
    "category": "Verduras, hortalizas y setas",
    "primaryType": "sabor",
    "secondaryType": "temperatura",
    "priority": "P2",
    "text": "Ajo, jengibre y especias picadas necesitan menos tiempo que cebolla o verduras densas.",
    "shortTip": "Ajo, jengibre y especias picadas necesitan menos tiempo que cebolla o verduras densas.",
    "explanation": "Añádelos más tarde o reduce el fuego. Remueve y continúa con el siguiente ingrediente cuando desprendan aroma.",
    "whyItWorks": "Sus partículas pequeñas y compuestos sensibles reaccionan rápidamente al calor.",
    "appliesTo": [
      "ajo",
      "jengibre",
      "chile",
      "especias"
    ],
    "techniques": [
      "saltear",
      "sofreír"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Aromáticos amargos por quemado.",
    "sensorySignal": "Desprenden aroma intenso sin color negro.",
    "chefQuickTip": "Aroma sí, quemado no.",
    "tags": [
      "ajo",
      "jengibre",
      "chile",
      "saltear",
      "sofreír",
      "sabor",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "ajo",
        "jengibre",
        "chile",
        "especias"
      ],
      "techniques": [
        "saltear",
        "sofreír"
      ],
      "actions": [
        "saltear",
        "sofreír"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Aromáticos amargos por quemado."
      ]
    }
  },
  {
    "id": "tip-v2-075",
    "code": "TIP-075",
    "icon": "🍚",
    "title": "Elige arroz para el resultado",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "ingrediente",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Usa una variedad adecuada al tipo de plato y textura buscada.",
    "shortTip": "Usa una variedad adecuada al tipo de plato y textura buscada.",
    "explanation": "No todos los arroces absorben, liberan almidón o mantienen el grano igual. Elige según quieras arroz seco, cremoso, meloso o suelto.",
    "whyItWorks": "La proporción de almidones y la estructura del grano condicionan absorción y textura.",
    "appliesTo": [
      "arroz"
    ],
    "techniques": [
      "cocer",
      "risottar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Pretender la misma textura con cualquier variedad.",
    "sensorySignal": "El grano responde al método previsto sin romperse ni quedar inadecuado.",
    "chefQuickTip": "El arroz también se elige.",
    "tags": [
      "arroz",
      "cocer",
      "risottar",
      "ingrediente",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "arroz"
      ],
      "techniques": [
        "cocer",
        "risottar"
      ],
      "actions": [
        "cocer",
        "risottar"
      ],
      "equipment": [
        "cazuela",
        "paellera"
      ],
      "situations": [
        "Pretender la misma textura con cualquier variedad."
      ]
    }
  },
  {
    "id": "tip-v2-076",
    "code": "TIP-076",
    "icon": "🍚",
    "title": "No remuevas un arroz seco",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Una vez distribuido el grano, evita remover de forma continua si buscas arroz suelto.",
    "shortTip": "Una vez distribuido el grano, evita remover de forma continua si buscas arroz suelto.",
    "explanation": "Después de repartir bien el arroz y el líquido, deja que la cocción avance con movimientos mínimos. Corrige el fuego, no el grano.",
    "whyItWorks": "Remover favorece liberación de almidón y puede volver más cremosa la textura.",
    "appliesTo": [
      "arroces secos",
      "paellas"
    ],
    "techniques": [
      "cocer"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Arroz pegajoso cuando se buscaba grano separado.",
    "sensorySignal": "La superficie hierve de forma uniforme y el grano mantiene forma.",
    "chefQuickTip": "Arroz seco: menos cuchara.",
    "tags": [
      "arroces secos",
      "paellas",
      "cocer",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "arroces secos",
        "paellas"
      ],
      "techniques": [
        "cocer"
      ],
      "actions": [
        "cocer"
      ],
      "equipment": [
        "paellera"
      ],
      "situations": [
        "Arroz pegajoso cuando se buscaba grano separado."
      ]
    }
  },
  {
    "id": "tip-v2-077",
    "code": "TIP-077",
    "icon": "🍚",
    "title": "Remueve el risotto con criterio",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "En risotto, remueve para favorecer cremosidad sin maltratar el grano.",
    "shortTip": "En risotto, remueve para favorecer cremosidad sin maltratar el grano.",
    "explanation": "Añade líquido progresivamente y mezcla con frecuencia suficiente para distribuir calor y almidón. Evita agitación violenta constante.",
    "whyItWorks": "La fricción y el líquido liberan almidón superficial que espesa el conjunto.",
    "appliesTo": [
      "arroz para risotto"
    ],
    "techniques": [
      "risottar",
      "remover"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Risotto seco, grano roto o textura pastosa.",
    "sensorySignal": "La salsa queda cremosa y el grano conserva centro definido.",
    "chefQuickTip": "Cremoso, no machacado.",
    "tags": [
      "arroz para risotto",
      "risottar",
      "remover",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "arroz para risotto"
      ],
      "techniques": [
        "risottar",
        "remover"
      ],
      "actions": [
        "risottar",
        "remover"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Risotto seco, grano roto o textura pastosa."
      ]
    }
  },
  {
    "id": "tip-v2-078",
    "code": "TIP-078",
    "icon": "🍚",
    "title": "Deja reposar arroz seco",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Tras apagar, deja unos minutos de reposo antes de servir.",
    "shortTip": "Tras apagar, deja unos minutos de reposo antes de servir.",
    "explanation": "Retira del calor y deja que el arroz se estabilice sin removerlo agresivamente. El tiempo dependerá del plato y recipiente.",
    "whyItWorks": "El calor residual y la redistribución de humedad terminan de asentar la textura.",
    "appliesTo": [
      "arroz seco",
      "arroz blanco"
    ],
    "techniques": [
      "reposar",
      "cocer"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Servir con humedad irregular justo al apagar.",
    "sensorySignal": "El grano se separa mejor y la superficie deja de burbujear.",
    "chefQuickTip": "El arroz también reposa.",
    "tags": [
      "arroz seco",
      "arroz blanco",
      "reposar",
      "cocer",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "arroz seco",
        "arroz blanco"
      ],
      "techniques": [
        "reposar",
        "cocer"
      ],
      "actions": [
        "reposar",
        "cocer"
      ],
      "equipment": [
        "cazuela",
        "paellera"
      ],
      "situations": [
        "Servir con humedad irregular justo al apagar."
      ]
    }
  },
  {
    "id": "tip-v2-079",
    "code": "TIP-079",
    "icon": "🍚",
    "title": "Tuesta el grano cuando conviene",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Sofríe arroz o cereal antes del líquido si buscas sabor tostado y grano más definido.",
    "shortTip": "Sofríe arroz o cereal antes del líquido si buscas sabor tostado y grano más definido.",
    "explanation": "Remueve el grano en la grasa unos instantes hasta que se caliente y desprenda aroma, sin quemarlo, antes de añadir el líquido.",
    "whyItWorks": "El tostado modifica aromas de superficie y recubre parcialmente el grano con grasa.",
    "appliesTo": [
      "arroz",
      "cuscús",
      "quinoa"
    ],
    "techniques": [
      "tostar",
      "sofreír"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Grano plano de sabor o añadido en frío sin intención.",
    "sensorySignal": "Aparece aroma tostado suave y el grano se ve brillante.",
    "chefQuickTip": "Un tostado corto cambia el fondo.",
    "tags": [
      "arroz",
      "cuscús",
      "quinoa",
      "tostar",
      "sofreír",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "arroz",
        "cuscús",
        "quinoa"
      ],
      "techniques": [
        "tostar",
        "sofreír"
      ],
      "actions": [
        "tostar",
        "sofreír"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Grano plano de sabor o añadido en frío sin intención."
      ]
    }
  },
  {
    "id": "tip-v2-080",
    "code": "TIP-080",
    "icon": "🍚",
    "title": "Lava solo cuando aporta",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Lava el arroz cuando quieras retirar almidón superficial; no lo hagas por rutina si el método busca cremosidad.",
    "shortTip": "Lava el arroz cuando quieras retirar almidón superficial; no lo hagas por rutina si el método busca cremosidad.",
    "explanation": "En arroces que deben quedar sueltos, enjuagar puede ayudar. En preparaciones donde el almidón superficial contribuye a la textura, sigue el método específico.",
    "whyItWorks": "El lavado elimina parte del almidón suelto de la superficie del grano.",
    "appliesTo": [
      "arroz"
    ],
    "techniques": [
      "lavar",
      "cocer"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Aplicar la misma preparación previa a todos los arroces.",
    "sensorySignal": "El agua de lavado se aclara progresivamente cuando el objetivo es retirar almidón.",
    "chefQuickTip": "Lava con objetivo.",
    "tags": [
      "arroz",
      "lavar",
      "cocer",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "arroz"
      ],
      "techniques": [
        "lavar",
        "cocer"
      ],
      "actions": [
        "lavar",
        "cocer"
      ],
      "equipment": [
        "colador"
      ],
      "situations": [
        "Aplicar la misma preparación previa a todos los arroces."
      ]
    }
  },
  {
    "id": "tip-v2-081",
    "code": "TIP-081",
    "icon": "🍚",
    "title": "Remoja legumbres según variedad",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Usa remojo cuando la legumbre y el método lo recomienden; no todas necesitan lo mismo.",
    "shortTip": "Usa remojo cuando la legumbre y el método lo recomienden; no todas necesitan lo mismo.",
    "explanation": "Planifica el remojo para legumbres secas que lo agradecen y desecha piezas dañadas. Ajusta tiempos a variedad, edad y receta.",
    "whyItWorks": "La hidratación previa reduce diferencias entre exterior e interior durante la cocción.",
    "appliesTo": [
      "garbanzos",
      "alubias",
      "legumbres secas"
    ],
    "techniques": [
      "remojar",
      "cocer"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Cocción muy desigual o excesivamente larga.",
    "sensorySignal": "La legumbre aumenta de tamaño de forma uniforme antes de cocer.",
    "chefQuickTip": "Hidrata antes de ablandar.",
    "tags": [
      "garbanzos",
      "alubias",
      "legumbres secas",
      "remojar",
      "cocer",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "garbanzos",
        "alubias",
        "legumbres secas"
      ],
      "techniques": [
        "remojar",
        "cocer"
      ],
      "actions": [
        "remojar",
        "cocer"
      ],
      "equipment": [
        "bol"
      ],
      "situations": [
        "Cocción muy desigual o excesivamente larga."
      ]
    }
  },
  {
    "id": "tip-v2-082",
    "code": "TIP-082",
    "icon": "🍚",
    "title": "Cuece legumbres a hervor suave",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "temperatura",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Mantén movimiento moderado para evitar pieles rotas y cocción agresiva.",
    "shortTip": "Mantén movimiento moderado para evitar pieles rotas y cocción agresiva.",
    "explanation": "Tras iniciar la cocción, regula el fuego para que el líquido se mueva sin borbotones violentos. Añade líquido caliente si necesitas reponer.",
    "whyItWorks": "La agitación mecánica fuerte golpea las legumbres y favorece roturas.",
    "appliesTo": [
      "garbanzos",
      "alubias",
      "lentejas"
    ],
    "techniques": [
      "hervir",
      "guisar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Legumbres deshechas por agitación excesiva.",
    "sensorySignal": "El líquido se mueve suavemente y las pieles permanecen enteras.",
    "chefQuickTip": "Legumbre tierna, hervor tranquilo.",
    "tags": [
      "garbanzos",
      "alubias",
      "lentejas",
      "hervir",
      "guisar",
      "temperatura",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "garbanzos",
        "alubias",
        "lentejas"
      ],
      "techniques": [
        "hervir",
        "guisar"
      ],
      "actions": [
        "hervir",
        "guisar"
      ],
      "equipment": [
        "olla"
      ],
      "situations": [
        "Legumbres deshechas por agitación excesiva."
      ]
    }
  },
  {
    "id": "tip-v2-083",
    "code": "TIP-083",
    "icon": "🍚",
    "title": "Comprueba ternura, no reloj",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Prueba varias legumbres antes de dar por terminada la cocción.",
    "shortTip": "Prueba varias legumbres antes de dar por terminada la cocción.",
    "explanation": "Los tiempos cambian con variedad, edad, remojo y agua. Prueba más de una pieza y continúa hasta alcanzar la textura deseada.",
    "whyItWorks": "La estructura vegetal no se ablanda a una velocidad idéntica en todos los lotes.",
    "appliesTo": [
      "legumbres"
    ],
    "techniques": [
      "cocer",
      "guisar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Dar por hecho que todas están tiernas por un tiempo fijo.",
    "sensorySignal": "Varias piezas se aplastan o muerden con resistencia uniforme.",
    "chefQuickTip": "La legumbre manda, no el cronómetro.",
    "tags": [
      "legumbres",
      "cocer",
      "guisar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "legumbres"
      ],
      "techniques": [
        "cocer",
        "guisar"
      ],
      "actions": [
        "cocer",
        "guisar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Dar por hecho que todas están tiernas por un tiempo fijo."
      ]
    }
  },
  {
    "id": "tip-v2-084",
    "code": "TIP-084",
    "icon": "🍚",
    "title": "Añade ácido al final en legumbres",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Reserva tomate, vinagre o cítricos intensos para cuando la legumbre esté ya avanzada o tierna.",
    "shortTip": "Reserva tomate, vinagre o cítricos intensos para cuando la legumbre esté ya avanzada o tierna.",
    "explanation": "Si la receta incluye una cantidad importante de ingredientes ácidos, incorpóralos cuando la legumbre haya comenzado a ablandar o al final, salvo método probado que indique otra cosa.",
    "whyItWorks": "Un medio ácido puede ralentizar el ablandamiento de ciertas estructuras vegetales.",
    "appliesTo": [
      "alubias",
      "garbanzos",
      "lentejas"
    ],
    "techniques": [
      "guisar",
      "sazonar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Legumbres que tardan mucho en ablandar.",
    "sensorySignal": "La legumbre está tierna antes del ajuste ácido final.",
    "chefQuickTip": "Primero tierna, después ácida.",
    "tags": [
      "alubias",
      "garbanzos",
      "lentejas",
      "guisar",
      "sazonar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "alubias",
        "garbanzos",
        "lentejas"
      ],
      "techniques": [
        "guisar",
        "sazonar"
      ],
      "actions": [
        "guisar",
        "sazonar"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Legumbres que tardan mucho en ablandar."
      ]
    }
  },
  {
    "id": "tip-v2-085",
    "code": "TIP-085",
    "icon": "🍚",
    "title": "Sazona cereales al cocer",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Aporta parte del sabor al líquido de cocción, no solo al final.",
    "shortTip": "Aporta parte del sabor al líquido de cocción, no solo al final.",
    "explanation": "Utiliza agua o caldo adecuadamente sazonado y ajusta después. Evita líquidos excesivamente concentrados si luego reducirán mucho.",
    "whyItWorks": "El grano absorbe líquido durante la cocción y con él parte de los compuestos de sabor.",
    "appliesTo": [
      "arroz",
      "quinoa",
      "bulgur",
      "cuscús"
    ],
    "techniques": [
      "cocer",
      "sazonar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "básico",
    "commonError": "Cereal insípido por fuera y salado solo en superficie.",
    "sensorySignal": "El sabor está integrado en todo el grano.",
    "chefQuickTip": "Sabor desde el líquido.",
    "tags": [
      "arroz",
      "quinoa",
      "bulgur",
      "cocer",
      "sazonar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "arroz",
        "quinoa",
        "bulgur",
        "cuscús"
      ],
      "techniques": [
        "cocer",
        "sazonar"
      ],
      "actions": [
        "cocer",
        "sazonar"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Cereal insípido por fuera y salado solo en superficie."
      ]
    }
  },
  {
    "id": "tip-v2-086",
    "code": "TIP-086",
    "icon": "🍚",
    "title": "Airea el grano al final",
    "category": "Arroces, cereales y legumbres",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Suelta arroz blanco, cuscús o quinoa con tenedor en lugar de aplastarlo.",
    "shortTip": "Suelta arroz blanco, cuscús o quinoa con tenedor en lugar de aplastarlo.",
    "explanation": "Después del reposo, separa suavemente los granos con un tenedor o utensilio ligero. Evita remover con fuerza.",
    "whyItWorks": "Separar sin compactar libera vapor y conserva estructura individual.",
    "appliesTo": [
      "arroz blanco",
      "cuscús",
      "quinoa"
    ],
    "techniques": [
      "reposar",
      "airear"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Granos compactados en bloques.",
    "sensorySignal": "Los granos quedan separados y ligeros.",
    "chefQuickTip": "Suelta, no aplastes.",
    "tags": [
      "arroz blanco",
      "cuscús",
      "quinoa",
      "reposar",
      "airear",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "arroz blanco",
        "cuscús",
        "quinoa"
      ],
      "techniques": [
        "reposar",
        "airear"
      ],
      "actions": [
        "reposar",
        "airear"
      ],
      "equipment": [
        "tenedor"
      ],
      "situations": [
        "Granos compactados en bloques."
      ]
    }
  },
  {
    "id": "tip-v2-087",
    "code": "TIP-087",
    "icon": "🍝",
    "title": "Usa agua abundante y activa",
    "category": "Pasta",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Cuece la pasta en agua suficiente para que pueda moverse y recuperar hervor.",
    "shortTip": "Cuece la pasta en agua suficiente para que pueda moverse y recuperar hervor.",
    "explanation": "Utiliza una olla proporcionada y remueve al principio para evitar que las piezas se adhieran entre sí. Mantén una ebullición estable.",
    "whyItWorks": "El espacio y movimiento reducen contactos prolongados mientras el almidón superficial se hidrata.",
    "appliesTo": [
      "pasta seca",
      "pasta fresca"
    ],
    "techniques": [
      "hervir",
      "cocer"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "básico",
    "commonError": "Pasta pegada o cocción desigual.",
    "sensorySignal": "La pasta circula libremente y el agua mantiene movimiento.",
    "chefQuickTip": "Pasta con espacio.",
    "tags": [
      "pasta seca",
      "pasta fresca",
      "hervir",
      "cocer",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pasta seca",
        "pasta fresca"
      ],
      "techniques": [
        "hervir",
        "cocer"
      ],
      "actions": [
        "hervir",
        "cocer"
      ],
      "equipment": [
        "olla"
      ],
      "situations": [
        "Pasta pegada o cocción desigual."
      ]
    }
  },
  {
    "id": "tip-v2-088",
    "code": "TIP-088",
    "icon": "🍝",
    "title": "Sala el agua con moderación",
    "category": "Pasta",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Sazona el agua teniendo en cuenta que la salsa también puede aportar sal.",
    "shortTip": "Sazona el agua teniendo en cuenta que la salsa también puede aportar sal.",
    "explanation": "Añade sal antes o al comenzar la cocción y prueba la salsa antes del ajuste final. Si habrá queso curado, anchoa o embutido, sé más prudente.",
    "whyItWorks": "La pasta absorbe parte del agua y su sal durante la cocción.",
    "appliesTo": [
      "pasta"
    ],
    "techniques": [
      "hervir",
      "sazonar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "básico",
    "commonError": "Resultado demasiado salado al combinar con una salsa intensa.",
    "sensorySignal": "La pasta tiene sabor propio sin dominar la salsa.",
    "chefQuickTip": "Sazona pensando en el plato completo.",
    "tags": [
      "pasta",
      "hervir",
      "sazonar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pasta"
      ],
      "techniques": [
        "hervir",
        "sazonar"
      ],
      "actions": [
        "hervir",
        "sazonar"
      ],
      "equipment": [
        "olla"
      ],
      "situations": [
        "Resultado demasiado salado al combinar con una salsa intensa."
      ]
    }
  },
  {
    "id": "tip-v2-089",
    "code": "TIP-089",
    "icon": "🍝",
    "title": "Reserva agua de cocción",
    "category": "Pasta",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Guarda una taza del agua de la pasta antes de escurrir.",
    "shortTip": "Guarda una taza del agua de la pasta antes de escurrir.",
    "explanation": "Antes de vaciar la olla, reserva parte del agua. Añádela poco a poco al terminar la pasta con la salsa.",
    "whyItWorks": "El almidón suspendido ayuda a ligar agua y grasa y ajusta la textura sin diluir tanto como agua limpia.",
    "appliesTo": [
      "pasta"
    ],
    "techniques": [
      "emulsionar",
      "ligar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Salsa separada, demasiado espesa o que no se adhiere.",
    "sensorySignal": "La salsa se vuelve brillante y recubre la pasta.",
    "chefQuickTip": "El agua de pasta es una herramienta.",
    "tags": [
      "pasta",
      "emulsionar",
      "ligar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pasta"
      ],
      "techniques": [
        "emulsionar",
        "ligar"
      ],
      "actions": [
        "emulsionar",
        "ligar"
      ],
      "equipment": [
        "taza",
        "sartén"
      ],
      "situations": [
        "Salsa separada, demasiado espesa o que no se adhiere."
      ]
    }
  },
  {
    "id": "tip-v2-090",
    "code": "TIP-090",
    "icon": "🍝",
    "title": "Termina la pasta en la salsa",
    "category": "Pasta",
    "primaryType": "técnica",
    "secondaryType": "sabor",
    "priority": "P2",
    "text": "Escurre ligeramente antes del punto final y completa la cocción con la salsa.",
    "shortTip": "Escurre ligeramente antes del punto final y completa la cocción con la salsa.",
    "explanation": "Pasa la pasta a la sartén con la salsa cuando aún le falte un poco. Añade agua de cocción si necesita humedad y mezcla hasta ligar.",
    "whyItWorks": "La pasta absorbe sabor mientras el almidón ayuda a integrar la salsa.",
    "appliesTo": [
      "pasta"
    ],
    "techniques": [
      "saltear",
      "emulsionar",
      "ligar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Pasta y salsa que parecen dos elementos separados.",
    "sensorySignal": "La salsa se adhiere y la pasta termina en su punto.",
    "chefQuickTip": "La pasta acaba donde está la salsa.",
    "tags": [
      "pasta",
      "saltear",
      "emulsionar",
      "ligar",
      "técnica",
      "sabor"
    ],
    "triggers": {
      "ingredients": [
        "pasta"
      ],
      "techniques": [
        "saltear",
        "emulsionar",
        "ligar"
      ],
      "actions": [
        "saltear",
        "emulsionar",
        "ligar"
      ],
      "equipment": [
        "sartén",
        "pinzas"
      ],
      "situations": [
        "Pasta y salsa que parecen dos elementos separados."
      ]
    }
  },
  {
    "id": "tip-v2-091",
    "code": "TIP-091",
    "icon": "🍝",
    "title": "No enjuagues pasta caliente",
    "category": "Pasta",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "No laves la pasta después de cocer si va directamente a una salsa caliente.",
    "shortTip": "No laves la pasta después de cocer si va directamente a una salsa caliente.",
    "explanation": "Escurre y mezcla enseguida con la salsa. En preparaciones frías puede existir una razón específica para enfriar o enjuagar, pero no lo hagas por rutina.",
    "whyItWorks": "Enjuagar elimina almidón superficial útil para que la salsa se adhiera.",
    "appliesTo": [
      "pasta caliente"
    ],
    "techniques": [
      "escurrir",
      "ligar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Salsa que resbala y no se integra.",
    "sensorySignal": "La superficie conserva ligera pegajosidad antes de salsear.",
    "chefQuickTip": "Para salsa caliente, no ducha.",
    "tags": [
      "pasta caliente",
      "escurrir",
      "ligar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pasta caliente"
      ],
      "techniques": [
        "escurrir",
        "ligar"
      ],
      "actions": [
        "escurrir",
        "ligar"
      ],
      "equipment": [
        "colador"
      ],
      "situations": [
        "Salsa que resbala y no se integra."
      ]
    }
  },
  {
    "id": "tip-v2-092",
    "code": "TIP-092",
    "icon": "🍝",
    "title": "Ajusta salsa al formato",
    "category": "Pasta",
    "primaryType": "ingrediente",
    "secondaryType": "textura",
    "priority": "P3",
    "text": "Usa salsas y cortes de ingredientes que acompañen el tamaño y forma de la pasta.",
    "shortTip": "Usa salsas y cortes de ingredientes que acompañen el tamaño y forma de la pasta.",
    "explanation": "Salsas ligeras funcionan bien con formatos que puedan recubrirse; salsas con trozos agradecen cavidades o formas que los retengan. No es una ley rígida, sino una guía de textura.",
    "whyItWorks": "La geometría condiciona cómo se distribuye la salsa en cada bocado.",
    "appliesTo": [
      "pasta larga",
      "pasta corta",
      "pasta rellena"
    ],
    "techniques": [
      "salsear"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "intermedio",
    "commonError": "Salsa que queda en el plato mientras la pasta llega casi desnuda.",
    "sensorySignal": "Cada bocado arrastra una proporción equilibrada de salsa.",
    "chefQuickTip": "La forma también come salsa.",
    "tags": [
      "pasta larga",
      "pasta corta",
      "pasta rellena",
      "salsear",
      "ingrediente",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pasta larga",
        "pasta corta",
        "pasta rellena"
      ],
      "techniques": [
        "salsear"
      ],
      "actions": [
        "salsear"
      ],
      "equipment": [
        "cazuela"
      ],
      "situations": [
        "Salsa que queda en el plato mientras la pasta llega casi desnuda."
      ]
    }
  },
  {
    "id": "tip-v2-093",
    "code": "TIP-093",
    "icon": "🍝",
    "title": "Emulsiona fuera del calor fuerte",
    "category": "Pasta",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "En carbonara, cacio e pepe y salsas con queso o huevo, controla la temperatura final.",
    "shortTip": "En carbonara, cacio e pepe y salsas con queso o huevo, controla la temperatura final.",
    "explanation": "Retira o baja el fuego antes de incorporar mezclas sensibles. Usa agua de cocción y movimiento para formar una crema sin coagular en exceso.",
    "whyItWorks": "Proteínas del huevo y queso cambian rápidamente con temperaturas altas; el agua y la agitación ayudan a emulsionar.",
    "appliesTo": [
      "huevo",
      "queso",
      "pasta"
    ],
    "techniques": [
      "emulsionar",
      "mezclar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Huevo cuajado o queso apelmazado.",
    "sensorySignal": "La salsa queda cremosa, lisa y adherida.",
    "chefQuickTip": "Crema con calor controlado.",
    "tags": [
      "huevo",
      "queso",
      "pasta",
      "emulsionar",
      "mezclar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "huevo",
        "queso",
        "pasta"
      ],
      "techniques": [
        "emulsionar",
        "mezclar"
      ],
      "actions": [
        "emulsionar",
        "mezclar"
      ],
      "equipment": [
        "sartén",
        "bol"
      ],
      "situations": [
        "Huevo cuajado o queso apelmazado."
      ]
    }
  },
  {
    "id": "tip-v2-094",
    "code": "TIP-094",
    "icon": "🍝",
    "title": "Sirve pasta sin demora",
    "category": "Pasta",
    "primaryType": "organización",
    "secondaryType": "textura",
    "priority": "P3",
    "text": "Ten platos, queso y acabados listos antes de terminar la pasta.",
    "shortTip": "Ten platos, queso y acabados listos antes de terminar la pasta.",
    "explanation": "La pasta sigue absorbiendo salsa y perdiendo temperatura después de salir del fuego. Emplata en cuanto alcance la textura adecuada.",
    "whyItWorks": "El almidón continúa captando agua y la salsa espesa mientras reposa.",
    "appliesTo": [
      "pasta"
    ],
    "techniques": [
      "emplatar"
    ],
    "useMoment": [
      "antes de servir"
    ],
    "level": "básico",
    "commonError": "Pasta seca o apelmazada por esperar demasiado.",
    "sensorySignal": "Llega brillante y fluida al plato.",
    "chefQuickTip": "Pasta lista, mesa lista.",
    "tags": [
      "pasta",
      "emplatar",
      "organización",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pasta"
      ],
      "techniques": [
        "emplatar"
      ],
      "actions": [
        "emplatar"
      ],
      "equipment": [
        "platos"
      ],
      "situations": [
        "Pasta seca o apelmazada por esperar demasiado."
      ]
    }
  },
  {
    "id": "tip-v2-095",
    "code": "TIP-095",
    "icon": "🥚",
    "title": "Huevos revueltos: fuego moderado",
    "category": "Huevos",
    "primaryType": "temperatura",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Cocina revueltos con calor controlado y retíralos antes de que parezcan totalmente secos.",
    "shortTip": "Cocina revueltos con calor controlado y retíralos antes de que parezcan totalmente secos.",
    "explanation": "Remueve con espátula, regulando el fuego para formar cuajos tiernos. Retira cuando aún estén ligeramente más cremosos de lo que quieres servir.",
    "whyItWorks": "El calor residual continúa coagulación después de apartar la sartén.",
    "appliesTo": [
      "huevos"
    ],
    "techniques": [
      "cuajar",
      "remover"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Revueltos secos y granulados.",
    "sensorySignal": "Cuajos húmedos, brillantes y tiernos.",
    "chefQuickTip": "Retira con brillo.",
    "tags": [
      "huevos",
      "cuajar",
      "remover",
      "temperatura",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "huevos"
      ],
      "techniques": [
        "cuajar",
        "remover"
      ],
      "actions": [
        "cuajar",
        "remover"
      ],
      "equipment": [
        "sartén",
        "espátula"
      ],
      "situations": [
        "Revueltos secos y granulados."
      ]
    }
  },
  {
    "id": "tip-v2-096",
    "code": "TIP-096",
    "icon": "🥚",
    "title": "Casca huevos aparte",
    "category": "Huevos",
    "primaryType": "organización",
    "secondaryType": "seguridad",
    "priority": "P2",
    "text": "Rompe cada huevo en un recipiente pequeño antes de añadirlo a una mezcla importante.",
    "shortTip": "Rompe cada huevo en un recipiente pequeño antes de añadirlo a una mezcla importante.",
    "explanation": "Cascar aparte permite comprobar cáscaras, aspecto y estado sin estropear el resto de ingredientes. Es especialmente útil en repostería o cuando usas varios huevos.",
    "whyItWorks": "Aísla cada unidad antes de incorporarla al lote.",
    "appliesTo": [
      "huevos"
    ],
    "techniques": [
      "cascar",
      "mezclar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Que una cáscara o huevo defectuoso caiga en toda la preparación.",
    "sensorySignal": "Cada huevo se revisa antes de mezclar.",
    "chefQuickTip": "Uno a uno antes del bol.",
    "tags": [
      "huevos",
      "cascar",
      "mezclar",
      "organización",
      "seguridad"
    ],
    "triggers": {
      "ingredients": [
        "huevos"
      ],
      "techniques": [
        "cascar",
        "mezclar"
      ],
      "actions": [
        "cascar",
        "mezclar"
      ],
      "equipment": [
        "bol pequeño"
      ],
      "situations": [
        "Que una cáscara o huevo defectuoso caiga en toda la preparación."
      ]
    }
  },
  {
    "id": "tip-v2-097",
    "code": "TIP-097",
    "icon": "🥚",
    "title": "Escalfa con agua tranquila",
    "category": "Huevos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Para huevos escalfados, usa agua caliente con movimiento suave, no hervor violento.",
    "shortTip": "Para huevos escalfados, usa agua caliente con movimiento suave, no hervor violento.",
    "explanation": "Mantén el agua cerca del hervor pero sin grandes borbotones. Introduce el huevo suavemente y evita turbulencias excesivas.",
    "whyItWorks": "La agitación fuerte dispersa la clara antes de que coagule alrededor de la yema.",
    "appliesTo": [
      "huevos"
    ],
    "techniques": [
      "escalfar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Clara fragmentada y forma irregular.",
    "sensorySignal": "La clara envuelve la yema mientras el agua apenas se mueve.",
    "chefQuickTip": "Escalfado tranquilo.",
    "tags": [
      "huevos",
      "escalfar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "huevos"
      ],
      "techniques": [
        "escalfar"
      ],
      "actions": [
        "escalfar"
      ],
      "equipment": [
        "cazo",
        "espumadera"
      ],
      "situations": [
        "Clara fragmentada y forma irregular."
      ]
    }
  },
  {
    "id": "tip-v2-098",
    "code": "TIP-098",
    "icon": "🥚",
    "title": "Tortilla: cuaja según grosor",
    "category": "Huevos",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Ajusta fuego y tiempo al grosor de la tortilla, no solo a una receta fija.",
    "shortTip": "Ajusta fuego y tiempo al grosor de la tortilla, no solo a una receta fija.",
    "explanation": "Una tortilla gruesa necesita más control de calor para cuajar el interior sin quemar el exterior; una fina requiere menos tiempo.",
    "whyItWorks": "El calor tarda más en alcanzar el centro a medida que aumenta el espesor.",
    "appliesTo": [
      "tortilla",
      "frittata"
    ],
    "techniques": [
      "cuajar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Exterior oscuro con centro excesivamente crudo.",
    "sensorySignal": "El centro cede ligeramente sin líquido libre cuando buscas cuajado.",
    "chefQuickTip": "Más grosor, más control.",
    "tags": [
      "tortilla",
      "frittata",
      "cuajar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "tortilla",
        "frittata"
      ],
      "techniques": [
        "cuajar"
      ],
      "actions": [
        "cuajar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Exterior oscuro con centro excesivamente crudo."
      ]
    }
  },
  {
    "id": "tip-v2-099",
    "code": "TIP-099",
    "icon": "🥚",
    "title": "Bate solo lo necesario",
    "category": "Huevos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P3",
    "text": "Para tortilla o revuelto, mezcla yema y clara hasta homogeneizar sin incorporar aire excesivo salvo que lo busques.",
    "shortTip": "Para tortilla o revuelto, mezcla yema y clara hasta homogeneizar sin incorporar aire excesivo salvo que lo busques.",
    "explanation": "Usa tenedor o varilla brevemente. Si la receta necesita una textura aireada, entonces sí incorpora más aire de forma deliberada.",
    "whyItWorks": "La cantidad de aire influye en expansión y textura durante la coagulación.",
    "appliesTo": [
      "huevos"
    ],
    "techniques": [
      "batir",
      "cuajar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Textura distinta a la buscada por batido excesivo o insuficiente.",
    "sensorySignal": "La mezcla queda homogénea y sin vetas grandes de clara.",
    "chefQuickTip": "Bate con un objetivo.",
    "tags": [
      "huevos",
      "batir",
      "cuajar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "huevos"
      ],
      "techniques": [
        "batir",
        "cuajar"
      ],
      "actions": [
        "batir",
        "cuajar"
      ],
      "equipment": [
        "tenedor",
        "varilla"
      ],
      "situations": [
        "Textura distinta a la buscada por batido excesivo o insuficiente."
      ]
    }
  },
  {
    "id": "tip-v2-100",
    "code": "TIP-100",
    "icon": "🥚",
    "title": "Separa claras sin grasa",
    "category": "Huevos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Para montar claras, usa bol y varillas limpios y sin restos grasos.",
    "shortTip": "Para montar claras, usa bol y varillas limpios y sin restos grasos.",
    "explanation": "Evita que caiga yema en las claras y limpia el recipiente si tiene grasa. Monta después según la firmeza necesaria.",
    "whyItWorks": "La grasa interfiere con la red de proteínas que estabiliza la espuma.",
    "appliesTo": [
      "claras de huevo"
    ],
    "techniques": [
      "montar",
      "batir"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Claras que no ganan volumen o colapsan.",
    "sensorySignal": "La espuma aumenta de volumen y mantiene picos definidos.",
    "chefQuickTip": "Para montar: limpio y sin grasa.",
    "tags": [
      "claras de huevo",
      "montar",
      "batir",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "claras de huevo"
      ],
      "techniques": [
        "montar",
        "batir"
      ],
      "actions": [
        "montar",
        "batir"
      ],
      "equipment": [
        "bol",
        "varillas"
      ],
      "situations": [
        "Claras que no ganan volumen o colapsan."
      ]
    }
  },
  {
    "id": "tip-v2-101",
    "code": "TIP-101",
    "icon": "🥚",
    "title": "Yemas para emulsionar sin sobrecalor",
    "category": "Huevos",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Controla la temperatura cuando una salsa depende de yema.",
    "shortTip": "Controla la temperatura cuando una salsa depende de yema.",
    "explanation": "Incorpora calor progresivamente y remueve de forma continua. Si trabajas al baño maría, evita que el recipiente reciba calor agresivo.",
    "whyItWorks": "Las proteínas de la yema ayudan a emulsionar, pero coagulan si reciben demasiado calor.",
    "appliesTo": [
      "yema",
      "salsas con huevo"
    ],
    "techniques": [
      "emulsionar",
      "baño maría"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "avanzado",
    "commonError": "Salsa cortada o con grumos de huevo.",
    "sensorySignal": "La salsa espesa manteniendo textura lisa y brillante.",
    "chefQuickTip": "Yema: calor suave, movimiento continuo.",
    "tags": [
      "yema",
      "salsas con huevo",
      "emulsionar",
      "baño maría",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "yema",
        "salsas con huevo"
      ],
      "techniques": [
        "emulsionar",
        "baño maría"
      ],
      "actions": [
        "emulsionar",
        "baño maría"
      ],
      "equipment": [
        "bol",
        "cazo",
        "varilla"
      ],
      "situations": [
        "Salsa cortada o con grumos de huevo."
      ]
    }
  },
  {
    "id": "tip-v2-102",
    "code": "TIP-102",
    "icon": "🥣",
    "title": "Reduce antes de espesar",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Antes de añadir espesante, concentra la salsa hasta aproximarte al sabor y volumen deseados.",
    "shortTip": "Antes de añadir espesante, concentra la salsa hasta aproximarte al sabor y volumen deseados.",
    "explanation": "Deja evaporar parte del agua y prueba. Solo después decide si necesita harina, almidón, mantequilla u otro espesante.",
    "whyItWorks": "La reducción concentra sabor y sólidos; espesar demasiado pronto puede dejar una salsa voluminosa pero insípida.",
    "appliesTo": [
      "salsas",
      "jugos",
      "fondos"
    ],
    "techniques": [
      "reducir",
      "espesar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Salsa espesa pero acuosa de sabor.",
    "sensorySignal": "El sabor se concentra antes de ajustar la textura.",
    "chefQuickTip": "Primero concentra, luego espesa.",
    "tags": [
      "salsas",
      "jugos",
      "fondos",
      "reducir",
      "espesar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "jugos",
        "fondos"
      ],
      "techniques": [
        "reducir",
        "espesar"
      ],
      "actions": [
        "reducir",
        "espesar"
      ],
      "equipment": [
        "cazo"
      ],
      "situations": [
        "Salsa espesa pero acuosa de sabor."
      ]
    }
  },
  {
    "id": "tip-v2-103",
    "code": "TIP-103",
    "icon": "🥣",
    "title": "Añade espesante poco a poco",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Incorpora roux, almidón o puré en etapas y observa la textura entre adiciones.",
    "shortTip": "Incorpora roux, almidón o puré en etapas y observa la textura entre adiciones.",
    "explanation": "No añadas toda la cantidad de golpe. Deja que el espesante actúe y que la salsa vuelva a hervir suavemente cuando corresponda antes de decidir si necesita más.",
    "whyItWorks": "Muchos espesantes desarrollan su efecto con calor y tiempo, no de forma instantánea.",
    "appliesTo": [
      "salsas",
      "cremas",
      "guisos"
    ],
    "techniques": [
      "espesar",
      "ligar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Salsa excesivamente densa difícil de corregir.",
    "sensorySignal": "La viscosidad aumenta de manera progresiva y controlada.",
    "chefQuickTip": "Espesar es más fácil que adelgazar.",
    "tags": [
      "salsas",
      "cremas",
      "guisos",
      "espesar",
      "ligar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "cremas",
        "guisos"
      ],
      "techniques": [
        "espesar",
        "ligar"
      ],
      "actions": [
        "espesar",
        "ligar"
      ],
      "equipment": [
        "cazo",
        "varilla"
      ],
      "situations": [
        "Salsa excesivamente densa difícil de corregir."
      ]
    }
  },
  {
    "id": "tip-v2-104",
    "code": "TIP-104",
    "icon": "🥣",
    "title": "Disuelve almidón en frío",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Mezcla maicena u otros almidones finos con líquido frío antes de incorporarlos.",
    "shortTip": "Mezcla maicena u otros almidones finos con líquido frío antes de incorporarlos.",
    "explanation": "Forma una suspensión lisa sin grumos y añádela poco a poco al líquido caliente mientras remueves.",
    "whyItWorks": "El almidón seco añadido directamente a líquido caliente gelatiniza en la superficie y puede formar grumos.",
    "appliesTo": [
      "maicena",
      "almidón"
    ],
    "techniques": [
      "espesar",
      "mezclar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Grumos de almidón en la salsa.",
    "sensorySignal": "La mezcla previa es completamente lisa.",
    "chefQuickTip": "Almidón primero en frío.",
    "tags": [
      "maicena",
      "almidón",
      "espesar",
      "mezclar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "maicena",
        "almidón"
      ],
      "techniques": [
        "espesar",
        "mezclar"
      ],
      "actions": [
        "espesar",
        "mezclar"
      ],
      "equipment": [
        "bol",
        "varilla"
      ],
      "situations": [
        "Grumos de almidón en la salsa."
      ]
    }
  },
  {
    "id": "tip-v2-105",
    "code": "TIP-105",
    "icon": "🥣",
    "title": "Monta con mantequilla fría",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Termina determinadas salsas con dados de mantequilla fría fuera o casi fuera del fuego.",
    "shortTip": "Termina determinadas salsas con dados de mantequilla fría fuera o casi fuera del fuego.",
    "explanation": "Añade pequeñas porciones mientras mueves la salsa y evita hervir con fuerza después. Ajusta la cantidad al estilo del plato.",
    "whyItWorks": "La mantequilla aporta grasa y agua que pueden formar una emulsión temporal y dar brillo y cuerpo.",
    "appliesTo": [
      "salsas de vino",
      "jugos",
      "reducciones"
    ],
    "techniques": [
      "montar",
      "emulsionar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Salsa grasienta o separada.",
    "sensorySignal": "Queda brillante, homogénea y ligeramente más densa.",
    "chefQuickTip": "Mantequilla fría, salsa brillante.",
    "tags": [
      "salsas de vino",
      "jugos",
      "reducciones",
      "montar",
      "emulsionar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "salsas de vino",
        "jugos",
        "reducciones"
      ],
      "techniques": [
        "montar",
        "emulsionar"
      ],
      "actions": [
        "montar",
        "emulsionar"
      ],
      "equipment": [
        "cazo",
        "varilla"
      ],
      "situations": [
        "Salsa grasienta o separada."
      ]
    }
  },
  {
    "id": "tip-v2-106",
    "code": "TIP-106",
    "icon": "🥣",
    "title": "Aceite en hilo para emulsiones",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P1",
    "text": "Incorpora el aceite gradualmente cuando montes mayonesa o vinagreta estable.",
    "shortTip": "Incorpora el aceite gradualmente cuando montes mayonesa o vinagreta estable.",
    "explanation": "Empieza con una fase acuosa bien mezclada y añade el aceite poco a poco mientras bates. Cuando la emulsión sea estable, puedes aumentar ligeramente el caudal.",
    "whyItWorks": "La incorporación gradual facilita dividir la grasa en gotas pequeñas rodeadas por emulsificantes.",
    "appliesTo": [
      "mayonesa",
      "alioli",
      "vinagreta"
    ],
    "techniques": [
      "emulsionar",
      "batir"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Emulsión cortada por exceso de aceite inicial.",
    "sensorySignal": "La mezcla espesa de forma uniforme y sin charcos de aceite.",
    "chefQuickTip": "Primero gota; luego hilo.",
    "tags": [
      "mayonesa",
      "alioli",
      "vinagreta",
      "emulsionar",
      "batir",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "mayonesa",
        "alioli",
        "vinagreta"
      ],
      "techniques": [
        "emulsionar",
        "batir"
      ],
      "actions": [
        "emulsionar",
        "batir"
      ],
      "equipment": [
        "batidora",
        "varilla"
      ],
      "situations": [
        "Emulsión cortada por exceso de aceite inicial."
      ]
    }
  },
  {
    "id": "tip-v2-107",
    "code": "TIP-107",
    "icon": "🥣",
    "title": "Corrige una emulsión con nueva base",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "aprovechamiento",
    "priority": "P2",
    "text": "Si una mayonesa se corta, empieza con una pequeña base acuosa y reincorpora la mezcla poco a poco.",
    "shortTip": "Si una mayonesa se corta, empieza con una pequeña base acuosa y reincorpora la mezcla poco a poco.",
    "explanation": "Coloca una cucharadita de agua, yema o mostaza según receta en un recipiente limpio y ve añadiendo la emulsión cortada gradualmente mientras bates.",
    "whyItWorks": "Crear una nueva fase continua permite volver a dispersar la grasa en gotas pequeñas.",
    "appliesTo": [
      "mayonesa",
      "alioli",
      "emulsiones"
    ],
    "techniques": [
      "emulsionar",
      "batir"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Desechar una emulsión recuperable.",
    "sensorySignal": "La mezcla vuelve a espesar y pierde el aspecto aceitoso.",
    "chefQuickTip": "Una emulsión rota puede volver.",
    "tags": [
      "mayonesa",
      "alioli",
      "emulsiones",
      "emulsionar",
      "batir",
      "técnica",
      "aprovechamiento"
    ],
    "triggers": {
      "ingredients": [
        "mayonesa",
        "alioli",
        "emulsiones"
      ],
      "techniques": [
        "emulsionar",
        "batir"
      ],
      "actions": [
        "emulsionar",
        "batir"
      ],
      "equipment": [
        "bol",
        "batidora"
      ],
      "situations": [
        "Desechar una emulsión recuperable."
      ]
    }
  },
  {
    "id": "tip-v2-108",
    "code": "TIP-108",
    "icon": "🥣",
    "title": "Desengrasa un fondo antes de reducir",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Retira exceso de grasa superficial antes de concentrar un fondo o jugo.",
    "shortTip": "Retira exceso de grasa superficial antes de concentrar un fondo o jugo.",
    "explanation": "Deja reposar brevemente, retira con cuchara o separador y después reduce. Conserva algo de grasa solo si forma parte deliberada del resultado.",
    "whyItWorks": "Al reducir, cualquier grasa y sabor se concentran; retirar exceso evita una salsa pesada.",
    "appliesTo": [
      "fondos",
      "jugos de asado"
    ],
    "techniques": [
      "desgrasar",
      "reducir"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Salsa aceitosa y pesada.",
    "sensorySignal": "La superficie queda limpia antes de reducir.",
    "chefQuickTip": "Reduce sabor, no grasa sobrante.",
    "tags": [
      "fondos",
      "jugos de asado",
      "desgrasar",
      "reducir",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "fondos",
        "jugos de asado"
      ],
      "techniques": [
        "desgrasar",
        "reducir"
      ],
      "actions": [
        "desgrasar",
        "reducir"
      ],
      "equipment": [
        "cucharón",
        "separador"
      ],
      "situations": [
        "Salsa aceitosa y pesada."
      ]
    }
  },
  {
    "id": "tip-v2-109",
    "code": "TIP-109",
    "icon": "🥣",
    "title": "Espuma un fondo al principio",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "presentación",
    "priority": "P2",
    "text": "Retira impurezas que suben a la superficie durante las primeras fases de un fondo.",
    "shortTip": "Retira impurezas que suben a la superficie durante las primeras fases de un fondo.",
    "explanation": "Cuando aparezca espuma grisácea o partículas, retíralas suavemente sin remover el fondo en exceso.",
    "whyItWorks": "Proteínas coaguladas y partículas pueden enturbiar el caldo si se dispersan de nuevo.",
    "appliesTo": [
      "caldos",
      "fondos"
    ],
    "techniques": [
      "espumar",
      "hervir"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Fondo turbio y con impurezas suspendidas.",
    "sensorySignal": "La superficie queda limpia y el líquido más claro.",
    "chefQuickTip": "Lo que sube, se retira.",
    "tags": [
      "caldos",
      "fondos",
      "espumar",
      "hervir",
      "técnica",
      "presentación"
    ],
    "triggers": {
      "ingredients": [
        "caldos",
        "fondos"
      ],
      "techniques": [
        "espumar",
        "hervir"
      ],
      "actions": [
        "espumar",
        "hervir"
      ],
      "equipment": [
        "espumadera"
      ],
      "situations": [
        "Fondo turbio y con impurezas suspendidas."
      ]
    }
  },
  {
    "id": "tip-v2-110",
    "code": "TIP-110",
    "icon": "🥣",
    "title": "Tuesta huesos y verduras si buscas intensidad",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Dora ingredientes de un fondo oscuro antes de cubrir con agua.",
    "shortTip": "Dora ingredientes de un fondo oscuro antes de cubrir con agua.",
    "explanation": "Asa huesos y verduras hasta desarrollar color marrón profundo sin quemarlos. Desglasa la bandeja e incorpora esos jugos.",
    "whyItWorks": "El dorado genera compuestos aromáticos que enriquecen el fondo final.",
    "appliesTo": [
      "huesos",
      "verduras para fondo"
    ],
    "techniques": [
      "asar",
      "desglasar",
      "hacer fondo"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "avanzado",
    "commonError": "Fondo oscuro con poco carácter o notas quemadas.",
    "sensorySignal": "Color marrón intenso sin zonas negras predominantes.",
    "chefQuickTip": "Oscuro viene de dorado, no de quemado.",
    "tags": [
      "huesos",
      "verduras para fondo",
      "asar",
      "desglasar",
      "hacer fondo",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "huesos",
        "verduras para fondo"
      ],
      "techniques": [
        "asar",
        "desglasar",
        "hacer fondo"
      ],
      "actions": [
        "asar",
        "desglasar",
        "hacer fondo"
      ],
      "equipment": [
        "horno",
        "bandeja",
        "olla"
      ],
      "situations": [
        "Fondo oscuro con poco carácter o notas quemadas."
      ]
    }
  },
  {
    "id": "tip-v2-111",
    "code": "TIP-111",
    "icon": "🥣",
    "title": "Cuela sin aplastar",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "técnica",
    "secondaryType": "presentación",
    "priority": "P3",
    "text": "Para un caldo limpio, deja que escurra por el colador sin presionar sólidos en exceso.",
    "shortTip": "Para un caldo limpio, deja que escurra por el colador sin presionar sólidos en exceso.",
    "explanation": "Vierte con cuidado y permite que el líquido pase. Si exprimes fuertemente verduras o restos, obtendrás más rendimiento pero también más partículas.",
    "whyItWorks": "La presión fuerza sólidos finos a atravesar o enturbiar el líquido.",
    "appliesTo": [
      "caldos",
      "fondos",
      "consomés"
    ],
    "techniques": [
      "colar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Caldo turbio por exprimir los sólidos.",
    "sensorySignal": "El líquido queda claro y con pocos sedimentos.",
    "chefQuickTip": "Para claridad, no exprimas.",
    "tags": [
      "caldos",
      "fondos",
      "consomés",
      "colar",
      "técnica",
      "presentación"
    ],
    "triggers": {
      "ingredients": [
        "caldos",
        "fondos",
        "consomés"
      ],
      "techniques": [
        "colar"
      ],
      "actions": [
        "colar"
      ],
      "equipment": [
        "colador",
        "estameña"
      ],
      "situations": [
        "Caldo turbio por exprimir los sólidos."
      ]
    }
  },
  {
    "id": "tip-v2-112",
    "code": "TIP-112",
    "icon": "🥣",
    "title": "Prueba después de reducir",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Ajusta sal y acidez al final de una reducción importante.",
    "shortTip": "Ajusta sal y acidez al final de una reducción importante.",
    "explanation": "Puedes sazonar ligeramente al principio, pero deja el ajuste fino para cuando el volumen se haya reducido.",
    "whyItWorks": "Al evaporarse agua, sal, azúcar y otros solutos se concentran.",
    "appliesTo": [
      "salsas",
      "fondos",
      "glaseados"
    ],
    "techniques": [
      "reducir",
      "sazonar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Salsa demasiado salada tras concentrarla.",
    "sensorySignal": "El equilibrio final se decide con el volumen definitivo.",
    "chefQuickTip": "Reduce primero, ajusta después.",
    "tags": [
      "salsas",
      "fondos",
      "glaseados",
      "reducir",
      "sazonar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "fondos",
        "glaseados"
      ],
      "techniques": [
        "reducir",
        "sazonar"
      ],
      "actions": [
        "reducir",
        "sazonar"
      ],
      "equipment": [
        "cazo"
      ],
      "situations": [
        "Salsa demasiado salada tras concentrarla."
      ]
    }
  },
  {
    "id": "tip-v2-113",
    "code": "TIP-113",
    "icon": "🥣",
    "title": "Equilibra grasa con ácido",
    "category": "Salsas, emulsiones y fondos",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Usa acidez para dar frescura a salsas grasas, sin ocultar su sabor principal.",
    "shortTip": "Usa acidez para dar frescura a salsas grasas, sin ocultar su sabor principal.",
    "explanation": "Añade limón, vinagre u otro ácido en pequeñas dosis y prueba entre cada una. Busca contraste, no que la salsa sepa únicamente a ácido.",
    "whyItWorks": "La acidez aumenta la percepción de frescura y puede equilibrar sensaciones grasas.",
    "appliesTo": [
      "salsas de mantequilla",
      "mayonesa",
      "jugos grasos"
    ],
    "techniques": [
      "aliñar",
      "emulsionar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Salsa pesada y plana o, al contrario, excesivamente ácida.",
    "sensorySignal": "La salsa parece más viva sin perder cuerpo.",
    "chefQuickTip": "Grasa pide contraste.",
    "tags": [
      "salsas de mantequilla",
      "mayonesa",
      "jugos grasos",
      "aliñar",
      "emulsionar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas de mantequilla",
        "mayonesa",
        "jugos grasos"
      ],
      "techniques": [
        "aliñar",
        "emulsionar"
      ],
      "actions": [
        "aliñar",
        "emulsionar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Salsa pesada y plana o, al contrario, excesivamente ácida."
      ]
    }
  },
  {
    "id": "tip-v2-114",
    "code": "TIP-114",
    "icon": "🌿",
    "title": "Tuesta especias enteras",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Calienta brevemente especias enteras en seco antes de moler cuando quieras más aroma.",
    "shortTip": "Calienta brevemente especias enteras en seco antes de moler cuando quieras más aroma.",
    "explanation": "Usa fuego medio-bajo y mueve continuamente. Retira en cuanto desprendan aroma; no esperes a que ennegrezcan.",
    "whyItWorks": "El calor volatiliza y libera compuestos aromáticos presentes en aceites esenciales.",
    "appliesTo": [
      "comino",
      "coriandro",
      "pimienta",
      "semillas"
    ],
    "techniques": [
      "tostar",
      "moler"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Especias apagadas o quemadas.",
    "sensorySignal": "El aroma aumenta claramente antes de cambiar mucho de color.",
    "chefQuickTip": "Aroma primero, humo nunca.",
    "tags": [
      "comino",
      "coriandro",
      "pimienta",
      "tostar",
      "moler",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "comino",
        "coriandro",
        "pimienta",
        "semillas"
      ],
      "techniques": [
        "tostar",
        "moler"
      ],
      "actions": [
        "tostar",
        "moler"
      ],
      "equipment": [
        "sartén",
        "mortero"
      ],
      "situations": [
        "Especias apagadas o quemadas."
      ]
    }
  },
  {
    "id": "tip-v2-115",
    "code": "TIP-115",
    "icon": "🌿",
    "title": "Especias molidas: calor breve",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "temperatura",
    "priority": "P1",
    "text": "Añade especias molidas con algo de grasa y cocínalas solo hasta que sean aromáticas.",
    "shortTip": "Añade especias molidas con algo de grasa y cocínalas solo hasta que sean aromáticas.",
    "explanation": "Incorpóralas en una fase con humedad o grasa suficiente y evita dejarlas solas demasiado tiempo sobre calor intenso.",
    "whyItWorks": "Las partículas pequeñas tienen mucha superficie y pueden quemarse con rapidez.",
    "appliesTo": [
      "pimentón",
      "curry",
      "cúrcuma",
      "comino molido"
    ],
    "techniques": [
      "sofreír",
      "sazonar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Sabor amargo por especias quemadas.",
    "sensorySignal": "Desprenden aroma intenso sin oscurecer en exceso.",
    "chefQuickTip": "Especia molida: segundos, no minutos.",
    "tags": [
      "pimentón",
      "curry",
      "cúrcuma",
      "sofreír",
      "sazonar",
      "sabor",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "pimentón",
        "curry",
        "cúrcuma",
        "comino molido"
      ],
      "techniques": [
        "sofreír",
        "sazonar"
      ],
      "actions": [
        "sofreír",
        "sazonar"
      ],
      "equipment": [
        "sartén"
      ],
      "situations": [
        "Sabor amargo por especias quemadas."
      ]
    }
  },
  {
    "id": "tip-v2-116",
    "code": "TIP-116",
    "icon": "🌿",
    "title": "Hierbas tiernas al final",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "ingrediente",
    "priority": "P1",
    "text": "Añade perejil, cilantro, albahaca o cebollino cerca del final cuando quieras frescura.",
    "shortTip": "Añade perejil, cilantro, albahaca o cebollino cerca del final cuando quieras frescura.",
    "explanation": "Pica justo antes de usar y reserva una parte para terminar el plato. En cocciones largas, utiliza tallos o hierbas resistentes cuando encajen.",
    "whyItWorks": "Muchos aromas frescos son volátiles y disminuyen con calor prolongado.",
    "appliesTo": [
      "perejil",
      "cilantro",
      "albahaca",
      "cebollino"
    ],
    "techniques": [
      "picar",
      "sazonar"
    ],
    "useMoment": [
      "final de cocción",
      "antes de servir"
    ],
    "level": "básico",
    "commonError": "Aroma apagado y color oscuro.",
    "sensorySignal": "La hierba mantiene color vivo y perfume reconocible.",
    "chefQuickTip": "Fresca al final.",
    "tags": [
      "perejil",
      "cilantro",
      "albahaca",
      "picar",
      "sazonar",
      "sabor",
      "ingrediente"
    ],
    "triggers": {
      "ingredients": [
        "perejil",
        "cilantro",
        "albahaca",
        "cebollino"
      ],
      "techniques": [
        "picar",
        "sazonar"
      ],
      "actions": [
        "picar",
        "sazonar"
      ],
      "equipment": [
        "cuchillo"
      ],
      "situations": [
        "Aroma apagado y color oscuro."
      ]
    }
  },
  {
    "id": "tip-v2-117",
    "code": "TIP-117",
    "icon": "🌿",
    "title": "Hierbas leñosas antes",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "ingrediente",
    "priority": "P2",
    "text": "Romero, tomillo o laurel pueden entrar antes en guisos y asados.",
    "shortTip": "Romero, tomillo o laurel pueden entrar antes en guisos y asados.",
    "explanation": "Añádelas al inicio o durante la cocción para que perfumen grasas y líquidos. Retira tallos o hojas duras antes de servir si molestan.",
    "whyItWorks": "Sus estructuras y aceites resisten mejor una extracción prolongada.",
    "appliesTo": [
      "romero",
      "tomillo",
      "laurel"
    ],
    "techniques": [
      "guisar",
      "asar",
      "infusionar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "básico",
    "commonError": "Añadirlas demasiado tarde y obtener poca integración aromática.",
    "sensorySignal": "El aroma aparece integrado, no solo superficial.",
    "chefQuickTip": "Hierba resistente, tiempo largo.",
    "tags": [
      "romero",
      "tomillo",
      "laurel",
      "guisar",
      "asar",
      "infusionar",
      "sabor",
      "ingrediente"
    ],
    "triggers": {
      "ingredients": [
        "romero",
        "tomillo",
        "laurel"
      ],
      "techniques": [
        "guisar",
        "asar",
        "infusionar"
      ],
      "actions": [
        "guisar",
        "asar",
        "infusionar"
      ],
      "equipment": [
        "cazuela",
        "horno"
      ],
      "situations": [
        "Añadirlas demasiado tarde y obtener poca integración aromática."
      ]
    }
  },
  {
    "id": "tip-v2-118",
    "code": "TIP-118",
    "icon": "🌿",
    "title": "Prueba en capas",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Ajusta el sabor varias veces durante la receta, no únicamente al final.",
    "shortTip": "Ajusta el sabor varias veces durante la receta, no únicamente al final.",
    "explanation": "Prueba después de cada transformación importante: reducción, incorporación de caldo, salsa, queso o condimento. Haz pequeños ajustes.",
    "whyItWorks": "Cada etapa cambia concentración, grasa, sal, dulzor y acidez.",
    "appliesTo": [
      "guisos",
      "salsas",
      "arroces",
      "cremas"
    ],
    "techniques": [
      "sazonar",
      "probar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Intentar corregir de golpe un plato desequilibrado al final.",
    "sensorySignal": "El sabor progresa de forma controlada.",
    "chefQuickTip": "Prueba después de cada gran cambio.",
    "tags": [
      "guisos",
      "salsas",
      "arroces",
      "sazonar",
      "probar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "guisos",
        "salsas",
        "arroces",
        "cremas"
      ],
      "techniques": [
        "sazonar",
        "probar"
      ],
      "actions": [
        "sazonar",
        "probar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Intentar corregir de golpe un plato desequilibrado al final."
      ]
    }
  },
  {
    "id": "tip-v2-119",
    "code": "TIP-119",
    "icon": "🌿",
    "title": "Ácido para despertar",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Si un plato está plano pero ya tiene suficiente sal, prueba una pequeña cantidad de ácido.",
    "shortTip": "Si un plato está plano pero ya tiene suficiente sal, prueba una pequeña cantidad de ácido.",
    "explanation": "Añade unas gotas de limón o vinagre y vuelve a probar. No conviertas el ácido en una corrección automática: úsalo cuando el conjunto necesite contraste.",
    "whyItWorks": "La acidez modifica el equilibrio gustativo y puede hacer más perceptibles otros sabores.",
    "appliesTo": [
      "guisos",
      "salsas",
      "verduras",
      "pescados"
    ],
    "techniques": [
      "sazonar",
      "aliñar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Seguir añadiendo sal cuando el problema es falta de contraste.",
    "sensorySignal": "El sabor se percibe más vivo sin dominar el ácido.",
    "chefQuickTip": "Plano no siempre significa poca sal.",
    "tags": [
      "guisos",
      "salsas",
      "verduras",
      "sazonar",
      "aliñar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "guisos",
        "salsas",
        "verduras",
        "pescados"
      ],
      "techniques": [
        "sazonar",
        "aliñar"
      ],
      "actions": [
        "sazonar",
        "aliñar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Seguir añadiendo sal cuando el problema es falta de contraste."
      ]
    }
  },
  {
    "id": "tip-v2-120",
    "code": "TIP-120",
    "icon": "🌿",
    "title": "Dulzor para redondear, no ocultar",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Usa una pequeña nota dulce solo cuando ayude a equilibrar acidez o amargor.",
    "shortTip": "Usa una pequeña nota dulce solo cuando ayude a equilibrar acidez o amargor.",
    "explanation": "Añade azúcar, miel u otro ingrediente dulce en cantidades pequeñas y prueba. No lo uses para tapar un sofrito quemado o ingredientes defectuosos.",
    "whyItWorks": "El dulzor puede moderar la percepción de acidez y amargor, pero también puede dominar rápidamente.",
    "appliesTo": [
      "salsas de tomate",
      "aliños",
      "glaseados"
    ],
    "techniques": [
      "sazonar",
      "equilibrar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Salsa empalagosa por corregir en exceso.",
    "sensorySignal": "El conjunto se redondea sin resultar claramente dulce.",
    "chefQuickTip": "Redondea; no maquilles.",
    "tags": [
      "salsas de tomate",
      "aliños",
      "glaseados",
      "sazonar",
      "equilibrar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas de tomate",
        "aliños",
        "glaseados"
      ],
      "techniques": [
        "sazonar",
        "equilibrar"
      ],
      "actions": [
        "sazonar",
        "equilibrar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Salsa empalagosa por corregir en exceso."
      ]
    }
  },
  {
    "id": "tip-v2-121",
    "code": "TIP-121",
    "icon": "🌿",
    "title": "Umami con moderación",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "ingrediente",
    "priority": "P2",
    "text": "Añade ingredientes umami para profundidad, teniendo en cuenta también su sal.",
    "shortTip": "Añade ingredientes umami para profundidad, teniendo en cuenta también su sal.",
    "explanation": "Parmesano, anchoa, salsa de soja, miso, tomate concentrado o setas pueden reforzar sabor. Incorpora cantidades pequeñas y reevalúa el sazonado.",
    "whyItWorks": "Los glutamatos y nucleótidos intensifican la percepción sabrosa, y muchos ingredientes umami son además salados.",
    "appliesTo": [
      "parmesano",
      "anchoa",
      "soja",
      "miso",
      "setas"
    ],
    "techniques": [
      "sazonar",
      "reducir"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Plato excesivamente salado al añadir varios potenciadores.",
    "sensorySignal": "El sabor gana profundidad sin identificar necesariamente un único ingrediente.",
    "chefQuickTip": "Umami suma; la sal también.",
    "tags": [
      "parmesano",
      "anchoa",
      "soja",
      "sazonar",
      "reducir",
      "sabor",
      "ingrediente"
    ],
    "triggers": {
      "ingredients": [
        "parmesano",
        "anchoa",
        "soja",
        "miso",
        "setas"
      ],
      "techniques": [
        "sazonar",
        "reducir"
      ],
      "actions": [
        "sazonar",
        "reducir"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Plato excesivamente salado al añadir varios potenciadores."
      ]
    }
  },
  {
    "id": "tip-v2-122",
    "code": "TIP-122",
    "icon": "🌿",
    "title": "Muele pimienta al momento",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "ingrediente",
    "priority": "P3",
    "text": "Cuando el aroma importe, muele la pimienta justo antes de usarla.",
    "shortTip": "Cuando el aroma importe, muele la pimienta justo antes de usarla.",
    "explanation": "Añádela al final o durante la cocción según el plato, pero evita dejar grandes cantidades molidas durante semanas.",
    "whyItWorks": "Los aromas volátiles se pierden más rápido cuando la especia aumenta su superficie al molerse.",
    "appliesTo": [
      "pimienta"
    ],
    "techniques": [
      "moler",
      "sazonar"
    ],
    "useMoment": [
      "durante la preparación",
      "antes de servir"
    ],
    "level": "básico",
    "commonError": "Pimienta con picor pero poco aroma.",
    "sensorySignal": "El perfume aparece inmediatamente al moler.",
    "chefQuickTip": "Recién molida, más aroma.",
    "tags": [
      "pimienta",
      "moler",
      "sazonar",
      "sabor",
      "ingrediente"
    ],
    "triggers": {
      "ingredients": [
        "pimienta"
      ],
      "techniques": [
        "moler",
        "sazonar"
      ],
      "actions": [
        "moler",
        "sazonar"
      ],
      "equipment": [
        "molinillo"
      ],
      "situations": [
        "Pimienta con picor pero poco aroma."
      ]
    }
  },
  {
    "id": "tip-v2-123",
    "code": "TIP-123",
    "icon": "🌿",
    "title": "Sala por componentes",
    "category": "Condimentos, especias, hierbas y equilibrio de sabor",
    "primaryType": "sabor",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Sazona cada componente de un plato teniendo en cuenta cómo se combinarán al final.",
    "shortTip": "Sazona cada componente de un plato teniendo en cuenta cómo se combinarán al final.",
    "explanation": "Una guarnición, salsa y proteína no necesitan estar cada una al máximo de sal. Prueba el conjunto antes del último ajuste.",
    "whyItWorks": "La percepción final resulta de la suma de todos los elementos en el mismo bocado.",
    "appliesTo": [
      "platos compuestos",
      "salsas",
      "guarniciones"
    ],
    "techniques": [
      "sazonar",
      "emplatar"
    ],
    "useMoment": [
      "antes de servir"
    ],
    "level": "intermedio",
    "commonError": "Cada componente está bien por separado pero el plato completo queda salado.",
    "sensorySignal": "El bocado completo mantiene equilibrio.",
    "chefQuickTip": "Sala el plato, no cada isla.",
    "tags": [
      "platos compuestos",
      "salsas",
      "guarniciones",
      "sazonar",
      "emplatar",
      "sabor",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "guarniciones"
      ],
      "techniques": [
        "sazonar",
        "emplatar"
      ],
      "actions": [
        "sazonar",
        "emplatar"
      ],
      "equipment": [
        "cuchara"
      ],
      "situations": [
        "Cada componente está bien por separado pero el plato completo queda salado."
      ]
    }
  },
  {
    "id": "tip-v2-124",
    "code": "TIP-124",
    "icon": "♨️",
    "title": "Precalienta de verdad",
    "category": "Horno, asados y gratinados",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Introduce la preparación cuando el horno haya alcanzado una temperatura estable.",
    "shortTip": "Introduce la preparación cuando el horno haya alcanzado una temperatura estable.",
    "explanation": "No te fíes solo del tiempo desde que lo encendiste; espera a la señal del horno y, en recetas sensibles, deja estabilizar unos minutos adicionales.",
    "whyItWorks": "La fase inicial determina expansión, dorado y velocidad de cocción en muchas recetas.",
    "appliesTo": [
      "pan",
      "bizcochos",
      "asados",
      "verduras"
    ],
    "techniques": [
      "hornear",
      "asar"
    ],
    "useMoment": [
      "antes de cocinar"
    ],
    "level": "básico",
    "commonError": "Alterar tiempos y textura por empezar en un horno frío.",
    "sensorySignal": "El horno mantiene la temperatura seleccionada antes de introducir la bandeja.",
    "chefQuickTip": "Horno listo antes de entrar.",
    "tags": [
      "pan",
      "bizcochos",
      "asados",
      "hornear",
      "asar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pan",
        "bizcochos",
        "asados",
        "verduras"
      ],
      "techniques": [
        "hornear",
        "asar"
      ],
      "actions": [
        "hornear",
        "asar"
      ],
      "equipment": [
        "horno"
      ],
      "situations": [
        "Alterar tiempos y textura por empezar en un horno frío."
      ]
    }
  },
  {
    "id": "tip-v2-125",
    "code": "TIP-125",
    "icon": "♨️",
    "title": "No abras sin necesidad",
    "category": "Horno, asados y gratinados",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Evita abrir el horno repetidamente, sobre todo en panes y repostería durante la fase inicial.",
    "shortTip": "Evita abrir el horno repetidamente, sobre todo en panes y repostería durante la fase inicial.",
    "explanation": "Observa por el cristal cuando sea posible y abre solo cuando necesites girar, comprobar o añadir algo.",
    "whyItWorks": "Cada apertura libera aire caliente y vapor y altera temporalmente la temperatura de la cámara.",
    "appliesTo": [
      "bizcochos",
      "pan",
      "soufflés",
      "asados"
    ],
    "techniques": [
      "hornear",
      "asar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Caídas de temperatura y cocción irregular.",
    "sensorySignal": "La cámara mantiene calor estable durante los momentos críticos.",
    "chefQuickTip": "Mira primero; abre después.",
    "tags": [
      "bizcochos",
      "pan",
      "soufflés",
      "hornear",
      "asar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "bizcochos",
        "pan",
        "soufflés",
        "asados"
      ],
      "techniques": [
        "hornear",
        "asar"
      ],
      "actions": [
        "hornear",
        "asar"
      ],
      "equipment": [
        "horno"
      ],
      "situations": [
        "Caídas de temperatura y cocción irregular."
      ]
    }
  },
  {
    "id": "tip-v2-126",
    "code": "TIP-126",
    "icon": "♨️",
    "title": "Gira la bandeja si tu horno dora desigual",
    "category": "Horno, asados y gratinados",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Compensa puntos calientes girando la bandeja en una fase segura de la cocción.",
    "shortTip": "Compensa puntos calientes girando la bandeja en una fase segura de la cocción.",
    "explanation": "Si conoces que tu horno dora más por un lado, rota la bandeja cuando la estructura del alimento ya esté suficientemente fijada.",
    "whyItWorks": "Muchos hornos domésticos presentan diferencias de circulación y radiación térmica.",
    "appliesTo": [
      "galletas",
      "verduras",
      "asados"
    ],
    "techniques": [
      "hornear",
      "asar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Un lado quemado y otro pálido.",
    "sensorySignal": "El dorado termina más uniforme en toda la bandeja.",
    "chefQuickTip": "Conoce los puntos calientes.",
    "tags": [
      "galletas",
      "verduras",
      "asados",
      "hornear",
      "asar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "galletas",
        "verduras",
        "asados"
      ],
      "techniques": [
        "hornear",
        "asar"
      ],
      "actions": [
        "hornear",
        "asar"
      ],
      "equipment": [
        "horno",
        "bandeja"
      ],
      "situations": [
        "Un lado quemado y otro pálido."
      ]
    }
  },
  {
    "id": "tip-v2-127",
    "code": "TIP-127",
    "icon": "♨️",
    "title": "Usa rejilla para crujiente inferior",
    "category": "Horno, asados y gratinados",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Eleva alimentos cuando quieras que circule aire caliente también por debajo.",
    "shortTip": "Eleva alimentos cuando quieras que circule aire caliente también por debajo.",
    "explanation": "Coloca una rejilla sobre bandeja para alitas, piezas empanadas o asados pequeños cuando no necesiten estar sumergidos en jugos.",
    "whyItWorks": "La circulación de aire reduce humedad atrapada y aumenta exposición al calor.",
    "appliesTo": [
      "alitas",
      "empanados",
      "verduras"
    ],
    "techniques": [
      "asar",
      "hornear"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "intermedio",
    "commonError": "Base húmeda mientras la parte superior está crujiente.",
    "sensorySignal": "El alimento dora también por debajo.",
    "chefQuickTip": "Crujiente necesita aire.",
    "tags": [
      "alitas",
      "empanados",
      "verduras",
      "asar",
      "hornear",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "alitas",
        "empanados",
        "verduras"
      ],
      "techniques": [
        "asar",
        "hornear"
      ],
      "actions": [
        "asar",
        "hornear"
      ],
      "equipment": [
        "horno",
        "rejilla"
      ],
      "situations": [
        "Base húmeda mientras la parte superior está crujiente."
      ]
    }
  },
  {
    "id": "tip-v2-128",
    "code": "TIP-128",
    "icon": "♨️",
    "title": "Gratina al final",
    "category": "Horno, asados y gratinados",
    "primaryType": "temperatura",
    "secondaryType": "presentación",
    "priority": "P2",
    "text": "Usa el gratinador cuando el interior ya esté prácticamente listo.",
    "shortTip": "Usa el gratinador cuando el interior ya esté prácticamente listo.",
    "explanation": "Termina platos con queso, pan rallado o salsa bajo calor superior intenso durante poco tiempo y con vigilancia.",
    "whyItWorks": "El gratinado aporta calor superficial muy intenso y puede quemar antes de calentar el centro.",
    "appliesTo": [
      "lasaña",
      "verduras gratinadas",
      "canelones"
    ],
    "techniques": [
      "gratinar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Cobertura quemada con interior aún frío.",
    "sensorySignal": "La superficie burbujea y se dora de forma rápida.",
    "chefQuickTip": "Gratinar es terminar.",
    "tags": [
      "lasaña",
      "verduras gratinadas",
      "canelones",
      "gratinar",
      "temperatura",
      "presentación"
    ],
    "triggers": {
      "ingredients": [
        "lasaña",
        "verduras gratinadas",
        "canelones"
      ],
      "techniques": [
        "gratinar"
      ],
      "actions": [
        "gratinar"
      ],
      "equipment": [
        "horno",
        "grill"
      ],
      "situations": [
        "Cobertura quemada con interior aún frío."
      ]
    }
  },
  {
    "id": "tip-v2-129",
    "code": "TIP-129",
    "icon": "♨️",
    "title": "Asa en una sola capa",
    "category": "Horno, asados y gratinados",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Evita apilar ingredientes si buscas bordes tostados.",
    "shortTip": "Evita apilar ingredientes si buscas bordes tostados.",
    "explanation": "Distribuye piezas con separación suficiente y usa una segunda bandeja si hace falta.",
    "whyItWorks": "El amontonamiento atrapa vapor y reduce el contacto con aire caliente.",
    "appliesTo": [
      "verduras",
      "patatas",
      "pollo"
    ],
    "techniques": [
      "asar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Cocción al vapor dentro del horno.",
    "sensorySignal": "Los bordes toman color y la superficie permanece seca.",
    "chefQuickTip": "Para asar, deja respirar.",
    "tags": [
      "verduras",
      "patatas",
      "pollo",
      "asar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "verduras",
        "patatas",
        "pollo"
      ],
      "techniques": [
        "asar"
      ],
      "actions": [
        "asar"
      ],
      "equipment": [
        "horno",
        "bandeja"
      ],
      "situations": [
        "Cocción al vapor dentro del horno."
      ]
    }
  },
  {
    "id": "tip-v2-130",
    "code": "TIP-130",
    "icon": "♨️",
    "title": "Reposo de asados grandes",
    "category": "Horno, asados y gratinados",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "Deja descansar piezas grandes después del horno antes de trinchar.",
    "shortTip": "Deja descansar piezas grandes después del horno antes de trinchar.",
    "explanation": "Retira del horno y deja reposar según tamaño. Protege ligeramente del frío sin atrapar demasiado vapor en la superficie.",
    "whyItWorks": "La temperatura interna continúa equilibrándose y los jugos se redistribuyen.",
    "appliesTo": [
      "aves enteras",
      "roast beef",
      "cerdo asado"
    ],
    "techniques": [
      "asar",
      "reposar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "intermedio",
    "commonError": "Pérdida abundante de jugos al cortar.",
    "sensorySignal": "Al trinchar, el líquido permanece mejor dentro de las lonchas.",
    "chefQuickTip": "El asado termina fuera del horno.",
    "tags": [
      "aves enteras",
      "roast beef",
      "cerdo asado",
      "asar",
      "reposar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "aves enteras",
        "roast beef",
        "cerdo asado"
      ],
      "techniques": [
        "asar",
        "reposar"
      ],
      "actions": [
        "asar",
        "reposar"
      ],
      "equipment": [
        "rejilla",
        "tabla"
      ],
      "situations": [
        "Pérdida abundante de jugos al cortar."
      ]
    }
  },
  {
    "id": "tip-v2-131",
    "code": "TIP-131",
    "icon": "♨️",
    "title": "Precalienta la bandeja para patatas",
    "category": "Horno, asados y gratinados",
    "primaryType": "textura",
    "secondaryType": "temperatura",
    "priority": "P3",
    "text": "Para patatas muy crujientes, calienta la bandeja o grasa antes de añadirlas.",
    "shortTip": "Para patatas muy crujientes, calienta la bandeja o grasa antes de añadirlas.",
    "explanation": "Introduce la bandeja con una fina capa de grasa durante el precalentado y añade después las patatas bien secas, con cuidado de salpicaduras.",
    "whyItWorks": "El contacto inicial con una superficie caliente acelera el dorado de la base.",
    "appliesTo": [
      "patata"
    ],
    "techniques": [
      "asar",
      "dorar"
    ],
    "useMoment": [
      "inicio de cocción"
    ],
    "level": "intermedio",
    "commonError": "Patatas pálidas y blandas por una base fría.",
    "sensorySignal": "Se oye un ligero chisporroteo al depositarlas.",
    "chefQuickTip": "Patata seca sobre bandeja caliente.",
    "tags": [
      "patata",
      "asar",
      "dorar",
      "textura",
      "temperatura"
    ],
    "triggers": {
      "ingredients": [
        "patata"
      ],
      "techniques": [
        "asar",
        "dorar"
      ],
      "actions": [
        "asar",
        "dorar"
      ],
      "equipment": [
        "horno",
        "bandeja"
      ],
      "situations": [
        "Patatas pálidas y blandas por una base fría."
      ]
    }
  },
  {
    "id": "tip-v2-132",
    "code": "TIP-132",
    "icon": "🍞",
    "title": "Pesa, no midas a ojo",
    "category": "Masas, pan y repostería",
    "primaryType": "organización",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "En repostería y panificación, usa gramos para los ingredientes principales.",
    "shortTip": "En repostería y panificación, usa gramos para los ingredientes principales.",
    "explanation": "Pesa harina, agua, azúcar, grasas y agentes de levado. Reserva cucharas para cantidades pequeñas cuando la receta lo permita.",
    "whyItWorks": "La estructura depende de proporciones relativamente precisas de hidratación, grasa, azúcar y agentes de levado.",
    "appliesTo": [
      "harina",
      "azúcar",
      "mantequilla",
      "agua"
    ],
    "techniques": [
      "pesar",
      "mezclar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Resultados variables por medidas volumétricas imprecisas.",
    "sensorySignal": "Las cantidades pueden reproducirse de una tanda a otra.",
    "chefQuickTip": "En masas, la báscula manda.",
    "tags": [
      "harina",
      "azúcar",
      "mantequilla",
      "pesar",
      "mezclar",
      "organización",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "harina",
        "azúcar",
        "mantequilla",
        "agua"
      ],
      "techniques": [
        "pesar",
        "mezclar"
      ],
      "actions": [
        "pesar",
        "mezclar"
      ],
      "equipment": [
        "báscula"
      ],
      "situations": [
        "Resultados variables por medidas volumétricas imprecisas."
      ]
    }
  },
  {
    "id": "tip-v2-133",
    "code": "TIP-133",
    "icon": "🍞",
    "title": "No sobremezcles tras la harina",
    "category": "Masas, pan y repostería",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "En bizcochos y masas tiernas, mezcla solo hasta integrar la harina.",
    "shortTip": "En bizcochos y masas tiernas, mezcla solo hasta integrar la harina.",
    "explanation": "Una vez añadida la harina, trabaja con movimientos justos para que desaparezcan las zonas secas. No sigas batiendo por costumbre.",
    "whyItWorks": "El exceso de mezcla favorece el desarrollo de gluten y puede endurecer una miga que se busca tierna.",
    "appliesTo": [
      "bizcochos",
      "muffins",
      "galletas"
    ],
    "techniques": [
      "mezclar",
      "tamizar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Miga dura o elástica.",
    "sensorySignal": "La harina desaparece sin que la masa pierda aire innecesariamente.",
    "chefQuickTip": "Harina integrada, batido terminado.",
    "tags": [
      "bizcochos",
      "muffins",
      "galletas",
      "mezclar",
      "tamizar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "bizcochos",
        "muffins",
        "galletas"
      ],
      "techniques": [
        "mezclar",
        "tamizar"
      ],
      "actions": [
        "mezclar",
        "tamizar"
      ],
      "equipment": [
        "bol",
        "espátula"
      ],
      "situations": [
        "Miga dura o elástica."
      ]
    }
  },
  {
    "id": "tip-v2-134",
    "code": "TIP-134",
    "icon": "🍞",
    "title": "Ingredientes a temperatura coherente",
    "category": "Masas, pan y repostería",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P1",
    "text": "Cuando una receta emulsiona mantequilla, huevos y lácteos, procura que estén a temperaturas compatibles.",
    "shortTip": "Cuando una receta emulsiona mantequilla, huevos y lácteos, procura que estén a temperaturas compatibles.",
    "explanation": "Si la receta pide temperatura ambiente, respétala. Ingredientes muy fríos mezclados con grasa blanda pueden cortar la emulsión.",
    "whyItWorks": "Una diferencia térmica grande cambia la consistencia de las grasas y dificulta una mezcla homogénea.",
    "appliesTo": [
      "mantequilla",
      "huevos",
      "leche"
    ],
    "techniques": [
      "batir",
      "emulsionar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Masa cortada o con grumos de grasa.",
    "sensorySignal": "La mezcla queda lisa y uniforme.",
    "chefQuickTip": "Temperaturas parecidas, mezcla estable.",
    "tags": [
      "mantequilla",
      "huevos",
      "leche",
      "batir",
      "emulsionar",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "mantequilla",
        "huevos",
        "leche"
      ],
      "techniques": [
        "batir",
        "emulsionar"
      ],
      "actions": [
        "batir",
        "emulsionar"
      ],
      "equipment": [
        "bol",
        "batidora"
      ],
      "situations": [
        "Masa cortada o con grumos de grasa."
      ]
    }
  },
  {
    "id": "tip-v2-135",
    "code": "TIP-135",
    "icon": "🍞",
    "title": "Tamiza cuando haya grumos",
    "category": "Masas, pan y repostería",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P3",
    "text": "Tamiza harina, cacao o azúcar glas si necesitas una mezcla fina y homogénea.",
    "shortTip": "Tamiza harina, cacao o azúcar glas si necesitas una mezcla fina y homogénea.",
    "explanation": "No hace falta tamizar por ritual en todas las recetas; úsalo cuando el ingrediente tenga grumos, deba airearse o mezclarse con polvos muy finos.",
    "whyItWorks": "Rompe agregados y distribuye partículas de manera uniforme.",
    "appliesTo": [
      "harina",
      "cacao",
      "azúcar glas",
      "levadura química"
    ],
    "techniques": [
      "tamizar",
      "mezclar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Bolsas de cacao o impulsor mal distribuido.",
    "sensorySignal": "El polvo cae fino y sin grumos visibles.",
    "chefQuickTip": "Tamiza con motivo.",
    "tags": [
      "harina",
      "cacao",
      "azúcar glas",
      "tamizar",
      "mezclar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "harina",
        "cacao",
        "azúcar glas",
        "levadura química"
      ],
      "techniques": [
        "tamizar",
        "mezclar"
      ],
      "actions": [
        "tamizar",
        "mezclar"
      ],
      "equipment": [
        "tamiz"
      ],
      "situations": [
        "Bolsas de cacao o impulsor mal distribuido."
      ]
    }
  },
  {
    "id": "tip-v2-136",
    "code": "TIP-136",
    "icon": "🍞",
    "title": "Respeta el reposo de la masa",
    "category": "Masas, pan y repostería",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "No acortes reposos que buscan hidratación, relajación o fermentación.",
    "shortTip": "No acortes reposos que buscan hidratación, relajación o fermentación.",
    "explanation": "Cubre la masa y deja el tiempo indicado en condiciones adecuadas. Si la receta usa señales de volumen o textura, priorízalas frente a un reloj rígido.",
    "whyItWorks": "Durante el reposo se hidrata la harina, se relaja el gluten y, en masas fermentadas, actúan los microorganismos.",
    "appliesTo": [
      "pan",
      "pizza",
      "masa quebrada"
    ],
    "techniques": [
      "reposar",
      "fermentar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Masa difícil de estirar, poco desarrollada o mal fermentada.",
    "sensorySignal": "La masa cambia de elasticidad, volumen o textura según el objetivo.",
    "chefQuickTip": "El reposo también trabaja.",
    "tags": [
      "pan",
      "pizza",
      "masa quebrada",
      "reposar",
      "fermentar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pan",
        "pizza",
        "masa quebrada"
      ],
      "techniques": [
        "reposar",
        "fermentar"
      ],
      "actions": [
        "reposar",
        "fermentar"
      ],
      "equipment": [
        "bol"
      ],
      "situations": [
        "Masa difícil de estirar, poco desarrollada o mal fermentada."
      ]
    }
  },
  {
    "id": "tip-v2-137",
    "code": "TIP-137",
    "icon": "🍞",
    "title": "Desarrolla gluten según el producto",
    "category": "Masas, pan y repostería",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Amasa más una masa de pan que una masa que deba quedar quebradiza o tierna.",
    "shortTip": "Amasa más una masa de pan que una masa que deba quedar quebradiza o tierna.",
    "explanation": "No existe un nivel universal de amasado. Busca elasticidad en panes; en galletas y masas quebradas evita desarrollar una red fuerte.",
    "whyItWorks": "El gluten aporta elasticidad y estructura, pero demasiada en productos tiernos los vuelve duros.",
    "appliesTo": [
      "pan",
      "pizza",
      "galletas",
      "masa quebrada"
    ],
    "techniques": [
      "amasar",
      "mezclar"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Aplicar la misma intensidad de amasado a productos opuestos.",
    "sensorySignal": "La textura de la masa coincide con el resultado buscado.",
    "chefQuickTip": "Amasa para el producto, no por costumbre.",
    "tags": [
      "pan",
      "pizza",
      "galletas",
      "amasar",
      "mezclar",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pan",
        "pizza",
        "galletas",
        "masa quebrada"
      ],
      "techniques": [
        "amasar",
        "mezclar"
      ],
      "actions": [
        "amasar",
        "mezclar"
      ],
      "equipment": [
        "amasadora",
        "manos"
      ],
      "situations": [
        "Aplicar la misma intensidad de amasado a productos opuestos."
      ]
    }
  },
  {
    "id": "tip-v2-138",
    "code": "TIP-138",
    "icon": "🍞",
    "title": "No abras el horno al principio",
    "category": "Masas, pan y repostería",
    "primaryType": "temperatura",
    "secondaryType": "técnica",
    "priority": "P2",
    "text": "En bizcochos y panes, evita pérdidas de calor durante la fase de expansión y fijación.",
    "shortTip": "En bizcochos y panes, evita pérdidas de calor durante la fase de expansión y fijación.",
    "explanation": "Espera a que la estructura haya comenzado a estabilizarse antes de abrir para comprobar. Usa luz y cristal cuando puedas.",
    "whyItWorks": "Una caída brusca de temperatura puede frenar expansión antes de que la estructura sea capaz de sostenerla.",
    "appliesTo": [
      "bizcochos",
      "pan",
      "soufflés"
    ],
    "techniques": [
      "hornear"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Bizcocho hundido o cocción alargada.",
    "sensorySignal": "El volumen se fija antes de la primera apertura.",
    "chefQuickTip": "Primero estructura, luego inspección.",
    "tags": [
      "bizcochos",
      "pan",
      "soufflés",
      "hornear",
      "temperatura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "bizcochos",
        "pan",
        "soufflés"
      ],
      "techniques": [
        "hornear"
      ],
      "actions": [
        "hornear"
      ],
      "equipment": [
        "horno"
      ],
      "situations": [
        "Bizcocho hundido o cocción alargada."
      ]
    }
  },
  {
    "id": "tip-v2-139",
    "code": "TIP-139",
    "icon": "🍞",
    "title": "Enfría antes de cortar",
    "category": "Masas, pan y repostería",
    "primaryType": "textura",
    "secondaryType": "técnica",
    "priority": "P3",
    "text": "Deja enfriar panes y bizcochos antes de rebanar cuando la receta lo requiera.",
    "shortTip": "Deja enfriar panes y bizcochos antes de rebanar cuando la receta lo requiera.",
    "explanation": "Pasa a rejilla y espera a que la miga se estabilice. Cortar demasiado pronto puede comprimirla o hacer que pierda humedad de forma irregular.",
    "whyItWorks": "La estructura interna sigue asentándose mientras disminuye la temperatura.",
    "appliesTo": [
      "pan",
      "bizcocho"
    ],
    "techniques": [
      "enfriar",
      "cortar"
    ],
    "useMoment": [
      "final de cocción"
    ],
    "level": "básico",
    "commonError": "Miga apelmazada o desgarrada al cortar caliente.",
    "sensorySignal": "La pieza conserva forma y la miga corta limpia.",
    "chefQuickTip": "Horneado fuera; estructura aún trabajando.",
    "tags": [
      "pan",
      "bizcocho",
      "enfriar",
      "cortar",
      "textura",
      "técnica"
    ],
    "triggers": {
      "ingredients": [
        "pan",
        "bizcocho"
      ],
      "techniques": [
        "enfriar",
        "cortar"
      ],
      "actions": [
        "enfriar",
        "cortar"
      ],
      "equipment": [
        "rejilla",
        "cuchillo"
      ],
      "situations": [
        "Miga apelmazada o desgarrada al cortar caliente."
      ]
    }
  },
  {
    "id": "tip-v2-140",
    "code": "TIP-140",
    "icon": "🍞",
    "title": "Chocolate: evita agua accidental",
    "category": "Masas, pan y repostería",
    "primaryType": "técnica",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Mantén secos recipientes y utensilios cuando fundas chocolate directamente.",
    "shortTip": "Mantén secos recipientes y utensilios cuando fundas chocolate directamente.",
    "explanation": "Si vas a fundir chocolate, seca bol y espátula. Añade líquidos solo cuando la receta los incorpore de forma controlada.",
    "whyItWorks": "Pequeñas cantidades de agua pueden hacer que partículas de azúcar y cacao se agrupen y la mezcla se vuelva granulosa.",
    "appliesTo": [
      "chocolate"
    ],
    "techniques": [
      "fundir",
      "baño maría"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "intermedio",
    "commonError": "Chocolate agarrotado y granuloso.",
    "sensorySignal": "El chocolate fundido queda fluido y brillante.",
    "chefQuickTip": "Chocolate seco hasta que la receta diga lo contrario.",
    "tags": [
      "chocolate",
      "fundir",
      "baño maría",
      "técnica",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "chocolate"
      ],
      "techniques": [
        "fundir",
        "baño maría"
      ],
      "actions": [
        "fundir",
        "baño maría"
      ],
      "equipment": [
        "bol",
        "espátula"
      ],
      "situations": [
        "Chocolate agarrotado y granuloso."
      ]
    }
  },
  {
    "id": "tip-v2-141",
    "code": "TIP-141",
    "icon": "❄️",
    "title": "Enfría sobras en recipientes bajos",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "seguridad",
    "secondaryType": "conservación",
    "priority": "P1",
    "text": "Divide preparaciones voluminosas en recipientes poco profundos antes de refrigerar.",
    "shortTip": "Divide preparaciones voluminosas en recipientes poco profundos antes de refrigerar.",
    "explanation": "No dejes una olla enorme enfriando durante horas. Reparte en recipientes adecuados y refrigera siguiendo buenas prácticas de seguridad alimentaria.",
    "whyItWorks": "Menor profundidad facilita que el calor salga con más rapidez y de forma uniforme.",
    "appliesTo": [
      "guisos",
      "arroces",
      "salsas",
      "sopas"
    ],
    "techniques": [
      "enfriar",
      "conservar"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "básico",
    "commonError": "Enfriado lento de grandes volúmenes.",
    "sensorySignal": "El contenido se enfría de forma más uniforme en capas menores.",
    "chefQuickTip": "Menos profundidad, mejor enfriado.",
    "tags": [
      "guisos",
      "arroces",
      "salsas",
      "enfriar",
      "conservar",
      "seguridad",
      "conservación"
    ],
    "triggers": {
      "ingredients": [
        "guisos",
        "arroces",
        "salsas",
        "sopas"
      ],
      "techniques": [
        "enfriar",
        "conservar"
      ],
      "actions": [
        "enfriar",
        "conservar"
      ],
      "equipment": [
        "recipientes",
        "frigorífico"
      ],
      "situations": [
        "Enfriado lento de grandes volúmenes."
      ]
    }
  },
  {
    "id": "tip-v2-142",
    "code": "TIP-142",
    "icon": "❄️",
    "title": "Etiqueta fecha y contenido",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "conservación",
    "secondaryType": "organización",
    "priority": "P1",
    "text": "Marca qué es cada recipiente y cuándo se preparó o abrió.",
    "shortTip": "Marca qué es cada recipiente y cuándo se preparó o abrió.",
    "explanation": "Usa etiquetas sencillas con nombre y fecha. Si congelas, añade número de raciones o cantidad cuando sea útil.",
    "whyItWorks": "La trazabilidad doméstica reduce dudas, desperdicio y consumo de productos demasiado antiguos.",
    "appliesTo": [
      "sobras",
      "salsas",
      "caldos",
      "congelados"
    ],
    "techniques": [
      "etiquetar",
      "conservar"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "básico",
    "commonError": "No saber qué hay en un recipiente ni desde cuándo.",
    "sensorySignal": "Cada envase puede identificarse sin abrirlo.",
    "chefQuickTip": "Lo que se guarda, se fecha.",
    "tags": [
      "sobras",
      "salsas",
      "caldos",
      "etiquetar",
      "conservar",
      "conservación",
      "organización"
    ],
    "triggers": {
      "ingredients": [
        "sobras",
        "salsas",
        "caldos",
        "congelados"
      ],
      "techniques": [
        "etiquetar",
        "conservar"
      ],
      "actions": [
        "etiquetar",
        "conservar"
      ],
      "equipment": [
        "etiquetas",
        "frigorífico",
        "congelador"
      ],
      "situations": [
        "No saber qué hay en un recipiente ni desde cuándo."
      ]
    }
  },
  {
    "id": "tip-v2-143",
    "code": "TIP-143",
    "icon": "❄️",
    "title": "Congela en porciones útiles",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "conservación",
    "secondaryType": "aprovechamiento",
    "priority": "P1",
    "text": "Divide caldos, salsas y sofritos en cantidades que usarás realmente.",
    "shortTip": "Divide caldos, salsas y sofritos en cantidades que usarás realmente.",
    "explanation": "Congela por raciones o medidas habituales en lugar de un bloque grande. Usa recipientes o bolsas aptas y deja espacio cuando el alimento se expanda.",
    "whyItWorks": "Las porciones pequeñas descongelan con mayor rapidez y evitan descongelar más de lo necesario.",
    "appliesTo": [
      "caldo",
      "salsa",
      "sofrito",
      "guiso"
    ],
    "techniques": [
      "congelar",
      "porcionar"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "básico",
    "commonError": "Descongelar un bloque grande para usar solo una parte.",
    "sensorySignal": "Puedes retirar exactamente la cantidad necesaria.",
    "chefQuickTip": "Congela pensando en el próximo uso.",
    "tags": [
      "caldo",
      "salsa",
      "sofrito",
      "congelar",
      "porcionar",
      "conservación",
      "aprovechamiento"
    ],
    "triggers": {
      "ingredients": [
        "caldo",
        "salsa",
        "sofrito",
        "guiso"
      ],
      "techniques": [
        "congelar",
        "porcionar"
      ],
      "actions": [
        "congelar",
        "porcionar"
      ],
      "equipment": [
        "congelador",
        "recipientes"
      ],
      "situations": [
        "Descongelar un bloque grande para usar solo una parte."
      ]
    }
  },
  {
    "id": "tip-v2-144",
    "code": "TIP-144",
    "icon": "❄️",
    "title": "Revive pan con calor y humedad controlada",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "aprovechamiento",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Recalienta pan del día anterior para recuperar corteza y miga antes de desecharlo.",
    "shortTip": "Recalienta pan del día anterior para recuperar corteza y miga antes de desecharlo.",
    "explanation": "Humedece ligeramente la superficie cuando proceda y usa horno o tostado breve. Si ya está demasiado seco, destínalo a picatostes, migas o pan rallado.",
    "whyItWorks": "El calor redistribuye parte de la humedad y vuelve a hacer flexible temporalmente la miga.",
    "appliesTo": [
      "pan"
    ],
    "techniques": [
      "recalentar",
      "tostar"
    ],
    "useMoment": [
      "antes de servir"
    ],
    "level": "básico",
    "commonError": "Desechar pan que aún puede aprovecharse.",
    "sensorySignal": "La corteza recupera crujiente y la miga se vuelve más tierna.",
    "chefQuickTip": "Pan viejo no siempre es pan perdido.",
    "tags": [
      "pan",
      "recalentar",
      "tostar",
      "aprovechamiento",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "pan"
      ],
      "techniques": [
        "recalentar",
        "tostar"
      ],
      "actions": [
        "recalentar",
        "tostar"
      ],
      "equipment": [
        "horno",
        "tostadora"
      ],
      "situations": [
        "Desechar pan que aún puede aprovecharse."
      ]
    }
  },
  {
    "id": "tip-v2-145",
    "code": "TIP-145",
    "icon": "❄️",
    "title": "Convierte verduras maduras en base",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "aprovechamiento",
    "secondaryType": "ingrediente",
    "priority": "P2",
    "text": "Usa verduras muy maduras pero aptas en sofritos, cremas, salsas o fondos.",
    "shortTip": "Usa verduras muy maduras pero aptas en sofritos, cremas, salsas o fondos.",
    "explanation": "Retira partes deterioradas no aptas y elige una cocción donde textura y apariencia inicial importen menos. No uses producto con signos de alteración insegura.",
    "whyItWorks": "Cocciones trituradas o largas aprovechan sabor aunque la textura cruda ya no sea óptima.",
    "appliesTo": [
      "tomate",
      "pimiento",
      "zanahoria",
      "calabacín"
    ],
    "techniques": [
      "sofreír",
      "triturar",
      "hacer fondo"
    ],
    "useMoment": [
      "durante la preparación"
    ],
    "level": "básico",
    "commonError": "Tirar producto todavía apto por pérdida de firmeza estética.",
    "sensorySignal": "El ingrediente aporta sabor aunque ya no sea perfecto para servir crudo.",
    "chefQuickTip": "Maduro puede ser base.",
    "tags": [
      "tomate",
      "pimiento",
      "zanahoria",
      "sofreír",
      "triturar",
      "hacer fondo",
      "aprovechamiento",
      "ingrediente"
    ],
    "triggers": {
      "ingredients": [
        "tomate",
        "pimiento",
        "zanahoria",
        "calabacín"
      ],
      "techniques": [
        "sofreír",
        "triturar",
        "hacer fondo"
      ],
      "actions": [
        "sofreír",
        "triturar",
        "hacer fondo"
      ],
      "equipment": [
        "cazuela",
        "batidora"
      ],
      "situations": [
        "Tirar producto todavía apto por pérdida de firmeza estética."
      ]
    }
  },
  {
    "id": "tip-v2-146",
    "code": "TIP-146",
    "icon": "❄️",
    "title": "Recalienta porciones, no la olla entera",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "conservación",
    "secondaryType": "seguridad",
    "priority": "P2",
    "text": "Calienta solo lo que vas a consumir cuando sea posible.",
    "shortTip": "Calienta solo lo que vas a consumir cuando sea posible.",
    "explanation": "Separa una porción antes de recalentar y devuelve el resto al frío. Evita ciclos repetidos de calentamiento y enfriado.",
    "whyItWorks": "Reducir ciclos térmicos conserva mejor textura y simplifica una manipulación segura.",
    "appliesTo": [
      "guisos",
      "sopas",
      "salsas",
      "arroces"
    ],
    "techniques": [
      "recalentar",
      "porcionar"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "básico",
    "commonError": "Recalentar repetidamente todo el lote.",
    "sensorySignal": "Solo la ración necesaria pasa por el nuevo ciclo de calor.",
    "chefQuickTip": "Calienta lo que vas a comer.",
    "tags": [
      "guisos",
      "sopas",
      "salsas",
      "recalentar",
      "porcionar",
      "conservación",
      "seguridad"
    ],
    "triggers": {
      "ingredients": [
        "guisos",
        "sopas",
        "salsas",
        "arroces"
      ],
      "techniques": [
        "recalentar",
        "porcionar"
      ],
      "actions": [
        "recalentar",
        "porcionar"
      ],
      "equipment": [
        "microondas",
        "cazo",
        "frigorífico"
      ],
      "situations": [
        "Recalentar repetidamente todo el lote."
      ]
    }
  },
  {
    "id": "tip-v2-147",
    "code": "TIP-147",
    "icon": "❄️",
    "title": "Rehidrata salsas al recalentar",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "aprovechamiento",
    "secondaryType": "textura",
    "priority": "P2",
    "text": "Añade pequeñas cantidades de agua, caldo o leche si una salsa se ha espesado en frío.",
    "shortTip": "Añade pequeñas cantidades de agua, caldo o leche si una salsa se ha espesado en frío.",
    "explanation": "Calienta suavemente y ajusta líquido poco a poco mientras remueves. Prueba antes de añadir más sal.",
    "whyItWorks": "Durante el reposo, almidones siguen absorbiendo agua y algunas salsas pierden fluidez.",
    "appliesTo": [
      "salsas",
      "guisos",
      "pasta"
    ],
    "techniques": [
      "recalentar",
      "ligar"
    ],
    "useMoment": [
      "durante la cocción"
    ],
    "level": "básico",
    "commonError": "Servir una salsa recalentada demasiado espesa.",
    "sensorySignal": "Recupera fluidez y brillo sin quedar aguada.",
    "chefQuickTip": "Recalentar también es reajustar.",
    "tags": [
      "salsas",
      "guisos",
      "pasta",
      "recalentar",
      "ligar",
      "aprovechamiento",
      "textura"
    ],
    "triggers": {
      "ingredients": [
        "salsas",
        "guisos",
        "pasta"
      ],
      "techniques": [
        "recalentar",
        "ligar"
      ],
      "actions": [
        "recalentar",
        "ligar"
      ],
      "equipment": [
        "cazo"
      ],
      "situations": [
        "Servir una salsa recalentada demasiado espesa."
      ]
    }
  },
  {
    "id": "tip-v2-148",
    "code": "TIP-148",
    "icon": "❄️",
    "title": "Guarda recortes útiles por separado",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "aprovechamiento",
    "secondaryType": "conservación",
    "priority": "P3",
    "text": "Reserva huesos, tallos, pieles limpias o puntas aprovechables para fondos o salsas.",
    "shortTip": "Reserva huesos, tallos, pieles limpias o puntas aprovechables para fondos o salsas.",
    "explanation": "Separa únicamente recortes culinariamente útiles y consérvalos de forma segura. Etiqueta y congela si no los usarás pronto.",
    "whyItWorks": "Agrupar pequeñas cantidades convierte residuos dispersos en una base con suficiente volumen para cocinar.",
    "appliesTo": [
      "huesos",
      "tallos",
      "recortes vegetales"
    ],
    "techniques": [
      "conservar",
      "hacer fondo"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "intermedio",
    "commonError": "Mezclar recortes útiles con residuos no apropiados.",
    "sensorySignal": "El recipiente contiene solo piezas limpias y aptas para un uso definido.",
    "chefQuickTip": "Recorte útil, destino claro.",
    "tags": [
      "huesos",
      "tallos",
      "recortes vegetales",
      "conservar",
      "hacer fondo",
      "aprovechamiento",
      "conservación"
    ],
    "triggers": {
      "ingredients": [
        "huesos",
        "tallos",
        "recortes vegetales"
      ],
      "techniques": [
        "conservar",
        "hacer fondo"
      ],
      "actions": [
        "conservar",
        "hacer fondo"
      ],
      "equipment": [
        "congelador",
        "recipiente"
      ],
      "situations": [
        "Mezclar recortes útiles con residuos no apropiados."
      ]
    }
  },
  {
    "id": "tip-v2-149",
    "code": "TIP-149",
    "icon": "❄️",
    "title": "Planifica una segunda vida",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "aprovechamiento",
    "secondaryType": "organización",
    "priority": "P3",
    "text": "Antes de guardar una sobra, decide en qué plato podría transformarse.",
    "shortTip": "Antes de guardar una sobra, decide en qué plato podría transformarse.",
    "explanation": "Pollo asado puede acabar en croquetas o tacos; arroz en salteado; verduras asadas en crema. Etiqueta la idea junto al recipiente si te ayuda.",
    "whyItWorks": "Asignar un uso concreto reduce la probabilidad de que la sobra quede olvidada.",
    "appliesTo": [
      "sobras cocinadas"
    ],
    "techniques": [
      "reutilizar",
      "planificar"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "básico",
    "commonError": "Guardar sin plan hasta que el alimento deja de ser útil.",
    "sensorySignal": "La sobra tiene un destino culinario definido.",
    "chefQuickTip": "Sobra con plan, sobra que se usa.",
    "tags": [
      "sobras cocinadas",
      "reutilizar",
      "planificar",
      "aprovechamiento",
      "organización"
    ],
    "triggers": {
      "ingredients": [],
      "techniques": [
        "reutilizar",
        "planificar"
      ],
      "actions": [
        "reutilizar",
        "planificar"
      ],
      "equipment": [
        "frigorífico"
      ],
      "situations": [
        "Guardar sin plan hasta que el alimento deja de ser útil."
      ]
    }
  },
  {
    "id": "tip-v2-150",
    "code": "TIP-150",
    "icon": "❄️",
    "title": "Descongela con anticipación",
    "category": "Conservación, aprovechamiento y cocina eficiente",
    "primaryType": "seguridad",
    "secondaryType": "organización",
    "priority": "P2",
    "text": "Pasa alimentos congelados al frigorífico con tiempo suficiente cuando el método lo permita.",
    "shortTip": "Pasa alimentos congelados al frigorífico con tiempo suficiente cuando el método lo permita.",
    "explanation": "Planifica la descongelación para evitar prisas y descongelaciones irregulares. Mantén el alimento contenido para que sus líquidos no contaminen otros productos.",
    "whyItWorks": "La descongelación lenta en frío mantiene mejor control térmico y suele ser más uniforme.",
    "appliesTo": [
      "carne",
      "pescado",
      "guisos"
    ],
    "techniques": [
      "descongelar"
    ],
    "useMoment": [
      "conservación"
    ],
    "level": "básico",
    "commonError": "Centro congelado y exterior templado por descongelar con prisas.",
    "sensorySignal": "La pieza está descongelada de forma homogénea y sigue fría.",
    "chefQuickTip": "Descongela antes de necesitarlo.",
    "tags": [
      "carne",
      "pescado",
      "guisos",
      "descongelar",
      "seguridad",
      "organización"
    ],
    "triggers": {
      "ingredients": [
        "carne",
        "pescado",
        "guisos"
      ],
      "techniques": [
        "descongelar"
      ],
      "actions": [
        "descongelar"
      ],
      "equipment": [
        "frigorífico",
        "recipiente"
      ],
      "situations": [
        "Centro congelado y exterior templado por descongelar con prisas."
      ]
    }
  }
];

type TipReviews=Record<string,'keep'|'hide'>;
const REVIEW_KEY='chef:tip-reviews:v2';
export function getTipReviews():TipReviews{
 try{
  const data=JSON.parse(localStorage.getItem(REVIEW_KEY)||'{}');
  return Object.fromEntries(Object.entries(data).filter(([,v])=>v==='keep'||v==='hide')) as TipReviews;
 }catch{return {}}
}
export function setTipReview(id:string,value:'keep'|'hide'|'pending'){
 const reviews=getTipReviews();
 if(value==='pending')delete reviews[id];else reviews[id]=value;
 localStorage.setItem(REVIEW_KEY,JSON.stringify(reviews));
 return reviews;
}

let remaining:number[]=[];
let last=-1;
export function nextCookingTip(){
 const reviews=getTipReviews();
 remaining=remaining.filter(i=>reviews[cookingTips[i]?.id]!=='hide');
 if(!remaining.length){
  remaining=cookingTips.map((_,i)=>i).filter(i=>reviews[cookingTips[i].id]!=='hide');
  for(let i=remaining.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [remaining[i],remaining[j]]=[remaining[j],remaining[i]];
  }
  if(remaining.length>1&&remaining[remaining.length-1]===last){
   [remaining[0],remaining[remaining.length-1]]=[remaining[remaining.length-1],remaining[0]];
  }
 }
 const next=remaining.pop();
 if(next===undefined)return undefined;
 last=next;
 return cookingTips[last];
}

const PRIORITY_SCORE:Record<CookingTipPriority,number>={P1:6,P2:3,P3:1};
const LEXICAL_STOP=new Set(['antes','despues','cuando','para','como','solo','poco','unos','unas','esto','esta','este','debe','deben','puede','pueden','tiene','tienen','entre','sobre','hasta','desde','todo','toda','todos','todas','algo','otro','otra','otros','otras','cada','mismo','misma','mientras','cocinar','cocina','coccion','minuto','minutos','anade','anadir','incorpora']);
const ACTION_ALIASES:Array<[string,string[]]>=[
 ['sofri',['sofreir','saltear']],['rehog',['rehogar','sofreir','tostar']],['dora',['dorar','marcar']],
 ['tost',['tostar','dorar']],['cocina',['cocer','cocinar']],['cocci',['cocer','cocinar']],['cuec',['cocer']],
 ['herv',['hervir','cocer']],['remov',['remover']],['repos',['reposar']],['horne',['hornear','asar']],
 ['gratin',['gratinar']],['frit',['freir']],['saltea',['saltear']],['reduce',['reducir']],
 ['desglas',['desglasar']],['tritura',['triturar']],['emulsion',['emulsionar']],['mezcla',['mezclar']],
 ['bate',['batir']],['monta',['montar']],['escalf',['escalfar']],['vapor',['cocer al vapor']],
 ['ajusta de sal',['sazonar']],['sazona',['sazonar']]
];

function normalize(value:string){
 return value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ]+/g,' ').trim();
}
function rootKey(value:string){
 const x=normalize(value);return x.length>=5?x.slice(0,5):x;
}
function lexicalRoots(value:string){
 return new Set(normalize(value).split(/\s+/).filter(x=>x.length>=4&&!LEXICAL_STOP.has(x)).map(rootKey));
}
function lexicalOverlap(a:string,b:string){
 const aa=lexicalRoots(a),bb=lexicalRoots(b);let shared=0;for(const x of aa)if(bb.has(x))shared++;return shared;
}
function canonicalStepContext(value:string){
 const base=normalize(value),extra:string[]=[];
 for(const [needle,aliases] of ACTION_ALIASES)if(base.includes(normalize(needle)))extra.push(...aliases);
 return normalize(base+' '+extra.join(' '));
}
function exactActionMatch(context:string,value:string){
 const trigger=normalize(value);if(!trigger)return false;
 if(trigger.includes(' '))return context.includes(trigger);
 return context.split(/\s+/).includes(trigger);
}
function ingredientLikeMatch(context:string,value:string){
 const trigger=normalize(value);if(!trigger)return false;
 if(context.includes(trigger))return true;
 const contextRoots=new Set(context.split(/\s+/).filter(x=>x.length>=3).map(rootKey));
 const triggerRoots=trigger.split(/\s+/).filter(x=>x.length>=3&&!['para','con','sin','del'].includes(x)).map(rootKey);
 return triggerRoots.length>0&&triggerRoots.every(x=>contextRoots.has(x));
}
function ingredientMentioned(name:string,text:string){
 const ingredient=normalize(name),context=normalize(text);if(context.includes(ingredient))return true;
 const tokens=ingredient.split(/\s+/).filter(x=>!['de','del','la','el'].includes(x));if(!tokens.length)return false;
 const contextTokens=context.split(/\s+/);
 if(['caldo','fondo','aceite','agua'].includes(tokens[0]))return contextTokens.includes(tokens[0]);
 const generic=new Set(['pechuga','filete','carne','fresco','fresca','triturado','triturada','curado','curada']);
 const meaningful=tokens.filter(x=>x.length>=4&&!generic.has(x));
 const roots=new Set(contextTokens.filter(x=>x.length>=4).map(rootKey));
 return meaningful.some(x=>roots.has(rootKey(x)));
}
function expandIngredientContext(names:string[]){
 const parts=[...names],value=normalize(names.join(' '));const add=(...items:string[])=>parts.push(...items);
 if(['pollo','pavo'].some(x=>value.includes(x)))add('carne','carnes','ave','aves');
 if(['ternera','vacuno','cerdo','cordero','filete'].some(x=>value.includes(x)))add('carne','carnes');
 if(['merluza','salmon','lubina','dorada','atun','pescado'].some(x=>value.includes(x)))add('pescado','pescados');
 if(['gamba','langostino','vieira','almeja','mejillon','marisco'].some(x=>value.includes(x)))add('marisco','mariscos');
 if(['cebolla','ajo','puerro','calabacin','zanahoria','pimiento','patata','brocoli','coliflor','tomate'].some(x=>value.includes(x)))add('verdura','verduras','hortaliza','hortalizas');
 if(['cebolla','ajo','puerro'].some(x=>value.includes(x)))add('aromatico','aromaticos');
 if(['arroz','quinoa','bulgur','cuscus'].some(x=>value.includes(x)))add('arroz','arroces','cereal','cereales','grano','granos');
 if(['pasta','espagueti','macarron','penne'].some(x=>value.includes(x)))add('pasta');
 if(['huevo','yema','clara'].some(x=>value.includes(x)))add('huevo','huevos');
 if(['caldo','fondo','fumet'].some(x=>value.includes(x)))add('caldo','caldos','fondo','fondos');
 if(value.includes('salsa'))add('salsa','salsas');
 if(['harina','masa','pan','pizza'].some(x=>value.includes(x)))add('masa','masas','pan','reposteria');
 return normalize(parts.join(' '));
}
function uniqueNormalized(values:string[]){
 const seen=new Set<string>();return values.filter(value=>{const key=normalize(value);if(!key||seen.has(key))return false;seen.add(key);return true});
}
function duplicatesRecipeAdvice(tip:CookingTip,recipe:Recipe,step:RecipeStep){
 const candidate=tip.title+' '+tip.shortTip;
 return [...recipe.criticalPoints,...recipe.substitutions,...recipe.miseEnPlace,step.cue||''].some(advice=>advice&&lexicalOverlap(candidate,advice)>=2);
}
function conflictsWithCue(tip:CookingTip,cue?:string){
 const c=normalize(cue||''),text=normalize(tip.title+' '+tip.shortTip+' '+tip.explanation);
 if((c.includes('sin tost')||c.includes('sin dora'))&&['dora','tost','costr','maillard'].some(x=>text.includes(x)))return true;
 if(c.includes('sin herv')&&text.includes('herv'))return true;
 return false;
}
function scoreTip(tip:CookingTip,recipe:Recipe,step:RecipeStep,stepIndex:number,reviews:TipReviews){
 const rawStep=[step.instruction,step.cue||''].join(' ');
 const stepContext=canonicalStepContext(rawStep);
 const stepIngredients=recipe.ingredients.map(i=>i.name).filter(name=>ingredientMentioned(name,rawStep));
 const stepIngredientContext=expandIngredientContext(stepIngredients);
 const recipeIngredientContext=expandIngredientContext(recipe.ingredients.map(i=>i.name));
 const actionValues=uniqueNormalized([...tip.triggers.techniques,...tip.triggers.actions]);
 const applicableValues=uniqueNormalized([...tip.triggers.ingredients,...tip.appliesTo]);
 const actionMatches=actionValues.filter(x=>exactActionMatch(stepContext,x)).length;
 const directOverlap=lexicalOverlap(tip.title+' '+tip.shortTip,rawStep);
 const stepApplicability=applicableValues.filter(x=>ingredientLikeMatch(stepIngredientContext,x)).length;
 const recipeApplicability=applicableValues.filter(x=>ingredientLikeMatch(recipeIngredientContext,x)).length;
 if(actionMatches===0&&directOverlap<2)return -1000;
 let score=PRIORITY_SCORE[tip.priority];
 if(reviews[tip.id]==='keep')score+=2;
 score+=actionMatches*8;
 score+=Math.min(directOverlap,3)*4;
 score+=Math.min(stepApplicability,2)*7;
 score+=Math.min(recipeApplicability,2);
 if(stepIngredients.length&&stepApplicability===0)score-=14;
 const moments=new Set(tip.useMoment.map(normalize));
 if(stepIndex>0&&moments.size&&[...moments].every(x=>x==='antes de cocinar'||x==='durante la preparacion'))score-=8;
 if(moments.has('conservacion'))score-=20;
 if(moments.has('durante la coccion'))score+=2;
 if(stepIndex===0&&['antes de cocinar','inicio de coccion','durante la preparacion'].some(x=>moments.has(x)))score+=3;
 if(stepIndex===recipe.steps.length-1&&['final de coccion','antes de servir'].some(x=>moments.has(x)))score+=4;
 if(conflictsWithCue(tip,step.cue))score-=30;
 if(duplicatesRecipeAdvice(tip,recipe,step))score-=14;
 return score;
}

export function selectContextualCookingTip(
 recipe:Recipe,
 step:RecipeStep,
 stepIndex:number,
 excludedIds:ReadonlySet<string>=new Set()
){
 const reviews=getTipReviews();
 const ranked=cookingTips
  .filter(t=>reviews[t.id]!=='hide'&&!excludedIds.has(t.id))
  .map(t=>({tip:t,score:scoreTip(t,recipe,step,stepIndex,reviews)}))
  .filter(x=>x.score>=24)
  .sort((a,b)=>b.score-a.score||PRIORITY_SCORE[b.tip.priority]-PRIORITY_SCORE[a.tip.priority]||a.tip.id.localeCompare(b.tip.id));
 return ranked[0]?.tip;
}

export function selectContextualCookingTips(recipe:Recipe){
 const used=new Set<string>();
 return recipe.steps.map((step,index)=>{
  const tip=selectContextualCookingTip(recipe,step,index,used);
  if(tip)used.add(tip.id);
  return tip;
 });
}
