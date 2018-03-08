// ### DEFINES ###
const CARDDATA = [
  { img: "sc2.png", url: "http://www.starcraft.com" },
  { img: "wow.jpg", url: "http://www.worldofwarcraft.com" },
  { img: "mc.jpg", url: "http://www.minecraft.com" },
  { img: "lol.png", url: "http://www.leagueoflegends.com" },
  { img: "wot.png", url: "http://www.worldoftanks.com" },
  { img: "d3.jpg", url: "http://www.diablo3.com" },
  { img: "gundam.png", url: "https://g-versus.ggame.jp/" },
  { img: "sf.png", url: "http://streetfighter.com/" },
  { img: "mh.gif", url: "http://www.monsterhunter.com/" },
  { img: "nfs.gif", url: "https://www.ea.com/games/need-for-speed/need-for-speed-payback" },
  { img: "sc2.png", url: "http://www.starcraft.com" },
  { img: "wow.jpg", url: "http://www.worldofwarcraft.com" },
  { img: "mc.jpg", url: "http://www.minecraft.com" },
  { img: "lol.png", url: "http://www.leagueoflegends.com" },
  { img: "wot.png", url: "http://www.worldoftanks.com" },
  { img: "d3.jpg", url: "http://www.diablo3.com" },
  { img: "gundam.png", url: "https://g-versus.ggame.jp/" },
  { img: "sf.png", url: "http://streetfighter.com/" },
  { img: "mh.gif", url: "http://www.monsterhunter.com/" },
  { img: "nfs.gif", url: "https://www.ea.com/games/need-for-speed/need-for-speed-payback" }
]

const ROTATESPEED = 0.001;
const ROTATEDECAY = 0.99;
const ROTATEACCEL = 0.001;
const EASESPEED = 0.003;
const TRACKSPEED = 0.01
const FLOAT_PRECISION = 0.000001;
const TRACK_PRECISION = TRACKSPEED * 0.01;
const CARD_FACING_SELECTOR = 0.9;

const CAMERALOOKYOFFSET = 250;

const CARDCENTERX = 0;
const CARDCENTERY = -400;
const CARDCENTERZ = -2000;
const CARDZOFFSET = 800;
const CARDMAXOFFSET = CARDCENTERZ - CARDZOFFSET;
const CARDMINOFFSET = CARDCENTERZ + CARDZOFFSET;

const CARDWIDTH = 30;
const CARDHEIGHT = 45;
const CARDDEPTH = 1;
const CARDSCALEMAX = 5.0;
const CARDPOWER = Math.floor(CARDDATA.length / 2);
const CARDLENGTH = Math.pow(CARDMAXOFFSET - CARDMINOFFSET, CARDPOWER);

const LOGOPATH = 'logo.png';
const LOGOWIDTH = 600;
const LOGOHEIGHT = 600;
const LOGOOFFSET = 400;
const LOGOBOUNCERANGE = 20;
const LOGOBOUNCESPEED = 0.02;
const LOGOCENTERX = CARDCENTERX;
const LOGOCENTERY = CARDCENTERY + LOGOOFFSET;
const LOGOCENTERZ = CARDCENTERZ;
const REFLECTIONOFFSET = -800;
const REFLECTIONOPACITY = 0.33;

const BGPATH = 'bg00.jpg';

const BARPATH = 'bar.png';
const BARSCROLLSPEED = 0.0004;
const BARANGLE = Math.PI / 4;

const SPINNER1PATH = 'circle01.png';
const SPINNER1WIDTH = CARDZOFFSET * 2.05;
const SPINNER1HEIGHT = CARDZOFFSET * 2.05;
const SPINNER1DEPTH = 0;
const SPINNER1CENTERX = 0;
const SPINNER1CENTERY = CARDCENTERY - 1;
const SPINNER1CENTERZ = CARDCENTERZ;
const SPINNER1ROTATESPEED = -0.02;

const SPINNER2PATH = 'circle02.png';
const SPINNER2WIDTH = CARDZOFFSET * 2.05;
const SPINNER2HEIGHT = CARDZOFFSET * 2.05;
const SPINNER2DEPTH = 0;
const SPINNER2CENTERX = 0;
const SPINNER2CENTERY = CARDCENTERY - 1 - 0.0001;
const SPINNER2CENTERZ = CARDCENTERZ;
const SPINNER2ROTATESPEED = 0.01;

