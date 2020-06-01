/**
 * @module M/control/AddServicesControl
 */

import AddServicesImplControl from 'impl/addservicesControl';
import template from 'templates/addservices';
import template_result from 'templates/addservices_results';
import AddServices from './addservices'

export default class AddServicesControl extends M.Control {

  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(AddServicesImplControl)) {
      M.exception('La implementación usada no puede crear controles PluginControl');
    }
    // 2. implementation of this control
    let impl = new AddServicesImplControl();
    super(impl, AddServices.NAME);

    this.urlService_ = null;
    this.btnAddUrl_ = null;
    this.btnClear_ = null;
    this.facadeMap_ = null;
    this.containerAddservices_ = null;
    this.containerSearching_ = null;
    this.containerResults_ = null;
    this.containerSearch_ = null;
    this.capabilities_ = null;
    this.stateSelectAll_ = false;
  }

  /**
   *
   *
   * @param {*} html
   * @memberof AddServicesControl
   */
  addEvents(html) {
    // Registro los input y botones
    this.urlService_ = html.getElementsByTagName('input')['m-addservices-search-input'];
    this.btnAddUrl_ = html.getElementsByTagName('button')['m-addservices-search-btn'];
    this.btnClear_ = html.getElementsByTagName('button')['m-addservices-clear-btn'];

    this.containerAddservices_ = html;
    this.containerSearching_ = html.getElementsByTagName('div')['m-searching-result-addservices'];
    this.containerResults_ = html.getElementsByTagName('div')['m-addservices-results'];
    this.containerSearch_ = html.getElementsByTagName('div')['m-addservices-search'];
    // Asigno las funciones a cada evento
    this.btnAddUrl_.addEventListener('click', (evt) => this.readCapabilities_(evt));
    this.btnClear_.addEventListener('click', (evt) => this.removeContains_(evt));
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    if (!M.template.compileSync) { // JGL: retrocompatibilidad Mapea4
      M.template.compileSync = (string, options) => {
        let templateCompiled;
        let templateVars = {};
        let parseToHtml;
        if (!M.utils.isUndefined(options)) {
          templateVars = M.utils.extends(templateVars, options.vars);
          parseToHtml = options.parseToHtml;
        }
        const templateFn = Handlebars.compile(string);
        const htmlText = templateFn(templateVars);
        if (parseToHtml !== false) {
          templateCompiled = M.utils.stringToHtml(htmlText);
        } else {
          templateCompiled = htmlText;
        }
        return templateCompiled;
      };
    }
    
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      // Añadir código dependiente del DOM
      this.addEvents(html);
      success(html);
    });
  }

  /**
 * This function reads the capabilities of service
 *
 * @function
 * @private
 * @param {goog.events.BrowserEvent} evt - Event click
 */
  readCapabilities_(evt) {
    evt.preventDefault();
    if (!M.utils.isNullOrEmpty(this.urlService_.value)) {
      if (M.utils.isUrl(this.urlService_.value)) {
        this.containerAddservices_.classList.add("m-searching");
        M.remote.get(M.utils.getWMSGetCapabilitiesUrl(this.urlService_.value)).then((response) => {
          try {
            let getCapabilitiesParser = new M.impl.format.WMSCapabilities();
            let getCapabilities = getCapabilitiesParser.read(response.xml);
            let getCapabilitiesUtils = new M.impl.GetCapabilities(getCapabilities, this.urlService_.value, this.facadeMap_.getProjection().code);
            this.capabilities_ = getCapabilitiesUtils.getLayers();
            this.showResults_();
          }
          catch (err) {
            M.dialog.error("Ha ocurrido un error al obtener el documento GetCapabilities.");
          }
          this.containerAddservices_.classList.remove("m-searching");
        });
      }
      else {
        M.dialog.error("Debes indicar una URL válida.");
      }
    }
    else {
      M.dialog.error("Los campos están vacíos.");
    }
  }

  /**
 * This function show results
 *
 * @function
 * @private
 */
  showResults_() {
    let result = [];
    this.capabilities_.forEach((capability) => {
      result.push(capability.getImpl());
    });

    /*M.template.compile(template_result, {
      'vars': {
        'result': result
      }
    }).then((html) => {
      this.containerResults_.innerHTML = html.innerHTML;
      M.utils.enableTouchScroll(this.containerResults_);
      let results = this.containerResults_.getElementsByTagName('span');
      for (let i = 0, ilen = results.length; i < ilen; i++) {
        results[i].addEventListener('click', (evt) => this.registerCheck_(evt));
      }
      this.containerResults_.getElementsByTagName('th')['m-addservices-selectall'].addEventListener('click', (evt) => this.registerCheck_(evt));
      this.containerResults_.getElementsByClassName('m-addservices-add')[0].addEventListener('click', (evt) => this.addLayers_(evt));
    });*/

    const html = M.template.compileSync(template_result, {
      'vars': {
        'result': result
      }
    });
      this.containerResults_.innerHTML = html.innerHTML;
      M.utils.enableTouchScroll(this.containerResults_);
      let results = this.containerResults_.getElementsByTagName('span');
      for (let i = 0, ilen = results.length; i < ilen; i++) {
        results[i].addEventListener('click', (evt) => this.registerCheck_(evt));
      }
      this.containerResults_.getElementsByTagName('th')['m-addservices-selectall'].addEventListener('click', (evt) => this.registerCheck_(evt));
      this.containerResults_.getElementsByClassName('m-addservices-add')[0].addEventListener('click', (evt) => this.addLayers_(evt));
   

  }

  /**
  * This function registers the marks or unmarks check and click allselect
  *
  * @function
  * @private
  * @param {goog.events.BrowserEvent} evt - Event
  */
  registerCheck_(evt) {
    evt = (evt || window.event);
    if (!M.utils.isNullOrEmpty(evt.target) && evt.target.classList.contains("m-check-addservices")) {
      evt.stopPropagation();
      evt.target.classList.toggle('g-cartografia-check2');
      evt.target.classList.toggle('g-cartografia-check3');
      if (!this.containerResults_.querySelectorAll(".g-cartografia-check3").length) {
        this.stateSelectAll_ = false;
      } else if (!this.containerResults_.querySelectorAll(".g-cartografia-check2").length) {
        this.stateSelectAll_ = true;
      }
    }
    else if (!M.utils.isNullOrEmpty(evt.target) && evt.target.id === "m-addservices-selectall") {
      if (this.stateSelectAll_) {
        this.unSelect_();
        this.stateSelectAll_ = false;
      }
      else {
        this.select_();
        this.stateSelectAll_ = true;
      }
    }
  }


  /**
  * This function unselect checkbox
  *
  * @function
  * @private
  */
  unSelect_() {
    let unSelect = this.containerResults_.querySelectorAll(".g-cartografia-check3");
    for (let i = 0; i < unSelect.length; i++) {
      unSelect[i].classList.remove('g-cartografia-check3');
      unSelect[i].classList.add('g-cartografia-check2');
    }
  }

  /**
  * This function select checkbox
  *
  * @function
  * @private
  */
  select_() {
    let select = this.containerResults_.querySelectorAll(".g-cartografia-check2");
    for (let i = 0; i < select.length; i++) {
      select[i].classList.remove('g-cartografia-check2');
      select[i].classList.add('g-cartografia-check3');
    }
  }

  /**
  * This function add layers
  *
  * @function
  * @param {goog.events.BrowserEvent} evt - Event
  * @private
  */
  addLayers_(evt) {
    evt.preventDefault();
    let layers = [];
    let elmSel = this.containerResults_.querySelectorAll(".g-cartografia-check3");
    if (elmSel.length === 0) {
      M.dialog.error("Debes seleccionar al menos una capa.");
    }
    else {
      for (let i = 0, ilen = elmSel.length; i < ilen; i++) {
        for (let j = 0, ilen2 = this.capabilities_.length; j < ilen2; j++) {
          if (elmSel[i].id === this.capabilities_[j].legend) {
            this.capabilities_[j].options.origen = 'WMS';
            layers.push(this.capabilities_[j]);
          }
        }
      }
      this.facadeMap_.addLayers(layers);
    }
  }

  /**
  * This function remove results show
  *
  * @function
  * @param {goog.events.BrowserEvent} evt - Event
  * @private
  */
  removeContains_(evt) {
    evt.preventDefault();
    this.containerResults_.innerHTML = "";
    this.urlService_.value = "";
  }

  /**
  * This function checks if an object is equals to this control
  *
  * @function
  * @api stable
  * @param {*} obj - Object to compare
  * @returns {boolean} equals - Returns if they are equal or not
  */
  equals(obj) {
    let equals = false;
    if (obj instanceof AddServicesControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api stable
   * @export
   */
  getActivationButton(html) {
    return html.querySelector('button#m-addservicescontrol-button');
  }
}
