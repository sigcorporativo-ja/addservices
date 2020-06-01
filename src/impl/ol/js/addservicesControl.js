/**
 * @module M/impl/control/AddServicesControl
 */
export default class AddServicesControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the AddServicesControl.
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor() {
    super();
    this.facadeMap_ = null;
  }
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    // specific code
    this.facadeMap_ = map;
    // super addTo
    super.addTo(map, html);
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    M.dialog.info('Hello World!');
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    M.dialog.info('Bye World!');
  }

  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
  }
}
