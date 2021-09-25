#!/usr/bin/python
#coding=utf-8
import sys
import os
import re
import xlrd
reload(sys)
sys.setdefaultencoding('utf-8')
# Excel文件所在目录
excelDir = os.getcwd()
# Excel文件扩展名 不同版本的xlrd支持的扩展名不同
excelExtension = ".xls"
# Excel表对象字典
excelSheetDic = {}
# Excel表格字段类型字典 = {}
excelFieldTypeDic = {}
# Excel表格黑名单目录
excelBlackList = ['test','test1']	# 放置了两个模板Excel 忽略生成
# excelBlackList = []
# 导出JS根目录
BUILD_DIR_JS_ROOT = "../../common/template/"
# 导出JS_DATA目录
BUILD_DIR_JS_DATA = BUILD_DIR_JS_ROOT + "data"
# 导出JS_MODEL目录
BUILD_DIR_JS_MODEL = BUILD_DIR_JS_ROOT + "model"
# 导出JS_MANAGER目录
BUILD_DIR_JS_MANAGER = BUILD_DIR_JS_ROOT + "manager"
# 导出JS_TEMPLATE文件
BUILD_FILE_JS_TEMPLATE = BUILD_DIR_JS_ROOT + "template.js"
# 导出LUA根目录
BUILD_DIR_LUA_ROOT = "D:\\testtttt\\Assets\\Resources\\AssetBundles\\lua\\template\\"
# 导出LUA_DATA目录
BUILD_DIR_LUA_DATA = BUILD_DIR_LUA_ROOT + "data"
# 导出LUA_MODEL目录
BUILD_DIR_LUA_MODEL = BUILD_DIR_LUA_ROOT + "model"
# 导出LUA_MANAGER目录
BUILD_DIR_LUA_MANAGER = BUILD_DIR_LUA_ROOT + "manager"
# 导出LUA_TEMPLATE文件
BUILD_FILE_LUA_TEMPLATE = BUILD_DIR_LUA_ROOT + "template.lua.txt"
# 获取文件文本
def readFileText(filepath):
	if(os.path.exists(filepath)):
		file = open(filepath, "r+")
	 	return file.read()
	return ''
# 字符串解析
def format(str,table,cnt=None):
	result = str
	for key in table:
		value = table[key]
		if(cnt==None):
			result = result.replace('{{{}}}'.format(key), value)
		else:
			result = result.replace('{{{}}}'.format(key), value,cnt)
		
	return result

# 代码模板 - JS
CODE_TEMPLATE_JS = {
	"DATA":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_js_data.txt")),
	"MODEL":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_js_model.txt")),
	"MANAGER":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_js_manager.txt")),
	"TEMPLATE":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_js_template.txt")),
	"EDITOR":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_js_editor.txt")),
	"NOTEDITOR":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_js_noteditor.txt")),
};
for key in CODE_TEMPLATE_JS:
	CODE_TEMPLATE_JS[key] = format(CODE_TEMPLATE_JS[key],CODE_TEMPLATE_JS)
# 代码模板 - Lua
CODE_TEMPLATE_LUA = {
	"DATA":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_lua_data.txt")),
	"MODEL":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_lua_model.txt")),
	"MANAGER":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_lua_manager.txt")),
	"TEMPLATE":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_lua_template.txt")),
	"EDITOR":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_lua_editor.txt")),
	"NOTEDITOR":readFileText("{}\\{}".format(os.getcwd(),"code_template\\code_template_lua_noteditor.txt")),
};
for key in CODE_TEMPLATE_LUA:
	CODE_TEMPLATE_LUA[key] = format(CODE_TEMPLATE_LUA[key],CODE_TEMPLATE_LUA)


# 遍历得到所有Excel文件
for root, dirs, files in os.walk(excelDir):
	for file in files:
		excelName = os.path.splitext(file)[0]
		# 判断黑名单
		if excelBlackList.count(excelName)>0 :
			continue;
		# 判断扩展名
		if file.endswith(excelExtension):
			if(excelSheetDic.has_key(file)):
				# 重复的Excel表格，抛出异常
				raise Exception("Repetition ExcelFile [{}]".format(file))
			fullPath = root + "\\" + file;
			book = xlrd.open_workbook(fullPath)
			sheet = book.sheet_by_name("Sheet1")
			nrows = sheet.nrows
			if nrows <= 3:
				# 行数太少，基础信息不全，抛出异常
				raise Exception("Configs Missing [{}]".format(file))
			excelSheetDic[excelName] = sheet;
			excelFieldTypeDic[excelName] = {}
			fields = sheet.row_values(1)
			types = sheet.row_values(2)
			for i in xrange(len(fields)):
				excelFieldTypeDic[excelName][fields[i]] = types[i]

