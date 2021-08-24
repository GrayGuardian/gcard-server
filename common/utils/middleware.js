var Middleware = function () {
    this.actionArr = [];
}
Middleware.prototype.use = function (cb) {
    this.actionArr.push(cb);
}
Middleware.prototype.disuse = function (cb) {
    let index = this.actionArr.indexOf(cb);
    if (index == -1) return false;
    this.actionArr.splice(index, 1);
    return true;
}
Middleware.prototype.next = async function (ctx, index) {
    ctx = ctx ?? {};
    index = index ?? 0;
    if (index < this.actionArr.length) {
        let next = async () => {
            await this.next(ctx, index + 1);
        }
        let fun = this.actionArr[index];
        await fun(ctx, next)
    }
}
Middleware.prototype.clear = function () {
    this.actionArr = [];
}
module.exports = Middleware;