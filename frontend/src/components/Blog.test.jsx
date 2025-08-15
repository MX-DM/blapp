import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

const blog = {
    id: '123',
    author: 'MDM TEST',
    title: 'EM DI EM',
    url: 'www.emdeeme',
    likes: 10,
    user: {
        id: '679d18cd8327479f69626dc6',
        name: 'maxi della maggiore',
        username: 'mdm69'
    }
}

const renderBlog = (props = {}) => {
    return render(
        <MemoryRouter>
            <Blog
                blog={blog}
                updateLikes={() => vi.fn()}
                deleteBlog={() => vi.fn()}
                {...props}
            />
        </MemoryRouter>
    )
}

test('Only renders title and author by default', () => {
    const { container } = renderBlog()

    const div = container.querySelector('.blog-details-wrapper')
    expect(div).toHaveClass('collapsed')

    expect(screen.getByTestId('blog-title')).toBeVisible()
    expect(screen.getByTestId('blog-author')).toBeVisible()
})

test('Clicking the button to show details, shows url and likes', async () => {
    const { container } = renderBlog()
    const user = userEvent.setup()

    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.blog-details-wrapper')
    expect(div).toHaveClass('expanded')

    expect(screen.getByTestId('blog-title')).toBeVisible()
    expect(screen.getByTestId('blog-author')).toBeVisible()
    expect(screen.getByTestId('blog-url')).toBeVisible()
    expect(screen.getByTestId('blog-likes')).toBeVisible()
})

test('Clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(
        <MemoryRouter>
            <Blog blog={blog} updateLikes={mockHandler} currentUser={'123'} />
        </MemoryRouter>
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)
    const button = screen.getByText('Like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler).toHaveBeenCalledTimes(2)
})
