const net = require('net');
const DataBuffer = require("./dataBuffer");
const SocketDataPack = require('./socketDataPack');
const SOCKET_EVENT = require('./socket_event');
const Middleware = require('../base/middleware')

const HEAD_OFFSET = 2000;   //心跳包发送间隔 毫秒
const RECONN_MAX_SUM = 3;   //最大重连次数

var SocketClient = function (host, port) {
    this.host = host
    this.port = port

    this.isConnect = false;

    this.middlewareMap = new Map();
}

SocketClient.EVENT_TYPE = {
    OnConnectSuccess: 0,
    OnConnectError: 1,
    OnDisConnect: 2,
    OnReceive: 3,
    OnSend: 4,
    OnError: 5,
    OnReconnecting: 6,
    OnReConnectSuccess: 7,
    OnReConnectError: 8
};

SocketClient.prototype.use = function (type, cb) {
    if (this.middlewareMap.get(type) == null) {
        this.middlewareMap.set(type, new Middleware());
    }
    this.middlewareMap.get(type).use(cb);
}
SocketClient.prototype.disuse = function (type, cb) {
    if (this.middlewareMap.get(type) == null) {
        return false;
    }
    return this.middlewareMap.get(type).disuse(cb);
}
SocketClient.prototype.next = async function (type, ctx, index) {
    if (this.middlewareMap.get(type) == null) {
        return;
    }
    await this.middlewareMap.get(type).next(ctx, index);
}


SocketClient.prototype.connect = function (success, error) {
    this.dataBuffer = new DataBuffer();

    this.client = new net.Socket();
    this.client.on('error', (ex) => {
        switch (ex.code) {
            case "ECONNREFUSED":
                if (error != null) error();
                this.next(SocketClient.EVENT_TYPE.OnConnectError);
                break;
            default:
                this.next(SocketClient.EVENT_TYPE.OnError, ex);
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
                    this.next(SocketClient.EVENT_TYPE.OnReceive, { dataPack: dataPack });
                    break;
            }
        }
    });
    this.client.on('close', (hadError) => {
        if (this.isConnect) {
            if (!hadError) {
                // 正常关闭
                this.next(SocketClient.EVENT_TYPE.OnDisConnect);
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
        this.next(SocketClient.EVENT_TYPE.OnConnectSuccess);
    });

}
// 断线重连
SocketClient.prototype.reConnect = function (num, index) {
    num = num == null ? RECONN_MAX_SUM : num;
    index = index == null ? 0 : index;

    num--;
    index++;
    if (num < 0) {
        this.next(SocketClient.EVENT_TYPE.OnDisConnect);
        return;
    }
    this.next(SocketClient.EVENT_TYPE.OnReconnecting, { index: index });
    this.connect(() => {
        this.next(SocketClient.EVENT_TYPE.OnReConnectSuccess, { index: index });
    }, () => {
        this.next(SocketClient.EVENT_TYPE.OnReConnectError, { index: index });
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
        this.next(SocketClient.EVENT_TYPE.OnSend, { dataPack: dataPack });
    });
}

module.exports = SocketClient