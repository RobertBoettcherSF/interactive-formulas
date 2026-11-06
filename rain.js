import {t} from './i18n.js?v=12';
// Each item is a complete akshara. Never index or split its code points.
export const GLYPHS=['अ','आ','इ','ई','उ','ऊ','ऋ','ॐ','क','ख','ग','घ','च','छ','ज','झ','ट','ठ','ड','ढ','त','थ','द','ध','न','प','फ','ब','भ','म','य','र','ल','व','श','ष','स','ह','क्ष','त्र','ज्ञ','श्र','कृ','प्र','स्व','धि','श्री'];
export const RAIN={columnPitch:14,fontSize:13,glyphGap:14,minTrail:36,head:'#d9ffc3',body:'#83c79d',frameMs:60};
export const columnCount=width=>Math.max(0,Math.ceil(width/RAIN.columnPitch));
export const trailLength=height=>Math.max(RAIN.minTrail,Math.ceil(height/RAIN.glyphGap));
export const graphemeCount=text=>typeof Intl!=='undefined'&&Intl.Segmenter?[...new Intl.Segmenter('hi',{granularity:'grapheme'}).segment(text)].length:[...text].length;
export const shouldPause=reduced=>Boolean(reduced);
const randomGlyph=()=>GLYPHS[Math.floor(Math.random()*GLYPHS.length)];
export function createColumns(width,height){
 const count=columnCount(width),trail=trailLength(height);
 return Array.from({length:count},(_,i)=>({x:i*RAIN.columnPitch+RAIN.columnPitch/2,y:Math.random()*(height+trail*RAIN.glyphGap)-trail*RAIN.glyphGap,speed:0.7+Math.random()*1.6,glyphs:Array.from({length:trail},randomGlyph)}));
}
const canvas=typeof document!=='undefined'?document.getElementById('rain'):null;
if(canvas){
 const ctx=canvas.getContext('2d'),button=document.getElementById('rain-toggle');
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=shouldPause(media.matches),width,height,columns=[],last=0;
 function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);columns=createColumns(width,height);draw(false);}
 function draw(move){
  ctx.clearRect(0,0,width,height);ctx.font=`${RAIN.fontSize}px "Rain Devanagari", serif`;ctx.textAlign='center';
  for(const column of columns){
   if(move){column.y+=column.speed*3.2;if(column.y-column.glyphs.length*RAIN.glyphGap>height){column.y=-RAIN.glyphGap;column.glyphs=Array.from({length:trailLength(height)},randomGlyph);}}
   column.glyphs.forEach((glyph,i)=>{ctx.globalAlpha=Math.max(0.08,(1-i/(column.glyphs.length+1))*.85);ctx.fillStyle=i===0?RAIN.head:RAIN.body;ctx.fillText(glyph,column.x,column.y-i*RAIN.glyphGap);});
  }
  ctx.globalAlpha=1;
 }
 function frame(time){if(!paused&&!document.hidden&&time-last>=RAIN.frameMs){draw(true);last=time;}requestAnimationFrame(frame);}
 function updateButton(){if(!button)return;button.textContent=t(paused?'playRain':'pauseRain');button.setAttribute('aria-pressed',String(paused));}
 if(button)button.onclick=()=>{paused=!paused;updateButton();};
 media.addEventListener('change',e=>{paused=shouldPause(e.matches);updateButton();});
 window.addEventListener('resize',resize);window.addEventListener('languagechange',updateButton);
 resize();document.fonts.load(`${RAIN.fontSize}px "Rain Devanagari"`).then(()=>draw(false));updateButton();requestAnimationFrame(frame);
}
