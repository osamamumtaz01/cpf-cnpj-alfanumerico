# cpf-cnpj-alfanumerico

Validate, format and generate Brazilian **CPF** and **CNPJ** numbers, including the
**alphanumeric CNPJ** that the Receita Federal issues from July 2026
(Instrução Normativa RFB nº 2.229/2024). No dependencies, works in Node and the browser.

Try it without installing anything: [CNPJ validator](https://treeet.com/validar-cnpj/) ·
[CNPJ generator](https://treeet.com/gerador-de-cnpj/) · [CPF validator](https://treeet.com/validar-cpf/) ·
[CPF generator](https://treeet.com/gerador-de-cpf/)

```sh
npm install cpf-cnpj-alfanumerico
```

```js
import { validateCnpj, validateCpf, generateCnpj, generateCpf, cnpjCheck } from 'cpf-cnpj-alfanumerico';

validateCnpj('12.ABC.345/01DE-35');
// { ok: true, formatted: '12.ABC.345/01DE-35' }

validateCnpj('12.ABC.345/01DE-36');
// { ok: false, reason: 'digits', expected: '35', formatted: '12.ABC.345/01DE-36' }

validateCpf('529.982.247-25');   // { ok: true, formatted: '529.982.247-25' }

cnpjCheck('12ABC34501DE');       // '35'
generateCnpj(true);              // random valid alphanumeric CNPJ, branch 0001
generateCpf('8');                // random valid CPF first issued in SP
```

## How the alphanumeric CNPJ check digits work

The first 12 characters may now be digits or the letters A–Z; the last two are still
digits. Each character is converted to its ASCII code minus 48, so `0`–`9` keep their
value and `A` = 17, `B` = 18 … `Z` = 42. The two check digits then use the same
module-11 weights as before (5,4,3,2,9,8,7,6,5,4,3,2 and 6,5,4,3,2,9,8,7,6,5,4,3,2).
Existing numeric CNPJs stay valid.

What this means for your system:

- Store the CNPJ as text, not as a number.
- Accept `A–Z` in the first 12 positions in masks and validation.
- Upper-case input before validating. `validateCnpj` does this for you.

## API

| Function | Returns |
|---|---|
| `validateCpf(input)` / `validateCnpj(input)` | `{ ok: true, formatted }` or `{ ok: false, reason, expected?, formatted? }`; `reason` is `length`, `chars`, `repeated` or `digits` |
| `cpfCheck(nine)` / `cnpjCheck(twelve)` | the two check digits |
| `formatCpf(eleven)` / `formatCnpj(fourteen)` | the number with dots, slash and dash |
| `generateCpf(region?)` | a random valid CPF; `region` is the 9th digit (`CPF_REGIONS` lists them) |
| `generateCnpj(alphanumeric?)` | a random valid CNPJ for branch 0001 |

Generated numbers are for testing software only. They are mathematically valid but
don't belong to anyone.

## Licence

MIT © Osama Mumtaz. Made for [Treeet](https://treeet.com/), free file tools that run in your browser.
