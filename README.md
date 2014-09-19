#Angular Mobile App Redirect

**version 0.6**

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
        AppRedirectProvider.setDeviceUrl( device, scheme );
        */
        AppRedirectProvider.setDeviceUrl( "iphone", "myapp" );
        
        //or
        
        /*
        AppRedirectProvider.setDevicesUrls( {
            device_a: scheme,
            device_b: scheme
        } );
        */
        AppRedirectProvider.setDevicesUrls( {
            ipad: "myipadapp",
            iphone: "myiphoneapp"
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
        // note that "myapp" is not included in the <path> argument
        
        // redirect to only one of the supported devices
        /*
        AppRedirect.redirectTo( device, <path>, <force_redirect> );
        */
        AppRedirect.redirectTo( "iPad", "ipad-docs" );
    }
```

###Configuration Functions:

####function `setDeviceUrl( device, scheme )`

- param: device - String - The device to direct to
- param: scheme - String - The registered URL for the app

This function will set the registered URL for a specific device.

####function `setDevicesUrls( deviceObject )`

- param: deviceObject - A JavaScript object in the format of:

```
{
    device_a: scheme,
    device_b: scheme,
    ...
}
```

This function will set the registered URLs for a specified devices.

###Service Functions:

####function `dynamicRedirect( <path> )`

- param: path - optional String - The path to the deep link in your app

This function will check which device the user is using and attempt to redirect to that app.

If a path parameter is included, it will attempt to redirect to the app's deep link associated with the path.

####function `redirectTo( redirectObject )`

Redirect to a specific device
- param: redirectObject - JS Object in format of:

```
{
    device: String - device to redirect to,
    path: optional String - deep link to follow,
    force: optional Boolean - attempt to make redirection regardless of conditions
}
```
