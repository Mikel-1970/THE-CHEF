import {test,expect} from '@playwright/test';
import {chefLibrary} from '../src/data/library';
import {dishCategory,matchesDishCategory} from '../src/utils/dishCategories';
test('new categories classify titles without treating ingredient bread as a bread recipe',()=>{
 const base=chefLibrary[0];
 for(const title of ['Pan integral','Panecillos de leche','Focaccia'])expect(dishCategory({...base,title})).toBe('Panes');
 for(const title of ['Bizcocho de limón','Muffins de chocolate','Donuts glaseados'])expect(dishCategory({...base,title,recipeKind:'dessert',libraryCategory:'Postres'})).toBe('Bizcochos, muffins y donuts');
 expect(dishCategory({...base,title:'Merluza',libraryCategory:'Pescados'})).toBe('Pescados y mariscos');
 expect(dishCategory({...base,title:'Ensalada',libraryCategory:'Verduras'})).toBe('Verduras y ensaladas');
 expect(dishCategory({...base,title:'Sopa de ajo con pan',libraryCategory:'Sopas y cremas'})).toBe('Sopas y cremas');
 expect(matchesDishCategory({...base,style:'Alta cocina'},'Alta cocina')).toBe(true);
 expect(matchesDishCategory({...base,style:'Tradicional'},'Alta cocina')).toBe(false);
});
