import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

let particles;

export function createBackground(scene) {
    const geometry = new THREE.BufferGeometry();
    const count = 1000; // Number of particles
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color = new THREE.Color();

    for (let i = 0; i < count * 3; i += 3) {
        // Spread particles in a wide area around the center
        positions[i] = (Math.random() - 0.5) * 40;     // x
        positions[i + 1] = (Math.random() - 0.5) * 40; // y
        positions[i + 2] = (Math.random() - 0.5) * 40; // z

        // Randomize colors slightly (blue/cyan/white mix)
        // You can adjust these based on the theme later
        if (Math.random() > 0.5) {
            color.setHex(0x64ffda); // Teal accent
        } else {
            color.setHex(0xaaaaaa); // Grey/White
        }

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    return particles;
}

export function animateBackground(time) {
    if (particles) {
        // Slow rotation for ambient effect
        particles.rotation.y = time * 0.0001;
        particles.rotation.x = time * 0.00005;
    }
}

export function updateParticleTheme(isLight) {
    if (!particles) return;

    const colors = particles.geometry.attributes.color.array;
    const color = new THREE.Color();
    const count = colors.length / 3;

    for (let i = 0; i < count * 3; i += 3) {
        // We can deterministically re-color based on index or just Random again
        // To keep it simple and consistent, we'll just re-randomize slightly or use checking logic if we stored it
        // Since we didn't store "isTeal" vs "isGrey", we can just re-roll. 
        // Or better, check current color brightness? 
        // Let's just re-roll for simplicity as the position doesn't change.

        if (Math.random() > 0.5) {
            // Teal accent
            color.setHex(isLight ? 0x00796b : 0x64ffda);
        } else {
            // Secondary color
            color.setHex(isLight ? 0x333333 : 0xaaaaaa);
        }

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    particles.geometry.attributes.color.needsUpdate = true;
}
