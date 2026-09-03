import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ProposalCard } from '../components/ProposalCard';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import { isExternalRecipeApiConfigured } from '../services/externalRecipeGateway';
import { getHybridProposals, HYBRID_NOTICE_STORAGE_KEY } from '../services/hybridRecommendationEngine';
import { externalRecipeCount } from '../services/recipeCatalog';

export function ResultsPage() {
  const { proposals, currentRequest, replaceProposals } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [engineNotice, setEngineNotice] = useState<string | undefined>(() => {
    try {
      return sessionStorage.getItem(HYBRID_NOTICE_STORAGE_KEY) ?? undefined;
    } catch {
      return undefined;
    }
  });

  if (!currentRequest || proposals.length === 0) return <Navigate to="/" replace />;

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const result = await getHybridProposals(currentRequest, proposals.map(p => p.recipeId));
      replaceProposals(result.proposals);
      setEngineNotice(result.externalError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setRefreshing(false);
    }
  };

  const externalConfigured = isExternalRecipeApiConfigured();
  const storedExternal = externalRecipeCount();

  return (
    <AppShell hideNav>
      <TopBar eyebrow="3 IDEAS PARA ELEGIR" title="¿Con cuál te quedas?" />
      <div className="page-content results-content">
        <div className="results-summary"><div><span className="eyebrow">TU BÚSQUEDA</span><p>{currentRequest.mode === 'pantry' ? (currentRequest.pantryIngredients ?? []).map(i => i.name).join(' · ') : currentRequest.desireText}</p></div><span>{currentRequest.servings} pers.</span></div>

        {engineNotice && (
          <div className="helper-note" role="status">
            <AlertTriangle size={17} />
            <span><strong>IA no disponible en esta búsqueda.</strong> {engineNotice}</span>
          </div>
        )}

        <div className="proposal-stack">{proposals.map((proposal, index) => <ProposalCard key={proposal.id} proposal={proposal} index={index} />)}</div>
        <button className="secondary-button" onClick={refresh} disabled={refreshing}><RefreshCw size={17} /> {refreshing ? 'Buscando otras opciones…' : 'Dame otras 3'}</button>
        <p className="prototype-note">
          {engineNotice
            ? 'Catálogo local de respaldo activo. Estas propuestas no han sido generadas por IA en esta búsqueda.'
            : externalConfigured
              ? `Motor híbrido activo${storedExternal ? ` · ${storedExternal} recetas externas validadas disponibles` : ''}. Las recetas externas pasan primero por los controles de coherencia de El Chef.`
              : 'Motor híbrido preparado: por ahora se utiliza el catálogo local validado.'}
        </p>
      </div>
    </AppShell>
  );
}
