! function() {
    window.CKEDITOR && window.CKEDITOR.dom || (window.CKEDITOR || (window.CKEDITOR = function() {
        var a = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,
            b = {
                timestamp: "E8PB",
                version: "4.4.5",
                revision: "25cdcad",
                rnd: Math.floor(900 * Math.random()) + 100,
                _: {
                    pending: [],
                    basePathSrcPattern: a
                },
                status: "unloaded",
                basePath: function() {
                    var b = window.CKEDITOR_BASEPATH || "";
                    if (!b)
                        for (var c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) {
                            var e = c[d].src.match(a);
                            if (e) {
                                b = e[1];
                                break
                            }
                        }
                    if (-1 == b.indexOf(":/") && "//" != b.slice(0, 2) && (b = 0 === b.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + b : location.href.match(/^[^\?]*\/(?:)/)[0] + b), !b) throw 'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
                    return b
                }(),
                getUrl: function(a) {
                    return -1 == a.indexOf(":/") && 0 !== a.indexOf("/") && (a = this.basePath + a), this.timestamp && "/" != a.charAt(a.length - 1) && !/[&?]t=/.test(a) && (a += (0 <= a.indexOf("?") ? "&" : "?") + "t=" + this.timestamp), a
                },
                domReady: function() {
                    function a() {
                        try {
                            document.addEventListener ? (document.removeEventListener("DOMContentLoaded", a, !1), b()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", a), b())
                        } catch (c) {}
                    }

                    function b() {
                        for (var a; a = c.shift();) a()
                    }
                    var c = [];
                    return function(b) {
                        function d() {
                            try {
                                document.documentElement.doScroll("left")
                            } catch (b) {
                                return void setTimeout(d, 1)
                            }
                            a()
                        }
                        if (c.push(b), "complete" === document.readyState && setTimeout(a, 1), 1 == c.length)
                            if (document.addEventListener) document.addEventListener("DOMContentLoaded", a, !1), window.addEventListener("load", a, !1);
                            else if (document.attachEvent) {
                            document.attachEvent("onreadystatechange", a), window.attachEvent("onload", a), b = !1;
                            try {
                                b = !window.frameElement
                            } catch (e) {}
                            document.documentElement.doScroll && b && d()
                        }
                    }
                }()
            },
            c = window.CKEDITOR_GETURL;
        if (c) {
            var d = b.getUrl;
            b.getUrl = function(a) {
                return c.call(b, a) || d.call(b, a)
            }
        }
        return b
    }()), CKEDITOR.event || (CKEDITOR.event = function() {}, CKEDITOR.event.implementOn = function(a) {
        var b, c = CKEDITOR.event.prototype;
        for (b in c) null == a[b] && (a[b] = c[b])
    }, CKEDITOR.event.prototype = function() {
        function a(a) {
            var d = b(this);
            return d[a] || (d[a] = new c(a))
        }
        var b = function(a) {
                return a = a.getPrivate && a.getPrivate() || a._ || (a._ = {}), a.events || (a.events = {})
            },
            c = function(a) {
                this.name = a, this.listeners = []
            };
        return c.prototype = {
            getListenerIndex: function(a) {
                for (var b = 0, c = this.listeners; b < c.length; b++)
                    if (c[b].fn == a) return b;
                return -1
            }
        }, {
            define: function(b, c) {
                var d = a.call(this, b);
                CKEDITOR.tools.extend(d, c, !0)
            },
            on: function(b, c, d, e, f) {
                function g(a, f, g, i) {
                    return a = {
                        name: b,
                        sender: this,
                        editor: a,
                        data: f,
                        listenerData: e,
                        stop: g,
                        cancel: i,
                        removeListener: h
                    }, c.call(d, a) === !1 ? !1 : a.data
                }

                function h() {
                    j.removeListener(b, c)
                }
                var i = a.call(this, b);
                if (i.getListenerIndex(c) < 0) {
                    i = i.listeners, d || (d = this), isNaN(f) && (f = 10);
                    var j = this;
                    g.fn = c, g.priority = f;
                    for (var k = i.length - 1; k >= 0; k--)
                        if (i[k].priority <= f) return i.splice(k + 1, 0, g), {
                            removeListener: h
                        };
                    i.unshift(g)
                }
                return {
                    removeListener: h
                }
            },
            once: function() {
                var a = Array.prototype.slice.call(arguments),
                    b = a[1];
                return a[1] = function(a) {
                    return a.removeListener(), b.apply(this, arguments)
                }, this.on.apply(this, a)
            },
            capture: function() {
                CKEDITOR.event.useCapture = 1;
                var a = this.on.apply(this, arguments);
                return CKEDITOR.event.useCapture = 0, a
            },
            fire: function() {
                var a = 0,
                    c = function() {
                        a = 1
                    },
                    d = 0,
                    e = function() {
                        d = 1
                    };
                return function(f, g, h) {
                    var i = b(this)[f],
                        f = a,
                        j = d;
                    if (a = d = 0, i) {
                        var k = i.listeners;
                        if (k.length)
                            for (var l, k = k.slice(0), m = 0; m < k.length; m++) {
                                if (i.errorProof) try {
                                    l = k[m].call(this, h, g, c, e)
                                } catch (n) {} else l = k[m].call(this, h, g, c, e);
                                if (l === !1 ? d = 1 : "undefined" != typeof l && (g = l), a || d) break
                            }
                    }
                    return g = d ? !1 : "undefined" == typeof g ? !0 : g, a = f, d = j, g
                }
            }(),
            fireOnce: function(a, c, d) {
                return c = this.fire(a, c, d), delete b(this)[a], c
            },
            removeListener: function(a, c) {
                var d = b(this)[a];
                if (d) {
                    var e = d.getListenerIndex(c);
                    e >= 0 && d.listeners.splice(e, 1)
                }
            },
            removeAllListeners: function() {
                var a, c = b(this);
                for (a in c) delete c[a]
            },
            hasListeners: function(a) {
                return (a = b(this)[a]) && a.listeners.length > 0
            }
        }
    }()), CKEDITOR.editor || (CKEDITOR.editor = function() {
        CKEDITOR._.pending.push([this, arguments]), CKEDITOR.event.call(this)
    }, CKEDITOR.editor.prototype.fire = function(a, b) {
        return a in {
            instanceReady: 1,
            loaded: 1
        } && (this[a] = !0), CKEDITOR.event.prototype.fire.call(this, a, b, this)
    }, CKEDITOR.editor.prototype.fireOnce = function(a, b) {
        return a in {
            instanceReady: 1,
            loaded: 1
        } && (this[a] = !0), CKEDITOR.event.prototype.fireOnce.call(this, a, b, this)
    }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype)), CKEDITOR.env || (CKEDITOR.env = function() {
        var a = navigator.userAgent.toLowerCase(),
            b = {
                ie: a.indexOf("trident/") > -1,
                webkit: a.indexOf(" applewebkit/") > -1,
                air: a.indexOf(" adobeair/") > -1,
                mac: a.indexOf("macintosh") > -1,
                quirks: "BackCompat" == document.compatMode && (!document.documentMode || document.documentMode < 10),
                mobile: a.indexOf("mobile") > -1,
                iOS: /(ipad|iphone|ipod)/.test(a),
                isCustomDomain: function() {
                    if (!this.ie) return !1;
                    var a = document.domain,
                        b = window.location.hostname;
                    return a != b && a != "[" + b + "]"
                },
                secure: "https:" == location.protocol
            };
        b.gecko = "Gecko" == navigator.product && !b.webkit && !b.ie, b.webkit && (a.indexOf("chrome") > -1 ? b.chrome = !0 : b.safari = !0);
        var c = 0;
        if (b.ie && (c = b.quirks || !document.documentMode ? parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode, b.ie9Compat = 9 == c, b.ie8Compat = 8 == c, b.ie7Compat = 7 == c, b.ie6Compat = 7 > c || b.quirks), b.gecko) {
            var d = a.match(/rv:([\d\.]+)/);
            d && (d = d[1].split("."), c = 1e4 * d[0] + 100 * (d[1] || 0) + 1 * (d[2] || 0))
        }
        return b.air && (c = parseFloat(a.match(/ adobeair\/(\d+)/)[1])), b.webkit && (c = parseFloat(a.match(/ applewebkit\/(\d+)/)[1])), b.version = c, b.isCompatible = b.iOS && c >= 534 || !b.mobile && (b.ie && c > 6 || b.gecko && c >= 2e4 || b.air && c >= 1 || b.webkit && c >= 522 || !1), b.hidpi = window.devicePixelRatio >= 2, b.needsBrFiller = b.gecko || b.webkit || b.ie && c > 10, b.needsNbspFiller = b.ie && 11 > c, b.cssClass = "cke_browser_" + (b.ie ? "ie" : b.gecko ? "gecko" : b.webkit ? "webkit" : "unknown"), b.quirks && (b.cssClass = b.cssClass + " cke_browser_quirks"), b.ie && (b.cssClass = b.cssClass + (" cke_browser_ie" + (b.quirks ? "6 cke_browser_iequirks" : b.version))), b.air && (b.cssClass = b.cssClass + " cke_browser_air"), b.iOS && (b.cssClass = b.cssClass + " cke_browser_ios"), b.hidpi && (b.cssClass = b.cssClass + " cke_hidpi"), b
    }()), "unloaded" == CKEDITOR.status && function() {
        CKEDITOR.event.implementOn(CKEDITOR), CKEDITOR.loadFullCore = function() {
                if ("basic_ready" != CKEDITOR.status) CKEDITOR.loadFullCore._load = 1;
                else {
                    delete CKEDITOR.loadFullCore;
                    var a = document.createElement("script");
                    a.type = "text/javascript", a.src = CKEDITOR.basePath + "ckeditor.js", document.getElementsByTagName("head")[0].appendChild(a)
                }
            }, CKEDITOR.loadFullCoreTimeout = 0, CKEDITOR.add = function(a) {
                (this._.pending || (this._.pending = [])).push(a)
            },
            function() {
                CKEDITOR.domReady(function() {
                    var a = CKEDITOR.loadFullCore,
                        b = CKEDITOR.loadFullCoreTimeout;
                    a && (CKEDITOR.status = "basic_ready", a && a._load ? a() : b && setTimeout(function() {
                        CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
                    }, 1e3 * b))
                })
            }(), CKEDITOR.status = "basic_loaded"
    }(), CKEDITOR.dom = {}, function() {
        var a = [],
            b = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.ie ? "-ms-" : "",
            c = /&/g,
            d = />/g,
            e = /</g,
            f = /"/g,
            g = /&amp;/g,
            h = /&gt;/g,
            i = /&lt;/g,
            j = /&quot;/g;
        CKEDITOR.on("reset", function() {
            a = []
        }), CKEDITOR.tools = {
            arrayCompare: function(a, b) {
                if (!a && !b) return !0;
                if (!a || !b || a.length != b.length) return !1;
                for (var c = 0; c < a.length; c++)
                    if (a[c] != b[c]) return !1;
                return !0
            },
            clone: function(a) {
                var b;
                if (a && a instanceof Array) {
                    b = [];
                    for (var c = 0; c < a.length; c++) b[c] = CKEDITOR.tools.clone(a[c]);
                    return b
                }
                if (null === a || "object" != typeof a || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp || a.nodeType || a.window === a) return a;
                b = new a.constructor;
                for (c in a) b[c] = CKEDITOR.tools.clone(a[c]);
                return b
            },
            capitalize: function(a, b) {
                return a.charAt(0).toUpperCase() + (b ? a.slice(1) : a.slice(1).toLowerCase())
            },
            extend: function(a) {
                var b, c, d = arguments.length;
                "boolean" == typeof(b = arguments[d - 1]) ? d-- : "boolean" == typeof(b = arguments[d - 2]) && (c = arguments[d - 1], d -= 2);
                for (var e = 1; d > e; e++) {
                    var f, g = arguments[e];
                    for (f in g)(b === !0 || null == a[f]) && (!c || f in c) && (a[f] = g[f])
                }
                return a
            },
            prototypedCopy: function(a) {
                var b = function() {};
                return b.prototype = a, new b
            },
            copy: function(a) {
                var b, c = {};
                for (b in a) c[b] = a[b];
                return c
            },
            isArray: function(a) {
                return "[object Array]" == Object.prototype.toString.call(a)
            },
            isEmpty: function(a) {
                for (var b in a)
                    if (a.hasOwnProperty(b)) return !1;
                return !0
            },
            cssVendorPrefix: function(a, c, d) {
                return d ? b + a + ":" + c + ";" + a + ":" + c : (d = {}, d[a] = c, d[b + a] = c, d)
            },
            cssStyleToDomStyle: function() {
                var a = document.createElement("div").style,
                    b = "undefined" != typeof a.cssFloat ? "cssFloat" : "undefined" != typeof a.styleFloat ? "styleFloat" : "float";
                return function(a) {
                    return "float" == a ? b : a.replace(/-./g, function(a) {
                        return a.substr(1).toUpperCase()
                    })
                }
            }(),
            buildStyleHtml: function(a) {
                for (var b, a = [].concat(a), c = [], d = 0; d < a.length; d++)(b = a[d]) && (/@import|[{}]/.test(b) ? c.push("<style>" + b + "</style>") : c.push('<link type="text/css" rel=stylesheet href="' + b + '">'));
                return c.join("")
            },
            htmlEncode: function(a) {
                return ("" + a).replace(c, "&amp;").replace(d, "&gt;").replace(e, "&lt;")
            },
            htmlDecode: function(a) {
                return a.replace(g, "&").replace(h, ">").replace(i, "<")
            },
            htmlEncodeAttr: function(a) {
                return a.replace(f, "&quot;").replace(e, "&lt;").replace(d, "&gt;")
            },
            htmlDecodeAttr: function(a) {
                return a.replace(j, '"').replace(i, "<").replace(h, ">")
            },
            getNextNumber: function() {
                var a = 0;
                return function() {
                    return ++a
                }
            }(),
            getNextId: function() {
                return "cke_" + this.getNextNumber()
            },
            override: function(a, b) {
                var c = b(a);
                return c.prototype = a.prototype, c
            },
            setTimeout: function(a, b, c, d, e) {
                return e || (e = window), c || (c = e), e.setTimeout(function() {
                    d ? a.apply(c, [].concat(d)) : a.apply(c)
                }, b || 0)
            },
            trim: function() {
                var a = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
                return function(b) {
                    return b.replace(a, "")
                }
            }(),
            ltrim: function() {
                var a = /^[ \t\n\r]+/g;
                return function(b) {
                    return b.replace(a, "")
                }
            }(),
            rtrim: function() {
                var a = /[ \t\n\r]+$/g;
                return function(b) {
                    return b.replace(a, "")
                }
            }(),
            indexOf: function(a, b) {
                if ("function" == typeof b) {
                    for (var c = 0, d = a.length; d > c; c++)
                        if (b(a[c])) return c
                } else {
                    if (a.indexOf) return a.indexOf(b);
                    for (c = 0, d = a.length; d > c; c++)
                        if (a[c] === b) return c
                }
                return -1
            },
            search: function(a, b) {
                var c = CKEDITOR.tools.indexOf(a, b);
                return c >= 0 ? a[c] : null
            },
            bind: function(a, b) {
                return function() {
                    return a.apply(b, arguments)
                }
            },
            createClass: function(a) {
                var b = a.$,
                    c = a.base,
                    d = a.privates || a._,
                    e = a.proto,
                    a = a.statics;
                if (!b && (b = function() {
                        c && this.base.apply(this, arguments)
                    }), d) var f = b,
                    b = function() {
                        var a, b = this._ || (this._ = {});
                        for (a in d) {
                            var c = d[a];
                            b[a] = "function" == typeof c ? CKEDITOR.tools.bind(c, this) : c
                        }
                        f.apply(this, arguments)
                    };
                return c && (b.prototype = this.prototypedCopy(c.prototype), b.prototype.constructor = b, b.base = c, b.baseProto = c.prototype, b.prototype.base = function() {
                    this.base = c.prototype.base, c.apply(this, arguments), this.base = arguments.callee
                }), e && this.extend(b.prototype, e, !0), a && this.extend(b, a, !0), b
            },
            addFunction: function(b, c) {
                return a.push(function() {
                    return b.apply(c || this, arguments)
                }) - 1
            },
            removeFunction: function(b) {
                a[b] = null
            },
            callFunction: function(b) {
                var c = a[b];
                return c && c.apply(window, Array.prototype.slice.call(arguments, 1))
            },
            cssLength: function() {
                var a, b = /^-?\d+\.?\d*px$/;
                return function(c) {
                    return a = CKEDITOR.tools.trim(c + "") + "px", b.test(a) ? a : c || ""
                }
            }(),
            convertToPx: function() {
                var a;
                return function(b) {
                    return a || (a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document), CKEDITOR.document.getBody().append(a)), /%$/.test(b) ? b : (a.setStyle("width", b), a.$.clientWidth)
                }
            }(),
            repeat: function(a, b) {
                return Array(b + 1).join(a)
            },
            tryThese: function() {
                for (var a, b = 0, c = arguments.length; c > b; b++) {
                    var d = arguments[b];
                    try {
                        a = d();
                        break
                    } catch (e) {}
                }
                return a
            },
            genKey: function() {
                return Array.prototype.slice.call(arguments).join("-")
            },
            defer: function(a) {
                return function() {
                    var b = arguments,
                        c = this;
                    window.setTimeout(function() {
                        a.apply(c, b)
                    }, 0)
                }
            },
            normalizeCssText: function(a, b) {
                var c, d = [],
                    e = CKEDITOR.tools.parseCssText(a, !0, b);
                for (c in e) d.push(c + ":" + e[c]);
                return d.sort(), d.length ? d.join(";") + ";" : ""
            },
            convertRgbToHex: function(a) {
                return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function(a, b, c, d) {
                    for (a = [b, c, d], b = 0; 3 > b; b++) a[b] = ("0" + parseInt(a[b], 10).toString(16)).slice(-2);
                    return "#" + a.join("")
                })
            },
            parseCssText: function(a, b, c) {
                var d = {};
                return c && (c = new CKEDITOR.dom.element("span"), c.setAttribute("style", a), a = CKEDITOR.tools.convertRgbToHex(c.getAttribute("style") || "")), a && ";" != a ? (a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, e) {
                    b && (c = c.toLowerCase(), "font-family" == c && (e = e.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ",")), e = CKEDITOR.tools.trim(e)), d[c] = e
                }), d) : d
            },
            writeCssText: function(a, b) {
                var c, d = [];
                for (c in a) d.push(c + ":" + a[c]);
                return b && d.sort(), d.join("; ")
            },
            objectCompare: function(a, b, c) {
                var d;
                if (!a && !b) return !0;
                if (!a || !b) return !1;
                for (d in a)
                    if (a[d] != b[d]) return !1;
                if (!c)
                    for (d in b)
                        if (a[d] != b[d]) return !1;
                return !0
            },
            objectKeys: function(a) {
                var b, c = [];
                for (b in a) c.push(b);
                return c
            },
            convertArrayToObject: function(a, b) {
                var c = {};
                1 == arguments.length && (b = !0);
                for (var d = 0, e = a.length; e > d; ++d) c[a[d]] = b;
                return c
            },
            fixDomain: function() {
                for (var a;;) try {
                    a = window.parent.document.domain;
                    break
                } catch (b) {
                    if (a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain, !a) break;
                    document.domain = a
                }
                return !!a
            },
            eventsBuffer: function(a, b) {
                function c() {
                    e = (new Date).getTime(), d = !1, b()
                }
                var d, e = 0;
                return {
                    input: function() {
                        if (!d) {
                            var b = (new Date).getTime() - e;
                            a > b ? d = setTimeout(c, a - b) : c()
                        }
                    },
                    reset: function() {
                        d && clearTimeout(d), d = e = 0
                    }
                }
            },
            enableHtml5Elements: function(a, b) {
                for (var c, d = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"], e = d.length; e--;) c = a.createElement(d[e]), b && a.appendChild(c)
            },
            checkIfAnyArrayItemMatches: function(a, b) {
                for (var c = 0, d = a.length; d > c; ++c)
                    if (a[c].match(b)) return !0;
                return !1
            },
            checkIfAnyObjectPropertyMatches: function(a, b) {
                for (var c in a)
                    if (c.match(b)) return !0;
                return !1
            },
            transparentImageData: "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw=="
        }
    }(), CKEDITOR.dtd = function() {
        var a = CKEDITOR.tools.extend,
            b = function(a, b) {
                for (var c = CKEDITOR.tools.clone(a), d = 1; d < arguments.length; d++) {
                    var e, b = arguments[d];
                    for (e in b) delete c[e]
                }
                return c
            },
            c = {},
            d = {},
            e = {
                address: 1,
                article: 1,
                aside: 1,
                blockquote: 1,
                details: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                figure: 1,
                footer: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                header: 1,
                hgroup: 1,
                hr: 1,
                menu: 1,
                nav: 1,
                ol: 1,
                p: 1,
                pre: 1,
                section: 1,
                table: 1,
                ul: 1
            },
            f = {
                command: 1,
                link: 1,
                meta: 1,
                noscript: 1,
                script: 1,
                style: 1
            },
            g = {},
            h = {
                "#": 1
            },
            i = {
                center: 1,
                dir: 1,
                noframes: 1
            };
        return a(c, {
            a: 1,
            abbr: 1,
            area: 1,
            audio: 1,
            b: 1,
            bdi: 1,
            bdo: 1,
            br: 1,
            button: 1,
            canvas: 1,
            cite: 1,
            code: 1,
            command: 1,
            datalist: 1,
            del: 1,
            dfn: 1,
            em: 1,
            embed: 1,
            i: 1,
            iframe: 1,
            img: 1,
            input: 1,
            ins: 1,
            kbd: 1,
            keygen: 1,
            label: 1,
            map: 1,
            mark: 1,
            meter: 1,
            noscript: 1,
            object: 1,
            output: 1,
            progress: 1,
            q: 1,
            ruby: 1,
            s: 1,
            samp: 1,
            script: 1,
            select: 1,
            small: 1,
            span: 1,
            strong: 1,
            sub: 1,
            sup: 1,
            textarea: 1,
            time: 1,
            u: 1,
            "var": 1,
            video: 1,
            wbr: 1
        }, h, {
            acronym: 1,
            applet: 1,
            basefont: 1,
            big: 1,
            font: 1,
            isindex: 1,
            strike: 1,
            style: 1,
            tt: 1
        }), a(d, e, c, i), b = {
            a: b(c, {
                a: 1,
                button: 1
            }),
            abbr: c,
            address: d,
            area: g,
            article: a({
                style: 1
            }, d),
            aside: a({
                style: 1
            }, d),
            audio: a({
                source: 1,
                track: 1
            }, d),
            b: c,
            base: g,
            bdi: c,
            bdo: c,
            blockquote: d,
            body: d,
            br: g,
            button: b(c, {
                a: 1,
                button: 1
            }),
            canvas: c,
            caption: d,
            cite: c,
            code: c,
            col: g,
            colgroup: {
                col: 1
            },
            command: g,
            datalist: a({
                option: 1
            }, c),
            dd: d,
            del: c,
            details: a({
                summary: 1
            }, d),
            dfn: c,
            div: a({
                style: 1
            }, d),
            dl: {
                dt: 1,
                dd: 1
            },
            dt: d,
            em: c,
            embed: g,
            fieldset: a({
                legend: 1
            }, d),
            figcaption: d,
            figure: a({
                figcaption: 1
            }, d),
            footer: d,
            form: d,
            h1: c,
            h2: c,
            h3: c,
            h4: c,
            h5: c,
            h6: c,
            head: a({
                title: 1,
                base: 1
            }, f),
            header: d,
            hgroup: {
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1
            },
            hr: g,
            html: a({
                head: 1,
                body: 1
            }, d, f),
            i: c,
            iframe: h,
            img: g,
            input: g,
            ins: c,
            kbd: c,
            keygen: g,
            label: c,
            legend: c,
            li: d,
            link: g,
            map: d,
            mark: c,
            menu: a({
                li: 1
            }, d),
            meta: g,
            meter: b(c, {
                meter: 1
            }),
            nav: d,
            noscript: a({
                link: 1,
                meta: 1,
                style: 1
            }, c),
            object: a({
                param: 1
            }, c),
            ol: {
                li: 1
            },
            optgroup: {
                option: 1
            },
            option: h,
            output: c,
            p: c,
            param: g,
            pre: c,
            progress: b(c, {
                progress: 1
            }),
            q: c,
            rp: c,
            rt: c,
            ruby: a({
                rp: 1,
                rt: 1
            }, c),
            s: c,
            samp: c,
            script: h,
            section: a({
                style: 1
            }, d),
            select: {
                optgroup: 1,
                option: 1
            },
            small: c,
            source: g,
            span: c,
            strong: c,
            style: h,
            sub: c,
            summary: c,
            sup: c,
            table: {
                caption: 1,
                colgroup: 1,
                thead: 1,
                tfoot: 1,
                tbody: 1,
                tr: 1
            },
            tbody: {
                tr: 1
            },
            td: d,
            textarea: h,
            tfoot: {
                tr: 1
            },
            th: d,
            thead: {
                tr: 1
            },
            time: b(c, {
                time: 1
            }),
            title: h,
            tr: {
                th: 1,
                td: 1
            },
            track: g,
            u: c,
            ul: {
                li: 1
            },
            "var": c,
            video: a({
                source: 1,
                track: 1
            }, d),
            wbr: g,
            acronym: c,
            applet: a({
                param: 1
            }, d),
            basefont: g,
            big: c,
            center: d,
            dialog: g,
            dir: {
                li: 1
            },
            font: c,
            isindex: g,
            noframes: d,
            strike: c,
            tt: c
        }, a(b, {
            $block: a({
                audio: 1,
                dd: 1,
                dt: 1,
                figcaption: 1,
                li: 1,
                video: 1
            }, e, i),
            $blockLimit: {
                article: 1,
                aside: 1,
                audio: 1,
                body: 1,
                caption: 1,
                details: 1,
                dir: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                figcaption: 1,
                figure: 1,
                footer: 1,
                form: 1,
                header: 1,
                hgroup: 1,
                menu: 1,
                nav: 1,
                ol: 1,
                section: 1,
                table: 1,
                td: 1,
                th: 1,
                tr: 1,
                ul: 1,
                video: 1
            },
            $cdata: {
                script: 1,
                style: 1
            },
            $editable: {
                address: 1,
                article: 1,
                aside: 1,
                blockquote: 1,
                body: 1,
                details: 1,
                div: 1,
                fieldset: 1,
                figcaption: 1,
                footer: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                header: 1,
                hgroup: 1,
                nav: 1,
                p: 1,
                pre: 1,
                section: 1
            },
            $empty: {
                area: 1,
                base: 1,
                basefont: 1,
                br: 1,
                col: 1,
                command: 1,
                dialog: 1,
                embed: 1,
                hr: 1,
                img: 1,
                input: 1,
                isindex: 1,
                keygen: 1,
                link: 1,
                meta: 1,
                param: 1,
                source: 1,
                track: 1,
                wbr: 1
            },
            $inline: c,
            $list: {
                dl: 1,
                ol: 1,
                ul: 1
            },
            $listItem: {
                dd: 1,
                dt: 1,
                li: 1
            },
            $nonBodyContent: a({
                body: 1,
                head: 1,
                html: 1
            }, b.head),
            $nonEditable: {
                applet: 1,
                audio: 1,
                button: 1,
                embed: 1,
                iframe: 1,
                map: 1,
                object: 1,
                option: 1,
                param: 1,
                script: 1,
                textarea: 1,
                video: 1
            },
            $object: {
                applet: 1,
                audio: 1,
                button: 1,
                hr: 1,
                iframe: 1,
                img: 1,
                input: 1,
                object: 1,
                select: 1,
                table: 1,
                textarea: 1,
                video: 1
            },
            $removeEmpty: {
                abbr: 1,
                acronym: 1,
                b: 1,
                bdi: 1,
                bdo: 1,
                big: 1,
                cite: 1,
                code: 1,
                del: 1,
                dfn: 1,
                em: 1,
                font: 1,
                i: 1,
                ins: 1,
                label: 1,
                kbd: 1,
                mark: 1,
                meter: 1,
                output: 1,
                q: 1,
                ruby: 1,
                s: 1,
                samp: 1,
                small: 1,
                span: 1,
                strike: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                time: 1,
                tt: 1,
                u: 1,
                "var": 1
            },
            $tabIndex: {
                a: 1,
                area: 1,
                button: 1,
                input: 1,
                object: 1,
                select: 1,
                textarea: 1
            },
            $tableContent: {
                caption: 1,
                col: 1,
                colgroup: 1,
                tbody: 1,
                td: 1,
                tfoot: 1,
                th: 1,
                thead: 1,
                tr: 1
            },
            $transparent: {
                a: 1,
                audio: 1,
                canvas: 1,
                del: 1,
                ins: 1,
                map: 1,
                noscript: 1,
                object: 1,
                video: 1
            },
            $intermediate: {
                caption: 1,
                colgroup: 1,
                dd: 1,
                dt: 1,
                figcaption: 1,
                legend: 1,
                li: 1,
                optgroup: 1,
                option: 1,
                rp: 1,
                rt: 1,
                summary: 1,
                tbody: 1,
                td: 1,
                tfoot: 1,
                th: 1,
                thead: 1,
                tr: 1
            }
        }), b
    }(), CKEDITOR.dom.event = function(a) {
        this.$ = a
    }, CKEDITOR.dom.event.prototype = {
        getKey: function() {
            return this.$.keyCode || this.$.which
        },
        getKeystroke: function() {
            var a = this.getKey();
            return (this.$.ctrlKey || this.$.metaKey) && (a += CKEDITOR.CTRL), this.$.shiftKey && (a += CKEDITOR.SHIFT), this.$.altKey && (a += CKEDITOR.ALT), a
        },
        preventDefault: function(a) {
            var b = this.$;
            b.preventDefault ? b.preventDefault() : b.returnValue = !1, a && this.stopPropagation()
        },
        stopPropagation: function() {
            var a = this.$;
            a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
        },
        getTarget: function() {
            var a = this.$.target || this.$.srcElement;
            return a ? new CKEDITOR.dom.node(a) : null
        },
        getPhase: function() {
            return this.$.eventPhase || 2
        },
        getPageOffset: function() {
            var a = this.getTarget().getDocument().$;
            return {
                x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
                y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
            }
        }
    }, CKEDITOR.CTRL = 1114112, CKEDITOR.SHIFT = 2228224, CKEDITOR.ALT = 4456448, CKEDITOR.EVENT_PHASE_CAPTURING = 1, CKEDITOR.EVENT_PHASE_AT_TARGET = 2, CKEDITOR.EVENT_PHASE_BUBBLING = 3, CKEDITOR.dom.domObject = function(a) {
        a && (this.$ = a)
    }, CKEDITOR.dom.domObject.prototype = function() {
        var a = function(a, b) {
            return function(c) {
                "undefined" != typeof CKEDITOR && a.fire(b, new CKEDITOR.dom.event(c))
            }
        };
        return {
            getPrivate: function() {
                var a;
                return (a = this.getCustomData("_")) || this.setCustomData("_", a = {}), a
            },
            on: function(b) {
                var c = this.getCustomData("_cke_nativeListeners");
                return c || (c = {}, this.setCustomData("_cke_nativeListeners", c)), c[b] || (c = c[b] = a(this, b), this.$.addEventListener ? this.$.addEventListener(b, c, !!CKEDITOR.event.useCapture) : this.$.attachEvent && this.$.attachEvent("on" + b, c)), CKEDITOR.event.prototype.on.apply(this, arguments)
            },
            removeListener: function(a) {
                if (CKEDITOR.event.prototype.removeListener.apply(this, arguments), !this.hasListeners(a)) {
                    var b = this.getCustomData("_cke_nativeListeners"),
                        c = b && b[a];
                    c && (this.$.removeEventListener ? this.$.removeEventListener(a, c, !1) : this.$.detachEvent && this.$.detachEvent("on" + a, c), delete b[a])
                }
            },
            removeAllListeners: function() {
                var a, b = this.getCustomData("_cke_nativeListeners");
                for (a in b) {
                    var c = b[a];
                    this.$.detachEvent ? this.$.detachEvent("on" + a, c) : this.$.removeEventListener && this.$.removeEventListener(a, c, !1), delete b[a]
                }
                CKEDITOR.event.prototype.removeAllListeners.call(this)
            }
        }
    }(), function(a) {
        var b = {};
        CKEDITOR.on("reset", function() {
            b = {}
        }), a.equals = function(a) {
            try {
                return a && a.$ === this.$
            } catch (b) {
                return !1
            }
        }, a.setCustomData = function(a, c) {
            var d = this.getUniqueId();
            return (b[d] || (b[d] = {}))[a] = c, this
        }, a.getCustomData = function(a) {
            var c = this.$["data-cke-expando"];
            return (c = c && b[c]) && a in c ? c[a] : null
        }, a.removeCustomData = function(a) {
            var c, d, e = this.$["data-cke-expando"],
                e = e && b[e];
            return e && (c = e[a], d = a in e, delete e[a]), d ? c : null
        }, a.clearCustomData = function() {
            this.removeAllListeners();
            var a = this.$["data-cke-expando"];
            a && delete b[a]
        }, a.getUniqueId = function() {
            return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
        }, CKEDITOR.event.implementOn(a)
    }(CKEDITOR.dom.domObject.prototype), CKEDITOR.dom.node = function(a) {
        return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
    }, CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject, CKEDITOR.NODE_ELEMENT = 1, CKEDITOR.NODE_DOCUMENT = 9, CKEDITOR.NODE_TEXT = 3, CKEDITOR.NODE_COMMENT = 8, CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11, CKEDITOR.POSITION_IDENTICAL = 0, CKEDITOR.POSITION_DISCONNECTED = 1, CKEDITOR.POSITION_FOLLOWING = 2, CKEDITOR.POSITION_PRECEDING = 4, CKEDITOR.POSITION_IS_CONTAINED = 8, CKEDITOR.POSITION_CONTAINS = 16, CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
        appendTo: function(a, b) {
            return a.append(this, b), a
        },
        clone: function(a, b) {
            var c = this.$.cloneNode(a),
                d = function(c) {
                    if (c["data-cke-expando"] && (c["data-cke-expando"] = !1), c.nodeType == CKEDITOR.NODE_ELEMENT && (b || c.removeAttribute("id", !1), a))
                        for (var c = c.childNodes, e = 0; e < c.length; e++) d(c[e])
                };
            return d(c), new CKEDITOR.dom.node(c)
        },
        hasPrevious: function() {
            return !!this.$.previousSibling
        },
        hasNext: function() {
            return !!this.$.nextSibling
        },
        insertAfter: function(a) {
            return a.$.parentNode.insertBefore(this.$, a.$.nextSibling), a
        },
        insertBefore: function(a) {
            return a.$.parentNode.insertBefore(this.$, a.$), a
        },
        insertBeforeMe: function(a) {
            return this.$.parentNode.insertBefore(a.$, this.$), a
        },
        getAddress: function(a) {
            for (var b = [], c = this.getDocument().$.documentElement, d = this.$; d && d != c;) {
                var e = d.parentNode;
                e && b.unshift(this.getIndex.call({
                    $: d
                }, a)), d = e
            }
            return b
        },
        getDocument: function() {
            return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
        },
        getIndex: function(a) {
            var b, c = this.$,
                d = -1;
            if (!this.$.parentNode) return d;
            do(!a || c == this.$ || c.nodeType != CKEDITOR.NODE_TEXT || !b && c.nodeValue) && (d++, b = c.nodeType == CKEDITOR.NODE_TEXT); while (c = c.previousSibling);
            return d
        },
        getNextSourceNode: function(a, b, c) {
            if (c && !c.call) var d = c,
                c = function(a) {
                    return !a.equals(d)
                };
            var e, a = !a && this.getFirst && this.getFirst();
            if (!a) {
                if (this.type == CKEDITOR.NODE_ELEMENT && c && c(this, !0) === !1) return null;
                a = this.getNext()
            }
            for (; !a && (e = (e || this).getParent());) {
                if (c && c(e, !0) === !1) return null;
                a = e.getNext()
            }
            return !a || c && c(a) === !1 ? null : b && b != a.type ? a.getNextSourceNode(!1, b, c) : a
        },
        getPreviousSourceNode: function(a, b, c) {
            if (c && !c.call) var d = c,
                c = function(a) {
                    return !a.equals(d)
                };
            var e, a = !a && this.getLast && this.getLast();
            if (!a) {
                if (this.type == CKEDITOR.NODE_ELEMENT && c && c(this, !0) === !1) return null;
                a = this.getPrevious()
            }
            for (; !a && (e = (e || this).getParent());) {
                if (c && c(e, !0) === !1) return null;
                a = e.getPrevious()
            }
            return !a || c && c(a) === !1 ? null : b && a.type != b ? a.getPreviousSourceNode(!1, b, c) : a
        },
        getPrevious: function(a) {
            var b, c = this.$;
            do b = (c = c.previousSibling) && 10 != c.nodeType && new CKEDITOR.dom.node(c); while (b && a && !a(b));
            return b
        },
        getNext: function(a) {
            var b, c = this.$;
            do b = (c = c.nextSibling) && new CKEDITOR.dom.node(c); while (b && a && !a(b));
            return b
        },
        getParent: function(a) {
            var b = this.$.parentNode;
            return b && (b.nodeType == CKEDITOR.NODE_ELEMENT || a && b.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(b) : null
        },
        getParents: function(a) {
            var b = this,
                c = [];
            do c[a ? "push" : "unshift"](b); while (b = b.getParent());
            return c
        },
        getCommonAncestor: function(a) {
            if (a.equals(this)) return this;
            if (a.contains && a.contains(this)) return a;
            var b = this.contains ? this : this.getParent();
            do
                if (b.contains(a)) return b;
            while (b = b.getParent());
            return null
        },
        getPosition: function(a) {
            var b = this.$,
                c = a.$;
            if (b.compareDocumentPosition) return b.compareDocumentPosition(c);
            if (b == c) return CKEDITOR.POSITION_IDENTICAL;
            if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
                if (b.contains) {
                    if (b.contains(c)) return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
                    if (c.contains(b)) return CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
                }
                if ("sourceIndex" in b) return b.sourceIndex < 0 || c.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : b.sourceIndex < c.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
            }
            for (var b = this.getAddress(), a = a.getAddress(), c = Math.min(b.length, a.length), d = 0; c - 1 >= d; d++)
                if (b[d] != a[d]) {
                    if (c > d) return b[d] < a[d] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
                    break
                }
            return b.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED + CKEDITOR.POSITION_FOLLOWING
        },
        getAscendant: function(a, b) {
            var c, d, e = this.$;
            b || (e = e.parentNode), "function" == typeof a ? (d = !0, c = a) : (d = !1, c = function(b) {
                return b = "string" == typeof b.nodeName ? b.nodeName.toLowerCase() : "", "string" == typeof a ? b == a : b in a
            });
            for (; e;) {
                if (c(d ? new CKEDITOR.dom.node(e) : e)) return new CKEDITOR.dom.node(e);
                try {
                    e = e.parentNode
                } catch (f) {
                    e = null
                }
            }
            return null
        },
        hasAscendant: function(a, b) {
            var c = this.$;
            for (b || (c = c.parentNode); c;) {
                if (c.nodeName && c.nodeName.toLowerCase() == a) return !0;
                c = c.parentNode
            }
            return !1
        },
        move: function(a, b) {
            a.append(this.remove(), b)
        },
        remove: function(a) {
            var b = this.$,
                c = b.parentNode;
            if (c) {
                if (a)
                    for (; a = b.firstChild;) c.insertBefore(b.removeChild(a), b);
                c.removeChild(b)
            }
            return this
        },
        replace: function(a) {
            this.insertBefore(a), a.remove()
        },
        trim: function() {
            this.ltrim(), this.rtrim()
        },
        ltrim: function() {
            for (var a; this.getFirst && (a = this.getFirst());) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    var b = CKEDITOR.tools.ltrim(a.getText()),
                        c = a.getLength();
                    if (!b) {
                        a.remove();
                        continue
                    }
                    b.length < c && (a.split(c - b.length), this.$.removeChild(this.$.firstChild))
                }
                break
            }
        },
        rtrim: function() {
            for (var a; this.getLast && (a = this.getLast());) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    var b = CKEDITOR.tools.rtrim(a.getText()),
                        c = a.getLength();
                    if (!b) {
                        a.remove();
                        continue
                    }
                    b.length < c && (a.split(b.length), this.$.lastChild.parentNode.removeChild(this.$.lastChild))
                }
                break
            }
            CKEDITOR.env.needsBrFiller && (a = this.$.lastChild) && 1 == a.type && "br" == a.nodeName.toLowerCase() && a.parentNode.removeChild(a)
        },
        isReadOnly: function() {
            var a = this;
            if (this.type != CKEDITOR.NODE_ELEMENT && (a = this.getParent()), a && "undefined" != typeof a.$.isContentEditable) return !(a.$.isContentEditable || a.data("cke-editable"));
            for (; a && !a.data("cke-editable");) {
                if ("false" == a.getAttribute("contentEditable")) return !0;
                if ("true" == a.getAttribute("contentEditable")) break;
                a = a.getParent()
            }
            return !a
        }
    }), CKEDITOR.dom.window = function(a) {
        CKEDITOR.dom.domObject.call(this, a)
    }, CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
        focus: function() {
            this.$.focus()
        },
        getViewPaneSize: function() {
            var a = this.$.document,
                b = "CSS1Compat" == a.compatMode;
            return {
                width: (b ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
                height: (b ? a.documentElement.clientHeight : a.body.clientHeight) || 0
            }
        },
        getScrollPosition: function() {
            var a = this.$;
            return "pageXOffset" in a ? {
                x: a.pageXOffset || 0,
                y: a.pageYOffset || 0
            } : (a = a.document, {
                x: a.documentElement.scrollLeft || a.body.scrollLeft || 0,
                y: a.documentElement.scrollTop || a.body.scrollTop || 0
            })
        },
        getFrame: function() {
            var a = this.$.frameElement;
            return a ? new CKEDITOR.dom.element.get(a) : null
        }
    }), CKEDITOR.dom.document = function(a) {
        CKEDITOR.dom.domObject.call(this, a)
    }, CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject, CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
        type: CKEDITOR.NODE_DOCUMENT,
        appendStyleSheet: function(a) {
            if (this.$.createStyleSheet) this.$.createStyleSheet(a);
            else {
                var b = new CKEDITOR.dom.element("link");
                b.setAttributes({
                    rel: "stylesheet",
                    type: "text/css",
                    href: a
                }), this.getHead().append(b)
            }
        },
        appendStyleText: function(a) {
            if (this.$.createStyleSheet) {
                var b = this.$.createStyleSheet("");
                b.cssText = a
            } else {
                var c = new CKEDITOR.dom.element("style", this);
                c.append(new CKEDITOR.dom.text(a, this)), this.getHead().append(c)
            }
            return b || c.$.sheet
        },
        createElement: function(a, b) {
            var c = new CKEDITOR.dom.element(a, this);
            return b && (b.attributes && c.setAttributes(b.attributes), b.styles && c.setStyles(b.styles)), c
        },
        createText: function(a) {
            return new CKEDITOR.dom.text(a, this)
        },
        focus: function() {
            this.getWindow().focus()
        },
        getActive: function() {
            var a;
            try {
                a = this.$.activeElement
            } catch (b) {
                return null
            }
            return new CKEDITOR.dom.element(a)
        },
        getById: function(a) {
            return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null
        },
        getByAddress: function(a, b) {
            for (var c = this.$.documentElement, d = 0; c && d < a.length; d++) {
                var e = a[d];
                if (b)
                    for (var f = -1, g = 0; g < c.childNodes.length; g++) {
                        var h = c.childNodes[g];
                        if ((b !== !0 || 3 != h.nodeType || !h.previousSibling || 3 != h.previousSibling.nodeType) && (f++, f == e)) {
                            c = h;
                            break
                        }
                    } else c = c.childNodes[e]
            }
            return c ? new CKEDITOR.dom.node(c) : null
        },
        getElementsByTag: function(a, b) {
            return !(CKEDITOR.env.ie && document.documentMode <= 8) && b && (a = b + ":" + a), new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
        },
        getHead: function() {
            var a = this.$.getElementsByTagName("head")[0];
            return a = a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), !0)
        },
        getBody: function() {
            return new CKEDITOR.dom.element(this.$.body)
        },
        getDocumentElement: function() {
            return new CKEDITOR.dom.element(this.$.documentElement)
        },
        getWindow: function() {
            return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView)
        },
        write: function(a) {
            this.$.open("text/html", "replace"), CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain + ")();</script>")), this.$.write(a), this.$.close()
        },
        find: function(a) {
            return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a))
        },
        findOne: function(a) {
            return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null
        },
        _getHtml5ShivFrag: function() {
            var a = this.getCustomData("html5ShivFrag");
            return a || (a = this.$.createDocumentFragment(), CKEDITOR.tools.enableHtml5Elements(a, !0), this.setCustomData("html5ShivFrag", a)), a
        }
    }), CKEDITOR.dom.nodeList = function(a) {
        this.$ = a
    }, CKEDITOR.dom.nodeList.prototype = {
        count: function() {
            return this.$.length
        },
        getItem: function(a) {
            return 0 > a || a >= this.$.length ? null : (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
        }
    }, CKEDITOR.dom.element = function(a, b) {
        "string" == typeof a && (a = (b ? b.$ : document).createElement(a)), CKEDITOR.dom.domObject.call(this, a)
    }, CKEDITOR.dom.element.get = function(a) {
        return (a = "string" == typeof a ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
    }, CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node, CKEDITOR.dom.element.createFromHtml = function(a, b) {
        var c = new CKEDITOR.dom.element("div", b);
        return c.setHtml(a), c.getFirst().remove()
    }, CKEDITOR.dom.element.setMarker = function(a, b, c, d) {
        var e = b.getCustomData("list_marker_id") || b.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),
            f = b.getCustomData("list_marker_names") || b.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
        return a[e] = b, f[c] = 1, b.setCustomData(c, d)
    }, CKEDITOR.dom.element.clearAllMarkers = function(a) {
        for (var b in a) CKEDITOR.dom.element.clearMarkers(a, a[b], 1)
    }, CKEDITOR.dom.element.clearMarkers = function(a, b, c) {
        var d, e = b.getCustomData("list_marker_names"),
            f = b.getCustomData("list_marker_id");
        for (d in e) b.removeCustomData(d);
        b.removeCustomData("list_marker_names"), c && (b.removeCustomData("list_marker_id"), delete a[f])
    }, function() {
        function a(a) {
            var b = !0;
            return a.$.id || (a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber(), b = !1),
                function() {
                    b || a.removeAttribute("id")
                }
        }

        function b(a, b) {
            return "#" + a.$.id + " " + b.split(/,\s*/).join(", #" + a.$.id + " ");
        }

        function c(a) {
            for (var b = 0, c = 0, e = d[a].length; e > c; c++) b += parseInt(this.getComputedStyle(d[a][c]) || 0, 10) || 0;
            return b
        }
        CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
            type: CKEDITOR.NODE_ELEMENT,
            addClass: function(a) {
                var b = this.$.className;
                return b && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)", "").test(b) || (b += " " + a)), this.$.className = b || a, this
            },
            removeClass: function(a) {
                var b = this.getAttribute("class");
                return b && (a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i"), a.test(b) && ((b = b.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", b) : this.removeAttribute("class"))), this
            },
            hasClass: function(a) {
                return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
            },
            append: function(a, b) {
                return "string" == typeof a && (a = this.getDocument().createElement(a)), b ? this.$.insertBefore(a.$, this.$.firstChild) : this.$.appendChild(a.$), a
            },
            appendHtml: function(a) {
                if (this.$.childNodes.length) {
                    var b = new CKEDITOR.dom.element("div", this.getDocument());
                    b.setHtml(a), b.moveChildren(this)
                } else this.setHtml(a)
            },
            appendText: function(a) {
                null != this.$.text ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
            },
            appendBogus: function(a) {
                if (a || CKEDITOR.env.needsBrFiller) {
                    for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());) a = a.getPrevious();
                    a && a.is && a.is("br") || (a = this.getDocument().createElement("br"), CKEDITOR.env.gecko && a.setAttribute("type", "_moz"), this.append(a))
                }
            },
            breakParent: function(a) {
                var b = new CKEDITOR.dom.range(this.getDocument());
                b.setStartAfter(this), b.setEndAfter(a), a = b.extractContents(), b.insertNode(this.remove()), a.insertAfterNode(this)
            },
            contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function(a) {
                var b = this.$;
                return a.type != CKEDITOR.NODE_ELEMENT ? b.contains(a.getParent().$) : b != a.$ && b.contains(a.$)
            } : function(a) {
                return !!(16 & this.$.compareDocumentPosition(a.$))
            },
            focus: function() {
                function a() {
                    try {
                        this.$.focus()
                    } catch (a) {}
                }
                return function(b) {
                    b ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
                }
            }(),
            getHtml: function() {
                var a = this.$.innerHTML;
                return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
            },
            getOuterHtml: function() {
                if (this.$.outerHTML) return this.$.outerHTML.replace(/<\?[^>]*>/, "");
                var a = this.$.ownerDocument.createElement("div");
                return a.appendChild(this.$.cloneNode(!0)), a.innerHTML
            },
            getClientRect: function() {
                var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
                return !a.width && (a.width = a.right - a.left), !a.height && (a.height = a.bottom - a.top), a
            },
            setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function(a) {
                try {
                    var b = this.$;
                    if (this.getParent()) return b.innerHTML = a;
                    var c = this.getDocument()._getHtml5ShivFrag();
                    return c.appendChild(b), b.innerHTML = a, c.removeChild(b), a
                } catch (d) {
                    for (this.$.innerHTML = "", b = new CKEDITOR.dom.element("body", this.getDocument()), b.$.innerHTML = a, b = b.getChildren(); b.count();) this.append(b.getItem(0));
                    return a
                }
            } : function(a) {
                return this.$.innerHTML = a
            },
            setText: function() {
                var a = document.createElement("p");
                return a.innerHTML = "x", a = a.textContent,
                    function(b) {
                        this.$[a ? "textContent" : "innerText"] = b
                    }
            }(),
            getAttribute: function() {
                var a = function(a) {
                    return this.$.getAttribute(a, 2)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
                    switch (a) {
                        case "class":
                            a = "className";
                            break;
                        case "http-equiv":
                            a = "httpEquiv";
                            break;
                        case "name":
                            return this.$.name;
                        case "tabindex":
                            return a = this.$.getAttribute(a, 2), 0 !== a && 0 === this.$.tabIndex && (a = null), a;
                        case "checked":
                            return a = this.$.attributes.getNamedItem(a), (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
                        case "hspace":
                        case "value":
                            return this.$[a];
                        case "style":
                            return this.$.style.cssText;
                        case "contenteditable":
                        case "contentEditable":
                            return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
                    }
                    return this.$.getAttribute(a, 2)
                } : a
            }(),
            getChildren: function() {
                return new CKEDITOR.dom.nodeList(this.$.childNodes)
            },
            getComputedStyle: CKEDITOR.env.ie ? function(a) {
                return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
            } : function(a) {
                var b = this.getWindow().$.getComputedStyle(this.$, null);
                return b ? b.getPropertyValue(a) : ""
            },
            getDtd: function() {
                var a = CKEDITOR.dtd[this.getName()];
                return this.getDtd = function() {
                    return a
                }, a
            },
            getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
            getTabIndex: CKEDITOR.env.ie ? function() {
                var a = this.$.tabIndex;
                return 0 === a && !CKEDITOR.dtd.$tabIndex[this.getName()] && 0 !== parseInt(this.getAttribute("tabindex"), 10) && (a = -1), a
            } : CKEDITOR.env.webkit ? function() {
                var a = this.$.tabIndex;
                return void 0 === a && (a = parseInt(this.getAttribute("tabindex"), 10), isNaN(a) && (a = -1)), a
            } : function() {
                return this.$.tabIndex
            },
            getText: function() {
                return this.$.textContent || this.$.innerText || ""
            },
            getWindow: function() {
                return this.getDocument().getWindow()
            },
            getId: function() {
                return this.$.id || null
            },
            getNameAtt: function() {
                return this.$.name || null
            },
            getName: function() {
                var a = this.$.nodeName.toLowerCase();
                if (CKEDITOR.env.ie && document.documentMode <= 8) {
                    var b = this.$.scopeName;
                    "HTML" != b && (a = b.toLowerCase() + ":" + a)
                }
                return this.getName = function() {
                    return a
                }, this.getName()
            },
            getValue: function() {
                return this.$.value
            },
            getFirst: function(a) {
                var b = this.$.firstChild;
                return (b = b && new CKEDITOR.dom.node(b)) && a && !a(b) && (b = b.getNext(a)), b
            },
            getLast: function(a) {
                var b = this.$.lastChild;
                return (b = b && new CKEDITOR.dom.node(b)) && a && !a(b) && (b = b.getPrevious(a)), b
            },
            getStyle: function(a) {
                return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
            },
            is: function() {
                var a = this.getName();
                if ("object" == typeof arguments[0]) return !!arguments[0][a];
                for (var b = 0; b < arguments.length; b++)
                    if (arguments[b] == a) return !0;
                return !1
            },
            isEditable: function(a) {
                var b = this.getName();
                return this.isReadOnly() || "none" == this.getComputedStyle("display") || "hidden" == this.getComputedStyle("visibility") || CKEDITOR.dtd.$nonEditable[b] || CKEDITOR.dtd.$empty[b] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount() ? !1 : a !== !1 ? (a = CKEDITOR.dtd[b] || CKEDITOR.dtd.span, !(!a || !a["#"])) : !0
            },
            isIdentical: function(a) {
                var b = this.clone(0, 1),
                    a = a.clone(0, 1);
                if (b.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]), a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]), b.$.isEqualNode) return b.$.style.cssText = CKEDITOR.tools.normalizeCssText(b.$.style.cssText), a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText), b.$.isEqualNode(a.$);
                if (b = b.getOuterHtml(), a = a.getOuterHtml(), CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
                    var c = this.getParent();
                    c.type == CKEDITOR.NODE_ELEMENT && (c = c.clone(), c.setHtml(b), b = c.getHtml(), c.setHtml(a), a = c.getHtml())
                }
                return b == a
            },
            isVisible: function() {
                var a, b, c = (this.$.offsetHeight || this.$.offsetWidth) && "hidden" != this.getComputedStyle("visibility");
                return c && CKEDITOR.env.webkit && (a = this.getWindow(), !a.equals(CKEDITOR.document.getWindow()) && (b = a.$.frameElement) && (c = new CKEDITOR.dom.element(b).isVisible())), !!c
            },
            isEmptyInlineRemoveable: function() {
                if (!CKEDITOR.dtd.$removeEmpty[this.getName()]) return !1;
                for (var a = this.getChildren(), b = 0, c = a.count(); c > b; b++) {
                    var d = a.getItem(b);
                    if ((d.type != CKEDITOR.NODE_ELEMENT || !d.data("cke-bookmark")) && (d.type == CKEDITOR.NODE_ELEMENT && !d.isEmptyInlineRemoveable() || d.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(d.getText()))) return !1
                }
                return !0
            },
            hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function() {
                for (var a = this.$.attributes, b = 0; b < a.length; b++) {
                    var c = a[b];
                    switch (c.nodeName) {
                        case "class":
                            if (this.getAttribute("class")) return !0;
                        case "data-cke-expando":
                            continue;
                        default:
                            if (c.specified) return !0
                    }
                }
                return !1
            } : function() {
                var a = this.$.attributes,
                    b = a.length,
                    c = {
                        "data-cke-expando": 1,
                        _moz_dirty: 1
                    };
                return b > 0 && (b > 2 || !c[a[0].nodeName] || 2 == b && !c[a[1].nodeName])
            },
            hasAttribute: function() {
                function a(a) {
                    var b = this.$.attributes.getNamedItem(a);
                    if ("input" == this.getName()) switch (a) {
                        case "class":
                            return this.$.className.length > 0;
                        case "checked":
                            return !!this.$.checked;
                        case "value":
                            return a = this.getAttribute("type"), "checkbox" == a || "radio" == a ? "on" != this.$.value : !!this.$.value
                    }
                    return b ? b.specified : !1
                }
                return CKEDITOR.env.ie ? CKEDITOR.env.version < 8 ? function(b) {
                    return "name" == b ? !!this.$.name : a.call(this, b)
                } : a : function(a) {
                    return !!this.$.attributes.getNamedItem(a)
                }
            }(),
            hide: function() {
                this.setStyle("display", "none")
            },
            moveChildren: function(a, b) {
                var c = this.$,
                    a = a.$;
                if (c != a) {
                    var d;
                    if (b)
                        for (; d = c.lastChild;) a.insertBefore(c.removeChild(d), a.firstChild);
                    else
                        for (; d = c.firstChild;) a.appendChild(c.removeChild(d))
                }
            },
            mergeSiblings: function() {
                function a(a, b, c) {
                    if (b && b.type == CKEDITOR.NODE_ELEMENT) {
                        for (var d = []; b.data("cke-bookmark") || b.isEmptyInlineRemoveable();)
                            if (d.push(b), b = c ? b.getNext() : b.getPrevious(), !b || b.type != CKEDITOR.NODE_ELEMENT) return;
                        if (a.isIdentical(b)) {
                            for (var e = c ? a.getLast() : a.getFirst(); d.length;) d.shift().move(a, !c);
                            b.moveChildren(a, !c), b.remove(), e && e.type == CKEDITOR.NODE_ELEMENT && e.mergeSiblings()
                        }
                    }
                }
                return function(b) {
                    (b === !1 || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) && (a(this, this.getNext(), !0), a(this, this.getPrevious()))
                }
            }(),
            show: function() {
                this.setStyles({
                    display: "",
                    visibility: ""
                })
            },
            setAttribute: function() {
                var a = function(a, b) {
                    return this.$.setAttribute(a, b), this
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(b, c) {
                    return "class" == b ? this.$.className = c : "style" == b ? this.$.style.cssText = c : "tabindex" == b ? this.$.tabIndex = c : "checked" == b ? this.$.checked = c : "contenteditable" == b ? a.call(this, "contentEditable", c) : a.apply(this, arguments), this
                } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function(b, c) {
                    if ("src" == b && c.match(/^http:\/\//)) try {
                        a.apply(this, arguments)
                    } catch (d) {} else a.apply(this, arguments);
                    return this
                } : a
            }(),
            setAttributes: function(a) {
                for (var b in a) this.setAttribute(b, a[b]);
                return this
            },
            setValue: function(a) {
                return this.$.value = a, this
            },
            removeAttribute: function() {
                var a = function(a) {
                    this.$.removeAttribute(a)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) ? function(a) {
                    "class" == a ? a = "className" : "tabindex" == a ? a = "tabIndex" : "contenteditable" == a && (a = "contentEditable"), this.$.removeAttribute(a)
                } : a
            }(),
            removeAttributes: function(a) {
                if (CKEDITOR.tools.isArray(a))
                    for (var b = 0; b < a.length; b++) this.removeAttribute(a[b]);
                else
                    for (b in a) a.hasOwnProperty(b) && this.removeAttribute(b)
            },
            removeStyle: function(a) {
                var b = this.$.style;
                if (b.removeProperty || "border" != a && "margin" != a && "padding" != a) b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a)), this.$.style.cssText || this.removeAttribute("style");
                else {
                    var c, d = ["top", "left", "right", "bottom"];
                    "border" == a && (c = ["color", "style", "width"]);
                    for (var b = [], e = 0; e < d.length; e++)
                        if (c)
                            for (var f = 0; f < c.length; f++) b.push([a, d[e], c[f]].join("-"));
                        else b.push([a, d[e]].join("-"));
                    for (a = 0; a < b.length; a++) this.removeStyle(b[a])
                }
            },
            setStyle: function(a, b) {
                return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b, this
            },
            setStyles: function(a) {
                for (var b in a) this.setStyle(b, a[b]);
                return this
            },
            setOpacity: function(a) {
                CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? (a = Math.round(100 * a), this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")) : this.setStyle("opacity", a)
            },
            unselectable: function() {
                if (this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none")), CKEDITOR.env.ie) {
                    this.setAttribute("unselectable", "on");
                    for (var a, b = this.getElementsByTag("*"), c = 0, d = b.count(); d > c; c++) a = b.getItem(c), a.setAttribute("unselectable", "on")
                }
            },
            getPositionedAncestor: function() {
                for (var a = this;
                    "html" != a.getName();) {
                    if ("static" != a.getComputedStyle("position")) return a;
                    a = a.getParent()
                }
                return null
            },
            getDocumentPosition: function(a) {
                var b = 0,
                    c = 0,
                    d = this.getDocument(),
                    e = d.getBody(),
                    f = "BackCompat" == d.$.compatMode;
                if (document.documentElement.getBoundingClientRect) {
                    var g = this.$.getBoundingClientRect(),
                        h = d.$.documentElement,
                        i = h.clientTop || e.$.clientTop || 0,
                        j = h.clientLeft || e.$.clientLeft || 0,
                        k = !0;
                    CKEDITOR.env.ie && (k = d.getDocumentElement().contains(this), d = d.getBody().contains(this), k = f && d || !f && k), k && (b = g.left + (!f && h.scrollLeft || e.$.scrollLeft), b -= j, c = g.top + (!f && h.scrollTop || e.$.scrollTop), c -= i)
                } else
                    for (e = this, d = null; e && "body" != e.getName() && "html" != e.getName();) {
                        for (b += e.$.offsetLeft - e.$.scrollLeft, c += e.$.offsetTop - e.$.scrollTop, e.equals(this) || (b += e.$.clientLeft || 0, c += e.$.clientTop || 0); d && !d.equals(e);) b -= d.$.scrollLeft, c -= d.$.scrollTop, d = d.getParent();
                        d = e, e = (g = e.$.offsetParent) ? new CKEDITOR.dom.element(g) : null
                    }
                return a && (e = this.getWindow(), d = a.getWindow(), !e.equals(d) && e.$.frameElement && (a = new CKEDITOR.dom.element(e.$.frameElement).getDocumentPosition(a), b += a.x, c += a.y)), document.documentElement.getBoundingClientRect || !CKEDITOR.env.gecko || f || (b += this.$.clientLeft ? 1 : 0, c += this.$.clientTop ? 1 : 0), {
                    x: b,
                    y: c
                }
            },
            scrollIntoView: function(a) {
                var b = this.getParent();
                if (b)
                    do
                        if ((b.$.clientWidth && b.$.clientWidth < b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1), b.is("html")) {
                            var c = b.getWindow();
                            try {
                                var d = c.$.frameElement;
                                d && (b = new CKEDITOR.dom.element(d))
                            } catch (e) {}
                        }
                while (b = b.getParent())
            },
            scrollIntoParent: function(a, b, c) {
                function d(b, c) {
                    /body|html/.test(a.getName()) ? a.getWindow().$.scrollBy(b, c) : (a.$.scrollLeft = a.$.scrollLeft + b, a.$.scrollTop = a.$.scrollTop + c)
                }

                function e(a, b) {
                    var c = {
                        x: 0,
                        y: 0
                    };
                    if (!a.is(k ? "body" : "html")) {
                        var d = a.$.getBoundingClientRect();
                        c.x = d.left, c.y = d.top
                    }
                    return d = a.getWindow(), d.equals(b) || (d = e(CKEDITOR.dom.element.get(d.$.frameElement), b), c.x = c.x + d.x, c.y = c.y + d.y), c
                }

                function f(a, b) {
                    return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
                }
                var g, h, i, j;
                !a && (a = this.getWindow()), i = a.getDocument();
                var k = "BackCompat" == i.$.compatMode;
                a instanceof CKEDITOR.dom.window && (a = k ? i.getBody() : i.getDocumentElement()), i = a.getWindow(), h = e(this, i);
                var l = e(a, i),
                    m = this.$.offsetHeight;
                g = this.$.offsetWidth;
                var n = a.$.clientHeight,
                    o = a.$.clientWidth;
                i = h.x - f(this, "left") - l.x || 0, j = h.y - f(this, "top") - l.y || 0, g = h.x + g + f(this, "right") - (l.x + o) || 0, h = h.y + m + f(this, "bottom") - (l.y + n) || 0, (0 > j || h > 0) && d(0, b === !0 ? j : b === !1 ? h : 0 > j ? j : h), c && (0 > i || g > 0) && d(0 > i ? i : g, 0)
            },
            setState: function(a, b, c) {
                switch (b = b || "cke", a) {
                    case CKEDITOR.TRISTATE_ON:
                        this.addClass(b + "_on"), this.removeClass(b + "_off"), this.removeClass(b + "_disabled"), c && this.setAttribute("aria-pressed", !0), c && this.removeAttribute("aria-disabled");
                        break;
                    case CKEDITOR.TRISTATE_DISABLED:
                        this.addClass(b + "_disabled"), this.removeClass(b + "_off"), this.removeClass(b + "_on"), c && this.setAttribute("aria-disabled", !0), c && this.removeAttribute("aria-pressed");
                        break;
                    default:
                        this.addClass(b + "_off"), this.removeClass(b + "_on"), this.removeClass(b + "_disabled"), c && this.removeAttribute("aria-pressed"), c && this.removeAttribute("aria-disabled")
                }
            },
            getFrameDocument: function() {
                var a = this.$;
                try {
                    a.contentWindow.document
                } catch (b) {
                    a.src = a.src
                }
                return a && new CKEDITOR.dom.document(a.contentWindow.document)
            },
            copyAttributes: function(a, b) {
                for (var c = this.$.attributes, b = b || {}, d = 0; d < c.length; d++) {
                    var e, f = c[d],
                        g = f.nodeName.toLowerCase();
                    g in b || ("checked" == g && (e = this.getAttribute(g)) ? a.setAttribute(g, e) : (!CKEDITOR.env.ie || this.hasAttribute(g)) && (e = this.getAttribute(g), null === e && (e = f.nodeValue), a.setAttribute(g, e)))
                }
                "" !== this.$.style.cssText && (a.$.style.cssText = this.$.style.cssText)
            },
            renameNode: function(a) {
                if (this.getName() != a) {
                    var b = this.getDocument(),
                        a = new CKEDITOR.dom.element(a, b);
                    this.copyAttributes(a), this.moveChildren(a), this.getParent() && this.$.parentNode.replaceChild(a.$, this.$), a.$["data-cke-expando"] = this.$["data-cke-expando"], this.$ = a.$, delete this.getName
                }
            },
            getChild: function() {
                function a(a, b) {
                    var c = a.childNodes;
                    return b >= 0 && b < c.length ? c[b] : void 0
                }
                return function(b) {
                    var c = this.$;
                    if (b.slice)
                        for (; b.length > 0 && c;) c = a(c, b.shift());
                    else c = a(c, b);
                    return c ? new CKEDITOR.dom.node(c) : null
                }
            }(),
            getChildCount: function() {
                return this.$.childNodes.length
            },
            disableContextMenu: function() {
                this.on("contextmenu", function(a) {
                    a.data.getTarget().hasClass("cke_enable_context_menu") || a.data.preventDefault()
                })
            },
            getDirection: function(a) {
                return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() && this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
            },
            data: function(a, b) {
                return a = "data-" + a, void 0 === b ? this.getAttribute(a) : (b === !1 ? this.removeAttribute(a) : this.setAttribute(a, b), null)
            },
            getEditor: function() {
                var a, b, c = CKEDITOR.instances;
                for (a in c)
                    if (b = c[a], b.element.equals(this) && b.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) return b;
                return null
            },
            find: function(c) {
                var d = a(this),
                    c = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(b(this, c)));
                return d(), c
            },
            findOne: function(c) {
                var d = a(this),
                    c = this.$.querySelector(b(this, c));
                return d(), c ? new CKEDITOR.dom.element(c) : null
            },
            forEach: function(a, b, c) {
                if (!(c || b && this.type != b)) var d = a(this);
                if (d !== !1)
                    for (var c = this.getChildren(), e = 0; e < c.count(); e++) d = c.getItem(e), d.type == CKEDITOR.NODE_ELEMENT ? d.forEach(a, b) : (!b || d.type == b) && a(d)
            }
        });
        var d = {
            width: ["border-left-width", "border-right-width", "padding-left", "padding-right"],
            height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
        };
        CKEDITOR.dom.element.prototype.setSize = function(a, b, d) {
            "number" == typeof b && (!d || CKEDITOR.env.ie && CKEDITOR.env.quirks || (b -= c.call(this, a)), this.setStyle(a, b + "px"))
        }, CKEDITOR.dom.element.prototype.getSize = function(a, b) {
            var d = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
            return b && (d -= c.call(this, a)), d
        }
    }(), CKEDITOR.dom.documentFragment = function(a) {
        a = a || CKEDITOR.document, this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a
    }, CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
        type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
        insertAfterNode: function(a) {
            a = a.$, a.parentNode.insertBefore(this.$, a.nextSibling)
        }
    }, !0, {
        append: 1,
        appendBogus: 1,
        getFirst: 1,
        getLast: 1,
        getParent: 1,
        getNext: 1,
        getPrevious: 1,
        appendTo: 1,
        moveChildren: 1,
        insertBefore: 1,
        insertAfterNode: 1,
        replace: 1,
        trim: 1,
        type: 1,
        ltrim: 1,
        rtrim: 1,
        getDocument: 1,
        getChildCount: 1,
        getChild: 1,
        getChildren: 1
    }), function() {
        function a(a, b) {
            var c = this.range;
            if (this._.end) return null;
            if (!this._.start) {
                if (this._.start = 1, c.collapsed) return this.end(), null;
                c.optimize()
            }
            var d, e = c.startContainer;
            d = c.endContainer;
            var f, g = c.startOffset,
                h = c.endOffset,
                i = this.guard,
                j = this.type,
                k = a ? "getPreviousSourceNode" : "getNextSourceNode";
            if (!a && !this._.guardLTR) {
                var l = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent(),
                    m = d.type == CKEDITOR.NODE_ELEMENT ? d.getChild(h) : d.getNext();
                this._.guardLTR = function(a, b) {
                    return !(b && l.equals(a) || m && a.equals(m) || a.type == CKEDITOR.NODE_ELEMENT && b && a.equals(c.root))
                }
            }
            if (a && !this._.guardRTL) {
                var n = e.type == CKEDITOR.NODE_ELEMENT ? e : e.getParent(),
                    o = e.type == CKEDITOR.NODE_ELEMENT ? g ? e.getChild(g - 1) : null : e.getPrevious();
                this._.guardRTL = function(a, b) {
                    return !(b && n.equals(a) || o && a.equals(o) || a.type == CKEDITOR.NODE_ELEMENT && b && a.equals(c.root))
                }
            }
            var p = a ? this._.guardRTL : this._.guardLTR;
            for (f = i ? function(a, b) {
                    return p(a, b) === !1 ? !1 : i(a, b)
                } : p, this.current ? d = this.current[k](!1, j, f) : (a ? d.type == CKEDITOR.NODE_ELEMENT && (d = h > 0 ? d.getChild(h - 1) : f(d, !0) === !1 ? null : d.getPreviousSourceNode(!0, j, f)) : (d = e, d.type != CKEDITOR.NODE_ELEMENT || (d = d.getChild(g)) || (d = f(e, !0) === !1 ? null : e.getNextSourceNode(!0, j, f))), d && f(d) === !1 && (d = null)); d && !this._.end;) {
                if (this.current = d, this.evaluator && this.evaluator(d) === !1) {
                    if (b && this.evaluator) return !1
                } else if (!b) return d;
                d = d[k](!1, j, f)
            }
            return this.end(), this.current = null
        }

        function b(b) {
            for (var c, d = null; c = a.call(this, b);) d = c;
            return d
        }

        function c(a) {
            if (j(a)) return !1;
            if (a.type == CKEDITOR.NODE_TEXT) return !0;
            if (a.type == CKEDITOR.NODE_ELEMENT) {
                if (a.is(CKEDITOR.dtd.$inline) || a.is("hr") || "false" == a.getAttribute("contenteditable")) return !0;
                var b;
                if ((b = !CKEDITOR.env.needsBrFiller) && (b = a.is(k))) a: {
                    b = 0;
                    for (var c = a.getChildCount(); c > b; ++b)
                        if (!j(a.getChild(b))) {
                            b = !1;
                            break a
                        }
                    b = !0
                }
                if (b) return !0
            }
            return !1
        }
        CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
            $: function(a) {
                this.range = a, this._ = {}
            },
            proto: {
                end: function() {
                    this._.end = 1
                },
                next: function() {
                    return a.call(this)
                },
                previous: function() {
                    return a.call(this, 1)
                },
                checkForward: function() {
                    return a.call(this, 0, 1) !== !1
                },
                checkBackward: function() {
                    return a.call(this, 1, 1) !== !1
                },
                lastForward: function() {
                    return b.call(this)
                },
                lastBackward: function() {
                    return b.call(this, 1)
                },
                reset: function() {
                    delete this.current, this._ = {}
                }
            }
        });
        var d = {
                block: 1,
                "list-item": 1,
                table: 1,
                "table-row-group": 1,
                "table-header-group": 1,
                "table-footer-group": 1,
                "table-row": 1,
                "table-column-group": 1,
                "table-column": 1,
                "table-cell": 1,
                "table-caption": 1
            },
            e = {
                absolute: 1,
                fixed: 1
            };
        CKEDITOR.dom.element.prototype.isBlockBoundary = function(a) {
            return "none" != this.getComputedStyle("float") || this.getComputedStyle("position") in e || !d[this.getComputedStyle("display")] ? !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a)) : !0
        }, CKEDITOR.dom.walker.blockBoundary = function(a) {
            return function(b) {
                return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
            }
        }, CKEDITOR.dom.walker.listItemBoundary = function() {
            return this.blockBoundary({
                br: 1
            })
        }, CKEDITOR.dom.walker.bookmark = function(a, b) {
            function c(a) {
                return a && a.getName && "span" == a.getName() && a.data("cke-bookmark")
            }
            return function(d) {
                var e, f;
                return e = d && d.type != CKEDITOR.NODE_ELEMENT && (f = d.getParent()) && c(f), e = a ? e : e || c(d), !!(b ^ e)
            }
        }, CKEDITOR.dom.walker.whitespaces = function(a) {
            return function(b) {
                var c;
                return b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && "​" == b.getText()), !!(a ^ c)
            }
        }, CKEDITOR.dom.walker.invisible = function(a) {
            var b = CKEDITOR.dom.walker.whitespaces(),
                c = CKEDITOR.env.webkit ? 1 : 0;
            return function(d) {
                return b(d) ? d = 1 : (d.type == CKEDITOR.NODE_TEXT && (d = d.getParent()), d = d.$.offsetWidth <= c), !!(a ^ d)
            }
        }, CKEDITOR.dom.walker.nodeType = function(a, b) {
            return function(c) {
                return !!(b ^ c.type == a)
            }
        }, CKEDITOR.dom.walker.bogus = function(a) {
            function b(a) {
                return !g(a) && !h(a)
            }
            return function(c) {
                var d = CKEDITOR.env.needsBrFiller ? c.is && c.is("br") : c.getText && f.test(c.getText());
                return d && (d = c.getParent(), c = c.getNext(b), d = d.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary())), !!(a ^ d)
            }
        }, CKEDITOR.dom.walker.temp = function(a) {
            return function(b) {
                return b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent()), b = b && b.hasAttribute("data-cke-temp"), !!(a ^ b)
            }
        };
        var f = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
            g = CKEDITOR.dom.walker.whitespaces(),
            h = CKEDITOR.dom.walker.bookmark(),
            i = CKEDITOR.dom.walker.temp();
        CKEDITOR.dom.walker.ignored = function(a) {
            return function(b) {
                return b = g(b) || h(b) || i(b), !!(a ^ b)
            }
        };
        var j = CKEDITOR.dom.walker.ignored(),
            k = function(a) {
                var b, c = {};
                for (b in a) CKEDITOR.dtd[b]["#"] && (c[b] = 1);
                return c
            }(CKEDITOR.dtd.$block);
        CKEDITOR.dom.walker.editable = function(a) {
            return function(b) {
                return !!(a ^ c(b))
            }
        }, CKEDITOR.dom.element.prototype.getBogus = function() {
            var a = this;
            do a = a.getPreviousSourceNode(); while (h(a) || g(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty));
            return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && f.test(a.getText())) ? a : !1
        }
    }(), CKEDITOR.dom.range = function(a) {
        this.endOffset = this.endContainer = this.startOffset = this.startContainer = null, this.collapsed = !0;
        var b = a instanceof CKEDITOR.dom.document;
        this.document = b ? a : a.getDocument(), this.root = b ? a.getBody() : a
    }, function() {
        function a() {
            var a = !1,
                b = CKEDITOR.dom.walker.whitespaces(),
                c = CKEDITOR.dom.walker.bookmark(!0),
                d = CKEDITOR.dom.walker.bogus();
            return function(e) {
                return c(e) || b(e) ? !0 : d(e) && !a ? a = !0 : e.type == CKEDITOR.NODE_TEXT && (e.hasAscendant("pre") || CKEDITOR.tools.trim(e.getText()).length) || e.type == CKEDITOR.NODE_ELEMENT && !e.is(f) ? !1 : !0
            }
        }

        function b(a) {
            var b = CKEDITOR.dom.walker.whitespaces(),
                c = CKEDITOR.dom.walker.bookmark(1);
            return function(d) {
                return c(d) || b(d) ? !0 : !a && g(d) || d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$removeEmpty)
            }
        }

        function c(a) {
            return function() {
                var b;
                return this[a ? "getPreviousNode" : "getNextNode"](function(a) {
                    return !b && j(a) && (b = a), i(a) && !(g(a) && a.equals(b))
                })
            }
        }
        var d = function(a) {
                a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
            },
            e = function(a, b, c, d) {
                a.optimizeBookmark();
                var e, f, g = a.startContainer,
                    h = a.endContainer,
                    i = a.startOffset,
                    j = a.endOffset;
                h.type == CKEDITOR.NODE_TEXT ? h = h.split(j) : h.getChildCount() > 0 && (j >= h.getChildCount() ? (h = h.append(a.document.createText("")), f = !0) : h = h.getChild(j)), g.type == CKEDITOR.NODE_TEXT ? (g.split(i), g.equals(h) && (h = g.getNext())) : i ? i >= g.getChildCount() ? (g = g.append(a.document.createText("")), e = !0) : g = g.getChild(i).getPrevious() : (g = g.append(a.document.createText(""), 1), e = !0);
                var k, l, m, i = g.getParents(),
                    j = h.getParents();
                for (k = 0; k < i.length && (l = i[k], m = j[k], l.equals(m)); k++);
                for (var n, o, p, q = c, r = k; r < i.length; r++) {
                    for (n = i[r], q && !n.equals(g) && (o = q.append(n.clone())), n = n.getNext(); n && (!n.equals(j[r]) && !n.equals(h));) p = n.getNext(), 2 == b ? q.append(n.clone(!0)) : (n.remove(), 1 == b && q.append(n)), n = p;
                    q && (q = o)
                }
                for (q = c, c = k; c < j.length; c++) {
                    if (n = j[c], b > 0 && !n.equals(h) && (o = q.append(n.clone())), !i[c] || n.$.parentNode != i[c].$.parentNode)
                        for (n = n.getPrevious(); n && (!n.equals(i[c]) && !n.equals(g));) p = n.getPrevious(), 2 == b ? q.$.insertBefore(n.$.cloneNode(!0), q.$.firstChild) : (n.remove(), 1 == b && q.$.insertBefore(n.$, q.$.firstChild)), n = p;
                    q && (q = o)
                }
                2 == b ? (l = a.startContainer, l.type == CKEDITOR.NODE_TEXT && (l.$.data = l.$.data + l.$.nextSibling.data, l.$.parentNode.removeChild(l.$.nextSibling)), a = a.endContainer, a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling && (a.$.data = a.$.data + a.$.nextSibling.data, a.$.parentNode.removeChild(a.$.nextSibling))) : (l && m && (g.$.parentNode != l.$.parentNode || h.$.parentNode != m.$.parentNode) && (b = m.getIndex(), e && m.$.parentNode == g.$.parentNode && b--, d && l.type == CKEDITOR.NODE_ELEMENT ? (d = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>', a.document), d.insertAfter(l), l.mergeSiblings(!1), a.moveToBookmark({
                    startNode: d
                })) : a.setStart(m.getParent(), b)), a.collapse(!0)), e && g.remove(), f && h.$.parentNode && h.remove()
            },
            f = {
                abbr: 1,
                acronym: 1,
                b: 1,
                bdo: 1,
                big: 1,
                cite: 1,
                code: 1,
                del: 1,
                dfn: 1,
                em: 1,
                font: 1,
                i: 1,
                ins: 1,
                label: 1,
                kbd: 1,
                q: 1,
                samp: 1,
                small: 1,
                span: 1,
                strike: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                tt: 1,
                u: 1,
                "var": 1
            },
            g = CKEDITOR.dom.walker.bogus(),
            h = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/,
            i = CKEDITOR.dom.walker.editable(),
            j = CKEDITOR.dom.walker.ignored(!0);
        CKEDITOR.dom.range.prototype = {
            clone: function() {
                var a = new CKEDITOR.dom.range(this.root);
                return a.startContainer = this.startContainer, a.startOffset = this.startOffset, a.endContainer = this.endContainer, a.endOffset = this.endOffset, a.collapsed = this.collapsed, a
            },
            collapse: function(a) {
                a ? (this.endContainer = this.startContainer, this.endOffset = this.startOffset) : (this.startContainer = this.endContainer, this.startOffset = this.endOffset), this.collapsed = !0
            },
            cloneContents: function() {
                var a = new CKEDITOR.dom.documentFragment(this.document);
                return this.collapsed || e(this, 2, a), a
            },
            deleteContents: function(a) {
                this.collapsed || e(this, 0, null, a)
            },
            extractContents: function(a) {
                var b = new CKEDITOR.dom.documentFragment(this.document);
                return this.collapsed || e(this, 1, b, a), b
            },
            createBookmark: function(a) {
                var b, c, d, e, f = this.collapsed;
                return b = this.document.createElement("span"), b.data("cke-bookmark", 1), b.setStyle("display", "none"), b.setHtml("&nbsp;"), a && (d = "cke_bm_" + CKEDITOR.tools.getNextNumber(), b.setAttribute("id", d + (f ? "C" : "S"))), f || (c = b.clone(), c.setHtml("&nbsp;"), a && c.setAttribute("id", d + "E"), e = this.clone(), e.collapse(), e.insertNode(c)), e = this.clone(), e.collapse(!0), e.insertNode(b), c ? (this.setStartAfter(b), this.setEndBefore(c)) : this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END), {
                    startNode: a ? d + (f ? "C" : "S") : b,
                    endNode: a ? d + "E" : c,
                    serializable: a,
                    collapsed: f
                }
            },
            createBookmark2: function() {
                function a(a) {
                    var b, c = a.container,
                        d = a.offset;
                    b = c;
                    var e = d;
                    if (b = b.type != CKEDITOR.NODE_ELEMENT || 0 === e || e == b.getChildCount() ? 0 : b.getChild(e - 1).type == CKEDITOR.NODE_TEXT && b.getChild(e).type == CKEDITOR.NODE_TEXT, b && (c = c.getChild(d - 1), d = c.getLength()), c.type == CKEDITOR.NODE_ELEMENT && d > 1 && (d = c.getChild(d - 1).getIndex(!0) + 1), c.type == CKEDITOR.NODE_TEXT) {
                        for (b = c, e = 0;
                            (b = b.getPrevious()) && b.type == CKEDITOR.NODE_TEXT;) e += b.getLength();
                        d += e
                    }
                    a.container = c, a.offset = d
                }
                return function(b) {
                    var c = this.collapsed,
                        d = {
                            container: this.startContainer,
                            offset: this.startOffset
                        },
                        e = {
                            container: this.endContainer,
                            offset: this.endOffset
                        };
                    return b && (a(d), c || a(e)), {
                        start: d.container.getAddress(b),
                        end: c ? null : e.container.getAddress(b),
                        startOffset: d.offset,
                        endOffset: e.offset,
                        normalized: b,
                        collapsed: c,
                        is2: !0
                    }
                }
            }(),
            moveToBookmark: function(a) {
                if (a.is2) {
                    var b = this.document.getByAddress(a.start, a.normalized),
                        c = a.startOffset,
                        d = a.end && this.document.getByAddress(a.end, a.normalized),
                        a = a.endOffset;
                    this.setStart(b, c), d ? this.setEnd(d, a) : this.collapse(!0)
                } else b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode, a = c ? this.document.getById(a.endNode) : a.endNode, this.setStartBefore(b), b.remove(), a ? (this.setEndBefore(a), a.remove()) : this.collapse(!0)
            },
            getBoundaryNodes: function() {
                var a, b = this.startContainer,
                    c = this.endContainer,
                    d = this.startOffset,
                    e = this.endOffset;
                if (b.type == CKEDITOR.NODE_ELEMENT)
                    if (a = b.getChildCount(), a > d) b = b.getChild(d);
                    else if (1 > a) b = b.getPreviousSourceNode();
                else {
                    for (b = b.$; b.lastChild;) b = b.lastChild;
                    b = new CKEDITOR.dom.node(b), b = b.getNextSourceNode() || b
                }
                if (c.type == CKEDITOR.NODE_ELEMENT)
                    if (a = c.getChildCount(), a > e) c = c.getChild(e).getPreviousSourceNode(!0);
                    else if (1 > a) c = c.getPreviousSourceNode();
                else {
                    for (c = c.$; c.lastChild;) c = c.lastChild;
                    c = new CKEDITOR.dom.node(c)
                }
                return b.getPosition(c) & CKEDITOR.POSITION_FOLLOWING && (b = c), {
                    startNode: b,
                    endNode: c
                }
            },
            getCommonAncestor: function(a, b) {
                var c = this.startContainer,
                    d = this.endContainer,
                    c = c.equals(d) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
                return b && !c.is ? c.getParent() : c
            },
            optimize: function() {
                var a = this.startContainer,
                    b = this.startOffset;
                a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) : this.setStartBefore(a)), a = this.endContainer, b = this.endOffset, a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
            },
            optimizeBookmark: function() {
                var a = this.startContainer,
                    b = this.endContainer;
                a.is && a.is("span") && a.data("cke-bookmark") && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START), b && b.is && b.is("span") && b.data("cke-bookmark") && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
            },
            trim: function(a, b) {
                var c = this.startContainer,
                    d = this.startOffset,
                    e = this.collapsed;
                if ((!a || e) && c && c.type == CKEDITOR.NODE_TEXT) {
                    if (d)
                        if (d >= c.getLength()) d = c.getIndex() + 1, c = c.getParent();
                        else {
                            var f = c.split(d),
                                d = c.getIndex() + 1,
                                c = c.getParent();
                            this.startContainer.equals(this.endContainer) ? this.setEnd(f, this.endOffset - this.startOffset) : c.equals(this.endContainer) && (this.endOffset = this.endOffset + 1)
                        } else d = c.getIndex(), c = c.getParent();
                    if (this.setStart(c, d), e) return void this.collapse(!0)
                }
                c = this.endContainer, d = this.endOffset, b || e || !c || c.type != CKEDITOR.NODE_TEXT || (d ? (d >= c.getLength() || c.split(d), d = c.getIndex() + 1) : d = c.getIndex(), c = c.getParent(), this.setEnd(c, d))
            },
            enlarge: function(a, b) {
                function c(a) {
                    return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
                }
                var d = RegExp(/[^\s\ufeff]/);
                switch (a) {
                    case CKEDITOR.ENLARGE_INLINE:
                        var e = 1;
                    case CKEDITOR.ENLARGE_ELEMENT:
                        if (this.collapsed) break;
                        var f, g, h, i, j, k, l, m = this.getCommonAncestor(),
                            n = this.root,
                            o = !1;
                        k = this.startContainer;
                        var p = this.startOffset;
                        for (k.type == CKEDITOR.NODE_TEXT ? (p && (k = !CKEDITOR.tools.trim(k.substring(0, p)).length && k, o = !!k), k && !(i = k.getPrevious()) && (h = k.getParent())) : (p && (i = k.getChild(p - 1) || k.getLast()), i || (h = k)), h = c(h); h || i;) {
                            if (h && !i) {
                                if (!j && h.equals(m) && (j = !0), e ? h.isBlockBoundary() : !n.contains(h)) break;
                                o && "inline" == h.getComputedStyle("display") || (o = !1, j ? f = h : this.setStartBefore(h)), i = h.getPrevious()
                            }
                            for (; i;)
                                if (k = !1, i.type == CKEDITOR.NODE_COMMENT) i = i.getPrevious();
                                else {
                                    if (i.type == CKEDITOR.NODE_TEXT) l = i.getText(), d.test(l) && (i = null), k = /[\s\ufeff]$/.test(l);
                                    else if ((i.$.offsetWidth > (CKEDITOR.env.webkit ? 1 : 0) || b && i.is("br")) && !i.data("cke-bookmark"))
                                        if (o && CKEDITOR.dtd.$removeEmpty[i.getName()]) {
                                            if (l = i.getText(), d.test(l)) i = null;
                                            else
                                                for (var q, p = i.$.getElementsByTagName("*"), r = 0; q = p[r++];)
                                                    if (!CKEDITOR.dtd.$removeEmpty[q.nodeName.toLowerCase()]) {
                                                        i = null;
                                                        break
                                                    }
                                            i && (k = !!l.length)
                                        } else i = null;
                                    if (k && (o ? j ? f = h : h && this.setStartBefore(h) : o = !0), i) {
                                        if (k = i.getPrevious(), !h && !k) {
                                            h = i, i = null;
                                            break
                                        }
                                        i = k
                                    } else h = null
                                }
                            h && (h = c(h.getParent()))
                        }
                        k = this.endContainer, p = this.endOffset, h = i = null, j = o = !1;
                        var s = function(a, b) {
                            var c = new CKEDITOR.dom.range(n);
                            c.setStart(a, b), c.setEndAt(n, CKEDITOR.POSITION_BEFORE_END);
                            var e, c = new CKEDITOR.dom.walker(c);
                            for (c.guard = function(a) {
                                    return !(a.type == CKEDITOR.NODE_ELEMENT && a.isBlockBoundary())
                                }; e = c.next();) {
                                if (e.type != CKEDITOR.NODE_TEXT) return !1;
                                if (l = e != a ? e.getText() : e.substring(b), d.test(l)) return !1
                            }
                            return !0
                        };
                        for (k.type == CKEDITOR.NODE_TEXT ? CKEDITOR.tools.trim(k.substring(p)).length ? o = !0 : (o = !k.getLength(), p == k.getLength() ? (i = k.getNext()) || (h = k.getParent()) : s(k, p) && (h = k.getParent())) : (i = k.getChild(p)) || (h = k); h || i;) {
                            if (h && !i) {
                                if (!j && h.equals(m) && (j = !0), e ? h.isBlockBoundary() : !n.contains(h)) break;
                                o && "inline" == h.getComputedStyle("display") || (o = !1, j ? g = h : h && this.setEndAfter(h)), i = h.getNext()
                            }
                            for (; i;) {
                                if (k = !1, i.type == CKEDITOR.NODE_TEXT) l = i.getText(), s(i, 0) || (i = null), k = /^[\s\ufeff]/.test(l);
                                else if (i.type == CKEDITOR.NODE_ELEMENT) {
                                    if ((i.$.offsetWidth > 0 || b && i.is("br")) && !i.data("cke-bookmark"))
                                        if (o && CKEDITOR.dtd.$removeEmpty[i.getName()]) {
                                            if (l = i.getText(), d.test(l)) i = null;
                                            else
                                                for (p = i.$.getElementsByTagName("*"), r = 0; q = p[r++];)
                                                    if (!CKEDITOR.dtd.$removeEmpty[q.nodeName.toLowerCase()]) {
                                                        i = null;
                                                        break
                                                    }
                                            i && (k = !!l.length)
                                        } else i = null
                                } else k = 1;
                                if (k && o && (j ? g = h : this.setEndAfter(h)), i) {
                                    if (k = i.getNext(), !h && !k) {
                                        h = i, i = null;
                                        break
                                    }
                                    i = k
                                } else h = null
                            }
                            h && (h = c(h.getParent()))
                        }
                        f && g && (m = f.contains(g) ? g : f, this.setStartBefore(m), this.setEndAfter(m));
                        break;
                    case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
                    case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
                        h = new CKEDITOR.dom.range(this.root), n = this.root, h.setStartAt(n, CKEDITOR.POSITION_AFTER_START), h.setEnd(this.startContainer, this.startOffset), h = new CKEDITOR.dom.walker(h);
                        var t, u, v = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {
                                br: 1
                            } : null),
                            w = null,
                            x = function(a) {
                                if (a.type == CKEDITOR.NODE_ELEMENT && "false" == a.getAttribute("contenteditable"))
                                    if (w) {
                                        if (w.equals(a)) return void(w = null)
                                    } else w = a;
                                else if (w) return;
                                var b = v(a);
                                return b || (t = a), b
                            },
                            e = function(a) {
                                var b = x(a);
                                return !b && a.is && a.is("br") && (u = a), b
                            };
                        if (h.guard = x, h = h.lastBackward(), t = t || n, this.setStartAt(t, !t.is("br") && (!h && this.checkStartOfBlock() || h && t.contains(h)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END), a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                            h = this.clone(), h = new CKEDITOR.dom.walker(h);
                            var y = CKEDITOR.dom.walker.whitespaces(),
                                z = CKEDITOR.dom.walker.bookmark();
                            if (h.evaluator = function(a) {
                                    return !y(a) && !z(a)
                                }, (h = h.previous()) && h.type == CKEDITOR.NODE_ELEMENT && h.is("br")) break
                        }
                        h = this.clone(), h.collapse(), h.setEndAt(n, CKEDITOR.POSITION_BEFORE_END), h = new CKEDITOR.dom.walker(h), h.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? e : x, t = w = u = null, h = h.lastForward(), t = t || n, this.setEndAt(t, !h && this.checkEndOfBlock() || h && t.contains(h) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START), u && this.setEndAfter(u)
                }
            },
            shrink: function(a, b, c) {
                if (!this.collapsed) {
                    var a = a || CKEDITOR.SHRINK_TEXT,
                        d = this.clone(),
                        e = this.startContainer,
                        f = this.endContainer,
                        g = this.startOffset,
                        h = this.endOffset,
                        i = 1,
                        j = 1;
                    e && e.type == CKEDITOR.NODE_TEXT && (g ? g >= e.getLength() ? d.setStartAfter(e) : (d.setStartBefore(e), i = 0) : d.setStartBefore(e)), f && f.type == CKEDITOR.NODE_TEXT && (h ? h >= f.getLength() ? d.setEndAfter(f) : (d.setEndAfter(f), j = 0) : d.setEndBefore(f));
                    var d = new CKEDITOR.dom.walker(d),
                        k = CKEDITOR.dom.walker.bookmark();
                    d.evaluator = function(b) {
                        return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
                    };
                    var l;
                    return d.guard = function(b, d) {
                        return k(b) ? !0 : a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || d && b.equals(l) || c === !1 && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable") ? !1 : (!d && b.type == CKEDITOR.NODE_ELEMENT && (l = b), !0)
                    }, i && (e = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(e, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START), j && (d.reset(), (d = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(d, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)), !(!i && !j)
                }
            },
            insertNode: function(a) {
                this.optimizeBookmark(), this.trim(!1, !0);
                var b = this.startContainer,
                    c = b.getChild(this.startOffset);
                c ? a.insertBefore(c) : b.append(a), a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++, this.setStartBefore(a)
            },
            moveToPosition: function(a, b) {
                this.setStartAt(a, b), this.collapse(!0)
            },
            moveToRange: function(a) {
                this.setStart(a.startContainer, a.startOffset), this.setEnd(a.endContainer, a.endOffset)
            },
            selectNodeContents: function(a) {
                this.setStart(a, 0), this.setEnd(a, a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
            },
            setStart: function(a, b) {
                a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()] && (b = a.getIndex(), a = a.getParent()), this.startContainer = a, this.startOffset = b, this.endContainer || (this.endContainer = a, this.endOffset = b), d(this)
            },
            setEnd: function(a, b) {
                a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()] && (b = a.getIndex() + 1, a = a.getParent()), this.endContainer = a, this.endOffset = b, this.startContainer || (this.startContainer = a, this.startOffset = b), d(this)
            },
            setStartAfter: function(a) {
                this.setStart(a.getParent(), a.getIndex() + 1)
            },
            setStartBefore: function(a) {
                this.setStart(a.getParent(), a.getIndex())
            },
            setEndAfter: function(a) {
                this.setEnd(a.getParent(), a.getIndex() + 1)
            },
            setEndBefore: function(a) {
                this.setEnd(a.getParent(), a.getIndex())
            },
            setStartAt: function(a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setStart(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setStartBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setStartAfter(a)
                }
                d(this)
            },
            setEndAt: function(a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setEnd(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setEndBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setEndAfter(a)
                }
                d(this)
            },
            fixBlock: function(a, b) {
                var c = this.createBookmark(),
                    d = this.document.createElement(b);
                return this.collapse(a), this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS), this.extractContents().appendTo(d), d.trim(), d.appendBogus(), this.insertNode(d), this.moveToBookmark(c), d
            },
            splitBlock: function(a) {
                var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
                    c = new CKEDITOR.dom.elementPath(this.endContainer, this.root),
                    d = b.block,
                    e = c.block,
                    f = null;
                return b.blockLimit.equals(c.blockLimit) ? ("br" != a && (d || (d = this.fixBlock(!0, a), e = new CKEDITOR.dom.elementPath(this.endContainer, this.root).block), e || (e = this.fixBlock(!1, a))), a = d && this.checkStartOfBlock(), b = e && this.checkEndOfBlock(), this.deleteContents(), d && d.equals(e) && (b ? (f = new CKEDITOR.dom.elementPath(this.startContainer, this.root), this.moveToPosition(e, CKEDITOR.POSITION_AFTER_END), e = null) : a ? (f = new CKEDITOR.dom.elementPath(this.startContainer, this.root), this.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START), d = null) : (e = this.splitElement(d), d.is("ul", "ol") || d.appendBogus())), {
                    previousBlock: d,
                    nextBlock: e,
                    wasStartOfBlock: a,
                    wasEndOfBlock: b,
                    elementPath: f
                }) : null
            },
            splitElement: function(a) {
                if (!this.collapsed) return null;
                this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
                var b = this.extractContents(),
                    c = a.clone(!1);
                return b.appendTo(c), c.insertAfter(a), this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END), c
            },
            removeEmptyBlocksAtEnd: function() {
                function a(a) {
                    return function(d) {
                        return b(d) || c(d) || d.type == CKEDITOR.NODE_ELEMENT && d.isEmptyInlineRemoveable() || a.is("table") && d.is("caption") ? !1 : !0
                    }
                }
                var b = CKEDITOR.dom.walker.whitespaces(),
                    c = CKEDITOR.dom.walker.bookmark(!1);
                return function(b) {
                    for (var c, d = this.createBookmark(), e = this[b ? "endPath" : "startPath"](), f = e.block || e.blockLimit; f && !f.equals(e.root) && !f.getFirst(a(f));) c = f.getParent(), this[b ? "setEndAt" : "setStartAt"](f, CKEDITOR.POSITION_AFTER_END), f.remove(1), f = c;
                    this.moveToBookmark(d)
                }
            }(),
            startPath: function() {
                return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
            },
            endPath: function() {
                return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
            },
            checkBoundaryOfElement: function(a, c) {
                var d = c == CKEDITOR.START,
                    e = this.clone();
                return e.collapse(d), e[d ? "setStartAt" : "setEndAt"](a, d ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END), e = new CKEDITOR.dom.walker(e), e.evaluator = b(d), e[d ? "checkBackward" : "checkForward"]()
            },
            checkStartOfBlock: function() {
                var b = this.startContainer,
                    c = this.startOffset;
                return CKEDITOR.env.ie && c && b.type == CKEDITOR.NODE_TEXT && (b = CKEDITOR.tools.ltrim(b.substring(0, c)), h.test(b) && this.trim(0, 1)), this.trim(), b = new CKEDITOR.dom.elementPath(this.startContainer, this.root), c = this.clone(), c.collapse(!0), c.setStartAt(b.block || b.blockLimit, CKEDITOR.POSITION_AFTER_START), b = new CKEDITOR.dom.walker(c), b.evaluator = a(), b.checkBackward()
            },
            checkEndOfBlock: function() {
                var b = this.endContainer,
                    c = this.endOffset;
                return CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT && (b = CKEDITOR.tools.rtrim(b.substring(c)), h.test(b) && this.trim(1, 0)), this.trim(), b = new CKEDITOR.dom.elementPath(this.endContainer, this.root), c = this.clone(), c.collapse(!1), c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END), b = new CKEDITOR.dom.walker(c), b.evaluator = a(), b.checkForward()
            },
            getPreviousNode: function(a, b, c) {
                var d = this.clone();
                return d.collapse(1), d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START), c = new CKEDITOR.dom.walker(d), c.evaluator = a, c.guard = b, c.previous()
            },
            getNextNode: function(a, b, c) {
                var d = this.clone();
                return d.collapse(), d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END), c = new CKEDITOR.dom.walker(d), c.evaluator = a, c.guard = b, c.next()
            },
            checkReadOnly: function() {
                function a(a, b) {
                    for (; a;) {
                        if (a.type == CKEDITOR.NODE_ELEMENT) {
                            if ("false" == a.getAttribute("contentEditable") && !a.data("cke-editable")) return 0;
                            if (a.is("html") || "true" == a.getAttribute("contentEditable") && (a.contains(b) || a.equals(b))) break
                        }
                        a = a.getParent()
                    }
                    return 1
                }
                return function() {
                    var b = this.startContainer,
                        c = this.endContainer;
                    return !(a(b, c) && a(c, b))
                }
            }(),
            moveToElementEditablePosition: function(a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(!1)) return this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START), !0;
                for (var c = 0; a;) {
                    if (a.type == CKEDITOR.NODE_TEXT) {
                        b && this.endContainer && this.checkEndOfBlock() && h.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START), c = 1;
                        break
                    }
                    if (a.type == CKEDITOR.NODE_ELEMENT)
                        if (a.isEditable()) this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START), c = 1;
                        else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock()) this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
                    else if ("false" == a.getAttribute("contenteditable") && a.is(CKEDITOR.dtd.$block)) return this.setStartBefore(a), this.setEndAfter(a), !0;
                    var d = a,
                        e = c,
                        f = void 0;
                    d.type == CKEDITOR.NODE_ELEMENT && d.isEditable(!1) && (f = d[b ? "getLast" : "getFirst"](j)), !e && !f && (f = d[b ? "getPrevious" : "getNext"](j)), a = f
                }
                return !!c
            },
            moveToClosestEditablePosition: function(a, b) {
                var c, d = new CKEDITOR.dom.range(this.root),
                    e = 0,
                    f = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
                return d.moveToPosition(a, f[b ? 0 : 1]), a.is(CKEDITOR.dtd.$block) ? (c = d[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) && (e = 1, c.type == CKEDITOR.NODE_ELEMENT && c.is(CKEDITOR.dtd.$block) && "false" == c.getAttribute("contenteditable") ? (d.setStartAt(c, CKEDITOR.POSITION_BEFORE_START), d.setEndAt(c, CKEDITOR.POSITION_AFTER_END)) : d.moveToPosition(c, f[b ? 1 : 0])) : e = 1, e && this.moveToRange(d), !!e
            },
            moveToElementEditStart: function(a) {
                return this.moveToElementEditablePosition(a)
            },
            moveToElementEditEnd: function(a) {
                return this.moveToElementEditablePosition(a, !0)
            },
            getEnclosedNode: function() {
                var a = this.clone();
                if (a.optimize(), a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT) return null;
                var a = new CKEDITOR.dom.walker(a),
                    b = CKEDITOR.dom.walker.bookmark(!1, !0),
                    c = CKEDITOR.dom.walker.whitespaces(!0);
                a.evaluator = function(a) {
                    return c(a) && b(a)
                };
                var d = a.next();
                return a.reset(), d && d.equals(a.previous()) ? d : null
            },
            getTouchedStartNode: function() {
                var a = this.startContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
            },
            getTouchedEndNode: function() {
                var a = this.endContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
            },
            getNextEditableNode: c(),
            getPreviousEditableNode: c(1),
            scrollIntoView: function() {
                var a, b, c, d = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document),
                    e = this.clone();
                e.optimize(), (c = e.startContainer.type == CKEDITOR.NODE_TEXT) ? (b = e.startContainer.getText(), a = e.startContainer.split(e.startOffset), d.insertAfter(e.startContainer)) : e.insertNode(d), d.scrollIntoView(), c && (e.startContainer.setText(b), a.remove()), d.remove()
            }
        }
    }(), CKEDITOR.POSITION_AFTER_START = 1, CKEDITOR.POSITION_BEFORE_END = 2, CKEDITOR.POSITION_BEFORE_START = 3, CKEDITOR.POSITION_AFTER_END = 4, CKEDITOR.ENLARGE_ELEMENT = 1, CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2, CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3, CKEDITOR.ENLARGE_INLINE = 4, CKEDITOR.START = 1, CKEDITOR.END = 2, CKEDITOR.SHRINK_ELEMENT = 1, CKEDITOR.SHRINK_TEXT = 2, function() {
        function a(a) {
            arguments.length < 1 || (this.range = a, this.forceBrBreak = 0, this.enlargeBr = 1, this.enforceRealBlocks = 0, this._ || (this._ = {}))
        }

        function b(a, b, c) {
            for (a = a.getNextSourceNode(b, null, c); !g(a);) a = a.getNextSourceNode(b, null, c);
            return a
        }

        function c(a) {
            var b = [];
            return a.forEach(function(a) {
                return "true" == a.getAttribute("contenteditable") ? (b.push(a), !1) : void 0
            }, CKEDITOR.NODE_ELEMENT, !0), b
        }

        function d(a, b, e, f) {
            a: {
                null == f && (f = c(e));
                for (var g; g = f.shift();)
                    if (g.getDtd().p) {
                        f = {
                            element: g,
                            remaining: f
                        };
                        break a
                    }
                f = null
            }
            return f ? (g = CKEDITOR.filter.instances[f.element.data("cke-filter")]) && !g.check(b) ? d(a, b, e, f.remaining) : (b = new CKEDITOR.dom.range(f.element), b.selectNodeContents(f.element), b = b.createIterator(), b.enlargeBr = a.enlargeBr, b.enforceRealBlocks = a.enforceRealBlocks, b.activeFilter = b.filter = g, a._.nestedEditable = {
                element: f.element,
                container: e,
                remaining: f.remaining,
                iterator: b
            }, 1) : 0
        }

        function e(a, b, c) {
            return b ? (a = a.clone(), a.collapse(!c), a.checkBoundaryOfElement(b, c ? CKEDITOR.START : CKEDITOR.END)) : !1
        }
        var f = /^[\r\n\t ]+$/,
            g = CKEDITOR.dom.walker.bookmark(!1, !0),
            h = CKEDITOR.dom.walker.whitespaces(!0),
            i = function(a) {
                return g(a) && h(a)
            },
            j = {
                dd: 1,
                dt: 1,
                li: 1
            };
        a.prototype = {
            getNextParagraph: function(a) {
                var c, h, k, l, m, a = a || "p";
                if (this._.nestedEditable) {
                    if (c = this._.nestedEditable.iterator.getNextParagraph(a)) return this.activeFilter = this._.nestedEditable.iterator.activeFilter, c;
                    if (this.activeFilter = this.filter, d(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) return this.activeFilter = this._.nestedEditable.iterator.activeFilter, this._.nestedEditable.iterator.getNextParagraph(a);
                    this._.nestedEditable = null
                }
                if (!this.range.root.getDtd()[a]) return null;
                if (!this._.started) {
                    var n = this.range.clone();
                    h = n.startPath();
                    var o = n.endPath(),
                        p = !n.collapsed && e(n, h.block),
                        q = !n.collapsed && e(n, o.block, 1);
                    n.shrink(CKEDITOR.SHRINK_ELEMENT, !0), p && n.setStartAt(h.block, CKEDITOR.POSITION_BEFORE_END), q && n.setEndAt(o.block, CKEDITOR.POSITION_AFTER_START), h = n.endContainer.hasAscendant("pre", !0) || n.startContainer.hasAscendant("pre", !0), n.enlarge(this.forceBrBreak && !h || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS), n.collapsed || (h = new CKEDITOR.dom.walker(n.clone()), o = CKEDITOR.dom.walker.bookmark(!0, !0), h.evaluator = o, this._.nextNode = h.next(), h = new CKEDITOR.dom.walker(n.clone()), h.evaluator = o, h = h.previous(), this._.lastNode = h.getNextSourceNode(!0), this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary() && (o = this.range.clone(), o.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END), o.checkEndOfBlock() && (o = new CKEDITOR.dom.elementPath(o.endContainer, o.root), this._.lastNode = (o.block || o.blockLimit).getNextSourceNode(!0))), this._.lastNode && n.root.contains(this._.lastNode) || (this._.lastNode = this._.docEndMarker = n.document.createText(""), this._.lastNode.insertAfter(h)), n = null), this._.started = 1, h = n
                }
                for (o = this._.nextNode, n = this._.lastNode, this._.nextNode = null; o;) {
                    var p = 0,
                        q = o.hasAscendant("pre"),
                        r = o.type != CKEDITOR.NODE_ELEMENT,
                        s = 0;
                    if (r) o.type == CKEDITOR.NODE_TEXT && f.test(o.getText()) && (r = 0);
                    else {
                        var t = o.getName();
                        if (CKEDITOR.dtd.$block[t] && "false" == o.getAttribute("contenteditable")) {
                            c = o, d(this, a, c);
                            break
                        }
                        if (o.isBlockBoundary(this.forceBrBreak && !q && {
                                br: 1
                            })) {
                            if ("br" == t) r = 1;
                            else if (!h && !o.getChildCount() && "hr" != t) {
                                c = o, k = o.equals(n);
                                break
                            }
                            h && (h.setEndAt(o, CKEDITOR.POSITION_BEFORE_START), "br" != t && (this._.nextNode = o)), p = 1
                        } else {
                            if (o.getFirst()) {
                                h || (h = this.range.clone(), h.setStartAt(o, CKEDITOR.POSITION_BEFORE_START)), o = o.getFirst();
                                continue
                            }
                            r = 1
                        }
                    }
                    if (r && !h && (h = this.range.clone(), h.setStartAt(o, CKEDITOR.POSITION_BEFORE_START)), k = (!p || r) && o.equals(n), h && !p)
                        for (; !o.getNext(i) && !k;) {
                            if (t = o.getParent(), t.isBlockBoundary(this.forceBrBreak && !q && {
                                    br: 1
                                })) {
                                p = 1, r = 0, k || t.equals(n), h.setEndAt(t, CKEDITOR.POSITION_BEFORE_END);
                                break
                            }
                            o = t, r = 1, k = o.equals(n), s = 1
                        }
                    if (r && h.setEndAt(o, CKEDITOR.POSITION_AFTER_END), o = b(o, s, n), (k = !o) || p && h) break
                }
                if (!c) {
                    if (!h) return this._.docEndMarker && this._.docEndMarker.remove(), this._.nextNode = null;
                    c = new CKEDITOR.dom.elementPath(h.startContainer, h.root), o = c.blockLimit, p = {
                        div: 1,
                        th: 1,
                        td: 1
                    }, c = c.block, !c && o && !this.enforceRealBlocks && p[o.getName()] && h.checkStartOfBlock() && h.checkEndOfBlock() && !o.equals(h.root) ? c = o : !c || this.enforceRealBlocks && c.is(j) ? (c = this.range.document.createElement(a), h.extractContents().appendTo(c), c.trim(), h.insertNode(c), l = m = !0) : "li" != c.getName() ? h.checkStartOfBlock() && h.checkEndOfBlock() || (c = c.clone(!1), h.extractContents().appendTo(c), c.trim(), m = h.splitBlock(), l = !m.wasStartOfBlock, m = !m.wasEndOfBlock, h.insertNode(c)) : k || (this._.nextNode = c.equals(n) ? null : b(h.getBoundaryNodes().endNode, 1, n))
                }
                return l && (l = c.getPrevious()) && l.type == CKEDITOR.NODE_ELEMENT && ("br" == l.getName() ? l.remove() : l.getLast() && "br" == l.getLast().$.nodeName.toLowerCase() && l.getLast().remove()), m && (l = c.getLast()) && l.type == CKEDITOR.NODE_ELEMENT && "br" == l.getName() && (!CKEDITOR.env.needsBrFiller || l.getPrevious(g) || l.getNext(g)) && l.remove(), this._.nextNode || (this._.nextNode = k || c.equals(n) || !n ? null : b(c, 1, n)), c
            }
        }, CKEDITOR.dom.range.prototype.createIterator = function() {
            return new a(this)
        }
    }(), CKEDITOR.command = function(a, b) {
        this.uiItems = [], this.exec = function(c) {
            return this.state != CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() ? (this.editorFocus && a.focus(), this.fire("exec") === !1 ? !0 : b.exec.call(this, a, c) !== !1) : !1
        }, this.refresh = function(a, c) {
            return !this.readOnly && a.readOnly ? !0 : this.context && !c.isContextFor(this.context) ? (this.disable(), !0) : this.checkAllowed(!0) ? (this.startDisabled || this.enable(), this.modes && !this.modes[a.mode] && this.disable(), this.fire("refresh", {
                editor: a,
                path: c
            }) === !1 ? !0 : b.refresh && b.refresh.apply(this, arguments) !== !1) : (this.disable(), !0)
        };
        var c;
        this.checkAllowed = function(b) {
            return b || "boolean" != typeof c ? c = a.activeFilter.checkFeature(this) : c
        }, CKEDITOR.tools.extend(this, b, {
            modes: {
                wysiwyg: 1
            },
            editorFocus: 1,
            contextSensitive: !!b.context,
            state: CKEDITOR.TRISTATE_DISABLED
        }), CKEDITOR.event.call(this)
    }, CKEDITOR.command.prototype = {
        enable: function() {
            this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(this.preserveState && "undefined" != typeof this.previousState ? this.previousState : CKEDITOR.TRISTATE_OFF)
        },
        disable: function() {
            this.setState(CKEDITOR.TRISTATE_DISABLED)
        },
        setState: function(a) {
            return this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed() ? !1 : (this.previousState = this.state, this.state = a, this.fire("state"), !0)
        },
        toggleState: function() {
            this.state == CKEDITOR.TRISTATE_OFF ? this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
        }
    }, CKEDITOR.event.implementOn(CKEDITOR.command.prototype), CKEDITOR.ENTER_P = 1, CKEDITOR.ENTER_BR = 2, CKEDITOR.ENTER_DIV = 3, CKEDITOR.config = {
        customConfig: "config.js",
        autoUpdateElement: !0,
        language: "",
        defaultLanguage: "en",
        contentsLangDirection: "",
        enterMode: CKEDITOR.ENTER_P,
        forceEnterMode: !1,
        shiftEnterMode: CKEDITOR.ENTER_BR,
        docType: "<!DOCTYPE html>",
        bodyId: "",
        bodyClass: "",
        fullPage: !1,
        height: 200,
        extraPlugins: "",
        removePlugins: "",
        protectedSource: [],
        tabIndex: 0,
        width: "",
        baseFloatZIndex: 1e4,
        blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
    }, function() {
        function a(a, b, c, d, e) {
            var f, h, a = [];
            for (f in b) {
                h = b[f], h = "boolean" == typeof h ? {} : "function" == typeof h ? {
                    match: h
                } : C(h), "$" != f.charAt(0) && (h.elements = f), c && (h.featureName = c.toLowerCase());
                var i = h;
                i.elements = g(i.elements, /\s+/) || null, i.propertiesOnly = i.propertiesOnly || i.elements === !0;
                var j = /\s*,\s*/,
                    k = void 0;
                for (k in G) {
                    i[k] = g(i[k], j) || null;
                    var l = i,
                        m = H[k],
                        n = g(i[H[k]], j),
                        o = i[k],
                        p = [],
                        q = !0,
                        s = void 0;
                    n ? q = !1 : n = {};
                    for (s in o) "!" == s.charAt(0) && (s = s.slice(1), p.push(s), n[s] = !0, q = !1);
                    for (; s = p.pop();) o[s] = o["!" + s], delete o["!" + s];
                    l[m] = (q ? !1 : n) || null
                }
                i.match = i.match || null, d.push(h), a.push(h)
            }
            for (var t, b = e.elements, e = e.generic, c = 0, d = a.length; d > c; ++c) {
                f = C(a[c]), h = f.classes === !0 || f.styles === !0 || f.attributes === !0, i = f, k = m = j = void 0;
                for (j in G) i[j] = r(i[j]);
                l = !0;
                for (k in H) {
                    j = H[k], m = i[j], n = [], o = void 0;
                    for (o in m) o.indexOf("*") > -1 ? n.push(RegExp("^" + o.replace(/\*/g, ".*") + "$")) : n.push(o);
                    m = n, m.length && (i[j] = m, l = !1)
                }
                if (i.nothingRequired = l, i.noProperties = !(i.attributes || i.classes || i.styles), f.elements === !0 || null === f.elements) e[h ? "unshift" : "push"](f);
                else {
                    i = f.elements, delete f.elements;
                    for (t in i) b[t] ? b[t][h ? "unshift" : "push"](f) : b[t] = [f]
                }
            }
        }

        function b(a, b, d, e) {
            if ((!a.match || a.match(b)) && (e || h(a, b)) && (a.propertiesOnly || (d.valid = !0), d.allAttributes || (d.allAttributes = c(a.attributes, b.attributes, d.validAttributes)), d.allStyles || (d.allStyles = c(a.styles, b.styles, d.validStyles)), !d.allClasses)) {
                if (a = a.classes, b = b.classes, e = d.validClasses, a)
                    if (a === !0) a = !0;
                    else {
                        for (var f, g = 0, i = b.length; i > g; ++g) f = b[g], e[f] || (e[f] = a(f));
                        a = !1
                    } else a = !1;
                d.allClasses = a
            }
        }

        function c(a, b, c) {
            if (!a) return !1;
            if (a === !0) return !0;
            for (var d in b) c[d] || (c[d] = a(d));
            return !1
        }

        function d(a, b, c) {
            if (!a.match || a.match(b)) {
                if (a.noProperties) return !1;
                if (c.hadInvalidAttribute = e(a.attributes, b.attributes) || c.hadInvalidAttribute, c.hadInvalidStyle = e(a.styles, b.styles) || c.hadInvalidStyle, a = a.classes, b = b.classes, a) {
                    for (var d = !1, f = a === !0, g = b.length; g--;)(f || a(b[g])) && (b.splice(g, 1), d = !0);
                    a = d
                } else a = !1;
                c.hadInvalidClass = a || c.hadInvalidClass
            }
        }

        function e(a, b) {
            if (!a) return !1;
            var c, d = !1,
                e = a === !0;
            for (c in b)(e || a(c)) && (delete b[c], d = !0);
            return d
        }

        function f(a, b, c) {
            return a.disabled || a.customConfig && !c || !b ? !1 : (a._.cachedChecks = {}, !0)
        }

        function g(a, b) {
            if (!a) return !1;
            if (a === !0) return a;
            if ("string" == typeof a) return a = D(a), "*" == a ? !0 : CKEDITOR.tools.convertArrayToObject(a.split(b));
            if (CKEDITOR.tools.isArray(a)) return a.length ? CKEDITOR.tools.convertArrayToObject(a) : !1;
            var c, d = {},
                e = 0;
            for (c in a) d[c] = a[c], e++;
            return e ? d : !1
        }

        function h(a, b) {
            if (a.nothingRequired) return !0;
            var c, d, e, f;
            if (e = a.requiredClasses)
                for (f = b.classes, c = 0; c < e.length; ++c)
                    if (d = e[c], "string" == typeof d) {
                        if (-1 == CKEDITOR.tools.indexOf(f, d)) return !1
                    } else if (!CKEDITOR.tools.checkIfAnyArrayItemMatches(f, d)) return !1;
            return i(b.styles, a.requiredStyles) && i(b.attributes, a.requiredAttributes)
        }

        function i(a, b) {
            if (!b) return !0;
            for (var c, d = 0; d < b.length; ++d)
                if (c = b[d], "string" == typeof c) {
                    if (!(c in a)) return !1
                } else if (!CKEDITOR.tools.checkIfAnyObjectPropertyMatches(a, c)) return !1;
            return !0
        }

        function j(a) {
            if (!a) return {};
            for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;) b[a.shift()] = E;
            return b
        }

        function k(a) {
            for (var b, c, d, e, f = {}, g = 1, a = D(a); b = a.match(I);)(c = b[2]) ? (d = l(c, "styles"), e = l(c, "attrs"), c = l(c, "classes")) : d = e = c = null, f["$" + g++] = {
                elements: b[1],
                classes: c,
                styles: d,
                attributes: e
            }, a = a.slice(b[0].length);
            return f
        }

        function l(a, b) {
            var c = a.match(J[b]);
            return c ? D(c[1]) : null
        }

        function m(a) {
            var b = a.styleBackup = a.attributes.style,
                c = a.classBackup = a.attributes["class"];
            a.styles || (a.styles = CKEDITOR.tools.parseCssText(b || "", 1)), a.classes || (a.classes = c ? c.split(/\s+/) : [])
        }

        function n(a, c, e, f) {
            var g, h = 0;
            if (f.toHtml && (c.name = c.name.replace(K, "$1")), f.doCallbacks && a.elementCallbacks) {
                a: for (var i, j = a.elementCallbacks, k = 0, l = j.length; l > k; ++k)
                    if (i = j[k](c)) {
                        g = i;
                        break a
                    }if (g) return g
            }
            if (f.doTransform && (g = a._.transformations[c.name])) {
                for (m(c), j = 0; j < g.length; ++j) v(a, c, g[j]);
                p(c)
            }
            if (f.doFilter) {
                a: {
                    j = c.name, k = a._, a = k.allowedRules.elements[j], g = k.allowedRules.generic, j = k.disallowedRules.elements[j], k = k.disallowedRules.generic, l = f.skipRequired, i = {
                        valid: !1,
                        validAttributes: {},
                        validClasses: {},
                        validStyles: {},
                        allAttributes: !1,
                        allClasses: !1,
                        allStyles: !1,
                        hadInvalidAttribute: !1,
                        hadInvalidClass: !1,
                        hadInvalidStyle: !1
                    };
                    var n, o;
                    if (a || g) {
                        if (m(c), j)
                            for (n = 0, o = j.length; o > n; ++n)
                                if (d(j[n], c, i) === !1) {
                                    a = null;
                                    break a
                                }
                        if (k)
                            for (n = 0, o = k.length; o > n; ++n) d(k[n], c, i);
                        if (a)
                            for (n = 0, o = a.length; o > n; ++n) b(a[n], c, i, l);
                        if (g)
                            for (n = 0, o = g.length; o > n; ++n) b(g[n], c, i, l);
                        a = i
                    } else a = null
                }
                if (!a) return e.push(c), B;
                if (!a.valid) return e.push(c), B;o = a.validAttributes;
                var r = a.validStyles;g = a.validClasses;
                var s, t, j = c.attributes,
                    u = c.styles,
                    k = c.classes,
                    l = c.classBackup,
                    w = c.styleBackup,
                    x = [];i = [];
                var y = /^data-cke-/;
                if (n = !1, delete j.style, delete j["class"], delete c.classBackup, delete c.styleBackup, !a.allAttributes)
                    for (s in j) o[s] || (y.test(s) ? s == (t = s.replace(/^data-cke-saved-/, "")) || o[t] || (delete j[s], n = !0) : (delete j[s], n = !0));
                if (!a.allStyles || a.hadInvalidStyle) {
                    for (s in u) a.allStyles || r[s] ? x.push(s + ":" + u[s]) : n = !0;
                    x.length && (j.style = x.sort().join("; "))
                } else w && (j.style = w);
                if (!a.allClasses || a.hadInvalidClass) {
                    for (s = 0; s < k.length; ++s)(a.allClasses || g[k[s]]) && i.push(k[s]);
                    i.length && (j["class"] = i.sort().join(" ")), l && i.length < l.split(/\s+/).length && (n = !0)
                } else l && (j["class"] = l);
                if (n && (h = B), !f.skipFinalValidation && !q(c)) return e.push(c), B
            }
            return f.toHtml && (c.name = c.name.replace(L, "cke:$1")), h
        }

        function o(a) {
            var b, c = [];
            for (b in a) b.indexOf("*") > -1 && c.push(b.replace(/\*/g, ".*"));
            return c.length ? RegExp("^(?:" + c.join("|") + ")$") : null
        }

        function p(a) {
            var b, c = a.attributes;
            delete c.style, delete c["class"], (b = CKEDITOR.tools.writeCssText(a.styles, !0)) && (c.style = b), a.classes.length && (c["class"] = a.classes.sort().join(" "))
        }

        function q(a) {
            switch (a.name) {
                case "a":
                    if (!a.children.length && !a.attributes.name) return !1;
                    break;
                case "img":
                    if (!a.attributes.src) return !1
            }
            return !0
        }

        function r(a) {
            if (!a) return !1;
            if (a === !0) return !0;
            var b = o(a);
            return function(c) {
                return c in a || b && c.match(b)
            }
        }

        function s() {
            return new CKEDITOR.htmlParser.element("br")
        }

        function t(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && ("br" == a.name || A.$block[a.name])
        }

        function u(a, b, c) {
            var d = a.name;
            if (A.$empty[d] || !a.children.length) "hr" == d && "br" == b ? a.replaceWith(s()) : (a.parent && c.push({
                check: "it",
                el: a.parent
            }), a.remove());
            else if (A.$block[d] || "tr" == d)
                if ("br" == b) a.previous && !t(a.previous) && (b = s(), b.insertBefore(a)), a.next && !t(a.next) && (b = s(), b.insertAfter(a)), a.replaceWithChildren();
                else {
                    var e, d = a.children;
                    a: {
                        e = A[b];
                        for (var f, g = 0, h = d.length; h > g; ++g)
                            if (f = d[g], f.type == CKEDITOR.NODE_ELEMENT && !e[f.name]) {
                                e = !1;
                                break a
                            }
                        e = !0
                    }
                    if (e) a.name = b, a.attributes = {}, c.push({
                        check: "parent-down",
                        el: a
                    });
                    else {
                        e = a.parent;
                        for (var i, g = e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || "body" == e.name, h = d.length; h > 0;) f = d[--h], g && (f.type == CKEDITOR.NODE_TEXT || f.type == CKEDITOR.NODE_ELEMENT && A.$inline[f.name]) ? (i || (i = new CKEDITOR.htmlParser.element(b), i.insertAfter(a), c.push({
                            check: "parent-down",
                            el: i
                        })), i.add(f, 0)) : (i = null, f.insertAfter(a), e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && f.type == CKEDITOR.NODE_ELEMENT && !A[e.name][f.name] && c.push({
                            check: "el-up",
                            el: f
                        }));
                        a.remove()
                    }
                } else "style" == d ? a.remove() : (a.parent && c.push({
                check: "it",
                el: a.parent
            }), a.replaceWithChildren())
        }

        function v(a, b, c) {
            var d, e;
            for (d = 0; d < c.length; ++d)
                if (e = c[d], (!e.check || a.check(e.check, !1)) && (!e.left || e.left(b))) {
                    e.right(b, M);
                    break
                }
        }

        function w(a, b) {
            var c, d, e, f, g = b.getDefinition(),
                h = g.attributes,
                i = g.styles;
            if (a.name != g.element) return !1;
            for (c in h)
                if ("class" == c) {
                    for (g = h[c].split(/\s+/), e = a.classes.join("|"); f = g.pop();)
                        if (-1 == e.indexOf(f)) return !1
                } else if (a.attributes[c] != h[c]) return !1;
            for (d in i)
                if (a.styles[d] != i[d]) return !1;
            return !0
        }

        function x(a, b) {
            var c, d;
            return "string" == typeof a ? c = a : a instanceof CKEDITOR.style ? d = a : (c = a[0], d = a[1]), [{
                element: c,
                left: d,
                right: function(a, c) {
                    c.transform(a, b)
                }
            }]
        }

        function y(a) {
            return function(b) {
                return w(b, a)
            }
        }

        function z(a) {
            return function(b, c) {
                c[a](b)
            }
        }
        var A = CKEDITOR.dtd,
            B = 1,
            C = CKEDITOR.tools.copy,
            D = CKEDITOR.tools.trim,
            E = "cke-test",
            F = ["", "p", "br", "div"];
        CKEDITOR.FILTER_SKIP_TREE = 2, CKEDITOR.filter = function(a) {
            if (this.allowedContent = [], this.disallowedContent = [], this.elementCallbacks = null, this.disabled = !1, this.editor = null, this.id = CKEDITOR.tools.getNextNumber(), this._ = {
                    allowedRules: {
                        elements: {},
                        generic: []
                    },
                    disallowedRules: {
                        elements: {},
                        generic: []
                    },
                    transformations: {},
                    cachedTests: {}
                }, CKEDITOR.filter.instances[this.id] = this, a instanceof CKEDITOR.editor) {
                a = this.editor = a, this.customConfig = !0;
                var b = a.config.allowedContent;
                b === !0 ? this.disabled = !0 : (b || (this.customConfig = !1), this.allow(b, "config", 1), this.allow(a.config.extraAllowedContent, "extra", 1), this.allow(F[a.enterMode] + " " + F[a.shiftEnterMode], "default", 1), this.disallow(a.config.disallowedContent))
            } else this.customConfig = !1, this.allow(a, "default", 1)
        }, CKEDITOR.filter.instances = {}, CKEDITOR.filter.prototype = {
            allow: function(b, c, d) {
                if (!f(this, b, d)) return !1;
                var e, g;
                if ("string" == typeof b) b = k(b);
                else if (b instanceof CKEDITOR.style) {
                    if (b.toAllowedContentRules) return this.allow(b.toAllowedContentRules(this.editor), c, d);
                    e = b.getDefinition(), b = {}, d = e.attributes, b[e.element] = e = {
                        styles: e.styles,
                        requiredStyles: e.styles && CKEDITOR.tools.objectKeys(e.styles)
                    }, d && (d = C(d), e.classes = d["class"] ? d["class"].split(/\s+/) : null, e.requiredClasses = e.classes, delete d["class"], e.attributes = d, e.requiredAttributes = d && CKEDITOR.tools.objectKeys(d))
                } else if (CKEDITOR.tools.isArray(b)) {
                    for (e = 0; e < b.length; ++e) g = this.allow(b[e], c, d);
                    return g
                }
                return a(this, b, c, this.allowedContent, this._.allowedRules), !0
            },
            applyTo: function(a, b, c, d) {
                if (this.disabled) return !1;
                var e, f = this,
                    g = [],
                    h = this.editor && this.editor.config.protectedSource,
                    i = !1,
                    j = {
                        doFilter: !c,
                        doTransform: !0,
                        doCallbacks: !0,
                        toHtml: b
                    };
                a.forEach(function(a) {
                    if (a.type == CKEDITOR.NODE_ELEMENT) {
                        if ("off" == a.attributes["data-cke-filter"]) return !1;
                        if (!b || "span" != a.name || !~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))
                            if (e = n(f, a, g, j), e & B) i = !0;
                            else if (2 & e) return !1
                    } else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
                        var c;
                        a: {
                            var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
                            c = [];
                            var k, l, m;
                            if (h)
                                for (l = 0; l < h.length; ++l)
                                    if ((m = d.match(h[l])) && m[0].length == d.length) {
                                        c = !0;
                                        break a
                                    }
                            d = CKEDITOR.htmlParser.fragment.fromHtml(d), 1 == d.children.length && (k = d.children[0]).type == CKEDITOR.NODE_ELEMENT && n(f, k, c, j), c = !c.length
                        }
                        c || g.push(a)
                    }
                }, null, !0), g.length && (i = !0);
                for (var k, a = [], d = F[d || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)]; c = g.pop();) c.type == CKEDITOR.NODE_ELEMENT ? u(c, d, a) : c.remove();
                for (; k = a.pop();)
                    if (c = k.el, c.parent) switch (k.check) {
                        case "it":
                            A.$removeEmpty[c.name] && !c.children.length ? u(c, d, a) : q(c) || u(c, d, a);
                            break;
                        case "el-up":
                            c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !A[c.parent.name][c.name] && u(c, d, a);
                            break;
                        case "parent-down":
                            c.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !A[c.parent.name][c.name] && u(c.parent, d, a)
                    }
                    return i
            },
            checkFeature: function(a) {
                return this.disabled || !a ? !0 : (a.toFeature && (a = a.toFeature(this.editor)), !a.requiredContent || this.check(a.requiredContent))
            },
            disable: function() {
                this.disabled = !0
            },
            disallow: function(b) {
                return f(this, b, !0) ? ("string" == typeof b && (b = k(b)), a(this, b, null, this.disallowedContent, this._.disallowedRules), !0) : !1
            },
            addContentForms: function(a) {
                if (!this.disabled && a) {
                    var b, c, d, e = [];
                    for (b = 0; b < a.length && !d; ++b) c = a[b], ("string" == typeof c || c instanceof CKEDITOR.style) && this.check(c) && (d = c);
                    if (d) {
                        for (b = 0; b < a.length; ++b) e.push(x(a[b], d));
                        this.addTransformations(e)
                    }
                }
            },
            addElementCallback: function(a) {
                this.elementCallbacks || (this.elementCallbacks = []), this.elementCallbacks.push(a)
            },
            addFeature: function(a) {
                return this.disabled || !a ? !0 : (a.toFeature && (a = a.toFeature(this.editor)), this.allow(a.allowedContent, a.name), this.addTransformations(a.contentTransformations), this.addContentForms(a.contentForms), a.requiredContent && (this.customConfig || this.disallowedContent.length) ? this.check(a.requiredContent) : !0)
            },
            addTransformations: function(a) {
                var b, c;
                if (!this.disabled && a) {
                    var d, e = this._.transformations;
                    for (d = 0; d < a.length; ++d) {
                        b = a[d];
                        var f = void 0,
                            g = void 0,
                            h = void 0,
                            i = void 0,
                            j = void 0,
                            k = void 0;
                        for (c = [], g = 0; g < b.length; ++g) h = b[g], "string" == typeof h ? (h = h.split(/\s*:\s*/), i = h[0],
                            j = null, k = h[1]) : (i = h.check, j = h.left, k = h.right), f || (f = h, f = f.element ? f.element : i ? i.match(/^([a-z0-9]+)/i)[0] : f.left.getDefinition().element), j instanceof CKEDITOR.style && (j = y(j)), c.push({
                            check: i == f ? null : i,
                            left: j,
                            right: "string" == typeof k ? z(k) : k
                        });
                        b = f, e[b] || (e[b] = []), e[b].push(c)
                    }
                }
            },
            check: function(a, b, c) {
                if (this.disabled) return !0;
                if (CKEDITOR.tools.isArray(a)) {
                    for (var d = a.length; d--;)
                        if (this.check(a[d], b, c)) return !0;
                    return !1
                }
                var e, f;
                if ("string" == typeof a) {
                    if (f = a + "<" + (b === !1 ? "0" : "1") + (c ? "1" : "0") + ">", f in this._.cachedChecks) return this._.cachedChecks[f];
                    d = k(a).$1, e = d.styles;
                    var g = d.classes;
                    d.name = d.elements, d.classes = g = g ? g.split(/\s*,\s*/) : [], d.styles = j(e), d.attributes = j(d.attributes), d.children = [], g.length && (d.attributes["class"] = g.join(" ")), e && (d.attributes.style = CKEDITOR.tools.writeCssText(d.styles)), e = d
                } else d = a.getDefinition(), e = d.styles, g = d.attributes || {}, e ? (e = C(e), g.style = CKEDITOR.tools.writeCssText(e, !0)) : e = {}, e = {
                    name: d.element,
                    attributes: g,
                    classes: g["class"] ? g["class"].split(/\s+/) : [],
                    styles: e,
                    children: []
                };
                var h, g = CKEDITOR.tools.clone(e),
                    i = [];
                if (b !== !1 && (h = this._.transformations[e.name])) {
                    for (d = 0; d < h.length; ++d) v(this, e, h[d]);
                    p(e)
                }
                return n(this, g, i, {
                    doFilter: !0,
                    doTransform: b !== !1,
                    skipRequired: !c,
                    skipFinalValidation: !c
                }), b = i.length > 0 ? !1 : CKEDITOR.tools.objectCompare(e.attributes, g.attributes, !0) ? !0 : !1, "string" == typeof a && (this._.cachedChecks[f] = b), b
            },
            getAllowedEnterMode: function() {
                var a = ["p", "div", "br"],
                    b = {
                        p: CKEDITOR.ENTER_P,
                        div: CKEDITOR.ENTER_DIV,
                        br: CKEDITOR.ENTER_BR
                    };
                return function(c, d) {
                    var e, f = a.slice();
                    if (this.check(F[c])) return c;
                    for (d || (f = f.reverse()); e = f.pop();)
                        if (this.check(e)) return b[e];
                    return CKEDITOR.ENTER_BR
                }
            }(),
            destroy: function() {
                delete CKEDITOR.filter.instances[this.id], delete this._, delete this.allowedContent, delete this.disallowedContent
            }
        };
        var G = {
                styles: 1,
                attributes: 1,
                classes: 1
            },
            H = {
                styles: "requiredStyles",
                attributes: "requiredAttributes",
                classes: "requiredClasses"
            },
            I = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
            J = {
                styles: /{([^}]+)}/,
                attrs: /\[([^\]]+)\]/,
                classes: /\(([^\)]+)\)/
            },
            K = /^cke:(object|embed|param)$/,
            L = /^(object|embed|param)$/,
            M = CKEDITOR.filter.transformationsTools = {
                sizeToStyle: function(a) {
                    this.lengthToStyle(a, "width"), this.lengthToStyle(a, "height")
                },
                sizeToAttribute: function(a) {
                    this.lengthToAttribute(a, "width"), this.lengthToAttribute(a, "height")
                },
                lengthToStyle: function(a, b, c) {
                    if (c = c || b, !(c in a.styles)) {
                        var d = a.attributes[b];
                        d && (/^\d+$/.test(d) && (d += "px"), a.styles[c] = d)
                    }
                    delete a.attributes[b]
                },
                lengthToAttribute: function(a, b, c) {
                    if (c = c || b, !(c in a.attributes)) {
                        var d = a.styles[b],
                            e = d && d.match(/^(\d+)(?:\.\d*)?px$/);
                        e ? a.attributes[c] = e[1] : d == E && (a.attributes[c] = E)
                    }
                    delete a.styles[b]
                },
                alignmentToStyle: function(a) {
                    if (!("float" in a.styles)) {
                        var b = a.attributes.align;
                        ("left" == b || "right" == b) && (a.styles["float"] = b)
                    }
                    delete a.attributes.align
                },
                alignmentToAttribute: function(a) {
                    if (!("align" in a.attributes)) {
                        var b = a.styles["float"];
                        ("left" == b || "right" == b) && (a.attributes.align = b)
                    }
                    delete a.styles["float"]
                },
                matchesStyle: w,
                transform: function(a, b) {
                    if ("string" == typeof b) a.name = b;
                    else {
                        var c, d, e, f, g = b.getDefinition(),
                            h = g.styles,
                            i = g.attributes;
                        a.name = g.element;
                        for (c in i)
                            if ("class" == c)
                                for (g = a.classes.join("|"), e = i[c].split(/\s+/); f = e.pop();) - 1 == g.indexOf(f) && a.classes.push(f);
                            else a.attributes[c] = i[c];
                        for (d in h) a.styles[d] = h[d]
                    }
                }
            }
    }(), function() {
        CKEDITOR.focusManager = function(a) {
            return a.focusManager ? a.focusManager : (this.hasFocus = !1, this.currentActive = null, this._ = {
                editor: a
            }, this)
        }, CKEDITOR.focusManager._ = {
            blurDelay: 200
        }, CKEDITOR.focusManager.prototype = {
            focus: function(a) {
                this._.timer && clearTimeout(this._.timer), a && (this.currentActive = a), this.hasFocus || this._.locked || ((a = CKEDITOR.currentInstance) && a.focusManager.blur(1), this.hasFocus = !0, (a = this._.editor.container) && a.addClass("cke_focus"), this._.editor.fire("focus"))
            },
            lock: function() {
                this._.locked = 1
            },
            unlock: function() {
                delete this._.locked
            },
            blur: function(a) {
                function b() {
                    if (this.hasFocus) {
                        this.hasFocus = !1;
                        var a = this._.editor.container;
                        a && a.removeClass("cke_focus"), this._.editor.fire("blur")
                    }
                }
                if (!this._.locked) {
                    this._.timer && clearTimeout(this._.timer);
                    var c = CKEDITOR.focusManager._.blurDelay;
                    a || !c ? b.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function() {
                        delete this._.timer, b.call(this)
                    }, c, this)
                }
            },
            add: function(a, b) {
                var c = a.getCustomData("focusmanager");
                if (!c || c != this) {
                    c && c.remove(a);
                    var c = "focus",
                        d = "blur";
                    b && (CKEDITOR.env.ie ? (c = "focusin", d = "focusout") : CKEDITOR.event.useCapture = 1);
                    var e = {
                        blur: function() {
                            a.equals(this.currentActive) && this.blur()
                        },
                        focus: function() {
                            this.focus(a)
                        }
                    };
                    a.on(c, e.focus, this), a.on(d, e.blur, this), b && (CKEDITOR.event.useCapture = 0), a.setCustomData("focusmanager", this), a.setCustomData("focusmanager_handlers", e)
                }
            },
            remove: function(a) {
                a.removeCustomData("focusmanager");
                var b = a.removeCustomData("focusmanager_handlers");
                a.removeListener("blur", b.blur), a.removeListener("focus", b.focus)
            }
        }
    }(), CKEDITOR.keystrokeHandler = function(a) {
        return a.keystrokeHandler ? a.keystrokeHandler : (this.keystrokes = {}, this.blockedKeystrokes = {}, this._ = {
            editor: a
        }, this)
    }, function() {
        var a, b = function(b) {
                var b = b.data,
                    c = b.getKeystroke(),
                    d = this.keystrokes[c],
                    e = this._.editor;
                return a = e.fire("key", {
                    keyCode: c,
                    domEvent: b
                }) === !1, a || (d && (a = e.execCommand(d, {
                    from: "keystrokeHandler"
                }) !== !1), a || (a = !!this.blockedKeystrokes[c])), a && b.preventDefault(!0), !a
            },
            c = function(b) {
                a && (a = !1, b.data.preventDefault(!0))
            };
        CKEDITOR.keystrokeHandler.prototype = {
            attach: function(a) {
                a.on("keydown", b, this), CKEDITOR.env.gecko && CKEDITOR.env.mac && a.on("keypress", c, this)
            }
        }
    }(), function() {
        CKEDITOR.lang = {
            languages: {
                af: 1,
                ar: 1,
                bg: 1,
                bn: 1,
                bs: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                "en-au": 1,
                "en-ca": 1,
                "en-gb": 1,
                en: 1,
                eo: 1,
                es: 1,
                et: 1,
                eu: 1,
                fa: 1,
                fi: 1,
                fo: 1,
                "fr-ca": 1,
                fr: 1,
                gl: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                id: 1,
                is: 1,
                it: 1,
                ja: 1,
                ka: 1,
                km: 1,
                ko: 1,
                ku: 1,
                lt: 1,
                lv: 1,
                mk: 1,
                mn: 1,
                ms: 1,
                nb: 1,
                nl: 1,
                no: 1,
                pl: 1,
                "pt-br": 1,
                pt: 1,
                ro: 1,
                ru: 1,
                si: 1,
                sk: 1,
                sl: 1,
                sq: 1,
                "sr-latn": 1,
                sr: 1,
                sv: 1,
                th: 1,
                tr: 1,
                tt: 1,
                ug: 1,
                uk: 1,
                vi: 1,
                "zh-cn": 1,
                zh: 1
            },
            rtl: {
                ar: 1,
                fa: 1,
                he: 1,
                ku: 1,
                ug: 1
            },
            load: function(a, b, c) {
                a && CKEDITOR.lang.languages[a] || (a = this.detect(b, a));
                var d = this,
                    d = function() {
                        d[a].dir = d.rtl[a] ? "rtl" : "ltr", c(a, d[a])
                    };
                this[a] ? b() : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), b, this)
            },
            detect: function(a, b) {
                var c = this.languages,
                    b = b || navigator.userLanguage || navigator.language || a,
                    d = b.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
                    e = d[1],
                    d = d[2];
                return c[e + "-" + d] ? e = e + "-" + d : c[e] || (e = null), CKEDITOR.lang.detect = e ? function() {
                    return e
                } : function(a) {
                    return a
                }, e || a
            }
        }
    }(), CKEDITOR.scriptLoader = function() {
        var a = {},
            b = {};
        return {
            load: function(c, d, e, f) {
                var g = "string" == typeof c;
                g && (c = [c]), e || (e = CKEDITOR);
                var h = c.length,
                    i = [],
                    j = [],
                    k = function(a) {
                        d && (g ? d.call(e, a) : d.call(e, i, j))
                    };
                if (0 === h) k(!0);
                else {
                    var l = function(a, b) {
                            (b ? i : j).push(a), --h <= 0 && (f && CKEDITOR.document.getDocumentElement().removeStyle("cursor"), k(b))
                        },
                        m = function(c, d) {
                            a[c] = 1;
                            var e = b[c];
                            delete b[c];
                            for (var f = 0; f < e.length; f++) e[f](c, d)
                        },
                        n = function(c) {
                            if (a[c]) l(c, !0);
                            else {
                                var e = b[c] || (b[c] = []);
                                if (e.push(l), !(e.length > 1)) {
                                    var f = new CKEDITOR.dom.element("script");
                                    f.setAttributes({
                                        type: "text/javascript",
                                        src: c
                                    }), d && (CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? f.$.onreadystatechange = function() {
                                        ("loaded" == f.$.readyState || "complete" == f.$.readyState) && (f.$.onreadystatechange = null, m(c, !0))
                                    } : (f.$.onload = function() {
                                        setTimeout(function() {
                                            m(c, !0)
                                        }, 0)
                                    }, f.$.onerror = function() {
                                        m(c, !1)
                                    })), f.appendTo(CKEDITOR.document.getHead())
                                }
                            }
                        };
                    f && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
                    for (var o = 0; h > o; o++) n(c[o])
                }
            },
            queue: function() {
                function a() {
                    var a;
                    (a = b[0]) && this.load(a.scriptUrl, a.callback, CKEDITOR, 0)
                }
                var b = [];
                return function(c, d) {
                    var e = this;
                    b.push({
                        scriptUrl: c,
                        callback: function() {
                            d && d.apply(this, arguments), b.shift(), a.call(e)
                        }
                    }), 1 == b.length && a.call(this)
                }
            }()
        }
    }(), CKEDITOR.resourceManager = function(a, b) {
        this.basePath = a, this.fileName = b, this.registered = {}, this.loaded = {}, this.externals = {}, this._ = {
            waitingList: {}
        }
    }, CKEDITOR.resourceManager.prototype = {
        add: function(a, b) {
            if (this.registered[a]) throw '[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
            var c = this.registered[a] = b || {};
            return c.name = a, c.path = this.getPath(a), CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", c), this.get(a)
        },
        get: function(a) {
            return this.registered[a] || null
        },
        getPath: function(a) {
            var b = this.externals[a];
            return CKEDITOR.getUrl(b && b.dir || this.basePath + a + "/")
        },
        getFilePath: function(a) {
            var b = this.externals[a];
            return CKEDITOR.getUrl(this.getPath(a) + (b ? b.file : this.fileName + ".js"))
        },
        addExternal: function(a, b, c) {
            for (var a = a.split(","), d = 0; d < a.length; d++) {
                var e = a[d];
                c || (b = b.replace(/[^\/]+$/, function(a) {
                    return c = a, ""
                })), this.externals[e] = {
                    dir: b,
                    file: c || this.fileName + ".js"
                }
            }
        },
        load: function(a, b, c) {
            CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
            for (var d = this.loaded, e = this.registered, f = [], g = {}, h = {}, i = 0; i < a.length; i++) {
                var j = a[i];
                if (j)
                    if (d[j] || e[j]) h[j] = this.get(j);
                    else {
                        var k = this.getFilePath(j);
                        f.push(k), k in g || (g[k] = []), g[k].push(j)
                    }
            }
            CKEDITOR.scriptLoader.load(f, function(a, e) {
                if (e.length) throw '[CKEDITOR.resourceManager.load] Resource name "' + g[e[0]].join(",") + '" was not found at "' + e[0] + '".';
                for (var f = 0; f < a.length; f++)
                    for (var i = g[a[f]], j = 0; j < i.length; j++) {
                        var k = i[j];
                        h[k] = this.get(k), d[k] = 1
                    }
                b.call(c, h)
            }, this)
        }
    }, CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin"), CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function(a) {
        var b = {};
        return function(c, d, e) {
            var f = {},
                g = function(c) {
                    a.call(this, c, function(a) {
                        CKEDITOR.tools.extend(f, a);
                        var c, h = [];
                        for (c in a) {
                            var i = a[c],
                                j = i && i.requires;
                            if (!b[c]) {
                                if (i.icons)
                                    for (var k = i.icons.split(","), l = k.length; l--;) CKEDITOR.skin.addIcon(k[l], i.path + "icons/" + (CKEDITOR.env.hidpi && i.hidpi ? "hidpi/" : "") + k[l] + ".png");
                                b[c] = 1
                            }
                            if (j)
                                for (j.split && (j = j.split(",")), i = 0; i < j.length; i++) f[j[i]] || h.push(j[i])
                        }
                        if (h.length) g.call(this, h);
                        else {
                            for (c in f) i = f[c], i.onLoad && !i.onLoad._called && (i.onLoad() === !1 && delete f[c], i.onLoad._called = 1);
                            d && d.call(e || window, f)
                        }
                    }, this)
                };
            g.call(this, c)
        }
    }), CKEDITOR.plugins.setLang = function(a, b, c) {
        var d = this.get(a),
            a = d.langEntries || (d.langEntries = {}),
            d = d.lang || (d.lang = []);
        d.split && (d = d.split(",")), -1 == CKEDITOR.tools.indexOf(d, b) && d.push(b), a[b] = c
    }, CKEDITOR.ui = function(a) {
        return a.ui ? a.ui : (this.items = {}, this.instances = {}, this.editor = a, this._ = {
            handlers: {}
        }, this)
    }, CKEDITOR.ui.prototype = {
        add: function(a, b, c) {
            c.name = a.toLowerCase();
            var d = this.items[a] = {
                type: b,
                command: c.command || null,
                args: Array.prototype.slice.call(arguments, 2)
            };
            CKEDITOR.tools.extend(d, c)
        },
        get: function(a) {
            return this.instances[a]
        },
        create: function(a) {
            var b = this.items[a],
                c = b && this._.handlers[b.type],
                d = b && b.command && this.editor.getCommand(b.command),
                c = c && c.create.apply(this, b.args);
            return this.instances[a] = c, d && d.uiItems.push(c), c && !c.type && (c.type = b.type), c
        },
        addHandler: function(a, b) {
            this._.handlers[a] = b
        },
        space: function(a) {
            return CKEDITOR.document.getById(this.spaceId(a))
        },
        spaceId: function(a) {
            return this.editor.id + "_" + a
        }
    }, CKEDITOR.event.implementOn(CKEDITOR.ui), function() {
        function a(a, d, f) {
            if (CKEDITOR.event.call(this), a = a && CKEDITOR.tools.clone(a), void 0 !== d) {
                if (!(d instanceof CKEDITOR.dom.element)) throw Error("Expect element of type CKEDITOR.dom.element.");
                if (!f) throw Error("One of the element modes must be specified.");
                if (CKEDITOR.env.ie && CKEDITOR.env.quirks && f == CKEDITOR.ELEMENT_MODE_INLINE) throw Error("Inline element mode is not supported on IE quirks.");
                if (!(f == CKEDITOR.ELEMENT_MODE_INLINE ? d.is(CKEDITOR.dtd.$editable) || d.is("textarea") : f == CKEDITOR.ELEMENT_MODE_REPLACE ? !d.is(CKEDITOR.dtd.$nonBodyContent) : 1)) throw Error('The specified element mode is not supported on element: "' + d.getName() + '".');
                this.element = d, this.elementMode = f, this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (d.getId() || d.getNameAtt())
            } else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
            this._ = {}, this.commands = {}, this.templates = {}, this.name = this.name || b(), this.id = CKEDITOR.tools.getNextId(), this.status = "unloaded", this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config), this.ui = new CKEDITOR.ui(this), this.focusManager = new CKEDITOR.focusManager(this), this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this), this.on("readOnly", c), this.on("selectionChange", function(a) {
                e(this, a.data.path)
            }), this.on("activeFilterChange", function() {
                e(this, this.elementPath(), !0)
            }), this.on("mode", c), this.on("instanceReady", function() {
                this.config.startupFocus && this.focus()
            }), CKEDITOR.fire("instanceCreated", null, this), CKEDITOR.add(this), CKEDITOR.tools.setTimeout(function() {
                g(this, a)
            }, 0, this)
        }

        function b() {
            do var a = "editor" + ++m; while (CKEDITOR.instances[a]);
            return a
        }

        function c() {
            var a, b = this.commands;
            for (a in b) d(this, b[a])
        }

        function d(a, b) {
            b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
        }

        function e(a, b, c) {
            if (b) {
                var d, e, f = a.commands;
                for (e in f) d = f[e], (c || d.contextSensitive) && d.refresh(a, b)
            }
        }

        function f(a) {
            var b = a.config.customConfig;
            if (!b) return !1;
            var b = CKEDITOR.getUrl(b),
                c = n[b] || (n[b] = {});
            return c.fn ? (c.fn.call(a, a.config), (CKEDITOR.getUrl(a.config.customConfig) == b || !f(a)) && a.fireOnce("customConfigLoaded")) : CKEDITOR.scriptLoader.queue(b, function() {
                c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function() {}, f(a)
            }), !0
        }

        function g(a, b) {
            a.on("customConfigLoaded", function() {
                if (b) {
                    if (b.on)
                        for (var c in b.on) a.on(c, b.on[c]);
                    CKEDITOR.tools.extend(a.config, b, !0), delete a.config.on
                }
                c = a.config, a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled"))), a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : !1, a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0, a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode, a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode, c.skin && (CKEDITOR.skinName = c.skin), a.fireOnce("configLoaded"), a.dataProcessor = new CKEDITOR.htmlDataProcessor(a), a.filter = a.activeFilter = new CKEDITOR.filter(a), h(a)
            }), b && null != b.customConfig && (a.config.customConfig = b.customConfig), f(a) || a.fireOnce("customConfigLoaded")
        }

        function h(a) {
            CKEDITOR.skin.loadPart("editor", function() {
                i(a)
            })
        }

        function i(a) {
            CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function(b, c) {
                var d = a.config.title;
                a.langCode = b, a.lang = CKEDITOR.tools.prototypedCopy(c), a.title = "string" == typeof d || d === !1 ? d : [a.lang.editor, a.name].join(", "), a.config.contentsLangDirection || (a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir), a.fire("langLoaded"), j(a)
            })
        }

        function j(a) {
            a.getStylesSet(function(b) {
                a.once("loaded", function() {
                    a.fire("stylesSet", {
                        styles: b
                    })
                }, null, null, 1), k(a)
            })
        }

        function k(a) {
            var b = a.config,
                c = b.plugins,
                d = b.extraPlugins,
                e = b.removePlugins;
            if (d) var f = RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
                c = c.replace(f, ""),
                c = c + ("," + d);
            if (e) var g = RegExp("(?:^|,)(?:" + e.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"),
                c = c.replace(g, "");
            CKEDITOR.env.air && (c += ",adobeair"), CKEDITOR.plugins.load(c.split(","), function(c) {
                var d = [],
                    e = [],
                    f = [];
                a.plugins = c;
                for (var h in c) {
                    var i, j = c[h],
                        k = j.lang,
                        l = null,
                        m = j.requires;
                    if (CKEDITOR.tools.isArray(m) && (m = m.join(",")), m && (i = m.match(g)))
                        for (; m = i.pop();) CKEDITOR.tools.setTimeout(function(a, b) {
                            throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' + b + '" plugin.')
                        }, 0, null, [m, h]);
                    k && !a.lang[h] && (k.split && (k = k.split(",")), CKEDITOR.tools.indexOf(k, a.langCode) >= 0 ? l = a.langCode : (l = a.langCode.replace(/-.*/, ""), l = l != a.langCode && CKEDITOR.tools.indexOf(k, l) >= 0 ? l : CKEDITOR.tools.indexOf(k, "en") >= 0 ? "en" : k[0]), j.langEntries && j.langEntries[l] ? (a.lang[h] = j.langEntries[l], l = null) : f.push(CKEDITOR.getUrl(j.path + "lang/" + l + ".js"))), e.push(l), d.push(j)
                }
                CKEDITOR.scriptLoader.load(f, function() {
                    for (var c = ["beforeInit", "init", "afterInit"], f = 0; f < c.length; f++)
                        for (var g = 0; g < d.length; g++) {
                            var h = d[g];
                            0 === f && e[g] && h.lang && h.langEntries && (a.lang[h.name] = h.langEntries[e[g]]), h[c[f]] && h[c[f]](a)
                        }
                    for (a.fireOnce("pluginsLoaded"), b.keystrokes && a.setKeystroke(a.config.keystrokes), g = 0; g < a.config.blockedKeystrokes.length; g++) a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[g]] = 1;
                    a.status = "loaded", a.fireOnce("loaded"), CKEDITOR.fire("instanceLoaded", null, a)
                })
            })
        }

        function l() {
            var a = this.element;
            if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
                var b = this.getData();
                return this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b)), a.is("textarea") ? a.setValue(b) : a.setHtml(b), !0
            }
            return !1
        }
        a.prototype = CKEDITOR.editor.prototype, CKEDITOR.editor = a;
        var m = 0,
            n = {};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            addCommand: function(a, b) {
                b.name = a.toLowerCase();
                var c = new CKEDITOR.command(this, b);
                return this.mode && d(this, c), this.commands[a] = c
            },
            _attachToForm: function() {
                function a(a) {
                    b.updateElement(), b._.required && !c.getValue() && b.fire("required") === !1 && a.data.preventDefault()
                }
                var b = this,
                    c = b.element,
                    d = new CKEDITOR.dom.element(c.$.form);
                c.is("textarea") && d && (d.on("submit", a), d.$.submit && d.$.submit.call && d.$.submit.apply && (d.$.submit = CKEDITOR.tools.override(d.$.submit, function(b) {
                    return function() {
                        a(), b.apply ? b.apply(this) : b()
                    }
                })), b.on("destroy", function() {
                    d.removeListener("submit", a)
                }))
            },
            destroy: function(a) {
                this.fire("beforeDestroy"), !a && l.call(this), this.editable(null), this.filter.destroy(), delete this.filter, delete this.activeFilter, this.status = "destroyed", this.fire("destroy"), this.removeAllListeners(), CKEDITOR.remove(this), CKEDITOR.fire("instanceDestroyed", null, this)
            },
            elementPath: function(a) {
                if (!a) {
                    if (a = this.getSelection(), !a) return null;
                    a = a.getStartElement()
                }
                return a ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
            },
            createRange: function() {
                var a = this.editable();
                return a ? new CKEDITOR.dom.range(a) : null
            },
            execCommand: function(a, b) {
                var c = this.getCommand(a),
                    d = {
                        name: a,
                        commandData: b,
                        command: c
                    };
                return c && c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", d) !== !1 && (d.returnValue = c.exec(d.commandData), !c.async && this.fire("afterCommandExec", d) !== !1) ? d.returnValue : !1
            },
            getCommand: function(a) {
                return this.commands[a]
            },
            getData: function(a) {
                !a && this.fire("beforeGetData");
                var b = this._.data;
                return "string" != typeof b && (b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : ""), b = {
                    dataValue: b
                }, !a && this.fire("getData", b), b.dataValue
            },
            getSnapshot: function() {
                var a = this.fire("getSnapshot");
                if ("string" != typeof a) {
                    var b = this.element;
                    b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
                }
                return a
            },
            loadSnapshot: function(a) {
                this.fire("loadSnapshot", a)
            },
            setData: function(a, b, c) {
                var d = !0,
                    e = b;
                b && "object" == typeof b && (c = b.internal, e = b.callback, d = !b.noSnapshot), !c && d && this.fire("saveSnapshot"), (e || !c) && this.once("dataReady", function(a) {
                    !c && d && this.fire("saveSnapshot"), e && e.call(a.editor)
                }), a = {
                    dataValue: a
                }, !c && this.fire("setData", a), this._.data = a.dataValue, !c && this.fire("afterSetData", a)
            },
            setReadOnly: function(a) {
                a = null == a || a, this.readOnly != a && (this.readOnly = a, this.keystrokeHandler.blockedKeystrokes[8] = +a, this.editable().setReadOnly(a), this.fire("readOnly"))
            },
            insertHtml: function(a, b) {
                this.fire("insertHtml", {
                    dataValue: a,
                    mode: b
                })
            },
            insertText: function(a) {
                this.fire("insertText", a)
            },
            insertElement: function(a) {
                this.fire("insertElement", a)
            },
            focus: function() {
                this.fire("beforeFocus")
            },
            checkDirty: function() {
                return "ready" == this.status && this._.previousValue !== this.getSnapshot()
            },
            resetDirty: function() {
                this._.previousValue = this.getSnapshot()
            },
            updateElement: function() {
                return l.call(this)
            },
            setKeystroke: function() {
                for (var a, b, c = this.keystrokeHandler.keystrokes, d = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [
                        [].slice.call(arguments, 0)
                    ], e = d.length; e--;) a = d[e], b = 0, CKEDITOR.tools.isArray(a) && (b = a[1], a = a[0]), b ? c[a] = b : delete c[a]
            },
            addFeature: function(a) {
                return this.filter.addFeature(a)
            },
            setActiveFilter: function(a) {
                a || (a = this.filter), this.activeFilter !== a && (this.activeFilter = a, this.fire("activeFilterChange"), a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, !0)))
            },
            setActiveEnterMode: function(a, b) {
                a = a ? this.blockless ? CKEDITOR.ENTER_BR : a : this.enterMode, b = b ? this.blockless ? CKEDITOR.ENTER_BR : b : this.shiftEnterMode, (this.activeEnterMode != a || this.activeShiftEnterMode != b) && (this.activeEnterMode = a, this.activeShiftEnterMode = b, this.fire("activeEnterModeChange"))
            }
        })
    }(), CKEDITOR.ELEMENT_MODE_NONE = 0, CKEDITOR.ELEMENT_MODE_REPLACE = 1, CKEDITOR.ELEMENT_MODE_APPENDTO = 2, CKEDITOR.ELEMENT_MODE_INLINE = 3, CKEDITOR.htmlParser = function() {
        this._ = {
            htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)-->)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")
        }
    }, function() {
        var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
            b = {
                checked: 1,
                compact: 1,
                declare: 1,
                defer: 1,
                disabled: 1,
                ismap: 1,
                multiple: 1,
                nohref: 1,
                noresize: 1,
                noshade: 1,
                nowrap: 1,
                readonly: 1,
                selected: 1
            };
        CKEDITOR.htmlParser.prototype = {
            onTagOpen: function() {},
            onTagClose: function() {},
            onText: function() {},
            onCDATA: function() {},
            onComment: function() {},
            parse: function(c) {
                for (var d, e, f, g = 0; d = this._.htmlPartsRegex.exec(c);)
                    if (e = d.index, e > g && (g = c.substring(g, e), f ? f.push(g) : this.onText(g)), g = this._.htmlPartsRegex.lastIndex, !(e = d[1]) || (e = e.toLowerCase(), f && CKEDITOR.dtd.$cdata[e] && (this.onCDATA(f.join("")), f = null), f))
                        if (f) f.push(d[0]);
                        else if (e = d[3]) {
                    if (e = e.toLowerCase(), !/="/.test(e)) {
                        var h, i = {};
                        d = d[4];
                        var j = !(!d || "/" != d.charAt(d.length - 1));
                        if (d)
                            for (; h = a.exec(d);) {
                                var k = h[1].toLowerCase();
                                h = h[2] || h[3] || h[4] || "", i[k] = !h && b[k] ? k : CKEDITOR.tools.htmlDecodeAttr(h)
                            }
                        this.onTagOpen(e, i, j), !f && CKEDITOR.dtd.$cdata[e] && (f = [])
                    }
                } else(e = d[2]) && this.onComment(e);
                else this.onTagClose(e);
                c.length > g && this.onText(c.substring(g, c.length))
            }
        }
    }(), CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
        $: function() {
            this._ = {
                output: []
            }
        },
        proto: {
            openTag: function(a) {
                this._.output.push("<", a)
            },
            openTagClose: function(a, b) {
                b ? this._.output.push(" />") : this._.output.push(">")
            },
            attribute: function(a, b) {
                "string" == typeof b && (b = CKEDITOR.tools.htmlEncodeAttr(b)), this._.output.push(" ", a, '="', b, '"')
            },
            closeTag: function(a) {
                this._.output.push("</", a, ">")
            },
            text: function(a) {
                this._.output.push(a)
            },
            comment: function(a) {
                this._.output.push("<!--", a, "-->")
            },
            write: function(a) {
                this._.output.push(a)
            },
            reset: function() {
                this._.output = [], this._.indent = !1
            },
            getHtml: function(a) {
                var b = this._.output.join("");
                return a && this.reset(), b
            }
        }
    }), function() {
        CKEDITOR.htmlParser.node = function() {}, CKEDITOR.htmlParser.node.prototype = {
            remove: function() {
                var a = this.parent.children,
                    b = CKEDITOR.tools.indexOf(a, this),
                    c = this.previous,
                    d = this.next;
                c && (c.next = d), d && (d.previous = c), a.splice(b, 1), this.parent = null
            },
            replaceWith: function(a) {
                var b = this.parent.children,
                    c = CKEDITOR.tools.indexOf(b, this),
                    d = a.previous = this.previous,
                    e = a.next = this.next;
                d && (d.next = a), e && (e.previous = a), b[c] = a, a.parent = this.parent, this.parent = null
            },
            insertAfter: function(a) {
                var b = a.parent.children,
                    c = CKEDITOR.tools.indexOf(b, a),
                    d = a.next;
                b.splice(c + 1, 0, this), this.next = a.next, this.previous = a, a.next = this, d && (d.previous = this), this.parent = a.parent
            },
            insertBefore: function(a) {
                var b = a.parent.children,
                    c = CKEDITOR.tools.indexOf(b, a);
                b.splice(c, 0, this), this.next = a, (this.previous = a.previous) && (a.previous.next = this), a.previous = this, this.parent = a.parent
            },
            getAscendant: function(a) {
                for (var b = ("function" == typeof a ? a : "string" == typeof a ? function(b) {
                        return b.name == a
                    } : function(b) {
                        return b.name in a
                    }), c = this.parent; c && c.type == CKEDITOR.NODE_ELEMENT;) {
                    if (b(c)) return c;
                    c = c.parent
                }
                return null
            },
            wrapWith: function(a) {
                return this.replaceWith(a), a.add(this), a
            },
            getIndex: function() {
                return CKEDITOR.tools.indexOf(this.parent.children, this)
            },
            getFilterContext: function(a) {
                return a || {}
            }
        }
    }(), CKEDITOR.htmlParser.comment = function(a) {
        this.value = a, this._ = {
            isBlockLike: !1
        }
    }, CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
        type: CKEDITOR.NODE_COMMENT,
        filter: function(a, b) {
            var c = this.value;
            return (c = a.onComment(b, c, this)) ? "string" != typeof c ? (this.replaceWith(c), !1) : (this.value = c, !0) : (this.remove(), !1)
        },
        writeHtml: function(a, b) {
            b && this.filter(b), a.comment(this.value)
        }
    }), function() {
        CKEDITOR.htmlParser.text = function(a) {
            this.value = a, this._ = {
                isBlockLike: !1
            }
        }, CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_TEXT,
            filter: function(a, b) {
                return (this.value = a.onText(b, this.value, this)) ? void 0 : (this.remove(), !1)
            },
            writeHtml: function(a, b) {
                b && this.filter(b), a.text(this.value)
            }
        })
    }(), function() {
        CKEDITOR.htmlParser.cdata = function(a) {
            this.value = a
        }, CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_TEXT,
            filter: function() {},
            writeHtml: function(a) {
                a.write(this.value)
            }
        })
    }(), CKEDITOR.htmlParser.fragment = function() {
        this.children = [], this.parent = null, this._ = {
            isBlockLike: !0,
            hasInlineStarted: !1
        }
    }, function() {
        function a(a) {
            return a.attributes["data-cke-survive"] ? !1 : "a" == a.name && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
        }
        var b = CKEDITOR.tools.extend({
                table: 1,
                ul: 1,
                ol: 1,
                dl: 1
            }, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl),
            c = {
                ol: 1,
                ul: 1
            },
            d = CKEDITOR.tools.extend({}, {
                html: 1
            }, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
                style: 1,
                script: 1
            }),
            e = {
                ul: "li",
                ol: "li",
                dl: "dd",
                table: "tbody",
                tbody: "tr",
                thead: "tr",
                tfoot: "tr",
                tr: "td"
            };
        CKEDITOR.htmlParser.fragment.fromHtml = function(f, g, h) {
            function i(a) {
                var b;
                if (q.length > 0)
                    for (var c = 0; c < q.length; c++) {
                        var d = q[c],
                            e = d.name,
                            f = CKEDITOR.dtd[e],
                            g = s.name && CKEDITOR.dtd[s.name];
                        g && !g[e] || a && f && !f[a] && CKEDITOR.dtd[a] ? e == s.name && (l(s, s.parent, 1), c--) : (b || (j(), b = 1), d = d.clone(), d.parent = s, s = d, q.splice(c, 1), c--)
                    }
            }

            function j() {
                for (; r.length;) l(r.shift(), s)
            }

            function k(a) {
                if (a._.isBlockLike && "pre" != a.name && "textarea" != a.name) {
                    var b, c = a.children.length,
                        d = a.children[c - 1];
                    d && d.type == CKEDITOR.NODE_TEXT && ((b = CKEDITOR.tools.rtrim(d.value)) ? d.value = b : a.children.length = c - 1)
                }
            }

            function l(b, c, d) {
                var c = c || s || p,
                    e = s;
                void 0 === b.previous && (m(c, b) && (s = c, o.onTagOpen(h, {}), b.returnPoint = c = s), k(b), (!a(b) || b.children.length) && c.add(b), "pre" == b.name && (u = !1), "textarea" == b.name && (t = !1)), b.returnPoint ? (s = b.returnPoint, delete b.returnPoint) : s = d ? c : e
            }

            function m(a, b) {
                if ((a == p || "body" == a.name) && h && (!a.name || CKEDITOR.dtd[a.name][h])) {
                    var c, d;
                    return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
                }
            }

            function n(a, b) {
                return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || "dt" == a && "dd" == b || "dd" == a && "dt" == b : !1
            }
            var o = new CKEDITOR.htmlParser,
                p = g instanceof CKEDITOR.htmlParser.element ? g : "string" == typeof g ? new CKEDITOR.htmlParser.element(g) : new CKEDITOR.htmlParser.fragment,
                q = [],
                r = [],
                s = p,
                t = "textarea" == p.name,
                u = "pre" == p.name;
            o.onTagOpen = function(e, f, g, h) {
                if (f = new CKEDITOR.htmlParser.element(e, f), f.isUnknown && g && (f.isEmpty = !0), f.isOptionalClose = h, a(f)) q.push(f);
                else {
                    if ("pre" == e) u = !0;
                    else {
                        if ("br" == e && u) return void s.add(new CKEDITOR.htmlParser.text("\n"));
                        "textarea" == e && (t = !0)
                    }
                    if ("br" == e) r.push(f);
                    else {
                        for (; h = (g = s.name) ? CKEDITOR.dtd[g] || (s._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : d, !(f.isUnknown || s.isUnknown || h[e]);)
                            if (s.isOptionalClose) o.onTagClose(g);
                            else if (e in c && g in c) g = s.children, (g = g[g.length - 1]) && "li" == g.name || l(g = new CKEDITOR.htmlParser.element("li"), s), !f.returnPoint && (f.returnPoint = s), s = g;
                        else if (e in CKEDITOR.dtd.$listItem && !n(e, g)) o.onTagOpen("li" == e ? "ul" : "dl", {}, 0, 1);
                        else if (g in b && !n(e, g)) !f.returnPoint && (f.returnPoint = s), s = s.parent;
                        else {
                            if (g in CKEDITOR.dtd.$inline && q.unshift(s), !s.parent) {
                                f.isOrphan = 1;
                                break
                            }
                            l(s, s.parent, 1)
                        }
                        i(e), j(), f.parent = s, f.isEmpty ? l(f) : s = f
                    }
                }
            }, o.onTagClose = function(a) {
                for (var b = q.length - 1; b >= 0; b--)
                    if (a == q[b].name) return void q.splice(b, 1);
                for (var c = [], d = [], e = s; e != p && e.name != a;) e._.isBlockLike || d.unshift(e), c.push(e), e = e.returnPoint || e.parent;
                if (e != p) {
                    for (b = 0; b < c.length; b++) {
                        var f = c[b];
                        l(f, f.parent)
                    }
                    s = e, e._.isBlockLike && j(), l(e, e.parent), e == s && (s = s.parent), q = q.concat(d)
                }
                "body" == a && (h = !1)
            }, o.onText = function(a) {
                if (s._.hasInlineStarted && !r.length || u || t || (a = CKEDITOR.tools.ltrim(a), 0 !== a.length)) {
                    var c = s.name,
                        f = c ? CKEDITOR.dtd[c] || (s._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : d;
                    !t && !f["#"] && c in b ? (o.onTagOpen(e[c] || ""), o.onText(a)) : (j(), i(), !u && !t && (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " ")), a = new CKEDITOR.htmlParser.text(a), m(s, a) && this.onTagOpen(h, {}, 0, 1), s.add(a))
                }
            }, o.onCDATA = function(a) {
                s.add(new CKEDITOR.htmlParser.cdata(a))
            }, o.onComment = function(a) {
                j(), i(), s.add(new CKEDITOR.htmlParser.comment(a))
            }, o.parse(f);
            for (j(); s != p;) l(s, s.parent, 1);
            return k(p), p
        }, CKEDITOR.htmlParser.fragment.prototype = {
            type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
            add: function(a, b) {
                isNaN(b) && (b = this.children.length);
                var c = b > 0 ? this.children[b - 1] : null;
                if (c) {
                    if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT && (c.value = CKEDITOR.tools.rtrim(c.value), 0 === c.value.length)) return this.children.pop(), void this.add(a);
                    c.next = a
                }
                a.previous = c, a.parent = this, this.children.splice(b, 0, a), this._.hasInlineStarted || (this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike)
            },
            filter: function(a, b) {
                b = this.getFilterContext(b), a.onRoot(b, this), this.filterChildren(a, !1, b)
            },
            filterChildren: function(a, b, c) {
                if (this.childrenFilteredBy != a.id)
                    for (c = this.getFilterContext(c), b && !this.parent && a.onRoot(c, this), this.childrenFilteredBy = a.id, b = 0; b < this.children.length; b++) this.children[b].filter(a, c) === !1 && b--
            },
            writeHtml: function(a, b) {
                b && this.filter(b), this.writeChildrenHtml(a)
            },
            writeChildrenHtml: function(a, b, c) {
                var d = this.getFilterContext();
                for (c && !this.parent && b && b.onRoot(d, this), b && this.filterChildren(b, !1, d), b = 0, c = this.children, d = c.length; d > b; b++) c[b].writeHtml(a)
            },
            forEach: function(a, b, c) {
                if (!(c || b && this.type != b)) var d = a(this);
                if (d !== !1)
                    for (var c = this.children, e = 0; e < c.length; e++) d = c[e], d.type == CKEDITOR.NODE_ELEMENT ? d.forEach(a, b) : (!b || d.type == b) && a(d)
            },
            getFilterContext: function(a) {
                return a || {}
            }
        }
    }(), function() {
        function a() {
            this.rules = []
        }

        function b(b, c, d, e) {
            var f, g;
            for (f in c)(g = b[f]) || (g = b[f] = new a), g.add(c[f], d, e)
        }
        CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
            $: function(b) {
                this.id = CKEDITOR.tools.getNextNumber(), this.elementNameRules = new a, this.attributeNameRules = new a, this.elementsRules = {}, this.attributesRules = {}, this.textRules = new a, this.commentRules = new a, this.rootRules = new a, b && this.addRules(b, 10)
            },
            proto: {
                addRules: function(a, c) {
                    var d;
                    "number" == typeof c ? d = c : c && "priority" in c && (d = c.priority), "number" != typeof d && (d = 10), "object" != typeof c && (c = {}), a.elementNames && this.elementNameRules.addMany(a.elementNames, d, c), a.attributeNames && this.attributeNameRules.addMany(a.attributeNames, d, c), a.elements && b(this.elementsRules, a.elements, d, c), a.attributes && b(this.attributesRules, a.attributes, d, c), a.text && this.textRules.add(a.text, d, c), a.comment && this.commentRules.add(a.comment, d, c), a.root && this.rootRules.add(a.root, d, c)
                },
                applyTo: function(a) {
                    a.filter(this)
                },
                onElementName: function(a, b) {
                    return this.elementNameRules.execOnName(a, b)
                },
                onAttributeName: function(a, b) {
                    return this.attributeNameRules.execOnName(a, b)
                },
                onText: function(a, b, c) {
                    return this.textRules.exec(a, b, c)
                },
                onComment: function(a, b, c) {
                    return this.commentRules.exec(a, b, c)
                },
                onRoot: function(a, b) {
                    return this.rootRules.exec(a, b)
                },
                onElement: function(a, b) {
                    for (var c, d = [this.elementsRules["^"], this.elementsRules[b.name], this.elementsRules.$], e = 0; 3 > e; e++)
                        if (c = d[e]) {
                            if (c = c.exec(a, b, this), c === !1) return null;
                            if (c && c != b) return this.onNode(a, c);
                            if (b.parent && !b.name) break
                        }
                    return b
                },
                onNode: function(a, b) {
                    var c = b.type;
                    return c == CKEDITOR.NODE_ELEMENT ? this.onElement(a, b) : c == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, b.value)) : c == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, b.value)) : null
                },
                onAttribute: function(a, b, c, d) {
                    return (c = this.attributesRules[c]) ? c.exec(a, d, b, this) : d
                }
            }
        }), CKEDITOR.htmlParser.filterRulesGroup = a, a.prototype = {
            add: function(a, b, c) {
                this.rules.splice(this.findIndex(b), 0, {
                    value: a,
                    priority: b,
                    options: c
                })
            },
            addMany: function(a, b, c) {
                for (var d = [this.findIndex(b), 0], e = 0, f = a.length; f > e; e++) d.push({
                    value: a[e],
                    priority: b,
                    options: c
                });
                this.rules.splice.apply(this.rules, d)
            },
            findIndex: function(a) {
                for (var b = this.rules, c = b.length - 1; c >= 0 && a < b[c].priority;) c--;
                return c + 1
            },
            exec: function(a, b) {
                var c, d, e, f, g = b instanceof CKEDITOR.htmlParser.node || b instanceof CKEDITOR.htmlParser.fragment,
                    h = Array.prototype.slice.call(arguments, 1),
                    i = this.rules,
                    j = i.length;
                for (f = 0; j > f; f++)
                    if (g && (c = b.type, d = b.name), e = i[f], !(a.nonEditable && !e.options.applyToAll || a.nestedEditable && e.options.excludeNestedEditable)) {
                        if (e = e.value.apply(null, h), e === !1 || g && e && (e.name != d || e.type != c)) return e;
                        null != e && (h[0] = b = e)
                    }
                return b
            },
            execOnName: function(a, b) {
                for (var c, d = 0, e = this.rules, f = e.length; b && f > d; d++) c = e[d], !(a.nonEditable && !c.options.applyToAll || a.nestedEditable && c.options.excludeNestedEditable) && (b = b.replace(c.value[0], c.value[1]));
                return b
            }
        }
    }(), function() {
        function a(a, b) {
            function h(a) {
                return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {
                    "data-cke-bogus": 1
                })
            }

            function i(a, b) {
                return function(e) {
                    if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var g, i, k = [],
                            l = c(e);
                        if (l)
                            for (j(l, 1) && k.push(l); l;) f(l) && (g = d(l)) && j(g) && ((i = d(g)) && !f(i) ? k.push(g) : (h(m).insertAfter(g), g.remove())), l = l.previous;
                        for (l = 0; l < k.length; l++) k[l].remove();
                        (k = ("function" == typeof b ? b(e) : b) !== !1) && ((m || CKEDITOR.env.needsBrFiller || e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) && (m || CKEDITOR.env.needsBrFiller || !(document.documentMode > 7 || e.name in CKEDITOR.dtd.tr || e.name in CKEDITOR.dtd.$listItem)) ? (k = c(e), k = !k || "form" == e.name && "input" == k.name) : k = !1), k && e.add(h(a))
                    }
                }
            }

            function j(a, b) {
                if ((!m || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && "br" == a.name && !a.attributes["data-cke-eol"]) return !0;
                var c;
                if (a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(q))) {
                    if (c.index && (new CKEDITOR.htmlParser.text(a.value.substring(0, c.index)).insertBefore(a), a.value = c[0]), !CKEDITOR.env.needsBrFiller && m && (!b || a.parent.name in n)) return !0;
                    if (!m && ((c = a.previous) && "br" == c.name || !c || f(c))) return !0
                }
                return !1
            }
            var k, l = {
                    elements: {}
                },
                m = "html" == b,
                n = CKEDITOR.tools.extend({}, u);
            for (k in n) "#" in s[k] || delete n[k];
            for (k in n) l.elements[k] = i(m, a.config.fillEmptyBlocks);
            return l.root = i(m, !1), l.elements.br = function(a) {
                return function(b) {
                    if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var c = b.attributes;
                        if ("data-cke-bogus" in c || "data-cke-eol" in c) delete c["data-cke-bogus"];
                        else {
                            for (c = b.next; c && e(c);) c = c.next;
                            var i = d(b);
                            !c && f(b.parent) ? g(b.parent, h(a)) : f(c) && i && !f(i) && h(a).insertBefore(c)
                        }
                    }
                }
            }(m), l
        }

        function b(a, b) {
            return a != CKEDITOR.ENTER_BR && b !== !1 ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : !1
        }

        function c(a) {
            for (a = a.children[a.children.length - 1]; a && e(a);) a = a.previous;
            return a
        }

        function d(a) {
            for (a = a.previous; a && e(a);) a = a.previous;
            return a
        }

        function e(a) {
            return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT && a.attributes["data-cke-bookmark"]
        }

        function f(a) {
            return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in u || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
        }

        function g(a, b) {
            var c = a.children[a.children.length - 1];
            a.children.push(b), b.parent = a, c && (c.next = b, b.previous = c)
        }

        function h(a) {
            a = a.attributes, "false" != a.contenteditable && (a["data-cke-editable"] = a.contenteditable ? "true" : 1), a.contenteditable = "false"
        }

        function i(a) {
            switch (a = a.attributes, a["data-cke-editable"]) {
                case "true":
                    a.contenteditable = "true";
                    break;
                case "1":
                    delete a.contenteditable
            }
        }

        function j(a) {
            return a.replace(z, function(a, b, c) {
                return "<" + b + c.replace(A, function(a, b) {
                    return B.test(b) && -1 == c.indexOf("data-cke-saved-" + b) ? " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a : a
                }) + ">"
            })
        }

        function k(a, b) {
            return a.replace(b, function(a, b, c) {
                return 0 === a.indexOf("<textarea") && (a = b + n(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>"), "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
            })
        }

        function l(a) {
            return a.replace(E, function(a, b) {
                return decodeURIComponent(b)
            })
        }

        function m(a) {
            return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function(a) {
                return "<!--" + r + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "-->"
            })
        }

        function n(a) {
            return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function(a, b) {
                return decodeURIComponent(b)
            })
        }

        function o(a, b) {
            var c = b._.dataStore;
            return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function(a, b) {
                return decodeURIComponent(b)
            }).replace(/\{cke_protected_(\d+)\}/g, function(a, b) {
                return c && c[b] || ""
            })
        }

        function p(a, b) {
            for (var c = [], d = b.config.protectedSource, e = b._.dataStore || (b._.dataStore = {
                    id: 1
                }), f = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g, d = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi, /<meta[\s\S]*?\/?>/gi].concat(d), a = a.replace(/<\!--[\s\S]*?--\>/g, function(a) {
                    return "<!--{cke_tempcomment}" + (c.push(a) - 1) + "-->"
                }), g = 0; g < d.length; g++) a = a.replace(d[g], function(a) {
                return a = a.replace(f, function(a, b, d) {
                    return c[d]
                }), /cke_temp(comment)?/.test(a) ? a : "<!--{cke_temp}" + (c.push(a) - 1) + "-->"
            });
            return a = a.replace(f, function(a, b, d) {
                return "<!--" + r + (b ? "{C}" : "") + encodeURIComponent(c[d]).replace(/--/g, "%2D%2D") + "-->"
            }), a = a.replace(/<\w+(?:\s+(?:(?:[^\s=>]+\s*=\s*(?:[^'"\s>]+|'[^']*'|"[^"]*"))|[^\s=>]+))+\s*>/g, function(a) {
                return a.replace(/<\!--\{cke_protected\}([^>]*)--\>/g, function(a, b) {
                    return e[e.id] = decodeURIComponent(b), "{cke_protected_" + e.id++ + "}"
                })
            }), a = a.replace(/<(title|iframe|textarea)([^>]*)>([\s\S]*?)<\/\1>/g, function(a, c, d, e) {
                return "<" + c + d + ">" + o(n(e), b) + "</" + c + ">"
            })
        }
        CKEDITOR.htmlDataProcessor = function(c) {
            var d, e, f = this;
            this.editor = c, this.dataFilter = d = new CKEDITOR.htmlParser.filter, this.htmlFilter = e = new CKEDITOR.htmlParser.filter, this.writer = new CKEDITOR.htmlParser.basicWriter, d.addRules(v), d.addRules(w, {
                applyToAll: !0
            }), d.addRules(a(c, "data"), {
                applyToAll: !0
            }), e.addRules(x), e.addRules(y, {
                applyToAll: !0
            }), e.addRules(a(c, "html"), {
                applyToAll: !0
            }), c.on("toHtml", function(a) {
                var d, a = a.data,
                    e = a.dataValue,
                    e = p(e, c),
                    e = k(e, D),
                    e = j(e),
                    e = k(e, C),
                    e = e.replace(F, "$1cke:$2"),
                    e = e.replace(H, "<cke:$1$2></cke:$1>"),
                    e = e.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
                    e = e.replace(/([^a-z0-9<\-])(on\w{3,})(?!>)/gi, "$1data-cke-" + CKEDITOR.rnd + "-$2"),
                    f = a.context || c.editable().getName();
                CKEDITOR.env.ie && CKEDITOR.env.version < 9 && "pre" == f && (f = "div", e = "<pre>" + e + "</pre>", d = 1), f = c.document.createElement(f), f.setHtml("a" + e), e = f.getHtml().substr(1), e = e.replace(RegExp("data-cke-" + CKEDITOR.rnd + "-", "ig"), ""), d && (e = e.replace(/^<pre>|<\/pre>$/gi, "")), e = e.replace(G, "$1$2"), e = l(e), e = n(e), a.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(e, a.context, a.fixForBody === !1 ? !1 : b(a.enterMode, c.config.autoParagraph))
            }, null, null, 5), c.on("toHtml", function(a) {
                a.data.filter.applyTo(a.data.dataValue, !0, a.data.dontFilter, a.data.enterMode) && c.fire("dataFiltered")
            }, null, null, 6), c.on("toHtml", function(a) {
                a.data.dataValue.filterChildren(f.dataFilter, !0)
            }, null, null, 10), c.on("toHtml", function(a) {
                var a = a.data,
                    b = a.dataValue,
                    c = new CKEDITOR.htmlParser.basicWriter;
                b.writeChildrenHtml(c), b = c.getHtml(!0), a.dataValue = m(b)
            }, null, null, 15), c.on("toDataFormat", function(a) {
                var d = a.data.dataValue;
                a.data.enterMode != CKEDITOR.ENTER_BR && (d = d.replace(/^<br *\/?>/i, "")), a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(d, a.data.context, b(a.data.enterMode, c.config.autoParagraph))
            }, null, null, 5), c.on("toDataFormat", function(a) {
                a.data.dataValue.filterChildren(f.htmlFilter, !0)
            }, null, null, 10), c.on("toDataFormat", function(a) {
                a.data.filter.applyTo(a.data.dataValue, !1, !0)
            }, null, null, 11), c.on("toDataFormat", function(a) {
                var b = a.data.dataValue,
                    d = f.writer;
                d.reset(), b.writeChildrenHtml(d), b = d.getHtml(!0), b = n(b), b = o(b, c), a.data.dataValue = b
            }, null, null, 15)
        }, CKEDITOR.htmlDataProcessor.prototype = {
            toHtml: function(a, b, c, d) {
                var e, f, g, h = this.editor;
                return b && "object" == typeof b ? (e = b.context, c = b.fixForBody, d = b.dontFilter, f = b.filter, g = b.enterMode) : e = b, !e && null !== e && (e = h.editable().getName()), h.fire("toHtml", {
                    dataValue: a,
                    context: e,
                    fixForBody: c,
                    dontFilter: d,
                    filter: f || h.filter,
                    enterMode: g || h.enterMode
                }).dataValue
            },
            toDataFormat: function(a, b) {
                var c, d, e;
                return b && (c = b.context, d = b.filter, e = b.enterMode), !c && null !== c && (c = this.editor.editable().getName()), this.editor.fire("toDataFormat", {
                    dataValue: a,
                    filter: d || this.editor.filter,
                    context: c,
                    enterMode: e || this.editor.enterMode
                }).dataValue
            }
        };
        var q = /(?:&nbsp;|\xa0)$/,
            r = "{cke_protected}",
            s = CKEDITOR.dtd,
            t = ["caption", "colgroup", "col", "thead", "tfoot", "tbody"],
            u = CKEDITOR.tools.extend({}, s.$blockLimit, s.$block),
            v = {
                elements: {
                    input: h,
                    textarea: h
                }
            },
            w = {
                attributeNames: [
                    [/^on/, "data-cke-pa-on"],
                    [/^data-cke-expando$/, ""]
                ]
            },
            x = {
                elements: {
                    embed: function(a) {
                        var b = a.parent;
                        if (b && "object" == b.name) {
                            var c = b.attributes.width,
                                b = b.attributes.height;
                            c && (a.attributes.width = c), b && (a.attributes.height = b)
                        }
                    },
                    a: function(a) {
                        return a.children.length || a.attributes.name || a.attributes["data-cke-saved-name"] ? void 0 : !1
                    }
                }
            },
            y = {
                elementNames: [
                    [/^cke:/, ""],
                    [/^\?xml:namespace$/, ""]
                ],
                attributeNames: [
                    [/^data-cke-(saved|pa)-/, ""],
                    [/^data-cke-.*/, ""],
                    ["hidefocus", ""]
                ],
                elements: {
                    $: function(a) {
                        var b = a.attributes;
                        if (b) {
                            if (b["data-cke-temp"]) return !1;
                            for (var c, d = ["name", "href", "src"], e = 0; e < d.length; e++) c = "data-cke-saved-" + d[e], c in b && delete b[d[e]]
                        }
                        return a
                    },
                    table: function(a) {
                        a.children.slice(0).sort(function(a, b) {
                            var c, d;
                            return a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type && (c = CKEDITOR.tools.indexOf(t, a.name), d = CKEDITOR.tools.indexOf(t, b.name)), c > -1 && d > -1 && c != d || (c = a.parent ? a.getIndex() : -1, d = b.parent ? b.getIndex() : -1), c > d ? 1 : -1
                        })
                    },
                    param: function(a) {
                        return a.children = [], a.isEmpty = !0, a
                    },
                    span: function(a) {
                        "Apple-style-span" == a.attributes["class"] && delete a.name
                    },
                    html: function(a) {
                        delete a.attributes.contenteditable, delete a.attributes["class"]
                    },
                    body: function(a) {
                        delete a.attributes.spellcheck, delete a.attributes.contenteditable
                    },
                    style: function(a) {
                        var b = a.children[0];
                        b && b.value && (b.value = CKEDITOR.tools.trim(b.value)), a.attributes.type || (a.attributes.type = "text/css")
                    },
                    title: function(a) {
                        var b = a.children[0];
                        !b && g(a, b = new CKEDITOR.htmlParser.text), b.value = a.attributes["data-cke-title"] || ""
                    },
                    input: i,
                    textarea: i
                },
                attributes: {
                    "class": function(a) {
                        return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || !1
                    }
                }
            };
        CKEDITOR.env.ie && (y.attributes.style = function(a) {
            return a.replace(/(^|;)([^\:]+)/g, function(a) {
                return a.toLowerCase()
            })
        });
        var z = /<(a|area|img|input|source)\b([^>]*)>/gi,
            A = /([\w-]+)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
            B = /^(href|src|name)$/i,
            C = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
            D = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi,
            E = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
            F = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
            G = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi,
            H = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    }(), CKEDITOR.htmlParser.element = function(a, b) {
        this.name = a, this.attributes = b || {}, this.children = [];
        var c = a || "",
            d = c.match(/^cke:(.*)/);
        d && (c = d[1]), c = !!(CKEDITOR.dtd.$nonBodyContent[c] || CKEDITOR.dtd.$block[c] || CKEDITOR.dtd.$listItem[c] || CKEDITOR.dtd.$tableContent[c] || CKEDITOR.dtd.$nonEditable[c] || "br" == c), this.isEmpty = !!CKEDITOR.dtd.$empty[a], this.isUnknown = !CKEDITOR.dtd[a], this._ = {
            isBlockLike: c,
            hasInlineStarted: this.isEmpty || !c
        }
    }, CKEDITOR.htmlParser.cssStyle = function(a) {
        var b = {};
        return ((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function(a, c, d) {
            "font-family" == c && (d = d.replace(/["']/g, "")), b[c.toLowerCase()] = d
        }), {
            rules: b,
            populate: function(a) {
                var b = this.toString();
                b && (a instanceof CKEDITOR.dom.element ? a.setAttribute("style", b) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = b : a.style = b)
            },
            toString: function() {
                var a, c = [];
                for (a in b) b[a] && c.push(a, ":", b[a], ";");
                return c.join("")
            }
        }
    }, function() {
        function a(a) {
            return function(b) {
                return b.type == CKEDITOR.NODE_ELEMENT && ("string" == typeof a ? b.name == a : b.name in a)
            }
        }
        var b = function(a, b) {
                return a = a[0], b = b[0], b > a ? -1 : a > b ? 1 : 0
            },
            c = CKEDITOR.htmlParser.fragment.prototype;
        CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_ELEMENT,
            add: c.add,
            clone: function() {
                return new CKEDITOR.htmlParser.element(this.name, this.attributes)
            },
            filter: function(a, b) {
                var c, d, e = this,
                    b = e.getFilterContext(b);
                if (b.off) return !0;
                for (e.parent || a.onRoot(b, e);;) {
                    if (c = e.name, !(d = a.onElementName(b, c))) return this.remove(), !1;
                    if (e.name = d, !(e = a.onElement(b, e))) return this.remove(), !1;
                    if (e !== this) return this.replaceWith(e), !1;
                    if (e.name == c) break;
                    if (e.type != CKEDITOR.NODE_ELEMENT) return this.replaceWith(e), !1;
                    if (!e.name) return this.replaceWithChildren(), !1
                }
                c = e.attributes;
                var f, g;
                for (f in c) {
                    for (g = f, d = c[f];;) {
                        if (!(g = a.onAttributeName(b, f))) {
                            delete c[f];
                            break
                        }
                        if (g == f) break;
                        delete c[f], f = g
                    }
                    g && ((d = a.onAttribute(b, e, g, d)) === !1 ? delete c[g] : c[g] = d)
                }
                return e.isEmpty || this.filterChildren(a, !1, b), !0
            },
            filterChildren: c.filterChildren,
            writeHtml: function(a, c) {
                c && this.filter(c);
                var d, e, f = this.name,
                    g = [],
                    h = this.attributes;
                a.openTag(f, h);
                for (d in h) g.push([d, h[d]]);
                for (a.sortAttributes && g.sort(b), d = 0, e = g.length; e > d; d++) h = g[d], a.attribute(h[0], h[1]);
                a.openTagClose(f, this.isEmpty), this.writeChildrenHtml(a), this.isEmpty || a.closeTag(f)
            },
            writeChildrenHtml: c.writeChildrenHtml,
            replaceWithChildren: function() {
                for (var a = this.children, b = a.length; b;) a[--b].insertAfter(this);
                this.remove()
            },
            forEach: c.forEach,
            getFirst: function(b) {
                if (!b) return this.children.length ? this.children[0] : null;
                "function" != typeof b && (b = a(b));
                for (var c = 0, d = this.children.length; d > c; ++c)
                    if (b(this.children[c])) return this.children[c];
                return null
            },
            getHtml: function() {
                var a = new CKEDITOR.htmlParser.basicWriter;
                return this.writeChildrenHtml(a), a.getHtml()
            },
            setHtml: function(a) {
                for (var a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children, b = 0, c = a.length; c > b; ++b) a[b].parent = this
            },
            getOuterHtml: function() {
                var a = new CKEDITOR.htmlParser.basicWriter;
                return this.writeHtml(a), a.getHtml()
            },
            split: function(a) {
                for (var b = this.children.splice(a, this.children.length - a), c = this.clone(), d = 0; d < b.length; ++d) b[d].parent = c;
                return c.children = b, b[0] && (b[0].previous = null), a > 0 && (this.children[a - 1].next = null), this.parent.add(c, this.getIndex() + 1), c
            },
            addClass: function(a) {
                if (!this.hasClass(a)) {
                    var b = this.attributes["class"] || "";
                    this.attributes["class"] = b + (b ? " " : "") + a
                }
            },
            removeClass: function(a) {
                var b = this.attributes["class"];
                b && ((b = CKEDITOR.tools.trim(b.replace(RegExp("(?:\\s+|^)" + a + "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"])
            },
            hasClass: function(a) {
                var b = this.attributes["class"];
                return b ? RegExp("(?:^|\\s)" + a + "(?=\\s|$)").test(b) : !1
            },
            getFilterContext: function(a) {
                var b = [];
                if (a || (a = {
                        off: !1,
                        nonEditable: !1,
                        nestedEditable: !1
                    }), !a.off && "off" == this.attributes["data-cke-processor"] && b.push("off", !0), a.nonEditable || "false" != this.attributes.contenteditable ? a.nonEditable && !a.nestedEditable && "true" == this.attributes.contenteditable && b.push("nestedEditable", !0) : b.push("nonEditable", !0), b.length)
                    for (var a = CKEDITOR.tools.copy(a), c = 0; c < b.length; c += 2) a[b[c]] = b[c + 1];
                return a
            }
        }, !0)
    }(), function() {
        var a = {},
            b = /{([^}]+)}/g,
            c = /([\\'])/g,
            d = /\n/g,
            e = /\r/g;
        CKEDITOR.template = function(f) {
            if (a[f]) this.output = a[f];
            else {
                var g = f.replace(c, "\\$1").replace(d, "\\n").replace(e, "\\r").replace(b, function(a, b) {
                    return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
                });
                this.output = a[f] = Function("data", "buffer", "return buffer?buffer.push('" + g + "'):['" + g + "'].join('');")
            }
        }
    }(), delete CKEDITOR.loadFullCore, CKEDITOR.instances = {}, CKEDITOR.document = new CKEDITOR.dom.document(document), CKEDITOR.add = function(a) {
        CKEDITOR.instances[a.name] = a, a.on("focus", function() {
            CKEDITOR.currentInstance != a && (CKEDITOR.currentInstance = a, CKEDITOR.fire("currentInstance"))
        }), a.on("blur", function() {
            CKEDITOR.currentInstance == a && (CKEDITOR.currentInstance = null, CKEDITOR.fire("currentInstance"))
        }), CKEDITOR.fire("instance", null, a)
    }, CKEDITOR.remove = function(a) {
        delete CKEDITOR.instances[a.name]
    }, function() {
        var a = {};
        CKEDITOR.addTemplate = function(b, c) {
            var d = a[b];
            return d ? d : (d = {
                name: b,
                source: c
            }, CKEDITOR.fire("template", d), a[b] = new CKEDITOR.template(d.source))
        }, CKEDITOR.getTemplate = function(b) {
            return a[b]
        }
    }(), function() {
        var a = [];
        CKEDITOR.addCss = function(b) {
            a.push(b)
        }, CKEDITOR.getCss = function() {
            return a.join("\n")
        }
    }(), CKEDITOR.on("instanceDestroyed", function() {
        CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
    }), CKEDITOR.TRISTATE_ON = 1, CKEDITOR.TRISTATE_OFF = 2, CKEDITOR.TRISTATE_DISABLED = 0, function() {
        CKEDITOR.inline = function(a, b) {
            if (!CKEDITOR.env.isCompatible) return null;
            if (a = CKEDITOR.dom.element.get(a), a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var c = new CKEDITOR.editor(b, a, CKEDITOR.ELEMENT_MODE_INLINE),
                d = a.is("textarea") ? a : null;
            return d ? (c.setData(d.getValue(), null, !0), a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!c.readOnly + '" class="cke_textarea_inline">' + d.getValue() + "</div>", CKEDITOR.document), a.insertAfter(d), d.hide(), d.$.form && c._attachToForm()) : c.setData(a.getHtml(), null, !0), c.on("loaded", function() {
                c.fire("uiReady"), c.editable(a), c.container = a, c.setData(c.getData(1)), c.resetDirty(), c.fire("contentDom"), c.mode = "wysiwyg", c.fire("mode"), c.status = "ready", c.fireOnce("instanceReady"), CKEDITOR.fire("instanceReady", null, c)
            }, null, null, 1e4), c.on("destroy", function() {
                d && (c.container.clearCustomData(), c.container.remove(), d.show()), c.element.clearCustomData(), delete c.element
            }), c
        }, CKEDITOR.inlineAll = function() {
            var a, b, c;
            for (c in CKEDITOR.dtd.$editable)
                for (var d = CKEDITOR.document.getElementsByTag(c), e = 0, f = d.count(); f > e; e++) a = d.getItem(e), "true" == a.getAttribute("contenteditable") && (b = {
                    element: a,
                    config: {}
                }, CKEDITOR.fire("inline", b) !== !1 && CKEDITOR.inline(a, b.config))
        }, CKEDITOR.domReady(function() {
            !CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
        })
    }(), CKEDITOR.replaceClass = "ckeditor", function() {
        function a(a, d, e, f) {
            if (!CKEDITOR.env.isCompatible) return null;
            if (a = CKEDITOR.dom.element.get(a), a.getEditor()) throw 'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var g = new CKEDITOR.editor(d, a, f);
            return f == CKEDITOR.ELEMENT_MODE_REPLACE && (a.setStyle("visibility", "hidden"), g._.required = a.hasAttribute("required"), a.removeAttribute("required")), e && g.setData(e, null, !0), g.on("loaded", function() {
                c(g), f == CKEDITOR.ELEMENT_MODE_REPLACE && g.config.autoUpdateElement && a.$.form && g._attachToForm(), g.setMode(g.config.startupMode, function() {
                    g.resetDirty(), g.status = "ready", g.fireOnce("instanceReady"), CKEDITOR.fire("instanceReady", null, g)
                })
            }), g.on("destroy", b), g
        }

        function b() {
            var a = this.container,
                b = this.element;
            a && (a.clearCustomData(), a.remove()), b && (b.clearCustomData(), this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (b.show(), this._.required && b.setAttribute("required", "required")), delete this.element)
        }

        function c(a) {
            var b = a.name,
                c = a.element,
                d = a.elementMode,
                e = a.fire("uiSpace", {
                    space: "top",
                    html: ""
                }).html,
                f = a.fire("uiSpace", {
                    space: "bottom",
                    html: ""
                }).html,
                g = new CKEDITOR.template('<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application"' + (a.title ? ' aria-labelledby="cke_{name}_arialbl"' : "") + ">" + (a.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : "") + '<{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'),
                b = CKEDITOR.dom.element.createFromHtml(g.output({
                    id: a.id,
                    name: b,
                    langDir: a.lang.dir,
                    langCode: a.langCode,
                    voiceLabel: a.title,
                    topHtml: e ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + e + "</span>" : "",
                    contentId: a.ui.spaceId("contents"),
                    bottomHtml: f ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + f + "</span>" : "",
                    outerEl: CKEDITOR.env.ie ? "span" : "div"
                }));
            d == CKEDITOR.ELEMENT_MODE_REPLACE ? (c.hide(), b.insertAfter(c)) : c.append(b), a.container = b, e && a.ui.space("top").unselectable(), f && a.ui.space("bottom").unselectable(), c = a.config.width, d = a.config.height, c && b.setStyle("width", CKEDITOR.tools.cssLength(c)), d && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(d)), b.disableContextMenu(), CKEDITOR.env.webkit && b.on("focus", function() {
                a.focus()
            }), a.fireOnce("uiReady")
        }
        CKEDITOR.replace = function(b, c) {
            return a(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE)
        }, CKEDITOR.appendTo = function(b, c, d) {
            return a(b, c, d, CKEDITOR.ELEMENT_MODE_APPENDTO)
        }, CKEDITOR.replaceAll = function() {
            for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
                var c = null,
                    d = a[b];
                if (d.name || d.id) {
                    if ("string" == typeof arguments[0]) {
                        if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(d.className)) continue
                    } else if ("function" == typeof arguments[0] && (c = {}, arguments[0](d, c) === !1)) continue;
                    this.replace(d, c)
                }
            }
        }, CKEDITOR.editor.prototype.addMode = function(a, b) {
            (this._.modes || (this._.modes = {}))[a] = b
        }, CKEDITOR.editor.prototype.setMode = function(a, b) {
            var c = this,
                d = this._.modes;
            if (a != c.mode && d && d[a]) {
                if (c.fire("beforeSetMode", a), c.mode) {
                    var e, f = c.checkDirty(),
                        d = c._.previousModeData,
                        g = 0;
                    c.fire("beforeModeUnload"), c.editable(0), c._.previousMode = c.mode, c._.previousModeData = e = c.getData(1), "source" == c.mode && d == e && (c.fire("lockSnapshot", {
                        forceUpdate: !0
                    }), g = 1), c.ui.space("contents").setHtml(""), c.mode = ""
                } else c._.previousModeData = c.getData(1);
                this._.modes[a](function() {
                    c.mode = a, void 0 !== f && !f && c.resetDirty(), g ? c.fire("unlockSnapshot") : "wysiwyg" == a && c.fire("saveSnapshot"), setTimeout(function() {
                        c.fire("mode"), b && b.call(c)
                    }, 0)
                })
            }
        }, CKEDITOR.editor.prototype.resize = function(a, b, c, d) {
            var e = this.container,
                f = this.ui.space("contents"),
                g = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement,
                d = d ? this.container.getFirst(function(a) {
                    return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
                }) : e;
            d.setSize("width", a, !0), g && (g.style.width = "1%"), f.setStyle("height", Math.max(b - (c ? 0 : (d.$.offsetHeight || 0) - (f.$.clientHeight || 0)), 0) + "px"), g && (g.style.width = "100%"), this.fire("resize")
        }, CKEDITOR.editor.prototype.getResizable = function(a) {
            return a ? this.ui.space("contents") : this.container
        }, CKEDITOR.domReady(function() {
            CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
        })
    }(), CKEDITOR.config.startupMode = "wysiwyg", function() {
        function a(a) {
            var c, e = a.editor,
                f = a.data.path,
                h = f.blockLimit,
                i = a.data.selection,
                j = i.getRanges()[0];
            (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) && (i = b(i, f)) && (i.appendBogus(), c = CKEDITOR.env.ie), g(e, f.block, h) && j.collapsed && !j.getCommonAncestor().isReadOnly() && (f = j.clone(), f.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS), h = new CKEDITOR.dom.walker(f), h.guard = function(a) {
                return !d(a) || a.type == CKEDITOR.NODE_COMMENT || a.isReadOnly()
            }, (!h.checkForward() || f.checkStartOfBlock() && f.checkEndOfBlock()) && (e = j.fixBlock(!0, e.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p"), CKEDITOR.env.needsBrFiller || (e = e.getFirst(d)) && e.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(e.getText()).match(/^(?:&nbsp;|\xa0)$/) && e.remove(), c = 1, a.cancel())), c && j.select()
        }

        function b(a, b) {
            if (a.isFake) return 0;
            var c = b.block || b.blockLimit,
                e = c && c.getLast(d);
            return !c || !c.isBlockBoundary() || e && e.type == CKEDITOR.NODE_ELEMENT && e.isBlockBoundary() || c.is("pre") || c.getBogus() ? void 0 : c
        }

        function c(a) {
            var b = a.data.getTarget();
            b.is("input") && (b = b.getAttribute("type"), ("submit" == b || "reset" == b) && a.data.preventDefault())
        }

        function d(a) {
            return m(a) && n(a)
        }

        function e(a, b) {
            return function(c) {
                var d = CKEDITOR.dom.element.get(c.data.$.toElement || c.data.$.fromElement || c.data.$.relatedTarget);
                (!d || !b.equals(d) && !b.contains(d)) && a.call(this, c)
            }
        }

        function f(a) {
            function b(a) {
                return function(b, e) {
                    return e && b.type == CKEDITOR.NODE_ELEMENT && b.is(f) && (c = b), e || !d(b) || a && k(b) ? void 0 : !1
                }
            }
            var c, e = a.getRanges()[0],
                a = a.root,
                f = {
                    table: 1,
                    ul: 1,
                    ol: 1,
                    dl: 1
                };
            if (e.startPath().contains(f)) {
                var g = e.clone();
                if (g.collapse(1), g.setStartAt(a, CKEDITOR.POSITION_AFTER_START), a = new CKEDITOR.dom.walker(g), a.guard = b(), a.checkBackward(), c) return g = e.clone(), g.collapse(), g.setEndAt(c, CKEDITOR.POSITION_AFTER_END), a = new CKEDITOR.dom.walker(g), a.guard = b(!0), c = !1, a.checkForward(), c
            }
            return null
        }

        function g(a, b, c) {
            return a.config.autoParagraph !== !1 && a.activeEnterMode != CKEDITOR.ENTER_BR && a.editable().equals(c) && !b || b && "true" == b.getAttribute("contenteditable")
        }

        function h(a) {
            a.editor.focus(), a.editor.fire("saveSnapshot")
        }

        function i(a) {
            var b = a.editor;
            b.getSelection().scrollIntoView(), setTimeout(function() {
                b.fire("saveSnapshot")
            }, 0)
        }

        function j(a, b, c) {
            for (var d = a.getCommonAncestor(b), b = a = c ? b : a;
                (a = a.getParent()) && !d.equals(a) && 1 == a.getChildCount();) b = a;
            b.remove()
        }
        CKEDITOR.editable = CKEDITOR.tools.createClass({
            base: CKEDITOR.dom.element,
            $: function(a, b) {
                this.base(b.$ || b), this.editor = a, this.status = "unloaded", this.hasFocus = !1, this.setup()
            },
            proto: {
                focus: function() {
                    var a;
                    if (CKEDITOR.env.webkit && !this.hasFocus && (a = this.editor._.previousActive || this.getDocument().getActive(), this.contains(a))) return void a.focus();
                    try {
                        this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" : "focus"]()
                    } catch (b) {
                        if (!CKEDITOR.env.ie) throw b
                    }
                    CKEDITOR.env.safari && !this.isInline() && (a = CKEDITOR.document.getActive(), a.equals(this.getWindow().getFrame()) || this.getWindow().focus())
                },
                on: function(a, b) {
                    var c = Array.prototype.slice.call(arguments, 0);
                    return CKEDITOR.env.ie && /^focus|blur$/.exec(a) && (a = "focus" == a ? "focusin" : "focusout", b = e(b, this), c[0] = a, c[1] = b), CKEDITOR.dom.element.prototype.on.apply(this, c)
                },
                attachListener: function(a) {
                    !this._.listeners && (this._.listeners = []);
                    var b = Array.prototype.slice.call(arguments, 1),
                        b = a.on.apply(a, b);
                    return this._.listeners.push(b), b
                },
                clearListeners: function() {
                    var a = this._.listeners;
                    try {
                        for (; a.length;) a.pop().removeListener()
                    } catch (b) {}
                },
                restoreAttrs: function() {
                    var a, b, c = this._.attrChanges;
                    for (b in c) c.hasOwnProperty(b) && (a = c[b], null !== a ? this.setAttribute(b, a) : this.removeAttribute(b))
                },
                attachClass: function(a) {
                    var b = this.getCustomData("classes");
                    this.hasClass(a) || (!b && (b = []), b.push(a), this.setCustomData("classes", b), this.addClass(a))
                },
                changeAttr: function(a, b) {
                    var c = this.getAttribute(a);
                    b !== c && (!this._.attrChanges && (this._.attrChanges = {}), a in this._.attrChanges || (this._.attrChanges[a] = c), this.setAttribute(a, b))
                },
                insertHtml: function(a, b) {
                    h(this), o(this, b || "html", a)
                },
                insertText: function(a) {
                    h(this);
                    var b = this.editor,
                        c = b.getSelection().getStartElement().hasAscendant("pre", !0) ? CKEDITOR.ENTER_BR : b.activeEnterMode,
                        b = c == CKEDITOR.ENTER_BR,
                        d = CKEDITOR.tools,
                        a = d.htmlEncode(a.replace(/\r\n/g, "\n")),
                        a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"),
                        c = c == CKEDITOR.ENTER_P ? "p" : "div";
                    if (!b) {
                        var e = /\n{2}/g;
                        if (e.test(a)) var f = "<" + c + ">",
                            g = "</" + c + ">",
                            a = f + a.replace(e, function() {
                                return g + f
                            }) + g
                    }
                    a = a.replace(/\n/g, "<br>"), b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function(a) {
                        return d.repeat(a, 2)
                    })), a = a.replace(/^ | $/g, "&nbsp;"), a = a.replace(/(>|\s) /g, function(a, b) {
                        return b + "&nbsp;"
                    }).replace(/ (?=<)/g, "&nbsp;"), o(this, "text", a)
                },
                insertElement: function(a, b) {
                    b ? this.insertElementIntoRange(a, b) : this.insertElementIntoSelection(a)
                },
                insertElementIntoRange: function(a, b) {
                    var c = this.editor,
                        d = c.config.enterMode,
                        e = a.getName(),
                        f = CKEDITOR.dtd.$block[e];
                    if (b.checkReadOnly()) return !1;
                    b.deleteContents(1), b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({
                        tr: 1,
                        table: 1,
                        tbody: 1,
                        thead: 1,
                        tfoot: 1
                    }) && p(b);
                    var g, h;
                    if (f)
                        for (;
                            (g = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[g.getName()]) && (!h || !h[e]);) g.getName() in CKEDITOR.dtd.span ? b.splitElement(g) : b.checkStartOfBlock() && b.checkEndOfBlock() ? (b.setStartBefore(g), b.collapse(!0), g.remove()) : b.splitBlock(d == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
                    return b.insertNode(a), !0
                },
                insertElementIntoSelection: function(a) {
                    h(this);
                    var b = this.editor,
                        c = b.activeEnterMode,
                        b = b.getSelection(),
                        e = b.getRanges()[0],
                        f = a.getName(),
                        f = CKEDITOR.dtd.$block[f];
                    this.insertElementIntoRange(a, e) && (e.moveToPosition(a, CKEDITOR.POSITION_AFTER_END), f && ((f = a.getNext(function(a) {
                        return d(a) && !k(a)
                    })) && f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block) ? f.getDtd()["#"] ? e.moveToElementEditStart(f) : e.moveToElementEditEnd(a) : f || c == CKEDITOR.ENTER_BR || (f = e.fixBlock(!0, c == CKEDITOR.ENTER_DIV ? "div" : "p"), e.moveToElementEditStart(f)))), b.selectRanges([e]), i(this)
                },
                setData: function(a, b) {
                    b || (a = this.editor.dataProcessor.toHtml(a)), this.setHtml(a), "unloaded" == this.status && (this.status = "ready"), this.editor.fire("dataReady")
                },
                getData: function(a) {
                    var b = this.getHtml();
                    return a || (b = this.editor.dataProcessor.toDataFormat(b)), b
                },
                setReadOnly: function(a) {
                    this.setAttribute("contenteditable", !a)
                },
                detach: function() {
                    this.removeClass("cke_editable"), this.status = "detached";
                    var a = this.editor;
                    this._.detach(), delete a.document, delete a.window
                },
                isInline: function() {
                    return this.getDocument().equals(CKEDITOR.document)
                },
                setup: function() {
                    var a = this.editor;
                    if (this.attachListener(a, "beforeGetData", function() {
                            var b = this.getData();
                            this.is("textarea") || a.config.ignoreEmptyParagraph !== !1 && (b = b.replace(l, function(a, b) {
                                return b
                            })), a.setData(b, null, 1)
                        }, this), this.attachListener(a, "getSnapshot", function(a) {
                            a.data = this.getData(1)
                        }, this), this.attachListener(a, "afterSetData", function() {
                            this.setData(a.getData(1))
                        }, this), this.attachListener(a, "loadSnapshot", function(a) {
                            this.setData(a.data, 1)
                        }, this), this.attachListener(a, "beforeFocus", function() {
                            var b = a.getSelection();
                            (b = b && b.getNative()) && "Control" == b.type || this.focus()
                        }, this), this.attachListener(a, "insertHtml", function(a) {
                            this.insertHtml(a.data.dataValue, a.data.mode)
                        }, this), this.attachListener(a, "insertElement", function(a) {
                            this.insertElement(a.data)
                        }, this), this.attachListener(a, "insertText", function(a) {
                            this.insertText(a.data)
                        }, this), this.setReadOnly(a.readOnly), this.attachClass("cke_editable"), this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" : a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : ""), this.attachClass("cke_contents_" + a.config.contentsLangDirection), a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly, a.keystrokeHandler.attach(this), this.on("blur", function() {
                            this.hasFocus = !1
                        }, null, null, -1), this.on("focus", function() {
                            this.hasFocus = !0
                        }, null, null, -1), a.focusManager.add(this), this.equals(CKEDITOR.document.getActive()) && (this.hasFocus = !0, a.once("contentDom", function() {
                            a.focusManager.focus()
                        })), this.isInline() && this.changeAttr("tabindex", a.tabIndex), !this.is("textarea")) {
                        a.document = this.getDocument(), a.window = this.getWindow();
                        var b = a.document;
                        this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
                        var e = a.config.contentsLangDirection;
                        this.getDirection(1) != e && this.changeAttr("dir", e);
                        var g = CKEDITOR.getCss();
                        g && (e = b.getHead(), e.getCustomData("stylesheet") || (g = b.appendStyleText(g), g = new CKEDITOR.dom.element(g.ownerNode || g.owningElement), e.setCustomData("stylesheet", g), g.data("cke-temp", 1))), e = b.getCustomData("stylesheet_ref") || 0, b.setCustomData("stylesheet_ref", e + 1), this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling), this.attachListener(this, "click", function(a) {
                            var a = a.data,
                                b = new CKEDITOR.dom.elementPath(a.getTarget(), this).contains("a");
                            b && 2 != a.$.button && b.isReadOnly() && a.preventDefault()
                        });
                        var h = {
                            8: 1,
                            46: 1
                        };
                        this.attachListener(a, "key", function(b) {
                            if (a.readOnly) return !0;
                            var c, d = b.data.domEvent.getKey();
                            if (d in h) {
                                var e, g, i, j, b = a.getSelection(),
                                    k = b.getRanges()[0],
                                    l = k.startPath(),
                                    d = 8 == d;
                                CKEDITOR.env.ie && CKEDITOR.env.version < 11 && (e = b.getSelectedElement()) || (e = f(b)) ? (a.fire("saveSnapshot"), k.moveToPosition(e, CKEDITOR.POSITION_BEFORE_START), e.remove(), k.select(), a.fire("saveSnapshot"), c = 1) : k.collapsed && ((g = l.block) && (j = g[d ? "getPrevious" : "getNext"](m)) && j.type == CKEDITOR.NODE_ELEMENT && j.is("table") && k[d ? "checkStartOfBlock" : "checkEndOfBlock"]() ? (a.fire("saveSnapshot"), k[d ? "checkEndOfBlock" : "checkStartOfBlock"]() && g.remove(), k["moveToElementEdit" + (d ? "End" : "Start")](j), k.select(), a.fire("saveSnapshot"), c = 1) : l.blockLimit && l.blockLimit.is("td") && (i = l.blockLimit.getAscendant("table")) && k.checkBoundaryOfElement(i, d ? CKEDITOR.START : CKEDITOR.END) && (j = i[d ? "getPrevious" : "getNext"](m)) ? (a.fire("saveSnapshot"), k["moveToElementEdit" + (d ? "End" : "Start")](j), k.checkStartOfBlock() && k.checkEndOfBlock() ? j.remove() : k.select(), a.fire("saveSnapshot"), c = 1) : (i = l.contains(["td", "th", "caption"])) && k.checkBoundaryOfElement(i, d ? CKEDITOR.START : CKEDITOR.END) && (c = 1))
                            }
                            return !c
                        }), a.blockless && CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller && this.attachListener(this, "keyup", function(b) {
                            b.data.getKeystroke() in h && !this.getFirst(d) && (this.appendBogus(), b = a.createRange(), b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START), b.select())
                        }), this.attachListener(this, "dblclick", function(b) {
                            return a.readOnly ? !1 : (b = {
                                element: b.data.getTarget()
                            }, void a.fire("doubleclick", b))
                        }), CKEDITOR.env.ie && this.attachListener(this, "click", c), CKEDITOR.env.ie || this.attachListener(this, "mousedown", function(b) {
                            var c = b.data.getTarget();
                            c.is("img", "hr", "input", "textarea", "select") && !c.isReadOnly() && (a.getSelection().selectElement(c), c.is("input", "textarea", "select") && b.data.preventDefault())
                        }), CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function(b) {
                            if (2 == b.data.$.button && (b = b.data.getTarget(), !b.getOuterHtml().replace(l, ""))) {
                                var c = a.createRange();
                                c.moveToElementEditStart(b), c.select(!0)
                            }
                        }), CKEDITOR.env.webkit && (this.attachListener(this, "click", function(a) {
                            a.data.getTarget().is("input", "select") && a.data.preventDefault()
                        }), this.attachListener(this, "mouseup", function(a) {
                            a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
                        })), CKEDITOR.env.webkit && this.attachListener(a, "key", function(b) {
                            if (b = b.data.domEvent.getKey(), b in h) {
                                var c = 8 == b,
                                    d = a.getSelection().getRanges()[0],
                                    b = d.startPath();
                                if (d.collapsed) {
                                    var e;
                                    a: {
                                        var f = b.block;
                                        if (f)
                                            if (d[c ? "checkStartOfBlock" : "checkEndOfBlock"]())
                                                if (d.moveToClosestEditablePosition(f, !c) && d.collapsed) {
                                                    if (d.startContainer.type == CKEDITOR.NODE_ELEMENT) {
                                                        var g = d.startContainer.getChild(d.startOffset - (c ? 1 : 0));
                                                        if (g && g.type == CKEDITOR.NODE_ELEMENT && g.is("hr")) {
                                                            a.fire("saveSnapshot"), g.remove(), e = !0;
                                                            break a
                                                        }
                                                    }
                                                    if ((d = d.startPath().block) && (!d || !d.contains(f))) {
                                                        a.fire("saveSnapshot");
                                                        var i;
                                                        (i = (c ? d : f).getBogus()) && i.remove(), e = a.getSelection(), i = e.createBookmarks(), (c ? f : d).moveChildren(c ? d : f, !1), b.lastElement.mergeSiblings(), j(f, d, !c), e.selectBookmarks(i), e = !0
                                                    }
                                                } else e = !1;
                                        else e = !1;
                                        else e = !1
                                    }
                                    if (!e) return
                                } else if (c = d, e = b.block, i = c.endPath().block, e && i && !e.equals(i) ? (a.fire("saveSnapshot"), (f = e.getBogus()) && f.remove(), c.deleteContents(), i.getParent() && (i.moveChildren(e, !1), b.lastElement.mergeSiblings(), j(e, i, !0)), c = a.getSelection().getRanges()[0], c.collapse(1), c.select(), b = !0) : b = !1, !b) return;
                                return a.getSelection().scrollIntoView(), a.fire("saveSnapshot"), !1
                            }
                        }, this, null, 100)
                    }
                }
            },
            _: {
                detach: function() {
                    this.editor.setData(this.editor.getData(), 0, 1), this.clearListeners(), this.restoreAttrs();
                    var a;
                    if (a = this.removeCustomData("classes"))
                        for (; a.length;) this.removeClass(a.pop());
                    if (!this.is("textarea")) {
                        a = this.getDocument();
                        var b = a.getHead();
                        if (b.getCustomData("stylesheet")) {
                            var c = a.getCustomData("stylesheet_ref");
                            --c ? a.setCustomData("stylesheet_ref", c) : (a.removeCustomData("stylesheet_ref"), b.removeCustomData("stylesheet").remove())
                        }
                    }
                    this.editor.fire("contentDomUnload"), delete this.editor
                }
            }
        }), CKEDITOR.editor.prototype.editable = function(a) {
            var b = this._.editable;
            return b && a ? 0 : (arguments.length && (b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null)), b)
        };
        var k = CKEDITOR.dom.walker.bogus(),
            l = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,
            m = CKEDITOR.dom.walker.whitespaces(!0),
            n = CKEDITOR.dom.walker.bookmark(!1, !0);
        CKEDITOR.on("instanceLoaded", function(b) {
            var c = b.editor;
            c.on("insertElement", function(a) {
                a = a.data, a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea")) && ("false" != a.getAttribute("contentEditable") && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1"), a.setAttribute("contentEditable", !1))
            }), c.on("selectionChange", function(b) {
                if (!c.readOnly) {
                    var d = c.getSelection();
                    d && !d.isLocked && (d = c.checkDirty(), c.fire("lockSnapshot"), a(b), c.fire("unlockSnapshot"), !d && c.resetDirty())
                }
            })
        }), CKEDITOR.on("instanceCreated", function(a) {
            var b = a.editor;
            b.on("mode", function() {
                var a = b.editable();
                if (a && a.isInline()) {
                    var c = b.title;
                    a.changeAttr("role", "textbox"), a.changeAttr("aria-label", c), c && a.changeAttr("title", c);
                    var d = b.fire("ariaEditorHelpLabel", {}).label;
                    if (d && (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents"))) {
                        var e = CKEDITOR.tools.getNextId(),
                            d = CKEDITOR.dom.element.createFromHtml('<span id="' + e + '" class="cke_voice_label">' + d + "</span>");
                        c.append(d), a.changeAttr("aria-describedby", e)
                    }
                }
            })
        }), CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
        var o = function() {
                function a(a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                }

                function b(c, d) {
                    var e, f, g, h, i = [],
                        k = d.range.startContainer;
                    e = d.range.startPath();
                    for (var k = j[k.getName()], l = 0, m = c.getChildren(), n = m.count(), o = -1, p = -1, q = 0, r = e.contains(j.$list); n > l; ++l) e = m.getItem(l), a(e) ? (g = e.getName(), r && g in CKEDITOR.dtd.$list ? i = i.concat(b(e, d)) : (h = !!k[g], "br" != g || !e.data("cke-eol") || l && l != n - 1 || (q = (f = l ? i[l - 1].node : m.getItem(l + 1)) && (!a(f) || !f.is("br")), f = f && a(f) && j.$block[f.getName()]), -1 == o && !h && (o = l), h || (p = l), i.push({
                        isElement: 1,
                        isLineBreak: q,
                        isBlock: e.isBlockBoundary(),
                        hasBlockSibling: f,
                        node: e,
                        name: g,
                        allowed: h
                    }), f = q = 0)) : i.push({
                        isElement: 0,
                        node: e,
                        allowed: 1
                    });
                    return o > -1 && (i[o].firstNotAllowed = 1), p > -1 && (i[p].lastNotAllowed = 1), i
                }

                function c(b, d) {
                    var e, f = [],
                        g = b.getChildren(),
                        h = g.count(),
                        i = 0,
                        k = j[d],
                        l = !b.is(j.$inline) || b.is("br");
                    for (l && f.push(" "); h > i; i++) e = g.getItem(i), a(e) && !e.is(k) ? f = f.concat(c(e, d)) : f.push(e);
                    return l && f.push(" "), f
                }

                function e(b) {
                    return b && a(b) && (b.is(j.$removeEmpty) || b.is("a") && !b.isBlockBoundary())
                }

                function f(b, c, d, e) {
                    var g, h, i = b.clone();
                    i.setEndAt(c, CKEDITOR.POSITION_BEFORE_END), (g = new CKEDITOR.dom.walker(i).next()) && a(g) && k[g.getName()] && (h = g.getPrevious()) && a(h) && !h.getParent().equals(b.startContainer) && d.contains(h) && e.contains(g) && g.isIdentical(h) && (g.moveChildren(h), g.remove(), f(b, c, d, e))
                }

                function h(b, c) {
                    function d(b, c) {
                        return c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br") ? (b.remove(), 1) : void 0
                    }
                    var e = c.endContainer.getChild(c.endOffset),
                        f = c.endContainer.getChild(c.endOffset - 1);
                    e && d(e, b[b.length - 1]), f && d(f, b[0]) && (c.setEnd(c.endContainer, c.endOffset - 1), c.collapse())
                }
                var j = CKEDITOR.dtd,
                    k = {
                        p: 1,
                        div: 1,
                        h1: 1,
                        h2: 1,
                        h3: 1,
                        h4: 1,
                        h5: 1,
                        h6: 1,
                        ul: 1,
                        ol: 1,
                        li: 1,
                        pre: 1,
                        dl: 1,
                        blockquote: 1
                    },
                    l = {
                        p: 1,
                        div: 1,
                        h1: 1,
                        h2: 1,
                        h3: 1,
                        h4: 1,
                        h5: 1,
                        h6: 1
                    },
                    m = CKEDITOR.tools.extend({}, j.$inline);
                return delete m.br,
                    function(k, n, o) {
                        var p = k.editor,
                            q = p.getSelection().getRanges()[0],
                            r = !1;
                        if ("unfiltered_html" == n && (n = "html", r = !0), !q.checkReadOnly()) {
                            var s, t, u, v, w = new CKEDITOR.dom.elementPath(q.startContainer, q.root).blockLimit || q.root,
                                n = {
                                    type: n,
                                    dontFilter: r,
                                    editable: k,
                                    editor: p,
                                    range: q,
                                    blockLimit: w,
                                    mergeCandidates: [],
                                    zombies: []
                                },
                                p = n.range,
                                r = n.mergeCandidates;
                            if ("text" == n.type && p.shrink(CKEDITOR.SHRINK_ELEMENT, !0, !1) && (s = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", p.document), p.insertNode(s), p.setStartAfter(s)), t = new CKEDITOR.dom.elementPath(p.startContainer), n.endPath = u = new CKEDITOR.dom.elementPath(p.endContainer), !p.collapsed) {
                                var w = u.block || u.blockLimit,
                                    x = p.getCommonAncestor();
                                w && !w.equals(x) && !w.contains(x) && p.checkEndOfBlock() && n.zombies.push(w), p.deleteContents()
                            }
                            for (;
                                (v = a(p.startContainer) && p.startContainer.getChild(p.startOffset - 1)) && a(v) && v.isBlockBoundary() && t.contains(v);) p.moveToPosition(v, CKEDITOR.POSITION_BEFORE_END);
                            for (f(p, n.blockLimit, t, u), s && (p.setEndBefore(s), p.collapse(), s.remove()), s = p.startPath(), (w = s.contains(e, !1, 1)) && (p.splitElement(w), n.inlineStylesRoot = w, n.inlineStylesPeak = s.lastElement), s = p.createBookmark(), (w = s.startNode.getPrevious(d)) && a(w) && e(w) && r.push(w), (w = s.startNode.getNext(d)) && a(w) && e(w) && r.push(w), w = s.startNode;
                                (w = w.getParent()) && e(w);) r.push(w);
                            if (p.moveToBookmark(s), s = o) {
                                if (s = n.range, "text" == n.type && n.inlineStylesRoot) {
                                    for (v = n.inlineStylesPeak, p = v.getDocument().createText("{cke-peak}"), r = n.inlineStylesRoot.getParent(); !v.equals(r);) p = p.appendTo(v.clone()), v = v.getParent();
                                    o = p.getOuterHtml().split("{cke-peak}").join(o)
                                }
                                if (v = n.blockLimit.getName(), /^\s+|\s+$/.test(o) && "span" in CKEDITOR.dtd[v]) var y = '<span data-cke-marker="1">&nbsp;</span>',
                                    o = y + o + y;
                                if (o = n.editor.dataProcessor.toHtml(o, {
                                        context: null,
                                        fixForBody: !1,
                                        dontFilter: n.dontFilter,
                                        filter: n.editor.activeFilter,
                                        enterMode: n.editor.activeEnterMode
                                    }), v = s.document.createElement("body"), v.setHtml(o), y && (v.getFirst().remove(), v.getLast().remove()), (y = s.startPath().block) && (1 != y.getChildCount() || !y.getBogus())) a: {
                                    var z;
                                    if (1 == v.getChildCount() && a(z = v.getFirst()) && z.is(l)) {
                                        for (y = z.getElementsByTag("*"), s = 0, r = y.count(); r > s; s++)
                                            if (p = y.getItem(s), !p.is(m)) break a;
                                        z.moveChildren(z.getParent(1)), z.remove()
                                    }
                                }
                                n.dataWrapper = v, s = o
                            }
                            if (s) {
                                z = n.range;
                                var A, y = z.document,
                                    o = n.blockLimit;
                                s = 0;
                                var B;
                                v = [];
                                var C, D, E, F, r = p = 0;
                                t = z.startContainer;
                                var G, w = n.endPath.elements[0];
                                for (u = w.getPosition(t), x = !(!w.getCommonAncestor(t) || u == CKEDITOR.POSITION_IDENTICAL || u & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED), t = b(n.dataWrapper, n), h(t, z); s < t.length; s++) {
                                    if (u = t[s], A = u.isLineBreak) {
                                        A = z, E = o;
                                        var H = void 0,
                                            I = void 0;
                                        u.hasBlockSibling ? A = 1 : (H = A.startContainer.getAscendant(j.$block, 1), H && H.is({
                                            div: 1,
                                            p: 1
                                        }) ? (I = H.getPosition(E), I == CKEDITOR.POSITION_IDENTICAL || I == CKEDITOR.POSITION_CONTAINS ? A = 0 : (E = A.splitElement(H), A.moveToPosition(E, CKEDITOR.POSITION_AFTER_START), A = 1)) : A = 0)
                                    }
                                    if (A) r = s > 0;
                                    else {
                                        if (A = z.startPath(), !u.isBlock && g(n.editor, A.block, A.blockLimit) && (D = n.editor.activeEnterMode != CKEDITOR.ENTER_BR && n.editor.config.autoParagraph !== !1 ? n.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : !1) && (D = y.createElement(D), D.appendBogus(), z.insertNode(D), CKEDITOR.env.needsBrFiller && (B = D.getBogus()) && B.remove(), z.moveToPosition(D, CKEDITOR.POSITION_BEFORE_END)), (A = z.startPath().block) && !A.equals(C) && ((B = A.getBogus()) && (B.remove(), v.push(A)), C = A), u.firstNotAllowed && (p = 1), p && u.isElement) {
                                            for (A = z.startContainer, E = null; A && !j[A.getName()][u.name];) {
                                                if (A.equals(o)) {
                                                    A = null;
                                                    break
                                                }
                                                E = A, A = A.getParent()
                                            }
                                            if (A) E && (F = z.splitElement(E), n.zombies.push(F), n.zombies.push(E));
                                            else {
                                                E = o.getName(), G = !s, A = s == t.length - 1, E = c(u.node, E);
                                                for (var H = [], I = E.length, J = 0, K = void 0, L = 0, M = -1; I > J; J++) K = E[J], " " == K ? (L || G && !J || (H.push(new CKEDITOR.dom.text(" ")), M = H.length), L = 1) : (H.push(K), L = 0);
                                                A && M == H.length && H.pop(), G = H
                                            }
                                        }
                                        if (G) {
                                            for (; A = G.pop();) z.insertNode(A);
                                            G = 0
                                        } else z.insertNode(u.node);
                                        u.lastNotAllowed && s < t.length - 1 && ((F = x ? w : F) && z.setEndAt(F, CKEDITOR.POSITION_AFTER_START), p = 0), z.collapse()
                                    }
                                }
                                n.dontMoveCaret = r, n.bogusNeededBlocks = v
                            }
                            B = n.range;
                            var N;
                            for (F = n.bogusNeededBlocks, G = B.createBookmark(); C = n.zombies.pop();) C.getParent() && (D = B.clone(), D.moveToElementEditStart(C), D.removeEmptyBlocksAtEnd());
                            if (F)
                                for (; C = F.pop();) CKEDITOR.env.needsBrFiller ? C.appendBogus() : C.append(B.document.createText(" "));
                            for (; C = n.mergeCandidates.pop();) C.mergeSiblings();
                            if (B.moveToBookmark(G), !n.dontMoveCaret) {
                                for (C = a(B.startContainer) && B.startContainer.getChild(B.startOffset - 1); C && a(C) && !C.is(j.$empty);) {
                                    if (C.isBlockBoundary()) B.moveToPosition(C, CKEDITOR.POSITION_BEFORE_END);
                                    else {
                                        if (e(C) && C.getHtml().match(/(\s|&nbsp;)$/g)) {
                                            N = null;
                                            break
                                        }
                                        N = B.clone(), N.moveToPosition(C, CKEDITOR.POSITION_BEFORE_END)
                                    }
                                    C = C.getLast(d)
                                }
                                N && B.moveToRange(N)
                            }
                            q.select(), i(k)
                        }
                    }
            }(),
            p = function() {
                function a(a) {
                    return a = new CKEDITOR.dom.walker(a), a.guard = function(a, b) {
                        return b ? !1 : a.type == CKEDITOR.NODE_ELEMENT ? a.is(CKEDITOR.dtd.$tableContent) : void 0
                    }, a.evaluator = function(a) {
                        return a.type == CKEDITOR.NODE_ELEMENT
                    }, a
                }

                function b(a, b, c) {
                    return b = a.getDocument().createElement(b), a.append(b, c), b
                }

                function c(a) {
                    var b, c = a.count();
                    for (c; c-- > 0;) b = a.getItem(c), CKEDITOR.tools.trim(b.getHtml()) || (b.appendBogus(), CKEDITOR.env.ie && CKEDITOR.env.version < 9 && b.getChildCount() && b.getFirst().remove())
                }
                return function(d) {
                    var e = d.startContainer,
                        f = e.getAscendant("table", 1),
                        g = !1;
                    c(f.getElementsByTag("td")), c(f.getElementsByTag("th")), f = d.clone(), f.setStart(e, 0), f = a(f).lastBackward(), f || (f = d.clone(), f.setEndAt(e, CKEDITOR.POSITION_BEFORE_END), f = a(f).lastForward(), g = !0), f || (f = e), f.is("table") ? (d.setStartAt(f, CKEDITOR.POSITION_BEFORE_START), d.collapse(!0), f.remove()) : (f.is({
                        tbody: 1,
                        thead: 1,
                        tfoot: 1
                    }) && (f = b(f, "tr", g)), f.is("tr") && (f = b(f, f.getParent().is("thead") ? "th" : "td", g)), (e = f.getBogus()) && e.remove(), d.moveToPosition(f, g ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END))
                }
            }()
    }(), function() {
        function a() {
            var a, b = this._.fakeSelection;
            b && (a = this.getSelection(1), a && a.isHidden() || (b.reset(), b = 0)), (b || (b = a || this.getSelection(1), b && b.getType() != CKEDITOR.SELECTION_NONE)) && (this.fire("selectionCheck", b), a = this.elementPath(), a.compare(this._.selectionPreviousPath) || (CKEDITOR.env.webkit && (this._.previousActive = this.document.getActive()), this._.selectionPreviousPath = a, this.fire("selectionChange", {
                selection: b,
                path: a
            })))
        }

        function b() {
            m = !0, l || (c.call(this), l = CKEDITOR.tools.setTimeout(c, 200, this))
        }

        function c() {
            l = null, m && (CKEDITOR.tools.setTimeout(a, 0, this), m = !1)
        }

        function d(a) {
            function b(b, c) {
                return b && b.type != CKEDITOR.NODE_TEXT ? a.clone()["moveToElementEdit" + (c ? "End" : "Start")](b) : !1
            }
            if (!(a.root instanceof CKEDITOR.editable)) return !1;
            var c = a.startContainer,
                d = a.getPreviousNode(n, null, c),
                e = a.getNextNode(n, null, c);
            return !b(d) && !b(e, 1) && (d || e || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? !1 : !0
        }

        function e(a) {
            return a.getCustomData("cke-fillingChar")
        }

        function f(a, b) {
            var c = a && a.removeCustomData("cke-fillingChar");
            if (c) {
                if (b !== !1) {
                    var d, e = a.getDocument().getSelection().getNative(),
                        f = e && "None" != e.type && e.getRangeAt(0);
                    if (c.getLength() > 1 && f && f.intersectsNode(c.$)) {
                        d = [e.anchorOffset, e.focusOffset], f = e.focusNode == c.$ && e.focusOffset > 0, e.anchorNode == c.$ && e.anchorOffset > 0 && d[0]--, f && d[1]--;
                        var h;
                        f = e, f.isCollapsed || (h = f.getRangeAt(0), h.setStart(f.anchorNode, f.anchorOffset), h.setEnd(f.focusNode, f.focusOffset), h = h.collapsed), h && d.unshift(d.pop())
                    }
                }
                c.setText(g(c.getText())), d && (c = e.getRangeAt(0), c.setStart(c.startContainer, d[0]), c.setEnd(c.startContainer, d[1]), e.removeAllRanges(), e.addRange(c))
            }
        }

        function g(a) {
            return a.replace(/\u200B( )?/g, function(a) {
                return a[1] ? " " : ""
            })
        }

        function h(a, b, c) {
            var d = a.on("focus", function(a) {
                a.cancel()
            }, null, null, -100);
            if (CKEDITOR.env.ie) var e = a.getDocument().on("selectionchange", function(a) {
                a.cancel()
            }, null, null, -100);
            else {
                var f = new CKEDITOR.dom.range(a);
                f.moveToElementEditStart(a);
                var g = a.getDocument().$.createRange();
                g.setStart(f.startContainer.$, f.startOffset), g.collapse(1), b.removeAllRanges(), b.addRange(g)
            }
            c && a.focus(), d.removeListener(), e && e.removeListener()
        }

        function i(a) {
            var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a.document);
            a.fire("lockSnapshot"), a.editable().append(b);
            var c = a.getSelection(1),
                d = a.createRange(),
                e = c.root.on("selectionchange", function(a) {
                    a.cancel()
                }, null, null, 0);
            d.setStartAt(b, CKEDITOR.POSITION_AFTER_START), d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END), c.selectRanges([d]), e.removeListener(), a.fire("unlockSnapshot"), a._.hiddenSelectionContainer = b
        }

        function j(a) {
            var b = {
                37: 1,
                39: 1,
                8: 1,
                46: 1
            };
            return function(c) {
                var d = c.data.getKeystroke();
                if (b[d]) {
                    var e = a.getSelection().getRanges(),
                        f = e[0];
                    1 == e.length && f.collapsed && (d = f[38 > d ? "getPreviousEditableNode" : "getNextEditableNode"]()) && d.type == CKEDITOR.NODE_ELEMENT && "false" == d.getAttribute("contenteditable") && (a.getSelection().fake(d), c.data.preventDefault(), c.cancel())
                }
            }
        }

        function k(a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                if (c.getCommonAncestor().isReadOnly() && a.splice(b, 1), !c.collapsed) {
                    if (c.startContainer.isReadOnly())
                        for (var d, e = c.startContainer; e && !((d = e.type == CKEDITOR.NODE_ELEMENT) && e.is("body") || !e.isReadOnly());) d && "false" == e.getAttribute("contentEditable") && c.setStartAfter(e), e = e.getParent();
                    e = c.startContainer, d = c.endContainer;
                    var f = c.startOffset,
                        g = c.endOffset,
                        h = c.clone();
                    e && e.type == CKEDITOR.NODE_TEXT && (f >= e.getLength() ? h.setStartAfter(e) : h.setStartBefore(e)), d && d.type == CKEDITOR.NODE_TEXT && (g ? h.setEndAfter(d) : h.setEndBefore(d)), e = new CKEDITOR.dom.walker(h), e.evaluator = function(d) {
                        if (d.type == CKEDITOR.NODE_ELEMENT && d.isReadOnly()) {
                            var e = c.clone();
                            return c.setEndBefore(d), c.collapsed && a.splice(b--, 1), d.getPosition(h.endContainer) & CKEDITOR.POSITION_CONTAINS || (e.setStartAfter(d), e.collapsed || a.splice(b + 1, 0, e)), !0
                        }
                        return !1
                    }, e.next()
                }
            }
            return a
        }
        var l, m, n = CKEDITOR.dom.walker.invisible(1),
            o = function() {
                function a(a) {
                    return function(b) {
                        var c = b.editor.createRange();
                        return c.moveToClosestEditablePosition(b.selected, a) && b.editor.getSelection().selectRanges([c]), !1
                    }
                }

                function b(a) {
                    return function(b) {
                        var c, d = b.editor,
                            e = d.createRange();
                        return (c = e.moveToClosestEditablePosition(b.selected, a)) || (c = e.moveToClosestEditablePosition(b.selected, !a)), c && d.getSelection().selectRanges([e]), d.fire("saveSnapshot"), b.selected.remove(), c || (e.moveToElementEditablePosition(d.editable()), d.getSelection().selectRanges([e])), d.fire("saveSnapshot"), !1
                    }
                }
                var c = a(),
                    d = a(1);
                return {
                    37: c,
                    38: c,
                    39: d,
                    40: d,
                    8: b(),
                    46: b(1)
                }
            }();
        CKEDITOR.on("instanceCreated", function(c) {
            function d() {
                var a = e.getSelection();
                a && a.removeAllRanges()
            }
            var e = c.editor;
            e.on("contentDom", function() {
                function c() {
                    h = new CKEDITOR.dom.selection(e.getSelection()), h.lock()
                }

                function d() {
                    k.removeListener("mouseup", d), n.removeListener("mouseup", d);
                    var a = CKEDITOR.document.$.selection,
                        b = a.createRange();
                    "None" != a.type && b.parentElement().ownerDocument == i.$ && b.select()
                }
                var g, h, i = e.document,
                    k = CKEDITOR.document,
                    l = e.editable(),
                    m = i.getBody(),
                    n = i.getDocumentElement(),
                    o = l.isInline();
                if (CKEDITOR.env.gecko && l.attachListener(l, "focus", function(a) {
                        a.removeListener(), 0 !== g && (a = e.getSelection().getNative()) && a.isCollapsed && a.anchorNode == l.$ && (a = e.createRange(), a.moveToElementEditStart(l), a.select())
                    }, null, null, -2), l.attachListener(l, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
                        g && CKEDITOR.env.webkit && (g = e._.previousActive && e._.previousActive.equals(i.getActive())), e.unlockSelection(g), g = 0
                    }, null, null, -1), l.attachListener(l, "mousedown", function() {
                        g = 0
                    }), (CKEDITOR.env.ie || o) && (p ? l.attachListener(l, "beforedeactivate", c, null, null, -1) : l.attachListener(e, "selectionCheck", c, null, null, -1), l.attachListener(l, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function() {
                        e.lockSelection(h), g = 1
                    }, null, null, -1), l.attachListener(l, "mousedown", function() {
                        g = 0
                    })), CKEDITOR.env.ie && !o) {
                    var q;
                    l.attachListener(l, "mousedown", function(a) {
                        2 == a.data.$.button && (a = e.document.getSelection(), a && a.getType() != CKEDITOR.SELECTION_NONE || (q = e.window.getScrollPosition()))
                    }), l.attachListener(l, "mouseup", function(a) {
                        2 == a.data.$.button && q && (e.document.$.documentElement.scrollLeft = q.x, e.document.$.documentElement.scrollTop = q.y), q = null
                    }), "BackCompat" != i.$.compatMode && ((CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && n.on("mousedown", function(a) {
                        function b(a) {
                            if (a = a.data.$, d) {
                                var b = m.$.createTextRange();
                                try {
                                    b.moveToPoint(a.clientX, a.clientY)
                                } catch (c) {}
                                d.setEndPoint(f.compareEndPoints("StartToStart", b) < 0 ? "EndToEnd" : "StartToStart", b), d.select()
                            }
                        }

                        function c() {
                            n.removeListener("mousemove", b), k.removeListener("mouseup", c), n.removeListener("mouseup", c), d.select()
                        }
                        if (a = a.data, a.getTarget().is("html") && a.$.y < n.$.clientHeight && a.$.x < n.$.clientWidth) {
                            var d = m.$.createTextRange();
                            try {
                                d.moveToPoint(a.$.clientX, a.$.clientY)
                            } catch (e) {}
                            var f = d.duplicate();
                            n.on("mousemove", b), k.on("mouseup", c), n.on("mouseup", c)
                        }
                    }), CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11 && n.on("mousedown", function(a) {
                        a.data.getTarget().is("html") && (k.on("mouseup", d), n.on("mouseup", d))
                    }))
                }
                if (l.attachListener(l, "selectionchange", a, e), l.attachListener(l, "keyup", b, e), l.attachListener(l, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function() {
                        e.forceNextSelectionCheck(), e.selectionChange(1)
                    }), o && (CKEDITOR.env.webkit || CKEDITOR.env.gecko)) {
                    var r;
                    l.attachListener(l, "mousedown", function() {
                        r = 1
                    }), l.attachListener(i.getDocumentElement(), "mouseup", function() {
                        r && b.call(e), r = 0
                    })
                } else l.attachListener(CKEDITOR.env.ie ? l : i.getDocumentElement(), "mouseup", b, e);
                CKEDITOR.env.webkit && l.attachListener(i, "keydown", function(a) {
                    switch (a.data.getKey()) {
                        case 13:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 39:
                        case 8:
                        case 45:
                        case 46:
                            f(l)
                    }
                }, null, null, -1), l.attachListener(l, "keydown", j(e), null, null, -1)
            }), e.on("setData", function() {
                e.unlockSelection(), CKEDITOR.env.webkit && d()
            }), e.on("contentDomUnload", function() {
                e.unlockSelection()
            }), CKEDITOR.env.ie9Compat && e.on("beforeDestroy", d, null, null, 9), e.on("dataReady", function() {
                delete e._.fakeSelection, delete e._.hiddenSelectionContainer, e.selectionChange(1)
            }), e.on("loadSnapshot", function() {
                var a = e.editable().getLast(function(a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                });
                a && a.hasAttribute("data-cke-hidden-sel") && a.remove()
            }, null, null, 100), e.on("key", function(a) {
                if ("wysiwyg" == e.mode) {
                    var b = e.getSelection();
                    if (b.isFake) {
                        var c = o[a.data.keyCode];
                        if (c) return c({
                            editor: e,
                            selected: b.getSelectedElement(),
                            selection: b,
                            keyEvent: a
                        })
                    }
                }
            })
        }), CKEDITOR.on("instanceReady", function(a) {
            function b() {
                var a = d.editable();
                if (a && (a = e(a))) {
                    var b = d.document.$.defaultView.getSelection();
                    "Caret" == b.type && b.anchorNode == a.$ && (i = 1), h = a.getText(), a.setText(g(h))
                }
            }

            function c() {
                var a = d.editable();
                a && (a = e(a)) && (a.setText(h), i && (d.document.$.defaultView.getSelection().setPosition(a.$, a.getLength()), i = 0))
            }
            var d = a.editor;
            if (CKEDITOR.env.webkit) {
                d.on("selectionChange", function() {
                    var a = d.editable(),
                        b = e(a);
                    b && (b.getCustomData("ready") ? f(a) : b.setCustomData("ready", 1))
                }, null, null, -1), d.on("beforeSetMode", function() {
                    f(d.editable())
                }, null, null, -1);
                var h, i;
                d.on("beforeUndoImage", b), d.on("afterUndoImage", c), d.on("beforeGetData", b, null, null, 0), d.on("getData", c)
            }
        }), CKEDITOR.editor.prototype.selectionChange = function(c) {
            (c ? a : b).call(this)
        }, CKEDITOR.editor.prototype.getSelection = function(a) {
            return !this._.savedSelection && !this._.fakeSelection || a ? (a = this.editable()) && "wysiwyg" == this.mode ? new CKEDITOR.dom.selection(a) : null : this._.savedSelection || this._.fakeSelection
        }, CKEDITOR.editor.prototype.lockSelection = function(a) {
            return a = a || this.getSelection(1), a.getType() != CKEDITOR.SELECTION_NONE ? (!a.isLocked && a.lock(), this._.savedSelection = a, !0) : !1
        }, CKEDITOR.editor.prototype.unlockSelection = function(a) {
            var b = this._.savedSelection;
            return b ? (b.unlock(a), delete this._.savedSelection, !0) : !1
        }, CKEDITOR.editor.prototype.forceNextSelectionCheck = function() {
            delete this._.selectionPreviousPath
        }, CKEDITOR.dom.document.prototype.getSelection = function() {
            return new CKEDITOR.dom.selection(this)
        }, CKEDITOR.dom.range.prototype.select = function() {
            var a = this.root instanceof CKEDITOR.editable ? this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
            return a.selectRanges([this]), a
        }, CKEDITOR.SELECTION_NONE = 1, CKEDITOR.SELECTION_TEXT = 2, CKEDITOR.SELECTION_ELEMENT = 3;
        var p = "function" != typeof window.getSelection,
            q = 1;
        CKEDITOR.dom.selection = function(a) {
            if (a instanceof CKEDITOR.dom.selection) var b = a,
                a = a.root;
            var c = a instanceof CKEDITOR.dom.element;
            if (this.rev = b ? b.rev : q++, this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument(), this.root = a = c ? a : this.document.getBody(), this.isLocked = 0, this._ = {
                    cache: {}
                }, b) return CKEDITOR.tools.extend(this._.cache, b._.cache), this.isFake = b.isFake, this.isLocked = b.isLocked, this;
            c = p ? this.document.$.selection : this.document.getWindow().$.getSelection(), CKEDITOR.env.webkit ? ("None" == c.type && this.document.getActive().equals(a) || "Caret" == c.type && c.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && h(a, c) : CKEDITOR.env.gecko ? c && this.document.getActive().equals(a) && c.anchorNode && c.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT && h(a, c, !0) : CKEDITOR.env.ie && (b = this.document.getActive(), p ? "None" == c.type && b && b.equals(this.document.getDocumentElement()) && h(a, null, !0) : ((c = c && c.anchorNode) && (c = new CKEDITOR.dom.node(c)), b && b.equals(this.document.getDocumentElement()) && c && (a.equals(c) || a.contains(c)) && h(a, null, !0)));
            var d, e, a = this.getNative();
            if (a)
                if (a.getRangeAt) d = (e = a.rangeCount && a.getRangeAt(0)) && new CKEDITOR.dom.node(e.commonAncestorContainer);
                else {
                    try {
                        e = a.createRange()
                    } catch (f) {}
                    d = e && CKEDITOR.dom.element.get(e.item && e.item(0) || e.parentElement())
                }
            return (!d || d.type != CKEDITOR.NODE_ELEMENT && d.type != CKEDITOR.NODE_TEXT || !this.root.equals(d) && !this.root.contains(d)) && (this._.cache.type = CKEDITOR.SELECTION_NONE, this._.cache.startElement = null, this._.cache.selectedElement = null, this._.cache.selectedText = "", this._.cache.ranges = new CKEDITOR.dom.rangeList), this
        };
        var r = {
            img: 1,
            hr: 1,
            li: 1,
            table: 1,
            tr: 1,
            td: 1,
            th: 1,
            embed: 1,
            object: 1,
            ol: 1,
            ul: 1,
            a: 1,
            input: 1,
            form: 1,
            select: 1,
            textarea: 1,
            button: 1,
            fieldset: 1,
            thead: 1,
            tfoot: 1
        };
        CKEDITOR.dom.selection.prototype = {
            getNative: function() {
                return void 0 !== this._.cache.nativeSel ? this._.cache.nativeSel : this._.cache.nativeSel = p ? this.document.$.selection : this.document.getWindow().$.getSelection()
            },
            getType: p ? function() {
                var a = this._.cache;
                if (a.type) return a.type;
                var b = CKEDITOR.SELECTION_NONE;
                try {
                    var c = this.getNative(),
                        d = c.type;
                    "Text" == d && (b = CKEDITOR.SELECTION_TEXT), "Control" == d && (b = CKEDITOR.SELECTION_ELEMENT), c.createRange().parentElement() && (b = CKEDITOR.SELECTION_TEXT)
                } catch (e) {}
                return a.type = b
            } : function() {
                var a = this._.cache;
                if (a.type) return a.type;
                var b = CKEDITOR.SELECTION_TEXT,
                    c = this.getNative();
                if (c && c.rangeCount) {
                    if (1 == c.rangeCount) {
                        var c = c.getRangeAt(0),
                            d = c.startContainer;
                        d == c.endContainer && 1 == d.nodeType && c.endOffset - c.startOffset == 1 && r[d.childNodes[c.startOffset].nodeName.toLowerCase()] && (b = CKEDITOR.SELECTION_ELEMENT)
                    }
                } else b = CKEDITOR.SELECTION_NONE;
                return a.type = b
            },
            getRanges: function() {
                var a = p ? function() {
                    function a(a) {
                        return new CKEDITOR.dom.node(a).getIndex()
                    }
                    var b = function(b, c) {
                        b = b.duplicate(), b.collapse(c);
                        var d = b.parentElement();
                        if (!d.hasChildNodes()) return {
                            container: d,
                            offset: 0
                        };
                        for (var e, f, g, h, i = d.children, j = b.duplicate(), k = 0, l = i.length - 1, m = -1; l >= k;)
                            if (m = Math.floor((k + l) / 2), e = i[m], j.moveToElementText(e), g = j.compareEndPoints("StartToStart", b), g > 0) l = m - 1;
                            else {
                                if (!(0 > g)) return {
                                    container: d,
                                    offset: a(e)
                                };
                                k = m + 1
                            }
                        if (-1 == m || m == i.length - 1 && 0 > g) {
                            if (j.moveToElementText(d), j.setEndPoint("StartToStart", b), j = j.text.replace(/(\r\n|\r)/g, "\n").length, i = d.childNodes, !j) return e = i[i.length - 1], e.nodeType != CKEDITOR.NODE_TEXT ? {
                                container: d,
                                offset: i.length
                            } : {
                                container: e,
                                offset: e.nodeValue.length
                            };
                            for (d = i.length; j > 0 && d > 0;) f = i[--d], f.nodeType == CKEDITOR.NODE_TEXT && (h = f, j -= f.nodeValue.length);
                            return {
                                container: h,
                                offset: -j
                            }
                        }
                        if (j.collapse(g > 0 ? !0 : !1), j.setEndPoint(g > 0 ? "StartToStart" : "EndToStart", b), j = j.text.replace(/(\r\n|\r)/g, "\n").length, !j) return {
                            container: d,
                            offset: a(e) + (g > 0 ? 0 : 1)
                        };
                        for (; j > 0;) try {
                            f = e[g > 0 ? "previousSibling" : "nextSibling"], f.nodeType == CKEDITOR.NODE_TEXT && (j -= f.nodeValue.length, h = f), e = f
                        } catch (n) {
                            return {
                                container: d,
                                offset: a(e)
                            }
                        }
                        return {
                            container: h,
                            offset: g > 0 ? -j : h.nodeValue.length + j
                        }
                    };
                    return function() {
                        var a = this.getNative(),
                            c = a && a.createRange(),
                            d = this.getType();
                        if (!a) return [];
                        if (d == CKEDITOR.SELECTION_TEXT) return a = new CKEDITOR.dom.range(this.root), d = b(c, !0), a.setStart(new CKEDITOR.dom.node(d.container), d.offset), d = b(c), a.setEnd(new CKEDITOR.dom.node(d.container), d.offset), a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse(), [a];
                        if (d == CKEDITOR.SELECTION_ELEMENT) {
                            for (var d = [], e = 0; e < c.length; e++) {
                                for (var f = c.item(e), g = f.parentNode, h = 0, a = new CKEDITOR.dom.range(this.root); h < g.childNodes.length && g.childNodes[h] != f; h++);
                                a.setStart(new CKEDITOR.dom.node(g), h), a.setEnd(new CKEDITOR.dom.node(g), h + 1), d.push(a)
                            }
                            return d
                        }
                        return []
                    }
                }() : function() {
                    var a, b = [],
                        c = this.getNative();
                    if (!c) return b;
                    for (var d = 0; d < c.rangeCount; d++) {
                        var e = c.getRangeAt(d);
                        a = new CKEDITOR.dom.range(this.root), a.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset), a.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset), b.push(a)
                    }
                    return b
                };
                return function(b) {
                    var c = this._.cache,
                        d = c.ranges;
                    return d || (c.ranges = d = new CKEDITOR.dom.rangeList(a.call(this))), b ? k(new CKEDITOR.dom.rangeList(d.slice())) : d
                }
            }(),
            getStartElement: function() {
                var a = this._.cache;
                if (void 0 !== a.startElement) return a.startElement;
                var b;
                switch (this.getType()) {
                    case CKEDITOR.SELECTION_ELEMENT:
                        return this.getSelectedElement();
                    case CKEDITOR.SELECTION_TEXT:
                        var c = this.getRanges()[0];
                        if (c) {
                            if (c.collapsed) b = c.startContainer, b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent());
                            else {
                                for (c.optimize(); b = c.startContainer, c.startOffset == (b.getChildCount ? b.getChildCount() : b.getLength()) && !b.isBlockBoundary();) c.setStartAfter(b);
                                if (b = c.startContainer, b.type != CKEDITOR.NODE_ELEMENT) return b.getParent();
                                if (b = b.getChild(c.startOffset), b && b.type == CKEDITOR.NODE_ELEMENT)
                                    for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) b = c, c = c.getFirst();
                                else b = c.startContainer
                            }
                            b = b.$
                        }
                }
                return a.startElement = b ? new CKEDITOR.dom.element(b) : null
            },
            getSelectedElement: function() {
                var a = this._.cache;
                if (void 0 !== a.selectedElement) return a.selectedElement;
                var b = this,
                    c = CKEDITOR.tools.tryThese(function() {
                        return b.getNative().createRange().item(0)
                    }, function() {
                        for (var a, c, d = b.getRanges()[0].clone(), e = 2; e && (!(a = d.getEnclosedNode()) || a.type != CKEDITOR.NODE_ELEMENT || !r[a.getName()] || !(c = a)); e--) d.shrink(CKEDITOR.SHRINK_ELEMENT);
                        return c && c.$
                    });
                return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
            },
            getSelectedText: function() {
                var a = this._.cache;
                if (void 0 !== a.selectedText) return a.selectedText;
                var b = this.getNative(),
                    b = p ? "Control" == b.type ? "" : b.createRange().text : b.toString();
                return a.selectedText = b
            },
            lock: function() {
                this.getRanges(), this.getStartElement(), this.getSelectedElement(), this.getSelectedText(), this._.cache.nativeSel = null, this.isLocked = 1
            },
            unlock: function(a) {
                if (this.isLocked) {
                    if (a) var b = this.getSelectedElement(),
                        c = !b && this.getRanges(),
                        d = this.isFake;
                    this.isLocked = 0, this.reset(), a && (a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (d ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
                }
            },
            reset: function() {
                this._.cache = {}, this.isFake = 0;
                var a = this.root.editor;
                if (a && a._.fakeSelection && this.rev == a._.fakeSelection.rev) {
                    delete a._.fakeSelection;
                    var b = a._.hiddenSelectionContainer;
                    if (b) {
                        var c = a.checkDirty();
                        a.fire("lockSnapshot"), b.remove(), a.fire("unlockSnapshot"), !c && a.resetDirty()
                    }
                    delete a._.hiddenSelectionContainer
                }
                this.rev = q++
            },
            selectElement: function(a) {
                var b = new CKEDITOR.dom.range(this.root);
                b.setStartBefore(a), b.setEndAfter(a), this.selectRanges([b])
            },
            selectRanges: function(a) {
                var b = this.root.editor,
                    b = b && b._.hiddenSelectionContainer;
                if (this.reset(), b)
                    for (var c, b = this.root, e = 0; e < a.length; ++e) c = a[e], c.endContainer.equals(b) && (c.endOffset = Math.min(c.endOffset, b.getChildCount()));
                if (a.length)
                    if (this.isLocked) {
                        var g = CKEDITOR.document.getActive();
                        this.unlock(), this.selectRanges(a), this.lock(), g && !g.equals(this.root) && g.focus()
                    } else {
                        var h, i, j;
                        if ((1 != a.length || (j = a[0]).collapsed || !(h = j.getEnclosedNode()) || h.type != CKEDITOR.NODE_ELEMENT || (j = j.clone(), j.shrink(CKEDITOR.SHRINK_ELEMENT, !0), (i = j.getEnclosedNode()) && i.type == CKEDITOR.NODE_ELEMENT && (h = i), "false" != h.getAttribute("contenteditable"))) && (h = void 0), h) this.fake(h);
                        else {
                            if (p) {
                                j = CKEDITOR.dom.walker.whitespaces(!0), i = /\ufeff|\u00a0/, b = {
                                    table: 1,
                                    tbody: 1,
                                    tr: 1
                                }, a.length > 1 && (h = a[a.length - 1], a[0].setEnd(h.endContainer, h.endOffset)), h = a[0];
                                var k, l, m, a = h.collapsed;
                                if ((c = h.getEnclosedNode()) && c.type == CKEDITOR.NODE_ELEMENT && c.getName() in r && (!c.is("a") || !c.getText())) try {
                                    return m = c.$.createControlRange(), m.addElement(c.$), void m.select()
                                } catch (n) {}(h.startContainer.type == CKEDITOR.NODE_ELEMENT && h.startContainer.getName() in b || h.endContainer.type == CKEDITOR.NODE_ELEMENT && h.endContainer.getName() in b) && (h.shrink(CKEDITOR.NODE_ELEMENT, !0), a = h.collapsed), m = h.createBookmark(), b = m.startNode, a || (g = m.endNode), m = h.document.$.body.createTextRange(), m.moveToElementText(b.$), m.moveStart("character", 1), g ? (i = h.document.$.body.createTextRange(), i.moveToElementText(g.$), m.setEndPoint("EndToEnd", i), m.moveEnd("character", -1)) : (k = b.getNext(j), l = b.hasAscendant("pre"), k = !(k && k.getText && k.getText().match(i)) && (l || !b.hasPrevious() || b.getPrevious().is && b.getPrevious().is("br")), l = h.document.createElement("span"), l.setHtml("&#65279;"), l.insertBefore(b), k && h.document.createText("\ufeff").insertBefore(b)), h.setStartBefore(b), b.remove(), a ? (k ? (m.moveStart("character", -1), m.select(), h.document.$.selection.clear()) : m.select(), h.moveToPosition(l, CKEDITOR.POSITION_BEFORE_START), l.remove()) : (h.setEndBefore(g), g.remove(), m.select())
                            } else {
                                if (g = this.getNative(), !g) return;
                                for (this.removeAllRanges(), m = 0; m < a.length; m++)
                                    if (m < a.length - 1 && (k = a[m], l = a[m + 1], i = k.clone(), i.setStart(k.endContainer, k.endOffset), i.setEnd(l.startContainer, l.startOffset), !i.collapsed && (i.shrink(CKEDITOR.NODE_ELEMENT, !0), h = i.getCommonAncestor(), i = i.getEnclosedNode(), h.isReadOnly() || i && i.isReadOnly()))) l.setStart(k.startContainer, k.startOffset),
                                        a.splice(m--, 1);
                                    else {
                                        h = a[m], l = this.document.$.createRange(), h.collapsed && CKEDITOR.env.webkit && d(h) && (k = this.root, f(k, !1), i = k.getDocument().createText("​"), k.setCustomData("cke-fillingChar", i), h.insertNode(i), (k = i.getNext()) && !i.getPrevious() && k.type == CKEDITOR.NODE_ELEMENT && "br" == k.getName() ? (f(this.root), h.moveToPosition(k, CKEDITOR.POSITION_BEFORE_START)) : h.moveToPosition(i, CKEDITOR.POSITION_AFTER_END)), l.setStart(h.startContainer.$, h.startOffset);
                                        try {
                                            l.setEnd(h.endContainer.$, h.endOffset)
                                        } catch (o) {
                                            if (!(o.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0)) throw o;
                                            h.collapse(1), l.setEnd(h.endContainer.$, h.endOffset)
                                        }
                                        g.addRange(l)
                                    }
                            }
                            this.reset(), this.root.fire("selectionchange")
                        }
                    }
            },
            fake: function(a) {
                var b = this.root.editor;
                this.reset(), i(b);
                var c = this._.cache,
                    d = new CKEDITOR.dom.range(this.root);
                d.setStartBefore(a), d.setEndAfter(a), c.ranges = new CKEDITOR.dom.rangeList(d), c.selectedElement = c.startElement = a, c.type = CKEDITOR.SELECTION_ELEMENT, c.selectedText = c.nativeSel = null, this.isFake = 1, this.rev = q++, b._.fakeSelection = this, this.root.fire("selectionchange")
            },
            isHidden: function() {
                var a = this.getCommonAncestor();
                return a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent()), !(!a || !a.data("cke-hidden-sel"))
            },
            createBookmarks: function(a) {
                return a = this.getRanges().createBookmarks(a), this.isFake && (a.isFake = 1), a
            },
            createBookmarks2: function(a) {
                return a = this.getRanges().createBookmarks2(a), this.isFake && (a.isFake = 1), a
            },
            selectBookmarks: function(a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var d = new CKEDITOR.dom.range(this.root);
                    d.moveToBookmark(a[c]), b.push(d)
                }
                return a.isFake ? this.fake(b[0].getEnclosedNode()) : this.selectRanges(b), this
            },
            getCommonAncestor: function() {
                var a = this.getRanges();
                return a.length ? a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer) : null
            },
            scrollIntoView: function() {
                this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
            },
            removeAllRanges: function() {
                if (this.getType() != CKEDITOR.SELECTION_NONE) {
                    var a = this.getNative();
                    try {
                        a && a[p ? "empty" : "removeAllRanges"]()
                    } catch (b) {}
                    this.reset()
                }
            }
        }
    }(), CKEDITOR.STYLE_BLOCK = 1, CKEDITOR.STYLE_INLINE = 2, CKEDITOR.STYLE_OBJECT = 3, function() {
        function a(a, b) {
            for (var c, d;
                (a = a.getParent()) && !a.equals(b);)
                if (a.getAttribute("data-nostyle")) c = a;
                else if (!d) {
                var e = a.getAttribute("contentEditable");
                "false" == e ? c = a : "true" == e && (d = 1)
            }
            return c
        }

        function b(c) {
            var e = c.document;
            if (c.collapsed) e = q(this, e), c.insertNode(e), c.moveToPosition(e, CKEDITOR.POSITION_BEFORE_END);
            else {
                var f, g = this.element,
                    h = this._.definition,
                    i = h.ignoreReadonly,
                    j = i || h.includeReadonly;
                null == j && (j = c.root.getCustomData("cke_includeReadonly"));
                var k = CKEDITOR.dtd[g];
                k || (f = !0, k = CKEDITOR.dtd.span), c.enlarge(CKEDITOR.ENLARGE_INLINE, 1), c.trim();
                var l, m = c.createBookmark(),
                    o = m.startNode,
                    p = m.endNode,
                    r = o;
                if (!i) {
                    var s = c.getCommonAncestor(),
                        i = a(o, s),
                        s = a(p, s);
                    i && (r = i.getNextSourceNode(!0)), s && (p = s)
                }
                for (r.getPosition(p) == CKEDITOR.POSITION_FOLLOWING && (r = 0); r;) {
                    if (i = !1, r.equals(p)) r = null, i = !0;
                    else {
                        var t = r.type == CKEDITOR.NODE_ELEMENT ? r.getName() : null,
                            s = t && "false" == r.getAttribute("contentEditable"),
                            u = t && r.getAttribute("data-nostyle");
                        if (t && r.data("cke-bookmark")) {
                            r = r.getNextSourceNode(!0);
                            continue
                        }
                        if (s && j && CKEDITOR.dtd.$block[t])
                            for (var v = r, w = d(v), x = void 0, y = w.length, z = 0, v = y && new CKEDITOR.dom.range(v.getDocument()); y > z; ++z) {
                                var x = w[z],
                                    B = CKEDITOR.filter.instances[x.data("cke-filter")];
                                (B ? B.check(this) : 1) && (v.selectNodeContents(x), b.call(this, v))
                            }
                        if (w = t ? !k[t] || u ? 0 : s && !j ? 0 : (r.getPosition(p) | C) == C && (!h.childRule || h.childRule(r)) : 1) {
                            if (!(w = r.getParent()) || !(w.getDtd() || CKEDITOR.dtd.span)[g] && !f || h.parentRule && !h.parentRule(w)) i = !0;
                            else if (l || t && CKEDITOR.dtd.$removeEmpty[t] && (r.getPosition(p) | C) != C || (l = c.clone(), l.setStartBefore(r)), t = r.type, t == CKEDITOR.NODE_TEXT || s || t == CKEDITOR.NODE_ELEMENT && !r.getChildCount()) {
                                for (var E, t = r;
                                    (i = !t.getNext(A)) && (E = t.getParent(), k[E.getName()]) && (E.getPosition(o) | D) == D && (!h.childRule || h.childRule(E));) t = E;
                                l.setEndAfter(t)
                            }
                        } else i = !0;
                        r = r.getNextSourceNode(u || s)
                    }
                    if (i && l && !l.collapsed) {
                        for (var F, G, H, i = q(this, e), s = i.hasAttributes(), u = l.getCommonAncestor(), t = {}, w = {}, x = {}, y = {}; i && u;) {
                            if (u.getName() == g) {
                                for (F in h.attributes) !y[F] && (H = u.getAttribute(G)) && (i.getAttribute(F) == H ? w[F] = 1 : y[F] = 1);
                                for (G in h.styles) !x[G] && (H = u.getStyle(G)) && (i.getStyle(G) == H ? t[G] = 1 : x[G] = 1)
                            }
                            u = u.getParent()
                        }
                        for (F in w) i.removeAttribute(F);
                        for (G in t) i.removeStyle(G);
                        s && !i.hasAttributes() && (i = null), i ? (l.extractContents().appendTo(i), l.insertNode(i), n.call(this, i), i.mergeSiblings(), CKEDITOR.env.ie || i.$.normalize()) : (i = new CKEDITOR.dom.element("span"), l.extractContents().appendTo(i), l.insertNode(i), n.call(this, i), i.remove(!0)), l = null
                    }
                }
                c.moveToBookmark(m), c.shrink(CKEDITOR.SHRINK_TEXT), c.shrink(CKEDITOR.NODE_ELEMENT, !0)
            }
        }

        function c(a) {
            function b() {
                for (var a = new CKEDITOR.dom.elementPath(d.getParent()), b = new CKEDITOR.dom.elementPath(j.getParent()), c = null, e = null, f = 0; f < a.elements.length; f++) {
                    var g = a.elements[f];
                    if (g == a.block || g == a.blockLimit) break;
                    k.checkElementRemovable(g) && (c = g)
                }
                for (f = 0; f < b.elements.length && (g = b.elements[f], g != b.block && g != b.blockLimit); f++) k.checkElementRemovable(g) && (e = g);
                e && j.breakParent(e), c && d.breakParent(c)
            }
            a.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
            var c = a.createBookmark(),
                d = c.startNode;
            if (a.collapsed) {
                for (var e, f, g = new CKEDITOR.dom.elementPath(d.getParent(), a.root), h = 0; h < g.elements.length && (f = g.elements[h]) && (f != g.block && f != g.blockLimit); h++)
                    if (this.checkElementRemovable(f)) {
                        var i;
                        a.collapsed && (a.checkBoundaryOfElement(f, CKEDITOR.END) || (i = a.checkBoundaryOfElement(f, CKEDITOR.START))) ? (e = f, e.match = i ? "start" : "end") : (f.mergeSiblings(), f.is(this.element) ? m.call(this, f) : o(f, t(this)[f.getName()]))
                    }
                if (e) {
                    for (f = d, h = 0; i = g.elements[h], !i.equals(e); h++) i.match || (i = i.clone(), i.append(f), f = i);
                    f["start" == e.match ? "insertBefore" : "insertAfter"](e)
                }
            } else {
                var j = c.endNode,
                    k = this;
                for (b(), g = d; !g.equals(j);) e = g.getNextSourceNode(), g.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(g) && (g.getName() == this.element ? m.call(this, g) : o(g, t(this)[g.getName()]), e.type == CKEDITOR.NODE_ELEMENT && e.contains(d) && (b(), e = d.getNext())), g = e
            }
            a.moveToBookmark(c), a.shrink(CKEDITOR.NODE_ELEMENT, !0)
        }

        function d(a) {
            var b = [];
            return a.forEach(function(a) {
                return "true" == a.getAttribute("contenteditable") ? (b.push(a), !1) : void 0
            }, CKEDITOR.NODE_ELEMENT, !0), b
        }

        function e(a) {
            var b = a.getEnclosedNode() || a.getCommonAncestor(!1, !0);
            (a = new CKEDITOR.dom.elementPath(b, a.root).contains(this.element, 1)) && !a.isReadOnly() && r(a, this)
        }

        function f(a) {
            var b = a.getCommonAncestor(!0, !0);
            if (a = new CKEDITOR.dom.elementPath(b, a.root).contains(this.element, 1)) {
                var b = this._.definition,
                    c = b.attributes;
                if (c)
                    for (var d in c) a.removeAttribute(d, c[d]);
                if (b.styles)
                    for (var e in b.styles) b.styles.hasOwnProperty(e) && a.removeStyle(e)
            }
        }

        function g(a) {
            var b = a.createBookmark(!0),
                c = a.createIterator();
            c.enforceRealBlocks = !0, this._.enterMode && (c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR);
            for (var d, e, f = a.document; d = c.getNextParagraph();) !d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1) && (e = q(this, f, d), i(d, e));
            a.moveToBookmark(b)
        }

        function h(a) {
            var b = a.createBookmark(1),
                c = a.createIterator();
            c.enforceRealBlocks = !0, c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var d, e; d = c.getNextParagraph();) this.checkElementRemovable(d) && (d.is("pre") ? ((e = this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && d.copyAttributes(e), i(d, e)) : m.call(this, d));
            a.moveToBookmark(b)
        }

        function i(a, b) {
            var c = !b;
            c && (b = a.getDocument().createElement("div"), a.copyAttributes(b));
            var d = b && b.is("pre"),
                e = a.is("pre"),
                f = !d && e;
            if (d && !e) {
                if (e = b, (f = a.getBogus()) && f.remove(), f = a.getHtml(), f = k(f, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, ""), f = f.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1"), f = f.replace(/([ \t\n\r]+|&nbsp;)/g, " "), f = f.replace(/<br\b[^>]*>/gi, "\n"), CKEDITOR.env.ie) {
                    var g = a.getDocument().createElement("div");
                    g.append(e), e.$.outerHTML = "<pre>" + f + "</pre>", e.copyAttributes(g.getFirst()), e = g.getFirst().remove()
                } else e.setHtml(f);
                b = e
            } else f ? b = l(c ? [a.getHtml()] : j(a), b) : a.moveChildren(b);
            if (b.replace(a), d) {
                var h, c = b;
                (h = c.getPrevious(B)) && h.type == CKEDITOR.NODE_ELEMENT && h.is("pre") && (d = k(h.getHtml(), /\n$/, "") + "\n\n" + k(c.getHtml(), /^\n/, ""), CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + d + "</pre>" : c.setHtml(d), h.remove())
            } else c && p(b)
        }

        function j(a) {
            var b = [];
            return k(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function(a, b, c) {
                return b + "</pre>" + c + "<pre>"
            }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function(a, c) {
                b.push(c)
            }), b
        }

        function k(a, b, c) {
            var d = "",
                e = "",
                a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function(a, b, c) {
                    return b && (d = b), c && (e = c), ""
                });
            return d + a.replace(b, c) + e
        }

        function l(a, b) {
            var c;
            a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
            for (var d = 0; d < a.length; d++) {
                var e = a[d],
                    e = e.replace(/(\r\n|\r)/g, "\n"),
                    e = k(e, /^[ \t]*\n/, ""),
                    e = k(e, /\n$/, ""),
                    e = k(e, /^[ \t]+|[ \t]+$/g, function(a, b) {
                        return 1 == a.length ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                    }),
                    e = e.replace(/\n/g, "<br>"),
                    e = e.replace(/[ \t]{2,}/g, function(a) {
                        return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                    });
                if (c) {
                    var f = b.clone();
                    f.setHtml(e), c.append(f)
                } else b.setHtml(e)
            }
            return c || b
        }

        function m(a, b) {
            var c, d = this._.definition,
                e = d.attributes,
                d = d.styles,
                f = t(this)[a.getName()],
                g = CKEDITOR.tools.isEmpty(e) && CKEDITOR.tools.isEmpty(d);
            for (c in e)("class" == c || this._.definition.fullMatch) && a.getAttribute(c) != u(c, e[c]) || b && "data-" == c.slice(0, 5) || (g = a.hasAttribute(c), a.removeAttribute(c));
            for (var h in d) this._.definition.fullMatch && a.getStyle(h) != u(h, d[h], !0) || (g = g || !!a.getStyle(h), a.removeStyle(h));
            o(a, f, w[a.getName()]), g && (this._.definition.alwaysRemoveElement ? p(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode == CKEDITOR.ENTER_BR && !a.hasAttributes() ? p(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
        }

        function n(a) {
            for (var b, c = t(this), d = a.getElementsByTag(this.element), e = d.count(); --e >= 0;) b = d.getItem(e), b.isReadOnly() || m.call(this, b, !0);
            for (var f in c)
                if (f != this.element)
                    for (d = a.getElementsByTag(f), e = d.count() - 1; e >= 0; e--) b = d.getItem(e), b.isReadOnly() || o(b, c[f])
        }

        function o(a, b, c) {
            if (b = b && b.attributes)
                for (var d = 0; d < b.length; d++) {
                    var e, f = b[d][0];
                    if (e = a.getAttribute(f)) {
                        var g = b[d][1];
                        (null === g || g.test && g.test(e) || "string" == typeof g && e == g) && a.removeAttribute(f)
                    }
                }
            c || p(a)
        }

        function p(a, b) {
            if (!a.hasAttributes() || b)
                if (CKEDITOR.dtd.$block[a.getName()]) {
                    var c = a.getPrevious(B),
                        d = a.getNext(B);
                    c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({
                        br: 1
                    })) && a.append("br", 1), d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({
                        br: 1
                    })) && a.append("br"), a.remove(!0)
                } else c = a.getFirst(), d = a.getLast(), a.remove(!0), c && (c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings(), d && !c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT && d.mergeSiblings())
        }

        function q(a, b, c) {
            var d;
            return d = a.element, "*" == d && (d = "span"), d = new CKEDITOR.dom.element(d, b), c && c.copyAttributes(d), d = r(d, a), b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1), d
        }

        function r(a, b) {
            var c = b._.definition,
                d = c.attributes,
                c = CKEDITOR.style.getStyleText(c);
            if (d)
                for (var e in d) a.setAttribute(e, d[e]);
            return c && a.setAttribute("style", c), a
        }

        function s(a, b) {
            for (var c in a) a[c] = a[c].replace(z, function(a, c) {
                return b[c]
            })
        }

        function t(a) {
            if (a._.overrides) return a._.overrides;
            var b = a._.overrides = {},
                c = a._.definition.overrides;
            if (c) {
                CKEDITOR.tools.isArray(c) || (c = [c]);
                for (var d = 0; d < c.length; d++) {
                    var e, f, g = c[d];
                    if ("string" == typeof g ? e = g.toLowerCase() : (e = g.element ? g.element.toLowerCase() : a.element, f = g.attributes), g = b[e] || (b[e] = {}), f) {
                        var h, g = g.attributes = g.attributes || [];
                        for (h in f) g.push([h.toLowerCase(), f[h]])
                    }
                }
            }
            return b
        }

        function u(a, b, c) {
            var d = new CKEDITOR.dom.element("span");
            return d[c ? "setStyle" : "setAttribute"](a, b), d[c ? "getStyle" : "getAttribute"](a)
        }

        function v(a, b, c) {
            for (var d, e = a.document, f = a.getRanges(), b = b ? this.removeFromRange : this.applyToRange, g = f.createIterator(); d = g.getNextRange();) b.call(this, d, c);
            a.selectRanges(f), e.removeCustomData("doc_processing_style")
        }
        var w = {
                address: 1,
                div: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                p: 1,
                pre: 1,
                section: 1,
                header: 1,
                footer: 1,
                nav: 1,
                article: 1,
                aside: 1,
                figure: 1,
                dialog: 1,
                hgroup: 1,
                time: 1,
                meter: 1,
                menu: 1,
                command: 1,
                keygen: 1,
                output: 1,
                progress: 1,
                details: 1,
                datagrid: 1,
                datalist: 1
            },
            x = {
                a: 1,
                blockquote: 1,
                embed: 1,
                hr: 1,
                img: 1,
                li: 1,
                object: 1,
                ol: 1,
                table: 1,
                td: 1,
                tr: 1,
                th: 1,
                ul: 1,
                dl: 1,
                dt: 1,
                dd: 1,
                form: 1,
                audio: 1,
                video: 1
            },
            y = /\s*(?:;\s*|$)/,
            z = /#\((.+?)\)/g,
            A = CKEDITOR.dom.walker.bookmark(0, 1),
            B = CKEDITOR.dom.walker.whitespaces(1);
        CKEDITOR.style = function(a, b) {
            if ("string" == typeof a.type) return new CKEDITOR.style.customHandlers[a.type](a);
            var c = a.attributes;
            c && c.style && (a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style)), delete c.style), b && (a = CKEDITOR.tools.clone(a), s(a.attributes, b), s(a.styles, b)), c = this.element = a.element ? "string" == typeof a.element ? a.element.toLowerCase() : a.element : "*", this.type = a.type || (w[c] ? CKEDITOR.STYLE_BLOCK : x[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE), "object" == typeof this.element && (this.type = CKEDITOR.STYLE_OBJECT), this._ = {
                definition: a
            }
        }, CKEDITOR.style.prototype = {
            apply: function(a) {
                if (a instanceof CKEDITOR.dom.document) return v.call(this, a.getSelection());
                if (this.checkApplicable(a.elementPath(), a)) {
                    var b = this._.enterMode;
                    b || (this._.enterMode = a.activeEnterMode), v.call(this, a.getSelection(), 0, a), this._.enterMode = b
                }
            },
            remove: function(a) {
                if (a instanceof CKEDITOR.dom.document) return v.call(this, a.getSelection(), 1);
                if (this.checkApplicable(a.elementPath(), a)) {
                    var b = this._.enterMode;
                    b || (this._.enterMode = a.activeEnterMode), v.call(this, a.getSelection(), 1, a), this._.enterMode = b
                }
            },
            applyToRange: function(a) {
                return this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? g : this.type == CKEDITOR.STYLE_OBJECT ? e : null, this.applyToRange(a)
            },
            removeFromRange: function(a) {
                return this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? c : this.type == CKEDITOR.STYLE_BLOCK ? h : this.type == CKEDITOR.STYLE_OBJECT ? f : null, this.removeFromRange(a)
            },
            applyToObject: function(a) {
                r(a, this)
            },
            checkActive: function(a, b) {
                switch (this.type) {
                    case CKEDITOR.STYLE_BLOCK:
                        return this.checkElementRemovable(a.block || a.blockLimit, !0, b);
                    case CKEDITOR.STYLE_OBJECT:
                    case CKEDITOR.STYLE_INLINE:
                        for (var c, d = a.elements, e = 0; e < d.length; e++)
                            if (c = d[e], this.type != CKEDITOR.STYLE_INLINE || c != a.block && c != a.blockLimit) {
                                if (this.type == CKEDITOR.STYLE_OBJECT) {
                                    var f = c.getName();
                                    if (!("string" == typeof this.element ? f == this.element : f in this.element)) continue
                                }
                                if (this.checkElementRemovable(c, !0, b)) return !0
                            }
                }
                return !1
            },
            checkApplicable: function(a, b, c) {
                if (b && b instanceof CKEDITOR.filter && (c = b), c && !c.check(this)) return !1;
                switch (this.type) {
                    case CKEDITOR.STYLE_OBJECT:
                        return !!a.contains(this.element);
                    case CKEDITOR.STYLE_BLOCK:
                        return !!a.blockLimit.getDtd()[this.element]
                }
                return !0
            },
            checkElementMatch: function(a, b) {
                var c = this._.definition;
                if (!a || !c.ignoreReadonly && a.isReadOnly()) return !1;
                var d = a.getName();
                if ("string" == typeof this.element ? d == this.element : d in this.element) {
                    if (!b && !a.hasAttributes()) return !0;
                    if (d = c._AC) c = d;
                    else {
                        var d = {},
                            e = 0,
                            f = c.attributes;
                        if (f)
                            for (var g in f) e++, d[g] = f[g];
                        (g = CKEDITOR.style.getStyleText(c)) && (d.style || e++, d.style = g), d._length = e, c = c._AC = d
                    }
                    if (!c._length) return !0;
                    for (var h in c)
                        if ("_length" != h) {
                            if (e = a.getAttribute(h) || "", "style" == h) a: {
                                d = c[h], "string" == typeof d && (d = CKEDITOR.tools.parseCssText(d)), "string" == typeof e && (e = CKEDITOR.tools.parseCssText(e, !0)), g = void 0;
                                for (g in d)
                                    if (!(g in e) || e[g] != d[g] && "inherit" != d[g] && "inherit" != e[g]) {
                                        d = !1;
                                        break a
                                    }
                                d = !0
                            } else d = c[h] == e;
                            if (d) {
                                if (!b) return !0
                            } else if (b) return !1
                        }
                    if (b) return !0
                }
                return !1
            },
            checkElementRemovable: function(a, b, c) {
                if (this.checkElementMatch(a, b, c)) return !0;
                if (b = t(this)[a.getName()]) {
                    var d;
                    if (!(b = b.attributes)) return !0;
                    for (c = 0; c < b.length; c++)
                        if (d = b[c][0], d = a.getAttribute(d)) {
                            var e = b[c][1];
                            if (null === e || "string" == typeof e && d == e || e.test(d)) return !0
                        }
                }
                return !1
            },
            buildPreview: function(a) {
                var b = this._.definition,
                    c = [],
                    d = b.element;
                "bdo" == d && (d = "span");
                var c = ["<", d],
                    e = b.attributes;
                if (e)
                    for (var f in e) c.push(" ", f, '="', e[f], '"');
                return (e = CKEDITOR.style.getStyleText(b)) && c.push(' style="', e, '"'), c.push(">", a || b.name, "</", d, ">"), c.join("")
            },
            getDefinition: function() {
                return this._.definition
            }
        }, CKEDITOR.style.getStyleText = function(a) {
            var b = a._ST;
            if (b) return b;
            var b = a.styles,
                c = a.attributes && a.attributes.style || "",
                d = "";
            c.length && (c = c.replace(y, ";"));
            for (var e in b) {
                var f = b[e],
                    g = (e + ":" + f).replace(y, ";");
                "inherit" == f ? d += g : c += g
            }
            return c.length && (c = CKEDITOR.tools.normalizeCssText(c, !0)), a._ST = c + d
        }, CKEDITOR.style.customHandlers = {}, CKEDITOR.style.addCustomHandler = function(a) {
            var b = function(a) {
                this._ = {
                    definition: a
                }, this.setup && this.setup(a)
            };
            return b.prototype = CKEDITOR.tools.extend(CKEDITOR.tools.prototypedCopy(CKEDITOR.style.prototype), {
                assignedTo: CKEDITOR.STYLE_OBJECT
            }, a, !0), this.customHandlers[a.type] = b
        };
        var C = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
            D = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
    }(), CKEDITOR.styleCommand = function(a, b) {
        this.requiredContent = this.allowedContent = this.style = a, CKEDITOR.tools.extend(this, b, !0)
    }, CKEDITOR.styleCommand.prototype.exec = function(a) {
        a.focus(), this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style)
    }, CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet"), CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet), CKEDITOR.loadStylesSet = function(a, b, c) {
        CKEDITOR.stylesSet.addExternal(a, b, ""), CKEDITOR.stylesSet.load(a, c)
    }, CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        attachStyleStateChange: function(a, b) {
            var c = this._.styleStateChangeCallbacks;
            c || (c = this._.styleStateChangeCallbacks = [], this.on("selectionChange", function(a) {
                for (var b = 0; b < c.length; b++) {
                    var d = c[b],
                        e = d.style.checkActive(a.data.path, this) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
                    d.fn.call(this, e)
                }
            })), c.push({
                style: a,
                fn: b
            })
        },
        applyStyle: function(a) {
            a.apply(this)
        },
        removeStyle: function(a) {
            a.remove(this)
        },
        getStylesSet: function(a) {
            if (this._.stylesDefinitions) a(this._.stylesDefinitions);
            else {
                var b = this,
                    c = b.config.stylesCombo_stylesSet || b.config.stylesSet;
                if (c === !1) a(null);
                else if (c instanceof Array) b._.stylesDefinitions = c, a(c);
                else {
                    c || (c = "default");
                    var c = c.split(":"),
                        d = c[0];
                    CKEDITOR.stylesSet.addExternal(d, c[1] ? c.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), ""), CKEDITOR.stylesSet.load(d, function(c) {
                        b._.stylesDefinitions = c[d], a(b._.stylesDefinitions)
                    })
                }
            }
        }
    }), CKEDITOR.dom.comment = function(a, b) {
        "string" == typeof a && (a = (b ? b.$ : document).createComment(a)), CKEDITOR.dom.domObject.call(this, a)
    }, CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node, CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
        type: CKEDITOR.NODE_COMMENT,
        getOuterHtml: function() {
            return "<!--" + this.$.nodeValue + "-->"
        }
    }), function() {
        var a, b = {},
            c = {};
        for (a in CKEDITOR.dtd.$blockLimit) a in CKEDITOR.dtd.$list || (b[a] = 1);
        for (a in CKEDITOR.dtd.$block) a in CKEDITOR.dtd.$blockLimit || a in CKEDITOR.dtd.$empty || (c[a] = 1);
        CKEDITOR.dom.elementPath = function(a, d) {
            var e, f = null,
                g = null,
                h = [],
                i = a,
                d = d || a.getDocument().getBody();
            do
                if (i.type == CKEDITOR.NODE_ELEMENT) {
                    if (h.push(i), !this.lastElement && (this.lastElement = i, i.is(CKEDITOR.dtd.$object) || "false" == i.getAttribute("contenteditable"))) continue;
                    if (i.equals(d)) break;
                    if (!g && (e = i.getName(), "true" == i.getAttribute("contenteditable") ? g = i : !f && c[e] && (f = i), b[e])) {
                        var j;
                        if (j = !f) {
                            if (e = "div" == e) {
                                a: {
                                    e = i.getChildren(), j = 0;
                                    for (var k = e.count(); k > j; j++) {
                                        var l = e.getItem(j);
                                        if (l.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[l.getName()]) {
                                            e = !0;
                                            break a
                                        }
                                    }
                                    e = !1
                                }
                                e = !e
                            }
                            j = e
                        }
                        j ? f = i : g = i
                    }
                }
            while (i = i.getParent());
            g || (g = d), this.block = f, this.blockLimit = g, this.root = d, this.elements = h
        }
    }(), CKEDITOR.dom.elementPath.prototype = {
        compare: function(a) {
            var b = this.elements,
                a = a && a.elements;
            if (!a || b.length != a.length) return !1;
            for (var c = 0; c < b.length; c++)
                if (!b[c].equals(a[c])) return !1;
            return !0
        },
        contains: function(a, b, c) {
            var d;
            "string" == typeof a && (d = function(b) {
                return b.getName() == a
            }), a instanceof CKEDITOR.dom.element ? d = function(b) {
                return b.equals(a)
            } : CKEDITOR.tools.isArray(a) ? d = function(b) {
                return CKEDITOR.tools.indexOf(a, b.getName()) > -1
            } : "function" == typeof a ? d = a : "object" == typeof a && (d = function(b) {
                return b.getName() in a
            });
            var e = this.elements,
                f = e.length;
            for (b && f--, c && (e = Array.prototype.slice.call(e, 0), e.reverse()), b = 0; f > b; b++)
                if (d(e[b])) return e[b];
            return null
        },
        isContextFor: function(a) {
            var b;
            return a in CKEDITOR.dtd.$block ? (b = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit, !!b.getDtd()[a]) : !0
        },
        direction: function() {
            return (this.block || this.blockLimit || this.root).getDirection(1)
        }
    }, CKEDITOR.dom.text = function(a, b) {
        "string" == typeof a && (a = (b ? b.$ : document).createTextNode(a)), this.$ = a
    }, CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node, CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
        type: CKEDITOR.NODE_TEXT,
        getLength: function() {
            return this.$.nodeValue.length
        },
        getText: function() {
            return this.$.nodeValue
        },
        setText: function(a) {
            this.$.nodeValue = a
        },
        split: function(a) {
            var b = this.$.parentNode,
                c = b.childNodes.length,
                d = this.getLength(),
                e = this.getDocument(),
                f = new CKEDITOR.dom.text(this.$.splitText(a), e);
            return b.childNodes.length == c && (a >= d ? (f = e.createText(""), f.insertAfter(this)) : (a = e.createText(""), a.insertAfter(f), a.remove())), f
        },
        substring: function(a, b) {
            return "number" != typeof b ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, b)
        }
    }), function() {
        function a(a, b, c) {
            var d = a.serializable,
                e = b[c ? "endContainer" : "startContainer"],
                f = c ? "endOffset" : "startOffset",
                g = d ? b.document.getById(a.startNode) : a.startNode,
                a = d ? b.document.getById(a.endNode) : a.endNode;
            return e.equals(g.getPrevious()) ? (b.startOffset = b.startOffset - e.getLength() - a.getPrevious().getLength(), e = a.getNext()) : e.equals(a.getPrevious()) && (b.startOffset = b.startOffset - e.getLength(), e = a.getNext()), e.equals(g.getParent()) && b[f]++, e.equals(a.getParent()) && b[f]++, b[c ? "endContainer" : "startContainer"] = e, b
        }
        CKEDITOR.dom.rangeList = function(a) {
            return a instanceof CKEDITOR.dom.rangeList ? a : (a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [], CKEDITOR.tools.extend(a, b))
        };
        var b = {
            createIterator: function() {
                var a, b = this,
                    c = CKEDITOR.dom.walker.bookmark(),
                    d = [];
                return {
                    getNextRange: function(e) {
                        a = void 0 === a ? 0 : a + 1;
                        var f = b[a];
                        if (f && b.length > 1) {
                            if (!a)
                                for (var g = b.length - 1; g >= 0; g--) d.unshift(b[g].createBookmark(!0));
                            if (e)
                                for (var h = 0; b[a + h + 1];) {
                                    for (var i = f.document, e = 0, g = i.getById(d[h].endNode), i = i.getById(d[h + 1].startNode);;) {
                                        if (g = g.getNextSourceNode(!1), i.equals(g)) e = 1;
                                        else if (c(g) || g.type == CKEDITOR.NODE_ELEMENT && g.isBlockBoundary()) continue;
                                        break
                                    }
                                    if (!e) break;
                                    h++
                                }
                            for (f.moveToBookmark(d.shift()); h--;) g = b[++a], g.moveToBookmark(d.shift()), f.setEnd(g.endContainer, g.endOffset)
                        }
                        return f
                    }
                }
            },
            createBookmarks: function(b) {
                for (var c, d = [], e = 0; e < this.length; e++) {
                    d.push(c = this[e].createBookmark(b, !0));
                    for (var f = e + 1; f < this.length; f++) this[f] = a(c, this[f]), this[f] = a(c, this[f], !0)
                }
                return d
            },
            createBookmarks2: function(a) {
                for (var b = [], c = 0; c < this.length; c++) b.push(this[c].createBookmark2(a));
                return b
            },
            moveToBookmarks: function(a) {
                for (var b = 0; b < this.length; b++) this[b].moveToBookmark(a[b])
            }
        }
    }(), function() {
        function a() {
            return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
        }

        function b(b) {
            var c = CKEDITOR.skin["ua_" + b],
                d = CKEDITOR.env;
            if (c)
                for (var e, c = c.split(",").sort(function(a, b) {
                        return a > b ? -1 : 1
                    }), f = 0; f < c.length; f++)
                    if (e = c[f], d.ie && (e.replace(/^ie/, "") == d.version || d.quirks && "iequirks" == e) && (e = "ie"), d[e]) {
                        b += "_" + c[f];
                        break
                    }
            return CKEDITOR.getUrl(a() + b + ".css")
        }

        function c(a, c) {
            f[a] || (CKEDITOR.document.appendStyleSheet(b(a)), f[a] = 1), c && c()
        }

        function d(a) {
            var b = a.getById(g);
            return b || (b = a.getHead().append("style"), b.setAttribute("id", g), b.setAttribute("type", "text/css")), b
        }

        function e(a, b, c) {
            var d, e, f;
            if (CKEDITOR.env.webkit)
                for (b = b.split("}").slice(0, -1), e = 0; e < b.length; e++) b[e] = b[e].split("{");
            for (var g = 0; g < a.length; g++)
                if (CKEDITOR.env.webkit)
                    for (e = 0; e < b.length; e++) {
                        for (f = b[e][1], d = 0; d < c.length; d++) f = f.replace(c[d][0], c[d][1]);
                        a[g].$.sheet.addRule(b[e][0], f)
                    } else {
                        for (f = b, d = 0; d < c.length; d++) f = f.replace(c[d][0], c[d][1]);
                        CKEDITOR.env.ie && CKEDITOR.env.version < 11 ? a[g].$.styleSheet.cssText = a[g].$.styleSheet.cssText + f : a[g].$.innerHTML = a[g].$.innerHTML + f
                    }
        }
        var f = {};
        CKEDITOR.skin = {
            path: a,
            loadPart: function(b, d) {
                CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function() {
                    c(b, d)
                }) : c(b, d)
            },
            getPath: function(a) {
                return CKEDITOR.getUrl(b(a))
            },
            icons: {},
            addIcon: function(a, b, c, d) {
                a = a.toLowerCase(), this.icons[a] || (this.icons[a] = {
                    path: b,
                    offset: c || 0,
                    bgsize: d || "16px"
                })
            },
            getIconStyle: function(a, b, c, d, e) {
                var f;
                return a && (a = a.toLowerCase(), b && (f = this.icons[a + "-rtl"]), f || (f = this.icons[a])), a = c || f && f.path || "", d = d || f && f.offset, e = e || f && f.bgsize || "16px", a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;background-size:" + e + ";"
            }
        }, CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            getUiColor: function() {
                return this.uiColor
            },
            setUiColor: function(a) {
                var b = d(CKEDITOR.document);
                return (this.setUiColor = function(a) {
                    var c = CKEDITOR.skin.chameleon,
                        d = [
                            [i, a]
                        ];
                    this.uiColor = a, e([b], c(this, "editor"), d), e(h, c(this, "panel"), d)
                }).call(this, a)
            }
        });
        var g = "cke_ui_color",
            h = [],
            i = /\$color/g;
        CKEDITOR.on("instanceLoaded", function(a) {
            if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
                var b = a.editor,
                    a = function(a) {
                        if (a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument(), !a.getById("cke_ui_color")) {
                            a = d(a), h.push(a);
                            var c = b.getUiColor();
                            c && e([a], CKEDITOR.skin.chameleon(b, "panel"), [
                                [i, c]
                            ])
                        }
                    };
                b.on("panelShow", a), b.on("menuShow", a), b.config.uiColor && b.setUiColor(b.config.uiColor)
            }
        })
    }(), function() {
        if (CKEDITOR.env.webkit) CKEDITOR.env.hc = !1;
        else {
            var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0;height:0;position:absolute;left:-10000px;border:1px solid;border-color:red blue"></div>', CKEDITOR.document);
            a.appendTo(CKEDITOR.document.getHead());
            try {
                var b = a.getComputedStyle("border-top-color"),
                    c = a.getComputedStyle("border-right-color");
                CKEDITOR.env.hc = !(!b || b != c)
            } catch (d) {
                CKEDITOR.env.hc = !1
            }
            a.remove()
        }
        if (CKEDITOR.env.hc && (CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc"), CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}"), CKEDITOR.status = "loaded", CKEDITOR.fireOnce("loaded"), a = CKEDITOR._.pending)
            for (delete CKEDITOR._.pending, b = 0; b < a.length; b++) CKEDITOR.editor.prototype.constructor.apply(a[b][0], a[b][1]), CKEDITOR.add(a[b][0])
    }(), CKEDITOR.skin.name = "bootstrapck", CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko", CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8,opera", CKEDITOR.skin.chameleon = function() {
        var a = function() {
                return function(a, b) {
                    for (var c = a.match(/[^#]./g), d = 0; 3 > d; d++) {
                        var e, f = c,
                            g = d;
                        e = parseInt(c[d], 16), e = ("0" + (0 > b ? 0 | e * (1 + b) : 0 | e + (255 - e) * b).toString(16)).slice(-2), f[g] = e
                    }
                    return "#" + c.join("")
                }
            }(),
            b = function() {
                var a = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
                return function(b, c) {
                    return a.output({
                        from: b,
                        to: c
                    })
                }
            }(),
            c = {
                editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
                panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
            };
        return function(d, e) {
            var f = d.uiColor,
                f = {
                    id: "." + d.id,
                    defaultBorder: a(f, -.1),
                    defaultGradient: b(a(f, .9), f),
                    lightGradient: b(a(f, 1), a(f, .7)),
                    mediumGradient: b(a(f, .8), a(f, .5)),
                    ckeButtonOn: b(a(f, .6), a(f, .7)),
                    ckeResizer: a(f, -.4),
                    ckeToolbarSeparator: a(f, .5),
                    ckeColorauto: a(f, .8),
                    dialogBody: a(f, .7),
                    dialogTabSelected: b("#FFFFFF", "#FFFFFF"),
                    dialogTabSelectedBorder: "#FFF",
                    elementsPathColor: a(f, -.6),
                    elementsPathBg: f,
                    menubuttonIcon: a(f, .5),
                    menubuttonIconHover: a(f, .3)
                };
            return c[e].output(f).replace(/\[/g, "{").replace(/\]/g, "}")
        }
    }(), CKEDITOR.plugins.add("dialogui", {
        onLoad: function() {
            var a = function(a) {
                    this._ || (this._ = {}), this._["default"] = this._.initValue = a["default"] || "", this._.required = a.required || !1;
                    for (var b = [this._], c = 1; c < arguments.length; c++) b.push(arguments[c]);
                    return b.push(!0), CKEDITOR.tools.extend.apply(CKEDITOR.tools, b), this._
                },
                b = {
                    build: function(a, b, c) {
                        return new CKEDITOR.ui.dialog.textInput(a, b, c)
                    }
                },
                c = {
                    build: function(a, b, c) {
                        return new CKEDITOR.ui.dialog[b.type](a, b, c)
                    }
                },
                d = {
                    isChanged: function() {
                        return this.getValue() != this.getInitValue()
                    },
                    reset: function(a) {
                        this.setValue(this.getInitValue(), a)
                    },
                    setInitValue: function() {
                        this._.initValue = this.getValue()
                    },
                    resetInitValue: function() {
                        this._.initValue = this._["default"]
                    },
                    getInitValue: function() {
                        return this._.initValue
                    }
                },
                e = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
                    onChange: function(a, b) {
                        this._.domOnChangeRegistered || (a.on("load", function() {
                            this.getInputElement().on("change", function() {
                                a.parts.dialog.isVisible() && this.fire("change", {
                                    value: this.getValue()
                                })
                            }, this)
                        }, this), this._.domOnChangeRegistered = !0), this.on("change", b)
                    }
                }, !0),
                f = /^on([A-Z]\w+)/,
                g = function(a) {
                    for (var b in a)(f.test(b) || "title" == b || "type" == b) && delete a[b];
                    return a
                };
            CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
                labeledElement: function(b, c, d, e) {
                    if (!(4 > arguments.length)) {
                        var f = a.call(this, c);
                        f.labelId = CKEDITOR.tools.getNextId() + "_label", this._.children = [];
                        var g = {
                            role: c.role || "presentation"
                        };
                        c.includeLabel && (g["aria-labelledby"] = f.labelId), CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "div", null, g, function() {
                            var a = [],
                                d = c.required ? " cke_required" : "";
                            return "horizontal" != c.labelLayout ? a.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + f.labelId + '"', f.inputId ? ' for="' + f.inputId + '"' : "", (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", c.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', c.controlStyle ? ' style="' + c.controlStyle + '"' : "", ' role="presentation">', e.call(this, b, c), "</div>") : (d = {
                                type: "hbox",
                                widths: c.widths,
                                padding: 0,
                                children: [{
                                    type: "html",
                                    html: '<label class="cke_dialog_ui_labeled_label' + d + '" id="' + f.labelId + '" for="' + f.inputId + '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(c.label) + "</span>"
                                }, {
                                    type: "html",
                                    html: '<span class="cke_dialog_ui_labeled_content"' + (c.controlStyle ? ' style="' + c.controlStyle + '"' : "") + ">" + e.call(this, b, c) + "</span>"
                                }]
                            }, CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, a)), a.join("")
                        })
                    }
                },
                textInput: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        a.call(this, c);
                        var e = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput",
                            f = {
                                "class": "cke_dialog_ui_input_" + c.type,
                                id: e,
                                type: c.type
                            };
                        c.validate && (this.validate = c.validate), c.maxLength && (f.maxlength = c.maxLength), c.size && (f.size = c.size), c.inputStyle && (f.style = c.inputStyle);
                        var g = this,
                            h = !1;
                        b.on("load", function() {
                            g.getInputElement().on("keydown", function(a) {
                                13 == a.data.getKeystroke() && (h = !0)
                            }), g.getInputElement().on("keyup", function(a) {
                                13 == a.data.getKeystroke() && h && (b.getButton("ok") && setTimeout(function() {
                                    b.getButton("ok").click()
                                }, 0), h = !1)
                            }, null, null, 1e3)
                        }), CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
                            var a = ['<div class="cke_dialog_ui_input_', c.type, '" role="presentation"'];
                            c.width && a.push('style="width:' + c.width + '" '), a.push("><input "), f["aria-labelledby"] = this._.labelId, this._.required && (f["aria-required"] = this._.required);
                            for (var b in f) a.push(b + '="' + f[b] + '" ');
                            return a.push(" /></div>"), a.join("")
                        })
                    }
                },
                textarea: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        a.call(this, c);
                        var e = this,
                            f = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea",
                            g = {};
                        c.validate && (this.validate = c.validate), g.rows = c.rows || 5, g.cols = c.cols || 20, g["class"] = "cke_dialog_ui_input_textarea " + (c["class"] || ""), "undefined" != typeof c.inputStyle && (g.style = c.inputStyle), c.dir && (g.dir = c.dir), CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
                            g["aria-labelledby"] = this._.labelId, this._.required && (g["aria-required"] = this._.required);
                            var a, b = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', f, '" '];
                            for (a in g) b.push(a + '="' + CKEDITOR.tools.htmlEncode(g[a]) + '" ');
                            return b.push(">", CKEDITOR.tools.htmlEncode(e._["default"]), "</textarea></div>"), b.join("")
                        })
                    }
                },
                checkbox: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        var e = a.call(this, c, {
                            "default": !!c["default"]
                        });
                        c.validate && (this.validate = c.validate), CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "span", null, null, function() {
                            var a = CKEDITOR.tools.extend({}, c, {
                                    id: c.id ? c.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"
                                }, !0),
                                d = [],
                                f = CKEDITOR.tools.getNextId() + "_label",
                                h = {
                                    "class": "cke_dialog_ui_checkbox_input",
                                    type: "checkbox",
                                    "aria-labelledby": f
                                };
                            return g(a), c["default"] && (h.checked = "checked"), "undefined" != typeof a.inputStyle && (a.style = a.inputStyle), e.checkbox = new CKEDITOR.ui.dialog.uiElement(b, a, d, "input", null, h), d.push(' <label id="', f, '" for="', h.id, '"' + (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(c.label), "</label>"), d.join("")
                        })
                    }
                },
                radio: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        a.call(this, c), this._["default"] || (this._["default"] = this._.initValue = c.items[0][1]), c.validate && (this.validate = c.valdiate);
                        var e = [],
                            f = this;
                        c.role = "radiogroup", c.includeLabel = !0, CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
                            for (var a = [], d = [], h = (c.id ? c.id : CKEDITOR.tools.getNextId()) + "_radio", i = 0; i < c.items.length; i++) {
                                var j = c.items[i],
                                    k = void 0 !== j[2] ? j[2] : j[0],
                                    l = void 0 !== j[1] ? j[1] : j[0],
                                    m = CKEDITOR.tools.getNextId() + "_radio_input",
                                    n = m + "_label",
                                    m = CKEDITOR.tools.extend({}, c, {
                                        id: m,
                                        title: null,
                                        type: null
                                    }, !0),
                                    k = CKEDITOR.tools.extend({}, m, {
                                        title: k
                                    }, !0),
                                    o = {
                                        type: "radio",
                                        "class": "cke_dialog_ui_radio_input",
                                        name: h,
                                        value: l,
                                        "aria-labelledby": n
                                    },
                                    p = [];
                                f._["default"] == l && (o.checked = "checked"), g(m), g(k), "undefined" != typeof m.inputStyle && (m.style = m.inputStyle), m.keyboardFocusable = !0, e.push(new CKEDITOR.ui.dialog.uiElement(b, m, p, "input", null, o)), p.push(" "), new CKEDITOR.ui.dialog.uiElement(b, k, p, "label", null, {
                                    id: n,
                                    "for": o.id
                                }, j[0]), a.push(p.join(""))
                            }
                            return new CKEDITOR.ui.dialog.hbox(b, e, a, d), d.join("")
                        }), this._.children = e
                    }
                },
                button: function(b, c, d) {
                    if (arguments.length) {
                        "function" == typeof c && (c = c(b.getParentEditor())), a.call(this, c, {
                            disabled: c.disabled || !1
                        }), CKEDITOR.event.implementOn(this);
                        var e = this;
                        b.on("load", function() {
                            var a = this.getElement();
                            ! function() {
                                a.on("click", function(a) {
                                    e.click(), a.data.preventDefault()
                                }), a.on("keydown", function(a) {
                                    a.data.getKeystroke() in {
                                        32: 1
                                    } && (e.click(), a.data.preventDefault())
                                })
                            }(), a.unselectable()
                        }, this);
                        var f = CKEDITOR.tools.extend({}, c);
                        delete f.style;
                        var g = CKEDITOR.tools.getNextId() + "_label";
                        CKEDITOR.ui.dialog.uiElement.call(this, b, f, d, "a", null, {
                            style: c.style,
                            href: "javascript:void(0)",
                            title: c.label,
                            hidefocus: "true",
                            "class": c["class"],
                            role: "button",
                            "aria-labelledby": g
                        }, '<span id="' + g + '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(c.label) + "</span>")
                    }
                },
                select: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        var e = a.call(this, c);
                        c.validate && (this.validate = c.validate), e.inputId = CKEDITOR.tools.getNextId() + "_select", CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
                            var a = CKEDITOR.tools.extend({}, c, {
                                    id: c.id ? c.id + "_select" : CKEDITOR.tools.getNextId() + "_select"
                                }, !0),
                                d = [],
                                f = [],
                                h = {
                                    id: e.inputId,
                                    "class": "cke_dialog_ui_input_select",
                                    "aria-labelledby": this._.labelId
                                };
                            d.push('<div class="cke_dialog_ui_input_', c.type, '" role="presentation"'), c.width && d.push('style="width:' + c.width + '" '), d.push(">"), void 0 != c.size && (h.size = c.size), void 0 != c.multiple && (h.multiple = c.multiple), g(a);
                            for (var i, j = 0; j < c.items.length && (i = c.items[j]); j++) f.push('<option value="', CKEDITOR.tools.htmlEncode(void 0 !== i[1] ? i[1] : i[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(i[0]));
                            return "undefined" != typeof a.inputStyle && (a.style = a.inputStyle), e.select = new CKEDITOR.ui.dialog.uiElement(b, a, d, "select", null, h, f.join("")), d.push("</div>"), d.join("")
                        })
                    }
                },
                file: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        void 0 === c["default"] && (c["default"] = "");
                        var e = CKEDITOR.tools.extend(a.call(this, c), {
                            definition: c,
                            buttons: []
                        });
                        c.validate && (this.validate = c.validate), b.on("load", function() {
                            CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file")
                        }), CKEDITOR.ui.dialog.labeledElement.call(this, b, c, d, function() {
                            e.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
                            var a = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="', e.frameId, '" title="', c.label, '" src="javascript:void('];
                            return a.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0"), a.push(')"></iframe>'), a.join("")
                        })
                    }
                },
                fileButton: function(b, c, d) {
                    if (!(3 > arguments.length)) {
                        a.call(this, c);
                        var e = this;
                        c.validate && (this.validate = c.validate);
                        var f = CKEDITOR.tools.extend({}, c),
                            g = f.onClick;
                        f.className = (f.className ? f.className + " " : "") + "cke_dialog_ui_button", f.onClick = function(a) {
                            var d = c["for"];
                            g && g.call(this, a) === !1 || (b.getContentElement(d[0], d[1]).submit(), this.disable())
                        }, b.on("load", function() {
                            b.getContentElement(c["for"][0], c["for"][1])._.buttons.push(e)
                        }), CKEDITOR.ui.dialog.button.call(this, b, f, d)
                    }
                },
                html: function() {
                    var a = /^\s*<[\w:]+\s+([^>]*)?>/,
                        b = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
                        c = /\/$/;
                    return function(d, e, f) {
                        if (!(3 > arguments.length)) {
                            var g = [],
                                h = e.html;
                            "<" != h.charAt(0) && (h = "<span>" + h + "</span>");
                            var i = e.focus;
                            if (i) {
                                var j = this.focus;
                                this.focus = function() {
                                    ("function" == typeof i ? i : j).call(this), this.fire("focus")
                                }, e.isFocusable && (this.isFocusable = this.isFocusable), this.keyboardFocusable = !0
                            }
                            CKEDITOR.ui.dialog.uiElement.call(this, d, e, g, "span", null, null, ""), g = g.join("").match(a), h = h.match(b) || ["", "", ""], c.test(h[1]) && (h[1] = h[1].slice(0, -1), h[2] = "/" + h[2]), f.push([h[1], " ", g[1] || "", h[2]].join(""))
                        }
                    }
                }(),
                fieldset: function(a, b, c, d, e) {
                    var f = e.label;
                    this._ = {
                        children: b
                    }, CKEDITOR.ui.dialog.uiElement.call(this, a, e, d, "fieldset", null, null, function() {
                        var a = [];
                        f && a.push("<legend" + (e.labelStyle ? ' style="' + e.labelStyle + '"' : "") + ">" + f + "</legend>");
                        for (var b = 0; b < c.length; b++) a.push(c[b]);
                        return a.join("")
                    })
                }
            }, !0), CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement, CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                setLabel: function(a) {
                    var b = CKEDITOR.document.getById(this._.labelId);
                    return 1 > b.getChildCount() ? new CKEDITOR.dom.text(a, CKEDITOR.document).appendTo(b) : b.getChild(0).$.nodeValue = a, this
                },
                getLabel: function() {
                    var a = CKEDITOR.document.getById(this._.labelId);
                    return !a || 1 > a.getChildCount() ? "" : a.getChild(0).getText()
                },
                eventProcessors: e
            }, !0), CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                click: function() {
                    return this._.disabled ? !1 : this.fire("click", {
                        dialog: this._.dialog
                    })
                },
                enable: function() {
                    this._.disabled = !1;
                    var a = this.getElement();
                    a && a.removeClass("cke_disabled")
                },
                disable: function() {
                    this._.disabled = !0, this.getElement().addClass("cke_disabled")
                },
                isVisible: function() {
                    return this.getElement().getFirst().isVisible()
                },
                isEnabled: function() {
                    return !this._.disabled
                },
                eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
                    onClick: function(a, b) {
                        this.on("click", function() {
                            b.apply(this, arguments)
                        })
                    }
                }, !0),
                accessKeyUp: function() {
                    this.click()
                },
                accessKeyDown: function() {
                    this.focus()
                },
                keyboardFocusable: !0
            }, !0), CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
                getInputElement: function() {
                    return CKEDITOR.document.getById(this._.inputId)
                },
                focus: function() {
                    var a = this.selectParentTab();
                    setTimeout(function() {
                        var b = a.getInputElement();
                        b && b.$.focus()
                    }, 0)
                },
                select: function() {
                    var a = this.selectParentTab();
                    setTimeout(function() {
                        var b = a.getInputElement();
                        b && (b.$.focus(), b.$.select())
                    }, 0)
                },
                accessKeyUp: function() {
                    this.select()
                },
                setValue: function(a) {
                    return !a && (a = ""), CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments)
                },
                keyboardFocusable: !0
            }, d, !0), CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput, CKEDITOR.ui.dialog.select.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
                getInputElement: function() {
                    return this._.select.getElement()
                },
                add: function(a, b, c) {
                    var d = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document),
                        e = this.getInputElement().$;
                    return d.$.text = a, d.$.value = void 0 === b || null === b ? a : b, void 0 === c || null === c ? CKEDITOR.env.ie ? e.add(d.$) : e.add(d.$, null) : e.add(d.$, c), this
                },
                remove: function(a) {
                    return this.getInputElement().$.remove(a), this
                },
                clear: function() {
                    for (var a = this.getInputElement().$; 0 < a.length;) a.remove(0);
                    return this
                },
                keyboardFocusable: !0
            }, d, !0), CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                getInputElement: function() {
                    return this._.checkbox.getElement()
                },
                setValue: function(a, b) {
                    this.getInputElement().$.checked = a, !b && this.fire("change", {
                        value: a
                    })
                },
                getValue: function() {
                    return this.getInputElement().$.checked
                },
                accessKeyUp: function() {
                    this.setValue(!this.getValue())
                },
                eventProcessors: {
                    onChange: function(a, b) {
                        return !CKEDITOR.env.ie || 8 < CKEDITOR.env.version ? e.onChange.apply(this, arguments) : (a.on("load", function() {
                            var a = this._.checkbox.getElement();
                            a.on("propertychange", function(b) {
                                b = b.data.$, "checked" == b.propertyName && this.fire("change", {
                                    value: a.$.checked
                                })
                            }, this)
                        }, this), this.on("change", b), null)
                    }
                },
                keyboardFocusable: !0
            }, d, !0), CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                setValue: function(a, b) {
                    for (var c, d = this._.children, e = 0; e < d.length && (c = d[e]); e++) c.getElement().$.checked = c.getValue() == a;
                    !b && this.fire("change", {
                        value: a
                    })
                },
                getValue: function() {
                    for (var a = this._.children, b = 0; b < a.length; b++)
                        if (a[b].getElement().$.checked) return a[b].getValue();
                    return null
                },
                accessKeyUp: function() {
                    var a, b = this._.children;
                    for (a = 0; a < b.length; a++)
                        if (b[a].getElement().$.checked) return void b[a].getElement().focus();
                    b[0].getElement().focus()
                },
                eventProcessors: {
                    onChange: function(a, b) {
                        return CKEDITOR.env.ie ? (a.on("load", function() {
                            for (var a = this._.children, b = this, c = 0; c < a.length; c++) a[c].getElement().on("propertychange", function(a) {
                                a = a.data.$, "checked" == a.propertyName && this.$.checked && b.fire("change", {
                                    value: this.getAttribute("value")
                                })
                            })
                        }, this), this.on("change", b), null) : e.onChange.apply(this, arguments)
                    }
                }
            }, d, !0), CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, d, {
                getInputElement: function() {
                    var a = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
                    return 0 < a.$.forms.length ? new CKEDITOR.dom.element(a.$.forms[0].elements[0]) : this.getElement()
                },
                submit: function() {
                    return this.getInputElement().getParent().$.submit(), this
                },
                getAction: function() {
                    return this.getInputElement().getParent().$.action
                },
                registerEvents: function(a) {
                    var b, c, d = /^on([A-Z]\w+)/,
                        e = function(a, b, c, d) {
                            a.on("formLoaded", function() {
                                a.getInputElement().on(c, d, a)
                            })
                        };
                    for (c in a)(b = c.match(d)) && (this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, a[c]) : e(this, this._.dialog, b[1].toLowerCase(), a[c]));
                    return this
                },
                reset: function() {
                    function a() {
                        c.$.open();
                        var a = "";
                        d.size && (a = d.size - (CKEDITOR.env.ie ? 7 : 0));
                        var j = b.frameId + "_input";
                        for (c.$.write(['<html dir="' + h + '" lang="' + i + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + h + '" lang="' + i + '" action="', CKEDITOR.tools.htmlEncode(d.action), '"><label id="', b.labelId, '" for="', j, '" style="display:none">', CKEDITOR.tools.htmlEncode(d.label), '</label><input style="width:100%" id="', j, '" aria-labelledby="', b.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(d.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(a > 0 ? a : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + f + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + g + ")}", "</script>"].join("")), c.$.close(), a = 0; a < e.length; a++) e[a].enable()
                    }
                    var b = this._,
                        c = CKEDITOR.document.getById(b.frameId).getFrameDocument(),
                        d = b.definition,
                        e = b.buttons,
                        f = this.formLoadedNumber,
                        g = this.formUnloadNumber,
                        h = b.dialog._.editor.lang.dir,
                        i = b.dialog._.editor.langCode;
                    f || (f = this.formLoadedNumber = CKEDITOR.tools.addFunction(function() {
                        this.fire("formLoaded")
                    }, this), g = this.formUnloadNumber = CKEDITOR.tools.addFunction(function() {
                        this.getInputElement().clearCustomData()
                    }, this), this.getDialog()._.editor.on("destroy", function() {
                        CKEDITOR.tools.removeFunction(f), CKEDITOR.tools.removeFunction(g)
                    })), CKEDITOR.env.gecko ? setTimeout(a, 500) : a()
                },
                getValue: function() {
                    return this.getInputElement().$.value || ""
                },
                setInitValue: function() {
                    this._.initValue = ""
                },
                eventProcessors: {
                    onChange: function(a, b) {
                        this._.domOnChangeRegistered || (this.on("formLoaded", function() {
                            this.getInputElement().on("change", function() {
                                this.fire("change", {
                                    value: this.getValue()
                                })
                            }, this)
                        }, this), this._.domOnChangeRegistered = !0), this.on("change", b)
                    }
                },
                keyboardFocusable: !0
            }, !0), CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button, CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype), CKEDITOR.dialog.addUIElement("text", b), CKEDITOR.dialog.addUIElement("password", b), CKEDITOR.dialog.addUIElement("textarea", c), CKEDITOR.dialog.addUIElement("checkbox", c), CKEDITOR.dialog.addUIElement("radio", c), CKEDITOR.dialog.addUIElement("button", c), CKEDITOR.dialog.addUIElement("select", c), CKEDITOR.dialog.addUIElement("file", c), CKEDITOR.dialog.addUIElement("fileButton", c), CKEDITOR.dialog.addUIElement("html", c), CKEDITOR.dialog.addUIElement("fieldset", {
                build: function(a, b, c) {
                    for (var d, e = b.children, f = [], g = [], h = 0; h < e.length && (d = e[h]); h++) {
                        var i = [];
                        f.push(i), g.push(CKEDITOR.dialog._.uiElementBuilders[d.type].build(a, d, i))
                    }
                    return new CKEDITOR.ui.dialog[b.type](a, g, f, c, b)
                }
            })
        }
    }), CKEDITOR.DIALOG_RESIZE_NONE = 0, CKEDITOR.DIALOG_RESIZE_WIDTH = 1, CKEDITOR.DIALOG_RESIZE_HEIGHT = 2, CKEDITOR.DIALOG_RESIZE_BOTH = 3, function() {
        function a() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a, c = b - 1; c > b - a; c--)
                if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
            return null
        }

        function b() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId), c = b + 1; b + a > c; c++)
                if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight) return this._.tabIdList[c % a];
            return null
        }

        function c(a, b) {
            for (var c = a.$.getElementsByTagName("input"), d = 0, e = c.length; e > d; d++) {
                var f = new CKEDITOR.dom.element(c[d]);
                "text" == f.getAttribute("type").toLowerCase() && (b ? (f.setAttribute("value", f.getCustomData("fake_value") || ""), f.removeCustomData("fake_value")) : (f.setCustomData("fake_value", f.getAttribute("value")), f.setAttribute("value", "")))
            }
        }

        function d(a, b) {
            var c = this.getInputElement();
            c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", !0)), a || (this.select ? this.select() : this.focus()), b && alert(b), this.fire("validated", {
                valid: a,
                msg: b
            })
        }

        function e() {
            var a = this.getInputElement();
            a && a.removeAttribute("aria-invalid")
        }

        function f(a) {
            var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", p).output({
                    id: CKEDITOR.tools.getNextNumber(),
                    editorId: a.id,
                    langDir: a.lang.dir,
                    langCode: a.langCode,
                    editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
                    closeTitle: a.lang.common.close,
                    hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
                })),
                b = a.getChild([0, 0, 0, 0, 0]),
                c = b.getChild(0),
                d = b.getChild(1);
            if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                var e = "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
                CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + e + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
            }
            return c.unselectable(), d.unselectable(), {
                element: a,
                parts: {
                    dialog: a.getChild(0),
                    title: c,
                    close: d,
                    tabs: b.getChild(2),
                    contents: b.getChild([3, 0, 0, 0]),
                    footer: b.getChild([3, 0, 1, 0])
                }
            }
        }

        function g(a, b, c) {
            this.element = b, this.focusIndex = c, this.tabIndex = 0, this.isFocusable = function() {
                return !b.getAttribute("disabled") && b.isVisible()
            }, this.focus = function() {
                a._.currentFocusIndex = this.focusIndex, this.element.focus()
            }, b.on("keydown", function(a) {
                a.data.getKeystroke() in {
                    32: 1,
                    13: 1
                } && this.fire("click")
            }), b.on("focus", function() {
                this.fire("mouseover")
            }), b.on("blur", function() {
                this.fire("mouseout")
            })
        }

        function h(a) {
            function b() {
                a.layout()
            }
            var c = CKEDITOR.document.getWindow();
            c.on("resize", b), a.on("hide", function() {
                c.removeListener("resize", b)
            })
        }

        function i(a, b) {
            this._ = {
                dialog: a
            }, CKEDITOR.tools.extend(this, b)
        }

        function j(a) {
            function b(b) {
                var c = a.getSize(),
                    i = CKEDITOR.document.getWindow().getViewPaneSize(),
                    j = b.data.$.screenX,
                    k = b.data.$.screenY,
                    l = j - d.x,
                    m = k - d.y;
                d = {
                    x: j,
                    y: k
                }, e.x += l, e.y += m, a.move(e.x + h[3] < g ? -h[3] : e.x - h[1] > i.width - c.width - g ? i.width - c.width + ("rtl" == f.lang.dir ? 0 : h[1]) : e.x, e.y + h[0] < g ? -h[0] : e.y - h[2] > i.height - c.height - g ? i.height - c.height + h[2] : e.y, 1), b.data.preventDefault()
            }

            function c() {
                if (CKEDITOR.document.removeListener("mousemove", b), CKEDITOR.document.removeListener("mouseup", c), CKEDITOR.env.ie6Compat) {
                    var a = w.getChild(0).getFrameDocument();
                    a.removeListener("mousemove", b), a.removeListener("mouseup", c)
                }
            }
            var d = null,
                e = null;
            a.getElement().getFirst();
            var f = a.getParentEditor(),
                g = f.config.dialog_magnetDistance,
                h = CKEDITOR.skin.margins || [0, 0, 0, 0];
            "undefined" == typeof g && (g = 20), a.parts.title.on("mousedown", function(f) {
                if (d = {
                        x: f.data.$.screenX,
                        y: f.data.$.screenY
                    }, CKEDITOR.document.on("mousemove", b), CKEDITOR.document.on("mouseup", c), e = a.getPosition(), CKEDITOR.env.ie6Compat) {
                    var g = w.getChild(0).getFrameDocument();
                    g.on("mousemove", b), g.on("mouseup", c)
                }
                f.data.preventDefault()
            }, a)
        }

        function k(a) {
            function b(b) {
                var c = "rtl" == m.lang.dir,
                    l = k.width,
                    n = k.height,
                    o = l + (b.data.$.screenX - d) * (c ? -1 : 1) * (a._.moved ? 1 : 2),
                    p = n + (b.data.$.screenY - e) * (a._.moved ? 1 : 2),
                    q = a._.element.getFirst(),
                    q = c && q.getComputedStyle("right"),
                    r = a.getPosition();
                r.y + p > j.height && (p = j.height - r.y), (c ? q : r.x) + o > j.width && (o = j.width - (c ? q : r.x)), (g == CKEDITOR.DIALOG_RESIZE_WIDTH || g == CKEDITOR.DIALOG_RESIZE_BOTH) && (l = Math.max(f.minWidth || 0, o - h)), (g == CKEDITOR.DIALOG_RESIZE_HEIGHT || g == CKEDITOR.DIALOG_RESIZE_BOTH) && (n = Math.max(f.minHeight || 0, p - i)), a.resize(l, n), a._.moved || a.layout(), b.data.preventDefault()
            }

            function c() {
                if (CKEDITOR.document.removeListener("mouseup", c), CKEDITOR.document.removeListener("mousemove", b), l && (l.remove(), l = null), CKEDITOR.env.ie6Compat) {
                    var a = w.getChild(0).getFrameDocument();
                    a.removeListener("mouseup", c), a.removeListener("mousemove", b)
                }
            }
            var d, e, f = a.definition,
                g = f.resizable;
            if (g != CKEDITOR.DIALOG_RESIZE_NONE) {
                var h, i, j, k, l, m = a.getParentEditor(),
                    n = CKEDITOR.tools.addFunction(function(f) {
                        k = a.getSize();
                        var g = a.parts.contents;
                        g.$.getElementsByTagName("iframe").length && (l = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>'), g.append(l)), i = k.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.quirks)), h = k.width - a.parts.contents.getSize("width", 1), d = f.screenX, e = f.screenY, j = CKEDITOR.document.getWindow().getViewPaneSize(), CKEDITOR.document.on("mousemove", b), CKEDITOR.document.on("mouseup", c), CKEDITOR.env.ie6Compat && (g = w.getChild(0).getFrameDocument(), g.on("mousemove", b), g.on("mouseup", c)), f.preventDefault && f.preventDefault()
                    });
                a.on("load", function() {
                    var b = "";
                    g == CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : g == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical"), b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + m.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(m.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event )">' + ("ltr" == m.lang.dir ? "◢" : "◣") + "</div>"), a.parts.footer.append(b, 1)
                }), m.on("destroy", function() {
                    CKEDITOR.tools.removeFunction(n)
                })
            }
        }

        function l(a) {
            a.data.preventDefault(1)
        }

        function m(a) {
            var b = CKEDITOR.document.getWindow(),
                c = a.config,
                d = c.dialog_backgroundCoverColor || "white",
                e = c.dialog_backgroundCoverOpacity,
                f = c.baseFloatZIndex,
                c = CKEDITOR.tools.genKey(d, e, f),
                g = x[c];
            g ? g.show() : (f = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ? "absolute" : "fixed", "; z-index: ", f, "; top: 0px; left: 0px; ", CKEDITOR.env.ie6Compat ? "" : "background-color: " + d, '" class="cke_dialog_background_cover">'], CKEDITOR.env.ie6Compat && (d = "<html><body style=\\'background-color:" + d + ";\\'></body></html>", f.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:'), f.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + d + "' );document.close();") + "})())"), f.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')), f.push("</div>"), g = CKEDITOR.dom.element.createFromHtml(f.join("")), g.setOpacity(void 0 != e ? e : .5), g.on("keydown", l), g.on("keypress", l), g.on("keyup", l), g.appendTo(CKEDITOR.document.getBody()), x[c] = g), a.focusManager.add(g), w = g;
            var a = function() {
                    var a = b.getViewPaneSize();
                    g.setStyles({
                        width: a.width + "px",
                        height: a.height + "px"
                    })
                },
                h = function() {
                    var a = b.getScrollPosition(),
                        c = CKEDITOR.dialog._.currentTop;
                    if (g.setStyles({
                            left: a.x + "px",
                            top: a.y + "px"
                        }), c)
                        do a = c.getPosition(), c.move(a.x, a.y); while (c = c._.parentDialog)
                };
            if (v = a, b.on("resize", a), a(), (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && g.focus(), CKEDITOR.env.ie6Compat) {
                var i = function() {
                    h(), arguments.callee.prevScrollHandler.apply(this, arguments)
                };
                b.$.setTimeout(function() {
                    i.prevScrollHandler = window.onscroll || function() {}, window.onscroll = i
                }, 0), h()
            }
        }

        function n(a) {
            w && (a.focusManager.remove(w), a = CKEDITOR.document.getWindow(), w.hide(), a.removeListener("resize", v), CKEDITOR.env.ie6Compat && a.$.setTimeout(function() {
                window.onscroll = window.onscroll && window.onscroll.prevScrollHandler || null
            }, 0), v = null)
        }
        var o = CKEDITOR.tools.cssLength,
            p = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
        CKEDITOR.dialog = function(c, g) {
            function h() {
                var a = x._.focusList;
                a.sort(function(a, b) {
                    return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
                });
                for (var b = a.length, c = 0; b > c; c++) a[c].focusIndex = c
            }

            function i(a) {
                var b = x._.focusList,
                    a = a || 0;
                if (!(1 > b.length)) {
                    var c = x._.currentFocusIndex;
                    try {
                        b[c].getInputElement().$.blur()
                    } catch (d) {}
                    for (var e = c = (c + a + b.length) % b.length; a && !b[e].isFocusable() && (e = (e + a + b.length) % b.length, !(e == c)););
                    b[e].focus(), "text" == b[e].type && b[e].select()
                }
            }

            function l(d) {
                if (x == CKEDITOR.dialog._.currentTop) {
                    var e = d.data.getKeystroke(),
                        f = "rtl" == c.lang.dir;
                    if (n = o = 0, 9 == e || e == CKEDITOR.SHIFT + 9) e = e == CKEDITOR.SHIFT + 9, x._.tabBarMode ? (e = e ? a.call(x) : b.call(x), x.selectPage(e), x._.tabs[e][0].focus()) : i(e ? -1 : 1), n = 1;
                    else if (e == CKEDITOR.ALT + 121 && !x._.tabBarMode && 1 < x.getPageCount()) x._.tabBarMode = !0, x._.tabs[x._.currentTabId][0].focus(), n = 1;
                    else if (37 != e && 39 != e || !x._.tabBarMode)
                        if (13 != e && 32 != e || !x._.tabBarMode)
                            if (13 == e) e = d.data.getTarget(), e.is("a", "button", "select", "textarea") || e.is("input") && "button" == e.$.type || ((e = this.getButton("ok")) && CKEDITOR.tools.setTimeout(e.click, 0, e), n = 1), o = 1;
                            else {
                                if (27 != e) return;
                                (e = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(e.click, 0, e): !1 !== this.fire("cancel", {
                                    hide: !0
                                }).hide && this.hide(), o = 1
                            } else this.selectPage(this._.currentTabId), this._.tabBarMode = !1, this._.currentFocusIndex = -1, i(1), n = 1;
                    else e = e == (f ? 39 : 37) ? a.call(x) : b.call(x), x.selectPage(e), x._.tabs[e][0].focus(), n = 1;
                    m(d)
                }
            }

            function m(a) {
                n ? a.data.preventDefault(1) : o && a.data.stopPropagation()
            }
            var n, o, p = CKEDITOR.dialog._.dialogDefinitions[g],
                r = CKEDITOR.tools.clone(q),
                s = c.config.dialog_buttonsOrder || "OS",
                t = c.lang.dir,
                v = {};
            if (("OS" == s && CKEDITOR.env.mac || "rtl" == s && "ltr" == t || "ltr" == s && "rtl" == t) && r.buttons.reverse(), p = CKEDITOR.tools.extend(p(c), r), p = CKEDITOR.tools.clone(p), p = new u(this, p), r = f(c), this._ = {
                    editor: c,
                    element: r.element,
                    name: g,
                    contentSize: {
                        width: 0,
                        height: 0
                    },
                    size: {
                        width: 0,
                        height: 0
                    },
                    contents: {},
                    buttons: {},
                    accessKeyMap: {},
                    tabs: {},
                    tabIdList: [],
                    currentTabId: null,
                    currentTabIndex: null,
                    pageCount: 0,
                    lastTab: null,
                    tabBarMode: !1,
                    focusList: [],
                    currentFocusIndex: 0,
                    hasFocus: !1
                }, this.parts = r.parts, CKEDITOR.tools.setTimeout(function() {
                    c.fire("ariaWidget", this.parts.contents)
                }, 0, this), r = {
                    position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed",
                    top: 0,
                    visibility: "hidden"
                }, r["rtl" == t ? "right" : "left"] = 0, this.parts.dialog.setStyles(r), CKEDITOR.event.call(this), this.definition = p = CKEDITOR.fire("dialogDefinition", {
                    name: g,
                    definition: p
                }, c).definition, !("removeDialogTabs" in c._) && c.config.removeDialogTabs) {
                for (r = c.config.removeDialogTabs.split(";"), t = 0; t < r.length; t++)
                    if (s = r[t].split(":"), 2 == s.length) {
                        var w = s[0];
                        v[w] || (v[w] = []), v[w].push(s[1])
                    }
                c._.removeDialogTabs = v
            }
            if (c._.removeDialogTabs && (v = c._.removeDialogTabs[g]))
                for (t = 0; t < v.length; t++) p.removeContents(v[t]);
            p.onLoad && this.on("load", p.onLoad), p.onShow && this.on("show", p.onShow), p.onHide && this.on("hide", p.onHide), p.onOk && this.on("ok", function(a) {
                c.fire("saveSnapshot"), setTimeout(function() {
                    c.fire("saveSnapshot")
                }, 0), !1 === p.onOk.call(this, a) && (a.data.hide = !1)
            }), p.onCancel && this.on("cancel", function(a) {
                !1 === p.onCancel.call(this, a) && (a.data.hide = !1)
            });
            var x = this,
                y = function(a) {
                    var b, c = x._.contents,
                        d = !1;
                    for (b in c)
                        for (var e in c[b])
                            if (d = a.call(this, c[b][e])) return
                };
            this.on("ok", function(a) {
                y(function(b) {
                    if (b.validate) {
                        var c = b.validate(this),
                            e = "string" == typeof c || !1 === c;
                        return e && (a.data.hide = !1, a.stop()), d.call(b, !e, "string" == typeof c ? c : void 0), e
                    }
                })
            }, this, null, 0), this.on("cancel", function(a) {
                y(function(b) {
                    return b.isChanged() ? (!c.config.dialog_noConfirmCancel && !confirm(c.lang.common.confirmCancel) && (a.data.hide = !1), !0) : void 0
                })
            }, this, null, 0), this.parts.close.on("click", function(a) {
                !1 !== this.fire("cancel", {
                    hide: !0
                }).hide && this.hide(), a.data.preventDefault()
            }, this), this.changeFocus = i;
            var z = this._.element;
            for (c.focusManager.add(z, 1), this.on("show", function() {
                    z.on("keydown", l, this), CKEDITOR.env.gecko && z.on("keypress", m, this)
                }), this.on("hide", function() {
                    z.removeListener("keydown", l), CKEDITOR.env.gecko && z.removeListener("keypress", m), y(function(a) {
                        e.apply(a)
                    })
                }), this.on("iframeAdded", function(a) {
                    new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document).on("keydown", l, this, null, 0)
                }), this.on("show", function() {
                    if (h(), c.config.dialog_startupFocusTab && 1 < x._.pageCount) x._.tabBarMode = !0, x._.tabs[x._.currentTabId][0].focus();
                    else if (!this._.hasFocus)
                        if (this._.currentFocusIndex = -1, p.onFocus) {
                            var a = p.onFocus.call(this);
                            a && a.focus()
                        } else i(1)
                }, this, null, 4294967295), CKEDITOR.env.ie6Compat && this.on("load", function() {
                    var a = this.getElement(),
                        b = a.getFirst();
                    b.remove(), b.appendTo(a)
                }, this), j(this), k(this), new CKEDITOR.dom.text(p.title, CKEDITOR.document).appendTo(this.parts.title), t = 0; t < p.contents.length; t++)(v = p.contents[t]) && this.addPage(v);
            for (this.parts.tabs.on("click", function(a) {
                    var b = a.data.getTarget();
                    b.hasClass("cke_dialog_tab") && (b = b.$.id, this.selectPage(b.substring(4, b.lastIndexOf("_"))), this._.tabBarMode && (this._.tabBarMode = !1, this._.currentFocusIndex = -1, i(1)), a.data.preventDefault())
                }, this), t = [], v = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
                    type: "hbox",
                    className: "cke_dialog_footer_buttons",
                    widths: [],
                    children: p.buttons
                }, t).getChild(), this.parts.footer.setHtml(t.join("")), t = 0; t < v.length; t++) this._.buttons[v[t].id] = v[t]
        }, CKEDITOR.dialog.prototype = {
            destroy: function() {
                this.hide(), this._.element.remove()
            },
            resize: function() {
                return function(a, b) {
                    this._.contentSize && this._.contentSize.width == a && this._.contentSize.height == b || (CKEDITOR.dialog.fire("resize", {
                        dialog: this,
                        width: a,
                        height: b
                    }, this._.editor), this.fire("resize", {
                        width: a,
                        height: b
                    }, this._.editor), this.parts.contents.setStyles({
                        width: a + "px",
                        height: b + "px"
                    }), "rtl" == this._.editor.lang.dir && this._.position && (this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10)), this._.contentSize = {
                        width: a,
                        height: b
                    })
                }
            }(),
            getSize: function() {
                var a = this._.element.getFirst();
                return {
                    width: a.$.offsetWidth || 0,
                    height: a.$.offsetHeight || 0
                }
            },
            move: function(a, b, c) {
                var d = this._.element.getFirst(),
                    e = "rtl" == this._.editor.lang.dir,
                    f = "fixed" == d.getComputedStyle("position");
                CKEDITOR.env.ie && d.setStyle("zoom", "100%"), f && this._.position && this._.position.x == a && this._.position.y == b || (this._.position = {
                    x: a,
                    y: b
                }, f || (f = CKEDITOR.document.getWindow().getScrollPosition(), a += f.x, b += f.y), e && (f = this.getSize(), a = CKEDITOR.document.getWindow().getViewPaneSize().width - f.width - a), b = {
                    top: (b > 0 ? b : 0) + "px"
                }, b[e ? "right" : "left"] = (a > 0 ? a : 0) + "px", d.setStyles(b), c && (this._.moved = 1))
            },
            getPosition: function() {
                return CKEDITOR.tools.extend({}, this._.position)
            },
            show: function() {
                var a = this._.element,
                    b = this.definition;
                a.getParent() && a.getParent().equals(CKEDITOR.document.getBody()) ? a.setStyle("display", "block") : a.appendTo(CKEDITOR.document.getBody()), this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight), this.reset(), this.selectPage(this.definition.contents[0].id), null === CKEDITOR.dialog._.currentZIndex && (CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex), this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex += 10), null === CKEDITOR.dialog._.currentTop ? (CKEDITOR.dialog._.currentTop = this, this._.parentDialog = null, m(this._.editor)) : (this._.parentDialog = CKEDITOR.dialog._.currentTop, this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex / 2),
                    CKEDITOR.dialog._.currentTop = this), a.on("keydown", z), a.on("keyup", A), this._.hasFocus = !1;
                for (var c in b.contents)
                    if (b.contents[c]) {
                        var a = b.contents[c],
                            d = this._.tabs[a.id],
                            e = a.requiredContent,
                            f = 0;
                        if (d) {
                            for (var g in this._.contents[a.id]) {
                                var i = this._.contents[a.id][g];
                                "hbox" == i.type || "vbox" == i.type || !i.getInputElement() || (i.requiredContent && !this._.editor.activeFilter.check(i.requiredContent) ? i.disable() : (i.enable(), f++))
                            }!f || e && !this._.editor.activeFilter.check(e) ? d[0].addClass("cke_dialog_tab_disabled") : d[0].removeClass("cke_dialog_tab_disabled")
                        }
                    }
                CKEDITOR.tools.setTimeout(function() {
                    this.layout(), h(this), this.parts.dialog.setStyle("visibility", ""), this.fireOnce("load", {}), CKEDITOR.ui.fire("ready", this), this.fire("show", {}), this._.editor.fire("dialogShow", this), this._.parentDialog || this._.editor.focusManager.lock(), this.foreach(function(a) {
                        a.setInitValue && a.setInitValue()
                    })
                }, 100, this)
            },
            layout: function() {
                var a = this.parts.dialog,
                    b = this.getSize(),
                    c = CKEDITOR.document.getWindow().getViewPaneSize(),
                    d = (c.width - b.width) / 2,
                    e = (c.height - b.height) / 2;
                CKEDITOR.env.ie6Compat || (b.height + (e > 0 ? e : 0) > c.height || b.width + (d > 0 ? d : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed")), this.move(this._.moved ? this._.position.x : d, this._.moved ? this._.position.y : e)
            },
            foreach: function(a) {
                for (var b in this._.contents)
                    for (var c in this._.contents[b]) a.call(this, this._.contents[b][c]);
                return this
            },
            reset: function() {
                var a = function(a) {
                    a.reset && a.reset(1)
                };
                return function() {
                    return this.foreach(a), this
                }
            }(),
            setupContent: function() {
                var a = arguments;
                this.foreach(function(b) {
                    b.setup && b.setup.apply(b, a)
                })
            },
            commitContent: function() {
                var a = arguments;
                this.foreach(function(b) {
                    CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur(), b.commit && b.commit.apply(b, a)
                })
            },
            hide: function() {
                if (this.parts.dialog.isVisible()) {
                    this.fire("hide", {}), this._.editor.fire("dialogHide", this), this.selectPage(this._.tabIdList[0]);
                    var a = this._.element;
                    for (a.setStyle("display", "none"), this.parts.dialog.setStyle("visibility", "hidden"), C(this); CKEDITOR.dialog._.currentTop != this;) CKEDITOR.dialog._.currentTop.hide();
                    if (this._.parentDialog) {
                        var b = this._.parentDialog.getElement().getFirst();
                        b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
                    } else n(this._.editor);
                    if (CKEDITOR.dialog._.currentTop = this._.parentDialog) CKEDITOR.dialog._.currentZIndex -= 10;
                    else {
                        CKEDITOR.dialog._.currentZIndex = null, a.removeListener("keydown", z), a.removeListener("keyup", A);
                        var c = this._.editor;
                        c.focus(), setTimeout(function() {
                            c.focusManager.unlock(), CKEDITOR.env.iOS && c.window.focus()
                        }, 0)
                    }
                    delete this._.parentDialog, this.foreach(function(a) {
                        a.resetInitValue && a.resetInitValue()
                    })
                }
            },
            addPage: function(a) {
                if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
                    for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "", d = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
                            type: "vbox",
                            className: "cke_dialog_page_contents",
                            children: a.elements,
                            expand: !!a.expand,
                            padding: a.padding,
                            style: a.style || "width: 100%;"
                        }, b), e = this._.contents[a.id] = {}, f = d.getChild(), g = 0; d = f.shift();) !d.notAllowed && "hbox" != d.type && "vbox" != d.type && g++, e[d.id] = d, "function" == typeof d.getChild && f.push.apply(f, d.getChild());
                    g || (a.hidden = !0), b = CKEDITOR.dom.element.createFromHtml(b.join("")), b.setAttribute("role", "tabpanel"), d = CKEDITOR.env, e = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber(), c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', 0 < this._.pageCount ? " cke_last" : "cke_first", c, a.hidden ? ' style="display:none"' : "", ' id="', e, '"', d.gecko && !d.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join("")), b.setAttribute("aria-labelledby", e), this._.tabs[a.id] = [c, b], this._.tabIdList.push(a.id), !a.hidden && this._.pageCount++, this._.lastTab = c, this.updateStyle(), b.setAttribute("name", a.id), b.appendTo(this.parts.contents), c.unselectable(), this.parts.tabs.append(c), a.accessKey && (B(this, this, "CTRL+" + a.accessKey, E, D), this._.accessKeyMap["CTRL+" + a.accessKey] = a.id)
                }
            },
            selectPage: function(a) {
                if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && !1 !== this.fire("selectPage", {
                        page: a,
                        currentPage: this._.currentTabId
                    })) {
                    for (var b in this._.tabs) {
                        var d = this._.tabs[b][0],
                            e = this._.tabs[b][1];
                        b != a && (d.removeClass("cke_dialog_tab_selected"), e.hide()), e.setAttribute("aria-hidden", b != a)
                    }
                    var f = this._.tabs[a];
                    f[0].addClass("cke_dialog_tab_selected"), CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ? (c(f[1]), f[1].show(), setTimeout(function() {
                        c(f[1], 1)
                    }, 0)) : f[1].show(), this._.currentTabId = a, this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
                }
            },
            updateStyle: function() {
                this.parts.dialog[(1 === this._.pageCount ? "add" : "remove") + "Class"]("cke_single_page")
            },
            hidePage: function(b) {
                var c = this._.tabs[b] && this._.tabs[b][0];
                c && 1 != this._.pageCount && c.isVisible() && (b == this._.currentTabId && this.selectPage(a.call(this)), c.hide(), this._.pageCount--, this.updateStyle())
            },
            showPage: function(a) {
                (a = this._.tabs[a] && this._.tabs[a][0]) && (a.show(), this._.pageCount++, this.updateStyle())
            },
            getElement: function() {
                return this._.element
            },
            getName: function() {
                return this._.name
            },
            getContentElement: function(a, b) {
                var c = this._.contents[a];
                return c && c[b]
            },
            getValueOf: function(a, b) {
                return this.getContentElement(a, b).getValue()
            },
            setValueOf: function(a, b, c) {
                return this.getContentElement(a, b).setValue(c)
            },
            getButton: function(a) {
                return this._.buttons[a]
            },
            click: function(a) {
                return this._.buttons[a].click()
            },
            disableButton: function(a) {
                return this._.buttons[a].disable()
            },
            enableButton: function(a) {
                return this._.buttons[a].enable()
            },
            getPageCount: function() {
                return this._.pageCount
            },
            getParentEditor: function() {
                return this._.editor
            },
            getSelectedElement: function() {
                return this.getParentEditor().getSelection().getSelectedElement()
            },
            addFocusable: function(a, b) {
                if ("undefined" == typeof b) b = this._.focusList.length, this._.focusList.push(new g(this, a, b));
                else {
                    this._.focusList.splice(b, 0, new g(this, a, b));
                    for (var c = b + 1; c < this._.focusList.length; c++) this._.focusList[c].focusIndex++
                }
            }
        }, CKEDITOR.tools.extend(CKEDITOR.dialog, {
            add: function(a, b) {
                this._.dialogDefinitions[a] && "function" != typeof b || (this._.dialogDefinitions[a] = b)
            },
            exists: function(a) {
                return !!this._.dialogDefinitions[a]
            },
            getCurrent: function() {
                return CKEDITOR.dialog._.currentTop
            },
            isTabEnabled: function(a, b, c) {
                return a = a.config.removeDialogTabs, !(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
            },
            okButton: function() {
                var a = function(a, b) {
                    return b = b || {}, CKEDITOR.tools.extend({
                        id: "ok",
                        type: "button",
                        label: a.lang.common.ok,
                        "class": "cke_dialog_ui_button_ok",
                        onClick: function(a) {
                            a = a.data.dialog, !1 !== a.fire("ok", {
                                hide: !0
                            }).hide && a.hide()
                        }
                    }, b, !0)
                };
                return a.type = "button", a.override = function(b) {
                    return CKEDITOR.tools.extend(function(c) {
                        return a(c, b)
                    }, {
                        type: "button"
                    }, !0)
                }, a
            }(),
            cancelButton: function() {
                var a = function(a, b) {
                    return b = b || {}, CKEDITOR.tools.extend({
                        id: "cancel",
                        type: "button",
                        label: a.lang.common.cancel,
                        "class": "cke_dialog_ui_button_cancel",
                        onClick: function(a) {
                            a = a.data.dialog, !1 !== a.fire("cancel", {
                                hide: !0
                            }).hide && a.hide()
                        }
                    }, b, !0)
                };
                return a.type = "button", a.override = function(b) {
                    return CKEDITOR.tools.extend(function(c) {
                        return a(c, b)
                    }, {
                        type: "button"
                    }, !0)
                }, a
            }(),
            addUIElement: function(a, b) {
                this._.uiElementBuilders[a] = b
            }
        }), CKEDITOR.dialog._ = {
            uiElementBuilders: {},
            dialogDefinitions: {},
            currentTop: null,
            currentZIndex: null
        }, CKEDITOR.event.implementOn(CKEDITOR.dialog), CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
        var q = {
                resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
                minWidth: 600,
                minHeight: 400,
                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
            },
            r = function(a, b, c) {
                for (var d, e = 0; d = a[e]; e++)
                    if (d.id == b || c && d[c] && (d = r(d[c], b, c))) return d;
                return null
            },
            s = function(a, b, c, d, e) {
                if (c) {
                    for (var f, g = 0; f = a[g]; g++) {
                        if (f.id == c) return a.splice(g, 0, b), b;
                        if (d && f[d] && (f = s(f[d], b, c, d, !0))) return f
                    }
                    if (e) return null
                }
                return a.push(b), b
            },
            t = function(a, b, c) {
                for (var d, e = 0; d = a[e]; e++) {
                    if (d.id == b) return a.splice(e, 1);
                    if (c && d[c] && (d = t(d[c], b, c))) return d
                }
                return null
            },
            u = function(a, b) {
                this.dialog = a;
                for (var c, d = b.contents, e = 0; c = d[e]; e++) d[e] = c && new i(a, c);
                CKEDITOR.tools.extend(this, b)
            };
        u.prototype = {
            getContents: function(a) {
                return r(this.contents, a)
            },
            getButton: function(a) {
                return r(this.buttons, a)
            },
            addContents: function(a, b) {
                return s(this.contents, a, b)
            },
            addButton: function(a, b) {
                return s(this.buttons, a, b)
            },
            removeContents: function(a) {
                t(this.contents, a)
            },
            removeButton: function(a) {
                t(this.buttons, a)
            }
        }, i.prototype = {
            get: function(a) {
                return r(this.elements, a, "children")
            },
            add: function(a, b) {
                return s(this.elements, a, b, "children")
            },
            remove: function(a) {
                t(this.elements, a, "children")
            }
        };
        var v, w, x = {},
            y = {},
            z = function(a) {
                var b = a.data.$.ctrlKey || a.data.$.metaKey,
                    c = a.data.$.altKey,
                    d = a.data.$.shiftKey,
                    e = String.fromCharCode(a.data.$.keyCode);
                (b = y[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + e]) && b.length && (b = b[b.length - 1], b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key), a.data.preventDefault())
            },
            A = function(a) {
                var b = a.data.$.ctrlKey || a.data.$.metaKey,
                    c = a.data.$.altKey,
                    d = a.data.$.shiftKey,
                    e = String.fromCharCode(a.data.$.keyCode);
                (b = y[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (d ? "SHIFT+" : "") + e]) && b.length && (b = b[b.length - 1], b.keyup && (b.keyup.call(b.uiElement, b.dialog, b.key), a.data.preventDefault()))
            },
            B = function(a, b, c, d, e) {
                (y[c] || (y[c] = [])).push({
                    uiElement: a,
                    dialog: b,
                    key: c,
                    keyup: e || a.accessKeyUp,
                    keydown: d || a.accessKeyDown
                })
            },
            C = function(a) {
                for (var b in y) {
                    for (var c = y[b], d = c.length - 1; d >= 0; d--)(c[d].dialog == a || c[d].uiElement == a) && c.splice(d, 1);
                    0 === c.length && delete y[b]
                }
            },
            D = function(a, b) {
                a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
            },
            E = function() {};
        ! function() {
            CKEDITOR.ui.dialog = {
                uiElement: function(a, b, c, d, e, f, g) {
                    if (!(4 > arguments.length)) {
                        var h = (d.call ? d(b) : d) || "div",
                            i = ["<", h, " "],
                            j = (e && e.call ? e(b) : e) || {},
                            k = (f && f.call ? f(b) : f) || {},
                            l = (g && g.call ? g.call(this, a, b) : g) || "",
                            m = this.domId = k.id || CKEDITOR.tools.getNextId() + "_uiElement";
                        this.id = b.id, b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent) && (j.display = "none", this.notAllowed = !0), k.id = m;
                        var n = {};
                        b.type && (n["cke_dialog_ui_" + b.type] = 1), b.className && (n[b.className] = 1), b.disabled && (n.cke_disabled = 1);
                        for (var o = k["class"] && k["class"].split ? k["class"].split(" ") : [], m = 0; m < o.length; m++) o[m] && (n[o[m]] = 1);
                        o = [];
                        for (m in n) o.push(m);
                        k["class"] = o.join(" "), b.title && (k.title = b.title), n = (b.style || "").split(";"), b.align && (o = b.align, j["margin-left"] = "left" == o ? 0 : "auto", j["margin-right"] = "right" == o ? 0 : "auto");
                        for (m in j) n.push(m + ":" + j[m]);
                        for (b.hidden && n.push("display:none"), m = n.length - 1; m >= 0; m--) "" === n[m] && n.splice(m, 1);
                        0 < n.length && (k.style = (k.style ? k.style + "; " : "") + n.join("; "));
                        for (m in k) i.push(m + '="' + CKEDITOR.tools.htmlEncode(k[m]) + '" ');
                        i.push(">", l, "</", h, ">"), c.push(i.join("")), (this._ || (this._ = {})).dialog = a, "boolean" == typeof b.isChanged && (this.isChanged = function() {
                            return b.isChanged
                        }), "function" == typeof b.isChanged && (this.isChanged = b.isChanged), "function" == typeof b.setValue && (this.setValue = CKEDITOR.tools.override(this.setValue, function(a) {
                            return function(c) {
                                a.call(this, b.setValue.call(this, c))
                            }
                        })), "function" == typeof b.getValue && (this.getValue = CKEDITOR.tools.override(this.getValue, function(a) {
                            return function() {
                                return b.getValue.call(this, a.call(this))
                            }
                        })), CKEDITOR.event.implementOn(this), this.registerEvents(b), this.accessKeyUp && this.accessKeyDown && b.accessKey && B(this, a, "CTRL+" + b.accessKey);
                        var p = this;
                        a.on("load", function() {
                            var b = p.getInputElement();
                            if (b) {
                                var c = p.type in {
                                    checkbox: 1,
                                    ratio: 1
                                } && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
                                b.on("focus", function() {
                                    a._.tabBarMode = !1, a._.hasFocus = !0, p.fire("focus"), c && this.addClass(c)
                                }), b.on("blur", function() {
                                    p.fire("blur"), c && this.removeClass(c)
                                })
                            }
                        }), CKEDITOR.tools.extend(this, b), this.keyboardFocusable && (this.tabIndex = b.tabIndex || 0, this.focusIndex = a._.focusList.push(this) - 1, this.on("focus", function() {
                            a._.currentFocusIndex = p.focusIndex
                        }))
                    }
                },
                hbox: function(a, b, c, d, e) {
                    if (!(4 > arguments.length)) {
                        this._ || (this._ = {});
                        var f, g = this._.children = b,
                            h = e && e.widths || null,
                            i = e && e.height || null,
                            j = {
                                role: "presentation"
                            };
                        e && e.align && (j.align = e.align), CKEDITOR.ui.dialog.uiElement.call(this, a, e || {
                            type: "hbox"
                        }, d, "table", {}, j, function() {
                            var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                            for (f = 0; f < c.length; f++) {
                                var b = "cke_dialog_ui_hbox_child",
                                    d = [];
                                0 === f && (b = "cke_dialog_ui_hbox_first"), f == c.length - 1 && (b = "cke_dialog_ui_hbox_last"), a.push('<td class="', b, '" role="presentation" '), h ? h[f] && d.push("width:" + o(h[f])) : d.push("width:" + Math.floor(100 / c.length) + "%"), i && d.push("height:" + o(i)), e && void 0 != e.padding && d.push("padding:" + o(e.padding)), CKEDITOR.env.ie && CKEDITOR.env.quirks && g[f].align && d.push("text-align:" + g[f].align), 0 < d.length && a.push('style="' + d.join("; ") + '" '), a.push(">", c[f], "</td>")
                            }
                            return a.push("</tr></tbody>"), a.join("")
                        })
                    }
                },
                vbox: function(a, b, c, d, e) {
                    if (!(3 > arguments.length)) {
                        this._ || (this._ = {});
                        var f = this._.children = b,
                            g = e && e.width || null,
                            h = e && e.heights || null;
                        CKEDITOR.ui.dialog.uiElement.call(this, a, e || {
                            type: "vbox"
                        }, d, "div", null, {
                            role: "presentation"
                        }, function() {
                            var b = ['<table role="presentation" cellspacing="0" border="0" '];
                            b.push('style="'), e && e.expand && b.push("height:100%;"), b.push("width:" + o(g || "100%"), ";"), CKEDITOR.env.webkit && b.push("float:none;"), b.push('"'), b.push('align="', CKEDITOR.tools.htmlEncode(e && e.align || ("ltr" == a.getParentEditor().lang.dir ? "left" : "right")), '" '), b.push("><tbody>");
                            for (var d = 0; d < c.length; d++) {
                                var i = [];
                                b.push('<tr><td role="presentation" '), g && i.push("width:" + o(g || "100%")), h ? i.push("height:" + o(h[d])) : e && e.expand && i.push("height:" + Math.floor(100 / c.length) + "%"), e && void 0 != e.padding && i.push("padding:" + o(e.padding)), CKEDITOR.env.ie && CKEDITOR.env.quirks && f[d].align && i.push("text-align:" + f[d].align), 0 < i.length && b.push('style="', i.join("; "), '" '), b.push(' class="cke_dialog_ui_vbox_child">', c[d], "</td></tr>")
                            }
                            return b.push("</tbody></table>"), b.join("")
                        })
                    }
                }
            }
        }(), CKEDITOR.ui.dialog.uiElement.prototype = {
                getElement: function() {
                    return CKEDITOR.document.getById(this.domId)
                },
                getInputElement: function() {
                    return this.getElement()
                },
                getDialog: function() {
                    return this._.dialog
                },
                setValue: function(a, b) {
                    return this.getInputElement().setValue(a), !b && this.fire("change", {
                        value: a
                    }), this
                },
                getValue: function() {
                    return this.getInputElement().getValue()
                },
                isChanged: function() {
                    return !1
                },
                selectParentTab: function() {
                    for (var a = this.getInputElement();
                        (a = a.getParent()) && -1 == a.$.className.search("cke_dialog_page_contents"););
                    return a ? (a = a.getAttribute("name"), this._.dialog._.currentTabId != a && this._.dialog.selectPage(a), this) : this
                },
                focus: function() {
                    return this.selectParentTab().getInputElement().focus(), this
                },
                registerEvents: function(a) {
                    var b, c, d = /^on([A-Z]\w+)/,
                        e = function(a, b, c, d) {
                            b.on("load", function() {
                                a.getInputElement().on(c, d, a)
                            })
                        };
                    for (c in a)(b = c.match(d)) && (this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, a[c]) : e(this, this._.dialog, b[1].toLowerCase(), a[c]));
                    return this
                },
                eventProcessors: {
                    onLoad: function(a, b) {
                        a.on("load", b, this)
                    },
                    onShow: function(a, b) {
                        a.on("show", b, this)
                    },
                    onHide: function(a, b) {
                        a.on("hide", b, this)
                    }
                },
                accessKeyDown: function() {
                    this.focus()
                },
                accessKeyUp: function() {},
                disable: function() {
                    var a = this.getElement();
                    this.getInputElement().setAttribute("disabled", "true"), a.addClass("cke_disabled")
                },
                enable: function() {
                    var a = this.getElement();
                    this.getInputElement().removeAttribute("disabled"), a.removeClass("cke_disabled")
                },
                isEnabled: function() {
                    return !this.getElement().hasClass("cke_disabled")
                },
                isVisible: function() {
                    return this.getInputElement().isVisible()
                },
                isFocusable: function() {
                    return this.isEnabled() && this.isVisible() ? !0 : !1
                }
            }, CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                getChild: function(a) {
                    return 1 > arguments.length ? this._.children.concat() : (a.splice || (a = [a]), 2 > a.length ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null)
                }
            }, !0), CKEDITOR.ui.dialog.vbox.prototype = new CKEDITOR.ui.dialog.hbox,
            function() {
                var a = {
                    build: function(a, b, c) {
                        for (var d, e = b.children, f = [], g = [], h = 0; h < e.length && (d = e[h]); h++) {
                            var i = [];
                            f.push(i), g.push(CKEDITOR.dialog._.uiElementBuilders[d.type].build(a, d, i))
                        }
                        return new CKEDITOR.ui.dialog[b.type](a, g, f, c, b)
                    }
                };
                CKEDITOR.dialog.addUIElement("hbox", a), CKEDITOR.dialog.addUIElement("vbox", a)
            }(), CKEDITOR.dialogCommand = function(a, b) {
                this.dialogName = a, CKEDITOR.tools.extend(this, b, !0)
            }, CKEDITOR.dialogCommand.prototype = {
                exec: function(a) {
                    a.openDialog(this.dialogName)
                },
                canUndo: !1,
                editorFocus: 1
            },
            function() {
                var a = /^([a]|[^a])+$/,
                    b = /^\d*$/,
                    c = /^\d*(?:\.\d+)?$/,
                    d = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
                    e = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i,
                    f = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
                CKEDITOR.VALIDATE_OR = 1, CKEDITOR.VALIDATE_AND = 2, CKEDITOR.dialog.validate = {
                    functions: function() {
                        var a = arguments;
                        return function() {
                            var b, c = this && this.getValue ? this.getValue() : a[0],
                                d = void 0,
                                e = CKEDITOR.VALIDATE_AND,
                                f = [];
                            for (b = 0; b < a.length && "function" == typeof a[b]; b++) f.push(a[b]);
                            b < a.length && "string" == typeof a[b] && (d = a[b], b++), b < a.length && "number" == typeof a[b] && (e = a[b]);
                            var g = e == CKEDITOR.VALIDATE_AND ? !0 : !1;
                            for (b = 0; b < f.length; b++) g = e == CKEDITOR.VALIDATE_AND ? g && f[b](c) : g || f[b](c);
                            return g ? !0 : d
                        }
                    },
                    regex: function(a, b) {
                        return function(c) {
                            return c = this && this.getValue ? this.getValue() : c, a.test(c) ? !0 : b
                        }
                    },
                    notEmpty: function(b) {
                        return this.regex(a, b)
                    },
                    integer: function(a) {
                        return this.regex(b, a)
                    },
                    number: function(a) {
                        return this.regex(c, a)
                    },
                    cssLength: function(a) {
                        return this.functions(function(a) {
                            return e.test(CKEDITOR.tools.trim(a))
                        }, a)
                    },
                    htmlLength: function(a) {
                        return this.functions(function(a) {
                            return d.test(CKEDITOR.tools.trim(a))
                        }, a)
                    },
                    inlineStyle: function(a) {
                        return this.functions(function(a) {
                            return f.test(CKEDITOR.tools.trim(a))
                        }, a)
                    },
                    equals: function(a, b) {
                        return this.functions(function(b) {
                            return b == a
                        }, b)
                    },
                    notEqual: function(a, b) {
                        return this.functions(function(b) {
                            return b != a
                        }, b)
                    }
                }, CKEDITOR.on("instanceDestroyed", function(a) {
                    if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
                        for (var b; b = CKEDITOR.dialog._.currentTop;) b.hide();
                        for (var c in x) x[c].remove();
                        x = {}
                    }
                    var d, a = a.editor._.storedDialogs;
                    for (d in a) a[d].destroy()
                })
            }(), CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
                openDialog: function(a, b) {
                    var c = null,
                        d = CKEDITOR.dialog._.dialogDefinitions[a];
                    if (null === CKEDITOR.dialog._.currentTop && m(this), "function" == typeof d) c = this._.storedDialogs || (this._.storedDialogs = {}), c = c[a] || (c[a] = new CKEDITOR.dialog(this, a)), b && b.call(c, c), c.show();
                    else {
                        if ("failed" == d) throw n(this), Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
                        "string" == typeof d && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(d), function() {
                            "function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed"), this.openDialog(a, b)
                        }, this, 0, 1)
                    }
                    return CKEDITOR.skin.loadPart("dialog"), c
                }
            })
    }(), CKEDITOR.plugins.add("dialog", {
        requires: "dialogui",
        init: function(a) {
            a.on("doubleclick", function(b) {
                b.data.dialog && a.openDialog(b.data.dialog)
            }, null, null, 999)
        }
    }), CKEDITOR.plugins.add("about", {
        requires: "dialog",
        init: function(a) {
            var b = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
            b.modes = {
                wysiwyg: 1,
                source: 1
            }, b.canUndo = !1, b.readOnly = 1, a.ui.addButton && a.ui.addButton("About", {
                label: a.lang.about.title,
                command: "about",
                toolbar: "about"
            }), CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
        }
    }), function() {
        CKEDITOR.plugins.add("a11yhelp", {
            requires: "dialog",
            availableLangs: {
                ar: 1,
                bg: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                en: 1,
                "en-gb": 1,
                eo: 1,
                es: 1,
                et: 1,
                fa: 1,
                fi: 1,
                fr: 1,
                "fr-ca": 1,
                gl: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                id: 1,
                it: 1,
                ja: 1,
                km: 1,
                ko: 1,
                ku: 1,
                lt: 1,
                lv: 1,
                mk: 1,
                mn: 1,
                nb: 1,
                nl: 1,
                no: 1,
                pl: 1,
                pt: 1,
                "pt-br": 1,
                ro: 1,
                ru: 1,
                si: 1,
                sk: 1,
                sl: 1,
                sq: 1,
                sr: 1,
                "sr-latn": 1,
                sv: 1,
                th: 1,
                tr: 1,
                tt: 1,
                ug: 1,
                uk: 1,
                vi: 1,
                zh: 1,
                "zh-cn": 1
            },
            init: function(a) {
                var b = this;
                a.addCommand("a11yHelp", {
                    exec: function() {
                        var c = a.langCode,
                            c = b.availableLangs[c] ? c : b.availableLangs[c.replace(/-.*/, "")] ? c.replace(/-.*/, "") : "en";
                        CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(b.path + "dialogs/lang/" + c + ".js"), function() {
                            a.lang.a11yhelp = b.langEntries[c], a.openDialog("a11yHelp")
                        })
                    },
                    modes: {
                        wysiwyg: 1,
                        source: 1
                    },
                    readOnly: 1,
                    canUndo: !1
                }), a.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp"), CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js"), a.on("ariaEditorHelpLabel", function(b) {
                    b.data.label = a.lang.common.editorHelp
                })
            }
        })
    }(), CKEDITOR.plugins.add("basicstyles", {
        init: function(a) {
            var b = 0,
                c = function(c, e, f, g) {
                    if (g) {
                        var g = new CKEDITOR.style(g),
                            h = d[f];
                        h.unshift(g), a.attachStyleStateChange(g, function(b) {
                            !a.readOnly && a.getCommand(f).setState(b)
                        }), a.addCommand(f, new CKEDITOR.styleCommand(g, {
                            contentForms: h
                        })), a.ui.addButton && a.ui.addButton(c, {
                            label: e,
                            command: f,
                            toolbar: "basicstyles," + (b += 10)
                        })
                    }
                },
                d = {
                    bold: ["strong", "b", ["span", function(a) {
                        return a = a.styles["font-weight"], "bold" == a || +a >= 700
                    }]],
                    italic: ["em", "i", ["span", function(a) {
                        return "italic" == a.styles["font-style"]
                    }]],
                    underline: ["u", ["span", function(a) {
                        return "underline" == a.styles["text-decoration"]
                    }]],
                    strike: ["s", "strike", ["span", function(a) {
                        return "line-through" == a.styles["text-decoration"]
                    }]],
                    subscript: ["sub"],
                    superscript: ["sup"]
                },
                e = a.config,
                f = a.lang.basicstyles;
            c("Bold", f.bold, "bold", e.coreStyles_bold), c("Italic", f.italic, "italic", e.coreStyles_italic), c("Underline", f.underline, "underline", e.coreStyles_underline), c("Strike", f.strike, "strike", e.coreStyles_strike), c("Subscript", f.subscript, "subscript", e.coreStyles_subscript), c("Superscript", f.superscript, "superscript", e.coreStyles_superscript), a.setKeystroke([
                [CKEDITOR.CTRL + 66, "bold"],
                [CKEDITOR.CTRL + 73, "italic"],
                [CKEDITOR.CTRL + 85, "underline"]
            ])
        }
    }), CKEDITOR.config.coreStyles_bold = {
        element: "strong",
        overrides: "b"
    }, CKEDITOR.config.coreStyles_italic = {
        element: "em",
        overrides: "i"
    }, CKEDITOR.config.coreStyles_underline = {
        element: "u"
    }, CKEDITOR.config.coreStyles_strike = {
        element: "s",
        overrides: "strike"
    }, CKEDITOR.config.coreStyles_subscript = {
        element: "sub"
    }, CKEDITOR.config.coreStyles_superscript = {
        element: "sup"
    }, function() {
        var a = {
            exec: function(a) {
                var b = a.getCommand("blockquote").state,
                    c = a.getSelection(),
                    d = c && c.getRanges()[0];
                if (d) {
                    var e = c.createBookmarks();
                    if (CKEDITOR.env.ie) {
                        var f, g = e[0].startNode,
                            h = e[0].endNode;
                        if (g && "blockquote" == g.getParent().getName())
                            for (f = g; f = f.getNext();)
                                if (f.type == CKEDITOR.NODE_ELEMENT && f.isBlockBoundary()) {
                                    g.move(f, !0);
                                    break
                                }
                        if (h && "blockquote" == h.getParent().getName())
                            for (f = h; f = f.getPrevious();)
                                if (f.type == CKEDITOR.NODE_ELEMENT && f.isBlockBoundary()) {
                                    h.move(f);
                                    break
                                }
                    }
                    var i = d.createIterator();
                    if (i.enlargeBr = a.config.enterMode != CKEDITOR.ENTER_BR, b == CKEDITOR.TRISTATE_OFF) {
                        for (g = []; b = i.getNextParagraph();) g.push(b);
                        for (1 > g.length && (b = a.document.createElement(a.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), h = e.shift(), d.insertNode(b), b.append(new CKEDITOR.dom.text("\ufeff", a.document)), d.moveToBookmark(h), d.selectNodeContents(b), d.collapse(!0), h = d.createBookmark(), g.push(b), e.unshift(h)), f = g[0].getParent(), d = [], h = 0; h < g.length; h++) b = g[h], f = f.getCommonAncestor(b.getParent());
                        for (b = {
                                table: 1,
                                tbody: 1,
                                tr: 1,
                                ol: 1,
                                ul: 1
                            }; b[f.getName()];) f = f.getParent();
                        for (h = null; 0 < g.length;) {
                            for (b = g.shift(); !b.getParent().equals(f);) b = b.getParent();
                            b.equals(h) || d.push(b), h = b
                        }
                        for (; 0 < d.length;)
                            if (b = d.shift(), "blockquote" == b.getName()) {
                                for (h = new CKEDITOR.dom.documentFragment(a.document); b.getFirst();) h.append(b.getFirst().remove()), g.push(h.getLast());
                                h.replace(b)
                            } else g.push(b);
                        for (d = a.document.createElement("blockquote"), d.insertBefore(g[0]); 0 < g.length;) b = g.shift(), d.append(b)
                    } else if (b == CKEDITOR.TRISTATE_ON) {
                        for (h = [], f = {}; b = i.getNextParagraph();) {
                            for (g = d = null; b.getParent();) {
                                if ("blockquote" == b.getParent().getName()) {
                                    d = b.getParent(), g = b;
                                    break
                                }
                                b = b.getParent()
                            }
                            d && g && !g.getCustomData("blockquote_moveout") && (h.push(g), CKEDITOR.dom.element.setMarker(f, g, "blockquote_moveout", !0))
                        }
                        for (CKEDITOR.dom.element.clearAllMarkers(f), b = [], g = [], f = {}; 0 < h.length;) i = h.shift(), d = i.getParent(), i.getPrevious() ? i.getNext() ? (i.breakParent(i.getParent()), g.push(i.getNext())) : i.remove().insertAfter(d) : i.remove().insertBefore(d), d.getCustomData("blockquote_processed") || (g.push(d), CKEDITOR.dom.element.setMarker(f, d, "blockquote_processed", !0)), b.push(i);
                        for (CKEDITOR.dom.element.clearAllMarkers(f), h = g.length - 1; h >= 0; h--) {
                            d = g[h];
                            a: {
                                f = d;
                                for (var i = 0, j = f.getChildCount(), k = void 0; j > i && (k = f.getChild(i)); i++)
                                    if (k.type == CKEDITOR.NODE_ELEMENT && k.isBlockBoundary()) {
                                        f = !1;
                                        break a
                                    }
                                f = !0
                            }
                            f && d.remove()
                        }
                        if (a.config.enterMode == CKEDITOR.ENTER_BR)
                            for (d = !0; b.length;)
                                if (i = b.shift(), "div" == i.getName()) {
                                    for (h = new CKEDITOR.dom.documentFragment(a.document), d && i.getPrevious() && !(i.getPrevious().type == CKEDITOR.NODE_ELEMENT && i.getPrevious().isBlockBoundary()) && h.append(a.document.createElement("br")), d = i.getNext() && !(i.getNext().type == CKEDITOR.NODE_ELEMENT && i.getNext().isBlockBoundary()); i.getFirst();) i.getFirst().remove().appendTo(h);
                                    d && h.append(a.document.createElement("br")), h.replace(i), d = !1
                                }
                    }
                    c.selectBookmarks(e), a.focus()
                }
            },
            refresh: function(a, b) {
                this.setState(a.elementPath(b.block || b.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
            },
            context: "blockquote",
            allowedContent: "blockquote",
            requiredContent: "blockquote"
        };
        CKEDITOR.plugins.add("blockquote", {
            init: function(b) {
                b.blockless || (b.addCommand("blockquote", a), b.ui.addButton && b.ui.addButton("Blockquote", {
                    label: b.lang.blockquote.toolbar,
                    command: "blockquote",
                    toolbar: "blocks,10"
                }))
            }
        })
    }(), function() {
        function a(a) {
            function b() {
                var b = a.editable();
                b.on(s, function(a) {
                    (!CKEDITOR.env.ie || !p) && m(a)
                }), CKEDITOR.env.ie && b.on("paste", function(b) {
                    q || (e(), b.data.preventDefault(), m(b), g("paste") || a.openDialog("paste"))
                }), CKEDITOR.env.ie && (b.on("contextmenu", f, null, null, 0), b.on("beforepaste", function(a) {
                    a.data && !a.data.$.ctrlKey && !a.data.$.shiftKey && f()
                }, null, null, 0)), b.on("beforecut", function() {
                    !p && i(a)
                });
                var c;
                b.attachListener(CKEDITOR.env.ie ? b : a.document.getDocumentElement(), "mouseup", function() {
                    c = setTimeout(function() {
                        n()
                    }, 0)
                }), a.on("destroy", function() {
                    clearTimeout(c)
                }), b.on("keyup", n)
            }

            function c(b) {
                return {
                    type: b,
                    canUndo: "cut" == b,
                    startDisabled: !0,
                    exec: function() {
                        "cut" == this.type && i();
                        var b, c = this.type;
                        if (CKEDITOR.env.ie) b = g(c);
                        else try {
                            b = a.document.$.execCommand(c, !1, null)
                        } catch (d) {
                            b = !1
                        }
                        return b || alert(a.lang.clipboard[this.type + "Error"]), b
                    }
                }
            }

            function d() {
                return {
                    canUndo: !1,
                    async: !0,
                    exec: function(a, b) {
                        var c = function(b, c) {
                                b && h(b.type, b.dataValue, !!c), a.fire("afterCommandExec", {
                                    name: "paste",
                                    command: d,
                                    returnValue: !!b
                                })
                            },
                            d = this;
                        "string" == typeof b ? c({
                            type: "auto",
                            dataValue: b
                        }, 1) : a.getClipboardData(c)
                    }
                }
            }

            function e() {
                q = 1, setTimeout(function() {
                    q = 0
                }, 100)
            }

            function f() {
                p = 1, setTimeout(function() {
                    p = 0
                }, 10)
            }

            function g(b) {
                var c = a.document,
                    d = c.getBody(),
                    e = !1,
                    f = function() {
                        e = !0
                    };
                return d.on(b, f), (7 < CKEDITOR.env.version ? c.$ : c.$.selection.createRange()).execCommand(b), d.removeListener(b, f), e
            }

            function h(b, c, d) {
                return b = {
                    type: b
                }, d && !1 === a.fire("beforePaste", b) || !c ? !1 : (b.dataValue = c, a.fire("paste", b))
            }

            function i() {
                if (CKEDITOR.env.ie && !CKEDITOR.env.quirks) {
                    var b, c, d, e = a.getSelection();
                    e.getType() == CKEDITOR.SELECTION_ELEMENT && (b = e.getSelectedElement()) && (c = e.getRanges()[0], d = a.document.createText(""), d.insertBefore(b), c.setStartBefore(d), c.setEndAfter(b), e.selectRanges([c]), setTimeout(function() {
                        b.getParent() && (d.remove(), e.selectElement(b))
                    }, 0))
                }
            }

            function j(b, c) {
                var d, e = a.document,
                    f = a.editable(),
                    g = function(a) {
                        a.cancel()
                    };
                if (!e.getById("cke_pastebin")) {
                    var h = a.getSelection(),
                        i = h.createBookmarks();
                    CKEDITOR.env.ie && h.root.fire("selectionchange");
                    var j = new CKEDITOR.dom.element(!CKEDITOR.env.webkit && !f.is("body") || CKEDITOR.env.ie ? "div" : "body", e);
                    j.setAttributes({
                        id: "cke_pastebin",
                        "data-cke-temp": "1"
                    });
                    var k = 0,
                        e = e.getWindow();
                    CKEDITOR.env.webkit ? (f.append(j), j.addClass("cke_editable"), f.is("body") || (k = "static" != f.getComputedStyle("position") ? f : CKEDITOR.dom.element.get(f.$.offsetParent), k = k.getDocumentPosition().y)) : f.getAscendant(CKEDITOR.env.ie ? "body" : "html", 1).append(j), j.setStyles({
                        position: "absolute",
                        top: e.getScrollPosition().y - k + 10 + "px",
                        width: "1px",
                        height: Math.max(1, e.getViewPaneSize().height - 20) + "px",
                        overflow: "hidden",
                        margin: 0,
                        padding: 0
                    }), (k = j.getParent().isReadOnly()) ? (j.setOpacity(0), j.setAttribute("contenteditable", !0)) : j.setStyle("ltr" == a.config.contentsLangDirection ? "left" : "right", "-1000px"), a.on("selectionChange", g, null, null, 0), (CKEDITOR.env.webkit || CKEDITOR.env.gecko) && (d = f.once("blur", g, null, null, -100)), k && j.focus(), k = new CKEDITOR.dom.range(j), k.selectNodeContents(j);
                    var l = k.select();
                    CKEDITOR.env.ie && (d = f.once("blur", function() {
                        a.lockSelection(l)
                    }));
                    var m = CKEDITOR.document.getWindow().getScrollPosition().y;
                    setTimeout(function() {
                        CKEDITOR.env.webkit && (CKEDITOR.document.getBody().$.scrollTop = m), d && d.removeListener(), CKEDITOR.env.ie && f.focus(), h.selectBookmarks(i), j.remove();
                        var b;
                        CKEDITOR.env.webkit && (b = j.getFirst()) && b.is && b.hasClass("Apple-style-span") && (j = b), a.removeListener("selectionChange", g), c(j.getHtml())
                    }, 0)
                }
            }

            function k() {
                if (CKEDITOR.env.ie) {
                    a.focus(), e();
                    var b = a.focusManager;
                    if (b.lock(), a.editable().fire(s) && !g("paste")) return b.unlock(), !1;
                    b.unlock()
                } else try {
                    if (a.editable().fire(s) && !a.document.$.execCommand("Paste", !1, null)) throw 0
                } catch (c) {
                    return !1
                }
                return !0
            }

            function l(b) {
                if ("wysiwyg" == a.mode) switch (b.data.keyCode) {
                    case CKEDITOR.CTRL + 86:
                    case CKEDITOR.SHIFT + 45:
                        b = a.editable(), e(), !CKEDITOR.env.ie && b.fire("beforepaste");
                        break;
                    case CKEDITOR.CTRL + 88:
                    case CKEDITOR.SHIFT + 46:
                        a.fire("saveSnapshot"), setTimeout(function() {
                            a.fire("saveSnapshot")
                        }, 50)
                }
            }

            function m(b) {
                var c = {
                        type: "auto"
                    },
                    d = a.fire("beforePaste", c);
                j(b, function(a) {
                    a = a.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/gi, ""), d && h(c.type, a, 0, 1)
                })
            }

            function n() {
                if ("wysiwyg" == a.mode) {
                    var b = o("paste");
                    a.getCommand("cut").setState(o("cut")), a.getCommand("copy").setState(o("copy")), a.getCommand("paste").setState(b), a.fire("pasteState", b)
                }
            }

            function o(b) {
                if (r && b in {
                        paste: 1,
                        cut: 1
                    }) return CKEDITOR.TRISTATE_DISABLED;
                if ("paste" == b) return CKEDITOR.TRISTATE_OFF;
                var b = a.getSelection(),
                    c = b.getRanges();
                return b.getType() == CKEDITOR.SELECTION_NONE || 1 == c.length && c[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
            }
            var p = 0,
                q = 0,
                r = 0,
                s = CKEDITOR.env.ie ? "beforepaste" : "paste";
            ! function() {
                a.on("key", l), a.on("contentDom", b), a.on("selectionChange", function(a) {
                    r = a.data.selection.getRanges()[0].checkReadOnly(), n()
                }), a.contextMenu && a.contextMenu.addListener(function(a, b) {
                    return r = b.getRanges()[0].checkReadOnly(), {
                        cut: o("cut"),
                        copy: o("copy"),
                        paste: o("paste")
                    }
                })
            }(),
            function() {
                function b(b, c, d, e, f) {
                    var g = a.lang.clipboard[c];
                    a.addCommand(c, d), a.ui.addButton && a.ui.addButton(b, {
                        label: g,
                        command: c,
                        toolbar: "clipboard," + e
                    }), a.addMenuItems && a.addMenuItem(c, {
                        label: g,
                        command: c,
                        group: "clipboard",
                        order: f
                    })
                }
                b("Cut", "cut", c("cut"), 10, 1), b("Copy", "copy", c("copy"), 20, 4), b("Paste", "paste", d(), 30, 8)
            }(), a.getClipboardData = function(b, c) {
                function d(a) {
                    a.removeListener(), a.cancel(), c(a.data)
                }

                function e(a) {
                    a.removeListener(), a.cancel(), i = !0, c({
                        type: h,
                        dataValue: a.data
                    })
                }

                function f() {
                    this.customTitle = b && b.title
                }
                var g = !1,
                    h = "auto",
                    i = !1;
                c || (c = b, b = null), a.on("paste", d, null, null, 0), a.on("beforePaste", function(a) {
                    a.removeListener(), g = !0, h = a.data.type
                }, null, null, 1e3), !1 === k() && (a.removeListener("paste", d), g && a.fire("pasteDialog", f) ? (a.on("pasteDialogCommit", e), a.on("dialogHide", function(a) {
                    a.removeListener(), a.data.removeListener("pasteDialogCommit", e), setTimeout(function() {
                        i || c(null)
                    }, 10)
                })) : c(null))
            }
        }

        function b(a) {
            if (CKEDITOR.env.webkit) {
                if (!a.match(/^[^<]*$/g) && !a.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi)) return "html"
            } else if (CKEDITOR.env.ie) {
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi) && !a.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi)) return "html"
            } else {
                if (!CKEDITOR.env.gecko) return "html";
                if (!a.match(/^([^<]|<br( ?\/)?>)*$/gi)) return "html"
            }
            return "htmlifiedtext"
        }

        function c(a, b) {
            function c(a) {
                return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) + (1 == a % 2 ? "<br>" : "")
            }
            return b = b.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>"), b = b.replace(/<\/?[A-Z]+>/g, function(a) {
                return a.toLowerCase()
            }), b.match(/^[^<]$/) ? b : (CKEDITOR.env.webkit && -1 < b.indexOf("<div>") && (b = b.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>"), b.match(/<div>(<br>|)<\/div>/) && (b = "<p>" + b.replace(/(<div>(<br>|)<\/div>)+/g, function(a) {
                    return c(a.split("</div><div>").length + 1)
                }) + "</p>"), b = b.replace(/<\/div><div>/g, "<br>"), b = b.replace(/<\/?div>/g, "")),
                CKEDITOR.env.gecko && a.enterMode != CKEDITOR.ENTER_BR && (CKEDITOR.env.gecko && (b = b.replace(/^<br><br>$/, "<br>")), -1 < b.indexOf("<br><br>") && (b = "<p>" + b.replace(/(<br>){2,}/g, function(a) {
                    return c(a.length / 4)
                }) + "</p>")), f(a, b))
        }

        function d() {
            var a = new CKEDITOR.htmlParser.filter,
                b = {
                    blockquote: 1,
                    dl: 1,
                    fieldset: 1,
                    h1: 1,
                    h2: 1,
                    h3: 1,
                    h4: 1,
                    h5: 1,
                    h6: 1,
                    ol: 1,
                    p: 1,
                    table: 1,
                    ul: 1
                },
                c = CKEDITOR.tools.extend({
                    br: 0
                }, CKEDITOR.dtd.$inline),
                d = {
                    p: 1,
                    br: 1,
                    "cke:br": 1
                },
                e = CKEDITOR.dtd,
                f = CKEDITOR.tools.extend({
                    area: 1,
                    basefont: 1,
                    embed: 1,
                    iframe: 1,
                    map: 1,
                    object: 1,
                    param: 1
                }, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata),
                g = function(a) {
                    delete a.name, a.add(new CKEDITOR.htmlParser.text(" "))
                },
                h = function(a) {
                    for (var b, c = a;
                        (c = c.next) && c.name && c.name.match(/^h\d$/);)
                        for (b = new CKEDITOR.htmlParser.element("cke:br"), b.isEmpty = !0, a.add(b); b = c.children.shift();) a.add(b)
                };
            return a.addRules({
                elements: {
                    h1: h,
                    h2: h,
                    h3: h,
                    h4: h,
                    h5: h,
                    h6: h,
                    img: function(a) {
                        var a = CKEDITOR.tools.trim(a.attributes.alt || ""),
                            b = " ";
                        return a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] "), new CKEDITOR.htmlParser.text(b)
                    },
                    td: g,
                    th: g,
                    $: function(a) {
                        var g, h = a.name;
                        if (f[h]) return !1;
                        if (a.attributes = {}, "br" == h) return a;
                        if (b[h]) a.name = "p";
                        else if (c[h]) delete a.name;
                        else if (e[h]) {
                            if (g = new CKEDITOR.htmlParser.element("cke:br"), g.isEmpty = !0, CKEDITOR.dtd.$empty[h]) return g;
                            a.add(g, 0), g = g.clone(), g.isEmpty = !0, a.add(g), delete a.name
                        }
                        return d[a.name] || delete a.name, a
                    }
                }
            }, {
                applyToAll: !0
            }), a
        }

        function e(a, b, c) {
            var b = new CKEDITOR.htmlParser.fragment.fromHtml(b),
                d = new CKEDITOR.htmlParser.basicWriter;
            b.writeHtml(d, c);
            var b = d.getHtml(),
                b = b.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""),
                e = 0,
                b = b.replace(/<\/?p>/g, function(a) {
                    if ("<p>" == a) {
                        if (1 < ++e) return "</p><p>"
                    } else if (0 < --e) return "</p><p>";
                    return a
                }).replace(/<p><\/p>/g, "");
            return f(a, b)
        }

        function f(a, b) {
            return a.enterMode == CKEDITOR.ENTER_BR ? b = b.replace(/(<\/p><p>)+/g, function(a) {
                return CKEDITOR.tools.repeat("<br>", 2 * (a.length / 7))
            }).replace(/<\/?p>/g, "") : a.enterMode == CKEDITOR.ENTER_DIV && (b = b.replace(/<(\/)?p>/g, "<$1div>")), b
        }
        CKEDITOR.plugins.add("clipboard", {
            requires: "dialog",
            init: function(f) {
                var g;
                a(f), CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js")), f.on("paste", function(a) {
                    var b = a.data.dataValue,
                        c = CKEDITOR.dtd.$block;
                    if (-1 < b.indexOf("Apple-") && (b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, " "), "html" != a.data.type && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function(a, b) {
                            return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
                        })), -1 < b.indexOf('<br class="Apple-interchange-newline">') && (a.data.startsWithEOL = 1, a.data.preSniffing = "html", b = b.replace(/<br class="Apple-interchange-newline">/, "")), b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1")), b.match(/^<[^<]+cke_(editable|contents)/i)) {
                        var d, e, f = new CKEDITOR.dom.element("div");
                        for (f.setHtml(b); 1 == f.getChildCount() && (d = f.getFirst()) && d.type == CKEDITOR.NODE_ELEMENT && (d.hasClass("cke_editable") || d.hasClass("cke_contents"));) f = e = d;
                        e && (b = e.getHtml().replace(/<br>$/i, ""))
                    }
                    CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function(b, d) {
                        return d.toLowerCase() in c ? (a.data.preSniffing = "html", "<" + d) : b
                    }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function(b, d) {
                        return d in c ? (a.data.endsWithEOL = 1, "</" + d + ">") : b
                    }) : CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1")), a.data.dataValue = b
                }, null, null, 3), f.on("paste", function(a) {
                    var h, a = a.data,
                        i = a.type,
                        j = a.dataValue,
                        k = f.config.clipboard_defaultContentType || "html";
                    h = "html" == i || "html" == a.preSniffing ? "html" : b(j), "htmlifiedtext" == h ? j = c(f.config, j) : "text" == i && "html" == h && (j = e(f.config, j, g || (g = d(f)))), a.startsWithEOL && (j = '<br data-cke-eol="1">' + j), a.endsWithEOL && (j += '<br data-cke-eol="1">'), "auto" == i && (i = "html" == h || "html" == k ? "html" : "text"), a.type = i, a.dataValue = j, delete a.preSniffing, delete a.startsWithEOL, delete a.endsWithEOL
                }, null, null, 6), f.on("paste", function(a) {
                    a = a.data, f.insertHtml(a.dataValue, a.type), setTimeout(function() {
                        f.fire("afterPaste")
                    }, 0)
                }, null, null, 1e3), f.on("pasteDialog", function(a) {
                    setTimeout(function() {
                        f.openDialog("paste", a.data)
                    }, 0)
                })
            }
        })
    }(), function() {
        CKEDITOR.plugins.add("panel", {
            beforeInit: function(a) {
                a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
            }
        }), CKEDITOR.UI_PANEL = "panel", CKEDITOR.ui.panel = function(a, b) {
            b && CKEDITOR.tools.extend(this, b), CKEDITOR.tools.extend(this, {
                className: "",
                css: []
            }), this.id = CKEDITOR.tools.getNextId(), this.document = a, this.isFramed = this.forceIFrame || this.css.length, this._ = {
                blocks: {}
            }
        }, CKEDITOR.ui.panel.handler = {
            create: function(a) {
                return new CKEDITOR.ui.panel(a)
            }
        };
        var a = CKEDITOR.addTemplate("panel", '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'),
            b = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
            c = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
        CKEDITOR.ui.panel.prototype = {
            render: function(d, e) {
                this.getHolderElement = function() {
                    var a = this._.holder;
                    if (!a) {
                        if (this.isFramed) {
                            var a = this.document.getById(this.id + "_frame"),
                                b = a.getParent(),
                                a = a.getFrameDocument();
                            CKEDITOR.env.iOS && b.setStyles({
                                overflow: "scroll",
                                "-webkit-overflow-scrolling": "touch"
                            }), b = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function() {
                                this.isLoaded = !0, this.onLoad && this.onLoad()
                            }, this)), a.write(c.output(CKEDITOR.tools.extend({
                                css: CKEDITOR.tools.buildStyleHtml(this.css),
                                onload: "window.parent.CKEDITOR.tools.callFunction(" + b + ");"
                            }, f))), a.getWindow().$.CKEDITOR = CKEDITOR, a.on("keydown", function(a) {
                                var b = a.data.getKeystroke(),
                                    c = this.document.getById(this.id).getAttribute("dir");
                                this._.onKeyDown && !1 === this._.onKeyDown(b) ? a.data.preventDefault() : (27 == b || b == ("rtl" == c ? 39 : 37)) && this.onEscape && !1 === this.onEscape(b) && a.data.preventDefault()
                            }, this), a = a.getBody(), a.unselectable(), CKEDITOR.env.air && CKEDITOR.tools.callFunction(b)
                        } else a = this.document.getById(this.id);
                        this._.holder = a
                    }
                    return a
                };
                var f = {
                    editorId: d.id,
                    id: this.id,
                    langCode: d.langCode,
                    dir: d.lang.dir,
                    cls: this.className,
                    frame: "",
                    env: CKEDITOR.env.cssClass,
                    "z-index": d.config.baseFloatZIndex + 1
                };
                if (this.isFramed) {
                    var g = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
                    f.frame = b.output({
                        id: this.id + "_frame",
                        src: g
                    })
                }
                return g = a.output(f), e && e.push(g), g
            },
            addBlock: function(a, b) {
                return b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ? b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b), this._.currentBlock || this.showBlock(a), b
            },
            getBlock: function(a) {
                return this._.blocks[a]
            },
            showBlock: function(a) {
                var a = this._.blocks[a],
                    b = this._.currentBlock,
                    c = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
                return b && b.hide(), this._.currentBlock = a, CKEDITOR.fire("ariaWidget", c), a._.focusIndex = -1, this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a), a.show(), a
            },
            destroy: function() {
                this.element && this.element.remove()
            }
        }, CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
            $: function(a, b) {
                this.element = a.append(a.getDocument().createElement("div", {
                    attributes: {
                        tabindex: -1,
                        "class": "cke_panel_block"
                    },
                    styles: {
                        display: "none"
                    }
                })), b && CKEDITOR.tools.extend(this, b), this.element.setAttributes({
                    role: this.attributes.role || "presentation",
                    "aria-label": this.attributes["aria-label"],
                    title: this.attributes.title || this.attributes["aria-label"]
                }), this.keys = {}, this._.focusIndex = -1, this.element.disableContextMenu()
            },
            _: {
                markItem: function(a) {
                    -1 != a && (a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a), CKEDITOR.env.webkit && a.getDocument().getWindow().focus(), a.focus(), this.onMark && this.onMark(a))
                }
            },
            proto: {
                show: function() {
                    this.element.setStyle("display", "")
                },
                hide: function() {
                    (!this.onHide || !0 !== this.onHide.call(this)) && this.element.setStyle("display", "none")
                },
                onKeyDown: function(a, b) {
                    var c = this.keys[a];
                    switch (c) {
                        case "next":
                            for (var d, e = this._.focusIndex, c = this.element.getElementsByTag("a"); d = c.getItem(++e);)
                                if (d.getAttribute("_cke_focus") && d.$.offsetWidth) {
                                    this._.focusIndex = e, d.focus();
                                    break
                                }
                            return d || b ? !1 : (this._.focusIndex = -1, this.onKeyDown(a, 1));
                        case "prev":
                            for (e = this._.focusIndex, c = this.element.getElementsByTag("a"); e > 0 && (d = c.getItem(--e));) {
                                if (d.getAttribute("_cke_focus") && d.$.offsetWidth) {
                                    this._.focusIndex = e, d.focus();
                                    break
                                }
                                d = null
                            }
                            return d || b ? !1 : (this._.focusIndex = c.count(), this.onKeyDown(a, 1));
                        case "click":
                        case "mouseup":
                            return e = this._.focusIndex, (d = e >= 0 && this.element.getElementsByTag("a").getItem(e)) && (d.$[c] ? d.$[c]() : d.$["on" + c]()), !1
                    }
                    return !0
                }
            }
        })
    }(), CKEDITOR.plugins.add("floatpanel", {
        requires: "panel"
    }), function() {
        function a(a, c, d, e, f) {
            var f = CKEDITOR.tools.genKey(c.getUniqueId(), d.getUniqueId(), a.lang.dir, a.uiColor || "", e.css || "", f || ""),
                g = b[f];
            return g || (g = b[f] = new CKEDITOR.ui.panel(c, e), g.element = d.append(CKEDITOR.dom.element.createFromHtml(g.render(a), c)), g.element.setStyles({
                display: "none",
                position: "absolute"
            })), g
        }
        var b = {};
        CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
            $: function(b, c, d, e) {
                function f() {
                    j.hide()
                }
                d.forceIFrame = 1, d.toolbarRelated && b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && (c = CKEDITOR.document.getById("cke_" + b.name));
                var g = c.getDocument(),
                    e = a(b, g, c, d, e || 0),
                    h = e.element,
                    i = h.getFirst(),
                    j = this;
                h.disableContextMenu(), this.element = h, this._ = {
                    editor: b,
                    panel: e,
                    parentElement: c,
                    definition: d,
                    document: g,
                    iframe: i,
                    children: [],
                    dir: b.lang.dir
                }, b.on("mode", f), b.on("resize", f), CKEDITOR.env.iOS || g.getWindow().on("resize", f)
            },
            proto: {
                addBlock: function(a, b) {
                    return this._.panel.addBlock(a, b)
                },
                addListBlock: function(a, b) {
                    return this._.panel.addListBlock(a, b)
                },
                getBlock: function(a) {
                    return this._.panel.getBlock(a)
                },
                showBlock: function(a, b, c, d, e, f) {
                    var g = this._.panel,
                        h = g.showBlock(a);
                    this.allowBlur(!1), a = this._.editor.editable(), this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement), this._.hideTimeout = 0;
                    var i = this.element,
                        a = this._.iframe,
                        a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow),
                        j = i.getDocument(),
                        k = this._.parentElement.getPositionedAncestor(),
                        l = b.getDocumentPosition(j),
                        j = k ? k.getDocumentPosition(j) : {
                            x: 0,
                            y: 0
                        },
                        m = "rtl" == this._.dir,
                        n = l.x + (d || 0) - j.x,
                        o = l.y + (e || 0) - j.y;
                    !m || 1 != c && 4 != c ? m || 2 != c && 3 != c || (n += b.$.offsetWidth - 1) : n += b.$.offsetWidth, (3 == c || 4 == c) && (o += b.$.offsetHeight - 1), this._.panel._.offsetParentId = b.getId(), i.setStyles({
                        top: o + "px",
                        left: 0,
                        display: ""
                    }), i.setOpacity(0), i.getFirst().removeStyle("width"), this._.editor.focusManager.add(a), this._.blurSet || (CKEDITOR.event.useCapture = !0, a.on("blur", function(a) {
                        function b() {
                            delete this._.returnFocus, this.hide()
                        }
                        this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && this.visible && !this._.activeChild && (CKEDITOR.env.iOS ? this._.hideTimeout || (this._.hideTimeout = CKEDITOR.tools.setTimeout(b, 0, this)) : b.call(this))
                    }, this), a.on("focus", function() {
                        this._.focused = !0, this.hideChild(), this.allowBlur(!0)
                    }, this), CKEDITOR.env.iOS && (a.on("touchstart", function() {
                        clearTimeout(this._.hideTimeout)
                    }, this), a.on("touchend", function() {
                        this._.hideTimeout = 0, this.focus()
                    }, this)), CKEDITOR.event.useCapture = !1, this._.blurSet = 1), g.onEscape = CKEDITOR.tools.bind(function(a) {
                        return this.onEscape && this.onEscape(a) === !1 ? !1 : void 0
                    }, this), CKEDITOR.tools.setTimeout(function() {
                        var a = CKEDITOR.tools.bind(function() {
                            if (i.removeStyle("width"), h.autoSize) {
                                var a = h.element.getDocument(),
                                    a = (CKEDITOR.env.webkit ? h.element : a.getBody()).$.scrollWidth;
                                CKEDITOR.env.ie && CKEDITOR.env.quirks && a > 0 && (a += (i.$.offsetWidth || 0) - (i.$.clientWidth || 0) + 3), i.setStyle("width", a + 10 + "px"), a = h.element.$.scrollHeight, CKEDITOR.env.ie && CKEDITOR.env.quirks && a > 0 && (a += (i.$.offsetHeight || 0) - (i.$.clientHeight || 0) + 3), i.setStyle("height", a + "px"), g._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                            } else i.removeStyle("height");
                            m && (n -= i.$.offsetWidth), i.setStyle("left", n + "px");
                            var b = g.element.getWindow(),
                                a = i.$.getBoundingClientRect(),
                                b = b.getViewPaneSize(),
                                c = a.width || a.right - a.left,
                                d = a.height || a.bottom - a.top,
                                e = m ? a.right : b.width - a.left,
                                j = m ? b.width - a.right : a.left;
                            m ? c > e && (n = j > c ? n + c : b.width > c ? n - a.left : n - a.right + b.width) : c > e && (n = j > c ? n - c : b.width > c ? n - a.right + b.width : n - a.left), c = a.top, b.height - a.top < d && (o = c > d ? o - d : b.height > d ? o - a.bottom + b.height : o - a.top), CKEDITOR.env.ie && (b = a = new CKEDITOR.dom.element(i.$.offsetParent), "html" == b.getName() && (b = b.getDocument().getBody()), "rtl" == b.getComputedStyle("direction") && (n = CKEDITOR.env.ie8Compat ? n - 2 * i.getDocument().getDocumentElement().$.scrollLeft : n - (a.$.scrollWidth - a.$.clientWidth)));
                            var k, a = i.getFirst();
                            (k = a.getCustomData("activePanel")) && k.onHide && k.onHide.call(this, 1), a.setCustomData("activePanel", this), i.setStyles({
                                top: o + "px",
                                left: n + "px"
                            }), i.setOpacity(1), f && f()
                        }, this);
                        g.isLoaded ? a() : g.onLoad = a, CKEDITOR.tools.setTimeout(function() {
                            var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
                            this.focus(), h.element.focus(), CKEDITOR.env.webkit && (CKEDITOR.document.getBody().$.scrollTop = a), this.allowBlur(!0), this._.editor.fire("panelShow", this)
                        }, 0, this)
                    }, CKEDITOR.env.air ? 200 : 0, this), this.visible = 1, this.onShow && this.onShow.call(this)
                },
                focus: function() {
                    if (CKEDITOR.env.webkit) {
                        var a = CKEDITOR.document.getActive();
                        a && !a.equals(this._.iframe) && a.$.blur()
                    }(this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
                },
                blur: function() {
                    var a = this._.iframe.getFrameDocument().getActive();
                    a && a.is("a") && (this._.lastFocused = a)
                },
                hide: function(a) {
                    !this.visible || this.onHide && !0 === this.onHide.call(this) || (this.hideChild(), CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur(), this.element.setStyle("display", "none"), this.visible = 0, this.element.getFirst().removeCustomData("activePanel"), (a = a && this._.returnFocus) && (CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(), a.focus()), delete this._.lastFocused, this._.editor.fire("panelHide", this))
                },
                allowBlur: function(a) {
                    var b = this._.panel;
                    return void 0 != a && (b.allowBlur = a), b.allowBlur
                },
                showAsChild: function(a, b, c, d, e, f) {
                    this._.activeChild == a && a._.panel._.offsetParentId == c.getId() || (this.hideChild(), a.onHide = CKEDITOR.tools.bind(function() {
                        CKEDITOR.tools.setTimeout(function() {
                            this._.focused || this.hide()
                        }, 0, this)
                    }, this), this._.activeChild = a, this._.focused = !1, a.showBlock(b, c, d, e, f), this.blur(), (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function() {
                        a.element.getChild(0).$.style.cssText += ""
                    }, 100))
                },
                hideChild: function(a) {
                    var b = this._.activeChild;
                    b && (delete b.onHide, delete this._.activeChild, b.hide(), a && this.focus())
                }
            }
        }), CKEDITOR.on("instanceDestroyed", function() {
            var a, c = CKEDITOR.tools.isEmpty(CKEDITOR.instances);
            for (a in b) {
                var d = b[a];
                c ? d.destroy() : d.element.hide()
            }
            c && (b = {})
        })
    }(), CKEDITOR.plugins.add("menu", {
        requires: "floatpanel",
        beforeInit: function(a) {
            for (var b = a.config.menu_groups.split(","), c = a._.menuGroups = {}, d = a._.menuItems = {}, e = 0; e < b.length; e++) c[b[e]] = e + 1;
            a.addMenuGroup = function(a, b) {
                c[a] = b || 100
            }, a.addMenuItem = function(a, b) {
                c[b.group] && (d[a] = new CKEDITOR.menuItem(this, a, b))
            }, a.addMenuItems = function(a) {
                for (var b in a) this.addMenuItem(b, a[b])
            }, a.getMenuItem = function(a) {
                return d[a]
            }, a.removeMenuItem = function(a) {
                delete d[a]
            }
        }
    }), function() {
        function a(a) {
            a.sort(function(a, b) {
                return a.group < b.group ? -1 : a.group > b.group ? 1 : a.order < b.order ? -1 : a.order > b.order ? 1 : 0
            })
        }
        var b = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (b += ' onkeypress="return false;"'), CKEDITOR.env.gecko && (b += ' onblur="this.style.cssText = this.style.cssText;"');
        var b = b + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'),
            c = CKEDITOR.addTemplate("menuItem", b + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
            d = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
        CKEDITOR.menu = CKEDITOR.tools.createClass({
            $: function(a, b) {
                b = this._.definition = b || {}, this.id = CKEDITOR.tools.getNextId(), this.editor = a, this.items = [], this._.listeners = [], this._.level = b.level || 1;
                var c = CKEDITOR.tools.extend({}, b.panel, {
                        css: [CKEDITOR.skin.getPath("editor")],
                        level: this._.level - 1,
                        block: {}
                    }),
                    d = c.block.attributes = c.attributes || {};
                !d.role && (d.role = "menu"), this._.panelDefinition = c
            },
            _: {
                onShow: function() {
                    var a = this.editor.getSelection(),
                        b = a && a.getStartElement(),
                        c = this.editor.elementPath(),
                        d = this._.listeners;
                    this.removeAll();
                    for (var e = 0; e < d.length; e++) {
                        var f = d[e](b, a, c);
                        if (f)
                            for (var g in f) {
                                var h = this.editor.getMenuItem(g);
                                !h || h.command && !this.editor.getCommand(h.command).state || (h.state = f[g], this.add(h))
                            }
                    }
                },
                onClick: function(a) {
                    this.hide(), a.onClick ? a.onClick() : a.command && this.editor.execCommand(a.command)
                },
                onEscape: function(a) {
                    var b = this.parent;
                    return b ? b._.panel.hideChild(1) : 27 == a && this.hide(1), !1
                },
                onHide: function() {
                    this.onHide && this.onHide()
                },
                showSubMenu: function(a) {
                    var b = this._.subMenu,
                        c = this.items[a];
                    if (c = c.getItems && c.getItems()) {
                        b ? b.removeAll() : (b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {
                            level: this._.level + 1
                        }, !0)), b.parent = this, b._.onClick = CKEDITOR.tools.bind(this._.onClick, this));
                        for (var d in c) {
                            var e = this.editor.getMenuItem(d);
                            e && (e.state = c[d], b.add(e))
                        }
                        var f = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + a));
                        setTimeout(function() {
                            b.show(f, 2)
                        }, 0)
                    } else this._.panel.hideChild(1)
                }
            },
            proto: {
                add: function(a) {
                    a.order || (a.order = this.items.length), this.items.push(a)
                },
                removeAll: function() {
                    this.items = []
                },
                show: function(b, c, d, e) {
                    if (this.parent || (this._.onShow(), this.items.length)) {
                        var c = c || ("rtl" == this.editor.lang.dir ? 2 : 1),
                            f = this.items,
                            g = this.editor,
                            h = this._.panel,
                            i = this._.element;
                        if (!h) {
                            h = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level), h.onEscape = CKEDITOR.tools.bind(function(a) {
                                return !1 === this._.onEscape(a) ? !1 : void 0
                            }, this), h.onShow = function() {
                                h._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
                            }, h.onHide = CKEDITOR.tools.bind(function() {
                                this._.onHide && this._.onHide()
                            }, this), i = h.addBlock(this.id, this._.panelDefinition.block), i.autoSize = !0;
                            var j = i.keys;
                            j[40] = "next", j[9] = "next", j[38] = "prev", j[CKEDITOR.SHIFT + 9] = "prev", j["rtl" == g.lang.dir ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click", j[32] = CKEDITOR.env.ie ? "mouseup" : "click", CKEDITOR.env.ie && (j[13] = "mouseup"), i = this._.element = i.element, j = i.getDocument(), j.getBody().setStyle("overflow", "hidden"), j.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden"), this._.itemOverFn = CKEDITOR.tools.addFunction(function(a) {
                                clearTimeout(this._.showSubTimeout), this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, g.config.menu_subMenuDelay || 400, this, [a])
                            }, this), this._.itemOutFn = CKEDITOR.tools.addFunction(function() {
                                clearTimeout(this._.showSubTimeout)
                            }, this), this._.itemClickFn = CKEDITOR.tools.addFunction(function(a) {
                                var b = this.items[a];
                                b.state == CKEDITOR.TRISTATE_DISABLED ? this.hide(1) : b.getItems ? this._.showSubMenu(a) : this._.onClick(b)
                            }, this)
                        }
                        a(f);
                        for (var j = g.elementPath(), j = ['<div class="cke_menu' + (j && j.direction() != g.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'], k = f.length, l = k && f[0].group, m = 0; k > m; m++) {
                            var n = f[m];
                            l != n.group && (j.push('<div class="cke_menuseparator" role="separator"></div>'), l = n.group), n.render(this, m, j)
                        }
                        j.push("</div>"), i.setHtml(j.join("")), CKEDITOR.ui.fire("ready", this), this.parent ? this.parent._.panel.showAsChild(h, this.id, b, c, d, e) : h.showBlock(this.id, b, c, d, e), g.fire("menuShow", [h])
                    }
                },
                addListener: function(a) {
                    this._.listeners.push(a)
                },
                hide: function(a) {
                    this._.onHide && this._.onHide(), this._.panel && this._.panel.hide(a)
                }
            }
        }), CKEDITOR.menuItem = CKEDITOR.tools.createClass({
            $: function(a, b, c) {
                CKEDITOR.tools.extend(this, c, {
                    order: 0,
                    className: "cke_menubutton__" + b
                }), this.group = a._.menuGroups[this.group], this.editor = a, this.name = b
            },
            proto: {
                render: function(a, b, e) {
                    var f = a.id + ("" + b),
                        g = "undefined" == typeof this.state ? CKEDITOR.TRISTATE_OFF : this.state,
                        h = "",
                        i = g == CKEDITOR.TRISTATE_ON ? "on" : g == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
                    this.role in {
                        menuitemcheckbox: 1,
                        menuitemradio: 1
                    } && (h = ' aria-checked="' + (g == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
                    var j = this.getItems,
                        k = "&#" + ("rtl" == this.editor.lang.dir ? "9668" : "9658") + ";",
                        l = this.name;
                    this.icon && !/\./.test(this.icon) && (l = this.icon), a = {
                        id: f,
                        name: this.name,
                        iconName: l,
                        label: this.label,
                        cls: this.className || "",
                        state: i,
                        hasPopup: j ? "true" : "false",
                        disabled: g == CKEDITOR.TRISTATE_DISABLED,
                        title: this.label,
                        href: "javascript:void('" + (this.label || "").replace("'") + "')",
                        hoverFn: a._.itemOverFn,
                        moveOutFn: a._.itemOutFn,
                        clickFn: a._.itemClickFn,
                        index: b,
                        iconStyle: CKEDITOR.skin.getIconStyle(l, "rtl" == this.editor.lang.dir, l == this.icon ? null : this.icon, this.iconOffset),
                        arrowHtml: j ? d.output({
                            label: k
                        }) : "",
                        role: this.role ? this.role : "menuitem",
                        ariaChecked: h
                    }, c.output(a, e)
                }
            }
        })
    }(), CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div", CKEDITOR.plugins.add("contextmenu", {
        requires: "menu",
        onLoad: function() {
            CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
                base: CKEDITOR.menu,
                $: function(a) {
                    this.base.call(this, a, {
                        panel: {
                            className: "cke_menu_panel",
                            attributes: {
                                "aria-label": a.lang.contextmenu.options
                            }
                        }
                    })
                },
                proto: {
                    addTarget: function(a, b) {
                        if (a.on("contextmenu", function(a) {
                                var a = a.data,
                                    d = CKEDITOR.env.webkit ? c : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
                                if (!b || !d) {
                                    if (a.preventDefault(), CKEDITOR.env.mac && CKEDITOR.env.webkit) {
                                        var d = this.editor,
                                            e = new CKEDITOR.dom.elementPath(a.getTarget(), d.editable()).contains(function(a) {
                                                return a.hasAttribute("contenteditable")
                                            }, !0);
                                        e && "false" == e.getAttribute("contenteditable") && d.getSelection().fake(e)
                                    }
                                    var e = a.getTarget().getDocument(),
                                        f = a.getTarget().getDocument().getDocumentElement(),
                                        d = !e.equals(CKEDITOR.document),
                                        e = e.getWindow().getScrollPosition(),
                                        g = d ? a.$.clientX : a.$.pageX || e.x + a.$.clientX,
                                        h = d ? a.$.clientY : a.$.pageY || e.y + a.$.clientY;
                                    CKEDITOR.tools.setTimeout(function() {
                                        this.open(f, null, g, h)
                                    }, CKEDITOR.env.ie ? 200 : 0, this)
                                }
                            }, this), CKEDITOR.env.webkit) {
                            var c, d = function() {
                                c = 0
                            };
                            a.on("keydown", function(a) {
                                c = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
                            }), a.on("keyup", d), a.on("contextmenu", d)
                        }
                    },
                    open: function(a, b, c, d) {
                        this.editor.focus(), a = a || CKEDITOR.document.getDocumentElement(), this.editor.selectionChange(1), this.show(a, b, c, d)
                    }
                }
            })
        },
        beforeInit: function(a) {
            var b = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
            a.on("contentDom", function() {
                b.addTarget(a.editable(), !1 !== a.config.browserContextMenuOnCtrl)
            }), a.addCommand("contextMenu", {
                exec: function() {
                    a.contextMenu.open(a.document.getBody())
                }
            }), a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu"), a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
        }
    }), CKEDITOR.plugins.add("resize", {
        init: function(a) {
            var b, c, d, e, f = a.config,
                g = a.ui.spaceId("resizer"),
                h = a.element ? a.element.getDirection(1) : "ltr";
            if (!f.resize_dir && (f.resize_dir = "vertical"), void 0 == f.resize_maxWidth && (f.resize_maxWidth = 3e3), void 0 == f.resize_maxHeight && (f.resize_maxHeight = 3e3), void 0 == f.resize_minWidth && (f.resize_minWidth = 750), void 0 == f.resize_minHeight && (f.resize_minHeight = 250), !1 !== f.resize_enabled) {
                var i = null,
                    j = ("both" == f.resize_dir || "horizontal" == f.resize_dir) && f.resize_minWidth != f.resize_maxWidth,
                    k = ("both" == f.resize_dir || "vertical" == f.resize_dir) && f.resize_minHeight != f.resize_maxHeight,
                    l = function(g) {
                        var i = b,
                            l = c,
                            m = i + (g.data.$.screenX - d) * ("rtl" == h ? -1 : 1),
                            g = l + (g.data.$.screenY - e);
                        j && (i = Math.max(f.resize_minWidth, Math.min(m, f.resize_maxWidth))), k && (l = Math.max(f.resize_minHeight, Math.min(g, f.resize_maxHeight))), a.resize(j ? i : null, l)
                    },
                    m = function() {
                        CKEDITOR.document.removeListener("mousemove", l), CKEDITOR.document.removeListener("mouseup", m), a.document && (a.document.removeListener("mousemove", l), a.document.removeListener("mouseup", m))
                    },
                    n = CKEDITOR.tools.addFunction(function(g) {
                        i || (i = a.getResizable()), b = i.$.offsetWidth || 0, c = i.$.offsetHeight || 0, d = g.screenX, e = g.screenY, f.resize_minWidth > b && (f.resize_minWidth = b), f.resize_minHeight > c && (f.resize_minHeight = c), CKEDITOR.document.on("mousemove", l), CKEDITOR.document.on("mouseup", m), a.document && (a.document.on("mousemove", l), a.document.on("mouseup", m)), g.preventDefault && g.preventDefault()
                    });
                a.on("destroy", function() {
                    CKEDITOR.tools.removeFunction(n)
                }), a.on("uiSpace", function(b) {
                    if ("bottom" == b.data.space) {
                        var c = "";
                        j && !k && (c = " cke_resizer_horizontal"), !j && k && (c = " cke_resizer_vertical");
                        var d = '<span id="' + g + '" class="cke_resizer' + c + " cke_resizer_" + h + '" title="' + CKEDITOR.tools.htmlEncode(a.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event)">' + ("ltr" == h ? "◢" : "◣") + "</span>";
                        "ltr" == h && "ltr" == c ? b.data.html += d : b.data.html = d + b.data.html
                    }
                }, a, null, 100), a.on("maximize", function(b) {
                    a.ui.space("resizer")[b.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
                })
            }
        }
    }), function() {
        var a = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (a += ' onkeypress="return false;"'), CKEDITOR.env.gecko && (a += ' onblur="this.style.cssText = this.style.cssText;"');
        var a = a + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'),
            a = a + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>',
            b = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"),
            c = CKEDITOR.addTemplate("button", a);
        CKEDITOR.plugins.add("button", {
            beforeInit: function(a) {
                a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
            }
        }), CKEDITOR.UI_BUTTON = "button", CKEDITOR.ui.button = function(a) {
            CKEDITOR.tools.extend(this, a, {
                title: a.label,
                click: a.click || function(b) {
                    b.execCommand(a.command)
                }
            }), this._ = {}
        }, CKEDITOR.ui.button.handler = {
            create: function(a) {
                return new CKEDITOR.ui.button(a)
            }
        }, CKEDITOR.ui.button.prototype = {
            render: function(a, d) {
                var e, f = CKEDITOR.env,
                    g = this._.id = CKEDITOR.tools.getNextId(),
                    h = "",
                    i = this.command;
                this._.editor = a;
                var j = {
                        id: g,
                        button: this,
                        editor: a,
                        focus: function() {
                            CKEDITOR.document.getById(g).focus()
                        },
                        execute: function() {
                            this.button.click(a)
                        },
                        attach: function(a) {
                            this.button.attach(a)
                        }
                    },
                    k = CKEDITOR.tools.addFunction(function(a) {
                        return j.onkey ? (a = new CKEDITOR.dom.event(a), !1 !== j.onkey(j, a.getKeystroke())) : void 0
                    }),
                    l = CKEDITOR.tools.addFunction(function(a) {
                        var b;
                        return j.onfocus && (b = !1 !== j.onfocus(j, new CKEDITOR.dom.event(a))), b
                    }),
                    m = 0;
                if (j.clickFn = e = CKEDITOR.tools.addFunction(function() {
                        m && (a.unlockSelection(1), m = 0), j.execute(), f.iOS && a.focus()
                    }), this.modes) {
                    var n = {},
                        o = function() {
                            var b = a.mode;
                            b && (b = this.modes[b] ? void 0 != n[b] ? n[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, b = a.readOnly && !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b, this.setState(b), this.refresh && this.refresh())
                        };
                    a.on("beforeModeUnload", function() {
                        a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED && (n[a.mode] = this._.state)
                    }, this), a.on("activeFilterChange", o, this), a.on("mode", o, this), !this.readOnly && a.on("readOnly", o, this)
                } else i && (i = a.getCommand(i)) && (i.on("state", function() {
                    this.setState(i.state)
                }, this), h += i.state == CKEDITOR.TRISTATE_ON ? "on" : i.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off");
                this.directional && a.on("contentDirChanged", function(b) {
                    var c = CKEDITOR.document.getById(this._.id),
                        d = c.getFirst(),
                        b = b.data;
                    b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl"), d.setAttribute("style", CKEDITOR.skin.getIconStyle(p, "rtl" == b, this.icon, this.iconOffset))
                }, this), i || (h += "off");
                var p = o = this.name || this.command;
                return this.icon && !/\./.test(this.icon) && (p = this.icon, this.icon = null), h = {
                    id: g,
                    name: o,
                    iconName: p,
                    label: this.label,
                    cls: this.className || "",
                    state: h,
                    ariaDisabled: "disabled" == h ? "true" : "false",
                    title: this.title,
                    titleJs: f.gecko && !f.hc ? "" : (this.title || "").replace("'", ""),
                    hasArrow: this.hasArrow ? "true" : "false",
                    keydownFn: k,
                    focusFn: l,
                    clickFn: e,
                    style: CKEDITOR.skin.getIconStyle(p, "rtl" == a.lang.dir, this.icon, this.iconOffset),
                    arrowHtml: this.hasArrow ? b.output() : ""
                }, c.output(h, d), this.onRender && this.onRender(), j
            },
            setState: function(a) {
                if (this._.state == a) return !1;
                this._.state = a;
                var b = CKEDITOR.document.getById(this._.id);
                return b ? (b.setState(a, "cke_button"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled"), this.hasArrow ? (a = a == CKEDITOR.TRISTATE_ON ? this._.editor.lang.button.selectedLabel.replace(/%1/g, this.label) : this.label, CKEDITOR.document.getById(this._.id + "_label").setText(a)) : a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", !0) : b.removeAttribute("aria-pressed"), !0) : !1
            },
            getState: function() {
                return this._.state
            },
            toFeature: function(a) {
                if (this._.feature) return this._.feature;
                var b = this;
                return !this.allowedContent && !this.requiredContent && this.command && (b = a.getCommand(this.command) || b), this._.feature = b
            }
        }, CKEDITOR.ui.prototype.addButton = function(a, b) {
            this.add(a, CKEDITOR.UI_BUTTON, b)
        }
    }(), function() {
        function a(a) {
            function c() {
                for (var c = d(), f = CKEDITOR.tools.clone(a.config.toolbarGroups) || b(a), g = 0; g < f.length; g++) {
                    var h = f[g];
                    if ("/" != h) {
                        "string" == typeof h && (h = f[g] = {
                            name: h
                        });
                        var i, j = h.groups;
                        if (j)
                            for (var k = 0; k < j.length; k++) i = j[k], (i = c[i]) && e(h, i);
                        (i = c[h.name]) && e(h, i)
                    }
                }
                return f
            }

            function d() {
                var b, c, d, e = {};
                for (b in a.ui.items) c = a.ui.items[b], d = c.toolbar || "others", d = d.split(","), c = d[0], d = parseInt(d[1] || -1, 10), e[c] || (e[c] = []), e[c].push({
                    name: b,
                    order: d
                });
                for (c in e) e[c] = e[c].sort(function(a, b) {
                    return a.order == b.order ? 0 : 0 > b.order ? -1 : 0 > a.order ? 1 : a.order < b.order ? -1 : 1
                });
                return e
            }

            function e(b, c) {
                if (c.length) {
                    b.items ? b.items.push(a.ui.create("-")) : b.items = [];
                    for (var d; d = c.shift();) d = "string" == typeof d ? d : d.name, g && -1 != CKEDITOR.tools.indexOf(g, d) || (d = a.ui.create(d)) && a.addFeature(d) && b.items.push(d)
                }
            }

            function f(a) {
                var b, c, d, f = [];
                for (b = 0; b < a.length; ++b) c = a[b], d = {}, "/" == c ? f.push(c) : CKEDITOR.tools.isArray(c) ? (e(d, CKEDITOR.tools.clone(c)), f.push(d)) : c.items && (e(d, CKEDITOR.tools.clone(c.items)), d.name = c.name, f.push(d));
                return f
            }
            var g = a.config.removeButtons,
                g = g && g.split(","),
                h = a.config.toolbar;
            return "string" == typeof h && (h = a.config["toolbar_" + h]), a.toolbar = h ? f(h) : c()
        }

        function b(a) {
            return a._.toolbarGroups || (a._.toolbarGroups = [{
                name: "document",
                groups: ["mode", "document", "doctools"]
            }, {
                name: "clipboard",
                groups: ["clipboard", "undo"]
            }, {
                name: "editing",
                groups: ["find", "selection", "spellchecker"]
            }, {
                name: "forms"
            }, "/", {
                name: "basicstyles",
                groups: ["basicstyles", "cleanup"]
            }, {
                name: "paragraph",
                groups: ["list", "indent", "blocks", "align", "bidi"]
            }, {
                name: "links"
            }, {
                name: "insert"
            }, "/", {
                name: "styles"
            }, {
                name: "colors"
            }, {
                name: "tools"
            }, {
                name: "others"
            }, {
                name: "about"
            }])
        }
        var c = function() {
            this.toolbars = [], this.focusCommandExecuted = !1
        };
        c.prototype.focus = function() {
            for (var a, b = 0; a = this.toolbars[b++];)
                for (var c, d = 0; c = a.items[d++];)
                    if (c.focus) return void c.focus()
        };
        var d = {
            modes: {
                wysiwyg: 1,
                source: 1
            },
            readOnly: 1,
            exec: function(a) {
                a.toolbox && (a.toolbox.focusCommandExecuted = !0, CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function() {
                    a.toolbox.focus()
                }, 100) : a.toolbox.focus())
            }
        };
        CKEDITOR.plugins.add("toolbar", {
            requires: "button",
            init: function(b) {
                var e, f = function(a, c) {
                    var d, g = "rtl" == b.lang.dir,
                        h = b.config.toolbarGroupCycling,
                        i = g ? 37 : 39,
                        g = g ? 39 : 37,
                        h = void 0 === h || h;
                    switch (c) {
                        case 9:
                        case CKEDITOR.SHIFT + 9:
                            for (; !d || !d.items.length;)
                                if (d = 9 == c ? (d ? d.next : a.toolbar.next) || b.toolbox.toolbars[0] : (d ? d.previous : a.toolbar.previous) || b.toolbox.toolbars[b.toolbox.toolbars.length - 1], d.items.length)
                                    for (a = d.items[e ? d.items.length - 1 : 0]; a && !a.focus;)(a = e ? a.previous : a.next) || (d = 0);
                            return a && a.focus(), !1;
                        case i:
                            d = a;
                            do d = d.next, !d && h && (d = a.toolbar.items[0]); while (d && !d.focus);
                            return d ? d.focus() : f(a, 9), !1;
                        case 40:
                            return a.button && a.button.hasArrow ? (b.once("panelShow", function(a) {
                                a.data._.panel._.currentBlock.onKeyDown(40)
                            }), a.execute()) : f(a, 40 == c ? i : g), !1;
                        case g:
                        case 38:
                            d = a;
                            do d = d.previous, !d && h && (d = a.toolbar.items[a.toolbar.items.length - 1]); while (d && !d.focus);
                            return d ? d.focus() : (e = 1, f(a, CKEDITOR.SHIFT + 9), e = 0), !1;
                        case 27:
                            return b.focus(), !1;
                        case 13:
                        case 32:
                            return a.execute(), !1
                    }
                    return !0
                };
                b.on("uiSpace", function(d) {
                    if (d.data.space == b.config.toolbarLocation) {
                        d.removeListener(), b.toolbox = new c;
                        var e, g, h = CKEDITOR.tools.getNextId(),
                            i = ['<span id="', h, '" class="cke_voice_label">', b.lang.toolbar.toolbars, "</span>", '<span id="' + b.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', h, '" onmousedown="return false;">'],
                            h = !1 !== b.config.toolbarStartupExpanded;
                        b.config.toolbarCanCollapse && b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && i.push('<span class="cke_toolbox_main"' + (h ? ">" : ' style="display:none">'));
                        for (var j = b.toolbox.toolbars, k = a(b), l = 0; l < k.length; l++) {
                            var m, n, o, p = 0,
                                q = k[l];
                            if (q)
                                if (e && (i.push("</span>"), g = e = 0), "/" === q) i.push('<span class="cke_toolbar_break"></span>');
                                else {
                                    o = q.items || q;
                                    for (var r = 0; r < o.length; r++) {
                                        var s, t = o[r];
                                        if (t)
                                            if (t.type == CKEDITOR.UI_SEPARATOR) g = e && t;
                                            else {
                                                if (s = !1 !== t.canGroup, !p) {
                                                    m = CKEDITOR.tools.getNextId(), p = {
                                                        id: m,
                                                        items: []
                                                    }, n = q.name && (b.lang.toolbar.toolbarGroups[q.name] || q.name), i.push('<span id="', m, '" class="cke_toolbar"', n ? ' aria-labelledby="' + m + '_label"' : "", ' role="toolbar">'), n && i.push('<span id="', m, '_label" class="cke_voice_label">', n, "</span>"), i.push('<span class="cke_toolbar_start"></span>');
                                                    var u = j.push(p) - 1;
                                                    u > 0 && (p.previous = j[u - 1], p.previous.next = p)
                                                }
                                                s ? e || (i.push('<span class="cke_toolgroup" role="presentation">'), e = 1) : e && (i.push("</span>"), e = 0), m = function(a) {
                                                    a = a.render(b, i), u = p.items.push(a) - 1, u > 0 && (a.previous = p.items[u - 1], a.previous.next = a), a.toolbar = p, a.onkey = f, a.onfocus = function() {
                                                        b.toolbox.focusCommandExecuted || b.focus()
                                                    }
                                                }, g && (m(g), g = 0), m(t)
                                            }
                                    }
                                    e && (i.push("</span>"), g = e = 0), p && i.push('<span class="cke_toolbar_end"></span></span>')
                                }
                        }
                        if (b.config.toolbarCanCollapse && i.push("</span>"), b.config.toolbarCanCollapse && b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                            var v = CKEDITOR.tools.addFunction(function() {
                                b.execCommand("toolbarCollapse")
                            });
                            b.on("destroy", function() {
                                CKEDITOR.tools.removeFunction(v)
                            }), b.addCommand("toolbarCollapse", {
                                readOnly: 1,
                                exec: function(a) {
                                    var b = a.ui.space("toolbar_collapser"),
                                        c = b.getPrevious(),
                                        d = a.ui.space("contents"),
                                        e = c.getParent(),
                                        f = parseInt(d.$.style.height, 10),
                                        g = e.$.offsetHeight,
                                        h = b.hasClass("cke_toolbox_collapser_min");
                                    h ? (c.show(), b.removeClass("cke_toolbox_collapser_min"), b.setAttribute("title", a.lang.toolbar.toolbarCollapse)) : (c.hide(), b.addClass("cke_toolbox_collapser_min"), b.setAttribute("title", a.lang.toolbar.toolbarExpand)), b.getFirst().setText(h ? "▲" : "◀"), d.setStyle("height", f - (e.$.offsetHeight - g) + "px"), a.fire("resize")
                                },
                                modes: {
                                    wysiwyg: 1,
                                    source: 1
                                }
                            }), b.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109), "toolbarCollapse"), i.push('<a title="' + (h ? b.lang.toolbar.toolbarCollapse : b.lang.toolbar.toolbarExpand) + '" id="' + b.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser'), h || i.push(" cke_toolbox_collapser_min"), i.push('" onclick="CKEDITOR.tools.callFunction(' + v + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>")
                        }
                        i.push("</span>"), d.data.html += i.join("")
                    }
                }), b.on("destroy", function() {
                    if (this.toolbox) {
                        var a, b, c, d, e = 0;
                        for (a = this.toolbox.toolbars; e < a.length; e++)
                            for (c = a[e].items, b = 0; b < c.length; b++) d = c[b], d.clickFn && CKEDITOR.tools.removeFunction(d.clickFn), d.keyDownFn && CKEDITOR.tools.removeFunction(d.keyDownFn)
                    }
                }), b.on("uiReady", function() {
                    var a = b.ui.space("toolbox");
                    a && b.focusManager.add(a, 1)
                }), b.addCommand("toolbarFocus", d), b.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus"), b.ui.add("-", CKEDITOR.UI_SEPARATOR, {}), b.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
                    create: function() {
                        return {
                            render: function(a, b) {
                                return b.push('<span class="cke_toolbar_separator" role="separator"></span>'), {}
                            }
                        }
                    }
                })
            }
        }), CKEDITOR.ui.prototype.addToolbarGroup = function(a, c, d) {
            var e = b(this.editor),
                f = 0 === c,
                g = {
                    name: a
                };
            if (d) {
                if (d = CKEDITOR.tools.search(e, function(a) {
                        return a.name == d
                    })) return !d.groups && (d.groups = []), c && (c = CKEDITOR.tools.indexOf(d.groups, c), c >= 0) ? void d.groups.splice(c + 1, 0, a) : void(f ? d.groups.splice(0, 0, a) : d.groups.push(a));
                c = null
            }
            c && (c = CKEDITOR.tools.indexOf(e, function(a) {
                return a.name == c
            })), f ? e.splice(0, 0, a) : "number" == typeof c ? e.splice(c + 1, 0, g) : e.push(a)
        }
    }(), CKEDITOR.UI_SEPARATOR = "separator", CKEDITOR.config.toolbarLocation = "top", function() {
        function a(a, d) {
            function f(b) {
                if (b = j.list[b], b.equals(a.editable()) || "true" == b.getAttribute("contenteditable")) {
                    var c = a.createRange();
                    c.selectNodeContents(b), c.select()
                } else a.getSelection().selectElement(b);
                a.focus()
            }

            function g() {
                h && h.setHtml(c), delete j.list
            }
            var h, i = a.ui.spaceId("path"),
                j = a._.elementsPath,
                k = j.idBase;
            d.html += '<span id="' + i + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + i + '" class="cke_path" role="group" aria-labelledby="' + i + '_label">' + c + "</span>", a.on("uiReady", function() {
                var b = a.ui.space("path");
                b && a.focusManager.add(b, 1)
            }), j.onClick = f;
            var l = CKEDITOR.tools.addFunction(f),
                m = CKEDITOR.tools.addFunction(function(b, c) {
                    var d, e = j.idBase,
                        c = new CKEDITOR.dom.event(c);
                    switch (d = "rtl" == a.lang.dir, c.getKeystroke()) {
                        case d ? 39:
                            37:
                                case 9:
                            return (d = CKEDITOR.document.getById(e + (b + 1))) || (d = CKEDITOR.document.getById(e + "0")), d.focus(), !1;
                        case d ? 37:
                            39:
                                case CKEDITOR.SHIFT + 9:
                            return (d = CKEDITOR.document.getById(e + (b - 1))) || (d = CKEDITOR.document.getById(e + (j.list.length - 1))), d.focus(), !1;
                        case 27:
                            return a.focus(), !1;
                        case 13:
                        case 32:
                            return f(b), !1
                    }
                    return !0
                });
            a.on("selectionChange", function() {
                a.editable();
                for (var b, d = [], f = j.list = [], g = [], n = j.filters, o = !0, p = a.elementPath().elements, q = p.length; q--;) {
                    var r = p[q],
                        s = 0;
                    b = r.data("cke-display-name") ? r.data("cke-display-name") : r.data("cke-real-element-type") ? r.data("cke-real-element-type") : r.getName(), o = r.hasAttribute("contenteditable") ? "true" == r.getAttribute("contenteditable") : o, !o && !r.hasAttribute("contenteditable") && (s = 1);
                    for (var t = 0; t < n.length; t++) {
                        var u = n[t](r, b);
                        if (!1 === u) {
                            s = 1;
                            break
                        }
                        b = u || b
                    }
                    s || (f.unshift(r), g.unshift(b))
                }
                for (f = f.length, n = 0; f > n; n++) b = g[n], o = a.lang.elementspath.eleTitle.replace(/%1/, b), b = e.output({
                    id: k + n,
                    label: o,
                    text: b,
                    jsTitle: "javascript:void('" + b + "')",
                    index: n,
                    keyDownFn: m,
                    clickFn: l
                }), d.unshift(b);
                h || (h = CKEDITOR.document.getById(i)), g = h, g.setHtml(d.join("") + c), a.fire("elementsPathUpdate", {
                    space: g
                })
            }), a.on("readOnly", g), a.on("contentDomUnload", g), a.addCommand("elementsPathFocus", b), a.setKeystroke(CKEDITOR.ALT + 122, "elementsPathFocus")
        }
        var b;
        b = {
            editorFocus: !1,
            readOnly: 1,
            exec: function(a) {
                (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
            }
        };
        var c = '<span class="cke_path_empty">&nbsp;</span>',
            d = "";
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (d += ' onkeypress="return false;"'), CKEDITOR.env.gecko && (d += ' onblur="this.style.cssText = this.style.cssText;"');
        var e = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' + d + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
        CKEDITOR.plugins.add("elementspath", {
            init: function(b) {
                b._.elementsPath = {
                    idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_",
                    filters: []
                }, b.on("uiSpace", function(c) {
                    "bottom" == c.data.space && a(b, c.data)
                })
            }
        })
    }(), function() {
        function a(a) {
            var b = a.startContainer.getAscendant(function(a) {
                return a.type == CKEDITOR.NODE_ELEMENT && "true" == a.getAttribute("contenteditable")
            }, !0);
            return a.root.equals(b) ? a : (b = new CKEDITOR.dom.range(b), b.moveToRange(a), b)
        }

        function b(a, b, c) {
            c = a.config.forceEnterMode || c, "wysiwyg" == a.mode && (b || (b = a.activeEnterMode), a.elementPath().isContextFor("p") || (b = CKEDITOR.ENTER_BR, c = 1), a.fire("saveSnapshot"), b == CKEDITOR.ENTER_BR ? g(a, b, null, c) : h(a, b, null, c), a.fire("saveSnapshot"))
        }

        function c(a) {
            for (var a = a.getSelection().getRanges(!0), b = a.length - 1; b > 0; b--) a[b].deleteContents();
            return a[0]
        }
        CKEDITOR.plugins.add("enterkey", {
            init: function(a) {
                a.addCommand("enter", {
                    modes: {
                        wysiwyg: 1
                    },
                    editorFocus: !1,
                    exec: function(a) {
                        b(a)
                    }
                }), a.addCommand("shiftEnter", {
                    modes: {
                        wysiwyg: 1
                    },
                    editorFocus: !1,
                    exec: function(a) {
                        b(a, a.activeShiftEnterMode, 1)
                    }
                }), a.setKeystroke([
                    [13, "enter"],
                    [CKEDITOR.SHIFT + 13, "shiftEnter"]
                ])
            }
        });
        var d = CKEDITOR.dom.walker.whitespaces(),
            e = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.plugins.enterkey = {
            enterBlock: function(b, f, h, j) {
                if (h = h || c(b)) {
                    var k, h = a(h),
                        l = h.document,
                        m = h.checkStartOfBlock(),
                        n = h.checkEndOfBlock(),
                        o = b.elementPath(h.startContainer),
                        p = o.block,
                        q = f == CKEDITOR.ENTER_DIV ? "div" : "p";
                    if (m && n) {
                        if (p && (p.is("li") || p.getParent().is("li"))) {
                            p.is("li") || (p = p.getParent()), h = p.getParent(), k = h.getParent();
                            var j = !p.hasPrevious(),
                                r = !p.hasNext(),
                                q = b.getSelection(),
                                s = q.createBookmarks(),
                                m = p.getDirection(1),
                                n = p.getAttribute("class"),
                                t = p.getAttribute("style"),
                                u = k.getDirection(1) != m,
                                b = b.enterMode != CKEDITOR.ENTER_BR || u || t || n;
                            if (k.is("li")) j || r ? p[j ? "insertBefore" : "insertAfter"](k) : p.breakParent(k);
                            else {
                                if (b) o.block.is("li") ? (k = l.createElement(f == CKEDITOR.ENTER_P ? "p" : "div"), u && k.setAttribute("dir", m), t && k.setAttribute("style", t), n && k.setAttribute("class", n), p.moveChildren(k)) : k = o.block, j || r ? k[j ? "insertBefore" : "insertAfter"](h) : (p.breakParent(h), k.insertAfter(h));
                                else if (p.appendBogus(!0), j || r)
                                    for (; l = p[j ? "getFirst" : "getLast"]();) l[j ? "insertBefore" : "insertAfter"](h);
                                else
                                    for (p.breakParent(h); l = p.getLast();) l.insertAfter(h);
                                p.remove()
                            }
                            return void q.selectBookmarks(s)
                        }
                        if (p && p.getParent().is("blockquote")) return p.breakParent(p.getParent()), p.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || p.getPrevious().remove(), p.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || p.getNext().remove(), h.moveToElementEditStart(p), void h.select()
                    } else if (p && p.is("pre") && !n) return void g(b, f, h, j);
                    if (m = h.splitBlock(q)) {
                        if (f = m.previousBlock, p = m.nextBlock, o = m.wasStartOfBlock, b = m.wasEndOfBlock, p ? (s = p.getParent(), s.is("li") && (p.breakParent(s), p.move(p.getNext(), 1))) : f && (s = f.getParent()) && s.is("li") && (f.breakParent(s), s = f.getNext(), h.moveToElementEditStart(s), f.move(f.getPrevious())), o || b) {
                            if (f ? (f.is("li") || !i.test(f.getName()) && !f.is("pre")) && (k = f.clone()) : p && (k = p.clone()), k ? j && !k.is("li") && k.renameNode(q) : s && s.is("li") ? k = s : (k = l.createElement(q), f && (r = f.getDirection()) && k.setAttribute("dir", r)), l = m.elementPath)
                                for (j = 0, q = l.elements.length; q > j && (s = l.elements[j], !s.equals(l.block) && !s.equals(l.blockLimit)); j++) CKEDITOR.dtd.$removeEmpty[s.getName()] && (s = s.clone(), k.moveChildren(s), k.append(s));
                            k.appendBogus(), k.getParent() || h.insertNode(k), k.is("li") && k.removeAttribute("value"), !CKEDITOR.env.ie || !o || b && f.getChildCount() || (h.moveToElementEditStart(b ? f : k), h.select()), h.moveToElementEditStart(o && !b ? p : k)
                        } else p.is("li") && (k = h.clone(), k.selectNodeContents(p), k = new CKEDITOR.dom.walker(k), k.evaluator = function(a) {
                            return !(e(a) || d(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))
                        }, (s = k.next()) && s.type == CKEDITOR.NODE_ELEMENT && s.is("ul", "ol") && (CKEDITOR.env.needsBrFiller ? l.createElement("br") : l.createText(" ")).insertBefore(s)), p && h.moveToElementEditStart(p);
                        h.select(), h.scrollIntoView()
                    }
                }
            },
            enterBr: function(a, b, d, e) {
                if (d = d || c(a)) {
                    var f = d.document,
                        g = d.checkEndOfBlock(),
                        j = new CKEDITOR.dom.elementPath(a.getSelection().getStartElement()),
                        k = j.block,
                        l = k && j.block.getName();
                    e || "li" != l ? (!e && g && i.test(l) ? (g = k.getDirection()) ? (f = f.createElement("div"), f.setAttribute("dir", g), f.insertAfter(k), d.setStart(f, 0)) : (f.createElement("br").insertAfter(k), CKEDITOR.env.gecko && f.createText("").insertAfter(k), d.setStartAt(k.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)) : (a = "pre" == l && CKEDITOR.env.ie && 8 > CKEDITOR.env.version ? f.createText("\r") : f.createElement("br"), d.deleteContents(), d.insertNode(a), CKEDITOR.env.needsBrFiller ? (f.createText("\ufeff").insertAfter(a), g && (k || j.blockLimit).appendBogus(), a.getNext().$.nodeValue = "", d.setStartAt(a.getNext(), CKEDITOR.POSITION_AFTER_START)) : d.setStartAt(a, CKEDITOR.POSITION_AFTER_END)), d.collapse(!0), d.select(), d.scrollIntoView()) : h(a, b, d, e)
                }
            }
        };
        var f = CKEDITOR.plugins.enterkey,
            g = f.enterBr,
            h = f.enterBlock,
            i = /^h[1-6]$/
    }(), function() {
        function a(a, b) {
            var c = {},
                d = [],
                e = {
                    nbsp: " ",
                    shy: "­",
                    gt: ">",
                    lt: "<",
                    amp: "&",
                    apos: "'",
                    quot: '"'
                },
                a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function(a, f) {
                    var g = b ? "&" + f + ";" : e[f];
                    return c[g] = b ? e[f] : "&" + f + ";", d.push(g), ""
                });
            if (!b && a) {
                var f, a = a.split(","),
                    g = document.createElement("div");
                for (g.innerHTML = "&" + a.join(";&") + ";", f = g.innerHTML, g = null, g = 0; g < f.length; g++) {
                    var h = f.charAt(g);
                    c[h] = "&" + a[g] + ";", d.push(h)
                }
            }
            return c.regex = d.join(b ? "|" : ""), c
        }
        CKEDITOR.plugins.add("entities", {
            afterInit: function(b) {
                var c = b.config;
                if (b = (b = b.dataProcessor) && b.htmlFilter) {
                    var d = [];
                    !1 !== c.basicEntities && d.push("nbsp,gt,lt,amp"), c.entities && (d.length && d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"), c.entities_latin && d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"), c.entities_greek && d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"), c.entities_additional && d.push(c.entities_additional));
                    var e = a(d.join(",")),
                        f = e.regex ? "[" + e.regex + "]" : "a^";
                    delete e.regex, c.entities && c.entities_processNumerical && (f = "[^ -~]|" + f);
                    var f = RegExp(f, "g"),
                        g = function(a) {
                            return "force" != c.entities_processNumerical && e[a] ? e[a] : "&#" + a.charCodeAt(0) + ";"
                        },
                        h = a("nbsp,gt,lt,amp,shy", !0),
                        i = RegExp(h.regex, "g"),
                        j = function(a) {
                            return h[a]
                        };
                    b.addRules({
                        text: function(a) {
                            return a.replace(i, j).replace(f, g)
                        }
                    }, {
                        applyToAll: !0,
                        excludeNestedEditable: !0
                    })
                }
            }
        })
    }(), CKEDITOR.config.basicEntities = !0, CKEDITOR.config.entities = !0, CKEDITOR.config.entities_latin = !0, CKEDITOR.config.entities_greek = !0, CKEDITOR.config.entities_additional = "#39", CKEDITOR.plugins.add("popup"), CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        popup: function(a, b, c, d) {
            b = b || "80%", c = c || "70%", "string" == typeof b && 1 < b.length && "%" == b.substr(b.length - 1, 1) && (b = parseInt(window.screen.width * parseInt(b, 10) / 100, 10)), "string" == typeof c && 1 < c.length && "%" == c.substr(c.length - 1, 1) && (c = parseInt(window.screen.height * parseInt(c, 10) / 100, 10)), 640 > b && (b = 640), 420 > c && (c = 420);
            var e = parseInt((window.screen.height - c) / 2, 10),
                f = parseInt((window.screen.width - b) / 2, 10),
                d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" + b + ",height=" + c + ",top=" + e + ",left=" + f,
                g = window.open("", null, d, !0);
            if (!g) return !1;
            try {
                -1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") && (g.moveTo(f, e), g.resizeTo(b, c)), g.focus(), g.location.href = a
            } catch (h) {
                window.open(a, null, d, !0)
            }
            return !0
        }
    }), function() {
        function a(a, b) {
            var c = [];
            if (!b) return a;
            for (var d in b) c.push(d + "=" + encodeURIComponent(b[d]));
            return a + (-1 != a.indexOf("?") ? "&" : "?") + c.join("&")
        }

        function b(a) {
            return a += "", a.charAt(0).toUpperCase() + a.substr(1)
        }

        function c() {
            var c = this.getDialog(),
                d = c.getParentEditor();
            d._.filebrowserSe = this;
            var e = d.config["filebrowser" + b(c.getName()) + "WindowWidth"] || d.config.filebrowserWindowWidth || "80%",
                c = d.config["filebrowser" + b(c.getName()) + "WindowHeight"] || d.config.filebrowserWindowHeight || "70%",
                f = this.filebrowser.params || {};
            f.CKEditor = d.name, f.CKEditorFuncNum = d._.filebrowserFn, f.langCode || (f.langCode = d.langCode), f = a(this.filebrowser.url, f), d.popup(f, e, c, d.config.filebrowserWindowFeatures || d.config.fileBrowserWindowFeatures)
        }

        function d() {
            var a = this.getDialog();
            return a.getParentEditor()._.filebrowserSe = this, a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value && a.getContentElement(this["for"][0], this["for"][1]).getAction() ? !0 : !1
        }

        function e(b, c, d) {
            var e = d.params || {};
            e.CKEditor = b.name, e.CKEditorFuncNum = b._.filebrowserFn, e.langCode || (e.langCode = b.langCode), c.action = a(d.url, e), c.filebrowser = d
        }

        function f(a, g, h, i) {
            if (i && i.length)
                for (var j, k = i.length; k--;)
                    if (j = i[k], ("hbox" == j.type || "vbox" == j.type || "fieldset" == j.type) && f(a, g, h, j.children), j.filebrowser)
                        if ("string" == typeof j.filebrowser && (j.filebrowser = {
                                action: "fileButton" == j.type ? "QuickUpload" : "Browse",
                                target: j.filebrowser
                            }), "Browse" == j.filebrowser.action) {
                            var l = j.filebrowser.url;
                            void 0 === l && (l = a.config["filebrowser" + b(g) + "BrowseUrl"], void 0 === l && (l = a.config.filebrowserBrowseUrl)), l && (j.onClick = c, j.filebrowser.url = l, j.hidden = !1)
                        } else if ("QuickUpload" == j.filebrowser.action && j["for"] && (l = j.filebrowser.url, void 0 === l && (l = a.config["filebrowser" + b(g) + "UploadUrl"], void 0 === l && (l = a.config.filebrowserUploadUrl)), l)) {
                var m = j.onClick;
                j.onClick = function(a) {
                    var b = a.sender;
                    return m && m.call(b, a) === !1 ? !1 : d.call(b, a)
                }, j.filebrowser.url = l, j.hidden = !1, e(a, h.getContents(j["for"][0]).get(j["for"][1]), j.filebrowser)
            }
        }

        function g(a, b, c) {
            if (-1 !== c.indexOf(";")) {
                for (var c = c.split(";"), d = 0; d < c.length; d++)
                    if (g(a, b, c[d])) return !0;
                return !1
            }
            return (a = a.getContents(b).get(c).filebrowser) && a.url
        }

        function h(a, b) {
            var c = this._.filebrowserSe.getDialog(),
                d = this._.filebrowserSe["for"],
                e = this._.filebrowserSe.filebrowser.onSelect;
            d && c.getContentElement(d[0], d[1]).reset(), "function" == typeof b && !1 === b.call(this._.filebrowserSe) || e && !1 === e.call(this._.filebrowserSe, a, b) || ("string" == typeof b && b && alert(b), !(a && (d = this._.filebrowserSe, c = d.getDialog(), d = d.filebrowser.target || null))) || (d = d.split(":"), (e = c.getContentElement(d[0], d[1])) && (e.setValue(a), c.selectPage(d[0])))
        }
        CKEDITOR.plugins.add("filebrowser", {
            requires: "popup",
            init: function(a) {
                a._.filebrowserFn = CKEDITOR.tools.addFunction(h, a), a.on("destroy", function() {
                    CKEDITOR.tools.removeFunction(this._.filebrowserFn)
                })
            }
        }), CKEDITOR.on("dialogDefinition", function(a) {
            if (a.editor.plugins.filebrowser)
                for (var b, c = a.data.definition, d = 0; d < c.contents.length; ++d)(b = c.contents[d]) && (f(a.editor, a.data.name, c, b.elements), b.hidden && b.filebrowser && (b.hidden = !g(c, b.id, b.filebrowser)))
        })
    }(), function() {
        function a(a) {
            var d = a.config,
                e = a.fire("uiSpace", {
                    space: "top",
                    html: ""
                }).html,
                f = function() {
                    function e(a, b, d) {
                        h.setStyle(b, c(d)), h.setStyle("position", a)
                    }

                    function g(a) {
                        var b = j.getDocumentPosition();
                        switch (a) {
                            case "top":
                                e("absolute", "top", b.y - n - q);
                                break;
                            case "pin":
                                e("fixed", "top", s);
                                break;
                            case "bottom":
                                e("absolute", "top", b.y + (l.height || l.bottom - l.top) + q)
                        }
                        i = a
                    }
                    var i, j, k, l, m, n, o, p = d.floatSpaceDockedOffsetX || 0,
                        q = d.floatSpaceDockedOffsetY || 0,
                        r = d.floatSpacePinnedOffsetX || 0,
                        s = d.floatSpacePinnedOffsetY || 0;
                    return function(d) {
                        if (j = a.editable())
                            if (d && "focus" == d.name && h.show(), h.removeStyle("left"), h.removeStyle("right"), k = h.getClientRect(), l = j.getClientRect(), m = b.getViewPaneSize(), n = k.height, o = "pageXOffset" in b.$ ? b.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft, i) {
                                g(n + q <= l.top ? "top" : n + q > m.height - l.bottom ? "pin" : "bottom");
                                var e, d = m.width / 2,
                                    d = 0 < l.left && l.right < m.width && l.width > k.width ? "rtl" == a.config.contentsLangDirection ? "right" : "left" : d - l.left > l.right - d ? "left" : "right";
                                k.width > m.width ? (d = "left", e = 0) : (e = "left" == d ? 0 < l.left ? l.left : 0 : l.right < m.width ? m.width - l.right : 0, e + k.width > m.width && (d = "left" == d ? "right" : "left", e = 0)), h.setStyle(d, c(("pin" == i ? r : p) + e + ("pin" == i ? 0 : "left" == d ? o : -o)))
                            } else i = "pin", g("pin"), f(d)
                    }
                }();
            if (e) {
                var g = new CKEDITOR.template('<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}"' + (a.title ? ' aria-labelledby="cke_{name}_arialbl"' : " ") + ">" + (a.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : " ") + '<div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'),
                    h = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(g.output({
                        content: e,
                        id: a.id,
                        langDir: a.lang.dir,
                        langCode: a.langCode,
                        name: a.name,
                        style: "display:none;z-index:" + (d.baseFloatZIndex - 1),
                        topId: a.ui.spaceId("top"),
                        voiceLabel: a.title
                    }))),
                    i = CKEDITOR.tools.eventsBuffer(500, f),
                    j = CKEDITOR.tools.eventsBuffer(100, f);
                h.unselectable(), h.on("mousedown", function(a) {
                    a = a.data, a.getTarget().hasAscendant("a", 1) || a.preventDefault()
                }), a.on("focus", function(c) {
                    f(c), a.on("change", i.input), b.on("scroll", j.input), b.on("resize", j.input)
                }), a.on("blur", function() {
                    h.hide(), a.removeListener("change", i.input), b.removeListener("scroll", j.input), b.removeListener("resize", j.input)
                }), a.on("destroy", function() {
                    b.removeListener("scroll", j.input), b.removeListener("resize", j.input), h.clearCustomData(), h.remove()
                }), a.focusManager.hasFocus && h.show(), a.focusManager.add(h, 1)
            }
        }
        var b = CKEDITOR.document.getWindow(),
            c = CKEDITOR.tools.cssLength;
        CKEDITOR.plugins.add("floatingspace", {
            init: function(b) {
                b.on("loaded", function() {
                    a(this)
                }, null, null, 20)
            }
        })
    }(), CKEDITOR.plugins.add("listblock", {
        requires: "panel",
        onLoad: function() {
            var a = CKEDITOR.addTemplate("panel-list", '<ul role="presentation" class="cke_panel_list">{items}</ul>'),
                b = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),
                c = CKEDITOR.addTemplate("panel-list-group", '<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>'),
                d = /\'/g;
            CKEDITOR.ui.panel.prototype.addListBlock = function(a, b) {
                return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
            }, CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
                base: CKEDITOR.ui.panel.block,
                $: function(a, b) {
                    var b = b || {},
                        c = b.attributes || (b.attributes = {});
                    (this.multiSelect = !!b.multiSelect) && (c["aria-multiselectable"] = !0), !c.role && (c.role = "listbox"), this.base.apply(this, arguments), this.element.setAttribute("role", c.role), c = this.keys, c[40] = "next", c[9] = "next", c[38] = "prev", c[CKEDITOR.SHIFT + 9] = "prev", c[32] = CKEDITOR.env.ie ? "mouseup" : "click", CKEDITOR.env.ie && (c[13] = "mouseup"), this._.pendingHtml = [], this._.pendingList = [], this._.items = {}, this._.groups = {}
                },
                _: {
                    close: function() {
                        if (this._.started) {
                            var b = a.output({
                                items: this._.pendingList.join("")
                            });
                            this._.pendingList = [], this._.pendingHtml.push(b), delete this._.started
                        }
                    },
                    getClick: function() {
                        return this._.click || (this._.click = CKEDITOR.tools.addFunction(function(a) {
                            var b = this.toggle(a);
                            this.onClick && this.onClick(a, b)
                        }, this)), this._.click
                    }
                },
                proto: {
                    add: function(a, c, e) {
                        var f = CKEDITOR.tools.getNextId();
                        this._.started || (this._.started = 1, this._.size = this._.size || 0), this._.items[a] = f;
                        var g;
                        g = CKEDITOR.tools.htmlEncodeAttr(a).replace(d, "\\'"), a = {
                            id: f,
                            val: g,
                            onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick",
                            clickFn: this._.getClick(),
                            title: CKEDITOR.tools.htmlEncodeAttr(e || a),
                            text: c || a
                        }, this._.pendingList.push(b.output(a))
                    },
                    startGroup: function(a) {
                        this._.close();
                        var b = CKEDITOR.tools.getNextId();
                        this._.groups[a] = b, this._.pendingHtml.push(c.output({
                            id: b,
                            label: a
                        }))
                    },
                    commit: function() {
                        this._.close(), this.element.appendHtml(this._.pendingHtml.join("")), delete this._.size, this._.pendingHtml = []
                    },
                    toggle: function(a) {
                        var b = this.isMarked(a);
                        return b ? this.unmark(a) : this.mark(a), !b
                    },
                    hideGroup: function(a) {
                        var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
                        a && (a.setStyle("display", "none"), b && "ul" == b.getName() && b.setStyle("display", "none"))
                    },
                    hideItem: function(a) {
                        this.element.getDocument().getById(this._.items[a]).setStyle("display", "none")
                    },
                    showAll: function() {
                        var a, b = this._.items,
                            c = this._.groups,
                            d = this.element.getDocument();
                        for (a in b) d.getById(b[a]).setStyle("display", "");
                        for (var e in c) b = d.getById(c[e]), a = b.getNext(), b.setStyle("display", ""), a && "ul" == a.getName() && a.setStyle("display", "")
                    },
                    mark: function(a) {
                        this.multiSelect || this.unmarkAll();
                        var a = this._.items[a],
                            b = this.element.getDocument().getById(a);
                        b.addClass("cke_selected"), this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", !0), this.onMark && this.onMark(b)
                    },
                    unmark: function(a) {
                        var b = this.element.getDocument(),
                            a = this._.items[a],
                            c = b.getById(a);
                        c.removeClass("cke_selected"), b.getById(a + "_option").removeAttribute("aria-selected"), this.onUnmark && this.onUnmark(c)
                    },
                    unmarkAll: function() {
                        var a, b = this._.items,
                            c = this.element.getDocument();
                        for (a in b) {
                            var d = b[a];
                            c.getById(d).removeClass("cke_selected"), c.getById(d + "_option").removeAttribute("aria-selected")
                        }
                        this.onUnmark && this.onUnmark()
                    },
                    isMarked: function(a) {
                        return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
                    },
                    focus: function(a) {
                        this._.focusIndex = -1;
                        var b, c = this.element.getElementsByTag("a"),
                            d = -1;
                        if (a) {
                            for (b = this.element.getDocument().getById(this._.items[a]).getFirst(); a = c.getItem(++d);)
                                if (a.equals(b)) {
                                    this._.focusIndex = d;
                                    break
                                }
                        } else this.element.focus();
                        b && setTimeout(function() {
                            b.focus()
                        }, 0)
                    }
                }
            })
        }
    }), CKEDITOR.plugins.add("richcombo", {
        requires: "floatpanel,listblock,button",
        beforeInit: function(a) {
            a.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
        }
    }), function() {
        var a = '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" title="{title}" tabindex="-1"' + (CKEDITOR.env.gecko && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';
        CKEDITOR.env.gecko && CKEDITOR.env.mac && (a += ' onkeypress="return false;"'), CKEDITOR.env.gecko && (a += ' onblur="this.style.cssText = this.style.cssText;"');
        var a = a + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"),
            b = CKEDITOR.addTemplate("combo", a);
        CKEDITOR.UI_RICHCOMBO = "richcombo", CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
            $: function(a) {
                CKEDITOR.tools.extend(this, a, {
                    canGroup: !1,
                    title: a.label,
                    modes: {
                        wysiwyg: 1
                    },
                    editorFocus: 1
                }), a = this.panel || {}, delete this.panel, this.id = CKEDITOR.tools.getNextNumber(), this.document = a.parent && a.parent.getDocument() || CKEDITOR.document, a.className = "cke_combopanel", a.block = {
                    multiSelect: a.multiSelect,
                    attributes: a.attributes
                }, a.toolbarRelated = !0, this._ = {
                    panelDefinition: a,
                    items: {}
                }
            },
            proto: {
                renderHtml: function(a) {
                    var b = [];
                    return this.render(a, b), b.join("")
                },
                render: function(a, c) {
                    function d() {
                        if (this.getState() != CKEDITOR.TRISTATE_ON) {
                            var b = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                            a.readOnly && !this.readOnly && (b = CKEDITOR.TRISTATE_DISABLED), this.setState(b), this.setValue(""), b != CKEDITOR.TRISTATE_DISABLED && this.refresh && this.refresh()
                        }
                    }
                    var e = CKEDITOR.env,
                        f = "cke_" + this.id,
                        g = CKEDITOR.tools.addFunction(function(b) {
                            l && (a.unlockSelection(1), l = 0), i.execute(b)
                        }, this),
                        h = this,
                        i = {
                            id: f,
                            combo: this,
                            focus: function() {
                                CKEDITOR.document.getById(f).getChild(1).focus()
                            },
                            execute: function(b) {
                                var c = h._;
                                if (c.state != CKEDITOR.TRISTATE_DISABLED)
                                    if (h.createPanel(a), c.on) c.panel.hide();
                                    else {
                                        h.commit();
                                        var d = h.getValue();
                                        d ? c.list.mark(d) : c.list.unmarkAll(), c.panel.showBlock(h.id, new CKEDITOR.dom.element(b), 4)
                                    }
                            },
                            clickFn: g
                        };
                    a.on("activeFilterChange", d, this), a.on("mode", d, this), a.on("selectionChange", d, this), !this.readOnly && a.on("readOnly", d, this);
                    var j = CKEDITOR.tools.addFunction(function(b, c) {
                            var b = new CKEDITOR.dom.event(b),
                                d = b.getKeystroke();
                            switch (40 == d && a.once("panelShow", function(a) {
                                a.data._.panel._.currentBlock.onKeyDown(40)
                            }), d) {
                                case 13:
                                case 32:
                                case 40:
                                    CKEDITOR.tools.callFunction(g, c);
                                    break;
                                default:
                                    i.onkey(i, d)
                            }
                            b.preventDefault()
                        }),
                        k = CKEDITOR.tools.addFunction(function() {
                            i.onfocus && i.onfocus()
                        }),
                        l = 0;
                    return i.keyDownFn = j, e = {
                        id: f,
                        name: this.name || this.command,
                        label: this.label,
                        title: this.title,
                        cls: this.className || "",
                        titleJs: e.gecko && !e.hc ? "" : (this.title || "").replace("'", ""),
                        keydownFn: j,
                        focusFn: k,
                        clickFn: g
                    }, b.output(e, c), this.onRender && this.onRender(), i
                },
                createPanel: function(a) {
                    if (!this._.panel) {
                        var b = this._.panelDefinition,
                            c = this._.panelDefinition.block,
                            d = b.parent || CKEDITOR.document.getBody(),
                            e = "cke_combopanel__" + this.name,
                            f = new CKEDITOR.ui.floatPanel(a, d, b),
                            g = f.addListBlock(this.id, c),
                            h = this;
                        f.onShow = function() {
                            this.element.addClass(e), h.setState(CKEDITOR.TRISTATE_ON), h._.on = 1, h.editorFocus && !a.focusManager.hasFocus && a.focus(), h.onOpen && h.onOpen(), a.once("panelShow", function() {
                                g.focus(!g.multiSelect && h.getValue())
                            })
                        }, f.onHide = function(b) {
                            this.element.removeClass(e), h.setState(h.modes && h.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), h._.on = 0, !b && h.onClose && h.onClose()
                        }, f.onEscape = function() {
                            f.hide(1)
                        }, g.onClick = function(a, b) {
                            h.onClick && h.onClick.call(h, a, b), f.hide()
                        }, this._.panel = f, this._.list = g, f.getBlock(this.id).onHide = function() {
                            h._.on = 0, h.setState(CKEDITOR.TRISTATE_OFF)
                        }, this.init && this.init()
                    }
                },
                setValue: function(a, b) {
                    this._.value = a;
                    var c = this.document.getById("cke_" + this.id + "_text");
                    c && (a || b ? c.removeClass("cke_combo_inlinelabel") : (b = this.label, c.addClass("cke_combo_inlinelabel")), c.setText("undefined" != typeof b ? b : a))
                },
                getValue: function() {
                    return this._.value || ""
                },
                unmarkAll: function() {
                    this._.list.unmarkAll()
                },
                mark: function(a) {
                    this._.list.mark(a)
                },
                hideItem: function(a) {
                    this._.list.hideItem(a)
                },
                hideGroup: function(a) {
                    this._.list.hideGroup(a)
                },
                showAll: function() {
                    this._.list.showAll()
                },
                add: function(a, b, c) {
                    this._.items[a] = c || a, this._.list.add(a, b, c)
                },
                startGroup: function(a) {
                    this._.list.startGroup(a)
                },
                commit: function() {
                    this._.committed || (this._.list.commit(), this._.committed = 1, CKEDITOR.ui.fire("ready", this)), this._.committed = 1
                },
                setState: function(a) {
                    if (this._.state != a) {
                        var b = this.document.getById("cke_" + this.id);
                        b.setState(a, "cke_combo"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled"), this._.state = a
                    }
                },
                getState: function() {
                    return this._.state
                },
                enable: function() {
                    this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
                },
                disable: function() {
                    this._.state != CKEDITOR.TRISTATE_DISABLED && (this._.lastState = this._.state, this.setState(CKEDITOR.TRISTATE_DISABLED))
                }
            },
            statics: {
                handler: {
                    create: function(a) {
                        return new CKEDITOR.ui.richCombo(a)
                    }
                }
            }
        }), CKEDITOR.ui.prototype.addRichCombo = function(a, b) {
            this.add(a, CKEDITOR.UI_RICHCOMBO, b)
        }
    }(), CKEDITOR.plugins.add("format", {
        requires: "richcombo",
        init: function(a) {
            if (!a.blockless) {
                for (var b = a.config, c = a.lang.format, d = b.format_tags.split(";"), e = {}, f = 0, g = [], h = 0; h < d.length; h++) {
                    var i = d[h],
                        j = new CKEDITOR.style(b["format_" + i]);
                    (!a.filter.customConfig || a.filter.check(j)) && (f++, e[i] = j, e[i]._.enterMode = a.config.enterMode, g.push(j))
                }
                0 !== f && a.ui.addRichCombo("Format", {
                    label: c.label,
                    title: c.panelTitle,
                    toolbar: "styles,20",
                    allowedContent: g,
                    panel: {
                        css: [CKEDITOR.skin.getPath("editor")].concat(b.contentsCss),
                        multiSelect: !1,
                        attributes: {
                            "aria-label": c.panelTitle
                        }
                    },
                    init: function() {
                        this.startGroup(c.panelTitle);
                        for (var a in e) {
                            var b = c["tag_" + a];
                            this.add(a, e[a].buildPreview(b), b)
                        }
                    },
                    onClick: function(b) {
                        a.focus(), a.fire("saveSnapshot");
                        var b = e[b],
                            c = a.elementPath();
                        a[b.checkActive(c, a) ? "removeStyle" : "applyStyle"](b), setTimeout(function() {
                            a.fire("saveSnapshot")
                        }, 0)
                    },
                    onRender: function() {
                        a.on("selectionChange", function(b) {
                            var c = this.getValue(),
                                b = b.data.path;
                            this.refresh();
                            for (var d in e)
                                if (e[d].checkActive(b, a)) return void(d != c && this.setValue(d, a.lang.format["tag_" + d]));
                            this.setValue("")
                        }, this)
                    },
                    onOpen: function() {
                        this.showAll();
                        for (var b in e) a.activeFilter.check(e[b]) || this.hideItem(b)
                    },
                    refresh: function() {
                        var b = a.elementPath();
                        if (b) {
                            if (b.isContextFor("p"))
                                for (var c in e)
                                    if (a.activeFilter.check(e[c])) return;
                            this.setState(CKEDITOR.TRISTATE_DISABLED)
                        }
                    }
                })
            }
        }
    }), CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div", CKEDITOR.config.format_p = {
        element: "p"
    }, CKEDITOR.config.format_div = {
        element: "div"
    }, CKEDITOR.config.format_pre = {
        element: "pre"
    }, CKEDITOR.config.format_address = {
        element: "address"
    }, CKEDITOR.config.format_h1 = {
        element: "h1"
    }, CKEDITOR.config.format_h2 = {
        element: "h2"
    }, CKEDITOR.config.format_h3 = {
        element: "h3"
    }, CKEDITOR.config.format_h4 = {
        element: "h4"
    }, CKEDITOR.config.format_h5 = {
        element: "h5"
    }, CKEDITOR.config.format_h6 = {
        element: "h6"
    }, function() {
        var a = {
            canUndo: !1,
            exec: function(a) {
                var b = a.document.createElement("hr");
                a.insertElement(b)
            },
            allowedContent: "hr",
            requiredContent: "hr"
        };
        CKEDITOR.plugins.add("horizontalrule", {
            init: function(b) {
                b.blockless || (b.addCommand("horizontalrule", a), b.ui.addButton && b.ui.addButton("HorizontalRule", {
                    label: b.lang.horizontalrule.toolbar,
                    command: "horizontalrule",
                    toolbar: "insert,40"
                }))
            }
        })
    }(), CKEDITOR.plugins.add("htmlwriter", {
        init: function(a) {
            var b = new CKEDITOR.htmlWriter;
            b.forceSimpleAmpersand = a.config.forceSimpleAmpersand, b.indentationChars = a.config.dataIndentationChars || "	", a.dataProcessor.writer = b
        }
    }), CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
        base: CKEDITOR.htmlParser.basicWriter,
        $: function() {
            this.base(), this.indentationChars = "	", this.selfClosingEnd = " />", this.lineBreakChars = "\n", this.sortAttributes = 1, this._.indent = 0, this._.indentation = "", this._.inPre = 0, this._.rules = {};
            var a, b = CKEDITOR.dtd;
            for (a in CKEDITOR.tools.extend({}, b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent)) this.setRules(a, {
                indent: !b[a]["#"],
                breakBeforeOpen: 1,
                breakBeforeClose: !b[a]["#"],
                breakAfterClose: 1,
                needsSpace: a in b.$block && !(a in {
                    li: 1,
                    dt: 1,
                    dd: 1
                })
            });
            this.setRules("br", {
                breakAfterOpen: 1
            }), this.setRules("title", {
                indent: 0,
                breakAfterOpen: 0
            }), this.setRules("style", {
                indent: 0,
                breakBeforeClose: 1
            }), this.setRules("pre", {
                breakAfterOpen: 1,
                indent: 0
            })
        },
        proto: {
            openTag: function(a) {
                var b = this._.rules[a];
                this._.afterCloser && b && b.needsSpace && this._.needsSpace && this._.output.push("\n"), this._.indent ? this.indentation() : b && b.breakBeforeOpen && (this.lineBreak(), this.indentation()), this._.output.push("<", a), this._.afterCloser = 0
            },
            openTagClose: function(a, b) {
                var c = this._.rules[a];
                b ? (this._.output.push(this.selfClosingEnd), c && c.breakAfterClose && (this._.needsSpace = c.needsSpace)) : (this._.output.push(">"), c && c.indent && (this._.indentation += this.indentationChars)), c && c.breakAfterOpen && this.lineBreak(), "pre" == a && (this._.inPre = 1)
            },
            attribute: function(a, b) {
                "string" == typeof b && (this.forceSimpleAmpersand && (b = b.replace(/&amp;/g, "&")), b = CKEDITOR.tools.htmlEncodeAttr(b)), this._.output.push(" ", a, '="', b, '"')
            },
            closeTag: function(a) {
                var b = this._.rules[a];
                b && b.indent && (this._.indentation = this._.indentation.substr(this.indentationChars.length)), this._.indent ? this.indentation() : b && b.breakBeforeClose && (this.lineBreak(), this.indentation()), this._.output.push("</", a, ">"), "pre" == a && (this._.inPre = 0), b && b.breakAfterClose && (this.lineBreak(), this._.needsSpace = b.needsSpace), this._.afterCloser = 1
            },
            text: function(a) {
                this._.indent && (this.indentation(), !this._.inPre && (a = CKEDITOR.tools.ltrim(a))), this._.output.push(a)
            },
            comment: function(a) {
                this._.indent && this.indentation(), this._.output.push("<!--", a, "-->")
            },
            lineBreak: function() {
                !this._.inPre && 0 < this._.output.length && this._.output.push(this.lineBreakChars), this._.indent = 1
            },
            indentation: function() {
                !this._.inPre && this._.indentation && this._.output.push(this._.indentation), this._.indent = 0
            },
            reset: function() {
                this._.output = [], this._.indent = 0, this._.indentation = "", this._.afterCloser = 0, this._.inPre = 0
            },
            setRules: function(a, b) {
                var c = this._.rules[a];
                c ? CKEDITOR.tools.extend(c, b, !0) : this._.rules[a] = b
            }
        }
    }), function() {
        function a(a) {
            var c = this.editor,
                d = a.document,
                e = d.body,
                f = d.getElementById("cke_actscrpt");
            f && f.parentNode.removeChild(f), (f = d.getElementById("cke_shimscrpt")) && f.parentNode.removeChild(f), (f = d.getElementById("cke_basetagscrpt")) && f.parentNode.removeChild(f), CKEDITOR.env.gecko && (e.contentEditable = !1, 2e4 > CKEDITOR.env.version && (e.innerHTML = e.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, ""), setTimeout(function() {
                var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(d));
                a.setStart(new CKEDITOR.dom.node(e), 0), c.getSelection().selectRanges([a])
            }, 0))), e.contentEditable = !0, CKEDITOR.env.ie && (e.hideFocus = !0, e.disabled = !0, e.removeAttribute("disabled")), delete this._.isLoadingData, this.$ = e, d = new CKEDITOR.dom.document(d), this.setup(), CKEDITOR.env.ie && (d.getDocumentElement().addClass(d.$.compatMode), c.config.enterMode != CKEDITOR.ENTER_P && this.attachListener(d, "selectionchange", function() {
                var a = d.getBody(),
                    b = c.getSelection(),
                    e = b && b.getRanges()[0];
                e && a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && e.startContainer.equals(a) && setTimeout(function() {
                    e = c.getSelection().getRanges()[0], e.startContainer.equals("body") || (a.getFirst().remove(1), e.moveToElementEditEnd(a), e.select())
                }, 0)
            })), (CKEDITOR.env.webkit || CKEDITOR.env.ie && 10 < CKEDITOR.env.version) && d.getDocumentElement().on("mousedown", function(a) {
                a.data.getTarget().is("html") && setTimeout(function() {
                    c.editable().focus()
                })
            }), b(c);
            try {
                c.document.$.execCommand("2D-position", !1, !0)
            } catch (g) {}(CKEDITOR.env.gecko || CKEDITOR.env.ie && "CSS1Compat" == c.document.$.compatMode) && this.attachListener(this, "keydown", function(a) {
                var b = a.data.getKeystroke();
                if (33 == b || 34 == b)
                    if (CKEDITOR.env.ie) setTimeout(function() {
                        c.getSelection().scrollIntoView()
                    }, 0);
                    else if (c.window.$.innerHeight > this.$.offsetHeight) {
                    var d = c.createRange();
                    d[33 == b ? "moveToElementEditStart" : "moveToElementEditEnd"](this), d.select(), a.data.preventDefault()
                }
            }), CKEDITOR.env.ie && this.attachListener(d, "blur", function() {
                try {
                    d.$.selection.empty()
                } catch (a) {}
            }), CKEDITOR.env.iOS && this.attachListener(d, "touchend", function() {
                a.focus()
            }), f = c.document.getElementsByTag("title").getItem(0), f.data("cke-title", f.getText()), CKEDITOR.env.ie && (c.document.$.title = this._.docTitle), CKEDITOR.tools.setTimeout(function() {
                "unloaded" == this.status && (this.status = "ready"), c.fire("contentDom"), this._.isPendingFocus && (c.focus(), this._.isPendingFocus = !1), setTimeout(function() {
                    c.fire("dataReady")
                }, 0), CKEDITOR.env.ie && setTimeout(function() {
                    if (c.document) {
                        var a = c.document.$.body;
                        a.runtimeStyle.marginBottom = "0px", a.runtimeStyle.marginBottom = ""
                    }
                }, 1e3)
            }, 0, this)
        }

        function b(a) {
            function b() {
                var b;
                a.editable().attachListener(a, "selectionChange", function() {
                    var d = a.getSelection().getSelectedElement();
                    d && (b && (b.detachEvent("onresizestart", c), b = null), d.$.attachEvent("onresizestart", c), b = d.$)
                })
            }

            function c(a) {
                a.returnValue = !1
            }
            if (CKEDITOR.env.gecko) try {
                var d = a.document.$;
                d.execCommand("enableObjectResizing", !1, !a.config.disableObjectResizing), d.execCommand("enableInlineTableEditing", !1, !a.config.disableNativeTableHandles)
            } catch (e) {} else CKEDITOR.env.ie && 11 > CKEDITOR.env.version && a.config.disableObjectResizing && b(a)
        }

        function c() {
            var a = [];
            if (8 <= CKEDITOR.document.$.documentMode) {
                a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
                var b, c = [];
                for (b in CKEDITOR.dtd.$removeEmpty) c.push("html.CSS1Compat " + b + "[contenteditable=false]");
                a.push(c.join(",") + "{display:inline-block}")
            } else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
            return a.push("html{cursor:text;*cursor:auto}"), a.push("img,input,textarea{cursor:default}"), a.join("\n")
        }
        CKEDITOR.plugins.add("wysiwygarea", {
            init: function(a) {
                a.config.fullPage && a.addFeature({
                    allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
                    requiredContent: "body"
                }), a.addMode("wysiwyg", function(b) {
                    function c(c) {
                        c && c.removeListener(), a.editable(new d(a, f.$.contentWindow.document.body)), a.setData(a.getData(1), b)
                    }
                    var e = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "") + "document.close();",
                        e = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(e) + "}())" : "",
                        f = CKEDITOR.dom.element.createFromHtml('<iframe src="' + e + '" frameBorder="0"></iframe>');
                    f.setStyles({
                        width: "100%",
                        height: "100%"
                    }), f.addClass("cke_wysiwyg_frame cke_reset");
                    var g = a.ui.space("contents");
                    g.append(f), (e = CKEDITOR.env.ie || CKEDITOR.env.gecko) && f.on("load", c);
                    var h = a.title,
                        i = a.fire("ariaEditorHelpLabel", {}).label;
                    if (h && (CKEDITOR.env.ie && i && (h += ", " + i), f.setAttribute("title", h)), i) {
                        var h = CKEDITOR.tools.getNextId(),
                            j = CKEDITOR.dom.element.createFromHtml('<span id="' + h + '" class="cke_voice_label">' + i + "</span>");
                        g.append(j, 1), f.setAttribute("aria-describedby", h)
                    }
                    a.on("beforeModeUnload", function(a) {
                        a.removeListener(), j && j.remove()
                    }), f.setAttributes({
                        tabIndex: a.tabIndex,
                        allowTransparency: "true"
                    }), !e && c(), CKEDITOR.env.webkit && (e = function() {
                        g.setStyle("width", "100%"), f.hide(), f.setSize("width", g.getSize("width")), g.removeStyle("width"), f.show()
                    }, f.setCustomData("onResize", e), CKEDITOR.document.getWindow().on("resize", e)), a.fire("ariaWidget", f)
                })
            }
        }), CKEDITOR.editor.prototype.addContentsCss = function(a) {
            var b = this.config,
                c = b.contentsCss;
            CKEDITOR.tools.isArray(c) || (b.contentsCss = c ? [c] : []), b.contentsCss.push(a)
        };
        var d = CKEDITOR.tools.createClass({
            $: function(b) {
                this.base.apply(this, arguments), this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function(b) {
                    CKEDITOR.tools.setTimeout(a, 0, this, b)
                }, this), this._.docTitle = this.getWindow().getFrame().getAttribute("title")
            },
            base: CKEDITOR.editable,
            proto: {
                setData: function(a, b) {
                    var d = this.editor;
                    if (b) this.setHtml(a), d.fire("dataReady");
                    else {
                        this._.isLoadingData = !0, d._.dataStore = {
                            id: 1
                        };
                        var e = d.config,
                            f = e.fullPage,
                            g = e.docType,
                            h = CKEDITOR.tools.buildStyleHtml(c()).replace(/<style>/, '<style data-cke-temp="1">');
                        f || (h += CKEDITOR.tools.buildStyleHtml(d.config.contentsCss));
                        var i = e.baseHref ? '<base href="' + e.baseHref + '" data-cke-temp="1" />' : "";
                        f && (a = a.replace(/<!DOCTYPE[^>]*>/i, function(a) {
                            return d.docType = g = a, ""
                        }).replace(/<\?xml\s[^\?]*\?>/i, function(a) {
                            return d.xmlDeclaration = a, ""
                        })), a = d.dataProcessor.toHtml(a), f ? (/<body[\s|>]/.test(a) || (a = "<body>" + a), /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) : a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>"), i && (a = a.replace(/<head[^>]*?>/, "$&" + i)), a = a.replace(/<\/head\s*>/, h + "$&"), a = g + a) : a = e.docType + '<html dir="' + e.contentsLangDirection + '" lang="' + (e.contentsLanguage || d.langCode) + '"><head><title>' + this._.docTitle + "</title>" + i + h + "</head><body" + (e.bodyId ? ' id="' + e.bodyId + '"' : "") + (e.bodyClass ? ' class="' + e.bodyClass + '"' : "") + ">" + a + "</body></html>", CKEDITOR.env.gecko && (a = a.replace(/<body/, '<body contenteditable="true" '), 2e4 > CKEDITOR.env.version && (a = a.replace(/<body[^>]*>/, "$&<!-- cke-content-start -->"))), e = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "</script>", CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (e += '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)</script>'), i && CKEDITOR.env.ie && 10 > CKEDITOR.env.version && (e += '<script id="cke_basetagscrpt">var baseTag = document.querySelector( "base" );baseTag.href = baseTag.href;</script>'), a = a.replace(/(?=\s*<\/(:?head)>)/, e), this.clearCustomData(), this.clearListeners(), d.fire("contentDomUnload");
                        var j = this.getDocument();
                        try {
                            j.write(a)
                        } catch (k) {
                            setTimeout(function() {
                                j.write(a)
                            }, 0)
                        }
                    }
                },
                getData: function(a) {
                    if (a) return this.getHtml();
                    var a = this.editor,
                        b = a.config,
                        c = b.fullPage,
                        d = c && a.docType,
                        e = c && a.xmlDeclaration,
                        f = this.getDocument(),
                        c = c ? f.getDocumentElement().getOuterHtml() : f.getBody().getHtml();
                    return CKEDITOR.env.gecko && b.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/<br>(?=\s*(:?$|<\/body>))/, "")), c = a.dataProcessor.toDataFormat(c), e && (c = e + "\n" + c), d && (c = d + "\n" + c), c
                },
                focus: function() {
                    this._.isLoadingData ? this._.isPendingFocus = !0 : d.baseProto.focus.call(this)
                },
                detach: function() {
                    var a = this.editor,
                        b = a.document,
                        a = a.window.getFrame();
                    d.baseProto.detach.call(this), this.clearCustomData(), b.getDocumentElement().clearCustomData(), a.clearCustomData(), CKEDITOR.tools.removeFunction(this._.frameLoadedHandler), (b = a.removeCustomData("onResize")) && b.removeListener(), a.remove()
                }
            }
        })
    }(), CKEDITOR.config.disableObjectResizing = !1, CKEDITOR.config.disableNativeTableHandles = !0, CKEDITOR.config.disableNativeSpellChecker = !0, CKEDITOR.config.contentsCss = CKEDITOR.getUrl("contents.css"), function() {
        function a(a, b) {
            return b || (b = a.getSelection().getSelectedElement()), b && b.is("img") && !b.data("cke-realelement") && !b.isReadOnly() ? b : void 0
        }

        function b(a) {
            var b = a.getStyle("float");
            return ("inherit" == b || "none" == b) && (b = 0), b || (b = a.getAttribute("align")), b
        }
        CKEDITOR.plugins.add("image", {
            requires: "dialog",
            init: function(b) {
                if (!b.plugins.image2) {
                    CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
                    var c = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
                    CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (c = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)"), b.addCommand("image", new CKEDITOR.dialogCommand("image", {
                        allowedContent: c,
                        requiredContent: "img[alt,src]",
                        contentTransformations: [
                            ["img{width}: sizeToStyle", "img[width]: sizeToAttribute"],
                            ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]
                        ]
                    })), b.ui.addButton && b.ui.addButton("Image", {
                        label: b.lang.common.image,
                        command: "image",
                        toolbar: "insert,10"
                    }), b.on("doubleclick", function(a) {
                        var b = a.data.element;
                        b.is("img") && !b.data("cke-realelement") && !b.isReadOnly() && (a.data.dialog = "image")
                    }), b.addMenuItems && b.addMenuItems({
                        image: {
                            label: b.lang.image.menu,
                            command: "image",
                            group: "image"
                        }
                    }), b.contextMenu && b.contextMenu.addListener(function(c) {
                        return a(b, c) ? {
                            image: CKEDITOR.TRISTATE_OFF
                        } : void 0
                    })
                }
            },
            afterInit: function(c) {
                function d(d) {
                    var e = c.getCommand("justify" + d);
                    e && (("left" == d || "right" == d) && e.on("exec", function(e) {
                        var f, g = a(c);
                        g && (f = b(g), f == d ? (g.removeStyle("float"), d == b(g) && g.removeAttribute("align")) : g.setStyle("float", d), e.cancel())
                    }), e.on("refresh", function(e) {
                        var f = a(c);
                        f && (f = b(f), this.setState(f == d ? CKEDITOR.TRISTATE_ON : "right" == d || "left" == d ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), e.cancel())
                    }))
                }
                c.plugins.image2 || (d("left"), d("right"), d("center"), d("block"))
            }
        })
    }(), CKEDITOR.config.image_removeLinkByEmptyURL = !0, function() {
        function a(a, d) {
            var e, f;
            d.on("refresh", function(a) {
                var d, e = [b];
                for (d in a.data.states) e.push(a.data.states[d]);
                this.setState(CKEDITOR.tools.search(e, c) ? c : b)
            }, d, null, 100), d.on("exec", function(b) {
                e = a.getSelection(), f = e.createBookmarks(1), b.data || (b.data = {}), b.data.done = !1
            }, d, null, 0), d.on("exec", function() {
                a.forceNextSelectionCheck(), e.selectBookmarks(f)
            }, d, null, 100)
        }
        var b = CKEDITOR.TRISTATE_DISABLED,
            c = CKEDITOR.TRISTATE_OFF;
        CKEDITOR.plugins.add("indent", {
            init: function(b) {
                var c = CKEDITOR.plugins.indent.genericDefinition;
                a(b, b.addCommand("indent", new c(!0))), a(b, b.addCommand("outdent", new c)), b.ui.addButton && (b.ui.addButton("Indent", {
                    label: b.lang.indent.indent,
                    command: "indent",
                    directional: !0,
                    toolbar: "indent,20"
                }), b.ui.addButton("Outdent", {
                    label: b.lang.indent.outdent,
                    command: "outdent",
                    directional: !0,
                    toolbar: "indent,10"
                })), b.on("dirChanged", function(a) {
                    var c = b.createRange(),
                        d = a.data.node;
                    c.setStartBefore(d), c.setEndAfter(d);
                    for (var e, f = new CKEDITOR.dom.walker(c); e = f.next();)
                        if (e.type == CKEDITOR.NODE_ELEMENT)
                            if (!e.equals(d) && e.getDirection()) c.setStartAfter(e), f = new CKEDITOR.dom.walker(c);
                            else {
                                var g = b.config.indentClasses;
                                if (g)
                                    for (var h = "ltr" == a.data.dir ? ["_rtl", ""] : ["", "_rtl"], i = 0; i < g.length; i++) e.hasClass(g[i] + h[0]) && (e.removeClass(g[i] + h[0]), e.addClass(g[i] + h[1]));
                                g = e.getStyle("margin-right"), h = e.getStyle("margin-left"), g ? e.setStyle("margin-left", g) : e.removeStyle("margin-left"), h ? e.setStyle("margin-right", h) : e.removeStyle("margin-right")
                            }
                })
            }
        }), CKEDITOR.plugins.indent = {
            genericDefinition: function(a) {
                this.isIndent = !!a, this.startDisabled = !this.isIndent
            },
            specificDefinition: function(a, b, c) {
                this.name = b, this.editor = a, this.jobs = {}, this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR, this.isIndent = !!c, this.relatedGlobal = c ? "indent" : "outdent", this.indentKey = c ? 9 : CKEDITOR.SHIFT + 9, this.database = {}
            },
            registerCommands: function(a, b) {
                a.on("pluginsLoaded", function() {
                    for (var a in b)(function(a, b) {
                        var c, d = a.getCommand(b.relatedGlobal);
                        for (c in b.jobs) d.on("exec", function(d) {
                            d.data.done || (a.fire("lockSnapshot"), b.execJob(a, c) && (d.data.done = !0), a.fire("unlockSnapshot"), CKEDITOR.dom.element.clearAllMarkers(b.database))
                        }, this, null, c), d.on("refresh", function(d) {
                            d.data.states || (d.data.states = {}), d.data.states[b.name + "@" + c] = b.refreshJob(a, c, d.data.path)
                        }, this, null, c);
                        a.addFeature(b)
                    })(this, b[a])
                })
            }
        }, CKEDITOR.plugins.indent.genericDefinition.prototype = {
            context: "p",
            exec: function() {}
        }, CKEDITOR.plugins.indent.specificDefinition.prototype = {
            execJob: function(a, c) {
                var d = this.jobs[c];
                return d.state != b ? d.exec.call(this, a) : void 0
            },
            refreshJob: function(a, c, d) {
                return c = this.jobs[c], c.state = a.activeFilter.checkFeature(this) ? c.refresh.call(this, a, d) : b, c.state
            },
            getContext: function(a) {
                return a.contains(this.context)
            }
        }
    }(), function() {
        function a(a) {
            function b(b) {
                for (var c = e.startContainer, i = e.endContainer; c && !c.getParent().equals(b);) c = c.getParent();
                for (; i && !i.getParent().equals(b);) i = i.getParent();
                if (!c || !i) return !1;
                for (var j = c, c = [], k = !1; !k;) j.equals(i) && (k = !0), c.push(j), j = j.getNext();
                if (1 > c.length) return !1;
                for (j = b.getParents(!0), i = 0; i < j.length; i++)
                    if (j[i].getName && h[j[i].getName()]) {
                        b = j[i];
                        break
                    }
                for (var j = f.isIndent ? 1 : -1, i = c[0], c = c[c.length - 1], k = CKEDITOR.plugins.list.listToArray(b, g), l = k[c.getCustomData("listarray_index")].indent, i = i.getCustomData("listarray_index"); i <= c.getCustomData("listarray_index"); i++)
                    if (k[i].indent += j, j > 0) {
                        var m = k[i].parent;
                        k[i].parent = new CKEDITOR.dom.element(m.getName(), m.getDocument())
                    }
                for (i = c.getCustomData("listarray_index") + 1; i < k.length && k[i].indent > l; i++) k[i].indent += j;
                if (c = CKEDITOR.plugins.list.arrayToList(k, g, null, a.config.enterMode, b.getDirection()), !f.isIndent) {
                    var n;
                    if ((n = b.getParent()) && n.is("li"))
                        for (var o, j = c.listNode.getChildren(), p = [], i = j.count() - 1; i >= 0; i--)(o = j.getItem(i)) && o.is && o.is("li") && p.push(o)
                }
                if (c && c.listNode.replace(b), p && p.length)
                    for (i = 0; i < p.length; i++) {
                        for (o = b = p[i];
                            (o = o.getNext()) && o.is && o.getName() in h;) CKEDITOR.env.needsNbspFiller && !b.getFirst(d) && b.append(e.document.createText(" ")), b.append(o);
                        b.insertAfter(n)
                    }
                return c && a.fire("contentDomInvalidated"), !0
            }
            for (var e, f = this, g = this.database, h = this.context, i = a.getSelection(), i = (i && i.getRanges()).createIterator(); e = i.getNextRange();) {
                for (var j = e.getCommonAncestor(); j && (j.type != CKEDITOR.NODE_ELEMENT || !h[j.getName()]);) j = j.getParent();
                if (j || (j = e.startPath().contains(h)) && e.setEndAt(j, CKEDITOR.POSITION_BEFORE_END), !j) {
                    var k = e.getEnclosedNode();
                    k && k.type == CKEDITOR.NODE_ELEMENT && k.getName() in h && (e.setStartAt(k, CKEDITOR.POSITION_AFTER_START), e.setEndAt(k, CKEDITOR.POSITION_BEFORE_END), j = k)
                }
                if (j && e.startContainer.type == CKEDITOR.NODE_ELEMENT && e.startContainer.getName() in h && (k = new CKEDITOR.dom.walker(e), k.evaluator = c, e.startContainer = k.next()), j && e.endContainer.type == CKEDITOR.NODE_ELEMENT && e.endContainer.getName() in h && (k = new CKEDITOR.dom.walker(e), k.evaluator = c, e.endContainer = k.previous()), j) return b(j)
            }
            return 0
        }

        function b(a, b) {
            return b || (b = a.contains(this.context)), b && a.block && a.block.equals(b.getFirst(c))
        }

        function c(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && a.is("li")
        }

        function d(a) {
            return e(a) && f(a)
        }
        var e = CKEDITOR.dom.walker.whitespaces(!0),
            f = CKEDITOR.dom.walker.bookmark(!1, !0),
            g = CKEDITOR.TRISTATE_DISABLED,
            h = CKEDITOR.TRISTATE_OFF;
        CKEDITOR.plugins.add("indentlist", {
            requires: "indent",
            init: function(c) {
                function d(c, d) {
                    e.specificDefinition.apply(this, arguments), this.requiredContent = ["ul", "ol"], c.on("key", function(a) {
                        if ("wysiwyg" == c.mode && a.data.keyCode == this.indentKey) {
                            var d = this.getContext(c.elementPath());
                            !d || this.isIndent && b.call(this, c.elementPath(), d) || (c.execCommand(this.relatedGlobal), a.cancel())
                        }
                    }, this), this.jobs[this.isIndent ? 10 : 30] = {
                        refresh: this.isIndent ? function(a, c) {
                            var d = this.getContext(c),
                                e = b.call(this, c, d);
                            return d && this.isIndent && !e ? h : g
                        } : function(a, b) {
                            return !this.getContext(b) || this.isIndent ? g : h
                        },
                        exec: CKEDITOR.tools.bind(a, this)
                    }
                }
                var e = CKEDITOR.plugins.indent;
                e.registerCommands(c, {
                    indentlist: new d(c, "indentlist", !0),
                    outdentlist: new d(c, "outdentlist")
                }), CKEDITOR.tools.extend(d.prototype, e.specificDefinition.prototype, {
                    context: {
                        ol: 1,
                        ul: 1
                    }
                })
            }
        })
    }(), function() {
        function a(a, b) {
            var c = d.exec(a),
                e = d.exec(b);
            if (c) {
                if (!c[2] && "px" == e[2]) return e[1];
                if ("px" == c[2] && !e[2]) return e[1] + "px"
            }
            return b
        }
        var b = CKEDITOR.htmlParser.cssStyle,
            c = CKEDITOR.tools.cssLength,
            d = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
            e = {
                elements: {
                    $: function(c) {
                        var d = c.attributes;
                        if ((d = (d = (d = d && d["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(d))) && d.children[0]) && c.attributes["data-cke-resizable"]) {
                            var e = new b(c).rules,
                                c = d.attributes,
                                f = e.width,
                                e = e.height;
                            f && (c.width = a(c.width, f)), e && (c.height = a(c.height, e))
                        }
                        return d
                    }
                }
            };
        CKEDITOR.plugins.add("fakeobjects", {
            init: function(a) {
                a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
            },
            afterInit: function(a) {
                (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(e, {
                    applyToAll: !0
                })
            }
        }), CKEDITOR.editor.prototype.createFakeElement = function(a, d, e, f) {
            var g = this.lang.fakeobjects,
                g = g[e] || g.unknown,
                d = {
                    "class": d,
                    "data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
                    "data-cke-real-node-type": a.type,
                    alt: g,
                    title: g,
                    align: a.getAttribute("align") || ""
                };
            return CKEDITOR.env.hc || (d.src = CKEDITOR.tools.transparentImageData), e && (d["data-cke-real-element-type"] = e), f && (d["data-cke-resizable"] = f, e = new b, f = a.getAttribute("width"), a = a.getAttribute("height"), f && (e.rules.width = c(f)), a && (e.rules.height = c(a)), e.populate(d)), this.document.createElement("img", {
                attributes: d
            })
        }, CKEDITOR.editor.prototype.createFakeParserElement = function(a, d, e, f) {
            var g, h = this.lang.fakeobjects,
                h = h[e] || h.unknown;
            return g = new CKEDITOR.htmlParser.basicWriter, a.writeHtml(g), g = g.getHtml(), d = {
                "class": d,
                "data-cke-realelement": encodeURIComponent(g),
                "data-cke-real-node-type": a.type,
                alt: h,
                title: h,
                align: a.attributes.align || ""
            }, CKEDITOR.env.hc || (d.src = CKEDITOR.tools.transparentImageData), e && (d["data-cke-real-element-type"] = e), f && (d["data-cke-resizable"] = f, f = a.attributes, a = new b, e = f.width, f = f.height, void 0 != e && (a.rules.width = c(e)), void 0 != f && (a.rules.height = c(f)), a.populate(d)), new CKEDITOR.htmlParser.element("img", d)
        }, CKEDITOR.editor.prototype.restoreRealElement = function(b) {
            if (b.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT) return null;
            var c = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(b.data("cke-realelement")), this.document);
            if (b.data("cke-resizable")) {
                var d = b.getStyle("width"),
                    b = b.getStyle("height");
                d && c.setAttribute("width", a(c.getAttribute("width"), d)), b && c.setAttribute("height", a(c.getAttribute("height"), b))
            }
            return c
        }
    }(), function() {
        function a(a) {
            return a.replace(/'/g, "\\$&")
        }

        function b(a) {
            for (var b, c = a.length, d = [], e = 0; c > e; e++) b = a.charCodeAt(e), d.push(b);
            return "String.fromCharCode(" + d.join(",") + ")"
        }

        function c(b, c) {
            var d, e, f = b.plugins.link,
                g = f.compiledProtectionFunction.params;
            e = [f.compiledProtectionFunction.name, "("];
            for (var h = 0; h < g.length; h++) f = g[h].toLowerCase(), d = c[f], h > 0 && e.push(","), e.push("'", d ? a(encodeURIComponent(c[f])) : "", "'");
            return e.push(")"), e.join("")
        }

        function d(a) {
            var b, a = a.config.emailProtection || "";
            return a && "encode" != a && (b = {}, a.replace(/^([^(]+)\(([^)]+)\)$/, function(a, c, d) {
                b.name = c, b.params = [], d.replace(/[^,\s]+/g, function(a) {
                    b.params.push(a)
                })
            })), b
        }
        CKEDITOR.plugins.add("link", {
            requires: "dialog,fakeobjects",
            onLoad: function() {
                function a(a) {
                    return c.replace(/%1/g, "rtl" == a ? "right" : "left").replace(/%2/g, "cke_contents_" + a)
                }
                var b = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
                    c = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + b + "padding-%1:18px;cursor:auto;}.%2 img.cke_anchor{" + b + "width:16px;min-height:15px;height:1.15em;vertical-align:text-bottom;}";
                CKEDITOR.addCss(a("ltr") + a("rtl"))
            },
            init: function(a) {
                var b = "a[!href]";
                CKEDITOR.dialog.isTabEnabled(a, "link", "advanced") && (b = b.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)")), CKEDITOR.dialog.isTabEnabled(a, "link", "target") && (b = b.replace("]", ",target,onclick]")), a.addCommand("link", new CKEDITOR.dialogCommand("link", {
                    allowedContent: b,
                    requiredContent: "a[href]"
                })), a.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
                    allowedContent: "a[!name,id]",
                    requiredContent: "a[name]"
                })), a.addCommand("unlink", new CKEDITOR.unlinkCommand), a.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand), a.setKeystroke(CKEDITOR.CTRL + 76, "link"), a.ui.addButton && (a.ui.addButton("Link", {
                    label: a.lang.link.toolbar,
                    command: "link",
                    toolbar: "links,10"
                }), a.ui.addButton("Unlink", {
                    label: a.lang.link.unlink,
                    command: "unlink",
                    toolbar: "links,20"
                }), a.ui.addButton("Anchor", {
                    label: a.lang.link.anchor.toolbar,
                    command: "anchor",
                    toolbar: "links,30"
                })), CKEDITOR.dialog.add("link", this.path + "dialogs/link.js"), CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js"), a.on("doubleclick", function(b) {
                    var c = CKEDITOR.plugins.link.getSelectedLink(a) || b.data.element;
                    c.isReadOnly() || (c.is("a") ? (b.data.dialog = !c.getAttribute("name") || c.getAttribute("href") && c.getChildCount() ? "link" : "anchor", b.data.link = c) : CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, c) && (b.data.dialog = "anchor"))
                }, null, null, 0), a.on("doubleclick", function(b) {
                    b.data.dialog in {
                        link: 1,
                        anchor: 1
                    } && b.data.link && a.getSelection().selectElement(b.data.link)
                }, null, null, 20), a.addMenuItems && a.addMenuItems({
                    anchor: {
                        label: a.lang.link.anchor.menu,
                        command: "anchor",
                        group: "anchor",
                        order: 1
                    },
                    removeAnchor: {
                        label: a.lang.link.anchor.remove,
                        command: "removeAnchor",
                        group: "anchor",
                        order: 5
                    },
                    link: {
                        label: a.lang.link.menu,
                        command: "link",
                        group: "link",
                        order: 1
                    },
                    unlink: {
                        label: a.lang.link.unlink,
                        command: "unlink",
                        group: "link",
                        order: 5
                    }
                }), a.contextMenu && a.contextMenu.addListener(function(b) {
                    if (!b || b.isReadOnly()) return null;
                    if (b = CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b), !b && !(b = CKEDITOR.plugins.link.getSelectedLink(a))) return null;
                    var c = {};
                    return b.getAttribute("href") && b.getChildCount() && (c = {
                        link: CKEDITOR.TRISTATE_OFF,
                        unlink: CKEDITOR.TRISTATE_OFF
                    }), b && b.hasAttribute("name") && (c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF), c
                }), this.compiledProtectionFunction = d(a)
            },
            afterInit: function(a) {
                a.dataProcessor.dataFilter.addRules({
                    elements: {
                        a: function(b) {
                            return b.attributes.name ? b.children.length ? null : a.createFakeParserElement(b, "cke_anchor", "anchor") : null
                        }
                    }
                });
                var b = a._.elementsPath && a._.elementsPath.filters;
                b && b.push(function(b, c) {
                    return "a" != c || !CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b) && (!b.getAttribute("name") || b.getAttribute("href") && b.getChildCount()) ? void 0 : "anchor"
                })
            }
        });
        var e = /^javascript:/,
            f = /^mailto:([^?]+)(?:\?(.+))?$/,
            g = /subject=([^;?:@&=$,\/]*)/,
            h = /body=([^;?:@&=$,\/]*)/,
            i = /^#(.*)$/,
            j = /^((?:http|https|ftp|news):\/\/)?(.*)$/,
            k = /^(_(?:self|top|parent|blank))$/,
            l = /^javascript:void\(location\.href='mailto:'\+String\.fromCharCode\(([^)]+)\)(?:\+'(.*)')?\)$/,
            m = /^javascript:([^(]+)\(([^)]+)\)$/,
            n = /\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/,
            o = /(?:^|,)([^=]+)=(\d+|yes|no)/gi,
            p = {
                id: "advId",
                dir: "advLangDir",
                accessKey: "advAccessKey",
                name: "advName",
                lang: "advLangCode",
                tabindex: "advTabIndex",
                title: "advTitle",
                type: "advContentType",
                "class": "advCSSClasses",
                charset: "advCharset",
                style: "advStyles",
                rel: "advRel"
            };
        CKEDITOR.plugins.link = {
            getSelectedLink: function(a) {
                var b = a.getSelection(),
                    c = b.getSelectedElement();
                return c && c.is("a") ? c : (b = b.getRanges()[0]) ? (b.shrink(CKEDITOR.SHRINK_TEXT), a.elementPath(b.getCommonAncestor()).contains("a", 1)) : null
            },
            getEditorAnchors: function(a) {
                for (var b, c = a.editable(), d = c.isInline() && !a.plugins.divarea ? a.document : c, c = d.getElementsByTag("a"), d = d.getElementsByTag("img"), e = [], f = 0; b = c.getItem(f++);)(b.data("cke-saved-name") || b.hasAttribute("name")) && e.push({
                    name: b.data("cke-saved-name") || b.getAttribute("name"),
                    id: b.getAttribute("id")
                });
                for (f = 0; b = d.getItem(f++);)(b = this.tryRestoreFakeAnchor(a, b)) && e.push({
                    name: b.getAttribute("name"),
                    id: b.getAttribute("id")
                });
                return e
            },
            fakeAnchor: !0,
            tryRestoreFakeAnchor: function(a, b) {
                if (b && b.data("cke-real-element-type") && "anchor" == b.data("cke-real-element-type")) {
                    var c = a.restoreRealElement(b);
                    if (c.data("cke-saved-name")) return c
                }
            },
            parseLinkAttributes: function(a, b) {
                var c, d = b && (b.data("cke-saved-href") || b.getAttribute("href")) || "",
                    q = a.plugins.link.compiledProtectionFunction,
                    r = a.config.emailProtection,
                    s = {};
                if (d.match(e) && ("encode" == r ? d = d.replace(l, function(a, b, c) {
                        return "mailto:" + String.fromCharCode.apply(String, b.split(",")) + (c && c.replace(/\\'/g, "'"))
                    }) : r && d.replace(m, function(a, b, c) {
                        if (b == q.name) {
                            s.type = "email";
                            for (var d, e, a = s.email = {}, b = /(^')|('$)/g, c = c.match(/[^,\s]+/g), f = c.length, g = 0; f > g; g++) d = decodeURIComponent, e = c[g].replace(b, "").replace(/\\'/g, "'"), e = d(e), d = q.params[g].toLowerCase(), a[d] = e;
                            a.address = [a.name, a.domain].join("@")
                        }
                    })), !s.type)
                    if (r = d.match(i)) s.type = "anchor", s.anchor = {}, s.anchor.name = s.anchor.id = r[1];
                    else if (r = d.match(f)) {
                    c = d.match(g), d = d.match(h), s.type = "email";
                    var t = s.email = {};
                    t.address = r[1], c && (t.subject = decodeURIComponent(c[1])), d && (t.body = decodeURIComponent(d[1]))
                } else d && (c = d.match(j)) && (s.type = "url", s.url = {}, s.url.protocol = c[1], s.url.url = c[2]);
                if (b) {
                    if (d = b.getAttribute("target")) s.target = {
                        type: d.match(k) ? d : "frame",
                        name: d
                    };
                    else if (d = (d = b.data("cke-pa-onclick") || b.getAttribute("onclick")) && d.match(n))
                        for (s.target = {
                                type: "popup",
                                name: d[1]
                            }; r = o.exec(d[2]);) "yes" != r[2] && "1" != r[2] || r[1] in {
                            height: 1,
                            width: 1,
                            top: 1,
                            left: 1
                        } ? isFinite(r[2]) && (s.target[r[1]] = r[2]) : s.target[r[1]] = !0;
                    var u, d = {};
                    for (u in p)(r = b.getAttribute(u)) && (d[p[u]] = r);
                    (u = b.data("cke-saved-name") || d.advName) && (d.advName = u), CKEDITOR.tools.isEmpty(d) || (s.advanced = d)
                }
                return s
            },
            getLinkAttributes: function(d, e) {
                var f = d.config.emailProtection || "",
                    g = {};
                switch (e.type) {
                    case "url":
                        var f = e.url && void 0 != e.url.protocol ? e.url.protocol : "http://",
                            h = e.url && CKEDITOR.tools.trim(e.url.url) || "";
                        g["data-cke-saved-href"] = 0 === h.indexOf("/") ? h : f + h;
                        break;
                    case "anchor":
                        f = e.anchor && e.anchor.id, g["data-cke-saved-href"] = "#" + (e.anchor && e.anchor.name || f || "");
                        break;
                    case "email":
                        var i = e.email,
                            h = i.address;
                        switch (f) {
                            case "":
                            case "encode":
                                var j = encodeURIComponent(i.subject || ""),
                                    k = encodeURIComponent(i.body || ""),
                                    i = [];
                                j && i.push("subject=" + j), k && i.push("body=" + k), i = i.length ? "?" + i.join("&") : "", "encode" == f ? (f = ["javascript:void(location.href='mailto:'+", b(h)], i && f.push("+'", a(i), "'"), f.push(")")) : f = ["mailto:", h, i];
                                break;
                            default:
                                f = h.split("@", 2), i.name = f[0], i.domain = f[1], f = ["javascript:", c(d, i)]
                        }
                        g["data-cke-saved-href"] = f.join("")
                }
                if (e.target)
                    if ("popup" == e.target.type) {
                        for (var f = ["window.open(this.href, '", e.target.name || "", "', '"], l = "resizable status location toolbar menubar fullscreen scrollbars dependent".split(" "), h = l.length, j = function(a) {
                                e.target[a] && l.push(a + "=" + e.target[a])
                            }, i = 0; h > i; i++) l[i] += e.target[l[i]] ? "=yes" : "=no";
                        j("width"),
                            j("left"), j("height"), j("top"), f.push(l.join(","), "'); return false;"), g["data-cke-pa-onclick"] = f.join("")
                    } else "notSet" != e.target.type && e.target.name && (g.target = e.target.name);
                if (e.advanced) {
                    for (var m in p)(f = e.advanced[p[m]]) && (g[m] = f);
                    g.name && (g["data-cke-saved-name"] = g.name)
                }
                g["data-cke-saved-href"] && (g.href = g["data-cke-saved-href"]), m = CKEDITOR.tools.extend({
                    target: 1,
                    onclick: 1,
                    "data-cke-pa-onclick": 1,
                    "data-cke-saved-name": 1
                }, p);
                for (var n in g) delete m[n];
                return {
                    set: g,
                    removed: CKEDITOR.tools.objectKeys(m)
                }
            }
        }, CKEDITOR.unlinkCommand = function() {}, CKEDITOR.unlinkCommand.prototype = {
            exec: function(a) {
                var b = new CKEDITOR.style({
                    element: "a",
                    type: CKEDITOR.STYLE_INLINE,
                    alwaysRemoveElement: 1
                });
                a.removeStyle(b)
            },
            refresh: function(a, b) {
                var c = b.lastElement && b.lastElement.getAscendant("a", !0);
                c && "a" == c.getName() && c.getAttribute("href") && c.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
            },
            contextSensitive: 1,
            startDisabled: 1,
            requiredContent: "a[href]"
        }, CKEDITOR.removeAnchorCommand = function() {}, CKEDITOR.removeAnchorCommand.prototype = {
            exec: function(a) {
                var b, c = a.getSelection(),
                    d = c.createBookmarks();
                c && (b = c.getSelectedElement()) && (b.getChildCount() ? b.is("a") : CKEDITOR.plugins.link.tryRestoreFakeAnchor(a, b)) ? b.remove(1) : (b = CKEDITOR.plugins.link.getSelectedLink(a)) && (b.hasAttribute("href") ? (b.removeAttributes({
                    name: 1,
                    "data-cke-saved-name": 1
                }), b.removeClass("cke_anchor")) : b.remove(1)), c.selectBookmarks(d)
            },
            requiredContent: "a[name]"
        }, CKEDITOR.tools.extend(CKEDITOR.config, {
            linkShowAdvancedTab: !0,
            linkShowTargetTab: !0
        })
    }(), function() {
        function a(a, b, c) {
            function d(c) {
                !(i = k[c ? "getFirst" : "getLast"]()) || i.is && i.isBlockBoundary() || !(j = b.root[c ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(!0))) || j.is && j.isBlockBoundary({
                    br: 1
                }) || a.document.createElement("br")[c ? "insertBefore" : "insertAfter"](i)
            }
            for (var e = CKEDITOR.plugins.list.listToArray(b.root, c), f = [], g = 0; g < b.contents.length; g++) {
                var h = b.contents[g];
                (h = h.getAscendant("li", !0)) && !h.getCustomData("list_item_processed") && (f.push(h), CKEDITOR.dom.element.setMarker(c, h, "list_item_processed", !0))
            }
            for (h = null, g = 0; g < f.length; g++) h = f[g].getCustomData("listarray_index"), e[h].indent = -1;
            for (g = h + 1; g < e.length; g++)
                if (e[g].indent > e[g - 1].indent + 1) {
                    for (f = e[g - 1].indent + 1 - e[g].indent, h = e[g].indent; e[g] && e[g].indent >= h;) e[g].indent += f, g++;
                    g--
                }
            var i, j, k = CKEDITOR.plugins.list.arrayToList(e, c, null, a.config.enterMode, b.root.getAttribute("dir")).listNode;
            d(!0), d(), k.replace(b.root), a.fire("contentDomInvalidated")
        }

        function b(a, b) {
            this.name = a, this.context = this.type = b, this.allowedContent = b + " li", this.requiredContent = b
        }

        function c(a, b, c, d) {
            for (var e, f; e = a[d ? "getLast" : "getFirst"](n);)(f = e.getDirection(1)) !== b.getDirection(1) && e.setAttribute("dir", f), e.remove(), c ? e[d ? "insertBefore" : "insertAfter"](c) : b.append(e, d)
        }

        function d(a) {
            var b;
            (b = function(b) {
                var d = a[b ? "getPrevious" : "getNext"](k);
                d && d.type == CKEDITOR.NODE_ELEMENT && d.is(a.getName()) && (c(a, d, null, !b), a.remove(), a = d)
            })(), b(1)
        }

        function e(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in CKEDITOR.dtd.$block || a.getName() in CKEDITOR.dtd.$listItem) && CKEDITOR.dtd[a.getName()]["#"]
        }

        function f(a, b, e) {
            a.fire("saveSnapshot"), e.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
            var f = e.extractContents();
            b.trim(!1, !0);
            var h = b.createBookmark(),
                i = new CKEDITOR.dom.elementPath(b.startContainer),
                j = i.block,
                i = i.lastElement.getAscendant("li", 1) || j,
                m = new CKEDITOR.dom.elementPath(e.startContainer),
                n = m.contains(CKEDITOR.dtd.$listItem),
                m = m.contains(CKEDITOR.dtd.$list);
            for (j ? (j = j.getBogus()) && j.remove() : m && (j = m.getPrevious(k)) && l(j) && j.remove(), (j = f.getLast()) && j.type == CKEDITOR.NODE_ELEMENT && j.is("br") && j.remove(), (j = b.startContainer.getChild(b.startOffset)) ? f.insertBefore(j) : b.startContainer.append(f), n && (f = g(n)) && (i.contains(n) ? (c(f, n.getParent(), n), f.remove()) : i.append(f)); e.checkStartOfBlock() && e.checkEndOfBlock() && (m = e.startPath(), f = m.block, f);) f.is("li") && (i = f.getParent(), f.equals(i.getLast(k)) && f.equals(i.getFirst(k)) && (f = i)), e.moveToPosition(f, CKEDITOR.POSITION_BEFORE_START), f.remove();
            e = e.clone(), f = a.editable(), e.setEndAt(f, CKEDITOR.POSITION_BEFORE_END), e = new CKEDITOR.dom.walker(e), e.evaluator = function(a) {
                return k(a) && !l(a)
            }, (e = e.next()) && e.type == CKEDITOR.NODE_ELEMENT && e.getName() in CKEDITOR.dtd.$list && d(e), b.moveToBookmark(h), b.select(), a.fire("saveSnapshot")
        }

        function g(a) {
            return (a = a.getLast(k)) && a.type == CKEDITOR.NODE_ELEMENT && a.getName() in h ? a : null
        }
        var h = {
                ol: 1,
                ul: 1
            },
            i = CKEDITOR.dom.walker.whitespaces(),
            j = CKEDITOR.dom.walker.bookmark(),
            k = function(a) {
                return !(i(a) || j(a))
            },
            l = CKEDITOR.dom.walker.bogus();
        CKEDITOR.plugins.list = {
            listToArray: function(a, b, c, d, e) {
                if (!h[a.getName()]) return [];
                d || (d = 0), c || (c = []);
                for (var f = 0, g = a.getChildCount(); g > f; f++) {
                    var i = a.getChild(f);
                    if (i.type == CKEDITOR.NODE_ELEMENT && i.getName() in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(i, b, c, d + 1), "li" == i.$.nodeName.toLowerCase()) {
                        var j = {
                            parent: a,
                            indent: d,
                            element: i,
                            contents: []
                        };
                        e ? j.grandparent = e : (j.grandparent = a.getParent(), j.grandparent && "li" == j.grandparent.$.nodeName.toLowerCase() && (j.grandparent = j.grandparent.getParent())), b && CKEDITOR.dom.element.setMarker(b, i, "listarray_index", c.length), c.push(j);
                        for (var k, l = 0, m = i.getChildCount(); m > l; l++) k = i.getChild(l), k.type == CKEDITOR.NODE_ELEMENT && h[k.getName()] ? CKEDITOR.plugins.list.listToArray(k, b, c, d + 1, j.grandparent) : j.contents.push(k)
                    }
                }
                return c
            },
            arrayToList: function(a, b, c, d, e) {
                if (c || (c = 0), !a || a.length < c + 1) return null;
                for (var f, g, i, l = a[c].parent.getDocument(), m = new CKEDITOR.dom.documentFragment(l), n = null, o = c, p = Math.max(a[c].indent, 0), q = null, r = d == CKEDITOR.ENTER_P ? "p" : "div";;) {
                    var s = a[o];
                    if (f = s.grandparent, g = s.element.getDirection(1), s.indent == p) {
                        for (n && a[o].parent.getName() == n.getName() || (n = a[o].parent.clone(!1, 1), e && n.setAttribute("dir", e), m.append(n)), q = n.append(s.element.clone(0, 1)), g != n.getDirection(1) && q.setAttribute("dir", g), f = 0; f < s.contents.length; f++) q.append(s.contents[f].clone(1, 1));
                        o++
                    } else if (s.indent == Math.max(p, 0) + 1) s = a[o - 1].element.getDirection(1), o = CKEDITOR.plugins.list.arrayToList(a, null, o, d, s != g ? g : null), !q.getChildCount() && CKEDITOR.env.needsNbspFiller && !(7 < l.$.documentMode) && q.append(l.createText(" ")), q.append(o.listNode), o = o.nextIndex;
                    else {
                        if (-1 != s.indent || c || !f) return null;
                        h[f.getName()] ? (q = s.element.clone(!1, !0), g != f.getDirection(1) && q.setAttribute("dir", g)) : q = new CKEDITOR.dom.documentFragment(l);
                        var t, u, n = f.getDirection(1) != g,
                            v = s.element,
                            w = v.getAttribute("class"),
                            x = v.getAttribute("style"),
                            y = q.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (d != CKEDITOR.ENTER_BR || n || x || w),
                            z = s.contents.length;
                        for (f = 0; z > f; f++)
                            if (t = s.contents[f], j(t) && z > 1) y ? u = t.clone(1, 1) : q.append(t.clone(1, 1));
                            else if (t.type == CKEDITOR.NODE_ELEMENT && t.isBlockBoundary()) {
                            n && !t.getDirection() && t.setAttribute("dir", g), i = t;
                            var A = v.getAttribute("style");
                            A && i.setAttribute("style", A.replace(/([^;])$/, "$1;") + (i.getAttribute("style") || "")), w && t.addClass(w), i = null, u && (q.append(u), u = null), q.append(t.clone(1, 1))
                        } else y ? (i || (i = l.createElement(r), q.append(i), n && i.setAttribute("dir", g)), x && i.setAttribute("style", x), w && i.setAttribute("class", w), u && (i.append(u), u = null), i.append(t.clone(1, 1))) : q.append(t.clone(1, 1));
                        u && ((i || q).append(u), u = null), q.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && o != a.length - 1 && (CKEDITOR.env.needsBrFiller && (g = q.getLast()) && g.type == CKEDITOR.NODE_ELEMENT && g.is("br") && g.remove(), g = q.getLast(k), (!g || !(g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.$block))) && q.append(l.createElement("br"))), g = q.$.nodeName.toLowerCase(), ("div" == g || "p" == g) && q.appendBogus(), m.append(q), n = null, o++
                    }
                    if (i = null, a.length <= o || Math.max(a[o].indent, 0) < p) break
                }
                if (b)
                    for (a = m.getFirst(); a;) {
                        if (a.type == CKEDITOR.NODE_ELEMENT && (CKEDITOR.dom.element.clearMarkers(b, a), a.getName() in CKEDITOR.dtd.$listItem && (c = a, l = e = d = void 0, d = c.getDirection()))) {
                            for (e = c.getParent(); e && !(l = e.getDirection());) e = e.getParent();
                            d == l && c.removeAttribute("dir")
                        }
                        a = a.getNextSourceNode()
                    }
                return {
                    listNode: m,
                    nextIndex: o
                }
            }
        };
        var m = /^h[1-6]$/,
            n = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
        b.prototype = {
            exec: function(b) {
                this.refresh(b, b.elementPath());
                var c = b.config,
                    e = b.getSelection(),
                    f = e && e.getRanges();
                if (this.state == CKEDITOR.TRISTATE_OFF) {
                    var g = b.editable();
                    if (g.getFirst(k)) {
                        var i = 1 == f.length && f[0];
                        (c = i && i.getEnclosedNode()) && c.is && this.type == c.getName() && this.setState(CKEDITOR.TRISTATE_ON)
                    } else c.enterMode == CKEDITOR.ENTER_BR ? g.appendBogus() : f[0].fixBlock(1, c.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), e.selectRanges(f)
                }
                for (var c = e.createBookmarks(!0), g = [], j = {}, f = f.createIterator(), l = 0;
                    (i = f.getNextRange()) && ++l;) {
                    var n = i.getBoundaryNodes(),
                        o = n.startNode,
                        p = n.endNode;
                    for (o.type == CKEDITOR.NODE_ELEMENT && "td" == o.getName() && i.setStartAt(n.startNode, CKEDITOR.POSITION_AFTER_START), p.type == CKEDITOR.NODE_ELEMENT && "td" == p.getName() && i.setEndAt(n.endNode, CKEDITOR.POSITION_BEFORE_END), i = i.createIterator(), i.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; n = i.getNextParagraph();)
                        if (!n.getCustomData("list_block")) {
                            CKEDITOR.dom.element.setMarker(j, n, "list_block", 1);
                            for (var q, r = b.elementPath(n), o = r.elements, p = 0, r = r.blockLimit, s = o.length - 1; s >= 0 && (q = o[s]); s--)
                                if (h[q.getName()] && r.contains(q)) {
                                    r.removeCustomData("list_group_object_" + l), (o = q.getCustomData("list_group_object")) ? o.contents.push(n) : (o = {
                                        root: q,
                                        contents: [n]
                                    }, g.push(o), CKEDITOR.dom.element.setMarker(j, q, "list_group_object", o)), p = 1;
                                    break
                                }
                            p || (p = r, p.getCustomData("list_group_object_" + l) ? p.getCustomData("list_group_object_" + l).contents.push(n) : (o = {
                                root: p,
                                contents: [n]
                            }, CKEDITOR.dom.element.setMarker(j, p, "list_group_object_" + l, o), g.push(o)))
                        }
                }
                for (q = []; 0 < g.length;)
                    if (o = g.shift(), this.state == CKEDITOR.TRISTATE_OFF)
                        if (h[o.root.getName()]) {
                            for (f = b, l = o, o = j, i = q, p = CKEDITOR.plugins.list.listToArray(l.root, o), r = [], n = 0; n < l.contents.length; n++) s = l.contents[n], (s = s.getAscendant("li", !0)) && !s.getCustomData("list_item_processed") && (r.push(s), CKEDITOR.dom.element.setMarker(o, s, "list_item_processed", !0));
                            for (var s = l.root.getDocument(), t = void 0, u = void 0, n = 0; n < r.length; n++) {
                                var v = r[n].getCustomData("listarray_index"),
                                    t = p[v].parent;
                                t.is(this.type) || (u = s.createElement(this.type), t.copyAttributes(u, {
                                    start: 1,
                                    type: 1
                                }), u.removeStyle("list-style-type"), p[v].parent = u)
                            }
                            for (o = CKEDITOR.plugins.list.arrayToList(p, o, null, f.config.enterMode), p = void 0, r = o.listNode.getChildCount(), n = 0; r > n && (p = o.listNode.getChild(n)); n++) p.getName() == this.type && i.push(p);
                            o.listNode.replace(l.root), f.fire("contentDomInvalidated")
                        } else {
                            for (p = b, n = o, i = q, r = n.contents, f = n.root.getDocument(), l = [], 1 == r.length && r[0].equals(n.root) && (o = f.createElement("div"), r[0].moveChildren && r[0].moveChildren(o), r[0].append(o), r[0] = o), n = n.contents[0].getParent(), s = 0; s < r.length; s++) n = n.getCommonAncestor(r[s].getParent());
                            for (t = p.config.useComputedState, p = o = void 0, t = void 0 === t || t, s = 0; s < r.length; s++)
                                for (u = r[s]; v = u.getParent();) {
                                    if (v.equals(n)) {
                                        l.push(u), !p && u.getDirection() && (p = 1), u = u.getDirection(t), null !== o && (o = o && o != u ? null : u);
                                        break
                                    }
                                    u = v
                                }
                            if (!(1 > l.length)) {
                                for (r = l[l.length - 1].getNext(), s = f.createElement(this.type), i.push(s), t = i = void 0; l.length;) i = l.shift(), t = f.createElement("li"), i.is("pre") || m.test(i.getName()) || "false" == i.getAttribute("contenteditable") ? i.appendTo(t) : (i.copyAttributes(t), o && i.getDirection() && (t.removeStyle("direction"), t.removeAttribute("dir")), i.moveChildren(t), i.remove()), t.appendTo(s);
                                o && p && s.setAttribute("dir", o), r ? s.insertBefore(r) : s.appendTo(n)
                            }
                        } else this.state == CKEDITOR.TRISTATE_ON && h[o.root.getName()] && a.call(this, b, o, j);
                for (s = 0; s < q.length; s++) d(q[s]);
                CKEDITOR.dom.element.clearAllMarkers(j), e.selectBookmarks(c), b.focus()
            },
            refresh: function(a, b) {
                var c = b.contains(h, 1),
                    d = b.blockLimit || b.root;
                c && d.contains(c) ? this.setState(c.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
            }
        }, CKEDITOR.plugins.add("list", {
            requires: "indentlist",
            init: function(a) {
                a.blockless || (a.addCommand("numberedlist", new b("numberedlist", "ol")), a.addCommand("bulletedlist", new b("bulletedlist", "ul")), a.ui.addButton && (a.ui.addButton("NumberedList", {
                    label: a.lang.list.numberedlist,
                    command: "numberedlist",
                    directional: !0,
                    toolbar: "list,10"
                }), a.ui.addButton("BulletedList", {
                    label: a.lang.list.bulletedlist,
                    command: "bulletedlist",
                    directional: !0,
                    toolbar: "list,20"
                })), a.on("key", function(b) {
                    var c = b.data.domEvent.getKey();
                    if ("wysiwyg" == a.mode && c in {
                            8: 1,
                            46: 1
                        }) {
                        var d = a.getSelection().getRanges()[0],
                            i = d && d.startPath();
                        if (d && d.collapsed) {
                            var j = 8 == c,
                                m = a.editable(),
                                n = new CKEDITOR.dom.walker(d.clone());
                            if (n.evaluator = function(a) {
                                    return k(a) && !l(a)
                                }, n.guard = function(a, b) {
                                    return !(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
                                }, c = d.clone(), j) {
                                var o, p;
                                (o = i.contains(h)) && d.checkBoundaryOfElement(o, CKEDITOR.START) && (o = o.getParent()) && o.is("li") && (o = g(o)) ? (p = o, o = o.getPrevious(k), c.moveToPosition(o && l(o) ? o : p, CKEDITOR.POSITION_BEFORE_START)) : (n.range.setStartAt(m, CKEDITOR.POSITION_AFTER_START), n.range.setEnd(d.startContainer, d.startOffset), (o = n.previous()) && o.type == CKEDITOR.NODE_ELEMENT && (o.getName() in h || o.is("li")) && (o.is("li") || (n.range.selectNodeContents(o), n.reset(), n.evaluator = e, o = n.previous()), p = o, c.moveToElementEditEnd(p))), p ? (f(a, c, d), b.cancel()) : (c = i.contains(h)) && d.checkBoundaryOfElement(c, CKEDITOR.START) && (p = c.getFirst(k), d.checkBoundaryOfElement(p, CKEDITOR.START) && (o = c.getPrevious(k), g(p) ? o && (d.moveToElementEditEnd(o), d.select()) : a.execCommand("outdent"), b.cancel()))
                            } else(p = i.contains("li")) ? (n.range.setEndAt(m, CKEDITOR.POSITION_BEFORE_END), m = (i = p.getLast(k)) && e(i) ? i : p, p = 0, (o = n.next()) && o.type == CKEDITOR.NODE_ELEMENT && o.getName() in h && o.equals(i) ? (p = 1, o = n.next()) : d.checkBoundaryOfElement(m, CKEDITOR.END) && (p = 1), p && o && (d = d.clone(), d.moveToElementEditStart(o), f(a, c, d), b.cancel())) : (n.range.setEndAt(m, CKEDITOR.POSITION_BEFORE_END), (o = n.next()) && o.type == CKEDITOR.NODE_ELEMENT && o.is(h) && (o = o.getFirst(k), i.block && d.checkStartOfBlock() && d.checkEndOfBlock() ? (i.block.remove(), d.moveToElementEditStart(o), d.select()) : g(o) ? (d.moveToElementEditStart(o), d.select()) : (d = d.clone(), d.moveToElementEditStart(o), f(a, c, d)), b.cancel()));
                            setTimeout(function() {
                                a.selectionChange(1)
                            })
                        }
                    }
                }))
            }
        })
    }(), function() {
        function a(a, b, c) {
            return k(b) && k(c) && c.equals(b.getNext(function(a) {
                return !(W(a) || X(a) || l(a))
            }))
        }

        function b(a) {
            this.upper = a[0], this.lower = a[1], this.set.apply(this, a.slice(2))
        }

        function c(a) {
            var b = a.element;
            if (b && k(b) && (b = b.getAscendant(a.triggers, !0)) && a.editable.contains(b)) {
                var c = f(b);
                if ("true" == c.getAttribute("contenteditable")) return b;
                if (c.is(a.triggers)) return c
            }
            return null
        }

        function d(a, b, c) {
            return t(a, b), t(a, c), a = b.size.bottom, c = c.size.top, a && c ? 0 | (a + c) / 2 : a || c
        }

        function e(a, b, c) {
            return b = b[c ? "getPrevious" : "getNext"](function(b) {
                return b && b.type == CKEDITOR.NODE_TEXT && !W(b) || k(b) && !l(b) && !j(a, b)
            })
        }

        function f(a, b) {
            if (a.data("cke-editable")) return null;
            for (b || (a = a.getParent()); a && !a.data("cke-editable");) {
                if (a.hasAttribute("contenteditable")) return a;
                a = a.getParent()
            }
            return null
        }

        function g(a) {
            var b = a.doc,
                c = z('<span contenteditable="false" style="' + S + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>', b),
                d = CKEDITOR.getUrl(this.path + "images/" + (A.hidpi ? "hidpi/" : "") + "icon" + (a.rtl ? "-rtl" : "") + ".png");
            for (x(c, {
                    attach: function() {
                        return this.wrap.getParent() || this.wrap.appendTo(a.editable, !0), this
                    },
                    lineChildren: [x(z('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', b), {
                        base: S + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + d + ") center no-repeat " + a.boxColor + ";cursor:pointer;" + (A.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : "") + (A.hidpi ? "background-size: 9px 10px;" : ""),
                        looks: ["top:-8px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px", 1), "top:-17px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px 2px 0px 0px", 1), "top:-1px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "0px 0px 2px 2px", 1)]
                    }), x(z(U, b), {
                        base: T + "left:0px;border-left-color:" + a.boxColor + ";",
                        looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]
                    }), x(z(U, b), {
                        base: T + "right:0px;border-right-color:" + a.boxColor + ";",
                        looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]
                    })],
                    detach: function() {
                        return this.wrap.getParent() && this.wrap.remove(), this
                    },
                    mouseNear: function() {
                        t(a, this);
                        var b = a.holdDistance,
                            c = this.size;
                        return c && a.mouse.y > c.top - b && a.mouse.y < c.bottom + b && a.mouse.x > c.left - b && a.mouse.x < c.right + b ? !0 : !1
                    },
                    place: function() {
                        var b = a.view,
                            c = a.editable,
                            d = a.trigger,
                            e = d.upper,
                            f = d.lower,
                            g = e || f,
                            h = g.getParent(),
                            i = {};
                        this.trigger = d, e && t(a, e, !0), f && t(a, f, !0), t(a, h, !0), a.inInlineMode && u(a, !0), h.equals(c) ? (i.left = b.scroll.x, i.right = -b.scroll.x, i.width = "") : (i.left = g.size.left - g.size.margin.left + b.scroll.x - (a.inInlineMode ? b.editable.left + b.editable.border.left : 0), i.width = g.size.outerWidth + g.size.margin.left + g.size.margin.right + b.scroll.x, i.right = ""), e && f ? i.top = e.size.margin.bottom === f.size.margin.top ? 0 | e.size.bottom + e.size.margin.bottom / 2 : e.size.margin.bottom < f.size.margin.top ? e.size.bottom + e.size.margin.bottom : e.size.bottom + e.size.margin.bottom - f.size.margin.top : e ? f || (i.top = e.size.bottom + e.size.margin.bottom) : i.top = f.size.top - f.size.margin.top, d.is(J) || i.top > b.scroll.y - 15 && i.top < b.scroll.y + 5 ? (i.top = a.inInlineMode ? 0 : b.scroll.y, this.look(J)) : d.is(K) || i.top > b.pane.bottom - 5 && i.top < b.pane.bottom + 15 ? (i.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1, this.look(K)) : (a.inInlineMode && (i.top -= b.editable.top + b.editable.border.top), this.look(L)), a.inInlineMode && (i.top--, i.top += b.editable.scroll.top, i.left += b.editable.scroll.left);
                        for (var j in i) i[j] = CKEDITOR.tools.cssLength(i[j]);
                        this.setStyles(i)
                    },
                    look: function(a) {
                        if (this.oldLook != a) {
                            for (var b, c = this.lineChildren.length; c--;)(b = this.lineChildren[c]).setAttribute("style", b.base + b.looks[0 | a / 2]);
                            this.oldLook = a
                        }
                    },
                    wrap: new y("span", a.doc)
                }), b = c.lineChildren.length; b--;) c.lineChildren[b].appendTo(c);
            c.look(L), c.appendTo(c.wrap), c.unselectable(), c.lineChildren[0].on("mouseup", function(b) {
                c.detach(), h(a, function(b) {
                    var c = a.line.trigger;
                    b[c.is(E) ? "insertBefore" : "insertAfter"](c.is(E) ? c.lower : c.upper)
                }, !0), a.editor.focus(), !A.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView(), b.data.preventDefault(!0)
            }), c.on("mousedown", function(a) {
                a.data.preventDefault(!0)
            }), a.line = c
        }

        function h(a, b, c) {
            var d, e = new CKEDITOR.dom.range(a.doc),
                g = a.editor;
            A.ie && a.enterMode == CKEDITOR.ENTER_BR ? d = a.doc.createText(M) : (d = (d = f(a.element, !0)) && d.data("cke-enter-mode") || a.enterMode, d = new y(D[d], a.doc), d.is("br") || a.doc.createText(M).appendTo(d)), c && g.fire("saveSnapshot"), b(d), e.moveToPosition(d, CKEDITOR.POSITION_AFTER_START), g.getSelection().selectRanges([e]), a.hotNode = d, c && g.fire("saveSnapshot")
        }

        function i(a, b) {
            return {
                canUndo: !0,
                modes: {
                    wysiwyg: 1
                },
                exec: function() {
                    function d(c) {
                        var d = A.ie && 9 > A.version ? " " : M,
                            e = a.hotNode && a.hotNode.getText() == d && a.element.equals(a.hotNode) && a.lastCmdDirection === !!b;
                        h(a, function(d) {
                            e && a.hotNode && a.hotNode.remove(), d[b ? "insertAfter" : "insertBefore"](c), d.setAttributes({
                                "data-cke-magicline-hot": 1,
                                "data-cke-magicline-dir": !!b
                            }), a.lastCmdDirection = !!b
                        }), !A.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView(), a.line.detach()
                    }
                    return function(g) {
                        var h, g = g.getSelection().getStartElement(),
                            g = g.getAscendant(Q, 1);
                        if (!o(a, g) && g && !g.equals(a.editable) && !g.contains(a.editable)) {
                            (h = f(g)) && "false" == h.getAttribute("contenteditable") && (g = h), a.element = g, h = e(a, g, !b);
                            var i;
                            k(h) && h.is(a.triggers) && h.is(P) && (!e(a, h, !b) || (i = e(a, h, !b)) && k(i) && i.is(a.triggers)) ? d(h) : (i = c(a, g), k(i) && (e(a, i, !b) ? (g = e(a, i, !b)) && k(g) && g.is(a.triggers) && d(i) : d(i)))
                        }
                    }
                }()
            }
        }

        function j(a, b) {
            if (!b || b.type != CKEDITOR.NODE_ELEMENT || !b.$) return !1;
            var c = a.line;
            return c.wrap.equals(b) || c.wrap.contains(b)
        }

        function k(a) {
            return a && a.type == CKEDITOR.NODE_ELEMENT && a.$
        }

        function l(a) {
            if (!k(a)) return !1;
            var b;
            return (b = m(a)) || (k(a) ? (b = {
                left: 1,
                right: 1,
                center: 1
            }, b = !(!b[a.getComputedStyle("float")] && !b[a.getAttribute("align")])) : b = !1), b
        }

        function m(a) {
            return !!{
                absolute: 1,
                fixed: 1
            }[a.getComputedStyle("position")]
        }

        function n(a, b) {
            return k(b) ? b.is(a.triggers) : null
        }

        function o(a, b) {
            if (!b) return !1;
            for (var c = b.getParents(1), d = c.length; d--;)
                for (var e = a.tabuList.length; e--;)
                    if (c[d].hasAttribute(a.tabuList[e])) return !0;
            return !1
        }

        function p(a, b, c) {
            return (b = b[c ? "getLast" : "getFirst"](function(b) {
                return a.isRelevant(b) && !b.is(O)
            })) ? (t(a, b), c ? b.size.top > a.mouse.y : b.size.bottom < a.mouse.y) : !1
        }

        function q(a) {
            var c = a.editable,
                d = a.mouse,
                e = a.view,
                f = a.triggerOffset;
            u(a);
            var g = d.y > (a.inInlineMode ? e.editable.top + e.editable.height / 2 : Math.min(e.editable.height, e.pane.height) / 2),
                c = c[g ? "getLast" : "getFirst"](function(a) {
                    return !(W(a) || X(a))
                });
            return c ? (j(a, c) && (c = a.line.wrap[g ? "getPrevious" : "getNext"](function(a) {
                return !(W(a) || X(a))
            })), k(c) && !l(c) && n(a, c) ? (t(a, c), !g && 0 <= c.size.top && 0 < d.y && d.y < c.size.top + f ? (a = a.inInlineMode || 0 === e.scroll.y ? J : L, new b([null, c, E, H, a])) : g && c.size.bottom <= e.pane.height && d.y > c.size.bottom - f && d.y < e.pane.height ? (a = a.inInlineMode || c.size.bottom > e.pane.height - f && c.size.bottom < e.pane.height ? K : L, new b([c, null, F, H, a])) : null) : null) : null
        }

        function r(a) {
            var d = a.mouse,
                f = a.view,
                g = a.triggerOffset,
                h = c(a);
            if (!h) return null;
            t(a, h);
            var i, j, g = Math.min(g, 0 | h.size.outerHeight / 2),
                m = [];
            if (d.y > h.size.top - 1 && d.y < h.size.top + g) j = !1;
            else {
                if (!(d.y > h.size.bottom - g && d.y < h.size.bottom + 1)) return null;
                j = !0
            }
            if (l(h) || p(a, h, j) || h.getParent().is(N)) return null;
            var o = e(a, h, !j);
            if (o) {
                if (o && o.type == CKEDITOR.NODE_TEXT) return null;
                if (k(o)) {
                    if (l(o) || !n(a, o) || o.getParent().is(N)) return null;
                    m = [o, h][j ? "reverse" : "concat"]().concat([G, H])
                }
            } else h.equals(a.editable[j ? "getLast" : "getFirst"](a.isRelevant)) ? (u(a), j && d.y > h.size.bottom - g && d.y < f.pane.height && h.size.bottom > f.pane.height - g && h.size.bottom < f.pane.height ? i = K : 0 < d.y && d.y < h.size.top + g && (i = J)) : i = L, m = [null, h][j ? "reverse" : "concat"]().concat([j ? F : E, H, i, h.equals(a.editable[j ? "getLast" : "getFirst"](a.isRelevant)) ? j ? K : J : L]);
            return 0 in m ? new b(m) : null
        }

        function s(a, b, c, d) {
            for (var e = function() {
                    var c = A.ie ? b.$.currentStyle : a.win.$.getComputedStyle(b.$, "");
                    return A.ie ? function(a) {
                        return c[CKEDITOR.tools.cssStyleToDomStyle(a)]
                    } : function(a) {
                        return c.getPropertyValue(a)
                    }
                }(), f = b.getDocumentPosition(), g = {}, h = {}, i = {}, j = {}, k = Z.length; k--;) g[Z[k]] = parseInt(e("border-" + Z[k] + "-width"), 10) || 0, i[Z[k]] = parseInt(e("padding-" + Z[k]), 10) || 0, h[Z[k]] = parseInt(e("margin-" + Z[k]), 10) || 0;
            return (!c || d) && v(a, d), j.top = f.y - (c ? 0 : a.view.scroll.y), j.left = f.x - (c ? 0 : a.view.scroll.x), j.outerWidth = b.$.offsetWidth, j.outerHeight = b.$.offsetHeight, j.height = j.outerHeight - (i.top + i.bottom + g.top + g.bottom), j.width = j.outerWidth - (i.left + i.right + g.left + g.right), j.bottom = j.top + j.outerHeight, j.right = j.left + j.outerWidth, a.inInlineMode && (j.scroll = {
                top: b.$.scrollTop,
                left: b.$.scrollLeft
            }), x({
                border: g,
                padding: i,
                margin: h,
                ignoreScroll: c
            }, j, !0)
        }

        function t(a, b, c) {
            if (!k(b)) return b.size = null;
            if (b.size) {
                if (b.size.ignoreScroll == c && b.size.date > new Date - R) return null
            } else b.size = {};
            return x(b.size, s(a, b, c), {
                date: +new Date
            }, !0)
        }

        function u(a, b) {
            a.view.editable = s(a, a.editable, b, !0)
        }

        function v(a, b) {
            a.view || (a.view = {});
            var c = a.view;
            if (b || !(c && c.date > new Date - R)) {
                var d = a.win,
                    c = d.getScrollPosition(),
                    d = d.getViewPaneSize();
                x(a.view, {
                    scroll: {
                        x: c.x,
                        y: c.y,
                        width: a.doc.$.documentElement.scrollWidth - d.width,
                        height: a.doc.$.documentElement.scrollHeight - d.height
                    },
                    pane: {
                        width: d.width,
                        height: d.height,
                        bottom: d.height + c.y
                    },
                    date: +new Date
                }, !0)
            }
        }

        function w(a, c, d, e) {
            for (var f = e, g = e, h = 0, i = !1, j = !1, k = a.view.pane.height, l = a.mouse; l.y + h < k && 0 < l.y - h && (i || (i = c(f, e)), j || (j = c(g, e)), !i && 0 < l.y - h && (f = d(a, {
                    x: l.x,
                    y: l.y - h
                })), !j && l.y + h < k && (g = d(a, {
                    x: l.x,
                    y: l.y + h
                })), !i || !j);) h += 2;
            return new b([f, g, null, null])
        }
        CKEDITOR.plugins.add("magicline", {
            init: function(a) {
                var d, f, n, p = a.config,
                    t = p.magicline_triggerOffset || 30,
                    w = {
                        editor: a,
                        enterMode: p.enterMode,
                        triggerOffset: t,
                        holdDistance: 0 | t * (p.magicline_holdDistance || .5),
                        boxColor: p.magicline_color || "#ff0000",
                        rtl: "rtl" == p.contentsLangDirection,
                        tabuList: ["data-cke-hidden-sel"].concat(p.magicline_tabuList || []),
                        triggers: p.magicline_everywhere ? Q : {
                            table: 1,
                            hr: 1,
                            div: 1,
                            ul: 1,
                            ol: 1,
                            dl: 1,
                            form: 1,
                            blockquote: 1
                        }
                    };
                w.isRelevant = function(a) {
                    return k(a) && !j(w, a) && !l(a)
                }, a.on("contentDom", function() {
                    var k = a.editable(),
                        l = a.document,
                        t = a.window;
                    x(w, {
                        editable: k,
                        inInlineMode: k.isInline(),
                        doc: l,
                        win: t,
                        hotNode: null
                    }, !0), w.boundary = w.inInlineMode ? w.editable : w.doc.getDocumentElement(), k.is(C.$inline) || (w.inInlineMode && !m(k) && k.setStyles({
                        position: "relative",
                        top: null,
                        left: null
                    }), g.call(this, w), v(w), k.attachListener(a, "beforeUndoImage", function() {
                        w.line.detach()
                    }), k.attachListener(a, "beforeGetData", function() {
                        w.line.wrap.getParent() && (w.line.detach(), a.once("getData", function() {
                            w.line.attach()
                        }, null, null, 1e3))
                    }, null, null, 0), k.attachListener(w.inInlineMode ? l : l.getWindow().getFrame(), "mouseout", function(b) {
                        if ("wysiwyg" == a.mode)
                            if (w.inInlineMode) {
                                var c = b.data.$.clientX,
                                    b = b.data.$.clientY;
                                v(w), u(w, !0);
                                var d = w.view.editable,
                                    e = w.view.scroll;
                                c > d.left - e.x && c < d.right - e.x && b > d.top - e.y && b < d.bottom - e.y || (clearTimeout(n), n = null, w.line.detach())
                            } else clearTimeout(n), n = null, w.line.detach()
                    }), k.attachListener(k, "keyup", function() {
                        w.hiddenMode = 0
                    }), k.attachListener(k, "keydown", function(b) {
                        if ("wysiwyg" == a.mode) switch (b = b.data.getKeystroke(), a.getSelection().getStartElement(), b) {
                            case 2228240:
                            case 16:
                                w.hiddenMode = 1, w.line.detach()
                        }
                    }), k.attachListener(w.inInlineMode ? k : l, "mousemove", function(b) {
                        if (f = !0, "wysiwyg" == a.mode && !a.readOnly && !n) {
                            var c = {
                                x: b.data.$.clientX,
                                y: b.data.$.clientY
                            };
                            n = setTimeout(function() {
                                w.mouse = c, n = w.trigger = null, v(w), f && !w.hiddenMode && a.focusManager.hasFocus && !w.line.mouseNear() && (w.element = V(w, !0)) && ((w.trigger = q(w) || r(w) || Y(w)) && !o(w, w.trigger.upper || w.trigger.lower) ? w.line.attach().place() : (w.trigger = null, w.line.detach()), f = !1)
                            }, 30)
                        }
                    }), k.attachListener(t, "scroll", function() {
                        "wysiwyg" == a.mode && (w.line.detach(), A.webkit && (w.hiddenMode = 1, clearTimeout(d), d = setTimeout(function() {
                            w.mouseDown || (w.hiddenMode = 0)
                        }, 50)))
                    }), k.attachListener(B ? l : t, "mousedown", function() {
                        "wysiwyg" == a.mode && (w.line.detach(), w.hiddenMode = 1, w.mouseDown = 1)
                    }), k.attachListener(B ? l : t, "mouseup", function() {
                        w.hiddenMode = 0, w.mouseDown = 0
                    }), a.addCommand("accessPreviousSpace", i(w)), a.addCommand("accessNextSpace", i(w, !0)), a.setKeystroke([
                        [p.magicline_keystrokePrevious, "accessPreviousSpace"],
                        [p.magicline_keystrokeNext, "accessNextSpace"]
                    ]), a.on("loadSnapshot", function() {
                        var b, c, d, e;
                        for (e in {
                                p: 1,
                                br: 1,
                                div: 1
                            })
                            for (b = a.document.getElementsByTag(e), d = b.count(); d--;)
                                if ((c = b.getItem(d)).data("cke-magicline-hot")) return w.hotNode = c, void(w.lastCmdDirection = "true" === c.data("cke-magicline-dir") ? !0 : !1)
                    }), this.backdoor = {
                        accessFocusSpace: h,
                        boxTrigger: b,
                        isLine: j,
                        getAscendantTrigger: c,
                        getNonEmptyNeighbour: e,
                        getSize: s,
                        that: w,
                        triggerEdge: r,
                        triggerEditable: q,
                        triggerExpand: Y
                    })
                }, this)
            }
        });
        var x = CKEDITOR.tools.extend,
            y = CKEDITOR.dom.element,
            z = y.createFromHtml,
            A = CKEDITOR.env,
            B = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
            C = CKEDITOR.dtd,
            D = {},
            E = 128,
            F = 64,
            G = 32,
            H = 16,
            I = 8,
            J = 4,
            K = 2,
            L = 1,
            M = " ",
            N = C.$listItem,
            O = C.$tableContent,
            P = x({}, C.$nonEditable, C.$empty),
            Q = C.$block,
            R = 100,
            S = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
            T = S + "border-color:transparent;display:block;border-style:solid;",
            U = "<span>" + M + "</span>";
        D[CKEDITOR.ENTER_BR] = "br", D[CKEDITOR.ENTER_P] = "p", D[CKEDITOR.ENTER_DIV] = "div", b.prototype = {
            set: function(a, b, c) {
                return this.properties = a + b + (c || L), this
            },
            is: function(a) {
                return (this.properties & a) == a
            }
        };
        var V = function() {
                function a(a, b) {
                    var c = a.$.elementFromPoint(b.x, b.y);
                    return c && c.nodeType ? new CKEDITOR.dom.element(c) : null
                }
                return function(b, c, d) {
                    if (!b.mouse) return null;
                    var e = b.doc,
                        f = b.line.wrap,
                        d = d || b.mouse,
                        g = a(e, d);
                    return c && j(b, g) && (f.hide(), g = a(e, d), f.show()), !g || g.type != CKEDITOR.NODE_ELEMENT || !g.$ || A.ie && 9 > A.version && !b.boundary.equals(g) && !b.boundary.contains(g) ? null : g
                }
            }(),
            W = CKEDITOR.dom.walker.whitespaces(),
            X = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
            Y = function() {
                function b(b) {
                    var e, f, g, h = b.element;
                    if (!k(h) || h.contains(b.editable) || h.isReadOnly()) return null;
                    if (g = w(b, function(a, b) {
                            return !b.equals(a)
                        }, function(a, b) {
                            return V(a, !0, b)
                        }, h), e = g.upper, f = g.lower, a(b, e, f)) return g.set(G, I);
                    if (e && h.contains(e))
                        for (; !e.getParent().equals(h);) e = e.getParent();
                    else e = h.getFirst(function(a) {
                        return c(b, a)
                    });
                    if (f && h.contains(f))
                        for (; !f.getParent().equals(h);) f = f.getParent();
                    else f = h.getLast(function(a) {
                        return c(b, a)
                    });
                    if (!e || !f) return null;
                    if (t(b, e), t(b, f), !(b.mouse.y > e.size.top && b.mouse.y < f.size.bottom)) return null;
                    for (var i, j, l, m, h = Number.MAX_VALUE; f && !f.equals(e) && (j = e.getNext(b.isRelevant));) i = Math.abs(d(b, e, j) - b.mouse.y), h > i && (h = i, l = e, m = j), e = j, t(b, e);
                    return l && m && b.mouse.y > l.size.top && b.mouse.y < m.size.bottom ? (g.upper = l, g.lower = m, g.set(G, I)) : null
                }

                function c(a, b) {
                    return !(b && b.type == CKEDITOR.NODE_TEXT || X(b) || l(b) || j(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
                }
                return function(c) {
                    var d, e = b(c);
                    if (d = e) {
                        d = e.upper;
                        var f = e.lower;
                        d = !d || !f || l(f) || l(d) || f.equals(d) || d.equals(f) || f.contains(d) || d.contains(f) ? !1 : n(c, d) && n(c, f) && a(c, d, f) ? !0 : !1
                    }
                    return d ? e : null
                }
            }(),
            Z = ["top", "left", "right", "bottom"]
    }(), CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 51, CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 52, function() {
        function a(a) {
            if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) return [];
            for (var b = [], c = ["style", "className"], d = 0; d < c.length; d++) {
                var e = a.$.elements.namedItem(c[d]);
                e && (e = new CKEDITOR.dom.element(e), b.push([e, e.nextSibling]), e.remove())
            }
            return b
        }

        function b(a, b) {
            if (a && a.type == CKEDITOR.NODE_ELEMENT && "form" == a.getName() && 0 < b.length)
                for (var c = b.length - 1; c >= 0; c--) {
                    var d = b[c][0],
                        e = b[c][1];
                    e ? d.insertBefore(e) : d.appendTo(a)
                }
        }

        function c(c, d) {
            var e = a(c),
                f = {},
                g = c.$;
            return d || (f["class"] = g.className || "", g.className = ""), f.inline = g.style.cssText || "", d || (g.style.cssText = "position: static; overflow: visible"), b(e), f
        }

        function d(c, d) {
            var e = a(c),
                f = c.$;
            "class" in d && (f.className = d["class"]), "inline" in d && (f.style.cssText = d.inline), b(e)
        }

        function e(a) {
            if (!a.editable().isInline()) {
                var b, c = CKEDITOR.instances;
                for (b in c) {
                    var d = c[b];
                    "wysiwyg" == d.mode && !d.readOnly && (d = d.document.getBody(), d.setAttribute("contentEditable", !1), d.setAttribute("contentEditable", !0))
                }
                a.editable().hasFocus && (a.toolbox.focus(), a.focus())
            }
        }
        CKEDITOR.plugins.add("maximize", {
            init: function(a) {
                function b() {
                    var b = k.getViewPaneSize();
                    a.resize(b.width, b.height, null, !0)
                }
                if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                    var f, g, h, i = a.lang,
                        j = CKEDITOR.document,
                        k = j.getWindow(),
                        l = CKEDITOR.TRISTATE_OFF;
                    a.addCommand("maximize", {
                        modes: {
                            wysiwyg: !CKEDITOR.env.iOS,
                            source: !CKEDITOR.env.iOS
                        },
                        readOnly: 1,
                        editorFocus: !1,
                        exec: function() {
                            var m = a.container.getFirst(function(a) {
                                    return a.type == CKEDITOR.NODE_ELEMENT && a.hasClass("cke_inner")
                                }),
                                n = a.ui.space("contents");
                            if ("wysiwyg" == a.mode) {
                                var o = a.getSelection();
                                f = o && o.getRanges(), g = k.getScrollPosition()
                            } else {
                                var p = a.editable().$;
                                f = !CKEDITOR.env.ie && [p.selectionStart, p.selectionEnd], g = [p.scrollLeft, p.scrollTop]
                            }
                            if (this.state == CKEDITOR.TRISTATE_OFF) {
                                for (k.on("resize", b), h = k.getScrollPosition(), o = a.container; o = o.getParent();) o.setCustomData("maximize_saved_styles", c(o)), o.setStyle("z-index", a.config.baseFloatZIndex - 5);
                                n.setCustomData("maximize_saved_styles", c(n, !0)), m.setCustomData("maximize_saved_styles", c(m, !0)), n = {
                                    overflow: CKEDITOR.env.webkit ? "" : "hidden",
                                    width: 0,
                                    height: 0
                                }, j.getDocumentElement().setStyles(n), !CKEDITOR.env.gecko && j.getDocumentElement().setStyle("position", "fixed"), (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && j.getBody().setStyles(n), CKEDITOR.env.ie ? setTimeout(function() {
                                    k.$.scrollTo(0, 0)
                                }, 0) : k.$.scrollTo(0, 0), m.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute"), m.$.offsetLeft, m.setStyles({
                                    "z-index": a.config.baseFloatZIndex - 5,
                                    left: "0px",
                                    top: "0px"
                                }), m.addClass("cke_maximized"), b(), n = m.getDocumentPosition(), m.setStyles({
                                    left: -1 * n.x + "px",
                                    top: -1 * n.y + "px"
                                }), CKEDITOR.env.gecko && e(a)
                            } else if (this.state == CKEDITOR.TRISTATE_ON) {
                                for (k.removeListener("resize", b), n = [n, m], o = 0; o < n.length; o++) d(n[o], n[o].getCustomData("maximize_saved_styles")), n[o].removeCustomData("maximize_saved_styles");
                                for (o = a.container; o = o.getParent();) d(o, o.getCustomData("maximize_saved_styles")), o.removeCustomData("maximize_saved_styles");
                                CKEDITOR.env.ie ? setTimeout(function() {
                                        k.$.scrollTo(h.x, h.y)
                                    }, 0) : k.$.scrollTo(h.x, h.y), m.removeClass("cke_maximized"),
                                    CKEDITOR.env.webkit && (m.setStyle("display", "inline"), setTimeout(function() {
                                        m.setStyle("display", "block")
                                    }, 0)), a.fire("resize")
                            }
                            this.toggleState(), (o = this.uiItems[0]) && (n = this.state == CKEDITOR.TRISTATE_OFF ? i.maximize.maximize : i.maximize.minimize, o = CKEDITOR.document.getById(o._.id), o.getChild(1).setHtml(n), o.setAttribute("title", n), o.setAttribute("href", 'javascript:void("' + n + '");')), "wysiwyg" == a.mode ? f ? (CKEDITOR.env.gecko && e(a), a.getSelection().selectRanges(f), (p = a.getSelection().getStartElement()) && p.scrollIntoView(!0)) : k.$.scrollTo(g.x, g.y) : (f && (p.selectionStart = f[0], p.selectionEnd = f[1]), p.scrollLeft = g[0], p.scrollTop = g[1]), f = g = null, l = this.state, a.fire("maximize", this.state)
                        },
                        canUndo: !1
                    }), a.ui.addButton && a.ui.addButton("Maximize", {
                        label: i.maximize.maximize,
                        command: "maximize",
                        toolbar: "tools,10"
                    }), a.on("mode", function() {
                        var b = a.getCommand("maximize");
                        b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : l)
                    }, null, null, 100)
                }
            }
        })
    }(), function() {
        var a = {
            canUndo: !1,
            async: !0,
            exec: function(b) {
                b.getClipboardData({
                    title: b.lang.pastetext.title
                }, function(c) {
                    c && b.fire("paste", {
                        type: "text",
                        dataValue: c.dataValue
                    }), b.fire("afterCommandExec", {
                        name: "pastetext",
                        command: a,
                        returnValue: !!c
                    })
                })
            }
        };
        CKEDITOR.plugins.add("pastetext", {
            requires: "clipboard",
            init: function(b) {
                b.addCommand("pastetext", a), b.ui.addButton && b.ui.addButton("PasteText", {
                    label: b.lang.pastetext.button,
                    command: "pastetext",
                    toolbar: "clipboard,40"
                }), b.config.forcePasteAsPlainText && b.on("beforePaste", function(a) {
                    "html" != a.data.type && (a.data.type = "text")
                }), b.on("pasteState", function(a) {
                    b.getCommand("pastetext").setState(a.data)
                })
            }
        })
    }(), function() {
        function a(a, b, c) {
            var d = CKEDITOR.cleanWord;
            return d ? c() : (a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || b + "filter/default.js"), CKEDITOR.scriptLoader.load(a, c, null, !0)), !d
        }

        function b(a) {
            a.data.type = "html"
        }
        CKEDITOR.plugins.add("pastefromword", {
            requires: "clipboard",
            init: function(c) {
                var d = 0,
                    e = this.path;
                c.addCommand("pastefromword", {
                    canUndo: !1,
                    async: !0,
                    exec: function(a) {
                        var c = this;
                        d = 1, a.once("beforePaste", b), a.getClipboardData({
                            title: a.lang.pastefromword.title
                        }, function(b) {
                            b && a.fire("paste", {
                                type: "html",
                                dataValue: b.dataValue
                            }), a.fire("afterCommandExec", {
                                name: "pastefromword",
                                command: c,
                                returnValue: !!b
                            })
                        })
                    }
                }), c.ui.addButton && c.ui.addButton("PasteFromWord", {
                    label: c.lang.pastefromword.toolbar,
                    command: "pastefromword",
                    toolbar: "clipboard,50"
                }), c.on("pasteState", function(a) {
                    c.getCommand("pastefromword").setState(a.data)
                }), c.on("paste", function(b) {
                    var f = b.data,
                        g = f.dataValue;
                    if (g && (d || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(g))) {
                        var h = a(c, e, function() {
                            h ? c.fire("paste", f) : (!c.config.pasteFromWordPromptCleanup || d || confirm(c.lang.pastefromword.confirmCleanup)) && (f.dataValue = CKEDITOR.cleanWord(g, c))
                        });
                        h && b.cancel()
                    }
                }, null, null, 3)
            }
        })
    }(), CKEDITOR.plugins.add("removeformat", {
        init: function(a) {
            a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat), a.ui.addButton && a.ui.addButton("RemoveFormat", {
                label: a.lang.removeformat.toolbar,
                command: "removeFormat",
                toolbar: "cleanup,10"
            })
        }
    }), CKEDITOR.plugins.removeformat = {
        commands: {
            removeformat: {
                exec: function(a) {
                    for (var b, c = a._.removeFormatRegex || (a._.removeFormatRegex = RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")), d = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")), e = CKEDITOR.plugins.removeformat.filter, f = a.getSelection().getRanges(), g = f.createIterator(), h = function(a) {
                            return a.type == CKEDITOR.NODE_ELEMENT
                        }; b = g.getNextRange();) {
                        b.collapsed || b.enlarge(CKEDITOR.ENLARGE_ELEMENT);
                        var i = b.createBookmark(),
                            j = i.startNode,
                            k = i.endNode,
                            l = function(b) {
                                for (var d, f = a.elementPath(b), g = f.elements, h = 1;
                                    (d = g[h]) && !d.equals(f.block) && !d.equals(f.blockLimit); h++) c.test(d.getName()) && e(a, d) && b.breakParent(d)
                            };
                        if (l(j), k)
                            for (l(k), j = j.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT); j && !j.equals(k);)
                                if (j.isReadOnly()) {
                                    if (j.getPosition(k) & CKEDITOR.POSITION_CONTAINS) break;
                                    j = j.getNext(h)
                                } else l = j.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT), !("img" == j.getName() && j.data("cke-realelement")) && e(a, j) && (c.test(j.getName()) ? j.remove(1) : (j.removeAttributes(d), a.fire("removeFormatCleanup", j))), j = l;
                        b.moveToBookmark(i)
                    }
                    a.forceNextSelectionCheck(), a.getSelection().selectRanges(f)
                }
            }
        },
        filter: function(a, b) {
            for (var c = a._.removeFormatFilters || [], d = 0; d < c.length; d++)
                if (!1 === c[d](b)) return !1;
            return !0
        }
    }, CKEDITOR.editor.prototype.addRemoveFormatFilter = function(a) {
        this._.removeFormatFilters || (this._.removeFormatFilters = []), this._.removeFormatFilters.push(a)
    }, CKEDITOR.config.removeFormatTags = "b,big,cite,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var", CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign", function() {
        var a = {
            preserveState: !0,
            editorFocus: !1,
            readOnly: 1,
            exec: function(a) {
                this.toggleState(), this.refresh(a)
            },
            refresh: function(a) {
                if (a.document) {
                    var b = this.state == CKEDITOR.TRISTATE_ON ? "attachClass" : "removeClass";
                    a.editable()[b]("cke_show_borders")
                }
            }
        };
        CKEDITOR.plugins.add("showborders", {
            modes: {
                wysiwyg: 1
            },
            onLoad: function() {
                var a;
                a = (CKEDITOR.env.ie6Compat ? [".%1 table.%2,", ".%1 table.%2 td, .%1 table.%2 th", "{", "border : #d3d3d3 1px dotted", "}"] : ".%1 table.%2,;.%1 table.%2 > tr > td, .%1 table.%2 > tr > th,;.%1 table.%2 > tbody > tr > td, .%1 table.%2 > tbody > tr > th,;.%1 table.%2 > thead > tr > td, .%1 table.%2 > thead > tr > th,;.%1 table.%2 > tfoot > tr > td, .%1 table.%2 > tfoot > tr > th;{;border : #d3d3d3 1px dotted;}".split(";")).join("").replace(/%2/g, "cke_show_border").replace(/%1/g, "cke_show_borders "), CKEDITOR.addCss(a)
            },
            init: function(b) {
                var c = b.addCommand("showborders", a);
                c.canUndo = !1, !1 !== b.config.startupShowBorders && c.setState(CKEDITOR.TRISTATE_ON), b.on("mode", function() {
                    c.state != CKEDITOR.TRISTATE_DISABLED && c.refresh(b)
                }, null, null, 100), b.on("contentDom", function() {
                    c.state != CKEDITOR.TRISTATE_DISABLED && c.refresh(b)
                }), b.on("removeFormatCleanup", function(a) {
                    a = a.data, b.getCommand("showborders").state == CKEDITOR.TRISTATE_ON && a.is("table") && (!a.hasAttribute("border") || 0 >= parseInt(a.getAttribute("border"), 10)) && a.addClass("cke_show_border")
                })
            },
            afterInit: function(a) {
                var b = a.dataProcessor,
                    a = b && b.dataFilter,
                    b = b && b.htmlFilter;
                a && a.addRules({
                    elements: {
                        table: function(a) {
                            var a = a.attributes,
                                b = a["class"],
                                c = parseInt(a.border, 10);
                            c && !(0 >= c) || b && -1 != b.indexOf("cke_show_border") || (a["class"] = (b || "") + " cke_show_border")
                        }
                    }
                }), b && b.addRules({
                    elements: {
                        table: function(a) {
                            var a = a.attributes,
                                b = a["class"];
                            b && (a["class"] = b.replace("cke_show_border", "").replace(/\s{2}/, " ").replace(/^\s+|\s+$/, ""))
                        }
                    }
                })
            }
        }), CKEDITOR.on("dialogDefinition", function(a) {
            var b = a.data.name;
            ("table" == b || "tableProperties" == b) && (a = a.data.definition, b = a.getContents("info").get("txtBorder"), b.commit = CKEDITOR.tools.override(b.commit, function(a) {
                return function(b, c) {
                    a.apply(this, arguments);
                    var d = parseInt(this.getValue(), 10);
                    c[!d || 0 >= d ? "addClass" : "removeClass"]("cke_show_border")
                }
            }), (a = (a = a.getContents("advanced")) && a.get("advCSSClasses")) && (a.setup = CKEDITOR.tools.override(a.setup, function(a) {
                return function() {
                    a.apply(this, arguments), this.setValue(this.getValue().replace(/cke_show_border/, ""))
                }
            }), a.commit = CKEDITOR.tools.override(a.commit, function(a) {
                return function(b, c) {
                    a.apply(this, arguments), parseInt(c.getAttribute("border"), 10) || c.addClass("cke_show_border")
                }
            })))
        })
    }(), function() {
        CKEDITOR.plugins.add("sourcearea", {
            init: function(b) {
                function c() {
                    var a = e && this.equals(CKEDITOR.document.getActive());
                    this.hide(), this.setStyle("height", this.getParent().$.clientHeight + "px"), this.setStyle("width", this.getParent().$.clientWidth + "px"), this.show(), a && this.focus()
                }
                if (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                    var d = CKEDITOR.plugins.sourcearea;
                    b.addMode("source", function(d) {
                        var e = b.ui.space("contents").getDocument().createElement("textarea");
                        e.setStyles(CKEDITOR.tools.extend({
                            width: CKEDITOR.env.ie7Compat ? "99%" : "100%",
                            height: "100%",
                            resize: "none",
                            outline: "none",
                            "text-align": "left"
                        }, CKEDITOR.tools.cssVendorPrefix("tab-size", b.config.sourceAreaTabSize || 4))), e.setAttribute("dir", "ltr"), e.addClass("cke_source cke_reset cke_enable_context_menu"), b.ui.space("contents").append(e), e = b.editable(new a(b, e)), e.setData(b.getData(1)), CKEDITOR.env.ie && (e.attachListener(b, "resize", c, e), e.attachListener(CKEDITOR.document.getWindow(), "resize", c, e), CKEDITOR.tools.setTimeout(c, 0, e)), b.fire("ariaWidget", this), d()
                    }), b.addCommand("source", d.commands.source), b.ui.addButton && b.ui.addButton("Source", {
                        label: b.lang.sourcearea.toolbar,
                        command: "source",
                        toolbar: "mode,10"
                    }), b.on("mode", function() {
                        b.getCommand("source").setState("source" == b.mode ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                    });
                    var e = CKEDITOR.env.ie && 9 == CKEDITOR.env.version
                }
            }
        });
        var a = CKEDITOR.tools.createClass({
            base: CKEDITOR.editable,
            proto: {
                setData: function(a) {
                    this.setValue(a), this.status = "ready", this.editor.fire("dataReady")
                },
                getData: function() {
                    return this.getValue()
                },
                insertHtml: function() {},
                insertElement: function() {},
                insertText: function() {},
                setReadOnly: function(a) {
                    this[(a ? "set" : "remove") + "Attribute"]("readOnly", "readonly")
                },
                detach: function() {
                    a.baseProto.detach.call(this), this.clearCustomData(), this.remove()
                }
            }
        })
    }(), CKEDITOR.plugins.sourcearea = {
        commands: {
            source: {
                modes: {
                    wysiwyg: 1,
                    source: 1
                },
                editorFocus: !1,
                readOnly: 1,
                exec: function(a) {
                    "wysiwyg" == a.mode && a.fire("saveSnapshot"), a.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED), a.setMode("source" == a.mode ? "wysiwyg" : "source")
                },
                canUndo: !1
            }
        }
    }, CKEDITOR.plugins.add("specialchar", {
        availableLangs: {
            ar: 1,
            bg: 1,
            ca: 1,
            cs: 1,
            cy: 1,
            de: 1,
            el: 1,
            en: 1,
            "en-gb": 1,
            eo: 1,
            es: 1,
            et: 1,
            fa: 1,
            fi: 1,
            fr: 1,
            "fr-ca": 1,
            gl: 1,
            he: 1,
            hr: 1,
            hu: 1,
            id: 1,
            it: 1,
            ja: 1,
            km: 1,
            ku: 1,
            lv: 1,
            nb: 1,
            nl: 1,
            no: 1,
            pl: 1,
            pt: 1,
            "pt-br": 1,
            ru: 1,
            si: 1,
            sk: 1,
            sl: 1,
            sq: 1,
            sv: 1,
            th: 1,
            tr: 1,
            tt: 1,
            ug: 1,
            uk: 1,
            vi: 1,
            zh: 1,
            "zh-cn": 1
        },
        requires: "dialog",
        init: function(a) {
            var b = this;
            CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js"), a.addCommand("specialchar", {
                exec: function() {
                    var c = a.langCode,
                        c = b.availableLangs[c] ? c : b.availableLangs[c.replace(/-.*/, "")] ? c.replace(/-.*/, "") : "en";
                    CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(b.path + "dialogs/lang/" + c + ".js"), function() {
                        CKEDITOR.tools.extend(a.lang.specialchar, b.langEntries[c]), a.openDialog("specialchar")
                    })
                },
                modes: {
                    wysiwyg: 1
                },
                canUndo: !1
            }), a.ui.addButton && a.ui.addButton("SpecialChar", {
                label: a.lang.specialchar.toolbar,
                command: "specialchar",
                toolbar: "insert,50"
            })
        }
    }), CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" "), CKEDITOR.plugins.add("menubutton", {
        requires: "button,menu",
        onLoad: function() {
            var a = function(a) {
                var b = this._,
                    c = b.menu;
                b.state !== CKEDITOR.TRISTATE_DISABLED && (b.on && c ? c.hide() : (b.previousState = b.state, c || (c = b.menu = new CKEDITOR.menu(a, {
                    panel: {
                        className: "cke_menu_panel",
                        attributes: {
                            "aria-label": a.lang.common.options
                        }
                    }
                }), c.onHide = CKEDITOR.tools.bind(function() {
                    var c = this.command ? a.getCommand(this.command).modes : this.modes;
                    this.setState(!c || c[a.mode] ? b.previousState : CKEDITOR.TRISTATE_DISABLED), b.on = 0
                }, this), this.onMenu && c.addListener(this.onMenu)), this.setState(CKEDITOR.TRISTATE_ON), b.on = 1, setTimeout(function() {
                    c.show(CKEDITOR.document.getById(b.id), 4)
                }, 0)))
            };
            CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({
                base: CKEDITOR.ui.button,
                $: function(b) {
                    delete b.panel, this.base(b), this.hasArrow = !0, this.click = a
                },
                statics: {
                    handler: {
                        create: function(a) {
                            return new CKEDITOR.ui.menuButton(a)
                        }
                    }
                }
            })
        },
        beforeInit: function(a) {
            a.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler)
        }
    }), CKEDITOR.UI_MENUBUTTON = "menubutton", CKEDITOR.plugins.add("scayt", {
        requires: "menubutton,dialog",
        tabToOpen: null,
        dialogName: "scaytDialog",
        init: function(a) {
            var b = this,
                c = CKEDITOR.plugins.scayt;
            this.bindEvents(a), this.parseConfig(a), this.addRule(a), CKEDITOR.dialog.add(this.dialogName, CKEDITOR.getUrl(this.path + "dialogs/options.js")), this.addMenuItems(a);
            var d = a.lang.scayt,
                e = CKEDITOR.env;
            a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {
                label: d.text_title,
                title: d.text_title,
                modes: {
                    wysiwyg: !(e.ie && (8 > e.version || e.quirks))
                },
                toolbar: "spellchecker,20",
                refresh: function() {
                    var b = a.ui.instances.Scayt.getState();
                    a.scayt && (b = c.state[a.name] ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF), a.fire("scaytButtonState", b)
                },
                onRender: function() {
                    var b = this;
                    a.on("scaytButtonState", function(a) {
                        void 0 !== typeof a.data && b.setState(a.data)
                    })
                },
                onMenu: function() {
                    var b = a.scayt;
                    return a.getMenuItem("scaytToggle").label = a.lang.scayt[b && c.state[a.name] ? "btn_disable" : "btn_enable"], b = {
                        scaytToggle: CKEDITOR.TRISTATE_OFF,
                        scaytOptions: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                        scaytLangs: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                        scaytDict: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                        scaytAbout: b ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                        WSC: a.plugins.wsc ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                    }, a.config.scayt_uiTabs[0] || delete b.scaytOptions, a.config.scayt_uiTabs[1] || delete b.scaytLangs, a.config.scayt_uiTabs[2] || delete b.scaytDict, b
                }
            }), a.contextMenu && a.addMenuItems && (a.contextMenu.addListener(function() {
                var c, d = a.scayt;
                if (d) {
                    var e = d.getSelectionNode();
                    (e = e ? e.getAttribute(d.getNodeAttribute()) : e) && (c = b.menuGenerator(a, e, b), d.showBanner("." + a.contextMenu._.definition.panel.className.split(" ").join(" .")))
                }
                return c
            }), a.contextMenu._.onHide = CKEDITOR.tools.override(a.contextMenu._.onHide, function(b) {
                return function() {
                    var c = a.scayt;
                    return c && c.hideBanner(), b.apply(this)
                }
            }))
        },
        addMenuItems: function(a) {
            var b = this,
                c = CKEDITOR.plugins.scayt;
            a.addMenuGroup("scaytButton");
            var d = a.config.scayt_contextMenuItemsOrder.split("|");
            if (d && d.length)
                for (var e = 0; e < d.length; e++) a.addMenuGroup("scayt_" + d[e], e - 10);
            d = {
                scaytToggle: {
                    label: a.lang.scayt.btn_enable,
                    group: "scaytButton",
                    onClick: function() {
                        var b = a.scayt;
                        c.state[a.name] = !c.state[a.name], !0 === c.state[a.name] ? b || c.createScayt(a) : b && c.destroy(a)
                    }
                },
                scaytAbout: {
                    label: a.lang.scayt.btn_about,
                    group: "scaytButton",
                    onClick: function() {
                        a.scayt.tabToOpen = "about", a.lockSelection(), a.openDialog(b.dialogName)
                    }
                },
                scaytOptions: {
                    label: a.lang.scayt.btn_options,
                    group: "scaytButton",
                    onClick: function() {
                        a.scayt.tabToOpen = "options", a.lockSelection(), a.openDialog(b.dialogName)
                    }
                },
                scaytLangs: {
                    label: a.lang.scayt.btn_langs,
                    group: "scaytButton",
                    onClick: function() {
                        a.scayt.tabToOpen = "langs", a.lockSelection(), a.openDialog(b.dialogName)
                    }
                },
                scaytDict: {
                    label: a.lang.scayt.btn_dictionaries,
                    group: "scaytButton",
                    onClick: function() {
                        a.scayt.tabToOpen = "dictionaries", a.lockSelection(), a.openDialog(b.dialogName)
                    }
                }
            }, a.plugins.wsc && (d.WSC = {
                label: a.lang.wsc.toolbar,
                group: "scaytButton",
                onClick: function() {
                    var b = CKEDITOR.plugins.scayt,
                        c = a.scayt,
                        d = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
                    (d = d.replace(/\s/g, "")) ? (c && b.state[a.name] && c.setMarkupPaused && c.setMarkupPaused(!0), a.lockSelection(), a.execCommand("checkspell")) : alert("Nothing to check!")
                }
            }), a.addMenuItems(d)
        },
        bindEvents: function(a) {
            var b = CKEDITOR.plugins.scayt,
                c = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE;
            CKEDITOR.on("dialogDefinition", function(a) {
                "scaytDialog" === a.data.name && a.data.definition.dialog.on("cancel", function() {
                    return !1
                }, this, null, -1)
            });
            var d = function() {
                    a.scayt && b.destroy(a)
                },
                e = function() {
                    b.state[a.name] && !a.readOnly && b.createScayt(a)
                },
                f = function() {
                    c ? (a.on("blur", d), a.on("focus", e), a.focusManager.hasFocus && e()) : e()
                };
            a.on("contentDom", f), a.on("beforeCommandExec", function(c) {
                c.data.name in b.options.disablingCommandExec && "wysiwyg" == a.mode ? (c = a.scayt) && (b.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED)) : ("bold" === c.data.name || "italic" === c.data.name || "underline" === c.data.name || "strike" === c.data.name || "subscript" === c.data.name || "superscript" === c.data.name) && (c = a.scayt) && (c.removeMarkupInSelectionNode(), c.fire("startSpellCheck"))
            }), a.on("beforeSetMode", function(c) {
                "source" == c.data && (c = a.scayt) && (b.destroy(a), a.fire("scaytButtonState", CKEDITOR.TRISTATE_DISABLED))
            }), a.on("afterCommandExec", function(b) {
                var c;
                "wysiwyg" != a.mode || "undo" != b.data.name && "redo" != b.data.name || (c = a.scayt) && setTimeout(function() {
                    c.fire("startSpellCheck")
                }, 250)
            }), a.on("readOnly", function(c) {
                var d;
                c && (d = a.scayt, !0 === c.editor.readOnly ? d && d.fire("removeMarkupInDocument", {}) : d ? d.fire("startSpellCheck") : "wysiwyg" == c.editor.mode && !0 === b.state[c.editor.name] && (b.createScayt(a), c.editor.fire("scaytButtonState", CKEDITOR.TRISTATE_ON)))
            }), a.on("beforeDestroy", d), a.on("setData", function() {
                d(), a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE && f()
            }, this, null, 50), a.on("insertElement", function() {
                var b = a.scayt;
                b && (b.removeMarkupInSelectionNode(), b.fire("startSpellCheck"))
            }, this, null, 50), a.on("insertHtml", function() {
                var b = a.scayt;
                b && (b.removeMarkupInSelectionNode(), b.fire("startSpellCheck"))
            }, this, null, 50), a.on("scaytDialogShown", function(b) {
                b.data.selectPage(a.scayt.tabToOpen)
            })
        },
        parseConfig: function(a) {
            var b = CKEDITOR.plugins.scayt;
            if (b.replaceOldOptionsNames(a.config), "boolean" != typeof a.config.scayt_autoStartup && (a.config.scayt_autoStartup = !1), b.state[a.name] = a.config.scayt_autoStartup, a.config.scayt_contextCommands || (a.config.scayt_contextCommands = "ignore|ignoreall|add"), a.config.scayt_contextMenuItemsOrder || (a.config.scayt_contextMenuItemsOrder = "suggest|moresuggest|control"), a.config.scayt_sLang || (a.config.scayt_sLang = "en_US"), (void 0 === a.config.scayt_maxSuggestions || "number" != typeof a.config.scayt_maxSuggestions || 0 > a.config.scayt_maxSuggestions) && (a.config.scayt_maxSuggestions = 5), (void 0 === a.config.scayt_customDictionaryIds || "string" != typeof a.config.scayt_customDictionaryIds) && (a.config.scayt_customDictionaryIds = ""), (void 0 === a.config.scayt_userDictionaryName || "string" != typeof a.config.scayt_userDictionaryName) && (a.config.scayt_userDictionaryName = null), "string" == typeof a.config.scayt_uiTabs && 3 === a.config.scayt_uiTabs.split(",").length) {
                var c = [],
                    d = [];
                a.config.scayt_uiTabs = a.config.scayt_uiTabs.split(","), CKEDITOR.tools.search(a.config.scayt_uiTabs, function(a) {
                    1 === Number(a) || 0 === Number(a) ? (d.push(!0), c.push(Number(a))) : d.push(!1)
                }), a.config.scayt_uiTabs = null === CKEDITOR.tools.search(d, !1) ? c : [1, 1, 1]
            } else a.config.scayt_uiTabs = [1, 1, 1];
            "string" != typeof a.config.scayt_serviceProtocol && (a.config.scayt_serviceProtocol = null), "string" != typeof a.config.scayt_serviceHost && (a.config.scayt_serviceHost = null), "string" != typeof a.config.scayt_servicePort && (a.config.scayt_servicePort = null), "string" != typeof a.config.scayt_servicePath && (a.config.scayt_servicePath = null), a.config.scayt_moreSuggestions || (a.config.scayt_moreSuggestions = "on"), "string" != typeof a.config.scayt_customerId && (a.config.scayt_customerId = "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2"), "string" != typeof a.config.scayt_srcUrl && (b = document.location.protocol, b = -1 != b.search(/https?:/) ? b : "http:", a.config.scayt_srcUrl = b + "//svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/ckscayt.js"), "boolean" != typeof CKEDITOR.config.scayt_handleCheckDirty && (CKEDITOR.config.scayt_handleCheckDirty = !0), "boolean" != typeof CKEDITOR.config.scayt_handleUndoRedo && (CKEDITOR.config.scayt_handleUndoRedo = !0)
        },
        addRule: function(a) {
            var b = a.dataProcessor,
                c = b && b.htmlFilter,
                d = a._.elementsPath && a._.elementsPath.filters,
                b = b && b.dataFilter,
                e = a.addRemoveFormatFilter,
                f = function(b) {
                    var c = CKEDITOR.plugins.scayt;
                    return a.scayt && b.hasAttribute(c.options.data_attribute_name) ? !1 : void 0
                },
                g = function(b) {
                    var c = CKEDITOR.plugins.scayt,
                        d = !0;
                    return a.scayt && b.hasAttribute(c.options.data_attribute_name) && (d = !1), d
                };
            d && d.push(f), b && b.addRules({
                elements: {
                    span: function(b) {
                        var c = CKEDITOR.plugins.scayt;
                        return c && c.state[a.name] && b.classes && CKEDITOR.tools.search(b.classes, c.options.misspelled_word_class) && (b.classes && b.parent.type === CKEDITOR.NODE_DOCUMENT_FRAGMENT ? (delete b.attributes.style, delete b.name) : delete b.classes[CKEDITOR.tools.indexOf(b.classes, c.options.misspelled_word_class)]), b
                    }
                }
            }), c && c.addRules({
                elements: {
                    span: function(b) {
                        var c = CKEDITOR.plugins.scayt;
                        return c && c.state[a.name] && b.hasClass(c.options.misspelled_word_class) && b.attributes[c.options.data_attribute_name] && (b.removeClass(c.options.misspelled_word_class), delete b.attributes[c.options.data_attribute_name], delete b.name), b
                    }
                }
            }), e && e.call(a, g)
        },
        scaytMenuDefinition: function(a) {
            var b = this,
                a = a.scayt;
            return {
                scayt_ignore: {
                    label: a.getLocal("btn_ignore"),
                    group: "scayt_control",
                    order: 1,
                    exec: function(a) {
                        a.scayt.ignoreWord()
                    }
                },
                scayt_ignoreall: {
                    label: a.getLocal("btn_ignoreAll"),
                    group: "scayt_control",
                    order: 2,
                    exec: function(a) {
                        a.scayt.ignoreAllWords()
                    }
                },
                scayt_add: {
                    label: a.getLocal("btn_addWord"),
                    group: "scayt_control",
                    order: 3,
                    exec: function(a) {
                        var b = a.scayt;
                        setTimeout(function() {
                            b.addWordToUserDictionary()
                        }, 10)
                    }
                },
                option: {
                    label: a.getLocal("btn_options"),
                    group: "scayt_control",
                    order: 4,
                    exec: function(a) {
                        a.scayt.tabToOpen = "options", a.lockSelection(), a.openDialog(b.dialogName)
                    },
                    verification: function(a) {
                        return 1 == a.config.scayt_uiTabs[0] ? !0 : !1
                    }
                },
                language: {
                    label: a.getLocal("btn_langs"),
                    group: "scayt_control",
                    order: 5,
                    exec: function(a) {
                        a.scayt.tabToOpen = "langs", a.lockSelection(), a.openDialog(b.dialogName)
                    },
                    verification: function(a) {
                        return 1 == a.config.scayt_uiTabs[1] ? !0 : !1
                    }
                },
                dictionary: {
                    label: a.getLocal("btn_dictionaries"),
                    group: "scayt_control",
                    order: 6,
                    exec: function(a) {
                        a.scayt.tabToOpen = "dictionaries", a.lockSelection(), a.openDialog(b.dialogName)
                    },
                    verification: function(a) {
                        return 1 == a.config.scayt_uiTabs[2] ? !0 : !1
                    }
                },
                about: {
                    label: a.getLocal("btn_about"),
                    group: "scayt_control",
                    order: 7,
                    exec: function(a) {
                        a.scayt.tabToOpen = "about", a.lockSelection(), a.openDialog(b.dialogName)
                    }
                }
            }
        },
        buildSuggestionMenuItems: function(a, b) {
            var c = {},
                d = {},
                e = a.scayt;
            if (0 < b.length && "no_any_suggestions" !== b[0])
                for (var f = 0; f < b.length; f++) {
                    var g = "scayt_suggest_" + CKEDITOR.plugins.scayt.suggestions[f].replace(" ", "_");
                    a.addCommand(g, this.createCommand(CKEDITOR.plugins.scayt.suggestions[f])), f < a.config.scayt_maxSuggestions ? (a.addMenuItem(g, {
                        label: b[f],
                        command: g,
                        group: "scayt_suggest",
                        order: f + 1
                    }), c[g] = CKEDITOR.TRISTATE_OFF) : (a.addMenuItem(g, {
                        label: b[f],
                        command: g,
                        group: "scayt_moresuggest",
                        order: f + 1
                    }), d[g] = CKEDITOR.TRISTATE_OFF, "on" === a.config.scayt_moreSuggestions && (a.addMenuItem("scayt_moresuggest", {
                        label: e.getLocal("btn_moreSuggestions"),
                        group: "scayt_moresuggest",
                        order: 10,
                        getItems: function() {
                            return d
                        }
                    }), c.scayt_moresuggest = CKEDITOR.TRISTATE_OFF))
                } else c.no_scayt_suggest = CKEDITOR.TRISTATE_DISABLED, a.addCommand("no_scayt_suggest", {
                    exec: function() {}
                }), a.addMenuItem("no_scayt_suggest", {
                    label: e.getLocal("btn_noSuggestions") || "no_scayt_suggest",
                    command: "no_scayt_suggest",
                    group: "scayt_suggest",
                    order: 0
                });
            return c
        },
        menuGenerator: function(a, b) {
            var c = a.scayt,
                d = this.scaytMenuDefinition(a),
                e = {},
                f = a.config.scayt_contextCommands.split("|");
            if (c.fire("getSuggestionsList", {
                    lang: c.getLang(),
                    word: b
                }), e = this.buildSuggestionMenuItems(a, CKEDITOR.plugins.scayt.suggestions), "off" == a.config.scayt_contextCommands) return e;
            for (var g in d) - 1 == CKEDITOR.tools.indexOf(f, g.replace("scayt_", "")) && "all" != a.config.scayt_contextCommands || (e[g] = CKEDITOR.TRISTATE_OFF, "function" == typeof d[g].verification && !d[g].verification(a) && delete e[g], a.addCommand(g, {
                exec: d[g].exec
            }), a.addMenuItem(g, {
                label: a.lang.scayt[d[g].label] || d[g].label,
                command: g,
                group: d[g].group,
                order: d[g].order
            }));
            return e
        },
        createCommand: function(a) {
            return {
                exec: function(b) {
                    b.scayt.replaceSelectionNode({
                        word: a
                    })
                }
            }
        }
    }), CKEDITOR.plugins.scayt = {
        state: {},
        suggestions: [],
        loadingHelper: {
            loadOrder: []
        },
        isLoading: !1,
        options: {
            disablingCommandExec: {
                source: !0,
                newpage: !0,
                templates: !0
            },
            data_attribute_name: "data-scayt-word",
            misspelled_word_class: "scayt-misspell-word"
        },
        backCompatibilityMap: {
            scayt_service_protocol: "scayt_serviceProtocol",
            scayt_service_host: "scayt_serviceHost",
            scayt_service_port: "scayt_servicePort",
            scayt_service_path: "scayt_servicePath",
            scayt_customerid: "scayt_customerId"
        },
        replaceOldOptionsNames: function(a) {
            for (var b in a) b in this.backCompatibilityMap && (a[this.backCompatibilityMap[b]] = a[b], delete a[b])
        },
        createScayt: function(a) {
            var b = this;
            this.loadScaytLibrary(a, function(a) {
                var c = {
                    lang: a.config.scayt_sLang,
                    container: "BODY" == a.editable().$.nodeName ? a.document.getWindow().$.frameElement : a.editable().$,
                    customDictionary: a.config.scayt_customDictionaryIds,
                    userDictionaryName: a.config.scayt_userDictionaryName,
                    localization: a.langCode,
                    customer_id: a.config.scayt_customerId,
                    data_attribute_name: b.options.data_attribute_name,
                    misspelled_word_class: b.options.misspelled_word_class
                };
                a.config.scayt_serviceProtocol && (c.service_protocol = a.config.scayt_serviceProtocol), a.config.scayt_serviceHost && (c.service_host = a.config.scayt_serviceHost), a.config.scayt_servicePort && (c.service_port = a.config.scayt_servicePort), a.config.scayt_servicePath && (c.service_path = a.config.scayt_servicePath), c = new SCAYT.CKSCAYT(c, function() {}, function() {}), c.subscribe("suggestionListSend", function(a) {
                    for (var b = {}, c = [], d = 0; d < a.suggestionList.length; d++) b[a.suggestionList[d]] || (b[a.suggestionList[d]] = a.suggestionList[d], c.push(a.suggestionList[d]));
                    CKEDITOR.plugins.scayt.suggestions = c
                }), a.scayt = c, a.fire("scaytButtonState", a.readOnly ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_ON)
            })
        },
        destroy: function(a) {
            a.scayt && a.scayt.destroy(), delete a.scayt, a.fire("scaytButtonState", CKEDITOR.TRISTATE_OFF)
        },
        loadScaytLibrary: function(a, b) {
            var c = this;
            "undefined" == typeof window.SCAYT || "function" != typeof window.SCAYT.CKSCAYT ? (this.loadingHelper[a.name] = b, this.loadingHelper.loadOrder.push(a.name), CKEDITOR.scriptLoader.load(a.config.scayt_srcUrl, function() {
                var a;
                CKEDITOR.fireOnce("scaytReady");
                for (var b = 0; b < c.loadingHelper.loadOrder.length; b++) a = c.loadingHelper.loadOrder[b], "function" == typeof c.loadingHelper[a] && c.loadingHelper[a](CKEDITOR.instances[a]), delete c.loadingHelper[a];
                c.loadingHelper.loadOrder = []
            })) : window.SCAYT && "function" == typeof window.SCAYT.CKSCAYT && (CKEDITOR.fireOnce("scaytReady"), a.scayt || "function" == typeof b && b(a))
        }
    }, CKEDITOR.on("scaytReady", function() {
        if (!0 === CKEDITOR.config.scayt_handleCheckDirty) {
            var a = CKEDITOR.editor.prototype;
            a.checkDirty = CKEDITOR.tools.override(a.checkDirty, function(a) {
                return function() {
                    var b = null,
                        c = this.scayt;
                    if (CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state[this.name] && this.scayt) {
                        if (b = "ready" == this.status) var d = c.removeMarkupFromString(this.getSnapshot()),
                            c = c.removeMarkupFromString(this._.previousValue),
                            b = b && c !== d
                    } else b = a.call(this);
                    return b
                }
            }), a.resetDirty = CKEDITOR.tools.override(a.resetDirty, function(a) {
                return function() {
                    var b = this.scayt;
                    CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state[this.name] && this.scayt ? this._.previousValue = b.removeMarkupFromString(this.getSnapshot()) : a.call(this)
                }
            })
        }
        if (!0 === CKEDITOR.config.scayt_handleUndoRedo) {
            var a = CKEDITOR.plugins.undo.Image.prototype,
                b = "function" == typeof a.equalsContent ? "equalsContent" : "equals";
            a[b] = CKEDITOR.tools.override(a[b], function(a) {
                return function(b) {
                    var c = b.editor.scayt,
                        d = this.contents,
                        e = b.contents,
                        f = null;
                    return CKEDITOR.plugins.scayt && CKEDITOR.plugins.scayt.state[b.editor.name] && b.editor.scayt && (this.contents = c.removeMarkupFromString(d) || "", b.contents = c.removeMarkupFromString(e) || ""), f = a.apply(this, arguments), this.contents = d, b.contents = e, f
                }
            })
        }
    }), function() {
        CKEDITOR.plugins.add("stylescombo", {
            requires: "richcombo",
            init: function(a) {
                var b = a.config,
                    c = a.lang.stylescombo,
                    d = {},
                    e = [],
                    f = [];
                a.on("stylesSet", function(c) {
                    if (c = c.data.styles) {
                        for (var g, h, i, j = 0, k = c.length; k > j; j++) g = c[j], a.blockless && g.element in CKEDITOR.dtd.$block || (h = g.name, g = new CKEDITOR.style(g), a.filter.customConfig && !a.filter.check(g)) || (g._name = h, g._.enterMode = b.enterMode, g._.type = i = g.assignedTo || g.type, g._.weight = j + 1e3 * (i == CKEDITOR.STYLE_OBJECT ? 1 : i == CKEDITOR.STYLE_BLOCK ? 2 : 3), d[h] = g, e.push(g), f.push(g));
                        e.sort(function(a, b) {
                            return a._.weight - b._.weight
                        })
                    }
                }), a.ui.addRichCombo("Styles", {
                    label: c.label,
                    title: c.panelTitle,
                    toolbar: "styles,10",
                    allowedContent: f,
                    panel: {
                        css: [CKEDITOR.skin.getPath("editor")].concat(b.contentsCss),
                        multiSelect: !0,
                        attributes: {
                            "aria-label": c.panelTitle
                        }
                    },
                    init: function() {
                        var a, b, d, f, g, h;
                        for (g = 0, h = e.length; h > g; g++) a = e[g], b = a._name, f = a._.type, f != d && (this.startGroup(c["panelTitle" + f]), d = f), this.add(b, a.type == CKEDITOR.STYLE_OBJECT ? b : a.buildPreview(), b);
                        this.commit()
                    },
                    onClick: function(b) {
                        a.focus(), a.fire("saveSnapshot");
                        var b = d[b],
                            c = a.elementPath();
                        a[b.checkActive(c, a) ? "removeStyle" : "applyStyle"](b), a.fire("saveSnapshot")
                    },
                    onRender: function() {
                        a.on("selectionChange", function(b) {
                            for (var c, e = this.getValue(), b = b.data.path.elements, f = 0, g = b.length; g > f; f++) {
                                c = b[f];
                                for (var h in d)
                                    if (d[h].checkElementRemovable(c, !0, a)) return void(h != e && this.setValue(h))
                            }
                            this.setValue("")
                        }, this)
                    },
                    onOpen: function() {
                        var b = a.getSelection().getSelectedElement(),
                            b = a.elementPath(b),
                            e = [0, 0, 0, 0];
                        this.showAll(), this.unmarkAll();
                        for (var f in d) {
                            var g = d[f],
                                h = g._.type;
                            g.checkApplicable(b, a, a.activeFilter) ? e[h]++ : this.hideItem(f), g.checkActive(b, a) && this.mark(f)
                        }
                        e[CKEDITOR.STYLE_BLOCK] || this.hideGroup(c["panelTitle" + CKEDITOR.STYLE_BLOCK]), e[CKEDITOR.STYLE_INLINE] || this.hideGroup(c["panelTitle" + CKEDITOR.STYLE_INLINE]), e[CKEDITOR.STYLE_OBJECT] || this.hideGroup(c["panelTitle" + CKEDITOR.STYLE_OBJECT])
                    },
                    refresh: function() {
                        var b = a.elementPath();
                        if (b) {
                            for (var c in d)
                                if (d[c].checkApplicable(b, a, a.activeFilter)) return;
                            this.setState(CKEDITOR.TRISTATE_DISABLED)
                        }
                    },
                    reset: function() {
                        d = {}, e = []
                    }
                })
            }
        })
    }(), function() {
        function a(a) {
            return {
                editorFocus: !1,
                canUndo: !1,
                modes: {
                    wysiwyg: 1
                },
                exec: function(b) {
                    if (b.editable().hasFocus) {
                        var c, d = b.getSelection();
                        if (c = new CKEDITOR.dom.elementPath(d.getCommonAncestor(), d.root).contains({
                                td: 1,
                                th: 1
                            }, 1)) {
                            var d = b.createRange(),
                                e = CKEDITOR.tools.tryThese(function() {
                                    var b = c.getParent().$.cells[c.$.cellIndex + (a ? -1 : 1)];
                                    return b.parentNode.parentNode, b
                                }, function() {
                                    var b = c.getParent(),
                                        b = b.getAscendant("table").$.rows[b.$.rowIndex + (a ? -1 : 1)];
                                    return b.cells[a ? b.cells.length - 1 : 0]
                                });
                            if (e || a) {
                                if (!e) return !0;
                                e = new CKEDITOR.dom.element(e), d.moveToElementEditStart(e), (!d.checkStartOfBlock() || !d.checkEndOfBlock()) && d.selectNodeContents(e)
                            } else {
                                for (var f = c.getAscendant("table").$, e = c.getParent().$.cells, f = new CKEDITOR.dom.element(f.insertRow(-1), b.document), g = 0, h = e.length; h > g; g++) f.append(new CKEDITOR.dom.element(e[g], b.document).clone(!1, !1)).appendBogus();
                                d.moveToElementEditStart(f)
                            }
                            return d.select(!0), !0
                        }
                    }
                    return !1
                }
            }
        }
        var b = {
                editorFocus: !1,
                modes: {
                    wysiwyg: 1,
                    source: 1
                }
            },
            c = {
                exec: function(a) {
                    a.container.focusNext(!0, a.tabIndex)
                }
            },
            d = {
                exec: function(a) {
                    a.container.focusPrevious(!0, a.tabIndex)
                }
            };
        CKEDITOR.plugins.add("tab", {
            init: function(e) {
                for (var f = !1 !== e.config.enableTabKeyTools, g = e.config.tabSpaces || 0, h = ""; g--;) h += " ";
                h && e.on("key", function(a) {
                    9 == a.data.keyCode && (e.insertHtml(h), a.cancel())
                }), f && e.on("key", function(a) {
                    (9 == a.data.keyCode && e.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && e.execCommand("selectPreviousCell")) && a.cancel()
                }), e.addCommand("blur", CKEDITOR.tools.extend(c, b)), e.addCommand("blurBack", CKEDITOR.tools.extend(d, b)), e.addCommand("selectNextCell", a()), e.addCommand("selectPreviousCell", a(!0))
            }
        })
    }(), CKEDITOR.dom.element.prototype.focusNext = function(a, b) {
        var c, d, e, f, g, h, i = void 0 === b ? this.getTabIndex() : b;
        if (0 >= i)
            for (g = this.getNextSourceNode(a, CKEDITOR.NODE_ELEMENT); g;) {
                if (g.isVisible() && 0 === g.getTabIndex()) {
                    e = g;
                    break
                }
                g = g.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT)
            } else
                for (g = this.getDocument().getBody().getFirst(); g = g.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
                    if (!c)
                        if (!d && g.equals(this)) {
                            if (d = !0, a) {
                                if (!(g = g.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
                                c = 1
                            }
                        } else d && !this.contains(g) && (c = 1);
                    if (g.isVisible() && !(0 > (h = g.getTabIndex()))) {
                        if (c && h == i) {
                            e = g;
                            break
                        }
                        h > i && (!e || !f || f > h) ? (e = g, f = h) : !e && 0 === h && (e = g, f = h)
                    }
                }
        e && e.focus()
    }, CKEDITOR.dom.element.prototype.focusPrevious = function(a, b) {
        for (var c, d, e, f, g = void 0 === b ? this.getTabIndex() : b, h = 0, i = this.getDocument().getBody().getLast(); i = i.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
            if (!c)
                if (!d && i.equals(this)) {
                    if (d = !0, a) {
                        if (!(i = i.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT))) break;
                        c = 1
                    }
                } else d && !this.contains(i) && (c = 1);
            if (i.isVisible() && !(0 > (f = i.getTabIndex())))
                if (0 >= g) {
                    if (c && 0 === f) {
                        e = i;
                        break
                    }
                    f > h && (e = i, h = f)
                } else {
                    if (c && f == g) {
                        e = i;
                        break
                    }
                    g > f && (!e || f > h) && (e = i, h = f)
                }
        }
        e && e.focus()
    }, CKEDITOR.plugins.add("table", {
        requires: "dialog",
        init: function(a) {
            function b(a) {
                return CKEDITOR.tools.extend(a || {}, {
                    contextSensitive: 1,
                    refresh: function(a, b) {
                        this.setState(b.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                    }
                })
            }
            if (!a.blockless) {
                var c = a.lang.table;
                a.addCommand("table", new CKEDITOR.dialogCommand("table", {
                    context: "table",
                    allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" + (a.plugins.dialogadvtab ? "table" + a.plugins.dialogadvtab.allowedContent() : ""),
                    requiredContent: "table",
                    contentTransformations: [
                        ["table{width}: sizeToStyle", "table[width]: sizeToAttribute"]
                    ]
                })), a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", b())), a.addCommand("tableDelete", b({
                    exec: function(a) {
                        var b = a.elementPath().contains("table", 1);
                        if (b) {
                            var c = b.getParent(),
                                d = a.editable();
                            1 == c.getChildCount() && !c.is("td", "th") && !c.equals(d) && (b = c), a = a.createRange(), a.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START), b.remove(), a.select()
                        }
                    }
                })), a.ui.addButton && a.ui.addButton("Table", {
                    label: c.toolbar,
                    command: "table",
                    toolbar: "insert,30"
                }), CKEDITOR.dialog.add("table", this.path + "dialogs/table.js"), CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js"), a.addMenuItems && a.addMenuItems({
                    table: {
                        label: c.menu,
                        command: "tableProperties",
                        group: "table",
                        order: 5
                    },
                    tabledelete: {
                        label: c.deleteTable,
                        command: "tableDelete",
                        group: "table",
                        order: 1
                    }
                }), a.on("doubleclick", function(a) {
                    a.data.element.is("table") && (a.data.dialog = "tableProperties")
                }), a.contextMenu && a.contextMenu.addListener(function() {
                    return {
                        tabledelete: CKEDITOR.TRISTATE_OFF,
                        table: CKEDITOR.TRISTATE_OFF
                    }
                })
            }
        }
    }), function() {
        function a(a) {
            function b(a) {
                !(0 < c.length) && a.type == CKEDITOR.NODE_ELEMENT && m.test(a.getName()) && !a.getCustomData("selected_cell") && (CKEDITOR.dom.element.setMarker(d, a, "selected_cell", !0), c.push(a))
            }
            for (var a = a.getRanges(), c = [], d = {}, e = 0; e < a.length; e++) {
                var f = a[e];
                if (f.collapsed) f = f.getCommonAncestor(), (f = f.getAscendant("td", !0) || f.getAscendant("th", !0)) && c.push(f);
                else {
                    var g, f = new CKEDITOR.dom.walker(f);
                    for (f.guard = b; g = f.next();) g.type == CKEDITOR.NODE_ELEMENT && g.is(CKEDITOR.dtd.table) || (g = g.getAscendant("td", !0) || g.getAscendant("th", !0)) && !g.getCustomData("selected_cell") && (CKEDITOR.dom.element.setMarker(d, g, "selected_cell", !0), c.push(g))
                }
            }
            return CKEDITOR.dom.element.clearAllMarkers(d), c
        }

        function b(b, c) {
            for (var d = a(b), e = d[0], f = e.getAscendant("table"), e = e.getDocument(), g = d[0].getParent(), h = g.$.rowIndex, d = d[d.length - 1], i = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = new CKEDITOR.dom.element(f.$.rows[i]), h = c ? h : i, g = c ? g : d, d = CKEDITOR.tools.buildTableMap(f), f = d[h], h = c ? d[h - 1] : d[h + 1], d = d[0].length, e = e.createElement("tr"), i = 0; f[i] && d > i; i++) {
                var j;
                1 < f[i].rowSpan && h && f[i] == h[i] ? (j = f[i], j.rowSpan += 1) : (j = new CKEDITOR.dom.element(f[i]).clone(), j.removeAttribute("rowSpan"), j.appendBogus(), e.append(j), j = j.$), i += j.colSpan - 1
            }
            c ? e.insertBefore(g) : e.insertAfter(g)
        }

        function c(b) {
            if (b instanceof CKEDITOR.dom.selection) {
                for (var d = a(b), e = d[0].getAscendant("table"), f = CKEDITOR.tools.buildTableMap(e), b = d[0].getParent().$.rowIndex, d = d[d.length - 1], g = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [], h = b; g >= h; h++) {
                    for (var i = f[h], j = new CKEDITOR.dom.element(e.$.rows[h]), k = 0; k < i.length; k++) {
                        var l = new CKEDITOR.dom.element(i[k]),
                            m = l.getParent().$.rowIndex;
                        1 == l.$.rowSpan ? l.remove() : (l.$.rowSpan -= 1, m == h && (m = f[h + 1], m[k - 1] ? l.insertAfter(new CKEDITOR.dom.element(m[k - 1])) : new CKEDITOR.dom.element(e.$.rows[h + 1]).append(l, 1))), k += l.$.colSpan - 1
                    }
                    d.push(j)
                }
                for (f = e.$.rows, e = new CKEDITOR.dom.element(f[g + 1] || (b > 0 ? f[b - 1] : null) || e.$.parentNode), h = d.length; h >= 0; h--) c(d[h]);
                return e
            }
            return b instanceof CKEDITOR.dom.element && (e = b.getAscendant("table"), 1 == e.$.rows.length ? e.remove() : b.remove()), null
        }

        function d(a, b) {
            for (var c = b ? 1 / 0 : 0, d = 0; d < a.length; d++) {
                var e;
                e = a[d];
                for (var f = b, g = e.getParent().$.cells, h = 0, i = 0; i < g.length; i++) {
                    var j = g[i],
                        h = h + (f ? 1 : j.colSpan);
                    if (j == e.$) break
                }
                e = h - 1, (b ? c > e : e > c) && (c = e)
            }
            return c
        }

        function e(b, c) {
            for (var e = a(b), f = e[0].getAscendant("table"), g = d(e, 1), e = d(e), g = c ? g : e, h = CKEDITOR.tools.buildTableMap(f), f = [], e = [], i = h.length, j = 0; i > j; j++) f.push(h[j][g]), e.push(c ? h[j][g - 1] : h[j][g + 1]);
            for (j = 0; i > j; j++) f[j] && (1 < f[j].colSpan && e[j] == f[j] ? (g = f[j], g.colSpan += 1) : (g = new CKEDITOR.dom.element(f[j]).clone(), g.removeAttribute("colSpan"), g.appendBogus(), g[c ? "insertBefore" : "insertAfter"].call(g, new CKEDITOR.dom.element(f[j])), g = g.$), j += g.rowSpan - 1)
        }

        function f(a, b) {
            var c = a.getStartElement();
            if (c = c.getAscendant("td", 1) || c.getAscendant("th", 1)) {
                var d = c.clone();
                d.appendBogus(), b ? d.insertBefore(c) : d.insertAfter(c)
            }
        }

        function g(b) {
            if (b instanceof CKEDITOR.dom.selection) {
                var c, b = a(b),
                    d = b[0] && b[0].getAscendant("table");
                a: {
                    var e = 0;
                    c = b.length - 1;
                    for (var f, i, j = {}; f = b[e++];) CKEDITOR.dom.element.setMarker(j, f, "delete_cell", !0);
                    for (e = 0; f = b[e++];)
                        if ((i = f.getPrevious()) && !i.getCustomData("delete_cell") || (i = f.getNext()) && !i.getCustomData("delete_cell")) {
                            CKEDITOR.dom.element.clearAllMarkers(j), c = i;
                            break a
                        }
                    CKEDITOR.dom.element.clearAllMarkers(j), i = b[0].getParent(), (i = i.getPrevious()) ? c = i.getLast() : (i = b[c].getParent(), c = (i = i.getNext()) ? i.getChild(0) : null)
                }
                for (i = b.length - 1; i >= 0; i--) g(b[i]);
                c ? h(c, !0) : d && d.remove()
            } else b instanceof CKEDITOR.dom.element && (d = b.getParent(), 1 == d.getChildCount() ? d.remove() : b.remove())
        }

        function h(a, b) {
            var c = a.getDocument(),
                d = CKEDITOR.document;
            CKEDITOR.env.ie && 10 == CKEDITOR.env.version && (d.focus(), c.focus()), c = new CKEDITOR.dom.range(c), c["moveToElementEdit" + (b ? "End" : "Start")](a) || (c.selectNodeContents(a), c.collapse(b ? !1 : !0)), c.select(!0)
        }

        function i(a, b, c) {
            if (a = a[b], "undefined" == typeof c) return a;
            for (b = 0; a && b < a.length; b++) {
                if (c.is && a[b] == c.$) return b;
                if (b == c) return new CKEDITOR.dom.element(a[b])
            }
            return c.is ? -1 : null
        }

        function j(b, c, d) {
            var e, f = a(b);
            if ((c ? 1 != f.length : 2 > f.length) || (e = b.getCommonAncestor()) && e.type == CKEDITOR.NODE_ELEMENT && e.is("table")) return !1;
            var g, b = f[0];
            e = b.getAscendant("table");
            var h = CKEDITOR.tools.buildTableMap(e),
                j = h.length,
                k = h[0].length,
                l = b.getParent().$.rowIndex,
                m = i(h, l, b);
            if (c) {
                var n;
                try {
                    var o = parseInt(b.getAttribute("rowspan"), 10) || 1;
                    g = parseInt(b.getAttribute("colspan"), 10) || 1, n = h["up" == c ? l - o : "down" == c ? l + o : l]["left" == c ? m - g : "right" == c ? m + g : m]
                } catch (p) {
                    return !1
                }
                if (!n || b.$ == n) return !1;
                f["up" == c || "left" == c ? "unshift" : "push"](new CKEDITOR.dom.element(n))
            }
            for (var c = b.getDocument(), q = l, o = n = 0, r = !d && new CKEDITOR.dom.documentFragment(c), s = 0, c = 0; c < f.length; c++) {
                g = f[c];
                var t = g.getParent(),
                    u = g.getFirst(),
                    v = g.$.colSpan,
                    w = g.$.rowSpan,
                    t = t.$.rowIndex,
                    x = i(h, t, g),
                    s = s + v * w,
                    o = Math.max(o, x - m + v);
                n = Math.max(n, t - l + w), d || (v = g, (w = v.getBogus()) && w.remove(), v.trim(), g.getChildren().count() && (t == q || !u || u.isBlockBoundary && u.isBlockBoundary({
                    br: 1
                }) || (q = r.getLast(CKEDITOR.dom.walker.whitespaces(!0))) && (!q.is || !q.is("br")) && r.append("br"), g.moveChildren(r)), c ? g.remove() : g.setHtml("")), q = t
            }
            if (d) return n * o == s;
            for (r.moveChildren(b), b.appendBogus(), o >= k ? b.removeAttribute("rowSpan") : b.$.rowSpan = n, n >= j ? b.removeAttribute("colSpan") : b.$.colSpan = o, d = new CKEDITOR.dom.nodeList(e.$.rows), f = d.count(), c = f - 1; c >= 0; c--) e = d.getItem(c), e.$.cells.length || (e.remove(), f++);
            return b
        }

        function k(b, c) {
            var d = a(b);
            if (1 < d.length) return !1;
            if (c) return !0;
            var e, d = d[0],
                f = d.getParent(),
                g = f.getAscendant("table"),
                h = CKEDITOR.tools.buildTableMap(g),
                j = f.$.rowIndex,
                k = i(h, j, d),
                l = d.$.rowSpan;
            if (l > 1) {
                e = Math.ceil(l / 2);
                for (var m, l = Math.floor(l / 2), f = j + e, g = new CKEDITOR.dom.element(g.$.rows[f]), h = i(h, f), f = d.clone(), j = 0; j < h.length; j++) {
                    if (m = h[j], m.parentNode == g.$ && j > k) {
                        f.insertBefore(new CKEDITOR.dom.element(m));
                        break
                    }
                    m = null
                }
                m || g.append(f)
            } else
                for (l = e = 1, g = f.clone(), g.insertAfter(f), g.append(f = d.clone()), m = i(h, j), k = 0; k < m.length; k++) m[k].rowSpan++;
            return f.appendBogus(), d.$.rowSpan = e, f.$.rowSpan = l, 1 == e && d.removeAttribute("rowSpan"), 1 == l && f.removeAttribute("rowSpan"), f
        }

        function l(b, c) {
            var d = a(b);
            if (1 < d.length) return !1;
            if (c) return !0;
            var d = d[0],
                e = d.getParent(),
                f = e.getAscendant("table"),
                f = CKEDITOR.tools.buildTableMap(f),
                g = i(f, e.$.rowIndex, d),
                h = d.$.colSpan;
            if (h > 1) e = Math.ceil(h / 2), h = Math.floor(h / 2);
            else {
                for (var h = e = 1, j = [], k = 0; k < f.length; k++) {
                    var l = f[k];
                    j.push(l[g]), 1 < l[g].rowSpan && (k += l[g].rowSpan - 1)
                }
                for (f = 0; f < j.length; f++) j[f].colSpan++
            }
            return f = d.clone(), f.insertAfter(d), f.appendBogus(), d.$.colSpan = e, f.$.colSpan = h, 1 == e && d.removeAttribute("colSpan"), 1 == h && f.removeAttribute("colSpan"), f
        }
        var m = /^(?:td|th)$/;
        CKEDITOR.plugins.tabletools = {
            requires: "table,dialog,contextmenu",
            init: function(d) {
                function i(a) {
                    return CKEDITOR.tools.extend(a || {}, {
                        contextSensitive: 1,
                        refresh: function(a, b) {
                            this.setState(b.contains({
                                td: 1,
                                th: 1
                            }, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                        }
                    })
                }

                function m(a, b) {
                    var c = d.addCommand(a, b);
                    d.addFeature(c)
                }
                var n = d.lang.table;
                m("cellProperties", new CKEDITOR.dialogCommand("cellProperties", i({
                    allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
                    requiredContent: "table"
                }))), CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js"), m("rowDelete", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), h(c(a))
                    }
                })), m("rowInsertBefore", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), b(a, !0)
                    }
                })), m("rowInsertAfter", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), b(a)
                    }
                })), m("columnDelete", i({
                    requiredContent: "table",
                    exec: function(b) {
                        for (var c, d, b = b.getSelection(), b = a(b), e = b[0], f = b[b.length - 1], b = e.getAscendant("table"), g = CKEDITOR.tools.buildTableMap(b), i = [], j = 0, k = g.length; k > j; j++)
                            for (var l = 0, m = g[j].length; m > l; l++) g[j][l] == e.$ && (c = l), g[j][l] == f.$ && (d = l);
                        for (j = c; d >= j; j++)
                            for (l = 0; l < g.length; l++) f = g[l], e = new CKEDITOR.dom.element(b.$.rows[l]), f = new CKEDITOR.dom.element(f[j]), f.$ && (1 == f.$.colSpan ? f.remove() : f.$.colSpan -= 1, l += f.$.rowSpan - 1, e.$.cells.length || i.push(e));
                        d = b.$.rows[0] && b.$.rows[0].cells, c = new CKEDITOR.dom.element(d[c] || (c ? d[c - 1] : b.$.parentNode)), i.length == k && b.remove(), c && h(c, !0)
                    }
                })), m("columnInsertBefore", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), e(a, !0)
                    }
                })), m("columnInsertAfter", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), e(a)
                    }
                })), m("cellDelete", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), g(a)
                    }
                })), m("cellMerge", i({
                    allowedContent: "td[colspan,rowspan]",
                    requiredContent: "td[colspan,rowspan]",
                    exec: function(a) {
                        h(j(a.getSelection()), !0)
                    }
                })), m("cellMergeRight", i({
                    allowedContent: "td[colspan]",
                    requiredContent: "td[colspan]",
                    exec: function(a) {
                        h(j(a.getSelection(), "right"), !0)
                    }
                })), m("cellMergeDown", i({
                    allowedContent: "td[rowspan]",
                    requiredContent: "td[rowspan]",
                    exec: function(a) {
                        h(j(a.getSelection(), "down"), !0)
                    }
                })), m("cellVerticalSplit", i({
                    allowedContent: "td[rowspan]",
                    requiredContent: "td[rowspan]",
                    exec: function(a) {
                        h(k(a.getSelection()))
                    }
                })), m("cellHorizontalSplit", i({
                    allowedContent: "td[colspan]",
                    requiredContent: "td[colspan]",
                    exec: function(a) {
                        h(l(a.getSelection()))
                    }
                })), m("cellInsertBefore", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), f(a, !0)
                    }
                })), m("cellInsertAfter", i({
                    requiredContent: "table",
                    exec: function(a) {
                        a = a.getSelection(), f(a)
                    }
                })), d.addMenuItems && d.addMenuItems({
                    tablecell: {
                        label: n.cell.menu,
                        group: "tablecell",
                        order: 1,
                        getItems: function() {
                            var b = d.getSelection(),
                                c = a(b);
                            return {
                                tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablecell_delete: CKEDITOR.TRISTATE_OFF,
                                tablecell_merge: j(b, null, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_merge_right: j(b, "right", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_merge_down: j(b, "down", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_split_vertical: k(b, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_split_horizontal: l(b, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_properties: 0 < c.length ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            }
                        }
                    },
                    tablecell_insertBefore: {
                        label: n.cell.insertBefore,
                        group: "tablecell",
                        command: "cellInsertBefore",
                        order: 5
                    },
                    tablecell_insertAfter: {
                        label: n.cell.insertAfter,
                        group: "tablecell",
                        command: "cellInsertAfter",
                        order: 10
                    },
                    tablecell_delete: {
                        label: n.cell.deleteCell,
                        group: "tablecell",
                        command: "cellDelete",
                        order: 15
                    },
                    tablecell_merge: {
                        label: n.cell.merge,
                        group: "tablecell",
                        command: "cellMerge",
                        order: 16
                    },
                    tablecell_merge_right: {
                        label: n.cell.mergeRight,
                        group: "tablecell",
                        command: "cellMergeRight",
                        order: 17
                    },
                    tablecell_merge_down: {
                        label: n.cell.mergeDown,
                        group: "tablecell",
                        command: "cellMergeDown",
                        order: 18
                    },
                    tablecell_split_horizontal: {
                        label: n.cell.splitHorizontal,
                        group: "tablecell",
                        command: "cellHorizontalSplit",
                        order: 19
                    },
                    tablecell_split_vertical: {
                        label: n.cell.splitVertical,
                        group: "tablecell",
                        command: "cellVerticalSplit",
                        order: 20
                    },
                    tablecell_properties: {
                        label: n.cell.title,
                        group: "tablecellproperties",
                        command: "cellProperties",
                        order: 21
                    },
                    tablerow: {
                        label: n.row.menu,
                        group: "tablerow",
                        order: 1,
                        getItems: function() {
                            return {
                                tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablerow_delete: CKEDITOR.TRISTATE_OFF
                            }
                        }
                    },
                    tablerow_insertBefore: {
                        label: n.row.insertBefore,
                        group: "tablerow",
                        command: "rowInsertBefore",
                        order: 5
                    },
                    tablerow_insertAfter: {
                        label: n.row.insertAfter,
                        group: "tablerow",
                        command: "rowInsertAfter",
                        order: 10
                    },
                    tablerow_delete: {
                        label: n.row.deleteRow,
                        group: "tablerow",
                        command: "rowDelete",
                        order: 15
                    },
                    tablecolumn: {
                        label: n.column.menu,
                        group: "tablecolumn",
                        order: 1,
                        getItems: function() {
                            return {
                                tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablecolumn_delete: CKEDITOR.TRISTATE_OFF
                            }
                        }
                    },
                    tablecolumn_insertBefore: {
                        label: n.column.insertBefore,
                        group: "tablecolumn",
                        command: "columnInsertBefore",
                        order: 5
                    },
                    tablecolumn_insertAfter: {
                        label: n.column.insertAfter,
                        group: "tablecolumn",
                        command: "columnInsertAfter",
                        order: 10
                    },
                    tablecolumn_delete: {
                        label: n.column.deleteColumn,
                        group: "tablecolumn",
                        command: "columnDelete",
                        order: 15
                    }
                }), d.contextMenu && d.contextMenu.addListener(function(a, b, c) {
                    return (a = c.contains({
                        td: 1,
                        th: 1
                    }, 1)) && !a.isReadOnly() ? {
                        tablecell: CKEDITOR.TRISTATE_OFF,
                        tablerow: CKEDITOR.TRISTATE_OFF,
                        tablecolumn: CKEDITOR.TRISTATE_OFF
                    } : null
                })
            },
            getSelectedCells: a
        }, CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
    }(), CKEDITOR.tools.buildTableMap = function(a) {
        for (var a = a.$.rows, b = -1, c = [], d = 0; d < a.length; d++) {
            b++, !c[b] && (c[b] = []);
            for (var e = -1, f = 0; f < a[d].cells.length; f++) {
                var g = a[d].cells[f];
                for (e++; c[b][e];) e++;
                for (var h = isNaN(g.colSpan) ? 1 : g.colSpan, g = isNaN(g.rowSpan) ? 1 : g.rowSpan, i = 0; g > i; i++) {
                    c[b + i] || (c[b + i] = []);
                    for (var j = 0; h > j; j++) c[b + i][e + j] = a[d].cells[f]
                }
                e += h - 1
            }
        }
        return c
    }, function() {
        var a = [CKEDITOR.CTRL + 90, CKEDITOR.CTRL + 89, CKEDITOR.CTRL + CKEDITOR.SHIFT + 90],
            b = {
                8: 1,
                46: 1
            };
        CKEDITOR.plugins.add("undo", {
            init: function(b) {
                function d(a) {
                    g.enabled && !1 !== a.data.command.canUndo && g.save()
                }

                function e() {
                    g.enabled = b.readOnly ? !1 : "wysiwyg" == b.mode, g.onChange()
                }
                var g = b.undoManager = new c(b),
                    h = g.editingHandler = new f(g),
                    i = b.addCommand("undo", {
                        exec: function() {
                            g.undo() && (b.selectionChange(), this.fire("afterUndo"))
                        },
                        startDisabled: !0,
                        canUndo: !1
                    }),
                    j = b.addCommand("redo", {
                        exec: function() {
                            g.redo() && (b.selectionChange(), this.fire("afterRedo"))
                        },
                        startDisabled: !0,
                        canUndo: !1
                    });
                b.setKeystroke([
                    [a[0], "undo"],
                    [a[1], "redo"],
                    [a[2], "redo"]
                ]), g.onChange = function() {
                    i.setState(g.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), j.setState(g.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                }, b.on("beforeCommandExec", d), b.on("afterCommandExec", d), b.on("saveSnapshot", function(a) {
                    g.save(a.data && a.data.contentOnly)
                }), b.on("contentDom", h.attachListeners, h), b.on("instanceReady", function() {
                    b.fire("saveSnapshot")
                }), b.on("beforeModeUnload", function() {
                    "wysiwyg" == b.mode && g.save(!0)
                }), b.on("mode", e), b.on("readOnly", e), b.ui.addButton && (b.ui.addButton("Undo", {
                    label: b.lang.undo.undo,
                    command: "undo",
                    toolbar: "undo,10"
                }), b.ui.addButton("Redo", {
                    label: b.lang.undo.redo,
                    command: "redo",
                    toolbar: "undo,20"
                })), b.resetUndo = function() {
                    g.reset(), b.fire("saveSnapshot")
                }, b.on("updateSnapshot", function() {
                    g.currentImage && g.update()
                }), b.on("lockSnapshot", function(a) {
                    a = a.data, g.lock(a && a.dontUpdate, a && a.forceUpdate)
                }), b.on("unlockSnapshot", g.unlock, g)
            }
        }), CKEDITOR.plugins.undo = {};
        var c = CKEDITOR.plugins.undo.UndoManager = function(a) {
            this.strokesRecorded = [0, 0], this.locked = null, this.previousKeyGroup = -1, this.limit = a.config.undoStackSize || 20, this.strokesLimit = 25, this.editor = a, this.reset()
        };
        c.prototype = {
            type: function(a, b) {
                var d = c.getKeyGroup(a),
                    e = this.strokesRecorded[d] + 1,
                    b = b || e >= this.strokesLimit;
                this.typing || (this.hasUndo = this.typing = !0, this.hasRedo = !1, this.onChange()), b ? (e = 0, this.editor.fire("saveSnapshot")) : this.editor.fire("change"), this.strokesRecorded[d] = e, this.previousKeyGroup = d
            },
            keyGroupChanged: function(a) {
                return c.getKeyGroup(a) != this.previousKeyGroup
            },
            reset: function() {
                this.snapshots = [], this.index = -1, this.currentImage = null, this.hasRedo = this.hasUndo = !1, this.locked = null, this.resetType()
            },
            resetType: function() {
                this.strokesRecorded = [0, 0], this.typing = !1, this.previousKeyGroup = -1
            },
            refreshState: function() {
                this.hasUndo = !!this.getNextImage(!0), this.hasRedo = !!this.getNextImage(!1), this.resetType(), this.onChange()
            },
            save: function(a, b, c) {
                var e = this.editor;
                if (this.locked || "ready" != e.status || "wysiwyg" != e.mode) return !1;
                var f = e.editable();
                if (!f || "ready" != f.status) return !1;
                if (f = this.snapshots, b || (b = new d(e)), !1 === b.contents) return !1;
                if (this.currentImage)
                    if (b.equalsContent(this.currentImage)) {
                        if (a || b.equalsSelection(this.currentImage)) return !1
                    } else !1 !== c && e.fire("change");
                return f.splice(this.index + 1, f.length - this.index - 1), f.length == this.limit && f.shift(), this.index = f.push(b) - 1, this.currentImage = b, !1 !== c && this.refreshState(), !0
            },
            restoreImage: function(a) {
                var b, c = this.editor;
                a.bookmarks && (c.focus(), b = c.getSelection()), this.locked = {
                    level: 999
                }, this.editor.loadSnapshot(a.contents), a.bookmarks ? b.selectBookmarks(a.bookmarks) : CKEDITOR.env.ie && (b = this.editor.document.getBody().$.createTextRange(), b.collapse(!0), b.select()), this.locked = null, this.index = a.index, this.currentImage = this.snapshots[this.index], this.update(), this.refreshState(), c.fire("change")
            },
            getNextImage: function(a) {
                var b, c = this.snapshots,
                    d = this.currentImage;
                if (d)
                    if (a) {
                        for (b = this.index - 1; b >= 0; b--)
                            if (a = c[b], !d.equalsContent(a)) return a.index = b, a
                    } else
                        for (b = this.index + 1; b < c.length; b++)
                            if (a = c[b], !d.equalsContent(a)) return a.index = b, a;
                return null
            },
            redoable: function() {
                return this.enabled && this.hasRedo
            },
            undoable: function() {
                return this.enabled && this.hasUndo
            },
            undo: function() {
                if (this.undoable()) {
                    this.save(!0);
                    var a = this.getNextImage(!0);
                    if (a) return this.restoreImage(a), !0
                }
                return !1
            },
            redo: function() {
                if (this.redoable() && (this.save(!0), this.redoable())) {
                    var a = this.getNextImage(!1);
                    if (a) return this.restoreImage(a), !0
                }
                return !1
            },
            update: function(a) {
                if (!this.locked) {
                    a || (a = new d(this.editor));
                    for (var b = this.index, c = this.snapshots; b > 0 && this.currentImage.equalsContent(c[b - 1]);) b -= 1;
                    c.splice(b, this.index - b + 1, a), this.index = b, this.currentImage = a
                }
            },
            updateSelection: function(a) {
                if (!this.snapshots.length) return !1;
                var b = this.snapshots,
                    c = b[b.length - 1];
                return c.equalsContent(a) && !c.equalsSelection(a) ? (this.currentImage = b[b.length - 1] = a, !0) : !1
            },
            lock: function(a, b) {
                if (this.locked) this.locked.level++;
                else if (a) this.locked = {
                    level: 1
                };
                else {
                    var c = null;
                    if (b) c = !0;
                    else {
                        var e = new d(this.editor, !0);
                        this.currentImage && this.currentImage.equalsContent(e) && (c = e)
                    }
                    this.locked = {
                        update: c,
                        level: 1
                    }
                }
            },
            unlock: function() {
                if (this.locked && !--this.locked.level) {
                    var a = this.locked.update;
                    if (this.locked = null, !0 === a) this.update();
                    else if (a) {
                        var b = new d(this.editor, !0);
                        a.equalsContent(b) || this.update()
                    }
                }
            }
        }, c.navigationKeyCodes = {
            37: 1,
            38: 1,
            39: 1,
            40: 1,
            36: 1,
            35: 1,
            33: 1,
            34: 1
        }, c.keyGroups = {
            PRINTABLE: 0,
            FUNCTIONAL: 1
        }, c.isNavigationKey = function(a) {
            return !!c.navigationKeyCodes[a]
        }, c.getKeyGroup = function(a) {
            var d = c.keyGroups;
            return b[a] ? d.FUNCTIONAL : d.PRINTABLE
        }, c.getOppositeKeyGroup = function(a) {
            var b = c.keyGroups;
            return a == b.FUNCTIONAL ? b.PRINTABLE : b.FUNCTIONAL
        }, c.ieFunctionalKeysBug = function(a) {
            return CKEDITOR.env.ie && c.getKeyGroup(a) == c.keyGroups.FUNCTIONAL
        };
        var d = CKEDITOR.plugins.undo.Image = function(a, b) {
                this.editor = a, a.fire("beforeUndoImage");
                var c = a.getSnapshot();
                CKEDITOR.env.ie && c && (c = c.replace(/\s+data-cke-expando=".*?"/g, "")), this.contents = c, b || (this.bookmarks = (c = c && a.getSelection()) && c.createBookmarks2(!0)), a.fire("afterUndoImage")
            },
            e = /\b(?:href|src|name)="[^"]*?"/gi;
        d.prototype = {
            equalsContent: function(a) {
                var b = this.contents,
                    a = a.contents;
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks) && (b = b.replace(e, ""), a = a.replace(e, "")), b != a ? !1 : !0
            },
            equalsSelection: function(a) {
                var b = this.bookmarks,
                    a = a.bookmarks;
                if (b || a) {
                    if (!b || !a || b.length != a.length) return !1;
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c],
                            e = a[c];
                        if (d.startOffset != e.startOffset || d.endOffset != e.endOffset || !CKEDITOR.tools.arrayCompare(d.start, e.start) || !CKEDITOR.tools.arrayCompare(d.end, e.end)) return !1
                    }
                }
                return !0
            }
        };
        var f = CKEDITOR.plugins.undo.NativeEditingHandler = function(a) {
            this.undoManager = a, this.ignoreInputEvent = !1, this.keyEventsStack = new g, this.lastKeydownImage = null
        };
        f.prototype = {
            onKeydown: function(b) {
                if (-1 < CKEDITOR.tools.indexOf(a, b.data.getKeystroke())) b.data.preventDefault();
                else {
                    this.keyEventsStack.cleanUp(b);
                    var b = b.data.getKey(),
                        e = this.undoManager;
                    this.keyEventsStack.getLast(b) || this.keyEventsStack.push(b), this.lastKeydownImage = new d(e.editor), (c.isNavigationKey(b) || this.undoManager.keyGroupChanged(b)) && (e.strokesRecorded[0] || e.strokesRecorded[1]) && (e.save(!1, this.lastKeydownImage), e.resetType())
                }
            },
            onInput: function() {
                if (this.ignoreInputEvent) this.ignoreInputEvent = !1;
                else {
                    var a = this.keyEventsStack.getLast();
                    a || (a = this.keyEventsStack.push(0)), this.keyEventsStack.increment(a.keyCode), this.keyEventsStack.getTotalInputs() >= this.undoManager.strokesLimit && (this.undoManager.type(a.keyCode, !0), this.keyEventsStack.resetInputs())
                }
            },
            onKeyup: function(a) {
                var b = this.undoManager,
                    a = a.data.getKey(),
                    e = this.keyEventsStack.getTotalInputs();
                this.keyEventsStack.remove(a), c.ieFunctionalKeysBug(a) && this.lastKeydownImage && this.lastKeydownImage.equalsContent(new d(b.editor, !0)) || (e > 0 ? b.type(a) : c.isNavigationKey(a) && this.onNavigationKey(!0))
            },
            onNavigationKey: function(a) {
                var b = this.undoManager;
                (a || !b.save(!0, null, !1)) && b.updateSelection(new d(b.editor)), b.resetType()
            },
            ignoreInputEventListener: function() {
                this.ignoreInputEvent = !0
            },
            attachListeners: function() {
                var a = this.undoManager.editor,
                    b = a.editable(),
                    d = this;
                b.attachListener(b, "keydown", function(a) {
                    d.onKeydown(a), c.ieFunctionalKeysBug(a.data.getKey()) && d.onInput()
                }, null, null, 999), b.attachListener(b, CKEDITOR.env.ie ? "keypress" : "input", d.onInput, d, null, 999), b.attachListener(b, "keyup", d.onKeyup, d, null, 999), b.attachListener(b, "paste", d.ignoreInputEventListener, d, null, 999), b.attachListener(b, "drop", d.ignoreInputEventListener, d, null, 999), b.attachListener(b.isInline() ? b : a.document.getDocumentElement(), "click", function() {
                    d.onNavigationKey()
                }, null, null, 999), b.attachListener(this.undoManager.editor, "blur", function() {
                    d.keyEventsStack.remove(9)
                }, null, null, 999)
            }
        };
        var g = CKEDITOR.plugins.undo.KeyEventsStack = function() {
            this.stack = []
        };
        g.prototype = {
            push: function(a) {
                return this.stack[this.stack.push({
                    keyCode: a,
                    inputs: 0
                }) - 1]
            },
            getLastIndex: function(a) {
                if ("number" != typeof a) return this.stack.length - 1;
                for (var b = this.stack.length; b--;)
                    if (this.stack[b].keyCode == a) return b;
                return -1
            },
            getLast: function(a) {
                return a = this.getLastIndex(a), -1 != a ? this.stack[a] : null
            },
            increment: function(a) {
                this.getLast(a).inputs++
            },
            remove: function(a) {
                a = this.getLastIndex(a), -1 != a && this.stack.splice(a, 1)
            },
            resetInputs: function(a) {
                if ("number" == typeof a) this.getLast(a).inputs = 0;
                else
                    for (a = this.stack.length; a--;) this.stack[a].inputs = 0
            },
            getTotalInputs: function() {
                for (var a = this.stack.length, b = 0; a--;) b += this.stack[a].inputs;
                return b
            },
            cleanUp: function(a) {
                a = a.data.$, !a.ctrlKey && !a.metaKey && this.remove(17), a.shiftKey || this.remove(16), a.altKey || this.remove(18)
            }
        }
    }(), CKEDITOR.config.wsc_removeGlobalVariable = !0, CKEDITOR.plugins.add("wsc", {
        requires: "dialog",
        parseApi: function(a) {
            a.config.wsc_onFinish = "function" == typeof a.config.wsc_onFinish ? a.config.wsc_onFinish : function() {}, a.config.wsc_onClose = "function" == typeof a.config.wsc_onClose ? a.config.wsc_onClose : function() {}
        },
        parseConfig: function(a) {
            a.config.wsc_customerId = a.config.wsc_customerId || CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk", a.config.wsc_customDictionaryIds = a.config.wsc_customDictionaryIds || CKEDITOR.config.wsc_customDictionaryIds || "", a.config.wsc_userDictionaryName = a.config.wsc_userDictionaryName || CKEDITOR.config.wsc_userDictionaryName || "", a.config.wsc_customLoaderScript = a.config.wsc_customLoaderScript || CKEDITOR.config.wsc_customLoaderScript, CKEDITOR.config.wsc_cmd = a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell", CKEDITOR.config.wsc_version = CKEDITOR.version + " | %Rev%"
        },
        init: function(a) {
            var b = CKEDITOR.env;
            this.parseConfig(a), this.parseApi(a), a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes = {
                wysiwyg: !(CKEDITOR.env.opera || CKEDITOR.env.air || document.domain != window.location.hostname || b.ie && (8 > b.version || b.quirks))
            }, "undefined" == typeof a.plugins.scayt && a.ui.addButton && a.ui.addButton("SpellChecker", {
                label: a.lang.wsc.toolbar,
                click: function(a) {
                    var b = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.container.getText() : a.document.getBody().getText();
                    (b = b.replace(/\s/g, "")) ? a.execCommand("checkspell"): alert("Nothing to check!")
                },
                toolbar: "spellchecker,10"
            }), CKEDITOR.dialog.add("checkspell", this.path + (CKEDITOR.env.ie && 7 >= CKEDITOR.env.version ? "dialogs/wsc_ie.js" : window.postMessage ? "dialogs/wsc.js" : "dialogs/wsc_ie.js"))
        }
    }), CKEDITOR.config.plugins = "dialogui,dialog,about,a11yhelp,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,resize,button,toolbar,elementspath,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,format,horizontalrule,htmlwriter,wysiwygarea,image,indent,indentlist,fakeobjects,link,list,magicline,maximize,pastetext,pastefromword,removeformat,showborders,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc", CKEDITOR.config.skin = "bootstrapck", function() {
        var a = function(a, b) {
            var c = CKEDITOR.getUrl("plugins/" + b);
            a = a.split(",");
            for (var d = 0; d < a.length; d++) CKEDITOR.skin.icons[a[d]] = {
                path: c,
                offset: -a[++d],
                bgsize: a[++d]
            }
        };
        CKEDITOR.env.hidpi ? a("about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,blockquote,168,,copy-rtl,192,,copy,216,,cut-rtl,240,,cut,264,,paste-rtl,288,,paste,312,,horizontalrule,336,,image,360,,indent-rtl,384,,indent,408,,outdent-rtl,432,,outdent,456,,anchor-rtl,480,,anchor,504,,link,528,,unlink,552,,bulletedlist-rtl,576,,bulletedlist,600,,numberedlist-rtl,624,,numberedlist,648,,maximize,672,,pastetext-rtl,696,,pastetext,720,,pastefromword-rtl,744,,pastefromword,768,,removeformat,792,,source-rtl,816,,source,840,,specialchar,864,,scayt,888,,table,912,,redo-rtl,936,,redo,960,,undo-rtl,984,,undo,1008,,spellchecker,1032,", "icons_hidpi.png") : a("about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,blockquote,168,auto,copy-rtl,192,auto,copy,216,auto,cut-rtl,240,auto,cut,264,auto,paste-rtl,288,auto,paste,312,auto,horizontalrule,336,auto,image,360,auto,indent-rtl,384,auto,indent,408,auto,outdent-rtl,432,auto,outdent,456,auto,anchor-rtl,480,auto,anchor,504,auto,link,528,auto,unlink,552,auto,bulletedlist-rtl,576,auto,bulletedlist,600,auto,numberedlist-rtl,624,auto,numberedlist,648,auto,maximize,672,auto,pastetext-rtl,696,auto,pastetext,720,auto,pastefromword-rtl,744,auto,pastefromword,768,auto,removeformat,792,auto,source-rtl,816,auto,source,840,auto,specialchar,864,auto,scayt,888,auto,table,912,auto,redo-rtl,936,auto,redo,960,auto,undo-rtl,984,auto,undo,1008,auto,spellchecker,1032,auto", "icons.png")
    }(), CKEDITOR.lang.languages = {
        en: 1
    })
}();