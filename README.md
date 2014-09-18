#Angular Mobile App Redirect

**version 0.5.1**

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
        AppRedirectProvider.setDeviceUrl( <device>, <URL_scheme> );
        */
        AppRedirectProvider.setDeviceUrl( "iphone", "myapp://" );
        
        //or
        
        /*
        AppRedirectProvider.setDevicesUrls( {
            ipad: <iPad_URL_scheme>,
            iphone: <iPhone_URL_scheme>
        } );
        */
        AppRedirectProvider.setDevicesUrls( {
            ipad: "myipadapp://,
            iphone: "myiphoneapp://
        } );
        
    } ] );
    
```

-   Inside one or more of your page controllers, include `AppRedirect`, and set up logic to redirect to your native app or one of its deep links.

```
app.controller( "DocumentationController",
    "AppRedirect",
    function ( AppRedirect )
    {
        // simply redirect to the native app
        AppRedirect.dynamicRedirect();
        
        // redirect to a deep link in your app
        /*
        AppRedirect.dynamicRedirect( <path> );
        */
        AppRedirect.dynamicRedirect( "documentation" );
        // note that "myapp://" is not included in the <deep link path> argument
        
        // redirect to only one of the supported devices
        /*
        AppRedirect.redirectTo( <device>, <path>, <force_redirect> );
        */
        AppRedirect.redirectTo( iPad, "ipad-docs" );
    }
```

###Configuration Functions:

####function `setDeviceUrl`

- param: device - String - The device to direct to
- param: URL_scheme - String - The registered URL for the app

This function will set the registered URL for a specific device.

####function `setDevicesUrls`

- param: device_object - A JavaScript object in the format of:

```
{
    <device name>: <device registered URL>,
    <device name>: <device registered URL>
}
```

This function will set the registered URLs for a specified devices.

###Service Functions:

####function `dynamicRedirect`

- param: path - optional String - The path to the deep link in your app

This function will check which device the user is using and attempt to redirect to that app.

If a path parameter is included, it will attempt to redirect to the app's deep link associated with the path.

####function `redirectTo`

- param: device - String - The specific device to attempt to redirect to
- param: path - optional String - The path to the deep link in your app
- param: force_redirect - optional Boolean - Attempt to redirect the app regardless of circumstances
