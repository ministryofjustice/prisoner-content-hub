var keyPressed = {};

function initKeyboard() {
    document.addEventListener('keydown', function (event) {
        keyPressed[event.keyCode] = true;
    }, true);

    document.addEventListener('keyup', function (event) {
        if (gameState === "playing") {
            keyPressed[event.keyCode] = false;

			if ((event.keyCode === 78) || (event.keyCode === 32)) {
				ship.fire();
			}
		} else if (gameState === "attract") {
            startGame();
        }
	}, true);

    document.addEventListener('blur', function () {
        keyPressed = {};
    });

    document.addEventListener('click', function (event) {
        if (gameState === "attract") {
            startGame();
        }
    });
}

function checkKeyboardInput() {
    if (gameState === "playing") {
        if (keyPressed["37"] || keyPressed["90"]) {
            ship.rotate(1);
        }

        if (keyPressed["39"] || keyPressed["88"]) {
            ship.rotate(-1);
        }

        if (keyPressed["38"] || keyPressed["77"]) {
            ship.thrust();
        }
    }
}

