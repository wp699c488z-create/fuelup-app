import { estimateForLabel, sumMeals, DEFAULT_GOALS } from './nutrition.js';
import { identifyMeal } from './ai.js';

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'fuelup-local-data-v1';
const preview = new URLSearchParams(location.search).has('preview');
const DAY_NAMES = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const number = (n) => Math.round(Number(n)||0).toLocaleString('de-DE');
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localDate = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays = (date, days) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + days); return localDate(d); };
const dateLabel = (date) => new Intl.DateTimeFormat('de-DE', {day:'numeric',month:'long',year:'numeric'}).format(new Date(`${date}T12:00:00`));
const freshState = () => ({ settings: { ...DEFAULT_GOALS }, meals: [], weights: [] });
let state = load();
let currentTab = 'dashboard';
let activeAnalysis = false;
let toastTimer;

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!data || !Array.isArray(data.meals) || !Array.isArray(data.weights)) return freshState();
    return { settings: { ...DEFAULT_GOALS, ...(data.settings || {}) }, meals: data.meals, weights: data.weights };
  } catch { return freshState(); }
}
function persist() {
  if (preview) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { showToast('Speichern fehlgeschlagen – Speicher prüfen.'); throw new Error('Daten konnten nicht lokal gespeichert werden.'); }
}
function showToast(message) {
  $('toast').textContent = message;
  $('toast').classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.add('hidden'), 3800);
}
function setText(id, value) { $(id).textContent = value; }
function percent(value, goal) { return goal > 0 ? clamp(value / goal * 100,0,100) : 0; }

