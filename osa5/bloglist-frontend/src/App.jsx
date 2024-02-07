import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import AddBlog from './components/AddBlog'

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

    refreshBlogs()


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
        'wrong username or password'
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

  const addBlog = async (newBlog) => {
    try {
      console.log('Creating a new blog: ', newBlog)
      const response = await blogService.addNewBlog(newBlog)

      await refreshBlogs()

      setInfoMessage(
        `A new blog ${newTitle} by ${newAuthor} added`
      )
      setTimeout(() => {
        setInfoMessage(null)
      }, 3500)
    }
    catch (error) {
      setErrorMessage(
        `${error}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3500)
    }
  }

  const updateLikes = async (newBlog) => {
    try {
      console.log('Updating likes: ', newBlog)
      const response = await blogService.updateLikes(newBlog)
      await refreshBlogs()
    }
    catch (error) {
      setErrorMessage(
        `${error}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3500)
    }
  }

  const removeBlog = async (blogToRemove) => {
    try {
      const infoText = `A blog ${blogToRemove.title} by ${blogToRemove.author} removed`
      const response = await blogService.removeBlog(blogToRemove)
      refreshBlogs()
      setInfoMessage(
        infoText
      )
      setTimeout(() => {
        setInfoMessage(null)
      }, 3500)
    }
    catch (error) {
      setErrorMessage(
        `${error}`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 3500)
    }
  }

  const refreshBlogs = async () => {
    // Update the bloglist:
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => a.likes < b.likes ? 1 : -1)
    setBlogs(blogs)
  }

  if (!user || !user.token) {
    return (
      <div>
        <h2>Log in to application</h2>
        <InfoNotification message={infoMessage} />
        <ErrorNotification message={errorMessage} />
        <form onSubmit={handleLogin} id='logInForm'>
          <div>
            username<input id='username' onChange={({ target }) => setUserName(target.value)} />
          </div>
          <div>
            password<input id='password' onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type='submit' id='loginbutton'>
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


        <Togglable buttonLabel="Add a new blog">
          <AddBlog
            addBlog={addBlog} />
        </Togglable>

        {blogs.map(blog => <Blog
          key={blog.id}
          blog={blog}
          updateLikes={updateLikes}
          removeBlog={removeBlog}
          idName={user.username} />
        )}
      </div>
    )
  }
}

export default App