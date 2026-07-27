/*Copyright © 2026 BefidcOZ. All rights reserved.
*version: 1.0.1/
*/

import axios from 'axios';

const share_url = "https://wwbvc.lanzouv.com/b011m9azlg";
const target = 'arm64-v8a';
const pwd = "dtu2";

const targetName = `app-${target}-release.apk`;

// Key Start
function getKey(arg1) {
    (function (a, c) {
        var d = a();
        while (!![]) {
            try {
                var e = -parseInt(a0j(0x117)) / 0x1 * (parseInt(a0j(0x111)) / 0x2) + -parseInt(a0j(0xfb)) / 0x3 * (parseInt(a0j(0x10e)) / 0x4) + -parseInt(a0j(0x101)) / 0x5 * (-parseInt(a0j(0xfd)) / 0x6) + -parseInt(a0j(0x102)) / 0x7 * (parseInt(a0j(0x122)) / 0x8) + parseInt(a0j(0x112)) / 0x9 + parseInt(a0j(0x11d)) / 0xa * (parseInt(a0j(0x11c)) / 0xb) + parseInt(a0j(0x114)) / 0xc;
                if (e === c) break;
                else d['push'](d['shift']());
            }
            catch (f) { d['push'](d['shift']()); }
        }
    }(a0i, 0x760bf));

    return (function () {
        var L = a0j, j = (
            function () {
                var B = !![]; return function (C, D) {
                    var E = B ? function () { var H = a0j; if (D) { var F = D[H(0x10d)](C, arguments); return D = null, F; } } : function () { }; return B = ![], E;
                };
            }()
        ),
            k = j(this, function () { var I = a0j; return k[I(0xff)]()[I(0x123)](I(0x10f))[I(0xff)]()[I(0x107)](k)[I(0x123)](I(0x10f)); });
        k();
        var l = (function () {
            var B = !![]; return function (C, D) { var E = B ? function () { var J = a0j; if (D) { var F = D[J(0x10d)](C, arguments); return D = null, F; } } : function () { }; return B = ![], E; };
        }());
        (function () {
            l(this, function () { var K = a0j, B = new RegExp(K(0x118)), C = new RegExp(K(0x106), 'i'), D = b(K(0x100)); !B[K(0x104)](D + K(0x105)) || !C[K(0x104)](D + K(0x11b)) ? D('0') : b(); })();
        }());
        for (
            var m = [0xf, 0x23, 0x1d, 0x18, 0x21, 0x10, 0x1, 0x26, 0xa, 0x9, 0x13, 0x1f, 0x28, 0x1b, 0x16, 0x17, 0x19, 0xd, 0x6, 0xb, 0x27, 0x12, 0x14, 0x8, 0xe, 0x15, 0x20, 0x1a, 0x2, 0x1e, 0x7, 0x4, 0x11, 0x5, 0x3, 0x1c, 0x22, 0x25, 0xc, 0x24], p = L(0x115), q = [], u = '', v = '', w = L(0x116), x = 0x0; x < arg1[w]; x++
        )
            for (
                var y = arg1[x], z = 0x0; z < m[w]; z++)m[z] == x + 0x1 && (q[z] = y); for (u = q[L(0xfc)](''), x = 0x0; x < u[w] && x < p[w]; x += 0x2) { var A = (parseInt(u[L(0x11a)](x, x + 0x2), 0x10) ^ parseInt(p[L(0x11a)](x, x + 0x2), 0x10))[L(0xff)](0x10); 0x1 == A[w] && (A = '0' + A), v += A; }
        var key = p;  // p 就是我们要的 key
        console.log('Key:', key); // 输出 Key
        return key; // 输出 Key
    })();

    function a0i() {
        var N = ['mJKZmgTStNvVyq', 'C3rYAw5N', 'y2fSBa', 'o2v4CgLYzxm9', 'y29VA2LL', 'mteZmZy3mNLbu2PszW', 'C2vHCMnO', 'D2HPBguGkhrYDwuPihT9', 'mJq1ndi0rKHuthnj', 'AM9PBG', 'nNH1rKHOuq', 'Bg9JyxrPB24', 'Dg9tDhjPBMC', 'Aw5PDa', 'mJi2odi1nwnMre1IyG', 'n0HxChPJva', 'CMvSB2fK', 'DgvZDa', 'y2HHAw4', 'xcTCkYaQkd86w2eTEKeTwL8KxvSWltLHlxPblvPFjf0Qkq', 'y29UC3rYDwn0B3i', 'y291BNrLCG', 'o21HEc1Hz2u9mZyWmdTWyxrOps87', 'zgvIDq', 'ywn0Aw9U', 'Dg9htvrtDhjPBMC', 'yxbWBhK', 'mJbiru1MChi', 'kcGOlISPkYKRksSK', 'z2DLCG', 'nKHJq01Aqq', 'nJe5nZu5ogH1twPUDa', 'C3rHDgvpyMPLy3q', 'mZu5mdu5mNbcB2Pxyq', 'mZaWmde3nJaWmdG1nJaWnJa2mtuWmtuZmZaWmZy5mdaYnZGWmdm3nq', 'BgvUz3rO', 'mtqWnti2shvUBNDv', 'zNvUy3rPB24GkLWOicPCkq', 'BM93', 'C2XPy2u', 'Aw5WDxq', 'ntm5BwrLuMXi'];
        a0i = function () {
            return N;
        };
        return a0i();
    }

    function a0j(a, b) {
        var c = a0i();
        return a0j = function (d, e) {
            d = d - 0xfb; var f = c[d];
            if (a0j['tGHEKR'] === undefined) {
                var g = function (l) {
                    var m = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
                    var n = '', o = '', p = n + g;
                    for (var q = 0x0, r, s, t = 0x0; s = l['charAt'](t++); ~s && (r = q % 0x4 ? r * 0x40 + s : s, q++ % 0x4) ? n += p['charCodeAt'](t + 0xa) - 0xa !== 0x0 ? String['fromCharCode'](0xff & r >> (-0x2 * q & 0x6)) : q : 0x0) {
                        s = m['indexOf'](s);
                    }
                    for (var u = 0x0, v = n['length']; u < v; u++) {
                        o += '%' + ('00' + n['charCodeAt'](u)['toString'](0x10))['slice'](-0x2);
                    }
                    return decodeURIComponent(o);
                };
                a0j['CrMtTV'] = g, a = arguments, a0j['tGHEKR'] = !![];
            }
            var h = c[0x0], i = d + h, j = a[i];
            if (!j) {
                var k = function (l) {
                    this['jyamLv'] = l, this['WxwaRR'] = [0x1, 0x0, 0x0], this['GuwnVk'] = function () { return 'newState'; }, this['CxWuMi'] = '\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*', this['FxAgTK'] = '[\x27|\x22].+[\x27|\x22];?\x20*}';
                };
                k['prototype']['dQvDam'] = function () {
                    var l = new RegExp(this['CxWuMi'] + this['FxAgTK']), m = l['test'](this['GuwnVk']['toString']()) ? --this['WxwaRR'][0x1] : --this['WxwaRR'][0x0]; return this['fQYikn'](m);
                },
                    k['prototype']['fQYikn'] = function (l) {
                        if (!Boolean(~l)) return l; return this['Hbwxmd'](this['jyamLv']);
                    },
                    k['prototype']['Hbwxmd'] = function (l) {
                        for (var m = 0x0, n = this['WxwaRR']['length']; m < n; m++) { this['WxwaRR']['push'](Math['round'](Math['random']())), n = this['WxwaRR']['length']; } return l(this['WxwaRR'][0x0]);
                    }, new k(a0j)['dQvDam'](), f = a0j['CrMtTV'](f), a[i] = f;
            }
            else f = j;
            return f;
        }, a0j(a, b);
    }

    function b(a) {
        function c(d) {
            var M = a0j;
            if (typeof d === M(0x11e))
                return function (e) { }[M(0x107)](M(0x124))[M(0x10d)](M(0x108));
            else ('' + d / d)[M(0x116)] !== 0x1 || d % 0x14 === 0x0 ? function () { return !![]; }[M(0x107)](M(0x10a) + M(0x110))[M(0x11f)](M(0x10b)) : function () { return ![]; }[M(0x107)](M(0x10a) + M(0x110))[M(0x10d)](M(0x113)); c(++d);
        }
        try {
            if (a) return c;
            else c(0x0);
        } catch (d) { }
    };
}


