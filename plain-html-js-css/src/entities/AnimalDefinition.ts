export interface AnimalDefinition {
  id: string;
  displayName: string;
  massMultiplier: number;
  launchMultiplier: number;
  bounceMultiplier: number;
  scale: number;
}

export type AnimalId = 'pig' | 'chicken' | 'frog';
export const ANIMALS: Record<AnimalId, AnimalDefinition> = {
  pig: { id: 'pig', displayName: 'Pig', massMultiplier: 1, launchMultiplier: 1.2, bounceMultiplier: 1.05, scale: 1 },
  chicken: { id: 'chicken', displayName: 'Chicken', massMultiplier: .55, launchMultiplier: 1.75, bounceMultiplier: 1.15, scale: .78 },
  frog: { id: 'frog', displayName: 'Frog', massMultiplier: .78, launchMultiplier: 1.3, bounceMultiplier: 1.55, scale: .82 }
};
export const PIG_DEFINITION = ANIMALS.pig;
export type AnimalPartName = 'head' | 'torso' | 'hips' | 'leftUpperArm' | 'rightUpperArm' | 'leftLowerArm' | 'rightLowerArm' | 'leftUpperLeg' | 'rightUpperLeg' | 'leftLowerLeg' | 'rightLowerLeg';
export enum AnimalState { Idle = 'Idle', Hit = 'Hit', Ragdoll = 'Ragdoll', KnockedOut = 'KnockedOut' }
