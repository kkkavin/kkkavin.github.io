import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createLights(scene) {
    // Ambient light - soft general illumination
    const ambientLight = new THREE.AmbientLight('white', 2);
    scene.add(ambientLight);

    // Directional light - simulates sun/key light
    const mainLight = new THREE.DirectionalLight('white', 5);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    return { ambientLight, mainLight };
}
