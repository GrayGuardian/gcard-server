// 该文件通过工具生成，请勿更改

let tpl = {}

tpl.fields = ["id","code","tip"]

tpl.types = {
	id:"string",
	code:"int",
	tip:"text$id",
}

tpl.data = [
	{ id:"SUCCESS", code:0, tip:300101, },
	{ id:"UNKNOWN_ERROR", code:50001, tip:300102, },
	{ id:"TIMEOUT", code:50002, tip:300103, },
	{ id:"HTTP_ERROR", code:50003, tip:null, },
	{ id:"SOCKET_ERROR", code:50004, tip:null, },
	{ id:"ROUTER_ERROR", code:50005, tip:300115, },
	{ id:"RPC_DATA_ERROR", code:50006, tip:300116, },
	{ id:"RET_DATA_ERROR", code:50007, tip:300116, },
	{ id:"DB_ERROR", code:50008, tip:300117, },
	{ id:"TOKEN_ERROR", code:50009, tip:300118, },
	{ id:"DATA_NOTEXIST", code:50010, tip:300107, },
	{ id:"REPEAT_LOGIN", code:50011, tip:300119, },
	{ id:"PASSWORD_NOTSAME", code:50012, tip:300109, },
	{ id:"UID_EXIST", code:50013, tip:300120, },
	{ id:"USERNAME_EXIST", code:50014, tip:300110, },
	{ id:"USERNAME_NOTVALID", code:50015, tip:300111, },
	{ id:"PASSWORD_NOTVALID", code:50016, tip:300112, },
	{ id:"PASSWORD_ERROR", code:50017, tip:300113, },
	{ id:"USER_BAN", code:50018, tip:300114, },
	{ id:"AREA_MAINTENANCE", code:50019, tip:300121, },
	{ id:"GAMENAME_EXIST", code:50020, tip:300122, },
	{ id:"GAMENAME_NOTVALID", code:50021, tip:300123, },
	{ id:"PLAYER_SUM_MAX", code:50022, tip:300124, },
	{ id:"VERSION_GET_ERROR", code:50023, tip:null, },
]

module.exports = tpl