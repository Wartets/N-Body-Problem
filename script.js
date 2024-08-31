let isPaused = true;
let collisionsEnabled = false;
let focusObject = 'barycenter';
let selectedBody = null;
let manualMoveTimeout = null;
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const dtInput = document.getElementById('dt');
const startPauseBtn = document.getElementById('startPauseBtn');
const controlsContainer = document.getElementById('object-controls');
const showSizeCheckbox = document.getElementById('showSize');
const focusSelect = document.getElementById('focusSelect');
focusSelect.addEventListener('change', (e) => {
	focusObject = e.target.value;
	resetView();
});
let scale = 1;
let scrollZoom = 1;
let cameraOffset = { x: 0, y: 0 };

const mouseCoordsDisplay = document.getElementById('mouseCoords');

const translations = {
    "fr": {
        "resetView": "Réinitialiser la vue",
        "fullscreen": "Plein écran",
        "startPause": "Lancer la simulation",
        "time": "Temps : 0.00 s",
        "dt": "dt (Intervalle de temps) :",
		"dotViewSetting": "Mode d'affichage des points :",
        "adaptiveSize": "(adaptative: 1 / constante 0)",
        "enableCollisions": "Activer les collisions",
        "enableGravity": "Activer la gravité",
        "showVelocities": "Afficher les vecteurs de vitesse",
        "enableFriction": "Activer les frottements",
        "frictionCoefficient": "Coefficient de frottement :",
        "centerView": "Centre de la vue :",
        "zoomManual": "Zoom manuel :",
        "trailLimit": "Nombre de points du trail (puiss. 10)",
        "loadPreset": "Charger un preset :",
        "savePreset": "Sauvegarder le preset",
        "presetName": "Nom du preset (vide pour nom par défaut)",
        "addObject": "Ajouter un objet"
    },
    "en": {
        "resetView": "Reset View",
        "fullscreen": "Fullscreen",
        "startPause": "Start Simulation",
        "time": "Time: 0.00 s",
        "dt": "dt (Time Interval):",
		"dotViewSetting": "Dot Setting View :",
        "adaptiveSize": "(adaptive: 1 / constant 0)",
        "enableCollisions": "Enable Collisions",
        "enableGravity": "Enable Gravity",
        "showVelocities": "Show Velocity Vectors",
        "enableFriction": "Enable Friction",
        "frictionCoefficient": "Friction Coefficient:",
        "centerView": "Center View:",
        "zoomManual": "Manual Zoom:",
        "trailLimit": "Trail Points (power of 10)",
        "loadPreset": "Load Preset:",
        "savePreset": "Save Preset",
        "presetName": "Preset Name (empty for default)",
        "addObject": "Add Object"
    },
    "es": {
        "resetView": "Reiniciar vista",
        "fullscreen": "Pantalla completa",
        "startPause": "Iniciar simulación",
        "time": "Tiempo: 0.00 s",
        "dt": "dt (Intervalo de tiempo):",
		"dotViewSetting": "Moda de visualización de los puntos",
        "adaptiveSize": "(adaptatable: 1 / constante: 0)",
        "enableCollisions": "Activar colisiones",
        "enableGravity": "Activar gravedad",
        "showVelocities": "Mostrar vectores de velocidad",
        "enableFriction": "Activar fricción",
        "frictionCoefficient": "Coeficiente de fricción:",
        "centerView": "Centrar vista en:",
        "zoomManual": "Zoom manual:",
        "trailLimit": "Puntos del trazado (potencia de 10)",
        "loadPreset": "Cargar preset:",
        "savePreset": "Salvaguardar preset",
        "presetName": "Nombre del preset (vacío para predeterminado)",
        "addObject": "Añadir objeto"
    },
	"de": {
        "resetView": "Ansicht zurücksetzen",
        "fullscreen": "Vollbild",
        "startPause": "Simulation starten",
        "time": "Zeit: 0.00 s",
        "dt": "dt (Zeitintervall):",
		"dotViewSetting": "Punkteinstellungsansicht :",
        "adaptiveSize": "(adaptiv: 1 / konstant: 0)",
        "enableCollisions": "Kollisionen aktivieren",
        "enableGravity": "Schwerkraft aktivieren",
        "showVelocities": "Geschwindigkeitsvektoren anzeigen",
        "enableFriction": "Reibung aktivieren",
        "frictionCoefficient": "Reibungskoeffizient:",
        "centerView": "Ansicht zentrieren:",
        "zoomManual": "Manuelles Zoomen:",
        "trailLimit": "Spurpunkte (Zehnerpotenzen)",
        "loadPreset": "Voreinstellung laden:",
        "savePreset": "Voreinstellung speichern",
        "presetName": "Name der Voreinstellung (leer für Standard)",
        "addObject": "Objekt hinzufügen"
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');

    function applyTranslations(language) {
        const trans = translations[language];

        document.getElementById('resetViewBtn').textContent = trans.resetView;
        document.getElementById('fullscreenBtn').textContent = trans.fullscreen;
        document.getElementById('startPauseBtn').textContent = trans.startPause;
        document.getElementById('timer').textContent = trans.time;
        document.getElementById('dtLabel').textContent = trans.dt;;
        document.getElementById('showSizeLabel').textContent = trans.adaptiveSize
        document.getElementById('displayModeLabel').textContent = trans.dotViewSetting;
        document.getElementById('collisionToggleLabel').textContent = trans.enableCollisions;
        document.getElementById('gravityToggleLabel').textContent = trans.enableGravity;
        document.getElementById('showVelocitiesLabel').textContent = trans.showVelocities;
        document.getElementById('frictionToggleLabel').textContent = trans.enableFriction;
        document.getElementById('frictionCoefficientLabel').textContent = trans.frictionCoefficient;
        document.getElementById('focusSelectLabel').textContent = trans.centerView;
        document.getElementById('zoomingToolLabel').textContent = trans.zoomManual;
        document.getElementById('trailLimitLabel').textContent = trans.trailLimit;
        document.getElementById('presetSelectLabel').textContent = trans.loadPreset;
        document.getElementById('loadPresetBtn').textContent = trans.loadPreset;
        document.getElementById('savePresetBtn').textContent = trans.savePreset;
        document.getElementById('presetName').placeholder = trans.presetName;
        document.getElementById('addBodyBtn').textContent = trans.addObject;
    }

    languageSelect.addEventListener('change', () => {
        applyTranslations(languageSelect.value);
    });

    applyTranslations(languageSelect.value || 'fr');
});


