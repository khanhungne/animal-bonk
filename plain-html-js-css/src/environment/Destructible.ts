import * as THREE from 'three';
export interface DestructionResult { broken: boolean; score: number; label: string; }
export interface Destructible {
  readonly targets: THREE.Mesh[];
  readonly broken: boolean;
  hit(point: THREE.Vector3, direction: THREE.Vector3, power?: number): DestructionResult;
  collision(force: number): DestructionResult;
  update(): void;
  destroy(): void;
}
