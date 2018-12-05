(function(ext) {

  var device = null;
  var image = null;
  var poller = null;

  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};

  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {
    if(!device) return {status: 1, msg: 'Device not connected'};
    return {status: 2, msg: 'Ready'};
  };

  function deviceOpened(dev) {
    // if device fails to open, forget about it
    if (dev == null) device = null;

    // otherwise start polling
    poller = setInterval(function() {
      rawData = device.read();
    }, 20);
  };
  ext._deviceConnected = function(dev) {
    if(device) return;

    device = dev;
    device.open(deviceOpened);
  };

  ext._deviceRemoved = function(dev) {
    if(device != dev) return;
    if(poller) poller = clearInterval(poller);
    device = null;
  };

  ext._shutdown = function() {
    if(poller) poller = clearInterval(poller);
    if(device) device.close();
    device = null;
  }

  ext.positionX = function(image){
    return 5;
  }

  // Block and block menu descriptions
  var descriptor = {
    blocks: [
      // Block type, block name, function name, param1 default value, param2 default value
      ['r', 'marker X position', 'positionX'],
    ]
  };

  // Register the extension
  var hid_info = {type: 'hid', vendor: 0x046d, product: 0x0825};
  ScratchExtensions.register('ArUco Markers', descriptor, ext, hid_info);
})({});
