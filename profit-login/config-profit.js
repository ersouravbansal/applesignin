const __version = "ver=8";
//let __jspath = 'https://stage-auth.ndtv.com/w/';
let __csspath = "https://s-cdn.ndtv.com/login-css/";
// let __jspath = 'http://localhost/login-git/login/login-sso/';
let __jspath = "http://local.ndtv.com:5500/login-sso/";

function includeJS(jsFile) {
  $("head").append(
    $("<script>")
      .attr("type", "text/javascript")
      .attr("src", __jspath + "dist/" + jsFile + "?" + __version)
  );
}
function _loginloadScript(url) {
  url = url + "?" + __version;
  return new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.onload = function () {
      resolve(url);
    };
    script.onerror = function () {
      reject(url);
    };
    document.body.appendChild(script);
  });
}
function _loginloadScriptThird(url) {
  url = url;
  return new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.onload = function () {
      resolve(url);
    };
    script.onerror = function () {
      reject(url);
    };
    document.body.appendChild(script);
  });
}
const __qsF = (function (e) {
  if (e == "") {
    return {};
  }
  var t = {};
  for (var n = 0; n < e.length; ++n) {
    var r = e[n].split("=");
    if (r.length != 2) {
      continue;
    }
    t[r[0]] = decodeURIComponent(r[1].replace(/\+/g, " "));
  }
  return t;
})(window.location.search.substr(1).split("&"));
if (__qsF["ssologin"] == 1) {
  includeJS("localstorage.js");
} else {
  function _loginloadCss(url) {
    url = url + "?" + __version;
    return new Promise((resolve, reject) => {
      let link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = () => {
        resolve();
        console.log("style has loaded");
      };
      link.href = url;

      let headScript = document.querySelector("script");
      headScript.parentNode.insertBefore(link, headScript);
    });
  }
  function __getLoginParams(target_id) {
    var getVars = {};
    if (document.getElementById(target_id)) {
      var queryString = document
        .getElementById(target_id)
        .getAttribute("src")
        .split("?")
        .pop()
        .split("&");
      for (var i = 0; i < queryString.length; i++) {
        var keyVal = queryString[i].split("=");
        getVars[keyVal[0]] = keyVal[1];
      }
    }
    return getVars;
  }
  let __cssFile = "";
  var __scriptVarObj = __getLoginParams("__loginScript");

  switch (__scriptVarObj["site"]) {
    case "ndtv":
      if (__scriptVarObj["mobile"] == 1) {
        __cssFile = __csspath + "ndtv-login-WAP.css";
      } else {
        __cssFile = __csspath + "ndtv-login.css";
      }
      break;
    case "ndtvin":
      if (__scriptVarObj["mobile"] == 1) {
        __cssFile = __csspath + "ndtvin-login-WAP.css";
      } else {
        __cssFile = __csspath + "ndtvin-login.css";
      }
      break;
    case "ndtvgames":
      __cssFile = __csspath + "ndtvgames-login.css";
      break;
    case "food":
      __cssFile = __csspath + "food-login.css";
      break;
    case "swirlster":
      __cssFile = __csspath + "swirlster-login.css";
      break;
    case "sports":
      __cssFile = __csspath + "sports-login.css";
      break;
    case "doctor":
      __cssFile = __csspath + "doctor-login.css";
      break;
    case "entertainment":
      if (__scriptVarObj["mobile"] == 1) {
        __cssFile = __csspath + "entertainment-login-WAP.css";
      } else {
        __cssFile = __csspath + "entertainment-login.css";
      }
      break;
  }

  if (__cssFile != "") {
    _loginloadCss(__cssFile)
      .then(() => {
        includeJS("front-profit-stage-login.js");
      })
      .catch(function (script) {
        console.log("css not loaded");
      });
  } else {
    includeJS("stage-login-profit.js");
  }
}
