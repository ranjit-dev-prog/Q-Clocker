"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferenceId = generateReferenceId;
const crypto = require("crypto");
const UNAMBIGUOUS_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
function generateReferenceId(prefix, length = 6) {
    const bytes = crypto.randomBytes(length);
    let randomPart = '';
    for (let i = 0; i < length; i++) {
        const index = bytes[i] % UNAMBIGUOUS_CHARSET.length;
        randomPart += UNAMBIGUOUS_CHARSET[index];
    }
    return `${prefix}-${randomPart}`;
}
//# sourceMappingURL=reference-id.util.js.map