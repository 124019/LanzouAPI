import json from 'json2typescript';
import { readFile } from 'fs/promises';
import { load } from 'cheerio';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import get_data_of_post1 from './get_data_of_post1.js';


var share_url = "https://wwbvc.lanzouv.com/b011m9azlg";
console.log(share_url);
var target = 'arm64-v8a';
console.log(target);
var pwd = "dtu2"
//example argument

var lanzou_url = "https://wwbvc.lanzouv.com";

var headers = {
    'Accept': 'application/json, text/javascript, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'DNT': '1',
    'Host': 'wwbvc.lanzouv.com',
    'Origin': 'https://wwbvc.lanzouv.com',
    'Sec-Ch-Ua': '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Gpc': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0',
    'X-Requested-With': 'XMLHttpRequest',
}


var headers_for_ajaxm = {
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
    "Sec-Fetch-Mode": "cores",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-gpc": "1",
} // without 'Referer'

//get the information of index page
const response = await fetch(share_url, {
    method: 'GET',
    headers: headers,
});
if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
}
const index_page = await response.text();
console.log('index Page:', index_page);

//cookies
var get_cookies = response.headers.getSetCookie();
var cookies = get_cookies
    .map(c => c.split(';')[0].trim())  // 提取 name=value
    .filter(Boolean)
    .join('; ');
console.log('cookies:', cookies);
var headers = {
    ...headers,
    'Cookie': cookies,
    'Referer': share_url
}
console.log('headersaft:', headers); // cookies added

//process the post body of index page
var post1_data = get_data_of_post1(index_page, pwd);
console.log('post1_data:', post1_data);

//post the post body to the index2x page
const reg_index2x_last_url = /\/filemoreajax\.php\?file=(\d+)/;
const index2x_last_url = reg_index2x_last_url.exec(index_page)[0];
var index2x_url = lanzou_url + index2x_last_url; // example argument
console.log('index2x_last_url:', index2x_last_url);
console.log('index2x_url:', index2x_url);

const response2 = await fetch(index2x_url, {
    method: 'POST',
    headers: headers,
    body: new URLSearchParams(post1_data).toString() // Ni Ma Si le,Chou Sha B Lanzou Cheng2 Xu4 Yuan2
});
if (!response2.ok) {
    throw new Error('Network response was not ok ' + response2.statusText);
}
const post2_data = await response2.text();
console.log('post2_data:', post2_data);



// import getCookie from './getCookies.js';
// var arg1 = 'B3CC6CA0A30B43556F87DB65F35D62C438A2E5FE'; // example argument
// let cookie = getCookie(arg1);
// console.log('cookies: ' + cookie);
// headers.append('Cookie', cookie);

// const response = await fetch(..., {
//     method: 'GET',
//     headers: headers,
// });

// console.log('Response:', response);


