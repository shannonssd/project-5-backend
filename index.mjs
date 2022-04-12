/* eslint-disable no-console */
/*
 * ========================================================
 * ========================================================
 *
 *                       Imports
 *
 * ========================================================
 * ========================================================
 */
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bindRoutes from './routes/routes.mjs';
import chatsSocketRoutes from './routers/chatsSocketRouter.mjs';

dotenv.config();

/*
* ========================================================
* ========================================================
*
*                    Server middleware
*
* ========================================================
* ========================================================
*/
// Initialise Express instance
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  credentials: true,
  origin: FRONTEND_URL,
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: FRONTEND_URL,
  },
});
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Expose the files stored in the public folder
app.use(express.static('public'));

/*
 * ========================================================
 * ========================================================
 *
 *            Helper function to bind route definitions
 *               to the Express application
 *
 * ========================================================
 * ========================================================
 */
bindRoutes(app);
chatsSocketRoutes(io);

/*
* ========================================================
* ========================================================
*
*                     Connect to db
*              Once connection is established,
*          Set Express to listen on the given port
*
* ========================================================
* ========================================================
*/
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3004;

// Only connect to port after connecting to db
mongoose.connect(uri)
  .then(() => {
    httpServer.listen(PORT);
  })
  .catch((err) => console.log(err));
