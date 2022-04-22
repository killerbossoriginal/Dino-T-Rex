CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  return this.closePath();
};

CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, r) {
  this.roundRect(x, y, w, h, r);
  return this.fill();
};

CanvasRenderingContext2D.prototype.strokeRoundRect = function(x, y, w, h, r) {
  this.roundRect(x, y, w, h, r);
  return this.stroke();
};

var Random;

Random = (function() {
  function Random(_seed, hash) {
    this._seed = _seed != null ? _seed : Math.random();
    if (hash == null) {
      hash = true;
    }
    if (this._seed === 0) {
      this._seed = Math.random();
    }
    if (this._seed < 1) {
      this._seed *= 1 << 30;
    }
    this.a = 13971;
    this.b = 12345;
    this.size = 1 << 30;
    this.mask = this.size - 1;
    this.norm = 1 / this.size;
    if (hash) {
      this.nextSeed();
      this.nextSeed();
      this.nextSeed();
    }
  }

  Random.prototype.next = function() {
    this._seed = (this._seed * this.a + this.b) & this.mask;
    return this._seed * this.norm;
  };

  Random.prototype.nextInt = function(num) {
    return Math.floor(this.next() * num);
  };

  Random.prototype.nextSeed = function() {
    return this._seed = (this._seed * this.a + this.b) & this.mask;
  };

  Random.prototype.seed = function(_seed) {
    this._seed = _seed != null ? _seed : Math.random();
    if (this._seed < 1) {
      this._seed *= 1 << 30;
    }
    this.nextSeed();
    this.nextSeed();
    return this.nextSeed();
  };

  Random.prototype.clone = function(seed) {
    if (seed != null) {
      return new Random(seed);
    } else {
      seed = this._seed;
      return new Random(seed, false);
    }
  };

  return Random;

})();

this.MicroVM = (function() {
  function MicroVM(meta, global, namespace1, preserve_ls) {
    var ctx, err;
    if (meta == null) {
      meta = {};
    }
    if (global == null) {
      global = {};
    }
    this.namespace = namespace1 != null ? namespace1 : "/microstudio";
    this.preserve_ls = preserve_ls != null ? preserve_ls : false;
    if (meta.print == null) {
      meta.print = (function(_this) {
        return function(text) {
          if (typeof text === "object" && (_this.runner != null)) {
            text = _this.runner.toString(text);
          }
          return console.info(text);
        };
      })(this);
    }
    Array.prototype.insert = function(e) {
      this.splice(0, 0, e);
      return e;
    };
    Array.prototype.insertAt = function(e, i) {
      if (i >= 0 && i < this.length) {
        this.splice(i, 0, e);
      } else {
        this.push(e);
      }
      return e;
    };
    Array.prototype.remove = function(i) {
      if (i >= 0 && i < this.length) {
        return this.splice(i, 1)[0];
      } else {
        return 0;
      }
    };
    Array.prototype.removeAt = function(i) {
      if (i >= 0 && i < this.length) {
        return this.splice(i, 1)[0];
      } else {
        return 0;
      }
    };
    Array.prototype.removeElement = function(e) {
      var index;
      index = this.indexOf(e);
      if (index >= 0) {
        return this.splice(index, 1)[0];
      } else {
        return 0;
      }
    };
    Array.prototype.contains = function(e) {
      if (this.indexOf(e) >= 0) {
        return 1;
      } else {
        return 0;
      }
    };
    meta.round = function(x) {
      return Math.round(x);
    };
    meta.floor = function(x) {
      return Math.floor(x);
    };
    meta.ceil = function(x) {
      return Math.ceil(x);
    };
    meta.abs = function(x) {
      return Math.abs(x);
    };
    meta.min = function(x, y) {
      return Math.min(x, y);
    };
    meta.max = function(x, y) {
      return Math.max(x, y);
    };
    meta.sqrt = function(x) {
      return Math.sqrt(x);
    };
    meta.pow = function(x, y) {
      return Math.pow(x, y);
    };
    meta.sin = function(x) {
      return Math.sin(x);
    };
    meta.cos = function(x) {
      return Math.cos(x);
    };
    meta.tan = function(x) {
      return Math.tan(x);
    };
    meta.acos = function(x) {
      return Math.acos(x);
    };
    meta.asin = function(x) {
      return Math.asin(x);
    };
    meta.atan = function(x) {
      return Math.atan(x);
    };
    meta.atan2 = function(y, x) {
      return Math.atan2(y, x);
    };
    meta.sind = function(x) {
      return Math.sin(x / 180 * Math.PI);
    };
    meta.cosd = function(x) {
      return Math.cos(x / 180 * Math.PI);
    };
    meta.tand = function(x) {
      return Math.tan(x / 180 * Math.PI);
    };
    meta.acosd = function(x) {
      return Math.acos(x) * 180 / Math.PI;
    };
    meta.asind = function(x) {
      return Math.asin(x) * 180 / Math.PI;
    };
    meta.atand = function(x) {
      return Math.atan(x) * 180 / Math.PI;
    };
    meta.atan2d = function(y, x) {
      return Math.atan2(y, x) * 180 / Math.PI;
    };
    meta.log = function(x) {
      return Math.log(x);
    };
    meta.exp = function(x) {
      return Math.exp(x);
    };
    meta.random = new Random(0);
    meta.PI = Math.PI;
    meta["true"] = 1;
    meta["false"] = 0;
    global.system = {
      time: Date.now,
      language: navigator.language,
      inputs: {
        keyboard: 1,
        mouse: 1,
        touch: "ontouchstart" in window ? 1 : 0,
        gamepad: 0
      },
      prompt: (function(_this) {
        return function(text, callback) {
          return setTimeout((function() {
            var args, result;
            global.mouse.pressed = 0;
            global.touch.touching = 0;
            result = window.prompt(text);
            if ((callback != null) && typeof callback === "function") {
              args = [(result != null ? 1 : 0), result];
              _this.context.timeout = Date.now() + 1000;
              return callback.apply(null, args);
            }
          }), 0);
        };
      })(this),
      say: (function(_this) {
        return function(text) {
          return setTimeout((function() {
            return window.alert(text);
          }), 0);
        };
      })(this)
    };
    try {
      global.system.inputs.keyboard = window.matchMedia("(pointer:fine)").matches ? 1 : 0;
      global.system.inputs.mouse = window.matchMedia("(any-hover:none)").matches ? 0 : 1;
    } catch (error1) {
      err = error1;
    }
    this.storage_service = this.createStorageService();
    global.storage = this.storage_service.api;
    meta.global = global;
    this.context = {
      meta: meta,
      global: global,
      local: global,
      object: global,
      breakable: 0,
      continuable: 0,
      returnable: 0,
      stack_size: 0
    };
    ctx = this.context;
    Array.prototype.sortList = function(f) {
      var funk;
      if ((f != null) && f instanceof Program.Function) {
        funk = function(a, b) {
          return f.call(ctx, [a, b], true);
        };
      } else if ((f != null) && typeof f === "function") {
        funk = f;
      }
      return this.sort(funk);
    };
    this.clearWarnings();
    this.runner = new Runner(this);
  }

  MicroVM.prototype.clearWarnings = function() {
    return this.context.warnings = {
      using_undefined_variable: {},
      assigning_field_to_undefined: {},
      invoking_non_function: {}
    };
  };

  MicroVM.prototype.setMeta = function(key, value) {
    return this.context.meta[key] = value;
  };

  MicroVM.prototype.setGlobal = function(key, value) {
    return this.context.global[key] = value;
  };

  MicroVM.prototype.run = function(program, timeout, filename, callback) {
    var err, res;
    this.program = program;
    if (timeout == null) {
      timeout = 3000;
    }
    if (filename == null) {
      filename = "";
    }
    this.error_info = null;
    this.context.timeout = Date.now() + timeout;
    this.context.stack_size = 0;
    try {
      res = this.runner.run(this.program, filename, callback);
      this.storage_service.check();
      if (res != null) {
        return this.runner.toString(res);
      } else {
        return null;
      }
    } catch (error1) {
      err = error1;
      if ((err.type != null) && (err.line != null) && (err.error != null)) {
        this.error_info = err;
      } else if ((this.context.location != null) && (this.context.location.token != null)) {
        this.error_info = {
          error: err,
          file: filename,
          line: this.context.location.token.line,
          column: this.context.location.token.column
        };
        console.info("Error at line: " + this.context.location.token.line + " column: " + this.context.location.token.column);
      } else {
        this.error_info = {
          error: err,
          file: filename
        };
      }
      console.error(err);
      return this.storage_service.check();
    }
  };

  MicroVM.prototype.call = function(name, args, timeout) {
    var err, res;
    if (args == null) {
      args = [];
    }
    if (timeout == null) {
      timeout = 3000;
    }
    this.error_info = null;
    this.context.timeout = Date.now() + timeout;
    this.context.stack_size = 0;
    try {
      res = this.runner.call(name, args);
      this.storage_service.check();
      return res;
    } catch (error1) {
      err = error1;
      console.error(err);
      if ((this.context.location != null) && (this.context.location.token != null)) {
        this.error_info = {
          error: err,
          line: this.context.location.token.line,
          column: this.context.location.token.column,
          file: this.context.location.token.file
        };
      } else {
        this.error_info = {
          error: err
        };
      }
      if ((this.context.location != null) && (this.context.location.token != null)) {
        console.info("Error at line: " + this.context.location.token.line + " column: " + this.context.location.token.column);
      }
      return this.storage_service.check();
    }
  };

  MicroVM.prototype.createStorageService = function() {
    var err, error, ls, namespace, s, service, storage, write_storage;
    try {
      ls = window.localStorage;
    } catch (error1) {
      error = error1;
      console.info("localStorage not available");
      return service = {
        api: {
          set: function() {},
          get: function() {
            return 0;
          }
        },
        check: function() {}
      };
    }
    if (!this.preserve_ls) {
      try {
        delete window.localStorage;
      } catch (error1) {
        err = error1;
      }
    }
    storage = {};
    write_storage = false;
    namespace = this.namespace;
    try {
      s = ls.getItem("ms" + namespace);
      if (s) {
        storage = JSON.parse(s);
      }
    } catch (error1) {
      err = error1;
    }
    return service = {
      api: {
        set: (function(_this) {
          return function(name, value) {
            value = _this.storableObject(value);
            if ((name != null) && (value != null)) {
              storage[name] = value;
              write_storage = true;
            }
            return value;
          };
        })(this),
        get: (function(_this) {
          return function(name) {
            if (name != null) {
              if (storage[name] != null) {
                return storage[name];
              } else {
                return 0;
              }
            } else {
              return 0;
            }
          };
        })(this)
      },
      check: (function(_this) {
        return function() {
          if (write_storage) {
            write_storage = false;
            try {
              return ls.setItem("ms" + namespace, JSON.stringify(storage));
            } catch (error1) {
              err = error1;
            }
          }
        };
      })(this)
    };
  };

  MicroVM.prototype.storableObject = function(value) {
    var referenced;
    referenced = [this.context.global.screen, this.context.global.system, this.context.global.keyboard, this.context.global.audio, this.context.global.gamepad, this.context.global.touch, this.context.global.mouse, this.context.global.sprites, this.context.global.maps];
    return this.makeStorableObject(value, referenced);
  };

  MicroVM.prototype.makeStorableObject = function(value, referenced) {
    var i, j, key, len, res, v;
    if (value == null) {
      return value;
    }
    if (typeof value === "function" || value instanceof Program.Function) {
      return void 0;
    } else if (typeof value === "object") {
      if (referenced.indexOf(value) >= 0) {
        return void 0;
      }
      referenced = referenced.slice();
      referenced.push(value);
      if (Array.isArray(value)) {
        res = [];
        for (i = j = 0, len = value.length; j < len; i = ++j) {
          v = value[i];
          v = this.makeStorableObject(v, referenced);
          if (v != null) {
            res[i] = v;
          }
        }
        return res;
      } else {
        res = {};
        for (key in value) {
          v = value[key];
          v = this.makeStorableObject(v, referenced);
          if (v != null) {
            res[key] = v;
          }
        }
        return res;
      }
    } else {
      return value;
    }
  };

  return MicroVM;

})();

var arrayBufferToBase64, loadWaveFileLib, saveFile, writeProjectFile;

