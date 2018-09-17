var renderer = null,
scene = null,
camera = null,
root = null,
penguin = null,
group = null,
orbitControls = null,
penguinAnimator = null,
object = null;

var objLoader = null;

var duration = 10; // ms
var currentTime = Date.now();

function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();

    objLoader.load(
        '../models/Penguin/PenguinBaseMesh.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('../models/Penguin/PenguinDiffuseColor.png');

            object.traverse( function ( child )
            {
                if ( child instanceof THREE.Mesh )
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                }
            } );

            penguin = object;
            penguin.scale.set(3,3,3);
            penguin.position.z = 0;
            penguin.position.x = 0;
            penguin.position.y = -4;
            playAnimations();
            scene.add(object);

        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        });
}

function playAnimations() {

    if(penguin)
    {
      //console.log("Hola " + penguin.position.x + "     " + penguin.position.y + "       " +penguin.position.z);
      penguinAnimator = new KF.KeyFrameAnimator;
      penguinAnimator.init({
          interps:
              [
                  {
                      keys:[0, .1666, .3322, 0.4988, .6444, .8, 1],
                      values:[
                              { x : 0, y:-4, z: 0 },
                              { x : -2.7, y:-4, z: -1.5 },
                              { x : -3.1, y:-4, z: -4.5 },
                              { x : 0, y:-4, z: -6.5 },
                              { x : 3.1, y:-4, z: -4.5 },
                              { x : 2.7, y:-4, z: -1.5 },
                              { x : 0, y:-4, z: 0 },
                              ],
                      target:penguin.position
                  },
                  {
                      keys:[0, .1666, .3322, 0.4988, .6444, .8, 1],
                      values:[
                              { y : -1.3 },
                              { y : -2.7 },
                              { y : -4 },
                              { y : -5.3 },
                              { y : -6.6 },
                              { y : -7.3 },
                              { y : -7.6 },
                              ],
                      target:penguin.rotation
                  },
              ],
          loop: true,
          duration:duration * 1000,
          //easing:TWEEN.Easing.Circular.In,
      });
      penguinAnimator.start();
    }

}

function run() {
    requestAnimationFrame(function() { run(); });

        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();

        // Update the camera controller
        orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;

    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "../images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(.5, 0, 3);
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow. camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);

    // Create the objects
    object = new THREE.Object3D;
    loadObj();

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );
}
