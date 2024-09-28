let isPaused = true;
let isDragging = false;
let isPlaying = false;
let chartInitialized = false;
let showWindow = false;
let selectedBody = null;
let hoveredBody = null;
let initialPinchDistance = null;
let lastPinchZoom = null;
let manualMoveTimeout = null;
let collisionsEnabled = document.getElementById('collisionToggle').checked;
let mergingEnabled = document.getElementById('mergeToggle').checked;
let doZoom = document.getElementById('autoZoomToggle').checked;;
let soundEnabled = document.getElementById('activateSound').checked;
let devModenabled = document.getElementById('devMod').checked;
let relativistMod = document.getElementById('mergeToggle').checked;
let focusObject = 'barycenter-mass';
let chart;
let G, epsi0, c, pi, k;
let scale = 1;
let scrollZoom = 1;
let timeElapsed = 0;
let lastTime = 0;
let lastImpactTime = 0;
let lastMergeTime = 0;
let fps = 0;
let frameCount = 0;
let fpsTime = 0;
let frameInterval = 2;

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
const advancedControls = document.getElementById('advancedControls');
const barycenterDisplay = document.getElementById('barycenterCoords');
const constValCheckbox = document.getElementById('ConstVal');
const customConstantsDiv = document.getElementById('customConstants');
const GInput = document.getElementById('GValue');
const epsi0Input = document.getElementById('epsi0Value');
const cInput = document.getElementById('cValue');
const piInput = document.getElementById('piValue');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const frictionToggle = document.getElementById('frictionToggle');
const frictionCoefficientContainer = document.getElementById('frictionCoefficientContainer');
const frictionCoefficientInput = document.getElementById('frictionCoefficient');
const slider = document.getElementById('trailLimit');
const tooltip = document.getElementById('sliderTooltip');
const timerDisplay = document.getElementById('timer');
const helpBtn = document.getElementById('helpBtn');
const modal = document.getElementById('helpModal');
const closeBtn = document.querySelector('.close');
const isHidden = controls.classList.toggle('hidden');
const isShownControl = controls.classList.toggle('shownControl');
const vectorLengthSliderG = document.getElementById('vectorLengthSliderG');
const vectorLengthDisplayG = document.getElementById('vectorLengthValueG');
const vectorFieldDistanceDisplay = document.getElementById('vectorFieldDistance');
const vectorLengthSliderk = document.getElementById('vectorLengthSliderk');
const vectorLengthDisplayk = document.getElementById('vectorLengthValuek');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const impactSound = new Audio('sound/impact-sound.mp3');
const mergeSound = new Audio('sound/merge-sound.mp3');
const impactDelay = 10;
const mergeDelay = 1;
const bodies = initialBodies.map(body => ({
	...body,
	acceleration: { x: 0, y: 0 },
	trail: [],
	show: true,
	points: []
}));
const wells = [];

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
	if (devModenabled) {
		console.log('friction activated:', frictionToggle.checked);
	}
});

toggleButtons.forEach((button, index) => {
    button.addEventListener('click', function () {
        const controlGroup = this.parentElement.nextElementSibling;
        
        if (controlGroup.classList.contains('collapsed')) {
            controlGroup.classList.remove('collapsed');
            this.textContent = '▼';
        } else {
            controlGroup.classList.add('collapsed');
            this.textContent = '▶';
        }
    });
});

[GInput, epsi0Input, cInput, piInput].forEach(input => {
    input.addEventListener('input', updateConstants);
});

constValCheckbox.addEventListener('change', updateConstants);

vectorLengthSliderG.addEventListener('input', function() {
    vectorLengthDisplayG.textContent = vectorLengthSliderG.value;
});

vectorFieldDistanceDisplay.addEventListener('input', function() {
    vectorFieldDistanceD.textContent = vectorFieldDistance.value;
});

vectorLengthSliderk.addEventListener('input', function() {
    vectorLengthDisplayk.textContent = vectorLengthSliderk.value;
});

helpBtn.addEventListener('click', () => {
	isPaused = true
	updateButtonImage();
	modal.style.display = 'block';
	if (devModenabled) {
		console.log('helpBtn pressed');
	}
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

document.getElementById('autoZoomToggle').addEventListener('change', (e) => {
	doZoom = e.target.checked;
	if (devModenabled) {
		console.log('auto-zoom:', doZoom);
	}
});

controlsToggle.addEventListener('click', () => {
	const isHidden = !controls.classList.toggle('hidden');
	controlsToggle.src = isHidden ? 'image/U+25C0.svg' : 'image/U+25B6.svg';
	controlsToggle.alt = isHidden ? 'open controls' : 'close controls';
	document.body.classList.toggle('hidden');
	window.dispatchEvent(new Event('resize'));
});

controlsToggle.addEventListener('touchstart', (e) => {
	e.preventDefault();
	const isHidden = !controls.classList.toggle('hidden');
	controlsToggle.src = isHidden ? 'image/U+25C0.svg' : 'image/U+25B6.svg';
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

startPauseBtn.addEventListener('click', () => {
	Pause();
});

startPauseBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    Pause();
});

slider.addEventListener('input', (e) => {
	const value = e.target.value;
	tooltip.innerHTML = `10<sup>${value}</sup>`;
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
        canvas.width = window.innerWidth - 300;
    } else {
        canvas.width = window.innerWidth;
    }
    canvas.height = window.innerHeight;
	if (devModenabled) {
        console.log('Canvas width :', canvas.width);
	}
});

document.addEventListener('keydown', (event) => {
	switch (event.key) {
		case ' ':
			document.activeElement.blur();
			Pause();
			break;
		case 'r':
			resetView();
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
			document.activeElement.blur();
			Pause();
			break;
	}
	if (devModenabled) {
        console.log('Key pressed :', event.key);
	}
});

objectASelect.addEventListener('change', (e) => {
	objectASelect = e.target.value;
	clearChart();
	if (devModenabled) {
		console.log('A object selectionned', objectASelect);
	}
});

objectBSelect.addEventListener('change', (e) => {
	objectBSelect = e.target.value;
	clearChart();
	if (devModenabled) {
		console.log('B object selectionned', objectBSelect);
	}
});

dragElement(document.getElementById('infoWindow'));

window.dispatchEvent(new Event('resize'));

document.getElementById('infoWindowBtn').addEventListener('click', function() {
    showWindow = !showWindow;
    if (showWindow) {
        document.getElementById('infoWindow').style.display = 'block';
    } else {
        document.getElementById('infoWindow').style.display = 'none';
    }
	if (devModenabled) {
		console.log('infoWindow showed:', showWindow);
	}
});

document.getElementById('closeInfoWindowBtn').addEventListener('click', function() {
	showWindow = false
    document.getElementById('infoWindow').style.display = 'none';
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

document.getElementById('resetChartBtn').addEventListener('click', () => {
	clearChart();
});

document.getElementById('addBodyBtn').addEventListener('click', () => {
	let rdradius = Math.ceil(10 * getRadius(2.5, 3, 0.5)) / 10
	let rdposition = getRandomPosition(rdradius)
	if (rdposition !== null) {
	const newBody = {
			mass: 50 + Math.random() * 100,
			charge: Math.round((Math.random() * 3 - 1.5) * 10) / 10,
			radius: rdradius,
			position: rdposition,
			velocity: { x: getRandomSpeed(), y: getRandomSpeed() },
			color: '#' + Math.floor(Math.random() * 16777215).toString(16),
			acceleration: { x: 0, y: 0 },
			trail: [],
			show: true,
			points: []
		};
		bodies.push(newBody);
		updateControlValues();
		updateWellControlValues();
		translate();
		if (devModenabled) {
			console.log('Body added');
		}
	} else {
		alert(`ERROR: no space for an object with a radius of ${rdradius} m`)
	}
});

document.getElementById('addWellBtn').addEventListener('click', () => {
	let rdradius = 2.5 / scale
	let rdposition = getRandomPosition(rdradius)
	if (rdposition !== null) {
	const newWell = {
            name: `Well ${wells.length + 1}`,
			mass: 500 + Math.random() * 1000,
			charge: Math.round((Math.random() * 3 - 1.5) * 10) / 10,
			position: rdposition,
			color: rgbToHex(Math.round(Math.random() * 170 + 85), Math.round(Math.random() * 100 + 155), Math.round(Math.random() * 150 + 105)),
			show: true,
		};
		wells.push(newWell);
		updateControlValues();
		updateWellControlValues();
		translate();
		if (devModenabled) {
			console.log('Well added');
		}
	} else {
		alert(`ERROR: no space for a Well with a radius of ${rdradius} m`)
	}
});

document.getElementById('loadPresetBtn').addEventListener('click', () => {
	const selectedPresetName = document.getElementById('presetSelect').value;
	createRdPreset();
	
    if (selectedPresetName === "Sun Earth Moon" || selectedPresetName === "Hydrogens like") {
        constValCheckbox.checked = true;
        updateConstants();
    }
	else {
        constValCheckbox.checked = false;
        updateConstants();
	}
	
	if (selectedPresetName && presets[selectedPresetName]) {
		const preset = presets[selectedPresetName];
		dtInput.value = preset.dt;

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

		while (wells.length > preset.wells.length) {
			wells.pop();
		}
		
		while (wells.length < preset.wells.length) {
			wells.push({
				mass: 1,
				charge: 0,
				position: { x: 0, y: 0 },
				color: '#ffffff',
				trail: [],
				show: true,
				points: []
			});
		}

		preset.wells.forEach((presetWell, index) => {
			if (wells[index]) {
				wells[index].mass = presetWell.mass;
				wells[index].charge = presetWell.charge;
				wells[index].position = { ...presetWell.position };
				wells[index].color = presetWell.color;
				wells[index].show = presetWell.show;
				wells[index].name = presetWell.name;
			}
		});

		clearTrails();
        chart.update();
		updateControlValues();
		updateWellControlValues();
		resetView();
		startTimer();
		if (devModenabled) {
			console.log('Preset loaded:', selectedPresetName);
		}
	}
});

document.getElementById('importPresetBtn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/javascript';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const content = e.target.result;
                
                try {
                    eval(content);
                    
                    updatePresetSelect();
                    alert('Preset importé avec succès.');
                } catch (err) {
                    console.error('Erreur lors de l\'importation du preset:', err);
                    alert('Échec de l\'importation du preset.');
                }
            };

            reader.readAsText(file);
        }
    });

    input.click();
});

