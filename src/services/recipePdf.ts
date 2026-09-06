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

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - 15) return;
    doc.addPage();
    y = 16;
  };

  const heading = (text: string) => {
    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(57, 76, 39);
    doc.text(text, margin, y);
    y += 7;
  };

  const paragraph = (text: string, fontSize = 9, indent = 0) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(57, 61, 53);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    const h = Math.max(5, lines.length * (fontSize * .48));
    ensureSpace(h + 2);
    doc.text(lines, margin + indent, y);
    y += h + 2;
  };

  doc.setFillColor(64, 86, 38);
  doc.roundedRect(0, 0, pageWidth, 58, 0, 0, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('EL CHEF', margin, 12);
  doc.setFontSize(23);
  const titleLines = doc.splitTextToSize(recipe.title, contentWidth * .62);
  doc.text(titleLines, margin, 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${recipe.cuisine} · ${recipe.style} · ${recipe.difficulty}`, margin, 47);
  doc.text(`${servings} comensales · ${recipe.prepMinutes + recipe.cookMinutes} min`, margin, 53);

  try {
    const imageUrl = await getRecipeImage(recipe);
    if (imageUrl) {
      const jpeg = await imageUrlToJpegData(imageUrl);
      doc.addImage(jpeg, 'JPEG', pageWidth - margin - 56, 9, 56, 42, undefined, 'FAST');
    }
  } catch { /* el PDF sigue siendo válido sin imagen */ }

  y = 67;
  paragraph(recipe.description, 10);

  doc.setFillColor(244, 241, 232);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');
  doc.setTextColor(56, 66, 46);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('POR RACION', margin + 5, y + 6);
  doc.setFontSize(11);
  doc.text(`${recipe.nutritionPerServing.kcal} kcal`, margin + 5, y + 15);
  doc.text(`${recipe.nutritionPerServing.proteinG} g prot.`, margin + 46, y + 15);
  doc.text(`${recipe.nutritionPerServing.carbsG} g hidr.`, margin + 90, y + 15);
  doc.text(`${recipe.nutritionPerServing.fatG} g grasas`, margin + 135, y + 15);
  y += 31;

  heading('Ingredientes');
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
      ensureSpace(6);
      doc.text(section, margin, y);
      y += 5;
    }
    items.forEach(item => {
      const qty = scaleQuantity(item, recipe.baseServings, servings);
      paragraph(`• ${item.name}: ${formatQuantity(qty)} ${item.unit}${item.optional ? ' (opcional)' : ''}`, 9, 2);
    });
  });

  heading('Mise en place');
  recipe.miseEnPlace.forEach((item, index) => paragraph(`${index + 1}. ${item}`, 9, 2));

  heading('Elaboración');
  recipe.steps.forEach(step => {
    const details = [step.minutes ? `${step.minutes} min` : '', step.temperatureC ? `${step.temperatureC} °C` : ''].filter(Boolean).join(' · ');
    paragraph(`${step.number}. ${step.instruction}${details ? ` (${details})` : ''}${step.cue ? ` — Fíjate: ${step.cue}` : ''}`, 9, 2);
  });

  if (recipe.criticalPoints.length) {
    heading('Puntos críticos');
    recipe.criticalPoints.forEach(item => paragraph(`• ${item}`, 9, 2));
  }

  if (recipe.substitutions.length) {
    heading('Recomendaciones y sustituciones');
    recipe.substitutions.forEach(item => paragraph(`• ${item}`, 9, 2));
  }

  if (recipe.storage) {
    heading('Conservación');
    paragraph(recipe.storage, 9);
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
