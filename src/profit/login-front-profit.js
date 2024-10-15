import login from "../html/login-after.html";
import { Amplify, urlSafeDecode } from "@aws-amplify/core";
// import appleSignin from 'apple-signin-auth';
import Auth, { CognitoUser } from "@aws-amplify/auth";
import {
  CognitoAccessToken,
  CognitoUserSession,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

window.onload = function () {
    console.log("hello world!")
    _loginloadScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js")
}


// const options = {
//     clientID: 'com.company.app', // Apple Client ID
//     redirectUri: 'http://localhost:3000/auth/apple/callback',
//     // OPTIONAL
//     state: 'state', // optional, An unguessable random string. It is primarily used to protect against CSRF attacks.
//     responseMode: 'query' | 'fragment' | 'form_post', // Force set to form_post if scope includes 'email'
//     scope: 'email' // optional
//   };
// window.onload = function () {
//     console.log("hello world!")
//     _loginloadScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js")
// }
console.log("hello sourav from login-front-profit.js");
let _lconfdata = process.env; /* get config data */
let __profit_auth_url = _lconfdata.PROFIT_AUTH_KEY;
let __l_cognitoUser = {};
let __l_remailF =
  /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,25})+$/;
let __gtmData = true;
let __gtmType = "manual";
function console_data(val) {
  if (true) {
    console.log(val);
  }
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}

var params = getUrlVars();

/* get # params from url */
function getParams(url) {
  var regex = /[#&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
}

/* set token after login redirect */
let __l_getParams = getParams(window.location.href);
console.log(window.location.href);

function __removeLocalData() {
  localStorage.removeItem("sso_access_token");
  localStorage.removeItem("sso_refresh_token");
  __eraseCookie_uid("sso_access_token");
  __eraseCookie_uid("sso_refresh_token");
}

const getLoginUser = async (pageload) => {
  let getAtoken = localStorage.getItem("sso_access_token");
  console.log(getAtoken);
  await fetch(`${__profit_auth_url}/v1/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAtoken}`,
    },
    json: true,
  })
    .then((response) => {
      if (response.status == 200) {
        response.json();
      } else {
        return false;
      }
    })
    .then((data) => {
      if (data !== false) {
        console.log(data);
        document.querySelector(".__nlogin").innerHTML = login;
        addClasses(".log_btn", "log_btn-act");
        document.querySelector(".afterLogin").style.display = "block";
        localStorage.setItem("islogin", 1);
        if (pageload === true) {
          window.history.pushState(
            {},
            document.title,
            window.location.href.split("?")[0]
          );
        }
      }
    });
};

const loginViaCognito = async (payload, accessToken) => {
  await fetch(`${__profit_auth_url}/v1/auth/cognito-tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-app-client-id": _lconfdata.AUTH_CLIENT_KEY,
      "x-app-client-redirecturl":
        "http://localhost/test/profit-login/sso-one-tap.html",
      "x-app-client-secret": _lconfdata.AUTH_SECRET_KEY,
    },
    body: JSON.stringify(payload),
    json: true,
  })
    .then((response) => {
      if (response.status == 200 || response.status == 201) {
        return response.json();
      } else {
        return false;
      }
    })
    .then((data) => {
      if (data !== false) {
        localStorage.setItem("sso_access_token", data.tokens.accessToken);
        getLoginUser(false);
        let keyName = __l_cognitoUser.userDataKey.replace(".userData", "");
        deleteLocalStorage(keyName);
      }
    });
};

const getToken = async () => {
  let client_key = "ad481d08-349a-4295-b6af-9ca9300d83f0";
  let client_secret =
    "$2a$10$ubyHy2lD7BJq8A3Oo.2nxOo.x3S6QWKbXaBAdsUn88KZa/KM5475O";
  let loginurl = "http://localhost/test/profit-login/sso-one-tap.html";
  if (1) {
    client_key = "a305b91a-a843-4f97-9f0e-a7171eaf6e05";
    client_secret =
      "$2a$10$r11XuQTAQQFkq/igTkZW9eq3cJWNpRIiKkjGhBTNeUbEuiEf8cB8u";
    loginurl = "https://drop.ndtv.com/test/profit-login/sso-profit.html";
  }
  let payload = {};
  payload.authorizationCode = params["authorizationCode"];
  console.log(payload);
  await fetch(`${__profit_auth_url}/v1/auth/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-client-id": client_key,
      "x-app-client-redirecturl": loginurl,
      "x-app-client-secret": client_secret,
    },
    credentials: "include",
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message == "Login Success") {
        localStorage.setItem("sso_access_token", data.accessToken);
        localStorage.setItem("sso_refresh_token", data.refreshToken);
        __setCookie_uid("sso_access_token", data.accessToken);
        __setCookie_uid("sso_refresh_token", data.refreshToken);
        getLoginUser(true);
      }
    });
};

