const BROADCAST_CODE = {}
BROADCAST_CODE.SOCKET_CHANNEL = function (key) {
    return `SOCKET_CHANNEL_${key}`
}
// 这里通过pid作为SocketId
BROADCAST_CODE.SOCKET_ID = function (pid) {
    return BROADCAST_CODE.SOCKET_CHANNEL(`pid=${pid}`)
}
BROADCAST_CODE.REDIS_KEY_SET = function (key) {
    return `REDIS_KEY_SET_${key}`
}
BROADCAST_CODE.REDIS_KEY_DELETE = function (key) {
    return `REDIS_KEY_DELETE_${key}`
}
BROADCAST_CODE.REDIS_KEY_OUT = function (key) {
    return `REDIS_KEY_OUT_${key}`
}
module.exports = BROADCAST_CODE
