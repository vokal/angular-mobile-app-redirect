"use strict";

/*	Module to provide functionality to redirect a web site to
	 an iOS app using a specified iOS url.
*/
angular.module( "vokal.appRedirect", [] )
	.provider( "AppRedirect", [ function ()
	{
		//hold on to urls
		this.iPadUrl = null;
		this.iPhoneUrl = null;

		this.setDeviceUrl = function ( device, scheme )
		{
			device = device.toLowerCase();
			switch( device )
			{
				case "ipad":
					this.iPadUrl = scheme + "://";
					break;
				case "iphone":
					this.iPhoneUrl = scheme + "://";
					break;
			}
		};
		this.setDevicesUrls = function ( deviceObject )
		{
			var keys = Object.keys( deviceObject );
			for( var i = 0; i < keys.length; i++ )
			{
				var key = keys[ i ];
				this.setDeviceUrl( key, deviceObject[ key ] );
			}
		};

		//setup the iframe used for the service
		var myFrame = document.createElement( "iframe" );
		myFrame.id = "app-redirect-frame";
		myFrame.style.display = "none";
		document.body.appendChild( myFrame );


		var AppRedirectService = function ( iPadUrl, iPhoneUrl, redirectFrame )
		{
			var userAgent = window.navigator.userAgent;

			//test userAgent to see if it finds a matching device
			var isIPad = /iPad/i.test( userAgent );
			var isIPhone = /iPhone/i.test( userAgent );

			/*	Use a sessionStorage object to make it so that the if the user opts to return to the page,
				 it wont force him away
			*/
			var markAttempt = function ()
			{
				sessionStorage.setItem( "appRedirectAttempt", true );
			};
			var checkAttempted = function ()
			{
				var attempted = sessionStorage.getItem( "appRedirectAttempt" );
				attempted = attempted || null;
				return attempted;
			};

			/*	Redirect to a specific device
				@param: redirectObject - JS Object in format of:
				{
					device: String - device to redirect to,
					path: optional String - deep link to follow,
					force: optional Boolean - attempt to make redirection regardless of conditions
				}
			*/
			var redirectTo = function ( redirectObject )
			{
				var path = redirectObject.path || "";
				var force = redirectObject.force || false;
				var device = redirectObject.device;
				
				if( device === undefined )
				{
					throw( "No device specified", redirectObject );
				}

				device = device.toLowerCase();
				var url = null;
				var deviceFound = false;
				switch( device )
				{
					case "ipad":
						url = iPadUrl;
						deviceFound = isIPad;
						break;
					case "iphone":
						url = iPhoneUrl;
						deviceFound = isIPhone;
						break;
				}
				if( deviceFound || force )
				{
					if( url !== null )
					{
						url += path;
						attemptRedirect( url );
					}
				}
			};

			/*	Redirect the user depending on what device they are using
				 and if they have configured a url for that device
				@param: path - optional String - The path to the deep link in your app
			*/
			var dynamicRedirect = function ( path )
			{
				if( !checkAttempted() )
				{
					path = path || "";
					markAttempt( true );
					if( isIPad && iPadUrl )
					{
						attemptRedirect( iPadUrl + path );
					}
					else if( isIPhone && iPhoneUrl )
					{
						attemptRedirect( iPhoneUrl + path );
					}
				}
			};

			/*	Use the pre-set iframe to load the redirect path
			*/
			var attemptRedirect = function ( path )
			{
				redirectFrame.src = path;
			};

			/*	TODO: determine some way of checking to see if the redirect was successful...
				 Possibly redirect away from this page and go to the home page?
				 Not that it matters, since as soon as you navigate away on iOS, most js seems to die

				add something to localstorage and set a timeout to remove it after 1 second, assuming
				 that wouldn't happen if the redirect worked? you could check for the item later and take some action???
			*/

			return {
				redirectTo: function ( redirectObject ) { redirectTo( redirectObject ); },
				dynamicRedirect: function ( path ) { dynamicRedirect( path ); }
			};
		};

		this.$get = function()
		{ 
			return new AppRedirectService( this.iPadUrl, this.iPhoneUrl, myFrame );
		};
			
	} ] );
