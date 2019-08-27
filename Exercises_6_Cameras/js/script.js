window.onload = function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas = document.getElementById('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

    let stats = initStats();

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(120, 60, 80);


    let ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        scene.add(directionalLight);

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.shadowMap.enabled = true;

    let planeGeometry = new THREE.PlaneGeometry(180, 180);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);
        scene.add(plane);

        let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        for (let j = 0; j < (planeGeometry.parameters.height / 5); j++) {
            for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
                let rnd = Math.random() * 0.80 + 0.20;
                let cubeMaterial = new THREE.MeshLambertMaterial();
                    cubeMaterial.color = new THREE.Color(1, rnd, 0);
                let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.x = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
                    cube.position.z = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5);
                    cube.position.y = 2;
            scene.add(cube);
        };
    };

    let step = 0;

    let controls = new function() {
        this.perspective = "Perspective";
        this.switchCamera = function() {
            if(camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(width / -16, width / 16, height / -16, height / 16, -200, 500);
                camera.position.set(120, 60, 180);
                camera.lookAt(scene.position);
                this.perspective = "Orthographic";
            } else {
                camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
                camera.position.set(120, 60, 180);
                camera.lookAt(scene.position);
                this.perspective = "Perspective";
            }
        };
    };

    let gui = new dat.GUI();
        gui.add(controls, 'switchCamera');
        gui.add(controls, 'perspective').listen();

    camera.lookAt(scene.position);
    render();

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

    function render(){
        stats.update();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
};
