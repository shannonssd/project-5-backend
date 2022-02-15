/*
 * ========================================================
 * ========================================================
 *
 *                      Imports
 *
 * ========================================================
 * ========================================================
 */
// Import routers
import userRouter from '../routers/userRouter.mjs';


// Import controllers
import UserController from '../controllers/userController.mjs';


// Import models  ***** TO CHANGE TO MONGODB? ******
import db from '../models/index.mjs';

// Initialise controllers  ***** TO CHANGE TO MONGODB? ******
const userController = new UserController(db, db.User);


/*
 * ========================================================
 * ========================================================
 *
 *                     Bind Routes
 *
 * ========================================================
 * ========================================================
 */
export default function routes(app) {
  // User sign up and login routes
  app.use('/users', userRouter(userController));

}
