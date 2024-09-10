let isPaused = true;
let collisionsEnabled = document.getElementById('collisionToggle').checked;
let mergingEnabled = document.getElementById('mergeToggle').checked;
let focusObject = 'barycenter';
let selectedBody = null;
let isDragging = false;
let initialPinchDistance = null;
let lastPinchZoom = null;
let manualMoveTimeout = null;
let scale = 1;
let scrollZoom = 1;
let cameraOffset = { x: 0, y: 0 };
let G, k;
let timeElapsed = 0;
let lastTime = 0;
let isPlaying = false;
let lastImpactTime = 0;
let lastMergeTime = 0;
let fps = 0;
let frameCount = 0;
let fpsTime = 0;

const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const dtInput = document.getElementById('dt');
const startPauseBtn = document.getElementById('startPauseBtn');
const startPauseImg = document.getElementById('startPauseImg');
const controlsContainer = document.getElementById('object-controls');
const showSizeCheckbox = document.getElementById('showSize');
const focusSelect = document.getElementById('focusSelect');
const mouseCoordsDisplay = document.getElementById('mouseCoords');
const controls = document.getElementById('controls');
const controlsToggle = document.getElementById('controlsToggle');
const constValCheckbox = document.getElementById('ConstVal');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const frictionToggle = document.getElementById('frictionToggle');
const frictionCoefficientContainer = document.getElementById('frictionCoefficientContainer');
const frictionCoefficientInput = document.getElementById('frictionCoefficient');
const slider = document.getElementById('trailLimit');
const tooltip = document.getElementById('sliderTooltip');
const timerDisplay = document.getElementById('timer');
const impactSound = new Audio('sound/impact-sound.mp3');
const mergeSound = new Audio('sound/merge-sound.mp3');
const impactDelay = 1;
const mergeDelay = 1;
const helpBtn = document.getElementById('helpBtn');
const modal = document.getElementById('helpModal');
const closeBtn = document.querySelector('.close');
const isHidden = controls.classList.toggle('hidden');
const bodies = initialBodies.map(body => ({
	...body,
	acceleration: { x: 0, y: 0 },
	trail: [],
	show: true,
	points: []
}));

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

canvas.addEventListener('wheel', handleMouseWheel);

canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);

focusSelect.addEventListener('change', (e) => {
	focusObject = e.target.value;
});

frictionToggle.addEventListener('change', () => {
	if (frictionToggle.checked) {
		frictionCoefficientContainer.style.display = 'block';
	} else {
		frictionCoefficientContainer.style.display = 'none';
	}
});

constValCheckbox.addEventListener('change', updateConstants);

helpBtn.addEventListener('click', () => {
	isPaused = true
	updateButtonImage();
	modal.style.display = 'block';
});

helpBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
	isPaused = true
	updateButtonImage();
	modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
	modal.style.display = 'none';
});

closeBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
	modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
	if (event.target === modal) {
		modal.style.display = 'none';
	}
});

controlsToggle.addEventListener('click', () => {;
	const isHidden = !controls.classList.toggle('hidden');
    controlsToggle.innerHTML = isHidden ? '&#x25C0;' : '&#x25B6;';
    document.body.classList.toggle('hidden');
    window.dispatchEvent(new Event('resize'));
});

controlsToggle.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
	const isHidden = !controls.classList.toggle('hidden');
    controlsToggle.innerHTML = isHidden ? '&#x25C0;' : '&#x25B6;';
    document.body.classList.toggle('hidden');
    window.dispatchEvent(new Event('resize'));
});

fullscreenBtn.addEventListener('click', () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
        fullscreenImg.src = "image/full-screen-off-icon.png";
        fullscreenImg.alt = "Quit Full-screen";
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
			fullscreenImg.src = "image/full-screen-on-icon.png";
			fullscreenImg.alt = "Full-screen";
		}
	}
});

fullscreenBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
        fullscreenImg.src = "image/full-screen-off-icon.png";
        fullscreenImg.alt = "Quit Full-screen";
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
			fullscreenImg.src = "image/full-screen-on-icon.png";
			fullscreenImg.alt = "Full-screen";
		}
	}
});

startPauseBtn.addEventListener('click', () => {
	Pause();
});

startPauseBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    Pause();
});

slider.addEventListener('input', (e) => {
	const value = e.target.value;
	tooltip.textContent = `10^${value}`;
	if (value == 0) {
		clearTrails();
	}
});

slider.addEventListener('mouseleave', () => {
	tooltip.style.display = 'none';
});

