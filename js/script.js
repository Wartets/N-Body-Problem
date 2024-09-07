let isPaused = true;
let collisionsEnabled = false;
let focusObject = 'barycenter';
let selectedBody = null;
let manualMoveTimeout = null;
let scale = 1;
let scrollZoom = 1;
let cameraOffset = { x: 0, y: 0 };
let G, k;
let timeElapsed = 0;
let lastTime = 0;
let isPlaying = false;
let lastImpactTime = 0;

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
const impactDelay = 1;
const helpBtn = document.getElementById('helpBtn');
const modal = document.getElementById('helpModal');
const closeBtn = document.querySelector('.close');
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
	// resetView();
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
	modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
	modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
	if (event.target === modal) {
		modal.style.display = 'none';
	}
});

controlsToggle.addEventListener('click', () => {
    const isHidden = controls.classList.toggle('hidden');
    controlsToggle.innerHTML = isHidden ? '&#x25C0;' : '&#x25B6;';
    // document.body.classList.toggle('hidden');
});

fullscreenBtn.addEventListener('click', () => {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
});

startPauseBtn.addEventListener('click', () => {
	Pause();
});

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

canvas.addEventListener('mousemove', (event) => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = (event.clientX - rect.left) / scale + cameraOffset.x;
	const mouseY = (event.clientY - rect.top) / scale + cameraOffset.y;
	mouseCoordsDisplay.textContent = `Coord : (${mouseX.toFixed(2)}; ${mouseY.toFixed(2)})`;
});

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth - 300;
	canvas.height = window.innerHeight;
	if (focusObject === 'barycenter') {
		resetView();
	}
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
});

document.getElementById('addBodyBtn').addEventListener('click', () => {
	const newBody = {
		mass: 50 + Math.random() * 100,
		charge: Math.round((Math.random() * 3 - 1.5) * 10) / 10,
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
				bodies[index].position = { ...presetBody.position };
				bodies[index].velocity = { ...presetBody.velocity };
				bodies[index].color = presetBody.color;
				bodies[index].show = presetBody.show;
				bodies[index].name = presetBody.name;
			}
		});

		updateControlValues();
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
			position: { x: body.position.x, y: body.position.y },
			velocity: { x: body.velocity.x, y: body.velocity.y },
			color: body.color,
			show: body.show
		}))
	};

	updatePresetSelect();
	presetNameInput.value = '';
});

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
				if (confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) {
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
					<input type="text" id="name${index}" value="${body.name || `Object ${index + 1}`}" style="background: none; border: none; color: white; font-size: 14px; width: auto;">
					<img src="image/trash-icon.png" id="trash${index}" class="trash-icon" alt="Supprimer">
				</label>
			</div>
			
			<label for="mass${index + 1}" id="MassEntree">Mass:</label>
			<input type="number" id="mass${index + 1}" value="${body.mass.toFixed(2)}" step="any">
			
			<label for="charge${index + 1}" id="ChargeEntree">Charge:</label>
			<input type="number" id="charge${index + 1}" value="${body.charge.toFixed(1)}" step="any">
			
			<label for="x${index + 1}" id="PosXEntree">X Position:</label>
			<input type="number" id="x${index + 1}" value="${body.position.x.toFixed(2)}" step="any">
			
			<label for="y${index + 1}" id="PosYEntree">Y Position:</label>
			<input type="number" id="y${index + 1}" value="${body.position.y.toFixed(2)}" step="any">
			
			<label for="vx${index + 1}" id="SpeedXEntree">X Speed:</label>
			<input type="number" id="vx${index + 1}" value="${body.velocity.x.toFixed(3)}" step="any">
			
			<label for="vy${index + 1}" id="SpeedYEntree">Y Speed:</label>
			<input type="number" id="vy${index + 1}" value="${body.velocity.y.toFixed(3)}" step="any">
			
			<hr style="width:25%;text-align:center;color:#444">
			
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
		const chargeInput = document.getElementById(`charge${index + 1}`)

		massInput.addEventListener('input', (e) => {
			if (isPaused) {
				body.mass = parseFloat(e.target.value);
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
	});

	setupTrashIcons();
}

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
                const distance = Math.sqrt(dx * dx + dy * dy);

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
		}, 0);
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

    const numVectorsX = Math.floor(canvasWidth / 15); // Espacement des vecteurs
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
                        const forceG = (G * body.mass) / (distance * distance);
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

    const numVectorsX = Math.floor(canvasWidth / 15); // Espacement des vecteurs
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
                        const forceEM = (k * body.charge) / (distance * distance);
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

function handleTouchStart(event) {
    if (event.touches.length === 2) {
        // Si deux doigts sont utilisés, initialise la distance de pincement
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        initialPinchDistance = getDistance(touch1, touch2);
        lastPinchZoom = scrollZoom; // Enregistre le dernier zoom avant le pincement
    }
}

function handleTouchMove(event) {
    if (event.touches.length === 2) {
        event.preventDefault();
        
        // Récupère les deux doigts
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        
        // Calcule la distance actuelle entre les deux doigts
        const currentPinchDistance = getDistance(touch1, touch2);
        
        if (initialPinchDistance) {
            // Calcul du facteur de zoom relatif
            const pinchZoomFactor = currentPinchDistance / initialPinchDistance;
            
            // Applique le zoom basé sur le facteur du pincement
            scrollZoom = lastPinchZoom * pinchZoomFactor;
            scale = scrollZoom;
        }
    }
}

function handleTouchEnd(event) {
    if (event.touches.length < 2) {
        // Réinitialise la distance de pincement quand il y a moins de deux doigts
        initialPinchDistance = null;
    }
}

function getDistance(touch1, touch2) {
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
}

startTimer();
updateConstants();
simulate();
updateControlValues();
animate();
updatePresetSelect();