require("../common/base/global")()


var arg = process.argv;

const HOST = '127.0.0.1'
const PORT = 8100
const TOKENS = [
    // pid: 'f43d1450-058b-11ec-988a-a30baafb095f',
    // uid: '5d03fa10-061e-11ec-9f47-1d9317db2b09',
    // aid: 1,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDAzZmExMC0wNjFlLTExZWMtOWY0Ny0xZDkzMTdkYjJiMDkiLCJhaWQiOjEsInBpZCI6ImY0M2QxNDUwLTA1OGItMTFlYy05ODhhLWEzMGJhYWZiMDk1ZiIsImlhdCI6MTYyOTk2MjgwNiwiZXhwIjoxNjMwMDQ5MjA2fQ.j3FMUi_t02UiyBYi5ccbjkZ6Btzu9vlwLw3QaWyrYbo',
    // pid: 'bvdf1450-058b-11ec-988a-a30baafb095f',
    // uid: '02eeae80-0597-11ec-bb2f-f1a3f89aa716',
    // aid: 2,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMmVlYWU4MC0wNTk3LTExZWMtYmIyZi1mMWEzZjg5YWE3MTYiLCJhaWQiOjIsInBpZCI6ImJ2ZGYxNDUwLTA1OGItMTFlYy05ODhhLWEzMGJhYWZiMDk1ZiIsImlhdCI6MTYyOTk2NTg2NSwiZXhwIjoxNjMwMDUyMjY1fQ.F4i3jSHhcw0qSxYSbhnRxip0poOzK5sbqVy-QVIfBW8'
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