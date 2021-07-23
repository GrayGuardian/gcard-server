var ServerConfig = function () { }

ServerConfig.prototype.create = function (configs) {
    this.configs = configs
}
ServerConfig.prototype.getConfigFromName = function (name) {
    for (const key in this.configs) {
        let config = this.configs[key];
        if (config.name == name) {
            return config;
        }
    }
    return null;
}

module.exports = ServerConfig;