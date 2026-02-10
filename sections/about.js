export function initAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'About Me';

    const text = document.createElement('p');
    text.textContent = 'Hello! My name is Kavin I’m a 3rd-year Computer Science and Design student passionate about building intelligent and creative solutions. I love blending design with code—whether it's developing AI models, animating in Blender, or building interactive experiences in Unity.

Recently, I passed the NAT N5 Japanese language test and I’m preparing for NAT N4. I’m interested in exploring opportunities that combine tech and creativity.

I'm currently building my skills in AI, Python, and 3D development and am looking forward to contributing to exciting projects, collaborating with others, and learning more through internships or freelance work.

Let’s connect!';

    container.appendChild(heading);
    container.appendChild(text);

    aboutSection.appendChild(container);
}
