import React, {Component} from "react"
import "./App.css";
import { Amongus } from "./components"
import * as THREE from "three";

let scene, camera, renderer, cube, hlight;

class App extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
  }

 init() {
  //creating scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a3b4c);
//0x2a3b4c
  //add camera
  camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth/window.innerHeight
  );

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //document.body.appendChild(renderer.domElement);

  //add geometry
  var geometry = new THREE.BoxGeometry();
  var material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  });
  cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  camera.position.z = 5;
  hlight = new THREE.AmbientLight (0x40400,100);
  scene.add(hlight)
  
  return renderer.domElement
  //animate();
}

//animation
animate() {
  requestAnimationFrame(this.animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

componentDidMount(){
  document.getElementById("Render").appendChild(this.init());
  this.animate();
}

render() {
  return (
     <div id="Render" className="App">
     <Amongus />
     </div>
     );
}
}
export default App;
