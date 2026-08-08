from api import get_url


SoftwareTag = 'arm64'
version_tag = '1.4.5-42-20260808'
password = 'dtu2'
target_name = f"PixelPlay-{version_tag}-release.apk"
share_url = "https://wwbvc.lanzouv.com/b011m9azlg"

print(get_url(share_url=share_url, password=password,target_name=target_name))
