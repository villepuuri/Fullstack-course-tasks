import { useState } from 'react'
import PropTypes from 'prop-types'


const Blog = ({ blog, updateLikes, removeBlog, idName }) => {

  const [visibility, setVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const addLike = async () => {
    const newLikes = blog.likes + 1
    const newBlog = { ...blog, likes: newLikes }
    await updateLikes(newBlog)
  }

  const deleteBlog = async () => {
    const confirmValue = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )
    if (confirmValue) {
      await removeBlog(blog)
    }
  }

  return <div style={blogStyle} className='blog'>
    {blog.title} {blog.author}

    <button onClick={toggleVisibility}>
      {visibility ? 'hide' : 'view'}
    </button>

    {
      visibility ?
        <div>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes}
            <button onClick={addLike}>
              like
            </button>
          </div>
          <div>
            {blog.user.name}
          </div>
          <div>
            {
              (blog.user.username === idName ?
                <button onClick={deleteBlog}>
                  remove
                </button>
                : null)
            }

          </div>
        </div>
        : null
    }
  </div>
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  idName: PropTypes.string.isRequired,
}


export default Blog