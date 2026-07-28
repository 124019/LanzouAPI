import get_url from './api.js';

const share_url = "https://wwbvc.lanzouv.com/b011m9azlg"; // Cloud
const SoftwareTag = 'arm64-v8a'; // Local
const pwd = "dtu2"; // Cloud
const version_tag = ''; // Cloud
const target_format = 'app-{SoftwareTag}-release.apk'; // Cloud
//EXAMPLES FOR TESTING

const url = await get_url(version_tag, SoftwareTag, target_format, pwd, share_url);
console.log(url);