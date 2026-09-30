import type { LevelDefinition } from './LevelDefinition';
const crate = (x:number,z:number)=>({type:'crate' as const,position:[x,.48,z] as [number,number,number],destructible:true});
const barrel = (x:number,z:number)=>({type:'barrel' as const,position:[x,.55,z] as [number,number,number],destructible:true});
export const LEVELS: LevelDefinition[] = [
  {id:1,title:'FIRST BONK',objective:'Knock out the pig',surpriseWall:false,animals:['pig'],formation:'line',environment:[crate(-2.1,-.2),barrel(2.15,-.35)]},
  {id:2,title:'SURPRISE!',objective:'Break the wall, then bonk the pig',surpriseWall:true,animals:['pig'],formation:'line',environment:[crate(-2.25,-.45),barrel(2.25,-.45)]},
  {id:3,title:'PIGGY PAIR',objective:'Knock out both pigs',surpriseWall:false,animals:['pig','pig'],formation:'line',environment:[crate(0,-1.8)]},
  {id:4,title:'NEW FRIENDS',objective:'Clear the triangle',surpriseWall:false,animals:['pig','chicken','frog'],formation:'triangle',environment:[barrel(-2.6,-1),barrel(2.6,-1)]},
  {id:5,title:'BOXED IN',objective:'Use the crates for a chain reaction',surpriseWall:false,animals:['frog','pig','chicken','pig'],formation:'split',environment:[crate(-.65,.1),crate(.65,.1),crate(0,-1.2)]},
  {id:6,title:'BARREL PARTY',objective:'Knock everyone into the barrels',surpriseWall:false,animals:['chicken','pig','frog','chicken'],formation:'cluster',environment:[barrel(-2,-.5),barrel(2,-.5),barrel(0,-2)]},
  {id:7,title:'HEAVY HITTERS',objective:'Clear the tough grid',surpriseWall:false,animals:['pig','frog','pig','frog'],formation:'grid',environment:[crate(-2.8,-1),crate(2.8,-1)]},
  {id:8,title:'DOMINO BONK',objective:'Start a five-animal chain',surpriseWall:false,animals:['chicken','pig','frog','pig','chicken'],formation:'line',environment:[barrel(0,-2)]},
  {id:9,title:'TOTAL CHAOS',objective:'Clear the mixed arena',surpriseWall:false,animals:['pig','chicken','frog','pig','chicken','frog'],formation:'grid',environment:[crate(-2.7,.2),barrel(2.7,.2),crate(0,-2.8)]},
  {id:10,title:'BONUS BONK!',objective:'Eight targets. Maximum nonsense.',surpriseWall:false,animals:['pig','chicken','frog','pig','chicken','frog','pig','chicken'],formation:'cluster',powerMultiplier:1.45,environment:[crate(-2.6,-.2),crate(2.6,-.2),barrel(-2.3,-2),barrel(2.3,-2)]}
];
