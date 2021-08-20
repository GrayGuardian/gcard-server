var Router = function () { }

Router.prototype.test = async function (socket, s2sdata, data, next) {
    console.log("test logic event")
    next();
}

module.exports = Router;