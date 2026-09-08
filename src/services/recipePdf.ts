import { jsPDF } from 'jspdf';
import type { Recipe } from '../domain/types';
import { getRecipeImage } from './mediaGateway';
import { formatQuantity, scaleQuantity } from '../utils/scaling';

export async function shareRecipePdf(recipe: Recipe, servings: number, avatarId?: string): Promise<'shared' | 'downloaded'> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const top = 25;
  const bottom = 16;
  const usableHeight = pageHeight - top - bottom;

  const brandHeader = (section: string) => {
    doc.setFillColor(64, 86, 38);
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('THE CHEF', margin, 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(section.toUpperCase(), pageWidth - margin, 8, { align: 'right' });
  };

  const footer = (page: number) => {
    doc.setDrawColor(222, 218, 207);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 122, 115);
    doc.text(`The Chef · ${friendlyAvatarName(avatarId)}`, margin, pageHeight - 7);
    doc.text(`${page}/3`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  };

  // PÁGINA 1 · PORTADA
  brandHeader('Receta');
  let y = top;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(49, 66, 38);
  const titleLines = doc.splitTextToSize(recipe.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 9 + 3;

  try {
    const imageUrl = await getRecipeImage(recipe);
    if (imageUrl) {
      const jpeg = await imageUrlToJpegData(imageUrl);
      const imageHeight = 108;
      doc.addImage(jpeg, 'JPEG', margin, y, contentWidth, imageHeight, undefined, 'FAST');
      y += imageHeight + 8;
    }
  } catch { /* La portada sigue siendo válida sin imagen. */ }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(66, 70, 62);
  const descriptionLines = doc.splitTextToSize(recipe.description, contentWidth);
  doc.text(descriptionLines, margin, y);
  y += descriptionLines.length * 4.8 + 7;

  const metaHeight = 25;
  doc.setFillColor(244, 241, 232);
  doc.roundedRect(margin, y, contentWidth, metaHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 66, 46);
  doc.setFontSize(8);
  doc.text('COMENSALES', margin + 6, y + 7);
  doc.text('TIEMPO TOTAL', margin + 62, y + 7);
  doc.setFontSize(13);
  doc.text(String(servings), margin + 6, y + 18);
  doc.text(`${recipe.prepMinutes + recipe.cookMinutes} min`, margin + 62, y + 18);
  y += metaHeight + 7;

  const nutritionHeight = Math.min(32, Math.max(28, pageHeight - bottom - y - 2));
  doc.setFillColor(238, 240, 227);
  doc.roundedRect(margin, y, contentWidth, nutritionHeight, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(56, 66, 46);
  doc.text('VALOR NUTRICIONAL APROXIMADO · POR RACIÓN', margin + 5, y + 7);
  doc.setFontSize(10);
  const nutY = y + 19;
  doc.text(`${recipe.nutritionPerServing.kcal} kcal`, margin + 5, nutY);
  doc.text(`${recipe.nutritionPerServing.proteinG} g proteína`, margin + 45, nutY);
  doc.text(`${recipe.nutritionPerServing.carbsG} g hidratos`, margin + 95, nutY);
  doc.text(`${recipe.nutritionPerServing.fatG} g grasas`, margin + 144, nutY);
  footer(1);

  // PÁGINA 2 · CUATRO BLOQUES
  doc.addPage();
  brandHeader('Ingredientes y preparación');
  const gap = 6;
  const boxWidth = (contentWidth - gap) / 2;
  const boxHeight = (usableHeight - gap) / 2;
  const x1 = margin;
  const x2 = margin + boxWidth + gap;
  const y1 = top;
  const y2 = top + boxHeight + gap;

  const ingredientLines: string[] = [];
  let previousSection = '';
  recipe.ingredients.forEach(item => {
    const section = item.section || '';
    if (section && section !== previousSection) {
      ingredientLines.push(section.toUpperCase());
      previousSection = section;
    }
    const qty = scaleQuantity(item, recipe.baseServings, servings);
    ingredientLines.push(`• ${item.name}: ${formatQuantity(qty)} ${item.unit}${item.optional ? ' (opcional)' : ''}`);
  });
  drawTextCard(doc, 'Ingredientes', ingredientLines, x1, y1, boxWidth, boxHeight);
  drawTextCard(doc, 'Mise en place', recipe.miseEnPlace.map((item, index) => `${index + 1}. ${item}`), x2, y1, boxWidth, boxHeight);
  drawTextCard(doc, 'Puntos críticos', recipe.criticalPoints.map(item => `• ${item}`), x1, y2, boxWidth, boxHeight, true);
  drawTextCard(doc, 'Recomendaciones', recipe.substitutions.map(item => `• ${item}`), x2, y2, boxWidth, boxHeight);
  footer(2);

  // PÁGINA 3 · ELABORACIÓN COMPLETA
  doc.addPage();
  brandHeader('Elaboración');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(49, 66, 38);
  doc.text('Elaboración paso a paso', margin, top);
  drawSteps(doc, recipe, margin, top + 11, contentWidth, usableHeight - 11);
  footer(3);

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

function drawTextCard(doc: jsPDF, title: string, rows: string[], x: number, y: number, w: number, h: number, warning = false) {
  doc.setFillColor(warning ? 249 : 250, warning ? 243 : 247, warning ? 231 : 239);
  doc.setDrawColor(226, 221, 207);
  doc.roundedRect(x, y, w, h, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(55, 72, 39);
  doc.text(title, x + 5, y + 8);

  const availableWidth = w - 10;
  const availableHeight = h - 17;
  let fontSize = 8.1;
  let wrapped: string[] = [];
  let lineHeight = 3.7;

  while (fontSize >= 5.2) {
    doc.setFontSize(fontSize);
    wrapped = rows.flatMap(row => doc.splitTextToSize(row, availableWidth));
    lineHeight = Math.max(2.25, fontSize * 0.46);
    if (wrapped.length * lineHeight <= availableHeight) break;
    fontSize -= 0.35;
  }
  if (wrapped.length && wrapped.length * lineHeight > availableHeight) lineHeight = availableHeight / wrapped.length;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(Math.max(5.1, fontSize));
  doc.setTextColor(58, 62, 54);
  let cursor = y + 15;
  wrapped.forEach(line => {
    if (cursor <= y + h - 2) doc.text(line, x + 5, cursor);
    cursor += lineHeight;
  });
}

function drawSteps(doc: jsPDF, recipe: Recipe, x: number, y: number, w: number, h: number) {
  const rows = recipe.steps.map(step => {
    const facts = [step.minutes ? `${step.minutes} min` : '', step.temperatureC ? `${step.temperatureC} °C` : ''].filter(Boolean).join(' · ');
    return {
      number: step.number,
      text: `${step.instruction}${facts ? `  [${facts}]` : ''}${step.cue ? `  Fíjate: ${step.cue}` : ''}`
    };
  });

  let fontSize = 9.1;
  let lineHeight = 4.1;
  let wrapped = rows.map(row => ({ ...row, lines: doc.splitTextToSize(row.text, w - 15) as string[] }));
  const totalHeight = () => wrapped.reduce((sum, row) => sum + Math.max(6, row.lines.length * lineHeight) + 4, 0);

  while (fontSize >= 5.6 && totalHeight() > h) {
    fontSize -= 0.35;
    lineHeight = Math.max(2.45, fontSize * 0.47);
    doc.setFontSize(fontSize);
    wrapped = rows.map(row => ({ ...row, lines: doc.splitTextToSize(row.text, w - 15) as string[] }));
  }
  if (totalHeight() > h) {
    const totalLines = wrapped.reduce((sum, row) => sum + row.lines.length, 0);
    lineHeight = Math.max(1.9, (h - wrapped.length * 4) / Math.max(1, totalLines));
  }

  let cursor = y;
  wrapped.forEach(row => {
    const rowHeight = Math.max(6, row.lines.length * lineHeight);
    doc.setFillColor(247, 245, 238);
    doc.roundedRect(x, cursor - 3.5, w, rowHeight + 4.5, 2.2, 2.2, 'F');
    doc.setFillColor(64, 86, 38);
    doc.circle(x + 5.5, cursor + 1.2, 3.7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(Math.max(5.6, fontSize));
    doc.text(String(row.number), x + 5.5, cursor + 2.2, { align: 'center' });
    doc.setTextColor(55, 60, 51);
    doc.setFont('helvetica', 'normal');
    doc.text(row.lines, x + 12, cursor);
    cursor += rowHeight + 4;
  });
}

function friendlyAvatarName(id?: string): string {
  const labels: Record<string, string> = {
    'chef-man': 'Cocinero', 'chef-woman': 'Cocinera', dachshund: 'Teckel', tomato: 'Tomate', lemon: 'Limón', aubergine: 'Berenjena', shrimp: 'Langostino', crab: 'Cangrejo', cow: 'Vaca', croissant: 'Cruasán', banana: 'Plátano', potato: 'Patata', teapot: 'Tetera', moka: 'Cafetera', egg: 'Huevo', fish: 'Pescado'
  };
  return id && labels[id] ? labels[id] : 'Tu Chef';
}

async function imageUrlToJpegData(url: string): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('No se ha podido preparar la imagen del PDF.'));
    element.src = url;
  });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.min(1200, image.naturalWidth));
  canvas.height = Math.max(1, Math.round(canvas.width * image.naturalHeight / image.naturalWidth));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se ha podido preparar la imagen del PDF.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', .84);
}
