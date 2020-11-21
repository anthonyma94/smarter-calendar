import crypto from "crypto";
import { CIPHER } from "../../../config";
const key = crypto.scryptSync(CIPHER, "salt", 32); // has to be 32 for aes-256
const algo = "aes-256-cbc";
const pattern = ":";

export const encrypt = (data: object|string) => {
    if (typeof data === "object") data = JSON.stringify(data);
    const iv = crypto.randomBytes(16); // has to be 16 for aes
    const cipher = crypto.createCipheriv(algo, key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return iv.toString("base64") + pattern + encrypted.toString("base64");
};

export const decrypt = (data: string) => {
    let parts = data.split(pattern);
    const iv = Buffer.from(parts.shift(), "base64");
    const cipher = crypto.createDecipheriv(algo, key, iv);
    let decrypted = Buffer.concat([
        cipher.update(Buffer.from(parts.shift(), "base64")),
        cipher.final(),
    ]);
    try {
        return JSON.parse(decrypted.toString());
    } catch {
        return decrypted.toString();
    }
};
