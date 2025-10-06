const { test, describe } = require('node:test')
const assert = require('node:assert')

// Functions to test
const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')

// Test the dummy function
describe('dummy', () => {
  test('dummy should always return one', () => {
    assert.strictEqual(dummy([]), 1)
  })
  test('dummy should not return something else', () => {
    assert.notEqual(dummy([]), 9000)
  })
})

const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const oneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: "React patterns",
    author: "Michael Chan",
    url: 'https://reactpatterns.com/',
    likes: 13,
    __v: 0
  }
]

// Test totalLikes
describe('totalLikes', () => {

  test('empty list', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('one blog', () => {

    assert.strictEqual(totalLikes(oneBlog), 13)
  })

  test('multiple blogs', () => {
    const actual = totalLikes(multipleBlogs)
    assert.strictEqual(actual, 36)
  })
})

// test favoriteBlog
describe('favoriteBlog', () => {
  test('empty list', () => {
    assert.deepStrictEqual(favoriteBlog([]), null)
  })
  test('one blog', () => {
    assert.deepStrictEqual(favoriteBlog(oneBlog), oneBlog[0])
  })
  test('multiple blogs', () => {
    assert.deepStrictEqual(favoriteBlog(multipleBlogs), multipleBlogs[2])
  })
})

// test mostBlogs
describe('mostBlogs', () => {
  test('empty list', () => {
    assert.deepStrictEqual(mostBlogs([]), null)
  })
  test('one blog', () => {
    assert.deepStrictEqual(mostBlogs(oneBlog), { author: oneBlog[0].author, blogs: 1 })
  })
  test('multiple blogs', () => {
    assert.deepStrictEqual(mostBlogs(multipleBlogs), {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

// test mostLikes
describe('mostLikes', () => {
  test('empty list', () => {
    assert.deepStrictEqual(mostLikes([]), null)
  })
  test('one blog', () => {
    assert.deepStrictEqual(mostLikes(oneBlog), { author: oneBlog[0].author, likes: 13 })
  })
  test('multiple blogs', () => {
    assert.deepStrictEqual(mostLikes(multipleBlogs), {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})