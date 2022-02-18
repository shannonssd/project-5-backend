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
import handleImage from '../utils/s3.mjs';
import assignDistrict from '../utils/district.mjs';

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
  *   When user tries to signup, check if username exists,
  *                else store data in DB
  * ========================================================
  */
  async signUp(req, res) {
    const {
      name, email, password, street, block, postalCode,
    } = req.body;

    const photo = req.file;

    // If details missing, inform player
    if (!name || !email || !password || !street || !block || !postalCode || !photo) {
      return res.status(400).json({ message: 'details missing' });
    }
    console.log('email', email);

    // Check if username already exists
    const checkIfUserExists = await this.model.find({ email: 'test' });
    console.log('checkIfUserExists', checkIfUserExists);

    // Check if postal code is valid
    const district = assignDistrict(postalCode);
    if (district === 'Nil') {
      return res.status(400).json({ message: 'No District Found. Please try again!' });
    }

    // If no such username in database, create new one
    if (checkIfUserExists === null) {
      // Store profile pic in AWS S3 and return image link
      const imageLink = await handleImage(req.file);
      console.log('Main IMAGE', imageLink);

      const hash = await bcrypt.hash(password, Number(PW_SALT_ROUND));

      await this.model.create({
        userDetails: {
          name,
          email,
          password: hash,
          photo: imageLink,
        },
        addressDetails: {
          address: {
            street,
            block,
            postalCode,
          },
          district,
          displayAddress: street,
        },
      });
      console.log('WOKRING!');
      return res.status(200).json({ message: 'sign up success' });
    }
    // Else inform user that username already exists
    return res.status(400).json({ message: 'user exists' });
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