function applyTranslations() {
    console.log('Translations:', translations);
}


canvas.addEventListener('mousemove', (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = (event.clientX - rect.left) / scale + cameraOffset.x;
	const mouseY = (event.clientY - rect.top) / scale + cameraOffset.y;
	mouseCoordsDisplay.textContent = `Coord : (${mouseX.toFixed(2)}; ${mouseY.toFixed(2)})`;
});

const initialBodies = [
	{ name: "Objet 1", mass: 250, position: { x: 0, y: 0 }, velocity: { x: 0, y: 1 }, color: "red" },
	{ name: "Objet 2", mass: 300, position: { x: 200, y: 200 }, velocity: { x: -1, y: 0 }, color: "green" },
	{ name: "Objet 3", mass: 100, position: { x: 200, y: 0 }, velocity: { x: -1, y: 1 }, color: "blue" }
];


const bodies = initialBodies.map(body => ({
	...body,
	acceleration: { x: 0, y: 0 },
	trail: [],
	show: true,
	points: []
}));

const G = 0.1;

const presets = {
	"Initial preset": { dt: 0.24,
		bodies: [
			{ name: "Objet 1", mass: 250, position: { x: 0, y: 0 }, velocity: { x: 0, y: 1 }, color: "red", show: true },
			{ name: "Objet 2", mass: 300, position: { x: 200, y: 200 }, velocity: { x: -1, y: 0 }, color: "green", show: true },
			{ name: "Objet 3", mass: 100, position: { x: 200, y: 0 }, velocity: { x: -1, y: 1 }, color: "blue", show: true }
		]
	},
	"Tri-system 1": { dt: 0.3,
		bodies: [
			{ name: "Star", mass: 7500, position: { x: 0, y: 0 }, velocity: { x: 0.5, y: -0.2 }, color: "yellow", show: true },
			{ name: "Planet 1", mass: 10, position: { x: 134, y: 0 }, velocity: { x: 0, y: -1.5 }, color: "purple", show: true },
			{ name: "Planet 2", mass: 25, position: { x: 45, y: 0 }, velocity: { x: 0, y: -3 }, color: "cyan", show: true }
		]
	},
	"Quadri-system": { dt: 0.24,
		bodies: [
			{ name: "Star", mass: 7000, position: { x: -13.245, y: 4.324 }, velocity: { x: -4.974, y: 2.992 }, color: "orange", show: true },
			{ name: "Planet 1", mass: 1, position: { x: -0.562, y: 0.262 }, velocity: { x: -4.730, y: 8.905 }, color: "pink", show: true },
			{ name: "Planet 2", mass: 25, position: { x: -10.249, y: 26.094 }, velocity: { x: -10.449, y: 2.762 }, color: "lime", show: true },
			{ name: "Planet 3", mass: 1, position: { x: 5, y: 18.262 }, velocity: { x: -4.730, y: 8.905 }, color: "red", show: true }
		]
	},
	"Sun Earth Moon like": { dt: 0.001,
		bodies: [
			{ name: "Sun", mass: 100000, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Moon", mass: 3.694e-4, position: { x: 10.02562667, y: 0 }, velocity: { x: 0, y: 31.03 }, color: "gray", show: true },
			{ name: "Earth", mass: 3.003e-1, position: { x: 10, y: 0 }, velocity: { x: 0, y: 30 }, color: "blue", show: true }
		]
	},
	"Billard": { dt: 0.1,
		bodies: [
			{ name: "White", mass: 8.5, position: { x: 150, y: 0 }, velocity: { x: -18.75, y: 0 }, color: "white", show: true },
			{ name: "Yellow", mass: 8.5, position: { x: 0, y: 5.11 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Brown", mass: 8.5, position: { x: 0, y: -5.11 }, velocity: { x: 0, y: 0 }, color: "brown", show: true },
			{ name: "Red", mass: 8.5, position: { x: 8.85, y: 0 }, velocity: { x: 0, y: 0 }, color: "red", show: true },
			{ name: "Green", mass: 8.5, position: { x: 4.43, y: 2.56 }, velocity: { x: 0, y: 0 }, color: "green", show: true },
			{ name: "Purple", mass: 8.5, position: { x: 4.43, y: -2.56 }, velocity: { x: 0, y: 0 }, color: "purple", show: true },
			{ name: "Blue", mass: 8.5, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, color: "blue", show: true }
		]
	},
	"Collision test": { dt: 0.001,
		bodies: [
			{ name: "Ball 1", mass: 20, position: { x: 10, y: 10 }, velocity: { x: 0, y: 0 }, color: "yellow", show: true },
			{ name: "Ball 2", mass: 10, position: { x: 10.1, y: 20 }, velocity: { x: 0, y: -10 }, color: "gray", show: true },
			{ name: "else", mass: 0.0001, position: { x: -20, y: 12.5 }, velocity: { x: 0, y: 0 }, color: "black", show: true }
		]
	},
	"Rosace": { dt: 0.3,
		bodies: [
			{ name: "Object 1", mass: 8000, position: { x: 0, y: 0 }, velocity: { x: 0.009, y: 0.000 }, color: "darkgray", show: true },
			{ name: "Object 2", mass: 10.000, position: { x: 4.825, y: 7 }, velocity: { x: 5.077, y: -9.240 }, color: "pink", show: true }
		]
	}
};


function resetView() {
	cameraOffset = { x: 0, y: 0 };
	scrollZoom = 1;
	scale = 1  * scrollZoom;
}

function deleteBody(index) {
	bodies.splice(index, 1);
	updateControlValues();
}

function setupTrashIcons() {
	bodies.forEach((body, index) => {
		const trashIcon = document.getElementById(`trash${index}`);
		if (trashIcon) {
			trashIcon.addEventListener('click', () => {
				if (confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
					deleteBody(index);
				}
			});
		}
	});
}

document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case ' ':
			isPaused = !isPaused;
			startPauseBtn.textContent = isPaused ? 'Lancer la simulation' : 'Pause';
			break;
		case 'r':
			resetView();
			break;
		case '+':
			scale *= 1.2;
			break;
		case '-':
			scale /= 1.2;
			break;
		case 'c':
			collisionsEnabled = !collisionsEnabled;
			document.getElementById('collisionToggle').checked = collisionsEnabled;
			break;
		case 'g':
			const gravityToggle = document.getElementById('gravityToggle');
			gravityToggle.checked = !gravityToggle.checked;
			break;
		case 'v':
			const showVelocities = document.getElementById('showVelocities');
			showVelocities.checked = !showVelocities.checked;
			break;
		case 'f':
			const frictionToggle = document.getElementById('frictionToggle');
			frictionToggle.checked = !frictionToggle.checked;
			break;
		case 'Enter':
			if (isPaused) {
				startPauseBtn.textContent = 'Pause';
				isPaused = false;
			} else {
				startPauseBtn.textContent = 'Lancer la simulation';
				isPaused = true;
			}
			break;
	}
});

