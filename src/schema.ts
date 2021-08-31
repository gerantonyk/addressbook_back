import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context } from './context'
//deleteUser(id: Int!): User
const typeDefs = `

type Query {
  users: [User!]!
  user(id: Int): User
}

type Mutation {
  deleteContact(id: Int!): Contact
  createContact(id: Int!, data: ContactCreateInput!): Contact
  updateContact(id: Int!, data: ContactCreateInput!): Contact
}

type User {
  email: String!
  id: Int!
  name: String
  contacts: [Contact!]!
}

type Contact {
  email: String
  id: Int!
  name:      String
  lastname:  String
  address:   String
  phone:     Int
  owner:     User 
}

input ContactCreateInput {
  email: String
  name:      String
  lastname:  String
  address:   String
  phone:     Int
}
`

const resolvers = {
  Query: {
    users: (_parent:any, _args: any, context: Context) => {
      return context.prisma.user.findMany({include:{contacts:true}})
    },
    user: (_parent: any, args: { id: number }, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: args.id || undefined },
        include:{contacts:true}
      })  
    },

    // contacts: (_parent: any, args: { owner: number }, context: Context) => {
    //   return context.prisma.contacts.findMany({
    //     where: { owner: args.owner || undefined }
    //   })
    // },
  },
  Mutation: {
    deleteContact: (_parent: any, args: { id: number }, context: Context) => {
      return context.prisma.contacts.delete({
        where: { id: args.id },
      })
    },
    createContact: (_parent: any, args: {data: ContactCreateInput, id: number }, context: Context) => {
      return context.prisma.contacts.create({
        data: {
          name: args.data.name,
          lastname: args.data.lastname,
          email: args.data.email,
          address: args.data.address,
          phone: args.data.phone,
          owner: {
            connect: { id: args.id },
          },
        },
      })
    },
    updateContact: (_parent: any, args: {data: ContactCreateInput, id: number }, context: Context) => {
      return context.prisma.contacts.update({
        where: {
          id:args.id
        },
        data: {
          name: args.data.name,
          lastname: args.data.lastname,
          email: args.data.email,
          address: args.data.address,
          phone: args.data.phone
        }
      })
    }            
  }
  // Contact: {
  //   owner: (parent: { id: any }, _args: any, context: Context) => {
  //     return context.prisma.contacts.findUnique({
  //       where: { id: parent?.id }
  //     }).owner()
  //   }
  // },  
  // User: {
  //   contacs: (parent: { id: any }, _args: any, context: Context) => {
  //     return context.prisma.user.findUnique({
  //       where: { id: parent?.id }
  //     }).contacts()
  //   }
  // }  
}

interface ContactCreateInput {
  email: string,
  name:      string,
  lastname:  string,
  address:   string,
  phone:     number
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})