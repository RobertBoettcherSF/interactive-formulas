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
const links=v=>[[1,2,v.e12],[1,3,v.e13],[2,4,v.e24],[3,4,v.e34]];
const nextTo=(v,node)=>links(v).flatMap(([a,b,on])=>on===1?(a===node?[b]:b===node?[a]:[]):[]).sort((x,y)=>x-y);
const bfs=v=>{const seen=new Set([1]),queue=[1],order=[];while(queue.length){const u=queue.shift();order.push(u);for(const n of nextTo(v,u)) if(!seen.has(n)){seen.add(n);queue.push(n);}}return order;};
const dfs=v=>{const seen=new Set(),order=[];const walk=u=>{seen.add(u);order.push(u);for(const n of nextTo(v,u)) if(!seen.has(n)) walk(n);};walk(1);return order;};
const shortest=v=>{const dist=[Infinity,0,Infinity,Infinity,Infinity],used=[false,false,false,false,false];for(let step=0;step<4;step++){let u=0,best=Infinity;for(let node=1;node<=4;node++) if(!used[node]&&dist[node]<best){best=dist[node];u=node;}if(!u)break;used[u]=true;for(const [a,b,w] of [[1,2,v.w12],[1,3,v.w13],[2,4,v.w24],[3,4,v.w34]]){if(!(w>0))continue;const other=a===u?b:b===u?a:0;if(other&&dist[u]+w<dist[other])dist[other]=dist[u]+w;}}return dist[4];};
const huffman=freqs=>{const depth=freqs.map(()=>0);let items=freqs.map((f,i)=>({f,order:i,leaves:[i]})),stamp=freqs.length;while(items.length>1){items.sort((a,b)=>a.f-b.f||a.order-b.order);const x=items.shift(),y=items.shift();for(const leaf of x.leaves) depth[leaf]++;for(const leaf of y.leaves) depth[leaf]++;items.push({f:x.f+y.f,order:stamp++,leaves:x.leaves.concat(y.leaves)});}return freqs.reduce((sum,f,i)=>sum+f*depth[i],0);};
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
'cs-check-digit':v=>(10-((v.d1+3*v.d2+v.d3+3*v.d4)%10))%10,
'cs-check-code':v=>(v.d1+3*v.d2+v.d3+3*v.d4+v.c)%10,
'cs-hamming':v=>{let d=0;for(let i=0;i<v.la;i++) if(Math.floor(v.a/2**i)%2!==Math.floor(v.b/2**i)%2) d++;return d;},
'cs-modpow':v=>{let a=v.a%v.n,r=1,b=v.b;while(b>0){if(b%2===1)r=r*a%v.n;b=Math.floor(b/2);if(b>0)a=a*a%v.n;}return r;},
'cs-bfs-count':v=>bfs(v).length,
'cs-bfs-order':v=>bfs(v)[v.k-1],
'cs-dfs-count':v=>dfs(v).length,
'cs-dfs-order':v=>dfs(v)[v.k-1],
'cs-dijkstra':v=>shortest(v),
'cs-relax':v=>Math.min(v.dv,v.du+v.w),
'cs-huffman':v=>huffman([v.f1,v.f2,v.f3,v.f4]),
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
 assert.equal(computerScienceCards.length,53);
 assert.equal(Object.keys(groupNames).length,7);
 assert.deepEqual(Object.keys(spec).sort(),computerScienceCards.map(card=>card.id).sort());
 const tally={};
 for(const card of computerScienceCards) tally[card.group]=(tally[card.group]||0)+1;
 assert.deepEqual(tally,{encoding:17,ciphers:4,codes:4,graphs:10,recursion:2,trees:9,complexity:7});
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
  'cs-wrap':{n:8,a:200,b:100,expected:44},
  'cs-check-digit':{d1:1,d2:2,d3:3,d4:4,expected:8},
  'cs-modpow':{a:2,b:10,n:17,expected:4},
  'cs-hamming':{a:15,la:4,b:0,lb:4,expected:4},
  'cs-bfs-count':{e12:0,e13:0,e24:1,e34:1,expected:1},
  'cs-dfs-order':{e12:0,e13:1,e24:1,e34:1,k:4,expected:2},
  'cs-dijkstra':{w12:1,w13:4,w24:10,w34:1,expected:5},
  'cs-relax':{du:3,w:4,dv:6,expected:6},
  'cs-huffman':{f1:1,f2:1,f3:1,f4:1,expected:8}
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
 expectError('cs-check-digit',{d1:10},'digit');
 expectError('cs-hamming',{la:3},'length');
 expectError('cs-hamming',{a:16},'fit');
 expectError('cs-modpow',{n:1},'modulus');
 expectError('cs-modpow',{a:0,b:0},'power');
 expectError('cs-bfs-count',{e12:2},'bit');
 expectError('cs-bfs-order',{k:5},'step');
 expectError('cs-dijkstra',{w12:0,w13:0,w24:0,w34:0},'reach');
 expectError('cs-huffman',{f1:0},'integer');
});
