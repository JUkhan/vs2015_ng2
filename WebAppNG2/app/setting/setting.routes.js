"use strict";
const router_1 = require('@angular/router');
const crudExample_1 = require('./grid/crudExample');
const treeExample_1 = require('./grid/treeExample');
const cellEditExample_1 = require('./grid/cellEditExample');
const windowExample_1 = require('./grid/windowExample');
const routes = [
    { path: '', component: crudExample_1.CrudExample },
    { path: 'cellEdit', component: cellEditExample_1.CellEditExample },
    { path: 'treeView', component: treeExample_1.TreeExample },
    { path: 'window', component: windowExample_1.WindowComponent }
];
exports.routing = router_1.RouterModule.forChild(routes);
