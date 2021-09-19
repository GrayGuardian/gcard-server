// 该文件通过工具生成，请勿更改

var Template = {};

Template.template_test = require('./manager/template_testManager').create()
Template.template_test1 = require('./manager/template_test1Manager').create()
Template.template_props = require('./manager/template_propsManager').create()
Template.template_error_info = require('./manager/template_error_infoManager').create()

Template.refresh = function () {
	Template.template_test.refresh()
	Template.template_test1.refresh()
	Template.template_props.refresh()
	Template.template_error_info.refresh()
}

module.exports = Template;