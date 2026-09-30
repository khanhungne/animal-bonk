import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { COLORS, GAME_PHYSICS } from '../core/Config';
import { AnimalState, PIG_DEFINITION, type AnimalDefinition, type AnimalPartName } from './AnimalDefinition';

export interface RagdollPart { name: AnimalPartName; visual: THREE.Group; body: RAPIER.RigidBody; meshes: THREE.Mesh[]; }

export class RagdollPig {
  readonly definition: AnimalDefinition = PIG_DEFINITION;
  readonly group = new THREE.Group();
  readonly parts = new Map<AnimalPartName, RagdollPart>();
  readonly targets: THREE.Mesh[] = [];
  state = AnimalState.Idle;
  get visible(): boolean { return this.group.visible; }
  private joints: RAPIER.ImpulseJoint[] = [];
  private elapsed = 0;
  private ragdollAt = 0;
  private eyes: THREE.Mesh[] = [];
  private readonly pink = new THREE.MeshStandardMaterial({ color: COLORS.pink, roughness: .72 });
  private readonly darkPink = new THREE.MeshStandardMaterial({ color: COLORS.darkPink, roughness: .75 });
  private readonly white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .45 });
  private readonly black = new THREE.MeshStandardMaterial({ color: 0x172033, roughness: .5 });

  constructor(private scene: THREE.Scene, private world: RAPIER.World) {
    scene.add(this.group); this.buildParts(); this.buildJoints(); this.syncVisuals();
  }

  private buildParts(): void {
    this.addPart('torso', [0, 2.35, 0], this.ellipsoid(.58, .68, .44), RAPIER.ColliderDesc.capsule(.34, .4));
    this.addPart('hips', [0, 1.72, 0], this.ellipsoid(.48, .36, .4), RAPIER.ColliderDesc.cuboid(.39, .24, .31));
    this.addPart('head', [0, 3.12, 0], this.makeHead(), RAPIER.ColliderDesc.ball(.48));
    this.addLimb('leftUpperArm', [-.67, 2.37, 0], .5, .145, -.2); this.addLimb('rightUpperArm', [.67, 2.37, 0], .5, .145, .2);
    this.addLimb('leftLowerArm', [-.83, 1.91, .02], .45, .13, -.12); this.addLimb('rightLowerArm', [.83, 1.91, .02], .45, .13, .12);
    this.addLimb('leftUpperLeg', [-.29, 1.25, 0], .48, .17, -.04); this.addLimb('rightUpperLeg', [.29, 1.25, 0], .48, .17, .04);
    this.addLimb('leftLowerLeg', [-.31, .68, .02], .5, .16, .02); this.addLimb('rightLowerLeg', [.31, .68, .02], .5, .16, -.02);
  }

  private ellipsoid(x: number, y: number, z: number): THREE.Group {
    const group = new THREE.Group(); const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), this.pink); mesh.scale.set(x, y, z); group.add(mesh); return group;
  }

  private makeHead(): THREE.Group {
    const group = this.ellipsoid(.53, .49, .5); const snout = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), this.darkPink); snout.scale.set(.29, .2, .14); snout.position.set(0, -.08, .47); group.add(snout);
    for (const x of [-.2, .2]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(.105, 12, 8), this.white); eye.position.set(x, .14, .45); const pupil = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 7), this.black); pupil.position.set(0, 0, .09); eye.add(pupil); group.add(eye); this.eyes.push(eye); const nostril = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), this.black); nostril.position.set(x * .48, -.07, .6); group.add(nostril); }
    for (const x of [-.32, .32]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(.18, .42, 4), this.pink); ear.position.set(x, .43, 0); ear.rotation.z = x < 0 ? .25 : -.25; group.add(ear); }
    return group;
  }

  private addLimb(name: AnimalPartName, pos: [number, number, number], length: number, radius: number, zRotation: number): void {
    const group = new THREE.Group(); const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 4, 10), this.pink); mesh.rotation.z = zRotation; group.add(mesh); this.addPart(name, pos, group, RAPIER.ColliderDesc.capsule(length / 2, radius));
  }

  private addPart(name: AnimalPartName, pos: [number, number, number], visual: THREE.Group, collider: RAPIER.ColliderDesc): void {
    const body = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(...pos).setLinearDamping(.55).setAngularDamping(.65));
    collider.setDensity(1.15 * this.definition.massMultiplier).setRestitution(.38 * this.definition.bounceMultiplier).setFriction(.78);
    this.world.createCollider(collider, body); visual.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; object.userData.animalPart = name; this.targets.push(object); } });
    this.group.add(visual); this.parts.set(name, { name, visual, body, meshes: this.targets.filter(mesh => mesh.userData.animalPart === name) });
  }

  private buildJoints(): void {
    this.joint('torso', 'head', [0, .48, 0], [0, -.42, 0]); this.joint('torso', 'hips', [0, -.48, 0], [0, .28, 0]);
    this.joint('torso', 'leftUpperArm', [-.48, .2, 0], [.12, .25, 0]); this.joint('torso', 'rightUpperArm', [.48, .2, 0], [-.12, .25, 0]);
    this.joint('leftUpperArm', 'leftLowerArm', [-.08, -.25, 0], [.05, .22, 0]); this.joint('rightUpperArm', 'rightLowerArm', [.08, -.25, 0], [-.05, .22, 0]);
    this.joint('hips', 'leftUpperLeg', [-.25, -.18, 0], [0, .27, 0]); this.joint('hips', 'rightUpperLeg', [.25, -.18, 0], [0, .27, 0]);
    this.joint('leftUpperLeg', 'leftLowerLeg', [0, -.27, 0], [0, .27, 0]); this.joint('rightUpperLeg', 'rightLowerLeg', [0, -.27, 0], [0, .27, 0]);
  }

  private joint(a: AnimalPartName, b: AnimalPartName, anchorA: [number, number, number], anchorB: [number, number, number]): void {
    const data = RAPIER.JointData.spherical({ x: anchorA[0], y: anchorA[1], z: anchorA[2] }, { x: anchorB[0], y: anchorB[1], z: anchorB[2] });
    this.joints.push(this.world.createImpulseJoint(data, this.parts.get(a)!.body, this.parts.get(b)!.body, true));
  }

  hit(partName: AnimalPartName, hitPoint: THREE.Vector3, direction: THREE.Vector3): number {
    if (this.state !== AnimalState.Idle) return 0; this.state = AnimalState.Hit;
    for (const part of this.parts.values()) part.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    const target = this.parts.get(partName)!; const multiplier = partName === 'head' ? 1.5 : partName === 'torso' || partName === 'hips' ? 1.18 : .92;
    const impulse = direction.clone().normalize().multiplyScalar(GAME_PHYSICS.punchPower * GAME_PHYSICS.launchMultiplier * this.definition.launchMultiplier * multiplier);
    if (partName.includes('Leg')) impulse.y -= 1.5; else impulse.y += partName === 'head' ? 2.2 : .65;
    target.body.applyImpulseAtPoint({ x: impulse.x, y: impulse.y, z: impulse.z }, { x: hitPoint.x, y: hitPoint.y, z: hitPoint.z }, true);
    const side = hitPoint.x >= 0 ? -1 : 1; target.body.applyTorqueImpulse({ x: partName === 'head' ? 1.2 : .25, y: side * multiplier, z: side * 2.1 * GAME_PHYSICS.angularMultiplier }, true);
    for (const part of this.parts.values()) if (part !== target) part.body.applyImpulse({ x: impulse.x * .08, y: Math.max(0, impulse.y) * .04, z: impulse.z * .08 }, true);
    this.state = AnimalState.Ragdoll; this.ragdollAt = this.elapsed; return Math.round(100 * multiplier);
  }

  setVisible(visible: boolean): void { this.group.visible = visible; }

  update(delta: number): void {
    this.elapsed += delta; this.syncVisuals();
    if (this.state === AnimalState.Idle) { const blink = Math.sin(this.elapsed * 2.3) > .992 ? .12 : 1; this.eyes.forEach(eye => eye.scale.y = blink); this.parts.get('head')!.visual.rotation.y = Math.sin(this.elapsed * 1.35) * .055; }
    if (this.state === AnimalState.Ragdoll && this.elapsed - this.ragdollAt > GAME_PHYSICS.settleDelay) { let speed = 0; for (const part of this.parts.values()) { const v = part.body.linvel(); speed += Math.hypot(v.x, v.y, v.z); } if (speed / this.parts.size < GAME_PHYSICS.settleSpeed || this.elapsed - this.ragdollAt > 6) this.state = AnimalState.KnockedOut; }
  }

  private syncVisuals(): void { for (const { visual, body } of this.parts.values()) { const p = body.translation(), q = body.rotation(); visual.position.set(p.x, p.y, p.z); visual.quaternion.set(q.x, q.y, q.z, q.w); } }
  destroy(): void { for (const joint of this.joints) this.world.removeImpulseJoint(joint, false); for (const part of this.parts.values()) this.world.removeRigidBody(part.body); this.scene.remove(this.group); this.group.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); }); this.pink.dispose(); this.darkPink.dispose(); this.white.dispose(); this.black.dispose(); this.targets.length = 0; this.parts.clear(); }
}
