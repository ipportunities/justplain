//import t from "../translate";
import {appSettings} from "../../custom/settings";

//lokale translate -> translate laadt api in.. wederkerige afhankelijkheid gaat niet goed
const t = (str) => {
  return str;
}
const apiCall = apiMsg => {

  return new Promise((resolve, reject) => {
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    // Setup our listener to process completed requests
    xhr.onload = function() {
      // Process our return data
      if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        try {
          let jsonResponse = JSON.parse(xhr.response);
          //TODO een error is nu niet meer verder af te handelen....
          if (jsonResponse.error !== 0) {
            if (99 == jsonResponse.error) {
              //sessie verlopen, uitloggen...
              //token niet meer geldig, cookie weggooien
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              alert(
                t("Your session has ended due to inactivity.")
              );
              window.location.href = "/";
            } else {
              alert(jsonResponse.msg);
              //resolve(false);
            }
          } else {
            //response OK!
            resolve(jsonResponse);
          }
        } catch (e) {
          alert(
            "Oops, something went wrong while communicating with the server"
          );
          //resolve(false); //todo nonvalid json
        }
      } else {
        // What do when the request fails
        alert("The API request failed!");
        //reject();
        resolve(false);
      }

      // Code that should run regardless of the request status:
      // here
    };

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    xhr.open("POST", appSettings.domain_url +"/api/index.php");
    xhr.send(JSON.stringify(apiMsg));
  });
};

export default apiCall;
