import {t,setLanguage,translatePage} from './i18n.js?v=4';
import {chemistryCards,chemText,groupText,groupNames} from './chemistry.js?v=4';
import {mathematicsCards,mathText,groupText as mathGroupText,groupNames as mathGroupNames} from './mathematics.js?v=4';
import './formula-card.js?v=4';
import './rain.js?v=4';
const topics=['chemistry','mathematics','physics','computer-science'];
const validTopic=value=>topics.includes(value);
const queryTopic=()=>new URL(location.href).searchParams.get('topic');
let topic=validTopic(queryTopic())?queryTopic():(document.body.dataset.initialTopic||'physics');
const content=document.getElementById('topic-content');
const collections={
 chemistry:{cards:chemistryCards,names:groupNames,text:chemText,group:groupText,prefix:'chem'},
 mathematics:{cards:mathematicsCards,names:mathGroupNames,text:mathText,group:mathGroupText,prefix:'math'}
};
function collectionMarkup(name){
 const spec=collections[name],groups=Object.keys(spec.names);
 return `<div class="section-head"><h2 data-col-ui="collection">${spec.text('collection')}</h2></div><p class="context" data-col-ui="safety">${spec.text('safety')}</p><nav class="chem-jumps" aria-label="${t('topics.'+name)}">${groups.map(group=>`<a href="#${spec.prefix}-group-${group}" data-group-link="${group}" data-col-group="${group}">${spec.group(group)}</a>`).join('')}</nav><div class="group-controls"><button class="reset" type="button" data-expand data-col-ui="expand">${spec.text('expand')}</button><button class="reset" type="button" data-collapse data-col-ui="collapse">${spec.text('collapse')}</button></div>${groups.map((group,index)=>{const cards=spec.cards.filter(c=>c.group===group);return `<details class="chemistry-group" id="${spec.prefix}-group-${group}" ${index===0?'open':''}><summary><h3 data-col-group="${group}">${spec.group(group)}</h3><span data-col-count="${cards.length}">${cards.length} ${spec.text('cards')}</span></summary><div class="examples">${cards.map(c=>`<formula-card kind="${c.id}"></formula-card>`).join('')}</div></details>`;}).join('')}`;
}
function titleAndIntro(){
 document.getElementById('topic-title').textContent=t('topics.'+topic);
 document.getElementById('topic-intro').textContent=collections[topic]?collections[topic].text('intro'):t('intros.'+topic);
 document.title='Syllabus-Repo · '+t('topics.'+topic);
}
function bindCollection(){
 content.querySelector('[data-expand]')?.addEventListener('click',()=>content.querySelectorAll('.chemistry-group').forEach(group=>group.open=true));
 content.querySelector('[data-collapse]')?.addEventListener('click',()=>content.querySelectorAll('.chemistry-group').forEach(group=>group.open=false));
 content.querySelectorAll('[data-group-link]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  const group=document.getElementById(collections[topic].prefix+'-group-'+link.dataset.groupLink);
  group.open=true;
  const url=new URL(location.href);url.hash=group.id;history.replaceState({},'',url);
  group.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 }));
}
function renderTopic(){
 titleAndIntro();
 document.querySelectorAll('[data-topic]').forEach(tile=>{const selected=tile.dataset.topic===topic;tile.setAttribute('aria-current',selected?'page':'false');tile.classList.toggle('selected',selected);});
 content.innerHTML=collections[topic]?collectionMarkup(topic):topic==='physics'?`<div class="section-head"><h2>${t('starter')}</h2><span class="status-badge">${t('preparation')}</span></div><p class="context">${t('sampleContext')}</p><p class="sample-note">${t('starterNote')}</p><div class="examples"><formula-card kind="linear"></formula-card><formula-card kind="percentage"></formula-card></div>`:`<section class="status-panel"><span class="status-badge">${t('preparation')}</span><h2>${t('placeholderTitle')}</h2><p>${t('placeholder')}</p><p>${t('placeholderDetail')}</p><a class="back" href="gallery.html?topic=physics" data-try-samples>${t('trySamples')}</a></section>`;
 content.querySelector('[data-try-samples]')?.addEventListener('click',event=>{event.preventDefault();selectTopic('physics');});
 if(collections[topic])bindCollection();
 if(collections[topic]&&location.hash){const group=document.getElementById(location.hash.slice(1));if(group?.open===false)group.open=true;}
}
function selectTopic(value){if(!validTopic(value))return;topic=value;const url=new URL(location.href);url.searchParams.set('topic',topic);url.hash='';history.pushState({},'',url);renderTopic();}
document.querySelectorAll('[data-topic]').forEach(tile=>tile.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();selectTopic(tile.dataset.topic);}));
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
window.addEventListener('languagechange',()=>{
 titleAndIntro();
 const spec=collections[topic];
 if(spec){
  content.querySelectorAll('[data-col-ui]').forEach(el=>el.textContent=spec.text(el.dataset.colUi));
  content.querySelectorAll('[data-col-group]').forEach(el=>el.textContent=spec.group(el.dataset.colGroup));
  content.querySelectorAll('[data-col-count]').forEach(el=>el.textContent=el.dataset.colCount+' '+spec.text('cards'));
  content.querySelector('.chem-jumps').setAttribute('aria-label',t('topics.'+topic));
 }else if(content.querySelector('formula-card')){
  content.querySelector('h2').textContent=t('starter');content.querySelector('.status-badge').textContent=t('preparation');content.querySelector('.context').textContent=t('sampleContext');content.querySelector('.sample-note').textContent=t('starterNote');
 }else renderTopic();
});
window.addEventListener('popstate',()=>{topic=validTopic(queryTopic())?queryTopic():(document.body.dataset.initialTopic||'physics');renderTopic();});
translatePage();renderTopic();
