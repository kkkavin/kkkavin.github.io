export function initAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'About Me';

    const text = document.createElement('p');
    text.textContent = 'Hello! My name is Kavin | 🎓B.E. CSD 3rd Year Student | Exploring Software Development, Python, AI | CS50x (ongoing) | Passionate about Learning & Building Projects | Open to Opportunities & New Directions🚀';

    container.appendChild(heading);
    container.appendChild(text);

    aboutSection.appendChild(container);
}
