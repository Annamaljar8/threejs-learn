window.onload = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvas = document.getElementById('canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

    var stats = initStats();

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.x = -20;
        camera.position.y = 25;
        camera.position.z = 20;
        camera.lookAt(new THREE.Vector3(5, 0, 0));
        scene.add(camera);

    //var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    //   scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-40, 60, 10);
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

    var vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1),
    ];
    var faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4),
    ];

    var geom = new THREE.Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();


    var materials = [
        new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
    ];

    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
     mesh.children.forEach(function(e) {e.castShadow = true});
     scene.add(mesh);

//var mesh = THREE.SceneUtils = {

//	createMultiMaterialObject: function ( geom, materials ) {

//		var group = new THREE.Group();

//		for ( var i = 0, l = materials.length; i < l; i ++ ) {

//			group.add( new THREE.Mesh( geometry, materials[ i ] ) );

//		}

//		return group;

//	}
//}



    function addControl(x, y, z){
        var controls = new function(){
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return controls;
    }

    var controlPoints = [];
        controlPoints.push(addControl(3, 5, 3));
        controlPoints.push(addControl(3, 5, 0));
        controlPoints.push(addControl(3, 0, 3));
        controlPoints.push(addControl(3, 0, 0));
        controlPoints.push(addControl(0, 5, 0));
        controlPoints.push(addControl(0, 5, 3));
        controlPoints.push(addControl(0, 0, 0));
        controlPoints.push(addControl(0, 0, 3));

    var gui = new dat.GUI();
        gui.add(new function() {
            this.clone = function(){
                var cloned = mesh.children[0].geometry.clone();
                var materials = [
                    new THREE.MeshLambertMaterial({ opacity:0.6, color: 0xff44ff, transparent: true }),
                    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
                ];
                var mesh2 = THREE.SceneUtils.createMultiMaterialObject(cloned, materials);
                    mesh2.children.forEach(function(e) {e.castShadow = true});
                    mesh2.translateX(5);
                    mesh2.translateZ(5);
                    mesh2.name = "clone";
                    scene.remove(scene.getChildByName("clone"));
                    scene.add(mesh2);
            }
        }, 'clone');

    for (var i = 0; i < 8; i++) {
        var f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);
    }

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

        var vertices = [];
        for (var i = 0; i < 8; i++) {
            vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
        }

        mesh.children.forEach(function(e) {
            e.geometry.vertices = vertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.elementsNeedUpdate = true;
            e.geometry.computeFaceNormals();
        });

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

render();
};
