export function initCertifications() {
    const certificationsSection = document.getElementById('certifications');
    if (!certificationsSection) return;

    const container = document.createElement('div');
    container.className = 'container';

    const heading = document.createElement('h2');
    heading.textContent = 'Certifications';

    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';

    // Define certifications with name and URL
    const certifications = [
        { name: 'Programming and DSA Using Python', url: 'https://drive.google.com/file/d/1S4GfdoR3qoasm7xLPo4AvltVWFmOWhbF/view?usp=drive_link' },
        { name: 'Design Thinking - A Primer', url: 'https://drive.google.com/file/d/1V0xU4pFsssRvVRtMBnmJDvEVFKvIXm22/view?usp=drive_link' },
        { name: 'Python Foundation Certification', url: 'https://drive.google.com/file/d/1toilhYasVHKy03EvwZtBo61xNWOsEVEy/view?usp=drive_link' },
        { name: 'Unity Mobile AR Development', url: 'https://drive.google.com/file/d/1wQPPqXt4eEnF3PrrEbUlNGwEcRRMAcVo/view?usp=drive_link' },
        { name: 'Unity VR Development', url: 'https://drive.google.com/file/d/1ya3TkOuhzs-sQwX1sYGOXdwKyQIP5q3w/view?usp=drive_link' },
        { name: 'Digital 101 - 30 hours', url: 'https://drive.google.com/file/d/1d_D7Vha3jhwH3XuSUIG1LA4Ykxp6VM1K/view?usp=sharing' },
        { name: 'Cybersecurity Fundamentals', url: 'https://drive.google.com/file/d/16UiZPW2ck4iCqRP8CPCCZb0EEh1H0Qpn/view?usp=sharing' },
        { name: 'Data Processing and Visualization', url: 'https://drive.google.com/file/d/1vmQpW8Yt9IxPyleIPHr2uzfQnrZmoEA_/view?usp=sharing' }
    ];

    certifications.forEach(cert => {
        // Create a link for each certification
        const link = document.createElement('a');
        link.href = cert.url;
        link.target = '_blank'; // Open in new tab
        link.rel = 'noopener noreferrer';
        link.className = 'cert-link'; // For styling if needed

        const card = document.createElement('div');
        card.className = 'card';
        card.textContent = cert.name;

        link.appendChild(card);
        grid.appendChild(link);
    });

    container.appendChild(heading);
    container.appendChild(grid);

    certificationsSection.appendChild(container);
}