const BASE_URL = 'https://generativelanguage.googleapis.com'
const API_VERSION = '/v1beta' // 强制使用 v1beta 版本

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const headers = getRequestHeaders(event)
  const body = await readRawBody(event)

  // 移除原始路径中可能存在的版本信息
  let apiPath = url.pathname.replace(/^\/v1(beta)?/, '')
  
  // 构建完整的 URL，强制使用 v1beta
  const fullUrl = BASE_URL + API_VERSION + apiPath + url.search

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