document.getElementById('zoomOut10').addEventListener('click', () => {
	scrollZoom /= 10;
	scale = scale * scrollZoom;
});

document.getElementById('zoomOut2').addEventListener('click', () => {
	scrollZoom /= 2;
	scale = scale * scrollZoom;
});

document.getElementById('zoomIn2').addEventListener('click', () => {
	scrollZoom *= 2;
	scale = scale * scrollZoom;
});

document.getElementById('zoomIn10').addEventListener('click', () => {
	scrollZoom *= 10;
	scale = scale * scrollZoom;
});

const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
});

let timeElapsed = 0;
const timerDisplay = document.getElementById('timer');

function startTimer() {
	timeElapsed = 0;
	timerDisplay.textContent = `Temps : 0.00 s`;

	function updateTimer() {
		if (!isPaused) {
			timeElapsed += parseFloat(dtInput.value);
			timerDisplay.textContent = `Temps : ${timeElapsed.toFixed(2)} s`;
		}
		requestAnimationFrame(updateTimer);
	}
	updateTimer();
}

document.getElementById('resetViewBtn').addEventListener('click', () => {
	resetView();
	startTimer();
});

startPauseBtn.addEventListener('click', () => {
	if (!isPaused) {
		startTimer();
	}
});

startTimer();


