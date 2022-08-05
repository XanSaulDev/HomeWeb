import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
//controls

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let controls;

let raycaster;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

const onKeyDown = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;

    case 'Space':
      if ( canJump === true ) velocity.y += 350;
      canJump = false;
      break;

  }

}

const onKeyUp = function ( event ) {

  switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }

}

//create scene
const scene=new THREE.Scene()

//lighting
const ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add(ambientLight);

//create camera
const camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//create renderer
const renderer= new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

//setting pixel ratio
renderer.setPixelRatio(window.devicePixelRatio)

//setting size window
renderer.setSize(window.innerWidth,window.innerHeight)

raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

//move camera backward
camera.position.set(20,5,0)
camera.rotateY(90)
const loader = new GLTFLoader();
loader.load(
  './homeWeb.glb',
  function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
)


controls = new PointerLockControls( camera, document.body )

instructions.addEventListener( 'click', function () {

  controls.lock();

} );

const blocker = document.getElementById( 'blocker' );
controls.addEventListener( 'lock', function () {

  instructions.style.display = 'none';
  blocker.style.display = 'none';

} );

controls.addEventListener( 'unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';

} );

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

scene.add( controls.getObject() );


var clock = new THREE.Clock();
var speed = 2; //units a second
var delta = 0;
function animate(){
  requestAnimationFrame(animate)
  const time = performance.now();

  if ( controls.isLocked === true ) {

    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 10;

    //const intersections = raycaster.intersectObjects( objects, false );

    //const onObject = intersections.length > 0;

    const delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    // if ( onObject === true ) {

    //   velocity.y = Math.max( 0, velocity.y );
    //   canJump = true;

    // }

    controls.moveRight( - velocity.x * delta );
    controls.moveForward( - velocity.z * delta );

    controls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( controls.getObject().position.y < 7
     ) {

      velocity.y = 0;
      controls.getObject().position.y = 7;

      canJump = true;

    }
    prevTime = time;
  }
  //renderer scene and camera
  renderer.render(scene,camera);
}

animate()
console.log("uwu")