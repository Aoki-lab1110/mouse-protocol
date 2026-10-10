import { test } from "node:test";
import { strict as assert } from "node:assert";
import { decodeElecomExgProInput } from "./index.ts";

test("Bluetooth input retains all three extra bits and signed wheel data", () => {
  const backing = new Uint8Array([99, 0xe0, 0xff, 0xff, 2, 0, 0xff, 0xfe, 99]);
  assert.deepEqual(decodeElecomExgProInput(0x013e, 2, backing.subarray(1, 8)),
    { buttons: 0xe0, x: -1, y: 2, wheel: -1, tilt: -2 });
});
test("unknown products, other reports and partial packets are rejected", () => {
  assert.equal(decodeElecomExgProInput(0x013e, 1, new Uint8Array(7)), null);
  assert.equal(decodeElecomExgProInput(0x9999, 2, new Uint8Array(7)), null);
  assert.equal(decodeElecomExgProInput(0x013d, 1, new Uint8Array(6)), null);
  assert.equal(decodeElecomExgProInput(0x013d, 1, new Uint8Array(8)), null);
});