function updateControlValues() {
	controlsContainer.innerHTML = '';

	focusSelect.innerHTML = '<option value="barycenter">Barycentre</option>'; // Réinitialiser

	bodies.forEach((body, index) => {
		focusSelect.innerHTML += `<option value="${index}">${body.name || `Objet ${index + 1}`}</option>`;

		const group = document.createElement('div');
		group.className = 'control-group';
		group.innerHTML = `
			<div class="checkbox-group">
				<input type="checkbox" id="show${index + 1}" ${body.show ? 'checked' : ''}>
				<label for="show${index + 1}">
					<span class="color-indicator" id="color${index}" style="background-color: ${body.color}; cursor: pointer;"></span>
					<input type="text" id="name${index}" value="${body.name || `Objet ${index + 1}`}" style="background: none; border: none; color: white; font-size: 14px; width: auto;">
					<img src="image/trash-icon.png" id="trash${index}" class="trash-icon" alt="Supprimer">
				</label>
			</div>
			<label for="mass${index + 1}">Masse :</label>
			<input type="number" id="mass${index + 1}" value="${body.mass.toFixed(3)}" step="any">
			<label for="x${index + 1}">Position X :</label>
			<input type="number" id="x${index + 1}" value="${body.position.x.toFixed(3)}" step="any">
			<label for="y${index + 1}">Position Y :</label>
			<input type="number" id="y${index + 1}" value="${body.position.y.toFixed(3)}" step="any">
			<label for="vx${index + 1}">Vitesse X :</label>
			<input type="number" id="vx${index + 1}" value="${body.velocity.x.toFixed(3)}" step="any">
			<label for="vy${index + 1}">Vitesse Y :</label>
			<input type="number" id="vy${index + 1}" value="${body.velocity.y.toFixed(3)}" step="any">
			<hr style="width:25%;text-align:center;color:#444">
			<br>
		`;
		controlsContainer.appendChild(group);

		document.getElementById(`show${index + 1}`).addEventListener('change', (e) => {
			body.show = e.target.checked;
			resetView();
		});

		const nameInput = document.getElementById(`name${index}`);
		nameInput.addEventListener('input', (e) => {
			body.name = e.target.value;
		});

		const colorIndicator = document.getElementById(`color${index}`);
		colorIndicator.addEventListener('click', () => {
			if (isPaused) {
				const newColor = prompt("Entrez la nouvelle couleur (nom ou code hexadécimal) :", body.color);
				if (newColor) {
					body.color = newColor;
					updateControlValues();
				}
			}
		});

		const massInput = document.getElementById(`mass${index + 1}`);
		const xInput = document.getElementById(`x${index + 1}`);
		const yInput = document.getElementById(`y${index + 1}`);
		const vxInput = document.getElementById(`vx${index + 1}`);
		const vyInput = document.getElementById(`vy${index + 1}`);

		massInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.mass = parseFloat(e.target.value);
				resetView();
			}
		});

		xInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.position.x = parseFloat(e.target.value);
				body.trail = [];
				body.points = [];
				resetView();
			}
		});

		yInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.position.y = parseFloat(e.target.value);
				body.trail = [];
				body.points = [];
				resetView();
			}
		});

		vxInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.velocity.x = parseFloat(e.target.value);
				resetView();
			}
		});

		vyInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.velocity.y = parseFloat(e.target.value);
				resetView();
			}
		});
	});

	setupTrashIcons();
}

