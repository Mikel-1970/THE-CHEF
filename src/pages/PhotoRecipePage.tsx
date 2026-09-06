import { Camera, ImagePlus, Sparkles } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { TopBar } from '../components/TopBar';

export function PhotoRecipePage() {
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="MIRA, CONFIRMA Y COCINA" title="Receta desde una foto" />
      <div className="page-content">
        <section className="editorial-card olive-intro"><span className="eyebrow">ENSÉÑAME EL PLATO</span><h2>Descubre cómo prepararlo.</h2><p>Haz una foto o elige una imagen. El Chef identificará el plato y te pedirá confirmar los detalles antes de crear la receta.</p></section>
        <section className="photo-recipe-upload">
          {previewUrl ? <img src={previewUrl} alt="Plato elegido para identificar" /> : <div><Camera size={44} /><strong>Añade la foto del plato</strong><span>Procura que tenga buena luz y se vea el plato completo.</span></div>}
        </section>
        <label className="photo-recipe-button"><ImagePlus size={20} />{previewUrl ? 'Elegir otra foto' : 'Hacer o elegir una foto'}<input type="file" accept="image/*" capture="environment" onChange={selectPhoto} /></label>
        {previewUrl && <div className="helper-note"><Sparkles size={17} /> Foto preparada. El siguiente paso será identificar el plato y permitirte corregirlo antes de generar la receta.</div>}
      </div>
    </AppShell>
  );
}
