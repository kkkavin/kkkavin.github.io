export function initHero() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const subtitle = document.createElement('p');
    subtitle.className = 'hero-subtitle';
    subtitle.textContent = 'Hi, my name is';

    const title = document.createElement('h1');
    title.textContent = 'K K Kavin.';

    const tagline = document.createElement('h2');
    tagline.textContent = 'I build things for the web.';

    const description = document.createElement('p');
    description.textContent = "I’m a Computer Science & Design student who enjoys building web apps and games, learning new technologies, and solving problems through hands-on projects.";

    container.appendChild(subtitle);
    container.appendChild(title);
    container.appendChild(tagline);
    container.appendChild(description);

    heroSection.appendChild(container);
}
