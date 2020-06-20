const WiFiControl = require("wifi-control");
const dotenv = require("dotenv");
const ping = require("ping");
dotenv.config();
WiFiControl.init({
  debug: false,
});

// DEFAULT
var ssid = process.env.ssid;
var password = process.env.password;
var host = "google.com";

var interval = 1700;
var maxTimedOutOrHighPingCount = 7;
var highPing = 1500;
/**
 * Getting arguments to override default ssid and password
 */
var args = process.argv.slice(2);

args.forEach((val) => {
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
      case "host":
        host = argVal[1];
        break;
      default:
        throw new Error(
          `Invalid argument: ${argVal[0]}. Please follow the ff: format. <key>=<value>. Ex: ssid=PLDCBestISP`
        );
    }
  }
});
if (!ssid) {
  throw new Error("Please provide ssid argument when running the program.");
}

console.log(`Pinging ${host}...`);
let timedOutOrHighPingCounter = 0;
setInterval(() => {
  ping.promise.probe(host).then((res) => {
    const { time, host, numeric_host, alive } = res;
    if (alive) {
      console.log(
        `Reply from ${host} - [${numeric_host}]: bytes=32 time=${time}ms`
      );
      if(time > highPing) {
        // We consider this as an unhealthy connection and will have to count it for the flag.
        timedOutOrHighPingCounter++;
      } else {
        // Reset the counter
        timedOutOrHighPingCounter = 0;
      }
    } else {
      console.log("Request timed out.");
      timedOutOrHighPingCounter++;
      if (timedOutOrHighPingCounter > maxTimedOutOrHighPingCount) {
        resetWiFi();
      }
    }
  });
}, interval);

function resetWiFi() {
  console.log("Restarting internet connection..");
  WiFiControl.resetWiFi(() => {
    const _ap = { ssid, password };
    WiFiControl.connectToAP(_ap, (error, response) => {
      if (error) {
        throw new Error(error);
      } else {
        console.log(`Successfully reconnected to ${ssid}`);
      }
    });
  });
}