slider.addEventListener('mouseover', () => {
	tooltip.style.display = 'block';
});

canvas.addEventListener('mousemove', (event) => {
    updateCoord();
});

window.addEventListener('resize', () => {
    if (controls.classList.contains('hidden')) {
        canvas.width = window.innerWidth -300;
        console.log('window: 0');
    } else {
        canvas.width = window.innerWidth;
        console.log('window: 300');
    }
    canvas.height = window.innerHeight;
});

window.dispatchEvent(new Event('resize'));

document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case ' ':
			Pause();
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
			if (collisionsEnabled) {
				mergingEnabled = false;
				document.getElementById('mergeToggle').checked = mergingEnabled;
				}
			break;
		case 'm':
			mergingEnabled = !mergingEnabled;
			document.getElementById('mergeToggle').checked = mergingEnabled;
			if (mergingEnabled) {
				collisionsEnabled = false;
				document.getElementById('collisionToggle').checked = collisionsEnabled;
				}
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
			Pause();
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

document.getElementById('resetViewBtn').addEventListener('click', () => {
	resetView();
});

document.getElementById('collisionToggle').addEventListener('change', (e) => {
	collisionsEnabled = e.target.checked;
	if (collisionsEnabled) {
		mergingEnabled = false;
		document.getElementById('mergeToggle').checked = mergingEnabled;
		}
});

document.getElementById('mergeToggle').addEventListener('change', (e) => {
	mergingEnabled = e.target.checked;
	if (mergingEnabled) {
		collisionsEnabled = false;
		document.getElementById('collisionToggle').checked = collisionsEnabled;
		}
});

document.getElementById('addBodyBtn').addEventListener('click', () => {
	const newBody = {
		mass: 50 + Math.random() * 100,
		charge: Math.round((Math.random() * 3 - 1.5) * 10) / 10,
		radius: Math.ceil(10 * getRadius(2.5, 3, 0.5)) / 10,
		position: getRandomPosition(),
		velocity: { x: getRandomSpeed(), y: getRandomSpeed() },
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
	createRdPreset();
	if (selectedPresetName && presets[selectedPresetName]) {
		const preset = presets[selectedPresetName];
		dtInput.value = preset.dt;

		clearTrails();
		
		while (bodies.length > preset.bodies.length) {
			bodies.pop();
		}

		while (bodies.length < preset.bodies.length) {
			bodies.push({
				mass: 1,
				charge: 0,
				radius: 2.5,
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
				bodies[index].charge = presetBody.charge;
				bodies[index].radius = presetBody.radius;
				bodies[index].position = { ...presetBody.position };
				bodies[index].velocity = { ...presetBody.velocity };
				bodies[index].color = presetBody.color;
				bodies[index].show = presetBody.show;
				bodies[index].name = presetBody.name;
			}
		});

		updateControlValues();
		resetView();
		startTimer();
	}
});

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
			charge: body.charge,
			radius: body.radius,
			position: { x: body.position.x, y: body.position.y },
			velocity: { x: body.velocity.x, y: body.velocity.y },
			color: body.color,
			show: body.show
		}))
	};

	updatePresetSelect();
	presetNameInput.value = '';
});

function createRdPreset() {
	createRandomPreset("Random preset (25 objects)", 25, 200, 130);
	createRandomPreset("Random preset (40 objects)", 40, 230, 150);
	createRandomPreset("Random preset (60 objects)", 60, 255, 166);
	createLinePreset("Body Line", 16);
}

function gaussianRandom(mean, stdDev) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z * stdDev + mean;
}

function getRadius(mean, stdDev, min) {
	let const1 = gaussianRandom(mean, stdDev);
	let const2 = const1 < min ? stdDev : const1;
	return const2;
}

function updateCoord() {
    const barycenter = calculateBarycenter();

    const rect = canvas.getBoundingClientRect();

    const mouseXOnCanvas = (event.clientX - rect.left) / scale;
    const mouseYOnCanvas = (event.clientY - rect.top) / scale;

    const mouseX = mouseXOnCanvas + (barycenter.x - canvas.width / 2 / scale);
    const mouseY = mouseYOnCanvas + (barycenter.y - canvas.height / 2 / scale);

    mouseCoordsDisplay.textContent = `Coord : (${mouseX.toFixed(2)}; ${mouseY.toFixed(2)})`;
}

function updateConstants() {
    if (constValCheckbox.checked) {
        G = 6.67e-11; // Constante gravitationnelle (réelle)
        k = 8.99e9; // Constante de Coulomb (réelle)
    } else {
        G = 0.1; // Valeurs normalisées
        k = 100;
    }
    console.log('G:', G, 'k:', k);
}

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
				if (confirm('Are you sure you want to delete this Object ')) {
					deleteBody(index);
				}
			});
		}
	});
}

