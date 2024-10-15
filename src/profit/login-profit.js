
const refrerHostnm = document.referrer.split('/')[2];
const defaultRedirect = 'https://www.ndtv.com/';
const hostnm = ['local.ndtv.com','localhost',
                'stage-auth.ndtv.com',
                'stage-www.ndtv.com',
                'stage-www.ndtv.in',
                'dev.sports.ndtv.com',
                'stage.ndtvgames.com',
                'stage-mpcg.ndtv.in',
                'stage-rajasthan.ndtv.in',
                'stage-swirlster.ndtv.com',
                'stage-food.ndtv.com',
                'sports.ndtv.com',
                'ndtv.com',
                'swirlster.ndtv.com',
                'ndtv.in',                
                'mpcg.ndtv.in',
                'food.ndtv.com',
            ];

/*if(!hostnm.includes(refrerHostnm)) {
    window.location.href = defaultRedirect;        
} */
console.log(refrerHostnm);
import './../css/login_form.css'
import login from './../html/login.html'
window.onload = function () {
    console.log("hello world!")
    _loginloadScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js")
}
/* for params access */
const qs = function (e) {if (e == "") {return {}}var t = {};for (var n = 0; n < e.length; ++n) {var r = e[n].split("=");if (r.length != 2) {continue;}t[r[0]] = decodeURIComponent(r[1].replace(/\+/g, " "));}return t;}(window.location.search.substr(1).split("&"));
let __client_id = qs['client_id'] || '';
let __client_secret = qs['client_secret'] || ''
let __redirect_url = qs['siteurl'] || '';
if(__client_id == '' || __client_secret == '') {
    console_data('Add client id or client secret');
} else {
    localStorage.setItem('redirectUrl',__redirect_url);
    localStorage.setItem("client_id",__client_id);
    localStorage.setItem("client_secret",__client_secret);
}



let __l_siteurl = '';
let _lconfdata = process.env; /* get config data */
let __profit_auth_url = _lconfdata.PROFIT_AUTH_KEY;
let __pre_auth_id = '';



const logoutViaProfit = async () => {
    fetch(`${__profit_auth_url}/v1/auth/logout`, {
        headers: {
          "Content-Type": "application/json",
          "x-app-client-secret": `${__client_secret}`,
          "x-app-client-id": `${__client_id}`,
          "x-app-client-redirecturl": `${__redirect_url}`,
        },
        method: "POST",
        credentials: "include",
      })
        .then((response) => {
          if (response.status === 204) {
            redirectUseronLogout("success", __redirect_url);
          } else {
            redirectUseronLogout("failure", __redirect_url);
          }
        })
        .catch((error) => {
          redirectUseronLogout("failure", __redirect_url);
          // console.error("Unable to logout", error);
        });
}

const googleOauthLogin = async (payload) => {
    const responseIntermediate = await fetch(
        `${__profit_auth_url}/v1/auth/signinup/google`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-app-client-id": localStorage.getItem("client_id"),
            "x-app-client-secret": localStorage.getItem("client_secret"),
            "x-app-client-redirecturl": localStorage.getItem("redirectUrl"),
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify(payload),
        }
    );

    let response = await responseIntermediate.json();
    if (responseIntermediate.status === 201) {
        try {
            const authorizationResponse = await getAuthorizationToken();
            console.log(authorizationResponse);
            if (authorizationResponse.success) {                
                onSuccessfulLogin(authorizationResponse.authCode, localStorage.getItem('redirectUrl'));
            } 
          //await socialLoginCallback(response, isInitiatorClient);
        } catch {
          console.log("socialLoginCallback function failed");
          
        }
    }
}

if(qs['code']) {
    let  payload = {
        credential: null,
        authorization_code: qs['code'] ?? null,
        device_type: "web",
      };
      googleOauthLogin(payload);  
    
} else if(qs['action'] == 'logout') {
    logoutViaProfit();
}
/*if(typeof qs['siteurl'] != 'undefined' && qs['siteurl'] != '') {    
    __l_siteurl = decodeURIComponent(qs['siteurl']);
    localStorage.setItem('siteurl',__l_siteurl);    
}

if(qs['action'] == 'logout' || qs['logout'] == 1) {   
    await Auth.signOut({});    
    if(__l_siteurl == '') {
        __l_siteurl = localStorage.getItem('siteurl');                
    }
    window.localStorage.clear();
    localStorage.setItem('siteurl', __l_siteurl);
    if(typeof qs['siteurl'] != 'undefined' && qs['siteurl'] != '') {
        window.location.href =  decodeURIComponent(qs['siteurl']);
    } else {
        window.location.href =  __l_siteurl;
    }    
}
*/
/*if(qs['logout'] == 1) {
    __l_siteurl = localStorage.getItem('siteurl');
    window.location.href =  __l_siteurl;
}*/

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {    
    response.site_domain = location.hostname;
    // Here we can do whatever process with the response we want
    // Note that response.credential is a JWT ID token
    console.log(response);
    console.log("Encoded JWT ID token: " + response.credential);
    //window.identity = parseJwt(response.credential);
    //console.log(window.identity);
    //aud ==> our google client id

    fetch(_lconfdata.API_LOGIN_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(response)
    }).then(response => response.json()).then((data)=>{ 
        console.log(data);       
        let userinfo = parseJwt(data.AccessToken); 
        const IdToken = new CognitoIdToken({IdToken: data.IdToken});
        const AccessToken = new CognitoAccessToken({AccessToken: data.AccessToken});
        const RefreshToken = new CognitoRefreshToken({RefreshToken: data.RefreshToken});

        const sessionData = {
            IdToken: IdToken,
            AccessToken: AccessToken,
            RefreshToken: RefreshToken
        }        
        const userSession = new CognitoUserSession(sessionData);
        const userPool = new CognitoUserPool({UserPoolId: _lconfdata.USER_POOL_ID, ClientId: _lconfdata.CLIENT_ID});
        const userData = {
            Username: userinfo.username,
            Pool: userPool
        }  

        const cognitoUser = new CognitoUser(userData);
        cognitoUser.setSignInUserSession(userSession);
        cognitoUser.getSession(function(err,session){
            if(session.isValid()) { 
                console.log(cognitoUser);
                __l_cognitoUser = cognitoUser;               
                window.location.href =  __l_siteurl+'#action=add&kn='+getTokenString(); 
            } else {
                console.log(err);
            }
        })               
    })
}

