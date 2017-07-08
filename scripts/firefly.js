// Inspired largely from: https://codepen.io/andrewreifman/pen/vgGjb

function FireflyField(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.fireflies = new Array();
    this.interval = 25;
    this.count = 20;

    this.timer = null;

    this.width = canvas.parentNode.offsetWidth;
    this.height = canvas.parentNode.offsetHeight;
}

FireflyField.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.canvas.setAttribute('width', width + 'px');
    this.canvas.setAttribute('height', height + 'px');

    this.fireflies.forEach(function(firefly) {
        firefly.width = width;
        firefly.height = height;
    });
}

FireflyField.prototype.start = function() {
    if (this.timer) { return; }

    this.resize(this.width, this.height);

    for(var i = 0; i < this.count; i++) {
        this.fireflies[i] = new Firefly(this.context, this.interval, this.width, this.height);
        this.fireflies[i].reset(true);
        this.fireflies[i].t0 -= Math.random() * this.fireflies[i].lifespan;
    }

    this.timer = setInterval(this.draw.bind(this), this.interval);
}

FireflyField.prototype.stop = function() {
    if (!this.timer) { return; }

    clearTimeout(this.timer);
    this.timer = null;
}

FireflyField.prototype.draw = function() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.fireflies.forEach(function(firefly) {
        firefly.draw();
    });
}


function Firefly(context, interval, width, height) {
    this.context = context;
    this.interval = interval;
    this.width = width;
    this.height = height;

    this.reset();
}

Firefly.prototype.reset = function(init) {
    this.x = this.width * Math.random();
    this.y = this.height * Math.random();

    var rmax = 10;

    this.radius = ((rmax - 1) * Math.random()) + 1;

    var v = 0.2 + 0.8 * Math.random();
    var a = Math.PI * 2 * Math.random();
    this.dx = 3 * v * Math.cos(a);
    this.dy = 1 * v * Math.sin(a);

    var ttl = 5000 + Math.random() * 6000;

    this.halflife = (ttl / this.interval) * (this.radius / rmax);
    if (init) {
        this.rt = Math.random() * this.halflife;
    } else {
        this.rt = this.halflife;
    }
    this.drt = -(Math.random() + 1);

    this.gradientStop = Math.random() * 0.2 + 0.4;
}

Firefly.prototype.draw = function() {

    // Next Step
    this.rt += this.drt;

    if (this.rt >= this.halflife) {
        this.reset();
        return;
    }

    var alpha = this.rt / this.halflife;

    // Move
    this.x += alpha * this.dx;
    this.y += alpha * this.dy;

    // Bounce off the wall
    if (this.x > this.width || this.x < 0) { this.dx *= -1; }
    if (this.y > this.height || this.y < 0) { this.dy *= -1; }

    if (this.rt <= 0 || this.rt >= this.halflife) {
        this.drt = this.drt * -1;
    }

    var opacity = 1 - alpha;

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.context.closePath();

    var cr = this.radius * opacity;

    var gradient = this.context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
    gradient.addColorStop(0.0, 'rgba(208,230,108,' + opacity + ')');
    gradient.addColorStop(this.gradientStop, 'rgba(208,230,108,' + (opacity * 0.2) + ')');
    gradient.addColorStop(1.0, 'rgba(208,230,108,0)');
    this.context.fillStyle = gradient;

    this.context.fill();
}
