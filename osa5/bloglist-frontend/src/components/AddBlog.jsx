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

  return <div className='addBlog'>
    <h2>create new</h2>
    <form onSubmit={handleCreateNewBlog}>
      <div>
        title:
        <input
          alt='input title'
          id='input_title'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          alt='input author'
          id='input_author'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          alt='input url'
          id='input_url'
          value={newURL}
          onChange={({ target }) => setNewURL(target.value)}
        />
      </div>
      <button type='submit' id='addblog_button'>create</button>
    </form>
  </div>
}


export default AddBlog