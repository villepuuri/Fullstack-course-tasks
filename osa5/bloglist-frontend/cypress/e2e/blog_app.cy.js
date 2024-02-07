describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Teppo Testinimi',
      username: 'teppoTestinimi',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.get('#logInForm')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('teppoTestinimi')
      cy.get('#password').type('password')
      cy.get('#loginbutton').click()

      cy.contains('Teppo Testinimi logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Nimetön')
      cy.get('#password').type('wrong')
      cy.get('#loginbutton').click()

      cy.contains('wrong username or password')
    })
  })


  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'teppoTestinimi', password: 'password' })
    })

    it('A blog can be created', function () {
      cy.contains('Add a new blog').click() // Open the add blog form

      cy.get('#input_title').type('blog_title')
      cy.get('#input_author').type('blog_author')
      cy.get('#input_url').type('blog_url')
      cy.get('#addblog_button').click()

      cy.contains('blog_title blog_author')

    })

    describe('When there is a blog', function () {

      beforeEach(function () {
        cy.addBlog({ title: 'blog_title', author: 'blog_author', url: 'blog_url' })
      })

      it('A blog can be liked', function () {
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('User can remove a blog', function () {
        cy.contains('view').click()
        cy.get('#removeblog_button').click()

        cy.contains('A blog blog_title by blog_author removed')
      })

      it('Blog-remove button can only be seen by the user who added the blog', function () {
        // logout, add new user, log in
        cy.contains('logout').click()
        const user = {
          name: 'Veikko Väärentelijä',
          username: 'veikkoväärintelijä',
          password: 'password'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.login({ username: 'veikkoväärintelijä', password: 'password' })

        cy.contains('view').click()
        cy.get('#removeblog_button').should('not.exist')
      })

      describe('when there are multiple blogs', function () {
        beforeEach(function () {
          cy.contains('Add a new blog').click() // Open the add blog form
          cy.addBlog({ title: '1_title', author: '1_author', url: '1_url', likes: 1 })
        })

        it('The blogs are ordered based on likes', function () {
          cy.get('.blog').eq(0).should('contain', '1_title')

          cy.get('.blog').contains('blog_title blog_author').contains('view').click()
          cy.contains('like').click()
          cy.visit('http://localhost:5173')

          cy.get('.blog').contains('blog_title blog_author').contains('view').click()
          cy.contains('like').click()
          cy.visit('http://localhost:5173')

          cy.get('.blog').eq(0).should('contain', 'blog_title')

        })
      })

    })


  })


})

