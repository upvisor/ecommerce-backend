import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import http from 'http'
import {Server as SocketServer} from 'socket.io'

import {connectDB} from './db.js'
import { initializeScheduledTasks } from './utils/scheduledProducts.js'

import productsRoutes from './routes/products.routes.js'
import imagesRoutes from './routes/images.routes.js'
import loginRoutes from './routes/login.routes.js'
import transbankRoutes from './routes/transbank.routes.js'
import sellsRoutes from './routes/sells.routes.js'
import clientsRoutes from './routes/clients.routes.js'
import shopRoutes from './routes/shop.routes.js'

connectDB()

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: '*'
    }
})

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './upload'
}))
app.use(express.urlencoded({extended: false}))

app.use(productsRoutes)
app.use(imagesRoutes)
app.use(loginRoutes)
app.use(transbankRoutes)
app.use(sellsRoutes)
app.use(clientsRoutes)
app.use(shopRoutes)
  
initializeScheduledTasks()

io.on('connection', async (socket) => {})

export { io }

server.listen(process.env.PORT || 3000)
console.log('Server on port', process.env.PORT || 3000)