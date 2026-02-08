export async function initProjects() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = "Some Things I've Built";

    const grid = document.createElement('div');
    grid.className = 'grid projects-grid';

    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const projects = await response.json();

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card';

            const title = document.createElement('h3');
            title.textContent = project.title;

            const desc = document.createElement('p');
            desc.textContent = project.description;

            // Tech Stack
            const techStack = document.createElement('div');
            techStack.style.marginTop = '1rem';
            techStack.style.fontSize = '0.875rem';
            techStack.style.color = 'var(--accent-color)';
            techStack.style.fontFamily = 'var(--font-mono)';
            techStack.textContent = project.tech_stack.join('  ·  ');

            // Links container
            const links = document.createElement('div');
            links.style.marginTop = '1rem';
            links.style.display = 'flex';
            links.style.gap = '1rem';

            if (project.github_link) {
                const github = document.createElement('a');
                github.href = project.github_link;
                github.textContent = 'GitHub';
                github.target = '_blank';
                links.appendChild(github);
            }

            if (project.live_demo) {
                const demo = document.createElement('a');
                demo.href = project.live_demo;
                demo.textContent = 'Live Demo';
                demo.target = '_blank';
                links.appendChild(demo);
            }

            card.appendChild(title);
            card.appendChild(desc);
            card.appendChild(techStack);
            card.appendChild(links);
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Unable to load projects at this time.';
        container.appendChild(errorMsg);
    }

    container.appendChild(heading);
    container.appendChild(grid);

    projectsSection.appendChild(container);
}
