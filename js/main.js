/**
 * Main Entry Point
 * Handles initialization of Theme, Sections, and 3D Background.
 */

// 1. Imports
import { initHero } from '../sections/hero.js';
import { initAbout } from '../sections/about.js';
import { initSkills } from '../sections/skills.js';
import { initProjects } from '../sections/projects.js';
import { initContact } from '../sections/contact.js';

import { createScene } from './three/scene.js';
import { createCamera } from './three/camera.js';
import { createRenderer } from './three/renderer.js';
import { createLights } from './three/lights.js';
import { createBackground, animateBackground, updateParticleTheme } from './three/background.js';
import { debounce, isWebGLAvailable } from './utils/performance.js';

// 2. Global State (Module Scope)
const state = {
    isVisible: true,
    animationId: null
};

// 3. Theme Management
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    function setTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeToggleBtn) themeToggleBtn.textContent = 'Dark Mode';
        } else {
            root.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.textContent = 'Light Mode';
        }
    }

    // Load Preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersLight) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    // Toggle Listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // Watch for theme changes (e.g. system change or manual toggle) to update particles
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const isLight = root.getAttribute('data-theme') === 'light';
                updateParticleTheme(isLight);
            }
        });
    });
    observer.observe(root, { attributes: true });
}

// 4. Section Management
async function initSections() {
    initHero();
    initAbout();
    initSkills();
    await initProjects(); // Wait for data fetch
    initContact();
}

// 5. Three.js Initialization
function initThreeJS() {
    if (!isWebGLAvailable()) {
        console.warn('WebGL not available - 3D background disabled.');
        // Optional: Add a class to body to show a static fallback background
        document.body.classList.add('no-webgl');
        return;
    }

    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer();
    const lights = createLights(scene);

    // Create Background
    createBackground(scene);

    // Initial particle theme sync
    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateParticleTheme(currentTheme === 'light');

    // Animation Loop
    function animate(time) {
        if (!state.isVisible) return;

        state.animationId = requestAnimationFrame(animate);
        animateBackground(time);
        renderer.render(scene, camera);
    }

    animate();

    // Efficient Resize Handler (Debounced)
    window.addEventListener('resize', debounce(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 100));

    // Visibility Handler
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            state.isVisible = false;
            cancelAnimationFrame(state.animationId);
            console.log('Paused: Tab inactive');
        } else {
            state.isVisible = true;
            animate();
            console.log('Resumed: Tab active');
        }
    });
}

// 6. Main Bootstrap
async function main() {
    console.log('Initializing portfolio...');

    initTheme();
    await initSections();
    initThreeJS();

    console.log('Portfolio ready.');
}

// Run
main();
