/**
 * Performance Utilities
 */

// Debounce function to limit rate of execution
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Detect low-end devices based on hardware concurrency or memory
export function isLowEndDevice() {
    const concurrency = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4; // in GB

    // Consider device low-end if it has fewer than 4 cores or less than 4GB RAM
    return concurrency < 4 || memory < 4;
}

// Check if WebGL is available
export function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}
