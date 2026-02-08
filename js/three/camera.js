import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createCamera() {
    const fov = 35; // Field of view
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1; // Near clipping plane
    const far = 100; // Far clipping plane

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // Position the camera back to see the origin
    camera.position.set(0, 0, 10);

    return camera;
}
