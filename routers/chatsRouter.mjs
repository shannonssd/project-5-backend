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

// Set name of photo upload directory
const router = express.Router();

/*
 * ========================================================
 * ========================================================
 *
 *            Chats router with various paths
 *
 * ========================================================
 * ========================================================
 */
export default function chatsRouter(controller) {
  // Route for getting list of all chats
  router.get('/show-chats', controller.chatsList.bind(controller));
  return router;
}
