var actors = [];
var ship;
var saucer;

// The sprite handle (x,y) is at the center of the sprite
function Sprite(x, y, vx, vy, polygon) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.polygon = polygon;

    this.move = function () {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width;
        }

        if (this.y > canvas.height) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = canvas.height;
        }
    };

    this.collidesWith = function (sprite) {
        return spritesCollide(this, sprite);
    }
}

function spritesCollide(sprite1, sprite2) {
    var polygon1 = sprite1.polygon;
    var polygon2 = sprite2.polygon;

    return !(sprite1.x + polygon1.boundingBox()[2][0] < sprite2.x + polygon2.boundingBox()[0][0] ||
    sprite2.x + polygon2.boundingBox()[2][0] < sprite1.x + polygon1.boundingBox()[0][0] ||
    sprite1.y + polygon1.boundingBox()[2][1] < sprite2.y + polygon2.boundingBox()[0][1] ||
    sprite2.y + polygon2.boundingBox()[2][1] < sprite1.y + polygon1.boundingBox()[0][1]);
}

function ShipSprite(x, y) {
    this.name = "ship";
    this.origPoints = [[0, -10], [6, 10], [3, 7], [-3, 7], [-6, 10], [0, -10]];
    this.angle = 0;
    this.acceleration = 0.3;
    this.maxVelocity = 150;
    this.blurCount = 8;
    this.angleIncrement = 5.0;
    this.missiles = [];
    this.missileTtl = 50;
    this.sprite = new Sprite(x, y, 0.0, 0.0, new Polygon(this.origPoints, '#0000ff', this.blurCount, '#ffffff'));

    this.rotate = function (direction) {
        this.angle += this.angleIncrement * direction;
        this.sprite.polygon.points = this.origPoints.map(function (polygonPoint) {
            return rotatePoint(polygonPoint, ship.angle);
        })
    };

    this.thrust = function thrust() {
        var oldVx = this.sprite.vx;
        var oldVy = this.sprite.vy;
        this.sprite.vx -= this.acceleration * Math.sin(degreesToRadians(this.angle));
        this.sprite.vy -= this.acceleration * Math.cos(degreesToRadians(this.angle));
        if (hypotSquared(this.sprite.vx, this.sprite.vy) > this.maxVelocity) {
            this.sprite.vx = oldVx;
            this.sprite.vy = oldVy;
        }
    };

    this.fire = function () {
        if (this.missiles.length <= 3) {
            playSound('shipMissile');
            var missile = new MissileSprite(this.sprite.x, this.sprite.y, this.angle, this, -13, this.missileTtl);
            missile.move();
            actors.push(missile);
            this.missiles.push(missile);
        }
    };

    this.move = function () {
        this.sprite.move();
    }
}

function MissileSprite(x, y, angle, ship, vel, ttl) {
    this.name = "missile";
    this.missilePoints = [[0, -1], [1, 0], [-1, 0]];
    this.blurCount = 2;
    this.ttl = ttl;
    this.ship = ship;

    var vx = vel * Math.sin(degreesToRadians(angle));
    var vy = vel * Math.cos(degreesToRadians(angle));

    this.sprite = new Sprite(x, y, vx, vy, new Polygon(this.missilePoints, '#ffff00', this.blurCount, '#ffff00'));

    this.move = function () {
        this.ttl--;
        this.sprite.move();
        if (this.ttl < 0) {
            var i = actors.indexOf(this);
            if (i !== -1) {
                actors.splice(i, 1);
            }

            i = this.ship.missiles.indexOf(this);
            if (i !== -1) {
                this.ship.missiles.splice(i, 1);
            }
        }
    }
}