document.getElementById('resetViewBtn').addEventListener('click', () => {
	resetView();
});

const impactSound = new Audio('sound/impact-sound.mp3');
let isPlaying = false;

let lastImpactTime = 0;
const impactDelay = 1;

function playImpactSound() {
	const currentTime = Date.now();
	if (currentTime - lastImpactTime > impactDelay) {
		lastImpactTime = currentTime;
		const impactSound = new Audio('sound/impact-sound.mp3');
		impactSound.play();
	}
}

function calculateForces() {
	const gravityEnabled = document.getElementById('gravityToggle').checked;

	if (!gravityEnabled) {
		bodies.forEach(body => {
			body.acceleration.x = 0;
			body.acceleration.y = 0;
		});
		return;
	}

	for (let i = 0; i < bodies.length; i++) {
		let fx = 0;
		let fy = 0;

		for (let j = 0; j < bodies.length; j++) {
			if (i !== j) {
				const dx = bodies[j].position.x - bodies[i].position.x;
				const dy = bodies[j].position.y - bodies[i].position.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const force = (G * bodies[i].mass * bodies[j].mass) / (distance * distance);

				fx += force * (dx / distance);
				fy += force * (dy / distance);
			}
		}

		bodies[i].acceleration.x = fx / bodies[i].mass;
		bodies[i].acceleration.y = fy / bodies[i].mass;
	}
}

const frictionToggle = document.getElementById('frictionToggle');
const frictionCoefficientContainer = document.getElementById('frictionCoefficientContainer');
const frictionCoefficientInput = document.getElementById('frictionCoefficient');

frictionToggle.addEventListener('change', () => {
	if (frictionToggle.checked) {
		frictionCoefficientContainer.style.display = 'block';
	} else {
		frictionCoefficientContainer.style.display = 'none';
	}
});

function applyFriction() {
	if (frictionToggle.checked) {
		const coefficient = parseFloat(frictionCoefficientInput.value);
		bodies.forEach(body => {
			body.velocity.x *= (1 - coefficient);
			body.velocity.y *= (1 - coefficient);
		});
	}
}

