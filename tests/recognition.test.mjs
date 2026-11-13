import test from 'node:test';
import assert from 'node:assert/strict';
import {matchSimpleFood,chooseDish} from '../ai.js';
import {estimateForLabel} from '../nutrition.js';
test('Banane wird statt Food-101-Gericht zugeordnet',()=>{
  const x=matchSimpleFood([{label:'banana',score:0.87},{label:'lemon',score:0.03}]);
  assert.equal(x.label,'banana');
  assert.equal(estimateForLabel(x.label).name,'Banane (mittelgroß)');
});
test('unsichere Bilder werden nicht willkürlich gespeichert',()=>{
  assert.equal(matchSimpleFood([{label:'banana',score:0.1}]),null);
  assert.equal(matchSimpleFood([{label:'laptop',score:0.96}]),null);
  assert.equal(chooseDish([{label:'mac_and_cheese',score:0.08}]),null);
});
