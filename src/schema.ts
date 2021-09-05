import { makeExecutableSchema } from '@graphql-tools/schema'
import { Context } from './context'
const typeDefs = `

type Query {
  users: [User!]!
  user(id: Int): User
  contact(id: Int):Contact
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
  phone:     String
  birthday:  String
  owner:     User 
}

input ContactCreateInput {
  email: String
  name:      String
  lastname:  String
  address:   String
  phone:     String
  birthday:  String
}

`

const resolvers = {
  Query: {
    users: (_parent:any, _args: any, context: Context) => {
      try {
        return context.prisma.user.findMany({include:{contacts:true}})
      } catch(e) {console.log(e)}
    },
    user: (_parent: any, args: { id: number }, context: Context) => {
      try {
        return context.prisma.user.findUnique({
          where: { id: args.id || undefined },
          include:{contacts:{orderBy: {lastname:'asc'}}}
      })} catch(e) {console.log(e)}
    },
    contact: (_parent: any, args: { id: number }, context: Context) => {
      if(args.id){
        try {
          return context.prisma.contacts.findUnique({
            where: { id: args.id || undefined }
        })} catch(e) {console.log(e)}    
      }
    },    
  },
  Mutation: {
    deleteContact: (_parent: any, args: { id: number }, context: Context) => {
      try {
        return context.prisma.contacts.delete({
          where: { id: args.id },
      })} catch(e) {console.log(e)} 
    },
    createContact: (_parent: any, args: {data: ContactCreateInput, id: number }, context: Context) => {
      try{
        return context.prisma.contacts.create({
          data: {
            name: args.data.name,
            lastname: args.data.lastname,
            email: args.data.email,
            address: args.data.address,
            phone: args.data.phone,
            birthday: args.data.birthday,
            owner: {
              connect: { id: args.id },
            },
          },
      })} catch(e) {console.log(e)} 
    },
    updateContact: (_parent: any, args: {data: ContactCreateInput, id: number }, context: Context) => {
      try{
        return context.prisma.contacts.update({
          where: {
            id:args.id
          },
          data: {
            name: args.data.name,
            lastname: args.data.lastname,
            email: args.data.email,
            address: args.data.address,
            phone: args.data.phone,
            birthday: args.data.birthday
          }
      })} catch(e) {console.log(e)} 
    }            
  },
}

interface ContactCreateInput {
  email: string,
  name:      string,
  lastname:  string,
  address:   string,
  phone:     string,
  birthday:  string
}

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})