function simulate() {
	if (!isPaused) {
		calculateForces();
		applyFriction(); 

	}

	requestAnimationFrame(simulate);
}
simulate();


const slider = document.getElementById('trailLimit');
const tooltip = document.getElementById('sliderTooltip');

slider.addEventListener('input', (e) => {
	const value = e.target.value;
	tooltip.textContent = `${value}`;
	tooltip.style.left = `${offset + tooltipRect.width / 2}px`;
	tooltip.style.display = 'block';
});

slider.addEventListener('mouseleave', () => {
	tooltip.style.display = 'none';
});

slider.addEventListener('mouseover', () => {
	tooltip.style.display = 'block';
});


function adjustTrails(trailMaxPoints) {
	bodies.forEach(body => {
		while (body.trail.length > trailMaxPoints) {
			body.trail.shift();
		}
		while (body.points.length > trailMaxPoints) {
			body.points.shift();
		}
	});
}

function updatePositions(dt) {
	const trailLimitInput = document.getElementById('trailLimit');
	const trailMaxPoints = Math.pow(10, trailLimitInput.value);

	for (const body of bodies) {
		body.velocity.x += body.acceleration.x * dt;
		body.velocity.y += body.acceleration.y * dt;

		body.position.x += body.velocity.x * dt;
		body.position.y += body.velocity.y * dt;

		body.trail.push({ x: body.position.x, y: body.position.y });
		if (body.trail.length > trailMaxPoints) {
			body.trail.shift();
		}

		body.points.push({ x: body.position.x, y: body.position.y });
		if (body.points.length > trailMaxPoints) {
			body.points.shift();
		}
	}
}

function calculateBarycenter() {
	if (focusObject !== 'barycenter') {
		const selectedBody = bodies[parseInt(focusObject)];
		return { x: selectedBody.position.x, y: selectedBody.position.y };
	}
	let barycenter = { x: 0, y: 0 };
	let totalMass = 0;

	bodies.forEach(body => {
		if (body.show) {
			totalMass += body.mass;
			barycenter.x += body.position.x * body.mass;
			barycenter.y += body.position.y * body.mass;
		}
	});

	barycenter.x /= totalMass;
	barycenter.y /= totalMass;

	const maxDistance = Math.max(...bodies.map(body => 
		Math.sqrt(Math.pow(body.position.x - barycenter.x, 2) + Math.pow(body.position.y - barycenter.y, 2))
	));
	
	const maxRadius = showSizeCheckbox.checked ? 10 / scale : 10;
	const minCanvasSize = Math.min(canvas.width, canvas.height);

	scale = Math.min(
		minCanvasSize / (maxDistance * 2),
		minCanvasSize / (maxRadius * 2)
	) * scrollZoom;

	return barycenter;
}

function drawVelocityVectors() {
	const showVelocities = document.getElementById('showVelocities').checked;
	if (!showVelocities) return;

	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(scale, scale);
	ctx.translate(-calculateBarycenter().x, -calculateBarycenter().y);

	bodies.forEach(body => {
		if (body.show) {
			const vectorLength = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2) * 2 ;
			const endX = body.position.x + body.velocity.x * vectorLength;
			const endY = body.position.y + body.velocity.y * vectorLength;
			
			ctx.beginPath();
			ctx.moveTo(body.position.x, body.position.y);
			ctx.lineTo(endX, endY);
			ctx.strokeStyle = 'darkgray'; 
			ctx.lineWidth = 1 / scale;
			ctx.stroke();
			ctx.closePath();

			const arrowSize = 6 / scale;
			const angle = Math.atan2(body.velocity.y, body.velocity.x);
			ctx.beginPath();
			ctx.moveTo(endX, endY);
			ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6));
			ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6));
			ctx.lineTo(endX, endY);
			ctx.fillStyle = 'darkgray';
			ctx.fill();
			ctx.closePath();
		}
	});

	ctx.restore();
}

