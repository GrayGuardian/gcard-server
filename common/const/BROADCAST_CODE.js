const BROADCAST_CODE = {}

BROADCAST_CODE.SOCKET_CHANNEL = function (key) {
    return `SOCKET_CHANNEL_${key}`
}
// 这里通过pid作为SocketId
BROADCAST_CODE.SOCKET_ID = function (pid) {
    return BROADCAST_CODE.SOCKET_CHANNEL(`pid=${pid}`)
}
module.exports = BROADCAST_CODE
