#Angular Mobile App Redirect

**version 0.5**

While developing a web application with an associated iOS application, we encountered a problem when attempting to direct our users to the iOS application from their email client.

This is an attempt to solve that problem for single page Angular applications.

##Dependencies

-   Angularjs
-   An iOS application which you will be directing too.
-   Aforementioned application must have registered custom URL scheme.

##iOS Configuration

-   Include `vokal.appRedirect` in your angular app

```
var app = angular.module( "app", [ "vokal.appRedirect" ] );
```

-   In your angular app configuration module, you will have to include `AppRedirectProvider` and use it to set one or more device URLs.

```
app.config( [ "AppRedirectProvider" ,
    function ( AppRedirectProvider )
    {
        /*
        AppRedirectProvider.setDeviceUrl( <device>, <URL scheme> );
        */
        AppRedirectProvider.setDeviceUrl( "iphone", "myapp://" );
        
        //or
        
        /*
        AppRedirectProvider.setDevicesUrls( {
            ipad: <iPad URL scheme>,
            iphone: <iPhone URL scheme>
        } );
        */
        AppRedirectProvider.setDevicesUrls( {
            ipad: "myipadapp://,
            iphone: "myiphoneapp://
        } );
        
    } ] );
    
```

-   Inside one or more of your page controllers, set up logic to redirect to your native app or one of its deep links.

```
app.controller( "DocumentationController",
    "AppRedirect",
    function ( AppRedirect )
    {
        // simply redirect to the native app
        AppRedirect.dynamicRedirect();
        
        // redirect to a deep link in your app
        /*
        AppRedirect.dynamicRedirect( <deep link path> );
        */
        AppRedirect.dynamicRedirect( "documentation" );
        // note that "myapp://" is not included in the <deep link path> argument
        
        // redirect to only one of the supported devices
        /*
        AppRedirect.redirectTo( <device>, <path>, <force redirect> );
        */
        AppRedirect.redirectTo( iPad, "ipad-docs" );
    }
```
