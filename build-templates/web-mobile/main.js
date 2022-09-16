(function () {

  function boot() {

    var settings = window._CCSettings;
    window._CCSettings = undefined;
    var onProgress = null;

    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;

    function setLoadingDisplay() {
      // Loading splash scene
      var splash = document.getElementById('splash');
      var progressBar = splash.querySelector('.progress-bar span');
      onProgress = function (finish, total) {
        var percent = 100 * finish / total;
        if (progressBar) {
          progressBar.style.width = percent.toFixed(2) + '%';
        }
      };
      splash.style.display = 'block';
      progressBar.style.width = '0%';

      cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        splash.style.display = 'none';
      });
    }

    var onStart = function () {

      cc.view.enableRetina(true);
      cc.view.resizeWithBrowserSize(true);

      if (cc.sys.isBrowser) {
        setLoadingDisplay();
      }

      if (cc.sys.isMobile) {
        if (settings.orientation === 'landscape') {
          cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        }
        else if (settings.orientation === 'portrait') {
          cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        }
        cc.view.enableAutoFullScreen([
          cc.sys.BROWSER_TYPE_BAIDU,
          cc.sys.BROWSER_TYPE_BAIDU_APP,
          cc.sys.BROWSER_TYPE_WECHAT,
          cc.sys.BROWSER_TYPE_MOBILE_QQ,
          cc.sys.BROWSER_TYPE_MIUI,
          cc.sys.BROWSER_TYPE_HUAWEI,
          cc.sys.BROWSER_TYPE_UC,
        ].indexOf(cc.sys.browserType) < 0);
      }

      // Limit downloading max concurrent task to 2,
      // more tasks simultaneously may cause performance draw back on some android system / browsers.
      // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
      if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
        cc.assetManager.downloader.maxConcurrency = 2;
        cc.assetManager.downloader.maxRequestsPerFrame = 2;
      }

      var launchScene = settings.launchScene;
      var bundle = cc.assetManager.bundles.find(function (b) {
        return b.getSceneInfo(launchScene);
      });

      bundle.loadScene(launchScene, null, onProgress,
        function (err, scene) {
          if (!err) {
            cc.director.runSceneImmediate(scene);
            if (cc.sys.isBrowser) {
              // show canvas
              var canvas = document.getElementById('GameCanvas');
              canvas.style.visibility = '';
              var div = document.getElementById('GameDiv');
              if (div) {
                div.style.backgroundImage = '';
              }
              console.log('Success to load scene: ' + launchScene);
            }
          }
        }
      );

    };

    var option = {
      id: 'GameCanvas',
      debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
      showFPS: settings.debug,
      frameRate: 60,
      groupList: settings.groupList,
      collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({
      bundleVers: settings.bundleVers,
      remoteBundles: settings.remoteBundles,
      server: settings.server
    });

    var bundleRoot = [INTERNAL, MAIN]
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);
    // cc.assetManager.cacheManager.clearCache()
    var count = 0;
    function cb(err) {
      if (err) return console.error(err.message, err.stack);
      count++;
      if (count === bundleRoot.length + 1) {
        cc.game.run(option, onStart);
      }
    }

    cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x; }), cb);

    for (let i = 0; i < bundleRoot.length; i++) {
      var bundleName = bundleRoot[i];
      var bundleUrl = bundleName;
      var op = null;
      cc.assetManager.loadBundle(bundleUrl, op, cb);
    }
  };



  if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
      require('src/settings.js');
      require('src/cocos2d-runtime.js');
      if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
        require('src/physics.js');
      }
      require('jsb-adapter/engine/index.js');
    }
    else {
      require('src/settings.js');
      require('src/cocos2d-jsb.js');
      if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
        require('src/physics.js');
      }
      require('jsb-adapter/jsb-engine.js');
    }
  }

  if (window.document) {

    //bundle
    //op 1
    // function loadScript(url) {
    //   let source = window.resMap[url];
    //   var d = document,
    //     s = document.createElement('script');
    //   s.type = 'text/javascript';
    //   s.text = source;
    //   d.body.appendChild(s);
    // }

    // function downloadJson(url, options, onComplete) {
    //   let data = window.resMap[url];
    //   data = JSON.parse(data);
    //   onComplete(null, data);
    // };

    // function loadBundle(nameOrUrl, options, onComplete) {
    //   let bundleName = cc.path.basename(nameOrUrl);
    //   var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
    //   let suffix = version ? version + '.' : '';
    //   let url = `assets/${bundleName}`;

    //   let js = `assets/${bundleName}/index.${suffix}js`;
    //   if (!loadedScripts[js]) {
    //     loadScript(js);
    //     loadedScripts[js] = true;
    //   }

    //   options.__cacheBundleRoot__ = bundleName;
    //   var config = `${url}/config.${suffix}json`;
    //   downloadJson(config, options, function (err, data) {
    //     if (err) {
    //       onComplete && onComplete(err);
    //       return;
    //     }
    //     data.base = url + '/';
    //     onComplete && onComplete(null, data);
    //   });
    // };

    //op 2
    // const loadedScripts = {};
    // const REGEX = /^\w+:\/\/.*/;
    // const downloader = cc.assetManager.downloader;

    // var loadBundle = function (nameOrUrl, options, onComplete) {
    //   let bundleName = cc.path.basename(nameOrUrl);
    //   // let url = nameOrUrl;
    //   url = 'http://localhost/' + bundleName
    //   if (!REGEX.test(url)) url = bundleName;
    //   // var version = options.version || downloader.bundleVers[bundleName];
    //   var count = 0;
    //   var config = `${url}/config.json`;
    //   let out = null, error = null;
    //   //下载json文件，
    //   downloadJson(config, options, function (err, response) {
    //     if (err) {
    //       error = err;
    //     }
    //     out = response;
    //     out && (out.base = url + '/');
    //     count++;
    //     if (count === 2) {
    //       onComplete(error, out);
    //     }
    //   });

    //   var js = `${url}/index.js`;
    //   //下载js文件
    //   loadScript(js, options, function (err) {
    //     if (err) {
    //       error = err;
    //     }
    //     count++;
    //     if (count === 2) {
    //       onComplete(error, out);
    //     }
    //   });
    // };

    //op4
    var loadBundle = function (nameOrUrl, options, onComplete) {
      // console.log("nameOrUrl: " + nameOrUrl)
      if (nameOrUrl.includes('http')) {
        var str = nameOrUrl + "/config.json"
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            console.log("xhr.status " + xhr.status)
            if (xhr.status === 200) {
              var data = null;
              var e = null;
              try {
                console.log("xhr.responseText  " + xhr.responseText);
                data = JSON.parse(xhr.responseText);
              } catch (ex) {
                e = ex;
              }
              onComplete(e, data);
            } else {
              onComplete(xhr.status, null);
            }
          }
        };
        var link = str
        console.log("GET LINK:" + link);
        xhr.open("GET", link, true);
        xhr.send();
      }
      else {
        var str = window.resMap[nameOrUrl + "/config.json"];
        var data = JSON.parse(str);
        onComplete(null, data);
      }
    };

    // Json
    var loadJson = function (nameOrUrl, options, onComplete) {
      if (nameOrUrl.includes('http')) {
        var str = nameOrUrl
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            console.log("xhr.status " + xhr.status)
            if (xhr.status === 200) {
              var data = null;
              var e = null;
              try {
                console.log("xhr.responseText  " + xhr.responseText);
                data = JSON.parse(xhr.responseText);
              } catch (ex) {
                e = ex;
              }
              onComplete(e, data);
            } else {
              onComplete(xhr.status, null);
            }
          }
        };
        var link = str
        console.log("GET LINK:" + link);
        xhr.open("GET", link, true);
        xhr.send();;
      }
      else {
        var data = JSON.parse(window.resMap[nameOrUrl]);
        onComplete(null, data);
      }
    }

    // Image
    function loadDomImage(url, options, onComplete) {
      var index = url.lastIndexOf(".");
      var strtype = url.substr(index + 1, 4);
      strtype = strtype.toLowerCase();
      if (url.includes('http')) {
        var data = url;
      }
      else {
        var data = window.resMap[url];
      }

      console.log("loadDomImage data: " + data);
      var img = new Image();

      if (window.location.protocol !== 'file:') {
        img.crossOrigin = 'anonymous';
      }

      function loadCallback() {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        onComplete && onComplete(null, img);
      }

      function errorCallback() {
        img.removeEventListener('load', loadCallback);
        img.removeEventListener('error', errorCallback);
        onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
      }

      img.addEventListener('load', loadCallback);
      img.addEventListener('error', errorCallback);
      img.src = data;
      return img;
    }

    var loadImage = function (nameOrUrl, options, onComplete) {
      loadDomImage(nameOrUrl, options, onComplete);
    }

    // Audio
    var __audioSupport = cc.sys.__audioSupport;
    var formatSupport = __audioSupport.format;
    var context = __audioSupport.context;

    function base64toBlob(base64, type) {
      var bstr = atob(base64, type),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {
        type: type,
      })
    }

    function base64toArray(base64) {
      var bstr = atob(base64),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return u8arr;
    }

    function loadDomAudio(url, onComplete) {

      var dom = document.createElement('audio');

      dom.muted = true;
      dom.muted = false;

      if (url.includes('http')) {
        var data = url.split("?")[0]
      }
      else {
        var data = window.resMap[url.split("?")[0]];
      }
      data = base64toBlob(data, "audio/mpeg");
      if (window.URL) {
        dom.src = window.URL.createObjectURL(data);
      } else {
        dom.src = data;
      }

      var clearEvent = function () {
        clearTimeout(timer);
        dom.removeEventListener("canplaythrough", success, false);
        dom.removeEventListener("error", failure, false);
        if (__audioSupport.USE_LOADER_EVENT)
          dom.removeEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
      };

      var timer = setTimeout(function () {
        if (dom.readyState === 0)
          failure();
        else
          success();
      }, 8000);

      var success = function () {
        clearEvent();
        onComplete && onComplete(null, dom);
      };

      var failure = function () {
        clearEvent();
        var message = 'load audio failure - ' + url;
        cc.log(message);
        onComplete && onComplete(new Error(message));
      };

      dom.addEventListener("canplaythrough", success, false);
      dom.addEventListener("error", failure, false);
      if (__audioSupport.USE_LOADER_EVENT)
        dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
      return dom;
    }

    function loadWebAudio(url, onComplete) {
      if (!context) callback(new Error('Audio Downloader: no web audio context.'));

      if (url.includes('http')) {
        var data = url;
      }
      else {
        var data = window.resMap[url];
      }
      data = base64toArray(data);
      if (data) {
        context["decodeAudioData"](data.buffer, function (buffer) {
          onComplete(null, buffer);
        }, function () {
          onComplete('decode error - ' + url, null);
        });
      } else {
        onComplete('request error - ' + url, null);
      }
    }

    var loadAudio = (url, options, onComplete) => {
      if (formatSupport.length === 0) {
        return new Error('Audio Downloader: audio not supported on this browser!');
      }
      // If WebAudio is not supported, load using DOM mode
      if (!__audioSupport.WEB_AUDIO) {
        loadDomAudio(url, onComplete);
      }
      else {
        loadWebAudio(url, onComplete);
      }
    }

    // Font
    var loadFont = (url, options, onComplete) => {
      var ttfIndex = url.lastIndexOf(".ttf");

      var slashPos = url.lastIndexOf("/");
      var fontFamilyName;
      if (slashPos === -1) {
        fontFamilyName = url.substring(0, ttfIndex) + "_LABEL";
      } else {
        fontFamilyName = url.substring(slashPos + 1, ttfIndex) + "_LABEL";
      }
      if (fontFamilyName.indexOf(' ') !== -1) {
        fontFamilyName = '"' + fontFamilyName + '"';
      }

      // Setup font face style
      let fontStyle = document.createElement("style");
      fontStyle.type = "text/css";
      let fontStr = "";
      if (isNaN(fontFamilyName - 0))
        fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";
      else
        fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";

      var data = "url(data:application/x-font-woff;charset=utf-8;base64,PASTE-BASE64-HERE) format(\"woff\");";
      data = data.replace("PASTE-BASE64-HERE", window.resMap[url]);

      fontStr += data;
      fontStyle.textContent = fontStr + "}";
      document.body.appendChild(fontStyle);

      // Preload font with div
      let preloadDiv = document.createElement("div");
      let divStyle = preloadDiv.style;
      divStyle.fontFamily = fontFamilyName;
      preloadDiv.innerHTML = ".";
      divStyle.position = "absolute";
      divStyle.left = "-100px";
      divStyle.top = "-100px";
      document.body.appendChild(preloadDiv);

      onComplete(null, fontFamilyName);
    }

    function loadVideo(url, options, onComplete) {
      onComplete(null);

    }

    function downloadBinBinary (url, options, onComplete) {
			var arrayBuffer = base64toArray(window.resMap[url]);
			if (arrayBuffer) {
				var result = new Uint8Array(arrayBuffer);
				onComplete(null, result);
			}
			else {
				onComplete({status:xhr.status, errorMessage:errInfo + '(no response)'});
			}
		}

    
