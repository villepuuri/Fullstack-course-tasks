import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const InfoNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="info">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState([])
  const [username, setUserName] = useState([])
  const [password, setPassword] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('Starting the app...')

    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    blogService.getAll().then(blogs => {
      console.log('Blogs: ', blogs)
      setBlogs(blogs)
    }
    )


  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      //login
      console.log('Trying to log in...')
      const loginUser = await loginService.login({
        username: username, password: password
      })
      console.log('user: ', loginUser)
      setUser(loginUser)
      blogService.setToken(loginUser.token)
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(loginUser)
      )
    }
    catch (error) {
      console.log('Login failed: ', error)
      setErrorMessage(
        `wrong username or password`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3500)
    }
  }

  const handleLogout = async (event) => {
    // Delete the user from local storage
    window.localStorage.removeItem('loggedBlogUser')

    // set user to null
    setUser([])
    blogService.setToken(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newURL
    }
    console.log('Creating a new blog: ', newBlog)
    const response = await blogService.addNewBlog(newBlog)
    await blogService.getAll().then(blogs => {
      console.log('Blogs: ', blogs)
      setBlogs(blogs)
    }
    )
    console.log('Blog created: ', response)
    setInfoMessage(
      `A new blog ${newTitle} by ${newAuthor} added`
    )
    setTimeout(() => {
      setInfoMessage(null)
    }, 3500)
  }

  if (!user || !user.token) {
    return (
      <div>
        <h2>Log in to application</h2>
        <InfoNotification message={infoMessage} />
        <ErrorNotification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username<input onChange={({ target }) => setUserName(target.value)} />
          </div>
          <div>
            password<input onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type='submit'>
            login
          </button>
        </form>
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>blogs</h2>
        <InfoNotification message={infoMessage} />
        <ErrorNotification message={errorMessage} />
        <p>{user.name} logged in
          <button onClick={handleLogout}>
            logout
          </button>
        </p>

        <h2>create new</h2>
        <form onSubmit={handleCreateNewBlog}>
          <div>title:<input onChange={({ target }) => setNewTitle(target.value)} /></div>
          <div>author:<input onChange={({ target }) => setNewAuthor(target.value)} /></div>
          <div>url:<input onChange={({ target }) => setNewURL(target.value)} /></div>
          <button type='submit'>create</button>
        </form>

        {blogs.map(blog => user.username === blog.user.username
          ? <Blog key={blog.id} blog={blog} />
          : null
        )}
      </div>
    )
  }
}

export default App