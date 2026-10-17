export const islands = [
  {name:'Sunny Meadows', icon:'🌱', color:'#79b64b', subtitle:'Make friends with two-digit addition', digits:2, op:'+', skills:['No carrying','Try carrying','Addition explorer']},
  {name:'Pebble Bay', icon:'🐚', color:'#40a8bc', subtitle:'Find the difference, one pebble at a time', digits:2, op:'−', skills:['No borrowing','Try borrowing','Subtraction explorer']},
  {name:'Starlight Woods', icon:'🍄', color:'#8d79c6', subtitle:'A bigger adventure with three-digit addition', digits:3, op:'+', skills:['No carrying','Try carrying','Addition adventurer']},
  {name:'Cloud Castle', icon:'🏰', color:'#db9e38', subtitle:'Reach the sky with three-digit subtraction', digits:3, op:'−', skills:['No borrowing','Try borrowing','Math champion']},
];
export const lessons = islands.flatMap((island,i)=>island.skills.map((name,j)=>({...island,name,id:i*3+j,island:i,stage:j})));
const int=(min,max,rng)=>Math.floor(rng()*(max-min+1))+min;
export function question(lesson,rng=Math.random){
  const min=lesson.digits===2?10:100,max=lesson.digits===2?99:999;
  let a,b;
  do {a=int(min,max,rng);b=int(min,max,rng);if(lesson.op==='−'&&b>a)[a,b]=[b,a];}
  while(lesson.stage<2 && [...String(a)].some((d,i)=>lesson.op==='+'?Number(d)+Number(String(b)[i])>9:Number(d)<Number(String(b)[i])) !== (lesson.stage===1));
  return {a,b,op:lesson.op,answer:lesson.op==='+'?a+b:a-b};
}
export const fresh=()=>({version:1,completed:0,xp:0,stars:Array(12).fill(0),snapshots:[]});
export function validState(s){return s?.version===1&&Number.isInteger(s.completed)&&s.completed>=0&&s.completed<=12&&Number.isInteger(s.xp)&&s.xp>=0&&Array.isArray(s.stars)&&s.stars.length===12&&s.stars.every(x=>Number.isInteger(x)&&x>=0&&x<=3);}
export function complete(s,id,mistakes){const next=structuredClone(s);const stars=mistakes===0?3:mistakes<=2?2:1;next.xp+=60;next.stars[id]=Math.max(next.stars[id],stars);next.completed=Math.max(next.completed,id+1);return next;}
export function restoreCheckpoint(id){const s=fresh();s.completed=id;s.xp=id*60;s.stars=s.stars.map((_,i)=>i<id?3:0);return s;}
