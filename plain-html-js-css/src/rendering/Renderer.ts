import * as THREE from 'three';
import { COLORS } from '../core/Config';

export class Renderer {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  readonly renderer: THREE.WebGLRenderer;

  constructor(host: HTMLElement) {
    this.scene.background = new THREE.Color(COLORS.sky);
    this.scene.fog = new THREE.Fog(COLORS.fog, 14, 32);
    this.camera.position.set(0, 2.8, 7.8);
    this.camera.lookAt(0, 1.75, 0);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    host.prepend(this.renderer.domElement);
    this.addLighting();
    this.resize();
    addEventListener('resize', this.resize);
  }

  private addLighting(): void {
    this.scene.add(new THREE.HemisphereLight(0xe7f7ff, 0x947653, 2.25));
    const sun = new THREE.DirectionalLight(0xfff1cf, 3.1);
    sun.position.set(-5, 9, 7); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -7; sun.shadow.camera.right = 7; sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -2;
    this.scene.add(sun);
  }

  resize = (): void => {
    const width = innerWidth, height = innerHeight;
    this.camera.aspect = width / Math.max(1, height);
    this.camera.fov = width < height ? 58 : 48;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  render(): void { this.renderer.render(this.scene, this.camera); }
  dispose(): void { removeEventListener('resize', this.resize); this.renderer.dispose(); }
}