if (params["authorizationCode"]) {
  getToken();
} else {
  getLoginUser(false);
}

if (__l_getParams["action"] != "") {
  if (__l_getParams["action"] == "add") {
    let kn = __l_getParams["kn"];
    let tokens = JSON.parse(window.atob(kn));
    let fromlogin = __l_getParams["from"] || "";
    localStorage.setItem("__fromlogin", fromlogin);
    cognitoSessionLogin(tokens);
    window.history.pushState(
      {},
      document.title,
      window.location.href.split("#")[0]
    );
    //window.location.href = window.location.href.split('#')[0];
  }
}

function __gtmDataSet(username, type, ltype = "manual") {
  let nnum = "";
  if (type == "email") {
    nnum = normalizeEmail(username);
  } else {
    nnum = username;
  }

  sha256(nnum).then((data_ee) => {
    if (
      window.dataLayer.find((element) => element["gtm.start"]) &&
      __gtmData === true
    ) {
      __gtmData = false;
      let __md5 = __MD5(data_ee.toString());
      dataLayer.push({
        event: "login_success",
        login_type: ltype, //Pass the type of login eg., manual, login_by_google, login_by_facebook, etc
        //'user_type': '{{dynamic}}', //Pass the type of user eg., existing or new
        user_ID: __md5, //Pass the unique user identifier
        user_status: "logged_in", //Pass the user status eg., logged_in, guest
      });
    }
  });
}

function cognitoSessionLogin(tokens) {
  if (!tokens.hasOwnProperty("AccessToken")) {
    Object.keys(tokens).forEach(function (key) {
      if (key.includes(".accessToken")) {
        tokens["AccessToken"] = tokens[key];
      } else if (key.includes(".idToken")) {
        tokens["IdToken"] = tokens[key];
      } else if (key.includes(".refreshToken")) {
        tokens["RefreshToken"] = tokens[key];
      }
    });
  }
  let userinfo = parseJwt(tokens.AccessToken);

  const IdToken = new CognitoIdToken({ IdToken: tokens.IdToken });
  const AccessToken = new CognitoAccessToken({
    AccessToken: tokens.AccessToken,
  });
  const RefreshToken = new CognitoRefreshToken({
    RefreshToken: tokens.RefreshToken,
  });

  const sessionData = {
    IdToken: IdToken,
    AccessToken: AccessToken,
    RefreshToken: RefreshToken,
  };

  const userSession = new CognitoUserSession(sessionData);
  const userPool = new CognitoUserPool({
    UserPoolId: _lconfdata.USER_POOL_ID,
    ClientId: _lconfdata.CLIENT_ID,
  });
  const userData = {
    Username: userinfo.username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  cognitoUser.setSignInUserSession(userSession);

  cognitoUser.getSession(function (err, session) {
    if (session.isValid()) {
      /*Auth.currentAuthenticatedUser().then(data => {
                if(data.attributes.email_verified == true) {
                    __gtmDataSet(userinfo.username,'email');
                } else if(data.attributes.phone_number_verified == true) {
                    __gtmDataSet(userinfo.username,'mobile');
                }                
            })*/
      __loginInit();
    } else {
      console.log(err);
    }
  });
}

function addClasses(selector, classnm) {
  console.log(selector, classnm);
  let querySelector = document.querySelector(selector);
  if (typeof querySelector != "undefined" || typeof querySelector != null) {
    document
      .querySelectorAll(selector)
      .forEach((element) => element.classList.add(classnm));
    //querySelector.classList.add(classnm);
  }
}

function removeClasses(selector, classnm) {
  let querySelector = document.querySelector(selector);
  console.log(querySelector);
  querySelector.classList.remove(classnm);
}

function afterLogin() {
  addClasses(".log_btn", "log_btn-act");
  document.getElementById("unm").innerHTML = displayName(__l_cognitoUser);
  document.querySelector(".afterLogin").style.display = "block";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  response.site_domain = location.hostname;
  // Here we can do whatever process with the response we want
  // Note that response.credential is a JWT ID token

  //console.log("Encoded JWT ID token: " + response.credential);
  //window.identity = parseJwt(response.credential);
  //console.log(window.identity);
  //aud ==> our google client id

  fetch(_lconfdata.API_LOGIN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  })
    .then((response) => response.json())
    .then((data) => {
      let userinfo = parseJwt(data.AccessToken);
      const IdToken = new CognitoIdToken({ IdToken: data.IdToken });
      const AccessToken = new CognitoAccessToken({
        AccessToken: data.AccessToken,
      });
      const RefreshToken = new CognitoRefreshToken({
        RefreshToken: data.RefreshToken,
      });

      const sessionData = {
        IdToken: IdToken,
        AccessToken: AccessToken,
        RefreshToken: RefreshToken,
      };
      const userSession = new CognitoUserSession(sessionData);
      const userPool = new CognitoUserPool({
        UserPoolId: _lconfdata.USER_POOL_ID,
        ClientId: _lconfdata.CLIENT_ID,
      });
      const userData = {
        Username: userinfo.username,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);
      cognitoUser.setSignInUserSession(userSession);
      cognitoUser.getSession(function (err, session) {
        if (session.isValid()) {
          //__gtmDataSet(userinfo.username,'email','google_one_tap');
          __gtmType = "google_one_tap";
          __loginInit();
        } else {
          console.log(err);
        }
      });
    });
}

