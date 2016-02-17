function Users() {
    this.storage = {};
}

Users.prototype.getUsersList = function(room) {
    if (!this.storage[room]) return [];
    return Object.keys(this.storage[room]);
};

Users.prototype.userExists = function(room, user) {
    return this.storage[room] && this.storage[room][user];
};

Users.prototype.addUser = function(room, user, socket, key) {
    if (!this.storage[room]) this.storage[room] = {};
    if (!this.storage[room][user]) this.storage[room][user] = {};
    this.storage[room][user]['socket'] = socket;
    this.storage[room][user]['key'] = key;
};

Users.prototype.deleteUser = function(room, user) {
    delete this.storage[room][user];
    if (Object.keys(this.storage[room]).length == 0)
        delete this.storage[room];
};

module.exports = Users;