async function isUserlogin() {    
    try {   
        const data = await Auth.currentAuthenticatedUser();
        __l_cognitoUser = data;
        
        if(__l_siteurl == '') {
            __l_siteurl = localStorage.getItem('siteurl');                
        }    
        getTokenString();    
        window.location.href =  __l_siteurl+'#action=add&kn='+getTokenString();
        return true;
    } catch(error) {
        /*
        //setTimeout(function(){                
            window._loginloadScript('https://accounts.google.com/gsi/client').then(function(){                
                window.onload = function(){                             
                    google.accounts.id.initialize({
                        client_id: _lconfdata.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
                        auto_select: false,
                        itp_support: true,
                        site_domain: location.hostname,
                        nonce: 'Ndtv@6789o',
                        theme: "filled_blue",
                        size: 'large',
                        text: 'signin_with',
                        shape: 'circle',
                        cancel_on_tap_outside:false,
                        callback: handleCredentialResponse // We choose to handle the callback in client side, so we include a reference to a function that will handle the response
                    });
                    // You can skip the next instruction if you don't want to show the "Sign-in" button
                    //google.accounts.id.renderButton(
                    //    document.getElementById("buttonDiv"), // Ensure the element exist and it is a div to display correcctly
                    //    { theme: "outline", size: "large" }  // Customization attributes
                    //);
                    google.accounts.id.prompt(); // Display the One Tap dialog
            }
            }).catch(function(script) {
                console.log(script + ' failed to load');
            })
        //}, 1000);
        */

        console.log('isUserlogin',error);        
        return false;
    }
}

if(qs['logout'] == 1) {
    isUserlogin();
}

function getTokenString() {
    console.log(__l_cognitoUser);
    let datastore = {}
    let keynm = __l_cognitoUser.userDataKey;
    let keyprfx = __l_cognitoUser.keyPrefix;
    keynm = keynm.replace('.userData','');
    datastore[keynm+'.accessToken'] = __l_cognitoUser.storage[keynm+'.accessToken'];
    datastore[keynm+'.clockDrift'] = __l_cognitoUser.storage[keynm+'.clockDrift'];
    datastore[keynm+'.idToken'] = __l_cognitoUser.storage[keynm+'.idToken'];
    datastore[keynm+'.refreshToken'] = __l_cognitoUser.storage[keynm+'.refreshToken'];
    datastore[keyprfx+'.LastAuthUser'] = __l_cognitoUser.storage[keyprfx+'.LastAuthUser'];

    datastore['AccessToken'] = __l_cognitoUser.storage[keynm+'.accessToken'];    
    datastore['IdToken'] = __l_cognitoUser.storage[keynm+'.idToken'];
    datastore['RefreshToken'] = __l_cognitoUser.storage[keynm+'.refreshToken'];
    datastore['LastAuthUser'] = __l_cognitoUser.storage[keyprfx+'.LastAuthUser'];

    let userdata = window.btoa(JSON.stringify(datastore));
    return userdata;
}

//isUserlogin();




function alert_data(val) {
    if(false) {
        alert(val);
    }
}

function console_data(val) {
    if(true) {
        console.log(val);
    }
}

var _LS = true;
let _LU = false;
/* check local storage enable or not */
function browsweDetect  () {
    console_data('detect browser');
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'opera';
    } else if (navigator.userAgent.indexOf("Edg") != -1) {
        return 'edge';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        return 'chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return 'safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        return 'firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
      return 'ie';
    } else {
        return 'no';
    }
}

if(browsweDetect() == 'safari'){
    _LS = false;
}

function getParams(url){
    console_data('getParams');
    var regex = /[#&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
    while(match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
}



/* for otp */
let BACKSPACE_KEY = 8;
let ENTER_KEY = 13;
let TAB_KEY = 9;
let LEFT_KEY = 37;
let RIGHT_KEY = 39;
let ZERO_KEY = 48;
let NINE_KEY = 57;
/* for otp */

let __is_LS = true;

var __l_remail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,25})+$/; 
var __l_rmobile = /^[6-9]\d{9}$/;
const __is_num = /^\d+$/;
const __l_rotp = /^\d{6}$/;
const __l_rpassw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
const __l_verifycode = /^\d{6}$/;
const __l_letter = /^[A-Za-z\s]+$/;
const __l_timersec = 30;
let __rurl = parent.location.href;
const __hostnm = location.hostname;
var __returnUrl = '';
let __usernm;
let __country_code = '+91';
let loginTxt = [];
let errorTxt = {};
let __lS_url = _lconfdata.CONFIG_URL+'localstorage.html';
loginTxt[0] = 'Manage your account, explore personalised content and discover our newsletters.'
loginTxt[1] = "We\’ll send you an OTP to verify"
loginTxt[2] = 'Or Continue with';
loginTxt[3] = 'Haven\'t received an OTP? Resend in <span id="__timer"></span>';
errorTxt['wrong_otp'] = 'This is invalid otp, Please try again';
errorTxt['input_blank'] = 'Insert Email or Mobile.';
errorTxt['otp_error'] = 'There was an error in sending the OTP. Please Try Again.';


if(__lang == 2) {

}

//  Define varibale outside js file //
if(typeof __lang === 'undefined') {
    var __lang = '';
}

if(typeof __socialLogin === 'undefined') {
    var __socialLogin = '';
}
// end // 
// get user country code //
let __country_json = {};
function getUserCountryCode() {
    console_data('getUserCountryCode');
    /*fetch("https://wapi.ndtv.com/geo.json").then(response => response.json())
    .then((data) => {
        __country_json = data;
        __country_code = jQuery("[data-countrycode="+__country_json.country+"]").children('.contry-cd').html();
        let __cm_validation = jQuery("[data-countrycode="+__country_json.country+"]").attr('data-validation');
        let regEx = new RegExp(__cm_validation);
        __l_rmobile = regEx;
        jQuery('#contry-code').html(__country_code+'<svg class="count-icn vj_icn vj_arrow-down"> <use xlink:href="#vj_arrow-down"></use></svg>');
    })*/

    let data = {
        "continent": "AS",
        "country": "IN",
        "region": "MH",
        "city": "MUMBAI",
        "pincode": "",
        "latitude": "18.98",
        "longitude": "72.83",
        "clientIP": "35.154.163.171"
    }
    __country_json = data;
        __country_code = jQuery("[data-countrycode="+__country_json.country+"]").children('.contry-cd').html();
        let __cm_validation = jQuery("[data-countrycode="+__country_json.country+"]").attr('data-validation');
        let regEx = new RegExp(__cm_validation);
        __l_rmobile = regEx;
        jQuery('#contry-code').html(__country_code+'<svg class="count-icn vj_icn vj_arrow-down"> <use xlink:href="#vj_arrow-down"></use></svg>');

}

function deleteLocalStorage(keynm) {
    console_data('deleteLocalStorage');    
    window.localStorage.removeItem(keynm+'.accessToken');
    window.localStorage.removeItem(keynm+'.refreshToken');
    window.localStorage.removeItem(keynm+'.idToken');
    window.localStorage.removeItem(keynm+'.clockDrift');
    window.localStorage.removeItem(keynm+'.userData');
}

function deleteSiteLocalStorage(){
    console_data('deleteSiteLocalStorage');
    let allKeys = Object.keys(window.localStorage);
    allKeys.find(function (element,k){
        (element.startsWith('CognitoIdentityServiceProvider')?window.localStorage.removeItem(element):'');
    })
}

