/**
 * @module M/impl/control/AddServicesControl
 */
export default class AddServicesControl extends M.impl.Control {
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
    this.facadeMap = map;
    super.addTo(map, html);
  }

  destroy() {
    this.facadeMap.getMapImpl().removeControl(this);
  }
}