const SPINNER3PATH = 'circle02.png';
const SPINNER3WIDTH = CARDZOFFSET * 2.25;
const SPINNER3HEIGHT = CARDZOFFSET * 2.25;
const SPINNER3DEPTH = 0;
const SPINNER3CENTERX = 0;
const SPINNER3CENTERY = CARDCENTERY - 1 - 100;
const SPINNER3CENTERZ = CARDCENTERZ;
const SPINNER3ROTATESPEED = 0.01;
// ### END DEFINES ###

// Set the scene size.
const WIDTH = 1024;
const HEIGHT = 768;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

const global = [];
var loader = new THREE.TextureLoader();
global.cardBounds = (Math.PI * 2) / CARDDATA.length; //How many RADs between each card
global.frameCounter = Number.MIN_VALUE;
global.rotate = 0;
global.rotationSpeed = 0;

var clock = new THREE.Clock();

initScene();
initBg();
initLights();
initSpinners();
initLogo();
global.centerPoint = initCardCenter(CARDCENTERX, CARDCENTERY, CARDCENTERZ);
global.pivots = initPivots(CARDDATA.length);
global.cards = initCards(CARDDATA.length);

document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);

// Start animating
update();

function initScene() {
  // Get the DOM element to attach to
  const container = document.getElementById('container');

  // Create a WebGL renderer, camera
  // and a scene
  global.renderer = new THREE.WebGLRenderer({ antialias: false });
  global.camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR
    );

  global.renderer.autoClear = false;

  global.camera.lookAt(new THREE.Vector3(CARDCENTERX, CARDCENTERY + CAMERALOOKYOFFSET, CARDCENTERZ));

  global.scene = new THREE.Scene();

  // Add the camera to the scene.
  global.scene.add(global.camera);

  // Start the renderer.
  global.renderer.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.
  container.appendChild(global.renderer.domElement);
}

function initBg() {
  // Create the background scene
  global.bgScene = new THREE.Scene();
  global.bgCamera = new THREE.Camera();

  global.bgScene.add(global.bgCamera);

  loader.load(
    BGPATH, function (texture) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        depthTest: false,
        depthWrite: false
      });

      var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        material);

      global.bgScene.add(plane);
    }
  )
}

function initCardCenter(x, y, z) {
  var centerPoint = new THREE.Object3D();
  centerPoint.position.x = x;
  centerPoint.position.y = y;
  centerPoint.position.z = z;
  global.scene.add(centerPoint);
  return centerPoint;
}

function initPivots(count) {
  var pivots = [];

  for (var i = 0; i < count; i++) {
    var pivot = new THREE.Object3D();
    pivot.rotation.y = (i * 2 * Math.PI) / count;
    global.centerPoint.add(pivot);
    pivots.push(pivot);
  }

  return pivots;
}

function initCards(count) {
  var cards = [];

  for (var i = 0; i < count; i++) {
    var card = createCard(i);
    global.pivots[i].add(card);
    cards.push(card);
  }

  return cards;
}

function createCard(cardID) {
  var cardTexture = loader.load(CARDDATA[cardID].img);
  var cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });

  var card = new THREE.Mesh(
    new THREE.BoxGeometry(CARDWIDTH, CARDHEIGHT, CARDDEPTH),
    cardMaterial
  );

  card.ID = cardID;
  card.position.z = CARDZOFFSET;

  card.callback = function () {
    window.open(CARDDATA[cardID].url, "_self")
  }

  return card;
}

function initLogo() {
  loader.load(
    LOGOPATH, function (texture) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true
      });

      // texture.anisotropy = 0;
      // texture.magFilter = THREE.NearestFilter;
      // texture.minFilter = THREE.NearestFilter;

      var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(LOGOWIDTH, LOGOHEIGHT),
        material)

      plane.position.x = LOGOCENTERX;
      plane.position.y = LOGOCENTERY;
      plane.position.z = LOGOCENTERZ;

      plane.rotation.x = global.camera.rotation.x;

      global.scene.add(plane)
      global.logo = plane;
      global.logoAnim = new TextureAnimator(texture, 10, 10, 100, 75 ); // texture, #horiz, #vert, #total, duration.

      reflectionMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        side: THREE.BackSide
      });

      var reflection = new THREE.Mesh(
        new THREE.PlaneGeometry(LOGOWIDTH, LOGOHEIGHT),
        reflectionMaterial)

      reflection.position.x = LOGOCENTERX;
      reflection.position.y = LOGOCENTERY + REFLECTIONOFFSET;
      reflection.position.z = LOGOCENTERZ;

      reflectionMaterial.opacity = REFLECTIONOPACITY;

      reflection.rotation.x = global.camera.rotation.x;
      reflection.scale.set(1, -1, 1);

      global.scene.add(reflection);
      global.reflection = reflection;
    }
  )
}

