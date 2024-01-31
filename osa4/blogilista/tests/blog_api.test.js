const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const blog = require('../models/blog')

const api = supertest(app)


const initialBlogs = [
    {
        title: 'HTML is easy',
        author: "Pekka",
        url: "test.com",
        likes: 2
    },
    {
        title: 'Great blog',
        author: "Ponteva",
        url: "testi.com",
        likes: 28
    }
]

beforeEach(async () => {
    await blog.deleteMany({})
    let blogObject = new blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new blog(initialBlogs[1])
    await blogObject.save()
})

describe('MongoDB tests', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are 2 blogs', async () => {
        const response = await api.get('/api/blogs')
        logger.info("Response got...")
        logger.info('Response', response.body)
        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('there is a field "id"', async () => {
        const response = await api.get('/api/blogs')
        logger.info('Response[0] id: ', response.body[0].id)
        expect(response.body[0].id).toBeDefined()
    })

    test('One note is added', async () => {
        const initialResponse = await api.get('/api/blogs')

        const newBlog = {
            author: "Test Author",
            title: "Test Title",
            url: "testurl.fi",
            likes: 128
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newResponse = await api.get('/api/blogs')

        expect(newResponse.body).toHaveLength(initialResponse.body.length + 1)
        expect(newResponse.body.map(r => r.title)).toContain(newBlog.title)
    })

    test('Likes is 0 if null', async () => {
        const newBlog = {
            author: "Disliked Author",
            title: "Disliked Blog",
            url: "nobodyreadsthis.com"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const blog = response.body.find(b => b.title === newBlog.title)
        expect(blog.likes).toBe(0)
    })

    test('There have to be a title and an url', async () => {
        const noTitleBlog = {
            author: "No title",
            url: "URL",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(noTitleBlog)
            .expect(400)

        const noUrlBlog = {
            author: "No url author",
            title: "No Url",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(noUrlBlog)
            .expect(400)

        const noUrlorTitleBlog = {
            author: "No url or title author",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(noUrlorTitleBlog)
            .expect(400)

    })
})





afterAll(async () => {
    await mongoose.connection.close()
})