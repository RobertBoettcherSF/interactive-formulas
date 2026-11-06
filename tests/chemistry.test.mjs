import test from 'node:test';
import assert from 'node:assert/strict';
import {chemistryCards} from '../chemistry.js';
const samples=[1,58.44,3.01107038e23,2.5,0.2,20,10,20,0.1,1.461,0.5,5,0.5,2,2090,-890.3,-40.37,-222.575,0.01,4,Math.sqrt(1.8e-10),3,11,2,12,2.882862537409523,11.122104316457849,4.76,0.08,10**-4.76,1.1,18,1.159159349685422,0.1,0.5,6.65];
const values=card=>Object.fromEntries(card.fields.map(f=>[f.key,f.value]));
for(const [index,card] of chemistryCards.entries()){
 test(card.id+' sample',()=>{
  const actual=card.calculate(values(card));
  const tolerance=Math.max(1e-9,Math.abs(samples[index])*1e-9);
  assert.ok(Number.isFinite(actual));assert.ok(Math.abs(actual-samples[index])<tolerance,`${actual} vs ${samples[index]}`);
  assert.ok(!card.validate?.(values(card)));
  for(const lang of ['en','de','es','fr']){assert.ok(card.title[lang]);assert.ok(card.note[lang]);}
 });
}
test('water-corrected zero solute gives neutral pH',()=>{
 for(const id of ['chem-strong-acid','chem-strong-base'])assert.equal(chemistryCards.find(c=>c.id===id).calculate({C:0}),7);
});
test('cross-quantity validation and weak-solution domain',()=>{
 const find=id=>chemistryCards.find(c=>c.id===id);
 assert.equal(find('chem-mass-fraction').validate({ms:101,mt:100}),'fraction');
 assert.equal(find('chem-dilution').validate({V1:25,V2:20}),'dilution');
 assert.equal(find('chem-rf').validate({spot:7,front:6}),'fraction');
 assert.equal(find('chem-weak-acid').validate({C:1e-10,pKa:4.76}),'weakRange');
 assert.equal(find('chem-weak-base').validate({C:1e-10,pKb:4.75}),'weakRange');
});
