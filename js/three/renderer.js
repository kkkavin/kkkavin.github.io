import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { isLowEndDevice } from '../utils/performance.js';

export function createRenderer() {
    const canvas = document.querySelector('#webgl-canvas');

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Allow CSS background to show through
        antialias: !isLowEndDevice() // Disable antialias on low-end for performance
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Cap pixel ratio to 1 for low-end devices, max 2 for others
    const pixelRatio = isLowEndDevice() ? 1 : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);

    return renderer;
}