function initLights() {
  // create a point light
  const pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  global.scene.add(pointLight);
}

function initSpinners() {
  //For Spinner 1
  loader.load(
    SPINNER1PATH, function (texture) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true
      });

      texture.anisotropy = 0;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      var spinner = new THREE.Mesh(
        new THREE.PlaneGeometry(SPINNER1WIDTH, SPINNER1HEIGHT),
        material)

      spinner.position.x = SPINNER1CENTERX;
      spinner.position.y = SPINNER1CENTERY;
      spinner.position.z = SPINNER1CENTERZ;
      spinner.rotation.x = Math.PI / -2;

      global.spinner1 = spinner;
      global.scene.add(spinner);
    }
  )

  //For Spinner 2
  loader.load(
    SPINNER2PATH, function (texture) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true
      });

      texture.anisotropy = 0;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      var spinner = new THREE.Mesh(
        new THREE.PlaneGeometry(SPINNER2WIDTH, SPINNER2HEIGHT),
        material)

      spinner.position.x = SPINNER2CENTERX;
      spinner.position.y = SPINNER2CENTERY;
      spinner.position.z = SPINNER2CENTERZ;
      spinner.rotation.x = Math.PI / -2;

      global.spinner2 = spinner;
      global.scene.add(spinner);
    }
  )

  //For Spinner 3
  loader.load(
    SPINNER3PATH, function (texture) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: true
      });

      texture.anisotropy = 0;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      var spinner = new THREE.Mesh(
        new THREE.PlaneGeometry(SPINNER3WIDTH, SPINNER3HEIGHT),
        material)

      spinner.position.x = SPINNER3CENTERX;
      spinner.position.y = SPINNER3CENTERY;
      spinner.position.z = SPINNER3CENTERZ;
      spinner.rotation.x = Math.PI / -2;

      global.spinner3 = spinner;
      global.scene.add(spinner);
    }
  )

  //For Spinner Bar
  loader.load(
    BARPATH, function (texture) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        depthTest: true,
        depthWrite: false,
        transparent: true
      });

      texture.anisotropy = 0;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      global.barTex = texture;

      var plane1 = new THREE.Mesh(
        new THREE.PlaneGeometry(2550.0, 100.0, 0),
        material);

      var plane2 = new THREE.Mesh(
        new THREE.PlaneGeometry(2550.0, 100.0, 0),
        material);

      global.scene.add(plane1);
      global.scene.add(plane2);

      plane1.position.x = -(CARDZOFFSET + 100);
      plane2.position.x = CARDZOFFSET + 100;

      plane1.position.y = (CARDCENTERY / 4) - 75;
      plane2.position.y = (CARDCENTERY / 4) - 75;

      plane1.position.z = CARDCENTERZ * 2;
      plane2.position.z = CARDCENTERZ * 2;

      plane1.rotation.y = BARANGLE;
      plane2.rotation.y = -BARANGLE;
    }
  )
}

function scaleCards() {
  global.scene.updateMatrixWorld();
  for (var i = 0; i < CARDDATA.length; i++) {
    var pos = Math.pow(-global.cards[i].matrixWorld.elements[14] + CARDMAXOFFSET, CARDPOWER); //z position
    var scaleAmount = Math.max(CARDSCALEMAX * (pos / CARDLENGTH), 1)
    global.cards[i].scale.set(scaleAmount, scaleAmount, scaleAmount)
    //y position, for scaling the cards upwads only
    global.cards[i].position.y = (scaleAmount * (CARDHEIGHT * 0.5))
  }
}

function rotateSpinners() {
  if (global.spinner1 == undefined || global.spinner2 == undefined || global.spinner3 == undefined)
    return;

  global.spinner1.rotation.z += SPINNER1ROTATESPEED;
  global.spinner2.rotation.z += SPINNER2ROTATESPEED;
  global.spinner3.rotation.z += SPINNER3ROTATESPEED;
}