function generateWafCookie(arg1, order, key) {
    var rearranged = [];
    for (var i = 0; i < arg1.length; i++) {
        for (var j = 0; j < order.length; j++) {
            if (order[j] == i + 1) rearranged[j] = arg1[i];
        }
    }
    var u = rearranged.join('');
    var result = '';
    for (var i = 0; i < u.length && i < key.length; i += 2) {
        var xor = (parseInt(u.substring(i, i + 2), 16) ^ parseInt(key.substring(i, i + 2), 16)).toString(16);
        if (xor.length === 1) xor = '0' + xor;
        result += xor;
    }
    return result;
}

// arg1 needs single quotes
function getCookie(arg1) {
    var order = [0xf, 0x23, 0x1d, 0x18, 0x21, 0x10, 0x1, 0x26, 0xa, 0x9,
        0x13, 0x1f, 0x28, 0x1b, 0x16, 0x17, 0x19, 0xd, 0x6, 0xb,
        0x27, 0x12, 0x14, 0x8, 0xe, 0x15, 0x20, 0x1a, 0x2, 0x1e,
        0x7, 0x4, 0x11, 0x5, 0x3, 0x1c, 0x22, 0x25, 0xc, 0x24];
    var key = getKey(arg1);
    var cookieValue = generateWafCookie(arg1, order, key);
    var cookie = 'acw_sc__v2=' + cookieValue + '; path=/'
    console.log('Generated Cookie:', cookie);
    return cookie;
}

