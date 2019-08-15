window.onload = function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas = document.getElementById('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

    let stats = initStats();

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(-30, 40, 30);
        camera.lookAt(scene.position);

    let controller = cameraControl();

    let ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, 20);
        spotLight.castShadow = true;
    scene.add(spotLight);

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.shadowMap.enabled = true;

    let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
    scene.add(plane);

    let step = 0;

    let controls = new function(){
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 4;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;

        this.translate = function(){
            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);

            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;
        };
    };

    let geom = new THREE.BoxGeometry(5, 8, 3);
    let material = new THREE.MeshLambertMaterial({color: 0x44ff44});
    let cube = new THREE.Mesh(geom, material);
        cube.position.y = 4;
        cube.castShadow = true;
        scene.add(cube);

    let gui = new dat.GUI();

    guiScale = gui.addFolder('scale');
    guiScale.add(controls, 'scaleX', 0, 5);
    guiScale.add(controls, 'scaleY', 0, 5);
    guiScale.add(controls, 'scaleZ', 0, 5);

    guiPosition = gui.addFolder('position');
    let contX = guiPosition.add(controls, 'positionX', -10, 10);
    let contY = guiPosition.add(controls, 'positionY', -4, 20);
    let contZ = guiPosition.add(controls, 'positionZ', -10, 10);

    contX.listen();
    contX.onChange(function (value) {
        cube.position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange(function (value) {
        cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange(function (value) {
        cube.position.z = controls.positionZ;
    });

    guiRotation = gui.addFolder('rotation');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    guiTranslate = gui.addFolder('translate');
    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    gui.add(controls, 'visible');

    function initStats(){
        let stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            stats.domElement.style.left = '0px';

        let statsOutput = document.getElementById('stats-output');
            statsOutput.append(stats.domElement);

        return stats;
    };

    function cameraControl(){
        let controller = new THREE.OrbitControls(camera, render.domElement);
            controller.target = new THREE.Vector3(0, 0, 0);
    };

    function render(){
        stats.update();

        cube.visible = controls.visible;

        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;

        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    render();
}
