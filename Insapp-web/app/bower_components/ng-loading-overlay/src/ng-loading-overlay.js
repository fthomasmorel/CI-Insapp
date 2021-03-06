(function (angular) {
    'use strict';
    // create module
    var app = angular.module('ngLoadingOverlay', []);
    // add config provider
    app.provider('$loadingOverlayConfig', function () {
        // default config
        var defaults = {
            bg: 'rgba(0, 0, 0, 0.5)',
            textColor: '#fff',
            template: '<b>Please wait</b>',
            zIndex: 9999
        };

        // available in config-block of the module
        this.defaultConfig = function (templateString, bg, textColor, zIndex) {
            defaults.bg = bg || defaults.bg;
            defaults.template = templateString || defaults.template;
            defaults.textColor = textColor || defaults.textColor;
            defaults.zIndex = zIndex || defaults.zIndex;
        };
        // allow to get functions
        this.$get = function () {
            return {
                get: function () {
                    return defaults;
                }
            };
        };
    });
    //add overlay service to show and hide overlay
    app.service('$loadingOverlay', [
        '$compile',
        '$rootScope',
        '$sce',
        '$loadingOverlayConfig',
        function ($compile, $rootScope, $sce, $loadingOverlayConfig) {
            var TEMPLATE_STRING = '<div id="ng-loading-overlay" ng-show="show" style="display: -webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex; align-items: center; justify-content: center; position:absolute; left:0; height: 100%; width: 100%;" ng-style="{\'background\': bg, \'color\': textColor, \'top\': positionTop, \'z-index\': zIndex}"><div style="position:relative;opacity: 1;" ng-bind-html="template"></div></div>',
                counter = 0,
                defaults = $loadingOverlayConfig.get(),
                element = angular.element(TEMPLATE_STRING),
                scope = $rootScope.$new();
                scope.show = false;

            // create layer if dom is ready
            angular.element(document).ready(function () {
                element = $compile(element)(scope);
                angular.element(document.body).append(element);
            });
            // show function --> allows to overwrite defaults per show
            this.show = function (templateString, bg, textColor, zIndex) {
                var body = angular.element(document.body);

                // increase counter
                counter = counter + 1;

                // use new or default values
                if (templateString) {
                    scope.template = $sce.trustAsHtml(templateString);
                } else {
                    scope.template = $sce.trustAsHtml(defaults.template);
                }
                if (bg) {
                    scope.bg = bg;
                } else {
                    scope.bg = defaults.bg;
                }
                if (textColor) {
                    scope.textColor = textColor;
                } else {
                    scope.textColor = defaults.textColor;
                }
                scope.zIndex = zIndex || defaults.zIndex;
                scope.positionTop = window.pageYOffset;
                // disable body scrolling
                body.css('overflow', 'hidden');
                scope.show = true;
            };
            this.hide = function () {
                // if there is an open loading --> decrease
                if (counter) {
                    counter = counter - 1;
                }
                // nothing is open --> hide loading layer
                if (!counter) {
                    // reactivate body scrolling
                    angular.element(document.body).css('overflow', 'auto');
                    scope.show = false;
                }
            };
        }
    ]);
}(window.angular));
