/**
 * @file 幻想私社网络请求函数库
 * @author E0SelmY4V - from 幻想私社
 * @version 1.2.20220603 包含qrycnv、AJAX函数和函数式编程相关
 * @link https://github.com/E0SelmY4V/scpo-webreq.js/
 */
"use strict";
var ScpoWR = ScpoWR || {};
ScpoWR.config = {
	change: function (name, value) {
		if (typeof name == "string") this[name] = value;
		else for (var i in name) this[i] = name[i];
	},
	mode: "ajax",
	url: "",
	method: "get",
	data: "",
	todo: function (data) { },
	ordo: function (param) { },
	format: "str",
	async: true,
	scdo: function (xhr) { }
};
ScpoWR.qrycnv = {
	iptype: [
		"input",
		"textarea"
	],
	frm2str: function (frm) {
		var l = [], k, j, i, k = j = i = -1, p, d, a, str = "", e = encodeURIComponent;
		while (p = this.iptype[++j]) {
			var a = frm.getElementsByTagName(p);
			while (d = a[++k]) l.push(d);
		}
		while (p = l[++i]) str += e(p.name) + "=" + e(p.value) + "&";
		return str.slice(0, -1);
	},
	str2frm: function (str) {
		var arr = str.split("&"), frm = document.createElement("form"), ipt, pos, i = -1, d = decodeURIComponent;
		while (str = arr[++i]) {
			ipt = document.createElement("textarea");
			ipt.setAttribute("name", d(str.slice(0, pos = str.indexOf("="))));
			ipt.value = d(str.slice(pos + 1));
			frm.appendChild(ipt);
		}
		return frm;
	},
	frm2obj: function (frm) {
		var l = [], k, j, i, k = j = i = -1, p, d, a, obj = {};
		while (p = this.iptype[++j]) {
			var a = frm.getElementsByTagName(p);
			while (d = a[++k]) l.push(d);
		}
		while (p = l[++i]) obj[p.name] = p.value;
		return obj;
	},
	obj2frm: function (obj) {
		var frm = document.createElement("form"), ipt, i;
		for (i in obj) {
			ipt = document.createElement("textarea");
			ipt.setAttribute("name", i);
			ipt.value = obj[i];
			frm.appendChild(ipt);
		}
		return frm;
	},
	obj2str: function (obj) {
		var str = "", e = encodeURIComponent;
		for (var i in obj) str += e(i) + "=" + e(obj[i]) + "&";
		return str.slice(0, -1);
	},
	str2obj: function (str) {
		var arr = str.split("&"), obj = {}, pos, i = 0, d = decodeURIComponent;
		while (str = arr[i++]) obj[d(str.slice(0, pos = str.indexOf("=")))] = d(str.slice(pos + 1));
		return obj;
	},
	getype: function (n) {
		if (typeof n == "string") return "str";
		if (typeof n != "object") return "unkown";
		if (window.HTMLElement
			? n instanceof HTMLElement
			: (n.nodeType === 1 && typeof n.nodeName === 'string')
		) return "frm";
		return "obj";
	},
	type: [
		"str",
		"frm",
		"obj"
	],
	isType: function (n) {
		if (this.typeObj) return Boolean(this.typeObj[n]);
		this.typeObj = {};
		var z, i = -1;
		while (z = this.type[++i]) this.typeObj[z] = true;
		return this.isType(n);
	},
	convert: function (n, type) {
		type = this.getype(n) + "2" + type;
		return this[type] ? this[type](n) : n;
	},
	toStr: function (n) {
		return this.convert(n, "str");
	},
	toObj: function (n) {
		return this.convert(n, "obj");
	},
	toFrm: function (n) {
		return this.convert(n, "frm");
	}
};
ScpoWR.ajax = function (method, url, data, todo, ordo, format, async, scdo) {
	if (typeof url == "object") {
		var a = url, i = 0, g = function () { return a[i++] };
		url = g(), data = g(), todo = g(), ordo = g(), format = g(), async = g(), scdo = g();
	} else if (typeof url == "undefined") url = cfg.url;
	var cfg = ScpoWR.config, data = ScpoWR.qrycnv.toStr(data);
	var xh = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	if (!todo) todo = cfg.todo;
	if (!ordo) ordo = cfg.ordo;
	if (!scdo) scdo = cfg.scdo;
	if (typeof async == "undefined") async = cfg.async;
	format = "response" + ((format ? format : cfg.format) == "xml" ? "XML" : "Text");
	if (async) xh.onreadystatechange = function () {
		xh.readyState == 4 ? xh.status == 200 ? todo(xh[format]) : ordo(xh) : scdo(xh);
	};
	if ((method ? method : cfg.method) == "get") {
		xh.open("GET", url + (data ? "?" + data : ""), async);
		xh.send();
	} else {
		xh.open("POST", url, async);
		xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xh.send(data);
	}
	if (!async) return xh.status == 200 ? todo(xh[format]) : ordo(xh);
};
ScpoWR.request = function (method, args) {
	var f, m = ScpoWR.config.mode;
	switch (m) {
		case "ajax":
			break;
		default:
			return;
	}
	return ScpoWR[m](method, args);
};
ScpoWR.get = function (url, data, todo, ordo, format, async, scdo) {
	return ScpoWR.request("get", typeof url == "object"
		? url
		: [url, data, todo, ordo, format, async, scdo]
	);
};
ScpoWR.post = function (url, data, todo, ordo, format, async, scdo) {
	return ScpoWR.request("post", typeof url == "object"
		? url
		: [url, data, todo, ordo, format, async, scdo]
	);
};
ScpoWR.Process = function (cleared) {
	var n = this;
	this.todo = [], this.ordo = [];
	if (cleared) this.cleared = true;
	else this.clear = function (param) {
		var w = param instanceof XMLHttpRequest ? "ordo" : "todo", f, d = true;
		while (f = n[w].shift()) if (typeof f == "function") param = f(param), d = false;
		if (d) ScpoWR.config[w](param);
		n.cleared = true, n.lastRtn = param;
	};
};
ScpoWR.then = function (todo, ordo) {
	var proc = this instanceof ScpoWR.Process ? this : new ScpoWR.Process(true);
	if (proc.cleared) {
		if (typeof todo == "function") proc.lastRtn = todo(proc.lastRtn);
	} else proc.todo.push(todo), proc.ordo.push(ordo);
	return proc;
}
ScpoWR.fset = function (name, value) {
	return this.then(function (param) {
		return ScpoWR.config.change(name, value), param;
	});
}
ScpoWR.onerr = function (ordo) {
	return this.then(null, ordo);
}
ScpoWR.frequest = function (order, method, url, data, format) {
	var proc = new ScpoWR.Process();
	if (order == "get" || order == "post") {
		format = data, data = url, url = method, method = order, order = false;
		if (typeof url == "object") data = url[1], format = url[2], url = url[0];
	}
	var todo = function (param) {
		if (order !== false) {
			if (typeof param == "object") {
				if (order === true) method = Array.isArray(param) ? param.shift() : param.method;
			} else {
				if (order === true) method = "get";
				param = [param];
			}
			url = param[0] || param.url;
			data = param[1] || param.data;
			format = param[2] || param.format;
		}
		ScpoWR.request(method, [url, data, proc.clear, proc.clear, format, true]);
	};
	this instanceof ScpoWR.Process ? this.then(todo) : todo();
	return proc;
}
ScpoWR.fget = function (url, data, format) {
	return url === true
		? this.frequest(void (0), "get")
		: this.frequest("get", [url, data, format]);
}
ScpoWR.fpost = function (url, data, format) {
	return url === true
		? this.frequest(void (0), "get")
		: this.frequest("post", [url, data, format]);
}
ScpoWR.Process.prototype = {
	then: ScpoWR.then,
	fset: ScpoWR.fset,
	onerr: ScpoWR.onerr,
	frequest: ScpoWR.frequest,
	fget: ScpoWR.fget,
	fpost: ScpoWR.fpost
};
if (ScpoWR.onload) ScpoWR.onload();