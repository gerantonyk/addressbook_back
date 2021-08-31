import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context } from './context'
//deleteUser(id: Int!): User
const typeDefs = `

type Query {
  allUsers: [User!]!
}

type User {
  email: String!
  id: Int!
  name: String
}
`

const resolvers = {
  Query: {
    allUsers: (parent:any, _args: any, context: Context) => {
      return context.prisma.user.findMany()
    }
  }
}


export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})