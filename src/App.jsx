import { Link, Route, Routes } from 'react-router-dom'
import PostList from './pages/PostList.jsx'
import PostDetail from './pages/PostDetail.jsx'
import PostWrite from './pages/PostWrite.jsx'
import PostEdit from './pages/PostEdit.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Link to="/" className="logo">
            <span className="logo-mark">B</span>
            게시판
          </Link>
          <Link to="/write" className="btn btn-primary">
            ✏️ 글쓰기
          </Link>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/write" element={<PostWrite />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route
            path="*"
            element={
              <div className="card state">
                <p>페이지를 찾을 수 없습니다.</p>
                <Link to="/" className="btn">목록으로</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  )
}