function drawBodies(barycenter) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(scale, scale);
	ctx.translate(-barycenter.x, -barycenter.y);
	const barycenterPointSize = 1.1 / scale;
	bodies.forEach(body => {
		if (body.show) {
			ctx.beginPath();
			const radius = showSizeCheckbox.checked ? 10 / scale : 2.5;
			ctx.arc(body.position.x, body.position.y, radius, 0, 2 * Math.PI);
			ctx.fillStyle = body.color;
			ctx.fill();
			ctx.closePath();

			body.points.forEach(point => {
				ctx.beginPath();
				const pointSize = radius * 0;
				ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
				ctx.fillStyle = body.color;
				ctx.globalAlpha = 0.5;
				ctx.fill();
				ctx.globalAlpha = 1.0;
				ctx.closePath();
			});

			body.trail.forEach((point, i) => {
				if (i > 0) {
					ctx.beginPath();
					ctx.moveTo(body.trail[i - 1].x, body.trail[i - 1].y);
					ctx.lineTo(point.x, point.y);
					ctx.strokeStyle = body.color;
					ctx.lineWidth = 1 / scale;
					ctx.stroke();
					ctx.closePath();
				}
			});
		}
	});
	ctx.beginPath();
	ctx.arc(barycenter.x, barycenter.y, barycenterPointSize, 0, 2 * Math.PI);
	ctx.fillStyle = 'gray';
	ctx.fill();
	ctx.closePath();

	ctx.restore();
	
	drawVelocityVectors();
}

function clearTrails() {
	bodies.forEach(body => {
		body.trail = [];
		body.points = [];
	});
}

function getRandomPosition() {
	const minDistance = 50;
	let position;
	let validPosition = false;

	while (!validPosition) {
		position = {
			x: (Math.random() - 0.5) * canvas.width / scale + calculateBarycenter().x,
			y: (Math.random() - 0.5) * canvas.height / scale + calculateBarycenter().y
		};
		
		validPosition = bodies.every(body => {
			const dx = body.position.x - position.x;
			const dy = body.position.y - position.y;
			return Math.sqrt(dx * dx + dy * dy) > minDistance;
		});
	}
	return position;
}

function detectCollisions() {
	const radius = 2.5; // Rayon des objets

	for (let i = 0; i < bodies.length; i++) {
		for (let j = i + 1; j < bodies.length; j++) {
			const dx = bodies[j].position.x - bodies[i].position.x;
			const dy = bodies[j].position.y - bodies[i].position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 2 * radius) {
				resolveCollision(bodies[i], bodies[j]);
				playImpactSound();
			}
		}
	}
}

function resolveCollision(body1, body2) {
	const radius = 2.5;
	const dx = body2.position.x - body1.position.x;
	const dy = body2.position.y - body1.position.y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	const nx = dx / distance;
	const ny = dy / distance;

	const p = 2 * (body1.velocity.x * nx + body1.velocity.y * ny - body2.velocity.x * nx - body2.velocity.y * ny) / (body1.mass + body2.mass);
	body1.velocity.x -= p * body2.mass * nx;
	body1.velocity.y -= p * body2.mass * ny;
	body2.velocity.x += p * body1.mass * nx;
	body2.velocity.y += p * body1.mass * ny;

	const overlap = 2 * radius - distance;
	body1.position.x -= overlap / 2 * nx;
	body1.position.y -= overlap / 2 * ny;
	body2.position.x += overlap / 2 * nx;
	body2.position.y += overlap / 2 * ny;
}


function animate() {
	if (!isPaused) {
		const dt = parseFloat(dtInput.value);
		calculateForces();
		if (collisionsEnabled) {
			detectCollisions();
		}
		updatePositions(dt);
		const barycenter = calculateBarycenter();
		drawBodies(barycenter);
		updateControlValues();
	} else {
		drawBodies(calculateBarycenter());
	}
	requestAnimationFrame(animate);
}

document.getElementById('collisionToggle').addEventListener('change', (e) => {
	collisionsEnabled = e.target.checked;
});

document.getElementById('addBodyBtn').addEventListener('click', () => {
	const newBody = {
		mass: 50 + Math.random() * 100,
		position: getRandomPosition(),
		velocity: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 },
		color: '#' + Math.floor(Math.random() * 16777215).toString(16),
		acceleration: { x: 0, y: 0 },
		trail: [],
		show: true,
		points: []
	};
	bodies.push(newBody);
	updateControlValues();
});

