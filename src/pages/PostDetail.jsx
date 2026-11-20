import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost } from '../api/posts.js'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch((err) => setError(err.message))
  }, [id])

  async function handleDelete() {
    if (!confirm('정말 삭제할까요?')) return
    try {
      await deletePost(id)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return (
      <div className="card">
        <p className="error">{error}</p>
        <Link to="/" className="btn">목록으로</Link>
      </div>
    )
  }
  if (!post) return <div className="card state">불러오는 중...</div>

  return (
    <article className="card">
      <h2 className="detail-title">{post.title}</h2>
      <div className="meta">
        <span className="author-chip">{post.author ?? '-'}</span>
        {post.createdAt && (
          <span>{String(post.createdAt).replace('T', ' ').slice(0, 16)}</span>
        )}
      </div>
      <div className="content">{post.content}</div>
      <div className="actions detail-actions">
        <Link to="/" className="btn">← 목록</Link>
        <span className="spacer" />
        <Link to={`/posts/${id}/edit`} className="btn">수정</Link>
        <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
      </div>
    </article>
  )
}
