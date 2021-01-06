var utils = {
    norm: function (value, min, max) {
        return (value - min) / (max - min);
    },

    lerp: function (norm, min, max) {
        return (max - min) * norm + min;
    },

    distance: function (p0, p1) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY: function (x0, y0, x1, y1) {
        var dx = x1 - x0,
            dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    rangeIntersect: function (min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    },

    degreesToRads: function (degrees) {
        return degrees / 180 * Math.PI;
    },

    randomInt: function (min, max) {
        return min + Math.random() * (max - min + 1);
    }
}

function update() {

    setTimeout(function () {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < message.placement.length; i++) {
            message.placement[i].update();
        }
        requestAnimationFrame(update);
    }, 1000 / fps);
}

function particle(x, y, type) {
    this.radius = 1.1;
    this.futurRadius = utils.randomInt(radius, radius + 3);


    this.rebond = utils.randomInt(1, 5);
    this.x = x;
    this.y = y;

    this.dying = false;

    this.base = [x, y]

    this.vx = 0;
    this.vy = 0;
    this.type = type;
    this.friction = .99;
    this.gravity = gravity;
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.getSpeed = function () {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    };

    this.setSpeed = function (speed) {
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    };

    this.getHeading = function () {
        return Math.atan2(this.vy, this.vx);
    };

    this.setHeading = function (heading) {
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    };

    this.angleTo = function (p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);

    };

    this.update = function (heading) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;

        this.vx *= this.friction;
        this.vy *= this.friction;

        if (this.radius < this.futurRadius && this.dying === false) {
            this.radius += duration;
        } else {
            this.dying = true;
        }

        if (this.dying === true) {
            this.radius -= duration;


        }


        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        if (this.y < 0 || this.radius < 1) {
            this.x = this.base[0];
            this.dying = false;
            this.y = this.base[1];
            this.radius = 1.1;
            this.setSpeed(speed);
            this.futurRadius = utils.randomInt(radius, radius + 3);
            this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
        }

    };

    this.setSpeed(utils.randomInt(.1, .5));
    this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));

}

function shape(x, y, texte) {
    this.x = x;
    this.y = y;
    this.size = 100;

    this.text = texte;
    this.placement = [];
    this.vectors = [];

}

shape.prototype.getValue = function () {
    // Draw the shape :^)
    ctx.textAlign = "center";
    ctx.font = "bold " + this.size + "px arial";
    ctx.fillText(this.text, this.x, this.y);
    var idata = ctx.getImageData(0, 0, W, H);
    var buffer32 = new Uint32Array(idata.data.buffer);
    for (var y = 0; y < H; y += gridY) {
        for (var x = 0; x < W; x += gridX) {
            if (buffer32[y * W + x]) {
                this.placement.push(new particle(x, y));
            }
        }
    }
    ctx.clearRect(0, 0, W, H);
}

function change(text) {
    ctx.clearRect(0, 0, W, H);
    message.placement = [];
    message.text = text;
    message.getValue();
}



canvas = document.getElementById("main_canvas");
var ctx = canvas.getContext('2d');
W = canvas.width = window.innerWidth;
H = canvas.height = window.innerHeight;
var fps = 100;

gridX = 5;
gridY = 5;

colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722'
];


let strArr = ['新年快乐','2021','happy new year']
let nowIndex = 0
gravity = 0; // 1 - -1
duration = 0.4; // 0.1-0.99
resolution = 0.1; // 0-5
speed = 0; // 0-5
radius = 3; // 3-20

var message = new shape(W / 2, H / 2 + 50, strArr[nowIndex]);
nowIndex++
message.getValue();

update();

setInterval(() => {
    this.change(strArr[nowIndex])
    nowIndex>=2?nowIndex=0:nowIndex++
}, 10*1000);