# 将Excel字段值转为代码字符串
def getDataCode(name,typeStr,valueStr,formatArray,formatTable,formatKeyAndValue):
	if typeStr == "int":
		return str(int(valueStr)) 
	elif typeStr == "float":
		return str(float(valueStr))
	elif typeStr == "bool":
		try:
			return "true" if 0!=int(valueStr) else 'false';
		except:
			return "false"
	elif typeStr == "string":
		return str("\""+valueStr+"\"")

	# 复杂参数处理
	# 正则判断是否是table
	temp = re.match(r'^table\[(.*?)\]$', typeStr)
	if(temp!=None):
		# table处理
		try:
			tarr = temp.group(1).split('&')
			tableStr = ''
			typeDic = {};
			for i in xrange(0,len(tarr)):
				temp = tarr[i].split('=')
				typeDic[temp[0]] = temp[1]
			for v in valueStr.split('&'):
				temp = v.split('=');
				key = temp[0];
				value = temp[1];

				tableStr += formatKeyAndValue.format(key,getDataCode(name,typeDic[key],value,formatArray,formatTable,formatKeyAndValue));

			return formatTable.format(tableStr);
		except:
			raise Exception("table format error [{}] [{}] [{}]".format(name,typeStr,valueStr))
	# 正则判断是否是array
	temp = re.match(r'^array\[(.*?)\]$', typeStr)
	if(temp!=None):
		# array处理
		try:
			arrayStr = ''
			for v in valueStr.split(','):
				arrayStr += " {},".format(getDataCode(name,temp.group(1),v,formatArray,formatTable,formatKeyAndValue));

			return formatArray.format(arrayStr);
		except:
			raise Exception("array format error [{}] [{}] [{}]".format(name,typeStr,valueStr))
	# 判断是否是表格关联字段
	temp = typeStr.split('$')
	if len(temp) > 1:
		# 关联其他表	这里只是去获取对应表字段的类型序列化 具体关联需要在使用逻辑层去处理关联
		try:
			return getDataCode(name,excelFieldTypeDic[temp[0]][temp[1]],valueStr,formatArray,formatTable,formatKeyAndValue)
		except:
			raise Exception("tbl format error [{}] [{}] [{}]".format(name,typeStr,valueStr))
			
	return 'null'
# 根据模板生成并保留可编辑区块代码
# code_template 生成代码模板
# code 可编辑区块代码获取源代码
# editor_template 可编辑区块代码模板
def createEditorCode(code_template,code,editor_template):
	result = code_template
	regular = format(editor_template,{'code':'(.*?)'})
	codes = re.compile(regular,re.DOTALL).findall(code)
	if(len(codes)>0):
		for i in xrange(0,len(codes)):
			code = codes[i]
			result = format(result,{"code":code},1)
	else:
		result = format(result,{"code":''})
	return result;
# 现有代码生成不可编辑区块代码
# code 现有代码
# notEditor_codes 生成代码数组
# notEditor_template 不可编辑区块代码模板
def createNotEditorCode(code,notEditor_codes,notEditor_template):
	result = code;
	regular = format(notEditor_template,{'code':'(.*?)'})
	codes = re.compile(regular,re.DOTALL).findall(code)
	if(len(codes)>0):
		for i in xrange(0,len(codes)):
			old = format(notEditor_template,{'code':codes[i]})
			new = format(notEditor_template,{'code':notEditor_codes[i]})
			result = result.replace(old,new,1)
	return result

# 生成代码 - JS
# 生成Js数据代码
def createJsDataCode(name,sheet):
	# 根据Excel内容生成
	fields = sheet.row_values(1)
	types = sheet.row_values(2)
	dataCode = ''
	for i in xrange(3,sheet.nrows):
		dataStr = '';
		values = sheet.row_values(i);
		for j in xrange(len(values)):
			field = fields[j]
			value = values[j]
			dataStr += " {}:{},".format(field,getDataCode(name,types[j],value,"[{} ]","{{{} }}"," {}:{},"))
		dataCode += "\t{{{} }},\n".format(dataStr);	
	dataCode = dataCode.strip('\n')

	fileCode = '"{}"'.format('","'.join(fields));

	typeCode = ''
	for i in xrange(0,len(fields)):
		typeCode += '\t{}:"{}",\n'.format(fields[i],types[i]);
	typeCode = typeCode.strip('\n')

	return format(CODE_TEMPLATE_JS['DATA'],{"fileCode":fileCode,"typeCode":typeCode,"dataCode":dataCode})
# 生成Js实体类代码
def createJsModelCode(name,code):
	result = createEditorCode(CODE_TEMPLATE_JS['MODEL'],code,CODE_TEMPLATE_JS['EDITOR'])
	return format(result,{"name":name});
# 生成Js管理类代码
def createJsManagerCode(name,field,code):
	result = createEditorCode(CODE_TEMPLATE_JS['MANAGER'],code,CODE_TEMPLATE_JS['EDITOR'])

	return format(result,{"name":name,"field":field});