function otp(elementId) {
    var inputs = document.querySelectorAll('.JsLogOtp_inp');
    console.log(inputs);
    var callback = null;
  
    function init(completeCallback) {
      callback = completeCallback;
      for (let i = 0; i < inputs.length; i++) {
        registerEvents(i, inputs[i]);
      }
    }
  
    function registerEvents(index, element) {
      element.addEventListener("input", function(ev) {
        onInput(index, ev);
      });
      element.addEventListener("paste", function(ev) {
        onPaste(index, ev);
      });
      element.addEventListener("keydown", function(ev) {
        onKeyDown(index, ev);
      });
    }
  
    function onPaste(index, ev) {
      ev.preventDefault();
      var curIndex = index;
      var clipboardData = ev.clipboardData || window.clipboardData;
      var pastedData = clipboardData.getData("Text");
      for (let i = 0; i < pastedData.length; i++) {
        if (i < inputs.length) {
          if (!isDigit(pastedData[i])) break;
          inputs[curIndex].value = pastedData[i];
          curIndex++;
        }
      }
      if (curIndex == inputs.length) {
        inputs[curIndex - 1].focus();
        callback(retrieveOTP());
      } else {
        inputs[curIndex].focus();
      }
    }
  
    function onKeyDown(index, ev) {
      var key = ev.keyCode || ev.which;
      if (key == LEFT_KEY && index > 0) {
        ev.preventDefault(); // prevent cursor to move before digit in input
        inputs[index - 1].focus();
      }
      if (key == RIGHT_KEY && index + 1 < inputs.length) {
        ev.preventDefault();
        inputs[index + 1].focus();
      }
      if (key == BACKSPACE_KEY && index > 0) {
        if (inputs[index].value == "") {
          // Empty and focus previous input and current input is empty
          inputs[index - 1].value = "";
          inputs[index - 1].focus();
        } else {
          inputs[index].value = "";
        }
      }
      if (key == ENTER_KEY) {
        // force submit if enter is pressed
        ev.preventDefault();
        if (isOTPComplete()) {
          callback(retrieveOTP());
        }
      }
      if (key == TAB_KEY && index == inputs.length - 1) {
        // force submit if tab pressed on last input
        ev.preventDefault();
        if (isOTPComplete()) {
          callback(retrieveOTP());
        }
      }
    }
  
    function onInput(index, ev) {
      var value = ev.data || ev.target.value;
      var curIndex = index;
      for (let i = 0; i < value.length; i++) {
        if (i < inputs.length) {
          if (!isDigit(value[i])) {
            inputs[curIndex].value = "";
            break;
          }
          inputs[curIndex++].value = value[i];
          if (curIndex == inputs.length) {
            if(isOTPComplete()) {
              callback(retrieveOTP());
            }
          } else {
            inputs[curIndex].focus();
          }
        }
      }
    }
  
    function retrieveOTP() {
      var otp = "";
      for (let i = 0; i < inputs.length; i++) {
        otp += inputs[i].value;
      }
      return otp;
    }
  
    function isDigit(d) {
      return d >= "0" && d <= "9";
    }
  
    function isOTPComplete() {
      var isComplete = true;
      var i = 0;
      while (i < inputs.length && isComplete) {
        if (inputs[i].value == "") {
          isComplete = false;
        }
        i++;
      }
      return isComplete;
    }
  
    return {
      init: init
    };
  }





let __l_loginredirect = true;
let __l_isUserLogin = false;

let attempts = 3; /* Set login attempt */
let resend_otp = '1';