function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = `Time : 0.00 s`;
    lastTime = performance.now(); 

    function updateTimer(currentTime) {
        if (!isPaused) {
            const deltaTime = (currentTime - lastTime) / 1000;
            timeElapsed += deltaTime * parseFloat(dtInput.value);
            timerDisplay.textContent = `${timerLng} ${formatTime(timeElapsed)}`;
        }
        lastTime = currentTime; 
        requestAnimationFrame(updateTimer);
    }

    requestAnimationFrame(updateTimer);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);

    if (hours > 0) {
        return `${hours} h ${minutes} m ${remainingSeconds} s`; 
    } else if (minutes > 0) {
        return `${minutes} m ${remainingSeconds} s`;
    } else {
        return `${remainingSeconds} s`;
    }
}

function updateControlValues() {
	controlsContainer.innerHTML = '';

	focusSelect.innerHTML = '<option value="barycenter" id="barycenterLabel">Barycentre</option>';

	bodies.forEach((body, index) => {
		focusSelect.innerHTML += `<option value="${index}">${body.name || `Objet ${index + 1}`}</option>`;

		const group = document.createElement('div');
		group.className = 'control-group';
        group.innerHTML = `
            <div class="checkbox-group">
                <input type="checkbox" id="show${index + 1}" ${body.show ? 'checked' : ''}>
                
                <label for="info${index + 1}">
                    <span class="color-indicator" id="color${index}" style="background-color: ${body.color}; cursor: pointer;"></span>
                    <input type="text" id="name${index}" value="${body.name || `Object ${index + 1}`}" style="background: none; border: none; color: white; font-size: 14px; width: 90%;">
                    <img src="image/trash-icon.png" id="trash${index}" class="trash-icon" alt="Delete">
                </label>
            </div>
            
            <label for="mass${index + 1}" id="MassEntree">Mass:</label>
            <div class="input-group">
                <button onclick="adjustValue('mass${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('mass${index + 1}', 0.5)">/2</button>
                <input type="number" id="mass${index + 1}" value="${body.mass.toFixed(2)}" step="5">
                <button onclick="adjustValue('mass${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('mass${index + 1}', 10)">x10</button>
            </div>
            
            <label for="charge${index + 1}" id="ChargeEntree">Charge:</label>
            <div class="input-group">
                <button onclick="adjustValue('charge${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('charge${index + 1}', 0.5)">/2</button>
                <input type="number" id="charge${index + 1}" value="${body.charge.toFixed(1)}" step="1">
                <button onclick="adjustValue('charge${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('charge${index + 1}', 10)">x10</button>
            </div>
            
            <label for="radius${index + 1}" id="radiusEntree">Radius:</label>
            <div class="input-group">
                <button onclick="adjustValue('radius${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('radius${index + 1}', 0.5)">/2</button>
                <input type="number" id="radius${index + 1}" value="${body.radius.toFixed(1)}" step="0.5">
                <button onclick="adjustValue('radius${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('radius${index + 1}', 10)">x10</button>
            </div>
            
            <label for="x${index + 1}" id="PosXEntree">X Position:</label>
            <div class="input-group">
                <button onclick="adjustValue('x${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('x${index + 1}', 0.5)">/2</button>
                <input type="number" id="x${index + 1}" value="${body.position.x.toFixed(2)}" step="1">
                <button onclick="adjustValue('x${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('x${index + 1}', 10)">x10</button>
            </div>
            
            <label for="y${index + 1}" id="PosYEntree">Y Position:</label>
            <div class="input-group">
                <button onclick="adjustValue('y${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('y${index + 1}', 0.5)">/2</button>
                <input type="number" id="y${index + 1}" value="${body.position.y.toFixed(2)}" step="0.5">
                <button onclick="adjustValue('y${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('y${index + 1}', 10)">x10</button>
            </div>
            
            <label for="vx${index + 1}" id="SpeedXEntree">X Speed:</label>
            <div class="input-group">
                <button onclick="adjustValue('vx${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('vx${index + 1}', 0.5)">/2</button>
                <input type="number" id="vx${index + 1}" value="${body.velocity.x.toFixed(3)}" step="0.5">
                <button onclick="adjustValue('vx${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('vx${index + 1}', 10)">x10</button>
            </div>
            
            <label for="vy${index + 1}" id="SpeedYEntree">Y Speed:</label>
            <div class="input-group">
                <button onclick="adjustValue('vy${index + 1}', 0.5)">/2</button>
                <button onclick="adjustValue('vy${index + 1}', 0.1)">/10</button>
                <input type="number" id="vy${index + 1}" value="${body.velocity.y.toFixed(3)}" step="0.1">
                <button onclick="adjustValue('vy${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('vy${index + 1}', 10)">x10</button>
            </div>
            
            <hr style="width:100%;text-align:center;color:#444">
            
            <br>
        `;
		controlsContainer.appendChild(group);

		document.getElementById(`show${index + 1}`).addEventListener('change', (e) => {
			body.show = e.target.checked;
		});

		const nameInput = document.getElementById(`name${index}`);
		nameInput.addEventListener('input', (e) => {
			body.name = e.target.value;
		});

		const colorIndicator = document.getElementById(`color${index}`);
		colorIndicator.addEventListener('click', () => {
			if (isPaused) {
				const colorPicker = document.createElement('input');
				colorPicker.type = 'color';
				colorPicker.value = body.color;
				colorPicker.style.position = 'absolute';
				colorPicker.style.left = `${colorIndicator.getBoundingClientRect().left}px`;
				colorPicker.style.top = `${colorIndicator.getBoundingClientRect().top}px`;
				//document.body.appendChild(colorPicker);

				colorPicker.addEventListener('input', (event) => {
					body.color = event.target.value;
					updateControlValues();
				});
				colorPicker.addEventListener('change', () => {
					document.body.removeChild(colorPicker);
				});

				document.addEventListener('click', function handler(event) {
					if (!colorPicker.contains(event.target) && event.target !== colorIndicator) {
						document.body.removeChild(colorPicker);
						document.removeEventListener('click', handler);
					}
				}, { once: true });

				colorPicker.click();
			}
		});

		const massInput = document.getElementById(`mass${index + 1}`);
		const xInput = document.getElementById(`x${index + 1}`);
		const yInput = document.getElementById(`y${index + 1}`);
		const vxInput = document.getElementById(`vx${index + 1}`);
		const vyInput = document.getElementById(`vy${index + 1}`);
		const chargeInput = document.getElementById(`charge${index + 1}`);
		const radiusInput = document.getElementById(`radius${index + 1}`);

		massInput.addEventListener('input', (e) => {
			if (isPaused) {
				let value = parseFloat(e.target.value);

				if (value < 0) {
					value = Math.abs(value);
				}
				if (value === 0) {
					value = 0.0001;
				}

				body.mass = value;
				e.target.value = value.toFixed(2);
			}
		});

		xInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.position.x = parseFloat(e.target.value);
				body.trail = [];
				body.points = [];
			}
		});

		yInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.position.y = parseFloat(e.target.value);
				body.trail = [];
				body.points = [];
			}
		});

		vxInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.velocity.x = parseFloat(e.target.value);
			}
		});

		vyInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.velocity.y = parseFloat(e.target.value);
			}
		});
		
		chargeInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.charge = parseFloat(e.target.value);
			}
		});
		
		radiusInput.addEventListener('input', (e) => {
			if (isPaused) {
				let value = parseFloat(e.target.value);

				if (value < 0) {
					value = Math.abs(value);
				}
				if (value === 0) {
					value = 0.5;
				}

				body.radius = value;
				e.target.value = value.toFixed(1);
			}
		});
	});

	setupTrashIcons();
}

