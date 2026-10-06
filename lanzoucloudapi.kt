package com.theveloper.pixelplay.data.github

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.zip.GZIPInputStream
import java.util.zip.InflaterInputStream

/**
 * 蓝奏云直链解析 API（Kotlin 转译版）
 *
 * 对齐 LanzouAPI 官方 Python 版 api.py v2.1.3（调用示例见 example.py）：
 *   - acw_sc__v2 cookie v3：由页面 `arg1`（40 位十六进制）按 order 表重排后与 KEY 逐字节 XOR 生成
 *   - PAGE1：分享页（被反爬拦截时先由 arg1 算 acw_sc__v2 重试）→ filemoreajax.php 拉取文件清单
 *   - PAGE2：逐文件走下载页（arg1 → cookie（含 path/expires）→ /fn → /ajaxm）拿到硬编码域名直链 `https://slssm.dmpdmp.com/file/{url}`
 *   - PAGE2 使用独立会话（不带 PAGE1 cookie），对齐 Python 版独立 Session
 *
 * 用法（对齐 example.py）：
 *   - getUrl(shareUrl, password, targetName)  → 精确指定文件名，返回直链与解析会话 cookies
 *   - resolveShare(shareUrl, password)        → 列出分享内全部文件
 */
class LanzouCloudApi {

    private companion object {
        // 蓝奏云反爬 KEY（硬编码在 JS 中）
        private const val ACW_KEY = "3000176000856006061501533003690027800375"

        // 数组重排序表（v3，40 个 1-based 十六进制位置）
        private val ACW_ORDER = intArrayOf(
            0xf, 0x23, 0x1d, 0x18, 0x21, 0x10, 0x1, 0x26, 0xa, 0x9,
            0x13, 0x1f, 0x28, 0x1b, 0x16, 0x17, 0x19, 0xd, 0x6, 0xb,
            0x27, 0x12, 0x14, 0x8, 0xe, 0x15, 0x20, 0x1a, 0x2, 0x1e,
            0x7, 0x4, 0x11, 0x5, 0x3, 0x1c, 0x22, 0x25, 0xc, 0x24
        )

        // 与 api.py 一致的默认请求头（对齐 requests.Session.headers.update(headers)）
        private val DEFAULT_HEADERS = linkedMapOf(
            "Accept" to "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding" to "gzip, deflate, br, zstd",
            "Accept-Language" to "zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
            "Cache-Control" to "max-age=0",
            "Connection" to "keep-alive",
            "DNT" to "1",
            "Sec-Fetch-Dest" to "document",
            "Sec-Fetch-Mode" to "navigate",
            "Sec-Fetch-Site" to "same-origin",
            "Sec-Fetch-User" to "?1",
            "Upgrade-Insecure-Requests" to "1",
            "User-Agent" to "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0",
            "sec-ch-ua" to "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Microsoft Edge\";v=\"150\"",
            "sec-ch-ua-mobile" to "?0",
            "sec-ch-ua-platform" to "\"Windows\"",
            "sec-gpc" to "1"
        )

        // 请求超时
        private const val CONNECT_TIMEOUT = 15000
        private const val READ_TIMEOUT = 20000
    }

    /** 下载信息（对齐 api.py 返回的 {"download_url":..., "cookies":...}） */
    data class LanzouDownloadInfo(
        val downloadUrl: String,
        val cookies: Map<String, String>
    )

    data class LanzouFileInfo(
        val fileName: String,
        val fileSize: String,
        val downloadUrl: String,
        val versionName: String? = null,  // 从文件名解析的版本号
        val cookie: String = "",  // 解析会话的 Cookie（下载直链时必需，否则命中人机验证页）
        val referer: String = ""  // 下载直链所需的 Referer（蓝奏云分享页）
    )

