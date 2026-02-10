export function initSkills() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'Skills';

    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';

    const skills = ['Python', 'C', 'Java', 'HTML5 & CSS3', 'JavaScript', 'SQL', 'Unity', 'Blender', 'Git'];

    skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = skill;
        grid.appendChild(card);
    });

    container.appendChild(heading);
    container.appendChild(grid);

    skillsSection.appendChild(container);
}
