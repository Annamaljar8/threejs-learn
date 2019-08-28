window.onload = function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvas = document.getElementById('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    let stats = initStats();

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(-30, 30, 70);
        camera.lookAt(new THREE.Vector3(10, 0, 0))

    let ambiColor = "#0c0c0c";
    let ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, -10);
        spotLight.castShadow = true;
        scene.add(spotLight);

    let renderer = new THREE.WebGLRenderer({canvas:canvas});
        renderer.setClearColor(0xEEEEEE, 1.0);
        renderer.shadowMap.enabled = true;

    let planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        plane.receiveShadow = true;
        scene.add(plane);

    let coneGeometry = new THREE.ConeGeometry(5, 20, 32);
    let coneMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    let cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(-4, 10, 2);
        cone.castShadow = true;
        scene.add(cone);

    let cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
    let cylimderMaterial = new THREE.MeshLambertMaterial({color:0x0000ff});
    let cylinder = new THREE.Mesh(cylinderGeometry, cylimderMaterial);
        cylinder.position.set(20, 5, 0);
        cylinder.castShadow = true;
        scene.add(cylinder);

    let step = 0;

    let controls = new function(){
        this.rotationSpeed = 0.02;
        this.boucingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.disableSpotlight = false;
    };

    let gui = new dat.GUI();
        gui.addColor(controls, 'ambientColor').onChange(function(e){
            ambientLight.color = new THREE.Color(e);
        });
        gui.add(controls, 'disableSpotlight').onChange(function(e){
            spotLight.visible = !e;
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

        cone.rotation.x += controls.rotationSpeed;
        cone.rotation.y += controls.rotationSpeed;
        cone.rotation.z += controls.rotationSpeed;

        step +=controls.boucingSpeed;
        cylinder.position.x = 20 + (10 * (Math.cos(step)));
        cylinder.position.y = 10 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };
    render();
};
