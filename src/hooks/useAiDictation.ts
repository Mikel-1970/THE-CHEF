import { useCallback, useEffect, useRef, useState } from 'react';
import { transcribeCookingAudio } from '../services/mediaGateway';
import { loadMicrophonePreference, saveMicrophonePreference } from '../utils/microphonePreference';

export function useAiDictation(onTranscript: (text: string) => void) {
  const callbackRef = useRef(onTranscript);
  const mounted = useRef(true);
  const starting = useRef(false);
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

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; const recorder = recorderRef.current; if (recorder) { recorder.onstop = null; recorder.ondataavailable = null; recorder.onerror = null; if (recorder.state !== 'inactive') recorder.stop(); } cleanup(); }; }, [cleanup]);

  const start = useCallback(async (explicit = false) => {
    if (!isSupported || starting.current || isListening || isTranscribing) return;
    setError(undefined);

    const microphonePreference = loadMicrophonePreference();
    if (microphonePreference === 'disabled' && !explicit) {
      setError('El micrófono está desactivado en The Chef. Puedes activarlo desde Ajustes.');
      return;
    }
    if (microphonePreference === 'unsupported' && !explicit) {
      setError('Este dispositivo o navegador no permite utilizar el micrófono desde la app.');
      return;
    }

    starting.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { stream.getTracks().forEach(track => track.stop()); return; }
      streamRef.current = stream;
      if (explicit) saveMicrophonePreference('enabled');
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
          if (mounted.current) callbackRef.current(text);
        } catch (err) {
          if (mounted.current) setError(err instanceof Error ? err.message : 'No se ha podido transcribir el dictado.');
        } finally {
          if (mounted.current) setIsTranscribing(false);
        }
      };
      recorder.start();
      setIsListening(true);
    } catch (err) {
      cleanup();
      const denied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
      if (mounted.current) setError(denied ? 'El permiso del micrófono está bloqueado. Revisa el permiso del sitio en iPhone/Safari o actívalo desde Ajustes.' : 'No se ha podido iniciar el micrófono.');
    } finally { starting.current = false; }
  }, [cleanup, isListening, isSupported, isTranscribing]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop(); else void start(true);
  }, [isListening, start, stop]);

  return { isSupported, isListening, isTranscribing, error, start, stop, toggle };
}