// Key End

const baseHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://wwbvc.lanzouv.com/{file_id}',
    'Origin': 'https://wwbvc.lanzouv.com',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
};

const headers_for_ajaxm = {
    "Accept": "application/json, text/javascript, */*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "DNT": "1",
    "Host": "wwbvc.lanzouv.com",
    "Origin": "https://wwbvc.lanzouv.com",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-gpc": "1",
};

// Cookies Manager
const client = axios.create({
});

// Cookies Container
let currentCookies = '';

// Refresh cookies function
function updateCookies(newCookieString) {
    currentCookies = newCookieString;
    client.defaults.headers.common['Cookie'] = currentCookies;
}

// Get Cookies from response headers
function extractCookiesFromResponse(response) {
    const setCookie = response.headers['set-cookie'] || [];
    const newCookies = setCookie
        .map(c => c.split(';')[0].trim())
        .filter(Boolean)
        .join('; ');
    if (newCookies) {
        const combined = currentCookies ? currentCookies + '; ' + newCookies : newCookies;
        updateCookies(combined);
    }
}

// enter index page
const response1 = await client.get(share_url, { headers: baseHeaders });
const index_page = response1.data;
console.log('index_page:', index_page);

// get the post parameters
const lx = parseInt(index_page.match(/'lx':(\d+),/)[1]);
const up = parseInt(index_page.match(/'up':(\d+),/)[1]);
const ls = parseInt(index_page.match(/'ls':(\d+),/)[1]);
const rep = index_page.match(/'rep':('.*?'),/)[1];
const t_var = index_page.match(/'t'\s*:\s*(\w+)/)[1];
const t_val = index_page.match(new RegExp(`${t_var}\\s*=\\s*'(\\d+)'`))[1];
const k_var = index_page.match(/'k'\s*:\s*(\w+)/)[1];
const k_val = index_page.match(new RegExp(`${k_var}\\s*=\\s*'([a-f0-9]+)'`))[1];
const fid = parseInt(index_page.match(/'fid':(\d+),/)[1]);
const uid = index_page.match(/'uid':'([^']+)',/)[1];
const pgs = parseInt(index_page.match(/pgs\s*=\s*(\d+);/)[1]);
const puid = index_page.match(/'puid':'([^']+)',/)[1];

console.log('提取参数:', { lx, up, ls, rep, t_val, k_val, fid, uid, pgs, puid });

//get the first page's cookies
extractCookiesFromResponse(response1);

//get file list page
const api_url = `https://wwbvc.lanzouv.com/filemoreajax.php?file=${fid}`;
const postData = {
    lx, fid, uid, puid,
    pg: pgs,
    rep: rep,
    t: t_val,
    k: k_val,
    up, ls,
    pwd: pwd
};

