export async function loadCoursePreview(root, lesson, signal, isCurrent) {
    if (!lesson.url?.startsWith('/') || lesson.url.startsWith('//') || /[\\\s]/.test(lesson.url)) throw new Error('invalid_url');
    const response = await fetch(lesson.url, { credentials: 'same-origin', cache: 'no-cache', signal });
    if (!response.ok) throw new Error('course_unavailable');
    const html = await response.text();
    if (!isCurrent()) return false;
    const course = new DOMParser().parseFromString(html, 'text/html');
    const identity = course.getElementById('course-work')?.dataset;
    if (!identity || !['etablissement', 'matiere', 'classe', 'seance'].every(key => identity[key] === lesson[key])) throw new Error('course_mismatch');
    const sections = course.querySelectorAll('.cours-intro, .cours-activites, .cours-synthese');
    if (!sections.length) throw new Error('course_unavailable');
    const columns = document.createElement('div'); columns.className = 'course-columns';
    const navigation = document.createElement('aside'); navigation.className = 'course-navigation';
    const heading = document.createElement('h2'); heading.textContent = 'Étapes de la séance';
    const nav = document.createElement('nav'); nav.setAttribute('aria-label', 'Étapes du cours professeur');
    const list = document.createElement('ol'); nav.append(list); navigation.append(heading, nav);
    const reading = document.createElement('div'); reading.className = 'course-reading';
    reading.append(...[...sections].map(node => document.importNode(node, true)));
    for (const section of reading.querySelectorAll('#course-intro, .cours-activite, #course-summary')) {
        const li = document.createElement('li'), link = document.createElement('a');
        link.href = '#' + encodeURIComponent(section.id);
        link.textContent = section.querySelector('h1, h2')?.textContent || 'Étape';
        li.append(link); list.append(li);
    }
    columns.append(navigation, reading); root.replaceChildren(columns);
    root.querySelectorAll('[data-answer-id]').forEach(field => { field.disabled = true; field.value = ''; });
    return true;
}
