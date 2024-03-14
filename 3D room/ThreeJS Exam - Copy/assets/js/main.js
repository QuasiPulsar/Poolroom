import * as THREE from './three.module.js';
import { MapControls } from './MapControls.js';
import { GLTFLoader } from './GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x000000);
camera.position.set(-10, 5, 50);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

//Map Controls
const controls = new MapControls(camera, renderer.domElement);
controls.enableDamping = true;
// Particles
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

// Initialize particle positions and velocities
for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random() * 40 - 20; // x
    positions[i3 + 1] = Math.random() * 20; // y
    positions[i3 + 2] = Math.random() * 100 - 20; // z

    // Random initial velocities for particles
    velocities[i3] = (Math.random() - 0.5) * 0.1; // x
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.1; // y
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.1; // z
}

// Set up BufferGeometry and attributes
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Set up particle material
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2
});

// Create particle system
const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// Animation loop to update particle positions
function animateParticles() {
    const positionAttribute = particleGeometry.getAttribute('position');

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 7;

        // Update particle positions based on velocities
        positionAttribute.array[i3] += velocities[i3] * 0.2;
        positionAttribute.array[i3 + 1] += velocities[i3 + 1] * 1;
        positionAttribute.array[i3 + 2] += velocities[i3 + 2] * 0.4;

        // Reset particles if they go out of bounds
        if (positionAttribute.array[i3] > 20 || positionAttribute.array[i3] < -20 ||
            positionAttribute.array[i3 + 1] > 20 || positionAttribute.array[i3 + 1] < 0 ||
            positionAttribute.array[i3 + 2] > 80 || positionAttribute.array[i3 + 2] < -20) {
            positionAttribute.array[i3] = Math.random() * 40 - 20;
            positionAttribute.array[i3 + 1] = Math.random() * 20;
            positionAttribute.array[i3 + 2] = Math.random() * 100 - 20;
        }
    }

    positionAttribute.needsUpdate = true; // Notify Three.js that positions have been updated
}

//Textures
const floorTexture = new THREE.TextureLoader().load('assets/textures/tiles.png');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1, 4);
const wallTexture = new THREE.TextureLoader().load('assets/textures/poolroomtiles.png');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1.5, 1.5);

const wallLightTexture = new THREE.TextureLoader().load('assets/textures/LIGHT.png');
wallLightTexture.wrapS = THREE.RepeatWrapping;
wallLightTexture.wrapT = THREE.RepeatWrapping;
wallLightTexture.repeat.set(0.3, 0.3);

//Lights
const dl = new THREE.DirectionalLight(0x000000, 0);
dl.position.set(5, 20, 10);
//scene.add(dl);

const al = new THREE.AmbientLight(0xa3a3a3, 0);
al.intensity = 0.1; // Adjust as needed

scene.add(al);

const pointLight = new THREE.PointLight(0x000000, 0);
pointLight.position.set(0, 30, 0);
pointLight.intensity = 0.5;

scene.add(pointLight);

// Animate the light intensity
function animateLights() {
    requestAnimationFrame(animateLights);

    // Change the light intensity over time
    const time = performance.now() * 1; // Convert milliseconds to seconds
    const intensity = Math.sin(time) * 2 + 2; // Example animation function
    pointLight.intensity = intensity;
}
animateLights();

//water model
// Load water texture
const waterTexture = new THREE.TextureLoader().load('assets/textures/Water_1_M_Normal.png');

// Create water material
const waterMaterial = new THREE.MeshBasicMaterial({ map: waterTexture });

// Create water geometry
const waterGeometry = new THREE.PlaneGeometry(40, 100);

// Create water mesh

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2; // Rotate to be horizontal
water.position.set(0, -0.5, 0); // Adjust position if necessary
scene.add(water);

water.position.z = 30;


//Floor
const floorGeometry = new THREE.BoxGeometry(10, 1, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
scene.add(floor);


const floorGeometry2 = new THREE.BoxGeometry(10, 1, 100);
const floorMaterial2 = new THREE.MeshBasicMaterial({ map: floorTexture });
const floor2 = new THREE.Mesh(floorGeometry2, floorMaterial2);
floor.receiveShadow = true;
scene.add(floor2);

floor.position.x = -10.5;
floor.position.y = 0;
floor.position.z = 30;
floor2.position.x = 10.5;
floor2.position.y = 0;
floor2.position.z = 30;

//Walls
const wallGeometry = new THREE.BoxGeometry(1, 20, 170);
const wallGeometry2 = new THREE.BoxGeometry(40, 30, 1);


//Wall3
const wallGeometry3 = new THREE.BoxGeometry(1, 5, 120); //bottom half of the wall
const wallGeometry3T = new THREE.BoxGeometry(1, 5, 120); //top half of the wall


const wallGeometry3side1 = new THREE.BoxGeometry(1, 15, 20); //wall segment 1

const wallGeometry3side2 = new THREE.BoxGeometry(1, 15, 20); //wall segment 2

const wallGeometryLight = new THREE.BoxGeometry(1, 15, 120);

const wallGeometryLighttop = new THREE.BoxGeometry(45, 1, 120);

const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });
const wallMaterialLight = new THREE.MeshBasicMaterial({ map: wallLightTexture });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
const wall2 = new THREE.Mesh(wallGeometry2, wallMaterial);

