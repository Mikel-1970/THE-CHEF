import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { HomePage } from './pages/HomePage';
import { PantryPage } from './pages/PantryPage';
import { DesirePage } from './pages/DesirePage';
import { ResultsPage } from './pages/ResultsPage';
import { RecipePage } from './pages/RecipePage';
import { CookPage } from './pages/CookPage';
import { MyRecipesPage } from './pages/MyRecipesPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nevera" element={<PantryPage />} />
          <Route path="/antojo" element={<DesirePage />} />
          <Route path="/propuestas" element={<ResultsPage />} />
          <Route path="/receta/:id" element={<RecipePage />} />
          <Route path="/cocinar/:id" element={<CookPage />} />
          <Route path="/mis-recetas" element={<MyRecipesPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
        </Routes>
      </AppProvider>
    </HashRouter>
  );
}
