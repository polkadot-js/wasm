// @ts-check
const crypto = require('crypto');
const { assert, hexToU8a, stringToU8a, u8aToHex } = require('@polkadot/util');

const schnorrkel = require('../build');

function extractKeys (pair) {
  const pk = pair.slice(64);
  const sk = pair.slice(0, 64);

  return [pair, pk, sk];
}

function randomPair () {
  const seed = crypto.randomBytes(32);
  const pair = schnorrkel.keypairFromSeed(seed);

  assert(pair.length === 96, 'ERROR: Invalid pair created');

  return extractKeys(pair);
}

async function beforeAll () {
  return schnorrkel.waitReady();
}

async function pairFromSeed () {
  console.time('pairFromSeed');
  console.log();

  const SEED = stringToU8a('12345678901234567890123456789012');
  const PAIR = hexToU8a(
    '0x' +
    // private
    'f0106660c3dda23f16daa9ac5b811b963077f5bc0af89f85804f0de8e424f050' +
    'f98d66f39442506ff947fd911f18c7a7a5da639a63e8d3b4e233f74143d951c1' +
    // public
    '741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63'
  );

  const pair = schnorrkel.keypairFromSeed(SEED);

  console.error('pairFromSeed');
  console.log('\t', u8aToHex(pair.slice(0, 64)));
  console.log('\t', u8aToHex(pair.slice(64)));

  assert(u8aToHex(pair) === u8aToHex(PAIR), 'ERROR: pairFromSeed() does not match');

  console.timeEnd('pairFromSeed');
}

async function verifyExisting () {
  console.time('verifyExisting');
  console.log();

  const PK = hexToU8a('0x741c08a06f41c596608f6774259bd9043304adfa5d3eea62760bd9be97634d63');
  const MESSAGE = stringToU8a('this is a message');
  const SIGNATURE = hexToU8a(
    '0x' +
    'decef12cf20443e7c7a9d406c237e90bcfcf145860722622f92ebfd5eb4b5b39' +
    '90b6443934b5cba8f925a0ae75b3a77d35b8490cbb358dd850806e58eaf72904'
  );

  const isValid = schnorrkel.verify(SIGNATURE, MESSAGE, PK);

  console.error('verifyExisting');
  console.log('\t', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');

  console.timeEnd('verifyExisting');
}

async function signAndVerify () {
  console.time('signAndVerify');
  console.log();

  const MESSAGE = stringToU8a('this is a message');

  const [, pk, sk] = randomPair();
  const signature = schnorrkel.sign(pk, sk, MESSAGE);
  const isValid = schnorrkel.verify(signature, MESSAGE, pk);

  console.error('signAndVerify');
  console.log('\t', u8aToHex(signature));
  console.log('\t', isValid);

  assert(isValid, 'ERROR: Unable to verify signature');

  console.timeEnd('signAndVerify');
}

async function deriveHard () {
  console.time('deriveHard');
  console.log();

  const CC = hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000');
  const [pair] = randomPair();
  const derived = schnorrkel.hardDeriveKeypair(pair, CC);

  console.error('deriveHard');
  console.log('\t', u8aToHex(derived.slice(0, 64)));
  console.log('\t', u8aToHex(derived.slice(64)));

  console.timeEnd('deriveHard');
}

async function deriveSoft () {
  console.time('deriveSoft');
  console.log();

  const CC = hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000');

  const [pair] = randomPair();
  const derived = schnorrkel.softDeriveKeypair(pair, CC);

  console.error('deriveSoft');
  console.log('\t', u8aToHex(derived.slice(0, 64)));
  console.log('\t', u8aToHex(derived.slice(64)));

  console.timeEnd('deriveSoft');
}

async function deriveSoftKnown () {
  console.time('deriveSoftKnown');
  console.log();

  const CC = hexToU8a('0x0c666f6f00000000000000000000000000000000000000000000000000000000');
  const PUBLIC = '0x40b9675df90efa6069ff623b0fdfcf706cd47ca7452a5056c7ad58194d23440a';
  const PAIR = hexToU8a(
    '0x' +
    '28b0ae221c6bb06856b287f60d7ea0d98552ea5a16db16956849aa371db3eb51' +
    'fd190cce74df356432b410bd64682309d6dedb27c76845daf388557cbac3ca34' +
    '46ebddef8cd9bb167dc30878d7113b7e168e6f0646beffd77d69d39bad76b47a'
  );

  const derived = schnorrkel.softDeriveKeypair(PAIR, CC);
  const publicKey = u8aToHex(derived.slice(64));

  console.error('deriveSoftKnown');
  console.log('\t', u8aToHex(derived.slice(0, 64)));
  console.log('\t', publicKey);

  assert(publicKey === PUBLIC, 'Unmatched resulting public keys');

  console.timeEnd('deriveSoftKnown');
}

async function benchmark () {
  console.time('benchmark');
  console.log();

  const MESSAGE = stringToU8a('this is a message');

  for (let i = 0; i < 256; i++) {
    const [, pk, sk] = randomPair();

    const signature = schnorrkel.sign(pk, sk, MESSAGE);
    const isValid = schnorrkel.verify(signature, MESSAGE, pk);

    assert(isValid, 'ERROR: Unable to verify signature');
  }

  console.timeEnd('benchmark');
}

(async () => {
  await beforeAll();
  await pairFromSeed();
  await signAndVerify();
  await verifyExisting();
  await deriveHard();
  await deriveSoft();
  await deriveSoftKnown();
  await benchmark();
})().catch(console.log).finally(() => process.exit());
