import test from 'node:test';
import assert from 'node:assert/strict';
import {mathematicsCards,groupNames} from '../mathematics.js';
const byId=Object.fromEntries(mathematicsCards.map(card=>[card.id,card]));
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
const spec={
'math-add':v=>v.b-v.a,
'math-subtract':v=>v.b+v.a,
'math-minuend':v=>v.a-v.b,
'math-factor':v=>v.b/v.a,
'math-quotient':v=>v.b*v.a,
'math-divisor':v=>v.a/v.b,
'math-linear-equation':v=>(v.c-v.b)/v.a,
'math-intersection-x':v=>(v.t2-v.t1)/(v.m1-v.m2),
'math-intersection-y':v=>v.m1*(v.t2-v.t1)/(v.m1-v.m2)+v.t1,
'math-system-x':v=>(v.c1*v.b2-v.c2*v.b1)/(v.a1*v.b2-v.a2*v.b1),
'math-system-y':v=>(v.a1*v.c2-v.a2*v.c1)/(v.a1*v.b2-v.a2*v.b1),
'math-power':v=>v.a**v.n,
'math-negative-power':v=>1/v.a**v.n,
'math-power-same-base':v=>v.a**(v.m+v.n),
'math-power-same-exponent':v=>(v.a*v.b)**v.n,
'math-power-tower':v=>v.a**(v.m*v.n),
'math-binomial-sum':v=>(v.a+v.b)**2,
'math-binomial-difference':v=>(v.a-v.b)**2,
'math-binomial-product':v=>v.a**2-v.b**2,
'math-percent-part':v=>v.G*v.p/100,
'math-percent-rate':v=>v.W/v.G*100,
'math-percent-whole':v=>v.W*100/v.p,
'math-discount':v=>v.G*(1-v.p/100),
'math-proportion':v=>v.c*v.b/v.a,
'math-scale':v=>v.d*v.n,
'math-rectangle-area':v=>v.a*v.b,
'math-rectangle-perimeter':v=>2*(v.a+v.b),
'math-square-area':v=>v.a**2,
'math-square-perimeter':v=>4*v.a,
'math-parallelogram-area':v=>v.g*v.h,
'math-triangle-area':v=>v.g*v.h/2,
'math-trapezium-area':v=>(v.a+v.c)/2*v.h,
'math-cuboid-volume':v=>v.a*v.b*v.c,
'math-cuboid-surface':v=>2*(v.a*v.b+v.b*v.c+v.c*v.a),
'math-circle-circumference':v=>2*Math.PI*v.r,
'math-circle-area':v=>Math.PI*v.r**2,
'math-arc':v=>v.alpha/360*2*Math.PI*v.r,
'math-sector':v=>v.alpha/360*Math.PI*v.r**2,
'math-prism-volume':v=>v.G*v.h,
'math-cylinder-volume':v=>Math.PI*v.r**2*v.h,
'math-cylinder-surface':v=>2*Math.PI*v.r**2+2*Math.PI*v.r*v.h,
'math-pyramid-volume':v=>v.G*v.h/3,
'math-cone-volume':v=>Math.PI*v.r**2*v.h/3,
'math-cone-surface':v=>Math.PI*v.r**2+Math.PI*v.r*v.s,
'math-sphere-volume':v=>4/3*Math.PI*v.r**3,
'math-sphere-surface':v=>4*Math.PI*v.r**2,
'math-linear':v=>v.m*v.x+v.t,
'math-direct':v=>v.a*v.x,
'math-inverse':v=>v.a/v.x,
'math-rational':v=>v.a/(v.x+v.b)+v.c,
'math-power-function':v=>v.a*v.x**v.n,
'math-exponential':v=>v.b*v.a**v.x,
'math-logarithm':v=>Math.log(v.u)/Math.log(v.b),
'math-log-power':v=>v.z*Math.log(v.u)/Math.log(v.b),
'math-exp-solve':v=>Math.log(v.c/v.b)/Math.log(v.a),
'math-sine-model':v=>v.a*Math.sin(v.b*(v.x+v.c))+v.d,
'math-degrees-to-radians':v=>v.deg*Math.PI/180,
'math-radians-to-degrees':v=>v.rad*180/Math.PI,
'math-sine':v=>Math.sin(v.theta),
'math-cosine':v=>Math.cos(v.theta),
'math-triangle-angle':v=>180-v.alpha-v.beta,
'math-polygon-angles':v=>(v.n-2)*180,
'math-null':v=>-v.t/v.m,
'math-laplace':v=>v.g/v.m,
'math-relative-frequency':v=>v.k/v.n,
'math-mean':v=>v.s/v.n,
'math-median':v=>[v.a,v.b,v.c].sort((p,q)=>p-q)[1],
'math-range':v=>Math.max(v.a,v.b,v.c)-Math.min(v.a,v.b,v.c),
'math-count':v=>v.a*v.b,
'math-path-product':v=>v.p1*v.p2,
'math-path-sum':v=>v.p1+v.p2,
'math-conditional':v=>v.joint/v.condition,
'math-independence':v=>v.pA*v.pB,
'math-binomial-coefficient':v=>120,
'math-binomial-probability':v=>120*0.2**3*0.8**7,
'math-binomial-mean':v=>v.n*v.p,
'math-binomial-sd':v=>Math.sqrt(v.n*v.p*(1-v.p)),
'math-difference-quotient':v=>(v.y2-v.y1)/(v.x2-v.x1),
'math-slope-angle':v=>Math.atan(v.m)*180/Math.PI,
'math-exp-value':v=>Math.exp(v.x),
'math-ln-derivative':v=>1/v.x,
'math-integral-ftc':v=>v.Fb-v.Fa,
'math-integral-exp':v=>Math.exp(v.q)-Math.exp(v.p),
'math-integral-reciprocal':v=>Math.log(v.q)-Math.log(v.p),
'math-integral-shift':v=>(Math.exp(v.a*v.q+v.b)-Math.exp(v.a*v.p+v.b))/v.a,
'math-dot':v=>v.a1*v.b1+v.a2*v.b2+v.a3*v.b3,
'math-magnitude':v=>Math.hypot(v.a1,v.a2,v.a3),
'math-vector-angle':v=>90,
'math-parallelogram-vectors':v=>1,
'math-triangle-vectors':v=>0.5,
'math-volume-vectors':v=>2,
'math-distance':v=>13,
'math-arithmetic-term':v=>v.a1+(v.n-1)*v.d,
'math-geometric-term':v=>v.a1*v.q**(v.n-1),
'math-geometric-series':v=>v.a/(1-v.q),
'math-modulus':v=>Math.hypot(v.a,v.b),
'math-argument':v=>45,
'math-product-real':v=>v.a*v.c-v.b*v.d,
'math-product-imag':v=>v.a*v.d+v.b*v.c,
'math-quadratic-discriminant':v=>v.b**2-4*v.a*v.c,
'math-quadratic-plus':v=>(-v.b+Math.sqrt(v.b**2-4*v.a*v.c))/(2*v.a),
'math-quadratic-minus':v=>(-v.b-Math.sqrt(v.b**2-4*v.a*v.c))/(2*v.a),
'math-pythagoras-hypotenuse':v=>Math.hypot(v.a,v.b),
'math-pythagoras-leg':v=>Math.sqrt(v.c**2-v.b**2),
'math-intercept-far-ray':v=>v.r*v.q/v.p,
'math-intercept-near-ray':v=>v.s*v.p/v.q,
'math-intercept-far-first':v=>v.p*v.s/v.r,
'math-intercept-far-parallel':v=>v.m*v.q/v.p,
'math-intercept-near-parallel':v=>v.n*v.p/v.q,
'math-intercept-between':v=>v.u*v.r/v.p,
'math-rt-sine':v=>v.opp/v.hyp,
'math-rt-cosine':v=>v.adj/v.hyp,
'math-rt-tangent':v=>v.opp/v.adj,
'math-rt-opposite':v=>v.hyp*Math.sin(v.theta*Math.PI/180),
'math-rt-adjacent':v=>v.hyp*Math.cos(v.theta*Math.PI/180),
'math-rt-hypotenuse-sin':v=>v.opp/Math.sin(v.theta*Math.PI/180),
'math-rt-hypotenuse-cos':v=>v.adj/Math.cos(v.theta*Math.PI/180),
'math-rt-opposite-tan':v=>v.adj*Math.tan(v.theta*Math.PI/180),
'math-rt-adjacent-tan':v=>v.opp/Math.tan(v.theta*Math.PI/180),
'math-rt-angle-sin':v=>Math.asin(v.opp/v.hyp)*180/Math.PI,
'math-rt-angle-cos':v=>Math.acos(v.adj/v.hyp)*180/Math.PI,
'math-rt-angle-tan':v=>Math.atan(v.opp/v.adj)*180/Math.PI
};
const recalc={
'math-binomial-coefficient':{n:6,k:2,expected:15},
'math-binomial-probability':{n:4,k:1,p:0.5,expected:4*0.5**4},
'math-vector-angle':{a1:1,a2:0,a3:0,b1:1,b2:0,b3:0,expected:0},
'math-parallelogram-vectors':{a1:2,a2:0,a3:0,b1:0,b2:3,b3:0,expected:6},
'math-triangle-vectors':{a1:2,a2:0,a3:0,b1:0,b2:3,b3:0,expected:3},
'math-volume-vectors':{a1:1,a2:0,a3:0,b1:0,b2:1,b3:0,c1:0,c2:0,c3:4,expected:4},
'math-distance':{x1:1,y1:1,z1:1,x2:1,y2:1,z2:6,expected:5},
'math-argument':{a:-1,b:0,expected:180},
'math-median':{a:9,b:1,c:4,expected:4},
'math-range':{a:9,b:1,c:4,expected:8},
'math-percent-part':{G:250,p:12.5,expected:31.25},
'math-discount':{G:80,p:12.5,expected:70},
'math-circle-area':{r:1,expected:Math.PI},
'math-sphere-volume':{r:3,expected:36*Math.PI},
'math-linear':{m:-4,x:0.5,t:6.25,expected:4.25},
'math-quadratic-discriminant':{a:1,b:0,c:1,expected:-4},
'math-quadratic-plus':{a:1,b:-5,c:6,expected:3},
'math-quadratic-minus':{a:1,b:-5,c:6,expected:2},
'math-pythagoras-hypotenuse':{a:5,b:12,expected:13},
'math-pythagoras-leg':{c:13,b:5,expected:12},
'math-intercept-between':{p:3,u:6,r:5,expected:10}
};
test('collection shape',()=>{
 assert.equal(mathematicsCards.length,122);
 assert.equal(Object.keys(groupNames).length,10);
 assert.deepEqual(Object.keys(spec).sort(),mathematicsCards.map(card=>card.id).sort());
 for(const card of mathematicsCards){
  assert.equal(card.id.startsWith('math-'),true);
  for(const lang of ['en','de','es','fr']){assert.ok(card.title[lang]);assert.ok(card.note[lang]);}
  assert.ok(groupNames[card.group][ 'en']);
 }
});
for(const card of mathematicsCards){
 test(card.id+' sample',()=>{
  const input=values(card);
  near(card.calculate(input),spec[card.id](input),card.id);
  assert.equal(domain(card,input),null);
 });
}
test('recalculation uses the new inputs',()=>{
 for(const [id,change] of Object.entries(recalc)){
  const card=byId[id];
  const input={...values(card),...change};
  delete input.expected;
  near(card.calculate(input),change.expected,id);
  assert.equal(domain(card,input),null);
 }
 const linear=byId['math-linear'];
 const doubled={...values(linear),x:values(linear).x+1};
 near(linear.calculate(doubled),spec['math-linear'](doubled),'linear step');
 assert.equal(linear.calculate(doubled)-linear.calculate(values(linear)),values(linear).m);
});
test('field boundaries reject impossible inputs',()=>{
 const check=(id,patch,code)=>{
  const input={...values(byId[id]),...patch};
  assert.equal(domain(byId[id],input),code,id);
 };
 check('math-factor',{a:0},'nonzero');
 check('math-divisor',{b:0},'nonzero');
 check('math-rectangle-area',{a:0},'positive');
 check('math-rectangle-area',{b:-1},'positive');
 check('math-discount',{p:110},'discountRange');
 check('math-discount',{p:-1},'nonnegative');
 check('math-intersection-x',{m2:2},'parallel');
 check('math-system-x',{a2:2,b2:1,c2:9},'singular');
 check('math-rational',{x:-2},'pole');
 check('math-inverse',{x:0},'nonzero');
 check('math-logarithm',{b:1},'logBase');
 check('math-logarithm',{u:0},'positive');
 check('math-exponential',{a:1},'expBase');
 check('math-exponential',{a:-2},'positive');
 check('math-exp-solve',{c:-18},'expSolve');
 check('math-power',{a:0,n:0},'powerZero');
 check('math-arc',{alpha:400},'sector');
 check('math-sector',{alpha:-10},'nonnegative');
 check('math-cone-surface',{s:2},'coneSlant');
 check('math-triangle-angle',{alpha:120,beta:70},'triangle');
 check('math-polygon-angles',{n:2},'polygon');
 check('math-polygon-angles',{n:2.5},'integer');
 check('math-geometric-series',{q:1},'series');
 check('math-geometric-series',{q:-1},'series');
 check('math-vector-angle',{a1:0,a2:0,a3:0},'vectorZero');
 check('math-argument',{a:0,b:0},'vectorZero');
 check('math-laplace',{g:7},'fraction');
 check('math-relative-frequency',{k:9},'fraction');
 check('math-conditional',{joint:0.8},'fraction');
 check('math-path-product',{p1:1.2},'unit');
 check('math-path-sum',{p1:0.7,p2:0.4},'sumProb');
 check('math-binomial-coefficient',{k:11},'binomialK');
 check('math-binomial-probability',{k:-1},'whole');
 check('math-difference-quotient',{x2:1},'pole');
 check('math-integral-reciprocal',{p:-1},'positive');
 check('math-scale',{n:0},'positive');
 check('math-count',{a:0},'integer');
 check('math-null',{m:0},'nonzero');
 check('math-quadratic-plus',{a:0},'nonzero');
 check('math-quadratic-plus',{a:1,b:0,c:1},'discriminant');
 check('math-quadratic-minus',{a:1,b:1,c:1},'discriminant');
 check('math-quadratic-discriminant',{a:1,b:0,c:1},null);
 check('math-pythagoras-leg',{c:4,b:5},'legLonger');
 check('math-pythagoras-leg',{c:4,b:4},'legLonger');
 check('math-pythagoras-hypotenuse',{a:0},'positive');
 check('math-intercept-far-ray',{q:3},'order');
 check('math-intercept-near-ray',{q:2},'order');
 check('math-intercept-far-first',{s:4},'order');
 check('math-intercept-far-parallel',{q:3},'order');
 check('math-intercept-near-parallel',{p:8},'order');
 check('math-rt-sine',{opp:5},'legLonger');
 check('math-rt-cosine',{adj:5},'legLonger');
 check('math-rt-opposite',{theta:0},'acute');
 check('math-rt-opposite',{theta:90},'acute');
 check('math-rt-adjacent',{theta:90},'acute');
 check('math-rt-hypotenuse-sin',{theta:-10},'acute');
 check('math-rt-hypotenuse-cos',{theta:90},'acute');
 check('math-rt-opposite-tan',{theta:0},'acute');
 check('math-rt-adjacent-tan',{theta:180},'acute');
 check('math-rt-angle-sin',{opp:5},'legLonger');
 check('math-rt-angle-cos',{adj:6},'legLonger');
 check('math-rt-tangent',{adj:0},'positive');
});
