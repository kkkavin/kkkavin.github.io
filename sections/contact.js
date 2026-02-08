export function initContact() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'Get In Touch';

    const text = document.createElement('p');
    text.textContent = "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!";

    const button = document.createElement('a');
    button.href = 'mailto:email@example.com';
    button.className = 'theme-toggle'; // Reusing button style for now
    button.style.display = 'inline-block';
    button.style.marginTop = '1rem';
    button.textContent = 'Say Hello';

    container.appendChild(heading);
    container.appendChild(text);
    container.appendChild(button);

    contactSection.appendChild(container);
}
