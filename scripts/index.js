import { Car } from './Car.js';
import { NeuralNetwork } from './Network.js';
import { Road } from './Road.js';
import { Visualizer } from './Visualizer.js';

const simulationCanvasRef = document.querySelector('#simulation');
simulationCanvasRef.width = 200;

const networkCanvasRef = document.querySelector('#network');
networkCanvasRef.width = 300;

const saveButton = document.querySelector('#save');
saveButton.addEventListener('click', save);
const discardButton = document.querySelector('#discard');
discardButton.addEventListener('click', discard);

const simulationContext = simulationCanvasRef.getContext('2d');
const networkContext = networkCanvasRef.getContext('2d');

const road = new Road(
	simulationCanvasRef.width / 2,
	simulationCanvasRef.width * 0.9
);
const N = 1000;
const cars = generateCars(N);
let bestCase = cars[0];

if (localStorage.getItem('bestCase')) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem('bestCase'));

		if (i != 0) {
			NeuralNetwork.mutate(cars[i].brain, 0.1);
		}
	}
}

const traffic = [
	new Car({
		x: road.getLaneCenter(2),
		y: -100,
		width: 30,
		height: 50,
		controlType: 'DUMMY',
		maxSpeed: 3,
	}),

	new Car({
		x: road.getLaneCenter(0),
		y: -300,
		width: 30,
		height: 50,
		controlType: 'DUMMY',
		maxSpeed: 3,
	}),

	new Car({
		x: road.getLaneCenter(2),
		y: -300,
		width: 30,
		height: 50,
		controlType: 'DUMMY',
		maxSpeed: 4,
	}),

	new Car({
		x: road.getLaneCenter(0),
		y: -500,
		width: 30,
		height: 50,
		controlType: 'DUMMY',
		maxSpeed: 3,
	}),

	new Car({
		x: road.getLaneCenter(1),
		y: -500,
		width: 30,
		height: 50,
		controlType: 'DUMMY',
		maxSpeed: 3,
	}),

	new Car({
		x: road.getLaneCenter(2),
		y: -700,
		width: 30,
		height: 50,
		controlType: 'DUMMY',
		maxSpeed: 3,
	}),
];

animate();

function save() {
	localStorage.setItem('bestCase', JSON.stringify(bestCase.brain));
}

function discard() {
	localStorage.removeItem('bestCase');
}

function generateCars(N) {
	const cars = [];

	for (let i = 0; i <= N; i++) {
		cars.push(
			new Car({
				x: road.getLaneCenter(1),
				y: -50,
				width: 30,
				height: 50,
				controlType: 'AI',
				maxSpeed: 4,
			})
		);
	}

	return cars;
}

function animate(time) {
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].update(road.borders, []);
	}

	for (let i = 0; i < cars.length; i++) {
		cars[i].update(road.borders, traffic);
	}

	bestCase = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

	simulationCanvasRef.height = window.innerHeight;
	networkCanvasRef.height = window.innerHeight;

	simulationContext.save();
	simulationContext.translate(
		0,
		-bestCase.y + simulationCanvasRef.height * 0.75
	);

	road.draw(simulationContext);
	for (let i = 0; i < traffic.length; i++)
		traffic[i].draw(simulationContext, '#18181b');

	simulationContext.globalAlpha = 0.2;

	for (let i = 0; i < cars.length; i++)
		cars[i].draw(simulationContext, '#1d4ed8');

	simulationContext.globalAlpha = 1;
	bestCase.draw(simulationContext, '#4338ca', true);

	simulationContext.restore();

	networkContext.lineDashOffset = -time / 50;
	Visualizer.drawNetwork(networkContext, bestCase.brain);
	requestAnimationFrame(animate);
}

