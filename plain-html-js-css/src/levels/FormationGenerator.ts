import type { FormationType } from './LevelDefinition';
export class FormationGenerator {
  static generate(type: FormationType, count: number): [number, number, number][] {
    if (count === 1) return [[0,0,0]]; const positions: [number,number,number][]=[];
    if(type==='line'){const spacing=Math.min(1.45,5.8/(count-1));for(let i=0;i<count;i++)positions.push([(i-(count-1)/2)*spacing,0,0]);}
    else if(type==='grid'){const cols=Math.min(3,Math.ceil(Math.sqrt(count)));for(let i=0;i<count;i++){const row=Math.floor(i/cols),col=i%cols,rows=Math.ceil(count/cols);positions.push([(col-(cols-1)/2)*1.65,0,-row*1.35+(rows-1)*.5]);}}
    else if(type==='triangle'){let placed=0,row=0;while(placed<count){const inRow=Math.min(row+1,count-placed);for(let col=0;col<inRow;col++)positions.push([(col-(inRow-1)/2)*1.55,0,-row*1.25+.8]);placed+=inRow;row++;}}
    else if(type==='cluster'){const ring=[[-.8,0,.35],[.8,0,.35],[0,0,-.55],[-1.35,0,-.9],[1.35,0,-.9],[-.65,0,-1.65],[.65,0,-1.65],[0,0,.9]] as [number,number,number][];for(let i=0;i<count;i++)positions.push(ring[i%ring.length]);}
    else {for(let i=0;i<count;i++){const side=i<count/2?-1:1;const index=i%(Math.ceil(count/2));positions.push([side*(1.65+(index%2)*.75),0,-Math.floor(index/2)*1.25]);}}
    return positions;
  }
}
