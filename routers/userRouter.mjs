/*
 * ========================================================
 * ========================================================
 *
 *                      Imports
 *
 * ========================================================
 * ========================================================
 */
import express from 'express';
import multer from 'multer';

// Set name of photo upload directory
const multerUpload = multer({ dest: './public/uploads' });
const router = express.Router();

/*
 * ========================================================
 * ========================================================
 *
 *            User Router with various paths
 *
 * ========================================================
 * ========================================================
 */
export default function userRouter(controller) {
  // Route for new sign up
  router.post('/signup', multerUpload.single('photo'), controller.signUp.bind(controller));
  // Route for login attempt
  router.post('/login', controller.login.bind(controller));
  // Route for adding item
  router.post('/add-item', controller.addItem.bind(controller));
  return router;
}
