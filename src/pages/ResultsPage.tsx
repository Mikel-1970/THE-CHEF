import { RefreshCw } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ProposalCard } from '../components/ProposalCard';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import { getMockProposals } from '../services/mockRecommendationEngine';

export function ResultsPage() {
  const { proposals, currentRequest, replaceProposals } = useApp();
  if (!currentRequest || proposals.length === 0) return <Navigate to="/" replace />;

  const refresh = () => {
    const next = getMockProposals(currentRequest, proposals.map(p => p.recipeId));
    replaceProposals(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="3 IDEAS PARA ELEGIR" title="¿Con cuál te quedas?" />
      <div className="page-content results-content">
        <div className="results-summary"><div><span className="eyebrow">TU BÚSQUEDA</span><p>{currentRequest.mode === 'pantry' ? (currentRequest.pantryIngredients ?? []).map(i => i.name).join(' · ') : currentRequest.desireText}</p></div><span>{currentRequest.servings} pers.</span></div>
        <div className="proposal-stack">{proposals.map((proposal, index) => <ProposalCard key={proposal.id} proposal={proposal} index={index} />)}</div>
        <button className="secondary-button" onClick={refresh}><RefreshCw size={17} /> Dame otras 3</button>
        <p className="prototype-note">Motor local V0.3: las propuestas se ordenan según ingredientes, prioridades, tiempo, estilo, cocina y dificultad. Aún no utiliza IA externa.</p>
      </div>
    </AppShell>
  );
}
