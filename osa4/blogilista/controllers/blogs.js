
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { info } = require('../utils/logger')
const jwt = require('jsonwebtoken')

require('express-async-errors')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})



blogRouter.post('/', async (request, response) => {
    const body = request.body
    
    const user = request.user
    if (!user) {
        response.status(401).json({ error: 'token invalid' }).end()
    }

    if (!body.title || !body.url) {
        response.status(400).end()
    }

    else {

        const blog = await new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes ? body.likes : 0,
            user: user._id
        })
        const result = await blog.save()

        
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        console.log('User blogs: ', user.blogs)

        response.status(201).json(blog)
    }
})

blogRouter.delete('/:id', async (request, response) => {

    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(blog.id)
        response.status(204).end()
    }
    else {
        response.status(400).json({ error: 'Invalid token' })
    }

})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const result = await Blog.findByIdAndUpdate(id, request.body, { new: true })
    response.status(201).json(result)
})

module.exports = blogRouter