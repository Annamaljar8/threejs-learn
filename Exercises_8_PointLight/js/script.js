window.onload = function(){
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

    let ambiColor = "#0c0c0c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);

    let pointColor = "#ccffcc";
    let pointLight = new THREE.PointLight(pointColor);
        pointLight.distance = 100;
        pointLight.position.set(25, 50, 25)
        scene.add(pointLight);

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setClearColor(0xEEEEEE, 1.0);

    let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        scene.add(plane);

    let cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 3);
        scene.add(cube);

    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({color:0x00ff00});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(25, 3, 2);
        scene.add(sphere);

    let sphereLight = new THREE.SphereGeometry(0.3);
    let sphereLightMaterial = new THREE.MeshLambertMaterial({color: 0xac6c25});
    let sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
        sphereLightMesh.position.set(40, 1, 15)
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
        this.distance = 100;
    };

    let gui = new dat.GUI();
        gui.addColor(controls, 'ambientColor').onChange(function(e){
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function(e){
            pointLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'intensity', 0, 3).onChange(function(e){
            pointLight.intensity = e;
        });

        gui.add(controls, 'distance', 0, 100).onChange(function(e){
            pointLight.distance = e;
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

        if (phase > 2 * Math.PI){
            invert = invert * -1;
            phase -+ 2 * Math.PI;
        } else {
            phase += controls.rotationSpeed;
        }

        sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
        sphereLightMesh.position.y = 5;

        if (invert < 0){
            var pivot = 14;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }

        pointLight.position.copy(sphereLightMesh.position);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    render();
};
