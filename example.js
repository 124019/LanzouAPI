import get_url from './api.js';

const share_url = "https://wwbvc.lanzouv.com/b011m9azlg"; // Cloud
const SoftwareTag = ''; // Local
const pwd = "dtu2"; // Cloud
const version_tag = '1.3.3-33-20260801'; // Cloud
const target_format = 'PixelPlay-{version_tag}-release.apk'; // Cloud
//EXAMPLES FOR TESTING

const url = await get_url(version_tag, SoftwareTag, target_format, pwd, share_url);
console.log(url);