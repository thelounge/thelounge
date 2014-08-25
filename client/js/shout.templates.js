(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['chan'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n<button data-id=\""
    + escapeExpression(((helper = helpers.id || (depth0 && depth0.id)),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-target=\"#chan-"
    + escapeExpression(((helper = helpers.id || (depth0 && depth0.id)),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"chan "
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\">\n	<span class=\"badge\"></span>\n	<span class=\"close\"></span>\n	"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\n</button>\n";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.channels), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});
templates['chat'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "\n<div id=\"chan-"
    + escapeExpression(((helper = helpers.id || (depth0 && depth0.id)),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + escapeExpression(((helper = helpers.id || (depth0 && depth0.id)),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"chan "
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\"header\">\n		<button class=\"lt\"></button>\n		<button class=\"rt\"></button>\n		<span class=\"title\">"
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"topic\">"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + " </span>\n	</div>\n	<div class=\"chat\">\n		";
  stack1 = (helper = helpers.equal || (depth0 && depth0.equal) || helperMissing,helper.call(depth0, 100, ((stack1 = (depth0 && depth0.messages)),stack1 == null || stack1 === false ? stack1 : stack1.length), {"name":"equal","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n		<div class=\"messages\">\n			"
    + escapeExpression((helper = helpers.partial || (depth0 && depth0.partial) || helperMissing,helper.call(depth0, "msg", {"name":"partial","hash":{},"data":data})))
    + "\n		</div>\n	</div>\n	<aside class=\"sidebar\">\n		<div class=\"users\">\n			"
    + escapeExpression((helper = helpers.partial || (depth0 && depth0.partial) || helperMissing,helper.call(depth0, "user", {"name":"partial","hash":{},"data":data})))
    + "\n		</div>\n	</aside>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n		<button class=\"show-more\" data-id=\""
    + escapeExpression(((helper = helpers.id || (depth0 && depth0.id)),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n			Show more\n		</button>\n		";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.channels), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});
templates['msg'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, buffer = "\n<div class=\"msg "
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\">\n	<span class=\"time\">\n		"
    + escapeExpression((helper = helpers.tz || (depth0 && depth0.tz) || helperMissing,helper.call(depth0, (depth0 && depth0.time), {"name":"tz","hash":{},"data":data})))
    + "\n	</span>\n	<span class=\"from\">\n		";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.from), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</span>\n	<span class=\"text\">\n		<em class=\"type\">"
    + escapeExpression(((helper = helpers.type || (depth0 && depth0.type)),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "</em>\n		";
  stack1 = (helper = helpers.equal || (depth0 && depth0.equal) || helperMissing,helper.call(depth0, (depth0 && depth0.type), "image", {"name":"equal","hash":{},"fn":this.program(4, data),"inverse":this.program(6, data),"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n	</span>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n		<button class=\"user\">"
    + escapeExpression(((helper = helpers.from || (depth0 && depth0.from)),(typeof helper === functionType ? helper.call(depth0, {"name":"from","hash":{},"data":data}) : helper)))
    + "</button>\n		";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n		<img src=\""
    + escapeExpression(((helper = helpers.text || (depth0 && depth0.text)),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "\" class=\"image\">\n		";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, buffer = "\n		";
  stack1 = (helper = helpers.uri || (depth0 && depth0.uri) || helperMissing,helper.call(depth0, (depth0 && depth0.text), {"name":"uri","hash":{},"data":data}));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n		";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.messages), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});
templates['network'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;
  return "\n<section id=\"network-"
    + escapeExpression(((helper = helpers.id || (depth0 && depth0.id)),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"network\">\n	"
    + escapeExpression((helper = helpers.partial || (depth0 && depth0.partial) || helperMissing,helper.call(depth0, "chan", {"name":"partial","hash":{},"data":data})))
    + "\n</section>\n";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.networks), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});
templates['user'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, functionType="function", escapeExpression=this.escapeExpression;
  return "\n<div class=\"count\">\n	<input class=\"search\" placeholder=\""
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.users)),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " users\">\n</div>\n";
},"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n	<button class=\"user\">"
    + escapeExpression(((helper = helpers.mode || (depth0 && depth0.mode)),(typeof helper === functionType ? helper.call(depth0, {"name":"mode","hash":{},"data":data}) : helper)))
    + escapeExpression(((helper = helpers.name || (depth0 && depth0.name)),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</button>\n	";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.users)),stack1 == null || stack1 === false ? stack1 : stack1.length), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<div class=\"names\">\n	";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.users), {"name":"each","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n</div>\n";
},"useData":true});
})();