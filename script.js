var MScriptLoader = function () {
	"use strict";

	var G_sResourcesRoot = '/uploads/';
	//var G_sResourcesRoot = './';

	var G_aScripts = [
		['http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js', G_sResourcesRoot + 'resources/js/ejs.js'],
		[G_sResourcesRoot + 'resources/js/jquerypp.min.js', 'http://www.youtube.com/player_api',
			G_sResourcesRoot + 'resources/js/roundabout.js', G_sResourcesRoot + 'resources/js/jquery.address.min.js'],
		[G_sResourcesRoot + 'resources/js/navigation.js', G_sResourcesRoot + 'resources/js/fancybox/source/jquery.fancybox.pack.js',
			G_sResourcesRoot + 'resources/js/worldmap.js', G_sResourcesRoot + 'resources/js/contentloader.js',
			G_sResourcesRoot + 'resources/js/headernav.js', G_sResourcesRoot + 'resources/js/people.js',
			G_sResourcesRoot + 'resources/js/popup.js']
	];

	return {
		init: function () {
			var OScriptLoader = function (aScripts) {
				if (!aScripts) {
					return;
				}
				this.aScripts = aScripts;
				this.aQueue = [];

				this.getNextOne();
			};

			OScriptLoader.prototype.injectJS = function (sScriptPath) {
				if (!sScriptPath) {
					return;
				}
				var htmlHead = document.getElementsByTagName('head').item(0),
					elmScript = document.createElement('script'),
					that = this,
					tempCallback = function () {
						that.aQueue.shift();
						that.getNextOne();
					};
				elmScript.setAttribute('src', sScriptPath);
				elmScript.onload = tempCallback;
				elmScript.onreadystatechange = function () {
					if (this.readyState === 'complete') {
						tempCallback();
					}
				};
				htmlHead.appendChild(elmScript);
			};

			OScriptLoader.prototype.getNextOne = function () {
				if (this.aScripts.length > 0 && this.aQueue.length === 0) {
					this.aQueue = this.aScripts.shift();
					var iQueueLength = this.aQueue.length, i = 0, sScriptPath;
					for (i; i < iQueueLength; i += 1) {
						sScriptPath = this.aQueue[i];
						this.injectJS(sScriptPath);
					}
				}
			};

			return new OScriptLoader(G_aScripts);
		}
	};

};

var OSL = new MScriptLoader().init();
