import * as THREE from 'three'; import type { AnimalDefinition, AnimalPartName } from './AnimalDefinition'; import { COLORS } from '../core/Config';
export interface AnimalModel { visuals: Map<AnimalPartName, THREE.Group>; materials: THREE.Material[]; }
export class AnimalModelFactory {
  static create(definition: AnimalDefinition): AnimalModel {
    const colors = definition.id === 'chicken' ? [0xfff3d1, 0xf5bd28] : definition.id === 'frog' ? [0x63c66d, 0x2d7d49] : [COLORS.pink, COLORS.darkPink];
    const skin = new THREE.MeshStandardMaterial({ color: colors[0], roughness: .72 }); const accent = new THREE.MeshStandardMaterial({ color: colors[1], roughness: .74 }); const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .4 }); const black = new THREE.MeshStandardMaterial({ color: 0x172033 }); const red = new THREE.MeshStandardMaterial({ color: 0xe74751 });
    const visuals = new Map<AnimalPartName, THREE.Group>();
    visuals.set('torso', this.ellipsoid(skin, definition.id === 'frog' ? [.72, .46, .46] : definition.id === 'chicken' ? [.48, .66, .42] : [.58, .68, .44]));
    visuals.set('hips', this.ellipsoid(skin, definition.id === 'frog' ? [.62, .3, .42] : [.48, .36, .4]));
    visuals.set('head', this.head(definition.id, skin, accent, white, black, red));
    const limbScale = definition.id === 'frog' ? 1.25 : definition.id === 'chicken' ? .72 : 1;
    for (const name of ['leftUpperArm','rightUpperArm','leftLowerArm','rightLowerArm','leftUpperLeg','rightUpperLeg','leftLowerLeg','rightLowerLeg'] as AnimalPartName[]) { const group = new THREE.Group(); const radius = (name.includes('Leg') ? .17 : .145) * limbScale; const length = (name.includes('Lower') ? .45 : .5) * limbScale; const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 4, 10), name.includes('Leg') && definition.id === 'chicken' ? accent : skin); group.add(mesh); visuals.set(name, group); }
    return { visuals, materials: [skin, accent, white, black, red] };
  }
  private static ellipsoid(material: THREE.Material, scale: [number, number, number]): THREE.Group { const group = new THREE.Group(); const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), material); mesh.scale.set(...scale); group.add(mesh); return group; }
  private static head(id: string, skin: THREE.Material, accent: THREE.Material, white: THREE.Material, black: THREE.Material, red: THREE.Material): THREE.Group {
    const group = this.ellipsoid(skin, id === 'frog' ? [.62, .38, .48] : id === 'chicken' ? [.43, .46, .4] : [.53, .49, .5]);
    for (const x of [-.2, .2]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(id === 'frog' ? .15 : .105, 12, 8), white); eye.position.set(x, id === 'frog' ? .3 : .14, .4); const pupil = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 7), black); pupil.position.z = .09; eye.add(pupil); group.add(eye); }
    if (id === 'pig') { const snout = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), accent); snout.scale.set(.29, .2, .14); snout.position.set(0, -.08, .47); group.add(snout); for (const x of [-.1,.1]) { const nostril = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), black); nostril.position.set(x, -.07, .6); group.add(nostril); } for (const x of [-.32,.32]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(.18, .42, 4), skin); ear.position.set(x,.43,0); group.add(ear); } }
    else if (id === 'chicken') { const beak = new THREE.Mesh(new THREE.ConeGeometry(.15, .38, 4), accent); beak.rotation.x = Math.PI / 2; beak.position.set(0,-.02,.48); group.add(beak); for (let i=0;i<3;i++) { const comb = new THREE.Mesh(new THREE.SphereGeometry(.11,8,6), red); comb.position.set((i-1)*.12,.48 + (i===1?.08:0),0); group.add(comb); } }
    else { const mouth = new THREE.Mesh(new THREE.BoxGeometry(.34,.035,.025), black); mouth.position.set(0,-.16,.47); group.add(mouth); }
    return group;
  }
}