const response2 = await client.post(api_url, new URLSearchParams(postData).toString(), {
    headers: { ...baseHeaders, 'Referer': share_url }
});
extractCookiesFromResponse(response2);

const fileListResponse = response2.data;
console.log('File List Response:', fileListResponse);

if (fileListResponse.zt !== 1) {
    throw new Error('Failed to get file list: ' + fileListResponse.info);
}

// Find the target file in the list
let targetFile = fileListResponse.text.find(item => item.name_all === targetName);
if (!targetFile) {
    throw new Error(`Not Found:' ${targetName}' in file list`);
}
const targetDownloadPage = `https://wwbvc.lanzouv.com/${targetFile.id}`;
console.log('targetDownloadPage:', targetDownloadPage);

//get challenge html
const response3 = await client.get(targetDownloadPage, {
    headers: { ...baseHeaders, 'Referer': share_url }
});
extractCookiesFromResponse(response3);
let downloadPageHtml = response3.data;

const arg1Match = downloadPageHtml.match(/var\s+arg1\s*=\s*'([^']+)'/);
if (!arg1Match) throw new Error('Not Found arg1 in download page');
const arg1 = arg1Match[1];
console.log('arg1:', arg1);

const cookieFromArg1 = getCookie(arg1); 
console.log('cookie_KEY:', cookieFromArg1);

const newCookies = currentCookies + '; ' + cookieFromArg1;
updateCookies(newCookies);

//enter real download page
const response4 = await client.get(targetDownloadPage, {
    headers: { ...baseHeaders, 'Referer': targetDownloadPage }
});
extractCookiesFromResponse(response4);
var downloadPage = response4.data;

console.log('downloadPage:', downloadPage);


const fnMatch = downloadPage.match(/src="(\/fn[^"]+)"/);
if (!fnMatch) throw new Error('Not Found /fn in download page');
const downloadButtonUrl = `https://wwbvc.lanzouv.com${fnMatch[1]}`;
console.log('downloadButtonUrl:', downloadButtonUrl);

//enter download button page
const response5 = await client.get(downloadButtonUrl, {
    headers: { ...baseHeaders, 'Referer': targetDownloadPage }
});
extractCookiesFromResponse(response5);
const downloadButton = response5.data;
console.log('downloadButton:', downloadButton);

// get downloadUrl
const action = downloadButton.match(/'action':\s*'([^']+)'/)[1];
const ajaxdata = downloadButton.match(/var\s+ajaxdata\s*=\s*'([^']+)';/)[1];
const wp_sign = downloadButton.match(/var\s+wp_sign\s*=\s*'([^']+)';/)[1];
const kdns = parseInt(downloadButton.match(/var\s+kdns\s*=\s*(\d+);/)[1]);
const websign = downloadButton.match(/'websign':\s*'([^']+)'/)[1];
const ves = parseInt(downloadButton.match(/'ves':\s*(\d+)/)[1]);
const ajaxUrl = downloadButton.match(/url\s*:\s*'(\/ajaxm[^']+)'/)[1];
const getDownloadUrl = `https://wwbvc.lanzouv.com${ajaxUrl}`;

const postAjaxData = {
    action: action,
    websignkey: ajaxdata,
    signs: ajaxdata,
    sign: wp_sign,
    websign: websign,
    kd: kdns,
    ves: ves
};
console.log('postAjaxData:', postAjaxData);


const finalHeaders = {
    ...headers_for_ajaxm,
    'Referer': downloadButtonUrl
};

const response6 = await client.post(getDownloadUrl, new URLSearchParams(postAjaxData).toString(), {
    headers: finalHeaders
});
extractCookiesFromResponse(response6);

const downloadInfo = response6.data;
console.log('downloadInfo:', downloadInfo);

if (downloadInfo.zt === 1) {
    const dom = downloadInfo.dom;
    const urlPart = downloadInfo.url;
    const finalDownloadUrl = `${dom}/file/${urlPart}`;
    console.log('downloadUrl:', finalDownloadUrl);
} else {
    console.error('Failed to get download link: ', downloadInfo);
}
