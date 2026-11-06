import {t,getLanguage,setLanguage,translatePage} from './i18n.js';
import './formula-card.js';
import './rain.js';
const topics=['chemistry','mathematics','physics','computer-science'];
const validTopic=value=>topics.includes(value);
const queryTopic=()=>new URL(location.href).searchParams.get('topic');
let topic=validTopic(queryTopic())?queryTopic():(document.body.dataset.initialTopic||'physics');
const content=document.getElementById('topic-content');
function renderTopic(){
 document.getElementById('topic-title').textContent=t('topics.'+topic);
 document.getElementById('topic-intro').textContent=t('intros.'+topic);
 document.title=t('topics.'+topic)+' · '+t('brand');
 document.querySelectorAll('[data-topic]').forEach(tile=>{const selected=tile.dataset.topic===topic;tile.setAttribute('aria-current',selected?'page':'false');tile.classList.toggle('selected',selected);});
 const samples=topic==='physics'||topic==='mathematics';
 content.innerHTML=samples?`<div class="section-head"><h2>${t('starter')}</h2><span class="status-badge">${t('preparation')}</span></div><p class="context">${t(topic==='physics'?'sampleContext':'mathContext')}</p><p class="sample-note">${t('starterNote')}</p><div class="examples"><formula-card kind="linear"></formula-card><formula-card kind="percentage"></formula-card></div>`:`<section class="status-panel"><span class="status-badge">${t('preparation')}</span><h2>${t('placeholderTitle')}</h2><p>${t('placeholder')}</p><p>${t('placeholderDetail')}</p><a class="back" href="gallery.html?topic=physics" data-try-samples>${t('trySamples')}</a></section>`;
 content.querySelector('[data-try-samples]')?.addEventListener('click',event=>{event.preventDefault();selectTopic('physics');});
}
function selectTopic(value){if(!validTopic(value))return;topic=value;const url=new URL(location.href);url.searchParams.set('topic',topic);history.pushState({},'',url);renderTopic();}
document.querySelectorAll('[data-topic]').forEach(tile=>tile.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();selectTopic(tile.dataset.topic);}));
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
window.addEventListener('languagechange',()=>{
 document.getElementById('topic-title').textContent=t('topics.'+topic);document.getElementById('topic-intro').textContent=t('intros.'+topic);document.title=t('topics.'+topic)+' · '+t('brand');
 // Keep entered sample values when translating an open topic.
 if(content.querySelector('formula-card')){
  content.querySelector('h2').textContent=t('starter');content.querySelector('.status-badge').textContent=t('preparation');content.querySelector('.context').textContent=t(topic==='physics'?'sampleContext':'mathContext');content.querySelector('.sample-note').textContent=t('starterNote');
 }else renderTopic();
});
window.addEventListener('popstate',()=>{topic=validTopic(queryTopic())?queryTopic():(document.body.dataset.initialTopic||'physics');renderTopic();});
translatePage();renderTopic();
