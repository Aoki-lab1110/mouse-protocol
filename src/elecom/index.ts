/** EX-G PRO input layouts observed in Mouse Assistant 6.4.0's device catalog.
 * These are software remaps, not firmware settings. Hardware verification is
 * still required; do not expose these protected mouse collections via WebHID.
 */
export const ELECOM_VENDOR_ID = 0x056e;
export const ELECOM_EXTRA_BUTTONS = [6, 7, 8] as const;
export const ELECOM_EXG_PRO_PRODUCTS = new Map([
  [0x013d, { family: "mouse", reportId: 1, connection: "wireless", verified: false }],
  [0x013e, { family: "mouse", reportId: 2, connection: "bluetooth", verified: false }],
  [0x0128, { family: "trackball", reportId: 1, connection: "wired", verified: false }],
  [0x0129, { family: "trackball", reportId: 1, connection: "wireless", verified: false }],
  [0x0130, { family: "trackball", reportId: 1, connection: "bluetooth", verified: false }],
]);

/** HID payload without its separately supplied report-ID byte. */
export function decodeElecomExgProInput(productId: number, reportId: number, data: Uint8Array) {
  const product = ELECOM_EXG_PRO_PRODUCTS.get(productId);
  if (!product || reportId !== product.reportId || data.length !== 7) return null;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    buttons: data[0],
    x: view.getInt16(1, true),
    y: view.getInt16(3, true),
    wheel: view.getInt8(5),
    tilt: view.getInt8(6),
  };
}
