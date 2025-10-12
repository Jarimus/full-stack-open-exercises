import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  test('renders content', () => {

    const blog = {
      title: "title always visible",
      author: "author always visible",
      url: "url initally hidden",
      likes: 9000,
      user: {
        username: "jari"
      }
    }
  
    render(<Blog blog={blog} />)
  
    // Initially: title and author visible, the others not
    const title = screen.getByText('title always visible', { exact: false })
    expect(title).toBeVisible()
    const author = screen.getByText('author always visible', { exact: false })
    expect(author).toBeVisible()
    const likes = screen.queryByText('9000', { exact: false })
    expect(likes).toBeNull()
    const url = screen.queryByText('url initally hidden', { exact: false })
    expect(url).toBeNull()
    })

  test('clicking "Show details" should make all fields visible', async () => {

    const blog = {
      title: "title always visible",
      author: "author always visible",
      url: "url initally hidden",
      likes: 9000,
      user: {
        username: "jari"
      }
    }
  
    render(<Blog blog={blog} />)

    // Setup the user
    const user = userEvent.setup()

    // Find and click the "Show details" button
    const showDetailsButton = screen.getByText('Show details');
    await user.click(showDetailsButton);

    // Additional fields should be visible
    const title = screen.getByText('title always visible', { exact: false })
    expect(title).toBeVisible()
    const author = screen.getByText('author always visible', { exact: false })
    expect(author).toBeVisible()
    const likes = screen.getByText('9000', { exact: false })
    expect(likes).toBeVisible()
    const url = screen.getByText('url initally hidden', { exact: false })
    expect(url).toBeVisible()

  })

  test('clicking "like" twice calls the "updateLikes" handler twice.', async () => {

    const blog = {
      title: "title always visible",
      author: "author always visible",
      url: "url initally hidden",
      likes: 9000,
      user: {
        username: "jari"
      }
    }
  
    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} updateLikes={mockHandler} usernameFromToken={"jari"} />
    )

    // Initialise user
    const user = userEvent.setup()

    // First show all details
    const expandButton = screen.getByText('Show details')
    await user.click(expandButton)

    // Click the like button twice
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  

})
