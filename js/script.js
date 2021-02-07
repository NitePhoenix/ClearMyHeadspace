// declarations for tree
var scene, camera, renderer, geometry, group;

// declarations for sky
var renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 15000;
function init() {

	// start a new scene
	scene = new THREE.Scene();
	/*
	// show axes at the origin, guides
	var axes = new THREE.AxesHelper(10);
	scene.add(axes);
	*/

	/*
	// camera pointing at sky
	camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.z = 1;
	camera.rotation.x = 1.16;
	camera.rotation.y = -0.12;
	camera.rotation.z = 0.27;
	*/

	// camera pointing at tree
	camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 5;

    // scene lighting
	ambient = new THREE.AmbientLight(0x555555);
	// scene.add(ambient);
	directionalLight = new THREE.DirectionalLight(0xffeedd); // represents moon
	directionalLight.position.set(0,0,1);
	scene.add(directionalLight);

	// tree shapes
	boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );
	spheregeometry = new THREE.SphereGeometry( 1 );
	cylindergeometry= new THREE.CylinderGeometry( 10, 10, 1, 20 );

	// tree colours
	var leaveDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x00cc00 } );
	var leaveLightMaterial = new THREE.MeshLambertMaterial( { color: 0x66ff66 } );
	var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x006600 } );
	var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x7D5A4F } );

	// tree parts
	var stem = new THREE.Mesh( boxgeometry, stemMaterial );
	stem.position.set( 0, 0, 0 );
	stem.scale.set( 0.3, 1.5, 0.3 );
	var leaf01 = new THREE.Mesh( spheregeometry, leaveDarkMaterial );
	leaf01.position.set( 0.4, 1.6, 0.5 );
	leaf01.scale.set( 0.8, 0.8, 0.9 );
	var leaf02 = new THREE.Mesh( spheregeometry, leaveDarkMaterial );
	leaf02.position.set( -0.4, 1.3, -0.4 );
	leaf02.scale.set( 0.7, 0.7, 0.7 );
	var leaf03 = new THREE.Mesh( spheregeometry, leaveLightMaterial );
	leaf03.position.set( 0.4, 1.7, -0.5 );
	leaf03.scale.set( 0.7, 0.7, 0.7 );
	var leaf04 = new THREE.Mesh( spheregeometry, leaveDarkMaterial );
	leaf04.position.set( 0, 2, 0 );
	leaf04.scale.set( 0.7, 0.7, 0.7 );
	var leaveDark = new THREE.Mesh( spheregeometry, leaveDarkMaterial );
	leaveDark.position.set( 0, 1.2, 0 );
	leaveDark.scale.set( 0.3, 1, 0.3 );
	var leaveLight = new THREE.Mesh( spheregeometry, leaveLightMaterial );
	leaveLight.position.set( 0, 1.2, 0 );
	leaveLight.scale.set( 0.5, 0.5, 0.5 );
	// ground
	var ground = new THREE.Mesh( cylindergeometry, leaveDarkDarkMaterial );
	ground.position.set( 0, -1, 0 );
	//ground.scale.set( 10, 0.8, 10 ); // ground already scaled

	// group tree parts
	tree = new THREE.Group();
	tree.add( leaveDark );
	tree.add( leaveLight );
	tree.add( leaf01 );
	tree.add( leaf02 );
	tree.add( leaf03 );
	tree.add( leaf04 );
	tree.add( ground );
	tree.add( stem );

	// lil' rotatey
	tree.rotation.y = 1;
	tree.rotation.x = 0.5;

	scene.add( tree );

	// lightning in cloud
	flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
	flash.position.set(200,300,100);
	scene.add(flash);

	renderer = new THREE.WebGLRenderer();
	scene.fog = new THREE.FogExp2(0x11111f, 0.002);
	renderer.setClearColor(scene.fog.color);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// let it rain
	rainGeo = new THREE.Geometry(); // ISSUES IF USING UPDATED THREE.JS LIBRARY BEGIN HERE
	for(let i=0;i<rainCount;i++) {
		rainDrop = new THREE.Vector3(
			Math.random() * 400 -200,
			Math.random() * 500 - 250,
			Math.random() * 400 - 200
			);
		rainDrop.velocity = {};
		rainDrop.velocity = 0;
		rainGeo.vertices.push(rainDrop);
	}
	rainMaterial = new THREE.PointsMaterial({
		color: 0xaaaaaa,
		size: 0.1,
		transparent: true
	});
	rain = new THREE.Points(rainGeo,rainMaterial);
	scene.add(rain);

	// add cloud
	let loader = new THREE.TextureLoader();
	// Change path?
	loader.load("https://www.designer-illusions.com/3d-experiments/rain/smoke.png", function(texture){
		cloudGeo = new THREE.PlaneBufferGeometry(500,500);
		cloudMaterial = new THREE.MeshLambertMaterial({
			map: texture,
			transparent: true
		});
		for(let p=0; p<25; p++) {
			let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
			cloud.position.set( 
				Math.random()*800 -400,
				500,
				Math.random()*500 - 450
				);
			cloud.rotation.x = 1.16;
			cloud.rotation.y = -0.12;
			cloud.rotation.z = Math.random()*360;
			cloud.material.opacity = 0.6;
			cloudParticles.push(cloud);
			scene.add(cloud);
		}
		animate();
	});
} // end init

function animate() {
	cloudParticles.forEach(p => {
		p.rotation.z -=0.002;
	});
	rainGeo.vertices.forEach(p => {
		p.velocity -= 0.1 + Math.random() * 0.1;
		p.y += p.velocity;
		if (p.y < -200) {
			p.y = 200;
			p.velocity = 0;
		}
	});
	rainGeo.verticesNeedUpdate = true;
	rain.rotation.y +=0.002;
	if(Math.random() > 0.93 || flash.power > 100) {
		if(flash.power < 100) 
			flash.position.set(
				Math.random()*400,
				300 + Math.random() *200,
				100
				);
		flash.power = 50 + Math.random() * 500;
	}

  // render my scene
  /*
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  */
  render();
}

function render() {
  requestAnimationFrame( animate );
  // handles rotation of tree
  // tree.rotation.y += 0.007;
  renderer.render( scene, camera );
}

/*
function sunrise(){
	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSV( 0.6, 0.75, 0.5 );
    hemiLight.groundColor.setHSV( 0.095, 0.5, 0.5 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.position.set( -1, 0.75, 1 );
    dirLight.position.multiplyScalar( 50);
    dirLight.name = "dirlight";
    // dirLight.shadowCameraVisible = true;

    scene.add( dirLight );
    render();
}
*/

// handles resizing window
function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// If we use a canvas then we also have to worry of resizing it
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, true);

/*
window.addEventListener("DOMContentLoaded", event => {
  const audio = document.querySelector("audio");
  audio.volume = 0.2;
  audio.play();
});
*/

function question2(form){
	console.log("got it");
	document.getElementById("line1").innerHTML = "Your feelings are valid.";
}


// start!
window.onload = init;

