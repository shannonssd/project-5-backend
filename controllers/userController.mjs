/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
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
  *           When user tries to signup, check if:
  *                 1. Details are missing
  *                 2. Username exists
  *                3. Postal code is valid
  *                  Else store data in DB
  * ========================================================
  */
  async signUp(req, res) {
    const {
      name, email, password, street, block, postalCode,
    } = req.body;
    const photo = req.file;

    // If details missing, inform user
    if (!name || !email || !password || !street || !block || !postalCode || !photo) {
      return res.status(400).json({ message: 'Details missing' });
    }

    // Check if postal code is valid
    const district = assignDistrict(postalCode);
    if (district === 'Nil') {
      return res.status(400).json({ message: 'No District Found. Please try again!' });
    }

    // Check if username already exists
    const checkIfUserExists = await this.model.find({ 'userDetails.email': email });

    // If no such username in DB, create new user in DB
    if (checkIfUserExists.length === 0) {
      // Store profile pic in AWS S3 and return image link for storage in DB
      const imageLink = await handleImage(req.file);

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
  async login(req, res) {
    const { email, password } = req.query;

    // If email or password missing, inform player
    if (!email || !password) {
      return res.status(400).json({ message: 'Details missing' });
    }

    // If email not in DB, inform player
    const user = await this.model.findOne({ 'userDetails.email': email });
    if (!user) {
      return res.status(400).json({ message: 'Username or password incorrect' });
    }

    // Compare password in DB with password entered
    const compare = await bcrypt.compare(password, user.userDetails.password);

    // If entered password matches DB password, inform client that login is successful & send relevant data to frontend
    if (compare) {
      const userId = user._id;
      const { name } = user.userDetails;
      const { photo } = user.userDetails;
      const { displayAddress } = user.addressDetails;
      const { district } = user.addressDetails;
      const payload = { id: userId, email: user.userDetails.email };
      const token = jwt.sign(payload, JWT_SALT, { expiresIn: '30mins' });
      return res.status(200).json({
        success: true, token, payload, userId, name, displayAddress, district, photo,
      });
    }
    // If password incorrect inform user
    return res.status(400).json({ message: 'Username or password incorrect' });
  }
}

export default UserController;
