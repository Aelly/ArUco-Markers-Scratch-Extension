# ArUco-Markers-Scratch-Extension

This extension allow the users to use ArUco markers to developp Augmented Reality application in Scratch.  
This project is meant to be used in ScratchX and uses [jcmellado port to JavaScript of the ArUco library](https://github.com/jcmellado/js-aruco). It was inspired by [this paper](https://webmel.u-bordeaux.fr/service/home/~/?auth=co&loc=fr&id=12287&part=2) by Iulian Radu and Blair MacIntyre.

## How to use it

1. Go to https://scratchx.org/#scratch
2. Go into "More Blocks" and shift + left click on "Load Experimental Extension"  
![import exemple image](https://github.com/Aelly/ArUco-Markers-Scratch-Extension/blob/master/readme_img/import.png)
3. In the new window select the javascript extension file
4. If the import was successful you should see a green dot and the imported block  
![import OK](https://github.com/Aelly/ArUco-Markers-Scratch-Extension/blob/master/readme_img/import_ok.png)
5. In your project you need to use the initializeCamera at least once at the start, you can then access the position of the marker using the 3 others blocks. For example here is a project that use the marker to move a sprite.
![project example](https://github.com/Aelly/ArUco-Markers-Scratch-Extension/blob/master/readme_img/project_example.png)

## Implementation

The first step is to have access to the webcam, this is what the "initializeCamera" block is for. In this block we create an hidden canvas and video element that will be used later and we link the video stream from the webcam to our hidden video element. This is also where we initialize the dectector that'll be used later (see the javascript ArUco library).
```
videoElement = document.createElement('video');
videoElement.id = "camera-stream";
hidden_canvas = document.createElement('canvas');
hidden_canvas.id = "imageCanvas";
navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function(stream) {
        videoElement.srcObject = stream;
 })});
 
 ...
 
 detector = new AR.Detector();
 posit = new POS.Posit(55, hidden_canvas.width);
 ```
 Then when we want to access the position of our marker we first need to take a snapshot of our video stream.
 
 ```
 imageData = context.getImageData(0,0,hidden_canvas.width, hidden_canvas.height);
 return imageData;
 ```
 
 Lastly in this image we can use our detector object to detect the marker, get the corner and compute the marker's position.
 
 ```
 function getPos(){
  image = takeSnapshot();

  var markers = detector.detect(image);
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
```

## Application

Once completed this extension could be use for two things:
-Allow kids to build small game using simple augmented reality features, the markers use in the library can easily be printed or even drawn (as long as they respect the constraint stated in the library documentation).
-Add interactions to existing project, for example in a project meant to teach basic operation for kids, the operation could appear on the screen and to see the answer the user could show the corresponding marker.

## Evaluation

## TODO

- [x] get the position of marker
- [ ] display the camera
- [ ] evaluate with kids
