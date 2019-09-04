window.onload = function(){
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas = document.getElementById('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

    let stats = initStats();

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(-35, 30, 25);
        camera.lookAt(new THREE.Vector3(10, 0, 0));

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setClearColor(0xEEEEEE, 0.1);
        renderer.shadowMap.enabled = true;

    let planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(15, -5, 0);
        plane.rotation.x = -0.5 * Math.PI;
        plane.receiveShadow = true;
    scene.add(plane);

    let ambiColor = "#1c1c1c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    let target = new THREE.Object3D();
        target.position = new THREE.Vector3(5, 0, 0);

    let pointColor = "#ff5808";
    let directionalLight = new THREE.DirectionalLight(pointColor);
        directionalLight.position.set(-40, 60, -10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 2;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
    scene.add(directionalLight);

    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.position.set(-4, 3, 0);
    scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 4, 2);
        sphere.castShadow = true;
    scene.add(sphere);

    let sphereLight = new THREE.SphereGeometry(0.1);
    let sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25});
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
        this.intensity = 0.5;
        this.distance = 0;
        this.exponent = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = "Plane";
    };

    let gui = new dat.GUI();
        gui.addColor(controls, 'ambientColor').onChange(function(e){
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function(e){
            directionalLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 5).onChange(function(e){
            directionalLight.intensity = e;
        });

        gui.add(controls, 'distance', 0, 200).onChange(function(e){
            directionalLight.distance = e;
        });

        gui.add(controls, 'castShadow').onChange(function(e){
            directionalLight.castShadow = e;
        });

        gui.add(controls, 'onlyShadow').onChange(function(e){
            directionalLight.onlyShadow = e;
        });

        gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function(e){
            console.log(e);
            switch(e){
                case "Plane":
                    directionalLight.target = plane;
                    break;
                case "Sphere":
                    directionalLight.target = sphere;
                    break;
                case "Cube":
                    directionalLight.target = cube;
                    break;
            }
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

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = -2 + (10 * Math.abs(Math.sin(step)));

        sphereLightMesh.position.z = -8;
        sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
        sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

        directionalLight.position.copy(sphereLightMesh.position);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    render();

};
