// Grobe Richtwerte pro typischer Portion, KEINE Labor- oder Datenbankmessungen.
// Food-101 kennt Gerichte, nicht die Zutaten oder Portion einer konkreten Mahlzeit.
// [Anzeigename, kcal, Eiweiß g, Kohlenhydrate g, Fett g, Emoji]
export const FOODS = {
  banana:['Banane (mittelgroß)',105,1.3,27,0.4,'🍌'],
  apple:['Apfel (mittelgroß)',95,0.5,25,0.3,'🍎'],
  orange:['Orange (mittelgroß)',62,1.2,15,0.2,'🍊'],
  strawberry:['Erdbeeren (150 g)',48,1,11.5,0.5,'🍓'],
  pineapple:['Ananas (150 g)',75,0.8,19.5,0.2,'🍍'],
  pomegranate:['Granatapfelkerne (100 g)',83,1.7,19,1.2,'🍎'],
  broccoli:['Brokkoli (150 g)',51,4.2,10,0.6,'🥦'],
  cauliflower:['Blumenkohl (150 g)',38,2.9,7.5,0.4,'🥦'],
  cucumber:['Gurke (150 g)',23,1,5.4,0.2,'🥒'],
  carrot:['Karotte (100 g)',41,0.9,10,0.2,'🥕'],
  bell_pepper:['Paprika (150 g)',47,1.5,9,0.5,'🫑'],
  mushroom:['Champignons (150 g)',33,4.6,5,0.5,'🍄'],
  corn:['Mais (150 g)',144,5.1,31.5,2.3,'🌽'],
  artichoke:['Artischocke (100 g)',47,3.3,10.5,0.2,'🥬'],
  pretzel:['Brezel (100 g)',290,9,58,2.5,'🥨'],
  bagel:['Bagel (100 g)',270,10,53,1.5,'🥯'],
  burger:['Hamburger (1 Stück)',540,28,42,29,'🍔'],
  hot_dog:['Hotdog (1 Stück)',320,12,30,17,'🌭'],
  ice_cream:['Speiseeis (150 g)',310,5,36,16,'🍨'],
  apple_pie:['Apfelkuchen',390,4,54,17,'🥧'],baby_back_ribs:['Spareribs',680,48,19,45,'🍖'],
  baklava:['Baklava',450,6,49,25,'🍯'],beef_carpaccio:['Rindercarpaccio',270,27,4,16,'🥩'],
  beef_tartare:['Rindertatar',350,37,9,18,'🥩'],beet_salad:['Rote-Bete-Salat',240,7,24,13,'🥗'],
  beignets:['Beignets',410,7,53,19,'🍩'],bibimbap:['Bibimbap',680,29,87,24,'🍚'],
  bread_pudding:['Brotpudding',420,9,59,16,'🍮'],breakfast_burrito:['Frühstücks-Burrito',610,29,57,28,'🌯'],
  bruschetta:['Bruschetta',320,9,42,13,'🍅'],caesar_salad:['Caesar Salad',520,23,22,36,'🥗'],
  cannoli:['Cannoli',370,8,42,20,'🍰'],caprese_salad:['Caprese',410,21,10,32,'🍅'],
  carrot_cake:['Karottenkuchen',460,6,56,23,'🍰'],ceviche:['Ceviche',250,30,11,9,'🐟'],
  cheese_plate:['Käseplatte',530,29,11,42,'🧀'],cheesecake:['Käsekuchen',440,9,39,27,'🍰'],
  chicken_curry:['Hähnchencurry',720,39,67,29,'🍛'],chicken_quesadilla:['Hähnchen-Quesadilla',660,36,56,32,'🌮'],
  chicken_wings:['Chicken Wings',610,45,16,39,'🍗'],chocolate_cake:['Schokoladenkuchen',480,6,60,24,'🍫'],
  chocolate_mousse:['Schokomousse',380,6,32,25,'🍫'],churros:['Churros',430,6,53,22,'🍩'],
  clam_chowder:['Muschelsuppe',390,16,33,20,'🥣'],club_sandwich:['Club-Sandwich',640,35,55,30,'🥪'],
  crab_cakes:['Krabbenküchlein',420,27,21,25,'🦀'],creme_brulee:['Crème brûlée',410,7,36,25,'🍮'],
  croque_madame:['Croque Madame',680,33,46,39,'🥪'],cup_cakes:['Cupcakes',360,4,46,18,'🧁'],
  deviled_eggs:['Gefüllte Eier',280,16,3,22,'🥚'],donuts:['Donuts',410,6,49,22,'🍩'],
  dumplings:['Teigtaschen',460,19,63,14,'🥟'],edamame:['Edamame',190,18,14,8,'🫛'],
  eggs_benedict:['Eggs Benedict',580,26,39,35,'🍳'],escargots:['Weinbergschnecken',280,20,8,19,'🍽️'],
  falafel:['Falafel',510,19,52,25,'🧆'],filet_mignon:['Rinderfilet',480,55,5,25,'🥩'],
  fish_and_chips:['Fish and Chips',850,39,86,39,'🐟'],foie_gras:['Foie gras',490,13,15,43,'🍽️'],
  french_fries:['Pommes frites',440,6,55,21,'🍟'],french_onion_soup:['Zwiebelsuppe',360,14,31,19,'🥣'],
  french_toast:['Arme Ritter',490,16,57,22,'🍞'],fried_calamari:['Frittierte Calamari',500,31,38,25,'🦑'],
  fried_rice:['Gebratener Reis',630,20,87,22,'🍚'],frozen_yogurt:['Frozen Yogurt',270,8,49,4,'🍦'],
  garlic_bread:['Knoblauchbrot',410,9,46,21,'🥖'],gnocchi:['Gnocchi',610,16,87,20,'🍝'],
  greek_salad:['Griechischer Salat',390,13,19,29,'🥗'],grilled_cheese_sandwich:['Käsetoast',570,21,45,34,'🥪'],
  grilled_salmon:['Gegrillter Lachs',560,47,20,33,'🐟'],guacamole:['Guacamole',300,4,16,26,'🥑'],
  gyoza:['Gyoza',410,19,45,16,'🥟'],hamburger:['Hamburger',660,33,58,32,'🍔'],
  hot_and_sour_soup:['Sauer-scharfe Suppe',250,14,19,12,'🥣'],hot_dog:['Hotdog',510,19,42,29,'🌭'],
  huevos_rancheros:['Huevos Rancheros',540,24,43,29,'🍳'],hummus:['Hummus',340,11,26,21,'🧆'],
  ice_cream:['Eiscreme',320,6,37,16,'🍨'],lasagna:['Lasagne',730,38,67,34,'🍝'],
  lobster_bisque:['Hummersuppe',380,17,21,24,'🥣'],lobster_roll_sandwich:['Hummerbrötchen',550,26,46,28,'🦞'],
  macaroni_and_cheese:['Mac and Cheese',690,26,72,32,'🧀'],macarons:['Macarons',330,6,45,14,'🍬'],
  miso_soup:['Misosuppe',95,7,8,4,'🥣'],mussels:['Miesmuscheln',340,38,20,12,'🦪'],
  nachos:['Nachos',720,22,65,41,'🌮'],omelette:['Omelett',390,28,7,28,'🍳'],
  onion_rings:['Zwiebelringe',460,6,54,24,'🧅'],oysters:['Austern',160,16,9,6,'🦪'],
  pad_thai:['Pad Thai',740,33,88,28,'🍜'],paella:['Paella',700,35,76,26,'🥘'],
  pancakes:['Pancakes',520,14,78,16,'🥞'],panna_cotta:['Panna cotta',370,6,33,23,'🍮'],
  peking_duck:['Pekingente',720,39,42,43,'🦆'],pho:['Pho',510,30,65,14,'🍜'],
  pizza:['Pizza',800,32,98,31,'🍕'],pork_chop:['Schweinekotelett',590,50,17,35,'🍖'],
  poutine:['Poutine',780,21,79,43,'🍟'],prime_rib:['Rinderbraten',680,53,10,47,'🥩'],
  pulled_pork_sandwich:['Pulled-Pork-Sandwich',700,38,62,33,'🥪'],ramen:['Ramen',660,30,78,25,'🍜'],
  ravioli:['Ravioli',610,24,75,23,'🍝'],red_velvet_cake:['Red-Velvet-Kuchen',470,6,57,24,'🍰'],
  risotto:['Risotto',640,17,82,26,'🍚'],samosa:['Samosas',420,10,49,20,'🥟'],
  sashimi:['Sashimi',290,45,4,10,'🍣'],scallops:['Jakobsmuscheln',310,30,14,14,'🦪'],
  seaweed_salad:['Algensalat',160,3,19,8,'🥗'],shrimp_and_grits:['Garnelen mit Maisgrieß',640,33,65,27,'🍤'],
  spaghetti_bolognese:['Spaghetti Bolognese',720,35,88,25,'🍝'],spaghetti_carbonara:['Spaghetti Carbonara',830,34,83,40,'🍝'],
  spring_rolls:['Frühlingsrollen',440,13,48,22,'🥟'],steak:['Steak',630,57,11,39,'🥩'],
  strawberry_shortcake:['Erdbeerkuchen',420,7,52,20,'🍓'],sushi:['Sushi',500,22,73,12,'🍣'],
  tacos:['Tacos',640,31,60,29,'🌮'],takoyaki:['Takoyaki',470,16,50,22,'🐙'],
  tiramisu:['Tiramisu',450,8,45,26,'🍰'],tuna_tartare:['Thunfischtatar',320,35,12,15,'🐟'],
  waffles:['Waffeln',520,11,65,23,'🧇'],
};

export function normalizeLabel(label) {
  return String(label || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/-/g, '_');
}
export function estimateForLabel(label) {
  const key = normalizeLabel(label);
  const entry = FOODS[key];
  if (!entry) return null;
  const [name, kcal, protein, carbs, fat, emoji] = entry;
  return { key, name, kcal, protein, carbs, fat, emoji, note: 'Grobe Schätzung für eine typische Portion – Menge nicht gemessen.' };
}
export function sumMeals(meals) {
  return meals.reduce((acc, item) => {
    for (const key of ['kcal','protein','carbs','fat']) acc[key] += Number(item[key]) || 0;
    return acc;
  }, { kcal:0, protein:0, carbs:0, fat:0 });
}
export const DEFAULT_GOALS = Object.freeze({ kcal:2900, protein:155, carbs:390, fat:80 });
