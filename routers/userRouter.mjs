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
  // Test route
  router.post('/test', controller.test.bind(controller));
  // Route for new sign up
  router.post('/signup', controller.signUp.bind(controller));
  // Route for login attempt
  router.post('/login', controller.login.bind(controller));
  return router;
}
