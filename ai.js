// Die Bilddaten werden dem lokal im Browser laufenden Modell übergeben.
// Eine Netzverbindung wird für den ERSTEN Download der Bibliothek und der Modellgewichte benötigt.
const MODEL_ID = 'onnx-community/swin-finetuned-food101-ONNX';
let classifierPromise = null;

export async function identifyMeal(dataUrl, onProgress = () => {}) {
  if (!classifierPromise) {
    classifierPromise = (async () => {
      onProgress('Lokale KI wird geladen – beim ersten Mal etwa 93 MB …');
      // Kein API-Key und kein bezahlter Inferenz-Endpunkt.
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
      return pipeline('image-classification', MODEL_ID, {
        dtype: 'q8',
        device: 'wasm',
        progress_callback: p => {
          if (p.status === 'progress' && Number.isFinite(p.progress)) {
            onProgress(`KI-Modell wird geladen: ${Math.round(p.progress)} %`);
          }
        },
      });
    })().catch(error => {
      classifierPromise = null; // Neustartversuch möglich
      throw error;
    });
  }
  const classifier = await classifierPromise;
  onProgress('Gericht wird auf diesem Gerät erkannt …');
  const result = await classifier(dataUrl, { top_k: 3 });
  if (!Array.isArray(result) || !result.length) throw new Error('Die KI konnte kein Gericht erkennen.');
  return result;
}
