



var init=false, pause_animation=false;
var scene, camera, controls, renderer;

var A, B, c;


initScene();


function initScene()
{

  // Create scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.up = new THREE.Vector3(0,1,0);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;
  
  // Create Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Create controls object for mouse control of the scene
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  // Callbacks, listeners
  document.onkeyup = cb_keyUp;
  window.addEventListener( 'resize', onWindowResize, false );
  
  A = Frame.common.unit();
  A.print();
  //A.selfRotation([0,0,1], 0.7854);
  //A.selfRotation([0,0,1], 0.23);
  
  scene.add(A.i_arrow);
  scene.add(A.j_arrow);
  scene.add(A.k_arrow);

  /*B = Frame.common.rand();
  B.print();
  
  scene.add(B.i_arrow);
  scene.add(B.j_arrow);
  scene.add(B.k_arrow);*/
  
  /*var htm = new HTM.createFromTwoFrames(A, B);
  console.log("Initial HTM: ");
  htm.print();
  htm.print();*/

  // Set init flag
  init = true;

  // Call render
  render();
}



function cb_keyUp(event)
{
  // Space bar
  if (event.keyCode == 32)
  {
    pause_animation = !pause_animation;
    console.log("Toggled the animation, status: "+ (pause_animation ? "Not animating" : "Animating"));
  }
}


function onWindowResize()
{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();
}


function render() 
{
  if(!init)
  {
    console.log("Calling initScene");
    initScene();
  }
  
  // Request frame and call controls.update()
  requestAnimationFrame(render);
  controls.update(); 


  // Draw a frame
  //A.draw(scene);
  //scene.add(A.i_arrow);
  //console.log(A.i_arrow);

  c = new vec3.fromValues(0.001, 0, 0);
  //A.selfRotation(c, 0.05);
  //c = new vec3.fromValues(0.005,0,0);
  A.selfTranslate(c);
  //A.updateAxes();
  A.updateMesh();
  //B.updateMesh();

  // Render
  renderer.render( scene, camera );
}
