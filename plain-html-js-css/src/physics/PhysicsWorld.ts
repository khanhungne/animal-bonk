import RAPIER from '@dimforge/rapier3d-compat';
import { GAME_PHYSICS } from '../core/Config';
export interface ContactImpact { force: number; self: number; other: number; direction: {x:number;y:number;z:number}; }

export class PhysicsWorld {
  readonly world: RAPIER.World;
  private readonly events: RAPIER.EventQueue;
  private readonly impactHandlers = new Map<number, (impact: ContactImpact) => void>();
  private accumulator = 0;
  private readonly fixedStep = 1 / 60;

  private constructor() { this.world = new RAPIER.World({ x: 0, y: GAME_PHYSICS.gravity, z: 0 }); this.world.timestep = this.fixedStep; this.events = new RAPIER.EventQueue(true); }
  static async create(): Promise<PhysicsWorld> { await RAPIER.init(); return new PhysicsWorld(); }

  step(deltaSeconds: number): void {
    this.accumulator = Math.min(this.accumulator + deltaSeconds, .1);
    while (this.accumulator >= this.fixedStep) { this.world.step(this.events); this.events.drainContactForceEvents(event => { const force = event.totalForceMagnitude(), a=event.collider1(), b=event.collider2(), d=event.maxForceDirection(); this.impactHandlers.get(a)?.({force,self:a,other:b,direction:d}); this.impactHandlers.get(b)?.({force,self:b,other:a,direction:{x:-d.x,y:-d.y,z:-d.z}}); }); this.accumulator -= this.fixedStep; }
  }
  registerImpact(collider: RAPIER.Collider, handler: (impact: ContactImpact) => void): void { collider.setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS); collider.setContactForceEventThreshold(3); this.impactHandlers.set(collider.handle, handler); }
  unregisterImpact(collider: RAPIER.Collider): void { this.impactHandlers.delete(collider.handle); }
}
