import { Camera, Clock3, ImagePlus, Sparkles, UsersRound } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Chip } from '../components/Chip';
import { NumberStepper } from '../components/NumberStepper';
import { PrimaryButton } from '../components/PrimaryButton';
import { TopBar } from '../components/TopBar';
import type { Difficulty } from '../domain/types';

const difficulties: Difficulty[] = ['Fácil', 'Media', 'Avanzada'];

export function PhotoRecipePage() {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [servings, setServings] = useState(2);
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('Media');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setConfirmed(false);
  };

  return (
    <AppShell hideNav>
      <TopBar eyebrow="MIRA, CONFIRMA Y COCINA" title="Receta desde una foto" />
      <div className="page-content">
        <section className="editorial-card olive-intro"><span className="eyebrow">ENSÉÑAME EL PLATO</span><h2>Descubre cómo prepararlo.</h2><p>Haz una foto o elige una imagen. El Chef identificará el plato y te pedirá confirmar los detalles antes de crear la receta.</p></section>
        <section className="photo-recipe-upload">
          {previewUrl ? <img src={previewUrl} alt="Plato elegido para identificar" /> : <div><Camera size={44} /><strong>Añade la foto del plato</strong><span>Procura que tenga buena luz y se vea el plato completo.</span></div>}
        </section>
        <div className="photo-recipe-actions">
          <label className="photo-recipe-button"><Camera size={20} />Hacer una foto<input type="file" accept="image/*" capture="environment" onChange={selectPhoto} /></label>
          <label className="photo-recipe-button secondary"><ImagePlus size={20} />Elegir de la galería<input type="file" accept="image/*" onChange={selectPhoto} /></label>
        </div>
        {previewUrl && <>
          <section className="control-card"><div className="control-row"><div className="control-title"><UsersRound size={19} /><div><strong>Somos</strong><small>Comensales</small></div></div><NumberStepper value={servings} onChange={setServings} /></div><div className="divider" /><div className="control-row"><div className="control-title"><Clock3 size={19} /><div><strong>Tiempo máximo</strong><small>Para preparar la receta</small></div></div><NumberStepper value={maxMinutes} min={15} max={180} step={5} suffix="min" editable onChange={setMaxMinutes} /></div><div className="divider" /><div className="advanced-group"><strong>Dificultad máxima</strong><div className="chip-row">{difficulties.map(value => <Chip key={value} selected={difficulty === value} onClick={() => setDifficulty(value)}>{value}</Chip>)}</div></div></section>
          <div className="sticky-action"><PrimaryButton onClick={() => setConfirmed(true)}>Analizar el plato</PrimaryButton></div>
          {confirmed && <div className="helper-note"><Sparkles size={17} /> Foto y opciones confirmadas. El Chef analizará el plato y te permitirá corregir su identificación antes de crear la receta.</div>}
        </>}
      </div>
    </AppShell>
  );
}
