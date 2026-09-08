export type MicrophonePreference = 'unset' | 'enabled' | 'disabled' | 'unsupported';

const MICROPHONE_PREFERENCE_KEY = 'chef:microphone:preference:v1';

export function loadMicrophonePreference(): MicrophonePreference {
  try {
    const value = localStorage.getItem(MICROPHONE_PREFERENCE_KEY);
    if (value === 'enabled' || value === 'disabled' || value === 'unsupported') return value;
  } catch { /* sin persistencia */ }
  return 'unset';
}

export function saveMicrophonePreference(value: Exclude<MicrophonePreference, 'unset'>): void {
  try { localStorage.setItem(MICROPHONE_PREFERENCE_KEY, value); } catch { /* sin persistencia */ }
}

export async function requestMicrophoneAccess(): Promise<Exclude<MicrophonePreference, 'unset'>> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    saveMicrophonePreference('unsupported');
    return 'unsupported';
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    saveMicrophonePreference('enabled');
    return 'enabled';
  } catch {
    saveMicrophonePreference('disabled');
    return 'disabled';
  }
}