function __MD5(r) {
  let o,
    e,
    n,
    f = [
      -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426,
      -1473231341, -45705983, 1770035416, -1958414417, -42063, -1990404162,
      1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632,
      643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
      568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784,
      1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556,
      -1530992060, 1272893353, -155497632, -1094730640, 681279174, -358537222,
      -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
      -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606,
      -1051523, -2054922799, 1873313359, -30611744, -1560198380, 1309151649,
      -145523070, -1120210379, 718787259, -343485551,
    ],
    t = [(o = 1732584193), (e = 4023233417), ~o, ~e],
    c = [],
    a = unescape(encodeURI(r)) + "\u0080",
    d = a.length;
  for (r = (--d / 4 + 2) | 15, c[--r] = 8 * d; ~d; )
    c[d >> 2] |= a.charCodeAt(d) << (8 * d--);
  let i = 0;
  for (i = a = 0; i < r; i += 16) {
    for (
      d = t;
      64 > a;
      d = [
        (n = d[3]),
        o +
          (((n =
            d[0] +
            [(o & e) | (~o & n), (n & o) | (~n & e), o ^ e ^ n, e ^ (o | ~n)][
              (d = a >> 4)
            ] +
            f[a] +
            ~~c[i | (15 & [a, 5 * a + 1, 3 * a + 5, 7 * a][d])]) <<
            (d = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][
              4 * d + (a++ % 4)
            ])) |
            (n >>> -d)),
        o,
        e,
      ]
    )
      (o = 0 | d[1]), (e = d[2]);
    for (a = 4; a; ) t[--a] += d[a];
  }
  for (r = ""; 32 > a; )
    r += ((t[a >> 3] >> (4 * (1 ^ a++))) & 15).toString(16);
  return r;
}

// for GTM anf uid2 hash
const sha256 = async (data, type = "gtm") => {
  const textAsBuffer = new TextEncoder().encode(data);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  if (type == "uid2") {
    const binString = Array.from(hashArray, (x) =>
      String.fromCodePoint(x)
    ).join("");
    return btoa(binString);
  } else {
    const digest = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return digest;
  }
};

