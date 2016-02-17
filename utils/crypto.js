var CryptoJS = require('crypto-js');

function Crypto() {
    this.generator = 2;
    this.prime = 7919;
}

Crypto.prototype.generateKeys = function() {
    this.serverPrivateKey = Math.floor((Math.random() * 80) + 1);
    this.serverPublicKey = this.powMod(this.generator, this.serverPrivateKey, this.prime);
};

Crypto.prototype.saveSessionKey = function(clientKey) {
    this.sessionKey = this.powMod(clientKey, this.serverPrivateKey, this.prime);
};

Crypto.prototype.powMod = function(base, exp, mod){
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        return Math.pow(this.powMod(base, (exp / 2), mod), 2) % mod;
    } else {
        return (base * this.powMod(base, (exp - 1), mod)) % mod;
    }
};

Crypto.prototype.encryptMessage = function(msg) {
    var key = this.sessionKey.toString();
    return CryptoJS.RC4.encrypt(msg, key);
};

Crypto.prototype.decryptMessage = function(msg) {
    var key = this.sessionKey.toString();
    var decrypted = CryptoJS.RC4.decrypt(msg, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = Crypto;