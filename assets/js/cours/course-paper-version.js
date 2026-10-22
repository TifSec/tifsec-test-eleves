const toggle = document.getElementById('course-paper-toggle');
const paper = document.getElementById('course-paper-version');
const print = document.getElementById('course-paper-print');

if (toggle && paper) {
    toggle.addEventListener('click', () => {
        const open = paper.hidden;
        paper.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        if (open) paper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

print?.addEventListener('click', () => window.print());