this.Runtime = (function() {
  function Runtime(url1, sources, resources, listener) {
    this.url = url1;
    this.sources = sources;
    this.resources = resources;
    this.listener = listener;
    this.screen = new Screen(this);
    this.audio = new AudioCore(this);
    this.keyboard = new Keyboard();
    this.gamepad = new Gamepad();
    this.asset_manager = new AssetManager(this);
    this.sprites = {};
    this.maps = {};
    this.sounds = {};
    this.music = {};
    this.assets = {};
    this.touch = {};
    this.mouse = this.screen.mouse;
    this.previous_init = null;
    this.random = new Random(0);
    this.orientation = window.orientation;
    this.aspect = window.aspect;
    this.report_errors = true;
    this.log = (function(_this) {
      return function(text) {
        return _this.listener.log(text);
      };
    })(this);
    this.update_memory = {};
    this.time_machine = new TimeMachine(this);
  }

  Runtime.prototype.updateSource = function(file, src, reinit) {
    var err, init;
    if (reinit == null) {
      reinit = false;
    }
    if (this.vm == null) {
      return false;
    }
    if (src === this.update_memory[file]) {
      return false;
    }
    this.update_memory[file] = src;
    this.audio.cancelBeeps();
    this.screen.clear();
    try {
      this.vm.run(src, 3000, file);
      this.listener.postMessage({
        name: "compile_success",
        file: file
      });
      this.reportWarnings();
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "init";
        err.file = file;
        this.listener.reportError(err);
        return false;
      }
      if (this.vm.runner.getFunctionSource != null) {
        init = this.vm.runner.getFunctionSource("init");
        if ((init != null) && init !== this.previous_init && reinit) {
          this.previous_init = init;
          this.vm.call("init");
          if (this.vm.error_info != null) {
            err = this.vm.error_info;
            err.type = "init";
            this.listener.reportError(err);
          }
        }
      }
      return true;
    } catch (error) {
      err = error;
      if (this.report_errors) {
        console.error(err);
        err.file = file;
        this.listener.reportError(err);
        return false;
      }
    }
  };

  Runtime.prototype.start = function() {
    var a, i, j, k, key, l, len1, len2, len3, len4, len5, m, n, name, o, ref, ref1, ref2, ref3, ref4, ref5, s, value;
    ref = this.resources.images;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      i = ref[j];
      s = LoadSprite(this.url + "sprites/" + i.file + "?v=" + i.version, i.properties, (function(_this) {
        return function() {
          _this.updateMaps();
          return _this.checkStartReady();
        };
      })(this));
      name = i.file.split(".")[0];
      s.name = name;
      this.sprites[name] = s;
    }
    if (Array.isArray(this.resources.maps)) {
      ref1 = this.resources.maps;
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        m = ref1[k];
        name = m.file.split(".")[0];
        this.maps[name] = new MicroMap(this.url + ("maps/" + m.file + "?v=" + m.version), 0, 0, 0, this.sprites);
        this.maps[name].name = name;
        this.maps[name].loaded = (function(_this) {
          return function() {
            return _this.checkStartReady();
          };
        })(this);
      }
    } else if (this.resources.maps != null) {
      ref2 = this.resources.maps;
      for (key in ref2) {
        value = ref2[key];
        this.updateMap(key, 0, value);
      }
    }
    ref3 = this.resources.sounds;
    for (l = 0, len3 = ref3.length; l < len3; l++) {
      s = ref3[l];
      name = s.file.split(".")[0];
      s = new Sound(this.audio, this.url + "sounds/" + s.file + "?v=" + s.version);
      s.name = name;
      this.sounds[name] = s;
    }
    ref4 = this.resources.music;
    for (n = 0, len4 = ref4.length; n < len4; n++) {
      m = ref4[n];
      name = m.file.split(".")[0];
      m = new Music(this.audio, this.url + "music/" + m.file + "?v=" + m.version);
      m.name = name;
      this.music[name] = m;
    }
    ref5 = this.resources.assets;
    for (o = 0, len5 = ref5.length; o < len5; o++) {
      a = ref5[o];
      name = a.file.split(".")[0];
      name = name.replace(/-/g, "/");
      a.name = name;
      this.assets[name] = a;
    }
  };

  Runtime.prototype.checkStartReady = function() {
    var key, ref, ref1, value;
    if (!this.start_ready) {
      ref = this.sprites;
      for (key in ref) {
        value = ref[key];
        if (!value.ready) {
          return;
        }
      }
      ref1 = this.maps;
      for (key in ref1) {
        value = ref1[key];
        if (!value.ready) {
          return;
        }
      }
      this.start_ready = true;
      return this.startReady();
    }
  };

  Runtime.prototype.startReady = function() {
    var err, file, global, init, j, len1, lib, meta, namespace, ref, ref1, src;
    meta = {
      print: (function(_this) {
        return function(text) {
          if ((typeof text === "object" || typeof text === "function") && (_this.vm != null)) {
            text = _this.vm.runner.toString(text);
          }
          return _this.listener.log(text);
        };
      })(this)
    };
    global = {
      screen: this.screen.getInterface(),
      audio: this.audio.getInterface(),
      keyboard: this.keyboard.keyboard,
      gamepad: this.gamepad.status,
      sprites: this.sprites,
      sounds: this.sounds,
      music: this.music,
      assets: this.assets,
      asset_manager: this.asset_manager.getInterface(),
      maps: this.maps,
      touch: this.touch,
      mouse: this.mouse,
      fonts: window.fonts,
      Sound: Sound.createSoundClass(this.audio),
      Image: msImage,
      Sprite: Sprite
    };
    if (window.graphics === "M3D") {
      global.M3D = M3D;
      M3D.runtime = this;
    } else if (window.graphics === "M2D") {
      global.M2D = M2D;
      M2D.runtime = this;
    } else if (window.graphics === "PIXI") {
      global.PIXI = PIXI;
      PIXI.runtime = this;
    } else if (window.graphics === "BABYLON") {
      global.BABYLON = BABYLON;
      BABYLON.runtime = this;
    }
    ref = window.ms_libs;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      lib = ref[j];
      switch (lib) {
        case "matterjs":
          global.Matter = Matter;
          break;
        case "cannonjs":
          global.CANNON = CANNON;
      }
    }
    namespace = location.pathname;
    this.vm = new MicroVM(meta, global, namespace, location.hash === "#transpiler");
    this.vm.context.global.system.pause = (function(_this) {
      return function() {
        return _this.listener.codePaused();
      };
    })(this);
    this.vm.context.global.system.exit = (function(_this) {
      return function() {
        return _this.exit();
      };
    })(this);
    this.vm.context.global.system.file = System.file;
    System.runtime = this;
    ref1 = this.sources;
    for (file in ref1) {
      src = ref1[file];
      this.updateSource(file, src, false);
    }
    if (this.vm.runner.getFunctionSource != null) {
      init = this.vm.runner.getFunctionSource("init");
      if (init != null) {
        this.previous_init = init;
        this.vm.call("init");
        if (this.vm.error_info != null) {
          err = this.vm.error_info;
          err.type = "draw";
          this.listener.reportError(err);
        }
      }
    } else {
      this.vm.call("init");
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "draw";
        this.listener.reportError(err);
      }
    }
    this.dt = 1000 / 60;
    this.last_time = Date.now();
    this.current_frame = 0;
    this.floating_frame = 0;
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.timer();
      };
    })(this));
    this.screen.startControl();
    return this.listener.postMessage({
      name: "started"
    });
  };

  Runtime.prototype.updateMaps = function() {
    var key, map, ref;
    ref = this.maps;
    for (key in ref) {
      map = ref[key];
      map.needs_update = true;
    }
  };

  Runtime.prototype.runCommand = function(command, callback) {
    var err, res, warnings;
    try {
      warnings = this.vm.context.warnings;
      this.vm.clearWarnings();
      res = this.vm.run(command, void 0, void 0, callback);
      this.reportWarnings();
      this.vm.context.warnings = warnings;
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "exec";
        this.listener.reportError(err);
      }
      if (this.watching_variables) {
        this.watchStep();
      }
      if (callback == null) {
        return res;
      } else if (res != null) {
        callback(res);
      }
      return null;
    } catch (error) {
      err = error;
      return this.listener.reportError(err);
    }
  };

  Runtime.prototype.projectFileUpdated = function(type, file, version, data, properties) {
    switch (type) {
      case "sprites":
        return this.updateSprite(file, version, data, properties);
      case "maps":
        return this.updateMap(file, version, data);
      case "ms":
        return this.updateCode(file, version, data);
    }
  };

  Runtime.prototype.projectFileDeleted = function(type, file) {
    switch (type) {
      case "sprites":
        return delete this.sprites[file.substring(0, file.length - 4)];
      case "maps":
        return delete this.maps[file.substring(0, file.length - 5)];
    }
  };

  Runtime.prototype.projectOptionsUpdated = function(msg) {
    this.orientation = msg.orientation;
    this.aspect = msg.aspect;
    return this.screen.resize();
  };

  Runtime.prototype.updateSprite = function(name, version, data, properties) {
    var img;
    if (data != null) {
      data = "data:image/png;base64," + data;
      if (this.sprites[name] != null) {
        img = new Image;
        img.crossOrigin = "Anonymous";
        img.src = data;
        return img.onload = (function(_this) {
          return function() {
            UpdateSprite(_this.sprites[name], img, properties);
            return _this.updateMaps();
          };
        })(this);
      } else {
        this.sprites[name] = LoadSprite(data, properties, (function(_this) {
          return function() {
            return _this.updateMaps();
          };
        })(this));
        return this.sprites[name].name = name;
      }
    } else {
      if (this.sprites[name] != null) {
        img = new Image;
        img.crossOrigin = "Anonymous";
        img.src = this.url + "sprites/" + name + (".png?v=" + version);
        return img.onload = (function(_this) {
          return function() {
            UpdateSprite(_this.sprites[name], img, properties);
            return _this.updateMaps();
          };
        })(this);
      } else {
        this.sprites[name] = LoadSprite(this.url + "sprites/" + name + (".png?v=" + version), properties, (function(_this) {
          return function() {
            return _this.updateMaps();
          };
        })(this));
        return this.sprites[name].name = name;
      }
    }
  };

  Runtime.prototype.updateMap = function(name, version, data) {
    var m, url;
    if (data != null) {
      m = this.maps[name];
      if (m != null) {
        m.load(data, this.sprites);
        return m.needs_update = true;
      } else {
        m = new MicroMap(1, 1, 1, 1, this.sprites);
        m.load(data, this.sprites);
        this.maps[name] = m;
        return this.maps[name].name = name;
      }
    } else {
      url = this.url + ("maps/" + name + ".json?v=" + version);
      m = this.maps[name];
      if (m != null) {
        return m.loadFile(url);
      } else {
        this.maps[name] = new MicroMap(url, 0, 0, 0, this.sprites);
        return this.maps[name].name = name;
      }
    }
  };

  Runtime.prototype.updateCode = function(name, version, data) {
    var req, url;
    if (data != null) {
      this.sources[name] = data;
      if (this.vm != null) {
        this.vm.clearWarnings();
      }
      return this.updateSource(name, data, true);
    } else {
      url = this.url + ("ms/" + name + ".ms?v=" + version);
      req = new XMLHttpRequest();
      req.onreadystatechange = (function(_this) {
        return function(event) {
          if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
              _this.sources[name] = req.responseText;
              return _this.updateSource(name, _this.sources[name], true);
            }
          }
        };
      })(this);
      req.open("GET", url);
      return req.send();
    }
  };

  Runtime.prototype.stop = function() {
    this.stopped = true;
    return this.audio.cancelBeeps();
  };

  Runtime.prototype.stepForward = function() {
    if (this.stopped) {
      this.updateCall();
      this.drawCall();
      if (this.watching_variables) {
        return this.watchStep();
      }
    }
  };

  Runtime.prototype.resume = function() {
    if (this.stopped) {
      this.stopped = false;
      return requestAnimationFrame((function(_this) {
        return function() {
          return _this.timer();
        };
      })(this));
    }
  };

  Runtime.prototype.timer = function() {
    var ds, dt, fps, i, j, ref, time;
    if (this.stopped) {
      return;
    }
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.timer();
      };
    })(this));
    time = Date.now();
    if (Math.abs(time - this.last_time) > 160) {
      this.last_time = time - 16;
    }
    dt = time - this.last_time;
    this.dt = this.dt * .9 + dt * .1;
    this.last_time = time;
    this.vm.context.global.system.fps = Math.round(fps = 1000 / this.dt);
    this.floating_frame += this.dt * 60 / 1000;
    ds = Math.min(10, Math.round(this.floating_frame - this.current_frame));
    if ((ds === 0 || ds === 2) && Math.abs(fps - 60) < 2) {
      ds = 1;
      this.floating_frame = this.current_frame + 1;
    }
    for (i = j = 1, ref = ds; j <= ref; i = j += 1) {
      this.updateCall();
    }
    this.current_frame += ds;
    this.drawCall();
    if (ds > 0 && this.watching_variables) {
      return this.watchStep();
    }
  };

  Runtime.prototype.updateCall = function() {
    var err;
    this.updateControls();
    try {
      this.vm.call("update");
      this.time_machine.step();
      this.reportWarnings();
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "update";
        return this.listener.reportError(err);
      }
    } catch (error) {
      err = error;
      if (this.report_errors) {
        return this.listener.reportError(err);
      }
    }
  };

  Runtime.prototype.drawCall = function() {
    var err;
    try {
      this.screen.initDraw();
      this.screen.updateInterface();
      this.vm.call("draw");
      this.reportWarnings();
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "draw";
        return this.listener.reportError(err);
      }
    } catch (error) {
      err = error;
      if (this.report_errors) {
        return this.listener.reportError(err);
      }
    }
  };

  Runtime.prototype.reportWarnings = function() {
    var key, ref, ref1, ref2, results, value;
    if (this.vm != null) {
      ref = this.vm.context.warnings.invoking_non_function;
      for (key in ref) {
        value = ref[key];
        if (!value.reported) {
          value.reported = true;
          this.listener.reportError({
            error: "",
            type: "non_function",
            expression: value.expression,
            line: value.line,
            column: value.column,
            file: value.file
          });
        }
      }
      ref1 = this.vm.context.warnings.using_undefined_variable;
      for (key in ref1) {
        value = ref1[key];
        if (!value.reported) {
          value.reported = true;
          this.listener.reportError({
            error: "",
            type: "undefined_variable",
            expression: value.expression,
            line: value.line,
            column: value.column,
            file: value.file
          });
        }
      }
      ref2 = this.vm.context.warnings.assigning_field_to_undefined;
      results = [];
      for (key in ref2) {
        value = ref2[key];
        if (!value.reported) {
          value.reported = true;
          results.push(this.listener.reportError({
            error: "",
            type: "assigning_undefined",
            expression: value.expression,
            line: value.line,
            column: value.column,
            file: value.file
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Runtime.prototype.updateControls = function() {
    var err, j, key, len1, t, touches;
    touches = Object.keys(this.screen.touches);
    this.touch.touching = touches.length > 0 ? 1 : 0;
    this.touch.touches = [];
    for (j = 0, len1 = touches.length; j < len1; j++) {
      key = touches[j];
      t = this.screen.touches[key];
      this.touch.x = t.x;
      this.touch.y = t.y;
      this.touch.touches.push({
        x: t.x,
        y: t.y,
        id: key
      });
    }
    if (this.mouse.pressed && !this.previous_mouse_pressed) {
      this.previous_mouse_pressed = true;
      this.mouse.press = 1;
    } else {
      this.mouse.press = 0;
    }
    if (!this.mouse.pressed && this.previous_mouse_pressed) {
      this.previous_mouse_pressed = false;
      this.mouse.release = 1;
    } else {
      this.mouse.release = 0;
    }
    if (this.touch.touching && !this.previous_touch) {
      this.previous_touch = true;
      this.touch.press = 1;
    } else {
      this.touch.press = 0;
    }
    if (!this.touch.touching && this.previous_touch) {
      this.previous_touch = false;
      this.touch.release = 1;
    } else {
      this.touch.release = 0;
    }
    this.gamepad.update();
    this.keyboard.update();
    try {
      this.vm.context.global.system.inputs.gamepad = this.gamepad.count > 0 ? 1 : 0;
    } catch (error) {
      err = error;
    }
  };

  Runtime.prototype.getAssetURL = function(asset) {
    return this.url + "assets/" + asset + ".glb";
  };

  Runtime.prototype.watch = function(variables) {
    this.watching = true;
    this.watching_variables = variables;
    this.exclusion_list = [this.vm.context.global.screen, this.vm.context.global.system, this.vm.context.global.keyboard, this.vm.context.global.audio, this.vm.context.global.gamepad, this.vm.context.global.touch, this.vm.context.global.mouse, this.vm.context.global.sprites, this.vm.context.global.maps, this.vm.context.global.sounds, this.vm.context.global.music, this.vm.context.global.assets, this.vm.context.global.asset_manager, this.vm.context.global.fonts, this.vm.context.global.storage];
    if (this.vm.context.global.Function != null) {
      this.exclusion_list.push(this.vm.context.global.Function);
    }
    if (this.vm.context.global.String != null) {
      this.exclusion_list.push(this.vm.context.global.String);
    }
    if (this.vm.context.global.List != null) {
      this.exclusion_list.push(this.vm.context.global.List);
    }
    if (this.vm.context.global.Number != null) {
      this.exclusion_list.push(this.vm.context.global.Number);
    }
    if (this.vm.context.global.Object != null) {
      this.exclusion_list.push(this.vm.context.global.Object);
    }
    if (this.vm.context.global.Image != null) {
      this.exclusion_list.push(this.vm.context.global.Image);
    }
    if (this.vm.context.global.Sound != null) {
      this.exclusion_list.push(this.vm.context.global.Sound);
    }
    if (this.vm.context.global.Sprite != null) {
      this.exclusion_list.push(this.vm.context.global.Sprite);
    }
    if (this.vm.context.global.random != null) {
      this.exclusion_list.push(this.vm.context.global.random);
    }
    if (this.vm.context.global.print != null) {
      this.exclusion_list.push(this.vm.context.global.print);
    }
    return this.watchStep();
  };

  Runtime.prototype.stopWatching = function() {
    return this.watching = false;
  };

  Runtime.prototype.watchStep = function(variables) {
    var index, j, len1, res, v, value, vs;
    if (variables == null) {
      variables = this.watching_variables;
    }
    res = {};
    for (j = 0, len1 = variables.length; j < len1; j++) {
      v = variables[j];
      if (v === "global") {
        value = this.vm.context.global;
      } else {
        vs = v.split(".");
        value = this.vm.context.global;
        index = 0;
        while (index < vs.length && (value != null)) {
          value = value[vs[index++]];
        }
      }
      if ((value != null) && this.exclusion_list.indexOf(value) < 0) {
        res[v] = this.exploreValue(value, 1, 10);
      }
    }
    return this.listener.postMessage({
      name: "watch_update",
      data: res
    });
  };

  Runtime.prototype.exploreValue = function(value, depth, array_max) {
    var i, j, key, len1, res, v;
    if (depth == null) {
      depth = 1;
    }
    if (array_max == null) {
      array_max = 10;
    }
    if (value == null) {
      return {
        type: "number",
        value: 0
      };
    }
    if (typeof value === "function" || value instanceof Program.Function || (typeof Routine !== "undefined" && Routine !== null) && value instanceof Routine) {
      return {
        type: "function",
        value: ""
      };
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (depth === 0) {
          return {
            type: "list",
            value: "",
            length: value.length
          };
        }
        res = [];
        for (i = j = 0, len1 = value.length; j < len1; i = ++j) {
          v = value[i];
          if (i >= 100) {
            break;
          }
          if (this.exclusion_list.indexOf(v) < 0) {
            res[i] = this.exploreValue(v, depth - 1, array_max);
          }
        }
        return res;
      } else {
        if (depth === 0) {
          v = "";
          if (value.classname) {
            v = "class " + value.classname;
          }
          if ((value["class"] != null) && (value["class"].classname != null)) {
            v = value["class"].classname;
          }
          return {
            type: "object",
            value: v
          };
        }
        res = {};
        for (key in value) {
          v = value[key];
          if (this.exclusion_list.indexOf(v) < 0) {
            res[key] = this.exploreValue(v, depth - 1, array_max);
          }
        }
        return res;
      }
    } else if (typeof value === "string") {
      return {
        type: "string",
        value: value.length < 43 ? value : value.substring(0, 40) + "..."
      };
    } else if (typeof value === "number") {
      return {
        type: "number",
        value: isFinite(value) ? value : 0
      };
    } else if (typeof value === "boolean") {
      return {
        type: "number",
        value: value ? 1 : 0
      };
    } else {
      return {
        type: "unknown",
        value: value
      };
    }
  };

  Runtime.prototype.exit = function() {
    var err;
    this.stop();
    if (this.screen.clear != null) {
      setTimeout(((function(_this) {
        return function() {
          return _this.screen.clear();
        };
      })(this)), 1);
    }
    try {
      this.listener.exit();
    } catch (error) {
      err = error;
    }
    try {
      if ((navigator.app != null) && (navigator.app.exitApp != null)) {
        navigator.app.exitApp();
      }
    } catch (error) {
      err = error;
    }
    try {
      return window.close();
    } catch (error) {
      err = error;
    }
  };

  return Runtime;

})();

saveFile = function(data, name, type) {
  var a, blob, url;
  a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  blob = new Blob([data], {
    type: type
  });
  url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
  return window.URL.revokeObjectURL(url);
};

loadWaveFileLib = function(callback) {
  var s;
  if (typeof wavefile !== "undefined" && wavefile !== null) {
    return callback();
  } else {
    s = document.createElement("script");
    s.src = location.origin + "/lib/wavefile/wavefile.js";
    document.head.appendChild(s);
    return s.onload = function() {
      return callback();
    };
  }
};

writeProjectFile = function(name, data, thumb) {
  return window.player.postMessage({
    name: "write_project_file",
    filename: name,
    content: data,
    thumbnail: thumb
  });
};

arrayBufferToBase64 = function(buffer) {
  var binary, bytes, i, j, len, ref;
  binary = '';
  bytes = new Uint8Array(buffer);
  len = bytes.byteLength;
  for (i = j = 0, ref = len - 1; j <= ref; i = j += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

this.System = {
  project: {
    writeFile: function(obj, name, thumbnail, format, options) {
      if (obj instanceof MicroSound) {
        return loadWaveFileLib(function() {
          var buffer, ch, ch1, ch2, encoded, i, j, k, ref, ref1, wav;
          wav = new wavefile.WaveFile;
          ch1 = [];
          for (i = j = 0, ref = obj.length - 1; j <= ref; i = j += 1) {
            ch1[i] = Math.round(Math.min(1, Math.max(-1, obj.read(0, i))) * 32767);
          }
          if (obj.channels === 2) {
            ch2 = [];
            for (i = k = 0, ref1 = obj.length - 1; k <= ref1; i = k += 1) {
              ch2[i] = Math.round(Math.min(1, Math.max(-1, obj.read(1, i))) * 32767);
            }
            ch = [ch1, ch2];
          } else {
            ch = [ch1];
          }
          wav.fromScratch(ch.length, obj.sampleRate, '16', ch);
          buffer = wav.toBuffer();
          encoded = arrayBufferToBase64(buffer);
          if (typeof name !== "string") {
            name = "sounds/sound";
          }
          if (!name.startsWith("sounds/")) {
            name = "sounds/" + name;
          }
          if (thumbnail instanceof msImage) {
            return writeProjectFile(name, encoded, thumbnail.canvas.toDataURL().split(",")[1]);
          } else {
            return writeProjectFile(name, encoded);
          }
        });
      } else if (obj instanceof msImage) {
        if (typeof name !== "string") {
          name = "sprites/sprite";
        }
        if (!name.startsWith("sprites/")) {
          name = "sprites/" + name;
        }
        return writeProjectFile(name, obj.canvas.toDataURL().split(",")[1]);
      }
    }
  },
  file: {
    save: function(obj, name, format, options) {
      var a, c;
      if (obj instanceof MicroSound) {
        return loadWaveFileLib(function() {
          var buffer, ch, ch1, ch2, i, j, k, ref, ref1, wav;
          wav = new wavefile.WaveFile;
          ch1 = [];
          for (i = j = 0, ref = obj.length - 1; j <= ref; i = j += 1) {
            ch1[i] = Math.round(Math.min(1, Math.max(-1, obj.read(0, i))) * 32767);
          }
          if (obj.channels === 2) {
            ch2 = [];
            for (i = k = 0, ref1 = obj.length - 1; k <= ref1; i = k += 1) {
              ch2[i] = Math.round(Math.min(1, Math.max(-1, obj.read(1, i))) * 32767);
            }
            ch = [ch1, ch2];
          } else {
            ch = [ch1];
          }
          wav.fromScratch(ch.length, obj.sampleRate, '16', ch);
          buffer = wav.toBuffer();
          if (typeof name !== "string") {
            name = "sound.wav";
          } else if (!name.endsWith(".wav")) {
            name += ".wav";
          }
          return saveFile(buffer, name, "octet/stream");
        });
      } else if (obj instanceof msImage) {
        c = obj.canvas;
        if (typeof name !== "string") {
          name = "image";
        }
        format = typeof format === "string" && format.toLowerCase() === "jpg" ? "jpg" : "png";
        if (!name.endsWith("." + format)) {
          name += "." + format;
        }
        a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return c.toBlob(((function(_this) {
          return function(blob) {
            var url;
            url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            return window.URL.revokeObjectURL(url);
          };
        })(this)), (format === "png" ? "image/png" : "image/jpeg"), options);
      } else if (typeof obj === "object") {
        obj = System.runtime.vm.storableObject(obj);
        obj = JSON.stringify(obj, null, 2);
        if (typeof name !== "string") {
          name = "data";
        }
        if (!name.endsWith(".json")) {
          name += ".json";
        }
        return saveFile(obj, name, "text/json");
      }
    }
  }
};

this.TimeMachine = (function() {
  function TimeMachine(runtime) {
    this.runtime = runtime;
    this.history = [];
    this.record_index = 0;
    this.replay_position = 0;
    this.recording = false;
    this.max_length = 60 * 30;
    this.record_length = 0;
    this.loop_length = 60 * 4;
  }

  TimeMachine.prototype.step = function() {
    var end, err, histo, i, index, j, ref, ref1, start;
    if (this.recording) {
      try {
        if (this.replay_position !== 0) {
          histo = [];
          start = this.record_length;
          end = this.replay_position + 1;
          for (i = j = ref = start, ref1 = end; j >= ref1; i = j += -1) {
            index = (this.record_index - i + this.max_length) % this.max_length;
            histo.push(this.history[index]);
          }
          if (this.looping) {
            this.loop_start = this.loop_length;
          }
          this.history = histo;
          this.record_index = this.history.length;
          this.record_length = this.history.length;
          this.replay_position = 0;
        }
        this.history[this.record_index++] = this.storableHistory(this.runtime.vm.context.global);
        this.record_length = Math.min(this.record_length + 1, this.max_length);
        if (this.record_index >= this.max_length) {
          this.record_index = 0;
        }
        return this.sendStatus();
      } catch (error) {
        err = error;
        return console.error(err);
      }
    }
  };

  TimeMachine.prototype.messageReceived = function(data) {
    var pos;
    switch (data.command) {
      case "start_recording":
        if (!this.recording) {
          this.recording = true;
          this.record_index = 0;
          this.replay_position = 0;
          this.record_length = 0;
          this.history = [];
          return this.sendStatus();
        }
        break;
      case "stop_recording":
        if (this.recording) {
          this.recording = false;
          return this.sendStatus();
        }
        break;
      case "step_backward":
        return this.stepBackward();
      case "step_forward":
        return this.stepForward();
      case "replay_position":
        pos = Math.round(data.position);
        this.replay_position = Math.max(2, Math.min(this.record_length - 1, pos));
        if (this.looping) {
          this.loop_start = this.replay_position;
          this.loop_index = 0;
        }
        this.replay();
        return this.sendStatus();
      case "start_looping":
        if (this.record_length === 0) {
          return;
        }
        this.looping = true;
        this.recording = false;
        this.loop_start = Math.max(this.replay_position, 1);
        this.loop_index = 0;
        return this.loop();
      case "stop_looping":
        return this.stopLooping();
    }
  };

  TimeMachine.prototype.stopLooping = function() {
    if (this.looping) {
      this.looping = false;
      this.replay_position = this.loop_start;
      return this.sendStatus();
    }
  };

  TimeMachine.prototype.loop = function() {
    if (!this.looping) {
      return;
    }
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.loop();
      };
    })(this));
    if (this.loop_index === 0) {
      this.replay_position = this.loop_start;
      this.replay(true);
      this.loop_index += 1;
    } else {
      this.loop_index += 1;
      if (this.loop_index > this.loop_length) {
        this.loop_index = 0;
      }
      this.replay_position = this.loop_start - this.loop_index;
      this.replayControls();
      this.runtime.updateCall();
      this.runtime.drawCall();
      if (this.runtime.watching_variables) {
        this.runtime.watchStep();
      }
      this.resetControls();
    }
    return this.sendStatus();
  };

  TimeMachine.prototype.stepBackward = function() {
    if (this.replay_position + 1 >= this.record_length) {
      return;
    }
    this.stopLooping();
    this.replay_position += 1;
    this.replay();
    return this.sendStatus();
  };

  TimeMachine.prototype.stepForward = function() {
    if (this.replay_position <= 1) {
      return;
    }
    this.stopLooping();
    this.replay_position--;
    this.replay();
    return this.sendStatus();
  };

  TimeMachine.prototype.replayControls = function() {
    var index;
    if (this.replay_position >= this.record_length) {
      return;
    }
    if (this.replay_position <= 0) {
      return;
    }
    index = (this.record_index - this.replay_position + this.max_length) % this.max_length;
    this.copyGlobal(this.history[index].keyboard, this.runtime.vm.context.global.keyboard);
    this.copyGlobal(this.history[index].gamepad, this.runtime.vm.context.global.gamepad);
    this.copyGlobal(this.history[index].touch, this.runtime.vm.context.global.touch);
    return this.copyGlobal(this.history[index].mouse, this.runtime.vm.context.global.mouse);
  };

  TimeMachine.prototype.resetControls = function() {
    var mouse, touch;
    this.runtime.keyboard.reset();
    touch = this.runtime.vm.context.global.touch;
    touch.touching = 0;
    touch.touches = [];
    mouse = this.runtime.vm.context.global.mouse;
    mouse.pressed = 0;
    mouse.left = 0;
    mouse.right = 0;
    return mouse.middle = 0;
  };

  TimeMachine.prototype.replay = function(clone) {
    var index;
    if (clone == null) {
      clone = false;
    }
    index = (this.record_index - this.replay_position + this.max_length) % this.max_length;
    this.copyGlobal((clone ? this.storableHistory(this.history[index]) : this.history[index]), this.runtime.vm.context.global);
    this.runtime.vm.call("draw");
    if (this.runtime.watching_variables) {
      return this.runtime.watchStep();
    }
  };

  TimeMachine.prototype.copyGlobal = function(source, dest) {
    var key, value;
    for (key in source) {
      value = source[key];
      if (key === "keyboard" || key === "gamepad" || key === "touch" || key === "mouse") {
        continue;
      }
      if (!(value instanceof Program.Function) && typeof value !== "function" && (value.classname == null)) {
        dest[key] = value;
      }
    }
    for (key in dest) {
      if (source[key] == null) {
        delete dest[key];
      }
    }
  };

  TimeMachine.prototype.sendStatus = function() {
    return this.runtime.listener.postMessage({
      name: "time_machine",
      command: "status",
      length: this.record_length,
      head: this.record_length - this.replay_position,
      max: this.max_length
    });
  };

  TimeMachine.prototype.storableHistory = function(value) {
    var clones, global, refs;
    global = this.runtime.vm.context.global;
    this.excluded = [global.screen, global.system, global.audio, global.sprites, global.maps, global.sounds, global.music, global.assets, global.asset_manager, global.fonts, global.storage, window];
    if (global.PIXI != null) {
      this.excluded.push(global.PIXI);
    }
    if (global.BABYLON != null) {
      this.excluded.push(global.BABYLON);
    }
    if (global.M2D != null) {
      this.excluded.push(global.M2D);
    }
    if (global.M3D != null) {
      this.excluded.push(global.M3D);
    }
    if (global.Matter != null) {
      this.excluded.push(global.Matter);
    }
    if (global.CANNON != null) {
      this.excluded.push(global.CANNON);
    }
    if (global.Object != null) {
      this.excluded.push(global.Object);
    }
    if (global.List != null) {
      this.excluded.push(global.List);
    }
    if (global.String != null) {
      this.excluded.push(global.String);
    }
    if (global.Number != null) {
      this.excluded.push(global.Number);
    }
    if (global.Function != null) {
      this.excluded.push(global.Function);
    }
    if (global.random != null) {
      this.excluded.push(global.random);
    }
    refs = [];
    clones = [];
    return this.makeStorableObject(value, refs, clones);
  };

  TimeMachine.prototype.makeStorableObject = function(value, refs, clones) {
    var i, index, j, key, len, res, v;
    if (value == null) {
      return value;
    }
    if (typeof value === "function" || value instanceof Program.Function || (typeof Routine !== "undefined" && Routine !== null) && value instanceof Routine) {
      return value;
    } else if (typeof value === "object") {
      if (this.excluded.indexOf(value) >= 0) {
        return value;
      }
      if (value instanceof Sprite || value instanceof MicroMap || value instanceof msImage || value instanceof MicroSound) {
        return value;
      }
      if (value.classname != null) {
        return value;
      }
      index = refs.indexOf(value);
      if (index >= 0) {
        return clones[index];
      }
      if (Array.isArray(value)) {
        res = [];
        refs.push(value);
        clones.push(res);
        for (i = j = 0, len = value.length; j < len; i = ++j) {
          v = value[i];
          v = this.makeStorableObject(v, refs, clones);
          if (v != null) {
            res[i] = v;
          }
        }
        return res;
      } else {
        res = {};
        refs.push(value);
        clones.push(res);
        for (key in value) {
          v = value[key];
          v = this.makeStorableObject(v, refs, clones);
          if (v != null) {
            res[key] = v;
          }
        }
        return res;
      }
    } else {
      return value;
    }
  };

  return TimeMachine;

})();

this.Screen = (function() {
  function Screen(runtime) {
    this.runtime = runtime;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1080;
    this.canvas.height = 1920;
    this.touches = {};
    this.mouse = {
      x: -10000,
      y: -10000,
      pressed: 0,
      left: 0,
      middle: 0,
      right: 0
    };
    this.translation_x = 0;
    this.translation_y = 0;
    this.rotation = 0;
    this.scale_x = 1;
    this.scale_y = 1;
    this.screen_transform = false;
    this.anchor_x = 0;
    this.anchor_y = 0;
    this.supersampling = this.previous_supersampling = 1;
    this.font = "BitCell";
    this.font_load_requested = {};
    this.font_loaded = {};
    this.loadFont(this.font);
    this.initContext();
    this.cursor = "default";
    this.canvas.addEventListener("mousemove", (function(_this) {
      return function() {
        _this.last_mouse_move = Date.now();
        if (_this.cursor !== "default" && _this.cursor_visibility === "auto") {
          _this.cursor = "default";
          return _this.canvas.style.cursor = "default";
        }
      };
    })(this));
    setInterval(((function(_this) {
      return function() {
        return _this.checkMouseCursor();
      };
    })(this)), 1000);
    this.cursor_visibility = "auto";
  }

  Screen.prototype.checkMouseCursor = function() {
    if (Date.now() > this.last_mouse_move + 4000 && this.cursor_visibility === "auto") {
      if (this.cursor !== "none") {
        this.cursor = "none";
        return this.canvas.style.cursor = "none";
      }
    }
  };

  Screen.prototype.setCursorVisible = function(visible) {
    this.cursor_visibility = visible;
    if (visible) {
      this.cursor = "default";
      return this.canvas.style.cursor = "default";
    } else {
      this.cursor = "none";
      return this.canvas.style.cursor = "none";
    }
  };

  Screen.prototype.initContext = function() {
    var b, c, j, len1, ratio, ref;
    c = this.canvas.getContext("2d", {
      alpha: false
    });
    if (c !== this.context) {
      this.context = c;
    } else {
      this.context.restore();
    }
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    ratio = Math.min(this.canvas.width / 200, this.canvas.height / 200);
    this.context.scale(ratio, ratio);
    this.width = this.canvas.width / ratio;
    this.height = this.canvas.height / ratio;
    this.alpha = 1;
    this.pixelated = 1;
    this.line_width = 1;
    this.object_rotation = 0;
    this.object_scale_x = 1;
    this.object_scale_y = 1;
    this.context.lineCap = "round";
    this.blending = {
      normal: "source-over",
      additive: "lighter"
    };
    ref = ["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      b = ref[j];
      this.blending[b] = b;
    }
  };

  Screen.prototype.getInterface = function() {
    var screen;
    if (this["interface"] != null) {
      return this["interface"];
    }
    screen = this;
    return this["interface"] = {
      width: this.width,
      height: this.height,
      clear: function(color) {
        return screen.clear(color);
      },
      setColor: function(color) {
        return screen.setColor(color);
      },
      setAlpha: function(alpha) {
        return screen.setAlpha(alpha);
      },
      setPixelated: function(pixelated) {
        return screen.setPixelated(pixelated);
      },
      setBlending: function(blending) {
        return screen.setBlending(blending);
      },
      setLinearGradient: function(x1, y1, x2, y2, c1, c2) {
        return screen.setLinearGradient(x1, y1, x2, y2, c1, c2);
      },
      setRadialGradient: function(x, y, radius, c1, c2) {
        return screen.setRadialGradient(x, y, radius, c1, c2);
      },
      setFont: function(font) {
        return screen.setFont(font);
      },
      setTranslation: function(tx, ty) {
        return screen.setTranslation(tx, ty);
      },
      setScale: function(x, y) {
        return screen.setScale(x, y);
      },
      setRotation: function(rotation) {
        return screen.setRotation(rotation);
      },
      setDrawAnchor: function(ax, ay) {
        return screen.setDrawAnchor(ax, ay);
      },
      setDrawRotation: function(rotation) {
        return screen.setDrawRotation(rotation);
      },
      setDrawScale: function(x, y) {
        return screen.setDrawScale(x, y);
      },
      fillRect: function(x, y, w, h, c) {
        return screen.fillRect(x, y, w, h, c);
      },
      fillRoundRect: function(x, y, w, h, r, c) {
        return screen.fillRoundRect(x, y, w, h, r, c);
      },
      fillRound: function(x, y, w, h, c) {
        return screen.fillRound(x, y, w, h, c);
      },
      drawRect: function(x, y, w, h, c) {
        return screen.drawRect(x, y, w, h, c);
      },
      drawRoundRect: function(x, y, w, h, r, c) {
        return screen.drawRoundRect(x, y, w, h, r, c);
      },
      drawRound: function(x, y, w, h, c) {
        return screen.drawRound(x, y, w, h, c);
      },
      drawSprite: function(sprite, x, y, w, h) {
        return screen.drawSprite(sprite, x, y, w, h);
      },
      drawImage: function(sprite, x, y, w, h) {
        return screen.drawSprite(sprite, x, y, w, h);
      },
      drawSpritePart: function(sprite, sx, sy, sw, sh, x, y, w, h) {
        return screen.drawSpritePart(sprite, sx, sy, sw, sh, x, y, w, h);
      },
      drawImagePart: function(sprite, sx, sy, sw, sh, x, y, w, h) {
        return screen.drawSpritePart(sprite, sx, sy, sw, sh, x, y, w, h);
      },
      drawMap: function(map, x, y, w, h) {
        return screen.drawMap(map, x, y, w, h);
      },
      drawText: function(text, x, y, size, color) {
        return screen.drawText(text, x, y, size, color);
      },
      drawTextOutline: function(text, x, y, size, color) {
        return screen.drawTextOutline(text, x, y, size, color);
      },
      textWidth: function(text, size) {
        return screen.textWidth(text, size);
      },
      setLineWidth: function(width) {
        return screen.setLineWidth(width);
      },
      setLineDash: function(dash) {
        return screen.setLineDash(dash);
      },
      drawLine: function(x1, y1, x2, y2, color) {
        return screen.drawLine(x1, y1, x2, y2, color);
      },
      drawPolygon: function() {
        return screen.drawPolygon(arguments);
      },
      drawPolyline: function() {
        return screen.drawPolyline(arguments);
      },
      fillPolygon: function() {
        return screen.fillPolygon(arguments);
      },
      setCursorVisible: function(visible) {
        return screen.setCursorVisible(visible);
      },
      loadFont: function(font) {
        return screen.loadFont(font);
      },
      isFontReady: function(font) {
        return screen.isFontReady(font);
      }
    };
  };

  Screen.prototype.updateInterface = function() {
    this["interface"].width = this.width;
    return this["interface"].height = this.height;
  };

  Screen.prototype.clear = function(color) {
    var blending_save, c, s;
    c = this.context.fillStyle;
    s = this.context.strokeStyle;
    blending_save = this.context.globalCompositeOperation;
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = "source-over";
    if (color != null) {
      this.setColor(color);
    } else {
      this.context.fillStyle = "#000";
    }
    this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.context.fillStyle = c;
    this.context.strokeStyle = s;
    return this.context.globalCompositeOperation = blending_save;
  };

  Screen.prototype.initDraw = function() {
    this.alpha = 1;
    this.line_width = 1;
    if (this.supersampling !== this.previous_supersampling) {
      this.resize();
      return this.previous_supersampling = this.supersampling;
    }
  };

  Screen.prototype.setColor = function(color) {
    var b, c, g, r;
    if (color == null) {
      return;
    }
    if (!Number.isNaN(Number.parseInt(color))) {
      r = (Math.floor(color / 100) % 10) / 9 * 255;
      g = (Math.floor(color / 10) % 10) / 9 * 255;
      b = (Math.floor(color) % 10) / 9 * 255;
      c = 0xFF000000;
      c += r << 16;
      c += g << 8;
      c += b;
      c = "#" + c.toString(16).substring(2, 8);
      this.context.fillStyle = c;
      return this.context.strokeStyle = c;
    } else if (typeof color === "string") {
      this.context.fillStyle = color;
      return this.context.strokeStyle = color;
    }
  };

  Screen.prototype.setAlpha = function(alpha1) {
    this.alpha = alpha1;
  };

  Screen.prototype.setPixelated = function(pixelated1) {
    this.pixelated = pixelated1;
  };

  Screen.prototype.setBlending = function(blending) {
    blending = this.blending[blending || "normal"] || "source-over";
    return this.context.globalCompositeOperation = blending;
  };

  Screen.prototype.setLineWidth = function(line_width) {
    this.line_width = line_width;
  };

  Screen.prototype.setLineDash = function(dash) {
    if (!Array.isArray(dash)) {
      return this.context.setLineDash([]);
    } else {
      return this.context.setLineDash(dash);
    }
  };

  Screen.prototype.setLinearGradient = function(x1, y1, x2, y2, c1, c2) {
    var grd;
    grd = this.context.createLinearGradient(x1, -y1, x2, -y2);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.context.fillStyle = grd;
    return this.context.strokeStyle = grd;
  };

  Screen.prototype.setRadialGradient = function(x, y, radius, c1, c2) {
    var grd;
    grd = this.context.createRadialGradient(x, -y, 0, x, -y, radius);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.context.fillStyle = grd;
    return this.context.strokeStyle = grd;
  };

  Screen.prototype.setFont = function(font) {
    this.font = font || "Verdana";
    return this.loadFont(this.font);
  };

  Screen.prototype.loadFont = function(font) {
    var err;
    if (font == null) {
      font = "BitCell";
    }
    if (!this.font_load_requested[font]) {
      this.font_load_requested[font] = true;
      try {
        if ((document.fonts != null) && (document.fonts.load != null)) {
          document.fonts.load("16pt " + font);
        }
      } catch (error) {
        err = error;
      }
    }
    return 1;
  };

  Screen.prototype.isFontReady = function(font) {
    var err, res;
    if (font == null) {
      font = this.font;
    }
    if (this.font_loaded[font]) {
      return 1;
    }
    try {
      if ((document.fonts != null) && (document.fonts.check != null)) {
        res = document.fonts.check("16pt " + font);
        if (res) {
          this.font_loaded[font] = res;
        }
        if (res) {
          return 1;
        } else {
          return 0;
        }
      }
    } catch (error) {
      err = error;
    }
    return 1;
  };

  Screen.prototype.setTranslation = function(translation_x, translation_y) {
    this.translation_x = translation_x;
    this.translation_y = translation_y;
    if (!isFinite(this.translation_x)) {
      this.translation_x = 0;
    }
    if (!isFinite(this.translation_y)) {
      this.translation_y = 0;
    }
    return this.updateScreenTransform();
  };

  Screen.prototype.setScale = function(scale_x, scale_y) {
    this.scale_x = scale_x;
    this.scale_y = scale_y;
    if (!isFinite(this.scale_x) || this.scale_x === 0) {
      this.scale_x = 1;
    }
    if (!isFinite(this.scale_y) || this.scale_y === 0) {
      this.scale_y = 1;
    }
    return this.updateScreenTransform();
  };

  Screen.prototype.setRotation = function(rotation1) {
    this.rotation = rotation1;
    if (!isFinite(this.rotation)) {
      this.rotation = 0;
    }
    return this.updateScreenTransform();
  };

  Screen.prototype.updateScreenTransform = function() {
    return this.screen_transform = this.translation_x !== 0 || this.translation_y !== 0 || this.scale_x !== 1 || this.scale_y !== 1 || this.rotation !== 0;
  };

  Screen.prototype.setDrawAnchor = function(anchor_x, anchor_y) {
    this.anchor_x = anchor_x;
    this.anchor_y = anchor_y;
    if (typeof this.anchor_x !== "number") {
      this.anchor_x = 0;
    }
    if (typeof this.anchor_y !== "number") {
      return this.anchor_y = 0;
    }
  };

  Screen.prototype.setDrawRotation = function(object_rotation) {
    this.object_rotation = object_rotation;
  };

  Screen.prototype.setDrawScale = function(object_scale_x, object_scale_y) {
    this.object_scale_x = object_scale_x;
    this.object_scale_y = object_scale_y != null ? object_scale_y : this.object_scale_x;
  };

  Screen.prototype.initDrawOp = function(x, y) {
    var res;
    res = false;
    if (this.screen_transform) {
      this.context.save();
      res = true;
      this.context.translate(this.translation_x, -this.translation_y);
      this.context.scale(this.scale_x, this.scale_y);
      this.context.rotate(-this.rotation / 180 * Math.PI);
      this.context.translate(x, y);
    }
    if (this.object_rotation !== 0 || this.object_scale_x !== 1 || this.object_scale_y !== 1) {
      if (!res) {
        this.context.save();
        res = true;
        this.context.translate(x, y);
      }
      if (this.object_rotation !== 0) {
        this.context.rotate(-this.object_rotation / 180 * Math.PI);
      }
      if (this.object_scale_x !== 1 || this.object_scale_y !== 1) {
        this.context.scale(this.object_scale_x, this.object_scale_y);
      }
    }
    return res;
  };

  Screen.prototype.closeDrawOp = function(x, y) {
    return this.context.restore();
  };

  Screen.prototype.fillRect = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    if (this.initDrawOp(x, -y)) {
      this.context.fillRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.fillRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.fillRoundRect = function(x, y, w, h, round, color) {
    if (round == null) {
      round = 10;
    }
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    if (this.initDrawOp(x, -y)) {
      this.context.fillRoundRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h, round);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.fillRoundRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h, round);
    }
  };

  Screen.prototype.fillRound = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    w = Math.abs(w);
    h = Math.abs(h);
    if (this.initDrawOp(x, -y)) {
      this.context.beginPath();
      this.context.ellipse(-this.anchor_x * w / 2, 0 + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      this.context.fill();
      return this.closeDrawOp(x, -y);
    } else {
      this.context.beginPath();
      this.context.ellipse(x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      return this.context.fill();
    }
  };

  Screen.prototype.drawRect = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (this.initDrawOp(x, -y)) {
      this.context.strokeRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.strokeRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.drawRoundRect = function(x, y, w, h, round, color) {
    if (round == null) {
      round = 10;
    }
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (this.initDrawOp(x, -y)) {
      this.context.strokeRoundRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h, round);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.strokeRoundRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h, round);
    }
  };

  Screen.prototype.drawRound = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    w = Math.abs(w);
    h = Math.abs(h);
    if (this.initDrawOp(x, -y)) {
      this.context.beginPath();
      this.context.ellipse(0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      this.context.stroke();
      return this.closeDrawOp(x, -y);
    } else {
      this.context.beginPath();
      this.context.ellipse(x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      return this.context.stroke();
    }
  };

  Screen.prototype.drawLine = function(x1, y1, x2, y2, color) {
    var transform;
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(x1, -y1);
    this.context.lineTo(x2, -y2);
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.drawPolyline = function(args) {
    var i, j, len, ref, transform;
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], -args[i * 2 + 1]);
    }
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.drawPolygon = function(args) {
    var i, j, len, ref, transform;
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], -args[i * 2 + 1]);
    }
    this.context.closePath();
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.fillPolygon = function(args) {
    var i, j, len, ref, transform;
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], -args[i * 2 + 1]);
    }
    this.context.fill();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.textWidth = function(text, size) {
    this.context.font = size + "pt " + this.font;
    return this.context.measureText(text).width;
  };

  Screen.prototype.drawText = function(text, x, y, size, color) {
    var h, w;
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.font = size + "pt " + this.font;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    w = this.context.measureText(text).width;
    h = size;
    if (this.initDrawOp(x, -y)) {
      this.context.fillText(text, 0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.fillText(text, x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2);
    }
  };

  Screen.prototype.drawTextOutline = function(text, x, y, size, color) {
    var h, w;
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.font = size + "pt " + this.font;
    this.context.lineWidth = this.line_width;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    w = this.context.measureText(text).width;
    h = size;
    if (this.initDrawOp(x, -y)) {
      this.context.strokeText(text, 0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.strokeText(text, x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2);
    }
  };

  Screen.prototype.getSpriteFrame = function(sprite) {
    var dt, frame, s;
    frame = null;
    if (typeof sprite === "string") {
      s = this.runtime.sprites[sprite];
      if (s != null) {
        sprite = s;
      } else {
        s = sprite.split(".");
        if (s.length > 1) {
          sprite = this.runtime.sprites[s[0]];
          frame = s[1] | 0;
        }
      }
    } else if (sprite instanceof msImage) {
      return sprite.canvas || sprite.image;
    }
    if ((sprite == null) || !sprite.ready) {
      return null;
    }
    if (sprite.frames.length > 1) {
      if (frame == null) {
        dt = 1000 / sprite.fps;
        frame = Math.floor((Date.now() - sprite.animation_start) / dt) % sprite.frames.length;
      }
      if (frame >= 0 && frame < sprite.frames.length) {
        return sprite.frames[frame].canvas;
      } else {
        return sprite.frames[0].canvas;
      }
    } else if (sprite.frames[0] != null) {
      return sprite.frames[0].canvas;
    } else {
      return null;
    }
  };

  Screen.prototype.drawSprite = function(sprite, x, y, w, h) {
    var canvas;
    canvas = this.getSpriteFrame(sprite);
    if (canvas == null) {
      return;
    }
    if (!h) {
      h = w / canvas.width * canvas.height;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = !this.pixelated;
    if (this.initDrawOp(x, -y)) {
      this.context.drawImage(canvas, -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.drawImage(canvas, x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.drawSpritePart = function(sprite, sx, sy, sw, sh, x, y, w, h) {
    var canvas;
    canvas = this.getSpriteFrame(sprite);
    if (canvas == null) {
      return;
    }
    if (!h) {
      h = w / sw * sh;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = !this.pixelated;
    if (this.initDrawOp(x, -y)) {
      this.context.drawImage(canvas, sx, sy, sw, sh, -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.drawImage(canvas, sx, sy, sw, sh, x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.drawMap = function(map, x, y, w, h) {
    if (typeof map === "string") {
      map = this.runtime.maps[map];
    }
    if ((map == null) || !map.ready || (map.canvas == null)) {
      return;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = !this.pixelated;
    if (this.initDrawOp(x, -y)) {
      this.context.drawImage(map.getCanvas(), -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.drawImage(map.getCanvas(), x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.resize = function() {
    var backingStoreRatio, ch, cw, devicePixelRatio, h, min, r, ratio, w;
    cw = window.innerWidth;
    ch = window.innerHeight;
    ratio = {
      "4x3": 4 / 3,
      "16x9": 16 / 9,
      "2x1": 2 / 1,
      "1x1": 1 / 1,
      ">4x3": 4 / 3,
      ">16x9": 16 / 9,
      ">2x1": 2 / 1,
      ">1x1": 1 / 1
    }[this.runtime.aspect];
    min = this.runtime.aspect.startsWith(">");
    if (ratio != null) {
      if (min) {
        switch (this.runtime.orientation) {
          case "portrait":
            ratio = Math.max(ratio, ch / cw);
            break;
          case "landscape":
            ratio = Math.max(ratio, cw / ch);
            break;
          default:
            if (ch > cw) {
              ratio = Math.max(ratio, ch / cw);
            } else {
              ratio = Math.max(ratio, cw / ch);
            }
        }
      }
      switch (this.runtime.orientation) {
        case "portrait":
          r = Math.min(cw, ch / ratio) / cw;
          w = cw * r;
          h = cw * r * ratio;
          break;
        case "landscape":
          r = Math.min(cw / ratio, ch) / ch;
          w = ch * r * ratio;
          h = ch * r;
          break;
        default:
          if (cw > ch) {
            r = Math.min(cw / ratio, ch) / ch;
            w = ch * r * ratio;
            h = ch * r;
          } else {
            r = Math.min(cw, ch / ratio) / cw;
            w = cw * r;
            h = cw * r * ratio;
          }
      }
    } else {
      w = cw;
      h = ch;
    }
    this.canvas.style["margin-top"] = Math.round((ch - h) / 2) + "px";
    this.canvas.style.width = Math.round(w) + "px";
    this.canvas.style.height = Math.round(h) + "px";
    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = this.context.webkitBackingStorePixelRatio || this.context.mozBackingStorePixelRatio || this.context.msBackingStorePixelRatio || this.context.oBackingStorePixelRatio || this.context.backingStorePixelRatio || 1;
    this.ratio = devicePixelRatio / backingStoreRatio * Math.max(1, Math.min(2, this.supersampling));
    this.width = w * this.ratio;
    this.height = h * this.ratio;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    return this.initContext();
  };

  Screen.prototype.startControl = function(element) {
    var backingStoreRatio, devicePixelRatio;
    this.element = element;
    document.addEventListener("touchstart", (function(_this) {
      return function(event) {
        return _this.touchStart(event);
      };
    })(this));
    document.addEventListener("touchmove", (function(_this) {
      return function(event) {
        return _this.touchMove(event);
      };
    })(this));
    document.addEventListener("touchend", (function(_this) {
      return function(event) {
        return _this.touchRelease(event);
      };
    })(this));
    document.addEventListener("touchcancel", (function(_this) {
      return function(event) {
        return _this.touchRelease(event);
      };
    })(this));
    document.addEventListener("mousedown", (function(_this) {
      return function(event) {
        return _this.mouseDown(event);
      };
    })(this));
    document.addEventListener("mousemove", (function(_this) {
      return function(event) {
        return _this.mouseMove(event);
      };
    })(this));
    document.addEventListener("mouseup", (function(_this) {
      return function(event) {
        return _this.mouseUp(event);
      };
    })(this));
    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = this.context.webkitBackingStorePixelRatio || this.context.mozBackingStorePixelRatio || this.context.msBackingStorePixelRatio || this.context.oBackingStorePixelRatio || this.context.backingStorePixelRatio || 1;
    return this.ratio = devicePixelRatio / backingStoreRatio;
  };

  Screen.prototype.touchStart = function(event) {
    var b, i, j, min, ref, t, x, y;
    event.preventDefault();
    event.stopPropagation();
    b = this.canvas.getBoundingClientRect();
    for (i = j = 0, ref = event.changedTouches.length - 1; j <= ref; i = j += 1) {
      t = event.changedTouches[i];
      min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
      x = (t.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
      y = (this.canvas.clientHeight / 2 - (t.clientY - b.top)) / min * 200;
      this.touches[t.identifier] = {
        x: x,
        y: y
      };
      this.mouse.x = x;
      this.mouse.y = y;
      this.mouse.pressed = 1;
      this.mouse.left = 1;
    }
    return false;
  };

  Screen.prototype.touchMove = function(event) {
    var b, i, j, min, ref, t, x, y;
    event.preventDefault();
    event.stopPropagation();
    b = this.canvas.getBoundingClientRect();
    for (i = j = 0, ref = event.changedTouches.length - 1; j <= ref; i = j += 1) {
      t = event.changedTouches[i];
      if (this.touches[t.identifier] != null) {
        min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
        x = (t.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
        y = (this.canvas.clientHeight / 2 - (t.clientY - b.top)) / min * 200;
        this.touches[t.identifier].x = x;
        this.touches[t.identifier].y = y;
        this.mouse.x = x;
        this.mouse.y = y;
      }
    }
    return false;
  };

  Screen.prototype.touchRelease = function(event) {
    var i, j, ref, t, x, y;
    for (i = j = 0, ref = event.changedTouches.length - 1; j <= ref; i = j += 1) {
      t = event.changedTouches[i];
      x = (t.clientX - this.canvas.offsetLeft) * this.ratio;
      y = (t.clientY - this.canvas.offsetTop) * this.ratio;
      delete this.touches[t.identifier];
      this.mouse.pressed = 0;
      this.mouse.left = 0;
      this.mouse.right = 0;
      this.mouse.middle = 0;
    }
    return false;
  };

  Screen.prototype.mouseDown = function(event) {
    var b, min, x, y;
    this.mousepressed = true;
    b = this.canvas.getBoundingClientRect();
    min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    x = (event.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
    y = (this.canvas.clientHeight / 2 - (event.clientY - b.top)) / min * 200;
    this.touches["mouse"] = {
      x: x,
      y: y
    };
    this.mouse.x = x;
    this.mouse.y = y;
    switch (event.button) {
      case 0:
        this.mouse.left = 1;
        break;
      case 1:
        this.mouse.middle = 1;
        break;
      case 2:
        this.mouse.right = 1;
    }
    this.mouse.pressed = Math.min(1, this.mouse.left + this.mouse.right + this.mouse.middle);
    return false;
  };

  Screen.prototype.mouseMove = function(event) {
    var b, min, x, y;
    event.preventDefault();
    b = this.canvas.getBoundingClientRect();
    min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    x = (event.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
    y = (this.canvas.clientHeight / 2 - (event.clientY - b.top)) / min * 200;
    if (this.touches["mouse"] != null) {
      this.touches["mouse"].x = x;
      this.touches["mouse"].y = y;
    }
    this.mouse.x = x;
    this.mouse.y = y;
    return false;
  };

  Screen.prototype.mouseUp = function(event) {
    var b, min, x, y;
    delete this.touches["mouse"];
    b = this.canvas.getBoundingClientRect();
    min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    x = (event.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
    y = (this.canvas.clientHeight / 2 - (event.clientY - b.top)) / min * 200;
    this.mouse.x = x;
    this.mouse.y = y;
    switch (event.button) {
      case 0:
        this.mouse.left = 0;
        break;
      case 1:
        this.mouse.middle = 0;
        break;
      case 2:
        this.mouse.right = 0;
    }
    this.mouse.pressed = Math.min(1, this.mouse.left + this.mouse.right + this.mouse.middle);
    return false;
  };

  Screen.prototype.takePicture = function(callback) {
    return callback(this.canvas.toDataURL());
  };

  return Screen;

})();

this.AssetManager = (function() {
  function AssetManager(runtime) {
    this.runtime = runtime;
    this["interface"] = {
      loadFont: (function(_this) {
        return function(font) {
          return _this.loadFont(font);
        };
      })(this),
      loadModel: (function(_this) {
        return function(path, scene, callback) {
          return _this.loadModel(path, scene, callback);
        };
      })(this),
      loadImage: (function(_this) {
        return function(path, callback) {
          return _this.loadImage(path, callback);
        };
      })(this),
      loadJSON: (function(_this) {
        return function(path, callback) {
          return _this.loadJSON(path, callback);
        };
      })(this),
      loadText: (function(_this) {
        return function(path, callback) {
          return _this.loadText(path, callback);
        };
      })(this),
      loadCSV: (function(_this) {
        return function(path, callback) {
          return _this.loadCSV(path, callback);
        };
      })(this)
    };
  }

  AssetManager.prototype.getInterface = function() {
    return this["interface"];
  };

  AssetManager.prototype.loadFont = function(font) {
    var err, file, name, split;
    if (typeof font !== "string") {
      return;
    }
    file = font.replace(/\//g, "-");
    split = file.split("-");
    name = split[split.length - 1];
    try {
      font = new FontFace(name, "url(assets/" + file + ".ttf)");
      return font.load().then((function(_this) {
        return function() {
          return document.fonts.add(font);
        };
      })(this));
    } catch (error) {
      err = error;
      return console.error(err);
    }
  };

  AssetManager.prototype.loadModel = function(path, scene, callback) {
    var loader;
    if (typeof BABYLON === "undefined" || BABYLON === null) {
      return;
    }
    loader = {
      ready: 0
    };
    if (this.runtime.assets[path] != null) {
      path = this.runtime.assets[path].file;
    } else {
      path = path.replace(/\//g, "-");
      path += ".glb";
    }
    return BABYLON.SceneLoader.LoadAssetContainer("", "assets/" + path, scene, (function(_this) {
      return function(container) {
        loader.container = container;
        loader.ready = 1;
        if (callback) {
          return callback(container);
        }
      };
    })(this));
  };

  AssetManager.prototype.loadImage = function(path, callback) {
    var img, loader;
    loader = {
      ready: 0
    };
    if (this.runtime.assets[path] != null) {
      path = this.runtime.assets[path].file;
    }
    img = new Image;
    img.src = "assets/" + path;
    img.onload = (function(_this) {
      return function() {
        var i;
        i = new msImage(img);
        loader.image = i;
        loader.ready = 1;
        if (callback) {
          return callback(i);
        }
      };
    })(this);
    return loader;
  };

  AssetManager.prototype.loadJSON = function(path, callback) {
    var loader;
    path = path.replace(/\//g, "-");
    path = "assets/" + path + ".json";
    loader = {
      ready: 0
    };
    fetch(path).then((function(_this) {
      return function(result) {
        return result.json().then(function(data) {
          loader.data = data;
          loader.ready = 1;
          if (callback) {
            return callback(data);
          }
        });
      };
    })(this));
    return loader;
  };

  AssetManager.prototype.loadText = function(path, callback, ext) {
    var loader;
    if (ext == null) {
      ext = "txt";
    }
    path = path.replace(/\//g, "-");
    path = "assets/" + path + "." + ext;
    loader = {
      ready: 0
    };
    fetch(path).then((function(_this) {
      return function(result) {
        return result.text().then(function(text) {
          loader.text = text;
          loader.ready = 1;
          if (callback) {
            return callback(text);
          }
        });
      };
    })(this));
    return loader;
  };

  AssetManager.prototype.loadCSV = function(path, callback) {
    return this.loadText(path, callback, "csv");
  };

  return AssetManager;

})();

this.Keyboard = (function() {
  function Keyboard() {
    document.addEventListener("keydown", (function(_this) {
      return function(event) {
        return _this.keydown(event);
      };
    })(this));
    document.addEventListener("keyup", (function(_this) {
      return function(event) {
        return _this.keyup(event);
      };
    })(this));
    this.keyboard = {
      press: {},
      release: {}
    };
    this.previous = {};
  }

  Keyboard.prototype.convertCode = function(code) {
    var c, i, j, low, ref, res;
    res = "";
    low = false;
    for (i = j = 0, ref = code.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      c = code.charAt(i);
      if (c === c.toUpperCase() && low) {
        res += "_";
        low = false;
      } else {
        low = true;
      }
      res += c.toUpperCase();
    }
    return res;
  };

  Keyboard.prototype.keydown = function(event) {
    var code, key;
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !/Escape|(F\d+)/.test(event.key)) {
      event.preventDefault();
    }
    code = event.code;
    key = event.key;
    this.keyboard[this.convertCode(code)] = 1;
    this.keyboard[key.toUpperCase()] = 1;
    return this.updateDirectional();
  };

  Keyboard.prototype.keyup = function(event) {
    var code, key;
    code = event.code;
    key = event.key;
    this.keyboard[this.convertCode(code)] = 0;
    this.keyboard[key.toUpperCase()] = 0;
    return this.updateDirectional();
  };

  Keyboard.prototype.updateDirectional = function() {
    this.keyboard.UP = this.keyboard.KEY_W || this.keyboard.ARROW_UP;
    this.keyboard.DOWN = this.keyboard.KEY_S || this.keyboard.ARROW_DOWN;
    this.keyboard.LEFT = this.keyboard.KEY_A || this.keyboard.ARROW_LEFT;
    return this.keyboard.RIGHT = this.keyboard.KEY_D || this.keyboard.ARROW_RIGHT;
  };

  Keyboard.prototype.update = function() {
    var key;
    for (key in this.keyboard.press) {
      this.keyboard.press[key] = 0;
    }
    for (key in this.keyboard.release) {
      this.keyboard.release[key] = 0;
    }
    for (key in this.previous) {
      if (this.previous[key] && !this.keyboard[key]) {
        this.keyboard.release[key] = 1;
      }
    }
    for (key in this.keyboard) {
      if (key === "press" || key === "release") {
        continue;
      }
      if (this.keyboard[key] && !this.previous[key]) {
        this.keyboard.press[key] = 1;
      }
    }
    for (key in this.previous) {
      this.previous[key] = 0;
    }
    for (key in this.keyboard) {
      if (key === "press" || key === "release") {
        continue;
      }
      this.previous[key] = this.keyboard[key];
    }
  };

  Keyboard.prototype.reset = function() {
    var key;
    for (key in this.keyboard) {
      if (key === "press" || key === "release") {
        continue;
      }
      this.keyboard[key] = 0;
    }
  };

  return Keyboard;

})();

this.Gamepad = (function() {
  function Gamepad(listener, index) {
    var pads;
    this.listener = listener;
    this.index = index != null ? index : 0;
    if (navigator.getGamepads != null) {
      pads = navigator.getGamepads();
      if (this.index < pads.length && (pads[this.index] != null)) {
        this.pad = pads[this.index];
      }
    }
    this.buttons_map = {
      0: "A",
      1: "B",
      2: "X",
      3: "Y",
      4: "LB",
      5: "RB",
      8: "VIEW",
      9: "MENU",
      10: "LS",
      11: "RS",
      12: "DPAD_UP",
      13: "DPAD_DOWN",
      14: "DPAD_LEFT",
      15: "DPAD_RIGHT"
    };
    this.triggers_map = {
      6: "LT",
      7: "RT"
    };
    this.status = {
      press: {},
      release: {}
    };
    this.previous = {
      global: {},
      0: {},
      1: {},
      2: {},
      3: {}
    };
  }

  Gamepad.prototype.update = function() {
    var angle, i, j, k, key, l, len, len1, len2, m, n, o, pad, pad_count, pads, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, value, x, y;
    pads = navigator.getGamepads();
    pad_count = 0;
    for (i = j = 0, len = pads.length; j < len; i = ++j) {
      pad = pads[i];
      if (pad == null) {
        break;
      }
      pad_count++;
      if (!this.status[i]) {
        this.status[i] = {
          press: {},
          release: {}
        };
      }
      ref = this.buttons_map;
      for (key in ref) {
        value = ref[key];
        if (pad.buttons[key] != null) {
          this.status[i][value] = pad.buttons[key].pressed ? 1 : 0;
        }
      }
      ref1 = this.triggers_map;
      for (key in ref1) {
        value = ref1[key];
        if (pad.buttons[key] != null) {
          this.status[i][value] = pad.buttons[key].value;
        }
      }
      if (pad.axes.length >= 2) {
        x = pad.axes[0];
        y = -pad.axes[1];
        r = Math.sqrt(x * x + y * y);
        angle = Math.floor(((Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 360);
        this.status[i].LEFT_STICK_ANGLE = angle;
        this.status[i].LEFT_STICK_AMOUNT = r;
        this.status[i].LEFT_STICK_UP = y > .5;
        this.status[i].LEFT_STICK_DOWN = y < -.5;
        this.status[i].LEFT_STICK_LEFT = x < -.5;
        this.status[i].LEFT_STICK_RIGHT = x > .5;
      }
      if (pad.axes.length >= 4) {
        x = pad.axes[2];
        y = -pad.axes[3];
        r = Math.sqrt(x * x + y * y);
        angle = Math.floor(((Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 360);
        this.status[i].RIGHT_STICK_ANGLE = angle;
        this.status[i].RIGHT_STICK_AMOUNT = r;
        this.status[i].RIGHT_STICK_UP = y > .5;
        this.status[i].RIGHT_STICK_DOWN = y < -.5;
        this.status[i].RIGHT_STICK_LEFT = x < -.5;
        this.status[i].RIGHT_STICK_RIGHT = x > .5;
      }
    }
    ref2 = this.buttons_map;
    for (key in ref2) {
      value = ref2[key];
      this.status[value] = 0;
      for (k = 0, len1 = pads.length; k < len1; k++) {
        pad = pads[k];
        if (pad == null) {
          break;
        }
        if ((pad.buttons[key] != null) && pad.buttons[key].pressed) {
          this.status[value] = 1;
        }
      }
    }
    ref3 = this.triggers_map;
    for (key in ref3) {
      value = ref3[key];
      this.status[value] = 0;
      for (l = 0, len2 = pads.length; l < len2; l++) {
        pad = pads[l];
        if (pad == null) {
          break;
        }
        if (pad.buttons[key] != null) {
          this.status[value] = pad.buttons[key].value;
        }
      }
    }
    this.status.UP = 0;
    this.status.DOWN = 0;
    this.status.LEFT = 0;
    this.status.RIGHT = 0;
    this.status.LEFT_STICK_UP = 0;
    this.status.LEFT_STICK_DOWN = 0;
    this.status.LEFT_STICK_LEFT = 0;
    this.status.LEFT_STICK_RIGHT = 0;
    this.status.RIGHT_STICK_UP = 0;
    this.status.RIGHT_STICK_DOWN = 0;
    this.status.RIGHT_STICK_LEFT = 0;
    this.status.RIGHT_STICK_RIGHT = 0;
    this.status.LEFT_STICK_ANGLE = 0;
    this.status.LEFT_STICK_AMOUNT = 0;
    this.status.RIGHT_STICK_ANGLE = 0;
    this.status.RIGHT_STICK_AMOUNT = 0;
    this.status.RT = 0;
    this.status.LT = 0;
    for (i = m = 0, ref4 = pad_count - 1; m <= ref4; i = m += 1) {
      this.status[i].UP = this.status[i].DPAD_UP || this.status[i].LEFT_STICK_UP || this.status[i].RIGHT_STICK_UP;
      this.status[i].DOWN = this.status[i].DPAD_DOWN || this.status[i].LEFT_STICK_DOWN || this.status[i].RIGHT_STICK_DOWN;
      this.status[i].LEFT = this.status[i].DPAD_LEFT || this.status[i].LEFT_STICK_LEFT || this.status[i].RIGHT_STICK_LEFT;
      this.status[i].RIGHT = this.status[i].DPAD_RIGHT || this.status[i].LEFT_STICK_RIGHT || this.status[i].RIGHT_STICK_RIGHT;
      if (this.status[i].UP) {
        this.status.UP = 1;
      }
      if (this.status[i].DOWN) {
        this.status.DOWN = 1;
      }
      if (this.status[i].LEFT) {
        this.status.LEFT = 1;
      }
      if (this.status[i].RIGHT) {
        this.status.RIGHT = 1;
      }
      if (this.status[i].LEFT_STICK_UP) {
        this.status.LEFT_STICK_UP = 1;
      }
      if (this.status[i].LEFT_STICK_DOWN) {
        this.status.LEFT_STICK_DOWN = 1;
      }
      if (this.status[i].LEFT_STICK_LEFT) {
        this.status.LEFT_STICK_LEFT = 1;
      }
      if (this.status[i].LEFT_STICK_RIGHT) {
        this.status.LEFT_STICK_RIGHT = 1;
      }
      if (this.status[i].RIGHT_STICK_UP) {
        this.status.RIGHT_STICK_UP = 1;
      }
      if (this.status[i].RIGHT_STICK_DOWN) {
        this.status.RIGHT_STICK_DOWN = 1;
      }
      if (this.status[i].RIGHT_STICK_LEFT) {
        this.status.RIGHT_STICK_LEFT = 1;
      }
      if (this.status[i].RIGHT_STICK_RIGHT) {
        this.status.RIGHT_STICK_RIGHT = 1;
      }
      if (this.status[i].LT) {
        this.status.LT = this.status[i].LT;
      }
      if (this.status[i].RT) {
        this.status.RT = this.status[i].RT;
      }
      if (this.status[i].LEFT_STICK_AMOUNT > this.status.LEFT_STICK_AMOUNT) {
        this.status.LEFT_STICK_AMOUNT = this.status[i].LEFT_STICK_AMOUNT;
        this.status.LEFT_STICK_ANGLE = this.status[i].LEFT_STICK_ANGLE;
      }
      if (this.status[i].RIGHT_STICK_AMOUNT > this.status.RIGHT_STICK_AMOUNT) {
        this.status.RIGHT_STICK_AMOUNT = this.status[i].RIGHT_STICK_AMOUNT;
        this.status.RIGHT_STICK_ANGLE = this.status[i].RIGHT_STICK_ANGLE;
      }
    }
    for (i = n = ref5 = pad_count; n <= 3; i = n += 1) {
      delete this.status[i];
    }
    this.count = pad_count;
    this.updateChanges(this.status, this.previous.global);
    for (i = o = 0, ref6 = pad_count - 1; o <= ref6; i = o += 1) {
      this.updateChanges(this.status[i], this.previous[i]);
    }
  };

  Gamepad.prototype.updateChanges = function(current, previous) {
    var key;
    for (key in current.press) {
      current.press[key] = 0;
    }
    for (key in current.release) {
      current.release[key] = 0;
    }
    for (key in previous) {
      if (previous[key] && !current[key]) {
        current.release[key] = 1;
      }
    }
    for (key in current) {
      if (key === "press" || key === "release") {
        continue;
      }
      if (current[key] && !previous[key]) {
        current.press[key] = 1;
      }
    }
    for (key in previous) {
      previous[key] = 0;
    }
    for (key in current) {
      if (key === "press" || key === "release") {
        continue;
      }
      previous[key] = current[key];
    }
  };

  return Gamepad;

})();

this.Sprite = (function() {
  function Sprite(width, height) {
    this.width = width;
    this.height = height;
    this.name = "";
    this.frames = [];
    this.animation_start = 0;
    this.fps = 5;
    if (this.width > 0 && this.height > 0) {
      this.frames.push(new msImage(this.width, this.height));
      this.ready = 1;
    }
  }

  Sprite.prototype.setFrame = function(f) {
    return this.animation_start = Date.now() - 1000 / this.fps * f;
  };

  Sprite.prototype.getFrame = function() {
    var dt;
    dt = 1000 / this.fps;
    return Math.floor((Date.now() - this.animation_start) / dt) % this.frames.length;
  };

  return Sprite;

})();

this.LoadSprite = function(url, properties, loaded) {
  var img, sprite;
  sprite = new Sprite(0, 0);
  sprite.ready = 0;
  img = new Image;
  if (location.protocol !== "file:") {
    img.crossOrigin = "Anonymous";
  }
  img.src = url;
  img.onload = (function(_this) {
    return function() {
      var frame, i, j, numframes, ref;
      sprite.ready = true;
      if (img.width > 0 && img.height > 0) {
        numframes = 1;
        if ((properties != null) && (properties.frames != null)) {
          numframes = properties.frames;
        }
        if (properties.fps != null) {
          sprite.fps = properties.fps;
        }
        sprite.width = img.width;
        sprite.height = Math.round(img.height / numframes);
        sprite.frames = [];
        for (i = j = 0, ref = numframes - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          frame = new msImage(sprite.width, sprite.height);
          frame.initContext();
          frame.context.drawImage(img, 0, -i * sprite.height);
          sprite.frames.push(frame);
        }
        sprite.ready = true;
      }
      if (loaded != null) {
        return loaded();
      }
    };
  })(this);
  img.onerror = (function(_this) {
    return function() {
      return sprite.ready = 1;
    };
  })(this);
  return sprite;
};

this.UpdateSprite = function(sprite, img, properties) {
  var frame, i, j, numframes, ref;
  if (img.width > 0 && img.height > 0) {
    numframes = 1;
    if ((properties != null) && (properties.frames != null)) {
      numframes = properties.frames;
    }
    if ((properties != null) && (properties.fps != null)) {
      sprite.fps = properties.fps;
    }
    sprite.width = img.width;
    sprite.height = Math.round(img.height / numframes);
    sprite.frames = [];
    for (i = j = 0, ref = numframes - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      frame = new msImage(sprite.width, sprite.height);
      frame.initContext();
      frame.context.drawImage(img, 0, -i * sprite.height);
      sprite.frames.push(frame);
    }
    return sprite.ready = true;
  }
};

var b, j, len1, ref;

this.msImage = (function() {
  function msImage(width, height, centered) {
    this.width = width;
    this.height = height;
    this.centered = centered != null ? centered : false;
    if (this.width instanceof Image) {
      this.image = this.width;
      this.width = this.image.width;
      this.height = this.image.height;
    } else if (this.width instanceof HTMLCanvasElement) {
      this.canvas = this.width;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    } else {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  msImage.prototype.setRGB = function(x, y, r, g, b) {
    this.initContext();
    if (this.pixeldata == null) {
      this.pixeldata = this.context.getImageData(0, 0, 1, 1);
    }
    if (r.R != null) {
      this.pixeldata.data[0] = r.R;
      this.pixeldata.data[1] = r.G;
      this.pixeldata.data[2] = r.B;
    } else {
      this.pixeldata.data[0] = r;
      this.pixeldata.data[1] = g;
      this.pixeldata.data[2] = b;
    }
    this.pixeldata.data[3] = 255;
    return this.context.putImageData(this.pixeldata, x, y);
  };

  msImage.prototype.setRGBA = function(x, y, r, g, b, a) {
    this.initContext();
    if (this.pixeldata == null) {
      this.pixeldata = this.context.getImageData(0, 0, 1, 1);
    }
    if (r.R != null) {
      this.pixeldata.data[0] = r.R;
      this.pixeldata.data[1] = r.G;
      this.pixeldata.data[2] = r.B;
      this.pixeldata.data[2] = r.A != null ? r.A : 255;
    } else {
      this.pixeldata.data[0] = r;
      this.pixeldata.data[1] = g;
      this.pixeldata.data[2] = b;
      this.pixeldata.data[3] = a;
    }
    return this.context.putImageData(this.pixeldata, x, y);
  };

  msImage.prototype.getRGB = function(x, y, result) {
    var d;
    if (result == null) {
      result = {};
    }
    this.initContext();
    d = this.context.getImageData(x, y, 1, 1);
    result.R = d.data[0];
    result.G = d.data[1];
    result.B = d.data[2];
    return result;
  };

  msImage.prototype.getRGBA = function(x, y, result) {
    var d;
    if (result == null) {
      result = {};
    }
    this.initContext();
    d = this.context.getImageData(x, y, 1, 1);
    result.R = d.data[0];
    result.G = d.data[1];
    result.B = d.data[2];
    result.A = d.data[3];
    return result;
  };

  msImage.prototype.initContext = function() {
    if (this.context != null) {
      return;
    }
    if ((this.canvas == null) && (this.image != null)) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;
      this.context = this.canvas.getContext("2d");
      this.context.drawImage(this.image, 0, 0);
      this.image = null;
    }
    this.alpha = 1;
    this.pixelated = 1;
    this.line_width = 1;
    this.context = this.canvas.getContext("2d");
    this.context.lineCap = "round";
    if (this.centered) {
      this.translation_x = this.width / 2;
      this.translation_y = this.height / 2;
      this.rotation = 0;
      this.scale_x = 1;
      this.scale_y = -1;
      this.image_transform = true;
      this.anchor_x = 0;
      this.anchor_y = 0;
      this.object_scale_y = -1;
    } else {
      this.translation_x = 0;
      this.translation_y = 0;
      this.rotation = 0;
      this.scale_x = 1;
      this.scale_y = 1;
      this.image_transform = false;
      this.anchor_x = -1;
      this.anchor_y = 1;
      this.object_scale_y = 1;
    }
    this.object_rotation = 0;
    this.object_scale_x = 1;
    return this.font = "BitCell";
  };

  msImage.prototype.clear = function(color) {
    var blending_save, c, s;
    this.initContext();
    c = this.context.fillStyle;
    s = this.context.strokeStyle;
    blending_save = this.context.globalCompositeOperation;
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = "source-over";
    if (color != null) {
      this.setColor(color);
    } else {
      this.context.fillStyle = "#000";
    }
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = c;
    this.context.strokeStyle = s;
    return this.context.globalCompositeOperation = blending_save;
  };

  msImage.prototype.setColor = function(color) {
    this.initContext();
    if (color == null) {
      return;
    }
    if (typeof color === "string") {
      this.context.fillStyle = color;
      return this.context.strokeStyle = color;
    }
  };

  msImage.prototype.setAlpha = function(alpha) {
    this.initContext();
    return this.alpha = alpha;
  };

  msImage.prototype.setPixelated = function(pixelated) {
    this.initContext();
    return this.pixelated = pixelated;
  };

  msImage.prototype.setBlending = function(blending) {
    this.initContext();
    blending = BLENDING_MODES[blending || "normal"] || "source-over";
    return this.context.globalCompositeOperation = blending;
  };

  msImage.prototype.setLineWidth = function(line_width) {
    this.initContext();
    return this.line_width = line_width;
  };

  msImage.prototype.setLineDash = function(dash) {
    this.initContext();
    if (!Array.isArray(dash)) {
      return this.context.setLineDash([]);
    } else {
      return this.context.setLineDash(dash);
    }
  };

  msImage.prototype.setLinearGradient = function(x1, y1, x2, y2, c1, c2) {
    var grd;
    this.initContext();
    grd = this.context.createLinearGradient(x1, y1, x2, y2);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.context.fillStyle = grd;
    return this.context.strokeStyle = grd;
  };

  msImage.prototype.setRadialGradient = function(x, y, radius, c1, c2) {
    var grd;
    this.initContext();
    grd = this.context.createRadialGradient(x, y, 0, x, y, radius);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.context.fillStyle = grd;
    return this.context.strokeStyle = grd;
  };

  msImage.prototype.setFont = function(font) {
    return this.font = font || "Verdana";
  };

  msImage.prototype.setTranslation = function(translation_x, translation_y) {
    this.translation_x = translation_x;
    this.translation_y = translation_y;
    this.initContext();
    if (!isFinite(this.translation_x)) {
      this.translation_x = 0;
    }
    if (!isFinite(this.translation_y)) {
      this.translation_y = 0;
    }
    return this.updateScreenTransform();
  };

  msImage.prototype.setScale = function(scale_x, scale_y) {
    this.scale_x = scale_x;
    this.scale_y = scale_y;
    this.initContext();
    if (!isFinite(this.scale_x) || this.scale_x === 0) {
      this.scale_x = 1;
    }
    if (!isFinite(this.scale_y) || this.scale_y === 0) {
      this.scale_y = 1;
    }
    return this.updateScreenTransform();
  };

  msImage.prototype.setRotation = function(rotation) {
    this.rotation = rotation;
    this.initContext();
    if (!isFinite(this.rotation)) {
      this.rotation = 0;
    }
    return this.updateScreenTransform();
  };

  msImage.prototype.updateScreenTransform = function() {
    return this.image_transform = this.translation_x !== 0 || this.translation_y !== 0 || this.scale_x !== 1 || this.scale_y !== 1 || this.rotation !== 0;
  };

  msImage.prototype.setDrawAnchor = function(anchor_x, anchor_y) {
    this.anchor_x = anchor_x;
    this.anchor_y = anchor_y;
    this.initContext();
    if (typeof this.anchor_x !== "number") {
      this.anchor_x = 0;
    }
    if (typeof this.anchor_y !== "number") {
      return this.anchor_y = 0;
    }
  };

  msImage.prototype.setDrawRotation = function(object_rotation) {
    this.initContext();
    return this.object_rotation = object_rotation;
  };

  msImage.prototype.setDrawScale = function(object_scale_x, object_scale_y) {
    if (object_scale_y == null) {
      object_scale_y = object_scale_x;
    }
    this.initContext();
    this.object_scale_x = object_scale_x;
    return this.object_scale_y = object_scale_y;
  };

  msImage.prototype.initDrawOp = function(x, y) {
    var res;
    res = false;
    if (this.image_transform) {
      this.context.save();
      res = true;
      this.context.translate(this.translation_x, this.translation_y);
      this.context.scale(this.scale_x, this.scale_y);
      this.context.rotate(this.rotation / 180 * Math.PI);
      this.context.translate(x, y);
    }
    if (this.object_rotation !== 0 || this.object_scale_x !== 1 || this.object_scale_y !== 1) {
      if (!res) {
        this.context.save();
        res = true;
        this.context.translate(x, y);
      }
      if (this.object_rotation !== 0) {
        this.context.rotate(this.object_rotation / 180 * Math.PI);
      }
      if (this.object_scale_x !== 1 || this.object_scale_y !== 1) {
        this.context.scale(this.object_scale_x, this.object_scale_y);
      }
    }
    return res;
  };

  msImage.prototype.closeDrawOp = function(x, y) {
    return this.context.restore();
  };

  msImage.prototype.fillRect = function(x, y, w, h, color) {
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    if (this.initDrawOp(x, y)) {
      this.context.fillRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.fillRect(x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  msImage.prototype.fillRoundRect = function(x, y, w, h, round, color) {
    if (round == null) {
      round = 10;
    }
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    if (this.initDrawOp(x, y)) {
      this.context.fillRoundRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h, round);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.fillRoundRect(x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h, round);
    }
  };

  msImage.prototype.fillRound = function(x, y, w, h, color) {
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    w = Math.abs(w);
    h = Math.abs(h);
    if (this.initDrawOp(x, y)) {
      this.context.beginPath();
      this.context.ellipse(-this.anchor_x * w / 2, 0 + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      this.context.fill();
      return this.closeDrawOp(x, y);
    } else {
      this.context.beginPath();
      this.context.ellipse(x - this.anchor_x * w / 2, y + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      return this.context.fill();
    }
  };

  msImage.prototype.drawRect = function(x, y, w, h, color) {
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (this.initDrawOp(x, y)) {
      this.context.strokeRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.strokeRect(x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  msImage.prototype.drawRoundRect = function(x, y, w, h, round, color) {
    if (round == null) {
      round = 10;
    }
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (this.initDrawOp(x, y)) {
      this.context.strokeRoundRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h, round);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.strokeRoundRect(x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h, round);
    }
  };

  msImage.prototype.drawRound = function(x, y, w, h, color) {
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    w = Math.abs(w);
    h = Math.abs(h);
    if (this.initDrawOp(x, y)) {
      this.context.beginPath();
      this.context.ellipse(0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      this.context.stroke();
      return this.closeDrawOp(x, y);
    } else {
      this.context.beginPath();
      this.context.ellipse(x - this.anchor_x * w / 2, y + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      return this.context.stroke();
    }
  };

  msImage.prototype.drawLine = function(x1, y1, x2, y2, color) {
    var transform;
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  msImage.prototype.drawPolyline = function(args) {
    var i, j, len, ref, transform;
    this.initContext();
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], args[i * 2 + 1]);
    }
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  msImage.prototype.drawPolygon = function(args) {
    var i, j, len, ref, transform;
    this.initContext();
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], args[i * 2 + 1]);
    }
    this.context.closePath();
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  msImage.prototype.fillPolygon = function(args) {
    var i, j, len, ref, transform;
    this.initContext();
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], args[i * 2 + 1]);
    }
    this.context.fill();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  msImage.prototype.textWidth = function(text, size) {
    this.initContext();
    this.context.font = size + "pt " + this.font;
    return this.context.measureText(text).width;
  };

  msImage.prototype.drawText = function(text, x, y, size, color) {
    var h, w;
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.font = size + "pt " + this.font;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    w = this.context.measureText(text).width;
    h = size;
    if (this.initDrawOp(x, y)) {
      this.context.fillText(text, 0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.fillText(text, x - this.anchor_x * w / 2, y + this.anchor_y * h / 2);
    }
  };

  msImage.prototype.drawTextOutline = function(text, x, y, size, color) {
    var h, w;
    this.initContext();
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.font = size + "pt " + this.font;
    this.context.lineWidth = this.line_width;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    w = this.context.measureText(text).width;
    h = size;
    if (this.initDrawOp(x, y)) {
      this.context.strokeText(text, 0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.strokeText(text, x - this.anchor_x * w / 2, y + this.anchor_y * h / 2);
    }
  };

  msImage.prototype.getSpriteFrame = function(sprite) {
    var dt, frame, s;
    frame = null;
    if (typeof sprite === "string") {
      s = window.player.runtime.sprites[sprite];
      if (s != null) {
        sprite = s;
      } else {
        s = sprite.split(".");
        if (s.length > 1) {
          sprite = window.player.runtime.sprites[s[0]];
          frame = s[1] | 0;
        }
      }
    } else if (sprite instanceof msImage) {
      return sprite.canvas || sprite.image;
    }
    if ((sprite == null) || !sprite.ready) {
      return null;
    }
    if (sprite.frames.length > 1) {
      if (frame == null) {
        dt = 1000 / sprite.fps;
        frame = Math.floor((Date.now() - sprite.animation_start) / dt) % sprite.frames.length;
      }
      if (frame >= 0 && frame < sprite.frames.length) {
        return sprite.frames[frame].canvas;
      } else {
        return sprite.frames[0].canvas;
      }
    } else if (sprite.frames[0] != null) {
      return sprite.frames[0].canvas;
    } else {
      return null;
    }
  };

  msImage.prototype.drawImage = function(sprite, x, y, w, h) {
    return this.drawSprite(sprite, x, y, w, h);
  };

  msImage.prototype.drawSprite = function(sprite, x, y, w, h) {
    var canvas;
    this.initContext();
    canvas = this.getSpriteFrame(sprite);
    if (canvas == null) {
      return;
    }
    if (!h) {
      h = w / canvas.width * canvas.height;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = !this.pixelated;
    if (this.initDrawOp(x, y)) {
      this.context.drawImage(canvas, -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.drawImage(canvas, x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  msImage.prototype.drawImagePart = function(sprite, sx, sy, sw, sh, x, y, w, h) {
    return this.drawImage(sprite, sx, sy, sw, sh, x, y, w, h);
  };

  msImage.prototype.drawSpritePart = function(sprite, sx, sy, sw, sh, x, y, w, h) {
    var canvas;
    this.initContext();
    canvas = this.getSpriteFrame(sprite);
    if (canvas == null) {
      return;
    }
    if (!h) {
      h = w / sw * sh;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = !this.pixelated;
    if (this.initDrawOp(x, y)) {
      this.context.drawImage(canvas, sx, sy, sw, sh, -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.drawImage(canvas, sx, sy, sw, sh, x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  msImage.prototype.drawMap = function(map, x, y, w, h) {
    this.initContext();
    if (typeof map === "string") {
      map = window.player.runtime.maps[map];
    }
    if ((map == null) || !map.ready || (map.canvas == null)) {
      return;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = !this.pixelated;
    if (this.initDrawOp(x, y)) {
      this.context.drawImage(map.getCanvas(), -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, y);
    } else {
      return this.context.drawImage(map.getCanvas(), x - w / 2 - this.anchor_x * w / 2, y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  return msImage;

})();

this.BLENDING_MODES = {
  normal: "source-over",
  additive: "lighter"
};

ref = ["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
for (j = 0, len1 = ref.length; j < len1; j++) {
  b = ref[j];
  this.BLENDING_MODES[b] = b;
}

this.MicroMap = (function() {
  function MicroMap(width, height, block_width, block_height, sprites1) {
    var req;
    this.width = width;
    this.height = height;
    this.block_width = block_width;
    this.block_height = block_height;
    this.sprites = sprites1;
    this.map = [];
    if ((this.width != null) && typeof this.width === "string") {
      this.ready = false;
      req = new XMLHttpRequest();
      req.onreadystatechange = (function(_this) {
        return function(event) {
          if (req.readyState === XMLHttpRequest.DONE) {
            _this.ready = true;
            if (req.status === 200) {
              _this.load(req.responseText, _this.sprites);
              _this.update();
            }
            if (_this.loaded != null) {
              return _this.loaded();
            }
          }
        };
      })(this);
      req.open("GET", this.width);
      req.send();
      this.width = 10;
      this.height = 10;
      this.block_width = 10;
      this.block_height = 10;
    } else {
      this.ready = true;
    }
    this.clear();
    this.update();
  }

  MicroMap.prototype.clear = function() {
    var i, j, k, l, ref1, ref2;
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        this.map[i + j * this.width] = null;
      }
    }
  };

  MicroMap.prototype.set = function(x, y, ref) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.map[x + y * this.width] = ref;
      return this.needs_update = true;
    }
  };

  MicroMap.prototype.get = function(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return 0;
    }
    return this.map[x + y * this.width] || 0;
  };

  MicroMap.prototype.getCanvas = function() {
    if ((this.canvas == null) || this.needs_update) {
      this.update();
    }
    return this.canvas;
  };

  MicroMap.prototype.update = function() {
    var c, context, i, index, j, k, l, ref1, ref2, s, sprite, tx, ty, xy;
    this.needs_update = false;
    if (this.canvas == null) {
      this.canvas = document.createElement("canvas");
    }
    if (this.canvas.width !== this.width * this.block_width || this.canvas.height !== this.height * this.block_height) {
      this.canvas.width = this.width * this.block_width;
      this.canvas.height = this.height * this.block_height;
    }
    context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        index = i + (this.height - 1 - j) * this.width;
        s = this.map[index];
        if ((s != null) && s.length > 0) {
          s = s.split(":");
          sprite = this.sprites[s[0]];
          if ((sprite != null) && (sprite.frames[0] != null)) {
            if (s[1] != null) {
              xy = s[1].split(",");
              tx = xy[0] * this.block_width;
              ty = xy[1] * this.block_height;
              c = sprite.frames[0].canvas;
              if ((c != null) && c.width > 0 && c.height > 0) {
                context.drawImage(c, tx, ty, this.block_width, this.block_height, this.block_width * i, this.block_height * j, this.block_width, this.block_height);
              }
            } else {
              c = sprite.frames[0].canvas;
              if ((c != null) && c.width > 0 && c.height > 0) {
                context.drawImage(c, this.block_width * i, this.block_height * j);
              }
            }
          }
        }
      }
    }
  };

  MicroMap.prototype.resize = function(w, h, block_width, block_height) {
    var i, j, k, l, map, ref1, ref2;
    this.block_width = block_width != null ? block_width : this.block_width;
    this.block_height = block_height != null ? block_height : this.block_height;
    map = [];
    for (j = k = 0, ref1 = h - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = w - 1; l <= ref2; i = l += 1) {
        if (j < this.height && i < this.width) {
          map[i + j * w] = this.map[i + j * this.width];
        } else {
          map[i + j * w] = null;
        }
      }
    }
    this.map = map;
    this.width = w;
    return this.height = h;
  };

  MicroMap.prototype.save = function() {
    var data, i, index, j, k, l, list, m, map, n, ref1, ref2, ref3, ref4, s, table;
    index = 1;
    list = [0];
    table = {};
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        s = this.map[i + j * this.width];
        if ((s != null) && s.length > 0 && (table[s] == null)) {
          list.push(s);
          table[s] = index++;
        }
      }
    }
    map = [];
    for (j = m = 0, ref3 = this.height - 1; m <= ref3; j = m += 1) {
      for (i = n = 0, ref4 = this.width - 1; n <= ref4; i = n += 1) {
        s = this.map[i + j * this.width];
        map[i + j * this.width] = (s != null) && s.length > 0 ? table[s] : 0;
      }
    }
    data = {
      width: this.width,
      height: this.height,
      block_width: this.block_width,
      block_height: this.block_height,
      sprites: list,
      data: map
    };
    return JSON.stringify(data);
  };

  MicroMap.prototype.loadFile = function(url) {
    var req;
    req = new XMLHttpRequest();
    req.onreadystatechange = (function(_this) {
      return function(event) {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            _this.load(req.responseText, _this.sprites);
            return _this.update();
          }
        }
      };
    })(this);
    req.open("GET", url);
    return req.send();
  };

  MicroMap.prototype.load = function(data, sprites) {
    var i, j, k, l, ref1, ref2, s;
    data = JSON.parse(data);
    this.width = data.width;
    this.height = data.height;
    this.block_width = data.block_width;
    this.block_height = data.block_height;
    for (j = k = 0, ref1 = data.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = data.width - 1; l <= ref2; i = l += 1) {
        s = data.data[i + j * data.width];
        if (s > 0) {
          this.map[i + j * data.width] = data.sprites[s];
        } else {
          this.map[i + j * data.width] = null;
        }
      }
    }
  };

  MicroMap.loadMap = function(data, sprites) {
    var i, j, k, l, map, ref1, ref2, s;
    data = JSON.parse(data);
    map = new MicroMap(data.width, data.height, data.block_width, data.block_height, sprites);
    for (j = k = 0, ref1 = data.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = data.width - 1; l <= ref2; i = l += 1) {
        s = data.data[i + j * data.width];
        if (s > 0) {
          map.map[i + j * data.width] = data.sprites[s];
        }
      }
    }
    return map;
  };

  MicroMap.prototype.clone = function() {
    var i, j, k, l, map, ref1, ref2;
    map = new MicroMap(this.width, this.height, this.block_width, this.block_height, this.sprites);
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        map.map[i + j * this.width] = this.map[i + j * this.width];
      }
    }
    map.needs_update = true;
    return map;
  };

  MicroMap.prototype.copyFrom = function(map) {
    var i, j, k, l, ref1, ref2;
    this.width = map.width;
    this.height = map.height;
    this.block_width = map.block_width;
    this.block_height = map.block_height;
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        this.map[i + j * this.width] = map.map[i + j * this.width];
      }
    }
    this.update();
    return this;
  };

  return MicroMap;

})();

this.AudioCore = (function() {
  function AudioCore(runtime) {
    this.runtime = runtime;
    this.buffer = [];
    this.getContext();
    this.playing = [];
    this.wakeup_list = [];
  }

  AudioCore.prototype.isStarted = function() {
    return this.context.state === "running";
  };

  AudioCore.prototype.addToWakeUpList = function(item) {
    return this.wakeup_list.push(item);
  };

  AudioCore.prototype.getInterface = function() {
    var audio;
    audio = this;
    return this["interface"] = {
      beep: function(sequence) {
        return audio.beep(sequence);
      },
      cancelBeeps: function() {
        return audio.cancelBeeps();
      },
      playSound: function(sound, volume, pitch, pan, loopit) {
        return audio.playSound(sound, volume, pitch, pan, loopit);
      },
      playMusic: function(music, volume, loopit) {
        return audio.playMusic(music, volume, loopit);
      }
    };
  };

  AudioCore.prototype.playSound = function(sound, volume, pitch, pan, loopit) {
    var s;
    if (volume == null) {
      volume = 1;
    }
    if (pitch == null) {
      pitch = 1;
    }
    if (pan == null) {
      pan = 0;
    }
    if (loopit == null) {
      loopit = 0;
    }
    if (typeof sound === "string") {
      s = this.runtime.sounds[sound.replace(/\//g, "-")];
      if (s != null) {
        return s.play(volume, pitch, pan, loopit);
      }
    }
    return 0;
  };

  AudioCore.prototype.playMusic = function(music, volume, loopit) {
    var m;
    if (volume == null) {
      volume = 1;
    }
    if (loopit == null) {
      loopit = 0;
    }
    if (typeof music === "string") {
      m = this.runtime.music[music.replace(/\//g, "-")];
      if (m != null) {
        return m.play(volume, loopit);
      }
    }
    return 0;
  };

  AudioCore.prototype.start = function() {
    var blob, src;
    if (false) {
      blob = new Blob([AudioCore.processor], {
        type: "text/javascript"
      });
      return this.context.audioWorklet.addModule(window.URL.createObjectURL(blob)).then((function(_this) {
        return function() {
          _this.node = new AudioWorkletNode(_this.context, "my-worklet-processor");
          _this.node.connect(_this.context.destination);
          return _this.flushBuffer();
        };
      })(this));
    } else {
      this.script_processor = this.context.createScriptProcessor(4096, 2, 2);
      this.processor_funk = (function(_this) {
        return function(event) {
          return _this.onAudioProcess(event);
        };
      })(this);
      this.script_processor.onaudioprocess = this.processor_funk;
      this.script_processor.connect(this.context.destination);
      src = "class AudioWorkletProcessor {\n  constructor() {\n    this.port = {} ;\n\n    var _this = this ;\n\n    this.port.postMessage = function(data) {\n      var event = { data: data } ;\n      _this.port.onmessage(event) ;\n    }\n  }\n\n} ;\nregisterProcessor = function(a,b) {\n  return new MyWorkletProcessor()\n} ;\n";
      src += AudioCore.processor;
      this.node = eval(src);
      this.flushBuffer();
      return this.bufferizer = new AudioBufferizer(this.node);
    }
  };

  AudioCore.prototype.flushBuffer = function() {
    var results;
    results = [];
    while (this.buffer.length > 0) {
      results.push(this.node.port.postMessage(this.buffer.splice(0, 1)[0]));
    }
    return results;
  };

  AudioCore.prototype.onAudioProcess = function(event) {
    var left, outputs, right;
    left = event.outputBuffer.getChannelData(0);
    right = event.outputBuffer.getChannelData(1);
    outputs = [[left, right]];
    this.bufferizer.flush(outputs);
  };

  AudioCore.prototype.getContext = function() {
    var activate;
    if (this.context == null) {
      this.context = new (window.AudioContext || window.webkitAudioContext);
      if (this.context.state !== "running") {
        activate = (function(_this) {
          return function() {
            var item, j, len, ref;
            console.info("resuming context");
            _this.context.resume();
            if (_this.beeper != null) {
              _this.start();
            }
            ref = _this.wakeup_list;
            for (j = 0, len = ref.length; j < len; j++) {
              item = ref[j];
              item.wakeUp();
            }
            document.body.removeEventListener("touchend", activate);
            return document.body.removeEventListener("mouseup", activate);
          };
        })(this);
        document.body.addEventListener("touchend", activate);
        document.body.addEventListener("mouseup", activate);
      } else if (this.beeper != null) {
        this.start();
      }
    }
    return this.context;
  };

  AudioCore.prototype.getBeeper = function() {
    if (this.beeper == null) {
      this.beeper = new Beeper(this);
      if (this.context.state === "running") {
        this.start();
      }
    }
    return this.beeper;
  };

  AudioCore.prototype.beep = function(sequence) {
    return this.getBeeper().beep(sequence);
  };

  AudioCore.prototype.addBeeps = function(beeps) {
    var b, j, len;
    for (j = 0, len = beeps.length; j < len; j++) {
      b = beeps[j];
      b.duration *= this.context.sampleRate;
      b.increment = b.frequency / this.context.sampleRate;
    }
    if (this.node != null) {
      return this.node.port.postMessage(JSON.stringify({
        name: "beep",
        sequence: beeps
      }));
    } else {
      return this.buffer.push(JSON.stringify({
        name: "beep",
        sequence: beeps
      }));
    }
  };

  AudioCore.prototype.cancelBeeps = function() {
    if (this.node != null) {
      this.node.port.postMessage(JSON.stringify({
        name: "cancel_beeps"
      }));
    } else {
      this.buffer.push(JSON.stringify({
        name: "cancel_beeps"
      }));
    }
    return this.stopAll();
  };

  AudioCore.prototype.addPlaying = function(item) {
    return this.playing.push(item);
  };

  AudioCore.prototype.removePlaying = function(item) {
    var index;
    index = this.playing.indexOf(item);
    if (index >= 0) {
      return this.playing.splice(index, 1);
    }
  };

  AudioCore.prototype.stopAll = function() {
    var err, j, len, p, ref;
    ref = this.playing;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      try {
        p.stop();
      } catch (error) {
        err = error;
        console.error(err);
      }
    }
    return this.playing = [];
  };

  AudioCore.processor = "class MyWorkletProcessor extends AudioWorkletProcessor {\n  constructor() {\n    super();\n    this.beeps = [] ;\n    this.last = 0 ;\n    this.port.onmessage = (event) => {\n      let data = JSON.parse(event.data) ;\n      if (data.name == \"cancel_beeps\")\n      {\n        this.beeps = [] ;\n      }\n      else if (data.name == \"beep\")\n      {\n        let seq = data.sequence ;\n        for (let i=0;i<seq.length;i++)\n        {\n          let note = seq[i] ;\n          if (i>0)\n          {\n            seq[i-1].next = note ;\n          }\n\n          if (note.loopto != null)\n          {\n            note.loopto = seq[note.loopto] ;\n          }\n\n          note.phase = 0 ;\n          note.time = 0 ;\n        }\n\n        this.beeps.push(seq[0]) ;\n      }\n    } ;\n  }\n\n  process(inputs, outputs, parameters) {\n    var output = outputs[0] ;\n    var phase ;\n    for (var i=0;i<output.length;i++)\n    {\n      var channel = output[i] ;\n      if (i>0)\n      {\n        for (var j=0;j<channel.length;j++)\n        {\n          channel[j] = output[0][j]\n        }\n      }\n      else\n      {\n        for (var j=0;j<channel.length;j++)\n        {\n          let sig = 0 ;\n          for (var k=this.beeps.length-1;k>=0;k--)\n          {\n            let b = this.beeps[k];\n            let volume = b.volume ;\n            if (b.time/b.duration>b.span)\n              {\n                volume = 0 ;\n              }\n            if (b.waveform == \"square\")\n            {\n              sig += b.phase>.5? volume : -volume ;\n            }\n            else if (b.waveform == \"saw\")\n            {\n              sig += (b.phase*2-1)*volume ;\n            }\n            else if (b.waveform == \"noise\")\n            {\n              sig += (Math.random()*2-1)*volume ;\n            }\n            else\n            {\n              sig += Math.sin(b.phase*Math.PI*2)*volume ;\n            }\n\n            b.phase = (b.phase+b.increment)%1 ;\n            b.time += 1 ;\n            if (b.time>=b.duration)\n            {\n              b.time = 0 ;\n              if (b.loopto != null)\n              {\n                if (b.repeats != null && b.repeats>0)\n                {\n                  if (b.loopcount == null)\n                  {\n                    b.loopcount = 0 ;\n                  }\n                  b.loopcount++ ;\n                  if (b.loopcount>=b.repeats)\n                  {\n                    b.loopcount = 0 ;\n                    if (b.next != null)\n                    {\n                      b.next.phase = b.phase ;\n                      b = b.next ;\n                      this.beeps[k] = b ;\n                    }\n                    else\n                    {\n                      this.beeps.splice(k,1) ;\n                    }\n                  }\n                  else\n                  {\n                    b.loopto.phase = b.phase ;\n                    b = b.loopto ;\n                    this.beeps[k] = b ;\n                  }\n                }\n                else\n                {\n                  b.loopto.phase = b.phase ;\n                  b = b.loopto ;\n                  this.beeps[k] = b ;\n                }\n              }\n              else if (b.next != null)\n              {\n                b.next.phase = b.phase ;\n                b = b.next ;\n                this.beeps[k] = b ;\n              }\n              else\n              {\n                this.beeps.splice(k,1) ;\n              }\n            }\n          }\n          this.last = this.last*.9+sig*.1 ;\n          channel[j] = this.last ;\n        }\n      }\n    }\n    return true ;\n  }\n}\n\nregisterProcessor('my-worklet-processor', MyWorkletProcessor);";

  return AudioCore;

})();

this.AudioBufferizer = (function() {
  function AudioBufferizer(node) {
    var i, j, k, left, ref, right;
    this.node = node;
    this.buffer_size = 4096;
    this.chunk_size = 512;
    this.chunks = [];
    this.nb_chunks = this.buffer_size / this.chunk_size;
    for (i = j = 0, ref = this.nb_chunks - 1; j <= ref; i = j += 1) {
      left = (function() {
        var n, ref1, results;
        results = [];
        for (k = n = 0, ref1 = this.chunk_size - 1; 0 <= ref1 ? n <= ref1 : n >= ref1; k = 0 <= ref1 ? ++n : --n) {
          results.push(0);
        }
        return results;
      }).call(this);
      right = (function() {
        var n, ref1, results;
        results = [];
        for (k = n = 0, ref1 = this.chunk_size - 1; 0 <= ref1 ? n <= ref1 : n >= ref1; k = 0 <= ref1 ? ++n : --n) {
          results.push(0);
        }
        return results;
      }).call(this);
      this.chunks[i] = [[left, right]];
    }
    this.current = 0;
    setInterval(((function(_this) {
      return function() {
        return _this.step();
      };
    })(this)), this.chunk_size / 44100 * 1000);
  }

  AudioBufferizer.prototype.step = function() {
    if (this.current >= this.chunks.length) {
      return;
    }
    this.node.process(null, this.chunks[this.current], null);
    this.current++;
  };

  AudioBufferizer.prototype.flush = function(outputs) {
    var chunk, i, index, j, k, l, left, n, r, ref, ref1, right;
    while (this.current < this.chunks.length) {
      this.step();
    }
    this.current = 0;
    left = outputs[0][0];
    right = outputs[0][1];
    index = 0;
    chunk = 0;
    for (i = j = 0, ref = this.chunks.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      chunk = this.chunks[i];
      l = chunk[0][0];
      r = chunk[0][1];
      for (k = n = 0, ref1 = l.length - 1; 0 <= ref1 ? n <= ref1 : n >= ref1; k = 0 <= ref1 ? ++n : --n) {
        left[index] = l[k];
        right[index] = r[k];
        index += 1;
      }
    }
  };

  return AudioBufferizer;

})();

this.Beeper = (function() {
  function Beeper(audio) {
    var i, j, k, l, len, len1, n, oct, ref, ref1, text;
    this.audio = audio;
    this.notes = {};
    this.plain_notes = {};
    text = [["C", "DO"], ["C#", "DO#", "Db", "REb"], ["D", "RE"], ["D#", "RE#", "Eb", "MIb"], ["E", "MI"], ["F", "FA"], ["F#", "FA#", "Gb", "SOLb"], ["G", "SOL"], ["G#", "SOL#", "Ab", "LAb"], ["A", "LA"], ["A#", "LA#", "Bb", "SIb"], ["B", "SI"]];
    for (i = j = 0; j <= 127; i = j += 1) {
      this.notes[i] = i;
      oct = Math.floor(i / 12) - 1;
      ref = text[i % 12];
      for (k = 0, len = ref.length; k < len; k++) {
        n = ref[k];
        this.notes[n + oct] = i;
      }
      if (oct === -1) {
        ref1 = text[i % 12];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          n = ref1[l];
          this.plain_notes[n] = i;
        }
      }
    }
    this.current_octave = 5;
    this.current_duration = .5;
    this.current_volume = .5;
    this.current_span = 1;
    this.current_waveform = "square";
  }

  Beeper.prototype.beep = function(input) {
    var i, j, k, len, loops, lop, n, note, parsed, ref, ref1, sequence, status, t, test;
    test = "loop 0 square tempo 120 duration 500 volume 50 span 50 DO2 DO - FA SOL SOL FA -";
    status = "normal";
    sequence = [];
    loops = [];
    parsed = input.split(" ");
    for (j = 0, len = parsed.length; j < len; j++) {
      t = parsed[j];
      if (t === "") {
        continue;
      }
      switch (status) {
        case "normal":
          if (this.notes[t] != null) {
            note = this.notes[t];
            this.current_octave = Math.floor(note / 12);
            sequence.push({
              frequency: 440 * Math.pow(Math.pow(2, 1 / 12), note - 69),
              volume: this.current_volume,
              span: this.current_span,
              duration: this.current_duration,
              waveform: this.current_waveform
            });
          } else if (this.plain_notes[t] != null) {
            note = this.plain_notes[t] + this.current_octave * 12;
            sequence.push({
              frequency: 440 * Math.pow(Math.pow(2, 1 / 12), note - 69),
              volume: this.current_volume,
              span: this.current_span,
              duration: this.current_duration,
              waveform: this.current_waveform
            });
          } else if (t === "square" || t === "sine" || t === "saw" || t === "noise") {
            this.current_waveform = t;
          } else if (t === "tempo" || t === "duration" || t === "volume" || t === "span" || t === "loop" || t === "to") {
            status = t;
          } else if (t === "-") {
            sequence.push({
              frequency: 440,
              volume: 0,
              span: this.current_span,
              duration: this.current_duration,
              waveform: this.current_waveform
            });
          } else if (t === "end") {
            if (loops.length > 0 && sequence.length > 0) {
              sequence.push({
                frequency: 440,
                volume: 0,
                span: this.current_span,
                duration: 0,
                waveform: this.current_waveform
              });
              lop = loops.splice(loops.length - 1, 1)[0];
              sequence[sequence.length - 1].loopto = lop.start;
              sequence[sequence.length - 1].repeats = lop.repeats;
            }
          }
          break;
        case "tempo":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t) && t > 0) {
            this.current_duration = 60 / t;
          }
          break;
        case "duration":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t) && t > 0) {
            this.current_duration = t / 1000;
          }
          break;
        case "volume":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t)) {
            this.current_volume = t / 100;
          }
          break;
        case "span":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t)) {
            this.current_span = t / 100;
          }
          break;
        case "loop":
          status = "normal";
          loops.push({
            start: sequence.length
          });
          t = Number.parseFloat(t);
          if (!Number.isNaN(t)) {
            loops[loops.length - 1].repeats = t;
          }
          break;
        case "to":
          status = "normal";
          if (note != null) {
            n = null;
            if (this.notes[t] != null) {
              n = this.notes[t];
            } else if (this.plain_notes[t] != null) {
              n = this.plain_notes[t] + this.current_octave * 12;
            }
            if ((n != null) && n !== note) {
              for (i = k = ref = note, ref1 = n; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
                if (i !== note) {
                  sequence.push({
                    frequency: 440 * Math.pow(Math.pow(2, 1 / 12), i - 69),
                    volume: this.current_volume,
                    span: this.current_span,
                    duration: this.current_duration,
                    waveform: this.current_waveform
                  });
                }
              }
              note = n;
            }
          }
      }
    }
    if (loops.length > 0 && sequence.length > 0) {
      lop = loops.splice(loops.length - 1, 1)[0];
      sequence.push({
        frequency: 440,
        volume: 0,
        span: this.current_span,
        duration: 0,
        waveform: this.current_waveform
      });
      sequence[sequence.length - 1].loopto = lop.start;
      sequence[sequence.length - 1].repeats = lop.repeats;
    }
    return this.audio.addBeeps(sequence);
  };

  return Beeper;

})();

this.Sound = (function() {
  function Sound(audio, url) {
    var request;
    this.audio = audio;
    this.url = url;
    if (this.url instanceof AudioBuffer) {
      this.buffer = this.url;
    } else {
      request = new XMLHttpRequest();
      request.open('GET', this.url, true);
      request.responseType = 'arraybuffer';
      request.onload = (function(_this) {
        return function() {
          return _this.audio.context.decodeAudioData(request.response, function(buffer1) {
            _this.buffer = buffer1;
          });
        };
      })(this);
      request.send();
    }
  }

  Sound.prototype.play = function(volume, pitch, pan, loopit) {
    var gain, panner, playing, res, source;
    if (volume == null) {
      volume = 1;
    }
    if (pitch == null) {
      pitch = 1;
    }
    if (pan == null) {
      pan = 0;
    }
    if (loopit == null) {
      loopit = false;
    }
    if (this.buffer == null) {
      return;
    }
    source = this.audio.context.createBufferSource();
    source.playbackRate.value = pitch;
    source.buffer = this.buffer;
    if (loopit) {
      source.loop = true;
    }
    gain = this.audio.context.createGain();
    gain.gain.value = volume;
    if (false && (this.audio.context.createStereoPanner != null)) {
      panner = this.audio.context.createStereoPanner();
      panner.setPan = function(pan) {
        return panner.pan.value = pan;
      };
    } else {
      panner = this.audio.context.createPanner();
      panner.panningModel = "equalpower";
      panner.setPan = function(pan) {
        return panner.setPosition(pan, 0, 1 - Math.abs(pan));
      };
    }
    panner.setPan(pan);
    source.connect(gain);
    gain.connect(panner);
    panner.connect(this.audio.context.destination);
    source.start();
    playing = null;
    if (loopit) {
      playing = {
        stop: (function(_this) {
          return function() {
            return source.stop();
          };
        })(this)
      };
      this.audio.addPlaying(playing);
    }
    res = {
      stop: (function(_this) {
        return function() {
          source.stop();
          if (playing) {
            _this.audio.removePlaying(playing);
          }
          return 1;
        };
      })(this),
      setVolume: function(volume) {
        return gain.gain.value = Math.max(0, Math.min(1, volume));
      },
      setPitch: function(pitch) {
        return source.playbackRate.value = Math.max(.001, Math.min(1000, pitch));
      },
      setPan: function(pan) {
        return panner.setPan(Math.max(-1, Math.min(1, pan)));
      },
      finished: false
    };
    source.onended = function() {
      return res.finished = true;
    };
    return res;
  };

  Sound.createSoundClass = function(audiocore) {
    return window.MicroSound = (function() {
      function _Class(channels, length, sampleRate) {
        var buffer, ch1, ch2, snd;
        if (sampleRate == null) {
          sampleRate = 44100;
        }
        channels = channels === 1 ? 1 : 2;
        if (!(length > 1) || !(length < 44100 * 1000)) {
          length = 44100;
        }
        if (!(sampleRate >= 8000) || !(sampleRate <= 96000)) {
          sampleRate = 44100;
        }
        buffer = audiocore.context.createBuffer(channels, length, sampleRate);
        snd = new Sound(audiocore, buffer);
        this.channels = channels;
        this.length = length;
        this.sampleRate = sampleRate;
        ch1 = buffer.getChannelData(0);
        if (channels === 2) {
          ch2 = buffer.getChannelData(1);
        }
        this.play = function(volume, pitch, pan, loopit) {
          return snd.play(volume, pitch, pan, loopit);
        };
        this.write = function(channel, position, value) {
          if (channel === 0) {
            return ch1[position] = value;
          } else if (channels === 2) {
            return ch2[position] = value;
          }
        };
        this.read = function(channel, position) {
          if (channel === 0) {
            return ch1[position];
          } else if (channels === 2) {
            return ch2[position];
          } else {
            return 0;
          }
        };
      }

      return _Class;

    })();
  };

  return Sound;

})();

this.Music = (function() {
  function Music(audio, url) {
    this.audio = audio;
    this.url = url;
    this.tag = new Audio(this.url);
    this.playing = false;
  }

  Music.prototype.play = function(volume, loopit) {
    if (volume == null) {
      volume = 1;
    }
    if (loopit == null) {
      loopit = false;
    }
    this.playing = true;
    this.tag.loop = loopit ? true : false;
    this.tag.volume = volume;
    if (this.audio.isStarted()) {
      this.tag.play();
    } else {
      this.audio.addToWakeUpList(this);
    }
    this.audio.addPlaying(this);
    return {
      play: (function(_this) {
        return function() {
          return _this.tag.play();
        };
      })(this),
      stop: (function(_this) {
        return function() {
          _this.playing = false;
          _this.tag.pause();
          return _this.audio.removePlaying(_this);
        };
      })(this),
      setVolume: (function(_this) {
        return function(volume) {
          return _this.tag.volume = Math.max(0, Math.min(1, volume));
        };
      })(this),
      getPosition: (function(_this) {
        return function() {
          return _this.tag.currentTime;
        };
      })(this),
      getDuration: (function(_this) {
        return function() {
          return _this.tag.duration;
        };
      })(this),
      setPosition: (function(_this) {
        return function(pos) {
          _this.tag.pause();
          _this.tag.currentTime = Math.max(0, Math.min(_this.tag.duration, pos));
          if (_this.playing) {
            return _this.tag.play();
          }
        };
      })(this)
    };
  };

  Music.prototype.wakeUp = function() {
    if (this.playing) {
      return this.tag.play();
    }
  };

  Music.prototype.stop = function() {
    this.playing = false;
    return this.tag.pause();
  };

  return Music;

})();

this.Player = (function() {
  function Player(listener) {
    var i, len, ref, source;
    this.listener = listener;
    this.source_count = 0;
    this.sources = {};
    this.resources = resources;
    if (resources.sources != null) {
      ref = resources.sources;
      for (i = 0, len = ref.length; i < len; i++) {
        source = ref[i];
        this.loadSource(source);
      }
    } else {
      this.sources.main = document.getElementById("code").innerText;
      this.start();
    }
  }

  Player.prototype.loadSource = function(source) {
    var req;
    req = new XMLHttpRequest();
    req.onreadystatechange = (function(_this) {
      return function(event) {
        var name;
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            name = source.file.split(".")[0];
            _this.sources[name] = req.responseText;
            _this.source_count++;
            if (_this.source_count >= resources.sources.length && (_this.runtime == null)) {
              return _this.start();
            }
          }
        }
      };
    })(this);
    req.open("GET", location.origin + location.pathname + ("ms/" + source.file + "?v=" + source.version));
    return req.send();
  };

  Player.prototype.start = function() {
    var touchListener, touchStartListener, wrapper;
    this.runtime = new Runtime((window.exported_project ? "" : location.origin + location.pathname), this.sources, resources, this);
    this.client = new PlayerClient(this);
    wrapper = document.getElementById("canvaswrapper");
    wrapper.appendChild(this.runtime.screen.canvas);
    window.addEventListener("resize", (function(_this) {
      return function() {
        return _this.resize();
      };
    })(this));
    this.resize();
    touchStartListener = (function(_this) {
      return function(event) {
        event.preventDefault();
        _this.runtime.screen.canvas.removeEventListener("touchstart", touchStartListener);
        return true;
      };
    })(this);
    touchListener = (function(_this) {
      return function(event) {
        _this.setFullScreen();
        return true;
      };
    })(this);
    this.runtime.screen.canvas.addEventListener("touchstart", touchStartListener);
    this.runtime.screen.canvas.addEventListener("touchend", touchListener);
    this.runtime.start();
    window.addEventListener("message", (function(_this) {
      return function(msg) {
        return _this.messageReceived(msg);
      };
    })(this));
    return this.postMessage({
      name: "focus"
    });
  };

  Player.prototype.resize = function() {
    var file, ref, results, src;
    this.runtime.screen.resize();
    if (this.runtime.vm != null) {
      if (this.runtime.vm.context.global.draw == null) {
        this.runtime.update_memory = {};
        ref = this.runtime.sources;
        results = [];
        for (file in ref) {
          src = ref[file];
          results.push(this.runtime.updateSource(file, src, false));
        }
        return results;
      } else if (this.runtime.stopped) {
        return this.runtime.drawCall();
      }
    }
  };

  Player.prototype.setFullScreen = function() {
    var ref;
    if ((document.documentElement.webkitRequestFullScreen != null) && !document.webkitIsFullScreen) {
      document.documentElement.webkitRequestFullScreen();
    } else if ((document.documentElement.requestFullScreen != null) && !document.fullScreen) {
      document.documentElement.requestFullScreen();
    } else if ((document.documentElement.mozRequestFullScreen != null) && !document.mozFullScreen) {
      document.documentElement.mozRequestFullScreen();
    }
    if ((window.screen != null) && (window.screen.orientation != null) && ((ref = window.orientation) === "portrait" || ref === "landscape")) {
      return window.screen.orientation.lock(window.orientation).then(null, function(error) {});
    }
  };

  Player.prototype.reportError = function(err) {
    return this.postMessage({
      name: "error",
      data: err
    });
  };

  Player.prototype.log = function(text) {
    return this.postMessage({
      name: "log",
      data: text
    });
  };

  Player.prototype.codePaused = function() {
    return this.postMessage({
      name: "code_paused"
    });
  };

  Player.prototype.exit = function() {
    return this.postMessage({
      name: "exit"
    });
  };

  Player.prototype.messageReceived = function(msg) {
    var code, data, err, file;
    data = msg.data;
    try {
      data = JSON.parse(data);
      switch (data.name) {
        case "command":
          return this.runtime.runCommand(data.line, (function(_this) {
            return function(res) {
              if (!data.line.trim().startsWith("print")) {
                return _this.postMessage({
                  name: "output",
                  data: res,
                  id: data.id
                });
              }
            };
          })(this));
        case "pause":
          return this.runtime.stop();
        case "step_forward":
          return this.runtime.stepForward();
        case "resume":
          return this.runtime.resume();
        case "code_updated":
          code = data.code;
          file = data.file.split(".")[0];
          if (this.runtime.vm != null) {
            this.runtime.vm.clearWarnings();
          }
          return this.runtime.updateSource(file, code, true);
        case "sprite_updated":
          file = data.file;
          return this.runtime.updateSprite(file, 0, data.data, data.properties);
        case "map_updated":
          file = data.file;
          return this.runtime.updateMap(file, 0, data.data);
        case "take_picture":
          this.runtime.screen.takePicture((function(_this) {
            return function(pic) {
              return _this.postMessage({
                name: "picture_taken",
                data: pic
              });
            };
          })(this));
          if (this.runtime.stopped) {
            return this.runtime.drawCall();
          }
          break;
        case "time_machine":
          return this.runtime.time_machine.messageReceived(data);
        case "watch":
          return this.runtime.watch(data.list);
        case "stop_watching":
          return this.runtime.stopWatching();
      }
    } catch (error1) {
      err = error1;
      return console.error(err);
    }
  };

  Player.prototype.call = function(name, args) {
    if ((this.runtime != null) && (this.runtime.vm != null)) {
      return this.runtime.vm.call(name, args);
    }
  };

  Player.prototype.setGlobal = function(name, value) {
    if ((this.runtime != null) && (this.runtime.vm != null)) {
      return this.runtime.vm.context.global[name] = value;
    }
  };

  Player.prototype.exec = function(command, callback) {
    if (this.runtime != null) {
      return this.runtime.runCommand(command, callback);
    }
  };

  Player.prototype.postMessage = function(data) {
    var err;
    if (window !== window.parent) {
      window.parent.postMessage(JSON.stringify(data), "*");
    }
    if (this.listener != null) {
      try {
        return this.listener(data);
      } catch (error1) {
        err = error1;
        return console.error(err);
      }
    }
  };

  return Player;

})();

if ((navigator.serviceWorker != null) && !window.skip_service_worker) {
  navigator.serviceWorker.register('sw.js', {
    scope: location.pathname
  }).then(function(reg) {
    return console.log('Registration succeeded. Scope is' + reg.scope);
  })["catch"](function(error) {
    return console.log('Registration failed with' + error);
  });
}

this.PlayerClient = (function() {
  function PlayerClient(player) {
    var err;
    this.player = player;
    this.pending_requests = {};
    this.request_id = 0;
    this.version_checked = false;
    this.reconnect_delay = 1000;
    if (location.protocol.startsWith("http")) {
      try {
        this.connect();
      } catch (error) {
        err = error;
        console.error(err);
      }
      setInterval(((function(_this) {
        return function() {
          if (_this.socket != null) {
            return _this.sendRequest({
              name: "ping"
            });
          }
        };
      })(this)), 30000);
    }
  }

  PlayerClient.prototype.connect = function() {
    this.socket = new WebSocket(window.location.origin.replace("http", "ws"));
    this.socket.onmessage = (function(_this) {
      return function(msg) {
        var err;
        console.info("received: " + msg.data);
        try {
          msg = JSON.parse(msg.data);
          if (msg.request_id != null) {
            if (_this.pending_requests[msg.request_id] != null) {
              _this.pending_requests[msg.request_id](msg);
              delete _this.pending_requests[msg.request_id];
            }
          }
          if (msg.name === "project_file_updated") {
            _this.player.runtime.projectFileUpdated(msg.type, msg.file, msg.version, msg.data, msg.properties);
          }
          if (msg.name === "project_file_deleted") {
            _this.player.runtime.projectFileDeleted(msg.type, msg.file);
          }
          if (msg.name === "project_options_updated") {
            return _this.player.runtime.projectOptionsUpdated(msg);
          }
        } catch (error) {
          err = error;
          return console.error(err);
        }
      };
    })(this);
    this.socket.onopen = (function(_this) {
      return function() {
        var i, j, k, len, len1, len2, maps, project, ref, ref1, ref2, s, sources, sprites, user;
        _this.reconnect_delay = 1000;
        user = location.pathname.split("/")[1];
        project = location.pathname.split("/")[2];
        _this.send({
          name: "listen_to_project",
          user: user,
          project: project
        });
        if (!_this.version_checked) {
          _this.version_checked = true;
          sprites = {};
          maps = {};
          sources = {};
          ref = _this.player.resources.images;
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            sprites[s.file.split(".")[0]] = s.version;
          }
          ref1 = _this.player.resources.maps;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            s = ref1[j];
            maps[s.file.split(".")[0]] = s.version;
          }
          ref2 = _this.player.resources.sources;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            s = ref2[k];
            sources[s.file.split(".")[0]] = s.version;
          }
          return _this.sendRequest({
            name: "get_file_versions",
            user: user,
            project: project
          }, function(msg) {
            var info, name, ref3, ref4, ref5, results, v;
            ref3 = msg.data.sources;
            for (name in ref3) {
              info = ref3[name];
              v = sources[name];
              if ((v == null) || v !== info.version) {
                _this.player.runtime.projectFileUpdated("ms", name, info.version, null, info.properties);
              }
            }
            ref4 = msg.data.sprites;
            for (name in ref4) {
              info = ref4[name];
              v = sprites[name];
              if ((v == null) || v !== info.version) {
                _this.player.runtime.projectFileUpdated("sprites", name, info.version, null, info.properties);
              }
            }
            ref5 = msg.data.maps;
            results = [];
            for (name in ref5) {
              info = ref5[name];
              v = maps[name];
              if ((v == null) || v !== info.version) {
                results.push(_this.player.runtime.projectFileUpdated("maps", name, info.version, null, info.properties));
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        }
      };
    })(this);
    return this.socket.onclose = (function(_this) {
      return function() {
        setTimeout((function() {
          return _this.connect();
        }), _this.reconnect_delay);
        return _this.reconnect_delay += 1000;
      };
    })(this);
  };

  PlayerClient.prototype.send = function(data) {
    return this.socket.send(JSON.stringify(data));
  };

  PlayerClient.prototype.sendRequest = function(msg, callback) {
    msg.request_id = this.request_id++;
    this.pending_requests[msg.request_id] = callback;
    return this.send(msg);
  };

  return PlayerClient;

})();

