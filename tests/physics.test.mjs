import test from 'node:test';
import assert from 'node:assert/strict';
import {physicsCards,groupNames,constants} from '../physics.js';
const {e,h,c,mu0,eps0,k,sigma,wien,G,R}=constants;
const byId=Object.fromEntries(physicsCards.map(card=>[card.id,card]));
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
const gamma=v=>1/Math.sqrt(1-v*v/(c*c));
const spec={
'phys-speed':v=>v.s/v.t,
'phys-acceleration':v=>v.dv/v.t,
'phys-uniform':v=>v.v*v.t,
'phys-accel-speed':v=>v.v0+v.a*v.t,
'phys-accel-distance':v=>v.v0*v.t+0.5*v.a*v.t**2,
'phys-accel-link':v=>Math.sqrt(v.v0**2+2*v.a*v.s),
'phys-throw-horizontal':v=>v.v*v.t,
'phys-throw-vertical':v=>0.5*v.g*v.t**2,
'phys-newton':v=>v.m*v.a,
'phys-impulse':v=>v.m*v.dv/v.t,
'phys-weight':v=>v.m*v.g,
'phys-centripetal':v=>v.m*v.v**2/v.r,
'phys-gravity':v=>G*v.m1*v.m2/v.r**2,
'phys-kepler-period':v=>v.T1*(v.a2/v.a1)**1.5,
'phys-kepler-axis':v=>v.a1*Math.cbrt((v.T2/v.T1)**2),
'phys-hooke':v=>v.D*v.x,
'phys-hydrostatic':v=>v.rho*v.g*v.h,
'phys-buoyancy':v=>v.rho*v.V*v.g,
'phys-kinetic':v=>0.5*v.m*v.v**2,
'phys-height':v=>v.m*v.g*v.h,
'phys-work':v=>v.F*v.s,
'phys-power':v=>v.W/v.t,
'phys-drop-speed':v=>Math.sqrt(2*v.g*v.h),
'phys-momentum':v=>v.m*v.v,
'phys-collision':v=>(v.m1*v.u1+v.m2*v.u2)/(v.m1+v.m2),
'phys-pendulum':v=>v.T1*Math.sqrt(v.l2/v.l1),
'phys-ohm':v=>v.U/v.I,
'phys-ohm-current':v=>v.U/v.R,
'phys-current-charge':v=>v.Q/v.t,
'phys-elementary':v=>v.N*e,
'phys-electric-power':v=>v.U*v.I,
'phys-electric-energy':v=>v.U*v.I*v.t,
'phys-efficiency':v=>v.useful/v.supplied,
'phys-series':v=>v.R1+v.R2+v.R3,
'phys-parallel':v=>1/(1/v.R1+1/v.R2),
'phys-reflection':v=>v.theta,
'phys-snell-angle2':v=>Math.asin(v.n1*Math.sin(v.theta1*Math.PI/180)/v.n2)*180/Math.PI,
'phys-snell-angle1':v=>Math.asin(v.n2*Math.sin(v.theta2*Math.PI/180)/v.n1)*180/Math.PI,
'phys-snell-n2':v=>v.n1*Math.sin(v.theta1*Math.PI/180)/Math.sin(v.theta2*Math.PI/180),
'phys-snell-n1':v=>v.n2*Math.sin(v.theta2*Math.PI/180)/Math.sin(v.theta1*Math.PI/180),
'phys-lens-image':v=>v.u*v.f/(v.u-v.f),
'phys-lens-object':v=>v.v*v.f/(v.v-v.f),
'phys-lens-focal':v=>v.u*v.v/(v.u+v.v),
'phys-fringe':v=>v.lambda*v.L/v.d,
'phys-path':v=>v.n*v.lambda,
'phys-bragg':v=>2*v.d*Math.sin(v.theta*Math.PI/180)/v.n,
'phys-heat':v=>v.c*v.m*v.dT,
'phys-gas-pressure':v=>v.n*R*v.T/v.V,
'phys-gas-volume':v=>v.n*R*v.T/v.P,
'phys-gas-amount':v=>v.P*v.V/(R*v.T),
'phys-gas-temperature':v=>v.P*v.V/(v.n*R),
'phys-conduction':v=>v.lambda*v.A*v.dT/v.d,
'phys-wien':v=>wien/v.T,
'phys-stefan':v=>sigma*v.A*v.T**4,
'phys-flux':v=>v.B*v.A,
'phys-induction':v=>v.N*Math.abs(v.dPhi)/v.t,
'phys-lorentz-charge':v=>v.q*v.v*v.B,
'phys-lorentz-wire':v=>v.I*v.L*v.B,
'phys-cyclotron':v=>v.m*v.v/(v.q*v.B),
'phys-inductor':v=>v.L*Math.abs(v.dI)/v.t,
'phys-coil-energy':v=>0.5*v.L*v.I**2,
'phys-coil-field':v=>mu0*v.N*v.I/v.L,
'phys-transformer-voltage':v=>v.U1*v.N2/v.N1,
'phys-transformer-current':v=>v.I1*v.N1/v.N2,
'phys-wave':v=>v.f*v.lambda,
'phys-thomson':v=>2*Math.PI*Math.sqrt(v.L*v.C),
'phys-rc':v=>v.R*v.C,
'phys-spring-period':v=>2*Math.PI*Math.sqrt(v.m/v.D),
'phys-field':v=>v.F/v.q,
'phys-plate-field':v=>v.U/v.d,
'phys-coulomb':v=>k*v.q1*v.q2/v.r**2,
'phys-radial-field':v=>k*v.q/v.r**2,
'phys-capacitor-charge':v=>v.C*v.U,
'phys-capacitor-energy':v=>0.5*v.C*v.U**2,
'phys-capacitance':v=>eps0*v.er*v.A/v.d,
'phys-flux-density':v=>v.F/(v.I*v.L),
'phys-photon':v=>h*v.f,
'phys-well':v=>v.n*v.n*h*h/(8*v.m*v.L*v.L),
'phys-photon-momentum':v=>h/v.lambda,
'phys-debroglie':v=>h/v.p,
'phys-mass-energy':v=>v.dm*c*c,
'phys-binding':v=>v.E/v.A,
'phys-decay':v=>v.N0*0.5**(v.t/v.T),
'phys-activity':v=>Math.LN2*v.N/v.T,
'phys-dose':v=>v.E/v.m,
'phys-equivalent':v=>v.w*v.D,
'phys-gamma':v=>gamma(v.v),
'phys-dilation':v=>v.tau*gamma(v.v),
'phys-contraction':v=>v.L0/gamma(v.v),
'phys-rel-energy':v=>v.m*c*c*gamma(v.v),
'phys-energy-momentum':v=>Math.hypot(v.p*c,v.m*c*c)
};
test('physics collection shape',()=>{
 assert.equal(physicsCards.length,91);
 assert.equal(Object.keys(groupNames).length,10);
 assert.deepEqual(Object.keys(spec).sort(),physicsCards.map(card=>card.id).sort());
 for(const card of physicsCards){
  assert.equal(card.id.startsWith('phys-'),true);
  for(const lang of ['en','de','es','fr']){assert.ok(card.title[lang]);assert.ok(card.note[lang]);}
 }
});
for(const card of physicsCards){
 test(card.id+' sample',()=>{
  const input=values(card);
  near(card.calculate(input),spec[card.id](input),card.id);
  assert.equal(domain(card,input),null);
 });
}
test('physics recalculation',()=>{
 const cases={
  'phys-speed':{s:100,t:8,expected:12.5},
  'phys-newton':{m:4,a:-2,expected:-8},
  'phys-ohm':{U:9,I:1.5,expected:6},
  'phys-decay':{N0:1000,t:5,T:5,expected:500},
  'phys-heat':{c:4000,m:0.25,dT:-2,expected:-2000},
  'phys-wave':{f:2,lambda:6.25,expected:12.5},
  'phys-snell-angle2':{n1:1,theta1:0,n2:1.5,expected:0},
  'phys-lens-image':{u:0.2,f:0.1,expected:0.2},
  'phys-gas-pressure':{n:2,T:250,V:0.01,expected:2*R*250/0.01},
  'phys-kepler-period':{T1:1,a1:1,a2:9,expected:27},
  'phys-kepler-axis':{a1:1,T1:1,T2:27,expected:9},
  'phys-well':{n:2,m:9.1093837e-31,L:1e-9,expected:4*h*h/(8*9.1093837e-31*1e-18)}
 };
 for(const [id,change] of Object.entries(cases)){
  const input={...values(byId[id]),...change};
  delete input.expected;
  near(byId[id].calculate(input),change.expected,id);
  assert.equal(domain(byId[id],input),null);
 }
});
test('physics field boundaries',()=>{
 const check=(id,patch,code)=>{
  const input={...values(byId[id]),...patch};
  assert.equal(domain(byId[id],input),code,id);
 };
 check('phys-speed',{t:0},'positive');
 check('phys-accel-link',{v0:0,a:-2,s:10},'realSpeed');
 check('phys-newton',{m:0},'positive');
 check('phys-efficiency',{useful:60},'fraction');
 check('phys-ohm',{I:0},'nonzero');
 check('phys-parallel',{R1:-1},'positive');
 check('phys-reflection',{theta:120},'mirror');
 check('phys-bragg',{theta:90},'bragg');
 check('phys-gamma',{v:c},'light');
 check('phys-dilation',{v:c*1.1},'light');
 check('phys-drop-speed',{h:-1},'nonnegative');
 check('phys-series',{R2:-3},'nonnegative');
 check('phys-decay',{T:0},'positive');
 check('phys-photon',{f:-1},'positive');
 check('phys-coil-field',{L:0},'positive');
 check('phys-snell-angle2',{n1:2,theta1:45,n2:1},'snell');
 check('phys-snell-angle1',{theta2:90},'optic');
 check('phys-snell-n2',{theta2:0},'positive');
 check('phys-lens-image',{u:0.1,f:0.1},'lens');
 check('phys-lens-focal',{u:1,v:-1},'lens');
 check('phys-gas-volume',{V:0.025,T:-5},'positive');
 check('phys-gas-pressure',{V:0},'positive');
 check('phys-kepler-axis',{a1:0},'positive');
 check('phys-well',{n:0},'integer');
});
