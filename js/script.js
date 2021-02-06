var scene,
    camera,
    renderer,
    geometry,
    group;

function init() {
	// gotta shtick it in html somewhere
	/*
	var container1 = document.createElement( 'div' );
	container1.setAttribute("id", "question");
    document.body.appendChild( container1 );

    var container2 = document.createElement( 'div' );
	container2.setAttribute("id", "answer");
    document.body.appendChild( container2 );
    */

	scene = new THREE.Scene();
	// show axes at the origin
	var axes = new THREE.AxesHelper(10);
    scene.add(axes);

  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 10 );
  camera.position.z = 5;

  boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );
  spheregeometry = new THREE.SphereGeometry( 1 );
  cylindergeometry= new THREE.CylinderGeometry( 10, 10, 1, 20 );

  // tree colours
  var leaveDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x00cc00 } );
  var leaveLightMaterial = new THREE.MeshLambertMaterial( { color: 0x66ff66 } );
  var leaveDarkDarkMaterial = new THREE.MeshLambertMaterial( { color: 0x006600 } );
  var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x7D5A4F } );

  //var cloudDarkMaterial = new 

  /*
  var light = new THREE.AmbientLight( 0xc9c9c9 ); // soft white light
  scene.add( light );
  */

  var light = new THREE.DirectionalLight( 0xEEFFD3, 1 );
  light.position.set( 0, 0, 1 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xFF0000, 0.4 );
  light.position.set( 1, 0, 0 );
  scene.add( light );

  var light = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
  light.position.set( 0, 1, 0 );
  scene.add( light );
  

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

  var ground = new THREE.Mesh( cylindergeometry, leaveDarkDarkMaterial );
  ground.position.set( 0, -1, 0 );
  //ground.scale.set( 10, 0.8, 10 ); // ground already scaled

  tree = new THREE.Group();
  tree.add( leaveDark );
  tree.add( leaveLight );
  tree.add( leaf01 );
  tree.add( leaf02 );
  tree.add( leaf03 );
  tree.add( leaf04 );
  tree.add( ground );
  tree.add( stem );

  tree.rotation.y = 1;
  tree.rotation.x = 0.5;

  scene.add( tree );

  renderer =  new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  render();
}

function render() {
  requestAnimationFrame( render );
  // handles rotation
  // tree.rotation.y += 0.007;
  renderer.render( scene, camera );
}

// handles resizing window
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
	// If we use a canvas then we also have to worry of resizing it
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, true);

// start!
window.onload = init;