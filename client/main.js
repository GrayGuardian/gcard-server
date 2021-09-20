
var mian = async function () {
    // await require("../common/base/global")();

    // log.print({ sadghas: 123 }, { fdsajjl: 12345 }, "sjdlsjdkl")
    // return;
    const HOST = '127.0.0.1'
    const PORT = 8200

    global.httpClient = new (require("./http_client"))(HOST, PORT);

    const username = 'vsdf123'
    const password = '1djkfls';
    const aid = 1;

    var playerOrder = 0;


    await httpClient.send('login', { username: username, password: password })
    let players = (await httpClient.send('enterArea', { aid: aid })).data.players
    playerOrder = playerOrder >= players.length ? players.length - 1 : playerOrder
    let player = players[playerOrder];

    let result = await httpClient.send('enterGame', { pid: player.pid })
    let token = result.data.token
    let config = result.data.config;

    new Middleware().use((ctx, next) => {
        global.socketClient = new (require("./socket_client"))(config.host, config.port, token);
        socketClient.connect(
            () => {
                console.log('连接成功')
                next();
            },
            () => {
                console.log('连接失败')
            }
        );
    }).use((ctx, next) => {
        // 连上的操作
        socketClient.send("test", { text: "我是客户端发送的测试消息" });
    }).next();
}

mian();