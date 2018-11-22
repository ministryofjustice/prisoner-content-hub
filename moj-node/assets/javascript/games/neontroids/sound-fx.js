var oneOffSounds = {
    shipMissile: new Audio('/public/javascript/games/neontroids/sounds/ship-missile.mp3'),
    saucerMissile: new Audio('/public/javascript/games/neontroids/sounds/saucer-missile.mp3'),
    explosion1: new Audio('/public/javascript/games/neontroids/sounds/explosion1.mp3'),
    explosion2: new Audio('/public/javascript/games/neontroids/sounds/explosion2.mp3'),
    explosion3: new Audio('/public/javascript/games/neontroids/sounds/explosion3.mp3'),
    thumpLow: new Audio('/public/javascript/games/neontroids/sounds/thump-low.mp3'),
    thumpHigh: new Audio('/public/javascript/games/neontroids/sounds/thump-high.mp3')
};

var continuousSounds = {
    largeSaucer: new Audio('/public/javascript/games/neontroids/sounds/large-saucer.mp3'),
    smallSaucer: new Audio('/public/javascript/games/neontroids/sounds/small-saucer.mp3')
};

function playSound(name) {
    oneOffSounds[name].play();
}

function startSound(name) {
    continuousSounds[name].loop = true;
    continuousSounds[name].play();
}

function stopSound(name) {
    continuousSounds[name].pause();
}
