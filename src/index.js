import M$plugin$AddServices from '/home/fbmanas/Codigo/tmp/catastrosearch_create_plugin/addservices/src/facade/js/addservices';
import M$control$AddServicesControl from '/home/fbmanas/Codigo/tmp/catastrosearch_create_plugin/addservices/src/facade/js/addservicesControl';
import M$impl$control$AddServicesControl from '/home/fbmanas/Codigo/tmp/catastrosearch_create_plugin/addservices/src/impl/ol/js/addservicesControl';

if (!window.M.plugin) window.M.plugin = {};
if (!window.M.control) window.M.control = {};
if (!window.M.impl) window.M.impl = {};
if (!window.M.impl.control) window.M.impl.control = {};
window.M.plugin.AddServices = M$plugin$AddServices;
window.M.control.AddServicesControl = M$control$AddServicesControl;
window.M.impl.control.AddServicesControl = M$impl$control$AddServicesControl;
