/**
 * ScriptLoader class
 * @class
 * @returns {Object} ScriptLoader
 */
var ScriptLoader = function () {
	"use strict";

    /**
     * Directory with scripts (begins and ends with '/')
     * @static
     * @type {String}
     */
	var ResourcesRoot = '/uploads/';

    /**
     * Two dimensional Array with scripts to inject to displayed page
     * First dimension loads scripts based on specified order synchronously
     * Second dimension loads scripts asynchronously
     * - [A: loaded first]
     * - [B: loaded second]
     * - [C: loaded third]
     * A, B, C: can contain multiple scripts which are loaded asynchronously,
     * but always B waits for all scripts from A to be loaded and C waits for B...
     * @static
     * @type {Array}
     */
	var Scripts = [
		[   'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'
        ,   ResourcesRoot + 'resources/js/ejs.js'
        ],
		[   'http://www.youtube.com/player_api'
		,   ResourcesRoot + 'resources/js/jquery.address.min.js'
        ],
		[   ResourcesRoot + 'resources/js/fancybox/source/jquery.fancybox.pack.js'
		,   ResourcesRoot + 'resources/js/contentloader.js'
        ]
	];

	return {
        /**
         * Constructor called as new ScriptLoader().init();
         * @constructor
         * @returns {Object}
         */
		init: function () {
			var OScriptLoader = function (Scripts) {
				if (!Scripts) {
					return;
				}
				this.Scripts = Scripts;
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
				if (this.Scripts.length > 0 && this.aQueue.length === 0) {
					this.aQueue = this.Scripts.shift();
					var iQueueLength = this.aQueue.length, i = 0, sScriptPath;
					for (i; i < iQueueLength; i += 1) {
						sScriptPath = this.aQueue[i];
						this.injectJS(sScriptPath);
					}
				}
			};

			return new OScriptLoader(Scripts);
		}
	};

};

/**
 *
 * @type {ScriptLoader}
 */
var OSL = new ScriptLoader().init();