function easeToCard() {
  var toAdd = 0;
  var distance = ((Math.abs(global.centerPoint.rotation.y) / global.cardBounds) % 1);
  var distanceToMove = distance * global.cardBounds

  if (distance < FLOAT_PRECISION ||
    distance > 1 - FLOAT_PRECISION) {
    return;
  }

  if (distance > 0.5) {
    if (distanceToMove <= EASESPEED) {
      toAdd = 1 - distanceToMove;
    } else {
      toAdd = EASESPEED;
    }
  } else { //distance < 0.5
    if (distanceToMove <= EASESPEED) {
      toAdd = -distanceToMove;
    } else {
      toAdd = -EASESPEED;
    }
  }

  if (global.centerPoint.rotation.y < 0) {
    toAdd = -toAdd;
  }

  global.centerPoint.rotation.y += toAdd;
}

function updateLogo() {
  if (global.logo == undefined || global.reflection == undefined)
    return;

  var bounce = (Math.sin(global.frameCounter * LOGOBOUNCESPEED) * LOGOBOUNCERANGE);

  global.logo.position.y = LOGOCENTERY + bounce;
  global.reflection.position.y = (LOGOCENTERY + REFLECTIONOFFSET) - bounce;
}

function trackCard(cardID) {
  var matrix = new THREE.Matrix4();
  matrix.extractRotation(global.cards[cardID].matrixWorld);

  var direction = new THREE.Vector3(0, 0, 1);
  direction.applyMatrix4(matrix);

  var distance = ((direction.z - 1) * 0.5) * -Math.PI;

  if (distance >= TRACK_PRECISION) {
    if (direction.x < 0) {
      global.centerPoint.rotation.y += TRACKSPEED;
    }
    else {
      global.centerPoint.rotation.y -= TRACKSPEED;
    }
  } else if (distance < TRACKSPEED) {
    global.trackingCard = false;
  }
}

function update() {
  var delta = clock.getDelta();

  global.frameCounter += 1;

  if (global.trackingCard == true) {
    trackCard(global.trackCardID)
  } else if (global.mouseDown == false &&
    global.rotate < EASESPEED &&
    global.rotate > -EASESPEED) {
    easeToCard();
  } else if (global.centerPoint != undefined && global.rotate != 0) {
    global.centerPoint.rotation.y += global.rotate;
    if (global.mouseDown == true) {
      global.rotate = 0;
    } else {
      global.rotate = global.rotate * ROTATEDECAY;
    }
  }

  updateLogo();
  rotateSpinners();
  scaleCards();

  if (global.logoAnim != null) {
    global.logoAnim.update(delta * 1000);
  }

  if (global.barTex != null) {
    global.barTex.offset.x += BARSCROLLSPEED;
  }

  global.renderer.clear();
  global.renderer.render(global.bgScene, global.bgCamera);
  global.renderer.render(global.scene, global.camera);

  requestAnimationFrame(update);
}

function onMouseMove(event) {
  if (global.mouseDown) { //Mouse1 pressed
    global.rotate += ROTATESPEED * event.movementX;
  }
}

//Used for raycasting onMouseDown
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseDown(event) {
  event.preventDefault();

  if ((event.buttons & 1) == true) {
    global.mouseDown = true;
    global.trackingCard = false;
    global.rotate = 0;

    var rect = global.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    raycaster.setFromCamera(mouse, global.camera);
    var intersects = raycaster.intersectObjects(global.cards, true);

    if (intersects.length > 0) {
      global.mouseDown = false

      var matrix = new THREE.Matrix4();
      matrix.extractRotation(intersects[0].object.matrixWorld);

      var direction = new THREE.Vector3(0, 0, 1);
      direction.applyMatrix4(matrix);

      if (direction.z > CARD_FACING_SELECTOR) {
        intersects[0].object.callback();
      } else {
        global.trackingCard = true;
        global.trackCardID = intersects[0].object.ID;
      }
    }
  }
}

function onMouseUp(event) {
  event.preventDefault();

  if ((event.buttons & 1) == false) {
    global.mouseDown = false;
  }
}

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
  // note: texture passed by reference, will be updated by the update function.
  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;
  // how long has the current image been displayed?
  this.currentDisplayTime = 0;
  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function (milliSec) {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles)
        this.currentTile = 0;
      var currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = 1 - (currentRow / this.tilesVertical);
    }
  };
}