// Brazil's CPF (people) and CNPJ (companies): check digits, validation and
// random test numbers. Module 11 as published by the Receita Federal. Since
// July 2026 new CNPJs may have letters in the first 12 characters (IN RFB
// 2.229/2024); each character counts as its ASCII code minus 48 (A = 17).

const digitsOf = (s: string) => s.replace(/\D/g, '');

const dv = (sum: number) => { const r = sum % 11; return r < 2 ? 0 : 11 - r; };

// ---------- CPF ----------

/** The two check digits for the first 9 digits of a CPF. */
export function cpfCheck(nine: string): string {
  const d = [...nine].map(Number);
  const d1 = dv(d.reduce((s, x, i) => s + x * (10 - i), 0));
  const d2 = dv([...d, d1].reduce((s, x, i) => s + x * (11 - i), 0));
  return `${d1}${d2}`;
}

export const formatCpf = (c: string) => `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`;

export type Verdict =
  | { ok: true; formatted: string }
  | { ok: false; reason: 'length' | 'repeated' | 'digits' | 'chars'; expected?: string; formatted?: string };

export function validateCpf(input: string): Verdict {
  const c = digitsOf(input);
  if (c.length !== 11) return { ok: false, reason: 'length' };
  if (/^(\d)\1{10}$/.test(c)) return { ok: false, reason: 'repeated', formatted: formatCpf(c) };
  const exp = cpfCheck(c.slice(0, 9));
  return exp === c.slice(9) ? { ok: true, formatted: formatCpf(c) } : { ok: false, reason: 'digits', expected: exp, formatted: formatCpf(c) };
}

/**
 * The 9th digit of a CPF is the fiscal region where it was first issued.
 * 0 RS · 1 DF GO MS MT TO · 2 AC AM AP PA RO RR · 3 CE MA PI · 4 AL PB PE RN ·
 * 5 BA SE · 6 MG · 7 ES RJ · 8 SP · 9 PR SC
 */
export const CPF_REGIONS: [string, string][] = [
  ['0', 'RS'], ['1', 'DF, GO, MS, MT, TO'], ['2', 'AC, AM, AP, PA, RO, RR'], ['3', 'CE, MA, PI'], ['4', 'AL, PB, PE, RN'],
  ['5', 'BA, SE'], ['6', 'MG'], ['7', 'ES, RJ'], ['8', 'SP'], ['9', 'PR, SC']
];

const rand = (n: number) => {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
};
const randDigits = (n: number) => Array.from({ length: n }, () => rand(10)).join('');

/** A random, mathematically valid CPF for testing software. `region` is the 9th digit, or '' for any. */
export function generateCpf(region = ''): string {
  for (;;) {
    const nine = randDigits(8) + (region || String(rand(10)));
    if (/^(\d)\1{8}$/.test(nine)) continue;
    return nine + cpfCheck(nine);
  }
}

// ---------- CNPJ ----------
const W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const W2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const val = (ch: string) => ch.charCodeAt(0) - 48;

/** The two check digits for the first 12 characters of a CNPJ (digits or A–Z). */
export function cnpjCheck(twelve: string): string {
  const c = [...twelve.toUpperCase()].map(val);
  const d1 = dv(c.reduce((s, x, i) => s + x * W1[i], 0));
  const d2 = dv([...c, d1].reduce((s, x, i) => s + x * W2[i], 0));
  return `${d1}${d2}`;
}

export const formatCnpj = (c: string) => `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;

const cleanCnpj = (s: string) => s.toUpperCase().replace(/[\s./-]/g, '');

export function validateCnpj(input: string): Verdict {
  const c = cleanCnpj(input);
  if (c.length !== 14) return { ok: false, reason: 'length' };
  if (!/^[0-9A-Z]{12}\d{2}$/.test(c)) return { ok: false, reason: 'chars' };
  if (/^(\d)\1{13}$/.test(c)) return { ok: false, reason: 'repeated', formatted: formatCnpj(c) };
  const exp = cnpjCheck(c.slice(0, 12));
  return exp === c.slice(12) ? { ok: true, formatted: formatCnpj(c) } : { ok: false, reason: 'digits', expected: exp, formatted: formatCnpj(c) };
}

const ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** A random, mathematically valid CNPJ for testing (head office, branch 0001). */
export function generateCnpj(alphanumeric = false): string {
  for (;;) {
    const root = alphanumeric ? Array.from({ length: 8 }, () => ALNUM[rand(36)]).join('') : randDigits(8);
    if (/^(\d)\1{7}$/.test(root)) continue;
    const twelve = root + '0001';
    return twelve + cnpjCheck(twelve);
  }
}
