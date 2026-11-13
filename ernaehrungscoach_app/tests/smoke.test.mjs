import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FOODS, DEFAULT_GOALS, estimateForLabel, sumMeals } from '../nutrition.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
test('genau 101 Gerichte mit sinnvollen positiven Schätzwerten', () => {
  assert.equal(Object.keys(FOODS).length,101);
  for (const [key, food] of Object.entries(FOODS)) {
    assert.ok(key.length > 0);
    assert.equal(food.length,6);
    for (const x of food.slice(1,5)) assert.ok(Number.isFinite(x) && x >= 0);
  }
});
test('Tagesziele haben passende Energiesumme',()=>{
  assert.equal(DEFAULT_GOALS.protein*4+DEFAULT_GOALS.carbs*4+DEFAULT_GOALS.fat*9, DEFAULT_GOALS.kcal);
});
test('Nährwerte und Summen funktionieren',()=>{
  assert.equal(estimateForLabel('spaghetti bolognese').name,'Spaghetti Bolognese');
  assert.equal(estimateForLabel('unknown food'),null);
  assert.deepEqual(sumMeals([{kcal:300,protein:12,carbs:40,fat:8},{kcal:150,protein:8,carbs:15,fat:4}]),{kcal:450,protein:20,carbs:55,fat:12});
});
test('PWA enthält benötigte Dateien und Bedienelemente',()=>{
  for (const filename of ['index.html','styles.css','app.js','ai.js','nutrition.js','sw.js','manifest.webmanifest','assets/icon-192.png','assets/icon-512.png']) assert.ok(existsSync(join(root,filename)),filename);
  const html=readFileSync(join(root,'index.html'),'utf8');
  for(const id of ['photoInput','takePhotoHero','todayMeals','weekBars','weightForm','settingsModal','importFile','exportData']) assert.ok(html.includes(`id="${id}"`),id);
  const ai=readFileSync(join(root,'ai.js'),'utf8');
  assert.match(ai,/swin-finetuned-food101-ONNX/);
  assert.match(ai,/device: 'wasm'/);
});
