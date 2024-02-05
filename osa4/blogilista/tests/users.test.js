const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const { info } = require('../utils/logger')

const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const helper = require('../utils/list_helper')

const initialUserName = 'root'

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: initialUserName, passwordHash })

    await user.save()
})

describe('when there is initially one user at db', () => {

    test('get users is json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there is one user in the db', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(1)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'poutap1',
            name: 'Pekka Pouta',
            password: 'saailmio',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    })


})

describe('username and password check', () => {
    test('not empty credentials', async () => {
        const userNoUsername = {
            password: 'testi'
        }
        await api
            .post('/api/users')
            .send(userNoUsername)
            .expect(400)
        const userNoPassword = {
            username: 'testUserName'
        }
        await api
            .post('/api/users')
            .send(userNoPassword)
            .expect(400)
    })

    test('username and password are valid', async () => {
        const userBadUsername = {
            username: "Mä",
            password: 'seToimii'
        }
        await api
            .post('/api/users')
            .send(userBadUsername)
            .expect(400)
        const userBadPassword = {
            username: "Testinimi",
            password: 'se'
        }
        await api
            .post('/api/users')
            .send(userBadPassword)
            .expect(400)
    })

    test('there cannot be 2 same usernames', async () => {
        const userBadUsername = {
            username: initialUserName,
            password: 'seToimii'
        }
        await api
            .post('/api/users')
            .send(userBadUsername)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})