import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { CookPage } from './pages/CookPage';
import { DesirePage } from './pages/DesirePage';
import { HomePage } from './pages/HomePage';
import { MyRecipesPage } from './pages/MyRecipesPage';
import { NoticesPage } from './pages/NoticesPage';
import { PantryPage } from './pages/PantryPage';
import { RecipePage } from './pages/RecipePage';
import { ResultsPage } from './pages/ResultsPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { TechniquesPage } from './pages/TechniquesPage';

function ScrollToTop() {
  const { pathname, search, key } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, key]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nevera" element={<PantryPage />} />
          <Route path="/antojo" element={<DesirePage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/avisos" element={<NoticesPage />} />
          <Route path="/propuestas" element={<ResultsPage />} />
          <Route path="/receta/:id" element={<RecipePage />} />
          <Route path="/cocinar/:id" element={<CookPage />} />
          <Route path="/lista-compra" element={<ShoppingListPage />} />
          <Route path="/mis-recetas" element={<MyRecipesPage />} />
          <Route path="/tecnicas" element={<TechniquesPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}
