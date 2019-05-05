const faker = require('faker')

const createUser = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    id: faker.random.uuid(),
    firstName,
    lastName,
    email: faker.internet
      .email(firstName, lastName, 'example.com')
      .toLowerCase(),
    username: faker.internet.userName(firstName, lastName).toLowerCase(),
  }
}

const createProduct = () => {
  return {
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    category: faker.commerce.department(),
    description: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}. ${faker.company.catchPhrase()}.`,
    image: faker.image.imageUrl(),
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/api/users',
    config: {
      handler: (request, h) => {
        return [
          createUser(),
          createUser(),
          createUser(),
          createUser(),
          createUser(),
          createUser(),
          createUser(),
          createUser(),
          createUser(),
          createUser(),
        ]
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products',
    config: {
      handler: (request, h) => {
        return [
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
          createProduct(),
        ]
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    config: {
      handler: (request, h) => {
        return createProduct()
      },
    },
  },
]
