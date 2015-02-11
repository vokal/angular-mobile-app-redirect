
/*
    Redirect a web site to an app using an iframe.

    Use:
    in app.config: AppRedirectProvider.setProtocol( "protocol" );
    when needed:   AppRedirect.redirect( "reset-password/" );

    Example with routeProvider resolve
    $routeProvider.when( "/reset-password/:token", {
        resolve: { appRedirect: function ( AppRedirect, $route )
            {
                return AppRedirect.redirect( "reset-password/" + $route.current.params.token );
            } } } );

*/
angular.module( "vokal.appRedirect", [] )
.provider( "AppRedirect", [
    function ()
    {
        "use strict";

        var protocol = null;
        this.setProtocol = function ( setProtocol )
        {
            protocol = setProtocol;
        };

        var useDevices = {
            iPhone: true,
            iPad: false,
            Android: false // generally, Android apps will instead use intent filters on https
        };
        this.setDevices = function ( setDevices )
        {
            useDevices = setDevices;
        };


        var userAgent = window.navigator.userAgent;

        // Test userAgent to see if it finds a matching device
        var isIPad = /iPad/i.test( userAgent );
        var isIPhone = /iPhone/i.test( userAgent );
        var isAndroid = /Android/i.test( userAgent );

        // sessionStorage check necessary due to Safari private browsing limits
        var isSessionStorageSupported = ( function ()
        {
            try
            {
                sessionStorage.setItem( "appRedirectTest", "1" );
                sessionStorage.removeItem( "appRedirectTest" );
                return true;
            }
            catch( e )
            {
                return false;
            }
        } )();

        this.$get = function ()
        {
            var isActiveDevice =
                isIPhone && useDevices.iPhone
                || isIPad && useDevices.iPad
                || isAndroid && useDevices.Android;

            var redirectFrame = null;

            var markAttempt = function ( path )
            {
                if( isSessionStorageSupported )
                {
                    // Use a sessionStorage object so if the user returns to the page it won't force them away
                    sessionStorage.setItem( "appRedirectAttempt:" + path, true );
                }
            };

            var wasAttempted = function ( path )
            {
                return ( isSessionStorageSupported && sessionStorage.getItem( "appRedirectAttempt:" + path ) ) || null;
            };

            var redirect = function ( path )
            {
                if( !wasAttempted( path ) && isActiveDevice && path )
                {
                    markAttempt( path );
                    pushIframe( path );
                    return true;
                }
                return false;
            };

            var pushIframe = function ( path )
            {
                if( !redirectFrame )
                {
                    redirectFrame = document.createElement( "iframe" );
                    redirectFrame.id = "app-redirect-frame";
                    redirectFrame.style.display = "none";
                    document.body.appendChild( redirectFrame );
                }
                redirectFrame.src = protocol + "://" + path;
            };

            return {
                redirect: function ( path ) { redirect( path ); }
            };
        };

    } ] );
