import { Check, Clock3, ShoppingBasket, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Proposal } from '../domain/types';

function badgeClass(classification: Proposal['classification']) {
  if (classification === 'Con lo que tienes') return 'badge success';
  if (classification === 'Te falta muy poco') return 'badge warn';
  return 'badge neutral';
}

export function ProposalCard({ proposal, index }: { proposal: Proposal; index: number }) {
  const navigate = useNavigate();
  return (
    <article className="proposal-card" onClick={() => navigate(`/receta/${proposal.recipeId}`)}>
      <div className={`proposal-visual visual-${index % 3}`}>
        <span className="proposal-number">0{index + 1}</span>
        <span className="proposal-emoji">{proposal.emoji}</span>
        <div className="photo-shimmer" />
      </div>
      <div className="proposal-body">
        <span className={badgeClass(proposal.classification)}>{proposal.classification}</span>
        <h3>{proposal.title}</h3>
        <p>{proposal.subtitle}</p>
        <div className="meta-row">
          <span><Clock3 size={15} /> {proposal.minutes} min</span>
          <span><Star size={15} /> {proposal.difficulty}</span>
        </div>
        <div className="reason"><Sparkles size={16} /> {proposal.reason}</div>
        {proposal.usedIngredients.length > 0 && (
          <div className="mini-list"><Check size={15} /><span><strong>Usas:</strong> {proposal.usedIngredients.join(', ')}</span></div>
        )}
        {proposal.missingIngredients.length > 0 && (
          <div className="mini-list missing"><ShoppingBasket size={15} /><span><strong>Falta:</strong> {proposal.missingIngredients.join(', ')}</span></div>
        )}
      </div>
    </article>
  );
}
