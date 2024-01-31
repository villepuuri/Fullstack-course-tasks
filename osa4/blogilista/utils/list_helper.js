let _ = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce(
        (accumulator, blog) => accumulator + blog.likes,
        0
    )
    return total
}

const favorite = (blogs) => {
    if (blogs.length === 0) {
        return {
            title: '',
            author: '',
            likes: 0
        }
    }
    blogs.sort((a,b) => b.likes - a.likes)
    return {
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes
    }
}

const mostBlogs = (blogs) => {
    const counts = {}
    for (const blog of blogs) {
        counts[blog.author] = counts[blog.author] ? counts[blog.author] + 1 : 1
    }
    let mostBlogsObject = {
        author: "",
        blogs: 0
    }
    for (const [key, value] of Object.entries(counts)){
        if (mostBlogsObject.blogs < value){
            mostBlogsObject = {
                author: key,
                blogs: value
            }
        }
    }

    return mostBlogsObject
}

const mostLikes = (blogs) => {
    const authorLikes = {}
    blogs.forEach(blog => {
        if(!authorLikes[blog.author]){
            authorLikes[blog.author] = 0
        }
    })
    blogs.forEach(blog => {
        authorLikes[blog.author] += blog.likes
    })
    let mostLikesObject = {
        author: "",
        likes: 0
    }
    for (const [key, value] of Object.entries(authorLikes)){
        if (mostLikesObject.likes < value){
            mostLikesObject = {
                author: key,
                likes: value
            }
        }
    }
    return mostLikesObject
}

module.exports = {
    dummy,
    totalLikes,
    favorite,
    mostBlogs,
    mostLikes
}