# 生成Js总管理类代码
def createJsTemplateCode():
	code1 = ''
	code2 = ''
	for name in excelSheetDic:
		code1 += format("Template.template_{name} = require('./manager/template_{name}Manager').create()\n",{"name":name})
		code2 += format("\tTemplate.template_{name}.refresh()\n",{"name":name})
	code1 = code1.strip('\n')
	code2 = code2.strip('\n')

	result = format(CODE_TEMPLATE_JS['TEMPLATE'],{"code1":code1,"code2":code2})
	return result
# 生成代码 - Lua
# 生成Lua数据代码
def createLuaDataCode(name,sheet):
	# 根据Excel内容生成
	fields = sheet.row_values(1)
	types = sheet.row_values(2)
	dataCode = ''
	for i in xrange(3,sheet.nrows):
		dataStr = '';
		values = sheet.row_values(i);
		for j in xrange(len(values)):
			field = fields[j]
			value = values[j]
			dataStr += " {}={},".format(field,getDataCode(name,types[j],value,"{{{} }}","{{{} }}"," {}={},"))
		dataCode += "\t{{{} }},\n".format(dataStr);
	dataCode = dataCode.strip('\n')

	fileCode = '"{}"'.format('","'.join(fields));

	typeCode = ''
	for i in xrange(0,len(fields)):
		typeCode += '\t{}="{}",\n'.format(fields[i],types[i]);
	typeCode = typeCode.strip('\n')

	return format(CODE_TEMPLATE_LUA['DATA'],{"fileCode":fileCode,"typeCode":typeCode,"dataCode":dataCode})
# 生成Js实体类代码
def createLuaModelCode(clsName,name,code):
	result = createEditorCode(CODE_TEMPLATE_LUA['MODEL'],code,CODE_TEMPLATE_LUA['EDITOR'])
	return format(result,{"clsName":clsName,"name":name});
# 生成Js管理类代码
def createLuaManagerCode(clsName,name,field,code):
	result = createEditorCode(CODE_TEMPLATE_LUA['MANAGER'],code,CODE_TEMPLATE_LUA['EDITOR'])
	return format(result,{"clsName":clsName,"name":name,"field":field});
# 生成Lua总管理类代码
def createLuaTemplateCode():
	code1 = ''
	code2 = ''
	for name in excelSheetDic:
		code1 += format("Template.template_{name} = require('template_{name}Manager'):new()\n",{"name":name})
		code2 += format("\tTemplate.template_{name}:refresh()\n",{"name":name})
	code1 = code1.strip('\n')
	code2 = code2.strip('\n')

	result = format(CODE_TEMPLATE_LUA['TEMPLATE'],{"code1":code1,"code2":code2})
	return result

for (name,sheet) in excelSheetDic.items():
	field = excelSheetDic[name].row_values(1)[0]
	# Js
	filepath = "{}\\{}.{}".format(BUILD_DIR_JS_DATA,"template_{}".format(name),'js')
	file = open(filepath, "w")
	file.write(createJsDataCode(name,sheet));
	print("Build JS_Data_File [{}] >>> [{}]".format(name,filepath));

	filepath = "{}\\{}.{}".format(BUILD_DIR_JS_MODEL,"template_{}Model".format(name),'js')
	code = readFileText(filepath)
	file = open(filepath, "w")
	file.write(createJsModelCode(name,code));
	print("Build JS_Model_File [{}] >>> [{}]".format(name,filepath));


	filepath = "{}\\{}.{}".format(BUILD_DIR_JS_MANAGER,"template_{}Manager".format(name),'js')
	code = readFileText(filepath)
	file = open(filepath, "w")
	file.write(createJsManagerCode(name,field,code));
	print("Build JS_Manager_File [{}] >>> [{}]".format(name,filepath));

	# Lua	
	filepath = "{}\\{}.{}".format(BUILD_DIR_LUA_DATA,"template_{}".format(name),'lua.txt')
	file = open(filepath, "w")
	file.write(createLuaDataCode(name,sheet));
	print("Build LUA_Data_File [{}] >>> [{}]".format(name,filepath));

	clsName = "template_{}Model".format(name)
	filepath = "{}\\{}.{}".format(BUILD_DIR_LUA_MODEL,clsName,'lua.txt')
	code = readFileText(filepath)
	file = open(filepath, "w")
	file.write(createLuaModelCode(clsName,name,code));
	print("Build LUA_Model_File [{}] >>> [{}]".format(name,filepath));

	clsName = "template_{}Manager".format(name)
	filepath = "{}\\{}.{}".format(BUILD_DIR_LUA_MANAGER,clsName,'lua.txt')
	code = readFileText(filepath)
	file = open(filepath, "w")
	file.write(createLuaManagerCode(clsName,name,field,code));
	print("Build LUA_Manager_File [{}] >>> [{}]".format(name,filepath));

# Js
filepath = BUILD_FILE_JS_TEMPLATE
file = open(filepath, "w")
file.write(createJsTemplateCode());
# Lua
filepath = BUILD_FILE_LUA_TEMPLATE
file = open(filepath, "w")
file.write(createLuaTemplateCode());