document.getElementById('loadPresetBtn').addEventListener('click', () => {
	const selectedPresetName = document.getElementById('presetSelect').value;
	if (selectedPresetName && presets[selectedPresetName]) {
		const preset = presets[selectedPresetName];
		dtInput.value = preset.dt;

		clearTrails();
		
		while (bodies.length > preset.bodies.length) {
			bodies.pop();
		}

		while (bodies.length < preset.bodies.length) {
			bodies.push({
				mass: 100,
				position: { x: 0, y: 0 },
				velocity: { x: 0, y: 0 },
				color: '#ffffff',
				acceleration: { x: 0, y: 0 },
				trail: [],
				show: true,
				points: []
			});
		}

		preset.bodies.forEach((presetBody, index) => {
			if (bodies[index]) {
				bodies[index].mass = presetBody.mass;
				bodies[index].position = { ...presetBody.position };
				bodies[index].velocity = { ...presetBody.velocity };
				bodies[index].color = presetBody.color;
				bodies[index].show = presetBody.show;
				bodies[index].name = presetBody.name;
			}
		});

		updateControlValues();
	}
});

function handleMouseDown(event) {
	const mouseX = (event.offsetX - canvas.width / 2) / scale + calculateBarycenter().x;
	const mouseY = (event.offsetY - canvas.height / 2) / scale + calculateBarycenter().y;

	for (const body of bodies) {
		const dx = mouseX - body.position.x;
		const dy = mouseY - body.position.y;
		if (Math.sqrt(dx * dx + dy * dy) < (showSizeCheckbox.checked ? 10 / scale : 10)) {
			selectedBody = body;
			isPaused = true;
			startPauseBtn.textContent = "Lancer la simulation";
			break;
		}
	}
}

function handleMouseMove(event) {
	if (selectedBody) {
		const mouseX = (event.offsetX - canvas.width / 2) / scale + calculateBarycenter().x;
		const mouseY = (event.offsetY - canvas.height / 2) / scale + calculateBarycenter().y;
		selectedBody.position.x = mouseX;
		selectedBody.position.y = mouseY;
		updateControlValues();
		clearTimeout(manualMoveTimeout);
		manualMoveTimeout = setTimeout(() => {
			isPaused = true;
			startPauseBtn.textContent = "Mettre en pause";
		}, 200);
	}
}

function handleMouseUp() {
	selectedBody = null;
}

function handleMouseWheel(event) {
	event.preventDefault();
	scrollZoom *= (1 + event.deltaY * -0.001);
	scale *= scrollZoom;
}

startPauseBtn.addEventListener('click', () => {
	isPaused = !isPaused;
	startPauseBtn.textContent = isPaused ? "Lancer la simulation" : "Mettre en pause";
});

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('wheel', handleMouseWheel);

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth - 300;
	canvas.height = window.innerHeight;
	if (focusObject === 'barycenter') {
		resetView();
	}
});

window.dispatchEvent(new Event('resize'));
updateControlValues();
animate();

document.getElementById('savePresetBtn').addEventListener('click', () => {
	const presetNameInput = document.getElementById('presetName');
	let presetName = presetNameInput.value.trim();
	if (!presetName) {
		presetName = 'preset ' + Date.now();
	}

	presets[presetName] = {
		dt: parseFloat(dtInput.value),
		bodies: bodies.map(body => ({
			mass: body.mass,
			position: { x: body.position.x, y: body.position.y },
			velocity: { x: body.velocity.x, y: body.velocity.y },
			color: body.color,
			show: body.show
		}))
	};

	updatePresetSelect();
	presetNameInput.value = '';
});

function updatePresetSelect() {
	const presetSelect = document.getElementById('presetSelect');
	presetSelect.innerHTML = '<option value="">Sélectionnez un preset</option>';
	Object.keys(presets).forEach(presetName => {
		const option = document.createElement('option');
		option.value = presetName;
		option.textContent = presetName;
		presetSelect.appendChild(option);
	});
}

updatePresetSelect();