function downloadText(url, options, onComplete) {
  let data = window.resMap[url];
  onComplete(null, data);
};

    // cc.assetManager.transformPipeline.append((task) => {
    //   var input = task.output = task.input;
    //   for (let i = 0; i < input.length; i++) {
    //     var item = input[i];
    //     if (item.ext !== 'bundle') continue;
    //     item.url = 'https://your_server.com/' + item.url;
    //   }
    // });
    cc.assetManager.downloader.register('bundle', loadBundle);
    cc.assetManager.downloader.register('.json', loadJson);
    cc.assetManager.downloader.register('.png', loadImage);
    cc.assetManager.downloader.register('.jpg', loadImage);
    cc.assetManager.downloader.register('.jpeg', loadImage);
    cc.assetManager.downloader.register('.mp3', loadAudio);
    cc.assetManager.downloader.register('.ogg', loadAudio);
    cc.assetManager.downloader.register('.wav', loadAudio);
    cc.assetManager.downloader.register('.m4a', loadAudio);
    cc.assetManager.downloader.register('.ttf', loadFont);
    cc.assetManager.downloader.register('.bin', downloadBinBinary);
    cc.assetManager.downloader.register('.plist', downloadText);

    // cc.assetManager.downloader.register('.mp4', loadVideo);

    var splash = document.getElementById('splash');
    splash.style.display = 'block';
    cc.macro.CLEANUP_IMAGE_CACHE = true;

    boot();
  }

})();
