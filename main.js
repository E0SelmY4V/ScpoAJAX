"use strict";
/**
 * 原生小AJAX函数库
 * @author E0SelmY4V - from 幻想私社
 * @version 1.1 包含参数操作四个函数和三个AJAX函数
 * @link https://github.com/E0SelmY4V/scpo-ajax/
 */
var ScpoAJAX = {
	/**默认配置 */
	config: {
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
		tdro: function (data) { },
		/**请求失败后执行的函数，一个参数接受XMLHttpRequest对象
		 * @type {(xmlhttp: XMLHttpRequest) => any} */
		todo: function (xmlhttp) { },
		/**返回数据的格式
		 * @type {"xml"|"str"} */
		format: "str",
		/**是否异步
		 * @type {boolean} */
		async: true,
		/**请求未完成时readyState变化时执行的函数
		 * @type {(xmlhttp: XMLHttpRequest) => any} */
		scdo: function (xmlhttp) { }
	},
	/**请求参数相关操作 */
	query: {
		/**
		 * 生成表单元素请求字符串
		 * @param {HTMLFormElement} form form表单元素
		 * @returns {string} 请求字符串
		 */
		toStr: function (form) {
			var iptlist = form.getElementsByTagName("input"), i = -1, ipt, str = "";
			while (ipt = iptlist[++i]) str += ipt.name + "=" + ipt.value + "&";
			return str.slice(0, -1);
		},
		/**
		 * 生成表单元素请求键值对
		 * @param {HTMLFormElement} form form表单元素
		 * @returns {object} 请求键值对
		 */
		toObj: function (form) {
			var iptlist = form.getElementsByTagName("input"), i = -1, ipt, obj = {};
			while (ipt = iptlist[++i]) obj[ipt.name] = ipt.value;
			return obj;
		},
		/**
		 * 根据请求键值对生成请求字符串
		 * @param {object} obj 请求键值对
		 * @return {string} 请求字符串
		 */
		obj2str: function (obj) {
			var str = "";
			for (var i in obj) str += i + "=" + obj[i] + "&";
			return str.slice(0, -1);
		},
		/**
		 * 根据请求键值对生成请求字符串
		 * @param {string} str 请求字符串
		 * @return {object} 请求键值对
		 */
		str2obj: function (str) {
			var arr = str.split("&"), obj = {}, pos, i = 0;
			while (str = arr[i++]) obj[str.slice(0, pos = str.indexOf("="))] = str.slice(pos + 1);
			return obj;
		}
	},
	/**XMLHttpRequest对象
	 * @type {XMLHttpRequest} */
	xmlhttp: window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
	/**
	 * 发起AJAX请求
	 * @param {string} url 请求地址，默认为ScpoAJAX.config.url
	 * @param {"post"|"get"} method 请求方法，默认为ScpoAJAX.config.method
	 * @param {object|string} data 请求数据，默认为ScpoAJAX.config.data
	 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数，一个参数接受请求返回的数据，默认为ScpoAJAX.config.todo
	 * @param {(xmlhttp: XMLHttpRequest) => any} ordo 请求失败后执行的函数，一个参数接受XMLHttpRequest对象，默认为ScpoAJAX.config.ordo
	 * @param {"xml"|"str"} format 返回数据的格式，默认为ScpoAJAX.config.format
	 * @param {boolean} async 是否异步，默认为ScpoAJAX.config.async
	 * @param {(xmlhttp: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数，默认为ScpoAJAX.config.scdo
	 * @returns {void|any} 若异步则返回void，否则返回todo或ordo函数执行的结果
	 */
	request: function (url, method, data, todo, ordo, format, async, scdo) {
		var scpo = this, cfg = scpo.config, xh = scpo.xmlhttp;
		if (typeof url == "undefined") url = cfg.url;
		if (typeof data == "object") data = scpo.query.obj2str(data);
		if (!todo) todo = cfg.todo;
		if (!ordo) ordo = cfg.ordo;
		if (typeof async == "undefined") async = cfg.async;
		format = "response" + ((format ? format : cfg.format) == "xml" ? "XML" : "Text");
		if (async) xh.onreadystatechange = function () {
			if (xh.readyState == 4) {
				if (xh.status == 200) todo(xh[format]);
				else ordo(xh);
			} else (scdo ? scdo : cfg.scdo)(xh);
		};
		if ((method ? method : cfg.method) == "get") {
			xh.open("GET", url + (data ? "?" + data : ""), async);
			xh.send();
		} else {
			xh.open("POST", url, async);
			xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xh.send(data);
		}
		if (!async) {
			if (xh.status === 200) return todo(xh[format]);
			else return ordo(xh);
		}
	},
	/**
	 * get请求
	 * @param {string} url 请求地址，默认为ScpoAJAX.config.url
	 * @param {object|string} data 请求数据，默认为ScpoAJAX.config.data
	 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数，一个参数接受请求返回的数据，默认为ScpoAJAX.config.todo
	 * @param {(xmlhttp: XMLHttpRequest) => any} ordo 请求失败后执行的函数，一个参数接受XMLHttpRequest对象，默认为ScpoAJAX.config.ordo
	 * @param {"xml"|"str"} format 返回数据的格式，默认为ScpoAJAX.config.format
	 * @param {bool} async 是否异步，默认为ScpoAJAX.config.async
	 * @param {(xmlhttp: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数，默认为ScpoAJAX.config.scdo
	 * @returns {void|any} 若异步则返回void，否则返回todo或ordo函数执行的结果
	 */
	get: function (url, data, todo, ordo, format, async, scdo) {
		this.request(url, "get", data, todo, ordo, format, async, scdo);
	},
	/**
	 * get请求
	 * @param {string} url 请求地址，默认为ScpoAJAX.config.url
	 * @param {object|string} data 请求数据，默认为ScpoAJAX.config.data
	 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数，一个参数接受请求返回的数据，默认为ScpoAJAX.config.todo
	 * @param {(xmlhttp: XMLHttpRequest) => any} ordo 请求失败后执行的函数，一个参数接受XMLHttpRequest对象，默认为ScpoAJAX.config.ordo
	 * @param {"xml"|"str"} format 返回数据的格式，默认为ScpoAJAX.config.format
	 * @param {bool} async 是否异步，默认为ScpoAJAX.config.async
	 * @param {(xmlhttp: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数，默认为ScpoAJAX.config.scdo
	 * @returns {void|any} 若异步则返回void，否则返回todo或ordo函数执行的结果
	 */
	post: function (url, data, todo, ordo, format, async, scdo) {
		this.request(url, "post", data, todo, ordo, format, async, scdo);
	}
};