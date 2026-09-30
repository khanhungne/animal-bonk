import * as THREE from 'three'; import type { PhysicsWorld, ContactImpact } from '../physics/PhysicsWorld'; import type { LevelDefinition } from '../levels/LevelDefinition'; import { DebrisManager } from './DebrisManager'; import { PhysicsProp } from './PhysicsProp'; import { BreakableWall } from './BreakableWall'; import type { Destructible, DestructionResult } from './Destructible';
export class EnvironmentManager {
  private readonly debris: DebrisManager; private readonly objects: Destructible[] = []; wall?: BreakableWall;
  constructor(scene: THREE.Scene, physics: PhysicsWorld, level: LevelDefinition, onWallBroken: () => void, onPhysicsImpact?:(prop:PhysicsProp,result:DestructionResult,impact:ContactImpact)=>void) { this.debris = new DebrisManager(scene, physics.world); for (const spawn of level.environment) this.objects.push(new PhysicsProp(scene, physics, this.debris, spawn.type, spawn.position, spawn.destructible ?? false,onPhysicsImpact)); if (level.surpriseWall) { this.wall = new BreakableWall(scene, physics, onWallBroken); this.objects.push(this.wall); } }
  get targets(): THREE.Mesh[] { return this.objects.flatMap(object => object.targets); }
  update(): void { this.objects.forEach(object => object.update()); this.debris.update(); }
  destroy(): void { this.objects.forEach(object => object.destroy()); this.debris.destroy(); }
}
