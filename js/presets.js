const initialBodies = [
    { name: "Objet 1", mass: 250, charge: 2, position: { x: 0, y: 0 }, velocity: { x: 0, y: 1 }, color: "red" },
    { name: "Objet 2", mass: 300, charge: 1.5, position: { x: 200, y: 200 }, velocity: { x: -1, y: 0 }, color: "green" },
    { name: "Objet 3", mass: 100, charge: -1, position: { x: 200, y: 0 }, velocity: { x: -1, y: 1 }, color: "blue" }
];

const presets = {
	"Initial preset": { dt: 0.24,
		bodies: [
			{ name: "Objet 1", mass: 250, charge: 2, position: { x: 0, y: 0 }, velocity: { x: 0, y: 1 }, color: "red", show: true },
			{ name: "Objet 2", mass: 300, charge: 1.5, position: { x: 200, y: 200 }, velocity: { x: -1, y: 0 }, color: "green", show: true },
			{ name: "Objet 3", mass: 100, charge: -1, position: { x: 200, y: 0 }, velocity: { x: -1, y: 1 }, color: "blue", show: true }
		]
	},
	"Tri-system 1": { dt: 0.3,
		bodies: [
			{ name: "Star", mass: 7500, charge: 0, position: { x: 0, y: 0 }, velocity: { x: 0.5, y: -0.2 }, color: "yellow", show: true },
			{ name: "Planet 1", mass: 10, charge: 0, position: { x: 134, y: 0 }, velocity: { x: 0, y: -1.5 }, color: "purple", show: true },
			{ name: "Planet 2", mass: 25, charge: 0, position: { x: 45, y: 0 }, velocity: { x: 0, y: -3 }, color: "cyan", show: true }
		]
	},
	"Quadri-system": { dt: 0.24,
		bodies: [
			{ name: "Star", mass: 7000, charge: 0, position: { x: -13.245, y: 4.324 }, velocity: { x: -4.974, y: 2.992 }, color: "orange", show: true },
			{ name: "Planet 1", mass: 1, charge: 0, position: { x: -0.562, y: 0.262 }, velocity: { x: -4.730, y: 8.905 }, color: "pink", show: true },
			{ name: "Planet 2", mass: 25, charge: 0, position: { x: -10.249, y: 26.094 }, velocity: { x: -10.449, y: 2.762 }, color: "lime", show: true },
			{ name: "Planet 3", mass: 1, charge: 0, position: { x: 5, y: 18.262 }, velocity: { x: -4.730, y: 8.905 }, color: "red", show: true }
		]
	},
	"Sun Earth Moon like": { dt: 0.001,
		bodies: [
			{ name: "Sun", mass: 100000, charge: 0, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Moon", mass: 3.694e-4, charge: 0, position: { x: 10.02562667, y: 0 }, velocity: { x: 0, y: 31.03 }, color: "gray", show: true },
			{ name: "Earth", mass: 3.003e-1, charge: 0, position: { x: 10, y: 0 }, velocity: { x: 0, y: 30 }, color: "blue", show: true }
		]
	},
	"Billard": { dt: 0.1,
		bodies: [
			{ name: "White", mass: 8.5, charge: 0, position: { x: 150, y: 0 }, velocity: { x: -18.75, y: 0 }, color: "white", show: true },
			{ name: "Yellow", mass: 8.5, charge: 0, position: { x: 0, y: 5.11 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Brown", mass: 8.5, charge: 0, position: { x: 0, y: -5.11 }, velocity: { x: 0, y: 0 }, color: "brown", show: true },
			{ name: "Red", mass: 8.5, charge: 0, position: { x: 8.85, y: 0 }, velocity: { x: 0, y: 0 }, color: "red", show: true },
			{ name: "Green", mass: 8.5, charge: 0, position: { x: 4.43, y: 2.56 }, velocity: { x: 0, y: 0 }, color: "green", show: true },
			{ name: "Purple", mass: 8.5, charge: 0, position: { x: 4.43, y: -2.56 }, velocity: { x: 0, y: 0 }, color: "purple", show: true },
			{ name: "Blue", mass: 8.5, charge: 0, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "blue", show: true }
		]
	},
	"Collision test": { dt: 0.001,
		bodies: [
			{ name: "Ball 1", mass: 20, charge: 0, position: { x: 10, y: 10 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Ball 2", mass: 10, charge: 0, position: { x: 10.1, y: 20 }, velocity: { x: 0, y: -10 }, color: "gray", show: true },
			{ name: "else", mass: 0.0001, charge: 0, position: { x: -20, y: 12.5 }, velocity: { x: 0, y: 0 }, color: "black", show: true }
		]
	},
	"Rosace": { dt: 0.3,
		bodies: [
			{ name: "Object 1", mass: 8000, charge: 0, position: { x: 0, y: 0 }, velocity: { x: 0.009, y: 0.000 }, color: "darkgray", show: true },
			{ name: "Object 2", mass: 10.000, charge: 0, position: { x: 4.825, y: 7 }, velocity: { x: 5.077, y: -9.240 }, color: "pink", show: true }
		]
	},
	"Magnetic Force Test": { dt: 0.3,
		bodies: [
			{ name: "Object 1", mass: 40, charge: -2, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Object 2", mass: 10, charge: -2, position: { x: 5, y: 5 }, velocity: { x: 0, y: 0 }, color: "pink", show: true }
		]
	}
};