async function Login() {
  console_data("isLogin");
  let nunm = "";
  await Auth.currentAuthenticatedUser()
    .then((data) => {
      console.log("after login");
      let cognitoUser = data;
      console.log(data);
      let paylod = {};
      if (data.attributes.email_verified === true) {
        paylod.email = data.attributes.email;
        loginViaCognito(paylod, data.signInUserSession.accessToken.jwtToken);
        let normalizeEmailVal = normalizeEmail(data.attributes.email);
        sha256(normalizeEmailVal, "uid2").then((uidhash) => {
          __setCookie_uid("__uid2", uidhash.toString(), "3");
        });
        __setCookie_uid("__uid2type", "email", "3");
        nunm = normalizeEmailVal;
      } else if (data.attributes.phone_number_verified === true) {
        paylod.mobile = data.attributes.phone_number;
        loginViaCognito(paylod, data.signInUserSession.accessToken.jwtToken);
        let normalizeMob = data.attributes.phone_number;
        sha256(normalizeMob, "uid2").then((uidhash) => {
          __setCookie_uid("__uid2", uidhash.toString(), "3");
        });
        __setCookie_uid("__uid2type", "mobile", "3");
        nunm = normalizeMob;
      }

      sha256(nunm).then((data_e) => {
        if (
          window.dataLayer.find((element) => element["gtm.start"]) &&
          __gtmData === true
        ) {
          let __md5 = __MD5(data_e.toString());
          let access_token_data = parseJwt(
            data.signInUserSession.accessToken.jwtToken
          );
          let current_time = Math.floor(Date.now() / 1000);

          if (current_time - access_token_data.auth_time <= 10) {
            let __fromlogin = localStorage.getItem("__fromlogin");

            if (data.attributes.email_verified == true) {
              if (__fromlogin == "googleonetap") {
                __gtmType = "google_one_tap";
              }
              __gtmDataSet(access_token_data.username, "email", __gtmType);
            } else if (data.attributes.phone_number_verified == true) {
              __gtmDataSet(access_token_data.username, "mobile");
            } else {
              let identities = JSON.parse(data.attributes.identities);
              if (identities[0]["providerName"] == "Google") {
                let semail = cognitoUser.attributes.email;
                __gtmDataSet(
                  semail.replace("@", "#"),
                  "email",
                  "login_by_google"
                );
              } else if (identities[0]["providerName"] == "Facebook") {
                let semail = cognitoUser.attributes.email;
                __gtmDataSet(
                  semail.replace("@", "#"),
                  "email",
                  "login_by_facebook"
                );
              }
            }
          } else {
            dataLayer.push({
              user_ID: __md5, // user id should be unique value for each user
              user_status: "logged_in", // guest, logged_in
            });
            __gtmData = false;
          }
        }
      });

      document.querySelector(".__nlogin").innerHTML = login;
      __l_cognitoUser = data;
      afterLogin();
      //addGAcb();
      addDomain();
    })
    .catch((error) => {
      console.log(error);
      if (window.dataLayer.find((element) => element["gtm.start"])) {
        dataLayer.push({
          user_status: "guest", // guest, logged_in
        });
      }
      console.log("error in login");
      if (
        location.hostname == "localhost" ||
        location.hostname == "www.ndtv.com" ||
        location.hostname == "ndtv.com" ||
        location.hostname == "ndtv.in" ||
        location.hostname == "food.ndtv.com" ||
        location.hostname == "sports.ndtv.com" ||
        location.hostname == "webapps.ndtv.com" ||
        location.hostname == "stage-food.ndtv.com" ||
        location.hostname == "stage82-www.ndtv.com"
      ) {
        setTimeout(function () {
          window
            ._loginloadScript("https://accounts.google.com/gsi/client")
            .then(function () {
              window.onload = function () {
                google.accounts.id.initialize({
                  client_id: _lconfdata.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
                  auto_select: false,
                  itp_support: true,
                  site_domain: location.hostname,
                  nonce: "Ndtv@6789o",
                  theme: "filled_blue",
                  size: "large",
                  text: "signin_with",
                  shape: "circle",
                  cancel_on_tap_outside: false,
                  callback: handleCredentialResponse, // We choose to handle the callback in client side, so we include a reference to a function that will handle the response
                });
                // You can skip the next instruction if you don't want to show the "Sign-in" button
                //google.accounts.id.renderButton(
                //    document.getElementById("buttonDiv"), // Ensure the element exist and it is a div to display correcctly
                //    { theme: "outline", size: "large" }  // Customization attributes
                //);
                google.accounts.id.prompt(); // Display the One Tap dialog
              };
            })
            .catch(function (script) {
              console.log(script + " failed to load");
            });
        }, 50);
      }
    });
}

