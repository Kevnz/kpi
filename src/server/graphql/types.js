const { gql } = require('apollo-server-hapi')

const typeDefs = gql`
  """
  The User is the person in the system
  """
  type User {
    firstName: String
    lastName: String
    username: String
    email: String
  }

  """
  The Product
  """
  type Product {
    id: String
    name: String
    price: String
    category: String
    description: String
    image: String
  }

  """
  The Blog Post
  """
  type Post {
    id: String
    title: String
    slug: String
    category: String
    description: String
    image: String
    body: String
  }
  type Query {
    user: User
    products: [Product]
    posts: [Post]
    post(slug: String): Post
  }

  """
  The **AuthPayload** returns a token to be saved for later requests and the user that was authenticated
  """
  type AuthPayload {
    token: String
    user: User
  }

  """
  The **NewUserInput** is the data required for a new user to be created
  """
  input NewUserInput {
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    password: String!
  }

  """
  The **LoginInput** is the data required for a user to login
  """
  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    """
    **signup** allows user to create an account
    """
    signup(newUserInput: NewUserInput!): AuthPayload!

    """
    **login** allows a user to authenticate
    """
    login(loginInput: LoginInput!): AuthPayload!
  }
`

module.exports = typeDefs