//wall 3
const wall3 = new THREE.Mesh(wallGeometry3, wallMaterial);
const wall3top = new THREE.Mesh(wallGeometry3T, wallMaterial);
const wall3side1 = new THREE.Mesh(wallGeometry3side1, wallMaterial);
const wall3side2 = new THREE.Mesh(wallGeometry3side1, wallMaterial);
const wall3side3 = new THREE.Mesh(wallGeometry3side1, wallMaterial);
const wall3side4 = new THREE.Mesh(wallGeometry3side1, wallMaterial);
const wall3side5 = new THREE.Mesh(wallGeometry3side2, wallMaterial);


//Top wall left and right
const wallGeometryTop = new THREE.BoxGeometry(25, 1, 120);

const wallTopR = new THREE.Mesh(wallGeometryTop, wallMaterial);
const wallTopL = new THREE.Mesh(wallGeometryTop, wallMaterial);
scene.add(wallTopR);
scene.add(wallTopL);

//light source side
const walllight = new THREE.Mesh(wallGeometryLight, wallMaterialLight);
const walllighttop = new THREE.Mesh(wallGeometryLighttop, wallMaterialLight);
//light source top



//back wall
const wallback = new THREE.Mesh(wallGeometry2, wallMaterial);

scene.add(wall);
scene.add(wall2);//front
scene.add(wallback);//back

//window side
scene.add(wall3);
scene.add(wall3top);
scene.add(wall3side1);
scene.add(wall3side2);
scene.add(wall3side3);
scene.add(wall3side4);
scene.add(wall3side5);

scene.add(walllight);
scene.add(walllighttop);
//Wall adjustments
wall.position.x = -20.5;
wall.position.y = 9.5;
wall.position.z = 65;
wall2.position.y = 9.5;
wall2.position.z = -20.5;

//windowed walls
wall3.position.x = 20.5;
wall3.position.y = 2; //bottom side of the wall
wall3.position.z = 25;

wall3top.position.y = 17;
wall3top.position.z = 25;
wall3top.position.x = 20;

wall3side1.position.y = 10;
wall3side1.position.z = -10;
wall3side1.position.x = 20;

wall3side2.position.y = 10;
wall3side2.position.z = 15;
wall3side2.position.x = 20;

wall3side3.position.y = 10;
wall3side3.position.z = 40;
wall3side3.position.x = 20;

wall3side4.position.y = 10;
wall3side4.position.z = 65;
wall3side4.position.x = 20;

//full wall

wall3side5.position.y = 10;
wall3side5.position.z = 90;
wall3side5.position.x = 20;
//wall thta functions as light
walllight.position.y = 10;
walllight.position.z = 50;
walllight.position.x = 21;
walllighttop.position.y = 21;
walllighttop.position.z = 40;
//back wall
wallback.position.y = 9.5;
wallback.position.z = 80.5;
//top wall
wallTopR.position.y = 20;
wallTopR.position.z = 40;
wallTopR.position.x = 15;

wallTopL.position.y = 20;
wallTopL.position.z = 40;
wallTopL.position.x = -15;
//Door
const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const cylinder = new THREE.Mesh(geometry, material);
scene.add(cylinder);
cylinder.rotation.x = Math.PI / 2;

cylinder.position.x = -10.5;
cylinder.position.y = 0;
cylinder.position.z = -28;
// Enable shadow casting for wall meshes
wall.castShadow = true;
wall2.castShadow = true;
wallback.castShadow = true;
wall3.castShadow = true;
// Configure renderer for shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
// Create PointLights for walllight and walllighttop
const wallLight = new THREE.PointLight(0xffffff, 0.2, 100);
wallLight.position.copy(walllight.position);
scene.add(wallLight);

const wallLightTop = new THREE.PointLight(0xffffff, 0.2, 100);
wallLightTop.position.copy(walllighttop.position);
scene.add(wallLightTop);
// Adjust the intensity and color of the ambient light (al)
al.intensity = 0.5; // Adjust ambient light intensity
al.color.set(0x404040); // Adjust ambient light color



// Adjust the intensity and color of the point lights (wallLight and wallLightTop)
wallLight.intensity = 0.2; // Increase the intensity value as needed
wallLight.color.set(0xffffff); // Set the color to white or another color of your choice

wallLightTop.intensity = 2; // Increase the intensity value as needed
wallLightTop.color.set(0xffffff); // Set the color to white or another color of your choice

/*dl.castShadow = true;
dl.shadow.mapSize.width = 1024; // Shadow map width (adjust as needed)
dl.shadow.mapSize.height = 1024; // Shadow map height (adjust as needed)
dl.shadow.camera.near = 0.5; // Near plane of the shadow camera
dl.shadow.camera.far = 500; // Far plane of the shadow camera
dl.shadow.camera.left = -100; // Left plane of the shadow camera
dl.shadow.camera.right = 100; // Right plane of the shadow camera
dl.shadow.camera.top = 100; // Top plane of the shadow camera
dl.shadow.camera.bottom = -100; // Bottom plane of the shadow camera
dl.shadow.bias = -0.001
*/


// Update the rendering loop to include the dynamic lights
function animate() {
    requestAnimationFrame(animate);
    controls.update();
	animateParticles();
    renderer.render(scene, camera);
    // Optionally, update other dynamic elements or interactions here.
}
animate();
