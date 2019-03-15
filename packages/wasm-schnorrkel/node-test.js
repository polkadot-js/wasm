function generate_seed(count) {
    let seed = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
        seed[i] = Math.floor(Math.random() * 256)
    }
    return seed
}

function hexlify(arr) {
    let hex = ""
    for (let byte of arr) {
        let _byte = byte.toString(16).padStart(2, "0")
        console.log(byte, _byte) ; 
        hex += _byte
    }
    return "0x" + hex
}

String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
    }
    return bytes;
};

let schnorrkel = require('./schnorrkel_js')
let msg = "SUBSTRATE".getBytes()
let seed = new Uint8Array(32)
let kp = schnorrkel.keypair_from_seed(seed)
let secret = kp.slice(0, 64)
let public = kp.slice(64, 96)
let sig = schnorrkel.sign(public, secret, msg)
console.log(`++ used seed ${hexlify(seed)}`)
console.log(`++ public => ${hexlify(public)}`)
console.log(`++ secret => ${hexlify(secret)}`)
console.log(`++ local verify => ${schnorrkel.verify(sig, msg, public)}`)
console.log('-------------------------')
console.log(`++ signature: ${hexlify(sig)}`);
