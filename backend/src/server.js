import Fastify from 'fastify';

import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt'

import { homeRoutes } from './routes/homeRoutes.js';
import { authRoutes } from './routes/authRoutes.js';

import { io } from './services/socket.js';

import { config } from 'dotenv';

config()

const app = Fastify({
    logger: true,

})

app.register(cors, {
    origin: true
})

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY
})

app.register(homeRoutes)
app.register(authRoutes)



try {
    await app.listen({
        port: 3000,

    })
} catch (error) {
    app.log.error(error)
}