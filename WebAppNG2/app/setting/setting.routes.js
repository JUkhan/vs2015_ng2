"use strict";
var router_1 = require('@angular/router');
var crudExample_1 = require('./grid/crudExample');
var treeExample_1 = require('./grid/treeExample');
var cellEditExample_1 = require('./grid/cellEditExample');
var windowExample_1 = require('./grid/windowExample');
var routes = [
    { path: '', component: crudExample_1.CrudExample },
    { path: 'cellEdit', component: cellEditExample_1.CellEditExample },
    { path: 'treeView', component: treeExample_1.TreeExample },
    { path: 'window', component: windowExample_1.WindowComponent }
];
exports.routing = router_1.RouterModule.forChild(routes);
//# sourceMappingURL=setting.routes.js.map