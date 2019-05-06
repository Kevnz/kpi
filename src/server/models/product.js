const faker = require('faker')
/*

abstract animals business cats city food nightlife fashion people nature sports technics transport
*/
const picArr = [
  'abstract',
  'animals',
  'business',
  'cats',
  'city',
  'food',
  'nightlife',
  'fashion',
  'people',
  'nature',
  'sports',
  'technics',
  'transport',
]
const getPicture = category => {
  if (picArr.contains(category.toLoweCase())) {
    return `http://lorempixel.com/320/240/${category}`
  }
  return `http://lorempixel.com/320/240/${
    picArr[faker.random.number({ min: 0, max: picArr.length - 1 })]
  }`
}

const createProduct = () => {
  const category = faker.commerce.department()
  return {
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    category,
    description: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}. ${faker.company.catchPhrase()}.`,
    image: getPicture(category),
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
