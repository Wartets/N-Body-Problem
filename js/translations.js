document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');

    function applyTranslations(language) {
        const trans = translations[language];
		
		timerLng = trans.timeLabel;
		
        document.getElementById('dtLabel').textContent = trans.dt;
        document.getElementById('showSizeLabel').textContent = trans.adaptiveSize;
        document.getElementById('displayModeLabel').textContent = trans.dotViewSetting;
        document.getElementById('ConstValLabel').textContent = trans.adaptiveValue;
        document.getElementById('displayConstLabel').textContent = trans.constCalcSetting;
        document.getElementById('mergeToggleLabel').textContent = trans.enableMerging;
        document.getElementById('collisionToggleLabel').textContent = trans.enableCollisions;
        document.getElementById('gravityToggleLabel').textContent = trans.enableGravity;
        document.getElementById('magneticToggleLabel').textContent = trans.enableMA;
        document.getElementById('showVelocitiesLabel').textContent = trans.showVelocities;
        document.getElementById('frictionToggleLabel').textContent = trans.enableFriction;
        document.getElementById('showGravityFieldLabel').textContent = trans.idGravityFieldLabel;
        document.getElementById('showMagneticFieldLabel').textContent = trans.idMagneticFieldLabel;
        document.getElementById('frictionCoefficientLabel').textContent = trans.frictionCoefficient;
        document.getElementById('focusSelectLabel').textContent = trans.centerView;
        document.getElementById('showGridLabel').textContent = trans.enableGrid;
        document.getElementById('zoomingToolLabel').textContent = trans.zoomManual;
        document.getElementById('trailLimitLabel').textContent = trans.trailLimit;
        document.getElementById('presetSelectLabel').textContent = trans.loadPreset;
        document.getElementById('loadPresetBtn').textContent = trans.loadPreset;
        document.getElementById('savePresetBtn').textContent = trans.savePreset;
        document.getElementById('presetName').placeholder = trans.presetName;
        document.getElementById('addBodyBtn').textContent = trans.addObject;
		
        document.getElementById('HelpModalTitle').textContent = trans.HelpModalTitleValue;
        document.getElementById('HelpModalIntro').textContent = trans.HelpModalIntroValue;
		
        document.getElementById('HelpModalGitPageTitle').textContent = trans.HelpModalGitPageTitleValue;
        document.getElementById('HelpModalGitPageText').textContent = trans.HelpModalGitPageTextValue;
        document.getElementById('HelpModalGitPageLink').textContent = trans.HelpModalGitPageLinkValue;
		
        document.getElementById('HelpModalDocTitle').textContent = trans.HelpModalDocTitleValue;
        document.getElementById('HelpModalDocText').textContent = trans.HelpModalDocTextValue;
        document.getElementById('HelpModalDocLink').textContent = trans.HelpModalDocLinkValue;
		
        document.getElementById('HelpModalBugTitle').textContent = trans.HelpModalBugTitleValue;
        document.getElementById('HelpModalBugText').textContent = trans.HelpModalBugTextValue;
        document.getElementById('HelpModalBugLink').textContent = trans.HelpModalBugLinkValue;
		
        document.getElementById('HelpModalAutorTitle').textContent = trans.HelpModalAutorTitleValue;
        document.getElementById('HelpModalAutorText').textContent = trans.HelpModalAutorTextValue;
        document.getElementById('HelpModalAutorLink').textContent = trans.HelpModalAutorLinkValue;
		
        document.getElementById('barycenterLabel').textContent = trans.Baryenable;
        document.getElementById('MassEntree').textContent = trans.MassValue;
        document.getElementById('ChargeEntree').textContent = trans.ChargeValue;
        document.getElementById('PosXEntree').textContent = trans.PosXValue;
        document.getElementById('PosYEntree').textContent = trans.PosYValue;
        document.getElementById('SpeedXEntree').textContent = trans.SpeedXValue;
        document.getElementById('SpeedYEntree').textContent = trans.SpeedYValue;
		
        document.getElementById('timer').textContent = trans.time;
        //document.getElementById('timerLabel').textContent = trans.timeLabel;
    }

    languageSelect.addEventListener('change', () => {
        applyTranslations(languageSelect.value);
    });

    applyTranslations(languageSelect.value || 'fr');
});

