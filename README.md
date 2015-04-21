# Angular Mobile App Redirect

**version 0.7**

While developing a web application with an associated iOS application, we encountered a problem when attempting to direct our users to the iOS application from their email client.

This service provides a simple means to redirect to a native (mainly iOS) app from within an Angular application. It works by injecting a hidden iframe into the document, which causes iOS to see a navigation attempt to the protocol scheme registered with an app, which  can then be handled appropriately from within the app.

## Dependencies

-   Angularjs
-   An iOS application which you will be directing too.
-   Aforementioned application must have registered custom URL scheme.

## Configuration

Include `vokal.appRedirect` in your angular app

```js
var app = angular.module( "app", [ "vokal.appRedirect" ] );
```

In your angular app configuration module, you will have to include `AppRedirectProvider` and use it to set the protocol you want to use.

```js
app.config( [ "AppRedirectProvider" ,
    function ( AppRedirectProvider )
    {
        //required
        AppRedirectProvider.setProtocol( "protocol" );

        // optional, set the devices to use (these are the default values)
        AppRedirectProvider.setDevices( { iPhone: true, iPad: false, Android: false } );
    } ] );
```

Inside one or more of your controllers, include `AppRedirect`, and set up logic to redirect to your native app or one of its deep links.

```js
app.controller( "DocumentationController",
    [ "AppRedirect",
    function ( AppRedirect )
    {
        // simply redirect to the native app
        AppRedirect.redirect( "" );

        // redirect to a deep link in your app
        // AppRedirect.redirect( <path>[, <always>] );
        AppRedirect.redirect( "documentation" );
    } ] );
```

Or as part of your $routeProvider, using resolve:

```js
    $routeProvider.when( "/reset-password/:token", {
        resolve: { appRedirect: [ "AppRedirect", "$route", function ( AppRedirect, $route )
            {
                return AppRedirect.redirect( "reset-password/" + $route.current.params.token );
            } ] } } );
```

### Configuration Functions:

#### `setProtocol( <scheme> )`

- param: scheme - String - The registered protocol for the app

Set the registered URL for a specific device.

#### `setDevices( { iPhone: true|false, iPad: true|false, Android: true|false } )`

- param: - object - The devices that should redirect

Set the devices that should redirect.

#### `setUserAgent( <agent> )`

- param: agent - String - Allows user agent spoofing

Primarily for testing purposes, but allows overriding of `window.navigator.userAgent`.

### Service Functions:

#### `redirect( <path>[, <always>] )`

- param: path - String - The path to the deep link in your app, or use an empty string to suggest the app ignore the path
- param: always - bool - Whether to always direct to the path when the device is used, even if the path has already been visited. 

Check which device the user is using and attempt to redirect to that app.

