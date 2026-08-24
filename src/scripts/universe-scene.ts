/** Coordinated motion for Meish Universe scene — pause, resume, hover slow. */

export function initUniverseScene() {
  const scene = document.querySelector<HTMLElement>('[data-universe-scene]');
  const stopBtn = document.getElementById('motion-stop');
  if (!scene || !stopBtn) return;

  const orbitField = scene.querySelector('[data-orbit-field]');
  const flap = document.querySelector('[data-flap]');

  function setPaused(paused: boolean) {
    scene!.classList.toggle('is-paused', paused);
    orbitField?.classList.toggle('is-paused', paused);
    stopBtn!.setAttribute('aria-pressed', String(paused));
    stopBtn!.textContent = paused ? 'RESUME MOTION' : 'STOP OBJECT MOTION';
    window.dispatchEvent(new CustomEvent('meish:motion-pause', { detail: { paused } }));
  }

  stopBtn.addEventListener('click', () => {
    setPaused(!scene.classList.contains('is-paused'));
  });

  scene.querySelectorAll<HTMLElement>('[data-celestial]').forEach((obj) => {
    obj.addEventListener('mouseenter', () => obj.classList.add('is-near'));
    obj.addEventListener('mouseleave', () => obj.classList.remove('is-near'));
    obj.addEventListener('focusin', () => obj.classList.add('is-near'));
    obj.addEventListener('focusout', () => obj.classList.remove('is-near'));
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setPaused(true);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initUniverseScene);
}
