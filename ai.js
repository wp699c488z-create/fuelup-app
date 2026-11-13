// FuelUp 1.1: Zwei kostenlose, lokal ausgeführte Bildklassifikatoren.
// ImageNet erkennt viele einzelne Lebensmittel; Food-101 erkennt zubereitete Gerichte.
// Beide Modelle müssen einmalig heruntergeladen werden. Keine kostenpflichtige API.
const GENERAL_MODEL = 'onnx-community/mobilenet_v2_1.0_224';
const DISH_MODEL = 'onnx-community/swin-finetuned-food101-ONNX';
let libraryPromise;
let generalPromise;
let dishPromise;
function library() {
  return libraryPromise ||= import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
}
function getGeneral(onProgress) {
  return generalPromise ||= (async () => {
    onProgress('Lebensmittel-Erkennung wird erstmals geladen …');
    const { pipeline } = await library();
    return pipeline('image-classification', GENERAL_MODEL, {device:'wasm', dtype:'q8'});
  })().catch(err => { generalPromise=null; throw err; });
}
function getDish(onProgress) {
  return dishPromise ||= (async () => {
    onProgress('Gerichte-Erkennung wird erstmals geladen …');
    const { pipeline } = await library();
    return pipeline('image-classification', DISH_MODEL, {device:'wasm', dtype:'q8'});
  })().catch(err => { dishPromise=null; throw err; });
}
// ImageNet-Klassen enthalten häufig Synonyme, z. B. "banana" oder "Granny Smith".
// Ausschließlich eindeutige Lebensmittel übernehmen; keine fremden Gegenstände als Mahlzeit speichern.
const SIMPLE_FOODS = [
  [/\bbanana\b/i,'banana'],
  [/\b(granny smith|red delicious|golden delicious|apple)\b/i,'apple'],
  [/\borange\b/i,'orange'],
  [/\b(strawberry|strawberries)\b/i,'strawberry'],
  [/\b(pineapple)\b/i,'pineapple'],
  [/\b(pomegranate)\b/i,'pomegranate'],
  [/\b(broccoli)\b/i,'broccoli'],
  [/\b(cauliflower)\b/i,'cauliflower'],
  [/\bcucumber\b/i,'cucumber'],
  [/\b(carrot)\b/i,'carrot'],
  [/\b(bell pepper|capsicum)\b/i,'bell_pepper'],
  [/\b(mushroom|agaric)\b/i,'mushroom'],
  [/\b(corn|ear of corn)\b/i,'corn'],
  [/\b(artichoke)\b/i,'artichoke'],
  [/\b(pretzel)\b/i,'pretzel'],
  [/\b(bagel)\b/i,'bagel'],
  [/\b(cheeseburger|hamburger)\b/i,'burger'],
  [/\b(hotdog|hot dog)\b/i,'hot_dog'],
  [/\b(ice cream|ice lolly)\b/i,'ice_cream'],
];
export function matchSimpleFood(results) {
  for (const item of results) {
    const score=Number(item.score)||0;
    if (score < 0.34) continue;
    const label=String(item.label||'');
    for (const [regex, key] of SIMPLE_FOODS) {
      if (regex.test(label)) return {label:key, score, source:'single-food'};
    }
  }
  return null;
}
export function chooseDish(results) {
  const best=results?.[0];
  if (!best || Number(best.score)<0.32) return null;
  return {label:best.label,score:Number(best.score),source:'dish'};
}
export async function identifyMeal(dataUrl, onProgress=()=>{}) {
  let general;
  try { general=await getGeneral(onProgress); } catch (error) { throw new Error('Das Lebensmittel-Modell konnte nicht geladen werden. Bitte Internetverbindung prüfen und später erneut versuchen. Details: '+error.message); }
  onProgress('Einzelne Lebensmittel werden erkannt …');
  const candidates=await general(dataUrl,{top_k:8});
  const simple=matchSimpleFood(candidates);
  if (simple) return [simple];
  const dish=await getDish(onProgress);
  onProgress('Zubereitetes Gericht wird erkannt …');
  const dishes=await dish(dataUrl,{top_k:3});
  const chosen=chooseDish(dishes);
  if (!chosen) throw new Error('Das Lebensmittel konnte nicht ausreichend sicher erkannt werden. Es wurde nichts gespeichert.');
  return [chosen];
}
