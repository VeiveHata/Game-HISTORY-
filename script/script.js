'use strict';

var canvasWidth = 1000;
var canvasHeight = 600;
var gameLoop = void 0;
var nextAtom = 1;
var key = void 0;
var atomsHeight = 50;
var mouseX = void 0;
var assumption = 10;
var menu = document.getElementById('menu');
var container = document.getElementById('container');
var finish = document.getElementById('finish');
var load = document.getElementById('load');
var pointsArea = document.getElementById('pointsArea');

var levelCount = 1;

var points = 0;
var antiPoints = 0;

var heliumCost = 10;
var hydroCost = 15;

var hydros = [];
var heliums = [];

var atomSpeed = 3;

var timer = 0;
var setTimer = 100;

var levelsArray = [];
doLevels(4);

var Level = {
	1: {
		map: levelsArray[0],
		atomSpeed: 4,
		setTimer: 60
	},

	2: {
		map: levelsArray[1],
		atomSpeed: 5,
		setTimer: 40
	},

	3: {
		map: levelsArray[2],
		atomSpeed: 6,
		setTimer: 40
	},

	4: {
		map: levelsArray[3],
		atomSpeed: 7,
		setTimer: 30
	}
};

var starLife = {
	0: '0 billion',
	30: '3 billion',
	50: '6 billion',
	80: '10 billion',
	100: '12 billion'
};

var loadCount = 0;
var allCount = 0;
var imageList = ['images/frame.png', 'images/pointsArea.png', 'images/space.jpg', 'images/tiles.png', 'images/restart.png'];

function loadImage() {
	var len = imageList.length;
	var img = void 0;

	for (var i = 0; i < len; i++) {
		allCount++;
		img = document.createElement('img');
		img.onload = function () {
			loadCount++;
		};
		img.src = imageList[i];
	};
};

function compareRandom(a, b) {
	return Math.random() - 0.5;
}

function createLevel(units, zeros) {
	var array = [];

	for (var i = 0; i < units; i++) {
		array.push(1);
	};

	for (var _i = 0; _i < zeros; _i++) {
		array.push(0);
	};

	var level = mixLevelArray(array);

	return level;
};

function mixLevelArray(array) {
	var level = array.sort(compareRandom);

	return level;
};

function doLevels(count) {
	var heliumNumbers = 5;
	var hydroNumbers = 10;

	for (var i = 0; i < count; i++) {
		levelsArray[i] = createLevel(hydroNumbers, heliumNumbers);
		heliumNumbers += 5;
		hydroNumbers += 5;
	}
};

function showMenu() {
	load.className = 'hidden';
	menu.className = 'menu';
};

document.addEventListener("keydown", function (e) {
	key = e.keyCode;
});

document.getElementById('container').addEventListener('mousemove', function (event) {
	mouseX = event.offsetX;
});

// create atoms and cup

var stage = new Konva.Stage({
	container: 'container',
	width: canvasWidth,
	height: canvasHeight
});

var layer = new Konva.Layer();

var cupPos = {
	idle: [0, 100, 100, 80],

	move: [0, 100, 100, 80, 100, 50, 100, 140, 200, 50, 100, 140, 300, 50, 100, 140, 400, 50, 100, 140, 500, 50, 100, 140]
};

var heliumPos = {
	idle: [0, 50, 50, atomsHeight]
};

var hydroPos = {
	idle: [0, 0, 50, atomsHeight],

	move: [0, 0, 50, atomsHeight, 50, 0, 50, atomsHeight, 100, 0, 50, atomsHeight, 150, 0, 50, atomsHeight, 200, 0, 50, atomsHeight, 250, 0, 50, atomsHeight]
};

var tiles = new Image();
tiles.src = 'images/tiles.png';

var cup = new Konva.Sprite({
	x: 100,
	y: canvasHeight - 80,
	image: tiles,
	animation: 'idle',
	animations: cupPos,
	frameRate: 1,
	frameImdex: 0
});

cup.sizeX = 100;

function addCup() {
	layer.add(cup);
	stage.add(layer);
	cup.start();
};

function cupMove() {};

function handleInput() {
	cup.attrs.animation = 'idle';
	cup.setX(mouseX - cup.sizeX / 2);
};

function setAtomPosition() {
	var positionX = Math.round(Math.random() * (canvasWidth / 50)) * 50;
	return positionX;
};

function createAtom(n) {
	var x = setAtomPosition();

	if (n === 1) {
		var hydro = new Konva.Sprite({
			x: x,
			y: -atomsHeight,
			image: tiles,
			animation: 'move',
			animations: hydroPos,
			frameRate: 6,
			frameImdex: 0
		});
		hydros.push(hydro);
		layer.add(hydro);
		stage.add(layer);
		hydro.start();
	};

	if (n === 0) {
		var helium = new Konva.Sprite({
			x: x,
			y: -atomsHeight,
			image: tiles,
			animation: 'idle',
			animations: heliumPos,
			frameRate: 1,
			frameImdex: 1
		});
		heliums.push(helium);
		layer.add(helium);
		stage.add(layer);
		helium.start();
	};
};

