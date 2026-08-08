import requests
import re

url = "https://slssm.dmpdmp.com/file/?CG5aZFxtBTRUXQszAzYHa1NsUGhWWQRvBXoAY1VlAFEJZVBmDytQKQluB39TM1F+UzwAKFQ/VmYELlBkVjoAMwg+Wj1cOQVhVDoLcAMlB2NTZVAwVmgEdQVnAChVaABxCWJQIQ80UG0JMwc0U1hROVNtADhUOFZkBDVQZ1Y9ADgIMVo6XDMFd1RkCy4DagcwUzhQYVYxBDIFOwAwVT4AJwl5UHcPb1A2CW8HY1MxUX9TOQA9VCRWZAQ7UHlWaABnCD5aOFw5BWJUNgtkA2YHN1MxUDZWbAQxBTsAMFVrADQJaFBjDzdQNwltB2lTZlFmU2wAY1RtVjIEYFBuViQAYAh4WmZcJwUkVHELOAMlB29TbVBoVj0EMwU2ADRVMAAzCT5QIQ8mUG0JMgc0U2FRbVM4ADJUM1ZiBDFQZ1Y8ADcIOlo+XC8Ff1QkCzsDOwdxUzRQZFY+BD4FNAA0VTgANAk7UDMPZFAiCSoHIVNwUW1TOAAyVDNWYgQyUG9WMgA4CDBaOVwnBSRUawstA2oHN1MxUGZWJwQ0BTQAKFU4ADAJPFApD2NQNwluB39TIVE0U2YAclRlVgsEYFA9VjcAMQgmWitcdQUoVHILOAMIB3NTaFBoVjk="
print(url)

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

session = requests.Session()
session.headers.update(headers)
session.cookies.update({'acw_tc': '7160b5a017862156233166422e31dfcf90d7b7d09e2d9d050d660ab0d2', 'cdn_sec_tc': '7160b5a017862156233166422e31dfcf90d7b7d09e2d9d050d660ab0d2', 'acw_sc__v2': '6a777cc70d472e55ae5068c683e555b20b076c0f', 'path': '/', 'expires': 'Sat, 08 Aug 2026 20:00:24 GMT', 'codelen': '1', 'pc_ad1': '1'})

response = session.get(url, headers=headers)
# 检查请求是否成功
response.raise_for_status()

#     print(response.text)
#     pattern = r"data\s*:\s*(\{[^}]+\})"
#     match = re.findall(pattern, response.text)
#
#
# except requests.exceptions.RequestException as e:
#     print(f"failed to download: {e}")
#     exit(0o0002)
#
# try:
#     post_data = match[0]
#     print(f"post_data: {post_data}")
#     el = 1 # Dianxin:1;Liantong:2;Common:3
#     dic = eval(post_data)
#     print(dic)
# except IndexError:
#     print("Not found post data")
#     exit(0o0003)
#
# data = session.post("https://slssm.dmpdmp.com/file/ajax.php", dic).text
# print(data)
with open("downloaded_app.apk", "wb") as f:
    f.write(response.content)

print("Saved downloaded_app.apk sucessfully")
