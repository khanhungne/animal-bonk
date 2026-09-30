export type EnvironmentObjectType = 'crate' | 'barrel';
import type { AnimalId } from '../entities/AnimalDefinition';
export type FormationType = 'line' | 'grid' | 'triangle' | 'cluster' | 'split';
export interface EnvironmentSpawn { type: EnvironmentObjectType; position: [number, number, number]; destructible?: boolean; }
export interface LevelDefinition { id: number; title: string; objective: string; surpriseWall: boolean; environment: EnvironmentSpawn[]; animals: AnimalId[]; formation: FormationType; powerMultiplier?: number; }
