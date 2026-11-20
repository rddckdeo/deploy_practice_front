import { useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'
import { createPost } from '../api/posts.js'

export default function PostWrite() {
  const navigate = useNavigate()

  async function handleSubmit(post) {
    const created = await createPost(post)
    // 백엔드가 생성된 글(id 포함)을 돌려주면 상세로, 아니면 목록으로 이동
    navigate(created?.id != null ? `/posts/${created.id}` : '/')
  }

  return (
    <div className="card">
      <div className="page-head">
        <h2>새 글 작성</h2>
      </div>
      <PostForm submitLabel="등록" onSubmit={handleSubmit} showAuthor />
    </div>
  )
}
