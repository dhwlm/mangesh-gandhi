(function ($) {
  "use strict"; var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } var

    PI = Math.PI, cos = Math.cos, sin = Math.sin, abs = Math.abs, random = Math.random, atan2 = Math.atan2;
  var TAU = 2 * PI;
  var rand = function rand(n) { return n * random(); };
  var randIn = function randIn(min, max) { return rand(max - min) + min; };
  var fadeInOut = function fadeInOut(t, m) {
    var hm = 0.5 * m;
    return abs((t + hm) % m - hm) / hm;
  };
  var angle = function angle(x1, y1, x2, y2) { return atan2(y2 - y1, x2 - x1); };
  var lerp = function lerp(n1, n2, speed) { return (1 - speed) * n1 + speed * n2; };

  var particleCount = 200;

  var canvas = void 0;
  var ctx = void 0;
  var hover = void 0;
  var mouse = void 0;
  var origin = void 0;
  var particles = void 0;

  function getParticle() {
    var particle = {
      get alpha() {
        return fadeInOut(this.life, this.ttl);
      },
      init: function init() {
        var _window =
          window, innerWidth = _window.innerWidth, innerHeight = _window.innerHeight;
        var direction = rand(TAU);
        var speed = randIn(20, 40);

        this.life = 0;
        this.ttl = randIn(100, 300);
        this.size = randIn(2, 8);
        this.hue = randIn(250, 320);
        this.size = randIn(2, 8);
        this.hue = randIn(250, 320);
        this.position = [
          origin[0] + rand(200) * cos(direction),
          origin[1] + rand(200) * sin(direction)];

        this.velocity = [cos(direction) * speed, sin(direction) * speed];
      },
      checkBounds: function checkBounds() {
        var _position = _slicedToArray(
          this.position, 2), x = _position[0], y = _position[1];

        return (
          x > canvas.a.width + this.size ||
          x < -this.size ||
          y > canvas.a.height + this.size ||
          y < -this.size);

      },
      update: function update() {
        var _position2 = _slicedToArray(
          this.position, 2), x = _position2[0], y = _position2[1]; var _velocity = _slicedToArray(
            this.velocity, 2), vX = _velocity[0], vY = _velocity[1];
        var mDirection = angle.apply(undefined, _toConsumableArray(mouse).concat(_toConsumableArray(this.position)));
        this.position[0] = lerp(x, x + vX, 0.05);
        this.position[1] = lerp(y, y + vY, 0.05);
        this.velocity[0] = lerp(
          vX,
          hover ? cos(mDirection) * 30 : 0,
          hover ? 0.1 : 0.01);

        this.velocity[1] = lerp(
          vY,
          hover ? sin(mDirection) * 30 : 0,
          hover ? 0.1 : 0.01);

        (this.checkBounds() || this.life++ > this.ttl) && this.init();

        return this;
      },
      draw: function draw() {
        var _ctx$a;
        ctx.a.save();
        ctx.a.beginPath();
        ctx.a.fillStyle = "hsla(" + this.hue + ",50%,50%," + this.alpha + ")";
        (_ctx$a = ctx.a).arc.apply(_ctx$a, _toConsumableArray(this.position).concat([this.size, 0, TAU]));
        ctx.a.fill();
        ctx.a.closePath();
        ctx.a.restore();

        return this;
      }
    };


    particle.init();

    return particle;
  }

  function initParticles() {
    particles = [];

    for (var i = 0; i < particleCount; i++) {
      particles.push(getParticle());
    }
  }

  function setup() {
    canvas = {
      a: document.createElement("canvas"),
      b: document.createElement("canvas")
    };

    canvas.b.style = "\n\t\topacity: 0.16;\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t";


    document.body.appendChild(canvas.b);

    ctx = {
      a: canvas.a.getContext("2d"),
      b: canvas.b.getContext("2d")
    };


    mouse = [0, 0];
    origin = [];

    resize();
    initParticles();
    draw();
  }

  function resize() {
    var _window2 =
      window, innerWidth = _window2.innerWidth, innerHeight = _window2.innerHeight;

    canvas.a.width = canvas.b.width = innerWidth;
    canvas.a.height = canvas.b.height = innerHeight;

    origin[0] = 0.5 * innerWidth;
    origin[1] = 0.5 * innerHeight;
  }

  function mouseHandler(event) {
    var
    type = event.type, clientX = event.clientX, clientY = event.clientY;

    hover = type === "mousemove";

    mouse[0] = clientX;
    mouse[1] = clientY;
  }

  function draw() {
    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
    ctx.b.fillStyle = "rgba(20,20,20,0.8)";
    ctx.b.fillRect(0, 0, canvas.a.width, canvas.a.height);

    for (var _i = 0; _i < particles.length; _i++) {
      particles[_i].draw().update();
    }

    var i = void 0, amt = void 0;

    for (i = 20; i >= 1; i--) {
      var _ctx$b;
      amt = i * 0.05;
      ctx.b.save();
      ctx.b.filter = "blur(" + amt * 5 + "px)";
      ctx.b.globalAlpha = 1 - amt;
      ctx.b.setTransform(1 - amt, 0, 0, 1 - amt, origin[0] * amt, origin[1] * amt);
      (_ctx$b = ctx.b).translate.apply(_ctx$b, _toConsumableArray(origin));
      ctx.b.rotate(amt * 8);
      ctx.b.translate(-origin[0], -origin[1]);
      ctx.b.drawImage(canvas.a, 0, 0, canvas.b.width, canvas.b.height);
      ctx.b.restore();
    }

    ctx.b.save();
    ctx.b.filter = "blur(8px) brightness(200%)";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();

    ctx.b.save();
    ctx.b.globalCompositeOperation = "lighter";
    ctx.b.drawImage(canvas.a, 0, 0);
    ctx.b.restore();

    window.requestAnimationFrame(draw);
  }

  window.addEventListener("load", setup);
  window.addEventListener("mousemove", mouseHandler);
  window.addEventListener("mouseout", mouseHandler);
  window.addEventListener("resize", resize);
})(jQuery);