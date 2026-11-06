import {t,formatNumber as format} from './i18n.js';
export const formulas={
 linear:{fields:[{key:'m',value:2},{key:'x',value:3},{key:'b',value:1}],calculate:({m,x,b})=>m*x+b,equation:()=> 'y = mx + b',working:v=>`y = (${format(v.m)} × ${format(v.x)}) + (${format(v.b)})`},
 percentage:{fields:[{key:'whole',value:80},{key:'p',value:15}],calculate:({whole,p})=>whole*p/100,equation:()=>`${t('part')} = ${t('whole')} × p / 100`,working:v=>`${t('part')} = ${format(v.whole)} × ${format(v.p)} / 100`}
};
class FormulaCard extends HTMLElement{
 connectedCallback(){this.render();this.onLanguage=()=>this.render(true);window.addEventListener('languagechange',this.onLanguage);}
 disconnectedCallback(){window.removeEventListener('languagechange',this.onLanguage);}
 render(preserve=false){
  const kind=this.getAttribute('kind'),config=formulas[kind];if(!config)return;
  const old=preserve?[...this.querySelectorAll('input')].map(i=>i.value):null;
  const copy=t('cards.'+kind);
  this.innerHTML=`<article class="formula-card"><div class="tag">${copy.category}</div><h3>${copy.title}</h3><p class="description">${copy.description}</p><div class="equation" aria-label="${t('formula')}">${config.equation()}</div><div class="fields ${config.fields.length===2?'two':''}">${config.fields.map((f,i)=>`<label>${copy.labels[i]}<input type="number" step="any" data-key="${f.key}" value="${f.value}" required></label>`).join('')}</div><div class="result" role="status" aria-live="polite" aria-atomic="true"><div class="label">${copy.result} · ${t('liveResult')}</div><div class="answer"></div><div class="working"></div></div><p class="insight">${copy.insight}</p><button class="reset" type="button">${t('reset')}</button></article>`;
  const inputs=[...this.querySelectorAll('input')];if(old)inputs.forEach((input,i)=>input.value=old[i]);
  const update=()=>{
   inputs.forEach(i=>i.setAttribute('aria-invalid',String(i.value.trim()===''||!Number.isFinite(i.valueAsNumber)||!i.validity.valid)));
   const answer=this.querySelector('.answer'),working=this.querySelector('.working');
   if(inputs.some(i=>i.getAttribute('aria-invalid')==='true')){answer.textContent=t('missing');working.textContent=t('missingHelp');return;}
   const values=Object.fromEntries(inputs.map(i=>[i.dataset.key,i.valueAsNumber]));const result=config.calculate(values);
   if(!Number.isFinite(result)){answer.textContent=t('overflow');working.textContent=t('overflowHelp');return;}
   answer.textContent=format(result);working.textContent=`${config.working(values)} = ${format(result)}`;
  };
  inputs.forEach(input=>input.addEventListener('input',update));this.querySelector('.reset').onclick=()=>{inputs.forEach((input,i)=>input.value=config.fields[i].value);update();};update();
 }
}
customElements.define('formula-card',FormulaCard);
