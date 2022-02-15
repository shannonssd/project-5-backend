import express from 'express';

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
  router.post('/signup', controller.signUp.bind(controller));
  // Route for login attempt
  router.post('/login', controller.login.bind(controller));
  return router;
}
