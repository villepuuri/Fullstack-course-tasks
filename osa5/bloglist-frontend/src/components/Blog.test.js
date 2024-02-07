import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import AddBlog from './AddBlog'

const testBlog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Teppo Testaaja',
  likes: 400,
  url: 'setoimii.fi',
  user: {
    id: 1234,
    username: 'Test Person',
    name: 'Testaaja'
  }
}

test('renders initial content', () => {
  // 5.13

  render(<Blog blog={testBlog} />)

  const element = screen.getByText(
    `${testBlog.title} ${testBlog.author}`
  )
  expect(element).toBeDefined()

  const firstNotElement = screen.queryByText(testBlog.url, { exact: false })
  const scndNotElement = screen.queryByText(testBlog.likes, { exact: false })

  expect(firstNotElement).toBeNull()
  expect(scndNotElement).toBeNull()
})

test('clicking the button reveals more information', async () => {
  // 5.14

  render(
    <Blog blog={testBlog} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // screen.debug()

  const firstNotElement = screen.queryByText(testBlog.url, { exact: false })
  const scndNotElement = screen.queryByText(testBlog.likes, { exact: false })
  expect(firstNotElement).toBeDefined()
  expect(scndNotElement).toBeDefined()
})

test('doubleclick on the like-button', async () => {
  // 5.15

  const mockHandler = jest.fn()
  render(
    <Blog blog={testBlog} updateLikes={mockHandler} />
  )

  // Open more information about the blog
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // press the like button twice
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})


test('add blog form', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<AddBlog addBlog={createBlog} />)

  const titleInput = screen.getByAltText('input title')
  const authorInput = screen.getByAltText('input author')
  const urlInput = screen.getByAltText('input url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testTitle')
  await user.type(authorInput, 'testAuthor')
  await user.type(urlInput, 'testUrl')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testTitle')
  expect(createBlog.mock.calls[0][0].author).toBe('testAuthor')
  expect(createBlog.mock.calls[0][0].url).toBe('testUrl')
})
