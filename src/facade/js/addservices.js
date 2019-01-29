import namespace from 'mapea-util/decorator';
import AddServicesControl from './addservicesControl.js';
import css from 'assets/css/addservices.css';



@namespace("M.plugin")
class AddServices extends M.Plugin {

  /**
* Name to identify this plugin
* @const
* @type {string}
* @public
* @api stable
*/
  static get NAME() {
    return 'addservices';
  }
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor() {

    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * add your variables
     *
     */

    this.panel_ = null;

  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    const control = new M.control.AddServicesControl();
    control.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });
    this.controls_.push(control);
    this.map_ = map;
    this.panel_ = new M.ui.Panel(M.plugin.AddServices.NAME, {
      'collapsible': true,
      'className': 'm-addservices',
      'collapsedButtonClass': 'g-cartografia-capas',
      'position': M.ui.position.TR,
      'tooltip': "Cargar WMS"
    });
    this.panel_.addControls(this.controls_);
    map.addPanels(this.panel_);
  }

  /**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
  destroy() {
    this.map_.removeControls(this.controls_);
    this.map_ = null;
    this.controls_ = null;
    this.panel_ = null;
    this.name = null;
  };
}
