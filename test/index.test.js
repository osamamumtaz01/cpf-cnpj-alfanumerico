import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCpf, validateCnpj, generateCpf, generateCnpj, cnpjCheck, formatCnpj } from '../dist/index.js';

test('CPF', () => {
  assert.deepEqual(validateCpf('529.982.247-25'), { ok: true, formatted: '529.982.247-25' });
  assert.equal(validateCpf('529.982.247-24').ok, false);
  assert.equal(validateCpf('111.111.111-11').reason, 'repeated');
  for (let i = 0; i < 200; i++) assert.equal(validateCpf(generateCpf()).ok, true);
  assert.equal(generateCpf('8')[8], '8');
});

test('numeric CNPJ', () => {
  assert.equal(validateCnpj('11.222.333/0001-81').ok, true);
  assert.equal(validateCnpj('11.222.333/0001-82').ok, false);
});

test('alphanumeric CNPJ (Receita Federal example)', () => {
  assert.equal(cnpjCheck('12ABC34501DE'), '35');
  assert.deepEqual(validateCnpj('12.ABC.345/01DE-35'), { ok: true, formatted: '12.ABC.345/01DE-35' });
  assert.equal(validateCnpj('12abc34501de35').ok, true);
  assert.equal(validateCnpj('12.ABC.345/01DE-3A').reason, 'chars');
  for (let i = 0; i < 200; i++) assert.equal(validateCnpj(generateCnpj(true)).ok, true);
  assert.equal(formatCnpj('12ABC34501DE35'), '12.ABC.345/01DE-35');
});
