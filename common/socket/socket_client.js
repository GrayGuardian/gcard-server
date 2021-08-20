const net = require('net');
const DataBuffer = require("./dataBuffer");
const SocketDataPack = require('./socketDataPack');
const SOCKET_EVENT = require('./socket_event');

const HEAD_OFFSET = 2000;   //心跳包发送间隔 毫秒
const RECONN_MAX_SUM = 3;   //最大重连次数

var SocketClient = function (host, port) {
    this.host = host
    this.port = port

    this.isConnect = false;
    this.cb = [];
}

SocketClient.prototype.onConnectSuccess = function () {
    this.call("onConnectSuccess");
}
SocketClient.prototype.onConnectError = function () {
    this.call("onConnectError");
}
SocketClient.prototype.onDisConnect = function () {
    this.call("onDisConnect");
}
SocketClient.prototype.onReceive = function (dataPack) {
    this.call("onReceive", dataPack);
}
SocketClient.prototype.onSend = function (dataPack) {
    this.call("onSend", dataPack);
}
SocketClient.prototype.onError = function (ex) {
    this.call("onError", ex);
}
SocketClient.prototype.onReconnecting = function (index) {
    this.call("onReconnecting", index);
}
SocketClient.prototype.onReConnectSuccess = function (index) {
    this.call("onReConnectSuccess", index);
}
SocketClient.prototype.onReConnectError = function (index) {
    this.call("onReConnectError", index);
}

SocketClient.prototype.connect = function (success, error) {
    this.dataBuffer = new DataBuffer();

    this.client = new net.Socket();
    this.client.on('error', (ex) => {
        switch (ex.code) {
            case "ECONNREFUSED":
                if (error != null) error();
                this.onConnectError();
                break;
            default:
                this.onError(ex);
                break;
        }
    });
    this.client.on('data', (data) => {
        this.dataBuffer.addBuffer(data);
        let dataPack = this.dataBuffer.TryUnpack();
        if (dataPack != null) {
            switch (dataPack.type) {
                case SOCKET_EVENT.KICKOUT:
                    // 自动会回调close消息，此处可以不需要额外操作
                    // 服务端踢出
                    break;
                default:
                    this.onReceive(dataPack);
                    break;
            }
        }
    });
    this.client.on('close', (hadError) => {
        if (this.isConnect) {
            if (!hadError) {
                // 正常关闭
                this.onDisConnect();
            }
            else {
                // 异常关闭，尝试重连
                this.reConnect();
            }
        }
        this.isConnect = false;
        this.close();
    });
    this.client.connect(this.port, this.host, () => {
        this.isConnect = true;

        this.headBeatInterval = setInterval(() => {
            this.send(SOCKET_EVENT.HEARTBEAT)
        }, HEAD_OFFSET);

        if (success != null) success();
        this.onConnectSuccess();
    });

}
// 断线重连
SocketClient.prototype.reConnect = function (num, index) {
    num = num == null ? RECONN_MAX_SUM : num;
    index = index == null ? 0 : index;

    num--;
    index++;
    if (num < 0) {
        this.onDisConnect();
        return;
    }
    this.onReconnecting(index);
    this.connect(() => {
        this.onReConnectSuccess(index);
    }, () => {
        this.onReConnectError(index);
        this.reConnect(num, index);
    });
}
// 断开连接
SocketClient.prototype.disConnect = function () {
    if (!this.isConnect) return;
    this.send(SOCKET_EVENT.DISCONN)
    this.close();
}

SocketClient.prototype.close = function () {
    if (this.headBeatInterval != null) {
        clearInterval(this.headBeatInterval);
    }
    if (this.isConnect) {
        this.client.destroy();
    }
}

SocketClient.prototype.send = function (type, data, cb) {
    let dataPack = new SocketDataPack(type, data);
    this.client.write(dataPack.buff, "utf8", () => {
        if (cb != null) cb();
        this.onSend(dataPack);
    });
}

SocketClient.prototype.on = function (type, cb) {
    if (type == null || cb == null) return;
    if (this.cb[type] == null) {
        this.cb[type] = [];
    }
    this.cb[type].push(cb);
}
SocketClient.prototype.off = function (type, cb) {
    if (type == null || cb == null || this.cb[type] == null || !Array.isArray(this.cb[type])) return;
    let index = this.cb[type].indexOf(cb);
    if (index >= 0) {
        this.cb[type].splice(index, 1);
    }

}
SocketClient.prototype.call = function (type, arg1, arg2, arg3, arg4) {
    if (type == null || this.cb[type] == null || !Array.isArray(this.cb[type])) return;
    this.cb[type].forEach(cb => {
        cb(arg1, arg2, arg3, arg4);
    });
}


module.exports = SocketClient