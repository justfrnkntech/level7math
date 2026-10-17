// Small synthesized cues: no downloads, background music, or autoplay.
const KEY = 'number-quest-sound';
export const cues = {
  correct: [[660, 0, .12], [880, .11, .2]],
  retry: [[330, 0, .16]],
  lesson: [[523, 0, .15], [659, .14, .15], [784, .28, .15], [1047, .43, .3]],
  milestone: [[392, 0, .18], [523, .2, .18], [659, .4, .18], [784, .62, .5]],
};
export function createSound({ storage, makeContext } = {}) {
  let enabled = true, context, revision = 0;
  const voices = new Set();
  try { enabled = storage?.getItem(KEY) !== 'off'; } catch { /* Private browsers still play. */ }
  function stop() {
    revision++;
    for (const voice of voices) { try { voice.stop(); } catch { /* Already ended. */ } }
    voices.clear();
  }
  async function unlock() {
    if (!enabled) return;
    try { context ??= makeContext?.(); if (context?.state === 'suspended') await context.resume(); } catch { /* Audio must never block a lesson. */ }
  }
  async function play(name) {
    if (!enabled || !cues[name]) return;
    stop();
    const request = revision;
    await unlock();
    if (!enabled || !context || context.state !== 'running' || request !== revision) return;
    const horn = name === 'milestone';
    try {
      for (const [frequency, offset, duration] of cues[name]) {
        const oscillator = context.createOscillator(), gain = context.createGain();
        const start = context.currentTime + offset;
        oscillator.type = horn ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        if (name === 'retry') oscillator.frequency.exponentialRampToValueAtTime(280, start + duration);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(horn ? .065 : .055, start + .018);
        gain.gain.exponentialRampToValueAtTime(.001, start + duration);
        oscillator.connect(gain); gain.connect(context.destination);
        voices.add(oscillator);
        oscillator.onended = () => { voices.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(start); oscillator.stop(start + duration + .02);
      }
    } catch { stop(); }
  }
  return {
    get enabled() { return enabled; },
    unlock, play, stop,
    toggle() { enabled = !enabled; stop(); try { storage?.setItem(KEY, enabled ? 'on' : 'off'); } catch { /* Keep setting for this visit. */ } return enabled; },
  };
}