function randomHash(format, length) {
    console_data('randomHash');
    let pool = "";
    switch (format) {
        case "alnum":
            pool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        break;
        default:
            return "";
    }
    let buf = "";
    for (let i = 0; i < length; i++) {
        buf += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    return buf;
}

function hideCss(htmlobj) {
    console_data('hideCss');
    jQuery(htmlobj).css('display','none');
}

function showCss() {
    console_data('showCss');
    jQuery(htmlobj).css('display','block');
}

function __l_redirect(){
    console_data('__l_redirect');
    if((location.hostname == 'stage-auth.ndtv.com' || location.hostname == 'auth.ndtv.com' || location.hostname == 'localhost')) {
            targetIframe.contentWindow.postMessage({sentinel: 'login',type: 'get-return-url-call',},'*');
            window.addEventListener('message',
            function(event) {
                if(event.data['sentinel'] == 'login' && event.data['type'] == 'get-return-url') {
                    let data = event.data.data;
                    for (let x in data) {
                        if(x == '__rurl_logout') {
                            let __rurl = data[x];
                            if(__l_loginredirect === true && __rurl != ''){
                                __l_loginredirect = false;
                                window.location.href = __rurl;
                            } 
                        }
                    }
                            
                }
            });
    }
}
    

if(qs['logout'] == 1) {
    __l_loginredirect = true;
    __l_redirect();
}

function __langText() {
    console_data('__langText');
    loginTxt.forEach(function(v,k){
        if(document.getElementById('__txt'+k)) {
            document.getElementById('__txt'+k).innerHTML = v    
        }
    })
}

function __lshowLoginHtml() {
    console_data('__lshowLoginHtml');    
    document.querySelector(".__nlogin").innerHTML = login;
    var otpModule = otp("otp-inputs");
    otpModule.init(function(passcode) {});
    getUserCountryCode();
    __langText();
}

function afterLogin() {
    console_data('afterLogin');
    jQuery('#unm').html(displayName(__l_cognitoUser));
    jQuery('.log_btn').addClass('log_btn-act');
    jQuery('.beforeLogin,.Log_trm,.Log_logo-wr').hide();
    jQuery('.afterLogin').show();
    jQuery('.sig_btn').hide();
    jQuery('.t-icn-lg').addClass('t-icn-lg_act');
    //jQuery('.__profile,#__profile').show().html(profileHtml);
    //greetingTime();
    //showProfileData();
}

function beforeLogin() {
    console_data('beforeLogin');
    jQuery('.log_btn').removeClass('log_btn-act');
    jQuery('.beforeLogin,.Log_trm,.Log_logo-wr').show();
    jQuery('.afterLogin').hide();
    jQuery('.sig_btn').css('display','inline-block');
    jQuery('.__otpsubmit').css('display','none');
    jQuery('#__inputDiv,.__inputDiv').css('display','block');
    jQuery('.LogSd_frm-lbl >span').html('');
    jQuery('#js_otp-verfy').css('display','none');
    jQuery('.__otpsubmit,#__otpsubmit').css('display','none');
    jQuery('#__submit').css('display','inline-block');



    //jQuery('.__profile,#__profile').hide().html('<b>User not logged in.</b>');
}

async function currentSession() {
    console_data('currentSession');
    try {
      const data = await Auth.currentSession();
    } catch(err) {
      console.log(err);
    }
};

async function isLogin() {
    console_data('isLogin');
    Auth.currentAuthenticatedUser().then(data => {
        //currentSession();
        //updateUser();
        resendOtp = 1;
        __l_cognitoUser = data;
        let jsonObj = {};
        let keyName = __l_cognitoUser.userDataKey.replace('.userData','');
        jsonObj[keyName+'.accessToken'] = __l_cognitoUser.signInUserSession.accessToken.jwtToken;
        jsonObj[keyName+'.idToken'] = __l_cognitoUser.signInUserSession.idToken.jwtToken;
        jsonObj[keyName+'.refreshToken'] = __l_cognitoUser.signInUserSession.refreshToken.token;
        jsonObj[keyName+'.clockDrift'] = __l_cognitoUser.signInUserSession.clockDrift;
        jsonObj[__l_cognitoUser.keyPrefix+'.LastAuthUser'] = __l_cognitoUser.storage[__l_cognitoUser.keyPrefix+'.LastAuthUser'];
        jsonObj[keyName+'.userData'] = __l_cognitoUser.storage[keyName+'.userData'];

        afterLogin();
        //__l_redirect();
        addGAcb();
        addDomain();
        _LU = true;
        
    }).catch(error => {
        beforeLogin();
        //return false;
    })
}

function __linit(){
    console_data('__linit');
    /*const _handleAuthResponse = Auth._handleAuthResponse.bind(Auth);

    Auth._handleAuthResponse = (url) => {
    const configuration = Auth.configure();
    if (!url.includes(configuration.oauth?.redirectSignIn)) return;
    return _handleAuthResponse(url);
    };*/
    
    __lshowLoginHtml();
    
    /*if(qs['social'] == 'google') {
        __googleLogin();
        jQuery('.cstm_ovrl').show();
    }
    if(qs['social'] == 'fb') {
        __fbLogin();
        jQuery('.cstm_ovrl').show();
    }
    if(qs['social'] == 'ios') {
        __appleLogin();
        jQuery('.cstm_ovrl').show();
    }*/
}

__linit();


function __appleLogin() {
    console_data('__appleLogin');
    // comment by sourav
    const user = Auth.federatedSignIn({
        provider: "SignInWithApple",
        customState: qs['url']
    }).then(user => {
          console.log(user);
    }).catch(error => {
          console.log(error);
    });
}

function __googleLogin() {
    console_data('__googleLogin');
    const user = Auth.federatedSignIn(
        {provider: "Google",
        customState: qs['url'] }
    ).then(user => {
          console.log(user);
    }).catch(error => {
          console.log(error);
    });
}

function __fbLogin(){
    console_data('__fbLogin');
    //comment by sourav
    const user = Auth.federatedSignIn({
        provider: "Facebook",
        customState: qs['url']
    }).then(user => {
          console.log(user);
    }).catch(error => {
          console.log(error);
    });
}

if((qs['social'] == 'fb' || qs['social'] == 'google' || qs['social'] == 'ios') && (location.hostname == 'stage-auth.ndtv.com' || location.hostname == 'auth.ndtv.com' || location.hostname == 'edata.ndtv.com' || location.hostname == 'localhost')) {
    if(qs['social'] == 'fb') {
        jQuery( ".fbLogin" ).trigger( "click" );
    } else if(qs['social'] == 'google') {
        jQuery( ".googleLogin" ).trigger( "click" );
    } else if(qs['social'] == 'ios') {
        jQuery( ".iOSApple" ).trigger( "click" );
    }
}


document.querySelector("._sign_email").addEventListener('input', function (e) {
    console_data('_sign_email');
    let valueChanged = false;
    if (e.type=='propertychange') {
        valueChanged = e.originalEvent.propertyName=='value';
    } else {
        valueChanged = true;
    }
    if (valueChanged) {
        emailMobileCss('_sign_email');
    }
})


function emailMobileCss(objVal) {
    console_data('emailMobileCss');
    let testVal = document.getElementById(objVal).value;
    if (testVal != '') {
        if (__l_rmobile.test(testVal)) {
            document.querySelector(".__set_icon").classList.remove("LogSd_eml-col");
            jQuery('.icn-vld,#contry-code').css('display','inline-flex');
            jQuery('.in-vld').css('display','none');
            document.querySelector(".LogSd_btn-wr > button").removeAttribute("disabled");
        } else if(__l_remail.test(testVal)) {
            document.querySelector(".__set_icon").classList.add("LogSd_eml-col");
            jQuery('.icn-vld').css('display','inline-flex');
            jQuery('.in-vld,#contry-code').css('display','none');
            document.querySelector(".LogSd_btn-wr > button").removeAttribute("disabled");
        }else{
            if(__is_num.test(testVal)){
                document.querySelector(".__set_icon").classList.remove("LogSd_eml-col");
                jQuery('.icn-vld,#contry-code').css('display','inline-flex');
            } else {
                document.querySelector(".__set_icon").classList.add("LogSd_eml-col");
                jQuery('#contry-code').css('display','none');
            }
            document.querySelector(".icn-vld").style.display = 'none';
            document.querySelector(".LogSd_btn-wr > button").setAttribute("disabled",'disabled');
            jQuery('.in-vld').css('display','inline-flex');
        }
    } else {
        jQuery('.icn-vld,.in-vld').css('display','none');
    }
}

function validateUserNm(username){
    console_data('validateUserNm');
    if (username == '') {
        return false;
    } else if (__l_remail.test(username) == false && __l_rmobile.test(username) == false) {
        return false;
    } else {
        jQuery(".LogSd_err-txt").html('').css('display','none');
        return true;
    }
}

// verify submit mobile or email //

document.getElementById("__submit").addEventListener("click", function(){
    console_data('__submit');
    let inpVal = document.querySelector('._sign_email').value;
    inpVal = inpVal.trim();
    if(inpVal != '') {
        if(validateUserNm(inpVal)){
            jQuery('#__inputDiv,.__inputDiv').css('display','none');
            jQuery('.LogSd_frm-lbl >span').html(inpVal);
            jQuery('#js_otp-verfy').css('display','block');
            jQuery('.__otpsubmit,#__otpsubmit').css('display','block');
            otpInput();
            jQuery('#__submit').css('display','none');
            userLogin(inpVal);
            timer(__l_timersec);
        } else {
            jQuery('#__submit').css('display','block');
            jQuery('#__otpsubmit').css('display','none');
        }
    } else {
        document.querySelector("._sign_email").focus();
        document.querySelector(".LogSd_err-txt").innerHTML = errorTxt['input_blank'];
        document.querySelector(".LogSd_err-txt").style.display = 'block';
        //jQuery('.Log_err-txt').html(errorTxt['input_blank']).show();
        //jQuery('._sign_email').focus();
    }
});





function userLogin(usernm) {
    console_data('userLogin');
    let inputText = usernm;
    let passwordval = 'N1tv@'+randomHash("alnum",10);
    if (__l_rmobile.test(usernm) != true) {
        usernm = usernm.replace('@','#');
        registerUser({ usernm, passwordval, inputText });
    }
    else if(__l_rmobile.test(usernm) == true){
        //usernm = '+91' + usernm;
        registerMobile({ usernm, passwordval, inputText , __country_code});
    }
}

function registerUser(user){
    console_data('registerUser');
    let payload = {};
    payload.email = user['usernm'].replace('#','@');
    profitSignupProcess(payload);
    /*Auth.signUp({
        username: user['usernm'],
        password: user['passwordval'],
        attributes: {
            "email": user['inputText'],
            'custom:resendOtp': "0"
        }
        }).then(luser => {
        if(luser.userConfirmed === true) {
            signinMobile(user['inputText']);
            //updateUserData();
            //addGAcb();
            //addDomain();                
        }
        }).catch(error => {
        if(error['code'] === "UsernameExistsException"){ 
            //console.log('User already exists');
            signinMobile(user['inputText']);
        }
        else{
            //showErrorMsg('.Log_err-txt', JSON.stringify(error));
            showErrorMsg('.LogSd_err-txt', errorTxt['otp_error']);
        }
        })
    */    
    
}

// register via mobile
function registerMobile(user){
    console_data('registerMobile');
    let payload = {};
    payload.mobile = __country_code + user['usernm'];
    profitSignupProcess(payload);
   /*Auth.signUp({
        username: user['usernm'],
        password: user['passwordval'],
        attributes: {
            "phone_number": __country_code + user['usernm'],
            "custom:cc": __country_code,
            'custom:resendOtp': "0"
        }
    }).then(luser => {
        if(luser.userConfirmed === true) {
            signinMobile(__country_code + user['usernm']);
            //addGAcb();
            //addDomain();
            //updateUserData();            
        }
    }).catch(error => {
        if(error['code'] === "UsernameExistsException"){ 
            signinMobile(__country_code + user['usernm']);
        }
        else{
            showErrorMsg('.LogSd_err-txt', JSON.stringify(error));
            //showErrorMsg('.Log_err-txt', errorTxt['otp_error']);
        }
    })*/
}

async function profitSignupProcess(payload){
     await fetch(__profit_auth_url + '/v1/auth/signinup/code', {
        method: 'POST',
        headers: {
           "Content-Type": "application/json",
          'x-app-client-id': __client_id,
          'x-app-client-redirecturl': __redirect_url,
          'x-app-client-secret': __client_secret
        },
        credentials: "include",
        body: JSON.stringify(payload)
    }).then(response => response.json()).then((data) => { __pre_auth_id = data;});
}

function signinMobile(mobilenum) {
    console_data('signinMobile');
    const username = mobilenum; //phone entered in form
    Auth.signIn(username).then(user => {        
        //console.log(user);
        __l_cognitoUser = user;
        __l_loginredirect = true;        
        //updateUserData();
    }).catch(error => {
        //console.log(error);
        if(error['code'] === "CreateAuthChallenge"){ 
            __l_cognitoUser = {}
            showErrorMsg('.LogSd_err-txt', JSON.stringify(error));
        } else {
            showErrorMsg('.LogSd_err-txt', JSON.stringify(error));
        }
        isLogin();
    });
}

async function updateUserData() {
    return ;
    let user = await  Auth.currentAuthenticatedUser();
     await Auth.updateUserAttributes(user, {
        'custom:resendOtp': '0'
    });
}

function showErrorMsg(element, msgtxt) {
    console_data('showErrorMsg');
    document.querySelector(".LogSd_err-txt").innerHTML = msgtxt;
    document.querySelector(".LogSd_err-txt").style.display = 'block';
}


function otpReturn() {
    console_data('otpReturn');
    let otpCombine = '';
    jQuery('#js_otp-verfy').find('input').each(function() {
        if(jQuery(this).val().trim() == '') {
            jQuery(this).focus();
            return false;
        }
        otpCombine += jQuery(this).val().trim();
    })
    return otpCombine;
}
// verify otp submit data //
document.getElementById("__otpsubmit").addEventListener('click', function(){
    console_data('__otpsubmit');
    jQuery('#__otpsubmit').addClass('loader').attr('disabled','disabled');
    hideCss('.LogSd_err-txt');
    jQuery(".LogSd_err-txt").html('');
    let otpCombine = '';
    let otp = document.querySelectorAll('#js_otp-verfy > input');

    jQuery('#js_otp-verfy').find('input').each(function() {
        if(jQuery(this).val().trim() == '') {
            jQuery(this).focus();
            return false;
        }
        otpCombine += jQuery(this).val().trim();
    })


    if(otpCombine.length == 6) {
        verifyOtpChallenge(otpCombine);
        //console.log('call otp verify function');
    } else {
        document.querySelector(".LogSd_err-txt").innerHTML = 'This is invalid otp, Please try again';
        showCss('.LogSd_err-txt');
    }        
})




jQuery(".LogSd-inp").focus(function(){
    jQuery('.LogSd_frm-col').addClass('focused');

}).blur(function(){
    jQuery('.LogSd_frm-col').removeClass('focused');
});

//------====== View Password  ======------//
jQuery(".vew-pass").click(function(){
    jQuery(".vew-pass").toggleClass("on");
});

// Handle otp input //
function otpInput(){
    console_data('otpInput');
    jQuery('#js_otp-verfy').find('input').each(function() {
        $(this).attr('maxlength', 1);
        $(this).on('keyup', function(e) {
            jQuery('.LogSd_err-txt').html('').hide();
            
            let otpFull = otpReturn();
            if(__l_rotp.test((otpFull)) === true){
                jQuery('#__otpsubmit').removeAttr('disabled');
            } else {
                jQuery('#__otpsubmit').attr('disabled','disabled')
            }
        });
    });
}

function otpFail(otpValCl) {
    console_data('otpFail');
    jQuery("._sign_email").val('');
    jQuery(".icn-vld").css('display','none');
    document.querySelector("._sign_email").focus();
    jQuery(otpValCl).val('');
    jQuery('#__otpsubmit').attr('disabled','disabled').removeClass('loader');
    if(otpValCl == '._signup_otp') {
        jQuery('._signup_email').val('');
        jQuery("._signup_button").show();
        jQuery("._signup_verify_button").hide();
        jQuery(".sgn_up-otp").hide();
    } else {
        jQuery('._signin_email').val('');
        jQuery("._signin_button").show();
        jQuery("._signin_verify_button").hide();
        jQuery(".sgn_in-otp").hide();
    }
}

// verify otp challenge //
function verifyOtpChallenge(otpval) {
    console_data('verifyOtpChallenge');
    let otpValCl = '.LogOtp_inp';
    //console.log('verifyOtpChallenge');
    //console.log(__l_cognitoUser);
    if(otpval != '' && __l_rotp.test((otpval)) === true) {
        let payload = {}
        payload.preAuthSessionId = __pre_auth_id.preAuthSessionId;
        payload.code = parseInt(otpval);
        fetch(__profit_auth_url + '/v1/auth/signinup/code/verify', {            
            headers: {
            "Content-Type": "application/json",
            'x-app-client-id': __client_id,
            'x-app-client-redirecturl': __redirect_url,
            'x-app-client-secret': __client_secret
            },
            credentials: "include",
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(async (response) => {
            console.log(response);
            if (response.status === 200) return response.json();
            else {
                if(attempts <= 0) {
                    otpFail(otpValCl);
                    attempts = 3;    
                    beforeLogin();                
                } else {
                    showErrorMsg('.LogSd_err-txt', 'Invalid Otp. '+attempts+' attempts left.');
                    --attempts;
                    jQuery('#__otpsubmit').attr('disabled','disabled').removeClass('loader');
                }
            }
          }).then(async (data) => {
            console.log(data);
            attempts = 3;            
            await userRedirectionFunc(__redirect_url);  
          })
        /*Auth.sendCustomChallengeAnswer(__l_cognitoUser, otpval)
                .then(user => {
                    if(user.signInUserSession != null) {
                        attempts = 3;
                        isUserlogin();
                        isLogin();                        
                        //closePopup();
                    } else {
                        if(attempts <= 0) {
                            otpFail(otpValCl);
                            attempts = 3;
                            __l_cognitoUser = {};
                        } else {
                            showErrorMsg('.LogSd_err-txt', 'Invalid Otp. '+attempts+' attempts left.');
                            --attempts;
                            jQuery('#__otpsubmit').attr('disabled','disabled').removeClass('loader');
                        }
                    }
                })
                .catch(error => {
                    //showErrorMsg('.Log_err-txt', JSON.stringify(error));
                    if(attempts <= 0) {
                        beforeLogin();
                    }
                    attempts = 3;
                    __l_cognitoUser = {};
                    Auth.signOut({ global: true });                    
                    otpFail(otpValCl);
                });*/
    } else {
        //showErrorMsg('._signup_otp', 'Insert valid OTP', '._omsgtxt');
    }
}

async function signOutglobal() {
    console_data('signOutglobal');
    let keyName = __l_cognitoUser.userDataKey.replace('.userData','');

    try {
        jQuery('._signoutv').remove();
        if(jQuery('div.login-container').length) {
            jQuery('.login-container').html('<a href="#inline_content" class="inline side-nv-log-trigger log_btn cboxElement" data-trigger=".nav-trigger" data-class="js_sid-nav-right">Login</a>');
        }
        beforeLogin();        
        deleteLocalStorage(keyName);
        await Auth.signOut({ global: true });
    } catch (error) {
        console.log(error);
        console_data('logout error');
        window.location.reload();
        /*console.log(error);
        deleteStorage();
        console.log(error);
        alert_data('signout globally error');
        let keyName = __l_cognitoUser.userDataKey.replace('.userData','');
        deleteLocalStorage(keyName);
        window.location.reload();*/
    }

}

jQuery('body').on('click','._signoutv',function(){
    console_data('_signoutv');
    try {
        let lJsonObj = {}
        lJsonObj['__rurl_logout'] = parent.location.href;
        targetIframe.contentWindow.postMessage({sentinel: 'login',type: 'post-return-url',data: lJsonObj},'*');
        console.log('logout');
        signOutglobal();
    }catch(error){
        console_data('parent.location.reload()');
        parent.location.reload();
    }
})

jQuery('body').on('click','.__resendOtp',function(){
    resendOtp();
})

function resendOtp(){
    resend_otp = parseInt(resend_otp)+1;
    jQuery('#__txt3').html(loginTxt[3]);
    let inpVal = jQuery('._sign_email').val().trim();


    if (__l_rmobile.test(inpVal) != true) {
        
    }
    else if(__l_rmobile.test(inpVal) == true){
        inpVal = __country_code+inpVal;
    }
    //userLogin(inpVal);
    //signinMobile(inpVal);
    let payload = {}
    payload.preAuthSessionId = __pre_auth_id.preAuthSessionId;
    fetch(__profit_auth_url + '/v1/auth/signinup/code/resend', {
        method: 'POST',
        headers: {
           "Content-Type": "application/json",
          'x-app-client-id': __client_id,
          'x-app-client-redirecturl': __redirect_url,
          'x-app-client-secret': __client_secret
        },
        body: JSON.stringify(payload)
    }).then(response => response.json()).then((data) => { console.log(data);});
    timer(__l_timersec);
}



jQuery('#iOSApple,.iOSApple').click(function(){
    // comment by sourav
    const user = Auth.federatedSignIn({
        provider: "SignInWithApple",
        customState: qs['url']
    }).then(user => {
          console.log(user);
          isUserlogin();
    }).catch(error => {
          console.log(error);
    });
})
const apple_log_btn = document.getElementById('apple-log-btn');
console.log("apple_btn",apple_log_btn)
// apple_log_btn?.addEventListener('click', async () => {
//    const data= await window.AppleID.auth.signIn();
// console.log("apple respone -->",data)
//    });
apple_log_btn?.addEventListener('click', function() {
    // Code to execute when the button is clicked
    console.log('apple Button clicked!');
    // You can add any other logic you need to perform here
});

// jQuery('#fbLogin,.fbLogin').click(function(){
    // console.log("hello from apple sourav")
    // const user = Auth.federatedSignIn({
    //     provider: "Facebook"
    //   }).then(user => {
    //       console.log(user);
    //       isUserlogin();
    //   }).catch(error => {
    //       console.log(error);
    //   });
// })
jQuery('#googleLogin,.googleLogin').click(function(){
    /*let url = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?gsiwebsdk=3&client_id=840130018198-qekcpip3ljakqkmua57fs1tvtbepk63p.apps.googleusercontent.com&scope=openid+profile+email+profile+email&prompt=consent&access_type=offline&redirect_uri=http%3A%2F%2Flocalhost%2Ftest%2Fprofit-login%2Fsso-profit.html&response_type=code&enable_granular_consent=true&service=lso&include_granted_scopes=true&state=pass-through+value';
    var newWindow = window.open(url, 'name', 'height=600,width=450');
    if (window.focus) {
    newWindow.focus();
    }*/

    oauthSignIn();
    /*const user = Auth.federatedSignIn({
        provider: "Google"
      }).then(user => {
          console.log(user);
          isUserlogin();
      }).catch(error => {
          console.log(error);
      });*/

})

function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount';    
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);
  
    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {'gsiwebsdk':3,
                'client_id': '47817650429-gbralbogab7b7rn9jgg83qu4ji959ukn.apps.googleusercontent.com',
                'scope':'openid profile email profile email',
                'prompt':'consent',
                'access_type':'offline',
                'redirect_uri': 'https://drop.ndtv.com/test/profit-login/sso-profit.html',
                'response_type': 'code',
                'enable_granular_consent':'true',
                'service':'lso',
                'include_granted_scopes': 'true',
                'state': 'pass-through value',
                'flowName':'GeneralOAuthFlow'
            };
  
    // Add form parameters as hidden input values.
    for (var p in params) {
      var input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

function applyCountryFilter(inputStr){
    var filter = inputStr.toUpperCase();
    var lis = jQuery('.__contry-lst_ul li');
    for (var i = 0; i < lis.length; i++) {
        var name = lis[i].getElementsByClassName('contry-nm')[0].innerHTML;
        if (name.toUpperCase().indexOf(filter) == 0) 
            lis[i].style.display = 'inline-flex';
        else
            lis[i].style.display = 'none';
    }
} 

jQuery('.__contry-lst_ul li').on('click', function(e){
    let selCountCode = jQuery(this).children('.contry-cd').html();
    __country_code = selCountCode;
    let __cm_validation = jQuery(this).attr('data-validation');
    let regEx = new RegExp(__cm_validation);
    __l_rmobile = regEx;
    jQuery('#contry-code').html(selCountCode+'<svg class="count-icn vj_icn vj_arrow-down"> <use xlink:href="#vj_arrow-down"></use></svg>');
    $('.LogCty_drop').toggle();
    emailMobileCss('_sign_email');
})

function removeFilter() {
    jQuery('.__contry-lst_ul li').css({display: 'inline-flex'});
    jQuery('#__country_filter').val('');
    $('.LogCty_drop').toggle();
}

jQuery('.LogCty_drop a.__contry-srch_cls').on('click', function(e){
    removeFilter();
})

jQuery('#__country_filter').on('keyup', function(e){
    let inputVal = this.value
    if(__l_letter.test(inputVal)) {
        applyCountryFilter(inputVal);
    } else if(inputVal == '') {
        removeFilter();
    } 
})

jQuery('#contry-code').on('click', function(){
    $('.LogCty_drop').toggle()
})


function __l_setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function __l_getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

if(location.hostname != 'localhost' && location.hostname != 'stage-auth.ndtv.com' && location.hostname != 'auth.ndtv.com') {
    //__l_setCookie('__rurl',__rurl,365);
}

// Otp expire timer //
function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;
    var downloadTimer;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    jQuery('#__timer').html(m + ':' + s +' sec');
    remaining -= 1;
    if(remaining >= 0) {
        downloadTimer = setTimeout(function() {
          timer(remaining);
      }, 1000);
      return false;
    }
    clearInterval(downloadTimer);
    document.getElementById('__txt3').innerHTML = 'Don`t receive OTP? <a href="javascript:void(0)" class="__resendOtp">Resend OTP</a>';
}

async function addGAcb(){
    let userAttr = await Auth.currentAuthenticatedUser();
    if(!('custom:gacookie' in userAttr['attributes']) && __l_getCookie('_ga') != "") {
        genUpdateUser('custom:gacookie',__l_getCookie('_ga'));
    }
    if(!('custom:cbcookie' in userAttr['attributes']) && __l_getCookie('_cb') != "") {
        genUpdateUser('custom:cbcookie',__l_getCookie('_cb'));
    }
}

async function addDomain(){
    let userAttr = await Auth.currentAuthenticatedUser();
    if(!('custom:signup_domain' in userAttr['attributes']) && (location.hostname != 'localhost' && location.hostname != 'stage-auth.ndtv.com' && location.hostname != 'auth.ndtv.com')) {
        genUpdateUser('custom:signup_domain',location.hostname);
    }
}




async function getUserInfo() {
    let user = await Auth.currentAuthenticatedUser();
    return user;
}

function parent_c_islogin() {
    if(typeof __l_cognitoUser.username !== 'undefined') {
        return true;
    } else {
        return false;
    }    
}
async function genUpdateUser(fnm,fval) {
    if(fnm != '') {
        let ObjectArr = {};
        ObjectArr[fnm] = fval;
        const user = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(user, ObjectArr);
    }
}

function setRedirectUrlCookie() {
    if(location.hostname != 'stage-auth.ndtv.com' && location.hostname != 'auth.ndtv.com') {
        __l_setCookie('__rurl',parent.location.href,365);
    }
}

function displayName(userObj) {
    let shwNm = '';
    jQuery('.afterLogin .vj_icn').hide();
    if(typeof userObj.attributes.name !== 'undefined' && userObj.attributes.name != ''){
        shwNm = userObj.attributes.name;
    } else if((typeof userObj.attributes.given_name !== 'undefined' && userObj.attributes.given_name != '') || (typeof userObj.attributes.family_name !== 'undefined' && userObj.attributes.family_name != '')){
        shwNm = userObj.attributes.given_name +' '+ userObj.attributes.family_name;
    } else if((typeof userObj.attributes['custom:fname'] !== 'undefined' && userObj.attributes['custom:fname'] != '') || (typeof userObj.attributes['custom:lname'] !== 'undefined' && userObj.attributes['custom:lname'] != '')) {
        shwNm = userObj.attributes['custom:fname'] +' '+ userObj.attributes['custom:lname'];
    } else {
        jQuery('.afterLogin .vj_icn').show();
        shwNm = userObj.username;
        if(userObj.username.includes('facebook_')) {
            shwNm = userObj.attributes.name;
        } else if(userObj.username.includes('google_')) {
            shwNm = userObj.attributes.email;
            jQuery('.afterLogin .vj_icn').addClass('vj_mail-new');
            jQuery('.afterLogin .vj_icn').removeClass('vj_smartphone');
            jQuery('.afterLogin .vj_icn').html('<use xlink:href="#vj_mail-new"></use>');
        } else if(userObj.username.includes('signinwithapple_')){
            shwNm = userObj.attributes.email;
            jQuery('.afterLogin .vj_icn').addClass('vj_mail-new');
            jQuery('.afterLogin .vj_icn').removeClass('vj_smartphone');
            jQuery('.afterLogin .vj_icn').html('<use xlink:href="#vj_mail-new"></use>');
        } else if(userObj.username.includes('#')) {
            shwNm = showUsernm.replace('#','@');
            if(userObj.username.includes('@') === false) {
                jQuery('.afterLogin .vj_icn').removeClass('vj_mail-new');
                jQuery('.afterLogin .vj_icn').addClass('vj_smartphone');
                jQuery('.afterLogin .vj_icn').html('<use xlink:href="#vj_smartphone"></use>');
            } else {
                jQuery('.afterLogin .vj_icn').addClass('vj_mail-new');
                jQuery('.afterLogin .vj_icn').removeClass('vj_smartphone');
                jQuery('.afterLogin .vj_icn').html('<use xlink:href="#vj_mail-new"></use>');
    
            }
        }
       
    }
    return shwNm;
}

function greetingTime() {
    let today = new Date()
    let curHr = today.getHours()
    if (curHr < 12) {
        jQuery('.__greeting').html('Hello, Good Morning!')
    } else if (curHr < 18) {
        jQuery('.__greeting').html('Hello, Good Afternoon!')
        return 'Good Afternoon';
    } else {
        jQuery('.__greeting').html('Hello, Good Evening!')
    }
}

async function showProfileData() {
    let user = await Auth.currentAuthenticatedUser();
    let userData = user.attributes;
    jQuery('#__username').val(user.username);
    if(userData['custom:gender'] == 'male'){
        jQuery('#UsrFrm_mr').attr('checked',true)
    } else if(userData['custom:gender'] == 'female'){
        jQuery('#UsrFrm_mrs').attr('checked',true)
    }
    if(userData['name'] != ''){
        jQuery('#__dnm').val(userData['name']);
    }
    if(userData['custom:fname'] != ''){
        jQuery('#__firstnm').val(userData['custom:fname']);
    }
    if(userData['custom:lname'] != ''){
        jQuery('#__lnm').val(userData['custom:lname']);
    }
    if(userData['custom:Location'] != ''){
        jQuery('#__location').val(userData['custom:Location']);
    }
    if(userData['custom:address'] != ''){
        jQuery('#__address').val(userData['custom:address']);
    }
    if(userData['custom:Country'] != ''){
        $('#__country option[value="'+userData['custom:Country']+'"]').attr("selected", "selected");
    }
    if(userData['email'] != ''){
        jQuery('#__eml').val(userData['email']);
        if(userData['email_verified'] === true) {
            jQuery('.__emlv').remove();
            jQuery('.__email').html(userData['email']);
        }
    }
}

async function saveProfileData(){
    let user = await Auth.currentAuthenticatedUser();
    let fieldValuePairs = $('#__userProfile').serializeArray();
    let profileData = {};
    let updateArr = {}
    
    $.each(fieldValuePairs, function(index, fieldValuePair) {
        profileData[fieldValuePair.name] = fieldValuePair.value;
    });

    if(profileData['__username'] ===  user.username){
        if(profileData['gender'] !== 'undefined') {
            updateArr['custom:gender'] = profileData['gender'];
        }
        if(profileData['__firstnm'] !== 'undefined') {
            updateArr['custom:fname'] = profileData['__firstnm'];
        }
        if(profileData['__lastnm'] !== 'undefined') {
            updateArr['custom:lname'] = profileData['__lastnm'];
        }
        if(profileData['__dispnm'] !== 'undefined') {
            updateArr['name'] = profileData['__dispnm'];
        }
        if(profileData['country'] !== 'undefined') {
            updateArr['custom:Country'] = profileData['country'];
        }
        if(profileData['location'] !== '') {
            updateArr['custom:Location'] = profileData['location'];
        }
        if(profileData['address'] !== '') {
            updateArr['custom:address'] = profileData['address'];
        }
        
        if(Object.keys(updateArr).length > 0) {
            await Auth.updateUserAttributes(user, updateArr);
            jQuery('#__message').html('Data updated successfully').css({'color':'#008000','clear':'both'});
        }
    } else {
        console.log('invalid user');
    }
    
    return false;
}

jQuery('#__editLogin').on('click', function(){
    jQuery('#__inputDiv,.__inputDiv,#__submit').css('display','block');
    document.querySelector("._sign_email").focus();
    jQuery('.LogSd_frm-lbl >span').html('');
    jQuery('#js_otp-verfy,.__otpsubmit,#__otpsubmit').css('display','none');
})

/* ndtvprofit function call */
const userRedirectionFunc = async (
    redirectUrl,
    isInitiatedByClient = false
  ) => {
    try {
        console.log('userRedirectionFunc');
      const authorizationResponse = await getAuthorizationToken(); //{ success: true, authCode: data?.authorizationCode }
      console.log(authorizationResponse);
      if (authorizationResponse.success) {
        onSuccessfulLogin(authorizationResponse.authCode, redirectUrl);
      } else {
        throw new Error();
      }
    } catch (error) {
      
    }
  };

  const getAuthorizationToken = async () => {
    const [redirectUrl, clientId, clientSecret] = getClientCreds();    
    try {
        console.log();
      const response = await fetch(
        `${__profit_auth_url}/v1/auth/authorize`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-app-client-id": clientId,
            "x-app-client-secret": clientSecret,
            "x-app-client-redirecturl": redirectUrl,
          },
          method: "POST",
          credentials: "include",
        }
      );
      
      if (response.status === 201) {
        const data = await response.json();
        if (data?.authorizationCode) {
          return { success: true, authCode: data?.authorizationCode };
        }
      } else {
        // console.error("Error Response");
        return { success: false, authCode: null };
      }
    } catch (error) {
        console.log(error);
      // console.error("Unable to create the authorization code", error);
      return { success: false, authCode: null };
    }
  };

  

  const getClientCreds = () => {    
    const redirectUrl =
      localStorage.getItem("redirectUrl") ??
      process.env.REACT_APP_DEFAULT_REDIRECT_APP_URL;
    const clientId =
      localStorage.getItem("client_id") ??
      process.env.REACT_APP_DEFAULT_REDIRECT_APP_CLIENT_ID;
    const clientSecret =
      localStorage.getItem("client_secret") ??
      process.env.REACT_APP_DEFAULT_REDIRECT_APP_CLIENT_SECRET;
  
    return [redirectUrl, clientId, clientSecret];
  };

  const clearStorage = () => {
    localStorage.removeItem("redirectUrl");
    localStorage.removeItem("client_id");
    localStorage.removeItem("client_secret");
  };

  const onSuccessfulLogin = (authorizationCode, redirectUrl) => {
    redirectUser(authorizationCode, redirectUrl);
  };

  const redirectUser = (paramValue, redirectUrl) => {
    let redirectURLQueryString = "";
    if (paramValue) {
      const redirectURLQueryParams = {
        authorizationCode: paramValue,
      };
      redirectURLQueryString = Object.keys(redirectURLQueryParams)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              redirectURLQueryParams[key]
            )}`
        )
        .join("&");
    }
  
    clearStorage();
    window.location.href = `${redirectUrl}${redirectURLQueryString ? "?" + redirectURLQueryString : ""}`
    // return;
    /*window.location.replace(
      `${redirectUrl}${
        redirectURLQueryString ? "?" + redirectURLQueryString : ""
      }`
    );*/
  };

  const redirectUseronLogout = (paramValue, redirectUrl) => {
    let redirectURLQueryString = "";
    if (paramValue) {
      const redirectURLQueryParams = {
        logoutAction: paramValue,
      };
      redirectURLQueryString = Object.keys(redirectURLQueryParams)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              redirectURLQueryParams[key]
            )}`
        )
        .join("&");
    }
  
    clearStorage();
  
    window.location.replace(
      `${redirectUrl}${
        redirectURLQueryString ? "?" + redirectURLQueryString : ""
      }`
    );
  };

window.parent_c_islogin = parent_c_islogin;
window.getUser = getUserInfo;
window.addUpUser = genUpdateUser;
window.saveProfileData = saveProfileData;