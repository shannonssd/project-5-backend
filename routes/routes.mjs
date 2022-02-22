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
import handMeDownsRouter from '../routers/handMeDownsRouter.mjs';
import chatsRouter from '../routers/chatsRouter.mjs';

// Import controllers
import UserController from '../controllers/userController.mjs';
import HandMeDownsController from '../controllers/handMeDownsController.mjs';
import ChatsController from '../controllers/chatsController.mjs';

// Import models
import UserModel from '../models/userModel.mjs';
import ChatModel from '../models/chatModel.mjs';
import NoticeModel from '../models/noticeModel.mjs';

// Initialise controllers
const userController = new UserController(UserModel);
const handMeDownsController = new HandMeDownsController(UserModel);
const chatsController = new ChatsController(ChatModel, UserModel);

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
  // Hand me downs page routes
  app.use('/hand-me-downs', handMeDownsRouter(handMeDownsController));
  // Chats page routes
  app.use('/chats', chatsRouter(chatsController));
}
