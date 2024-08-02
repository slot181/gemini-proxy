const BASE_URL = 'https://generativelanguage.googleapis.com'
const DEFAULT_API_VERSION = '/v1beta' // 默认 API 版本

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const headers = getRequestHeaders(event)
  const body = await readRawBody(event)

  // 确定 API 版本
  let apiPath = url.pathname
  if (!apiPath.startsWith('/v1beta') && !apiPath.startsWith('/v1')) {
    apiPath = DEFAULT_API_VERSION + apiPath
  }

  // 构建完整的 URL
  const fullUrl = BASE_URL + apiPath + url.search

  try {
    // 发送代理请求
    const res = await fetch(fullUrl, {
      method: event.method,
      headers: headers,
      body,
    })

    // 日志记录，但不改变响应
    if (!res.ok) {
      console.warn(`API request returned non-OK status: ${res.status} ${res.statusText}`)
    }

    // 直接返回原始响应
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    })
  } catch (error) {
    // 记录错误，但不改变响应
    console.error('Proxy request error:', error)
    
    // 抛出原始错误，让框架处理
    throw error
  }
})
