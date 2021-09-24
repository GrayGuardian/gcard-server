// 该文件通过工具生成，请勿更改

let tpl = {}

tpl.fields = ["code","clientTip","serverTip","desc"]

tpl.types = {
	code:"string",
	clientTip:"string",
	serverTip:"string",
	desc:"string",
}

tpl.data = [
	{ code:"SUCCESS", clientTip:"成功", serverTip:"成功", desc:"成功", },
	{ code:"UNKNOWN_ERROR", clientTip:"未知错误", serverTip:"未知错误", desc:"未知错误", },
	{ code:"TIMEOUT", clientTip:"超时", serverTip:"超时", desc:"超时", },
	{ code:"ROUTER_ERROR", clientTip:"网络连接出错", serverTip:"请求路由出错", desc:"请求路由出错", },
	{ code:"RPC_DATA_ERROR", clientTip:"非法操作", serverTip:"参数缺省或格式错误", desc:"服务端接收数据格式出错", },
	{ code:"RET_DATA_ERROR", clientTip:"非法操作", serverTip:"参数缺省或格式错误", desc:"服务端回发数据格式出错", },
	{ code:"DB_ERROR", clientTip:"非法操作", serverTip:"数据库操作出错", desc:"数据库操作出错", },
	{ code:"TOKEN_ERROR", clientTip:"非法访问", serverTip:"Token值错误", desc:"Token值错误", },
	{ code:"DATA_NOTEXIST", clientTip:"数据不存在", serverTip:"数据不存在", desc:"数据不存在", },
	{ code:"REPEAT_LOGIN", clientTip:"您的账号已在其他地方登录", serverTip:"重复登录", desc:"重复登录", },
	{ code:"PASSWORD_NOTSAME", clientTip:"两次密码不相同", serverTip:"两次密码不相同", desc:"两次密码不相同", },
	{ code:"UID_EXIST", clientTip:"未知错误", serverTip:"UID已存在", desc:"UID已存在", },
	{ code:"USERNAME_EXIST", clientTip:"用户名已存在", serverTip:"用户名已存在", desc:"用户名已存在", },
	{ code:"USERNAME_NOTVALID", clientTip:"用户名格式错误：6-15位的大小写字母、数字、下划线、星号", serverTip:"用户名格式错误：6-15位的大小写字母、数字、下划线、星号", desc:"用户名格式错误：6-15位的大小写字母、数字、下划线、星号", },
	{ code:"PASSWORD_NOTVALID", clientTip:"密码格式错误：6-15位的大小写字母、数字、下划线、星号", serverTip:"密码格式错误：6-15位的大小写字母、数字、下划线、星号", desc:"密码格式错误：6-15位的大小写字母、数字、下划线、星号", },
	{ code:"PASSWORD_ERROR", clientTip:"密码错误", serverTip:"密码错误", desc:"密码错误", },
	{ code:"USER_BAN", clientTip:"账号已被封禁", serverTip:"账号已被封禁", desc:"账号已被封禁", },
	{ code:"AREA_MAINTENANCE", clientTip:"区服正在维护", serverTip:"区服正在维护", desc:"区服正在维护", },
	{ code:"GAMENAME_EXIST", clientTip:"游戏名已存在", serverTip:"游戏名已存在", desc:"游戏名已存在", },
	{ code:"GAMENAME_NOTVALID", clientTip:"游戏名格式错误：2-6位的汉字、大小写字母、数字", serverTip:"游戏名格式错误：2-6位的汉字、大小写字母、数字", desc:"游戏名格式错误：2-6位的汉字、大小写字母、数字", },
	{ code:"PLAYER_SUM_MAX", clientTip:"账号内游戏角色已到达上限", serverTip:"账号内游戏角色已到达上限", desc:"账号内游戏角色已到达上限", },
]

module.exports = tpl