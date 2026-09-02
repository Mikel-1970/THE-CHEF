import type { Recipe } from '../domain/types';

export const additionalRecipes: Recipe[] = [
  {
    id:'tortilla-patata', title:'Tortilla de patata',
    description:'Tortilla española jugosa, con patata tierna y cebolla opcional.', emoji:'🥔', baseServings:4,
    prepMinutes:15,cookMinutes:30,difficulty:'Media',mealType:'Comida',style:'Casera',cuisine:'Española',
    ingredients:[
      {name:'Patata',quantity:650,unit:'g',section:'Tortilla',scalingMode:'linear'},
      {name:'Huevos',quantity:6,unit:'ud',section:'Tortilla',scalingMode:'discrete'},
      {name:'Cebolla',quantity:150,unit:'g',section:'Tortilla',scalingMode:'linear',optional:true},
      {name:'Aceite de oliva',quantity:120,unit:'ml',section:'Cocción',scalingMode:'culinary'},
      {name:'Sal',quantity:5,unit:'g',section:'Tortilla',scalingMode:'culinary'}
    ],
    miseEnPlace:['Pelar las patatas y cortarlas en láminas de 3–4 mm.','Cortar la cebolla fina si se utiliza.','Batir los huevos en un bol amplio.'],
    steps:[
      {number:1,instruction:'Cocina la patata y la cebolla, si la usas, con el aceite a fuego medio-bajo durante 18–20 minutos.',minutes:20,cue:'La patata debe quedar muy tierna, sin dorarse en exceso.'},
      {number:2,instruction:'Escurre bien la patata, mézclala con los huevos batidos y la sal y deja reposar 3 minutos.',minutes:3},
      {number:3,instruction:'Cuaja la tortilla en una sartén antiadherente a fuego medio 2–3 minutos por el primer lado.',minutes:3,cue:'Los bordes deben estar cuajados y el centro todavía húmedo.'},
      {number:4,instruction:'Dale la vuelta con un plato y cocina 1–2 minutos por el segundo lado según el punto deseado.',minutes:2}
    ],
    criticalPoints:['La patata debe estar completamente tierna antes de mezclarla con el huevo.','Usa un plato mayor que la sartén y gira con un movimiento firme.'],
    substitutions:['La cebolla puede omitirse.','Puede utilizarse aceite de girasol alto oleico para cocinar la patata.'],
    storage:'Refrigerar una vez fría y consumir preferiblemente en 24 horas.',
    nutritionPerServing:{kcal:430,proteinG:17,carbsG:34,fatG:25}
  },
  {
    id:'lentejas-verduras', title:'Lentejas guisadas con verduras',
    description:'Guiso casero de legumbre con verduras y un fondo suave de pimentón.', emoji:'🥣', baseServings:4,
    prepMinutes:15,cookMinutes:45,difficulty:'Fácil',mealType:'Comida',style:'Casera',cuisine:'Española',
    ingredients:[
      {name:'Lentejas pardinas',quantity:320,unit:'g',section:'Guiso',scalingMode:'linear'},
      {name:'Cebolla',quantity:140,unit:'g',section:'Sofrito',scalingMode:'linear'},
      {name:'Zanahoria',quantity:180,unit:'g',section:'Guiso',scalingMode:'linear'},
      {name:'Pimiento',quantity:150,unit:'g',section:'Sofrito',scalingMode:'linear'},
      {name:'Tomate triturado',quantity:180,unit:'g',section:'Sofrito',scalingMode:'linear'},
      {name:'Patata',quantity:300,unit:'g',section:'Guiso',scalingMode:'linear'},
      {name:'Caldo de verduras',quantity:1100,unit:'ml',section:'Guiso',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:30,unit:'ml',section:'Sofrito',scalingMode:'culinary'},
      {name:'Pimentón dulce',quantity:3,unit:'g',section:'Sofrito',scalingMode:'culinary'},
      {name:'Sal',quantity:5,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Lavar las lentejas.','Cortar cebolla, zanahoria, pimiento y patata en dados pequeños.','Calentar el caldo.'],
    steps:[
      {number:1,instruction:'Sofríe cebolla, zanahoria y pimiento con el aceite a fuego medio durante 7 minutos.',minutes:7,cue:'Las verduras deben ablandarse sin tostarse.'},
      {number:2,instruction:'Añade el pimentón, remueve 15 segundos e incorpora inmediatamente el tomate triturado.',minutes:1},
      {number:3,instruction:'Cocina el tomate 5 minutos e incorpora las lentejas, la patata y el caldo caliente.',minutes:5},
      {number:4,instruction:'Cuece a hervor suave durante 28–32 minutos, hasta que la lenteja esté tierna.',minutes:30,cue:'Debe quedar un caldo ligado pero no seco.'},
      {number:5,instruction:'Ajusta de sal y deja reposar 5 minutos antes de servir.',minutes:5}
    ],
    criticalPoints:['No quemes el pimentón; añade el tomate inmediatamente.','Mantén un hervor suave para que la lenteja conserve la forma.'],
    substitutions:['Calabacín puede sustituir parte de la zanahoria o el pimiento.','Agua puede sustituir al caldo si se refuerza el sofrito.'],
    storage:'Refrigerar hasta 3 días. Al recalentar, añadir un poco de agua si el guiso se ha espesado.',
    nutritionPerServing:{kcal:430,proteinG:20,carbsG:62,fatG:10}
  },
  {
    id:'salmon-horno-patata', title:'Salmón al horno con patata y calabacín',
    description:'Salmón jugoso con guarnición de patata y calabacín asados.', emoji:'🐟', baseServings:4,
    prepMinutes:12,cookMinutes:32,difficulty:'Fácil',mealType:'Comida',style:'Saludable',cuisine:'Mediterránea',
    ingredients:[
      {name:'Salmón',quantity:600,unit:'g',section:'Pescado',scalingMode:'linear'},
      {name:'Patata',quantity:650,unit:'g',section:'Guarnición',scalingMode:'linear'},
      {name:'Calabacín',quantity:350,unit:'g',section:'Guarnición',scalingMode:'linear'},
      {name:'Limón',quantity:1,unit:'ud',section:'Pescado',scalingMode:'discrete'},
      {name:'Aceite de oliva',quantity:35,unit:'ml',section:'General',scalingMode:'culinary'},
      {name:'Sal',quantity:5,unit:'g',section:'General',scalingMode:'culinary'}
    ],
    miseEnPlace:['Precalentar el horno a 210 °C.','Cortar la patata en rodajas finas y el calabacín en medias lunas.','Secar el salmón con papel de cocina.'],
    steps:[
      {number:1,instruction:'Mezcla la patata con dos tercios del aceite y parte de la sal. Hornéala a 210 °C durante 18 minutos.',minutes:18,temperatureC:210,cue:'Debe empezar a dorarse y estar casi tierna.'},
      {number:2,instruction:'Añade el calabacín a la bandeja y hornea 6 minutos más.',minutes:6,temperatureC:210},
      {number:3,instruction:'Coloca el salmón sobre las verduras, añade el resto del aceite, sal y limón y hornea 8–10 minutos.',minutes:9,temperatureC:210,cue:'El centro debe quedar jugoso y separarse en lascas con facilidad.'}
    ],
    criticalPoints:['La patata necesita entrar antes que el salmón.','No prolongues la cocción del salmón una vez que se separe en lascas.'],
    substitutions:['Trucha asalmonada puede sustituir al salmón.','Berenjena puede sustituir al calabacín, cortada fina.'],
    storage:'Refrigerar hasta 24 horas. Recalentar suavemente para no resecar el pescado.',
    nutritionPerServing:{kcal:520,proteinG:35,carbsG:31,fatG:28}
  },
  {
    id:'merluza-salsa-verde', title:'Merluza en salsa verde con guisantes',
    description:'Pescado blanco en una salsa ligera de ajo, perejil y caldo.', emoji:'🐟', baseServings:4,
    prepMinutes:12,cookMinutes:20,difficulty:'Media',mealType:'Comida',style:'Casera',cuisine:'Española',
    ingredients:[
      {name:'Merluza',quantity:650,unit:'g',section:'Pescado',scalingMode:'linear'},
      {name:'Guisantes',quantity:180,unit:'g',section:'Salsa',scalingMode:'linear'},
      {name:'Ajo',quantity:2,unit:'ud',section:'Salsa',scalingMode:'discrete'},
      {name:'Perejil',quantity:15,unit:'g',section:'Salsa',scalingMode:'culinary'},
      {name:'Caldo de pescado',quantity:300,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Harina',quantity:15,unit:'g',section:'Salsa',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:30,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Sal',quantity:4,unit:'g',section:'Pescado',scalingMode:'culinary'}
    ],
    miseEnPlace:['Secar y salar ligeramente la merluza.','Picar fino el ajo y el perejil.','Calentar el caldo.'],
    steps:[
      {number:1,instruction:'Sofríe el ajo con el aceite a fuego medio-bajo durante 1 minuto, sin dorarlo.',minutes:1},
      {number:2,instruction:'Añade la harina, cocina 1 minuto y vierte el caldo poco a poco mientras remueves.',minutes:2,cue:'La salsa debe quedar ligera y sin grumos.'},
      {number:3,instruction:'Incorpora los guisantes y cocina 4 minutos a fuego suave.',minutes:4},
      {number:4,instruction:'Añade la merluza y cocina tapada 3–4 minutos por cada lado, según grosor.',minutes:7,cue:'El pescado debe estar opaco y jugoso, no seco.'},
      {number:5,instruction:'Añade el perejil, mueve la cazuela suavemente para ligar la salsa y cocina 1 minuto.',minutes:1}
    ],
    criticalPoints:['El ajo no debe tostarse.','Evita hervir con fuerza una vez añadido el pescado.'],
    substitutions:['Pescadilla u otro pescado blanco firme puede sustituir a la merluza.','Caldo de verduras suave puede sustituir al de pescado.'],
    storage:'Refrigerar hasta 24 horas y recalentar a fuego muy suave.',
    nutritionPerServing:{kcal:300,proteinG:34,carbsG:13,fatG:12}
  },
  {
    id:'pollo-curry-arroz', title:'Pollo al curry con arroz basmati',
    description:'Curry suave y cremoso de pollo con arroz aromático.', emoji:'🍛', baseServings:4,
    prepMinutes:15,cookMinutes:25,difficulty:'Fácil',mealType:'Comida',style:'Casera',cuisine:'India',
    ingredients:[
      {name:'Pechuga de pollo',quantity:500,unit:'g',section:'Curry',scalingMode:'linear'},
      {name:'Arroz basmati',quantity:280,unit:'g',section:'Arroz',scalingMode:'linear'},
      {name:'Cebolla',quantity:160,unit:'g',section:'Curry',scalingMode:'linear'},
      {name:'Tomate triturado',quantity:200,unit:'g',section:'Curry',scalingMode:'linear'},
      {name:'Leche de coco',quantity:300,unit:'ml',section:'Curry',scalingMode:'culinary'},
      {name:'Curry',quantity:8,unit:'g',section:'Especias',scalingMode:'culinary'},
      {name:'Aceite',quantity:25,unit:'ml',section:'Curry',scalingMode:'culinary'},
      {name:'Sal',quantity:4,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Cortar el pollo en dados de 2–3 cm.','Picar la cebolla.','Enjuagar el arroz basmati.'],
    steps:[
      {number:1,instruction:'Cuece el arroz basmati en agua según el tipo utilizado y resérvalo tapado.',minutes:12},
      {number:2,instruction:'Sofríe la cebolla con el aceite a fuego medio durante 6 minutos.',minutes:6},
      {number:3,instruction:'Añade el curry y remueve 20 segundos. Incorpora el pollo y dóralo 4 minutos.',minutes:4},
      {number:4,instruction:'Añade el tomate triturado y cocina 4 minutos.',minutes:4},
      {number:5,instruction:'Incorpora la leche de coco y cocina a fuego suave 8 minutos. Ajusta de sal.',minutes:8,cue:'La salsa debe quedar cremosa y el pollo completamente cocinado.'}
    ],
    criticalPoints:['No quemes las especias; basta calentarlas unos segundos.','No hiervas la leche de coco a fuego fuerte durante mucho tiempo.'],
    substitutions:['Pavo puede sustituir al pollo.','Yogur natural y un poco de caldo pueden sustituir parcialmente a la leche de coco, con un resultado diferente.'],
    storage:'Refrigerar hasta 48 horas. Recalentar bien el curry y el arroz por separado.',
    nutritionPerServing:{kcal:610,proteinG:39,carbsG:62,fatG:22}
  },
  {
    id:'risotto-setas', title:'Risotto de setas y parmesano',
    description:'Arroz italiano cremoso con setas salteadas y parmesano.', emoji:'🍄', baseServings:4,
    prepMinutes:12,cookMinutes:28,difficulty:'Media',mealType:'Comida',style:'Moderna',cuisine:'Italiana',
    ingredients:[
      {name:'Arroz arborio',quantity:320,unit:'g',section:'Risotto',scalingMode:'linear'},
      {name:'Setas',quantity:350,unit:'g',section:'Risotto',scalingMode:'linear'},
      {name:'Cebolla',quantity:120,unit:'g',section:'Sofrito',scalingMode:'linear'},
      {name:'Caldo de verduras',quantity:1100,unit:'ml',section:'Risotto',scalingMode:'culinary'},
      {name:'Parmesano',quantity:70,unit:'g',section:'Final',scalingMode:'culinary'},
      {name:'Mantequilla',quantity:35,unit:'g',section:'Final',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:20,unit:'ml',section:'Sofrito',scalingMode:'culinary'},
      {name:'Sal',quantity:4,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Limpiar y cortar las setas.','Picar fina la cebolla.','Mantener el caldo muy caliente.'],
    steps:[
      {number:1,instruction:'Saltea las setas con la mitad del aceite a fuego alto durante 5 minutos y resérvalas.',minutes:5,cue:'Deben dorarse sin soltar demasiada agua.'},
      {number:2,instruction:'Sofríe la cebolla con el resto del aceite a fuego medio durante 4 minutos.',minutes:4},
      {number:3,instruction:'Añade el arroz y rehógalo 1 minuto.',minutes:1},
      {number:4,instruction:'Incorpora el caldo caliente en varias tandas durante 16–18 minutos, removiendo con frecuencia.',minutes:17,cue:'El arroz debe quedar al dente y fluido, no seco.'},
      {number:5,instruction:'Añade las setas, retira del fuego e incorpora mantequilla y parmesano. Ajusta de sal y reposa 2 minutos.',minutes:2}
    ],
    criticalPoints:['El caldo debe mantenerse caliente.','El risotto terminado debe fluir al mover el plato; no debe quedar compacto.'],
    substitutions:['Champiñones pueden sustituir a otras setas.','Grana Padano puede sustituir al parmesano.'],
    storage:'Mejor recién hecho. Si sobra, refrigerar hasta 24 horas y recalentar con un poco de caldo.',
    nutritionPerServing:{kcal:535,proteinG:17,carbsG:65,fatG:22}
  },
  {
    id:'pasta-brocoli-ajo', title:'Pasta con brócoli, ajo y parmesano',
    description:'Pasta rápida con brócoli tierno, ajo suave y queso curado.', emoji:'🥦', baseServings:4,
    prepMinutes:10,cookMinutes:18,difficulty:'Fácil',mealType:'Cena',style:'Rápida',cuisine:'Italiana',
    ingredients:[
      {name:'Pasta',quantity:360,unit:'g',section:'Pasta',scalingMode:'linear'},
      {name:'Brócoli',quantity:450,unit:'g',section:'Pasta',scalingMode:'linear'},
      {name:'Ajo',quantity:2,unit:'ud',section:'Salsa',scalingMode:'discrete'},
      {name:'Parmesano',quantity:60,unit:'g',section:'Final',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:35,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Sal',quantity:5,unit:'g',section:'General',scalingMode:'culinary'}
    ],
    miseEnPlace:['Separar el brócoli en flores pequeñas.','Laminar el ajo.','Poner una olla grande con agua a hervir.'],
    steps:[
      {number:1,instruction:'Cuece la pasta en agua con sal. Añade el brócoli a la misma olla durante los últimos 4 minutos.',minutes:11,cue:'La pasta debe quedar al dente y el brócoli tierno pero verde.'},
      {number:2,instruction:'Mientras, cocina el ajo con el aceite a fuego bajo durante 2 minutos, sin que llegue a dorarse.',minutes:2},
      {number:3,instruction:'Escurre pasta y brócoli reservando un poco de agua de cocción. Mézclalos con el aceite de ajo durante 2 minutos.',minutes:2},
      {number:4,instruction:'Fuera del fuego, añade parmesano y suficiente agua de cocción para ligar una salsa ligera.',minutes:1}
    ],
    criticalPoints:['No tuestes el ajo.','Reserva agua de cocción para emulsionar el queso y el aceite.'],
    substitutions:['Coliflor puede sustituir al brócoli.','Grana Padano o un queso curado similar puede sustituir al parmesano.'],
    storage:'Refrigerar hasta 48 horas. Recalentar con una cucharada de agua.',
    nutritionPerServing:{kcal:500,proteinG:21,carbsG:70,fatG:15}
  },
  {
    id:'ternera-noodles-verduras', title:'Noodles salteados con ternera y verduras',
    description:'Salteado asiático rápido con ternera, verduras crujientes y salsa de soja.', emoji:'🍜', baseServings:4,
    prepMinutes:15,cookMinutes:15,difficulty:'Media',mealType:'Cena',style:'Rápida',cuisine:'Asiática',
    ingredients:[
      {name:'Ternera',quantity:450,unit:'g',section:'Salteado',scalingMode:'linear'},
      {name:'Noodles',quantity:300,unit:'g',section:'Base',scalingMode:'linear'},
      {name:'Pimiento',quantity:220,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Zanahoria',quantity:160,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Cebolla',quantity:120,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Salsa de soja',quantity:45,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Aceite',quantity:25,unit:'ml',section:'Salteado',scalingMode:'culinary'}
    ],
    miseEnPlace:['Cortar la ternera en tiras finas a contrapelo.','Cortar pimiento, zanahoria y cebolla en tiras.','Preparar los noodles según el envase y escurrirlos bien.'],
    steps:[
      {number:1,instruction:'Calienta una sartén o wok muy amplio y saltea la ternera con la mitad del aceite durante 2–3 minutos. Retira.',minutes:3,cue:'La ternera debe dorarse sin cocerse en su jugo.'},
      {number:2,instruction:'Añade el resto del aceite y saltea pimiento, zanahoria y cebolla 4 minutos a fuego alto.',minutes:4},
      {number:3,instruction:'Devuelve la ternera, añade los noodles y la salsa de soja y saltea 2–3 minutos.',minutes:3,cue:'Todo debe quedar muy caliente y las verduras conservar firmeza.'}
    ],
    criticalPoints:['Cocina en tandas si la sartén es pequeña.','No añadas sal antes de probar: la soja aporta suficiente salinidad en muchos casos.'],
    substitutions:['Pollo o pavo pueden sustituir a la ternera.','Tamari puede sustituir a la salsa de soja.'],
    storage:'Refrigerar hasta 24 horas y recalentar completamente en sartén.',
    nutritionPerServing:{kcal:525,proteinG:35,carbsG:61,fatG:15}
  },
  {
    id:'shakshuka', title:'Shakshuka de tomate y huevo',
    description:'Huevos cuajados en una salsa especiada de tomate y pimiento.', emoji:'🍳', baseServings:4,
    prepMinutes:12,cookMinutes:25,difficulty:'Fácil',mealType:'Cena',style:'Saludable',cuisine:'Árabe / Oriente Medio',
    ingredients:[
      {name:'Huevos',quantity:6,unit:'ud',section:'Final',scalingMode:'discrete'},
      {name:'Tomate triturado',quantity:650,unit:'g',section:'Salsa',scalingMode:'linear'},
      {name:'Pimiento',quantity:250,unit:'g',section:'Salsa',scalingMode:'linear'},
      {name:'Cebolla',quantity:140,unit:'g',section:'Salsa',scalingMode:'linear'},
      {name:'Ajo',quantity:2,unit:'ud',section:'Salsa',scalingMode:'discrete'},
      {name:'Comino',quantity:3,unit:'g',section:'Especias',scalingMode:'culinary'},
      {name:'Pimentón dulce',quantity:3,unit:'g',section:'Especias',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:25,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Sal',quantity:4,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Picar cebolla y ajo.','Cortar el pimiento en dados pequeños.','Tener los huevos a mano para añadirlos rápidamente.'],
    steps:[
      {number:1,instruction:'Sofríe cebolla y pimiento con el aceite a fuego medio durante 8 minutos.',minutes:8},
      {number:2,instruction:'Añade ajo, comino y pimentón y cocina 30 segundos.',minutes:1},
      {number:3,instruction:'Incorpora el tomate triturado y cocina 10–12 minutos hasta obtener una salsa espesa. Ajusta de sal.',minutes:11,cue:'Al pasar la cuchara, la salsa debe dejar un surco visible unos segundos.'},
      {number:4,instruction:'Haz seis huecos, casca los huevos dentro y cocina tapado a fuego suave 5–7 minutos.',minutes:6,cue:'La clara debe estar cuajada y la yema todavía cremosa.'}
    ],
    criticalPoints:['Reduce bien la salsa antes de añadir los huevos.','Controla el final de la cocción para no endurecer las yemas.'],
    substitutions:['Tomate fresco maduro puede sustituir al triturado, aumentando el tiempo de reducción.','Calabacín puede sustituir parte del pimiento.'],
    storage:'La salsa puede refrigerarse hasta 3 días; es mejor añadir y cocinar los huevos al momento.',
    nutritionPerServing:{kcal:280,proteinG:15,carbsG:20,fatG:15}
  },
  {
    id:'crema-calabaza-zanahoria', title:'Crema de calabaza y zanahoria',
    description:'Crema vegetal suave y equilibrada, fácil de preparar y recalentar.', emoji:'🎃', baseServings:4,
    prepMinutes:12,cookMinutes:28,difficulty:'Fácil',mealType:'Cena',style:'Saludable',cuisine:'Mediterránea',
    ingredients:[
      {name:'Calabaza',quantity:700,unit:'g',section:'Crema',scalingMode:'linear'},
      {name:'Zanahoria',quantity:250,unit:'g',section:'Crema',scalingMode:'linear'},
      {name:'Cebolla',quantity:140,unit:'g',section:'Sofrito',scalingMode:'linear'},
      {name:'Patata',quantity:180,unit:'g',section:'Crema',scalingMode:'linear'},
      {name:'Caldo de verduras',quantity:750,unit:'ml',section:'Crema',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:25,unit:'ml',section:'Sofrito',scalingMode:'culinary'},
      {name:'Sal',quantity:5,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Pelar y cortar calabaza, zanahoria y patata en dados de tamaño similar.','Picar la cebolla.','Calentar el caldo.'],
    steps:[
      {number:1,instruction:'Sofríe la cebolla con el aceite a fuego medio durante 5 minutos.',minutes:5},
      {number:2,instruction:'Añade calabaza, zanahoria y patata y rehoga 3 minutos.',minutes:3},
      {number:3,instruction:'Añade el caldo caliente y cuece a hervor suave 18–20 minutos.',minutes:19,cue:'Todas las verduras deben atravesarse fácilmente con un cuchillo.'},
      {number:4,instruction:'Tritura hasta obtener una crema lisa y ajusta de sal y de textura con un poco más de caldo si hace falta.',minutes:2}
    ],
    criticalPoints:['No añadas todo el líquido extra antes de triturar; es más fácil aligerar que espesar.','Tritura el tiempo suficiente para obtener una textura fina.'],
    substitutions:['Boniato puede sustituir a la patata.','Agua puede sustituir al caldo si se refuerza el sofrito.'],
    storage:'Refrigerar hasta 3 días. Recalentar a fuego medio removiendo de vez en cuando.',
    nutritionPerServing:{kcal:230,proteinG:5,carbsG:38,fatG:7}
  },
  {
    id:'cuscus-pollo-verduras', title:'Cuscús con pollo y verduras especiadas',
    description:'Plato rápido de cuscús suelto, pollo dorado y verduras especiadas.', emoji:'🍲', baseServings:4,
    prepMinutes:15,cookMinutes:22,difficulty:'Fácil',mealType:'Comida',style:'Rápida',cuisine:'Árabe / Oriente Medio',
    ingredients:[
      {name:'Cuscús',quantity:300,unit:'g',section:'Base',scalingMode:'linear'},
      {name:'Pechuga de pollo',quantity:450,unit:'g',section:'Salteado',scalingMode:'linear'},
      {name:'Calabacín',quantity:280,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Zanahoria',quantity:180,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Cebolla',quantity:120,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Caldo de verduras',quantity:330,unit:'ml',section:'Base',scalingMode:'culinary'},
      {name:'Comino',quantity:3,unit:'g',section:'Especias',scalingMode:'culinary'},
      {name:'Aceite de oliva',quantity:30,unit:'ml',section:'Salteado',scalingMode:'culinary'},
      {name:'Sal',quantity:4,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Cortar pollo, calabacín, zanahoria y cebolla en piezas pequeñas.','Calentar el caldo.','Medir el cuscús en un bol amplio.'],
    steps:[
      {number:1,instruction:'Saltea el pollo con la mitad del aceite a fuego medio-alto durante 5 minutos y resérvalo.',minutes:5},
      {number:2,instruction:'Añade el resto del aceite y cocina cebolla y zanahoria 5 minutos. Incorpora el calabacín y cocina 4 minutos más.',minutes:9},
      {number:3,instruction:'Añade el comino, devuelve el pollo y cocina todo junto 2 minutos. Ajusta de sal.',minutes:2},
      {number:4,instruction:'Vierte el caldo hirviendo sobre el cuscús, tapa 5 minutos y suéltalo con un tenedor.',minutes:5},
      {number:5,instruction:'Sirve el cuscús con el salteado de pollo y verduras por encima.',minutes:1}
    ],
    criticalPoints:['No añadas demasiado líquido al cuscús.','Corta las verduras de tamaño parecido para que se cocinen de forma uniforme.'],
    substitutions:['Pavo puede sustituir al pollo.','Bulgur puede sustituir al cuscús adaptando su tiempo de cocción.'],
    storage:'Refrigerar hasta 48 horas. Recalentar el salteado y airear el cuscús antes de servir.',
    nutritionPerServing:{kcal:520,proteinG:38,carbsG:62,fatG:13}
  },
  {
    id:'fajitas-ternera', title:'Fajitas de ternera y pimientos',
    description:'Tiras de ternera y pimientos salteados para montar en tortillas calientes.', emoji:'🌯', baseServings:4,
    prepMinutes:15,cookMinutes:18,difficulty:'Fácil',mealType:'Cena',style:'Rápida',cuisine:'Mexicana',
    ingredients:[
      {name:'Ternera',quantity:500,unit:'g',section:'Relleno',scalingMode:'linear'},
      {name:'Tortillas de trigo',quantity:8,unit:'ud',section:'Base',scalingMode:'discrete'},
      {name:'Pimiento',quantity:350,unit:'g',section:'Relleno',scalingMode:'linear'},
      {name:'Cebolla',quantity:180,unit:'g',section:'Relleno',scalingMode:'linear'},
      {name:'Lima',quantity:1,unit:'ud',section:'Final',scalingMode:'discrete'},
      {name:'Comino',quantity:3,unit:'g',section:'Especias',scalingMode:'culinary'},
      {name:'Aceite',quantity:25,unit:'ml',section:'Salteado',scalingMode:'culinary'},
      {name:'Sal',quantity:4,unit:'g',section:'Final',scalingMode:'culinary'}
    ],
    miseEnPlace:['Cortar la ternera en tiras finas a contrapelo.','Cortar pimiento y cebolla en tiras.','Preparar la lima en gajos.'],
    steps:[
      {number:1,instruction:'Saltea la ternera con la mitad del aceite a fuego muy alto durante 3 minutos y retírala.',minutes:3,cue:'Debe dorarse por fuera sin secarse.'},
      {number:2,instruction:'Añade el resto del aceite, pimiento y cebolla y saltea 6–7 minutos.',minutes:7},
      {number:3,instruction:'Devuelve la ternera, añade comino y sal y saltea 2 minutos más.',minutes:2},
      {number:4,instruction:'Calienta las tortillas y sirve el relleno con lima recién exprimida.',minutes:3}
    ],
    criticalPoints:['Evita amontonar la ternera para que se dore en vez de cocerse.','No prolongues la segunda cocción de la carne.'],
    substitutions:['Pollo puede sustituir a la ternera.','Tortillas de maíz pueden sustituir a las de trigo.'],
    storage:'Conservar el relleno refrigerado hasta 48 horas; calentar las tortillas al servir.',
    nutritionPerServing:{kcal:510,proteinG:34,carbsG:49,fatG:20}
  }
];
