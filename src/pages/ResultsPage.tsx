import { AlertTriangle, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ChefLoadingOverlay } from '../components/ChefLoadingOverlay';
import { ProposalCard } from '../components/ProposalCard';
import { TopBar } from '../components/TopBar';
import { useApp } from '../AppContext';
import type { Proposal } from '../domain/types';
import { generateAiRecipe, isAiProposalApiConfigured } from '../services/aiProposalGateway';
import { getHybridProposals, HYBRID_NOTICE_STORAGE_KEY } from '../services/hybridRecommendationEngine';
import { getRecipeById, registerExternalRecipes } from '../services/recipeCatalog';

const PROPOSAL_COUNT = 2;

export function ResultsPage() {
  const navigate = useNavigate();
  const { proposals, currentRequest, replaceProposals } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [generatingId, setGeneratingId] = useState<string>();
  const [selectionError, setSelectionError] = useState<string>();
  const [engineNotice, setEngineNotice] = useState<string | undefined>(() => {
    try {
      return sessionStorage.getItem(HYBRID_NOTICE_STORAGE_KEY) ?? undefined;
    } catch {
      return undefined;
    }
  });

  if (!currentRequest || proposals.length === 0) return <Navigate to="/" replace />;

  const refresh = async () => {
    if (refreshing || generatingId) return;
    setRefreshing(true);
    setSelectionError(undefined);
    try {
      const result = await getHybridProposals(currentRequest, proposals.map(p => p.recipeId));
      replaceProposals(result.proposals.slice(0, PROPOSAL_COUNT));
      setEngineNotice(result.externalError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setRefreshing(false);
    }
  };

  const selectProposal = async (proposal: Proposal) => {
    if (generatingId) return;
    setSelectionError(undefined);

    if (proposal.recipeId.startsWith('ai-proposal-')) {
      setGeneratingId(proposal.id);
      try {
        const recipe = await generateAiRecipe(currentRequest, proposal);
        const accepted = registerExternalRecipes([recipe]);
        const stored = accepted[0];
        if (!stored) throw new Error('La receta generada no ha podido guardarse temporalmente.');
        navigate(`/receta/${stored.id}`);
      } catch (error) {
        setSelectionError(error instanceof Error ? error.message : 'No se ha podido generar la receta completa.');
      } finally {
        setGeneratingId(undefined);
      }
      return;
    }

    const recipe = getRecipeById(proposal.recipeId);
    if (!recipe) {
      setSelectionError('Esta propuesta no está disponible como receta completa. Prueba a solicitar otras opciones.');
      return;
    }
    navigate(`/receta/${recipe.id}`);
  };

  const aiConfigured = isAiProposalApiConfigured();
  const visibleCount = proposals.length;
  const working = Boolean(generatingId || refreshing);
  const editOptions = () => navigate(currentRequest.desireText ? '/antojo' : '/nevera');

  return (
    <AppShell hideNav>
      <ChefLoadingOverlay
        active={working}
        title={generatingId ? 'Preparando tu receta' : 'Buscando nuevas ideas'}
        messages={generatingId
          ? ['¡Oído cocina!', 'Ordenando ingredientes…', 'Afinando tiempos y puntos de cocción…', 'Emplatando la receta…']
          : ['¡Oído cocina!', 'Mirando qué encaja mejor…', 'Descartando opciones repetidas…', 'Ya salen nuevas ideas…']}
      />
      <TopBar eyebrow={`${visibleCount} IDEAS PARA ELEGIR`} title="¿Con cuál te quedas?" />
      <div className="page-content results-content">
        <div className="results-summary"><div><span className="eyebrow">TU BÚSQUEDA</span><p>{currentRequest.mode === 'pantry' ? (currentRequest.pantryIngredients ?? []).map(i => i.name).join(' · ') : currentRequest.desireText}</p></div><span>{currentRequest.servings} pers.</span></div>

        {engineNotice && <div className="helper-note" role="status"><AlertTriangle size={17} /><span><strong>IA no disponible en esta búsqueda.</strong> {engineNotice}</span></div>}
        {selectionError && <div className="helper-note" role="alert"><AlertTriangle size={17} /><span>{selectionError}</span></div>}

        {!engineNotice && proposals.some(proposal => proposal.recipeId.startsWith('ai-proposal-')) && (
          <div className="helper-note" role="status">
            Las {visibleCount} ideas son propuestas ligeras de IA. La receta completa se genera únicamente cuando eliges una.
          </div>
        )}

        <div className="proposal-stack">
          {proposals.map((proposal, index) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              index={index}
              onSelect={selectProposal}
              generating={generatingId === proposal.id}
            />
          ))}
        </div>
        <div className="proposal-footer-actions">
          <button className="secondary-button" onClick={editOptions} disabled={working}><SlidersHorizontal size={17} /> Cambiar opciones</button>
          <button className="secondary-button" onClick={refresh} disabled={refreshing || Boolean(generatingId)}><RefreshCw size={17} /> {refreshing ? 'Buscando…' : `Dame otras ${PROPOSAL_COUNT}`}</button>
        </div>
        <p className="prototype-note">
          {engineNotice
            ? 'Catálogo local de respaldo activo. Estas propuestas no han sido generadas por IA en esta búsqueda.'
            : aiConfigured
              ? `Flujo IA en dos fases activo: primero ${visibleCount} propuestas breves y después una única receta completa al elegir.`
              : 'Motor híbrido preparado: por ahora se utiliza el catálogo local validado.'}
        </p>
      </div>
    </AppShell>
  );
}
