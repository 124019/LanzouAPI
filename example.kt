// 镜像 example.py 的 Kotlin 示例
// 运行需在 classpath 中包含 lanzoucloudapi.kt、kotlinx-coroutines-core、org.json
import com.theveloper.pixelplay.data.github.LanzouCloudApi
import kotlinx.coroutines.runBlocking
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

fun main() {
    // 从 example.json 读取配置（对齐 example.py：information = json.load(f)）
    val information = JSONObject(File("./example.json").readText())
    val softwareTag = information.getString("software_tag")
    val versionTag = information.getString("version_tag")
    val password = information.getString("password")
    val targetNameFormat = information.getString("target_name_format")
    val shareUrl = information.getString("share_url")

    // 对齐 example.py 的 target_name 格式化逻辑
    var targetName = if (versionTag.isNotEmpty()) {
        targetNameFormat.replace("{version_tag}", versionTag)
    } else {
        targetNameFormat
    }
    if (softwareTag.isNotEmpty()) {
        targetName = targetNameFormat.replace("{software_tag}", softwareTag)
    }
    println(targetName)

    // 下载请求头（对齐 example.py 的 headers，Edge 151）
    val headers = mapOf(
        "Accept" to "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding" to "gzip, deflate, br, zstd",
        "Accept-Language" to "zh-CN,zh-HK;q=0.9,zh;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5",
        "Cache-Control" to "max-age=0",
        "DNT" to "1",
        "Sec-Fetch-Dest" to "document",
        "Sec-Fetch-Mode" to "navigate",
        "Sec-Fetch-Site" to "none",
        "Sec-Fetch-User" to "?1",
        "Upgrade-Insecure-Requests" to "1",
        "User-Agent" to "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0",
        "sec-ch-ua" to "\"Not=A?Brand\";v=\"99\", \"Microsoft Edge\";v=\"151\", \"Chromium\";v=\"151\"",
        "sec-ch-ua-mobile" to "?0",
        "sec-ch-ua-platform" to "\"Windows\"",
        "sec-gpc" to "1"
    )

    val api = LanzouCloudApi()
    // 对齐 example.py：ul_dict = eval(get_url(...))，得到 download_url 与 cookies
    val result = runBlocking {
        api.getUrl(shareUrl, password, targetName)
    }

    result.fold(
        onSuccess = { info ->
            println(info.downloadUrl)
            println("cookies: ${info.cookies}")
            // 对齐 example.py：response = requests.get(url=url, headers=headers, cookies=cookies)
            downloadFile(info.downloadUrl, info.cookies, headers, targetName)
            println("Saved downloaded file successfully")
        },
        onFailure = { error ->
            System.err.println("Failed: ${error.message}")
        }
    )
}

/** 下载文件（对齐 example.py：response.raise_for_status() + f.write(response.content)） */
fun downloadFile(
    url: String,
    cookies: Map<String, String>,
    headers: Map<String, String>,
    savePath: String
) {
    val conn = (URL(url).openConnection() as HttpURLConnection).apply {
        requestMethod = "GET"
        headers.forEach { (k, v) -> setRequestProperty(k, v) }
        if (cookies.isNotEmpty()) {
            setRequestProperty("Cookie", cookies.entries.joinToString("; ") { "${it.key}=${it.value}" })
        }
    }
    try {
        val code = conn.responseCode
        if (code !in 200..299) {
            throw Exception("HTTP $code")
        }
        conn.inputStream.use { input ->
            File(savePath).outputStream().use { output ->
                input.copyTo(output)
            }
        }
    } finally {
        conn.disconnect()
    }
}
