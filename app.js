var WiFiControl = require("wifi-control");

//  Initialize wifi-control package with verbose output
WiFiControl.init({
  debug: true
});

// DEFAULT
var ssid = "GlobeAtHome_276DE";
var password = "D71F99F1";
/**
 * Getting arguments to override default ssid and password
 */
var args = process.argv.slice(2);

args.forEach(val => {
  var argVal = val.split("=");
  if (argVal.length === 2 && argVal[1]) {
    // valid argument
    switch (argVal[0]) {
      case "ssid":
        ssid = argVal[1];
        break;
      case "password":
        password = argVal[1];
        break;
      default:
        console.log(`Invalid argument: ${argVal[0]}`);
    }
  }
});

// console.log({ ssid, password });
// WiFiControl.resetWiFi(() => {
//   console.log("RESET DONE");
// });

const _ap = { ssid, password };
WiFiControl.connectToAP(_ap, (error, response) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully connected to ${ssid}`);
  }
});
