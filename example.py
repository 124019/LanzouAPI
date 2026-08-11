from api import get_url
import requests
import json


headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
    "Cache-Control": "max-age=0",
    "DNT": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0",
    "sec-ch-ua": '"Not=A?Brand";v="99", "Microsoft Edge";v="151", "Chromium";v="151"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-gpc": "1"
}
with open("./example.json", "r") as f:
    information = json.load(f)
software_tag = information["software_tag"]
version_tag = information["version_tag"]
password = information["password"]
target_name_format = information["target_name_format"]

share_url = information["share_url"]

if version_tag:
    target_name = target_name_format.replace("{version_tag}",version_tag)
else:
    target_name = target_name_format
if software_tag:
    target_name = target_name_format.replace("{software_tag}",software_tag)
print(target_name)


ul_dict = eval(get_url(share_url=share_url, password=password,target_name=target_name))
url = ul_dict["download_url"]
cookies = ul_dict["cookies"]

response = requests.get(url=url, headers=headers, cookies=cookies)
response.raise_for_status()

with open(target_name, "wb") as f:
    f.write(response.content)

print("Saved downloaded file successfully")