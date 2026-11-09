#!/usr/bin/env node
// Crea o verifica el enlace simbólico canónico de Claude hacia esta habilidad.
// Uso: node scripts/sync-skill.mjs [--check]

import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const name = source.split(sep).pop();
const repoRoot = resolve(source, '..', '..', '..');
const target = join(repoRoot, '.claude', 'skills', name);
const expected = '../../.agents/skills/tamborradata-journalist';
const check = process.argv.includes('--check');

function existsOrLink(path) {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

const valid = () =>
  existsSync(target) && lstatSync(target).isSymbolicLink() && readlinkSync(target) === expected;
const fallbackValid = () => {
  try {
    return lstatSync(target).isSymbolicLink() && resolve(dirname(target), readlinkSync(target)) === source;
  } catch {
    return false;
  }
};

if (check) {
  if (!valid() && !fallbackValid()) {
    console.error(`Enlace inválido: ${relative(repoRoot, target)} debe apuntar a ${expected}`);
    process.exit(1);
  }
  console.log(valid() ? 'Enlace simbólico relativo verificado' : 'Unión NTFS de fallback verificada');
} else {
  if (existsOrLink(target)) rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  try {
    symlinkSync(expected, target, 'dir');
    if (!valid()) throw new Error('El destino relativo creado no coincide');
    console.log(`Enlace simbólico creado: ${relative(repoRoot, target)} -> ${expected}`);
  } catch (error) {
    if (existsOrLink(target)) rmSync(target, { recursive: true, force: true });
    symlinkSync(source, target, 'junction');
    if (!fallbackValid()) throw error;
    console.log('Enlace simbólico no permitido; creada unión NTFS de fallback sin copia');
  }
}
