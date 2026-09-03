import { AlertTriangle, Check, Clock3, LoaderCircle, RefreshCw, ShoppingBasket, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Proposal } from '../domain/types';

function badgeClass(classification: NonNullable<Proposal['classification']>) {
  if (classification === 'Con lo que tienes') return 'badge success';
  if (classification === 'Te falta muy poco') return 'badge warn';
  return 'badge neutral';
}

export function ProposalCard({ proposal, index, onSelect, generating = false }: {
  proposal: Proposal;
  index: number;
  onSelect?: (proposal: Proposal) => void;
  generating?: boolean;
}) {
  const navigate = useNavigate();
  const open = () => {
    if (generating) return;
    if (onSelect) onSelect(proposal);
    else navigate(`/receta/${proposal.recipeId}`);
  };

  return (
    <article className="proposal-card" onClick={open} aria-busy={generating} style={generating ? { opacity: 0.72, pointerEvents: 'none' } : undefined}>
      <div className={`proposal-visual visual-${index % 3}`}>
        <span className="proposal-number">0{index + 1}</span>
        <span className="proposal-emoji">{proposal.emoji}</span>
        <div className="photo-shimmer" />
      </div>
      <div className="proposal-body">
        {proposal.classification && <span className={badgeClass(proposal.classification)}>{proposal.classification}</span>}
        <h3>{proposal.title}</h3>
        <p>{proposal.subtitle}</p>
        <div className="meta-row">
          <span><Clock3 size={15} /> {proposal.minutes} min</span>
          <span><Star size={15} /> {proposal.difficulty}</span>
        </div>
        <div className="reason"><Sparkles size={16} /> {proposal.reason}</div>
        {proposal.usedIngredients.length > 0 && <div className="mini-list"><Check size={15} /><span><strong>Usas:</strong> {proposal.usedIngredients.join(', ')}</span></div>}
        {(proposal.substitutionNotes?.length ?? 0) > 0 && <div className="mini-list"><RefreshCw size={15} /><span><strong>Sustituye:</strong> {proposal.substitutionNotes?.join(' · ')}</span></div>}
        {(proposal.insufficientIngredients?.length ?? 0) > 0 && <div className="mini-list missing"><AlertTriangle size={15} /><span><strong>No alcanza:</strong> {proposal.insufficientIngredients?.join(' · ')}</span></div>}
        {proposal.missingIngredients.length > 0 && <div className="mini-list missing"><ShoppingBasket size={15} /><span><strong>Falta:</strong> {proposal.missingIngredients.join(', ')}</span></div>}
        {generating && <div className="helper-note" style={{ marginTop: 12 }}><LoaderCircle size={16} className="spin" /> Generando la receta completa…</div>}
      </div>
    </article>
  );
}
