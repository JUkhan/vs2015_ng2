"use strict";
var router_1 = require('@angular/router');
var grid_1 = require('./grid/grid');
var upload_1 = require('./upload/upload');
var ClaimImport_component_1 = require('./ClaimImport/ClaimImport.component');
var routes = [
    { path: '', component: grid_1.gridExample },
    { path: 'upload', component: upload_1.UploadComponent },
    { path: 'claim', component: ClaimImport_component_1.ClaimImport }
];
exports.routing = router_1.RouterModule.forChild(routes);
//# sourceMappingURL=setting.routes.js.map