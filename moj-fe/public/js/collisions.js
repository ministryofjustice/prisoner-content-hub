function checkCollisions() {
    if (gameState !== 'attract') {
        var foundARock = false;
        for (var i = actors.length - 1; i >= 0; i--) {
            var actor = actors[i];
            if (actor.name === "rock") {
                foundARock = true;
                checkRockCollisions(actor)
            }
        }

        if (foundARock === false) {
            levelUp();
        }

    }
    checkSaucerCollisions();
}

function checkRockCollisions(rock) {
    if (gameState === "playing") {
        var rockWasHit = false;
        var shipWasHit = false;
        var saucerWasHit = false;
        ship.missiles.forEach(function (missile) {
            if (missile.sprite.collidesWith(rock.sprite)) {
                removeSprite(actors, missile);
                removeSprite(ship.missiles, missile);
                rockWasHit = true;
            }
        });

        if (saucer) {
            saucer.missiles.forEach(function (missile) {
                if (missile.sprite.collidesWith(rock.sprite)) {
                    removeSprite(saucer.missiles, missile);
                    removeSprite(actors, missile);
                    rockWasHit = true;
                }
            });
        }


        if (ship.sprite.collidesWith(rock.sprite)) {
            rockWasHit = true;
            shipWasHit = true;
        }

        if ((saucer) && saucer.sprite.collidesWith(rock.sprite)) {
            rockWasHit = true;
            saucerWasHit = true;
        }

        if (rockWasHit) {
            rockHit(rock);
        }

        if (shipWasHit) {
            shipHit();
        }

        if (saucerWasHit) {
            saucerHit();
        }
    }
}

function rockHit(rock) {
    removeSprite(actors, rock);
    addDebris(rock.sprite.x, rock.sprite.y);
    var newRockSize = null;
    if (rock.sizeIndex === 0) {
        playSound('explosion1');
        newRockSize = 1;
        score += 50;
    } else if (rock.sizeIndex === 1) {
        playSound('explosion2');
        newRockSize = 2;
        score += 100;
    } else {
        playSound('explosion3');
        score += 200;
    }

    if (newRockSize !== null) {
        for (var i = 0; i < 2; i++) {
            var newRock = new RockSprite(rock.sprite.x, rock.sprite.y, newRockSize);
            actors.push(newRock);
        }
    }
}

function addDebris(x, y) {
    for (var i = 0; i < 20; i++) {
        var debris = new DebrisSprite(x, y);
        actors.push(debris);
    }
}

function shipHit() {
    playSound('explosion2');
    removeSprite(actors, ship);
    addDebris(ship.sprite.x, ship.sprite.y);
    lives--;
    explodingCount = 0;
    gameState = "exploding"
}

function removeSprite(collection, actor) {
    var i = collection.indexOf(actor);
    if (i !== -1) {
        collection.splice(i, 1);
    }
}

function saucerHit() {
    saucer.sizeIndex === 0 ? stopSound('largeSaucer') : stopSound('smallSaucer');
    playSound('explosion2');
    removeSprite(actors, saucer);
    addDebris(saucer.sprite.x, saucer.sprite.y);
    saucer = null;
    totalFrameCount = 0;
}

function checkSaucerCollisions() {
    var saucerWasHit = false;
    var shipWasHit = false;
    if (saucer) {
        ship.missiles.forEach(function (missile) {
            if ((missile.sprite.collidesWith(saucer.sprite))) {
                saucerWasHit = true;
                score += saucer.score;
                removeSprite(ship.missiles, missile);
                removeSprite(actors, missile);
            }
        });

        saucer.missiles.forEach(function (missile) {
            if (missile.sprite.collidesWith(ship.sprite)) {
                shipWasHit = true;
                removeSprite(saucer.missiles, missile);
                removeSprite(actors, missile);
            }
        });

        if (ship.sprite.collidesWith(saucer.sprite)) {
            shipWasHit = true;
            saucerWasHit = true;
        }

        if (shipWasHit) {
            shipHit();
        }

        if (saucerWasHit) {
            saucerHit();
        }
    }
}