import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test.only('<CreateBlogForm />: submitting form with completed fields', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()
  const notify = vi.fn()
  
  render(<CreateBlogForm createBlog={createBlog} notify={notify} />)

  // Get input fields
  const inputTitle = screen.getByLabelText('Title:')
  const inputAuthor = screen.getByLabelText('Author:')
  const inputUrl = screen.getByLabelText('Url:')

  // Write into fields
  await user.type(inputTitle, 'title')
  await user.type(inputAuthor, 'author')
  await user.type(inputUrl, 'url')
  // Submit
  const submitButton = screen.getByText('Create blog')
  await user.click(submitButton)
  // Make sure the function gets called once with correct arguments
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: 'title',
    url: 'url',
    author: 'author'
  })

})