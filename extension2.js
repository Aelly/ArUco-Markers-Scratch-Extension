(function(ext) {

  var videoElement = undefined;
  var hidden_canvas = undefined;

  var width = undefined;
  var height = undefined;

  var detector = undefined;
  var posit = undefined;
  var pose = undefined;

  var image = undefined;

  var lastPosX, lastPosY, lastPosZ ;

  function checkImport(){
    console.log("import success")
  }

  function loadScript(url, callback)
  {
    // Prépare l'ajoute du script au head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.crossorigin='anonymous';

    // Lance une callback à la fin de la tâche
    script.onreadystatechange = callback;
    script.onload = callback;

    // Ajoute le script
    head.appendChild(script);
  }

  loadScript("https://rawgit.com/jcmellado/js-aruco/master/src/aruco.js", checkImport);
  loadScript("https://rawgit.com/jcmellado/js-aruco/master/src/cv.js", checkImport);
  loadScript("https://rawgit.com/jcmellado/js-aruco/master/src/posit1.js", checkImport);
  loadScript("https://rawgit.com/jcmellado/js-aruco/master/src/posit2.js", checkImport);
  loadScript("https://rawgit.com/jcmellado/js-aruco/master/src/svd.js", checkImport);

  function initializeCamera() {
    console.log("Initializing camera");
    videoElement = document.createElement('video');
    videoElement.id = "camera-stream";
    hidden_canvas = document.createElement('canvas');
    hidden_canvas.id = "imageCanvas";

    navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function(stream) {
      if ("srcObject" in videoElement) {
        videoElement.srcObject = stream;
      } else {
        videoElement.src = window.URL.createObjectURL(stream);
      }
      videoElement.play();
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }
  );
  console.log("Initialization end");
}

function takeSnapshot(){
  // Get the exact size of the video element.
  width = videoElement.videoWidth;
  height = videoElement.videoHeight;
  // Context object for working with the canvas.
  context = hidden_canvas.getContext('2d');
  // Set the canvas to the same dimensions as the video.
  hidden_canvas.width = width;
  hidden_canvas.height = height;
  // Draw a copy of the current frame from the video on the canvas.
  context.drawImage(videoElement, 0, 0, width, height);
  imageData = context.getImageData(0,0,hidden_canvas.width, hidden_canvas.height);
  return imageData;
}

function getPos(){
  image = takeSnapshot();

  var markers = detector.detect(image);
  console.log(lastPosX);
  if (markers.length > 0){
    var corners = markers[0].corners;
    console.log("Marker detected");
    for (var i = 0; i < corners.length; ++ i){
      var corner = corners[i];

      corner.x = (hidden_canvas.width / 2) - corner.x;
      corner.y = (hidden_canvas.height / 2) - corner.y;
    }

    pose = posit.pose(corners);
    lastPosX = (pose.bestTranslation[0] | 0);
    lastPosY = (pose.bestTranslation[1] | 0);
    lastPosZ = (pose.bestTranslation[2] | 0);
  }
  return [lastPosX, lastPosY, lastPosZ];
}

ext.getXPos = function(){
  pos = getPos();
  console.log(pos[0]);
  return pos[0];
}

ext.getYPos = function(){
  pos = getPos();
  return pos[1];
}

ext.getZPos = function(){
  pos = getPos();
  return pos[2];
}

ext.initialize = function(){
  initializeCamera();
  detector = new AR.Detector();
  posit = new POS.Posit(55, hidden_canvas.width);
  lastPosX = 0;
  lastPosY= 0;
  lastPosZ = 0;
}

// Cleanup function when the extension is unloaded
ext._shutdown = function() {};

// Status reporting code
// Use this to report missing hardware, plugin or unsupported browser
ext._getStatus = function() {
  return {status: 2, msg: 'Ready'};
};

ext.posX = function() {
  return 5;
};

// Block and block menu descriptions
var descriptor = {
  blocks: [
    // Block type, block name, function name, param1 default value, param2 default value
    ['w', 'initializeCamera', 'initialize'],
    ['r', 'X position', 'getXPos'],
    ['r', 'Y position', 'getYPos'],
    ['r', 'Z position', 'getZPos'],
  ]
};

// Register the extension
ScratchExtensions.register('ArUco Markers', descriptor, ext);
})({});
