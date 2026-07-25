# -*- coding: utf-8 -*-
# Copyright © 2026 BefidcOZ. All rights reserved.
import re
import requests

target = 'arm64-v8a'
print(f'target: {target}')
#///PAGE1///

# share_url = input("url: ")

headers = {
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
}
share_url = "https://wwbvc.lanzouv.com/b011m9azlg"
response = requests.get(url=share_url, headers=headers)
html = response.text
print(html)

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

password = None #
while True:
    try:
        password = str(input("password(if no password, press 'enter'): "))
    except ValueError:
        no_password = input("if no password:press 'enter',input anything to retry: ")
        if no_password:
            continue
    break
print("password:", password)
if password:
    params['pwd'] = password
    print("params:", params)

response = requests.post(api_url, headers=headers, data=params, params={'file': fid})
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
target_name = f"app-{target}-release.apk"
for item in file_list_response['text']:
    if item['name_all'] == target_name:
        target_last_url = item['id']
target_download_page = f"https://wwbvc.lanzouv.com/{target_last_url}"

response = requests.get(headers=headers, url=target_download_page)
download_page = response.text
print(download_page)
