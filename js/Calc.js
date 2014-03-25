/*
 * This file is part of HearthStoneHelper.
 *
 * HearthStoneHelper is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * HearthStoneHelper is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with HearthStoneHelper.  If not, see <http://www.gnu.org/licenses/>.
 */
if (typeof $WH == "undefined") {
    var $WH = {};
}
$WH.calc = new function () {
	var version = 2;
	var lockValue = false;
	var calculator = null;
	var data = {};
	this.init = function (h) {
		if (h.calculator)
		{
			calculator = h.calculator;
		}
		if (h.hashTemplates) { $WH.calc.hash.setTemplates(h.hashTemplates); }
		if (h.data) { this.setData(h.data); }
		if (!h.noHashManagement)
		{
			$WH.calc.hash.check();
		}
	};

	this.setLockOnLoad = function (h) { lockValue = h; }

	this.setData = function (h) {
		data = h;
	};
	this.getCalculator = function () { return calculator; };
	this.getData = function () {
		return data;
	};
	this.getVersion = function () { return version; };
	this.getLocked = function () { return d; };
	this.isLocked = this.getLocked;
	this.getLockOnLoad = function () { return lockValue; };

	this.executeRequired = function (h) {
		if (!calculator) {
			return
		}
		if (!calculator[h]) {
			return
		}
		return calculator[h].apply(calculator, Array.prototype.slice.call(arguments, 1))
	};

	this.flexibleExecuteRequired = function (h) {
		if (typeof h == "string") {
			return this.executeRequired.apply(this, arguments);
		} else {
			if (typeof h == "function") {
				return h.apply(null, Array.prototype.slice.call(arguments, 1));
			}
		}
	}
};

