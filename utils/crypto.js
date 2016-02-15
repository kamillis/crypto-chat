var NodeRSA = require('node-rsa');
var config = require('./config');

function Crypto() {

    this.rsa = new NodeRSA(config.privateKey, 'pkcs1-private-pem', {
        'encryptionScheme': 'pkcs1'
    });

}

Crypto.prototype.rsaDecrypt = function(str) {
    return this.rsa.decrypt(str).toString();
};

module.exports = Crypto;