export function initAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'About Me';

    const headerRow = document.createElement('div');
    headerRow.className = 'section-header';

    // Add resume button
    const resumeButton = document.createElement('a');
    resumeButton.href = 'https://drive.google.com/file/d/1iWASL0Tm0nn4R1Yq72klLUqScmeS2fIC/view?usp=sharing';
    resumeButton.className = 'btn';
    resumeButton.textContent = 'View Resume';
    resumeButton.target = '_blank';
    resumeButton.rel = 'noopener noreferrer';

    headerRow.appendChild(heading);
    headerRow.appendChild(resumeButton);

    const text = document.createElement('p');
    text.innerHTML = "I am a Computer Science & Design undergraduate who enjoys building practical software and turning ideas into working digital products. My approach to learning has always been simple — build consistently, understand deeply, and improve with every project.<br><br>I have worked on web applications using HTML, CSS, and JavaScript, focusing on creating clean, responsive, and user-friendly interfaces. Through projects like an online vehicle repair platform, I explored frontend development, deployment workflows, and version control using GitHub. I enjoy the process of structuring interfaces and making applications intuitive to use.<br><br>Alongside web development, I actively build Python-based systems to strengthen my programming fundamentals. Developing applications such as a productivity tracker helped me understand data handling, structured logic, and database integration using SQLite. These projects allow me to sharpen problem-solving skills and improve my understanding of core computer science concepts.<br><br>I also explore interactive development and game mechanics. Building a 2D endless runner game using Python and PyGame introduced me to event-driven logic, collision handling, scoring systems, and optimization for different platforms. Game development, for me, is a creative way to combine logic and experimentation.<br><br>Beyond technical skills, I am deeply interested in continuous learning. I regularly engage in certifications, programming challenges, and technical events to expand my knowledge base. Participating in competitions like coding contests and Capture the Flag events has strengthened my analytical thinking and ability to work under pressure.<br><br>I believe strong software development is built on fundamentals — clear logic, clean structure, and consistent practice. My goal is to keep building meaningful projects, refine my technical depth, and evolve into a well-rounded software professional.";

    container.appendChild(headerRow);
    container.appendChild(text);

    aboutSection.appendChild(container);
}
