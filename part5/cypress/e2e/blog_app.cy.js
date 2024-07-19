describe('Blog Application', () => {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('API_BASE')}/testing/reset`)
    cy.request('POST', `${Cypress.env('API_BASE')}/users/`, {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    })
    cy.request('POST', `${Cypress.env('API_BASE')}/users/`, {
      name: 'Arto Hellas',
      username: 'hellas',
      password: 'salainen'
    })
    cy.visit('/')
  })

  it('shows the login form initially', () => {
    cy.contains('Log in to the application')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('User Login', () => {
    it('is successful with correct credentials', () => {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with incorrect credentials', () => {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.get('.error').contains('Invalid username or password')
    })
  })

  describe('After Login', () => {
    beforeEach(() => {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('allows the creation of a new blog', () => {
      cy.contains('new blog').click()
      cy.get('#title').type('The Joel Test: 12 Steps to Better Code')
      cy.get('#author').type('Joel Spolsky')
      cy.get('#url').type('https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/')
      cy.get('#create-button').click()
      cy.get('.success').contains('New blog "The Joel Test: 12 Steps to Better Code" by Joel Spolsky added')
      cy.contains('The Joel Test: 12 Steps to Better Code by Joel Spolsky')
    })

    describe('with a blog created by the logged-in user', () => {
      beforeEach(() => {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlog({
          title: 'The Joel Test: 12 Steps to Better Code',
          author: 'Joel Spolsky',
          url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
        })
      })

      it('allows the user to like a blog', () => {
        cy.contains('The Joel Test: 12 Steps to Better Code by Joel Spolsky')
          .contains('view')
          .click()
        cy.contains('likes 0')
          .contains('like')
          .click()
        cy.contains('likes 1')
      })

      it('allows the user to remove their own blog', () => {
        cy.contains('The Joel Test: 12 Steps to Better Code by Joel Spolsky')
          .contains('view')
          .click()
        cy.contains('remove').click()
        cy.contains('The Joel Test: 12 Steps to Better Code by Joel Spolsky').should('not.exist')
      })
    })

    describe('with a blog created by another user', () => {
      beforeEach(() => {
        cy.login({ username: 'hellas', password: 'salainen' })
        cy.createBlog({
          title: 'Things I Don’t Know as of 2018',
          author: 'Dan Abramov',
          url: 'https://overreacted.io/things-i-dont-know-as-of-2018/'
        })
        cy.login({ username: 'mluukkai', password: 'salainen' })
      })

      it('prevents the user from removing a blog they did not create', () => {
        cy.contains('Things I Don’t Know as of 2018')
          .contains('view')
          .click()
        cy.get('.remove-button').should('have.css', 'display', 'none')
      })
    })

    describe('with multiple blogs', () => {
      beforeEach(() => {
        cy.login({ username: 'mluukkai', password: 'salainen' })
        cy.createBlogWithLikes({
          title: 'The Joel Test: 12 Steps to Better Code',
          author: 'Joel Spolsky',
          url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
          likes: 10
        })
        cy.createBlogWithLikes({
          title: 'Things I Don’t Know as of 2018',
          author: 'Dan Abramov',
          url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
          likes: 5
        })
      })

      it('displays blogs sorted by likes, with the most liked first', () => {
        cy.get('.blog').eq(0).should('contain', 'The Joel Test: 12 Steps to Better Code by Joel Spolsky')
        cy.get('.blog').eq(1).should('contain', 'Things I Don’t Know as of 2018 by Dan Abramov')
      })
    }) 
  })
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('API_BASE')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogUser', JSON.stringify(body))
    cy.visit('/')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: `${Cypress.env('API_BASE')}/blogs`,
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
    }
  })

  cy.visit('/')
})

Cypress.Commands.add('createBlogWithLikes', ({ title, author, url, likes }) => {
  cy.request({
    url: `${Cypress.env('API_BASE')}/blogs`,
    method: 'POST',
    body: { title, author, url, likes },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogUser')).token}`
    }
  })

  cy.visit('/')
})
