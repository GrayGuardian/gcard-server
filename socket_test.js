let SocketClient = require("./common/socket/socket_client")
let SOCKET_EVENT = require("./common/socket/socket_event");
let pb = new (require("./common/pb/pb"))();

let client = new SocketClient('127.0.0.1', 8100)
client.use(SocketClient.EVENT_TYPE.OnReceive, async (ctx, next) => {
    let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
    let router = dataPack.router;
    let data = dataPack[router];
    console.log(router, ">>>", data);
})
client.connect(
    () => {
        console.log('连接成功');
        // 发送测试数据
        var post_data = {
            router: 'test',
            test: {}
        };//这是需要提交的数据
        var content = pb.encode("socket.rpc", post_data);
        client.send(SOCKET_EVENT.DATA, content)
    },
    () => {
        console.log('连接失败');
    }
)