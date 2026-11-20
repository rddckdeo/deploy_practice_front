import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 작성/수정 화면이 함께 쓰는 입력 폼
// showAuthor: 작성 화면에서만 작성자 입력칸을 보여준다 (수정 화면에서는 작성자 변경 불가)
export default function PostForm({ initialValue, submitLabel, onSubmit, showAuthor = false }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [content, setContent] = useState(initialValue?.content ?? '')
  const [author, setAuthor] = useState(initialValue?.author ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    // 백엔드 @NotBlank 검증과 맞춰서 미리 막아준다
    if (showAuthor && !author.trim()) return setError('작성자를 입력하세요.')
    if (!title.trim()) return setError('제목을 입력하세요.')
    if (!content.trim()) return setError('내용을 입력하세요.')

    setSubmitting(true)
    setError(null)
    try {
      const values = { title, content }
      if (showAuthor) values.author = author
      await onSubmit(values)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {showAuthor && (
        <label className="field">
          <span>작성자</span>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </label>
      )}
      <label className="field">
        <span>제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </label>
      <label className="field">
        <span>내용</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="button" className="btn" onClick={() => navigate(-1)}>
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