function checkAtoms(arrayOfAtoms) {
	arrayOfAtoms.forEach(function (molecula) {
		var atomIndex = arrayOfAtoms.indexOf(molecula);
		var atomPositionX = molecula.attrs.x + assumption;
		var atomPositionY = molecula.attrs.y + 20;
		var cupPosition = defineCupPosition();
		var propriateAtomPOsition = cupPosition[0] + cup.sizeX / 2 + assumption;

		molecula.setY(molecula.attrs.y + atomSpeed);

		if (takeAtom(atomPositionX, atomPositionY, cupPosition[0], cupPosition[1], propriateAtomPOsition)) {

			if (arrayOfAtoms == hydros) {
				setPoints();
			} else {
				setAntipoints();
			};

			removeAtom(molecula, arrayOfAtoms, atomIndex);
		};

		if (molecula.attrs.y <= canvasHeight + 10 && molecula.attrs.y >= canvasHeight) {
			removeAtom(molecula, arrayOfAtoms, atomIndex);
		};
	});
};

function removeAtom(atom, atomArray, index) {
	atom.setX(-10000);
	atomArray.splice(index, 1);
};

function creation(level) {
	if (timer === 0) {
		var numbersOfAtoms = level.length;

		if (nextAtom <= numbersOfAtoms) {
			createAtom(level[nextAtom - 1]);
			nextAtom++;
		};

		timer = setTimer;
	};
};

function takeAtom(atomX, atomY, cupX, cupY, middleCup) {
	if (atomX <= middleCup && atomX >= cupX) return atomY <= cupY + 10 && atomY >= cupY;
};

function defineCupPosition() {
	var position = [];

	position[0] = cup.attrs.x;
	position[1] = cup.attrs.y - 10;

	return position;
};

// set points

function setPoints() {
	points += hydroCost;
};

function setAntipoints() {
	antiPoints += heliumCost;
};

function getScore(points) {
	pointsArea.innerHTML = 'hydro : ' + points + ' <br>helium : ' + antiPoints + ' ';
};

function showScore(atom, antiatom) {
	var percentage = Math.floor(atom / (atom + antiatom) * 100);
	var years = void 0;

	if (atom < heliumCost * 5) {
		finish.innerHTML = '<p>You haven`t created a star.</p> You aren`t as cool as Rick Sanchez.';
		finish.className = 'finish';
	} else {
		if (percentage < 15) {
			years = starLife[0];
		} else if (percentage >= 15 && percentage < 40) {
			years = starLife[30];
		} else if (percentage >= 40 && percentage < 65) {
			years = starLife[50];
		} else if (percentage >= 65 && percentage < 90) {
			years = starLife[80];
		} else {
			years = starLife[100];

			if (levelCount != levelsArray.length) {
				levelCount++;
			};
		};

		document.getElementById('percentage').innerText = percentage;
		document.getElementById('years').innerText = years;
		finish.className = 'finish';
		document.getElementById('next').addEventListener("click", function () {
			setLevel(levelCount);
		});
	};
};

function setZeroParametrs() {
	points = 0;
	antiPoints = 0;
	hydros = [];
	heliums = [];
	timer = 0;
	nextAtom = 1;
};

function moveAtoms() {

	checkAtoms(heliums);
	checkAtoms(hydros);

	if (heliums.length == 0 && hydros.length == 0) {
		gameOver();
	};

	timer--;
};

function gameOver() {
	gameLoop.stop();
	showScore(points, antiPoints);
};

var pause = 1;

function pauseOrNot() {
	if (pause == 1 && key == 32) {
		pauseGame();
		pause = 0;
	} else if (pause == 0 && key == 32) {
		continueGame();
	}
};

function pauseGame() {
	gameLoop.stop();
};

function continueGame() {
	gameLoop.start();
}

function startGame(level) {

	if (gameLoop != undefined) {
		gameLoop.stop();
		gameLoop = undefined;
		layer.destroyChildren();
		addCup();
	};

	document.getElementById('levelNumber').innerText = 'level ' + levelCount;
	finish.className = 'hidden';
	menu.className = 'hidden';
	container.className = 'container';
	pointsArea.className = 'pointsArea';

	setZeroParametrs();
	addCup();

	atomSpeed = level.atomSpeed;
	setTimer = level.setTimer;

	gameLoop = new Konva.Animation(function (frame) {
		pauseOrNot();
		creation(level.map);
		moveAtoms();
		handleInput();
		getScore(points);
	}, layer);

	gameLoop.start();
};

document.getElementById('restart').addEventListener("click", function () {
	startGame(Level[levelCount]);
});

document.getElementById('pause').addEventListener("click", pauseGame);

document.getElementById('continue').addEventListener("click", continueGame);

function setLevel(level) {
	startGame(Level[level]);
};

loadImage();

var int = setInterval(function () {
	load.innerHTML = 'Loading <br>' + Math.floor(loadCount / allCount * 100) + "%";

	if (allCount == loadCount) {
		clearInterval(int);
		showMenu();
	};
}, 100 / 60);