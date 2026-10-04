import { Navigate } from 'react-router-dom';

/** Ruta legado: la app ya genera la receta completa desde el punto de entrada. */
export function ResultsPage(){
  return <Navigate to="/" replace/>;
}
