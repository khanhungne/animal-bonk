import * as THREE from 'three';
export interface PointerRay { ray: THREE.Ray; x: number; y: number; }
export class RaycastController {
  private readonly caster = new THREE.Raycaster(); private handler?: (event: PointerEvent) => void;
  constructor(private canvas: HTMLCanvasElement, private camera: THREE.PerspectiveCamera) {}
  onPointer(callback: (pointer: PointerRay) => void): void { this.handler = event => { if (event.button !== 0) return; event.preventDefault(); const rect = this.canvas.getBoundingClientRect(); const ndc = new THREE.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1); this.caster.setFromCamera(ndc, this.camera); callback({ ray: this.caster.ray.clone(), x: event.clientX, y: event.clientY }); }; this.canvas.addEventListener('pointerdown', this.handler, { passive: false }); }
  intersect(objects: THREE.Object3D[]): THREE.Intersection | undefined { return this.caster.intersectObjects(objects, false)[0]; }
  setRay(ray: THREE.Ray): void { this.caster.ray.copy(ray); }
  dispose(): void { if (this.handler) this.canvas.removeEventListener('pointerdown', this.handler); }
}
