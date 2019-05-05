const faker = require('faker')

const createPost = () => {
  const postTitle = faker.company.catchPhrase()
  return {
    id: faker.random.uuid(),
    slug: faker.lorem.slug(),
    title: postTitle,
    category: faker.commerce.department(),
    description: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}. ${faker.company.catchPhrase()}.`,
    image: faker.image.imageUrl(),
    body: faker.lorem.paragraphs(faker.random.number({ min: 3, max: 10 })),
  }
}

module.exports = {
  get: createPost,
  getAll: () => {
    return [
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
      createPost(),
    ]
  },
}