function __loginInit() {
  const oauth = {
    domain: _lconfdata.AWS_COGNITO_DOMAIN,
    scope: [
      "phone",
      "email",
      "profile",
      "openid",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: _lconfdata.SIGN_IN_URL,
    redirectSignOut: _lconfdata.SIGN_OUT_URL,
    responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
    options: {
      AdvancedSecurityDataCollectionFlag: false,
    },
  };
  if (typeof __domain !== "undefined") {
    _lconfdata.DOMAIN = __domain;
  }

  Amplify.configure({
    Auth: {
      oauth: oauth,
      region: _lconfdata.REGION,
      userPoolId: _lconfdata.USER_POOL_ID,
      userPoolWebClientId: _lconfdata.CLIENT_ID,
      mandatorySignIn: true,
      authenticationFlowType: "CUSTOM_AUTH",
    },
  });
  //__lshowLoginHtml();
  Login();
}

__loginInit();

jQuery("body").on("click", "._signoutv", function () {
  console_data("_signoutv");
  try {
    __eraseCookie_uid("__uid2");
    __eraseCookie_uid("__uid2type");
    __removeLocalData();
    signoutAll();
    signOutglobal();
  } catch (error) {
    console_data("parent.location.reload()");
    parent.location.reload();
  }
});

async function signoutAll() {
  let loginurl = "http://localhost/test/profit-login/sso-profit.html";
  let client_key = "ad481d08-349a-4295-b6af-9ca9300d83f0";
  let client_secret =
    "$2a$10$ubyHy2lD7BJq8A3Oo.2nxOo.x3S6QWKbXaBAdsUn88KZa/KM5475O";
  let __rurl = window.location.href;
  window.location.href =
    loginurl +
    "?action=logout&client_id=" +
    client_key +
    "&client_secret=" +
    client_secret +
    "&siteurl=" +
    encodeURIComponent(__rurl);
}

async function signOutglobal() {
  console_data("signOutglobal");
  let keyName = __l_cognitoUser.userDataKey.replace(".userData", "");

  try {
    jQuery("._signoutv").remove();
    deleteLocalStorage(keyName);
    await Auth.signOut({});
    window.location.href =
      _lconfdata.SIGN_IN_URL +
      "?action=logout&siteurl=" +
      encodeURIComponent(window.location.href);
  } catch (error) {
    console.log(error);
    console_data("logout error");
    //window.location.reload();
  }
}

function deleteLocalStorage(keynm) {
  console_data("deleteLocalStorage");
  window.localStorage.removeItem(keynm + ".accessToken");
  window.localStorage.removeItem(keynm + ".refreshToken");
  window.localStorage.removeItem(keynm + ".idToken");
  window.localStorage.removeItem(keynm + ".clockDrift");
  window.localStorage.removeItem(keynm + ".userData");
}

function parent_c_islogin() {
  if (
    typeof __l_cognitoUser.username !== "undefined" ||
    localStorage.getItem("sso_access_token")
  ) {
    return true;
  } else {
    return false;
  }
}

function displayName(userObj) {
  let shwNm = "";
  document.querySelector(".afterLogin .vj_icn").style.display = "none";
  if (
    typeof userObj.attributes.name !== "undefined" &&
    userObj.attributes.name != ""
  ) {
    shwNm = userObj.attributes.name;
  } else if (
    (typeof userObj.attributes.given_name !== "undefined" &&
      userObj.attributes.given_name != "") ||
    (typeof userObj.attributes.family_name !== "undefined" &&
      userObj.attributes.family_name != "")
  ) {
    shwNm =
      userObj.attributes.given_name + " " + userObj.attributes.family_name;
  } else if (
    (typeof userObj.attributes["custom:fname"] !== "undefined" &&
      userObj.attributes["custom:fname"] != "") ||
    (typeof userObj.attributes["custom:lname"] !== "undefined" &&
      userObj.attributes["custom:lname"] != "")
  ) {
    shwNm =
      userObj.attributes["custom:fname"] +
      " " +
      userObj.attributes["custom:lname"];
  } else {
    document.querySelector(".afterLogin .vj_icn").style.display = "show";
    shwNm = userObj.username;
    if (userObj.username.includes("facebook_")) {
      shwNm = userObj.attributes.name;
    } else if (userObj.username.includes("google_")) {
      shwNm = userObj.attributes.email;
      addClasses(".afterLogin .vj_icn", "vj_mail-new");
      removeClasses(".afterLogin .vj_icn", "vj_smartphone");
      document.querySelector(".afterLogin").innerHTML =
        '<use xlink:href="#vj_mail-new"></use>';
    } else if (userObj.username.includes("signinwithapple_")) {
      shwNm = userObj.attributes.email;
      addClasses(".afterLogin .vj_icn", "vj_mail-new");
      removeClasses(".afterLogin .vj_icn", "vj_smartphone");
      document.querySelector(".afterLogin").innerHTML =
        '<use xlink:href="#vj_mail-new"></use>';
    } else if (userObj.username.includes("#")) {
      shwNm = userObj.username.replace("#", "@");
      if (userObj.username.includes("@") === false) {
        removeClasses(".afterLogin .vj_icn", "vj_mail-new");
        addClasses(".afterLogin .vj_icn", "vj_smartphone");
        document.querySelector(".afterLogin .vj_icn").innerHTML =
          '<use xlink:href="#vj_smartphone"></use>';
      } else {
        addClasses(".afterLogin .vj_icn", "vj_mail-new");
        removeClasses(".afterLogin .vj_icn", "vj_smartphone");
        document.querySelector(".afterLogin .vj_icn").innerHTML =
          '<use xlink:href="#vj_mail-new"></use>';
      }
    }
  }
  return shwNm;
}

/* update user data */
async function genUpdateUser(fnm, fval) {
  if (fnm != "") {
    let ObjectArr = {};
    ObjectArr[fnm] = fval;
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, ObjectArr);
  }
}

