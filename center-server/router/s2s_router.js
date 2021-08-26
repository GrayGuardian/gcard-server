var Router = function () { }

Router.prototype.conn = async function (ctx, next) {
    let data = ctx.state.data;
    let s2sdata = ctx.state.s2sdata;
    log.print(`转发服务器进入用户[${data.config.name}] ${data.config.host}:${data.config.port}`)
    s2sServer.clientMap.set(s2sdata.from, ctx.socket)
    ctx.method.callback();
    await next();
}

module.exports = Router;