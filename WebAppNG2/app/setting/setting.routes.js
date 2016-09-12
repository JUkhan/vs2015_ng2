"use strict";
var router_1 = require('@angular/router');
var crudExample_1 = require('./grid/crudExample');
var treeExample_1 = require('./grid/treeExample');
var cellEditExample_1 = require('./grid/cellEditExample');
var routes = [
    { path: '', component: crudExample_1.CrudExample },
    { path: 'cellEdit', component: cellEditExample_1.CellEditExample },
    { path: 'treeView', component: treeExample_1.TreeExample }
];
exports.routing = router_1.RouterModule.forChild(routes);
//# sourceMappingURL=setting.routes.js.map