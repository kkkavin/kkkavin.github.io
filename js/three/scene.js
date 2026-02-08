import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createScene() {
    const scene = new THREE.Scene();
    // Optional: Add fog for depth if needed later
    // scene.fog = new THREE.FogExp2(0x000000, 0.002);
    return scene;
}
