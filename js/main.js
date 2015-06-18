var init=false, pause_animation=false;
var scene, camera, controls, renderer;

var f1;

function initScene()
{

  // Create scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;

  // Create controls object for mouse control of the scene
  controls = new THREE.OrbitControls( camera );
  
  // Create Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Callbacks, listeners
  document.onkeyup = cb_keyUp;
  window.addEventListener( 'resize', onWindowResize, false );
  
  f1 = Frame.common.unit();
  f1.print();
  
  f2 = Frame.common.unit();
  f2.i[0] = -1;
  f2.print();
  
  var htm = new HTM.createFromTwoFrames(f1, f2);
  htm.print();

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
    initScene();
  }
  
  // Request frame and call controls.update()
  requestAnimationFrame(render);
  controls.update(); 

  // Draw a frame
  f1.draw(scene);

  // Render
  renderer.render( scene, camera );
}
