import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { Fog, SpotLightHelper, TextureLoader } from "three";
import orion2 from '../../img/orion2.jpg';
import stars3 from '../../img/stars3.jpg';
import neb from '../../img/neb.jpg';
import texture from '../../img/texture.jpg';

const Template = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    //Data from the canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    scene.add(camera);
    camera.position.set(50, 30, 30);
    camera.lookAt(new THREE.Vector3());

    const renderer = new THREE.WebGLRenderer();

    renderer.shadowMap.enabled = true;

    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    //OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
//create an instance of the orbitControls class and pass the camera and the renderer dom element as arguments
//
    //Resize canvas
    const resize = () => {
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    //add geometry
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
    });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.position.set(0,1,0);

    const planeGeometry = new THREE.PlaneGeometry(30,30);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        side:THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    const gridHelper = new THREE.GridHelper(30);
    scene.add(gridHelper);

    const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x0000FF,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    sphere.position.set(-10,0,0);
    sphere.castShadow = true;

    const gui = new dat.GUI();

    const options = {
        sphereColor:'#ffea00',
        wireframe: false,
        speed: 0.01,
        angle: 0.2,
        penumbra: 0,
        intensity: 1

    };
    gui.addColor(options, 'sphereColor').onChange(function(e){
        sphere.material.color.set(e);
    });

    gui.add(options, 'wireframe').onChange(function(e){
        sphere.material.wireframe = e;

    })
    gui.add(options,'speed', 0, 0.1);
    gui.add(options,'angle', 0, 1);
    gui.add(options,'penumbra', 0, 1);
    gui.add(options,'intensity', 0, 1);

    let step = 0;
    //let speed = 0.01;
    const spotLight = new THREE.SpotLight(0xFFFFFF);
    scene.add(spotLight);
    spotLight.position.set(-100, 100, 0);
    spotLight.castShadow = true;
    spotLight.angle = 0.2;
 
    const sLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(sLightHelper);

    //scene.fog = new Fog(0xFFFFFF, 0, 200);
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

    //renderer.setClearColor(0xFFA0);

		const textureLoader = new THREE.TextureLoader();
		const cubeTextureLoader = new THREE.CubeTextureLoader();

    scene.background = cubeTextureLoader.load([
        orion2,
        orion2,
        stars3,
        stars3,
        texture,
        stars3
    ]);
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  //color: 0x00FF00,
  //map: textureLoader.load(texture)
});

const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(orion2)}),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars3)}),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars3)}),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars3)}),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars3)}),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars3)}),

];
//const box2 = new THREE.Mesh(box2Geometry, box2Material);
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0,5,10);

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
  mousePosition.x = (e.clientX /window.innerrWidth) * 2 - 1;
  mousePosition.y = - (e.clientY /window.innerrHeight) * 2 + 1;

});

const rayCaster = new THREE.Raycaster();
const sphereId = sphere.id;
box2.name = 'theBox';

    //Animate the scene
    const animate = (time) => {
      cube.rotation.x += 0.01;
      cube.rotation.x += 0.01;

      step += options.speed;
      sphere.position.y = 10 * Math.abs(Math.sin(step));
      spotLight.angle = options.angle;

      rayCaster.setFromCamera(mousePosition, camera);
      const intersects = rayCaster.intersectObjects(scene.children);

      console.log(intersects);
      
      for(let i = 0; i < intersects.length; i++) {

        if(intersects[i].object.id === sphereId)
          intersects[i].object.material.color.set(0xFF0000);
        /*
        if(intersects[i].object.name == 'theBox'){
          intersects[i].object.rotation.x += 0.01;;
          intersects[i].object.rotation.y += 0.01;
        }
        */
      }

      orbitControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
/*
    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    );
    scene.add(cube);
    */
    
    //Light

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
/*
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);
    directionalLight.position.set(20, 20, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.bottom = -12;

    const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(dLightHelper);
    
    const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(dLightShadowHelper);
*/


    return () => {
      window.removeEventListener("resize", resize);
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className='Contenedor3D'
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default Template;