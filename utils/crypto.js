var CryptoJS = require('crypto-js');

function Crypto() {
    this.generator = 7;
    this.prime = 7919;
}

Crypto.prototype.generateKeys = function() {
    var keys = {};
    keys['priKey'] = Math.floor((Math.random() * 80) + 1);
    keys['pubKey'] = this.powMod(this.generator, keys['priKey'], this.prime);
    return keys;
};

Crypto.prototype.getSessionKey = function(clientKey, serverPrivateKey) {
    return this.powMod(clientKey, serverPrivateKey, this.prime);
};

Crypto.prototype.powMod = function(base, exp, mod){
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        return Math.pow(this.powMod(base, (exp / 2), mod), 2) % mod;
    } else {
        return (base * this.powMod(base, (exp - 1), mod)) % mod;
    }
};

Crypto.prototype.encryptMessage = function(msg, key) {
    return CryptoJS.RC4.encrypt(msg, key.toString());
};

Crypto.prototype.decryptMessage = function(msg, key) {
    var decrypted = CryptoJS.RC4.decrypt(msg, key.toString());
    return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = Crypto;