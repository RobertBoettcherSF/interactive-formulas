import {t} from './i18n.js?v=10';
// Each item is a complete akshara. Never index or split its code points.
export const GLYPHS=['अ','आ','इ','ई','उ','ऊ','ऋ','ॐ','क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ','श्र','कृ','प्र','स्व','धि','श्री'];
const canvas=document.getElementById('rain'),ctx=canvas.getContext('2d'),button=document.getElementById('rain-toggle');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let paused=media.matches,width,height,columns=[],last=0;
const randomGlyph=()=>GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);columns=Array.from({length:Math.ceil(width/44)},(_,i)=>({x:i*44+10,y:Math.random()*(height+420)-420,speed:1+Math.random()*1.5,glyphs:Array.from({length:10},randomGlyph)}));draw(false);}
function draw(move){
 ctx.clearRect(0,0,width,height);ctx.font='22px "Rain Devanagari", serif';
 for(const column of columns){if(move){column.y+=column.speed*4;if(column.y-350>height){column.y=-35;column.glyphs=Array.from({length:10},randomGlyph);}}
  column.glyphs.forEach((glyph,i)=>{ctx.globalAlpha=(1-i/11)*.8;ctx.fillStyle=i===0?'#d9ffc3':'#83c79d';ctx.fillText(glyph,column.x,column.y-i*35);});}
 ctx.globalAlpha=1;
}
function frame(time){if(!paused&&!document.hidden&&time-last>=75){draw(true);last=time;}requestAnimationFrame(frame);}
function updateButton(){button.textContent=t(paused?'playRain':'pauseRain');button.setAttribute('aria-pressed',String(paused));}
button.onclick=()=>{paused=!paused;updateButton();};media.addEventListener('change',e=>{paused=e.matches;updateButton();});
window.addEventListener('resize',resize);window.addEventListener('languagechange',updateButton);
resize();document.fonts.load('22px "Rain Devanagari"').then(()=>draw(false));updateButton();requestAnimationFrame(frame);