const translations = {
    "fr": {
        "resetView": "Réinitialiser la vue",
        "fullscreen": "Plein écran",
        "startPause": "Lancer la simulation",
        "time": "Temps : 0.00 s",
		"timeLabel": "Temps :",
        "dt": "dt (Intervalle de temps) :",
		"dotViewSetting": "Mode d'affichage des points :",
        "adaptiveSize": "(adaptative: 1 / constante 0)",
		"constCalcSetting": "Valeurs pour les Constantes :",
		"adaptiveValue": "(réelles: 1 / normalisées: 0)",
        "enableCollisions": "Activer les collisions",
		"enableMerging": "Activer la fusion d'objet",
		"enableGrid": "Afficher la grille",
        "enableGravity": "Activer la gravité",
        "enableMA": "Activer la force électromagnétique",
        "showVelocities": "Afficher les vecteurs de vitesse",
        "enableFriction": "Activer les frottements",
        "frictionCoefficient": "Coefficient de frottement :",
		"idGravityFieldLabel": "Afficher le champ de gravité",
		"idMagneticFieldLabel": "Afficher le champ électromagnétique",
        "centerView": "Centre de la vue :",
        "zoomManual": "Zoom manuel :",
        "trailLimit": "Nombre de points du trail (puiss. 10)",
        "loadPreset": "Charger un preset :",
        "savePreset": "Sauvegarder le preset",
        "presetName": "Nom du preset (vide pour nom par défaut)",
        "addObject": "Ajouter un objet",
		"Baryenable": "Barycentre",
		"MassValue": "Masse :",
		"ChargeValue": "Charge :",
		"PosXValue": "Position X :",
		"PosYValue": "Position Y :",
		"SpeedXValue": "Vitesse X :",
		"SpeedYValue": "Vitesse Y :",
		"HelpModalTitleValue": "Simulation d'un Système à N-Corps",
		"HelpModalIntroValue": "Dans cette simulation interactive, vous pourrez explorer les forces d'électromagnétisme, de gravité, les collisions et les effets de la friction dans un système à N-corps. Ajustez la vitesse, la masse, la charge, et la position de chaque objet et observez les interactions en temps réel, visualisez également les champs gravitationnel et électromagnétique en direct.",
		"HelpModalGitPageTitleValue": "Page GitHub du Projet",
		"HelpModalGitPageTextValue": "Découvrez le code source et contribuez au projet sur GitHub :",
		"HelpModalGitPageLinkValue": "Voir le projet sur GitHub",
		"HelpModalDocTitleValue": "Documentation",
		"HelpModalDocTextValue": "Pour une meilleure compréhension des fonctionnalités du simulateur, explorez le Wiki :",
		"HelpModalDocLinkValue": "Consulter le Wiki",
		"HelpModalBugTitleValue": "Bugs et Suggestions",
		"HelpModalBugTextValue": "Si vous rencontrez un problème ou avez des suggestions, vous pouvez les partager sur la page suivante :",
		"HelpModalBugLinkValue": "Signaler un Problème",
		"HelpModalAutorTitleValue": "Créateur",
		"HelpModalAutorTextValue": "Ce projet a été créé par Wartets. Consultez son profil GitHub pour en découvrir d'autres projets :",
		"HelpModalAutorLinkValue": "@Wartets",
    },
    "en": {
        "resetView": "Reset View",
        "fullscreen": "Fullscreen",
        "startPause": "Start Simulation",
        "time": "Time: 0.00 s",
		"timeLabel": "Time:",
        "dt": "dt (Time Interval):",
		"dotViewSetting": "Dot Setting View :",
        "adaptiveSize": "(adaptive: 1 / constant 0)",
		"constCalcSetting": "Values for Constants :",
		"adaptiveValue": "(real: 1 / normalized: 0)",
        "enableCollisions": "Enable Collisions",
		"enableMerging": "Enable object merging",
		"enableGrid": "Show Grid",
        "enableGravity": "Enable Gravity",
        "enableMA": "Activate the electromagnetic force",
        "showVelocities": "Show Velocity Vectors",
        "enableFriction": "Enable Friction",
        "frictionCoefficient": "Friction Coefficient:",
		"idGravityFieldLabel": "Display the gravity field",
		"idMagneticFieldLabel": "Display electromagnetic field",
        "centerView": "Center View:",
        "zoomManual": "Manual Zoom:",
        "trailLimit": "Trail Points (power of 10)",
        "loadPreset": "Load Preset",
        "savePreset": "Save Preset",
        "presetName": "Preset Name (empty for default)",
        "addObject": "Add Object",
		"Baryenable": "Barycenter",
		"MassValue": "Mass:",
		"ChargeValue": "Charge:",
		"PosXValue": "X Position:",
		"PosYValue": "Y Position:",
		"SpeedXValue": "X Speed:",
		"SpeedYValue": "Y Speed:",
		"HelpModalTitleValue": "N-Body Simulation",
		"HelpModalIntroValue": "In this interactive simulation, you can explore the forces of gravity, electromagnetism, collisions, and the effects of friction in an N-body system. Adjust the speed, mass, charge, and position of each object and observe the interactions in real time, as well as visualizing the gravitational and electromagnetic fields live.",
		"HelpModalGitPageTitleValue": "GitHub project page",
		"HelpModalGitPageTextValue": "Discover the source code and contribute to the project on GitHub:",
		"HelpModalGitPageLinkValue": "See the project on GitHub",
		"HelpModalDocTitleValue": "Documentation",
		"HelpModalDocTextValue": "For a better understanding of the simulator's features, explore the Wiki:",
		"HelpModalDocLinkValue": "View Wiki",
		"HelpModalBugTitleValue": "Bugs & Suggestions",
		"HelpModalBugTextValue": "If you encounter a problem or have any suggestions, you can share them on the following page:",
		"HelpModalBugLinkValue": "Report a problem",
		"HelpModalAutorTitleValue": "Author",
		"HelpModalAutorTextValue": "This project was created by Wartets. Check out his GitHub profile for more projects:",
		"HelpModalAutorLinkValue": "@Wartets",
    },
    "es": {
        "resetView": "Reiniciar vista",
        "fullscreen": "Pantalla completa",
        "startPause": "Iniciar simulación",
        "time": "Tiempo: 0.00 s",
		"timeLabel": "Tiempo:",
        "dt": "dt (Intervalo de tiempo):",
		"dotViewSetting": "Moda de visualización de los puntos",
        "adaptiveSize": "(adaptatable: 1 / constante: 0)",
		"constCalcSetting": "Valores de las constantes:",
		"adaptiveValue": "(real: 1 / normalizado: 0)",
        "enableCollisions": "Activar colisiones",
		"enableMerging": "",
		"enableGrid": "",
        "enableGravity": "Activar gravedad",
        "enableMA": "Activar la fuerza electromagnética",
        "showVelocities": "Mostrar vectores de velocidad",
        "enableFriction": "Activar fricción",
        "frictionCoefficient": "Coeficiente de fricción:",
		"idGravityFieldLabel": "Visualizar el campo gravitatorio",
		"idMagneticFieldLabel": "Visualizar el campo electromagnético",
        "centerView": "Centrar vista en:",
        "zoomManual": "Zoom manual:",
        "trailLimit": "Puntos del trazado (potencia de 10)",
        "loadPreset": "Cargar preset:",
        "savePreset": "Salvaguardar preset",
        "presetName": "Nombre del preset (vacío para predeterminado)",
        "addObject": "Añadir objeto",
		"Baryenable": "Baricentro",
		"MassValue": "Masa:",
		"ChargeValue": "Carga:",
		"PosXValue": "Posición X:",
		"PosYValue": "Posición Y:",
		"SpeedXValue": "Velocidad X:",
		"SpeedYValue": "Velocidad Y:",
		"HelpModalTitleValue": "Simulación de N-cuerpos",
		"HelpModalIntroValue": "En esta simulación interactiva puedes explorar las fuerzas de la gravedad, el electromagnetismo, las colisiones y los efectos de la fricción en un sistema de N cuerpos. Ajusta la velocidad, la masa, la carga y la posición de cada objeto y observa las interacciones en tiempo real, además de visualizar los campos gravitatorio y electromagnético en directo.",
		"HelpModalGitPageTitleValue": "Página del proyecto en GitHub",
		"HelpModalGitPageTextValue": "Descubre el código fuente y contribuye al proyecto en GitHub:",
		"HelpModalGitPageLinkValue": "Ver el proyecto en GitHub",
		"HelpModalDocTitleValue": "Documentación",
		"HelpModalDocTextValue": "Para comprender mejor las características del simulador, explore la Wiki:",
		"HelpModalDocLinkValue": "Ver Wiki",
		"HelpModalBugTitleValue": "Errores y sugerencias",
		"HelpModalBugTextValue": "Si encuentra algún problema o tiene alguna sugerencia, puede compartirla en la siguiente página:",
		"HelpModalBugLinkValue": "Informar de un problema",
		"HelpModalAutorTitleValue": "Autor",
		"HelpModalAutorTextValue": "Este proyecto fue creado por Wartets. Echa un vistazo a su perfil de GitHub para ver más proyectos:",
		"HelpModalAutorLinkValue": "@Wartets",
    },
	"de": {
        "resetView": "Ansicht zurücksetzen",
        "fullscreen": "Vollbild",
        "startPause": "Simulation starten",
        "time": "Zeit: 0.00 s",
		"timeLabel": "Zeit:",
        "dt": "dt (Zeitintervall):",
		"dotViewSetting": "Punkteinstellungsansicht :",
        "adaptiveSize": "(adaptiv: 1 / konstant: 0)",
		"constCalcSetting": "Werte für die Konstanten :",
		"adaptiveValue": "(real: 1 / normalisiert: 0)",
        "enableCollisions": "Kollisionen aktivieren",
		"enableMerging": "Aktivieren der Objektzusammenführung",
		"enableGrid": "Raster anzeigen",
        "enableGravity": "Schwerkraft aktivieren",
        "enableMA": "Elektromagnetische Kraft aktivieren",
        "showVelocities": "Geschwindigkeitsvektoren anzeigen",
        "enableFriction": "Reibung aktivieren",
        "frictionCoefficient": "Reibungskoeffizient:",
		"idGravityFieldLabel": "Das Gravitationsfeld anzeigen",
		"idMagneticFieldLabel": "Elektromagnetisches Feld anzeigen",
        "centerView": "Ansicht zentrieren:",
        "zoomManual": "Manuelles Zoomen:",
        "trailLimit": "Spurpunkte (Zehnerpotenzen)",
        "loadPreset": "Voreinstellung laden:",
        "savePreset": "Voreinstellung speichern",
        "presetName": "Name der Voreinstellung (leer für Standard)",
        "addObject": "Objekt hinzufügen",
		"Baryenable": "Schwerpunkt",
		"MassValue": "Masse:",
		"ChargeValue": "Ladung:",
		"PosXValue": "X-Position:",
		"PosYValue": "Y-Position:",
		"SpeedXValue": "Geschwindigkeit X:",
		"SpeedYValue": "Geschwindigkeit Y:",
		"HelpModalTitleValue": "N-Körper-Simulation",
		"HelpModalIntroValue": "In dieser interaktiven Simulation können Sie die Kräfte der Schwerkraft, des Elektromagnetismus, der Kollisionen und die Auswirkungen der Reibung in einem N-Körper-System erkunden. Stellen Sie die Geschwindigkeit, Masse, Ladung und Position jedes Objekts ein und beobachten Sie die Wechselwirkungen in Echtzeit, sowie die Visualisierung der Gravitations- und elektromagnetischen Felder live.",
		"HelpModalGitPageTitleValue": "GitHub-Projektseite",
		"HelpModalGitPageTextValue": "Entdecken Sie den Quellcode und tragen Sie zum Projekt auf GitHub bei:",
		"HelpModalGitPageLinkValue": "Siehe das Projekt auf GitHub",
		"HelpModalDocTitleValue": "Dokumentation",
		"HelpModalDocTextValue": "Um ein besseres Verständnis der Funktionen des Simulators zu erlangen, besuchen Sie das Wiki:",
		"HelpModalDocLinkValue": "Wiki ansehen",
		"HelpModalBugTitleValue": "Bugs & Vorschläge",
		"HelpModalBugTextValue": "Wenn Sie auf ein Problem stoßen oder Vorschläge haben, können Sie diese auf der folgenden Seite mitteilen:",
		"HelpModalBugLinkValue": "Ein Problem melden",
		"HelpModalAutorTitleValue": "Autor",
		"HelpModalAutorTextValue": "Dieses Projekt wurde von Wartets erstellt. Auf seinem GitHub-Profil finden Sie weitere Projekte:",
		"HelpModalAutorLinkValue": "@Wartets",
    },
	"it": {
		"resetView": "Reimposta vista",
		"fullscreen": "Schermo intero",
		"startPause": "Avvia la simulazione",
		"time": "Tempo: 0,00 s",
		"timeLabel": "Tempo:",
		"dt": "dt (Intervallo di tempo):",
		"dotViewSetting": "Modalità di visualizzazione dei punti:",
		"adaptiveSize": "(adattativo: 1 / costante: 0)",
		"constCalcSetting": "Valori per le costanti:",
		"adaptiveValue": "(reale: 1 / normalizzato: 0)",
		"enableCollisions": "Attiva collisioni",
		"enableMerging": "Abilita la fusione degli oggetti",
		"enableGrid": "Mostra griglia",
		"enableGravity": "Attiva gravità",
		"enableMA": "Attiva forza elettromagnetica",
		"showVelocities": "Mostra vettori di velocità",
		"enableFriction": "Attiva attriti",
		"frictionCoefficient": "Coefficiente di attrito:",
		"idGravityFieldLabel": "Visualizzare il campo gravitazionale",
		"idMagneticFieldLabel": "Visualizzare il campo elettromagnetico",
		"centerView": "Centro della vista:",
		"zoomManual": "Zoom manuale:",
		"trailLimit": "Numero di punti della scia (pot. di 10)",
		"loadPreset": "Carica un preset:",
		"savePreset": "Salva il preset",
		"presetName": "Nome del preset (vuoto per nome predefinito)",
		"addObject": "Aggiungi un oggetto",
		"Baryenable": "Baricentro",
		"MassValue": "Massa:",
		"ChargeValue": "Carica:",
		"PosXValue": "Posizione X:",
		"PosYValue": "Posizione Y:",
		"SpeedXValue": "Velocità X:",
		"SpeedYValue": "Velocità Y:",
		"HelpModalTitleValue": "Simulazione di un corpo N",
		"HelpModalIntroValue": "In questa simulazione interattiva è possibile esplorare le forze di gravità, l'elettromagnetismo, le collisioni e gli effetti dell'attrito in un sistema di N-corpi. Regolate la velocità, la massa, la carica e la posizione di ciascun oggetto e osservate le interazioni in tempo reale, oltre a visualizzare in diretta i campi gravitazionali ed elettromagnetici.",
		"HelpModalGitPageTitleValue": "Pagina del progetto su GitHub",
		"HelpModalGitPageTextValue": "Scoprite il codice sorgente e contribuite al progetto su GitHub:",
		"HelpModalGitPageLinkValue": "Vedi il progetto su GitHub",
		"HelpModalDocTitleValue": "Documentazione",
		"HelpModalDocTextValue": "Per una migliore comprensione delle caratteristiche del simulatore, esplorare il Wiki:",
		"HelpModalDocLinkValue": "Visualizza il Wiki",
		"HelpModalBugTitleValue": "Bug e suggerimenti",
		"HelpModalBugTextValue": "Se riscontrate un problema o avete dei suggerimenti, potete condividerli nella pagina seguente:",
		"HelpModalBugLinkValue": "Segnala un problema",
		"HelpModalAutorTitleValue": "Autore",
		"HelpModalAutorTextValue": "Questo progetto è stato creato da Wartets. Controlla il suo profilo GitHub per altri progetti:",
		"HelpModalAutorLinkValue": "@Wartets",
	},
	"la": {
		"resetView": "Visum resetare",
		"fullscreen": "Plenum scrinium",
		"startPause": "Incipe simulationem",
		"time": "Tempus: 0,00 s",
		"timeLabel": "Tempus:",
		"dt": "dt (Intervallum temporis):",
		"dotViewSetting": "Modus visus punctorum:",
		"adaptiveSize": "(adaptativum: I / constans: Ø)",
		"constCalcSetting": "Valores pro Constantibus:",
		"adaptiveValue": "(realis: I / normalized: Ø)",
		"enableCollisions": "Permitte collisiones",
		"enableMerging": "Activate quod merge",
		"enableGrid": "Ostendere malesuada euismod",
		"enableGravity": "Permitte gravitatem",
		"enableMA": "Permitte vim electromagneticam",
		"showVelocities": "Monstra vectores velocitatis",
		"enableFriction": "Permitte attritus",
		"frictionCoefficient": "Coefficiente attritus:",
		"idGravityFieldLabel": "Gravitas ostende agri",
		"idMagneticFieldLabel": "Monstrare campum electromagneticum",
		"centerView": "Centrum visus:",
		"zoomManual": "Manuale zoom:",
		"trailLimit": "Numerus punctorum vestigii (pot. 10)",
		"loadPreset": "Onera preset:",
		"savePreset": "Salva preset",
		"presetName": "Nomen preset (vacuum pro nomine predefinito)",
		"addObject": "Adde obiectum",
		"Baryenable": "Baricentrum",
		"MassValue": "Massa:",
		"ChargeValue": "Onus:",
		"PosXValue": "Positio X:",
		"PosYValue": "Positio Y:",
		"SpeedXValue": "Velocitas X:",
		"SpeedYValue": "Velocitas Y:",
		"HelpModalTitleValue": "N. Corpus Simulatio",
		"HelpModalIntroValue": "In hac simulatione interactive, explorare potes vires gravitatis, electromagnetismi, collisiones et effectus friction in systemate N corpore. Celeritatem, massam, crimen et situm compone uniuscuiusque objecti et interactiones in reali tempore observa, necnon campi gravitatis et electromagnetici visualisi vivant.",
		"HelpModalGitPageTitleValue": "GitHub project pagina",
		"HelpModalGitPageTextValue": "Fons codicem reperi et ad propositum confer in GitHub;",
		"HelpModalGitPageLinkValue": "Vide project in GitHub",
		"HelpModalDocTitleValue": "Documentation",
		"HelpModalDocTextValue": "Ad meliorem notarum simulatoris cognitionem explora Wiki:",
		"HelpModalDocLinkValue": "Visum wiki",
		"HelpModalBugTitleValue": "Bugs & Consilia",
		"HelpModalBugTextValue": "Si aliquam quaestionem offenderis vel suggestiones habes, eas in sequenti pagina communicare potes:",
		"HelpModalBugLinkValue": "Referre quaestio",
		"HelpModalAutorTitleValue": "Auctor",
		"HelpModalAutorTextValue": "Hoc consilium a Wartets creatum est. Reprehendo sicco ejus profile GitHub plura incepta:",
		"HelpModalAutorLinkValue": "@Wartets",
	},
	"vf": {
		"resetView": "Réinitialiser la veue",
		"fullscreen": "Plain escherm",
		"startPause": "Lancer la simulacion",
		"time": "Tens : 0.00 s",
		"timeLabel": "Tens ",
		"dt": "dt (Interval de tens) :",
		"dotViewSetting": "Mod d'afichage des poins :",
		"adaptiveSize": "(adaptatif: 1 / constans 0)",
		"constCalcSetting": "Valours por les Constaunces :",
		"adaptiveValue": "(véritables: 1 / nivelées: 0)",
		"enableCollisions": "Activer les collisiouns",
		"enableMerging": "Entrajoster les corps",
		"enableGrid": "Aficher la graïlle ",
		"enableGravity": "Activer la gravité",
		"enableMA": "Activer la force élektrique",
		"showVelocities": "Aficher les vectors de vitesce",
		"enableFriction": "Activer les frotemens",
		"frictionCoefficient": "Coeficient de frotement :",
		"idGravityFieldLabel": "Aficher le champ de gravité",
		"idMagneticFieldLabel": "Aficher le champ élektrique",
		"centerView": "Centre de la veue :",
		"zoomManual": "Zoom manual :",
		"trailLimit": "Nombre de poins du traiel (puissance 10)",
		"loadPreset": "Charger ung preset :",
		"savePreset": "Sauveguarder le preset",
		"presetName": "Nom du preset (vide pour nom par défaut)",
		"addObject": "Ajouter ung objet",
		"Baryenable": "Baricentrum",
		"MassValue": "Masse :",
		"ChargeValue": "Charge :",
		"PosXValue": "Position X :",
		"PosYValue": "Position Y :",
		"SpeedXValue": "Vitesce X :",
		"SpeedYValue": "Vitesce Y :",	
		"HelpModalTitleValue": "Simulacion d'un Système à N-Cors",
		"HelpModalIntroValue": "En ceste simulacion interactive, vous pourrez explorer les forces d'électromagnétisme, de gravité, les collisions et les effets de la friction en ung système à N-cors. Ajostez la vitesse, la masse, la charge et la position de chascun object, et veez les interacions en temps réel. Veoiez aussi les champs de gravité et d'électromagnétisme en direct.",
		"HelpModalGitPageTitleValue": "Page GitHub du Projet",
		"HelpModalGitPageTextValue": "Descovrez le code source et contribuez au projet sur GitHub :",
		"HelpModalGitPageLinkValue": "Veez le projet sur GitHub",
		"HelpModalDocTitleValue": "Documentation",
		"HelpModalDocTextValue": "Pour mieulx comprendre les fonctionnalitez du simulateur, explorez le Wiki :",
		"HelpModalDocLinkValue": "Veez le Wiki",
		"HelpModalBugTitleValue": "Failles et Suggestions",
		"HelpModalBugTextValue": "Se vous trouvez ung problème ou avez suggestiones, vous pouvez les partager en la page cy-dessous :",
		"HelpModalBugLinkValue": "Raportez une Faille",
		"HelpModalAutorTitleValue": "Créateur",
		"HelpModalAutorTextValue": "Cest projet fu créé par Wartets. Veez son profil GitHub pour autres œuvres :",
		"HelpModalAutorLinkValue": "@Wartets",
	},
	"pirate": {
		"resetView": "Arrr-réinitialiser l'vue",
		"fullscreen": "Plein mât d'scène",
		"startPause": "Lancer la simulaaaargh",
		"time": "Temps d'butin: 0.00 s",
		"timeLabel": "Temps d'butin:",
		"dt": "dt (Intervalle d'temps):",
		"dotViewSetting": "Affichage des points d'canon:",
		"adaptiveSize": "(à la voile: 1 / ancré: 0)",
		"constCalcSetting": "Les trésors pour les Constantes, moussaillon !",
		"adaptiveValue": "(réelles, aye aye: 1 / à la norme, arggh: 0)",
		"enableCollisions": "Activer les abordages",
		"enableMerging": "Activer l'arbordage !",
		"enableGrid": "Montrez la carte",
		"enableGravity": "Activer la gravité des mers",
		"enableMA": "Activer la force élec'tornade",
		"showVelocities": "Montrer les vents de vitesse",
		"enableFriction": "Activer les freins d'cale",
		"frictionCoefficient": "Coefficient de frottage:",
		"idGravityFieldLabel": "Montrer l'chant d'gravité",
		"idMagneticFieldLabel": "Montrer l'chant d'lamant",
		"centerView": "Cap sur le centre d'vue:",
		"zoomManual": "Zoom à l'œil d'marin:",
		"trailLimit": "Nombre de points d'trace (puiss. 10)",
		"loadPreset": "Charger un coffre de presets:",
		"savePreset": "Enterrer l'preset",
		"presetName": "Nom du trésor (laisser vide pour nom commun)",
		"addObject": "Ajouter un objet d'butin",
		"Baryenable": "Baricentre du trésor",
		"MassValue": "Masse du butin:",
		"ChargeValue": "Charge d'or:",
		"PosXValue": "Pos'X d'l'île:",
		"PosYValue": "Pos'Y d'l'île:",
		"SpeedXValue": "Vitesse X du navire:",
		"SpeedYValue": "Vitesse Y du navire:",
		"HelpModalTitleValue": "Simulaaaation d’un Systèèèème à N-Corps, arrr!",
		"HelpModalIntroValue": "Dans c'te simulaaaation interactive, ye pourrrez explorer les forces d’électromagnétisme, de gravitééé, les collisions et les effets d’la friction dans un systèèèème à N-corps. Ajustez la vitesse, la masse, la charge et la position d'chacuun d'ces objets et observez les interactions en temps réeeel, matelot! Visualizez aussi les champs gravitationnels et électromagnétiques, arrrr!",
		"HelpModalGitPageTitleValue": "Page GitHub du Projet, hoho!",
		"HelpModalGitPageTextValue": "Découvre le code source et viens donc contribuer, arrrr! :",
		"HelpModalGitPageLinkValue": "Voir l’trésor sur GitHub, arrr!",
		"HelpModalDocTitleValue": "Documentation, hoho!",
		"HelpModalDocTextValue": "Pour mieux comprendre c’coffre aux fonctionnalités, explorez l’Wiki :",
		"HelpModalDocLinkValue": "Consulter l’Wiki, moussaillon!",
		"HelpModalBugTitleValue": "Bugs et Suggestiooons, arrr!",
		"HelpModalBugTextValue": "Si ye tombes sur un problème ou qu’tes idées coulent, partages-les ici :",
		"HelpModalBugLinkValue": "Signale un Pépin, arrr!",
		"HelpModalAutorTitleValue": "Capitaine Créateur",
		"HelpModalAutorTextValue": "Ce bateau a été construit par l’Capitaine Wartets! Jette un coup d’œil à son profil GitHub :",
		"HelpModalAutorLinkValue": "@Wartets, arrr!",
	},
	"shakespeare": {
		"resetView": "Recalibrate yon Vision",
		"fullscreen": "Complete the Theatre Stage",
		"startPause": "Commence the Noble Simulation",
		"time": "Tempus: 0.00 seconds",
		"timeLabel": "Tempus:",
		"dt": "dt (The Interval of Time):",
		"dotViewSetting": "Mode of Display for Dots:",
		"adaptiveSize": "(adaptive: 1 / constant: 0)",
		"constCalcSetting": "Values for the Constants:",
		"adaptiveValue": "(true: 1 / normalised: 0)",
		"enableCollisions": "Engage the Collisions True",
		"enableMerging": "Enable unification of objects",
		"enableGrid": "Display background grid",
		"enableGravity": "Unleash the Force of Gravity",
		"enableMA": "Empower the Electromagnetic Force",
		"showVelocities": "Reveal the Vectors of Speed",
		"enableFriction": "Permit the Rubbing of Surfaces",
		"frictionCoefficient": "The Coefficient of Friction:",
		"idGravityFieldLabel": "Reveal the Gravitational Field",
		"idMagneticFieldLabel": "Unmask the Electromagnetic Field",
		"centerView": "Centralize the Vision’s Scope:",
		"zoomManual": "Magnify with Manual Grace:",
		"trailLimit": "The Limit of Traced Points (to the Power of Ten)",
		"loadPreset": "Bestow a Preset:",
		"savePreset": "Safeguard the Preset’s Name",
		"presetName": "Name the Preset (leave blank for default)",
		"addObject": "Introduce an Object of Worth",
		"Baryenable": "Empower the Barycentre",
		"MassValue": "Measure of Mass:",
		"ChargeValue": "Value of Charge:",
		"PosXValue": "Position on the X-Axis:",
		"PosYValue": "Position on the Y-Axis:",
		"SpeedXValue": "Speed along the X-Axis:",
		"SpeedYValue": "Speed along the Y-Axis:",
		"HelpModalTitleValue": "Simulation of a System with N-Bodies",
		"HelpModalIntroValue": "In this wondrous simulation most interactive, thou shalt explore the forces of electromagnetism, of gravity, of collision, and of friction in a system of N-bodies. Adjust the speed, the weight, the charge, and the position of each object, and behold the interactions unfold in real time! Lo, witness the gravitational and electromagnetic fields as they change and shift.",
		"HelpModalGitPageTitleValue": "GitHub Page of the Project",
		"HelpModalGitPageTextValue": "Unveil the source code and contribute thyself to the project:",
		"HelpModalGitPageLinkValue": "View the Project on GitHub",
		"HelpModalDocTitleValue": "Documentation",
		"HelpModalDocTextValue": "To comprehend the full nature of this simulator’s functions, explore the Wiki:",
		"HelpModalDocLinkValue": "Peruse the Wiki",
		"HelpModalBugTitleValue": "Bugs and Suggestions",
		"HelpModalBugTextValue": "Shouldst thou encounter problems or have thoughts to share, express them on this page:",
		"HelpModalBugLinkValue": "Report a Problem",
		"HelpModalAutorTitleValue": "Creator",
		"HelpModalAutorTextValue": "This fine creation was wrought by Wartets. Look upon his GitHub to discover more:",
		"HelpModalAutorLinkValue": "@Wartets",
	},
	"minion": {
		"resetView": "Reset banana view!",
		"fullscreen": "Banana fullscreen!",
		"startPause": "Bello! Start simulation!",
		"time": "Banana time: 0.00 s",
		"timeLabel": "Banana time:",
		"dt": "Banana dt (Time interval):",
		"dotViewSetting": "Banana dot display mode:",
		"adaptiveSize": "(Banana adaptive: 1 / Banana constant: 0)",
		"constCalcSetting": "Banana for da Constans!",
		"adaptiveValue": "(bello: 1 / po-ka: 0)",
		"enableCollisions": "Banana collisions ON!",
		"enableMerging": "BANANA-FUSION",
		"enableGrid": "Grid of banana",
		"enableGravity": "Banana gravity ON!",
		"enableMA": "Banana electromagnetic ON!",
		"showVelocities": "Show banana speed vectors!",
		"enableFriction": "Banana friction ON!",
		"frictionCoefficient": "Banana friction coefficient:",
		"idGravityFieldLabel": "Show banana gravity field!",
		"idMagneticFieldLabel": "Show banana magnetic field!",
		"centerView": "Banana view center!",
		"zoomManual": "Banana manual zoom!",
		"trailLimit": "Banana trail points (Power of 10)",
		"loadPreset": "Load banana preset!",
		"savePreset": "Save banana preset!",
		"presetName": "Banana preset name:",
		"addObject": "Add banana object!",
		"Baryenable": "Banana barycentre ON!",
		"MassValue": "Banana mass:",
		"ChargeValue": "Banana charge:",
		"PosXValue": "Banana X position:",
		"PosYValue": "Banana Y position:",
		"SpeedXValue": "Banana X speed:",
		"SpeedYValue": "Banana Y speed:",
		"HelpModalTitleValue": "Banana System N-Bodies",
		"HelpModalIntroValue": "In dis fun-fun simulation, you go boom-boom wit da electromagnetism, gravity, kaboomy collisions, an’ banana friction. You go fast-fast wit speed, mass, charge, an’ position all da objects, yello! And look! Real-time! Boom-boom time!",
		"HelpModalGitPageTitleValue": "GitHub Page Boom-Boom!",
		"HelpModalGitPageTextValue": "GitHub, yay! Find code an’ help make da project better:",
		"HelpModalGitPageLinkValue": "Go! GitHub! Banana!",
		"HelpModalDocTitleValue": "Doco-Doco, heehee!",
		"HelpModalDocTextValue": "Understandy da simulator? Go ready Wiki, yello:",
		"HelpModalDocLinkValue": "Read Wiki! Woohoo!",
		"HelpModalBugTitleValue": "Buggy-Bugs and Idea-Booms",
		"HelpModalBugTextValue": "Got a problem? Tell me! Tell me! Go here:",
		"HelpModalBugLinkValue": "Tell Problem!",
		"HelpModalAutorTitleValue": "Creator Banana!",
		"HelpModalAutorTextValue": "Made by Wartets! Yay! Look at his GitHub for more!",
		"HelpModalAutorLinkValue": "@Banana-Wartets!",
	},
	"pt": {
		"resetView": "",
		"fullscreen": "",
		"startPause": "",
		"time": "",
		"timeLabel": "",
		"dt": "",
		"dotViewSetting": "",
		"adaptiveSize": "",
		"constCalcSetting": "",
		"adaptiveValue": "",
		"enableCollisions": "",
		"enableMerging": "",
		"enableGrid": "",
		"enableGravity": "",
		"enableMA": "",
		"showVelocities": "",
		"enableFriction": "",
		"frictionCoefficient": "",
		"idGravityFieldLabel": "",
		"idMagneticFieldLabel": "",
		"centerView": "",
		"zoomManual": "",
		"trailLimit": "",
		"loadPreset": "",
		"savePreset": "",
		"presetName": "",
		"addObject": "",
		"Baryenable": "",
		"MassValue": "",
		"ChargeValue": "",
		"PosXValue": "",
		"PosYValue": "",
		"SpeedXValue": "",
		"SpeedYValue": "",
		"HelpModalTitleValue": "",
		"HelpModalIntroValue": "",
		"HelpModalGitPageTitleValue": "",
		"HelpModalGitPageTextValue": "",
		"HelpModalGitPageLinkValue": "",
		"HelpModalDocTitleValue": "",
		"HelpModalDocTextValue": "",
		"HelpModalDocLinkValue": "",
		"HelpModalBugTitleValue": "",
		"HelpModalBugTextValue": "",
		"HelpModalBugLinkValue": "",
		"HelpModalAutorTitleValue": "",
		"HelpModalAutorTextValue": "",
		"HelpModalAutorLinkValue": "@Wartets",
	},
	"LabelName": {
		"resetView": "resetView",
		"fullscreen": "fullscreen",
		"startPause": "startPause",
		"time": "time",
		"timeLabel": "timeLabel",
		"dt": "dt",
		"dotViewSetting": "dotViewSetting",
		"adaptiveSize": "adaptiveSize",
		"constCalcSetting": "constCalcSetting",
		"adaptiveValue": "adaptiveValue",
		"enableCollisions": "enableCollisions",
		"enableMerging": "enableMerging",
		"enableGrid": "enableGrid",
		"enableGravity": "enableGravity",
		"enableMA": "enableMA",
		"showVelocities": "showVelocities",
		"enableFriction": "enableFriction",
		"frictionCoefficient": "frictionCoefficient",
		"idGravityFieldLabel": "idGravityFieldLabel",
		"idMagneticFieldLabel": "idMagneticFieldLabel",
		"centerView": "centerView",
		"zoomManual": "zoomManual",
		"trailLimit": "trailLimit",
		"loadPreset": "loadPreset",
		"savePreset": "savePreset",
		"presetName": "presetName",
		"addObject": "addObject",
		"Baryenable": "Baryenable",
		"MassValue": "MassValue",
		"ChargeValue": "ChargeValue",
		"PosXValue": "PosXValue",
		"PosYValue": "PosYValue",
		"SpeedXValue": "SpeedXValue",
		"SpeedYValue": "SpeedYValue",
		"HelpModalTitleValue": "HelpModalTitleValue",
		"HelpModalIntroValue": "HelpModalIntroValue",
		"HelpModalGitPageTitleValue": "HelpModalGitPageTitleValue",
		"HelpModalGitPageTextValue": "HelpModalGitPageTextValue",
		"HelpModalGitPageLinkValue": "HelpModalGitPageLinkValue",
		"HelpModalDocTitleValue": "HelpModalDocTitleValue",
		"HelpModalDocTextValue": "HelpModalDocTextValue",
		"HelpModalDocLinkValue": "HelpModalDocLinkValue",
		"HelpModalBugTitleValue": "HelpModalBugTitleValue",
		"HelpModalBugTextValue": "HelpModalBugTextValue",
		"HelpModalBugLinkValue": "HelpModalBugLinkValue",
		"HelpModalAutorTitleValue": "HelpModalAutorTitleValue",
		"HelpModalAutorTextValue": "HelpModalAutorTextValue",
		"HelpModalAutorLinkValue": "HelpModalAutorLinkValue",
	},
}

function applyTranslations() {
    console.log('Translations:', translations);
}