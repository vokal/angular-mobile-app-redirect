
describe( "AppRedirect Provider", function ()
{
    "use strict";
    var AppRedirect;

    beforeEach( function ()
    {
        Array.prototype.forEach.call( document.querySelectorAll( "iframe" ), function( node )
        {
            node.parentNode.removeChild( node );
        } );
    } );

    describe( "Firefox", function ()
    {
        it( "should not inject", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setUserAgent( "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0" );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( false );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 0 );
        } );
    } );

    describe( "iPhone", function ()
    {
        var iPhoneUa = "Mozilla/5.0(iPhone;U;CPUiPhoneOS4_0likeMacOSX;en-us)AppleWebKit/532.9(KHTML,likeGecko)Version/4.0.5Mobile/8A293Safari/6531.22.7";

        it( "should not inject for iPhone if disabled", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setDevices( {} );
                AppRedirectProvider.setUserAgent( iPhoneUa );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( false );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 0 );
        } );

        it( "should inject by default", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setUserAgent( iPhoneUa );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( true );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 1 );
            // won't inject into same path without always
            expect( AppRedirect.redirect( "" ) ).toBe( false );
            expect( AppRedirect.redirect( "", true ) ).toBe( true );
        } );
    } );



    describe( "iPad", function ()
    {
        var iPadUa = "Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X; en-us) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B176 Safari/7534.48.3";

        it( "should not inject by default", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setUserAgent( iPadUa );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( false );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 0 );
        } );

        it( "should inject if set", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setDevices( { iPad: true } );
                AppRedirectProvider.setUserAgent( iPadUa );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( true );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 1 );
        } );
    } );



    describe( "Android", function ()
    {
        var androidUa = "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";

        it( "should not inject by default", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setUserAgent( androidUa );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( false );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 0 );
        } );

        it( "should inject if set", function ()
        {
            var mockModule = angular.module( "test.AppRedirect", function () {} );
            mockModule.config( function ( AppRedirectProvider )
            {
                AppRedirectProvider.setProtocol( "myapp" );
                AppRedirectProvider.setDevices( { Android: true } );
                AppRedirectProvider.setUserAgent( androidUa );
            } );

            module( "vokal.appRedirect", "test.AppRedirect" );

            inject( function ( $injector )
            {
                AppRedirect = $injector.get( "AppRedirect" );
            } );

            expect( AppRedirect.redirect( "", true ) ).toBe( true );
            expect( document.querySelectorAll( "iframe" ).length ).toBe( 1 );
        } );
    } );

} );
