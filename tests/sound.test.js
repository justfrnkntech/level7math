import test from 'node:test';
import assert from 'node:assert/strict';
import {createSound,cues} from '../src/sound.js';
function setup(initial='on') {
  let saved=initial, started=0, stopped=0;
  const param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
  const context={state:'running',currentTime:0,destination:{},createOscillator(){return {frequency:param,connect(){},disconnect(){},start(){started++;},stop(){stopped++;}};},createGain(){return {gain:param,connect(){},disconnect(){}};}};
  const sound=createSound({storage:{getItem:()=>saved,setItem:(_,v)=>saved=v},makeContext:()=>context});
  return {sound,get saved(){return saved;},get started(){return started;},get stopped(){return stopped;}};
}
test('muted preference persists and prevents audio, including pending playback',async()=>{const s=setup('off');await s.sound.play('correct');assert.equal(s.started,0);s.sound.toggle();const pending=s.sound.play('milestone');s.sound.toggle();await pending;assert.equal(s.started,0);assert.equal(s.saved,'off');});
test('each cue schedules its notes; muting stops active sounds',async()=>{for(const name of Object.keys(cues)){const s=setup();await s.sound.play(name);assert.equal(s.started,cues[name].length);const before=s.stopped;s.sound.toggle();assert.equal(s.stopped-before,cues[name].length);}});
test('unavailable audio does not interrupt gameplay',async()=>{const s=createSound({makeContext(){throw Error('unavailable');}});await assert.doesNotReject(()=>s.play('lesson'));});
