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
excelDir += "\\test"
# Excel文件扩展名 不同版本的xlrd支持的扩展名不同
excelExtension = ".xls"
# Excel表对象字典
excelSheetDic = {}
# Excel表格字段类型字典 = {}
excelFieldTypeDic = {}
# 导出JS_DATA目录
buildJSDataDir = excelDir
# 导出LUA_DATA目录
buildLUADataDir = excelDir
# 遍历得到所有Excel文件
for root, dirs, files in os.walk(excelDir):
	for file in files:
		# 判断扩展名
		if file.endswith(excelExtension):
			if(excelSheetDic.has_key(file)):
				# 重复的Excel表格，抛出异常
				raise Exception("Repetition ExcelFile [{}]".format(file))
			fullPath = root + "\\" + file;
			excelName = os.path.splitext(file)[0]
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
	# 判断是否是表格关联字段
	temp = typeStr.split('$')
	if len(temp) > 1:
		# 关联其他表	这里只是去获取对应表字段的类型序列化 具体关联需要在使用逻辑层去处理关联
		try:
			return getDataCode(name,excelFieldTypeDic[temp[0]][temp[1]],valueStr,formatArray,formatTable,formatKeyAndValue)
		except:
			raise Exception("tbl format error [{}] [{}] [{}]".format(name,typeStr,valueStr))
	# 正则判断是否是table
	temp = re.match(r'table\[(.*?)\]$', typeStr)
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
	temp = re.match(r'array\[(.*?)\]$', typeStr)
	if(temp!=None):
		# array处理
		try:
			arrayStr = ''
			for v in valueStr.split(','):
				arrayStr += " {},".format(getDataCode(name,temp.group(1),v,formatArray,formatTable,formatKeyAndValue));

			return formatArray.format(arrayStr);
		except:
			raise Exception("array format error [{}] [{}] [{}]".format(name,typeStr,valueStr))

	return 'null'
# 获取Js代码
def getJsData(name,sheet):
	# 根据Excel内容生成
	fields = sheet.row_values(1)
	types = sheet.row_values(2)
	dataContent = ''
	for i in xrange(3,sheet.nrows):
		dataStr = '';
		values = sheet.row_values(i);
		for j in xrange(len(values)):
			field = fields[j]
			value = values[j]
			dataStr += " {}:{},".format(field,getDataCode(name,types[j],value,"[{} ]","{{{} }}"," {}:{},"))
		dataContent += "\t{{{} }},\n".format(dataStr);	

	content = '''
// 该文件通过工具生成，请勿更改

const tpl = [
{}]

module.exports = tpl
'''

	return content.format(dataContent)

# 获取Json数据
def getLuaData(name,sheet):
	# 根据Excel内容生成
	fields = sheet.row_values(1)
	types = sheet.row_values(2)
	dataContent = ''
	for i in xrange(3,sheet.nrows):
		dataStr = '';
		values = sheet.row_values(i);
		for j in xrange(len(values)):
			field = fields[j]
			value = values[j]
			dataStr += " {}={},".format(field,getDataCode(name,types[j],value,"{{{} }}","{{{} }}"," {}={},"))
		dataContent += "\t{{{} }},\n".format(dataStr);


	content = '''
-- 该文件通过工具生成，请勿更改

local tpl = {{
{}}}

return tpl
'''
	return content.format(dataContent)

for (name,sheet) in excelSheetDic.items():
	filepath = "{}\\{}.{}".format(buildJSDataDir,name,'js')
	file = open(filepath, "w")
	file.write(getJsData(name,sheet));
	print("Build JS_DATA_FILE [{}] >>> [{}]".format(name,filepath));
	filepath = "{}\\{}.{}".format(buildLUADataDir,name,'lua')
	file = open(filepath, "w")
	file.write(getLuaData(name,sheet));
	print("Build LUA_DATA_FILE [{}] >>> [{}]".format(name,filepath));

	# open("{}\\{}.{}".format(jsonDataDir,name,'js'), "w")
	# print(getJsData(name,sheet))
	# print(getLuaData(name,sheet))

