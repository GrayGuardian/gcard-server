
// 该文件通过工具生成，请勿更改

let tpl = {}

tpl.fields = ["arg1","arg2","arg3","arg4","arg5","arg6","arg7"]

tpl.types = {
	arg1:"int",
	arg2:"float",
	arg3:"bool",
	arg4:"string",
	arg5:"test1$arg1",
	arg6:"table[aaa=int&bbb=string]",
	arg7:"array[table[aaa=int&bbb=string]]",
}

tpl.data = [
	{ arg1:50, arg2:150.5, arg3:true, arg4:"测试文本", arg5:15, arg6:{ aaa:123321, bbb:"djkfjkjgdf", }, arg7:[ { aaa:123321, bbb:"djkfjkjgdf", }, { aaa:123321, bbb:"djkfjkjgdf", }, ], },
]

module.exports = tpl
