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

// Import models
import UserModel from '../models/userModel.mjs';
import ChatModel from '../models/chatModel.mjs';
import NoticeModel from '../models/noticeModel.mjs';
import InterestGroupModel from '../models/interestGroupModel.mjs';

// Initialise controllers
const userController = new UserController(InterestGroupModel);

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
