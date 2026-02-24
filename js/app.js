import { ConfidentialTransferClient } from 'https://esm.sh/@fairblock/stabletrust';
import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.2/ethers.js';

const SEPOLIA_RPC = "https://ethereum-sepolia.publicnode.com";
const CHAIN_ID = 11155111;

export async function initClient() {
    const client = new ConfidentialTransferClient(SEPOLIA_RPC, CHAIN_ID);
    const wasmUrl = 'https://esm.sh/v135/@fairblock/stabletrust@0.0.6/dist/index.wasm';
    
    try {
        client.wasmURL = wasmUrl;
    } catch (e) {}

    return client;
}

export function packData(text, number) {
    const textHex = ethers.hexlify(ethers.toUtf8Bytes(text));
    const cleanTextHex = textHex.startsWith('0x') ? textHex.slice(2) : textHex;
    const scaledNumber = BigInt(number) * 100n;
    const combinedHex = "0x" + cleanTextHex + scaledNumber.toString(16).padStart(8, '0');
    return BigInt(combinedHex);
}

export function unpackData(bigIntValue) {
    let hex = bigIntValue.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    const amountHex = hex.slice(-8); 
    const textHex = '0x' + hex.slice(0, -8);
    const rawNumber = parseInt(amountHex, 16);
    
    try {
        return {
            text: ethers.toUtf8String(textHex),
            number: Math.floor(rawNumber / 100)
        };
    } catch (e) {
        return { text: "Hex Error", number: 0 };
    }
}
