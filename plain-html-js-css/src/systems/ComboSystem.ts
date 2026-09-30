export interface ComboFeedback { text:string; count:number; points:number; total:number; }
export class ComboSystem {
  readonly comboWindowMs=1800; private chainCounter=0; private chain=0; private count=0; private expires=0; private unique=new Set<string>(); best=0;
  constructor(private addScore:(base:number,multiplier:number)=>number,private feedback:(data:ComboFeedback)=>void){}
  start(key:string,base:number):number{this.chain=++this.chainCounter;this.count=0;this.unique.clear();this.register(this.chain,key,base);return this.chain;}
  register(chain:number,key:string,base:number):number{const now=performance.now();if(chain!==this.chain||now>this.expires||this.unique.has(key))return 0;this.unique.add(key);this.count++;this.best=Math.max(this.best,this.count);this.expires=now+this.comboWindowMs;const points=this.addScore(base,1+(this.count-1)*.35);this.feedback({text:this.label(),count:this.count,points,total:0});return points;}
  update():void{if(this.count&&performance.now()>this.expires){this.count=0;this.unique.clear();this.feedback({text:'',count:0,points:0,total:0});}}
  reset():void{this.chain=0;this.count=0;this.expires=0;this.unique.clear();this.best=0;}
  private label():string{return this.count===1?'BONK!':this.count===2?'DOUBLE BONK!':this.count===3?'TRIPLE BONK!':this.count>=5?`x${this.count} MEGA BONK!`:`x${this.count} COMBO!`;}
}
