import type {Recipe} from '../domain/types';

export const EU_ALLERGENS=[
 'Gluten','Crustáceos','Huevos','Pescado','Cacahuetes','Soja','Leche','Frutos de cáscara',
 'Apio','Mostaza','Sésamo','Sulfitos','Altramuces','Moluscos'
] as const;
export type EuAllergen=typeof EU_ALLERGENS[number];

const RULES:Record<EuAllergen,RegExp[]>={
 Gluten:[/\btrigo\b/i,/\bcebada\b/i,/\bcenteno\b/i,/\bespelta\b/i,/\bkamut\b/i,/\bavena\b/i,/\bharina de trigo\b/i,/\bpan\b/i,/\bpasta\b/i,/\bcusc[uú]s\b/i,/\bseitan\b/i],
 Crustáceos:[/\bgamb[ao]s?\b/i,/\blangostin[oa]s?\b/i,/\bcamar[oó]n(?:es)?\b/i,/\bcangrejos?\b/i,/\bbogavantes?\b/i,/\blangostas?\b/i,/\bcigalas?\b/i,/\bcrust[aá]ceos?\b/i],
 Huevos:[/\bhuevos?\b/i,/\byemas?\b/i,/\bclaras? de huevo\b/i,/\bmayonesa\b/i],
 Pescado:[/\bpescado\b/i,/\bsalm[oó]n\b/i,/\bat[uú]n\b/i,/\bbacalao\b/i,/\bmerluza\b/i,/\banchoas?\b/i,/\bsardinas?\b/i,/\bbonito\b/i,/\btrucha\b/i],
 Cacahuetes:[/\bcacahuetes?\b/i,/\bman[ií]\b/i],
 Soja:[/\bsoja\b/i,/\btofu\b/i,/\bedamame\b/i,/\btempeh\b/i],
 Leche:[/\bleche\b/i,/\bquesos?\b/i,/\bmantequilla\b/i,/\bnata\b/i,/\byogur(?:es)?\b/i,/\bsuero de leche\b/i],
 'Frutos de cáscara':[/\balmendras?\b/i,/\bavellanas?\b/i,/\bnueces?\b/i,/\banacardos?\b/i,/\bpistachos?\b/i,/\bpecanas?\b/i,/\bnuez de brasil\b/i,/\bmacadamias?\b/i],
 Apio:[/\bapio\b/i],
 Mostaza:[/\bmostaza\b/i],
 Sésamo:[/\bs[eé]samo\b/i,/\btahini\b/i],
 Sulfitos:[/\bsulfitos?\b/i,/\bdi[oó]xido de azufre\b/i],
 Altramuces:[/\baltramuces?\b/i,/\blupino\b/i],
 Moluscos:[/\bmejillones?\b/i,/\balmejas?\b/i,/\bostras?\b/i,/\bcalamares?\b/i,/\bsepias?\b/i,/\bpulpos?\b/i,/\bmoluscos?\b/i]
};

export function detectRecipeAllergens(recipe:Pick<Recipe,'ingredients'>):EuAllergen[]{
 const text=recipe.ingredients.map(i=>i.name).join(' · ');
 return EU_ALLERGENS.filter(a=>RULES[a].some(rule=>rule.test(text)));
}