var rockType = 1;
function RockSprite(x, y, sizeIndex) {
    var rockPointsType1 = [[-4, -12], [6, -12], [13, -4], [13, 5],
        [6, 13], [0, 13], [0, 4], [-8, 13], [-15, 4], [-7, 1],
        [-15, -3]];

    var rockPointsType2 = [[-6, -12], [1, -5], [8, -12], [15, -5],
        [12, 0], [15, 6], [5, 13], [-7, 13], [-14, 7],
        [-14, -5]];

    var rockPointsType3 = [[-7, -12], [1, -9], [8, -12], [15, -5],
        [8, -3], [15, 4], [8, 12], [-3, 10], [-6, 12],
        [-14, 7], [-10, 0], [-14, -5]];

    var rockPointsType4 = [[-7, -11], [3, -11], [13, -5], [13, -2],
        [2, 2], [13, 8], [6, 14], [2, 10], [-7, 14], [-15, 5],
        [-15, -5], [-5, -5]];

    var rockTypes = [rockPointsType1, rockPointsType2, rockPointsType3, rockPointsType4];
        var velocities = [1.5, 3.0, 4.5];
    var scales = [2.5, 1.5, 0.6];
    var colours = ['#00ff00', '#00ff00', '#00ff00'];
    var blurCounts = [3, 3, 2];

    this.sizeIndex = sizeIndex;
    this.scale = scales[sizeIndex];
    this.blurCount = blurCounts[sizeIndex];
    this.name = "rock";
    var rockRef = this;
    var points = rockTypes[rockType].map(function (polygonPoint) {
        return scalePoint(polygonPoint, rockRef.scale);
    });

    var velocity = velocities[sizeIndex] + (level / 5);
    var vx = (Math.random() * (velocity * 2)) - velocity;
    var vy = (Math.random() * (velocity * 2)) - velocity;
    this.sprite = new Sprite(x, y, vx, vy, new Polygon(points, colours[sizeIndex], this.blurCount, colours[sizeIndex]));

    if (++rockType > 3) {
        rockType = 0;
    }

    this.move = function () {
        this.sprite.move();
    }
}

function DebrisSprite(x, y) {
    this.name = "debris";
    this.points = [[0, -1], [1, 0], [-1, 0]];
    this.blurCount = 2;
    this.ttl = 50;
    this.redValue = 255;
    this.ship = ship;

    var vel = 10;
    var vx = (0.5 - Math.random()) * vel;
    var vy = (0.5 - Math.random()) * vel;
    this.sprite = new Sprite(x, y, vx, vy, new Polygon(this.points, '#ff0000', this.blurCount, '#ff0000'));

    this.move = function () {
        this.ttl--;
        this.redValue -= 4;
        this.sprite.polygon.strokeStyle = "rgb(" + this.redValue + ", 0, 0)";
        this.sprite.move();
        if (this.ttl < 0) {
            var i = actors.indexOf(this);
            if (i !== -1) {
                actors.splice(i, 1);
            }
        }
    }
}

function Saucer(x, y, sizeIndex) {
    var velocities = [2.7, 4.0];
    var scales = [2, 1.2];
    var scores = [500 + (level * 10), 1000 + (level * 100)];
    var colours = ['#ffff00', '#9370DB'];
    var blurCounts = [2, 2];
    var missileVelocities = [5 + (level/2), 7 + (level/2)];
    var missileTtls = [100, 120];

    this.sizeIndex = sizeIndex;
    this.scale = scales[sizeIndex];
    this.blurCount = blurCounts[sizeIndex];
    this.name = "saucer";
    this.points = [[-9, 0], [-3, -3], [-2, -6], [-2, -6], [2, -6], [3, -3], [9, 0], [-9, 0], [-3, 4], [3, 4], [9, 0]];
    this.missiles = [];
    this.score = scores[sizeIndex];
    this.missileTtl = missileTtls[sizeIndex];
    this.missileVelocity = missileVelocities[sizeIndex];

    var vel = velocities[sizeIndex];
    var vx = vel * Math.sin(degreesToRadians(Math.random() * 360));
    var vy = vel * Math.cos(degreesToRadians(Math.random() * 360));
    var saucerRef = this;
    var points = this.points.map(function (polygonPoint) {
        return scalePoint(polygonPoint, saucerRef.scale);
    });

    this.sprite = new Sprite(x, y, vx, vy, new Polygon(points, colours[sizeIndex], this.blurCount, colours[sizeIndex]));

    this.move = function () {
        this.fire();
        this.sprite.move();
    };

    this.fire = function () {
        if ((this.missiles.length === 0) && (gameState === "playing")) {
            playSound('saucerMissile');
            var dx = ship.sprite.x - this.sprite.x;
            var dy = ship.sprite.y - this.sprite.y;
            var angle = Math.atan2(dx, dy) * (180/Math.PI);
            var missile = new MissileSprite(this.sprite.x, this.sprite.y, angle, this, this.missileVelocity, this.missileTtl);
            missile.move();
            actors.push(missile);
            this.missiles.push(missile);
        }
    };

}
