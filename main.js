"use strict";
/**
 * 幻想私社网络请求函数库
 * @author E0SelmY4V - from 幻想私社
 * @version 1.2-20220602 包含qrycnv、AJAX函数和函数式编程相关
 * @link https://github.com/E0SelmY4V/ScpoWR/
 */
var ScpoWR = window.ScpoWR ? ScpoWR : {};
/**默认配置 */
ScpoWR.config = {
	/**
	 * 更改默认配置
	 * @param {string|object} name 要更改的配置名称或配置键值对
	 * @param {any} value 更改后的值
	 */
	change: function (name, value) {
		if (typeof name == "string") this[name] = value;
		else for (var i in name) this[i] = name[i];
	},
	/**简便函数请求模式
	 * @type {"ajax"} */
	mode: "ajax",
	/**请求地址
	 * @type {string} */
	url: "",
	/**请求方法
	 * @type {"get"|"post"} */
	method: "get",
	/**请求数据
	 * @type {string|object} */
	data: "",
	/**请求成功后执行的函数，一个参数接受请求返回的数据
	 * @type {(data: string|XMLDocument) => any} */
	todo: function (data) { },
	/**请求失败后执行的函数，一个参数接受XHR对象或Error对象
	 * @type {(param: XMLHttpRequest|Error) => any} */
	ordo: function (param) { },
	/**返回数据的格式
	 * @type {"xml"|"str"} */
	format: "str",
	/**是否异步
	 * @type {boolean} */
	async: true,
	/**请求未完成时readyState变化时执行的函数，一个参数接受XHR对象
	 * @type {(xhr: XMLHttpRequest) => any} */
	scdo: function (xhr) { }
};
/**请求字符串转换函数 */
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
	type: {
		str: true,
		frm: true,
		obj: true
	},
	isType: function (n) {
		return Boolean(this.type[n]);
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
/**
 * 发起AJAX请求
 * @param {"post"|"get"} method 请求方法
 * @param {string|any[]} url 请求地址；也可传入一个参数数组
 * @param {object|string|HTMLElement} data 请求数据
 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数
 * @param {(param: XMLHttpRequest) => any} ordo 请求失败后执行的函数
 * @param {"xml"|"str"} format 返回数据的格式
 * @param {boolean} async 是否异步
 * @param {(xhr: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数
 * @returns {void|any} 若异步则返回void，否则返回todo或ordo函数执行的结果
 */
ScpoWR.ajax = function (method, url, data, todo, ordo, format, async, scdo) {
	if (typeof url == "object") {
		var a = url, i = 0, g = function () { return a[i++] };
		url = g(), data = g(), todo = g(), ordo = g(), format = g(), async = g(), scdo = g();
	} else if (typeof url == "undefined") url = cfg.url;
	var scpo = ScpoWR, cfg = scpo.config, data = scpo.qrycnv.toStr(data);
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
(function (scpo) { // 简便函数
	scpo.request = function (method, args) {
		var f, m = scpo.config.mode;
		switch (m) {
			case "ajax":
				break;
			default:
				return;
		}
		return scpo[m](method, args);
	};
	scpo.get = function () {
		return scpo.request("get", arguments);
	};
	scpo.post = function () {
		return scpo.request("post", arguments);
	};
}(ScpoWR), function (scpo) { // 函数式编程相关函数
	/**
	 * 过程类构造函数
	 * @param {boolean} cleared 是否已经完成异步请求
	 */
	function Proc(cleared) {
		var n = this;
		this.todo = [], this.ordo = [];
		if (cleared) this.cleared = true;
		else this.clear = function (param) {
			var w = param instanceof XMLHttpRequest ? "ordo" : "todo", f, d = true;
			while(f = n[w].shift()) if (typeof f == "function") param = f(param), d = false;
			if (d) scpo.config[w](param);
			n.cleared = true, n.lastRtn = param;
		};
	}
	var proto = {
		/**
		 * 添加回调
		 * @param {(param: any) => any} todo 成功时的回调函数
		 * @param {(param: any) => any} ordo 出错时的回调函数
		 * @returns {Proc} 执行的过程对象
		 */
		then: function (todo, ordo) {
			var proc = this instanceof Proc ? this : new Proc(true);
			if (proc.cleared) {
				if (typeof todo == "function") proc.lastRtn = todo(proc.lastRtn);
			} else proc.todo.push(todo), proc.ordo.push(ordo);
			return proc;
		},
		/**更改默认配置 */
		fset: function (name, value) {
			return this.then(function (param) {
				return scpo.config.change(name, value), param;
			});
		},
		/**
		 * catch错误
		 * @param {(param: any) => any} ordo 出错时的回调函数
		 * @returns {Proc} 执行的过程对象
		 */
		onerr: function (ordo) {
			return this.then(null, ordo);
		},
		/**
		 * 发起AJAX请求
		 * @param {boolean} order 是否使用上一次回调的返回的参数数组
		 * @param {"post"|"get"} method 请求方法
		 * @param {string} url 请求地址
		 * @param {object|string} data 请求数据
		 * @param {"xml"|"str"} format 返回数据的格式
		 * @returns {Proc} 执行的过程对象
		 */
		mrequest: function (order, method, url, data, format) {
			var proc = new Proc();
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
				scpo.request(method, [url, data, proc.clear, proc.clear, format, true]);
			};
			this instanceof Proc ? this.then(todo) : todo();
			return proc;
		},
		fget: function () {
			return this.mrequest("get", arguments);
		},
		fpost: function () {
			return this.mrequest("post", arguments);
		},
		sget: function () {
			return this.mrequest(void (0), "get");
		},
		spost: function () {
			return this.mrequest(void (0), "post");
		}
	};
	for (var i in proto) Proc.prototype[i] = scpo[i] = proto[i]
}(ScpoWR));
if (ScpoWR.onload) ScpoWR.onload();
