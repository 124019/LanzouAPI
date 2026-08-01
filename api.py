# -*- coding: utf-8 -*-
# Copyright © 2026 BefidcOZ. All rights reserved.
import json
import re
import requests
import time

__version__ = "2.0.2-beta"


def get_url(share_url, password, target_name):
    #//Key Start//
    def ky(arg1):
        KEY = '3000176000856006061501533003690027800375'
        order = [
                0xf, 0x23, 0x1d, 0x18, 0x21, 0x10, 0x1, 0x26, 0xa, 0x9,
                0x13, 0x1f, 0x28, 0x1b, 0x16, 0x17, 0x19, 0xd, 0x6, 0xb,
                0x27, 0x12, 0x14, 0x8, 0xe, 0x15, 0x20, 0x1a, 0x2, 0x1e,
                0x7, 0x4, 0x11, 0x5, 0x3, 0x1c, 0x22, 0x25, 0xc, 0x24
        ]

        order_fixed = [x-1 for x in order]
        print(f'order_fixed: {order_fixed}')
        u = ''.join(arg1[i] for i in order_fixed)
        print(u)

        result = ''
        for i in range(0, 40, 2):
            xor = int(u[i]+u[i+1], 16) ^ int(KEY[i]+KEY[i+1], 16)
            result = result + hex(xor).removeprefix('0x')
        return result
    #//Key End//

    #///PAGE1///

    # share_url = input("url: ")

    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "DNT": "1",
        "Host": "wwbvc.lanzouv.com",
        "Referer": share_url,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
        "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-gpc": "1"
    }# Add Referer : https://wwbvc.lanzouv.com/...
    headers_for_ajaxm = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "DNT": "1",
        "Host": "wwbvc.lanzouv.com",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
        "X-Requested-With": "XMLHttpRequest",
        "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Microsoft Edge";v="150"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-gpc": "1"
    } # Add Referer : https://wwbvc.lanzouv.com/fn?CG4HbQ9hAmYB...
    session = requests.Session()
    session.headers.update(headers)
    response = session.get(url=share_url)
    html = response.text
    print(f"index Page:{html}")

    try:
        lx = int(re.findall(r"'lx':(.+),", html)[0])
    except:
        arg1 = str(re.findall(r"var\s+arg1\s*=\s*'([^']+)'", html)[0])
        print(f"arg1:{arg1}")
        acw_sc__v2 = ky(arg1)
        ks = "{" + f'"acw_sc__v2":"{acw_sc__v2}"' + ',"path":"/"}'
        cookies = json.loads(ks)
        print(f"cookies:{cookies}")
        session.cookies.update(cookies)
        html = session.get(share_url).text
        print(f"real index page:{html}")
        lx = int(re.findall(r"'lx':(.+),", html)[0])
    up = int(re.findall(r"'up':(.+),", html)[0])
    ls = int(re.findall(r"'ls':(.+),", html)[0])
    rep = re.findall(r"'rep':(.+),", html)[0]
    print("lx:", lx)
    print("up:", up)
    print("ls:", ls)
    t_var = re.findall(r"'t'\s*:\s*(\w+)", html)[0]
    t_val = re.findall(rf"{t_var}\s*=\s*'(\d+)'", html)[0]
    k_var = re.findall(r"'k'\s*:\s*(\w+)", html)[0]
    k_val = re.findall(rf"{k_var}\s*=\s*'([a-f0-9]+)'", html)[0]
    print("k_val:", k_val)
    print("t_val:", t_val)
    print("t_var:", t_var)
    print("k_var:", k_val)
    fid = int(re.findall(r"'fid':(.+),", html)[0])
    uid = re.findall(r"'uid':'(.+)',", html)[0]
    print("uid:", uid)
    print("fid:", fid)
    pgs = int(re.findall(r"pgs =(.+);", html)[0])
    print("pgs:", pgs)
    puid = re.findall(r"'puid':'(.+)',", html)[0]
    print("puid:", puid)

    api_url = f"https://wwbvc.lanzouv.com/filemoreajax.php?file={fid}"
    print("api_url:", api_url)

    params = { # Lanzou Cao Ni Ma De , Luan4 Da3 Yin3 Hao4 Ni Ma Si Le
        'lx': lx,
        'fid': fid,
        'uid': uid,
        'puid':puid,
        'pg': pgs,
        'rep': rep,
        't': t_val,
        'k': k_val,
        'up': up,
        'ls': ls,
    }
    print("params:", params)


    if password:
        params['pwd'] = password
        print("params:", params)

    response = session.post(api_url, data=params)
    file_list_response = response.json()

    print("file_list_response:", file_list_response)
    if file_list_response.get('zt') == 1:
        for file in file_list_response.get('text', []):
            file_id = file['id']
            file_name = file['name_all']
            file_size = file['size']
            download_page_url = f"https://wwbvc.lanzouv.com/{file_id}"
            print(f"file_name: {file_name}, file_size: {file_size}, download: {download_page_url}")
    else:
        print("Failed to obtain the file list:", file_list_response.get('info'))

    # ///PAGE2///

    target_last_url = None #
    for item in file_list_response['text']:
        if item['name_all'] == target_name:
            target_last_url = item['id']
    target_download_page = f"https://wwbvc.lanzouv.com/{target_last_url}"

    session = requests.Session()
    session.headers.update(headers)
    response = session.get(target_download_page)
    download_page = response.text
    print(download_page)
    arg1 = str(re.findall(r"var\s+arg1\s*=\s*'([^']+)'", download_page)[0])
    print(f"arg1:{arg1}")

    # Get Download Page
    acw_sc__v2 = ky(arg1)
    ks = "{" + f'"acw_sc__v2":"{acw_sc__v2}"' + ',"path":"/"}'
    cookies = json.loads(ks)
    print(f"cookies:{cookies}")
    def arg1_fuck(session, cookies):
        session.cookies.update(cookies)
        download_page = session.get(target_download_page).text
        print(f"download_page: {download_page}")
        return download_page
    for times in range(0,3):
        download_page = arg1_fuck(session, cookies)
        if not str(re.findall(r"var\s+arg1\s*=\s*'([^']+)'", download_page)[0]):
            break
    download_button_last_url = re.findall(r'src="(/fn[^"]+)"', download_page)[0]
    download_button_url = f"https://wwbvc.lanzouv.com{download_button_last_url}"
    print(f"download_button_url: {download_button_url}")
    download_button = session.get(download_button_url).text
    print(f"download_button: {download_button}")
    download_url_dict_last_url = re.findall(r"url : '(/ajaxm.+)'", download_button)[0]
    print(f"download_url_dict_last_url: {download_url_dict_last_url}")
    get_download_url_dict_url = f"https://wwbvc.lanzouv.com{download_url_dict_last_url}"
    print(f"get_download_url_dict_url: {get_download_url_dict_url}")
    action = re.findall(r"'action':\s*'([^']+)'", download_button)[0]
    ajaxdata = re.findall(r"var ajaxdata\s*=\s*'([^']+)';", download_button)[0]
    wp_sign = re.findall(r"var wp_sign\s*=\s*'([^']+)';", download_button)[0]
    kdns = int(re.findall(r"var kdns\s*=\s*(\d+);", download_button)[0])
    websign = re.findall(r"'websign':\s*'([^']+)'", download_button)[0]
    ves = int(re.findall(r"'ves':\s*(\d+)", download_button)[0])
    print(f"action: {action}")
    print(f"ajaxdata: {ajaxdata}")
    print(f"wp_sign: {wp_sign}")
    print(f"websign: {websign}")
    print(f"kdns: {kdns}")
    print(f"ves: {ves}")
    json_data = {
        'action': action,
        'websignkey': ajaxdata,
        'signs': ajaxdata,
        'sign': wp_sign,
        'websign': websign,
        'kd': kdns,
        'ves': ves
    } # May Not universally applicable
    print(f"json_data: {json_data}")

    session.headers.clear()
    session.headers.update(headers)
    referer_header = {"Referer": download_button_url}
    print(f"referer_header: {referer_header}")
    session.headers.update(referer_header)
    time.sleep(1)
    try:
        response = session.post(url=get_download_url_dict_url, data=json_data)
        print(f"real headers:{response.request.headers}")
        str_download_url_dict = response.text
        print(f"str_download_url_dict: {str_download_url_dict}")
        download_url_dict = json.loads(str_download_url_dict)
    except:
        time.sleep(1)
        response = session.post(url=get_download_url_dict_url, data=json_data)
        print(f"real headers:{response.request.headers}")
        str_download_url_dict = response.text
        print(f"str_download_url_dict: {str_download_url_dict}")
        download_url_dict = json.loads(str_download_url_dict)
    download_last_url = download_url_dict["url"]
    download_url = f"https://slssm.dmpdmp.com/file/{download_last_url}"
    print(download_url)
    return download_url
