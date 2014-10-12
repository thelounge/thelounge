(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['chan'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-target=\"#chan-"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"chan "
    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\">\r\n	<span class=\"badge\" data-count=\""
    + escapeExpression(((helper = (helper = helpers.unread || (depth0 != null ? depth0.unread : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"unread","hash":{},"data":data}) : helper)))
    + "\">";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.unread : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</span>\r\n	<span class=\"close\"></span>\r\n	<span class=\"name\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.unread || (depth0 != null ? depth0.unread : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"unread","hash":{},"data":data}) : helper)));
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.channels : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['chat'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div id=\"chan-"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"chan "
    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "\">\r\n	<div class=\"header\">\r\n		<button class=\"lt\"></button>\r\n		<button class=\"rt\"></button>\r\n		<div class=\"right\">\r\n			<button class=\"button close\">\r\n";
  stack1 = ((helpers.equal || (depth0 && depth0.equal) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "lobby", {"name":"equal","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "			</button>\r\n		</div>\r\n		<span class=\"title\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n		<span class=\"topic\">";
  stack1 = ((helpers.parse || (depth0 && depth0.parse) || helperMissing).call(depth0, (depth0 != null ? depth0.topic : depth0), {"name":"parse","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</span>\r\n	</div>\r\n	<div class=\"chat\">\r\n		<div class=\"show-more ";
  stack1 = ((helpers.equal || (depth0 && depth0.equal) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.length : stack1), 100, {"name":"equal","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\">\r\n			<button class=\"show-more-button\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n				Show more\r\n			</button>\r\n		</div>\r\n		<div class=\"messages\">\r\n			"
    + escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "msg", {"name":"partial","hash":{},"data":data})))
    + "\r\n		</div>\r\n	</div>\r\n	<aside class=\"sidebar\">\r\n		<div class=\"users\">\r\n			"
    + escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "user", {"name":"partial","hash":{},"data":data})))
    + "\r\n		</div>\r\n	</aside>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "					Disconnect\r\n";
  },"4":function(depth0,helpers,partials,data) {
  return "					Leave\r\n";
  },"6":function(depth0,helpers,partials,data) {
  return "show";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.channels : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['msg'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"msg "
    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.self : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\r\n	<span class=\"time\">\r\n		"
    + escapeExpression(((helpers.tz || (depth0 && depth0.tz) || helperMissing).call(depth0, (depth0 != null ? depth0.time : depth0), {"name":"tz","hash":{},"data":data})))
    + "\r\n	</span>\r\n	<span class=\"from\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.from : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	</span>\r\n	<span class=\"text\">\r\n		<em class=\"type\">"
    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
    + "</em>\r\n";
  stack1 = ((helpers.equal || (depth0 && depth0.equal) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "toggle", {"name":"equal","hash":{},"fn":this.program(6, data),"inverse":this.program(9, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "	</span>\r\n</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  return "self";
  },"4":function(depth0,helpers,partials,data) {
  var helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";
  return "		<button class=\"user\" style=\"color: #"
    + escapeExpression(((helpers.stringcolor || (depth0 && depth0.stringcolor) || helperMissing).call(depth0, (depth0 != null ? depth0.from : depth0), {"name":"stringcolor","hash":{},"data":data})))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.mode || (depth0 != null ? depth0.mode : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mode","hash":{},"data":data}) : helper)))
    + escapeExpression(((helper = (helper = helpers.from || (depth0 != null ? depth0.from : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"from","hash":{},"data":data}) : helper)))
    + "</button>\r\n";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<div class=\"force-newline\">\r\n				<button id=\"toggle-"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"toggle-button\">···</button>\r\n			</div>\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.toggle : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"7":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				"
    + escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "toggle", {"name":"partial","hash":{},"data":data})))
    + "\r\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "			";
  stack1 = ((helpers.parse || (depth0 && depth0.parse) || helperMissing).call(depth0, (depth0 != null ? depth0.text : depth0), {"name":"parse","hash":{},"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.messages : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['network'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<section id=\"network-"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"network\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-nick=\""
    + escapeExpression(((helper = (helper = helpers.nick || (depth0 != null ? depth0.nick : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nick","hash":{},"data":data}) : helper)))
    + "\">\r\n	"
    + escapeExpression(((helpers.partial || (depth0 && depth0.partial) || helperMissing).call(depth0, "chan", {"name":"partial","hash":{},"data":data})))
    + "\r\n</section>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.networks : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['toggle'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "<div class=\"toggle-content\">\r\n";
  stack1 = ((helpers.equal || (depth0 && depth0.equal) || helperMissing).call(depth0, (depth0 != null ? depth0.type : depth0), "image", {"name":"equal","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\r\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">\r\n			<img src=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\">\r\n		</a>\r\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "		<a href=\""
    + escapeExpression(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">\r\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.thumb : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "			<div class=\"head\">";
  stack1 = ((helper = (helper = helpers.head || (depth0 != null ? depth0.head : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"head","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\r\n			<div class=\"body\">\r\n				"
    + escapeExpression(((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"body","hash":{},"data":data}) : helper)))
    + "\r\n			</div>\r\n		</a>\r\n";
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<img src=\""
    + escapeExpression(((helper = (helper = helpers.thumb || (depth0 != null ? depth0.thumb : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"thumb","hash":{},"data":data}) : helper)))
    + "\" class=\"thumb\">\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, blockHelperMissing=helpers.blockHelperMissing, buffer = "";
  stack1 = ((helper = (helper = helpers.toggle || (depth0 != null ? depth0.toggle : depth0)) != null ? helper : helperMissing),(options={"name":"toggle","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.toggle) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true});
templates['user'] = template({"1":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"count\">\r\n	<input class=\"search\" placeholder=\""
    + escapeExpression(((helpers.users || (depth0 && depth0.users) || helperMissing).call(depth0, ((stack1 = (depth0 != null ? depth0.users : depth0)) != null ? stack1.length : stack1), {"name":"users","hash":{},"data":data})))
    + "\">\r\n</div>\r\n";
},"3":function(depth0,helpers,partials,data) {
  return "";
},"5":function(depth0,helpers,partials,data) {
  var stack1, helper, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", buffer = "";
  stack1 = ((helpers.diff || (depth0 && depth0.diff) || helperMissing).call(depth0, (depth0 != null ? depth0.mode : depth0), {"name":"diff","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			<button class=\"user\" style=\"color: #"
    + escapeExpression(((helpers.stringcolor || (depth0 && depth0.stringcolor) || helperMissing).call(depth0, (depth0 != null ? depth0.name : depth0), {"name":"stringcolor","hash":{},"data":data})))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.mode || (depth0 != null ? depth0.mode : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"mode","hash":{},"data":data}) : helper)))
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</button>\r\n";
},"6":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "";
  stack1 = helpers.unless.call(depth0, (data && data.first), {"name":"unless","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "			<div class=\"user-mode "
    + escapeExpression(((helpers.modes || (depth0 && depth0.modes) || helperMissing).call(depth0, (depth0 != null ? depth0.mode : depth0), {"name":"modes","hash":{},"data":data})))
    + "\">\r\n";
},"7":function(depth0,helpers,partials,data) {
  return "				</div>\r\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.users : depth0)) != null ? stack1.length : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "<div class=\"names\">\r\n	<div class=\"inner\">\r\n		";
  stack1 = ((helpers.diff || (depth0 && depth0.diff) || helperMissing).call(depth0, "reset", {"name":"diff","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.users : depth0), {"name":"each","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</div>\r\n	</div>\r\n</div>\r\n";
},"useData":true});
})();