function adjustValue(inputId, factor) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = (parseFloat(input.value) * factor).toFixed(2);
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }
}

function playImpactSound() {
	const currentTime = Date.now();
	if (currentTime - lastImpactTime > impactDelay) {
		lastImpactTime = currentTime;
		const impactSound = new Audio('sound/impact-sound.mp3');
		impactSound.play();
	}
}

function playMergeSound() {
	const currentTime = Date.now();
	if (currentTime - lastMergeTime > mergeDelay) {
		lastMergeTime = currentTime;
		const mergeSound = new Audio('sound/merge-sound.mp3');
		mergeSound.play();
	}
}

function calculateForces() {
    const gravityEnabled = document.getElementById('gravityToggle').checked;
    const magneticEnabled = document.getElementById('magneticToggle').checked;

    bodies.forEach(body => {
        body.acceleration.x = 0;
        body.acceleration.y = 0;
    });

    for (let i = 0; i < bodies.length; i++) {
        let fx = 0;
        let fy = 0;

        for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
                const dx = bodies[j].position.x - bodies[i].position.x;
                const dy = bodies[j].position.y - bodies[i].position.y;
                
                if (isNaN(dx) || isNaN(dy)) {
                    console.error(`Les positions des objets ${i + 1} ou ${j + 1} sont invalides.`);
                    continue;
                }

                const distance = Math.sqrt(dx * dx + dy * dy);
				
                if (distance > 0) {
                    // console.log(`Objet${i + 1} - Objet${j + 1}: ${distance.toFixed(2)}`);

                    if (gravityEnabled) {
                        const forceG = (G * bodies[i].mass * bodies[j].mass) / (distance * distance);
                        fx += forceG * (dx / distance);
                        fy += forceG * (dy / distance);
                    }

                    if (magneticEnabled) {
                        const forceEM = (k * bodies[i].charge * bodies[j].charge) / (distance * distance);
                        fx += forceEM * (-dx / distance);
                        fy += forceEM * (-dy / distance);
                    }
                } else {
                    console.warn(`Les objets ${i + 1} et ${j + 1} se chevauchent ou sont à la même position.`);
                }
            }
        }

        bodies[i].acceleration.x = fx / bodies[i].mass;
        bodies[i].acceleration.y = fy / bodies[i].mass;
    }
}

