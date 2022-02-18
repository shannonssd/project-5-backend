/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
/*
 * ========================================================
 * ========================================================
 *
 *                      Imports
 *
 * ========================================================
 * ========================================================
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import BaseController from './baseController.mjs';

dotenv.config();
const { PW_SALT_ROUND, JWT_SALT } = process.env;

/*
 * ========================================================
 * ========================================================
 *
 *                    User Controller
 *
 * ========================================================
 * ========================================================
 */
class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  /*
  * ========================================================
  *                       TESTING
  * ========================================================
  */

  async test(req, res) {
    // Logic for storing profile pic in s3
    const image = req.file;
    console.log(image);
    console.log('POST Request: /users/test');
    const newUser = await this.model.create({
      district: 'Toa Payoh',
      name: 'Doggos',
      description: 'Group for ppl who like cute doggos',
      members: ['1', '2', '3'],
      posts: [
        {
          postedBy: 'Shabn',
          post: 'this doogo so cute!',
          links: 'http://...',
          likedBy: ['1', '2', '3'],
        },
        {
          postedBy: 'HP',
          post: 'this cat so cute!',
          links: 'http://...',
          likedBy: ['4', '5', '6'],
        },
      ],
    });
    return res.status(200).json({ test: 'success', newUser });
  }

  /*
  * ========================================================
  *   When user tries to signup, check if username exists,
  *                else store data in DB
  * ========================================================
  */
  async signUp(req, res) { //* **** TO CHANGE TO MONGODB? ******
    const { userEmail, userPassword } = req.body;
    // If email or password missing, inform player
    if (!userEmail || !userPassword) {
      return res.send('details missing');
    }

    // Check if username already exists
    const checkIfUserExists = await this.model.findOne({
      where: {
        userEmail,
      },
    });

    // If no such username in database, create new one
    if (checkIfUserExists === null) {
      // // Logic for storing profile pic in s3
      // const image = req.file;

      const hash = await bcrypt.hash(userPassword, Number(PW_SALT_ROUND));
      await this.model.create({
        userEmail,
        userPassword: hash,
      });
      return res.status(200).send('sign up success');
    }
    // Else inform user that username already exists
    return res.send('user exists');
  }

  /*
  * ========================================================
  *      When user tries to login, authenticate login
  *         details and let user know the outcome
  * ========================================================
  */
  async login(req, res) { //* **** TO CHANGE TO MONGODB? ******
    const { userEmail, userPassword } = req.body;

    // If email or password missing, inform player
    if (!userEmail || !userPassword) {
      return res.send('details missing');
    }

    // If email not in DB, inform player
    const user = await this.model.findOne({ where: { userEmail } });
    if (!user) {
      return res.send('username or password incorrect');
    }

    // Compare password in DB with password entered
    const compare = await bcrypt.compare(userPassword, user.userPassword);

    // If entered password matches DB password, inform client side JS that login is successful
    if (compare) {
      const userId = user.id;
      const payload = { id: user.id, userEmail: user.userEmail };
      const token = jwt.sign(payload, JWT_SALT, { expiresIn: '30mins' });
      return res.json({
        success: true, token, payload, userId,
      });
    }
    // If password incorrect inform user
    return res.send('username or password incorrect');
  }
}

export default UserController;
