const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Middleware = require('../base/middleware')

const Property = async (ctx, next) => {
    ctx.buff = null;
    ctx.data = null;
    ctx.state = {};
    ctx.state.method = ctx.request.method;
    ctx.method = {}
    ctx.method.write = (chunk, encoding, callback) => { return ctx.response.write(chunk, encoding, callback); };
    ctx.method.end = (data, encoding, callback) => { return ctx.response.end(data, encoding, callback); };
    await next();
}
const GetBuff = async (ctx, next) => {
    let buffArr = [];
    let buffLen = 0;
    ctx.request.on("data", (buff) => {
        buffArr.push(buff)
        buffLen += buff.length;
    })
    ctx.request.on("end", async () => {
        ctx.buff = Buffer.concat(buffArr, buffLen);
        await next();
    })
}
const ParseBuff = async (ctx, next) => {
    if (ctx.buff.length > 0) {
        let contentType = ctx.request.headers['content-type'];
        switch (contentType) {
            case "application/x-www-form-urlencoded":
                ctx.data = querystring.parse(ctx.buff.toString());
                break;
            case "text/plain":
                ctx.data = ctx.buff.toString();
                break;
            case "application/javascript":
                ctx.data = ctx.buff.toString();
                break;
            case "application/json":
                ctx.data = ctx.buff.toString();
                break;
            case "text/html":
                ctx.data = ctx.buff.toString();
                break;
            case "application/xml":
                ctx.data = ctx.buff.toString();
                break;
            default:
                ctx.data = ctx.buff;
                break;
        }
    } else {
        ctx.data = url.parse(ctx.request.url, true).query
    }
    await next();
}


var Server = function (host, port) {
    this.host = host
    this.port = port

    this.middleware = new Middleware();

    // 默认中间件处理
    // 增加ctx属性
    this.use(Property);
    // 读取Body
    this.use(GetBuff);
    // 解析参数
    this.use(ParseBuff);
}
Server.prototype.use = function (cb) {
    this.middleware.use(cb);
}
Server.prototype.disuse = function (cb) {
    return this.middleware.disuse(cb);
}
Server.prototype.next = async function (ctx, index) {
    await this.middleware.next(ctx, index);
}
Server.prototype.listen = function (cb) {
    this.server = http.createServer((request, response) => { this.onReceive(request, response) }).listen(this.port, this.host, () => {
        if (cb != null) cb(this);
    });
}
Server.prototype.onReceive = function (request, response) {
    this.next({ request: request, response: response })
}

module.exports = Server;