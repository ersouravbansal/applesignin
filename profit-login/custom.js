$(document).ready(function () {
    "use strict";
    //------ 1. Left Side Navigation Trigger START	
    /*$('.side-nav-trigger').on('click', function () {      
      if(!parent_c_islogin()){
        let loginurl = 'http://localhost/test/profit-login/sso-profit.html';
        let client_key = 'ad481d08-349a-4295-b6af-9ca9300d83f0';
          let client_secret = '$2a$10$ubyHy2lD7BJq8A3Oo.2nxOo.x3S6QWKbXaBAdsUn88KZa/KM5475O';
        if(0) {
          client_key = 'a305b91a-a843-4f97-9f0e-a7171eaf6e05';
          client_secret = '$2a$10$r11XuQTAQQFkq/igTkZW9eq3cJWNpRIiKkjGhBTNeUbEuiEf8cB8u';
          loginurl = 'https://drop.ndtv.com/test/profit-login/sso-profit.html'
        } 
        
        let __rurl = window.location.href;        
        window.location.href = loginurl + '?client_id='+client_key+'&client_secret='+client_secret+'&siteurl='+encodeURIComponent(__rurl);
      } else {
        var target = $(this).data('trigger');
        var toggleClass = $(this).data('class');  
        $(target).toggleClass(toggleClass);
      }    
    });*/

    
    $('.side-nv-log-trigger,.search-trigger, .drp-trigger, .match-trigger, .lst-trg').on('click', function () {
      
      var target = $(this).data('trigger');
      var toggleClass = $(this).data('class');
  
      $(target).toggleClass(toggleClass);
    });
  
    $(".t-icn-sr").click(function () {
      $('body').addClass('js_ser-nav');
      $('.srh_inp').focus();
    });
  
    $(".overlay__side-nav, .sid-nav-cls, .nav-cls, .Ingr-Pop_cls, .LogSd-cls").click(function () {
      $('body').removeClass('js_sid-nav');
      $('body').removeClass('js_sid-nav-right');
      $('body').removeClass('js_sid-nav-right1');
      $('body').removeClass('js_ser-nav');
      $('body').removeClass('js_fltr-nav');
      $('body').removeClass('js_ftr-sts-nav');
      $('body').removeClass('js_pin-up');
      $('body').removeClass('js-npop-frm');
      $('body').removeClass('js_drp-nav');
      $('body').removeClass('res-bt_sub-nav');
      $('body').removeClass('js_Ingr-pop');
      $('body').removeClass('js_AutPup_nav');
    });
  
    //------ Left Side Navigation Trigger END
  
  
  });
  
  
  //------====== 2. Search  ======------//
  $('.control').click(function () {
    $('body').addClass('search-active');
    $('.input-search').focus();
    $(".ovl").fadeIn(0).addClass("js-ovl");
  });
  
  $('.icon-close').click(function () {
    $('body').removeClass("search-active");
  
  });
  $('.ovl').click(function () {
    setTimeout(function () {
      $('body').removeClass("search-active");
    }, 0);
  
  });
  
  
  //------====== 3. Add class on scroll  ======------//
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
  
    if (scroll >= 500) {
      $(".nav-trigger").addClass("nav_stk");
    } else {
      $(".nav-trigger").removeClass("nav_stk");
    }
  });
  
  
  //------====== 4. Dropdown  ======------//
  
  //$('.drp-trigger').click(function(){
  //$(this).toggleClass('js-drp-open');
  //});
  
  //---- a. Dropdown Mobile ----//
  $(document).ready(function () {
    [].slice.call(document.querySelectorAll('.drp-trigger .drp-lnk')).forEach(function (el) {
      el.addEventListener('click', onClick, false);
    });
  
    function onClick(e) {
      //e.preventDefault();
      var el = this.parentNode;
      el.classList.contains('js-drp-open') ? hideSubMenu(el) : showSubMenu(el);
    }
  
    function showSubMenu(el) {
      el.classList.add('js-drp-open');
      document.addEventListener('click', function onDocClick(e) {
        //e.preventDefault();
        if (el.contains(e.target)) {
          return;
        }
        document.removeEventListener('click', onDocClick);
        hideSubMenu(el);
      });
    }
  
    function hideSubMenu(el) {
      el.classList.remove('js-drp-open');
    }
  
  });
  
  
  //---- b. Responsive Only for Mobile ----//
  
  if ($(window).width() <= 768) {
  
  
    //--======== Dropdown Mobile
    $(document).ready(function () {
  
          [].slice.call(document.querySelectorAll('.m-nv_li .res_sub-nav_pop')).forEach(function (el) {
              el.addEventListener('click', onClick, false);
          });
  
          function onClick(e) {
              //e.preventDefault();
              var el = this.parentNode;
              (el.classList.contains('res-bt_sub-nav') || el.classList.contains('srs_drp') || el.classList.contains('sub-nav_vis'))  ? hideSubMenu(el) : showSubMenu(el);
          }
  
          function showSubMenu(el) {
              document.body.classList.add('srs_drp');
              el.classList.add('res-bt_sub-nav');
              $('.sub-nav_hr-scr').addClass('sub-nav_vis');
              document.addEventListener('click', function onDocClick(e) {
                  //e.preventDefault();
                  if (el.contains(e.target)) {
                      return;
                  }
                  document.removeEventListener('click', onDocClick);
                  hideSubMenu(el);
              });
          }
  
          function hideSubMenu(el) {
              document.body.classList.remove('srs_drp');
              el.classList.remove('res-bt_sub-nav');
              $('.sub-nav_hr-scr').removeClass('sub-nav_vis');
          }
      });
  
  
  //  $('.res').click(function (e) {
  //    e.preventDefault();
  //    $("body").toggleClass("srs_drp", function () {
  //      $(this).focus();
  //    });
  //  });
  
  
    //--======== Expand text
  
  $('.expand-btn__link').click(function () {
      $('.story__content').removeClass("js-expand-txt__height");
  });
  
  
  
  
  }
  
  //---- Social Native ----//
  $('.crd_shr').on('click', function () {
    if (navigator.share !== undefined) {
      navigator.share({
        title: "NDTV Food",
        url: "https://ndtv.com"
      });
    }
  })
  
  
  
  //------====== 4. Page Refresh Responsive  ======------//
  //$(window).resize(function() {
  //  var descTop = $('html').width()
  //if (descTop < 826){
  //       window.location.reload();
  //}
  //if (descTop > 826){
  //       window.location.reload();
  //}
  //});
  
  
  //------====== 4. Inview  ======------//
  function logParameters(elPosTop, elHeight, inView, windowHeight) {
    console.log(`IN VIEW?: ${inView}`)
  }
  
  const els = document.querySelectorAll('.inview_ani, .inview')
  const buffer = window.innerHeight / 7
  
  function getElPosTop(el) {
    return el.getBoundingClientRect().top
  }
  
  function getElHeight(el) {
    return el.offsetHeight
  }
  
  function isInView(elPosTop, windowHeight, elHeight) {
    if (elPosTop < windowHeight - buffer) {
      return true
    }
    return false
  }
  
  window.addEventListener('resize', function () {
    for (let i = 0; i < els.length; i++) {
      if (
        isInView(
          getElPosTop(els[i]),
          window.innerHeight,
          getElHeight(els[i])
        )
      ) {
        els[i].classList.add('inview')
        els[i].classList.remove('inview_fade')
      } else {
        els[i].classList.remove('inview')
        els[i].classList.add('inview_fade')
      }
    }
  })
  
  window.addEventListener('scroll', function () {
    for (let i = 0; i < els.length; i++) {
      if (
        isInView(
          getElPosTop(els[i]),
          window.innerHeight,
          getElHeight(els[i])
        )
      ) {
        els[i].classList.add('inview')
        els[i].classList.remove('inview_fade')
      } else {
        els[i].classList.remove('inview')
        els[i].classList.add('inview_fade')
      }
    }
  });
  //------ scroll 1px ------//
  // window.scrollTo(window.scrollX, window.scrollY + 1);
  
  
  //------====== 5. LAZY LOAD  ======------//
  ! function (t, e) {
    "use strict";
  
  
    $(function () {
      function r(r, a, i, u, l) {
        function f() {
          L = t.devicePixelRatio > 1, i = c(i), a.delay >= 0 && setTimeout(function () {
            s(!0)
          }, a.delay), (a.delay < 0 || a.combined) && (u.e = v(a.throttle, function (t) {
            "resize" === t.type && (w = B = -1), s(t.all)
          }), u.a = function (t) {
            t = c(t), i.push.apply(i, t)
          }, u.g = function () {
            return i = n(i).filter(function () {
              return !n(this).data(a.loadedName)
            })
          }, u.f = function (t) {
            for (var e = 0; e < t.length; e++) {
              var r = i.filter(function () {
                return this === t[e]
              });
              r.length && s(!1, r)
            }
          }, s(), n(a.appendScroll).on("scroll." + l + " resize." + l, u.e))
        }
  
        function c(t) {
          var i = a.defaultImage,
            o = a.placeholder,
            u = a.imageBase,
            l = a.srcsetAttribute,
            f = a.loaderAttribute,
            c = a._f || {};
          t = n(t).filter(function () {
            var t = n(this),
              r = m(this);
            return !t.data(a.handledName) && (t.attr(a.attribute) || t.attr(l) || t.attr(f) || c[r] !== e)
          }).data("plugin_" + a.name, r);
          for (var s = 0, d = t.length; s < d; s++) {
            var A = n(t[s]),
              g = m(t[s]),
              h = A.attr(a.imageBaseAttribute) || u;
            g === N && h && A.attr(l) && A.attr(l, b(A.attr(l), h)), c[g] === e || A.attr(f) || A.attr(f, c[g]), g === N && i && !A.attr(E) ? A.attr(E, i) : g === N || !o || A.css(O) && "none" !== A.css(O) || A.css(O, "url('" + o + "')")
          }
          return t
        }
  
        function s(t, e) {
          if (!i.length)
            return void(a.autoDestroy && r.destroy());
          for (var o = e || i, u = !1, l = a.imageBase || "", f = a.srcsetAttribute, c = a.handledName, s = 0; s < o.length; s++)
            if (t || e || A(o[s])) {
              var g = n(o[s]),
                h = m(o[s]),
                b = g.attr(a.attribute),
                v = g.attr(a.imageBaseAttribute) || l,
                p = g.attr(a.loaderAttribute);
              g.data(c) || a.visibleOnly && !g.is(":visible") || !((b || g.attr(f)) && (h === N && (v + b !== g.attr(E) || g.attr(f) !== g.attr(F)) || h !== N && v + b !== g.css(O)) || p) || (u = !0, g.data(c, !0), d(g, h, v, p))
            }
          u && (i = n(i).filter(function () {
            return !n(this).data(c)
          }))
        }
  
        function d(t, e, r, i) {
          ++z;
          var o = function () {
            y("onError", t), p(), o = n.noop
          };
          y("beforeLoad", t);
          var u = a.attribute,
            l = a.srcsetAttribute,
            f = a.sizesAttribute,
            c = a.retinaAttribute,
            s = a.removeAttribute,
            d = a.loadedName,
            A = t.attr(c);
          if (i) {
            var g = function () {
              s && t.removeAttr(a.loaderAttribute), t.data(d, !0), y(T, t), setTimeout(p, 1), g = n.noop
            };
            t.off(I).one(I, o).one(D, g), y(i, t, function (e) {
              e ? (t.off(D), g()) : (t.off(I), o())
            }) || t.trigger(I)
          } else {
            var h = n(new Image);
            h.one(I, o).one(D, function () {
              t.hide(), e === N ? t.attr(C, h.attr(C)).attr(F, h.attr(F)).attr(E, h.attr(E)) : t.css(O, "url('" + h.attr(E) + "')"), t[a.effect](a.effectTime), s && (t.removeAttr(u + " " + l + " " + c + " " + a.imageBaseAttribute), f !== C && t.removeAttr(f)), t.data(d, !0), y(T, t), h.remove(), p()
            });
            var m = (L && A ? A : t.attr(u)) || "";
            h.attr(C, t.attr(f)).attr(F, t.attr(l)).attr(E, m ? r + m : null), h.complete && h.trigger(D)
          }
        }
  
        function A(t) {
          var e = t.getBoundingClientRect(),
            r = a.scrollDirection,
            n = a.threshold,
            i = h() + n > e.top && -n < e.bottom,
            o = g() + n > e.left && -n < e.right;
          return "vertical" === r ? i : "horizontal" === r ? o : i && o
        }
  
        function g() {
          return w >= 0 ? w : w = n(t).width()
        }
  
        function h() {
          return B >= 0 ? B : B = n(t).height()
        }
  
        function m(t) {
          return t.tagName.toLowerCase()
        }
  
        function b(t, e) {
          if (e) {
            var r = t.split(",");
            t = "";
            for (var a = 0, n = r.length; a < n; a++)
              t += e + r[a].trim() + (a !== n - 1 ? "," : "")
          }
          return t
        }
  
        function v(t, e) {
          var n, i = 0;
          return function (o, u) {
            function l() {
              i = +new Date, e.call(r, o)
            }
            var f = +new Date - i;
            n && clearTimeout(n), f > t || !a.enableThrottle || u ? l() : n = setTimeout(l, t - f)
          }
        }
  
        function p() {
          --z, i.length || z || y("onFinishedAll")
        }
  
        function y(t, e, n) {
          return !!(t = a[t]) && (t.apply(r, [].slice.call(arguments, 1)), !0)
        }
        var z = 0,
          w = -1,
          B = -1,
          L = !1,
          T = "afterLoad",
          D = "load",
          I = "error",
          N = "img",
          E = "src",
          F = "srcset",
          C = "sizes",
          O = "background-image";
        "event" === a.bind || o ? f() : n(t).on(D + "." + l, f)
      }
  
      function a(a, o) {
        var u = this,
          l = n.extend({}, u.config, o),
          f = {},
          c = l.name + "-" + ++i;
        return u.config = function (t, r) {
          return r === e ? l[t] : (l[t] = r, u)
        }, u.addItems = function (t) {
          return f.a && f.a("string" === n.type(t) ? n(t) : t), u
        }, u.getItems = function () {
          return f.g ? f.g() : {}
        }, u.update = function (t) {
          return f.e && f.e({}, !t), u
        }, u.force = function (t) {
          return f.f && f.f("string" === n.type(t) ? n(t) : t), u
        }, u.loadAll = function () {
          return f.e && f.e({
            all: !0
          }, !0), u
        }, u.destroy = function () {
          return n(l.appendScroll).off("." + c, f.e), n(t).off("." + c), f = {}, e
        }, r(u, l, a, f, c), l.chainable ? a : u
      }
      var n = t.jQuery || t.Zepto,
        i = 0,
        o = !1;
      n.fn.Lazy = n.fn.lz_img = function (t) {
        return new a(this, t)
      }, n.Lazy = n.lz_img = function (t, r, i) {
        if (n.isFunction(r) && (i = r, r = []), n.isFunction(i)) {
          t = n.isArray(t) ? t : [t], r = n.isArray(r) ? r : [r];
          for (var o = a.prototype.config, u = o._f || (o._f = {}), l = 0, f = t.length; l < f; l++)
            (o[t[l]] === e || n.isFunction(o[t[l]])) && (o[t[l]] = i);
          for (var c = 0, s = r.length; c < s; c++)
            u[r[c]] = t[0]
        }
      }, a.prototype.config = {
        name: "lz_img",
        chainable: !0,
        autoDestroy: !0,
        bind: "load",
        threshold: 500,
        visibleOnly: !1,
        appendScroll: t,
        scrollDirection: "both",
        imageBase: null,
        defaultImage: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
        placeholder: null,
        delay: -1,
        combined: !1,
        attribute: "data-src",
        srcsetAttribute: "data-srcset",
        sizesAttribute: "data-sizes",
        retinaAttribute: "data-retina",
        loaderAttribute: "data-loader",
        imageBaseAttribute: "data-imagebase",
        removeAttribute: !0,
        handledName: "handled",
        loadedName: "loaded",
        effect: "show",
        effectTime: 0,
        enableThrottle: !0,
        throttle: 250,
        beforeLoad: e,
        afterLoad: e,
        onError: e,
        onFinishedAll: e
      }, n(t).on("load", function () {
        o = !0
      })
      $('.lz_img').lz_img({
        beforeLoad: function (element) {
          console.log('image "' + stripTime(element.data('src')) + '" is about to be loaded');
        },
      });
  
    });
  
    function stripTime(a) {}
  
  
  }(window);
  
  
  //------====== 6. Story Font Size  ======------//
  
  $('.fts_ft-sm').click(function () {
    $('body').addClass("fts_ft-sm");
    $('body').removeClass("fts_ft-md");
    $('body').removeClass("fts_ft-lg");
  
  });
  $('.fts_ft-md').click(function () {
    $('body').addClass("fts_ft-md");
    $('body').removeClass("fts_ft-sm");
    $('body').removeClass("fts_ft-lg");
  
  });
  $('.fts_ft-lg').click(function () {
    $('body').addClass("fts_ft-lg");
    $('body').removeClass("fts_ft-sm");
    $('body').removeClass("fts_ft-md");
  
  });
  $('.fts_focus').click(function () {
    $('body').toggleClass("fts_focus");
  
  });
  
  
  //------====== 7. Image Loading Transition  ======------//
  
  $('.img_trn').each(function (i) {
  
    var childrenSpan = $(this).children('span').length;
  
    $(this).addClass('childrenSpan-' + childrenSpan);
  
    if ($(window).scrollTop() + $(window).height() > $(this).offset().top + $(this).outerHeight()) {
      $(this).addClass('img_trn-in');
    }
  
  });
  
  $(window).scroll(function () {
    $('.img_trn').each(function (i) {
      if ($(window).scrollTop() + $(window).height() > $(this).offset().top) {
        $(this).addClass('img_trn-in');
      }
    });
  
  });
  
  
  
  
  //------====== 9. Story tittle Sticky  ======------//
  
  $(document).ready(function () {
    var stk = {};
  
    window.StartHeader = function () {
      stk.baseContainer = $(".sp-hd");
      stk.contPanle = $(".pg-str-com");
      stk.toolTip = $(".stk-t");
      stk.playerTop = -1;
      window.addEventListener("scroll", windowScroll, false);
      //    updateLog("top:  " + stk.baseContainer.position().top)
    }
  
    window.windowScroll = function (e) {
      e.preventDefault();
      updateDivSticky($(".pg-str-com"), "j-stk-dn") > 200;
      updateDivSticky($(".before_taboola"), "j-nxt-prv");
      return false;
    }
  
    window.updateDivSticky = function (base, addRemClass) {
      var contPanel = base; // ;
      var totalTop = contPanel.offset().top - pageYOffset;
      //    updateLog("=====top pos: " + " ;  totalTop: " + totalTop + " ;  height:  " + contPanel.height());
      if ((totalTop) < 0) {
        var maxReach = Math.abs(totalTop);
        //        updateLog("maxReach:  " + maxReach)
        if (maxReach >= contPanel.height()) {
          $("body").removeClass(addRemClass)
        } else {
          $("body").addClass(addRemClass)
        }
      } else {
        $("body").removeClass(addRemClass);
      }
      return false;
    }
    StartHeader();
  })
  
  
  //--======== 10. Notification toggle button ========--//
  
  $('.scr_swt-inp').click(function () {
      var swtToggle = $(this).parent('.scr_swt-tgl');
      if ($(swtToggle).find('input.scr_swt-inp').is(':checked')) {
        $(swtToggle).addClass('js-scr_swt-act');
      } else {
        $(swtToggle).removeClass('js-scr_swt-act');
      }
    })
  
  
    //--======== 10. Typing Text ========--//
    ! function (a) {
      "use strict";
      a.fn.typer = function (b) {
        function c(a, b) {
          k < b.length ? (g = b[k].split(""), h = g.length, setTimeout(function () {
            a.append(g[j]), j++, j < h ? c(a, b) : (j = 0, k++, setTimeout(function () {
              e(a, function () {
                c(a, b)
              })
            }, i.backspaceDelay))
          }, i.typeSpeed)) : i.repeat && d(a, b)
        }
  
        function d(a, b) {
          k = 0, setTimeout(function () {
            c(a, b)
          }, i.repeatDelay)
        }
  
        function e(a, b) {
          setTimeout(function () {
            a.text(a.text().slice(0, -1)), 0 < a.text().length ? e(a, b) : "function" == typeof b && b()
          }, i.backspaceSpeed)
        }
  
        function f(a) {
          setInterval(function () {
            a.fadeOut(400).fadeIn(400)
          }, 900)
        }
        var g, h, i = a.extend({
            typeSpeed: 60,
            backspaceSpeed: 20,
            backspaceDelay: 1600,
            repeatDelay: 1e3,
            repeat: !0,
            autoStart: !0,
            startDelay: 100,
            useCursor: !0,
            strings: [""]
          }, b),
          j = 0,
          k = 0;
        return this.each(function () {
          var b, d, e = a(this);
          i.autoStart && (e.append('<span class="typed"></span>'), i.useCursor && (e.append('<span class="typed_cursor">&#x7c;</span>'), d = e.children(".typed_cursor"), f(d)), b = e.children(".typed"), setTimeout(function () {
            c(b, i.strings)
          }, i.startDelay))
        })
      }
    }(jQuery);
  
  
  //------====== 10. circle scroll progress bar ======------//
  
  
  ! function (t, s) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = s() : "function" == typeof define && define.amd ? define(s) : (t = t || self).stickybits = s()
  }(this, function () {
    "use strict";
    var e = function () {
      function t(t, s) {
        var e = void 0 !== s ? s : {};
        this.version = "3.6.6", this.userAgent = window.navigator.userAgent || "no `userAgent` provided by the browser", this.props = {
          customStickyChangeNumber: e.customStickyChangeNumber || null,
          noStyles: e.noStyles || !1,
          stickyBitStickyOffset: e.stickyBitStickyOffset || 0,
          parentClass: e.parentClass || "js-stickybit-parent",
          scrollEl: "string" == typeof e.scrollEl ? document.querySelector(e.scrollEl) : e.scrollEl || window,
          stickyClass: e.stickyClass || "js-is-sticky",
          stuckClass: e.stuckClass || "js-is-stuck",
          stickyChangeClass: e.stickyChangeClass || "js-is-sticky--change",
          useStickyClasses: e.useStickyClasses || !1,
          useFixed: e.useFixed || !1,
          useGetBoundingClientRect: e.useGetBoundingClientRect || !1,
          verticalPosition: e.verticalPosition || "top"
        }, this.props.positionVal = this.definePosition() || "fixed", this.instances = [];
        var i = this.props,
          n = i.positionVal,
          o = i.verticalPosition,
          r = i.noStyles,
          a = i.stickyBitStickyOffset,
          l = "top" !== o || r ? "" : a + "px",
          c = "fixed" !== n ? n : "";
        this.els = "string" == typeof t ? document.querySelectorAll(t) : t, "length" in this.els || (this.els = [this.els]);
        for (var f = 0; f < this.els.length; f++) {
          var u = this.els[f];
          u.style[o] = l, u.style.position = c, this.instances.push(this.addInstance(u, this.props))
        }
      }
      var s = t.prototype;
      return s.definePosition = function () {
        var t;
        if (this.props.useFixed)
          t = "fixed";
        else {
          for (var s = ["", "-o-", "-webkit-", "-moz-", "-ms-"], e = document.head.style, i = 0; i < s.length; i += 1)
            e.position = s[i] + "sticky";
          t = e.position ? e.position : "fixed", e.position = ""
        }
        return t
      }, s.addInstance = function (t, s) {
        var e = this,
          i = {
            el: t,
            parent: t.parentNode,
            props: s
          };
        if ("fixed" === s.positionVal || s.useStickyClasses) {
          this.isWin = this.props.scrollEl === window;
          var n = this.isWin ? window : this.getClosestParent(i.el, i.props.scrollEl);
          this.computeScrollOffsets(i), i.parent.className += " " + s.parentClass, i.state = "default", i.stateContainer = function () {
            return e.manageState(i)
          }, n.addEventListener("scroll", i.stateContainer)
        }
        return i
      }, s.getClosestParent = function (t, s) {
        var e = s,
          i = t;
        if (i.parentElement === e)
          return e;
        for (; i.parentElement !== e;)
          i = i.parentElement;
        return e
      }, s.getTopPosition = function (t) {
        if (this.props.useGetBoundingClientRect)
          return t.getBoundingClientRect().top + (this.props.scrollEl.pageYOffset || document.documentElement.scrollTop);
        for (var s = 0; s = t.offsetTop + s, t = t.offsetParent;)
        ;
        return s
      }, s.computeScrollOffsets = function (t) {
        var s = t,
          e = s.props,
          i = s.el,
          n = s.parent,
          o = !this.isWin && "fixed" === e.positionVal,
          r = "bottom" !== e.verticalPosition,
          a = o ? this.getTopPosition(e.scrollEl) : 0,
          l = o ? this.getTopPosition(n) - a : this.getTopPosition(n),
          c = null !== e.customStickyChangeNumber ? e.customStickyChangeNumber : i.offsetHeight,
          f = l + n.offsetHeight;
        s.offset = a + e.stickyBitStickyOffset, s.stickyStart = r ? l - s.offset : 0, s.stickyChange = s.stickyStart + c, s.stickyStop = r ? f - (i.offsetHeight + s.offset) : f - window.innerHeight
      }, s.toggleClasses = function (t, s, e) {
        var i = t,
          n = i.className.split(" ");
        e && -1 === n.indexOf(e) && n.push(e);
        var o = n.indexOf(s);
        - 1 !== o && n.splice(o, 1), i.className = n.join(" ")
      }, s.manageState = function (t) {
        var s = t,
          e = s.el,
          i = s.props,
          n = s.state,
          o = s.stickyStart,
          r = s.stickyChange,
          a = s.stickyStop,
          l = e.style,
          c = i.noStyles,
          f = i.positionVal,
          u = i.scrollEl,
          p = i.stickyClass,
          h = i.stickyChangeClass,
          d = i.stuckClass,
          y = i.verticalPosition,
          k = "bottom" !== y,
          m = function (t) {
            t()
          },
          g = this.isWin && (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame) || m,
          C = this.toggleClasses,
          v = this.isWin ? window.scrollY || window.pageYOffset : u.scrollTop,
          S = k && v <= o && ("sticky" === n || "stuck" === n),
          w = a <= v && "sticky" === n;
        o < v && v < a && ("default" === n || "stuck" === n) ? (s.state = "sticky", g(function () {
          C(e, d, p), l.position = f, c || (l.bottom = "", l[y] = i.stickyBitStickyOffset + "px")
        })) : S ? (s.state = "default", g(function () {
          C(e, p), C(e, d), "fixed" === f && (l.position = "")
        })) : w && (s.state = "stuck", g(function () {
          C(e, p, d), "fixed" !== f || c || (l.top = "", l.bottom = "0", l.position = "absolute")
        }));
        var b = r <= v && v <= a;
        v < r / 2 || a < v ? g(function () {
          C(e, h)
        }) : b && g(function () {
          C(e, "stub", h)
        })
      }, s.update = function (t) {
        void 0 === t && (t = null);
        for (var s = 0; s < this.instances.length; s += 1) {
          var e = this.instances[s];
          if (this.computeScrollOffsets(e), t)
            for (var i in t)
              e.props[i] = t[i]
        }
        return this
      }, s.removeInstance = function (t) {
        var s = t.el,
          e = t.props,
          i = this.toggleClasses;
        s.style.position = "", s.style[e.verticalPosition] = "", i(s, e.stickyClass), i(s, e.stuckClass), i(s.parentNode, e.parentClass)
      }, s.cleanup = function () {
        for (var t = 0; t < this.instances.length; t += 1) {
          var s = this.instances[t];
          s.stateContainer && s.props.scrollEl.removeEventListener("scroll", s.stateContainer), this.removeInstance(s)
        }
        this.manageState = !1, this.instances = []
      }, t
    }();
    return function (t, s) {
      return new e(t, s)
    }
  });
  
  
  let adSticky = stickybits(".js-ad-sticky", {
    parentClass: "js-ad-sticky-parent",
    stickyBitStickyOffset: window.innerHeight - 200
  });
  
  const ad = document.querySelector(".js-ad-section");
  let circle = document.querySelector(".red-tim_cir");
  
  function adReadingProgress() {
    let val =
      (window.innerHeight + window.pageYOffset - ad.offsetTop - 460)
      / (ad.clientHeight - 100)
      * 100;
  
    const r = circle.r.baseVal.value;
    const c = Math.PI * (r * 2);
    if (val < 0) {
      val = 0;
      $('body').removeClass('js_red-tim');
    }
    if (val > 100) {
      val = 100;
      $('body').addClass('js_red-tim');
    } else {
      $('body').removeClass('js_red-tim');
    }
  
    const pct = (100 - val) / 100 * c;
  
    circle.style.strokeDashoffset = pct;
  
  
    requestAnimationFrame(() => this.adReadingProgress());
  }
  
  window.requestAnimationFrame(adReadingProgress);
  
  
  //------====== 11. Comments Slidein ======------//
  $(".cmt-ac").click(function () {
    $("body").addClass("js-op-cmt");
    setTimeout(function () {
      $('.nav-trigger').removeClass('js-nav-open');
    }, 3000);
  
  
    //--- drop animation
    var pos = $(this).offset();
    $(".drp-wrp").css({
      top: pos.top + "px",
      right: 0 + "px"
    });
    $(".cmt-cnt").fadeIn(0);
    $(".ovl").fadeIn(0).addClass("js-ovl");
  });
  
  $(".ovl, .cls-btn").click(function () {
    $("body").removeClass("js-op-cmt");
    $(".cmt-cnt").fadeIn(0).delay(1000).fadeOut(0);
    $(".ovl").fadeIn(0).removeClass("js-ovl").delay(100).fadeOut(0);
  });
  
  
  $(window).scroll(function () {
    if ($(this).scrollTop() > 400) {
      $('.cmt-ac').fadeIn().addClass("cmt-dn");
    } else {
      $('.cmt-ac').removeClass("cmt-dn");
    }
  });
  
  
  //------====== 12. Trigger Class ======------//
  $('.trigger').on('click', function () {
  
    var target = $(this).data('trigger');
    var toggleClass = $(this).data('class');
  
    $(target).toggleClass(toggleClass);
  });
  
  
  //------====== 13. Number break <b> and animate ======------//
  //function each(obj, callback) {
  //  obj = (typeof obj === 'string' ? document.querySelectorAll(obj)
  //    : obj instanceof Node ? [obj] : obj);
  //
  //  var length = obj.length,
  //    i = 0;
  //
  //  for (; i < length; i++) {
  //    if (callback.call(obj[i], i, obj[i]) === false) {
  //      break;
  //    }
  //  }
  //}
  //
  //each('.stk-ttl', function () {
  //  var elem = this,
  //    characters = elem.innerText.split(''),
  //    content = '';
  //
  //  each(characters, function (i, c) {
  //    content += '<b class="stk-ttl_ani_c"><b class="stk-ttl_ani_cc">' + c + '</b></b>';
  //  });
  //
  //  elem.className += ' stk-ttl_ani';
  //  elem.innerHTML = content;
  //
  //});
  
  //------====== 14. Back to top ======------//
  
  // browser window scroll (in pixels) after which the "back to top" link is shown
  var offset = 60,
    //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
    offset_opacity = 400,
    //duration of the top scrolling animation (in ms)
    scroll_top_duration = 600,
    //grab the "back to top" link
    $back_to_top = $('.back-to-top');
  
  //hide or show the "back to top" link
  $(window).scroll(function () {
    ($(this).scrollTop() > offset) ? $back_to_top.addClass('js-back-to-top'): $back_to_top.removeClass('js-bkt-visible js-bkt-out');
    if ($(this).scrollTop() > offset_opacity) {
      $back_to_top.addClass('js-bkt-out');
    }
  });
  
  //------ Back to top Button
  $(".back-to-top, .fltr_nav-src").click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 400);
  });
  
  // Initialize Sticky Sidebar
  
  // Search Input cursor at the end of text//
  jQuery.fn.putCursorAtEnd = function() {
    return this.each(function() {    
      // Cache references
      var $el = $(this),
          el = this;
      // Only focus if input isn't already
      if (!$el.is(":focus")) {
       $el.focus();
      }
  
      if (el.setSelectionRange) {
        // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
        var len = $el.val().length * 2;
        // Timeout seems to be required for Blink
        setTimeout(function() {
          el.setSelectionRange(len, len);
        }, 1);
      
      } else {
        
        // As a fallback, replace the contents with itself
        // Doesn't work in Chrome, but Chrome supports setSelectionRange
        $el.val($el.val());
        
      }
  
      // Scroll to the bottom, in case we're in a tall textarea
      // (Necessary for Firefox and Chrome)
      this.scrollTop = 999999;
  
    });
  
  };
  
  (function() {
    
    var searchInput = $("#q1");
  
    searchInput
      .putCursorAtEnd() // should be chainable
      .on("focus", function() { // could be on any event
        searchInput.putCursorAtEnd()
      });
    
  })();
  
    // Search Input Clear text (cross icon 
   $('.SrcPG-SrcTl-clr input[type="text"]').on('input propertychange', function() {
    var $this = $(this);
    var visible = Boolean($this.val());
    $this.siblings('.SrcPG-SrcTl-btn_cl').toggleClass('hidden', !visible);
  }).trigger('propertychange');
  
  $('.SrcPG-SrcTl-btn_cl').click(function() {
    $(this).siblings('input[type="text"]').val('')
      .trigger('propertychange').focus();
  });
  
  