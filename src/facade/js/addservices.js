/**
 * @module M/plugin/AddServices
 */
import 'assets/css/addservices';
import AddServicesControl from './addservicescontrol';
import api from '../../api';

export default class AddServices extends M.Plugin {
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
  constructor(options = {}) {
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
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * WMS service protocol type
     * @type {Boolean}
     */
    this.http = false;
    if (options.http !== undefined && (options.http === true || options.http === 'true')) {
      this.http = true;
    }

    this.https = true;
    if (options.https !== undefined && (options.https === false || options.https === 'false')) {
      this.https = false;
    }
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
    const values = {
      http: this.http,
      https: this.https,
    };
    const control = new AddServicesControl(values);
    control.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });
    this.controls_.push(control);
    this.map_ = map;
    this.panel_ = new M.ui.Panel('panelAddServices', {
      collapsible: true,
      className: 'm-addservices',
      collapsedButtonClass: 'g-cartografia-capas',
      position: M.ui.position.TR,
      tooltip: 'Cargar WMS',
    });
    this.panel_.addControls(this.controls_);
    this.map_.addPanels(this.panel_);
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
    [this.map_, this.controls_, this.panel_] = [null, null, null];
  }

  /**
   * @getter
   * @public
   */
  get name() {
    return 'addservices';
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }
}
