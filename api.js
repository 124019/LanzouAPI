import axios from 'axios';
import getCookie from './getCookies.js';

const share_url = "https://wwbvc.lanzouv.com/b011m9azlg";
const target = 'arm64-v8a';
const pwd = "dtu2";

const targetName = `app-${target}-release.apk`;

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