function applyFriction() {
	if (frictionToggle.checked) {
		const coefficient = parseFloat(frictionCoefficientInput.value);
		bodies.forEach(body => {
			body.velocity.x *= (1 - coefficient ** 3);
			body.velocity.y *= (1 - coefficient ** 3);
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

    if (document.getElementById('showGravityField').checked || document.getElementById('showMagneticField').checked) {
        drawGravityField();
		drawMagneticField();
    }

    drawGrid();

	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(scale, scale);
	ctx.translate(-barycenter.x, -barycenter.y);
	const barycenterPointSize = 1.1 / scale;
	bodies.forEach(body => {
		if (body.show) {
			ctx.beginPath();
			const radius = showSizeCheckbox.checked ? Math.min(body.radius * 2.5, 7) / scale : body.radius;
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
	if (document.getElementById('showVelocities').checked) {
		ctx.arc(barycenter.x, barycenter.y, barycenterPointSize, 0, 2 * Math.PI);
	}
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

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = (bigint & 255);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function mixColors(color1, color2, surface1, surface2, threshold = 10) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const totalSurface = surface1 + surface2;
	
	const colorLost = 1 - 25 / 100

    let r = Math.round((rgb1.r * surface1 + rgb2.r * surface2) / totalSurface * colorLost);
    let g = Math.round((rgb1.g * surface1 + rgb2.g * surface2) / totalSurface * colorLost);
    let b = Math.round((rgb1.b * surface1 + rgb2.b * surface2) / totalSurface * colorLost);

    r = Math.max(r, threshold);
    g = Math.max(g, threshold);
    b = Math.max(b, threshold);

    return rgbToHex(r, g, b);
}

function detectProximity() {
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            const dx = bodies[j].position.x - bodies[i].position.x;
            const dy = bodies[j].position.y - bodies[i].position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const combinedRadius = bodies[i].radius + bodies[j].radius;

            if (distance < combinedRadius) {
				if (collisionsEnabled) {
					resolveCollision(bodies[i], bodies[j]);
					playImpactSound();
				}
                if (mergingEnabled) {
                    mergeBodies(bodies[i], bodies[j]);
					playMergeSound();
				}
            }
        }
    }
}

function resolveCollision(body1, body2) {
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

    const combinedRadius = body1.radius + body2.radius;
    const overlap = combinedRadius - distance;
    body1.position.x -= overlap / 2 * nx;
    body1.position.y -= overlap / 2 * ny;
    body2.position.x += overlap / 2 * nx;
    body2.position.y += overlap / 2 * ny;
}

function mergeBodies(body1, body2) {
    const newMass = body1.mass + body2.mass;
    const newCharge = body1.charge + body2.charge;

    const dx = body2.position.x - body1.position.x;
    const dy = body2.position.y - body1.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const nx = dx / distance;
    const ny = dy / distance;

    const p = 1 * (body1.velocity.x * nx + body1.velocity.y * ny - body2.velocity.x * nx - body2.velocity.y * ny) / (body1.mass + body2.mass);

    const body1VelocityAfterImpact = {
        x: body1.velocity.x - p * body2.mass * nx,
        y: body1.velocity.y - p * body2.mass * ny
    };
    const body2VelocityAfterImpact = {
        x: body2.velocity.x + p * body1.mass * nx,
        y: body2.velocity.y + p * body1.mass * ny
    };

    const newVelocity = {
        x: (body1VelocityAfterImpact.x + body2VelocityAfterImpact.x) / 6 + (body1.velocity.x + body2.velocity.x) / 2,
        y: (body1VelocityAfterImpact.y + body2VelocityAfterImpact.y) / 6 + (body1.velocity.y + body2.velocity.y) / 2
    };

    const newAcceleration = {
        x: (body1.acceleration.x + body2.acceleration.x) / 2,
        y: (body1.acceleration.y + body2.acceleration.y) / 2
    };

    const surface1 = Math.PI * Math.pow(body1.radius, 2);
    const surface2 = Math.PI * Math.pow(body2.radius, 2);
    const newSurface = surface1 + surface2;
    const newRadius = Math.sqrt(newSurface / Math.PI);
    const newColor = mixColors(body1.color, body2.color, surface1, surface2)

    const massPosition = {
        x: (body1.position.x * body1.mass + body2.position.x * body2.mass) / newMass,
        y: (body1.position.y * body1.mass + body2.position.y * body2.mass) / newMass
    };

    const chargePosition = {
        x: (body1.position.x * Math.abs(body1.charge) + body2.position.x * Math.abs(body2.charge)) / (Math.abs(body1.charge) + Math.abs(body2.charge)),
        y: (body1.position.y * Math.abs(body1.charge) + body2.position.y * Math.abs(body2.charge)) / (Math.abs(body1.charge) + Math.abs(body2.charge))
    };

    const surfacePosition = {
        x: (body1.position.x * surface1 + body2.position.x * surface2) / newSurface,
        y: (body1.position.y * surface1 + body2.position.y * surface2) / newSurface
    };

    const newPosition = {
		x: (massPosition.x + chargePosition.x + surfacePosition.x) / 3,
		y: (massPosition.y + chargePosition.y + surfacePosition.y) / 3
	};
		
    const newBody = {
        mass: newMass,
        charge: newCharge,
        radius: newRadius,
        position: newPosition,
        velocity: newVelocity,
        acceleration: newAcceleration,
        color: newColor,
        trail: [],
        show: true,
        points: []
    };

    bodies.splice(bodies.indexOf(body1), 1);
    bodies.splice(bodies.indexOf(body2), 1);

    bodies.push(newBody);
}

function displayFPS(currentTime) {
    frameCount++;

    const deltaTime = (currentTime - fpsTime) / 1000;
    if (deltaTime >= 1) {
        fps = Math.round(frameCount / deltaTime);
        fpsTime = currentTime;
        frameCount = 0;
    }

	document.getElementById('fpsDisplay').textContent = `fps: ${fps}`;
}

function animate(currentTime) {
    const startTime = performance.now();
    
	if (!isPaused) {
		const dt = parseFloat(dtInput.value);
		calculateForces();
		if (collisionsEnabled || mergingEnabled) {
			detectProximity();
		}
		updatePositions(dt);
		const barycenter = calculateBarycenter();
		drawBodies(barycenter);
		updateControlValues();
	} else {
		drawBodies(calculateBarycenter());
	}

    displayFPS(currentTime);
    
    const endTime = performance.now();
    const frameTime = endTime - startTime;
	
    cpuUsage = Math.min((frameTime / 16.67 / 2) * 100, 500);
    
    document.getElementById('UsageDisplay').textContent = `Usage: ${cpuUsage.toFixed(0)}%`;
	
    requestAnimationFrame(animate);
}

function getRandomSpeed() {
    const term0 = Math.random() * 4 - 2;
    const term1 = (term0 !== 0 ? Math.exp(-term0 * term0) : 1) * 5 * Math.sign(term0);
	const result = Math.round(term1 * 1000) / 1000;
    return result;
}

function handleMouseDown(event) {
	const mouseX = (event.offsetX - canvas.width / 2) / scale + calculateBarycenter().x;
	const mouseY = (event.offsetY - canvas.height / 2) / scale + calculateBarycenter().y;

	for (const body of bodies) {
		const dx = mouseX - body.position.x;
		const dy = mouseY - body.position.y;
		if (Math.sqrt(dx * dx + dy * dy) < (showSizeCheckbox.checked ? 10 / scale : 10)) {
			selectedBody = body;
			isPaused = true;
			updateButtonImage();
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
			updateButtonImage();
		}, 0);
	}
}

function handleMouseUp() {
	selectedBody = null;
}

function handleTouchStart(event) {
    if (event.touches.length === 1) {
        const touch = event.touches[0];
        const touchX = (touch.clientX - canvas.width / 2) / scale + calculateBarycenter().x;
        const touchY = (touch.clientY - canvas.height / 2) / scale + calculateBarycenter().y;

        for (const body of bodies) {
            const dx = touchX - body.position.x;
            const dy = touchY - body.position.y;
            if (Math.sqrt(dx * dx + dy * dy) < (showSizeCheckbox.checked ? 10 / scale : 10)) {
                selectedBody = body;
                isDragging = true;
                isPaused = true;
                updateButtonImage();
                break;
            }
        }
    } else if (event.touches.length === 2) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        initialPinchDistance = getDistance(touch1, touch2);
        lastPinchZoom = scrollZoom;
    }
}

function handleTouchMove(event) {
    if (event.touches.length === 1 && isDragging && selectedBody) {
        event.preventDefault();
        const touch = event.touches[0];
        const touchX = (touch.clientX - canvas.width / 2) / scale + calculateBarycenter().x;
        const touchY = (touch.clientY - canvas.height / 2) / scale + calculateBarycenter().y;

        selectedBody.position.x = touchX;
        selectedBody.position.y = touchY;
        updateControlValues();
        clearTimeout(manualMoveTimeout);
        manualMoveTimeout = setTimeout(() => {
            isPaused = true;
            updateButtonImage();
        }, 0);
    } else if (event.touches.length === 2) {
        event.preventDefault();
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        const currentPinchDistance = getDistance(touch1, touch2);

        if (initialPinchDistance) {
            const pinchZoomFactor = currentPinchDistance / initialPinchDistance;
            scrollZoom = lastPinchZoom * pinchZoomFactor;
            scale = scrollZoom;
        }
    }
}

function handleTouchEnd(event) {
    if (event.touches.length < 2) {
        initialPinchDistance = null;

        if (event.touches.length === 0 && isDragging) {
            isDragging = false;
            selectedBody = null;
        }
    }
}

function handleMouseWheel(event) {
	event.preventDefault();
	scrollZoom *= (1 + event.deltaY * -0.001);
	scale *= scrollZoom;
}

function Pause() {
	isPaused = !isPaused;
    updateButtonImage();
}

function updateButtonImage() {
    if (isPaused) {
        startPauseImg.src = "image/start-button.png";
        startPauseImg.alt = "Start";
    } else {
        startPauseImg.src = "image/pause-button.png";
        startPauseImg.alt = "Pause";
    }
}

function updatePresetSelect() {
	const presetSelect = document.getElementById('presetSelect');
	createRdPreset();
	presetSelect.innerHTML = '<option value="">Sélectionnez un preset</option>';
	Object.keys(presets).forEach(presetName => {
		const option = document.createElement('option');
		option.value = presetName;
		option.textContent = presetName;
		presetSelect.appendChild(option);
	});
}

function drawGravityField() {
    const showGravityField = document.getElementById('showGravityField').checked;

    if (!showGravityField) return;

    ctx.save();
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const visibleWidth = canvasWidth / scale;
    const visibleHeight = canvasHeight / scale;
    const visibleCenterX = calculateBarycenter().x;
    const visibleCenterY = calculateBarycenter().y;

    const startX = visibleCenterX - (canvasWidth / 2 / scale);
    const startY = visibleCenterY - (canvasHeight / 2 / scale);

    const numVectorsX = Math.floor(canvasWidth / 15);
    const numVectorsY = Math.floor(canvasHeight / 15);

    const maxMass = Math.max(...bodies.map(body => body.mass));

    for (let i = 0; i < numVectorsX; i++) {
        for (let j = 0; j < numVectorsY; j++) {
            const x = startX + i * (visibleWidth / numVectorsX);
            const y = startY + j * (visibleHeight / numVectorsY);

            let fx = 0;
            let fy = 0;

            bodies.forEach(body => {
                const dx = body.position.x - x;
                const dy = body.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance !== 0) {
                    if (showGravityField) {
                        const forceG = (0.1 * body.mass) / (distance * distance);
                        fx += forceG * (dx / distance);
                        fy += forceG * (dy / distance);
                    }
                }
            });

            const forceMagnitude = Math.sqrt(fx * fx + fy * fy);

            if (forceMagnitude !== 0) {
                const vectorLength = Math.min(Math.sqrt(forceMagnitude) / maxMass * 20000, 10) / (showSizeCheckbox.checked ? scale : 2) * 1.5 ;

                ctx.beginPath();
                ctx.moveTo(x * scale - visibleCenterX * scale + canvasWidth / 2, y * scale - visibleCenterY * scale + canvasHeight / 2);
                ctx.lineTo(
                    (x + (fx / forceMagnitude) * vectorLength) * scale - visibleCenterX * scale + canvasWidth / 2,
                    (y + (fy / forceMagnitude) * vectorLength) * scale - visibleCenterY * scale + canvasHeight / 2
                );
                ctx.strokeStyle = `rgba(255, 100, 90, 1)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    ctx.restore();
}

function drawMagneticField() {
    const showMagneticField = document.getElementById('showMagneticField').checked;

    if (!showMagneticField) return;

    ctx.save();
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const visibleWidth = canvasWidth / scale;
    const visibleHeight = canvasHeight / scale;
    const visibleCenterX = calculateBarycenter().x;
    const visibleCenterY = calculateBarycenter().y;

    const startX = visibleCenterX - (canvasWidth / 2 / scale);
    const startY = visibleCenterY - (canvasHeight / 2 / scale);

    const numVectorsX = Math.floor(canvasWidth / 15);
    const numVectorsY = Math.floor(canvasHeight / 15);

	const maxCharge = bodies.reduce((max, body) => Math.max(max, Math.abs(body.charge)), 0) || 1;

    for (let i = 0; i < numVectorsX; i++) {
        for (let j = 0; j < numVectorsY; j++) {
            const x = startX + i * (visibleWidth / numVectorsX);
            const y = startY + j * (visibleHeight / numVectorsY);

            let fx = 0;
            let fy = 0;

            bodies.forEach(body => {
                const dx = body.position.x - x;
                const dy = body.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance !== 0) {
                    if (showMagneticField) {
                        const forceEM = (10 * body.charge) / (distance * distance);
                        fx += forceEM * (-dx / distance);
                        fy += forceEM * (-dy / distance);
                    }
                }
            });

            const forceMagnitude = Math.sqrt(fx * fx + fy * fy);

            if (forceMagnitude !== 0) {
                const vectorLength = Math.min(Math.sqrt(forceMagnitude / maxCharge) * 2000, 10) / (showSizeCheckbox.checked ? scale : 2) ;
				
                ctx.beginPath();
                ctx.moveTo(x * scale - visibleCenterX * scale + canvasWidth / 2, y * scale - visibleCenterY * scale + canvasHeight / 2);
                ctx.lineTo(
                    (x + (fx / forceMagnitude) * vectorLength) * scale - visibleCenterX * scale + canvasWidth / 2,
                    (y + (fy / forceMagnitude) * vectorLength) * scale - visibleCenterY * scale + canvasHeight / 2
                );
                ctx.strokeStyle = `rgba(115, 255, 205, 0.7)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    ctx.restore();
}


function getDistance(touch1, touch2) {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawGrid() {
    const showGrid = document.getElementById('showGrid').checked;
    if (!showGrid) return;

    ctx.save();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const visibleWidth = canvasWidth / scale;
    const visibleHeight = canvasHeight / scale;
    const visibleCenterX = calculateBarycenter().x;
    const visibleCenterY = calculateBarycenter().y;

    const startX = visibleCenterX - (canvasWidth / 2 / scale);
    const startY = visibleCenterY - (canvasHeight / 2 / scale);

    const baseGridSize = 75; 
    let gridSize = baseGridSize;

    while (gridSize * scale < 60) { 
        gridSize *= 2;
    }
    while (gridSize * scale > 150) {
        gridSize /= 2;
    }

    ctx.strokeStyle = 'rgba(200, 200, 200, 0.15)';
    ctx.lineWidth = Math.max(0.5, 10/(Math.exp(scale) + 100));

    for (let x = Math.floor(startX / gridSize) * gridSize; x < startX + visibleWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo((x - startX) * scale, 0);
        ctx.lineTo((x - startX) * scale, canvasHeight);
        ctx.stroke();
        ctx.closePath();
    }

    for (let y = Math.floor(startY / gridSize) * gridSize; y < startY + visibleHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, (y - startY) * scale);
        ctx.lineTo(canvasWidth, (y - startY) * scale);
        ctx.stroke();
        ctx.closePath();
    }
	
    const canvasX0 = (0 - visibleCenterX) * scale + canvasWidth / 2;
    const canvasY0 = (0 - visibleCenterY) * scale + canvasHeight / 2;

    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, canvasY0); 
    ctx.lineTo(canvasWidth, canvasY0);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(canvasX0, 0);
    ctx.lineTo(canvasX0, canvasHeight);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

startTimer();
updateConstants();
simulate();
updateControlValues();
animate();
updatePresetSelect();