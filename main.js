"use strict";
/**
 * 原生小AJAX函数库
 * @author E0SelmY4V - from 幻想私社
 * @version 1.1 包含参数操作四个函数和三个AJAX函数
 * @link https://github.com/E0SelmY4V/scpo-ajax/
 */
var ScpoAJAX;
(function (/**ScpoAJAX对象 */scpo) {
	/**请求参数相关操作 */
	var query = {
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
			var iptlist = form.getElementsByTagName("input"), i = -1, ipt, obj = {}
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
	};
	scpo.query = query;
	/**XMLHttpRequest对象
	 * @type {XMLHttpRequest} */
	var xmlhttp = null;
	try {
		xmlhttp = new XMLHttpRequest();
	} catch (err) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	scpo.xmlhttp = xmlhttp;
	scpo.async = true;
	/**
	 * 发起AJAX请求
	 * @param {string} url 请求地址
	 * @param {"post"|"get"} method 请求方法
	 * @param {object|string} data 请求数据
	 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数，一个参数接受请求返回的数据
	 * @param {(xmlhttp: XMLHttpRequest) => any} ordo 请求失败后执行的函数，一个参数接受XMLHttpRequest对象
	 * @param {"xml"|"str"} format 返回数据的格式，默认为"str"
	 * @param {bool} async 是否异步，默认为ScpoAJAX.async
	 * @param {(xmlhttp: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数
	 * @returns {void|any} 若异步则返回void，否则返回todo或rodo函数执行的结果
	 */
	function request(url, method, data, todo, ordo, format, async, scdo) {
		if (typeof async === "undefined") async = scpo.async;
		if (async) xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === 4 && async) {
				if (xmlhttp.status === 200 && todo) todo(format === "xml" ? xmlhttp.responseXML : xmlhttp.responseText)
				else if (ordo) ordo(xmlhttp);
			} else if (scdo) scdo(xmlhttp);
		}
		if (typeof data === "object") data = query.obj2str(data);
		if (method === "get") {
			xmlhttp.open("GET", url + (data ? "?" + data : ""), async);
			xmlhttp.send();
		} else {
			xmlhttp.open("POST", url, async);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send(data);
		}
		if (!async) {
			if (xmlhttp.status === 200) return todo(format === "xml" ? xmlhttp.responseXML : xmlhttp.responseText);
			else return ordo(xmlhttp);
		}
	}
	/**
	 * get请求
	 * @param {string} url 请求地址
	 * @param {object|string} data 请求数据
	 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数，一个参数接受请求返回的数据
	 * @param {(xmlhttp: XMLHttpRequest) => any} ordo 请求失败后执行的函数，一个参数接受XMLHttpRequest对象
	 * @param {"xml"|"str"} format 返回数据的格式，默认为"str"
	 * @param {bool} async 是否异步，默认为ScpoAJAX.async
	 * @param {(xmlhttp: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数
	 * @returns {void|any} 若异步则返回void，否则返回todo或rodo函数执行的结果
	 */
	function get(url, data, todo, ordo, format, async, scdo) {
		request(url, "get", data, todo, ordo, format, async, scdo);
	}
	/**
	 * get请求
	 * @param {string} url 请求地址
	 * @param {object|string} data 请求数据
	 * @param {(data: string|XMLDocument) => any} todo 请求成功后执行的函数，一个参数接受请求返回的数据
	 * @param {(xmlhttp: XMLHttpRequest) => any} ordo 请求失败后执行的函数，一个参数接受XMLHttpRequest对象
	 * @param {"xml"|"str"} format 返回数据的格式，默认为"str"
	 * @param {bool} async 是否异步，默认为ScpoAJAX.async
	 * @param {(xmlhttp: XMLHttpRequest) => any} scdo 请求未完成时readyState变化时执行的函数
	 * @returns {void|any} 若异步则返回void，否则返回todo或rodo函数执行的结果
	 */
	function post(url, data, todo, ordo, format, async, scdo) {
		request(url, "post", data, todo, ordo, format, async, scdo);
	}
	scpo.request = request;
	scpo.get = get;
	scpo.post = post;
}(window.ScpoAJAX ? ScpoAJAX : window.ScpoAJAX = {}));