var Router = function () { }

Router.prototype.conn = async function (socket, s2sdata, data, next) {
    log.print(`转发服务器进入用户[${data.config.name}] ${data.config.host}:${data.config.port}`)
    s2sServer.clientMap.set(s2sdata.from, socket)
    next();
}

module.exports = Router;