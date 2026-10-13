import fs from 'node:fs';
import ts from 'typescript';
async function readData(path){const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}
const {techniqueBasics}=await readData('src/data/techniqueBasics.ts');
const {cookingTips}=await readData('src/data/cookingTips.ts');
const quote=value=>"'"+value.replaceAll("'","''")+"'";
let sql=fs.readFileSync('migrations/0001_culinary_catalog.sql','utf8');
for(const [table,rows] of [['culinary_techniques',techniqueBasics],['culinary_tips',cookingTips]])for(const row of rows)sql+=`\nINSERT INTO ${table} (id,payload) VALUES (${quote(row.id)},${quote(JSON.stringify(row))}) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload;`;
fs.mkdirSync('work',{recursive:true});fs.writeFileSync('work/catalog-seed.sql',sql);
console.log(`${techniqueBasics.length} técnicas; ${cookingTips.length} tips. SQL: work/catalog-seed.sql`);
