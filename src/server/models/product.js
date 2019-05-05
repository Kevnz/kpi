const faker = require('faker')

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

module.exports = {
  get: createProduct,
  getAll: () => {
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
}
