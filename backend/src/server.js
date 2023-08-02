import './config/dotenv.js';
import express from 'express';
import cors from 'cors'
import { createServer } from 'http'

import { initIO } from './services/socket.js';
import { callSignaling } from './services/callSignaling.js';

import auth from './routes/auth.js';
import user from './routes/user.js';

const app = express();
const corsOption = {
    origin: "*"
}
app.use(cors(corsOption));
app.use(express.json());
app.use(auth);
app.use(user);

const httpServer = createServer(app);

initIO(httpServer)
callSignaling();

httpServer.listen(process.env.PORT, () => {
    console.log(`Express e Socket.IO rodando na porta ${process.env.PORT}`)
})