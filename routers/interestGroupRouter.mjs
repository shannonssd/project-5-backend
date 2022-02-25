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
 *          Interest group router with various paths
 *
 * ========================================================
 * ========================================================
 */
export default function interestGroupRouter(controller) {
  // Route for adding new interest group
  router.post('/add-group', multerUpload.single('photo'), controller.addGroup.bind(controller));
  // Route for showing all interest groups in the district
  router.get('/show-groups', controller.showAllGroups.bind(controller));
  // Route for following an interest group
  router.post('/follow-group', controller.followGroup.bind(controller));
  // Route for unfollowing an interest group
  router.post('/unfollow-group', controller.unfollowGroup.bind(controller));
  // Route for writing a post
  router.post('/new-post', controller.addPost.bind(controller));
  // Route for liking / unliking a post
  router.post('/like-post', controller.likePost.bind(controller));
  return router;
}