async function addGAcb() {
  let userAttr = await Auth.currentAuthenticatedUser();
  if (
    !("custom:gacookie" in userAttr["attributes"]) &&
    __l_getCookie("_ga") != ""
  ) {
    genUpdateUser("custom:gacookie", __l_getCookie("_ga"));
  }
  if (
    !("custom:cbcookie" in userAttr["attributes"]) &&
    __l_getCookie("_cb") != ""
  ) {
    genUpdateUser("custom:cbcookie", __l_getCookie("_cb"));
  }
}

async function addDomain() {
  let userAttr = await Auth.currentAuthenticatedUser();
  if (
    !("custom:signup_domain" in userAttr["attributes"]) &&
    location.hostname != "localhost" &&
    location.hostname != "stage-auth.ndtv.com" &&
    location.hostname != "auth.ndtv.com"
  ) {
    genUpdateUser("custom:signup_domain", location.hostname);
  } else if (
    userAttr["attributes"]["custom:signup_domain"] == "auth.ndtv.com"
  ) {
    genUpdateUser("custom:signup_domain", location.hostname);
  }
}

function normalizeEmail(email) {
  let splitEmail = email.split("@");
  let name = splitEmail[0].replaceAll(".", "").replaceAll("+", "");
  let nomemail = name + "@" + splitEmail[1];
  return nomemail.toLowerCase();
}

function __setCookie_uid(key, value, expiry) {
  let expires = new Date();
  expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
  document.cookie =
    key +
    "=" +
    value +
    ";domain=" +
    location.hostname +
    ";Secure;HttpOnly;expires=" +
    expires.toUTCString() +
    ";path=/";
}

function __getCookie_uid(key) {
  let keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}

function __eraseCookie_uid(key) {
  let keyValue = __getCookie_uid(key);
  __setCookie_uid(key, keyValue, "-1");
}

window.parent_c_islogin = parent_c_islogin;
