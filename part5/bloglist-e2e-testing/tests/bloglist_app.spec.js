const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty db
    await request.post('http://localhost:3003/api/testing/reset')
    // Create user for backend
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: "Jari Ahonen",
        username: "jari",
        password: "salasana"
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    
    const usernameInput = page.getByLabel('username')
    const passwordInput = page.getByLabel('password')

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

  })

  describe('Login process', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const usernameInput =  page.getByLabel('username')
      const passwordInput = page.getByLabel('password')

      await usernameInput.fill('jari')
      await passwordInput.fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Logged in as', { exact: false })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const usernameInput = page.getByLabel('username')
      const passwordInput = page.getByLabel('password')
      const submitButton = page.getByRole('button', { name: 'login' })

      await usernameInput.fill('random')
      await passwordInput.fill('wrongPassword')
      await submitButton.click()

      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      await expect(page.getByText('wrong', { exact: false })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('jari')
      await page.getByLabel('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Logged in as', { exact: false })).toBeVisible()
    })
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('Title:').fill('Hard work pays off')
      await page.getByLabel('Author:').fill('Wise man')
      await page.getByLabel('url').fill('https://blog.wisdomsummit.com/hardwork')
      await page.getByRole('button', { name: 'create blog' }).click()

      await expect(page.getByText('Hard work', { exact: false })).toBeVisible()
      await expect(page.getByText('Wise man', { exact: false })).toBeVisible()
      await expect(page.getByText('https://blog.wisdomsummit.com/hardwork', { exact: false })).not.toBeVisible()

      await page.getByRole('button', { name: 'Show details' }).click()
      await expect(page.getByText('https://blog.wisdomsummit.com/hardwork')).toBeVisible()
    })
    describe('When blogs exists', () => {
      beforeEach(async ({ page, request }) => {
        // Create new blog
        await page.getByRole('button', { name: 'Create new blog' }).click()
        await page.getByLabel('Title:').fill('Hard work pays off')
        await page.getByLabel('Author:').fill('Wise man')
        await page.getByLabel('url').fill('https://blog.wisdomsummit.com/hardwork')
        await page.getByRole('button', { name: 'Create blog' }).click()
        // Login as a different user
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: "Sanna Ahonen",
            username: "sanna",
            password: "salainen"
          }
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByLabel('username').fill('sanna')
        await page.getByLabel('password').fill('salainen')
        await page.getByRole('button', { name: 'login' }).click()
        // Create another blog
        await page.getByRole('button', { name: 'Create new blog' }).click()
        await page.getByLabel('Title:').fill('Beauty and the yeast')
        await page.getByLabel('Author:').fill('Food magnate')
        await page.getByLabel('url').fill('https://blog.megafood.com/yeast')
        await page.getByRole('button', { name: 'Create blog' }).click()
      })
      test('a blog can be liked', async ({ page }) => {
        // Expand a blog
        const showDetailsButtons = await page.getByRole('button', { name: 'Show details' }).all()
        showDetailsButtons[0].click()
        // Click it 3 times
        await page.getByText('Like').click({ clickCount: 3 })
        // Expect the blog to have 3 likes
        await expect(page.getByText('3', { exact: false })).toBeVisible()
      })
      test('user can delete their blogs', async ({ page }) => {
        // Expand the second blog (owned by the user)
        await expect(page.getByText('Beauty and the yeast', { exact: false })).toBeVisible()
        await page.getByText('Beauty and the yeast').getByRole('button', { name: 'Show details' }).click()
        // Listen for the confirmation window
        page.on('dialog', async (dialog) => await dialog.accept())
        // Click the remove button
        await page.getByRole('button', { name: 'remove' }).click()
        // Expect the second blog to be removed
        await expect(page.getByText('Beauty and the yeast', { exact: false })).not.toBeVisible()
        await expect(page.getByText('Food magnate', { exact: false })).not.toBeVisible()
      })
      test('the remove button is hidden from non-owner users', async ({ page }) => {
        // Expand the first blog (not owned by the user)
        await page.getByText('Hard work pays off').getByRole('button', { name: 'Show details' }).click()
        // Expect a remove button _not_ to be visible
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        // Expand the second blog (owner by the user)
        await page.getByText('Beauty and the yeast').getByRole('button', { name: 'Show details' }).click()
        // Expect a remove button to be visible no
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      })
      test('Blogs are ordered by likes, descending', async ({ page }) => {
        // Expand the second blog
        await page.getByText('Beauty and the yeast').getByRole('button', { name: 'Show details' }).click()
        // Give the second blog a like
        await page.getByText('Like').click()
        // Hide the expanded blog
        await page.getByRole('button', { name: 'Hide' }).click()
        // Expand the first blog, expect to see url for 'Beauty and the yeast'.
        let buttonLocators = await page.getByText('Show details').all()
        await buttonLocators[0].click()
        expect(page.getByText(/https:\/\/blog.megafood.com\/yeast/)).toBeVisible()
        // Hide the expanded blog
        await page.getByRole('button', { name: 'Hide' }).click()
        // Expand the second blog, add 2 likes to it
        buttonLocators = await page.getByText('Show details').all()
        await buttonLocators[1].click()
        await expect(page.getByText(/Jari Ahonen/)).toBeVisible()
        await page.getByRole('button', { name: 'Like' }).click({ clickCount: 2 })
        await expect(page.getByText(/2/)).toBeVisible()
        // Hide the expanded blog
        await page.getByRole('button', { name: 'Hide' }).click()
        // Expand the first blog, expect to see url for 'Hard work pays off'
        buttonLocators = await page.getByText('Show details').all()
        await buttonLocators[0].click()
        expect(page.getByText(/https:\/\/blog.wisdomsummit.com\/hardwork/)).toBeVisible()
        await expect(page.getByText(/Jari Ahonen/)).toBeVisible()
      })
    })
  })
})