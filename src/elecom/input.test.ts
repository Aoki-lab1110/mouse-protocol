import { test } from "node:test";
import { strict as assert } from "node:assert";
import { decodeElecomExgProInput, decodeElecomExgProButtons } from "./index.ts";

test("Bluetooth normal input covers only primary buttons and signed wheel data", () => {
  const backing = new Uint8Array([99, 0xe0, 0xff, 0xff, 2, 0, 0xff, 0xfe, 99]);
  assert.deepEqual(decodeElecomExgProInput(0x013e, 2, backing.subarray(1, 8)),
    { buttons: 0, x: -1, y: 2, wheel: -1, tilt: -2 });
});
test("observed Bluetooth vendor Fn reports use a separate scope", () => {
  const payload = new Uint8Array([0x12, 0x12, 0x20, 0, 0, 0x10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  for (const mask of [0x20, 0x40, 0x80, 0xe0, 0]) {
    payload[2] = mask;
    assert.deepEqual(decodeElecomExgProButtons(0x013e, 16, payload), { buttons: mask, scope: 0xe0 });
  }
  assert.equal(decodeElecomExgProButtons(0x013d, 16, payload), null);
  assert.equal(decodeElecomExgProButtons(0x013e, 16, payload.subarray(1)), null);
  payload[1] = 0x13;
  assert.equal(decodeElecomExgProButtons(0x013e, 16, payload), null);
  assert.deepEqual(decodeElecomExgProButtons(0x013e, 2, new Uint8Array([1, 0, 0, 0, 0, 0, 0])), { buttons: 1, scope: 0x1f });
});
test("unknown products, other reports and partial packets are rejected", () => {
  assert.equal(decodeElecomExgProInput(0x013e, 1, new Uint8Array(7)), null);
  assert.equal(decodeElecomExgProInput(0x9999, 2, new Uint8Array(7)), null);
  assert.equal(decodeElecomExgProInput(0x013d, 1, new Uint8Array(6)), null);
  assert.equal(decodeElecomExgProInput(0x013d, 1, new Uint8Array(8)), null);
});
