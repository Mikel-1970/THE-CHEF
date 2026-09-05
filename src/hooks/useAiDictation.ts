import { useCallback, useEffect, useRef, useState } from 'react';
import { transcribeCookingAudio } from '../services/mediaGateway';

export function useAiDictation(onTranscript: (text: string) => void) {
  const callbackRef = useRef(onTranscript);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string>();
  const isSupported = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';

  useEffect(() => { callbackRef.current = onTranscript; }, [onTranscript]);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(async () => {
    if (!isSupported || isListening || isTranscribing) return;
    setError(undefined);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const preferred = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(type => MediaRecorder.isTypeSupported(type));
      const recorder = preferred ? new MediaRecorder(stream, { mimeType: preferred }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onerror = () => { setError('No se ha podido grabar el dictado.'); setIsListening(false); cleanup(); };
      recorder.onstop = async () => {
        setIsListening(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        cleanup();
        if (!blob.size) return;
        setIsTranscribing(true);
        try {
          const text = await transcribeCookingAudio(blob);
          callbackRef.current(text);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'No se ha podido transcribir el dictado.');
        } finally {
          setIsTranscribing(false);
        }
      };
      recorder.start();
      setIsListening(true);
    } catch (err) {
      cleanup();
      const denied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
      setError(denied ? 'Necesitas permitir el acceso al micrófono para usar el dictado.' : 'No se ha podido iniciar el micrófono.');
    }
  }, [cleanup, isListening, isSupported, isTranscribing]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop(); else void start();
  }, [isListening, start, stop]);

  return { isSupported, isListening, isTranscribing, error, start, stop, toggle };
}
