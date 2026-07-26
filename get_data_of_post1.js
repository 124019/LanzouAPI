export default function get_data_of_post1(html, pwd) {
    // All in <script> tag
    const varMap = {};
    const scripts = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];

    for (const script of scripts) {
        const varRegex = /var\s+([a-zA-Z0-9_]+)\s*=\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = varRegex.exec(script)) !== null) {
            varMap[m[1]] = m[2];
        }


        const globalNumRegex = /(?:^|\s|;)([a-zA-Z0-9_]+)\s*=\s*(\d+)\s*;/gm;
        while ((m = globalNumRegex.exec(script)) !== null) {
            if (!(m[1] in varMap)) {
                varMap[m[1]] = Number(m[2]);
            }
        }
    }


    const ajaxMatch = html.match(/\$\.ajax\(\s*\{[\s\S]*?data\s*:\s*\{([\s\S]*?)\}\s*,/);
    if (!ajaxMatch) throw new Error('Cannot Found $.ajax in index page return');
    const dataBody = ajaxMatch[1];


    const result = {};
    const pairRegex = /['"]?(\w+)['"]?\s*:\s*([^,]+)(?:,|$)/g;
    let match;
    while ((match = pairRegex.exec(dataBody)) !== null) {
        const key = match[1];
        let raw = match[2].trim();
        if (raw.endsWith(',')) raw = raw.slice(0, -1).trim();

        if (key === 'pwd') {
            result[key] = pwd;
        } else if (key === 'rep') { // Whitch Fucking guy wrote this code? What is the fucking rep:"'0'" means?
            result[key] = raw;
        } else if (raw.startsWith("'") || raw.startsWith('"')) {
            // 普通字符串字面量，去掉引号
            result[key] = raw.slice(1, -1);
        } else if (!isNaN(raw) && raw !== '') {
            result[key] = Number(raw);
        } else if (raw in varMap) {
            result[key] = varMap[raw];
        } else {
            result[key] = raw;
        }
    }

    return result;
}