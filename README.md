# 배포 연습용 게시판 - 프론트엔드

Vite + React(JavaScript) + React Router.
백엔드는 Spring Boot(`localhost:8080`), 모든 API는 `/api`로 시작합니다.

## 사용 버전

| 항목 | 버전 |
| --- | --- |
| Node.js | 22.12.0 (npm 10.9.0) |
| React / React DOM | 19.3.1 |
| React Router (react-router-dom) | 7.18.6 |
| Vite | 8.3.8 |
| @vitejs/plugin-react | 6.3.0 |

## 실행

```bash
npm install
npm run dev      # http://localhost:5173 (백엔드 8080도 함께 켜두기)
npm run build    # 운영용 빌드
npm run preview  # 빌드 결과물 로컬 확인
```

## 화면(라우트)

| 경로 | 화면 |
| --- | --- |
| `/` | 게시글 목록 |
| `/posts/:id` | 상세 (수정·삭제 버튼) |
| `/write` | 작성 |
| `/posts/:id/edit` | 수정 |

## 사용하는 API (백엔드와 맞춰야 함)

| 메서드 | 경로 | 용도 | 요청 body |
| --- | --- | --- | --- |
| GET | `/api/posts` | 목록 | - |
| GET | `/api/posts/{id}` | 상세 | - |
| POST | `/api/posts` | 작성 | `{ "title", "content", "author" }` (모두 필수) |
| PUT | `/api/posts/{id}` | 수정 | `{ "title", "content" }` |
| DELETE | `/api/posts/{id}` | 삭제 | - |

응답 필드는 `id`, `title`, `content`, `author`, `createdAt`(선택)을 사용합니다.
목록 응답은 배열 또는 Spring `Page` 객체(`{ content: [...] }`) 둘 다 처리합니다.

## API 호출 구조 (CORS가 필요 없는 이유)

코드에서는 `fetch("/api/posts")`처럼 **상대 경로만** 사용합니다.

- **개발**: 브라우저 → `localhost:5173/api/...` → Vite proxy(`vite.config.js`의 `server.proxy`) → `localhost:8080/api/...`
- **운영**: 브라우저 → `내도메인/api/...` → Nginx `proxy_pass` → 백엔드

브라우저 입장에서는 항상 **페이지와 같은 출처(origin)** 로 요청하므로 CORS가 발생하지 않습니다.
(백엔드 주소를 다른 곳으로 바꿀 때도 프론트 코드는 수정할 필요 없음)

## 빌드 결과물 위치

`npm run build`를 실행하면 프로젝트 루트의 **`dist/`** 폴더에 결과물이 생깁니다.

```
dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

이 `dist/` 폴더 안의 내용을 Nginx의 `root` 경로(예: `/usr/share/nginx/html`)에 올리면 됩니다.

## React Router 새로고침 404 문제 (Nginx)

### 왜 404가 나는가

- React 앱은 실제로 **`index.html` 파일 하나**뿐인 SPA입니다. `/posts/3` 같은 경로는 브라우저 안의 JavaScript(React Router)가 만들어내는 "가상의 경로"입니다.
- 앱 안에서 링크를 클릭해 이동할 때는 서버에 요청하지 않고 JS가 화면만 바꾸므로 문제가 없습니다.
- 하지만 `/posts/3`에서 **새로고침**하거나 주소창에 직접 입력하면, 브라우저가 Nginx에게 `GET /posts/3`을 요청합니다.
- Nginx는 `dist/posts/3` 이라는 **실제 파일을 찾는데 없으므로 404**를 반환합니다.

### 해결: 없는 경로는 index.html로 돌려주기

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;   # dist/ 내용을 올린 경로
    index index.html;

    # 1) API 요청은 백엔드로 전달 (같은 출처이므로 CORS 불필요)
    location /api/ {
        proxy_pass http://localhost:8080;   # 백엔드 주소 (docker면 http://backend:8080 등)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2) 그 외 요청: 실제 파일이 있으면 그 파일, 없으면 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- `try_files $uri $uri/ /index.html;` → `/assets/index-xxx.js`처럼 실제 파일은 그대로 주고, `/posts/3`처럼 없는 경로는 `index.html`을 줍니다. 그러면 React Router가 URL을 보고 알맞은 화면을 그립니다.
- `location /api/`가 `location /`보다 더 구체적이므로 API 요청은 SPA fallback에 걸리지 않고 백엔드로 갑니다.
- `proxy_pass http://localhost:8080;` 처럼 **끝에 `/`를 붙이지 않으면** `/api/posts` 경로가 그대로 백엔드에 전달됩니다. (`http://localhost:8080/`처럼 `/`를 붙이면 `/api/` 부분이 잘려서 전달되니 주의)

## 파일 구조와 역할

```
front/
├── index.html                  # 앱의 유일한 HTML. #root에 React가 그려짐
├── package.json                # 의존성과 npm 스크립트(dev/build/preview)
├── vite.config.js              # Vite 설정 + 개발용 /api 프록시(→ 8080)
├── .gitignore                  # node_modules, dist 등 제외
└── src/
    ├── main.jsx                # 진입점. BrowserRouter로 App을 감싸 렌더링
    ├── App.jsx                 # 라우트 정의(/, /write, /posts/:id, /posts/:id/edit)
    ├── index.css               # 최소한의 공통 스타일
    ├── api/
    │   └── posts.js            # 게시글 API 호출 함수 모음(상대 경로 /api/posts)
    ├── components/
    │   └── PostForm.jsx        # 작성/수정 화면이 공유하는 제목·내용 입력 폼
    └── pages/
        ├── PostList.jsx        # 목록 화면
        ├── PostDetail.jsx      # 상세 화면 + 수정/삭제 버튼
        ├── PostWrite.jsx       # 작성 화면
        └── PostEdit.jsx        # 수정 화면(기존 글을 불러와 폼에 채움)
```
