
const net = require('net')
const DataBuffer = require("./dataBuffer");
const SocketDataPack = require('./socketDataPack');
const Middleware = require('../utils/middleware')

const HEAD_TIMEOUT = 5000;    // 心跳超时 毫秒
const HEAD_CHECKTIME = 5000;   // 心跳包超时检测 毫秒

var SocketServer = function (host, port) {
    this.host = host
    this.port = port

    this.middlewareMap = new Map();
};

SocketServer.EVENT_TYPE = {
    OnConnect: 0,
    OnDisconnect: 1,
    OnReceive: 2,
    OnSend: 3,
    OnError: 4
};

SocketServer.prototype.use = function (type, cb) {
    if (this.middlewareMap.get(type) == null) {
        this.middlewareMap.set(type, new Middleware());
    }
    this.middlewareMap.get(type).use(cb);
}
SocketServer.prototype.disuse = function (type, cb) {
    if (this.middlewareMap.get(type) == null) {
        return false;
    }
    return this.middlewareMap.get(type).disuse(cb);
}
SocketServer.prototype.next = async function (type, ctx, index) {
    if (this.middlewareMap.get(type) == null) {
        return;
    }
    await this.middlewareMap.get(type).next(ctx, index);
}


SocketServer.prototype.listen = function (cb) {
    this.clientInfoMap = new Map();
    this.dataBuffer = new DataBuffer();

    this.server = new net.createServer();
    this.server.on('error', (ex) => {
        this.next(SocketServer.EVENT_TYPE.OnError, ex)
    });
    this.server.on("connection", (socket) => {
        this.clientInfoMap.set(socket, { headTime: Date.now() });

        this.next(SocketServer.EVENT_TYPE.OnConnect, { socket: socket })

        socket.on("data", (data) => {
            this.dataBuffer.addBuffer(data);
            let dataPack = this.dataBuffer.TryUnpack();
            if (dataPack != null) {
                switch (dataPack.type) {
                    case SOCKET_EVENT.HEARTBEAT:
                        this.receiveHead(socket);
                        break;
                    case SOCKET_EVENT.DISCONN:
                        // 自动会回调close消息，此处可以不需要额外操作
                        // console.log("客户端主动断开连接");
                        break;
                    default:
                        this.next(SocketServer.EVENT_TYPE.OnReceive, { socket: socket, dataPack: dataPack })
                        break;
                }
            }
        });
        socket.on("close", (hadError) => {
            this.next(SocketServer.EVENT_TYPE.OnDisconnect, { socket: socket, hadError: hadError })

            this.closeClient(socket);
        });
        socket.on("error", () => {
        });
    });
    this.server.listen(this.port, this.host, () => {
        this.headCheckInterval = setInterval(() => {
            this.checkHeadTimeOut();
        }, HEAD_CHECKTIME);
        if (cb != null) cb(this);
    });
}
SocketServer.prototype.checkHeadTimeOut = function () {
    var temp = new Map();
    this.clientInfoMap.forEach(function (value, key) {
        temp.set(key, value);
    });
    temp.forEach((info, socket) => {
        let offset = Date.now() - info.headTime;
        if (offset > HEAD_TIMEOUT) {
            // 超时踢出
            // console.log("超时踢出", socket);
            this.kickOut(socket);
        }
    });

}
SocketServer.prototype.send = function (socket, type, data, cb) {
    let dataPack = new SocketDataPack(type, data);
    socket.write(dataPack.buff, "utf8", () => {
        if (cb != null) cb(socket, dataPack);
        this.next(SocketServer.EVENT_TYPE.OnSend, { socket: socket, dataPack: dataPack })
    });
}
SocketServer.prototype.kickOut = function (socket) {
    this.send(socket, SOCKET_EVENT.KICKOUT, null, () => {
        this.closeClient(socket);
    });
}
SocketServer.prototype.kickOutAll = function () {
    var temp = [];
    this.clientInfoMap.forEach(function (value, key) {
        temp.push(key);
    });
    temp.forEach(socket => {
        this.kickOut(socket);
    });

}
SocketServer.prototype.closeClient = function (socket) {
    this.clientInfoMap.delete(socket);
    socket.destroy();
}
SocketServer.prototype.receiveHead = function (socket) {
    this.clientInfoMap.set(socket, { headTime: Date.now() });
    // console.log("更新心跳包间隔 >>> now > ", Date.now());
}
SocketServer.prototype.close = function (cb) {
    if (this.headCheckInterval != null) {
        clearInterval(this.headCheckInterval);
    }
    this.server.close(() => { if (cb != null) cb(); });
}
SocketServer.prototype.address = function () {
    return this.server.address();
}


module.exports = SocketServer