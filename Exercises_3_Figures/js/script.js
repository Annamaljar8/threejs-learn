window.onload = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvas = document.getElementById('canvas');

    var stats = initStats();


    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);


    var scene = new THREE.Scene();
    scene.fog=new THREE.Fog( 0xffffff, 0.015, 100 );

    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    scene.add(camera);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
       scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var renderer = new THREE.WebGLRenderer({canvas:canvas});
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.shadowMap.enabled = true;

    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5*Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    var step=0;

    var controls = new function() {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = function() {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length-1];
            if (lastObject instanceof THREE.Mesh){
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function() {
            var cubeSize = Math.ceil((Math.random() * 3));
            var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;
            cube.position.x = -30 + Math.round(Math.random() * 60);
            cube.position.y =2 + Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * 40));
            scene.add(cube);

            this.numberOfObjects = scene.children.length;

        }

        this.outputObjects = function() {
                console.log(scene.children);
            }
    }



        var gui = new dat.GUI();
            gui.add(controls, 'rotationSpeed', 0, 0.5);
            gui.add(controls, 'addCube');
            gui.add(controls, 'removeCube');
            gui.add(controls, 'outputObjects');
            gui.add(controls, 'numberOfObjects').listen();

    function initStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        var statsOutput = document.getElementById('stats-output');
        statsOutput.append(stats.domElement);

        return stats;
    }



    function render() {
        stats.update();

        scene.traverse(function(e) {
        if (e instanceof THREE.Mesh && e != plane ) {
            e.rotation.x+=controls.rotationSpeed;
            e.rotation.y+=controls.rotationSpeed;
            e.rotation.z+=controls.rotationSpeed;
            }
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

render();
}