    /**
     * 从文件名解析版本号
     * 支持格式：PixelPlay-{versionName}-{versionCode}-{date}-arm64.apk
     *         或：PixelPlay-{versionName}-{versionCode}-{date}-universal.apk
     *         或：PixelPlay-{versionName}-{versionCode}-{date}-release.apk（对齐 example.py target_name）
     */
    fun parseVersionFromFileName(fileName: String): String? {
        val apkName = fileName.removeSuffix(".apk")
        // 匹配 PixelPlay-{versionName}-{versionCode}-{date}-{variant} 格式
        val regex = Regex("""PixelPlay-([\d.]+)-\d+-\d+-(arm64|universal|release)""")
        val match = regex.find(apkName)
        return match?.groupValues?.get(1)
    }

    /**
     * 精确获取指定文件名的直链（对齐 example.py 的 get_url(share_url, password, target_name)）
     *
     * @param shareUrl 分享链接（如 https://wwbvc.lanzouv.com/b011m9azlg）
     * @param password 提取密码（可选）
     * @param targetName 目标文件名（如 "PixelPlay-1.3.2-32-20260731-release.apk"）
     * @return 该文件的真实下载直链与解析会话 cookies；未找到目标文件时返回失败（附可用文件清单）
     */
    suspend fun getUrl(
        shareUrl: String,
        password: String? = null,
        targetName: String
    ): Result<LanzouDownloadInfo> {
        return withContext(Dispatchers.IO) {
            try {
                val session = LanzouSession()

                // ── PAGE1：进入分享页，提取文件列表参数 ──
                var indexHtml = session.get(shareUrl, referer = shareUrl)
                // 被反爬拦截时页面不含 'lx'，需先从 arg1 生成 acw_sc__v2 cookie 后重试
                if (!indexHtml.contains("'lx'")) {
                    val arg1 = Regex("""var\s+arg1\s*=\s*'([^']+)'""")
                        .find(indexHtml)?.groupValues?.get(1)
                    if (arg1 != null) {
                        // Python 版：session.cookies.update({"acw_sc__v2": ky(arg1), "path": "/"})
                        session.setCookie("acw_sc__v2", generateAcwCookieV3(arg1))
                        session.setCookie("path", "/")
                        indexHtml = session.get(shareUrl, referer = shareUrl)
                    }
                }

                val host = session.lastHost ?: URL(shareUrl).host
                val params = extractIndexParams(indexHtml)

                // 构造文件列表请求参数（对齐 api.py params）
                val listForm = linkedMapOf<String, String>()
                listForm["lx"] = params.lx.toString()
                listForm["fid"] = params.fid.toString()
                listForm["uid"] = params.uid
                listForm["puid"] = params.puid
                listForm["pg"] = params.pgs.toString()
                listForm["rep"] = params.rep
                listForm["t"] = params.t
                listForm["k"] = params.k
                listForm["up"] = params.up.toString()
                listForm["ls"] = params.ls.toString()
                if (!password.isNullOrEmpty()) listForm["pwd"] = password

                val listJson = session.post(
                    "https://$host/filemoreajax.php?file=${params.fid}",
                    listForm,
                    referer = shareUrl
                )
                val listObj = JSONObject(listJson)
                if (listObj.optInt("zt") != 1) {
                    throw Exception("Failed to obtain the file list: ${listObj.optString("info", listJson)}")
                }
                val text = listObj.optJSONArray("text") ?: org.json.JSONArray()
                val fileEntries = mutableListOf<FileEntry>()
                for (i in 0 until text.length()) {
                    val item = text.optJSONObject(i) ?: continue
                    fileEntries.add(
                        FileEntry(
                            id = item.optString("id"),
                            name = item.optString("name_all"),
                            size = item.optString("size")
                        )
                    )
                }

                // 对齐 api.py：按 name_all == target_name 精确匹配目标文件
                val target = fileEntries.firstOrNull { it.name == targetName }
                if (target == null) {
                    val available = fileEntries.joinToString(", ") { it.name }
                    throw Exception("Not Found: '$targetName' in file list. Available: $available")
                }

                // ── PAGE2：独立会话解析目标文件直链 ──
                val info = resolveSingleFile(session, host, target, shareUrl)
                    ?: throw Exception("无法解析目标文件下载直链: $targetName")
                Result.success(info)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    /**
     * 解析蓝奏云分享链接，获取所有文件的下载信息
     *
     * @param shareUrl 分享链接（如 https://wwbvc.lanzouv.com/b011m9azlg）
     * @param password 提取密码（可选）
     * @return 文件信息列表
     */
    suspend fun resolveShare(
        shareUrl: String,
        password: String? = null
    ): Result<List<LanzouFileInfo>> {
        return withContext(Dispatchers.IO) {
            try {
                val session = LanzouSession()
                val files = mutableListOf<LanzouFileInfo>()

                // ── PAGE1：进入分享页，提取文件列表参数 ──
                var indexHtml = session.get(shareUrl, referer = shareUrl)
                if (!indexHtml.contains("'lx'")) {
                    val arg1 = Regex("""var\s+arg1\s*=\s*'([^']+)'""")
                        .find(indexHtml)?.groupValues?.get(1)
                    if (arg1 != null) {
                        session.setCookie("acw_sc__v2", generateAcwCookieV3(arg1))
                        session.setCookie("path", "/")
                        indexHtml = session.get(shareUrl, referer = shareUrl)
                    }
                }

                val host = session.lastHost ?: URL(shareUrl).host
                val params = extractIndexParams(indexHtml)

                val listForm = linkedMapOf<String, String>()
                listForm["lx"] = params.lx.toString()
                listForm["fid"] = params.fid.toString()
                listForm["uid"] = params.uid
                listForm["puid"] = params.puid
                listForm["pg"] = params.pgs.toString()
                listForm["rep"] = params.rep
                listForm["t"] = params.t
                listForm["k"] = params.k
                listForm["up"] = params.up.toString()
                listForm["ls"] = params.ls.toString()
                if (!password.isNullOrEmpty()) listForm["pwd"] = password

                val listJson = session.post(
                    "https://$host/filemoreajax.php?file=${params.fid}",
                    listForm,
                    referer = shareUrl
                )
                val listObj = JSONObject(listJson)
                if (listObj.optInt("zt") != 1) {
                    throw Exception("Failed to obtain the file list: ${listObj.optString("info", listJson)}")
                }
                val text = listObj.optJSONArray("text") ?: org.json.JSONArray()
                val fileEntries = mutableListOf<FileEntry>()
                for (i in 0 until text.length()) {
                    val item = text.optJSONObject(i) ?: continue
                    fileEntries.add(
                        FileEntry(
                            id = item.optString("id"),
                            name = item.optString("name_all"),
                            size = item.optString("size")
                        )
                    )
                }

                // ── PAGE2：逐文件解析真实下载直链 ──
                for (entry in fileEntries) {
                    try {
                        val info = resolveSingleFile(session, host, entry, shareUrl)
                        if (info != null) {
                            files.add(
                                LanzouFileInfo(
                                    fileName = entry.name,
                                    fileSize = entry.size,
                                    downloadUrl = info.downloadUrl,
                                    versionName = parseVersionFromFileName(entry.name),
                                    // 携带解析会话的 Cookie 与 Referer，App 内下载直链时带上，
                                    // 否则蓝奏云 CDN 直接返回人机验证 HTML 页导致下载失败
                                    cookie = info.cookies.joinToString("; ") { "${it.key}=${it.value}" },
                                    referer = shareUrl
                                )
                            )
                        }
                    } catch (e: Exception) {
                        // 单个文件解析失败不中断整体流程
                    }
                }

                Result.success(files)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    /**
     * 获取指定版本的 APK 下载链接
     *
     * @param shareUrl 分享链接
     * @param password 提取密码
     * @param targetVersion 目标版本号（如 "1.2.3"）
     * @param preferredArch 首选架构（"arm64" 或 "arm32"）
     * @return 下载链接
     */
    suspend fun getDownloadUrl(
        shareUrl: String,
        password: String? = null,
        targetVersion: String? = null,
        preferredArch: String = "arm64"
    ): Result<String> {
        val result = resolveShare(shareUrl, password)
        return result.map { files ->
            if (files.isEmpty()) {
                throw Exception("蓝奏云中没有找到文件")
            }

            // 如果指定了版本号，优先匹配版本号一致的文件
            val targetFiles = if (targetVersion != null) {
                val matched = files.filter { it.versionName == targetVersion }
                if (matched.isNotEmpty()) {
                    matched
                } else {
                    files
                }
            } else {
                files
            }

            // 根据架构选择：优先 arm64，其次 arm32，最后任意
            val archKeyword = when (preferredArch) {
                "arm64" -> listOf("arm64", "armv8", "64位")
                "arm32" -> listOf("arm32", "armv7", "32位")
                else -> emptyList()
            }

            val archMatched = archKeyword.firstNotNullOfOrNull { keyword ->
                targetFiles.firstOrNull { it.fileName.contains(keyword, ignoreCase = true) }
            }

            archMatched?.downloadUrl
                ?: targetFiles.firstOrNull()?.downloadUrl
                ?: throw Exception("没有找到可用的下载链接")
        }
    }

    // === 单文件下载直链解析（PAGE2） ===

    /**
     * 解析单个文件的下载直链，返回下载信息（直链 + 解析会话 cookies）。
     *
     * 对齐 api.py PAGE2：使用独立会话（不带 PAGE1 的 cookie）：
     *   - 进入下载页提取 arg1，生成 acw_sc__v2 cookie（含 path/expires）后再访问一次拿真实内容
     *   - 提取下载按钮地址 /fn，进入后提取 ajax 参数，POST /ajaxm 拿到硬编码域名直链
     */
    private fun resolveSingleFile(
        session: LanzouSession,
        host: String,
        entry: FileEntry,
        shareUrl: String
    ): LanzouDownloadInfo? {
        val downloadPageUrl = "https://$host/${entry.id}"

        // Python 版 PAGE2 使用独立新 Session（只带 headers，不带 PAGE1 的 cookie），
        // 这里在解析每个文件前清空会话 cookie 以对齐
        session.clearCookies()

        // 进入下载页，提取 arg1 并生成 acw_sc__v2 cookie（含 path/expires），再访问一次拿真实内容
        var dp = session.get(downloadPageUrl, referer = shareUrl)
        val arg1 = Regex("""var\s+arg1\s*=\s*'([^']+)'""").find(dp)?.groupValues?.get(1)
        if (arg1 != null) {
            // 真实 JS：document.cookie = 'acw_sc__v2=...; path=/; expires=...'
            val acwCookie = generateAcwCookieV3(arg1)
            val expires = formatRfc1123(System.currentTimeMillis() + 3600_000L)
            val dlCookies = linkedMapOf(
                "acw_sc__v2" to acwCookie,
                "path" to "/",
                "expires" to expires
            )
            session.updateCookies(dlCookies)
            dp = session.get(downloadPageUrl, referer = downloadPageUrl)
        }

        // 提取下载按钮地址 /fn...
        val fn = Regex("""src="(/fn[^"]+)"""").find(dp)?.groupValues?.get(1) ?: return null
        val buttonUrl = "https://$host$fn"
        val buttonPage = session.get(buttonUrl, referer = downloadPageUrl)

        // 提取 ajax 参数
        val action = Regex("""'action':\s*'([^']+)'""").find(buttonPage)?.groupValues?.get(1)
        val ajaxdata = Regex("""var\s+ajaxdata\s*=\s*'([^']+)';""").find(buttonPage)?.groupValues?.get(1)
        val wpSign = Regex("""var\s+wp_sign\s*=\s*'([^']+)';""").find(buttonPage)?.groupValues?.get(1)
        val websign = Regex("""'websign':\s*'([^']+)'""").find(buttonPage)?.groupValues?.get(1)
        val ajaxUrl = Regex("""url\s*:\s*'(/ajaxm[^']+)'""").find(buttonPage)?.groupValues?.get(1)
        if (action == null || ajaxdata == null || wpSign == null || websign == null || ajaxUrl == null) {
            return null
        }
        val kdns = Regex("""var\s+kdns\s*=\s*(\d+);""").find(buttonPage)?.groupValues?.get(1)?.toIntOrNull() ?: 0
        val ves = Regex("""'ves':\s*(\d+)""").find(buttonPage)?.groupValues?.get(1)?.toIntOrNull() ?: 0

        // 对齐 api.py json_data（实际以 form 提交）
        val ajaxForm = linkedMapOf<String, String>()
        ajaxForm["action"] = action
        ajaxForm["websignkey"] = ajaxdata
        ajaxForm["signs"] = ajaxdata
        ajaxForm["sign"] = wpSign
        ajaxForm["websign"] = websign
        ajaxForm["kd"] = kdns.toString()
        ajaxForm["ves"] = ves.toString()

        val dlJson = session.post("https://$host$ajaxUrl", ajaxForm, referer = buttonUrl)
        // Python 版不校验 zt，直接取 url 字段拼直链；为空则失败
        val dlObj = JSONObject(dlJson)
        val urlPart = dlObj.optString("url")
        if (urlPart.isBlank()) return null
        // Python 版：download_url = f"https://slssm.dmpdmp.com/file/{url}"（硬编码 CDN 域名，忽略 dom 字段）
        return LanzouDownloadInfo(
            downloadUrl = "https://slssm.dmpdmp.com/file/$urlPart",
            cookies = session.cookies.toMap()
        )
    }

    // === acw_sc__v2 cookie v3 算法（对齐 api.py 的 ky()） ===

    /**
     * 由页面 `arg1`（40 位十六进制）生成 acw_sc__v2 cookie 值。
     * 对齐 LanzouAPI api.py 的 ky()：按 order 表（1-based）重排 arg1，
     * 每 2 个十六进制字符与 KEY 对应 2 字符做 XOR，得到 20 字节 hex。
     */
    private fun generateAcwCookieV3(arg1: String): String {
        if (arg1.length < 40) {
            // arg1 too short
        }
        val sb = StringBuilder(40)
        for (pos in ACW_ORDER) {
            if (pos - 1 < arg1.length) sb.append(arg1[pos - 1])
        }
        val reordered = sb.toString()
        val result = StringBuilder(40)
        for (i in 0 until 40 step 2) {
            if (i + 1 >= reordered.length) break
            val a = reordered.substring(i, i + 2).toIntOrNull(16) ?: 0
            val b = ACW_KEY.substring(i, i + 2).toIntOrNull(16) ?: 0
            result.append((a xor b).toString(16).padStart(2, '0'))
        }
        return result.toString()
    }

    // === RFC 1123 时间格式化（对齐真实 JS 的 toGMTString，expires 属性） ===

    private fun formatRfc1123(epochMillis: Long): String {
        val fmt = SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss 'GMT'", Locale.US)
        fmt.timeZone = TimeZone.getTimeZone("GMT")
        return fmt.format(Date(epochMillis))
    }

    // === 分享页参数提取 ===

    private data class IndexParams(
        val lx: Int,
        val up: Int,
        val ls: Int,
        val rep: String,
        val t: String,
        val k: String,
        val fid: Int,
        val uid: String,
        val pgs: Int,
        val puid: String
    )

    private fun extractIndexParams(html: String): IndexParams {
        fun first(pattern: Regex): String =
            pattern.find(html)?.groupValues?.get(1) ?: throw Exception("无法从分享页提取参数: $pattern")

        val lx = first(Regex("""'lx':(\d+),""")).toInt()
        val up = first(Regex("""'up':(\d+),""")).toInt()
        val ls = first(Regex("""'ls':(\d+),""")).toInt()
        // rep 可能为带引号字符串，去掉引号（对齐 api.py 直接取值）
        val rep = first(Regex("""'rep':([^,]+),""")).trim('\'', '"', ' ')
        // t 是变量名，真正的值形如 `xxx='12345'`
        val tVar = first(Regex("""'t'\s*:\s*(\w+)"""))
        val t = first(Regex("""$tVar\s*=\s*'(\d+)'"""))
        // k 可能是变量名或直接 hex；没有时兜底 _h59t8
        val k = try {
            val kVar = first(Regex("""'k'\s*:\s*(\w+)"""))
            first(Regex("""$kVar\s*=\s*'([a-f0-9]+)'"""))
        } catch (e: Exception) {
            try {
                first(Regex("""var\s+_h59t8\s*=\s*'([a-f0-9]+)'""", RegexOption.IGNORE_CASE))
            } catch (e2: Exception) {
                ""
            }
        }
        val fid = first(Regex("""'fid':(\d+),""")).toInt()
        val uid = first(Regex("""'uid':'([^']+)',"""))
        val pgs = first(Regex("""pgs\s*=\s*(\d+);""")).toInt()
        val puid = first(Regex("""'puid':'([^']+)',"""))

        return IndexParams(lx, up, ls, rep, t, k, fid, uid, pgs, puid)
    }

    // === 简易 Cookie 会话（对齐 requests.Session） ===

    private class LanzouSession {
        val cookies = mutableMapOf<String, String>()
        var lastHost: String? = null

        fun setCookie(name: String, value: String) {
            cookies[name] = value
        }

        fun updateCookies(values: Map<String, String>) {
            cookies.putAll(values)
        }

        /** 清空会话 cookie（对齐 Python 版 PAGE2 使用独立新 Session） */
        fun clearCookies() {
            cookies.clear()
        }

        /** 导出会话 Cookie 字符串（供直链下载使用） */
        fun cookiesString(): String =
            cookies.entries.joinToString("; ") { "${it.key}=${it.value}" }

        fun get(url: String, referer: String? = null): String =
            request("GET", url, null, referer)

        fun post(url: String, form: Map<String, String>, referer: String? = null): String {
            val body = form.entries.joinToString("&") { (key, value) ->
                "${encode(key)}=${encode(value)}"
            }
            return request("POST", url, body, referer)
        }

        private fun encode(s: String): String =
            URLEncoder.encode(s, StandardCharsets.UTF_8.name())

        private fun request(method: String, url: String, body: String?, referer: String?): String {
            val conn = (URL(url).openConnection() as HttpURLConnection).apply {
                requestMethod = method
                connectTimeout = CONNECT_TIMEOUT
                readTimeout = READ_TIMEOUT
                instanceFollowRedirects = true
                // 默认请求头（对齐 requests.Session.headers.update(headers)）
                DEFAULT_HEADERS.forEach { (k, v) -> setRequestProperty(k, v) }
                if (referer != null) setRequestProperty("Referer", referer)
                if (method == "POST") {
                    doOutput = true
                    setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
                }
                if (cookies.isNotEmpty()) {
                    setRequestProperty(
                        "Cookie",
                        cookies.entries.joinToString("; ") { "${it.key}=${it.value}" }
                    )
                }
            }

            try {
                if (method == "POST" && body != null) {
                    conn.outputStream.use { it.write(body.toByteArray(StandardCharsets.UTF_8)) }
                }
                val code = conn.responseCode
                val stream = if (code in 200..299) conn.inputStream else conn.errorStream

                // 提取 Set-Cookie（可多个）
                conn.headerFields?.forEach { (key, values) ->
                    if (key != null && key.equals("Set-Cookie", ignoreCase = true)) {
                        values.forEach { raw ->
                            val kv = raw.substringBefore(';').trim()
                            val idx = kv.indexOf('=')
                            if (idx > 0) {
                                cookies[kv.substring(0, idx).trim()] = kv.substring(idx + 1).trim()
                            }
                        }
                    }
                }
                lastHost = conn.url.host

                // 处理压缩响应：HttpURLConnection 不会自动解压 gzip/deflate，必须按 Content-Encoding 手动解压
                val encoding = conn.getHeaderField("Content-Encoding")?.lowercase() ?: ""
                val reader: BufferedReader = when {
                    encoding.contains("gzip") -> GZIPInputStream(stream).bufferedReader(StandardCharsets.UTF_8)
                    encoding.contains("deflate") -> InflaterInputStream(stream).bufferedReader(StandardCharsets.UTF_8)
                    else -> stream.bufferedReader(StandardCharsets.UTF_8)
                }
                return reader.use { it.readText() }
            } finally {
                conn.disconnect()
            }
        }
    }

    private data class FileEntry(
        val id: String,
        val name: String,
        val size: String
    )
}
