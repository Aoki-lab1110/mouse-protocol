# EX-G PRO catalog-derived input decoder

`@openmouse/protocol/elecom` exports EX-G PRO IDs, extra-button numbers and a
strict decoder for the 7-byte payload (the report ID is supplied separately).
Fields are buttons, signed X/Y, signed wheel and signed tilt. A nonzero
Uint8Array byteOffset is supported. Unknown PIDs, report IDs and lengths return
null. These facts come from the user-supplied Mouse Assistant 6.4.0 catalog;
hardware validation is pending.

No WebHID driver is registered. The macOS mouse collection is protected, the
catalog marks the devices as software-configured, and no EX-G PRO firmware
write protocol has been established. A native listener is needed for local
keyboard remaps. See the independent `elecom-helper` crate in the Bridge fork.
The offline UI uses the helper API and does not require replacing the existing
published protocol dependency.

Supported VID is 056e. PIDs: 013d/013e (M-XGx50MB receiver/Bluetooth),
0128/0129/0130 (M-XPT1MR wired/receiver/Bluetooth). None is hardware-verified.
Do not describe this as working device support until real report captures and
button tests have confirmed the layout.
