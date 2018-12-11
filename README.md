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

## Application

## Evaluation

## TODO

- [x] get the position of marker
- [ ] display the camera
- [ ] evaluate with kids
