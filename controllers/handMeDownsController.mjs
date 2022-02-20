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
import dotenv from 'dotenv';
import BaseController from './baseController.mjs';

dotenv.config();

/*
 * ========================================================
 * ========================================================
 *
 *                    User Controller
 *
 * ========================================================
 * ========================================================
 */
class HandMeDownController extends BaseController {
  constructor(model) {
    super(model);
  }

  /*
  * ========================================================
  *         User adds item to hand-me-down catalog
  *
  * ========================================================
  */

  async addItem(req, res) {
    const { name, description, condition } = req.body;

    try {
      const user = await this.model.findById('6210a9f338d9ea4c45ad7343');
      if (user[0].handMeDowns !== undefined) {
        user[0].handMeDowns = [{
          name,
          description,
          condition,
        }];
      }

      await user[0].save;
      res.status(200).send('item added to db');
    } catch (err) {
      console.log(err);
    }
  }
}

export default HandMeDownController;
