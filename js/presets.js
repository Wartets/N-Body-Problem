const initialBodies = [
    { name: "Object 1", mass: 250, charge: 2, radius: 2.5, position: { x: -100, y: -100 }, velocity: { x: 0, y: 1 }, color: "red", show: true },
    { name: "Object 2", mass: 300, charge: 1.5, radius: 2.5, position: { x: 100, y: 100 }, velocity: { x: -1, y: 0 }, color: "green", show: true },
    { name: "Object 3", mass: 100, charge: -1, radius: 2.5, position: { x: 100, y: -100 }, velocity: { x: -1, y: 1 }, color: "blue", show: true }
];

const presets = {
	"Initial preset": { dt: 0.24,
		bodies: [
			{ name: "Object 1", mass: 250, charge: 2, radius: 2.5, position: { x: -100, y: -100 }, velocity: { x: 0, y: 1 }, color: "red", show: true },
			{ name: "Object 2", mass: 300, charge: 1.5, radius: 2.5, position: { x: 100, y: 100 }, velocity: { x: -1, y: 0 }, color: "green", show: true },
			{ name: "Object 3", mass: 100, charge: -1, radius: 2.5, position: { x: 100, y: -100 }, velocity: { x: -1, y: 1 }, color: "blue", show: true }
		]
	},
	"Tri-system 1": { dt: 0.3,
		bodies: [
			{ name: "Star", mass: 7500, charge: 0, radius: 2.5, position: { x: 0, y: 0 }, velocity: { x: 0.5, y: -0.2 }, color: "yellow", show: true },
			{ name: "Planet 1", mass: 10, charge: 0, radius: 1.5, position: { x: 134, y: 0 }, velocity: { x: 0, y: -1.5 }, color: "purple", show: true },
			{ name: "Planet 2", mass: 25, charge: 0, radius: 1.7, position: { x: 45, y: 0 }, velocity: { x: 0, y: -3 }, color: "cyan", show: true }
		]
	},
	"Quadri-system": { dt: 0.24,
		bodies: [
			{ name: "Star", mass: 7000, charge: 0, radius: 2.5, position: { x: -13.245, y: 4.324 }, velocity: { x: -4.974, y: 2.992 }, color: "orange", show: true },
			{ name: "Planet 1", mass: 1, charge: 0, radius: 1, position: { x: -0.562, y: 0.262 }, velocity: { x: -4.730, y: 8.905 }, color: "pink", show: true },
			{ name: "Planet 2", mass: 25, charge: 0, radius: 1.5, position: { x: -10.249, y: 26.094 }, velocity: { x: -10.449, y: 2.762 }, color: "lime", show: true },
			{ name: "Planet 3", mass: 1, charge: 0, radius: 1, position: { x: 5, y: 18.262 }, velocity: { x: -4.730, y: 8.905 }, color: "red", show: true }
		]
	},
	"Star Planet Satellite": { dt: 0.001,
		bodies: [
			{ name: "Star", mass: 100000, charge: 0, radius: 1.5, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Satellite", mass: 3.694e-4, charge: 0, radius: 0.5, position: { x: 10.02562667, y: 0 }, velocity: { x: 0, y: 31.03 }, color: "gray", show: true },
			{ name: "Planet", mass: 3.003e-1, charge: 0, radius: 0.7, position: { x: 10, y: 0 }, velocity: { x: 0, y: 30 }, color: "blue", show: true }
		]
	},
	"Billard": { dt: 0.1,
		bodies: [
			{ name: "White", mass: 8.5, charge: 0, radius: 2.5, position: { x: 150, y: 0 }, velocity: { x: -18.75, y: 0 }, color: "white", show: true },
			{ name: "Yellow", mass: 8.5, charge: 0, radius: 2.5, position: { x: 0, y: 5.11 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Brown", mass: 8.5, charge: 0, radius: 2.5, position: { x: 0, y: -5.11 }, velocity: { x: 0, y: 0 }, color: "brown", show: true },
			{ name: "Red", mass: 8.5, charge: 0, radius: 2.5, position: { x: 8.85, y: 0 }, velocity: { x: 0, y: 0 }, color: "red", show: true },
			{ name: "Green", mass: 8.5, charge: 0, radius: 2.5, position: { x: 4.43, y: 2.56 }, velocity: { x: 0, y: 0 }, color: "green", show: true },
			{ name: "Purple", mass: 8.5, charge: 0, radius: 2.5, position: { x: 4.43, y: -2.56 }, velocity: { x: 0, y: 0 }, color: "purple", show: true },
			{ name: "Blue", mass: 8.5, charge: 0, radius: 2.5, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "blue", show: true }
		]
	},
	"Hydrogens like": { dt: 0.005,
		bodies: [
			{ name: "Proton 1", mass: 1.67262*(10**(-27)), charge: 1.6/(10**(19)), radius: 0.5, position: { x: 0, y: 0.8 }, velocity: { x: 3, y: 0.8 }, color: "red", show: true },
			{ name: "Electron 1", mass: 9.1*(10**(-31)), charge: -1.6/(10**(19)), radius: 0.5, position: { x: 1.7, y: 0.8 }, velocity: { x: 3, y: 12.8 }, color: "green", show: true },
			{ name: "Proton 2", mass: 1.67262*(10**(-27)), charge: 1.6/(10**(19)), radius: 0.5, position: { x: 20, y: 10 }, velocity: { x: -10, y: -4 }, color: "red", show: true },
			{ name: "Electron 2", mass: 9.1*(10**(-31)), charge: -1.6/(10**(19)), radius: 0.5, position: { x: 20, y: 11.7 }, velocity: { x: 2, y: -4 }, color: "green", show: true },
			{ name: "Proton 3", mass: 1.67262*(10**(-27)), charge: 1.6/(10**(19)), radius: 0.5, position: { x: -15, y: 0}, velocity: { x: 0, y: 0 }, color: "red", show: true },
			{ name: "Electron 3", mass: 9.1*(10**(-31)), charge: -1.6/(10**(19)), radius: 0.5, position: { x: -13.8, y: -1.2 }, velocity: { x: 8.485, y: 8.485 }, color: "green", show: true },
			{ name: "Proton 3", mass: 1.67262*(10**(-27)), charge: 1.6/(10**(19)), radius: 0.5, position: { x: 12, y: -4.5}, velocity: { x: -0.5, y: 1 }, color: "red", show: true },
			{ name: "Electron 3", mass: 9.1*(10**(-31)), charge: -1.6/(10**(19)), radius: 0.5, position: { x: 10.8, y: -3.3 }, velocity: { x: -8.985, y: -7.485 }, color: "green", show: true },
			{ name: "Proton 4", mass: 1.67262*(10**(-27)), charge: 1.6/(10**(19)), radius: 0.5, position: { x: -10, y: 15}, velocity: { x: 1, y: -0.7 }, color: "red", show: true }
		]
	},
	"Soup": { dt: 0.09,
		bodies: [
			{ name: "Object 1", mass: 10, charge: 1, radius: 2.5, position: { x: 0, y: 2 }, velocity: { x: -0.21, y: 0 }, color: "Blue", show: true },
			{ name: "Object 2", mass: 10, charge: -1, radius: 2.5, position: { x: 22, y: 0 }, velocity: { x: -0.01, y: 0 }, color: "Red", show: true },
			{ name: "Object 3", mass: 10, charge: 1, radius: 2.5, position: { x: 1, y: 20 }, velocity: { x: 0, y: 0.01 }, color: "Blue", show: true },
			{ name: "Object 4", mass: 10, charge: -1, radius: 2.5, position: { x: 20.2, y: 20 }, velocity: { x: 0, y: 0 }, color: "Red", show: true },
			{ name: "Object 5", mass: 10, charge: 1, radius: 2.5, position: { x: 36, y: 0 }, velocity: { x: 0.01, y: 1 }, color: "Blue", show: true },
			{ name: "Object 6", mass: 10, charge: -1, radius: 2.5, position: { x: 0, y: 40 }, velocity: { x: 1.5, y: -0.01 }, color: "Red", show: true },
			{ name: "Object 7", mass: 10, charge: 1, radius: 2.5, position: { x: 42, y: 40 }, velocity: { x: 0, y: 0 }, color: "Blue", show: true },
			{ name: "Object 8", mass: 10, charge: -1, radius: 2.5, position: { x: 20, y: 38 }, velocity: { x: 0, y: 0 }, color: "Red", show: true },
			{ name: "Object 9", mass: 10, charge: 1, radius: 2.5, position: { x: 37.6, y: 20.4 }, velocity: { x: 0.01, y: 0.01 }, color: "Blue", show: true }
		]
	},
	"Rosace": { dt: 0.3,
		bodies: [
			{ name: "Object 1", mass: 8000, charge: 0, radius: 1, position: { x: 0, y: 0 }, velocity: { x: 0.009, y: 0.000 }, color: "darkgray", show: true },
			{ name: "Object 2", mass: 10.000, charge: 0, radius: 1, position: { x: 4.825, y: 7 }, velocity: { x: 5.077, y: -9.240 }, color: "pink", show: true }
		]
	},
	"Sun Earth Moon": { dt: 0.2,
		bodies: [
			{ name: "Sun", mass: 1.989e+30, charge: 0, radius: 696342*10, position: { x: 0, y: 0 }, velocity: { x: -2, y: -2 }, color: "yellow", show: true },
			{ name: "Moon", mass: 7.347e+22, charge: 0, radius: 1737.4*10, position: { x: 149597870.7+384400, y: 0 }, velocity: { x: 0, y: (107000+3683.590215)*8.806 }, color: "gray", show: true },
			{ name: "Earth", mass: 5.972e+24, charge: 0, radius: 6371*10, position: { x: 149597870.7, y: 0 }, velocity: { x: 0, y: 107000*8.806 }, color: "blue", show: true }
		]
	},
	/* ,
	"Magnetic Force Test": { dt: 0.3,
		bodies: [
			{ name: "Object 1", mass: 40, charge: -2, radius: 2.5, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Object 2", mass: 10, charge: -2, radius: 2.5, position: { x: 5, y: 5 }, velocity: { x: 0, y: 0 }, color: "pink", show: true }
		]
	},
	"Collision test": { dt: 0.001,
		bodies: [
			{ name: "Ball 1", mass: 20, charge: 0, radius: 2.5, position: { x: 10, y: 10 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Ball 2", mass: 10, charge: 0, radius: 2.5, position: { x: 10.1, y: 20 }, velocity: { x: 0, y: -10 }, color: "gray", show: true },
			{ name: "else", mass: 0.0001, charge: 0, radius: 2.5, position: { x: -20, y: 12.5 }, velocity: { x: 0, y: 0 }, color: "black", show: true }
		]
	} 
	*/
};

function createRandomPreset(presetName, numBodies, frameWidth, frameHeight) {
    const randomPosition = (min, max) => Math.random() * (max - min) + min;

    const bodies = [];
    for (let i = 0; i < numBodies; i++) {
        bodies.push({
            name: `Object ${i + 1}`,
            mass: randomPosition(50, 500),
            charge: randomPosition(-5, 5),
            radius: randomPosition(1, 4),
            position: { 
                x: randomPosition(-frameWidth / 2, frameWidth / 2), 
                y: randomPosition(-frameHeight / 2, frameHeight / 2)
            },
            velocity: { 
                x: randomPosition(-5, 5),
                y: randomPosition(-5, 5)
            },
            color: `rgb(${Math.floor(randomPosition(0, 255))}, ${Math.floor(randomPosition(0, 255))}, ${Math.floor(randomPosition(0, 255))})`,
            show: true
        });
    }

    presets[presetName] = {
        dt: 0.25,
        bodies: bodies
    };
}

function createLinePreset(presetName, numBodies) {
    const randomPosition = (min, max) => Math.random() * (max - min) + min;
	
	const theta = Math.random() * Math.PI * 2
    const fx = (4 + Math.random())
	const fy = (4 + 3 * Math.random())
	
	const bodies = [];
    for (let i = 0; i < numBodies; i++) {
        bodies.push({
            name: `Object ${i + 1}`,
            mass: 9.5 + Math.random(),
            charge: (-1)**i,
            radius: 0.5 + Math.random() * 1.75,
            position: { 
                x: i * (10.5 + Math.random()), 
                y: Math.sin(i * 10) / 2
            },
            velocity: { 
                x: fx * Math.cos(theta) + fy * Math.sin(theta),
                y: - fx * Math.sin(theta) + fy * Math.cos(theta)
            },
            color: `rgb(${Math.floor(randomPosition(0, 255))}, ${Math.floor(randomPosition(0, 255))}, ${Math.floor(randomPosition(0, 255))})`,
            show: true
        });
    }

    presets[presetName] = {
        dt: 0.25,
        bodies: bodies
    };
}