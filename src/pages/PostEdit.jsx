import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'
import { getPost, updatePost } from '../api/posts.js'

export default function PostEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch((err) => setError(err.message))
  }, [id])

  async function handleSubmit(values) {
    await updatePost(id, values)
    navigate(`/posts/${id}`)
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
    <div className="card">
      <div className="page-head">
        <h2>글 수정</h2>
        <span className="author-chip">{post.author ?? '-'}</span>
      </div>
      <PostForm initialValue={post} submitLabel="수정 완료" onSubmit={handleSubmit} />
    </div>
  )
}
