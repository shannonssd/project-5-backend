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
  // Test route
  router.post('/test', multerUpload.single('image'), controller.test.bind(controller));
  // Route for new sign up
  router.post('/signup', controller.signUp.bind(controller));
  // Route for login attempt
  router.post('/login', controller.login.bind(controller));
  return router;
}
