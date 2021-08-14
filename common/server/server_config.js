var ServerConfig = function () { }

ServerConfig.prototype.create = function (configs) {
    this.configs = configs
    this.configNameMap = new Map();
    this.configTypeMap = new Map();;
    configs.forEach(config => {
        this.configNameMap.set(config.name, config)
        let arr = this.configTypeMap.get(config.type);
        if (arr == null) {
            arr = [];
        }
        arr.push(config);
        this.configTypeMap.set(config.type, arr);
    });
}
// 根据服务器名字获取服务器
ServerConfig.prototype.getServerFromName = function (name) {
    for (const key in this.configs) {
        let config = this.configs[key];
        if (config.name == name) {
            return config;
        }
    }
    return null;
}
// 根据服务器名字获取转发服务器配置
ServerConfig.prototype.getCenterServerFromName = function (name) {
    try {
        let config = this.configNameMap.get(name);
        let arr = this.configTypeMap.get(ServerType.Center);
        let index = this.configTypeMap.get(config.type).indexOf(config) % arr.length;
        return arr[index];
    }
    catch {
        return null;
    }
}

module.exports = ServerConfig;