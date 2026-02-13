export function initAbout() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'About Me';

    const text = document.createElement('p');
    text.innerHTML = "I am a Computer Science & Design undergraduate who enjoys building practical software and turning ideas into working digital products. My approach to learning has always been simple — build consistently, understand deeply, and improve with every project.<br>I have worked on web applications using HTML, CSS, and JavaScript, focusing on creating clean, responsive, and user-friendly interfaces. Through projects like an online vehicle repair platform, I explored frontend development, deployment workflows, and version control using GitHub. I enjoy the process of structuring interfaces and making applications intuitive to use.<br>Alongside web development, I actively build Python-based systems to strengthen my programming fundamentals. Developing applications such as a productivity tracker helped me understand data handling, structured logic, and database integration using SQLite. These projects allow me to sharpen problem-solving skills and improve my understanding of core computer science concepts.<br>I also explore interactive development and game mechanics. Building a 2D endless runner game using Python and PyGame introduced me to event-driven logic, collision handling, scoring systems, and optimization for different platforms. Game development, for me, is a creative way to combine logic and experimentation.<br>Beyond technical skills, I am deeply interested in continuous learning. I regularly engage in certifications, programming challenges, and technical events to expand my knowledge base. Participating in competitions like coding contests and Capture the Flag events has strengthened my analytical thinking and ability to work under pressure.<br>I believe strong software development is built on fundamentals — clear logic, clean structure, and consistent practice. My goal is to keep building meaningful projects, refine my technical depth, and evolve into a well-rounded software professional.";

    container.appendChild(heading);
    container.appendChild(text);

    aboutSection.appendChild(container);
}
