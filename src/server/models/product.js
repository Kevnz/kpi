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
  if (picArr.includes(category.toLowerCase())) {
    return `http://lorempixel.com/320/240/${category}?slide=${faker.random.number(
      { min: 0, max: 1000 }
    )}`
  }
  return `http://lorempixel.com/320/240/${
    picArr[faker.random.number({ min: 0, max: picArr.length - 1 })]
  }?slide=${faker.random.number({ min: 0, max: 1000 })}`
}

const createProduct = () => {
  const category = faker.commerce.department()
  return {
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    category,
    description: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()}. ${faker.company.catchPhrase()}.`,
    details: faker.lorem.paragraphs(10),
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
