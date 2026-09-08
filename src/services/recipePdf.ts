import { jsPDF } from 'jspdf';
import type { Recipe } from '../domain/types';
import { getRecipeImage } from './mediaGateway';
import { formatQuantity, scaleQuantity } from '../utils/scaling';

export async function shareRecipePdf(recipe: Recipe, servings: number): Promise<'shared' | 'downloaded'> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const startPage = (section: string) => {
    doc.setFillColor(64, 86, 38);
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('EL CHEF', margin, 8);
    doc.setFont('helvetica', 'normal');
    doc.text(section.toUpperCase(), pageWidth - margin, 8, { align: 'right' });
    y = 27;
  };

  const ensureSpace = (height: number, section = 'Receta') => {
    if (y + height <= pageHeight - 15) return;
    doc.addPage();
    startPage(section);
  };

  const heading = (text: string, section = 'Receta') => {
    ensureSpace(12, section);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(57, 76, 39);
    doc.text(text, margin, y);
    y += 7;
  };

  const paragraph = (text: string, fontSize = 9, indent = 0, section = 'Receta') => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(57, 61, 53);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    const h = Math.max(5, lines.length * (fontSize * .48));
    ensureSpace(h + 2, section);
    doc.text(lines, margin + indent, y);
    y += h + 2;
  };

  // Página 1 · Presentación
  startPage('Presentación');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(49, 66, 38);
  const titleLines = doc.splitTextToSize(recipe.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 10 + 3;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(93, 98, 88);
  doc.text(`${recipe.cuisine} · ${recipe.style} · ${recipe.difficulty} · ${servings} comensales · ${recipe.prepMinutes + recipe.cookMinutes} min`, margin, y);
  y += 8;

  try {
    const imageUrl = await getRecipeImage(recipe);
    if (imageUrl) {
      const jpeg = await imageUrlToJpegData(imageUrl);
      const imageHeight = 92;
      doc.addImage(jpeg, 'JPEG', margin, y, contentWidth, imageHeight, undefined, 'FAST');
      y += imageHeight + 8;
    }
  } catch { /* el PDF sigue siendo válido sin imagen */ }

  paragraph(recipe.description, 10, 0, 'Presentación');
  doc.setFillColor(244, 241, 232);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');
  doc.setTextColor(56, 66, 46);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INFORMACIÓN NUTRICIONAL APROXIMADA · POR RACIÓN', margin + 5, y + 7);
  doc.setFontSize(11);
  doc.text(`${recipe.nutritionPerServing.kcal} kcal`, margin + 5, y + 18);
  doc.text(`${recipe.nutritionPerServing.proteinG} g proteína`, margin + 46, y + 18);
  doc.text(`${recipe.nutritionPerServing.carbsG} g hidratos`, margin + 96, y + 18);
  doc.text(`${recipe.nutritionPerServing.fatG} g grasas`, margin + 145, y + 18);

  // Página 2 · Preparación
  doc.addPage();
  startPage('Ingredientes y preparación');
  heading(`Ingredientes · ${servings} comensales`, 'Ingredientes y preparación');
  const sections = new Map<string, typeof recipe.ingredients>();
  recipe.ingredients.forEach(item => {
    const key = item.section || 'Ingredientes';
    sections.set(key, [...(sections.get(key) ?? []), item]);
  });
  sections.forEach((items, section) => {
    if (sections.size > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(80, 92, 68);
      ensureSpace(6, 'Ingredientes y preparación');
      doc.text(section, margin, y);
      y += 5;
    }
    items.forEach(item => {
      const qty = scaleQuantity(item, recipe.baseServings, servings);
      paragraph(`• ${item.name}: ${formatQuantity(qty)} ${item.unit}${item.optional ? ' (opcional)' : ''}`, 9, 2, 'Ingredientes y preparación');
    });
  });

  heading('Mise en place', 'Ingredientes y preparación');
  recipe.miseEnPlace.forEach((item, index) => paragraph(`${index + 1}. ${item}`, 9, 2, 'Ingredientes y preparación'));

  if (recipe.criticalPoints.length) {
    heading('Puntos críticos', 'Ingredientes y preparación');
    recipe.criticalPoints.forEach(item => paragraph(`• ${item}`, 9, 2, 'Ingredientes y preparación'));
  }

  if (recipe.substitutions.length) {
    heading('Recomendaciones y sustituciones', 'Ingredientes y preparación');
    recipe.substitutions.forEach(item => paragraph(`• ${item}`, 9, 2, 'Ingredientes y preparación'));
  }

  // Página 3+ · Elaboración
  doc.addPage();
  startPage('Elaboración');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(49, 66, 38);
  doc.text('Elaboración paso a paso', margin, y);
  y += 12;

  recipe.steps.forEach(step => {
    const details = [step.minutes ? `${step.minutes} min` : '', step.temperatureC ? `${step.temperatureC} °C` : ''].filter(Boolean).join(' · ');
    const cue = step.cue ? `Fíjate: ${step.cue}` : '';
    const bodyLines = doc.splitTextToSize(step.instruction, contentWidth - 20);
    const cueLines = cue ? doc.splitTextToSize(cue, contentWidth - 20) : [];
    const cardHeight = Math.max(24, 13 + bodyLines.length * 4.4 + cueLines.length * 3.8 + (details ? 5 : 0));
    ensureSpace(cardHeight + 5, 'Elaboración');
    doc.setFillColor(248, 246, 239);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, 'F');
    doc.setFillColor(64, 86, 38);
    doc.circle(margin + 8, y + 9, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(String(step.number), margin + 8, y + 10.2, { align: 'center' });
    doc.setTextColor(55, 60, 51);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(bodyLines, margin + 18, y + 7);
    let innerY = y + 7 + bodyLines.length * 4.4;
    if (details) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(64, 86, 38);
      doc.text(details, margin + 18, innerY + 3);
      innerY += 5;
    }
    if (cueLines.length) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(103, 107, 97);
      doc.text(cueLines, margin + 18, innerY + 3);
    }
    y += cardHeight + 5;
  });

  if (recipe.storage) {
    heading('Conservación y recalentamiento', 'Elaboración');
    paragraph(recipe.storage, 9, 0, 'Elaboración');
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 125);
    doc.text(`El Chef · ${recipe.title}`, margin, pageHeight - 7);
    doc.text(`${i}/${pages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  const blob = doc.output('blob');
  const safeName = recipe.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'receta';
  const file = new File([blob], `${safeName}.pdf`, { type: 'application/pdf' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: recipe.title, text: `Receta · ${recipe.title}`, files: [file] });
    return 'shared';
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  return 'downloaded';
}

async function imageUrlToJpegData(url: string): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('No se ha podido preparar la imagen del PDF.'));
    element.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.min(1000, image.naturalWidth));
  canvas.height = Math.max(1, Math.round(canvas.width * image.naturalHeight / image.naturalWidth));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se ha podido preparar la imagen del PDF.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', .82);
}
