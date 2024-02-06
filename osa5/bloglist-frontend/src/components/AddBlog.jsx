import { useState } from 'react'

const AddBlog = ({ addBlog }) => {

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newURL
    }
    await addBlog(newBlog)

    setNewAuthor('')
    setNewTitle('')
    setNewURL('')
  }

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  return <div>
    <h2>create new</h2>
    <form onSubmit={handleCreateNewBlog}>
      <div>
                title:
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
                author:
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
                url:
        <input
          value={newURL}
          onChange={({ target }) => setNewURL(target.value)}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  </div>
}


export default AddBlog