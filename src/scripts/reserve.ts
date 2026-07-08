// Meish Printed — reserve form enhancement (MEI-20).
//
// Progressive enhancement only: the form works as a plain POST without this.
// When JS is on we (1) stamp the `_ts` time-trap so the server can reject
// scripted instant-submits, and (2) submit via fetch so we can show an inline
// result instead of a full-page redirect. If anything about the enhanced path
// fails, we fall back to letting the browser submit the form normally.

interface ReserveResponse {
  ok: boolean;
  id?: string | null;
  errors?: Record<string, string>;
}

function enhance(form: HTMLFormElement): void {
  const loadedAt = Date.now();
  const status = form.querySelector<HTMLElement>('[data-reserve-status]');
  const tsField = form.querySelector<HTMLInputElement>('[data-reserve-ts]');

  function show(message: string, tone: 'ok' | 'error'): void {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
    status.hidden = false;
  }

  form.addEventListener('submit', async (event) => {
    // Stamp the time-trap for both the fetch path and (belt-and-braces) any
    // native submit we fall back to.
    if (tsField) tsField.value = String(loadedAt);

    event.preventDefault();
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const payload = Object.fromEntries(new FormData(form).entries());

    if (submit) {
      submit.disabled = true;
      submit.dataset.label = submit.textContent ?? '';
      submit.textContent = 'Sending…';
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as ReserveResponse;

      if (res.ok && data.ok) {
        form.reset();
        show(
          "Thank you — your reservation is in. Check your inbox for a confirmation; we'll be in touch shortly.",
          'ok',
        );
        if (submit) submit.textContent = 'Reserved ✓';
        return;
      }

      const firstError =
        data.errors && Object.values(data.errors)[0]
          ? Object.values(data.errors)[0]
          : res.status === 429
            ? 'Too many reservations from here just now — please try again later.'
            : 'Something went wrong. Please check the form and try again.';
      show(firstError, 'error');
    } catch {
      // Network/JS failure — let the browser submit the form the classic way.
      show('Submitting…', 'ok');
      form.submit();
      return;
    } finally {
      if (submit && submit.textContent === 'Sending…') {
        submit.disabled = false;
        submit.textContent = submit.dataset.label || 'Reserve my interest';
      } else if (submit) {
        submit.disabled = false;
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-reserve]').forEach(enhance);
