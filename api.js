// api.js
const BASE_URL = 'https://azit2025.duckdns.org'; // 예: https://api.example.com

async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',         // 다른 도메인이면 CORS 허용 필요
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  // 비어있는 응답일 수도 있으니 시도 후 실패하면 빈 객체
  try { return await res.json(); } catch { return {}; }
}

// 1) 사용자 생성: nickName, email(optional)
export async function createUser({ nickName, email }) {
  const body = { nickName };
  if (email && email.trim() !== '') body.email = email.trim();
  return post('/users', body); // { userId: ..., ... } 라고 가정
}

// 2) 메모리 생성: answer1~3
export async function createMemory(userId, { answer1, answer2, answer3 }) {
  return post(`/users/${encodeURIComponent(userId)}/memory`, { answer1, answer2, answer3 }); // { memoryId: ... } 라고 가정
}

/// 2) 추억 분석 (클로드)
export async function analyzeMemory({ userId, memoryId }) {
  return post(
    `/users/${encodeURIComponent(userId)}/memory/${encodeURIComponent(memoryId)}/analyze`,
    {} // 명세에 RequestBody 없으니까 빈 객체 전송
  );
}

// 3) 뮤직젠 음악 생성: elementId로 노래 만들기
export async function generateMusic({ elementId }) {
  return post('/replicate/musicgen/create', { elementId });
  // 응답 예:
  // { songId, midiUrl, wavUrl, svgUrl, createdAt }
}