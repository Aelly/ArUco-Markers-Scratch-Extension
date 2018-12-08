(function(ext) {

  var videoElement = undefined;
  var hidden_canvas = undefined;

  var image = undefined;





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

    // Lance une callback à la fin de la tâche
    script.onreadystatechange = callback;
    script.onload = callback;

    // Ajoute le script
    head.appendChild(script);
}

loadScript("https://raw.githubusercontent.com/jcmellado/js-aruco/master/src/aruco.js", checkImport);
loadScript("js-aruco-master/src/cv.js", checkImport);
loadScript("js-aruco-master/src/posit1.js", checkImport);
loadScript("js-aruco-master/src/posit2.js", checkImport);
loadScript("js-aruco-master/src/svd.js", checkImport);

  function initializeCamera() {
    console.log("Initializing camera");
    videoElement = document.createElement('video');
    videoElement.id = "camera-stream";
    hidden_canvas = document.createElement('canvas');
    hidden_canvas.id = "imageCanvas";

    navigator.getUserMedia(
      // Options
      {
        video: true
      },
      // Success Callback
      function(stream){
        // Create an object URL for the video stream and
        // set it as src of our HTLM video element.
        videoElement.src = window.URL.createObjectURL(stream);
        // Play the video element to show the stream to the user.
        videoElement.play();
      },
      // Error Callback
      function(err){
        // Most common errors are PermissionDenied and DevicesNotFound.
        console.error(err);
      }
    );
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

    // Get an image dataURL from the canvas.
    var imageDataURL = hidden_canvas.toDataURL('image/png');
    return imageDataURL;
  }

  ext.getPos = function() {
    if(image.length == 0) {
      if(hidden_canvas != undefined) {
        var snapshot = takeSnapshot();
        var base64v = snapshot.substring(snapshot.indexOf(',')+1);
        image = { base64 : base64v };
      } else callback();
    } else {
      if (image.substring(0,4) != "http") {
        var startIndex = image.indexOf(',')+1;
        base64v = snapshot.substring(startIndex);
        image = { base64 : base64v };
      }
    }
  }

  ext.initialize = function(){
    initializeCamera();
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
      ['r', 'X position', 'getPos'],
    ]
  };

  // Register the extension
  ScratchExtensions.register('Sample extension', descriptor, ext);
})({});
