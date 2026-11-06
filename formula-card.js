
const format = n => new Intl.NumberFormat('en', { maximumSignificantDigits: 10 }).format(n);
export const formulas = {
 linear: { title: 'A straight-line relationship', category: 'Sample 01 · Relationships', equation: 'y = mx + b', description: 'How do a rate of change and a starting value combine?', fields: [{key:'m',label:'Slope (m)',value:2},{key:'x',label:'Input (x)',value:3},{key:'b',label:'Intercept (b)',value:1}], calculate: ({m,x,b})=>m*x+b, result: 'y', working: v=>`y = (${format(v.m)} × ${format(v.x)}) + (${format(v.b)})`, insight: 'Keep m and b fixed, then increase x by 1. The result changes by m. The intercept b is the value of y when x is 0.' },
 percentage: { title: 'A percentage of a whole', category: 'Sample 02 · Proportions', equation: 'part = whole × p / 100', description: 'A percentage means “out of one hundred”. What share does it give?', fields: [{key:'whole',label:'Whole amount',value:80},{key:'p',label:'Percentage (p)',value:15}], calculate: ({whole,p})=>whole*p/100, result: 'Part', working: v=>`part = ${format(v.whole)} × ${format(v.p)} / 100`, insight: 'Keep the percentage fixed and double the whole: the part doubles too. A percentage of 100 gives the whole; 50 gives half. Values over 100 describe more than the whole.' }
};
class FormulaCard extends HTMLElement {
 connectedCallback() {
  if (this.dataset.ready) return;
  const config = formulas[this.getAttribute('kind')];
  if (!config) return;
  this.dataset.ready='true';
  this.innerHTML=`<article class="formula-card"><div class="tag">${config.category}</div><h3>${config.title}</h3><p class="description">${config.description}</p><div class="equation" aria-label="Formula">${config.equation}</div><div class="fields ${config.fields.length===2?'two':''}">${config.fields.map(f=>`<label>${f.label}<input type="number" step="any" data-key="${f.key}" value="${f.value}" required></label>`).join('')}</div><div class="result" role="status" aria-live="polite" aria-atomic="true"><div class="label">${config.result} · Live result</div><div class="answer"></div><div class="working"></div></div><p class="insight">${config.insight}</p><button class="reset" type="button">Reset sample values ↺</button></article>`;
  const inputs=[...this.querySelectorAll('input')];
  const update=()=>{
   const valid=inputs.every(i=>i.value.trim()!=='' && Number.isFinite(i.valueAsNumber) && i.validity.valid);
   inputs.forEach(i=>i.setAttribute('aria-invalid',String(i.value.trim()==='' || !Number.isFinite(i.valueAsNumber) || !i.validity.valid)));
   const answer=this.querySelector('.answer'), working=this.querySelector('.working');
   if(!valid){answer.textContent='Enter a number in every field';working.textContent='Use finite numeric values to see the calculation.';return;}
   const values=Object.fromEntries(inputs.map(i=>[i.dataset.key,i.valueAsNumber]));
   const result=config.calculate(values);
   if(!Number.isFinite(result)){answer.textContent='Result is outside the supported range';working.textContent='Try smaller values.';return;}
   answer.textContent=format(result); working.textContent=`${config.working(values)} = ${format(result)}`;
  };
  inputs.forEach(input=>input.addEventListener('input',update));
  this.querySelector('.reset').addEventListener('click',()=>{inputs.forEach((input,i)=>input.value=config.fields[i].value);update();});
  update();
 }
}
customElements.define('formula-card',FormulaCard);
