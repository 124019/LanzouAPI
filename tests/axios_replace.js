function extractCookies(res, jar) {
    let list = [];
    if (typeof res.headers.raw === 'function') list = res.headers.raw()['set-cookie'] || [];
    else {
        const s = res.headers.get('set-cookie');
        if (s) list = [s];
    }
    for (const item of list) {
        const cookie = item.split(';')[0].trim();
        const eq = cookie.indexOf('=');
        if (eq > 0) jar[cookie.slice(0, eq)] = cookie.slice(eq + 1);
    }
}

const METHOD_SECTIONS = ['common', 'get', 'post', 'delete', 'put', 'patch', 'head'];
function flatten(headers) {
    const out = {};
    if (!headers) return out;
    for (const k in headers) {
        if (METHOD_SECTIONS.includes(k)) {
            const h = headers[k];
            if (h) for (const kk in h) out[kk] = h[kk];
        } else {
            out[k] = headers[k];
        }
    }
    return out;
}

function toAxiosLike(res, jar, bodyText) {
    const ct = res.headers.get('content-type') || '';
    let data = bodyText;
    if (ct.includes('application/json') || (bodyText && bodyText.trim().startsWith('{'))) {
        try { data = JSON.parse(bodyText); } catch (_) { }
    }
    return { data, status: res.status, headers: Object.fromEntries(res.headers.entries()), request: { headers: flatten(jar) } };
}

export default {
    create() {
        const client = {
            defaults: { headers: { common: {}, get: {}, post: {} } },
            async get(url, config = {}) {
                const jar = {};
                const h = { ...flatten(this.defaults.headers), ...flatten(config.headers) };
                const res = await fetch(url, { method: 'GET', headers: h, redirect: 'manual' });
                extractCookies(res, jar);
                client.cookieJar = jar;
                const txt = await res.text();
                return toAxiosLike(res, jar, txt);
            },
            async post(url, body, config = {}) {
                const jar = this.cookieJar || {};
                let h = { ...flatten(this.defaults.headers), ...flatten(config.headers) };
                if (config.withCookie && jar && Object.keys(jar).length) {
                    const cookieStr = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
                    h['Cookie'] = cookieStr;
                }
                const res = await fetch(url, { method: 'POST', headers: h, body, redirect: 'manual' });
                extractCookies(res, jar);
                client.cookieJar = jar;
                const txt = await res.text();
                return toAxiosLike(res, jar, txt);
            },
        };
        return client;
    },
};