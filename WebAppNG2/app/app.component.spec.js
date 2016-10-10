"use strict";
const app_component_1 = require('./app.component');
const testing_1 = require('@angular/core/testing');
const platform_browser_1 = require('@angular/platform-browser');
describe('Smoke test', () => {
    it('should run a passing test', () => {
        expect(true).toEqual(true, 'should pass');
    });
});
describe('AppComponent with TCB', function () {
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({ declarations: [app_component_1.AppComponent] });
    });
    it('should instantiate component', () => {
        let fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        expect(fixture.componentInstance instanceof app_component_1.AppComponent).toBe(true, 'should create AppComponent');
    });
    it('should have expected <h1> text', () => {
        let fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        fixture.detectChanges();
        let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;
        h1 = fixture.debugElement.query(platform_browser_1.By.css('h1')).nativeElement;
        expect(h1.innerText).toMatch(/angular 2 app/i, '<h1> should say something about "Angular 2 App"');
    });
});
