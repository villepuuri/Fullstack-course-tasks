const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const logger = require('../utils/logger')
const blog = require('../models/blog')
const user = require('../models/user')
const bcrypt = require('bcrypt')

const loginRouter = require('../controllers/login')

const api = supertest(app)


const initialBlogs = [
    {
        title: 'HTML is easy!',
        author: "Pekka",
        url: "test.com",
        likes: 2
    },
    {
        title: 'Great blog!',
        author: "Ponteva",
        url: "testi.com",
        likes: 28
    }
]

let testUser = {
    username: 'username',
    name: 'name',
    password: 'password',
    passwordHash: '',
    token: process.env.TEST_TOKEN
}

let savedUser
let loginInfo



describe('MongoDB tests', () => {

    beforeEach(async () => {

        // Add the test user
        await user.deleteMany({})
        testUser['passwordHash'] = await bcrypt.hash(testUser.password, 10)
        savedUser = await api
            .post('/api/users')
            .send({
                username: testUser.username,
                name: testUser.name,
                password: testUser.password
            })

        console.log('Saveduser: ', savedUser.body)

        loginInfo = await api
            .post('/api/login')
            .send({
                username: testUser.username,
                password: testUser.password
            })
        console.log('LoginInfo: ', loginInfo.body)


        await blog.deleteMany({})
        let blogObject = new blog({ ...initialBlogs[0], user: savedUser.body.id })
        await blogObject.save()
        blogObject = new blog({ ...initialBlogs[1], user: savedUser.body.id })
        await blogObject.save()
    })

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
            user: savedUser.id,
            likes: 128
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
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
            url: "nobodyreadsthis.com",
            user: savedUser.id
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
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
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
            .send(noTitleBlog)
            .expect(400)

        const noUrlBlog = {
            author: "No url author",
            title: "No Url",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
            .send(noUrlBlog)
            .expect(400)

        const noUrlorTitleBlog = {
            author: "No url or title author",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
            .send(noUrlorTitleBlog)
            .expect(400)

    })

    test("Delete a note", async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const id = response.body[0].id

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
            .expect(204)

        const newResponse = await api.get('/api/blogs')
        expect(newResponse.body.length).toBe(initialBlogs.length - 1)

    })

    test("update a note", async () => {
        const newLikes = 10101
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const id = response.body[0].id
        const updatedBlog = { ...response.body[0], likes: newLikes, user: savedUser.id }

        console.log('Updated blog', updatedBlog)

        await api
            .put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${loginInfo.body.token}`)
            .send(updatedBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newResponse = await api.get('/api/blogs')

        expect(newResponse.body.map(r => r.likes)).toContain(newLikes)
    })

    test("token is required", async () => {
        const newBlog = {
            author: "No auth",
            title: "Blog without auth",
            url: "URL",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})





afterAll(async () => {
    await mongoose.connection.close()
})