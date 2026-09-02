import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const callbackRef = useRef(onTranscript);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>();
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    callbackRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    setIsSupported(Boolean(Recognition));
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError(undefined);
      setIsListening(true);
    };

    recognition.onend = () => setIsListening(false);

    recognition.onerror = event => {
      setIsListening(false);
      setError(errorMessage(event.error));
    };

    recognition.onresult = event => {
      let finalText = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalText += result[0]?.transcript ?? '';
      }
      const clean = finalText.trim();
      if (clean) callbackRef.current(clean);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;
    setError(undefined);
    try {
      recognition.start();
    } catch {
      setError('No se ha podido iniciar el micrófono. Vuelve a intentarlo.');
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
  }, [isListening]);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  return { isSupported, isListening, error, start, stop, toggle };
}

function errorMessage(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Necesitas permitir el acceso al micrófono para usar el dictado.';
    case 'audio-capture':
      return 'No se ha encontrado un micrófono disponible.';
    case 'no-speech':
      return 'No he oído nada. Toca el micrófono y vuelve a intentarlo.';
    case 'network':
      return 'El reconocimiento de voz no está disponible ahora mismo.';
    default:
      return 'No se ha podido reconocer la voz. Puedes seguir escribiendo normalmente.';
  }
}