document.getElementById('savePresetBtn').addEventListener('click', () => {
	const presetNameInput = document.getElementById('presetName');
	let presetName = presetNameInput.value.trim();
	if (!presetName) {
		presetName = 'preset-' + Date.now();
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
		})),
		wells: wells.map(well => ({
			mass: well.mass,
			charge: well.charge,
			position: { x: well.position.x, y: well.position.y },
			color: well.color,
			show: well.show
		}))
	};

	updatePresetSelect();
	presetNameInput.value = '';
	
    const fileContent = `presets['${presetName}'] = ${JSON.stringify(presets[presetName], null, 2)};`;

    const blob = new Blob([fileContent], { type: 'application/javascript' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${presetName}.js`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
	
	if (devModenabled) {
		console.log('Preset saved:', presetName);
	}
});

document.getElementById('collisionToggle').addEventListener('change', (e) => {
	collisionsEnabled = e.target.checked;
	if (collisionsEnabled) {
		mergingEnabled = false;
		document.getElementById('mergeToggle').checked = mergingEnabled;
		}
	if (devModenabled) {
		console.log('collision enabled:', collisionsEnabled);
	}
});

document.getElementById('devMod').addEventListener('change', (e) => {
	devModenabled = e.target.checked;
	if (devModenabled) {
		console.log('DevMod activated');
	}
});

document.getElementById('activateSound').addEventListener('change', (e)  => {
	soundEnabled = e.target.checked;
});

document.getElementById('mergeToggle').addEventListener('change', (e) => {
	mergingEnabled = e.target.checked;
	if (mergingEnabled) {
		collisionsEnabled = false;
		document.getElementById('collisionToggle').checked = collisionsEnabled;
		}
	if (devModenabled) {
		console.log('merging enabled:', mergingEnabled);
	}
});

document.getElementById('paramXSelect').addEventListener('change', clearChart);
document.getElementById('paramYSelect').addEventListener('change', clearChart);

document.getElementById('simulationMod').addEventListener('change', (e) => {
	relativistMod = e.target.checked;
	if (!relativistMod) {
		const constValCheckbox = true;
	}
	document.getElementById('ConstVal').checked = constValCheckbox;
	updateConstants();
	if (devModenabled) {
		console.log('Relativist mod enabled:', relativistMod);
	}
});

function createRdPreset() {
	createRandomPreset("Random preset (10 objects)", 10, 165, 114);
	createRandomPreset("Random preset (25 objects)", 25, 200, 130);
	createRandomPreset("Random preset (40 objects)", 40, 230, 150);
	createRandomPreset("Random preset (60 objects)", 60, 255, 166);
	createLinePreset("Body Line", 16);
}

function gaussianRandom(mean, stdDev) {
    let u1 = Math.random();
    let u2 = Math.random();
    let z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * pi * u2);
    return z * stdDev + mean;
}

function getRadius(mean, stdDev, min) {
	let const1 = gaussianRandom(mean, stdDev);
	let const2 = const1 < min ? stdDev : const1;
	return const2;
}

function updateBarycenterCoord() {
    const barycenter = calculateBarycenter();
    barycenterDisplay.textContent = `Barycenter Coord : (${barycenter.x.toFixed(2)}; ${barycenter.y.toFixed(2)})`;
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
		c = 299792458;			// Speed of light in m/s
        G = 6.67430e-11;		// Constante gravitationnelle (réelle)
        epsi0 = 8.85418782e-12;	// Permittivité du vide (réelle)
		pi = Math.PI;			// Constante d'Archimède (réelle)
        customConstantsDiv.style.display = 'none';
    } else {
        // Utiliser les valeurs personnalisées
		c = parseFloat(GInput.value);
        G = parseFloat(GInput.value);
        epsi0 = parseFloat(epsi0Input.value);
		pi = parseFloat(piInput.value);
        customConstantsDiv.style.display = 'block';
    }
	k = 1 / (4 * pi * epsi0);
	if (devModenabled) {
		console.log('G:', G, 'epsi0:', epsi0, 'k:', k, 'c:', c, 'pi:', pi);
	}
}

function resetView() {
	scrollZoom = 1;
	scale = 1;
	if (devModenabled) {
		console.log('View reseted');
	}
}

function deleteBody(index) {
	bodies.splice(index, 1);
	updateControlValues();
	updateWellControlValues();
	if (devModenabled) {
		console.log('Body deleted');
	}
}

function deleteWell(index) {
	wells.splice(index, 1);
	updateControlValues();
	updateWellControlValues();
	if (devModenabled) {
		console.log('Well deleted');
	}
}

function setupTrashIcons() {
	bodies.forEach((body, index) => {
		const trashIcon = document.getElementById(`trash${index}`);
		if (trashIcon) {
			trashIcon.addEventListener('click', () => {
				if (confirm('Are you sure you want to delete this Object ?')) {
					deleteBody(index);
				}
			});
		}
	});
	
	wells.forEach((well, index) => {
		const trashIcon = document.getElementById(`trashWell${index}`);
		if (trashIcon) {
			trashIcon.addEventListener('click', () => {
				if (confirm('Are you sure you want to delete this Well ?')) {
					deleteWell(index);
				}
			});
		}
	});
}

function startTimer() {
    timeElapsed = 0;
    timerDisplay.textContent = `Time: 0.00 s / 0.00s`;
    lastTime = performance.now(); 

    function updateTimer(currentTime) {
        if (!isPaused) {
            const deltaTime = (currentTime - lastTime) / 1000;
            timeElapsed += Math.abs(deltaTime * parseFloat(dtInput.value));
            timerDisplay.textContent = `${timerLng} ${formatTime(Math.abs(timeElapsed))} / ${formatTime(Math.abs(timeElapsed/dtInput.value))}`;
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

	focusSelect.innerHTML = '<option value="null">-</option>';
	focusSelect.innerHTML += '<option value="barycenter-mass" id="barycenterLabel">Barycentre de Masse</option>';
	focusSelect.innerHTML += '<option value="barycenter-charge" id="barycenterLabelcharge">Barycentre de Charge</option>';
	focusSelect.innerHTML += '<option value="barycenter-geometric" id="barycenterLabelgeo">Barycentre Géométrique</option>';
	focusSelect.innerHTML += '<option value="barycenter-surfacique" id="barycenterLabelrad">Barycentre Surfacique</option>';
	focusSelect.innerHTML += '<option value="barycenter-well" id="barycenterLabelwell">Barycentre des Puits</option>';
	
	objectASelect.innerHTML = `<option value="null">-</option>`;
	objectBSelect.innerHTML = `<option value="null">-</option>`;
	

	bodies.forEach((body, index) => {
		objectASelect.innerHTML += `<option value="${index}">${body.name || `Object ${index + 1}`}</option>`;
		objectBSelect.innerHTML += `<option value="${index}">${body.name || `Object ${index + 1}`}</option>`;
		
		focusSelect.innerHTML += `<option value="body-${index}">${body.name || `Object ${index + 1}`}</option>`;

		const group = document.createElement('div');
		group.className = 'control-group';
        group.innerHTML = `
            <div class="checkbox-group">
                <input type="checkbox" id="show${index + 1}" ${body.show ? 'checked' : ''}>
                
                <label for="info${index + 1}">
                    <span class="color-indicator" id="color${index}" style="background-color: ${body.color}"></span>
                    <input type="text" id="name${index}" value="${body.name || `Object ${index + 1}`}" style="background: none; border: none; color: white; font-size: 14px; width: 80%;">
                    <img class="hoverOpct" src="image/trash-icon.png" id="trash${index}" class="trash-icon" alt="Delete" style="filter: brightness(4); cursor:pointer; margin: 5px">
                </label>
            </div>
            
            <label for="mass${index + 1}" id="MassEntree${index + 1}">Mass:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('mass${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('mass${index + 1}', 0.5)">/2</button>
                <input type="number" id="mass${index + 1}" value="${body.mass.toExponential(2)}" step="5">
                <button onclick="adjustValue('mass${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('mass${index + 1}', 10)">x10</button>
            </div>
            
            <label for="charge${index + 1}" id="ChargeEntree${index + 1}">Charge:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('charge${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('charge${index + 1}', 0.5)">/2</button>
                <input type="number" id="charge${index + 1}" value="${body.charge.toExponential(1)}" step="1">
                <button onclick="adjustValue('charge${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('charge${index + 1}', 10)">x10</button>
            </div>
            
            <label for="radius${index + 1}" id="radiusEntree${index + 1}">Radius:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('radius${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('radius${index + 1}', 0.5)">/2</button>
                <input type="number" id="radius${index + 1}" value="${body.radius.toExponential(1)}" step="0.5">
                <button onclick="adjustValue('radius${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('radius${index + 1}', 10)">x10</button>
            </div>
            
            <label for="x${index + 1}" id="PosXEntree${index + 1}">X Position:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('x${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('x${index + 1}', 0.5)">/2</button>
                <input type="number" id="x${index + 1}" value="${body.position.x.toExponential(2)}" step="1">
                <button onclick="adjustValue('x${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('x${index + 1}', 10)">x10</button>
            </div>
            
            <label for="y${index + 1}" id="PosYEntree${index + 1}">Y Position:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('y${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('y${index + 1}', 0.5)">/2</button>
                <input type="number" id="y${index + 1}" value="${body.position.y.toExponential(2)}" step="0.5">
                <button onclick="adjustValue('y${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('y${index + 1}', 10)">x10</button>
            </div>
            
            <label for="vx${index + 1}" id="SpeedXEntree${index + 1}">X Speed:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('vx${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('vx${index + 1}', 0.5)">/2</button>
                <input type="number" id="vx${index + 1}" value="${body.velocity.x.toExponential(3)}" step="0.5">
                <button onclick="adjustValue('vx${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('vx${index + 1}', 10)">x10</button>
            </div>
            
            <label for="vy${index + 1}" id="SpeedYEntree${index + 1}">Y Speed:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('vy${index + 1}', 0.5)">/2</button>
                <button onclick="adjustValue('vy${index + 1}', 0.1)">/10</button>
                <input type="number" id="vy${index + 1}" value="${body.velocity.y.toExponential(3)}" step="0.1">
                <button onclick="adjustValue('vy${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('vy${index + 1}', 10)">x10</button>
            </div>
        `;
		
		if (index < bodies.length - 1) {
			group.innerHTML += `
			<br>
            <hr style="width:100%;text-align:center;color:#444">
			`;
		}
		
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
				updateWellControlValues();
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

				body.mass = value;
				e.target.value = value.toExponential(2);
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
				e.target.value = value.toExponential(1);
			}
		});
	});

	setupTrashIcons();
}

function updateWellControlValues() {
    const wellControlsContainer = document.getElementById('well-controls');
	wellControlsContainer.innerHTML = '';
	
	wells.forEach((well, index) => {
		focusSelect.innerHTML += `<option value="well-${index}">${well.name || `Well ${index + 1}`}</option>`;

		const group = document.createElement('div');
		group.className = 'control-group';
        group.innerHTML = `
            <div class="checkbox-group">
                <input type="checkbox" id="showWell${index + 1}" ${well.show ? 'checked' : ''}>
                
                <label for="info${index + 1}">
                    <span class="color-indicator" id="colorWell${index}" style="background-color: ${well.color}"></span>
                    <input type="text" id="nameWell${index}" value="${well.name || `Well ${index + 1}`}" style="background: none; border: none; color: white; font-size: 14px; width: 80%;">
                    <img class="hoverOpct"  src="image/trash-icon.png" id="trashWell${index}" class="trash-icon" alt="Delete" style="filter: brightness(4); cursor:pointer; margin: 5px">
                </label>
            </div>
            
            <label for="massWell${index + 1}" id="MassEntreeWell${index + 1}">Mass:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('massWell${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('massWell${index + 1}', 0.5)">/2</button>
                <input type="number" id="massWell${index + 1}" value="${well.mass.toExponential(2)}" step="5">
                <button onclick="adjustValue('massWell${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('massWell${index + 1}', 10)">x10</button>
            </div>
            
            <label for="chargeWell${index + 1}" id="ChargeEntreeWell${index + 1}">Charge:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('chargeWell${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('chargeWell${index + 1}', 0.5)">/2</button>
                <input type="number" id="chargeWell${index + 1}" value="${well.charge.toExponential(1)}" step="1">
                <button onclick="adjustValue('chargeWell${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('chargeWell${index + 1}', 10)">x10</button>
            </div>
            
            <label for="xWell${index + 1}" id="PosXEntreeWell${index + 1}">X Position:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('xWell${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('xWell${index + 1}', 0.5)">/2</button>
                <input type="number" id="xWell${index + 1}" value="${well.position.x.toExponential(2)}" step="1">
                <button onclick="adjustValue('xWell${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('xWell${index + 1}', 10)">x10</button>
            </div>
            
            <label for="yWell${index + 1}" id="PosYEntreeWell${index + 1}">Y Position:</label>
            <div class="btn-group mrgn-bttm-lg">
                <button onclick="adjustValue('yWell${index + 1}', 0.1)">/10</button>
                <button onclick="adjustValue('yWell${index + 1}', 0.5)">/2</button>
                <input type="number" id="yWell${index + 1}" value="${well.position.y.toExponential(2)}" step="0.5">
                <button onclick="adjustValue('yWell${index + 1}', 2)">x2</button>
                <button onclick="adjustValue('yWell${index + 1}', 10)">x10</button>
            </div>
        `;
		
		if (index < wells.length - 1) {
			group.innerHTML += `
			<br>
            <hr style="width:100%;text-align:center;color:#444">
			`;
		}
		
		wellControlsContainer.appendChild(group);

		document.getElementById(`showWell${index + 1}`).addEventListener('change', (e) => {
			well.show = e.target.checked;
		});

		const nameInput = document.getElementById(`nameWell${index}`);
		nameInput.addEventListener('input', (e) => {
			well.name = e.target.value;
		});

		const colorIndicator = document.getElementById(`colorWell${index}`);
		colorIndicator.addEventListener('click', () => {
			const colorPicker = document.createElement('input');
			colorPicker.type = 'color';
			colorPicker.value = well.color;
			colorPicker.style.position = 'absolute';
			colorPicker.style.left = `${colorIndicator.getBoundingClientRect().left}px`;
			colorPicker.style.top = `${colorIndicator.getBoundingClientRect().top}px`;

			colorPicker.addEventListener('input', (event) => {
				well.color = event.target.value;
				updateControlValues();
				updateWellControlValues();
			});
			colorPicker.addEventListener('change', () => {
				document.well.removeChild(colorPicker);
			});

			document.addEventListener('click', function handler(event) {
				if (!colorPicker.contains(event.target) && event.target !== colorIndicator) {
					document.well.removeChild(colorPicker);
					document.removeEventListener('click', handler);
				}
			}, { once: true });

			colorPicker.click();
		});

		const massInput = document.getElementById(`massWell${index + 1}`);
		const xInput = document.getElementById(`xWell${index + 1}`);
		const yInput = document.getElementById(`yWell${index + 1}`);
		const chargeInput = document.getElementById(`chargeWell${index + 1}`);

		massInput.addEventListener('input', (e) => {
			let value = parseFloat(e.target.value);

			if (value < 0) {
				value = Math.abs(value);
			}

			well.mass = value;
			e.target.value = value.toExponential(2);
		});
	
		xInput.addEventListener('input', (e) => {
			well.position.x = parseFloat(e.target.value);
			well.trail = [];
			well.points = [];
		});
    
		yInput.addEventListener('input', (e) => {
			well.position.y = parseFloat(e.target.value);
			well.trail = [];
			well.points = [];
		});
		
		chargeInput.addEventListener('input', (e) => {
			well.charge = parseFloat(e.target.value);
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

function playImpactSound(objectA, objectB) {
	if (soundEnabled) {
		const currentTime = Date.now();
		const vardt = (currentTime - lastImpactTime) * parseFloat(dtInput.value) * 100;
		
		const restitution1 = (pi * Math.pow(objectA.radius, 2)) / Math.sqrt(objectA.mass);
		const restitution2 = (pi * Math.pow(objectB.radius, 2)) / Math.sqrt(objectB.mass);
		
		const restitution = 1 - Math.sqrt(restitution1 * restitution1 + restitution2 * restitution2) / getRelativeRadialSpeed(objectA, objectB);
		
		if (vardt > impactDelay) {
			lastImpactTime = currentTime;
			const impactSound = new Audio('sound/impact-sound.mp3');
			const restitutionf = 1 - 1 / Math.log(restitution * Math.E + Math.E);
			const volume = Math.max(Math.max(Math.min(1 - restitutionf / 10, 1), 0) * restitution, 0);
			console.log(volume)
            impactSound.volume = volume
			impactSound.play();
		}
	}
}

function playMergeSound() {
	if (soundEnabled) {
		const currentTime = Date.now();
		if (currentTime - lastMergeTime > mergeDelay) {
			lastMergeTime = currentTime;
			const mergeSound = new Audio('sound/merge-sound.mp3');
			mergeSound.play();
		}
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

		for (const well of wells) {
			const dx = well.position.x - bodies[i].position.x;
			const dy = well.position.y - bodies[i].position.y;
                
			if ((isNaN(dx) || isNaN(dy)) && DevMod) {
				console.error(`Les positions de l'objets ${i + 1} ou du puit ${well} sont invalides.`);
				continue;
			}
			
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			if (gravityEnabled) {
				const forceG = (G * well.mass * bodies[i].mass) / distance;
				fx += (dx / distance) * forceG;
				fy += (dy / distance) * forceG;
			}
			
			if (magneticEnabled) {
                const forceEM = (k * well.charge * bodies[i].charge) / distance;
				fx += (dx / distance) * forceEM;
				fy += (dy / distance) * forceEM;
			}
		}

        for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
                const dx = bodies[j].position.x - bodies[i].position.x;
                const dy = bodies[j].position.y - bodies[i].position.y;
                
                if ((isNaN(dx) || isNaN(dy)) && DevMod) {
                    console.error(`Les positions des objets ${i + 1} ou ${j + 1} sont invalides.`);
                    continue;
                }

                const distance = Math.sqrt(dx * dx + dy * dy);
				
                if (distance > 0) {

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
        }

        bodies[i].acceleration.x = fx / bodies[i].mass;
        bodies[i].acceleration.y = fy / bodies[i].mass;
    }
}

function calculateRelativisticForces() {
    const gravityEnabled = document.getElementById('gravityToggle').checked;
    const magneticEnabled = document.getElementById('magneticToggle').checked;

    bodies.forEach(body => {
        body.acceleration.x = 0;
        body.acceleration.y = 0;
    });

    for (let i = 0; i < bodies.length; i++) {
        let fx = 0;
        let fy = 0;

        for (const well of wells) {
            const dx = well.position.x - bodies[i].position.x;
            const dy = well.position.y - bodies[i].position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (gravityEnabled && distance > 0) {
                const velocityMagnitude = Math.sqrt(bodies[i].velocity.x ** 2 + bodies[i].velocity.y ** 2);
                const relativisticCorrection = 1 + (3 * (velocityMagnitude / c) ** 2) / 2;

                const forceG = (G * well.mass * bodies[i].mass) / (distance * distance) * relativisticCorrection;
                fx += (dx / distance) * forceG;
                fy += (dy / distance) * forceG;
            }

            if (magneticEnabled) {
                const forceEM = (k * well.charge * bodies[i].charge) / (distance * distance);
                fx += (dx / distance) * forceEM;
                fy += (dy / distance) * forceEM;
            }
        }

        for (let j = 0; j < bodies.length; j++) {
            if (i !== j) {
                const dx = bodies[j].position.x - bodies[i].position.x;
                const dy = bodies[j].position.y - bodies[i].position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (gravityEnabled && distance > 0) {
                    const velocityMagnitude = Math.sqrt(bodies[i].velocity.x ** 2 + bodies[i].velocity.y ** 2);
                    const relativisticCorrection = 1 + (3 * (velocityMagnitude / c) ** 2) / 2;

                    const forceG = (G * bodies[i].mass * bodies[j].mass) / (distance * distance) * relativisticCorrection;
                    fx += (forceG * (dx / distance));
                    fy += (forceG * (dy / distance));
                }

                if (magneticEnabled) {
                    const forceEM = (k * bodies[i].charge * bodies[j].charge) / (distance * distance);
                    fx += (forceEM * (-dx / distance));
                    fy += (forceEM * (-dy / distance));
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

function adjustTrails(trailMaxPoints) {
	bodies.forEach(body => {
		while (body.trail.length > trailMaxPoints) {
			body.trail.shift();
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

function updateRelativisticPositions(dt) {
    const trailLimitInput = document.getElementById('trailLimit');
    const trailMaxPoints = Math.pow(10, trailLimitInput.value);

    bodies.forEach(body => {
        const velocityMagnitude = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        const lorentzFactor = 1 / Math.sqrt(1 - (velocityMagnitude ** 2 / c ** 2));

        const newVelocityX = body.velocity.x * lorentzFactor;
        const newVelocityY = body.velocity.y * lorentzFactor;

        body.velocity.x += body.acceleration.x * dt;
        body.velocity.y += body.acceleration.y * dt;

        const totalVelocity = Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2);
        if (totalVelocity > c) {
            const scalingFactor = c / totalVelocity;
            body.velocity.x *= scalingFactor;
            body.velocity.y *= scalingFactor;
        }

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
    });
}

function calculateBarycenter() {
	let barycenter = { x: 0, y: 0 };
	if (focusObject !== 'noObject') {
		if (focusObject == 'barycenter-mass') {
			let totalMass = 0;
			bodies.forEach(body => {
				if (body.show && (body.mass !== 0)) {
					totalMass += body.mass;
					barycenter.x += body.position.x * body.mass;
					barycenter.y += body.position.y * body.mass;
				}
			});

			if (totalMass !== 0) {
				barycenter.x /= totalMass;
				barycenter.y /= totalMass;
			}
		}
		else if (focusObject == 'barycenter-charge') {
			let totalCharge = 0;
	
			bodies.forEach(body => {
				if (body.show && (body.charge !== 0)) {
					const absCharge = Math.abs(body.charge);
					totalCharge += absCharge;
					barycenter.x += body.position.x * absCharge;
					barycenter.y += body.position.y * absCharge;
				}
			});

			if (totalCharge !== 0) {
				barycenter.x /= totalCharge;
				barycenter.y /= totalCharge;
			}
		}
		else if (focusObject == 'barycenter-geometric') {
			let number = 0;
	
			bodies.forEach(body => {
				number += 1;
				barycenter.x += body.position.x;
				barycenter.y += body.position.y;
			});

			if (number !== 0) {
				barycenter.x /= number;
				barycenter.y /= number;
			}
		}
		else if (focusObject == 'barycenter-surfacique') {
			let totalRadius = 0;
	
			bodies.forEach(body => {
				if (body.show && (body.radius !== 0)) {
					totalRadius += body.radius;
					barycenter.x += body.position.x * body.radius;
					barycenter.y += body.position.y * body.radius;
				}
			});

			if (totalRadius !== 0) {
				barycenter.x /= totalRadius;
				barycenter.y /= totalRadius;
			}
		}
		else if (focusObject == 'barycenter-well') {
			let number = 0;
	
			wells.forEach(well => {
				number += 1;
				barycenter.x += well.position.x;
				barycenter.y += well.position.y;
			});

			if (number !== 0) {
				barycenter.x /= number;
				barycenter.y /= number;
			}
		}
		else if (focusObject.startsWith('body-')) {
			const selectedBodyIndex = parseInt(focusObject.split('-')[1]);
			const selectedBody = bodies[selectedBodyIndex];
			return { x: selectedBody.position.x, y: selectedBody.position.y };
		}
		else if (focusObject.startsWith('well-')) {
			const selectedWellIndex = parseInt(focusObject.split('-')[1]);
			const selectedWell = wells[selectedWellIndex];
			return { x: selectedWell.position.x, y: selectedWell.position.y };
		}
	}

    if (doZoom) {
		const maxDistance = Math.max(...bodies.map(body => 
			Math.sqrt(Math.pow(body.position.x - barycenter.x, 2) + Math.pow(body.position.y - barycenter.y, 2))
		));
		
		const maxRadius = showSizeCheckbox.checked ? 10 / scale : 10;
		const minCanvasSize = 0.98 * Math.min(canvas.width, canvas.height);
		
        scale = Math.min(
            minCanvasSize / (maxDistance * 2),
            minCanvasSize / (maxRadius * 2)
        ) * scrollZoom;
    } else {scrollZoom = 1}

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
			ctx.lineTo(endX - arrowSize * Math.cos(angle - pi / 6), endY - arrowSize * Math.sin(angle - pi / 6));
			ctx.lineTo(endX - arrowSize * Math.cos(angle + pi / 6), endY - arrowSize * Math.sin(angle + pi / 6));
			ctx.lineTo(endX, endY);
			ctx.fillStyle = 'darkgray';
			ctx.fill();
			ctx.closePath();
		}
	});

	ctx.restore();
}

function drawBodies(barycenter) {
	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(scale, scale);
	ctx.translate(-barycenter.x, -barycenter.y);
	const barycenterPointSize = 1.1 / scale;

	wells.forEach(well => {
		if (well.show) {
			ctx.beginPath();
			ctx.arc(well.position.x, well.position.y, 7 / scale, 0, 2 * pi);
			ctx.strokeStyle = well.color || 'white';
			ctx.lineWidth = 1 / scale;
			if (hoveredBody === well) {
				ctx.globalAlpha = 0.4;
			} else {
				ctx.globalAlpha = 0.8;
			}
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(well.position.x, well.position.y, 3.25 / scale, 0, 2 * pi);
			ctx.strokeStyle = well.color || 'white';
			ctx.lineWidth = 1 / scale;
			if (hoveredBody === well) {
				ctx.globalAlpha = 0.45;
			} else {
				ctx.globalAlpha = 0.9;
			}
			ctx.stroke();
			ctx.closePath();
		}
	});
	
	bodies.forEach(body => {
		if (body.show) {
			ctx.beginPath();
			const radius = showSizeCheckbox.checked ? Math.min(body.radius * 2.5, 7) / scale : body.radius;
			ctx.arc(body.position.x, body.position.y, radius, 0, 2 * pi);
			ctx.fillStyle = body.color;
			
			if (hoveredBody === body) {
				ctx.globalAlpha = 0.45;
			} else {
				ctx.globalAlpha = 0.9;
			}

			ctx.fill();
			ctx.closePath();
			
			const tracedTrail = slider.value
			
			if (tracedTrail > 0) {
				body.points.forEach(point => {
					ctx.beginPath();
					const pointSize = radius * 0;
					ctx.arc(point.x, point.y, pointSize, 0, 2 * pi);
					ctx.fillStyle = body.color;
					ctx.fill();
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
		}
	});

    if (showWindow) {
		const objectA = bodies[parseInt(objectASelect)];
		const objectB = bodies[parseInt(objectBSelect)];

        if (objectA && objectA.show) {
            ctx.beginPath();
            const radiusA = showSizeCheckbox.checked ? objectA.radius / scale : objectA.radius;
            const highlightedradiusA = (showSizeCheckbox.checked ? (Math.min(objectA.radius * 2.5, 7)) / scale * 1.7 : Math.min(Math.max(1.8 * radiusA, 2.5 + radiusA), 2.5 + radiusA));
			ctx.globalAlpha = 0.2;
            ctx.arc(objectA.position.x, objectA.position.y, highlightedradiusA, 0, 2 * pi);
            ctx.strokeStyle = objectA.color;
            ctx.lineWidth = showSizeCheckbox.checked ? 1.1 / scale : 1.1;
            ctx.stroke();
            ctx.closePath();
        }

        if (objectB && objectB.show) {
            ctx.beginPath();
            const radiusB = showSizeCheckbox.checked ? objectB.radius / scale : objectB.radius;
            const highlightedradiusB = (showSizeCheckbox.checked ? (Math.min(objectB.radius * 2.5, 7)) / scale * 1.7 : Math.min(Math.max(1.8 * radiusB, 2.5 + radiusB), 2.5 + radiusB));
			ctx.globalAlpha = 0.2;
            ctx.arc(objectB.position.x, objectB.position.y, highlightedradiusB, 0, 2 * pi);
            ctx.strokeStyle = objectB.color;
            ctx.lineWidth = showSizeCheckbox.checked ? 1 / scale : 1.1;
            ctx.stroke();
            ctx.closePath();
        }
    }

	ctx.beginPath();
	if (document.getElementById('showVelocities').checked) {
		ctx.arc(barycenter.x, barycenter.y, barycenterPointSize, 0, 2 * pi);
	}
	ctx.fillStyle = 'gray';
	ctx.fill();
	ctx.closePath();

	ctx.restore();
}

function clearTrails() {
	bodies.forEach(body => {
		body.trail = [];
		body.points = [];
	});
	if (devModenabled) {
		console.log('trails cleared');
	}
}

function getRandomPosition(rdradius) {
	let minDistance = 0;
	bodies.forEach(body => {
		minDistance = Math.max(minDistance, body.radius)
	});
	let position;
	let validPosition = false;
	const startTime = Date.now();

	while (!validPosition) {
		if (Date.now() - startTime > 500) {
			console.warn("No possible position");
			return null;
		}
		position = {
			x: (Math.random() - 0.5) * canvas.width / scale * 0.75 + calculateBarycenter().x,
			y: (Math.random() - 0.5) * canvas.height / scale * 0.75 + calculateBarycenter().y
		};
		
		validPosition = bodies.every(body => {
			const dx = body.position.x - position.x;
			const dy = body.position.y - position.y;
			return Math.sqrt(dx * dx + dy * dy) > minDistance + rdradius;
		});
	}
	return position;
}

function mixColors(color1, color2, surface1, surface2, threshold = 30) {
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
					playImpactSound(bodies[i], bodies[j]);
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

    const surface1 = pi * Math.pow(body1.radius, 2);
    const surface2 = pi * Math.pow(body2.radius, 2);
    const newSurface = surface1 + surface2;
    const newRadius = Math.sqrt(newSurface / pi);
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
	
	frameInterval = fps > 60 ? 1 :
					fps > 30 ? 2 :
					fps > 15 ? 3 :
					fps > 12 ? 4 :
					fps > 8  ? 5 :
					fps > 6  ? 6 :
					fps > 4  ? 7 : 11;
	
	document.getElementById('skipDisplay').textContent = `Skipped: ${frameInterval}`;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const barycenter = calculateBarycenter();
	drawGrid();
	if (document.getElementById('showGravityField').checked || document.getElementById('showMagneticField').checked) {
        drawGravityField();
		drawMagneticField();
    }
	drawBodies(barycenter);
	drawVelocityVectors();
}

function animate(currentTime) {
    const startTime = performance.now();

    displayFPS(currentTime);
	const dt = parseFloat(dtInput.value);
	
    if (!isPaused) {
		if (relativistMod) {
			calculateRelativisticForces();
		} else {
			calculateForces();
		}
		
        if (collisionsEnabled || mergingEnabled) {
            detectProximity();
        }
		
		if (relativistMod) {
			updateRelativisticPositions(dt);
		} else {
			updatePositions(dt);
		}
		
		updateControlValues();
		updateWellControlValues();

        if (frameCount % frameInterval === 0) {
			draw();
        }
    }
	
	updateBarycenterCoord();
	draw();
	
	const objectA = bodies[parseInt(objectASelect)];
	const objectB = bodies[parseInt(objectBSelect)];
	
	if (objectA && objectB) {
		updateObjectInfo(objectA, objectB);
		updateGraphWithParameters(objectA, objectB);
	}

    const endTime = performance.now();
    const frameTime = endTime - startTime;
    
    cpuUsage = Math.min((frameTime / 16.67 / 2.25) * 100, 500);
	if (cpuUsage >= 500) {
		document.getElementById('UsageDisplay').textContent = `Usage: +500%`;
	}
	else {
		document.getElementById('UsageDisplay').textContent = `Usage: ${cpuUsage.toFixed(0).padStart(3, '0')}%`;
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
	doZoom = false
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

	for (const well of wells) {
		const dx = mouseX - well.position.x;
		const dy = mouseY - well.position.y;
		if (Math.sqrt(dx * dx + dy * dy) < (showSizeCheckbox.checked ? 10 / scale : 10)) {
			selectedBody = well;
			isPaused = true;
			updateButtonImage();
			break;
		}
	}
}

function handleMouseMove(event) {
	const mouseX = (event.offsetX - canvas.width / 2) / scale + calculateBarycenter().x;
	const mouseY = (event.offsetY - canvas.height / 2) / scale + calculateBarycenter().y;

	hoveredBody = null;

	bodies.forEach(body => {
		const dx = body.position.x - mouseX;
		const dy = body.position.y - mouseY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const radius = showSizeCheckbox.checked ? Math.min(body.radius * 2.5, 7) / scale : body.radius;
		if (distance < radius) {
			hoveredBody = body;
		}
	});

	wells.forEach(well => {
		const dx = well.position.x - mouseX;
		const dy = well.position.y - mouseY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const radius = 7 / scale;
		if (distance < radius) {
			hoveredBody = well;
		}
	});

	if (selectedBody) {
		selectedBody.position.x = mouseX;
		selectedBody.position.y = mouseY;
		updateControlValues();
		updateWellControlValues();
		clearTimeout(manualMoveTimeout);
		manualMoveTimeout = setTimeout(() => {
			isPaused = true;
			updateButtonImage();
		}, 0);
	}
	
	if (cpuUsage >= 500) {
        canvas.style.cursor = 'wait';
	}
	else {
		if (hoveredBody) {
			canvas.style.cursor = 'pointer';
		} else {
			canvas.style.cursor = 'crosshair';
		}
	}
}

function handleMouseUp() {
	selectedBody = null;
	doZoom = document.getElementById('autoZoomToggle').checked;;
}

function handleTouchStart(event) {
    if (event.touches.length === 1) {
		doZoom = false
        const touch = event.touches[0];
        const touchX = (touch.clientX - canvas.width / 2) / scale + calculateBarycenter().x;
        const touchY = (touch.clientY - canvas.height / 2) / scale + calculateBarycenter().y;

        for (const body of bodies) {
            const dx = touchX - body.position.x;
            const dy = touchY - body.position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const radius = showSizeCheckbox.checked ? Math.min(body.radius * 2.5, 7) / scale : body.radius
            if (distance < radius) {
                selectedBody = body;
                isDragging = true;
                isPaused = true;
                updateButtonImage();
                break;
            }
        }

        for (const well of wells) {
            const dx = touchX - well.position.x;
            const dy = touchY - well.position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const radius = 7 / scale
            if (distance < radius) {
                selectedBody = well;
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
		updateWellControlValues();
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
	doZoom = document.getElementById('autoZoomToggle').checked;;
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
	if (devModenabled) {
		if (isPaused) {
			console.log('Pause');
		} else {
			console.log('Play');
		}
		
	}
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
    presetSelect.innerHTML = '';
	createRdPreset();
	Object.keys(presets).forEach(presetName => {
		const option = document.createElement('option');
		option.value = presetName;
		option.textContent = presetName;
		presetSelect.appendChild(option);
	});
}

function drawGravityField() {
    const vectorLengthSliderG = document.getElementById('vectorLengthSliderG');
    const vectorLengthValueG = parseFloat(vectorLengthSliderG.value);
	const vectorFieldDistance =  parseFloat(vectorFieldDistanceDisplay.value);
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

    const numVectorsX = Math.floor(canvasWidth / vectorFieldDistance);
    const numVectorsY = Math.floor(canvasHeight / vectorFieldDistance);

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

            wells.forEach(well => {
                const dx = well.position.x - x;
                const dy = well.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance !== 0) {
                    if (showGravityField) {
                        const forceG = (0.1 * well.mass) / (distance * distance);
                        fx += forceG * (dx / distance);
                        fy += forceG * (dy / distance);
                    }
                }
            });

            const forceMagnitude = Math.sqrt(fx * fx + fy * fy);

            if (forceMagnitude !== 0) {
                const vectorLength = Math.min(Math.sqrt(forceMagnitude) / maxMass * 20000, 10) / (showSizeCheckbox.checked ? scale : 2) * 1.5 * vectorLengthValueG;

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
    const vectorLengthSliderk = document.getElementById('vectorLengthSliderk');
    const vectorLengthValuek = parseFloat(vectorLengthSliderk.value);
    const showMagneticField = document.getElementById('showMagneticField').checked;
	const vectorFieldDistance =  parseFloat(vectorFieldDistanceDisplay.value);

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

    const numVectorsX = Math.floor(canvasWidth / vectorFieldDistance);
    const numVectorsY = Math.floor(canvasHeight / vectorFieldDistance);

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

            wells.forEach(well => {
                const dx = well.position.x - x;
                const dy = well.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance !== 0) {
                    if (showMagneticField) {
                        const forceEM = (10 * well.charge) / (distance * distance);
                        fx += forceEM * (-dx / distance);
                        fy += forceEM * (-dy / distance);
                    }
                }
            });

            const forceMagnitude = Math.sqrt(fx * fx + fy * fy);

            if (forceMagnitude !== 0) {
                const vectorLength = Math.min(Math.sqrt(forceMagnitude / maxCharge) * 2000, 10) / (showSizeCheckbox.checked ? scale : 2) * vectorLengthValuek;
				
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

function dragElement(elmnt) {
    const header = document.getElementById("infoWindowHeader");
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (header) {
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragTouchStart;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function dragTouchStart(e) {
        e.preventDefault();
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementTouchDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function elementTouchDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.touches[0].clientX;
        pos2 = pos4 - e.touches[0].clientY;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

function getDistanceFromBarycenter(object) {
    const barycenter = calculateBarycenter();
    const dx = object.position.x - barycenter.x;
    const dy = object.position.y - barycenter.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getDistanceBetweenObjects(objectA, objectB) {
    const dx = objectB.position.x - objectA.position.x;
    const dy = objectB.position.y - objectA.position.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getRadialSpeed(object) {
    return Math.sqrt(object.velocity.x * object.velocity.x + object.velocity.y * object.velocity.y);
}

function getRadialAcceleration(object) {
    return Math.sqrt(object.acceleration.x * object.acceleration.x + object.acceleration.y * object.acceleration.y);
}

function getTotalRadialForce(object) {
    return getRadialAcceleration(object) * object.mass;
}

function getRelativeRadialSpeed(objectA, objectB) {
    return Math.sqrt(Math.pow(objectB.velocity.x - objectA.velocity.x, 2) + Math.pow(objectB.velocity.y - objectA.velocity.y, 2));
}

function getRelativeRadialAcceleration(objectA, objectB) {
    return Math.sqrt(Math.pow(objectB.acceleration.x - objectA.acceleration.x, 2) + Math.pow(objectB.acceleration.y - objectA.acceleration.y, 2));
}

function getAttractionForce(objectA, objectB) {
    const distance = getDistanceBetweenObjects(objectA, objectB);
	let totalForce = 0
    if (distance > 0) {
		if (gravityEnabled) {
			totalForce += - (G * objectA.mass * objectB.mass) / (distance * distance)
		}
		if (magneticEnabled) {
			totalForce += (K * objectA.charge * objectB.charge) / (distance * distance)
		}
        return totalForce;
    }
    return 0;
}

function getAngularMomentum(objectA, objectB) {
    const rx = objectB.position.x - objectA.position.x;
    const ry = objectB.position.y - objectA.position.y;
	
    const vx = objectB.velocity.x - objectA.velocity.x;
    const vy = objectB.velocity.y - objectA.velocity.y;
    const angularMomentum = Math.abs(rx * vy - ry * vx);
	
	return angularMomentum;
}

function getKineticEnergy(objectA, objectB) {
    const kineticEnergy = 0.5 * (getRelativeRadialSpeed(objectA, objectB)) ** 2;
	
	return kineticEnergy;
}

function getPotentialEnergy(objectA, objectB) {
    const totalMass = objectA.mass + objectB.mass;
    const potentialEnergy = -G * totalMass / getDistanceBetweenObjects(objectA, objectB);
	
	return potentialEnergy;
}

function getSpecificOrbitalEnergy(objectA, objectB) {
    const specificOrbitalEnergy = getKineticEnergy(objectA, objectB) + getPotentialEnergy(objectA, objectB);
	
	return specificOrbitalEnergy;
}

function getSemiMajorAxis(objectA, objectB) {
    const totalMass = objectA.mass + objectB.mass;
    const semiMajorAxis = -G * totalMass / (2 * getSpecificOrbitalEnergy(objectA, objectB));
	
	return semiMajorAxis;
}

function getEccentricity(objectA, objectB) {
    const totalMass = objectA.mass + objectB.mass;
    const eccentricity = Math.sqrt(1 + (2 * getSpecificOrbitalEnergy(objectA, objectB) * Math.pow(getAngularMomentum(objectA, objectB), 2)) / (G * G * totalMass * totalMass));
	
	return eccentricity;
}

function getOrbitalPeriod(objectA, objectB) {
    const semiMajorAxis = getSemiMajorAxis(objectA, objectB);
    const totalMass = objectA.mass + objectB.mass;
    const orbitalPeriod = 2 * pi * Math.sqrt(Math.pow(semiMajorAxis, 3) / (G * totalMass));
    return orbitalPeriod;
}

function getMeanOrbitalSpeed(objectA, objectB) {
    const semiMajorAxis = getSemiMajorAxis(objectA, objectB);
    const totalMass = objectA.mass + objectB.mass;
    const meanOrbitalSpeed = Math.sqrt(G * totalMass / semiMajorAxis);
    return meanOrbitalSpeed;
}

function getOrbitalParameter(objectA, objectB) {
    const angularMomentum = getAngularMomentum(objectA, objectB);
    const totalMass = objectA.mass + objectB.mass;
    const orbitalParameter = (angularMomentum * angularMomentum) / (G * totalMass);
    return orbitalParameter;
}

function getAphelion(objectA, objectB) {
    const semiMajorAxis = getSemiMajorAxis(objectA, objectB);
    const eccentricity = getEccentricity(objectA, objectB);
    return semiMajorAxis * (1 + eccentricity);
}

function getPerihelion(objectA, objectB) {
    const semiMajorAxis = getSemiMajorAxis(objectA, objectB);
    const eccentricity = getEccentricity(objectA, objectB);
    return semiMajorAxis * (1 - eccentricity);
}

function getTrueAnomaly(objectA, objectB) {
    const distance = getDistanceBetweenObjects(objectA, objectB);
    const orbitalParameter = getOrbitalParameter(objectA, objectB);
    const eccentricity = getEccentricity(objectA, objectB);

    const cosTrueAnomaly = (orbitalParameter / distance - 1) / eccentricity;
    return Math.acos(cosTrueAnomaly);
}

function getLongitudeOfAscendingNode(objectA, objectB) {
    const dx = objectB.position.x - objectA.position.x;
    const dy = objectB.position.y - objectA.position.y;
    return Math.atan2(dy, dx);
}

function getMeanAnomaly(objectA, objectB, time) {
    const orbitalPeriod = getOrbitalPeriod(objectA, objectB);
    const eccentricity = getEccentricity(objectA, objectB);
    const meanMotion = 2 * pi / orbitalPeriod;

    const meanAnomaly = meanMotion * time;
    return meanAnomaly;
}

function solveKeplerEquation(objectA, objectB, time) {
    const eccentricity = getEccentricity(objectA, objectB);
    const meanAnomaly = getMeanAnomaly(objectA, objectB, time);

    let E = meanAnomaly;
    let delta = 1e-6;
    let iterations = 0;

    while (iterations < 100) {
        let f = E - eccentricity * Math.sin(E) - meanAnomaly;
        let fPrime = 1 - eccentricity * Math.cos(E);
        let ratio = f / fPrime;

        if (Math.abs(ratio) < delta) break;
        E = E - ratio;
        iterations++;
    }

    return E;
}

function updateObjectInfo(objectA, objectB) {
    document.getElementById('massA').textContent = formatScientific(objectA.mass, 2) + ' kg';
    document.getElementById('chargeA').textContent = formatScientific(objectA.charge, 1) + ' C';
    document.getElementById('radiusA').textContent = formatScientific(objectA.radius, 1) + ' m';
    document.getElementById('surface1').textContent = formatScientific(pi * Math.pow(objectA.radius, 2), 2) + ' m²';
    document.getElementById('positionA').textContent = `(${formatScientific(objectA.position.x, 2)}, ${formatScientific(objectA.position.y, 2)})`;
    document.getElementById('distanceBary1').textContent = formatScientific(getDistanceFromBarycenter(objectA), 2) + ' m';
    document.getElementById('speedRadial1').textContent = formatScientific(getRadialSpeed(objectA), 4) + ' m/s';
    document.getElementById('accelerationRadial1').textContent = formatScientific(getRadialAcceleration(objectA), 4) + ' m/s²';
    document.getElementById('forceTotalRadial1').textContent = formatScientific(getTotalRadialForce(objectA), 4) + ' kg m/s²';

    document.getElementById('massB').textContent = formatScientific(objectB.mass, 2) + ' kg';
    document.getElementById('chargeB').textContent = formatScientific(objectB.charge, 1) + ' C';
    document.getElementById('radiusB').textContent = formatScientific(objectB.radius, 1) + ' m';
    document.getElementById('surface2').textContent = formatScientific(pi * Math.pow(objectB.radius, 2), 2) + ' m²';
    document.getElementById('positionB').textContent = `(${formatScientific(objectB.position.x, 2)}, ${formatScientific(objectB.position.y, 2)})`;
    document.getElementById('distanceBary2').textContent = formatScientific(getDistanceFromBarycenter(objectB), 2) + ' m';
    document.getElementById('speedRadial2').textContent = formatScientific(getRadialSpeed(objectB), 4) + ' m/s';
    document.getElementById('accelerationRadial2').textContent = formatScientific(getRadialAcceleration(objectB), 4) + ' m/s²';
    document.getElementById('forceTotalRadial2').textContent = formatScientific(getTotalRadialForce(objectB), 4) + ' kg m/s²';

    document.getElementById('distanceBetween').textContent = formatScientific(getDistanceBetweenObjects(objectA, objectB), 4) + ' m';
    document.getElementById('relativeSpeedRadial').textContent = formatScientific(Math.abs(getRadialSpeed(objectA) - getRadialSpeed(objectB)), 4) + ' m/s';
    document.getElementById('relativeAccelerationRadial').textContent = formatScientific(Math.abs(getRadialAcceleration(objectA) - getRadialAcceleration(objectB)), 4) + ' m/s²';
}

function formatScientific(number, digits) {
    if (number === 0) {
        return `${number.toFixed(digits)}`;
    }
    
    if (Math.abs(number) >= Math.pow(10, digits) || Math.abs(number) < Math.pow(10, -digits)) {
        const exp = number.toExponential(digits);
        const parts = exp.split('e');
        const coefficient = parts[0].replace('.', ',');
        const exponent = parseInt(parts[1], 10);

        const exponentSign = exponent < 0 ? '⁻' : '';
        const exponentAbs = Math.abs(exponent).toString();
        const exponentUnicode = exponentSign + exponentAbs.replace(/0/g, '⁰').replace(/1/g, '¹').replace(/2/g, '²')
                                                           .replace(/3/g, '³').replace(/4/g, '⁴').replace(/5/g, '⁵')
                                                           .replace(/6/g, '⁶').replace(/7/g, '⁷').replace(/8/g, '⁸')
                                                           .replace(/9/g, '⁹');

        return `${coefficient}×10${exponentUnicode}`;
    } else {
        return number.toFixed(digits).replace('.', ',');
    }
}

function populateParameterDropdowns() {
    const params = {
		objectA: [
            { label: 'Mass A', value: 'massA' },
            { label: 'Charge A', value: 'chargeA' },
            { label: 'Radius A', value: 'radiusA' },
            { label: 'Radial Speed A', value: 'speedRadial1' },
            { label: 'Radial Acceleration A', value: 'accelerationRadial1' }
        ],
        objectB: [
            { label: 'Mass B', value: 'massB' },
            { label: 'Charge B', value: 'chargeB' },
            { label: 'Radius B', value: 'radiusB' },
            { label: 'Radial Speed B', value: 'speedRadial2' },
            { label: 'Radial Acceleration B', value: 'accelerationRadial2' }
        ],
        relative: [
            { label: 'Time', value: 'timeElapsed' },
            { label: 'Distance Between A and B', value: 'distanceBetween' },
            { label: 'Relative Radial Speed', value: 'relativeSpeedRadial' },
            { label: 'Relative Radial Acceleration', value: 'relativeAccelerationRadial' }
        ],
        orbital: [
            { label: 'Angular Momentum', value: 'orbitalAngularMomentum' },
            { label: 'Kinetic Energy', value: 'orbitalKineticEnergy' },
            { label: 'Specific Orbital Energy', value: 'orbitalSpecificOrbitalEnergy' },
            { label: 'Semi Major Axis', value: 'orbitalSemiMajorAxis' },
            { label: 'Eccentricity', value: 'orbitalEccentricity' },
            { label: 'Orbital Period', value: 'orbitalPeriod' },
            { label: 'Mean Orbital Speed', value: 'meanOrbitalSpeed' },
            { label: 'Orbital Parameter', value: 'orbitalParameter' },
            { label: 'Aphelion', value: 'aphelion' },
            { label: 'Perihelion', value: 'perihelion' },
            { label: 'True Anomaly', value: 'trueAnomaly' },
            { label: 'Longitude of Ascending Node', value: 'longitudeOfAscendingNode' },
            { label: 'Mean Anomaly', value: 'meanAnomaly' },
            { label: 'Kepler Equation Solver', value: 'keplerEquation' }
        ]
    };
	
    const paramXSelect = document.getElementById('paramXSelect');
    const paramYSelect = document.getElementById('paramYSelect');

    function addOptionsToSelect(select, label, options, letter) {
        const optGroup = document.createElement('optgroup');
        optGroup.label = label;
        // optGroup.id = label + 'choiceLabel';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.text = option.label;
            opt.id = option.value + letter + 'choiceLabel';
            optGroup.appendChild(opt);
        });
        select.appendChild(optGroup);
    }

    paramXSelect.innerHTML = '';
    paramYSelect.innerHTML = '';

    addOptionsToSelect(paramXSelect, 'Relative Parameters', params.relative, 'X');
    addOptionsToSelect(paramXSelect, 'Object A Parameters', params.objectA, 'X');
    addOptionsToSelect(paramXSelect, 'Object B Parameters', params.objectB, 'X');
    addOptionsToSelect(paramXSelect, 'Orbital Parameters', params.orbital, 'X');

    addOptionsToSelect(paramYSelect, 'Relative Parameters', params.relative, 'Y');
    addOptionsToSelect(paramYSelect, 'Object A Parameters', params.objectA, 'Y');
    addOptionsToSelect(paramYSelect, 'Object B Parameters', params.objectB, 'Y');
    addOptionsToSelect(paramYSelect, 'Orbital Parameters', params.orbital, 'Y');
}

function initChart() {
    const ctx = document.getElementById('parameterChart');
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Evolution of Parameters',
                data: [],
                backgroundColor: `rgba(${Math.random() * 100}, ${Math.random() * 100 + 155}, ${Math.random() * 100 + 155})`
            }]
        },
        options: {
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'X',
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Y',
                        color: 'rgba(255, 255, 255, 0.5)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        }
    });
    chartInitialized = true;
	if (devModenabled && chartInitialized) {
		console.log('Chart initialized');
	}
}

function updateChart(xValue, yValue) {
	if (showWindow) {
		if (chartInitialized) {
			chart.data.datasets[0].data.push({ x: xValue, y: yValue });
			chart.update();
		}
    }
}

function getSelectedParameterValue(parameter, objectA, objectB) {
    switch (parameter) {
        case 'massA': return objectA.mass;
        case 'chargeA': return objectA.charge;
        case 'radiusA': return objectA.radius;
        case 'speedRadial1': return getRadialSpeed(objectA);
        case 'accelerationRadial1': return getRadialAcceleration(objectA);
        case 'massB': return objectB.mass;
        case 'chargeB': return objectB.charge;
        case 'radiusB': return objectB.radius;
        case 'speedRadial2': return getRadialSpeed(objectB);
        case 'accelerationRadial2': return getRadialAcceleration(objectB);
        case 'distanceBetween': return getDistanceBetweenObjects(objectA, objectB);
        case 'relativeSpeedRadial': return Math.abs(getRadialSpeed(objectA) - getRadialSpeed(objectB));
        case 'relativeAccelerationRadial': return Math.abs(getRadialAcceleration(objectA) - getRadialAcceleration(objectB));
        case 'timeElapsed': return timeElapsed;
		case 'orbitalAngularMomentum': return getAngularMomentum(objectA, objectB);
		case 'orbitalKineticEnergy': return getKineticEnergy(objectA, objectB);
		case 'orbitalSpecificOrbitalEnergy': return getSpecificOrbitalEnergy(objectA, objectB);
		case 'orbitalSemiMajorAxis': return getSemiMajorAxis(objectA, objectB);
		case 'orbitalEccentricity': return getEccentricity(objectA, objectB);
		case 'orbitalPeriod': return getOrbitalPeriod(objectA, objectB);
		case 'meanOrbitalSpeed': return getMeanOrbitalSpeed(objectA, objectB);
		case 'orbitalParameter': return getOrbitalParameter(objectA, objectB);
		case 'aphelion': return getAphelion(objectA, objectB);
		case 'perihelion': return getPerihelion(objectA, objectB);
		case 'trueAnomaly': return getTrueAnomaly(objectA, objectB);
		case 'longitudeOfAscendingNode': return getLongitudeOfAscendingNode(objectA, objectB);
		case 'meanAnomaly': return getMeanAnomaly(objectA, objectB);
		case 'keplerEquation': return solveKeplerEquation(objectA, objectB);
		
        default: return 0;
    }
}

function updateGraphWithParameters(objectA, objectB, currentTime) {
    const paramXSelect = document.getElementById('paramXSelect');
    const paramYSelect = document.getElementById('paramYSelect');

    const xParameter = paramXSelect.value;
    const yParameter = paramYSelect.value;

    const xValue = getSelectedParameterValue(xParameter, objectA, objectB);
    const yValue = getSelectedParameterValue(yParameter, objectA, objectB);

    const xLabel = paramXSelect.options[paramXSelect.selectedIndex].text;
    const yLabel = paramYSelect.options[paramYSelect.selectedIndex].text;

    chart.options.scales.x.title.text = xLabel;
    chart.options.scales.y.title.text = yLabel;

    chart.update();

    if (xValue !== null && yValue !== null) {
		const doconst = Math.ceil(Math.min(cpuUsage ** 2 / 1e4, 7))
        if (frameCount % doconst === 0) {
            updateChart(xValue, yValue, currentTime);
        }
    }
}

function clearChart() {
    if (chartInitialized) {
        chart.data.datasets[0].data = [];
        chart.update();
		if (devModenabled) {
			console.log('Chart cleared');
		}
    }
}

/* Démarrage de la simulation avec l'appel des fonctions */

function initiate() {
	startTimer();
	
	updateConstants();
	
	updateControlValues();
	updateWellControlValues();
	
	animate();
	
	initChart();
	
	updatePresetSelect();
	
	populateParameterDropdowns();
	
	draw();
	
	translate();
}

document.addEventListener('DOMContentLoaded', function() {
	if (devModenabled) {
		console.log('Starting...');
	}
	
	initiate();

	if (devModenabled) {
		console.log('Start succes!');
	}
});
