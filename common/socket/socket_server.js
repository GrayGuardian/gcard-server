
const net = require('net')
const DataBuffer = require("./dataBuffer");
const SocketDataPack = require('./socketDataPack');
const SocketEvent = require('./socket_event');

const HEAD_TIMEOUT = 5000;    // 心跳超时 毫秒
const HEAD_CHECKTIME = 5000;   // 心跳包超时检测 毫秒

var SocketServer = function (host, port) {
    this.host = host
    this.port = port

    this.cb = {};
};
SocketServer.prototype.onConnect = function (socket) {
    this.call("onConnect", socket);
}
SocketServer.prototype.onDisconnect = function (socket, hadError) {
    this.call("onDisconnect", socket, hadError);
}
SocketServer.prototype.onReceive = function (socket, dataPack) {
    this.call("onReceive", socket, dataPack);
}
SocketServer.prototype.onSend = function (socket, dataPack) {
    this.call("onSend", socket, dataPack);
}
SocketServer.prototype.onError = function (ex) {
    this.call("onError", ex);
}

SocketServer.prototype.listen = function (cb) {
    this.clientInfoMap = new Map();
    this.dataBuffer = new DataBuffer();

    this.server = new net.createServer();
    this.server.on('error', (ex) => {
        this.onError(ex);
    });
    this.server.on("connection", (socket) => {
        this.clientInfoMap.set(socket, { headTime: Date.now() });
        this.onConnect(socket);
        socket.on("data", (data) => {
            this.dataBuffer.addBuffer(data);
            let dataPack = this.dataBuffer.TryUnpack();
            if (dataPack != null) {
                switch (dataPack.type) {
                    case SocketEvent.sc_head:
                        this.receiveHead(socket);
                        break;
                    case SocketEvent.sc_disconn:
                        // 自动会回调close消息，此处可以不需要额外操作
                        // console.log("客户端主动断开连接");
                        break;
                    default:
                        this.onReceive(socket, dataPack);
                        break;
                }
            }
        });
        socket.on("close", (hadError) => {
            this.onDisconnect(socket, hadError);
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
            console.log("超时踢出", socket);
            this.kickOut(socket);
        }
    });

}
SocketServer.prototype.send = function (socket, type, data, cb) {
    let dataPack = new SocketDataPack(type, data);
    socket.write(dataPack.buff, "utf8", () => {
        if (cb != null) cb(socket, dataPack);
        this.onSend(socket, dataPack);
    });
}
SocketServer.prototype.kickOut = function (socket) {
    this.send(socket, SocketEvent.sc_kickout, null, () => {
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

SocketServer.prototype.on = function (type, cb) {
    if (type == null || cb == null) return;
    if (this.cb[type] == null) {
        this.cb[type] = [];
    }
    this.cb[type].push(cb);
}
SocketServer.prototype.off = function (type, cb) {
    if (type == null || cb == null || this.cb[type] == null || !Array.isArray(this.cb[type])) return;
    let index = this.cb[type].indexOf(cb);
    if (index >= 0) {
        this.cb[type].splice(index, 1);
    }

}
SocketServer.prototype.call = function (type, arg1, arg2, arg3, arg4) {
    if (type == null || this.cb[type] == null || !Array.isArray(this.cb[type])) return;
    this.cb[type].forEach(cb => {
        cb(arg1, arg2, arg3, arg4);
    });
}


module.exports = SocketServer