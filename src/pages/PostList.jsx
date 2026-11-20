import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPosts } from '../api/posts.js'

export default function PostList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="card">
      <div className="page-head">
        <h2>
          전체 글
          {!loading && !error && <span className="count">{posts.length}개</span>}
        </h2>
      </div>

      {loading && <p className="state">불러오는 중...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="state">
          <p>아직 게시글이 없습니다.</p>
          <Link to="/write" className="btn btn-primary">첫 글 쓰기</Link>
        </div>
      )}

      {posts.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="num">번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                // 행 전체를 클릭해도 상세로 이동
                <tr key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                  <td className="num">{post.id}</td>
                  <td className="title">
                    <Link to={`/posts/${post.id}`} onClick={(e) => e.stopPropagation()}>
                      {post.title}
                    </Link>
                  </td>
                  <td>
                    <span className="author-chip">{post.author ?? '-'}</span>
                  </td>
                  <td className="date">
                    {post.createdAt ? String(post.createdAt).slice(0, 10) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
