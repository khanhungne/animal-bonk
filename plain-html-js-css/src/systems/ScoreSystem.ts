export class ScoreSystem { total = 0; reset():void{this.total=0;} add(base:number,multiplier=1):number{const points=Math.round(base*Math.max(1,multiplier));this.total+=points;return points;} }
