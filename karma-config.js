module.exports = function ( config )
{
    "use strict";

    config.set( {

        basePath:   ".",
        frameworks: [ "jasmine" ],
        autoWatch:  false,
        browsers:   [ "Firefox" ],
        reporters:  [ "dots", "coverage" ],
        singleRun:  true,
        captureTimeout: 15000,
        logLevel: config.LOG_DEBUG,
        plugins: [
            "karma-jasmine",
            "karma-firefox-launcher",
            "karma-chrome-launcher",
            "karma-coverage"
        ],
        preprocessors: {
            "lib/*.js": [ "coverage" ]
        },
        coverageReporter: {
            dir : "coverage/karma/",
            subdir: ".",
            reporters: [
                { type: "lcov" }
            ]
        },
        files: [
            "bower_components/angular/angular.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "lib/*.js",
            "spec/*.js"
        ]

    } );

};
