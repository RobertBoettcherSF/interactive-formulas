import test from 'node:test';
import assert from 'node:assert/strict';
import {computerScienceCards,groupNames} from '../computer-science.js';
const byId=Object.fromEntries(computerScienceCards.map(card=>[card.id,card]));
const values=card=>Object.fromEntries(card.fields.map(field=>[field.key,field.value]));
const ruleBroken=(rule,value)=>rule==='positive'&&value<=0||rule==='nonnegative'&&value<0||rule==='integer'&&(!Number.isInteger(value)||value<1)||rule==='whole'&&(!Number.isInteger(value)||value<0)||rule==='unit'&&(value<0||value>1)||rule==='nonzero'&&value===0;
const domain=(card,input)=>{
 for(const field of card.fields) if(ruleBroken(field.rule,input[field.key])) return field.rule;
 return card.validate?.(input)??null;
};
const near=(actual,expected,id)=>{
 const tolerance=Math.max(1e-9,Math.abs(expected)*1e-9);
 assert.ok(Number.isFinite(actual),id);
 assert.ok(Math.abs(actual-expected)<tolerance,`${id}: ${actual} vs ${expected}`);
};
const floorLog2=u=>{let n=0,x=u;while(x>1){x=Math.floor(x/2);n++;}return n;};
const ceilLog2=u=>{if(u<=1)return 0;let p=1,k=0;while(p<u){p*=2;k++;}return k;};
const mod=n=>{const r=n%26;return r<0?r+26:r;};
const gcd=(a,b)=>{while(b){const t=a%b;a=b;b=t;}return a;};
const spec={
'cs-bit-weight':v=>2**v.p,
'cs-byte':v=>128*v.b7+64*v.b6+32*v.b5+16*v.b4+8*v.b3+4*v.b2+2*v.b1+v.b0,
'cs-hex':v=>v.d3*4096+v.d2*256+v.d1*16+v.d0,
'cs-patterns':v=>2**v.n,
'cs-unsigned-max':v=>2**v.n-1,
'cs-byte-bits':v=>8*v.B,
'cs-hex-bits':v=>4*v.h,
'cs-bit-length':v=>floorLog2(v.u)+1,
'cs-hex-length':v=>Math.ceil((floorLog2(v.u)+1)/4),
'cs-twos-min':v=>-(2**(v.n-1)),
'cs-twos-max':v=>2**(v.n-1)-1,
'cs-twos':v=>v.u<2**(v.n-1)?v.u:v.u-2**v.n,
'cs-wrap':v=>{const m=2**v.n;return (v.a+v.b)%m;},
'cs-half-sum':v=>(v.a+v.b)%2,
'cs-half-carry':v=>v.a*v.b,
'cs-full-sum':v=>(v.a+v.b+v.cin)%2,
'cs-full-carry':v=>Math.floor((v.a+v.b+v.cin)/2),
'cs-caesar':v=>mod(v.p+v.k),
'cs-caesar-back':v=>mod(v.c-v.k),
'cs-vigenere':v=>mod(v.p+v.k),
'cs-shift-keys':v=>v.a,
'cs-matrix':v=>v.n*v.n,
'cs-directed':v=>v.n*(v.n-1),
'cs-undirected':v=>v.n*(v.n-1)/2,
'cs-degree':v=>v.e1+v.e2+v.e3+v.e4,
'cs-gcd':v=>gcd(v.a,v.b),
'cs-hanoi':v=>2**v.n-1,
'cs-level':v=>2**v.l,
'cs-perfect-nodes':v=>2**(v.h+1)-1,
'cs-perfect-leaves':v=>2**v.h,
'cs-complete-height':v=>floorLog2(v.n),
'cs-degenerate-height':v=>v.n-1,
'cs-tree-edges':v=>v.n-1,
'cs-search-line':v=>v.n,
'cs-search-balanced':v=>floorLog2(v.n)+1,
'cs-linear':v=>v.c*v.n,
'cs-quadratic':v=>v.c*v.n*v.n,
'cs-logarithmic':v=>v.c*Math.log2(v.n),
'cs-exponential':v=>v.c*v.b**v.n,
'cs-bubblesort':v=>v.n*(v.n-1)/2,
'cs-mergesort':v=>v.n*ceilLog2(v.n),
'cs-brute':v=>v.a**v.l
};
test('computer science collection shape',()=>{
 assert.equal(computerScienceCards.length,42);
 assert.equal(Object.keys(groupNames).length,6);
 assert.deepEqual(Object.keys(spec).sort(),computerScienceCards.map(card=>card.id).sort());
 const tally={};
 for(const card of computerScienceCards) tally[card.group]=(tally[card.group]||0)+1;
 assert.deepEqual(tally,{encoding:17,ciphers:4,graphs:4,recursion:2,trees:8,complexity:7});
 for(const card of computerScienceCards){
  assert.equal(card.id.startsWith('cs-'),true);
  for(const lang of ['en','de','es','fr']){assert.ok(card.title[lang]);assert.ok(card.note[lang]);}
  for(const field of card.fields) assert.ok(field.label);
 }
});
for(const card of computerScienceCards){
 test(card.id+' sample',()=>{
  const input=values(card);
  near(card.calculate(input),spec[card.id](input),card.id);
  assert.equal(domain(card,input),null);
 });
}
test('computer science recalculation',()=>{
 const cases={
  'cs-caesar':{p:25,k:3,expected:2},
  'cs-caesar-back':{c:0,k:1,expected:25},
  'cs-byte':{b7:1,b6:1,b5:1,b4:1,b3:1,b2:1,b1:1,b0:1,expected:255},
  'cs-gcd':{a:17,b:17,expected:17},
  'cs-hanoi':{n:1,expected:1},
  'cs-linear':{c:4,n:7,expected:28},
  'cs-mergesort':{n:5,expected:15},
  'cs-twos':{n:8,u:200,expected:-56},
  'cs-undirected':{n:5,expected:10},
  'cs-search-balanced':{n:6,expected:3},
  'cs-brute':{a:10,l:4,expected:10000},
  'cs-wrap':{n:8,a:200,b:100,expected:44}
 };
 for(const [id,item] of Object.entries(cases)){
  const {expected,...input}=item;
  near(byId[id].calculate(input),expected,id);
  assert.equal(domain(byId[id],input),null,id);
 }
});
test('computer science field boundaries',()=>{
 const expectError=(id,patch,error)=>{
  const input={...values(byId[id]),...patch};
  assert.equal(domain(byId[id],input),error,id);
 };
 expectError('cs-byte',{b7:2},'bit');
 expectError('cs-hex',{d0:16},'hex');
 expectError('cs-caesar',{p:26},'letter');
 expectError('cs-caesar',{k:1.5},'shift');
 expectError('cs-patterns',{n:54},'width');
 expectError('cs-twos',{n:8,u:256},'range');
 expectError('cs-wrap',{n:4,a:16},'range');
 expectError('cs-exponential',{b:1},'base');
 expectError('cs-brute',{a:100,l:40},'exact');
 expectError('cs-matrix',{n:1000001},'scale');
 expectError('cs-half-sum',{a:2},'bit');
 expectError('cs-bit-weight',{p:54},'exact');
 expectError('cs-hanoi',{n:54},'exact');
 expectError('cs-vigenere',{k:26},'letter');
 expectError('cs-degree',{e2:3},'bit');
 expectError('cs-gcd',{a:2**53},'exact');
 expectError('cs-bubblesort',{n:1000001},'scale');
 expectError('cs-logarithmic',{n:0},'integer');
});
