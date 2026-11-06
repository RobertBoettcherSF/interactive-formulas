import {t,formatNumber as format,getLanguage} from './i18n.js?v=4';
import {chemistryCards,chemText,groupText,labelText} from './chemistry.js?v=4';
import {mathematicsCards,mathText,groupText as mathGroupText,labelText as mathLabelText} from './mathematics.js?v=4';
export const formulas={
 linear:{fields:[{key:'m',value:2},{key:'x',value:3},{key:'b',value:1}],calculate:({m,x,b})=>m*x+b,equation:()=> 'y = mx + b',working:v=>`y = (${format(v.m)} × ${format(v.x)}) + (${format(v.b)})`},
 percentage:{fields:[{key:'whole',value:80},{key:'p',value:15}],calculate:({whole,p})=>whole*p/100,equation:()=>`${t('part')} = ${t('whole')} × p / 100`,working:v=>`${t('part')} = ${format(v.whole)} × ${format(v.p)} / 100`}
};
export const allCards={...formulas,...Object.fromEntries(chemistryCards.map(c=>[c.id,c])),...Object.fromEntries(mathematicsCards.map(c=>[c.id,c]))};
const subjectOf=kind=>kind.startsWith('chem-')?'chem':kind.startsWith('math-')?'math':null;
const uiText=(subject,key)=>subject==='chem'?chemText(key):mathText(key);
const gText=(subject,key)=>subject==='chem'?groupText(key):mathGroupText(key);
const lText=(subject,key)=>subject==='chem'?labelText(key):mathLabelText(key);
const ruleBroken=(rule,value)=>rule==='positive'&&value<=0||rule==='nonnegative'&&value<0||rule==='integer'&&(!Number.isInteger(value)||value<1)||rule==='whole'&&(!Number.isInteger(value)||value<0)||rule==='unit'&&(value<0||value>1)||rule==='nonzero'&&value===0;
class FormulaCard extends HTMLElement{
 connectedCallback(){this.render();this.onLanguage=()=>this.render(true);window.addEventListener('languagechange',this.onLanguage);}
 disconnectedCallback(){window.removeEventListener('languagechange',this.onLanguage);}
 render(preserve=false){
  const kind=this.getAttribute('kind'),config=allCards[kind];if(!config)return;
  const subject=subjectOf(kind),rich=Boolean(subject),lang=getLanguage();
  const old=preserve?[...this.querySelectorAll('input')].map(i=>i.value):null;
  const copy=rich?{title:config.title[lang],category:gText(subject,config.group),description:'',insight:config.note[lang],result:config.result}:t('cards.'+kind);
  const equation=rich?config.formula:config.equation();
  const labels=config.fields.map((f,i)=>rich?`${f.symbol} · ${lText(subject,f.label)}${f.unit?' ('+f.unit+')':''}`:copy.labels[i]);
  const constants=config.constantText?config.constantText[lang]:(config.constants||'');
  const definitions=rich?`<details class="symbol-key"><summary>${uiText(subject,'symbols')}</summary><dl>${config.fields.map(f=>`<dt>${f.symbol}${f.unit?' ('+f.unit+')':''}</dt><dd>${lText(subject,f.label)}</dd>`).join('')}<dt>${config.result}${config.unit?' ('+config.unit+')':''}</dt><dd>${copy.title}</dd></dl>${constants?`<p class="constants">${constants}</p>`:''}</details>`:'';
  const bounds=f=>`${f.rule==='integer'||f.rule==='whole'?'step="1"':'step="any"'} ${f.rule==='integer'?'min="1"':f.rule==='whole'||f.rule==='positive'||f.rule==='nonnegative'||f.rule==='unit'?'min="0"':''} ${f.rule==='unit'?'max="1"':''}`;
  this.innerHTML=`<article class="formula-card"><div class="tag">${copy.category}</div><h3>${copy.title}</h3>${copy.description?`<p class="description">${copy.description}</p>`:''}<div class="equation" aria-label="${t('formula')}">${equation}</div>${definitions}<div class="fields ${config.fields.length===2?'two':''}">${config.fields.map((f,i)=>`<label>${labels[i]}<input type="number" ${bounds(f)} data-key="${f.key}" value="${f.value}" required></label>`).join('')}</div><div class="result" role="status" aria-live="polite" aria-atomic="true"><div class="label">${copy.result} · ${t('liveResult')}</div><div class="answer"></div><div class="working"></div></div>${rich?`<div class="condition-label">${uiText(subject,'conditions')}</div>`:''}<p class="insight">${copy.insight}</p><button class="reset" type="button">${t('reset')}</button></article>`;
  const inputs=[...this.querySelectorAll('input')];if(old)inputs.forEach((input,i)=>input.value=old[i]);
  const update=()=>{
   const answer=this.querySelector('.answer'),working=this.querySelector('.working'),panel=this.querySelector('.result');
   const invalidInput=inputs.find(i=>i.value.trim()===''||!Number.isFinite(i.valueAsNumber)||i.validity.badInput);
   inputs.forEach(i=>i.setAttribute('aria-invalid',String(i.value.trim()===''||!Number.isFinite(i.valueAsNumber)||i.validity.badInput)));
   panel.classList.remove('invalid');
   const fail=(heading,detail)=>{answer.textContent=heading;working.textContent=detail;panel.classList.add('invalid');};
   if(invalidInput){fail(t('missing'),t('missingHelp'));return;}
   const values=Object.fromEntries(inputs.map(i=>[i.dataset.key,i.valueAsNumber]));
   for(const [index,f] of config.fields.entries()){
    const value=values[f.key];
    if(ruleBroken(f.rule,value)){
     inputs[index].setAttribute('aria-invalid','true');fail(rich?uiText(subject,'invalid'):t('missing'),rich?`${f.symbol} · ${lText(subject,f.label)}: ${uiText(subject,f.rule)}`:t('missingHelp'));return;
    }
   }
   const error=config.validate?.(values);if(error){fail(uiText(subject,'invalid'),uiText(subject,error));return;}
   const result=config.calculate(values);
   if(!Number.isFinite(result)){fail(t('overflow'),t('overflowHelp'));return;}
   answer.textContent=`${format(result)}${config.unit?' '+config.unit:''}`;
   const steps=rich?config.substitution.replace(/\{(\w+)\}/g,(_,key)=>`(${format(values[key])})`):config.working(values);
   working.textContent=`${steps} = ${format(result)}${config.unit?' '+config.unit:''}`;
  };
  inputs.forEach(input=>input.addEventListener('input',update));this.querySelector('.reset').onclick=()=>{inputs.forEach((input,i)=>input.value=config.fields[i].value);update();};update();
 }
}
customElements.define('formula-card',FormulaCard);
