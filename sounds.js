import {t} from './i18n.js?v=11';
const KEY='if.sound';
export const SOUND_EVENTS=['input','result','language','reset'];
const tones={input:[740,0.028],result:[988,0.045],language:[523,0.055],reset:[392,0.04]};
const listeners=new Set();
let muted=false;
try{muted=localStorage.getItem(KEY)==='off';}catch{}
let context=null;
export const isMuted=()=>muted;
export function onSound(fn){listeners.add(fn);return ()=>listeners.delete(fn);}
export function setMuted(value){
 muted=Boolean(value);
 try{localStorage.setItem(KEY,muted?'off':'on');}catch{}
 if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('soundchange'));
}
export function toggleMuted(){setMuted(!muted);return muted;}
function emit(name){for(const fn of listeners)fn(name);}
export function play(name){
 if(!SOUND_EVENTS.includes(name)||muted)return false;
 emit(name);
 const AC=globalThis.AudioContext||globalThis.webkitAudioContext;
 if(!AC)return true;
 try{
  if(!context)context=new AC();
  if(context.state==='suspended')context.resume().catch(()=>{});
  const [freq,dur]=tones[name],start=context.currentTime;
  const osc=context.createOscillator(),gain=context.createGain();
  osc.type='sine';osc.frequency.value=freq;
  gain.gain.setValueAtTime(0.0001,start);
  gain.gain.exponentialRampToValueAtTime(0.035,start+0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001,start+dur);
  osc.connect(gain);gain.connect(context.destination);
  osc.start(start);osc.stop(start+dur+0.02);
 }catch{}
 return true;
}
function updateButton(){
 const button=typeof document!=='undefined'?document.getElementById('sound-toggle'):null;
 if(!button)return;
 button.textContent=t(muted?'soundOn':'soundOff');
 button.setAttribute('aria-pressed',String(muted));
}
if(typeof document!=='undefined'&&document.getElementById('sound-toggle')){
 const button=document.getElementById('sound-toggle');
 button.onclick=()=>{toggleMuted();updateButton();};
 window.addEventListener('languagechange',updateButton);
 updateButton();
}
