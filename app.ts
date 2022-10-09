import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

import express from "express"
const app =  express();
app.use(express.json())
app.use(express.urlencoded())
const PORT = process.env.PORT || 3000

 app.post("/users", async (req, res) => {
    try {
      var { name, games } = req.body
      console.log('mis games',games)
     
      // games is an array of string | string[]
  
      const newUser = await prisma.user.create({
        data: {
          name, // name is provided by the request body
          games: {
            // create or connect means if the game existed, we will use the old one
            // if not, we will create a new game
            connectOrCreate: games.map((game: string) => ({
              where: {
                name: game,
              },
              create: {
                name: game,
              },
            })),
          },
        },
      })
  
      res.json(newUser)
    } catch (error: any) {
      console.log(error.message)
      res.status(500).json({
        message: "Internal Server Error",
      })
    }
  })
 
  app.get("/users", async (req, res) => {
    try {
      const users = await prisma.user.findMany()
  
      res.json(users)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })


  app.get("/users_juegos", async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include:{
            games:true
        }
      })
  
      res.json(users)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })

  app.put("/users/:id", async (req, res) => {
    try {
      const { name, games } = req.body
      const  id  =parseInt(req.params.id);
  
      const updatedUser = await prisma.user.update({
        where: {
          id
        },
        data: {
          name,
          games: {
            connectOrCreate: games.map((game: string) => ({
              where: { name: game },
              create: { name: game },
            })),
          },
        },
      })
  
      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })

  app.delete("/users/:id", async (req, res) => {
    try {
      const  id  =parseInt(req.params.id);
  
      const deletedUser = await prisma.user.delete({
        where: {
          id
        },
      })
  
      res.json(deletedUser)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })

app.listen(PORT, ()=>{
    console.log(`Server esta corriendo en el puerto ${PORT}`)
})