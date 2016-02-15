function Crypto() {

    this.serverKey = "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC67yKo8HKg0z36BLscRyNcgXwK\n" +
        "t6OW/l6L7CloJrfmngEvoamdCyYcVKOpG9/DyBWG3NSfnAzcMw/FOeKQJEXiBZK3\n" +
        "lvWJO48QB7zZ/gBK8n/b10aplco80lJRzTWa2IAtqA5uSPqaUaWWVdPfvCech1z1\n" +
        "iazzG40POI/BwY0/LQIDAQAB\n" +
        "-----END PUBLIC KEY-----";

    this.rsa = new JSEncrypt();
    this.rsa.setPublicKey(this.serverKey);

}

Crypto.prototype.rsaEncrypt = function(str) {
    return this.rsa.encrypt(str);
};