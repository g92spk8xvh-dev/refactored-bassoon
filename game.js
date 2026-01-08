// TP52 Sailboat Racing Game
// Main game logic and 3D graphics

class SailboatRacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.boat = null;
        this.ocean = null;
        this.buoys = [];

        // Game state
        this.boatPosition = new THREE.Vector3(0, 0, 0);
        this.boatRotation = 0; // Heading in radians
        this.boatSpeed = 0;
        this.boatVelocity = new THREE.Vector3(0, 0, 0);
        this.rudderAngle = 0;
        this.sailTrim = 0.5; // 0 = tight, 1 = loose

        // Wind
        this.windDirection = Math.PI * 0.25; // Wind direction in radians
        this.windSpeed = 12; // knots

        // Racing
        this.checkpoints = [];
        this.currentCheckpoint = 0;

        // Controls
        this.keys = {};
        this.cameraMode = 0; // 0: follow, 1: chase, 2: overhead

        // Animation
        this.clock = new THREE.Clock();
        this.waveTime = 0;
    }

    init() {
        this.setupScene();
        this.setupLights();
        this.createOcean();
        this.createBoat();
        this.createRaceCourse();
        this.setupControls();
        this.animate();

        // Start button handler
        document.getElementById('startButton').addEventListener('click', () => {
            document.getElementById('instructions').classList.add('hidden');
            document.getElementById('hud').classList.remove('hidden');
            document.getElementById('windIndicator').classList.remove('hidden');
            document.getElementById('controls').classList.remove('hidden');
        });
    }

    setupScene() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 500);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 8, 15);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(50, 50, 50);
        sunLight.castShadow = true;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
    }

    createOcean() {
        // Ocean plane with animated waves
        const oceanGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        const oceanMaterial = new THREE.MeshPhongMaterial({
            color: 0x006994,
            transparent: true,
            opacity: 0.9,
            shininess: 100,
            specular: 0x222222
        });

        this.ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        this.ocean.rotation.x = -Math.PI / 2;
        this.ocean.receiveShadow = true;

        // Store original vertices for wave animation
        this.oceanVertices = [];
        const positions = oceanGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            this.oceanVertices.push({
                x: positions.getX(i),
                y: positions.getY(i),
                z: positions.getZ(i)
            });
        }

        this.scene.add(this.ocean);
    }

    createBoat() {
        this.boat = new THREE.Group();

        // Hull (TP52 style - sleek and low)
        const hullGeometry = new THREE.BoxGeometry(2, 0.8, 8);
        const hullMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
        const hull = new THREE.Mesh(hullGeometry, hullMaterial);

        // Shape the hull to be more boat-like
        const hullShape = new THREE.Shape();
        hullShape.moveTo(-1, -4);
        hullShape.lineTo(-1.2, 0);
        hullShape.lineTo(-0.8, 3);
        hullShape.lineTo(0, 4);
        hullShape.lineTo(0.8, 3);
        hullShape.lineTo(1.2, 0);
        hullShape.lineTo(1, -4);
        hullShape.lineTo(-1, -4);

        const extrudeSettings = {
            depth: 0.8,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 2
        };

        const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
        const hullMesh = new THREE.Mesh(hullGeo, hullMaterial);
        hullMesh.rotation.x = Math.PI / 2;
        hullMesh.rotation.z = Math.PI / 2;
        hullMesh.position.y = -0.4;
        hullMesh.castShadow = true;
        this.boat.add(hullMesh);

        // Deck (white)
        const deckGeometry = new THREE.BoxGeometry(1.8, 0.2, 7.5);
        const deckMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
        const deck = new THREE.Mesh(deckGeometry, deckMaterial);
        deck.position.y = 0.1;
        deck.castShadow = true;
        this.boat.add(deck);

        // Cockpit
        const cockpitGeometry = new THREE.BoxGeometry(1.5, 0.3, 2);
        const cockpitMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpit.position.set(0, 0.1, -1);
        cockpit.castShadow = true;
        this.boat.add(cockpit);

        // Keel (underwater fin)
        const keelGeometry = new THREE.BoxGeometry(0.1, 2, 1);
        const keelMaterial = new THREE.MeshPhongMaterial({ color: 0x0d0d0d });
        const keel = new THREE.Mesh(keelGeometry, keelMaterial);
        keel.position.set(0, -1.4, 0);
        keel.castShadow = true;
        this.boat.add(keel);

        // Mast
        const mastGeometry = new THREE.CylinderGeometry(0.08, 0.1, 12, 8);
        const mastMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const mast = new THREE.Mesh(mastGeometry, mastMaterial);
        mast.position.set(0, 6.2, 0.5);
        mast.castShadow = true;
        this.boat.add(mast);

        // Main sail (mainsail)
        const mainSailGeometry = new THREE.BufferGeometry();
        const mainSailVertices = new Float32Array([
            0, 11.5, 0.5,    // Top of mast
            0, 0.5, 0.5,     // Bottom of mast
            -2, 0.5, -3,     // Boom end
            0, 11.5, 0.5,    // Top of mast
            -2, 0.5, -3,     // Boom end
            -1.5, 11, -2     // Top back corner
        ]);
        mainSailGeometry.setAttribute('position', new THREE.BufferAttribute(mainSailVertices, 3));
        mainSailGeometry.computeVertexNormals();

        const mainSailMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        const mainSail = new THREE.Mesh(mainSailGeometry, mainSailMaterial);
        mainSail.castShadow = true;
        this.boat.add(mainSail);
        this.mainSail = mainSail;

        // Jib (front sail)
        const jibGeometry = new THREE.BufferGeometry();
        const jibVertices = new Float32Array([
            0, 8, 0.5,      // Top of forestay
            0, 0.5, 3.5,    // Bow
            -1.5, 0.5, -1,  // Jib sheet
            0, 8, 0.5,      // Top of forestay
            -1.5, 0.5, -1,  // Jib sheet
            -1, 7.5, -0.5   // Top back corner
        ]);
        jibGeometry.setAttribute('position', new THREE.BufferAttribute(jibVertices, 3));
        jibGeometry.computeVertexNormals();

        const jibMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffee,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        const jib = new THREE.Mesh(jibGeometry, jibMaterial);
        jib.castShadow = true;
        this.boat.add(jib);
        this.jib = jib;

        // Boom
        const boomGeometry = new THREE.CylinderGeometry(0.06, 0.06, 4, 8);
        const boom = new THREE.Mesh(boomGeometry, mastMaterial);
        boom.rotation.z = Math.PI / 2;
        boom.position.set(-1, 0.7, -0.5);
        this.boat.add(boom);
        this.boom = boom;

        // Position boat above water
        this.boat.position.copy(this.boatPosition);
        this.boat.position.y = 0.5;
        this.scene.add(this.boat);
    }

    createRaceCourse() {
        // Create a triangular racing course with buoys
        const buoyPositions = [
            new THREE.Vector3(0, 0, 50),      // Start
            new THREE.Vector3(40, 0, 80),     // Mark 1
            new THREE.Vector3(80, 0, 50),     // Mark 2
            new THREE.Vector3(40, 0, 20),     // Mark 3
            new THREE.Vector3(0, 0, 50)       // Finish
        ];

        buoyPositions.forEach((pos, index) => {
            const buoy = this.createBuoy(index === 0 || index === buoyPositions.length - 1);
            buoy.position.copy(pos);
            this.scene.add(buoy);
            this.buoys.push(buoy);
            this.checkpoints.push(pos);
        });
    }

    createBuoy(isStartFinish = false) {
        const buoy = new THREE.Group();

        // Float
        const floatGeometry = new THREE.SphereGeometry(1, 16, 16);
        const floatMaterial = new THREE.MeshPhongMaterial({
            color: isStartFinish ? 0xff0000 : 0xffaa00
        });
        const float_mesh = new THREE.Mesh(floatGeometry, floatMaterial);
        float_mesh.position.y = 0.5;
        float_mesh.castShadow = true;
        buoy.add(float_mesh);

        // Flag pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 2.5;
        buoy.add(pole);

        // Flag
        const flagGeometry = new THREE.PlaneGeometry(1, 0.7);
        const flagMaterial = new THREE.MeshPhongMaterial({
            color: isStartFinish ? 0xffffff : 0xff0000,
            side: THREE.DoubleSide
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(0.5, 3.8, 0);
        buoy.add(flag);

        return buoy;
    }

    setupControls() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Tack
            if (e.key === ' ') {
                e.preventDefault();
                this.tack();
            }

            // Camera change
            if (e.key.toLowerCase() === 'c') {
                this.cameraMode = (this.cameraMode + 1) % 3;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    tack() {
        // Quick turn to change sailing direction
        const windAngle = this.getWindAngle();
        if (Math.abs(windAngle) < Math.PI / 3) {
            // We're sailing upwind, tack through the wind
            this.boatRotation += windAngle > 0 ? -Math.PI / 2 : Math.PI / 2;
        }
    }

    getWindAngle() {
        // Angle between boat heading and wind direction
        let angle = this.windDirection - this.boatRotation;
        // Normalize to -PI to PI
        while (angle > Math.PI) angle -= Math.PI * 2;
        while (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    }

    updatePhysics(delta) {
        // Steering
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.rudderAngle = Math.min(this.rudderAngle + delta * 2, 0.5);
        } else if (this.keys['d'] || this.keys['arrowright']) {
            this.rudderAngle = Math.max(this.rudderAngle - delta * 2, -0.5);
        } else {
            // Return to center
            this.rudderAngle *= 0.95;
        }

        // Sail trim
        if (this.keys['w'] || this.keys['arrowup']) {
            this.sailTrim = Math.max(this.sailTrim - delta * 0.5, 0);
        } else if (this.keys['s'] || this.keys['arrowdown']) {
            this.sailTrim = Math.min(this.sailTrim + delta * 0.5, 1);
        }

        // Calculate wind effect on sails
        const windAngle = this.getWindAngle();
        const absWindAngle = Math.abs(windAngle);

        // Optimal sailing angle is about 45 degrees off the wind
        let efficiency = 0;
        if (absWindAngle < Math.PI / 6) {
            // Too close to wind (in irons)
            efficiency = 0.1;
        } else if (absWindAngle < Math.PI / 3) {
            // Close hauled
            efficiency = 0.6 + (absWindAngle - Math.PI / 6) / (Math.PI / 6) * 0.3;
        } else if (absWindAngle < Math.PI * 2 / 3) {
            // Beam reach (fastest)
            efficiency = 1.0;
        } else {
            // Running downwind
            efficiency = 0.7;
        }

        // Sail trim affects efficiency
        const optimalTrim = Math.min(absWindAngle / Math.PI, 0.7);
        const trimDiff = Math.abs(this.sailTrim - optimalTrim);
        efficiency *= Math.max(0.3, 1 - trimDiff * 2);

        // Calculate boat speed (in knots)
        const targetSpeed = this.windSpeed * efficiency * 0.4; // TP52s are fast!
        this.boatSpeed += (targetSpeed - this.boatSpeed) * delta * 2;

        // Update heading based on rudder
        this.boatRotation += this.rudderAngle * this.boatSpeed * delta * 0.1;

        // Update position
        const speedMS = this.boatSpeed * 0.514444; // Convert knots to m/s
        this.boatVelocity.x = Math.sin(this.boatRotation) * speedMS;
        this.boatVelocity.z = Math.cos(this.boatRotation) * speedMS;

        this.boatPosition.add(this.boatVelocity.clone().multiplyScalar(delta));

        // Update boat object
        this.boat.position.x = this.boatPosition.x;
        this.boat.position.z = this.boatPosition.z;
        this.boat.rotation.y = -this.boatRotation;

        // Heel (boat tilt) based on wind and speed
        const heelAngle = efficiency * this.boatSpeed * 0.02;
        this.boat.rotation.z = heelAngle * (windAngle > 0 ? 1 : -1);

        // Animate sails based on wind angle
        const sailAngle = Math.sign(windAngle) * Math.min(absWindAngle * 0.5, 0.8) * (1 - this.sailTrim * 0.3);
        this.boom.rotation.y = sailAngle;
        this.mainSail.rotation.y = sailAngle;
        this.jib.rotation.y = sailAngle * 0.8;

        // Bob on waves
        this.boat.position.y = 0.5 + Math.sin(this.waveTime * 2 + this.boatPosition.x * 0.1) * 0.3;
        this.boat.rotation.x = Math.sin(this.waveTime * 1.5 + this.boatPosition.z * 0.1) * 0.05;
    }

    updateOceanWaves(delta) {
        this.waveTime += delta;

        const positions = this.ocean.geometry.attributes.position;
        for (let i = 0; i < this.oceanVertices.length; i++) {
            const v = this.oceanVertices[i];
            const x = v.x;
            const y = v.y;

            const wave1 = Math.sin(x * 0.1 + this.waveTime) * 0.5;
            const wave2 = Math.sin(y * 0.15 + this.waveTime * 0.7) * 0.3;
            const wave3 = Math.sin((x + y) * 0.08 + this.waveTime * 1.3) * 0.4;

            positions.setZ(i, v.z + wave1 + wave2 + wave3);
        }
        positions.needsUpdate = true;
        this.ocean.geometry.computeVertexNormals();
    }

    updateCamera() {
        const boatPos = this.boat.position.clone();

        switch (this.cameraMode) {
            case 0: // Follow cam (behind boat)
                const followDist = 15;
                const followHeight = 8;
                const followAngle = this.boatRotation;
                this.camera.position.x = boatPos.x - Math.sin(followAngle) * followDist;
                this.camera.position.y = boatPos.y + followHeight;
                this.camera.position.z = boatPos.z - Math.cos(followAngle) * followDist;
                this.camera.lookAt(boatPos);
                break;

            case 1: // Chase cam (closer)
                const chaseDist = 10;
                const chaseHeight = 5;
                const chaseAngle = this.boatRotation;
                this.camera.position.x = boatPos.x - Math.sin(chaseAngle) * chaseDist;
                this.camera.position.y = boatPos.y + chaseHeight;
                this.camera.position.z = boatPos.z - Math.cos(chaseAngle) * chaseDist;
                this.camera.lookAt(boatPos);
                break;

            case 2: // Overhead
                this.camera.position.x = boatPos.x;
                this.camera.position.y = boatPos.y + 30;
                this.camera.position.z = boatPos.z + 5;
                this.camera.lookAt(boatPos);
                break;
        }
    }

    checkCheckpoints() {
        if (this.currentCheckpoint >= this.checkpoints.length) return;

        const checkpoint = this.checkpoints[this.currentCheckpoint];
        const distance = this.boatPosition.distanceTo(checkpoint);

        if (distance < 5) {
            this.currentCheckpoint++;

            if (this.currentCheckpoint >= this.checkpoints.length) {
                // Race complete!
                alert('Race Complete! Great sailing!');
                this.currentCheckpoint = 0;
                this.boatPosition.set(0, 0, 0);
            }
        }
    }

    updateHUD() {
        // Speed
        document.getElementById('speed').textContent = this.boatSpeed.toFixed(1) + ' kts';

        // Heading
        let heading = -this.boatRotation * 180 / Math.PI;
        while (heading < 0) heading += 360;
        while (heading >= 360) heading -= 360;
        document.getElementById('heading').textContent = Math.round(heading) + '°';

        // Wind angle
        let windAngle = this.getWindAngle() * 180 / Math.PI;
        document.getElementById('windAngle').textContent = Math.round(windAngle) + '°';

        // Sail trim
        document.getElementById('sailTrim').textContent = Math.round((1 - this.sailTrim) * 100) + '%';

        // Checkpoint
        document.getElementById('checkpoint').textContent =
            `${this.currentCheckpoint + 1}/${this.checkpoints.length}`;

        // Wind indicator
        const windArrow = document.getElementById('windArrow');
        const relativeWind = (this.windDirection - this.boatRotation) * 180 / Math.PI;
        windArrow.style.transform = `rotate(${relativeWind}deg)`;
        windArrow.style.transformOrigin = 'center 50px';
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        this.updatePhysics(delta);
        this.updateOceanWaves(delta);
        this.updateCamera();
        this.checkCheckpoints();
        this.updateHUD();

        // Animate buoys bobbing
        this.buoys.forEach((buoy, index) => {
            buoy.position.y = Math.sin(this.waveTime + index) * 0.3;
            buoy.rotation.z = Math.sin(this.waveTime * 0.7 + index) * 0.1;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new SailboatRacingGame();
    game.init();
});
