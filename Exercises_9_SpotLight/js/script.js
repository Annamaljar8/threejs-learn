window.onload = function(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas = document.getElementById('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

    let stopMovingLight = false;

    let stats = initStats();

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(-30, 40, 30);
        camera.lookAt(scene.position);

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setClearColor(0xEEEEEE, 0.1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    let ambiColor = "#1c1c1c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    let target = new THREE.Object3D();
        target.position = new THREE.Vector3(5, 0, 0);

    let pointColor = "#ffffff";
    let spotLight = new THREE.SpotLight(pointColor);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 2;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.camera.fav = 30;
        spotLight.target = target;
        spotLight.distance = 0;
        spotLight.angle = 0.4;
    scene.add(spotLight);


    let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(15, 0, 0);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
    scene.add(plane);

    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        cube.castShadow = true;
    scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 3, 2);
        sphere.castShadow = true;
    scene.add(sphere);

    let sphereLight = new THREE.SphereGeometry(0.2);
    let sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
        sphereLightMesh.castShadow = true;
    scene.add(sphereLightMesh);

    let step = 0;
    let invert = 1;
    let phase = 0;

    let controls = new function(){
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 1;
        this.distance = 0;
        this.exponent = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = "Plane";
        this.stopMovingLight = false;
    };

    let gui = new dat.GUI();
        gui.addColor(controls, 'ambientColor').onChange(function(e){
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function(e){
            spotLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function(e){
            spotLight.angle = e;
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function(e){
            spotLight.intensity = e;
        });

        gui.add(controls, 'distance', 0, 200).onChange(function(e){
            spotLight.distance = e;
        });

        gui.add(controls, 'exponent', 0, 100).onChange(function(e){
            spotLight.exponent = e;
        });

        gui.add(controls, 'debug').onChange(function(e){
            spotLight.shadowCameraVisible = e;
        });

        gui.add(controls, 'castShadow').onChange(function(e){
            spotLight.castShadow = e;
        });

        gui.add(controls, 'onlyShadow').onChange(function(e){
            spotLight.onlyShadow = e;
        });

        gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e){
            console.log(e);
            switch(e){
                case "Plane":
                    spotLight.target = plane;
                    break;
                case "Sphere":
                    spotLight.target = sphere;
                    break;
                case "Cube":
                    spotLight.target = cube;
                    break;
            }
        });

        gui.add(controls, 'stopMovingLight').onChange(function(e){
            stopMovingLight = e;
        });

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

        cube.rotation.x +=controls.rotationSpeed;
        cube.rotation.y +=controls.rotationSpeed;
        cube.rotation.z +=controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        if(!stopMovingLight) {
            if (phase > 2 * Math.PI) {
                invert = invert * -1;
                phase -= 2 * Math.PI;
            } else {
                phase +=controls.rotationSpeed;
            }
            sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 10;

            if (invert < 0) {
                let pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }
            spotLight.position.copy(sphereLightMesh.position);
        }

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    render();
};
