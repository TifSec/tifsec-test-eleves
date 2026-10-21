export function progressSnapshot(fields) {
    const required = fields.filter(field => field.dataset.required !== 'false');
    return { total: required.length, filled: required.filter(field => String(field.value || '').trim()).length };
}

export function initProgress() {
    const fieldset = document.getElementById('course-answers');
    const label = document.getElementById('course-progress-label');
    const progress = document.getElementById('course-progress');
    const status = document.getElementById('course-save-status');
    const identity = document.getElementById('course-identity');
    if (!fieldset || !label || !progress || !status) return;
    function update() {
        if (!identity?.textContent?.trim() || ['loading', 'load_error'].includes(status.dataset.state)) {
            progress.max = 1; progress.value = 0;
            label.textContent = 'Ouvre ta copie pour retrouver ton avancement.';
            return;
        }
        const state = progressSnapshot([...fieldset.querySelectorAll('[data-answer-id]')]);
        progress.max = state.total || 1;
        progress.value = state.filled;
        label.textContent = state.filled + ' / ' + state.total + ' réponses obligatoires renseignées';
    }
    fieldset.addEventListener('input', update);
    fieldset.addEventListener('change', update);
    const observer = new MutationObserver(update);
    observer.observe(status, { childList: true, characterData: true, subtree: true, attributes: true });
    observer.observe(fieldset, { attributes: true, attributeFilter: ['disabled'] });
    update();
}

initProgress();
