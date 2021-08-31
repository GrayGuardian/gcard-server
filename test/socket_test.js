require("../common/base/global")()


var arg = process.argv;

const HOST = '127.0.0.1'
const PORT = 8101
const TOKENS = [
    // pid: 'bvdf1450-058b-11ec-988a-a30baafb095f',
    // uid: '02eeae80-0597-11ec-bb2f-f1a3f89aa716',
    // aid: 1,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMmVlYWU4MC0wNTk3LTExZWMtYmIyZi1mMWEzZjg5YWE3MTYiLCJhaWQiOjEsInBpZCI6ImJ2ZGYxNDUwLTA1OGItMTFlYy05ODhhLWEzMGJhYWZiMDk1ZiIsImlhdCI6MTYzMDM5MjAzMiwiZXhwIjoxNjMwNDc4NDMyfQ.72QKKBAFGWXl42A_FwAPw_cEq2lLNq6fyjSNJspUB2c',
];
const TOKEN_ORDER = Number(arg.splice(2)) % TOKENS.length


let client = new SocketClient(HOST, PORT)
client.use(SocketClient.EVENT_TYPE.OnConnectSuccess, async (ctx, next) => {
    client.send(SOCKET_EVENT.DATA,
        pb.encode("socket.rpc", { router: 'conn', conn: { token: TOKENS[TOKEN_ORDER] } })
    )
})
client.use(SocketClient.EVENT_TYPE.OnReceive, async (ctx, next) => {
    let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
    let router = dataPack.router;
    let data = dataPack[router];
    console.log(router, ">>>", data);
})
client.use(SocketClient.EVENT_TYPE.OnDisConnect, async (ctx, next) => {
    console.log("断开连接");
})
client.connect(
    () => {
        console.log('连接成功');
    },
    () => {
        console.log('连接失败');
    }
)