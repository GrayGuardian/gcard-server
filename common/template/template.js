// 该文件通过工具生成，请勿更改

var Template = {};

Template.template_text = require('./manager/template_textManager').create()
Template.template_props = require('./manager/template_propsManager').create()
Template.template_error = require('./manager/template_errorManager').create()

Template.refresh = function () {
	Template.template_text.refresh()
	Template.template_props.refresh()
	Template.template_error.refresh()
}

module.exports = Template;