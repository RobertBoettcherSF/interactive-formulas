import {t,setLanguage,translatePage} from './i18n.js?v=3';
import {chemistryCards,chemText,groupText,groupNames} from './chemistry.js?v=3';
import './formula-card.js?v=3';
import './rain.js?v=3';
const topics=['chemistry','mathematics','physics','computer-science'];
const validTopic=value=>topics.includes(value);
const queryTopic=()=>new URL(location.href).searchParams.get('topic');
let topic=validTopic(queryTopic())?queryTopic():(document.body.dataset.initialTopic||'physics');
const content=document.getElementById('topic-content');
function chemistryMarkup(){
 const groups=Object.keys(groupNames);
 return `<div class="section-head"><h2 data-chem-ui="collection">${chemText('collection')}</h2></div><p class="context" data-chem-ui="safety">${chemText('safety')}</p><nav class="chem-jumps" aria-label="${t('topics.chemistry')}">${groups.map(group=>`<a href="#chem-group-${group}" data-group-link="${group}" data-chem-group="${group}">${groupText(group)}</a>`).join('')}</nav><div class="group-controls"><button class="reset" type="button" data-expand data-chem-ui="expand">${chemText('expand')}</button><button class="reset" type="button" data-collapse data-chem-ui="collapse">${chemText('collapse')}</button></div>${groups.map((group,index)=>{const cards=chemistryCards.filter(c=>c.group===group);return `<details class="chemistry-group" id="chem-group-${group}" ${index===0?'open':''}><summary><h3 data-chem-group="${group}">${groupText(group)}</h3><span data-chem-count="${cards.length}">${cards.length} ${chemText('cards')}</span></summary><div class="examples">${cards.map(c=>`<formula-card kind="${c.id}"></formula-card>`).join('')}</div></details>`;}).join('')}`;
}
function titleAndIntro(){document.getElementById('topic-title').textContent=t('topics.'+topic);document.getElementById('topic-intro').textContent=topic==='chemistry'?chemText('intro'):t('intros.'+topic);document.title='Syllabus-Repo · '+t('topics.'+topic);}
function renderTopic(){
 titleAndIntro();
 document.querySelectorAll('[data-topic]').forEach(tile=>{const selected=tile.dataset.topic===topic;tile.setAttribute('aria-current',selected?'page':'false');tile.classList.toggle('selected',selected);});
 const samples=topic==='physics';
 content.innerHTML=topic==='chemistry'?chemistryMarkup():samples?`<div class="section-head"><h2>${t('starter')}</h2><span class="status-badge">${t('preparation')}</span></div><p class="context">${t('sampleContext')}</p><p class="sample-note">${t('starterNote')}</p><div class="examples"><formula-card kind="linear"></formula-card><formula-card kind="percentage"></formula-card></div>`:`<section class="status-panel"><span class="status-badge">${t('preparation')}</span><h2>${t('placeholderTitle')}</h2><p>${t('placeholder')}</p><p>${t('placeholderDetail')}</p><a class="back" href="gallery.html?topic=physics" data-try-samples>${t('trySamples')}</a></section>`;
 content.querySelector('[data-try-samples]')?.addEventListener('click',event=>{event.preventDefault();selectTopic('physics');});
 content.querySelector('[data-expand]')?.addEventListener('click',()=>content.querySelectorAll('.chemistry-group').forEach(group=>group.open=true));
 content.querySelector('[data-collapse]')?.addEventListener('click',()=>content.querySelectorAll('.chemistry-group').forEach(group=>group.open=false));
 content.querySelectorAll('[data-group-link]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();const group=document.getElementById('chem-group-'+link.dataset.groupLink);group.open=true;const url=new URL(location.href);url.hash=group.id;history.replaceState({},'',url);group.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}));
}
function selectTopic(value){if(!validTopic(value))return;topic=value;const url=new URL(location.href);url.searchParams.set('topic',topic);url.hash='';history.pushState({},'',url);renderTopic();}
document.querySelectorAll('[data-topic]').forEach(tile=>tile.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();selectTopic(tile.dataset.topic);}));
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
window.addEventListener('languagechange',()=>{
 titleAndIntro();
 if(topic==='chemistry'){
  content.querySelectorAll('[data-chem-ui]').forEach(el=>el.textContent=chemText(el.dataset.chemUi));
  content.querySelectorAll('[data-chem-group]').forEach(el=>el.textContent=groupText(el.dataset.chemGroup));
  content.querySelectorAll('[data-chem-count]').forEach(el=>el.textContent=el.dataset.chemCount+' '+chemText('cards'));
  content.querySelector('.chem-jumps').setAttribute('aria-label',t('topics.chemistry'));
 }else if(content.querySelector('formula-card')){
  content.querySelector('h2').textContent=t('starter');content.querySelector('.status-badge').textContent=t('preparation');content.querySelector('.context').textContent=t('sampleContext');content.querySelector('.sample-note').textContent=t('starterNote');
 }else renderTopic();
});
window.addEventListener('popstate',()=>{topic=validTopic(queryTopic())?queryTopic():(document.body.dataset.initialTopic||'physics');renderTopic();});
translatePage();renderTopic();
