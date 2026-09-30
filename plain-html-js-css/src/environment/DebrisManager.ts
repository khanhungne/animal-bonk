import * as THREE from 'three'; import RAPIER from '@dimforge/rapier3d-compat';
interface Debris { mesh: THREE.Mesh; body: RAPIER.RigidBody; expires: number; }
export class DebrisManager {
  private pieces: Debris[] = []; readonly maxPieces = 28;
  constructor(private scene: THREE.Scene, private world: RAPIER.World) {}
  spawn(position: THREE.Vector3, color: number, count: number, impulse: THREE.Vector3): void {
    for (let i = 0; i < count; i++) { if (this.pieces.length >= this.maxPieces) this.remove(this.pieces[0]); const size = THREE.MathUtils.randFloat(.13, .28); const mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshStandardMaterial({ color, roughness: .9 })); mesh.castShadow = true; mesh.receiveShadow = true; mesh.position.copy(position).add(new THREE.Vector3().randomDirection().multiplyScalar(.25)); this.scene.add(mesh); const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(mesh.position.x, mesh.position.y, mesh.position.z).setLinearDamping(.35).setAngularDamping(.45)); this.world.createCollider(RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2).setDensity(.45).setFriction(.8).setRestitution(.34), body); body.applyImpulse({ x: impulse.x * .22 + THREE.MathUtils.randFloatSpread(.8), y: Math.abs(impulse.y) * .15 + THREE.MathUtils.randFloat(.5, 1.6), z: impulse.z * .22 + THREE.MathUtils.randFloatSpread(.8) }, true); body.applyTorqueImpulse({ x: Math.random(), y: Math.random(), z: Math.random() }, true); this.pieces.push({ mesh, body, expires: performance.now() + 5200 }); }
  }
  update(): void { const now = performance.now(); for (let i = this.pieces.length - 1; i >= 0; i--) { const piece = this.pieces[i]; if (now >= piece.expires || piece.body.translation().y < -4) { this.remove(piece); continue; } const p = piece.body.translation(), q = piece.body.rotation(); piece.mesh.position.set(p.x, p.y, p.z); piece.mesh.quaternion.set(q.x, q.y, q.z, q.w); } }
  private remove(piece: Debris): void { const index = this.pieces.indexOf(piece); if (index >= 0) this.pieces.splice(index, 1); this.scene.remove(piece.mesh); piece.mesh.geometry.dispose(); (piece.mesh.material as THREE.Material).dispose(); this.world.removeRigidBody(piece.body); }
  destroy(): void { [...this.pieces].forEach(piece => this.remove(piece)); }
}
