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
export default function handMeDownsRouter(controller) {
  // Route for adding item
  router.post('/add-item', multerUpload.single('photo'), controller.addItem.bind(controller));
  return router;
}
