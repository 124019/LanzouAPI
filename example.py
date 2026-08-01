from api import get_url


SoftwareTag = 'arm64'
version_tag = '1.3.3-33-20260801'
password = 'dtu2'
target_name = f"PixelPlay-{version_tag}-release.apk"
share_url = "https://wwbvc.lanzouv.com/b011m9azlg"

print(get_url(share_url=share_url, password=password,target_name=target_name))
