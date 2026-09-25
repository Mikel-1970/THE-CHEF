import { test, expect } from '@playwright/test';
import type { Recipe } from '../src/domain/types';
import { techniqueMaster } from '../src/data/techniqueMaster';
import { enrichRecipeTechniques, getTechniqueById, inferTechniqueIdsFromText, resolveTechnique } from '../src/services/techniqueResolver';

test('master technique library is canonical and unique',()=>{
  expect(techniqueMaster).toHaveLength(180);
  expect(new Set(techniqueMaster.map(item=>item.id)).size).toBe(180);
  expect(new Set(techniqueMaster.map(item=>item.title)).size).toBe(180);
  expect(techniqueMaster.filter(item=>item.requiresValidatedRecipe).length).toBeGreaterThan(20);
});

test('resolver uses ids, names, aliases and culinary verb stems',()=>{
  expect(getTechniqueById('TEC-PREP-001')?.title).toBe('Pelar');
  expect(resolveTechnique('mondar')?.title).toBe('Pelar');
  expect(inferTechniqueIdsFromText('Saltea las verduras a fuego alto durante cuatro minutos.')).toContain('TEC-SART-001');
  expect(inferTechniqueIdsFromText('Hornea el pescado hasta que esté dorado.')).toContain('TEC-FUEG-001');
});

test('old recipes can be enriched without breaking their schema',()=>{
  const recipe:Recipe={
    id:'test',title:'Verduras salteadas',description:'Prueba',emoji:'🥕',baseServings:2,prepMinutes:5,cookMinutes:8,difficulty:'Fácil',
    mealType:'Comida',style:'Casera',cuisine:'Mediterránea',
    ingredients:[{name:'verduras',quantity:300,unit:'g',scalingMode:'linear'}],
    miseEnPlace:['Cortar las verduras.'],
    steps:[{number:1,instruction:'Saltea las verduras a fuego alto durante 4 minutos.',minutes:4,cue:'Deben quedar ligeramente doradas.'}],
    criticalPoints:['No llenar la sartén.'],substitutions:[],storage:'Consumir recién hecho.',
    nutritionPerServing:{kcal:120,proteinG:3,carbsG:14,fatG:6}
  };
  const enriched=enrichRecipeTechniques(recipe);
  expect(enriched.techniqueIds).toContain('TEC-SART-001');
  expect(enriched.steps[0].techniqueIds).toContain('TEC-SART-001');
  expect(enriched.steps[0].successSignals?.length).toBeGreaterThan(0);
});


test('master technique content is specific and teachable',()=>{
  expect(techniqueMaster.every(item=>item.steps.length>=3)).toBeTruthy();
  expect(techniqueMaster.every(item=>item.ingredients.length>0)).toBeTruthy();
  expect(techniqueMaster.every(item=>(item.miseEnPlace?.length??0)>0)).toBeTruthy();
  expect(techniqueMaster.some(item=>item.steps.some(step=>step.instruction.includes('Aplicar la técnica')))).toBeFalsy();
  expect(techniqueMaster.some(item=>item.whenToUse?.includes('Cuando la receta necesite el efecto culinario propio'))).toBeFalsy();
  expect(techniqueMaster.some(item=>item.chefTip?.includes('prioriza la señal culinaria real sobre un tiempo fijo'))).toBeFalsy();

  const boil=techniqueMaster.find(item=>item.title==='Hervir');
  expect(boil).toBeTruthy();
  expect(boil?.steps.join(' ')).toContain('ebullición');
  expect(boil?.steps.join(' ')).toContain('hervor');
  expect(boil?.ingredients.length).toBeGreaterThanOrEqual(2);
  expect(boil?.miseEnPlace?.join(' ')).toContain('olla');
});
