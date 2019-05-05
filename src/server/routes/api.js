const faker = require('faker')
const Cache = require('@brightleaf/cache')

const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD
}

const cache = new Cache({ prepend: 'kpi', redis: redisConfig })
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
      handler: async (request, h) => {
        const users = await cache.get('all-users')
        if (users) {
          return users
        }
        const genUsers = [
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
        cache.set('all-users', genUsers)
        return genUsers
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products',
    config: {
      handler: async (request, h) => {
        const products = await cache.get('all-products')
        if (products) {
          return products
        }
        const genProds = [
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
        cache.set('all-products', genProds)
        return genProds
      },
    },
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    config: {
      handler: async (request, h) => {
        const products = await cache.get('all-products')
        if (products) {
          const one = products.find(p => p.id === request.params.id)
          if (one.length > 0) return one[0]
          return products[0]
        }
        return createProduct()
      },
    },
  },
]
