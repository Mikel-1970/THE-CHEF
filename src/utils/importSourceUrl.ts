export function isYouTubeUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname.toLowerCase().replace(/\.$/, '');
    return ['youtube.com', 'youtu.be', 'youtube-nocookie.com'].some(domain => host === domain || host.endsWith('.' + domain));
  } catch { return false; }
}

export const VIDEO_IMPORT_UNAVAILABLE = 'La importación de YouTube no está disponible. Usa una página con la receta escrita, pega el texto o importa un archivo.';
