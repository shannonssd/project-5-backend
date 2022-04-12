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
 *            Hand me down router with various paths
 *
 * ========================================================
 * ========================================================
 */
export default function handMeDownsRouter(controller) {
  // Route for showing all items in users district
  router.get('/show-all-items', controller.showAllItems.bind(controller));
  // Route for showing users items
  router.get('/show-users-items', controller.showUsersItems.bind(controller));
  // Route for showing one item
  router.get('/show-item', controller.showSingleItem.bind(controller));
  // Route for adding item
  router.post('/add-item', multerUpload.single('photo'), controller.addItem.bind(controller));
  // Route for deleting item
  router.delete('/remove-item', controller.removeItem.bind(controller));
  // Route for liking / unliking item
  router.post('/like-item', controller.likeItem.bind(controller));
  return router;
}
