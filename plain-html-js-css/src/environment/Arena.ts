import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { COLORS } from '../core/Config';

export class Arena {
  readonly group = new THREE.Group();
  constructor(scene: THREE.Scene, world: RAPIER.World) {
    scene.add(this.group);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(16, .3, 18), new THREE.MeshStandardMaterial({ color: COLORS.floor, roughness: .86 }));
    floor.position.set(0, -.16, -2); floor.receiveShadow = true; this.group.add(floor);
    const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -.16, -2));
    world.createCollider(RAPIER.ColliderDesc.cuboid(8, .15, 9).setFriction(.9).setRestitution(.18), groundBody);
    const grid = new THREE.GridHelper(16, 16, 0xb99968, 0xd9bd86); grid.position.y = .002; grid.position.z = -2; this.group.add(grid);
    this.addBackdrop();
  }

  private addBackdrop(): void {
    const colors = [0xffd65c, 0x76c893, 0xf07f65, 0x7888e8];
    for (let i = 0; i < 9; i++) {
      const h = 1.2 + (i % 3) * .65;
      const block = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.4), new THREE.MeshStandardMaterial({ color: colors[i % colors.length], roughness: .9 }));
      block.position.set(-7 + i * 1.75, h / 2 - .05, -8 - (i % 2) * .5); block.receiveShadow = true; block.castShadow = true; this.group.add(block);
    }
    for (const x of [-4.5, 4.5]) {
      const cloud = new THREE.Group();
      for (const [dx, scale] of [[0, 1], [.75, .7], [-.75, .65]] as const) { const puff = new THREE.Mesh(new THREE.SphereGeometry(.6 * scale, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); puff.position.x = dx; cloud.add(puff); }
      cloud.position.set(x, 6 + (x > 0 ? .7 : 0), -11); this.group.add(cloud);
    }
  }
}
