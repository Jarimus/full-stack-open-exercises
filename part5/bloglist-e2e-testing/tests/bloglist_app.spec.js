const { test, expect, beforeEach, describe } = require('@playwright/test')
const { exitCode } = require('process')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty credentials (local storage)
    // await page.evaluate()
    // Empty db here
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

    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('jari')
      await page.getByLabel('password').fill('salasana')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('Title:').fill('Hard work pays off')
      await page.getByLabel('Author:').fill('Wise man')
      await page.getByLabel('url').fill('https://blog.wisdomsummit.com/hardwork')
      await page.getByRole('button', { name: 'create blog' }).click()

      await expect(page.getByText('Hard work pays off', { exact: false })).toBeVisible()
      await expect(page.getByText('Wise man', { exact: false })).toBeVisible()
      await expect(page.getByText('https://blog.wisdomsummit.com/hardwork', { exact: false })).not.toBeVisible()

    })

    test('a blog can be liked', async ({ page }) => {
      // Create new blog
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('Title:').fill('Hard work pays off')
      await page.getByLabel('Author:').fill('Wise man')
      await page.getByLabel('url').fill('https://blog.wisdomsummit.com/hardwork')
      await page.getByRole('button', { name: 'create blog' }).click()
      // Expand it
      await page.getByText('Show details').click()
      // Click it a hundred times
      await page.getByText('Like').click({ clickCount: 100 })
      // Expect the blog to have 100 likes
      await expect(page.getByText('100', { exact: false })).toBeVisible()
      
    })

  })

})