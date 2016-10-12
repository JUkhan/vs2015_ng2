"use strict";
const router_1 = require('@angular/router');
const home_component_1 = require('./home/home.component');
exports.routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'setting', loadChildren: 'app/setting/setting.module' }
];
exports.routing = router_1.RouterModule.forRoot(exports.routes);

//# sourceMappingURL=app.routes.js.map
