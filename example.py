from api import get_url


SoftwareTag = 'arm64'
version_tag = '1.3.0-30-20260729'
password = 'dtu2'
target_name = f"PixelPlay-{version_tag}-{SoftwareTag}-release.apk"

print(get_url(
    password=password,
    target_name=target_name
))