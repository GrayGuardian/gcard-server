var Client = function (cb) {
    this.config = serverConfig.getCenterServerFromConfig(SERVER_CONFIG)
    if (this.config == null) {
        log.error(`未找到[${SERVER_NAME}]对应的中心服务器`);
        return;
    }
    this.client = new SocketClient(this.config.host, this.config.port)
    this.client.connect(() => {
        if (cb != null) cb(this.config);
    }, () => {
        log.error(`中心服务器[${this.config.name}]连接失败 ${this.config.host}:${this.config.port}`);
    })
}

module.exports = Client;