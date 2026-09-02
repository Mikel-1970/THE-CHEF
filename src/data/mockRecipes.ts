import type { Recipe } from '../domain/types';
import { additionalRecipes } from './additionalRecipes';

const baseRecipes: Recipe[] = [
  {
    id: 'arroz-pollo-calabacin', title: 'Arroz cremoso de pollo y calabacín',
    description: 'Arroz sabroso y moderno, cremoso sin resultar pesado.', emoji: '🍚', baseServings: 4,
    prepMinutes: 10, cookMinutes: 28, difficulty: 'Fácil', mealType: 'Cena', style: 'Moderna', cuisine: 'Mediterránea',
    ingredients: [
      { name:'Arroz', quantity:320, unit:'g', section:'Arroz', scalingMode:'linear' },
      { name:'Pechuga de pollo', quantity:450, unit:'g', section:'Arroz', scalingMode:'linear' },
      { name:'Calabacín', quantity:300, unit:'g', section:'Arroz', scalingMode:'linear' },
      { name:'Cebolla', quantity:120, unit:'g', section:'Sofrito', scalingMode:'linear' },
      { name:'Caldo de pollo', quantity:900, unit:'ml', section:'Arroz', scalingMode:'culinary' },
      { name:'Aceite de oliva', quantity:30, unit:'ml', section:'Sofrito', scalingMode:'culinary' },
      { name:'Parmesano', quantity:45, unit:'g', section:'Final', scalingMode:'culinary', optional:true },
      { name:'Sal', quantity:5, unit:'g', section:'Final', scalingMode:'culinary' }
    ],
    miseEnPlace:['Cortar el pollo en dados de 2 cm.','Rallar o picar fino el calabacín.','Mantener el caldo caliente.'],
    steps:[
      {number:1,instruction:'Calienta el aceite y sofríe la cebolla 4 minutos a fuego medio.',minutes:4,cue:'Debe quedar translúcida, sin tostarse.'},
      {number:2,instruction:'Añade el pollo y dóralo 4 minutos a fuego medio-alto.',minutes:4,cue:'El exterior debe tomar algo de color.'},
      {number:3,instruction:'Incorpora el calabacín y cocina 3 minutos.',minutes:3},
      {number:4,instruction:'Añade el arroz y rehógalo 1 minuto.',minutes:1},
      {number:5,instruction:'Añade el caldo caliente poco a poco y cocina unos 15 minutos, removiendo ocasionalmente.',minutes:15,cue:'El arroz debe quedar tierno y cremoso.'},
      {number:6,instruction:'Retira del fuego, ajusta de sal y añade el parmesano si lo utilizas. Reposa 2 minutos.',minutes:2}
    ],
    criticalPoints:['No dejes secar completamente el arroz.','Añade el caldo caliente para no cortar la cocción.'],
    substitutions:['Caldo de verduras puede sustituir al de pollo.','Un queso curado suave puede sustituir al parmesano.'],
    storage:'Guardar refrigerado hasta 24 horas. Recalentar con 1–2 cucharadas de agua o caldo.',
    nutritionPerServing:{kcal:535,proteinG:39,carbsG:64,fatG:13}
  },
  {
    id:'salteado-pollo-arroz-huevo', title:'Arroz salteado con pollo, calabacín y huevo',
    description:'Una opción rápida y sabrosa inspirada en un salteado asiático.', emoji:'🥢', baseServings:4,
    prepMinutes:12,cookMinutes:18,difficulty:'Fácil',mealType:'Cena',style:'Rápida',cuisine:'Asiática',
    ingredients:[
      {name:'Arroz',quantity:300,unit:'g',section:'Base',scalingMode:'linear'},
      {name:'Pechuga de pollo',quantity:400,unit:'g',section:'Salteado',scalingMode:'linear'},
      {name:'Calabacín',quantity:280,unit:'g',section:'Salteado',scalingMode:'linear'},
      {name:'Huevos',quantity:3,unit:'ud',section:'Salteado',scalingMode:'discrete'},
      {name:'Salsa de soja',quantity:35,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Aceite',quantity:25,unit:'ml',section:'Salteado',scalingMode:'culinary'}
    ],
    miseEnPlace:['Cocer el arroz si no está cocinado y enfriarlo ligeramente.','Cortar pollo y calabacín en piezas pequeñas.','Batir los huevos.'],
    steps:[
      {number:1,instruction:'Saltea el pollo con la mitad del aceite durante 5 minutos a fuego alto.',minutes:5},
      {number:2,instruction:'Añade el calabacín y saltea 3 minutos.',minutes:3},
      {number:3,instruction:'Aparta a un lado, añade el huevo batido y cuájalo removiendo 2 minutos.',minutes:2},
      {number:4,instruction:'Incorpora el arroz y la salsa de soja. Saltea todo junto 4 minutos.',minutes:4,cue:'El arroz debe quedar suelto y caliente.'}
    ],
    criticalPoints:['No sobrecargues la sartén; el salteado necesita temperatura alta.','Prueba antes de añadir sal: la soja ya aporta salinidad.'],
    substitutions:['Tamari puede sustituir a la soja.','Pavo o tofu firme pueden sustituir al pollo.'],
    storage:'Refrigerar un máximo de 24 horas y recalentar completamente antes de consumir.',
    nutritionPerServing:{kcal:505,proteinG:38,carbsG:58,fatG:14}
  },
  {
    id:'pollo-limon-arroz', title:'Pollo al limón con arroz y calabacín dorado',
    description:'Plato limpio y vistoso con pollo jugoso y calabacín dorado.', emoji:'🍋', baseServings:4,
    prepMinutes:10,cookMinutes:25,difficulty:'Media',mealType:'Comida',style:'Moderna',cuisine:'Mediterránea',
    ingredients:[
      {name:'Pechuga de pollo',quantity:500,unit:'g',section:'Pollo',scalingMode:'linear'},
      {name:'Arroz',quantity:280,unit:'g',section:'Arroz',scalingMode:'linear'},
      {name:'Calabacín',quantity:350,unit:'g',section:'Guarnición',scalingMode:'linear'},
      {name:'Limón',quantity:1,unit:'ud',section:'Pollo',scalingMode:'discrete'},
      {name:'Aceite de oliva',quantity:30,unit:'ml',section:'General',scalingMode:'culinary'},
      {name:'Ajo',quantity:1,unit:'ud',section:'Pollo',scalingMode:'discrete',optional:true}
    ],
    miseEnPlace:['Cortar el calabacín en medias lunas.','Exprimir medio limón y cortar el resto en gajos.','Secar bien el pollo antes de dorarlo.'],
    steps:[
      {number:1,instruction:'Cuece el arroz según el tipo utilizado y mantenlo caliente.',minutes:15},
      {number:2,instruction:'Dora el calabacín en sartén amplia con parte del aceite durante 6 minutos.',minutes:6,cue:'Debe tener zonas doradas y conservar firmeza.'},
      {number:3,instruction:'Retira el calabacín y cocina el pollo 4–5 minutos por cada lado según grosor.',minutes:9,cue:'Debe quedar dorado y completamente cocinado por dentro.'},
      {number:4,instruction:'Añade el zumo de limón y, si quieres, el ajo picado. Cocina 1 minuto y devuelve el calabacín a la sartén.',minutes:1}
    ],
    criticalPoints:['No sobrecocines el pollo.','La sartén debe estar bien caliente para dorar el calabacín.'],
    substitutions:['Lima puede sustituir al limón.','Cuscús puede sustituir al arroz si buscas menos tiempo.'],
    storage:'Refrigerar hasta 48 horas. Recalentar el pollo suavemente para evitar que se reseque.',
    nutritionPerServing:{kcal:470,proteinG:41,carbsG:52,fatG:10}
  },
  {
    id:'pasta-tomate-burrata', title:'Pasta cremosa de tomate y burrata',
    description:'Pasta italiana sencilla y vistosa con tomate concentrado y burrata fresca.', emoji:'🍝', baseServings:4,
    prepMinutes:8,cookMinutes:22,difficulty:'Fácil',mealType:'Cena',style:'Casera',cuisine:'Italiana',
    ingredients:[
      {name:'Pasta',quantity:360,unit:'g',section:'Pasta',scalingMode:'linear'},
      {name:'Tomate triturado',quantity:500,unit:'g',section:'Salsa',scalingMode:'linear'},
      {name:'Burrata',quantity:250,unit:'g',section:'Final',scalingMode:'linear'},
      {name:'Ajo',quantity:1,unit:'ud',section:'Salsa',scalingMode:'discrete'},
      {name:'Aceite de oliva',quantity:25,unit:'ml',section:'Salsa',scalingMode:'culinary'},
      {name:'Albahaca',quantity:10,unit:'g',section:'Final',scalingMode:'culinary',optional:true}
    ],
    miseEnPlace:['Poner agua abundante a hervir.','Picar el ajo.','Escurrir la burrata.'],
    steps:[
      {number:1,instruction:'Cuece la pasta hasta quedar al dente.',minutes:10},
      {number:2,instruction:'Sofríe el ajo 30 segundos, añade el tomate y cocina 12 minutos.',minutes:12,cue:'La salsa debe perder sabor a tomate crudo.'},
      {number:3,instruction:'Mezcla la pasta con la salsa y un poco de agua de cocción.',minutes:2},
      {number:4,instruction:'Sirve con la burrata repartida por encima y albahaca si tienes.'}
    ],
    criticalPoints:['Reserva agua de cocción antes de escurrir la pasta.'],
    substitutions:['Mozzarella fresca puede sustituir a la burrata.'],
    storage:'La pasta con salsa se conserva 24–48 horas; añade el queso fresco al servir.',
    nutritionPerServing:{kcal:610,proteinG:24,carbsG:78,fatG:22}
  },
  {
    id:'tacos-pollo', title:'Tacos rápidos de pollo y verduras',
    description:'Cena informal, fresca y rápida con pollo especiado y verduras crujientes.', emoji:'🌮', baseServings:4,
    prepMinutes:15,cookMinutes:15,difficulty:'Fácil',mealType:'Cena',style:'Rápida',cuisine:'Mexicana',
    ingredients:[
      {name:'Pechuga de pollo',quantity:450,unit:'g',section:'Relleno',scalingMode:'linear'},
      {name:'Tortillas de maíz',quantity:8,unit:'ud',section:'Base',scalingMode:'discrete'},
      {name:'Pimiento',quantity:250,unit:'g',section:'Relleno',scalingMode:'linear'},
      {name:'Cebolla',quantity:120,unit:'g',section:'Relleno',scalingMode:'linear'},
      {name:'Lima',quantity:1,unit:'ud',section:'Final',scalingMode:'discrete'},
      {name:'Comino',quantity:3,unit:'g',section:'Especias',scalingMode:'culinary'}
    ],
    miseEnPlace:['Cortar pollo y verduras en tiras.','Calentar las tortillas al final.'],
    steps:[
      {number:1,instruction:'Saltea el pollo con comino y un poco de aceite durante 6 minutos.',minutes:6},
      {number:2,instruction:'Añade cebolla y pimiento y cocina 6 minutos más.',minutes:6},
      {number:3,instruction:'Calienta las tortillas y rellénalas con el salteado.',minutes:2},
      {number:4,instruction:'Termina con lima al gusto.'}
    ],
    criticalPoints:['Mantén el fuego alto para que las verduras no se cuezan en su agua.'],
    substitutions:['Puedes usar tortillas de trigo.','El pollo puede sustituirse por tiras de ternera o tofu.'],
    storage:'Conserva el relleno refrigerado hasta 48 horas y monta los tacos al servir.',
    nutritionPerServing:{kcal:455,proteinG:36,carbsG:48,fatG:12}
  },
  {
    id:'ensalada-garbanzos-huevo', title:'Ensalada templada de garbanzos y huevo',
    description:'Plato completo, rápido y saludable con legumbre, huevo y verduras.', emoji:'🥗', baseServings:4,
    prepMinutes:12,cookMinutes:12,difficulty:'Fácil',mealType:'Comida',style:'Saludable',cuisine:'Mediterránea',
    ingredients:[
      {name:'Garbanzos cocidos',quantity:600,unit:'g',section:'Base',scalingMode:'linear'},
      {name:'Huevos',quantity:4,unit:'ud',section:'Base',scalingMode:'discrete'},
      {name:'Tomate',quantity:300,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Calabacín',quantity:250,unit:'g',section:'Verduras',scalingMode:'linear'},
      {name:'Aceite de oliva',quantity:30,unit:'ml',section:'Aliño',scalingMode:'culinary'},
      {name:'Vinagre',quantity:15,unit:'ml',section:'Aliño',scalingMode:'culinary'}
    ],
    miseEnPlace:['Escurrir y enjuagar los garbanzos.','Cortar tomate y calabacín.'],
    steps:[
      {number:1,instruction:'Cuece los huevos 9 minutos y enfríalos.',minutes:9},
      {number:2,instruction:'Saltea el calabacín 5 minutos a fuego medio-alto.',minutes:5},
      {number:3,instruction:'Añade los garbanzos y calienta 2 minutos.',minutes:2},
      {number:4,instruction:'Mezcla con tomate, aceite y vinagre. Termina con el huevo cortado.'}
    ],
    criticalPoints:['Enfría los huevos tras la cocción para cortar el calor.'],
    substitutions:['Lentejas cocidas pueden sustituir a los garbanzos.'],
    storage:'Conservar refrigerada hasta 24 horas; mejor añadir el tomate justo antes de servir.',
    nutritionPerServing:{kcal:420,proteinG:22,carbsG:42,fatG:18}
  }
];

export const mockRecipes: Recipe[] = [...baseRecipes, ...additionalRecipes];