function render() {
  const today = localDate();
  const mealsToday = state.meals.filter(m => m.date === today);
  const totals = sumMeals(mealsToday);
  const goals = state.settings;
  setText('dateLabel', new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long'}).format(new Date()).toUpperCase());
  setText('kcalConsumed', number(totals.kcal));
  setText('kcalGoal', number(goals.kcal));
  const remaining = Math.max(0,goals.kcal - totals.kcal);
  $('kcalRemaining').innerHTML = `${number(remaining)} <small>kcal</small>`;
  const kcalPercent = percent(totals.kcal,goals.kcal);
  $('calorieCircle').style.background = `conic-gradient(var(--lime) 0 ${kcalPercent * 3.6}deg,#344259 ${kcalPercent * 3.6}deg 360deg)`;
  $('dayProgressBar').style.width = `${kcalPercent}%`;
  setText('goalText', `${number(goals.kcal > 0 ? totals.kcal / goals.kcal * 100 : 0)} % deines Tagesziels`);
  for (const macro of [{key:'protein',label:'protein'},{key:'carbs',label:'carbs'},{key:'fat',label:'fat'}]) {
    setText(`${macro.label}Used`, number(totals[macro.key]));
    setText(`${macro.label}Goal`, number(goals[macro.key]));
    $(`${macro.label}Bar`).style.width = `${percent(totals[macro.key],goals[macro.key])}%`;
  }
  renderMeals('todayMeals',mealsToday,'Hier erscheinen deine Mahlzeiten – einfach auf „Foto machen“ tippen.');
  renderHistory(); renderWeek(); renderWeights();
}
function renderMeals(id, meals, emptyText) {
  const target = $(id);
  if (!meals.length) {
    target.innerHTML = `<div class="empty-state"><div class="empty-emoji">🍽️</div><strong>Noch keine Mahlzeiten</strong><p>${escapeHtml(emptyText)}</p></div>`;
    return;
  }
  target.innerHTML = [...meals].sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map(m => `
    <article class="meal-item"><div class="meal-emoji">${escapeHtml(m.emoji || '🍽️')}</div><div class="meal-detail"><div class="meal-name">${escapeHtml(m.name)}</div><div class="meal-sub">${escapeHtml(m.time || '')} · KI-Schätzung</div></div>
      <div class="meal-right"><div class="meal-kcal">${number(m.kcal)} kcal</div><div class="meal-protein">${number(m.protein)} g Eiweiß</div></div>
      <button class="meal-delete" data-delete-meal="${escapeHtml(m.id)}" aria-label="Mahlzeit entfernen">×</button></article>`).join('');
}
function renderHistory() {
  const list = $('historyMeals');
  if (!state.meals.length) {
    list.innerHTML = '<div class="empty-state"><div class="empty-emoji">📖</div><strong>Dein Tagebuch ist noch leer</strong><p>Dein erstes Essensfoto macht den Anfang.</p></div>';
    return;
  }
  const grouped = Object.groupBy ? Object.groupBy(state.meals, m => m.date) : state.meals.reduce((acc, m) => ((acc[m.date] ||= []).push(m), acc),{});
  list.replaceChildren();
  for (const date of Object.keys(grouped).sort().reverse()) {
    const group = document.createElement('section');group.className='history-day';
    const sum = sumMeals(grouped[date]);
    group.innerHTML = `<h3>${escapeHtml(dateLabel(date))} · ${number(sum.kcal)} kcal / ${number(sum.protein)} g Eiweiß</h3><div class="meal-list"></div>`;
    const inner = group.querySelector('.meal-list'); inner.id = `history-${date}`;
    list.appendChild(group); renderMeals(inner.id, grouped[date], '');
  }
}
function renderWeek() {
  const today = localDate(); const dates = Array.from({length:7}, (_,i) => addDays(today,i-6));
  const days = dates.map(date => ({date, totals:sumMeals(state.meals.filter(m => m.date === date)), count:state.meals.filter(m => m.date === date).length}));
  const max = Math.max(state.settings.kcal, ...days.map(d => d.totals.kcal), 100);
  $('weekBars').innerHTML = days.map(d => {
    const weekday = DAY_NAMES[new Date(`${d.date}T12:00:00`).getDay()];
    return `<div class="week-col ${d.count ? '' : 'missing'}"><span class="week-value">${d.count?number(d.totals.kcal):'–'}</span><div class="week-pillar-wrap"><div class="week-pillar" style="height:${d.count ? Math.max(2,d.totals.kcal/max*100) : 2}%" title="${escapeHtml(d.date)}: ${number(d.totals.kcal)} kcal"></div></div><span class="week-label">${weekday}</span></div>`;
  }).join('');
  // Für den dokumentierten Durchschnitt nur Tage mit mindestens einem Eintrag verwenden.
  const trackedDays = days.filter(d => d.count > 0);
  setText('weekAvgKcal',trackedDays.length ? number(trackedDays.reduce((s,d) => s+d.totals.kcal,0)/trackedDays.length) : '–');
  setText('weekAvgProtein',trackedDays.length ? number(trackedDays.reduce((s,d) => s+d.totals.protein,0)/trackedDays.length) : '–');
}
function renderWeights() {
  const weights = [...state.weights].sort((a,b)=> (b.date+b.createdAt).localeCompare(a.date+a.createdAt));
  setText('latestWeight', weights.length ? Number(weights[0].kg).toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1}) : '–');
  $('weightHistory').innerHTML = weights.length ? weights.map(w => `<article class="meal-item"><div class="meal-emoji">⚖️</div><div class="meal-detail"><div class="meal-name">${escapeHtml(dateLabel(w.date))}</div><div class="meal-sub">Gewichtseintrag</div></div><div class="meal-right"><div class="meal-kcal">${Number(w.kg).toLocaleString('de-DE',{minimumFractionDigits:1,maximumFractionDigits:1})} kg</div></div><button class="meal-delete" data-delete-weight="${escapeHtml(w.id)}" aria-label="Gewichtseintrag entfernen">×</button></article>`).join('') : '<div class="empty-state"><div class="empty-emoji">⚖️</div><strong>Noch kein Gewicht erfasst</strong><p>Trage dein Gewicht regelmäßig ein, um den Verlauf zu sehen.</p></div>';
}
function switchTab(name) {
  if (!['dashboard','week','history','weight'].includes(name)) return;
  currentTab=name;
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('hidden', v.id !== `${name}View`));
  document.querySelectorAll('.nav-button').forEach(b => b.classList.toggle('active',b.dataset.tab===name));
  document.querySelector('#main').focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'smooth'});
}
function showModal(id) {$(id).classList.remove('hidden');document.body.style.overflow='hidden';}
function hideModal(id) {$(id).classList.add('hidden');document.body.style.overflow='';}
function takePhoto() {if (activeAnalysis) return; $('photoInput').click();}
async function prepareImage(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('Bitte ein Foto auswählen.');
  if (file.size > 30*1024*1024) throw new Error('Das Foto ist zu groß (max. 30 MB).');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve,reject) => {
      const image = new Image();
      image.onload=()=>resolve(image); image.onerror=()=>reject(new Error('Das Bild konnte nicht geöffnet werden.'));
      image.src=url;
    });
    const max = 800, scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
    const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*scale);c.height=Math.round(img.naturalHeight*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    return c.toDataURL('image/jpeg',.82);
  } finally { URL.revokeObjectURL(url); }
}
function showAnalysisResult(html) { $('analysisResult').innerHTML = html;$('analysisResult').classList.remove('hidden');$('analysisLoading').classList.add('hidden');$('closeAnalysisDone').classList.remove('hidden');}
async function processPhoto(file) {
  if (activeAnalysis) return;
  activeAnalysis=true;
  $('analysisTitle').textContent='Dein Foto wird analysiert';
  $('analysisStatus').textContent='Foto wird vorbereitet …';
  $('analysisResult').classList.add('hidden');$('analysisLoading').classList.remove('hidden');$('closeAnalysisDone').classList.add('hidden');
  $('analysisImage').replaceChildren();$('analysisImage').textContent='📷';
  showModal('analysisModal');
  try {
    const dataUrl=await prepareImage(file);
    const img=document.createElement('img');img.src=dataUrl;img.alt='Aufgenommenes Essen';$('analysisImage').replaceChildren(img);
    const result=await identifyMeal(dataUrl, msg => { $('analysisStatus').textContent=msg; });
    const best=result[0];
    const estimate=estimateForLabel(best.label);
    if (!estimate) throw new Error(`Dieses Gericht (${best.label}) steht nicht in der Nährwerttabelle. Es wird nichts erfunden oder gespeichert.`);
    const now=new Date();
    const meal={id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,name:estimate.name,emoji:estimate.emoji,
      kcal:estimate.kcal,protein:estimate.protein,carbs:estimate.carbs,fat:estimate.fat,
      date:localDate(now),time:now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}),
      createdAt:now.toISOString(), label:best.label, score:Number(best.score)||0};
    state.meals.push(meal);
    try { persist(); } catch (e) { state.meals=state.meals.filter(m=>m.id!==meal.id);throw e; }
    render();
    $('analysisTitle').textContent='Mahlzeit gespeichert!';
    $('analysisStatus').textContent=`${estimate.name} · Erkennung: ${Math.round(meal.score*100)} % Modellwert (keine Nährwertgenauigkeit)`;
    showAnalysisResult(`<div class="result-name">${escapeHtml(estimate.emoji)} ${escapeHtml(estimate.name)}</div>
      <div class="result-nutrients"><div><strong>${number(meal.kcal)}</strong><small>kcal</small></div><div><strong>${number(meal.protein)}g</strong><small>Eiweiß</small></div><div><strong>${number(meal.carbs)}g</strong><small>KH</small></div><div><strong>${number(meal.fat)}g</strong><small>Fett</small></div></div><p>Typische Portion geschätzt. Beilagen, versteckte Zutaten und Menge können stark abweichen. Foto wird nicht gespeichert.</p>`);
  } catch(error) {
    $('analysisTitle').textContent='Analyse nicht möglich';
    $('analysisStatus').textContent=String(error?.message||error);
    showAnalysisResult('<p>Die Fotoerkennung benötigt beim ersten Mal Internet und ausreichend Gerätespeicher. Es wurde keine Mahlzeit gespeichert. Du kannst es mit einem anderen Foto erneut versuchen.</p>');
  } finally {activeAnalysis=false;$('photoInput').value='';}
}
function openSettings() {
  for(const [key,id] of [['kcal','goalKcal'],['protein','goalProtein'],['carbs','goalCarbs'],['fat','goalFat']]) $(id).value=state.settings[key];
  showModal('settingsModal');
}
function downloadBackup() {
  const data=JSON.stringify({...state,exportedAt:new Date().toISOString(),app:'FuelUp v1'},null,2);
  const blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=`fuelup-backup-${localDate()}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  showToast('Backup exportiert. Bitte sicher ablegen.');
}
function initEvents() {
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click',()=>switchTab(b.dataset.tab)));
  for(const id of ['takePhotoHero','floatingCamera']) $(id).addEventListener('click',takePhoto);
  $('photoInput').addEventListener('change',event=> {if(event.target.files?.[0]) processPhoto(event.target.files[0]);});
  $('settingsButton').addEventListener('click',openSettings);
  $('closeAnalysis').addEventListener('click',()=>hideModal('analysisModal'));
  $('closeAnalysisDone').addEventListener('click',()=>hideModal('analysisModal'));
  $('closeSettings').addEventListener('click',()=>hideModal('settingsModal'));
  $('closeWeight').addEventListener('click',()=>hideModal('weightModal'));
  $('addWeight').addEventListener('click',()=> { $('weightInput').value='';showModal('weightModal');});
  $('goalsForm').addEventListener('submit',event=>{
    event.preventDefault();
    const updated={kcal:+$('goalKcal').value,protein:+$('goalProtein').value,carbs:+$('goalCarbs').value,fat:+$('goalFat').value};
    if(updated.kcal<1000 || updated.kcal>8000 || Object.entries(updated).some(([k,v])=>!Number.isFinite(v) || v<0)) return showToast('Bitte gültige Tagesziele eingeben.');
    state.settings=updated;persist();render();hideModal('settingsModal');showToast('Tagesziele aktualisiert.');
  });
  $('weightForm').addEventListener('submit',event=>{
    event.preventDefault();const kg=Number($('weightInput').value.replace(',','.'));
    if(!Number.isFinite(kg)||kg<25||kg>400) return showToast('Bitte gültiges Gewicht eingeben.');
    state.weights.push({id:crypto.randomUUID?.()||String(Date.now()),kg,date:localDate(),createdAt:new Date().toISOString()});
    persist();render();hideModal('weightModal');showToast('Gewicht gespeichert.');
  });
  document.addEventListener('click',event=>{
    const mealId=event.target.closest('[data-delete-meal]')?.dataset.deleteMeal;
    const weightId=event.target.closest('[data-delete-weight]')?.dataset.deleteWeight;
    if(mealId && confirm('Diese Mahlzeit wirklich löschen?')) {state.meals=state.meals.filter(m=>m.id!==mealId);persist();render();showToast('Mahlzeit entfernt.');}
    if(weightId && confirm('Diesen Gewichtseintrag wirklich löschen?')) {state.weights=state.weights.filter(w=>w.id!==weightId);persist();render();showToast('Gewichtseintrag entfernt.');}
  });
  $('exportData').addEventListener('click',downloadBackup);
  $('importDataButton').addEventListener('click',()=>$('importFile').click());
  $('importFile').addEventListener('change',async event=>{
    const file=event.target.files?.[0]; if(!file)return;
    try {
      if(file.size>5*1024*1024)throw new Error('Backup ist zu groß.');
      const data=JSON.parse(await file.text());
      if(!Array.isArray(data.meals)||!Array.isArray(data.weights)||!data.settings||typeof data.settings!=='object') throw new Error('Keine gültige FuelUp-Sicherung.');
      const validMeal=m => m && typeof m.id==='string' && typeof m.name==='string' && /^\d{4}-\d{2}-\d{2}$/.test(m.date) && ['kcal','protein','carbs','fat'].every(k=>Number.isFinite(m[k]) && m[k]>=0 && m[k]<10000);
      const validWeight=w => w && typeof w.id==='string' && /^\d{4}-\d{2}-\d{2}$/.test(w.date) && Number.isFinite(w.kg) && w.kg>0 && w.kg<500;
      if(data.meals.length>10000 || data.weights.length>10000 || !data.meals.every(validMeal) || !data.weights.every(validWeight)) throw new Error('Backup hat ungültige Einträge.');
      if(!confirm('Bestehende Einträge durch dieses Backup ersetzen?')) return;
      const settings=Object.fromEntries(Object.keys(DEFAULT_GOALS).map(k=>[k,Number.isFinite(data.settings[k]) && data.settings[k]>=0 && data.settings[k]<10000 ? data.settings[k] : DEFAULT_GOALS[k]]));
      state={meals:data.meals,weights:data.weights,settings};persist();render();hideModal('settingsModal');showToast('Backup wiederhergestellt.');
    } catch(err) {showToast('Import fehlgeschlagen: '+err.message);} finally {$('importFile').value='';}
  });
  $('clearData').addEventListener('click',()=>{ if(confirm('ALLE Mahlzeiten, Gewichte und Ziele unwiderruflich löschen? Bitte vorher Backup erstellen.')) {state=freshState();persist();render();hideModal('settingsModal');showToast('Alle lokalen Daten gelöscht.');}});
  document.querySelectorAll('.modal-backdrop').forEach(el=>el.addEventListener('click',event=>{if(event.target===el && !activeAnalysis)hideModal(el.id);}));
}
function initPreview() {
  // Ausschließlich Design-Vorschau: ?preview=1; KEINE Daten werden gespeichert.
  const now=localDate(),yesterday=addDays(now,-1);
  state.meals=[
    {id:'demo1',date:now,time:'08:12',name:'Omelett',emoji:'🍳',kcal:390,protein:28,carbs:7,fat:28,createdAt:new Date().toISOString()},
    {id:'demo2',date:now,time:'12:45',name:'Hähnchencurry',emoji:'🍛',kcal:720,protein:39,carbs:67,fat:29,createdAt:new Date(Date.now()+1000).toISOString()},
    {id:'demo3',date:now,time:'16:15',name:'Griechischer Salat',emoji:'🥗',kcal:390,protein:13,carbs:19,fat:29,createdAt:new Date(Date.now()+2000).toISOString()},
    ...Array.from({length:6},(_,i)=>({id:`demo-old${i}`,date:addDays(yesterday,-i),time:'13:00',name:'Lasagne',emoji:'🍝',kcal:1940+i*110,protein:105+i*8,carbs:200+i*10,fat:70,createdAt:new Date().toISOString()}))];
  state.weights=[{id:'dweight',date:now,kg:81.5,createdAt:new Date().toISOString()}];
  const banner=document.createElement('div');banner.className='demo-banner';banner.textContent='DESIGN-VORSCHAU: Beispieldaten – nichts davon wird gespeichert.';
  document.querySelector('.welcome').before(banner);
}
initEvents();
if(preview)initPreview();
render();
if ('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')) {
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
