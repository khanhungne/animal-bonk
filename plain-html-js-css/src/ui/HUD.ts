import { DEBUG } from '../core/Config';
export class HUD {
  private score = document.querySelector<HTMLElement>('#score')!; private level = document.querySelector<HTMLElement>('#level')!; private message = document.querySelector<HTMLElement>('#message')!; private combo = document.querySelector<HTMLElement>('#combo')!; private debug = document.querySelector<HTMLElement>('#debug')!; private complete = document.querySelector<HTMLElement>('#level-complete')!;
  constructor(onRestart: () => void) { document.querySelector('#restart')!.addEventListener('click', onRestart); this.debug.hidden = !DEBUG; }
  setScore(value: number): void { this.score.textContent = `SCORE ${value}`; }
  setLevel(id: number, title: string): void { this.level.textContent = `LEVEL ${id} · ${title}`; }
  setObjective(title: string, detail = ''): void { this.message.innerHTML = `<strong>${title}</strong>${detail ? `<small>${detail}</small>` : ''}`; }
  setImpact(label: string): void { this.setObjective(label, 'Keep the chaos going!'); }
  setCombo(text:string):void{this.combo.textContent=text;this.combo.classList.toggle('active',Boolean(text));if(text){this.combo.getAnimations().forEach(a=>a.cancel());this.combo.classList.remove('active');requestAnimationFrame(()=>this.combo.classList.add('active'));}}
  showComplete(score: number, bonks: number, bestCombo:number, buttonLabel: string, next: () => void): void { this.complete.hidden = false; this.complete.innerHTML = `<div class="complete-card"><h2>LEVEL COMPLETE!</h2><p>Score&nbsp;&nbsp; ${score.toLocaleString()}</p><p>Best Combo&nbsp;&nbsp; x${bestCombo}</p><p>Bonks&nbsp;&nbsp; ${bonks}</p><button type="button">${buttonLabel}</button></div>`; this.complete.querySelector('button')!.addEventListener('click', next, { once: true }); }
  hideComplete(): void { this.complete.hidden = true; this.complete.replaceChildren(); }
  updateDebug(fps: number, bodies: number, part: string, impulse: number): void { if (DEBUG) this.debug.textContent = `FPS ${fps.toFixed(0)}\nBODIES ${bodies}\nHIT ${part}\nPOWER ${impulse}`; }
}
