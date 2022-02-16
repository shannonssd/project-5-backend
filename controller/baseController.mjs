/*
 * ========================================================
 * ========================================================
 *
 *                    Base Controller
 *
 * ========================================================
 * ========================================================
 */
class BaseController {
  constructor(model) {
    // this.db = db;
    // mongo doesn't seem to need db?
    this.model = model;
  }
}

export default BaseController;
