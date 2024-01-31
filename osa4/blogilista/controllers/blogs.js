
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { info } = require('../utils/logger')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

    if (!request.body.title || !request.body.url) {
        response.status(400).end()
    }

    else {
        const blog = await new Blog({ ...request.body, likes: request.body.likes ? request.body.likes : 0 })
        const result = blog.save()
        response.status(201).json(result)
    }
})

blogRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const result = await Blog.findByIdAndUpdate(id, request.body, {new: true})
    response.status(201).json(result)
})

module.exports = blogRouter