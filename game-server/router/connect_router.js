var Router = function () { }
Router.prototype.test = async function (ctx, next) {


    await lock.MODEL_PLAYER().use(async (lock) => {
        let model = await serverLogic.getPlayerModel(ctx.state.pid)

        await model.updateClientData();

        lock.success()
    })
    await next();
}

module.exports = Router;