$WH.calc.externals = new function () {
	this.DEBUG = false;
	this.setDebug = function (deb) { this.DEBUG = deb; };
	this.getDebug = function () { return this.DEBUG; };
	this.isInArray = function (b, a) { return (b.indexOf(a) > -1); };
	this.getValueFromObject = function (b, a) {
		if (typeof a == "string" && a.indexOf("/") > -1) {
			a = a.split("/");
		}
		if (this.isInArray(["number", "string"], typeof a)) {
			return b[a];
		}
		if ($.isArray(a)) {
			a = this.rebuildArray(a);
			var c = b;
			while (a.length) {
				if (typeof c != "object") {
					this.debug("Dead end while fetching key from object.", b, a);
					return
				}
				c = c[a.shift()];
			}
			return c;
		}
	};
	this.setValueOnObject = function (c, b, e) {
		if (typeof b == "string" && b.indexOf("/") > -1) {
			b = b.split("/");
		}
		if (this.isInArray(["number", "string"], typeof b)) {
			c[b] = e;
			return c;
		}
		if ($.isArray(b)) {
			b = this.rebuildArray(b);
			var d = c, a;
			while (b.length > 1) {
				a = b.shift();
				if (typeof d[a] == "undefined") {
					d[a] = {};
				}
				if (typeof d[a] != "object") {
					this.debug("Dead end while setting value on object.", c, b, e);
					return;
				}
				d = d[a];
			}
			d[b.shift()] = e;
			return c;
		}
	};
	this.sortObject = function (c, h, g) {
		if (!g) { g = {}; }
		var b = {}, a = [], f = 0, j;
		for (var e in c) {
			f++;
			if (typeof g.customKey == "function") { j = g.customKey(c, h, e, f); } 
				else { j = (typeof h != "undefined" ? c[e][h] : c[e]) + " " + f; }
			b[j] = c[e];
			a.push(j);
		}
		a.sort(g.compareFn);
		if (g.reverse) { a.reverse(); }
		var d = [];
		for (var e = 0; e < a.length; e++) { d.push(b[a[e]]); }
		return d;
	};
	this.isEqualSimpleObject = function (a, b) {
		for (var c in a) {
			if (typeof a[c] == "object") {
				if (typeof b[c] != "object") { return false; }
				if (!this.isEqualSimpleObject(a[c], b[c])) { return false; }
			} else {
				if (a[c] !== b[c]) { return false; }
			}
		}
		for (var c in b) {
			if (typeof b[c] == "object") {
				if (typeof a[c] != "object") { return false; }
				if (!this.isEqualSimpleObject(a[c], b[c])) { return false; }
			} else {
				if (a[c] !== b[c]) { return false; }
			}
		}
		return true;
	}
};
$WH.calc.action = new function () {
	this.reset = function () { $WH.calc.executeRequired("reset"); };
	this.lock = function () {
		if ($WH.calc.isLocked()) { $WH.calc.unlock(); }
			else { $WH.calc.lock(); }
	};
};
$WH.calc.hash = new function () {
	var lockValue = false;
	var d = 0;
	var c = 0;
	var version = null;
	var template = {};
	var f = {
		encoding: "0zMcmVokRsaqbdrfwihuGINALpTjnyxtgevElBCDFHJKOPQSUWXYZ123456789",
		encodingLength: 60,
		delimiters: ["9", "8"],
		zeroDelimiterCompression: false
	};
	this.setVersion = function (ver) { version = ver; };
	this.setLocked = function (g) { lockValue = g; };
	this.lock = function () {
		this.setLocked(true)
	};
	this.unlock = function () {
		this.setLocked(false)
	};
	this.setTemplates = function (tem) {
		template = tem;
		for (var g in template) {
			this.prepare(g)
		}
		if (!this.getVersion()) {
			this.setVersion($WH.calc.executeRequired("getHashVersion"))
		}
	};
	this.setTemplate = function (key, val) {
		template[key] = val;
		this.prepare(key)
	};
	this.setEncoding = function (key, val) {
		template[key].encoding = val || f.encoding
	};
	this.setEncodingLength = function (key, val) {
		template[key].encodingLength = val || f.encodingLength
	};
	this.setDelimiters = function (key, val) {
		template[key].delimiters = val || f.delimiters
	};
	this.setDelimiter = function (g, i, h) {
		if (!h) {
			h = 1
		}
		template[g].delimiters[h] = i || f.delimiters[h]
	};
	this.setZeroDelimiterCompression = function (g, h) {
		template[g].zeroDelimiterCompression = h || f.zeroDelimiterCompression
	};
	this.increaseDelimiters = function (h, g) {
		while (g > 0) {
			var i = (this.getEncoding(h)).charAt(this.getEncodingLength(h) - 1);
			template[h].delimiters.push(i);
			this.setEncodingLength(h, this.getEncodingLength(h) - 1);
			g--
		}
	};
	this.decreaseDelimiters = function (h, g) {
		while (g > 0) {
			template[h].delimiters.pop();
			this.setEncodingLength(h, this.getEncodingLength(h) + 1);
			g--;
		}
	};
	this.getVersion = function () { return version; };
	this.getLocked = function () { return lockValue; };
	this.isLocked = this.getLocked;
	this.getTemplates = function () { return template; };
	this.getTemplate = function (g, h) {
		if (h) {
			return template[g];
		}
		return template[g] || $WH.calc.executeRequired("getHashTemplate")
	};
	this.getEncoding = function (g) {
		return template[g].encoding
	};
	this.getEncodingLength = function (g) {
		return template[g].encodingLength
	};
	this.getDelimiters = function (g) {
		return template[g].delimiters;
	};
	this.getDelimiter = function (g, h) {
		if (isNaN(h)) {
			h = 1
		}
		return template[g].delimiters[h];
	};
	this.getZeroDelimiterCompression = function (g) {
		return template[g].zeroDelimiterCompression
	};
	this.getZeroDelimiterCompressionIndicator = function (g) {
		if (this.getZeroDelimiterCompression(g)) {
			return this.getDelimiter(g, this.getZeroDelimiterCompression(g))
		}
	};
	this.prepare = function (g) {
		if (!template[g].prepared) {
			if (!template[g].encoding) {
				this.setEncoding(g)
			}
			if (!template[g].encodingLength) {
				this.setEncodingLength(g)
			}
			if (!template[g].delimiters) {
				this.setDelimiters(g)
			}
			if (template[g].delimiter) {
				this.setDelimiter(g, template[g].delimiter)
			}
			if (template[g].increaseDelimiters) {
				this.increaseDelimiters(g, template[g].increaseDelimiters)
			}
			if (template[g].decreaseDelimiters) {
				this.decreaseDelimiters(g, template[g].decreaseDelimiters)
			}
			if (typeof template[g].zeroDelimiterCompression == "undefined") {
				this.setZeroDelimiterCompression(g)
			}
			template[g].prepared = true
		}
	};
	this.get = function (h, g, f) {
		// My change to get the hash not only from window.location, ie. blahblah.get("jh4g234g2j3g42");
		if (typeof(h) == "string")
		{
			var i = h;
			if (i && i != "#") {
				if (!f) {
					f = this.getVersion()
				}
				if (!g) {
					i = $WH.calc.decode.zeroes(f, i)
				}
				if ($WH.calc.hash.getZeroDelimiterCompression(f)) {
					i = $WH.calc.decode.zeroDelimiters(f, i)
				}
				return i.replace(/^#/, "")
			}
			return "";
		}

		var i = document.location.hash;
		if (i && i != "#") {
			if (!g) {
				g = this.getVersion()
			}
			if (!h) {
				i = $WH.calc.decode.zeroes(g, i)
			}
			if ($WH.calc.hash.getZeroDelimiterCompression(g)) {
				i = $WH.calc.decode.zeroDelimiters(g, i)
			}
			return i.replace(/^#/, "")
		}
		return ""
	};
	this.set = function (i, h, g) {
		if ($WH.calc.hash.isLocked()) {
			return
		}
		if (typeof i != "string") {
			return
		}
		if (i) {
			if (!g) {
				g = this.getVersion()
			}
			if (!h) {
				i = $WH.calc.encode.zeroes(g, i)
			}
			if ($WH.calc.hash.getZeroDelimiterCompression(g)) {
				i = $WH.calc.encode.zeroDelimiters(g, i)
			}
			if (location.hash == ("#" + i)) {
				this.unlock();
				return
			}
			c++;
			// Be careful from here... This will add the hash to window.location...
			location.hash = i
		}
		this.updateLink(i)
	};
	this.update = function () {
		if ($WH.calc.hash.isLocked()) {
			return
		}
		var g = this.getTemplate(this.getVersion());
		var h = g ? $WH.calc.encode.template(g) : $WH.calc.executeRequired("encodeHash");
		this.set(h)
	};
	this.removeTrailing = function (g, h) {
		return g.replace(new RegExp(h + "$"), "")
	};
	this.check = function () {
		if ($WH.calc.hash.isLocked()) {
			return;
		}
		if (c > d) {
			d++;
			return
		}
		if (c != d) {
			return
		}
		var h = this.get();
		if (!h) {
			return
		}
		var g = this.getTemplate(this.getVersion());
		var i = g ? $WH.calc.decode.template(g, h) : $WH.calc.executeRequired("decodeHash", h);
	};
	
	// magic here
	this.getCardsFrom = function(value, fullValues) {

		if ($WH.calc.hash.isLocked()) {
			return;
		}
		if (c > d) {
			d++;
			return;
		}
		if (c != d) {
			return;
		}
		var h = this.get(value);
		if (!h) {
			return;
		}
		var g = this.getTemplate(this.getVersion());
		var i = g ? $WH.calc.decode.template(g, h) : $WH.calc.executeRequired("decodeHash", h);

		return (fullValues) ? i : i.cards;
	}

	this.updateLink = function (g) {
		if (!g) {
			g = this.get()
		}
		if (!g) {
			return
		}
		$WH.calc.executeOptional("updateLink", g)
	}
};
$WH.calc.encode = new function () {
	this.value = function (a, c) {
		if (typeof c != "number" && !c.match(/[^0-9]/)) {
			c = parseInt(c)
		}
		if (!isNaN(c)) {
			if (c > $WH.calc.hash.getEncodingLength(a)) {
				return this.value(a, 0)
			}
			var b = ($WH.calc.hash.getEncoding(a)).charAt(c);
			if (!b) {
				return this.value(a, 0)
			}
			return b
		}
		return this.value(a, 0)
	};
	this.longValue = function (b, f) {
		var a = $WH.calc.hash.getEncodingLength(b);
		if (f <= a) {
			return this.value(b, f)
		}
		var e = [f];
		var d = 0;
		while (e[0] > a) {
			d = Math.floor(e[0] / a);
			e[0] = e[0] - (d * a);
			e.unshift(d)
		}
		var g = "";
		for (var c in e) {
			g += this.value(b, e[c])
		}
		return g
	};
	this.compressedValues = function (b, a) {
		if (typeof a != "object" || !a.base) {
			return this.value(b, 0)
		}
		if (typeof a.base != "number" || a.base < 1) {
			return this.value(b, 0)
		}
		if (!a.data || !$.isArray(a.data) || !a.data.length) {
			return this.value(b, 0)
		}
		var e = 0;
		var d = 0;
		var f;
		for (var c = 0; c < a.data.length; c++) {
			if (a.data[c] > a.base) {
				return this.value(b, 0)
			}
			f = Math.pow(a.base + 1, d);
			e += a.data[c] * f;
			d++
		}
		return this.value(b, e)
	};
	this.complexCompressedValues = function (a, c) {
		var d = 0;
		for (var b = 0; b < c.length; b++) {
			if (c[b].multiplier) {
				d += c[b].value * c[b].multiplier
			} else {
				d += c[b].value
			}
		}
		return this.value(a, d)
	};
	this.values = function (a, d) {
		if (!$.isArray(d)) {
			return null
		}
		var c = [];
		for (var b = 0; b < d.length; b++) {
			if (typeof d[b] == "number") {
				c.push(this.value(a, d[b]))
			} else {
				if (typeof d[b] == "object" && d[b].compression) {
					c.push(this.compressedValues(a, d[b]))
				} else {
					if (typeof d[b] == "string" && d[b] == "delimiter") {
						c.push($WH.calc.hash.getDelimiter(a))
					} else {
						c.push(this.value(a, 0))
					}
				}
			}
		}
	};
	this.zeroes = function (a, e) {
		e = e.split("");
		var d = "",
			b = [];
		for (var c in e) {
			if (e[c] == "0") {
				b.push("0")
			} else {
				if (b.length) {
					if (b.length < 2) {
						d += b.join("");
						b = []
					} else {
						if (b.length > $WH.calc.hash.getEncodingLength(a)) {
							d += $WH.calc.hash.getDelimiter(a, 0) + $WH.calc.hash.getDelimiter(a, 0) + ($WH.calc.hash.getEncoding(a)).charAt(b.length - $WH.calc.hash.getEncodingLength(a));
							b = [];
						} else {
							d += $WH.calc.hash.getDelimiter(a, 0) + ($WH.calc.hash.getEncoding(a)).charAt(b.length);
							b = [];
						}
					}
				}
				d += e[c];
			}
		}
		return d
	};
	this.zeroDelimiters = function (a, f) {
		f = f.split("");
		var e = "",
			d = false,
			b = [];
		for (var c = 0; c < f.length; c++) {
			if (d) {
				d = false;
				continue
			}
			if (f[c] == "0" && f[c + 1] == $WH.calc.hash.getDelimiter(a)) {
				b.push("08");
				d = true
			} else {
				if (b.length) {
					if (b.length < 2) {
						e += b.join("");
						b = []
					} else {
						if (b.length > $WH.calc.hash.getEncodingLength(a)) {
							e += $WH.calc.hash.getZeroDelimiterCompressionIndicator(a) + $WH.calc.hash.getZeroDelimiterCompressionIndicator(a) + ($WH.calc.hash.getEncoding(a)).charAt(b.length - $WH.calc.hash.getEncodingLength(a));
							b = []
						} else {
							e += $WH.calc.hash.getZeroDelimiterCompressionIndicator(a) + ($WH.calc.hash.getEncoding(a)).charAt(b.length);
							b = []
						}
					}
				}
				e += f[c]
			}
		}
		return e
	};

	this.processTemplateSegment = function (f, n, e, g) {
		if ($WH.calc.externals.isInArray(["number", "string"], typeof f.key) || $.isArray(f.key)) {
			var l = $WH.calc.externals.getValueFromObject(n, f.key);
			if (typeof l == "undefined") {
				return this.value(g, 0);
			}
			return this.value(g, l);
		}
		if ($WH.calc.externals.isInArray(["number", "string"], typeof f.keyLong) || $.isArray(f.keyLong)) {
			var l = $WH.calc.externals.getValueFromObject(n, f.keyLong);
			if (typeof l == "undefined") {
				return this.longValue(g, 0);
			}
			return this.longValue(g, l);
		}
		if (typeof f.compressedValue == "object") {
			var m = [];
			var h, l;
			for (var d in f.compressedValue.data) {
				h = f.compressedValue.data[d];
				if ($WH.calc.externals.isInArray(["number", "string"], typeof h.key) || $.isArray(h.key)) {
					l = $WH.calc.externals.getValueFromObject(n, h.key);
					if (typeof l == "undefined") {
						m.push(0);
						continue
					}
					m.push(l);
				}
			}
			if (m.length) {
				return this.compressedValues(g, {
					data: m,
					base: f.compressedValue.base
				})
			}
		}
		if ((typeof f.collectionKey == "string" || $.isArray(f.collectionKey) || $WH.calc.externals.isInArray(["string", "function"], typeof f.collection)) && ($WH.calc.externals.isInArray(["string", "object"], typeof f.processTemplate) || $WH.calc.externals.isInArray(["string", "function"], typeof f.process))) {
			var j;
			if (typeof f.delimiter != "undefined") {
				j = $WH.calc.hash.getDelimiter(g, f.delimiter);
			} else {
				j = $WH.calc.hash.getDelimiter(g);
			}
			if ($WH.calc.externals.isInArray(["number", "string"], typeof f.collectionKey) || $.isArray(f.collectionKey)) {
				var b = $WH.calc.externals.getValueFromObject(n, f.collectionKey)
			} else {
				var b = $WH.calc.flexibleExecuteRequired(f.collection, n);
			}
			if (b) {
				var l = [];
				if ($WH.calc.externals.isInArray(["string", "function"], typeof f.order) || typeof f.orderKey == "string" || $.isArray(f.orderKey)) {
					if (typeof f.orderKey == "string" || $.isArray(f.orderKey)) {
						var c = $WH.calc.externals.getValueFromObject(n, f.orderKey);
					} else {
						var c = $WH.calc.flexibleExecuteRequired(f.order, n);
					}
					if (c) {
						for (var a in c) {
							l.push(this.processCollection(g, f, b[c[a]]));
						}
					}
				} else {
					for (var k in b) {
						l.push(this.processCollection(g, f, b[k]));
					}
				}
				return l.join(j)
			}
		}
		if ($WH.calc.externals.isInArray(["string", "function"], typeof f.calculatorValue)) {
			return this.value(g, $WH.calc.flexibleExecuteRequired(f.calculatorValue));
		}
		if ($WH.calc.externals.isInArray(["string", "function"], typeof f.calculatorLongValue)) {
			return this.longValue(g, $WH.calc.flexibleExecuteRequired(f.calculatorLongValue));
		}
		if (typeof f.value == "number") {
			return this.value(g, f.value);
		}
		if (typeof f.longValue == "number") {
			return this.longValue(g, f.longValue);
		}
		if (f.delimiter === true) {
			return $WH.calc.hash.getDelimiter(g);
		}
		if ($WH.calc.externals.isInArray(["number", "string"], typeof f.delimiter)) {
			return $WH.calc.hash.getDelimiter(g, f.delimiter);
		}
		if ($WH.calc.externals.isInArray(["string", "function"], typeof f.func)) {
			return f.func(f, n);
		}
		return this.value(g, 0);
	};
	this.processCollection = function (a, c, d) {
		if ($WH.calc.externals.isInArray(["string", "object"], typeof c.processTemplate)) {
			var b = typeof c.processTemplate == "string" ? $WH.calc.executeRequired("getHashTemplate", c.processTemplate) : c.processTemplate;
			return this.template(b, d, c, a);
		} else {
			return $WH.calc.flexibleExecuteRequired(c.process, d);
		}
	}
};
$WH.calc.decode = new function () {
	this.value = function (a, c) {
		if (typeof c != "number" && typeof c != "string") {
			return null;
		}
		var b = ($WH.calc.hash.getEncoding(a)).indexOf(c);
		if (b == -1) {
			return null;
		}
		return b;
	};
	this.longValue = function (a, e) {
		if (e.length < 2) {
			return this.value(a, e);
		}
		e = e.split("");
		e.reverse();
		var d = 0, c;
		for (var f = 0; f < e.length; f++) {
			c = this.value(a, e[f]);
			for (var b = 0; b < f; b++) {
				c = c * $WH.calc.hash.getEncodingLength(a);
			}
			d += c;
		}
		return d;
	};
	this.values = function (a, c) {
		if (typeof c == "number") {
			if (isNaN(c)) {
				return null;
			}
			c = "" + c;
		}
		if (typeof c == "string") {
			c = c.split("");
		}
		if (!$.isArray(c)) {
			return null;
		}
		var d = [];
		for (var b = 0; b < c.length; b++) {
			d.push(this.value(a, c[b]));
		}
		return d;
	};
	this.compressedValue = function (a, g, f, d, h) {
		if (!h) {
			h = [];
			for (var c = 0; c < d; c++) {
				h.push(Math.pow(g + 1, c));
			}
		}
		var e = [];
		for (var c = 0; c < h.length; c++) {
			e.push(0);
		}
		var b = this.value(a, f);
		for (c = d - 1; c >= 0; c--) {
			if (b >= h[c]) {
				e[c] = Math.floor(b / h[c]);
				b = b % h[c];
			} else {
				e[c] = 0;
			}
		}
		return e;
	};
	this.compressedValues = function (b, f, a, d) {
		var g = [];
		for (var c = 0; c < d; c++) {
			g.push(Math.pow(f, c));
		}
		var a = a.split("");
		var e = [];
		for (var c = 0; c < a.length; c++) {
			e.push(this.compressedValue(b, f, a[c], d, g));
		}
		return e
	};
	this.zeroes = function (a, e) {
		e = e.split("");
		var d = "",
			b = false;
		for (var c in e) {
			if (b && e[c] == $WH.calc.hash.getDelimiter(a, 0)) {
				b++;
			} else {
				if (b) {
					var f = ($WH.calc.hash.getEncoding(a)).indexOf(e[c]) + ((b - 1) * $WH.calc.hash.getEncodingLength(a));
					for (c = 1; c <= f; c++) {
						d += "0";
					}
					b = false;
				} else {
					if (e[c] == $WH.calc.hash.getDelimiter(a, 0)) {
						b = 1;
					} else {
						d += e[c];
					}
				}
			}
		}
		return d
	};
	this.zeroDelimiters = function (a, e) {
		e = e.split("");
		var d = "", b = false;
		for (var c in e) {
			if (b && e[c] == $WH.calc.hash.getZeroDelimiterCompressionIndicator(a)) {
				b++;
			} else {
				if (b) {
					var f = ($WH.calc.hash.getEncoding(a)).indexOf(e[c]) + ((b - 1) * $WH.calc.hash.getEncodingLength(a));
					for (c = 1; c <= f; c++) {
						d += "0" + $WH.calc.hash.getDelimiter(a);
					}
					b = false
				} else {
					if (e[c] == $WH.calc.hash.getZeroDelimiterCompressionIndicator(a)) {
						b = 1;
					} else {
						d += e[c];
					}
				}
			}
		}
		return d
	};
	this.shift = function (a, c) {
		var b = c.substr(0, 1);
		return {
			hash: c.substr(1),
			value: this.value(a, b)
		}
	};
	this.pop = function (a, c) {
		var b = c.substr(c.length - 1);
		return {
			hash: c.substr(0, c.length - 1),
			value: this.value(a, b)
		}
	};
	this.version = function (a, b) {
		var c = {
			hash: "" + b,
			build: {}
		};
		c = this.processTemplateSegment(a.data[0], a.data[1], c, null, a.version);
		if (!c.build.version) {
			return null
		}
		return c.build.version;
	};
	this.template = function (h, j, d, e, i) {
		if (!h) {
			h = $WH.calc.hash.getTemplate(e || $WH.calc.hash.getVersion())
		}
		if (!j) {
			j = $WH.calc.hash.get(e)
		}
		if (!h || !j) {
			return
		}
		if (!e) {
			e = h.version
		}
		$WH.calc.hash.prepare(e);
		var c = j;
		if (!d && !i) {
			var g = this.version(h, c);
			if (g != e) {
				var a = $WH.calc.hash.getTemplate(g, true);
				if (!a) {
					return this.template(h, j, null, h.version, true)
				}
				return this.template(a, j, null, a.version)
			}
		}
		var f = {
			hash: "" + c,
			build: {}
		};
		if (i) {
			f.build.unknownTemplateVersion = true
		}
		var b = 0;
		while (f.hash.length) {
			f = this.processTemplateSegment(h.data[b], h.data[b + 1], f, d, e);
			b++
		}
		if (h.decodingPostProcess) {
			f.build = $WH.calc.flexibleExecuteRequired(h.decodingPostProcess, f.build, c)
		}

		return f.build;
	};
	this.processTemplateSegment = function (f, j, n, e, g) {
		var a = n.hash.substr(1);
		if ($WH.calc.externals.isInArray(["number", "string"], typeof f.key) || $.isArray(f.key)) {
			var l = $WH.calc.externals.setValueOnObject(n.build, f.key, this.value(g, n.hash.substr(0, 1)));
			return {
				hash: a,
				build: l
			}
		}
		if ($WH.calc.externals.isInArray(["number", "string"], typeof f.keyLong) || $.isArray(f.keyLong)) {
			var d = this.getHashPieces(g, n.hash, f, j);
			var l = $WH.calc.externals.setValueOnObject(n.build, f.keyLong, this.longValue(g, d[0]));
			return {
				hash: d[1] || "",
				build: l
			}
		}
		if (typeof f.compressedValue == "object") {
			var q = this.compressedValue(g, f.compressedValue.base, n.hash.substr(0, 1), f.compressedValue.data.length);
			var l = n.build;
			for (var c = 0; c < f.compressedValue.data.length; c++) {
				if (q[c]) {
					l = $WH.calc.externals.setValueOnObject(l, f.compressedValue.data[c].key, q[c])
				}
			}
			return {
				hash: a,
				build: n.build
			}
		}
		if ((typeof f.collectionKey == "string" || $.isArray(f.collectionKey) || $WH.calc.externals.isInArray(["string", "function"], typeof f.collection)) && ($WH.calc.externals.isInArray(["string", "object"], typeof f.processTemplate) || $WH.calc.externals.isInArray(["string", "function"], typeof f.process))) {
			var h;
			if (typeof f.delimiter != "undefined") {
				h = $WH.calc.hash.getDelimiter(g, f.delimiter)
			} else {
				h = $WH.calc.hash.getDelimiter(g)
			}
			var b = $WH.calc.hash.getDelimiter(g);
			if (h != b && n.hash.substr(0, 1) == b) {
				return {
					hash: n.hash,
					build: n.build
				}
			}
			var d = this.getHashPieces(g, n.hash, f, j);
			if (f.decode !== false) {
				var m = d[0].split(h);
				var p;
				var l = f.asObject ? {} : [];
				var o, k;
				for (var c = 0; c < m.length; c++) {
					if ($WH.calc.externals.isInArray(["string", "object"], typeof f.processTemplate)) {
						p = typeof f.processTemplate == "string" ? $WH.calc.executeRequired("getHashTemplate", f.processTemplate) : f.processTemplate;
						k = this.template(p, m[c], f, g)
					} else {
						k = $WH.calc.flexibleExecuteRequired(f.processDecoding, m[c])
					}
					if ($WH.calc.externals.isInArray(["string", "number"], typeof f.dataAsKey)) {
						o = k[f.dataAsKey]
					} else {
						o = c
					}
					l[o] = k
				}
				if ($WH.calc.externals.isInArray(["number", "string"], typeof f.collectionKey) || $.isArray(f.collectionKey)) {
					n.build = $WH.calc.externals.setValueOnObject(n.build, f.collectionKey, l)
				} else {
					if ($WH.calc.externals.isInArray(["string", "function"], typeof f.buildFunc)) {
						n.build = $WH.calc.flexibleExecuteRequired(f.buildFunc, n.build, l, e)
					}
				}
			}
			return {
				hash: d[1] || "",
				build: n.build
			}
		}
		if ($WH.calc.externals.isInArray(["string", "function"], typeof f.calculatorValue) || typeof f.value == "number") {
			if ($WH.calc.externals.isInArray(["number", "string"], typeof f.buildKey) || $.isArray(f.buildKey)) {
				var l = $WH.calc.externals.setValueOnObject(n.build, f.buildKey, this.value(g, n.hash.substr(0, 1)));
				return {
					hash: a,
					build: l
				}
			}
		}
		if ($WH.calc.externals.isInArray(["string", "function"], typeof f.calculatorLongValue) || typeof f.longValue == "number") {
			if ($WH.calc.externals.isInArray(["number", "string"], typeof f.buildKey || $.isArray(f.buildKey))) {
				var d = this.getHashPieces(g, n.hash, f, j);
				var l = $WH.calc.externals.setValueOnObject(n.build, f.buildKey, this.longValue(g, d[0]));
				return {
					hash: d[1] || "",
					build: l
				}
			}
		}
		if ((f.delimiter === true && n.hash.substr(0, 1) == $WH.calc.hash.getDelimiter(g)) || ($WH.calc.externals.isInArray(["number", "string"], typeof f.delimiter) && n.hash.substr(0, 1) == $WH.calc.hash.getDelimiter(g, f.delimiter))) {
			return {
				hash: a,
				build: n.build
			}
		}
		if ($WH.calc.externals.isInArray(["string", "function"], typeof f.func)) {
			if ($WH.calc.externals.isInArray(["string", "function"], typeof f.buildFunc)) {
				var l = $WH.calc.flexibleExecuteRequired(f.buildFunc, n.build, n.hash, f, j);
				if (l) {
					return l;
				}
			}
		}
		return {
			hash: hash.substr(1),
			build: n.build
		}
	};
	this.getHashPieces = function (c, f, e, g) {
		var b = [f];
		if (g && !g.collection && !g.collectionKey && ($WH.calc.externals.isInArray(["number", "string"], typeof e.delimiter) || g.delimiter === true)) {
			var d = g.delimiter === true ? $WH.calc.hash.getDelimiter(c) : $WH.calc.hash.getDelimiter(c, g.delimiter);
			b = f.split(d);
			var a = [b.shift()];
			a.push(d + b.join(d));
			b = a;
		}
		return b;
	}
};