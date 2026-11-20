// 모든 API 호출은 상대 경로(/api/...)로만 한다.
// - 개발: Vite proxy가 /api 를 http://localhost:8080 으로 전달
// - 운영: Nginx가 같은 도메인의 /api 를 백엔드로 전달
// 따라서 브라우저는 항상 "같은 출처"로 요청하므로 CORS 설정이 필요 없다.
const BASE = '/api/posts'

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`요청 실패 (${res.status})`)
  }
  // 204 No Content 또는 빈 응답 처리
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export async function getPosts() {
  const data = await request(BASE)
  // 백엔드가 배열을 주든, Spring Page 객체({ content: [...] })를 주든 처리
  return Array.isArray(data) ? data : (data?.content ?? [])
}

export function getPost(id) {
  return request(`${BASE}/${id}`)
}

export function createPost(post) {
  return request(BASE, { method: 'POST', body: JSON.stringify(post) })
}

export function updatePost(id, post) {
  return request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(post) })
}

export function deletePost(id) {
  return request(`${BASE}/${id}`, { method: 'DELETE' })
}
