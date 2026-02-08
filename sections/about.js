export function initAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'About Me';

    const text = document.createElement('p');
    text.textContent = 'Hello! My name is User and I enjoy creating things that live on the internet. My interest in web development started back in 2012 when I decided to try editing custom Tumblr themes — turns out hacking together a custom reblog button taught me a lot about HTML & CSS!';

    container.appendChild(heading);
    container.appendChild(text);

    aboutSection.appendChild(container);
}
