import express, {Request,Response} from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import { graphqlHTTP } from "express-graphql";
const prisma = new PrismaClient()
const app = express()
import morgan from 'morgan'
import { schema } from './schema'
import { context } from './context'

app.use(cors())
app.use(express.json())
app.use(morgan('dev'));
app.use(express.static('public'))

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    context: context,
    graphiql: true,
  }),
)
app.get(`/api`, async (req:Request, res:Response) => {
  res.json({ up: true })
})
app.get(`/api/seed`, async (req, res) => {
  console.log(prisma)
  const seedUser = {
    email: 'jane@prisma.io',
    name: 'Jane',
    }
  try {
    await prisma.user.deleteMany({
      where: {
        email: 'jane@prisma.io',
      },
    })

    const result = await prisma.user.create({
      data: seedUser,
    })
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})
// app.get(`/api/seed`, async (req, res) => {
//   const seedUser = {
//     email: 'jane@prisma.io',
//     name: 'Jane',
//     contacts: {
//       create: [
//         {
//           title:
//             'Comparing Database Types: How Database Types Evolved to Meet Different Needs',
//           content:
//             'https://www.prisma.io/blog/comparison-of-database-models-1iz9u29nwn37/',
//           published: true,
//         },
//         {
//           title: 'Analysing Sleep Patterns: The Quantified Self',
//           content: 'https://quantifiedself.com/get-started/',
//           published: true,
//         },
//       ],
//     },
//   }

//   try {
//     await prisma.post.deleteMany({
//       where: {
//         author: {
//           email: 'jane@prisma.io',
//         },
//       },
//     })
//     await prisma.user.deleteMany({
//       where: {
//         email: 'jane@prisma.io',
//       },
//     })

//     const result = await prisma.user.create({
//       data: seedUser,
//     })
//     res.json(result)
//   } catch (e) {
//     console.error(e)
//     res.sendStatus(500)
//   }
// })

// app.post(`/api/user`, async (req, res) => {
//   const result = await prisma.user.create({
//     data: {
//       ...req.body,
//     },
//   })
//   res.json(result)
// })

// app.post(`/api/post`, async (req, res) => {
//   const { title, content, authorEmail } = req.body
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       published: false,
//       author: { connect: { email: authorEmail } },
//     },
//   })
//   res.json(result)
// })

// app.put('/api/publish/:id', async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.update({
//     where: {
//       id: parseInt(id),
//     },
//     data: { published: true },
//   })
//   res.json(post)
// })

// app.delete(`/api/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: parseInt(id),
//     },
//   })
//   res.json(post)
// })

// app.get(`/api/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.findUnique({
//     where: {
//       id: parseInt(id),
//     },
//   })
//   res.json(post)
// })

// app.get('/api/feed', async (req, res) => {
//   const posts = await prisma.post.findMany({
//     where: { published: true },
//     include: { author: true },
//   })
//   res.json(posts)
// })

// app.get('/api/filterPosts', async (req, res) => {
//   const { searchString } = req.query
//   const draftPosts = await prisma.post.findMany({
//     where: {
//       OR: [
//         {
//           title: {
//             contains: searchString,
//           },
//         },
//         {
//           content: {
//             contains: searchString,
//           },
//         },
//       ],
//     },
//   })
//   res.json(draftPosts)
// })

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, ():void =>
  console.log(
    `🚀 Server ready at: http://localhost:${PORT}\n⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`,
  ),
)
