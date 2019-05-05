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

module.exports = {
  getUser: createUser,
  getUsers: () => {
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
}
