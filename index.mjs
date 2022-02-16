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
import bindRoutes from './routes/routes.mjs';

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
// Set CORS headers
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  credentials: true,
  origin: FRONTEND_URL,
}));
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
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

/*
* ========================================================
* ========================================================
*
*                   Connect to db
*         Set Express to listen on the given port
*
* ========================================================
* ========================================================
*/

const uri = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@main.ad3l7.mongodb.net/neighbourhood?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3004;

// only connect to port after connecting to db
mongoose.connect(uri, { userNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(PORT);
    console.log(`connected to port ${PORT}`);
    console.log('connected to db');
  })
  .catch((err) => console.log(err));
