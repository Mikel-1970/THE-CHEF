import { ExternalLink, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import type { Recipe, RecipeSource } from '../domain/types';
import '../recipe-source.css';

export function RecipeSourceNote({ recipe }: { recipe: Recipe }) {
  const source: RecipeSource = recipe.source ?? { kind: 'local', label: 'Catálogo El Chef' };
  const isWeb = source.kind === 'web';
  const isAi = source.kind === 'ai';
  const Icon = isWeb ? Globe2 : isAi ? Sparkles : ShieldCheck;

  return (
    <section className="trust-strip recipe-source-note">
      <Icon size={18} />
      <div>
        <strong>{isWeb ? 'Fuente web contrastada' : isAi ? 'Receta generada y validada por El Chef' : 'Receta del catálogo El Chef'}</strong>
        <span>
          {source.publisher || source.label}
          {source.adapted ? ' · Adaptada por El Chef' : ''}
          {source.url && (
            <> · <a href={source.url} target="_blank" rel="noreferrer">Ver fuente <ExternalLink size={12} /></a></>
          )}
        </span>
      </div>
    </section>
  );
}
