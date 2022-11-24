function main() {
  const canvas = document.querySelector(".screen");
  const opacityValue = document.getElementById("opacity");
  const colorValue = document.getElementById("color");
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  const loader = new THREE.TextureLoader();
  const planeLength = 20;
  const wallLength = 30;
  const fov = 99;
  const aspect = 2; // холст по умолчанию
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;
  let inputColor = document.getElementById("color");
  let metalnessInput = document.getElementById("volume");
  let color;

  opacityValue.addEventListener("mousemove", function () {
    opacity = document.getElementById("opacityN");
    opacity.innerText = this.value;
    console.log(this.value);
    torus.material.opacity = this.value;
    dodecahedronMaterial.opacity = this.value;
  });

  colorValue.addEventListener("change", function () {
    color = document.getElementById("colorN");
    color.innerText = this.value;
    const hex = "0x" + this.value.replace("#", "");
    console.log(color);
    torusMaterial.color.setHex(hex);
    dodecahedronMaterial.color.setHex(hex);
  });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x999999);

  {
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  let material = new THREE.MeshStandardMaterial({
    color: 0x00aa88,
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  //Create a DirectionalLight and turn on shadows for the light
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;
  light.position.set(0, 1, 0); //default; light shining from top
  light.castShadow = true; // default false
  scene.add(light);

  canvas.addEventListener("mousemove", (event) => {
    light.position.x = (event.clientX - 500) / 100;
    light.position.z = (event.clientY - 100) / 100;
  });

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  //
  const texture = loader.load("../textures/texture.jpg");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.offset.set(16, 16);

  let planeGeometry = new THREE.PlaneGeometry(
    (3 * planeLength) / 2,
    planeLength,
    1,
    1
  );
  let planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x121abc,
    side: THREE.DoubleSide,
    map: texture,
  });

  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.position.x = 1;
  plane.position.y = -3;
  plane.rotateX(Math.PI * 0.8);
  scene.add(plane);

  //backwall
  let backWallGeometry = new THREE.PlaneGeometry(wallLength, wallLength, 1, 1);
  let wallMaterial = new THREE.MeshPhongMaterial({
    color: 112244,
    side: THREE.DoubleSide,
  });
  let backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
  backWall.receiveShadow = true;
  backWall.position.z = -2;
  backWall.position.x = 1;
  backWall.position.y = 10;
  scene.add(backWall);

  const torusGeometry = new THREE.TorusGeometry(2, 0.1, 4, 100);
  const torusMaterial = new THREE.MeshPhongMaterial({
    color: color,
    metalness: metalnessInput,
  });

  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.x = 0;
  torus.position.y = 0;
  torus.position.z = 0;
  torus.receiveShadow = false;
  torus.castShadow = true;
  torus.rotation.x = Math.PI;
  torus.material.transparent = true;
  scene.add(torus);

  var xDistance = 0.8;
  var zDistance = 0.8;
  let coordinates2 = [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ];

  const dodecahedronGeometry = new THREE.DodecahedronBufferGeometry(0.2, 0);
  const dodecahedronMaterial = new THREE.MeshPhongMaterial({
    color: color,
    transparent: true,
  });

  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 4; j++) {
      const dodecahedron = new THREE.Mesh(
        dodecahedronGeometry,
        dodecahedronMaterial
      );
      dodecahedron.position.y = xDistance * i - 2;
      dodecahedron.position.x = zDistance * j + 3;
      dodecahedron.position.z = 0;
      dodecahedron.receiveShadow = false;
      dodecahedron.castShadow = true;
      if (coordinates2[i][j] === 1) {
        scene.add(dodecahedron);
      } else {
        continue;
      }
    }
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.00033;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
