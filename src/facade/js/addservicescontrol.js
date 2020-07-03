/**
 * @module M/control/AddServicesControl
 */

import AddServicesImplControl from 'impl/addservicescontrol';
import template from 'templates/addservices';
import resultstemplate from 'templates/addservicesresults';

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
  constructor(values) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(AddServicesImplControl)) {
      M.exception('La implementación usada no puede crear controles AddServicesControl');
    }
    // 2. implementation of this control
    const impl = new AddServicesImplControl();
    super(impl, 'AddServices');

    this.stateSelectAll = false;
    this.http = values.http;
    this.https = values.https;
  }

  /**
   * This function adds events to HTML buttons
   *
   * @function
   * @private
   * @param {HTMLElement} html - HTML template
   */
  addEvents(html) {
    this.urlService = html.querySelector('#m-addservices-search-input');
    this.btnAddUrl = html.querySelector('#m-addservices-search-btn');
    this.btnClear = html.querySelector('#m-addservices-clear-btn');
    this.containerAddservices = html;
    this.containerSearching = html.querySelector('#m-searching-result-addservices');
    this.containerResults = html.querySelector('#m-addservices-results');
    this.containerSearch = html.querySelector('#m-addservices-search');
    this.btnAddUrl.addEventListener('click', evt => this.readCapabilities(evt));
    this.btnClear.addEventListener('click', evt => this.removeContains(evt));
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
    this.facadeMap = map;
    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      this.addEvents(html);
      success(html);
    });
  }

  /**
   * This function reads service capabilities
   *
   * @function
   * @private
   * @param {Event} evt - Click event
   */
  readCapabilities(evt) {
    evt.preventDefault();
    let HTTPeval = false;
    let HTTPSeval = false;
    if (!M.utils.isNullOrEmpty(this.urlService.value)) {
      if (M.utils.isUrl(this.urlService.value)) {
        if (this.http && !this.https) {
          const expReg = /^(http:)/;
          HTTPeval = expReg.test(this.urlService.value.trim());
        } else if (this.https && !this.http) {
          const expReg = /^(https:)/;
          HTTPSeval = expReg.test(this.urlService.value.trim());
        } else if (this.http && this.https) {
          HTTPeval = true;
          HTTPSeval = true;
        }

        if (HTTPeval === true || HTTPSeval === true) {
          this.containerAddservices.classList.add('m-searching');
          M.remote.get(M.utils.getWMSGetCapabilitiesUrl(this.urlService.value)).then((response) => {
            try {
              const getCapabilitiesParser = new M.impl.format.WMSCapabilities();
              const getCapabilities = getCapabilitiesParser.read(response.xml);
              const getCapabilitiesUtils = new M.impl.GetCapabilities(
                getCapabilities,
                this.urlService.value,
                this.facadeMap.getProjection().code
              );
              this.capabilities = getCapabilitiesUtils.getLayers();
              this.showResults();
            } catch (err) {
              M.dialog.error('Ha ocurrido un error al obtener el documento GetCapabilities.');
            }
            this.containerAddservices.classList.remove('m-searching');
          });
        } else {
          let errorMsg;
          if (this.http) {
            errorMsg = 'Sólo se permiten servicios http';
          } else if (this.https) {
            errorMsg = 'Sólo se permiten servicios https';
          } else if (!this.http && !this.https) {
            errorMsg = 'No se permiten servicios http ni https';
          }
          M.dialog.error(errorMsg);
        }
      } else {
        M.dialog.error('Debes indicar una URL válida.');
      }
    } else {
      M.dialog.error('Los campos están vacíos.');
    }
  }

  /**
   * This function shows results
   *
   * @function
   * @private
   */
  showResults() {
    const result = [];
    this.capabilities.forEach((capability) => {
      result.push(capability.getImpl());
    });

    const html = M.template.compileSync(resultstemplate, {
      vars: {
        result,
      },
    });

    this.containerResults.innerHTML = html.innerHTML;
    M.utils.enableTouchScroll(this.containerResults);
    const results = this.containerResults.getElementsByTagName('span');
    for (let i = 0; i < results.length; i += 1) {
      results[i].addEventListener('click', evt => this.registerCheck(evt));
    }
    this.containerResults.querySelector('#m-addservices-selectall').addEventListener('click', evt => this.registerCheck(evt));
    this.containerResults.querySelector('.m-addservices-add').addEventListener('click', evt => this.addLayers(evt));
  }

  /**
   * This function registers the marks or unmarks check and click allselect
   *
   * @function
   * @private
   * @param {Event} evt - Event
   */
  registerCheck(evt) {
    const e = (evt || window.event);
    if (!M.utils.isNullOrEmpty(e.target) && e.target.classList.contains('m-check-addservices')) {
      e.stopPropagation();
      e.target.classList.toggle('g-cartografia-check2');
      e.target.classList.toggle('g-cartografia-check3');
      if (!this.containerResults.querySelectorAll('.g-cartografia-check3').length) {
        this.stateSelectAll = false;
      } else if (!this.containerResults.querySelectorAll('.g-cartografia-check2').length) {
        this.stateSelectAll = true;
      }
    } else if (!M.utils.isNullOrEmpty(e.target) && e.target.id === 'm-addservices-selectall') {
      if (this.stateSelectAll) {
        this.unSelect();
        this.stateSelectAll = false;
      } else {
        this.select();
        this.stateSelectAll = true;
      }
    }
  }

  /**
   * This function unselects checkboxs
   *
   * @function
   * @private
   */
  unSelect() {
    const unSelect = this.containerResults.querySelectorAll('.g-cartografia-check3');
    for (let i = 0; i < unSelect.length; i += 1) {
      unSelect[i].classList.remove('g-cartografia-check3');
      unSelect[i].classList.add('g-cartografia-check2');
    }
  }

  /**
   * This function selects checkboxs
   *
   * @function
   * @private
   */
  select() {
    const select = this.containerResults.querySelectorAll('.g-cartografia-check2');
    for (let i = 0; i < select.length; i += 1) {
      select[i].classList.remove('g-cartografia-check2');
      select[i].classList.add('g-cartografia-check3');
    }
  }

  /**
   * This function adds layers
   *
   * @function
   * @param {Event} evt - Event
   * @private
   */
  addLayers(evt) {
    evt.preventDefault();
    const layers = [];
    const elmSel = this.containerResults.querySelectorAll('.g-cartografia-check3');
    if (elmSel.length === 0) {
      M.dialog.error('Debes seleccionar al menos una capa.');
    } else {
      for (let i = 0; i < elmSel.length; i += 1) {
        for (let j = 0; j < this.capabilities.length; j += 1) {
          if (elmSel[i].id === this.capabilities[j].legend.replace(/ /g, '')) {
            this.capabilities[j].options.origen = 'WMS';
            layers.push(this.capabilities[j]);
          }
        }
      }
      this.facadeMap.addLayers(layers);
    }
  }

  /**
   * This function remove results show
   *
   * @function
   * @param {goog.events.BrowserEvent} evt - Event
   * @private
   */
  removeContains(evt) {
    evt.preventDefault();
    this.containerResults.innerHTML = '';
    this.urlService.value = '';
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof AddServicesControl;
  }
}
