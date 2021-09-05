import express, {Request,Response} from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
import { graphqlHTTP } from "express-graphql";
const prisma = new PrismaClient()
const app = express()
import morgan from 'morgan'
import { schema } from './schema'
import { context } from './context'
import {seed} from './seeds';

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


  try {

    await prisma.contacts.deleteMany()

    await prisma.user.deleteMany()
    const result:any[]=[]
    for(let i = 0; i<seed.length;i++) {
      result.push(await prisma.user.create({
        data: seed[i],
      }))
    }
    res.json(result)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})



app.get('/api/feed', async (req:Request, res:Response) => {
  context.prisma.user.findMany({include:{contacts:true}})
  .then(r=>res.json(r))
  
})



const PORT = process.env.PORT || 3001
const server = app.listen(PORT, ():void =>
  console.log(
    `🚀 Server ready at: http://localhost:${PORT}\n⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`,
  ),
)
