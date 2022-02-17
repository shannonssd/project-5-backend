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
import UserController from '../controller/userController.mjs';

// Import models  ***** TO CHANGE TO MONGODB? ******
// import Item from '../models/itemSchema.mjs';
import User from '../models/userSchema.mjs';

// Initialise controllers  ***** TO CHANGE TO MONGODB? ******
const userController = new UserController(User);
// const itemController = new ItemController(User)

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
