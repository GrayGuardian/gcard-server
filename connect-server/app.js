const app = require("../common/app");

app(() => {
    global.s2sRouter = new (require('./router/s2s_router'))();

    // const S2SClient = require("../common/s2s/s2s_client");
    // let config = serverConfig.getCenterServerFromName(SERVER_NAME);
    // global.s2sClient = new S2SClient(config);
    // s2sClient.connect(
    //     () => {
    //         log.print(`转发服务器[${s2sClient.config.name}]连接成功`);
    //         s2sClient.rpc("http-server1", 'test', null, () => { console.log("接收回调testRet") })
    //     },
    //     () => {
    //         log.error(`转发服务器[${s2sClient.config.name}]连接失败 ${s2sClient.config.host}:${s2sClient.config.port}`);
    //     }
    // );


    global.socketServer = new SocketServer(SERVER_CONFIG.host, SERVER_CONFIG.port);
    socketServer.use(SocketServer.EVENT_TYPE.OnConnect, async (ctx, next) => {
        log.print("用户进入");
        await next();
    })

    socketServer.use(SocketServer.EVENT_TYPE.OnDisconnect, async (ctx, next) => {
        log.print("用户退出");
        await next();
    })

    socketServer.use(SocketServer.EVENT_TYPE.OnReceive, async (ctx, next) => {
        console.log("c2s", ctx.dataPack);
        // 接收
        let dataPack = pb.decode('socket.rpc', ctx.dataPack.data);
        let router = dataPack.router;
        let data = dataPack[router];
        console.log(router, ">>>", data);


        // 发送
        data = pb.encode("socket.rpc", {
            router: 'testRet',
            testRet: {}
        });
        socketServer.send(ctx.socket, SOCKET_EVENT.SEND, data)

        await next();
    })
    socketServer.use(SocketServer.EVENT_TYPE.OnSend, async (ctx, next) => {
        console.log("s2c", ctx.dataPack);
        await next();
    })
    socketServer.use(SocketServer.EVENT_TYPE.OnError, async (ex, next) => {
        log.error(ex);
        await next();
    })

    socketServer.listen(() => {
        log.print(`网关服务器创建成功 ${SERVER_NAME} ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    });


});