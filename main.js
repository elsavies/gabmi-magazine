/**
* File created by Fernando Perez
* 09/11/2018
*/
function Gabmi(){ }

Gabmi.themes = [
  {
    name: "auto",
    className: null
  },
  {
    name: "day",
    className: "dayColor"
  },
  {
    name: "night",
    className: "nightColor"
  }
];

Gabmi.BadgeReceivedLevel  = {
  AbilitiesAndSkills: 1,
  SuperPower: 2
};

/**
* Method to verify if one class exists from DOM Element
*/
Gabmi.hasClass = function(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

/**
* Method to remove class from DOM Element
*/
Gabmi.removeClass = function(ele,cls) {
    if (Gabmi.hasClass(ele,cls)) {
        var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
        ele.className=ele.className.replace(reg,' ');
    }
};

/**
 * Method to render the resolution
 */
Gabmi.renderResolution = function(resolution){
	var imgs = document.getElementsByTagName("IMG");
	var i;
	for (i = 0; i < imgs.length; i++) {
		imgs[i].src = imgs[i].src.replace("%7B0%7D",resolution);
		Gabmi.removeClass(imgs[i],"hidden");
	}
};

/**
 * Method to send message to device
 */
Gabmi.sendMessageToDevice = function(value){
  try {
		if (typeof webkit !== "undefined" && typeof webkit.messageHandlers !== "undefined" && typeof webkit.messageHandlers.messageAction !== "undefined"){
			webkit.messageHandlers.messageAction.postMessage(value);
			console.log("onclick ios reached");
		}
		if (Android !== null && typeof Android === "object" && typeof Android.OnClick === "function"){
			console.log("onclick android reached");
			Android.OnClick(value);
		}
	} catch(err) {
		console.log('The native context does not exist yet, err: ' + err);
	}
}

/**
 * Method to catch the click elements (clickable)
 */
Gabmi.onClickElement = function(element){
  var value =  element.getAttribute("value");
	Gabmi.sendMessageToDevice(value);
};

Gabmi.isNight = function(){
  var hour = new Date().getHours();
  return hour >= 19 || hour < 7
};

/**
 * Method to render the multicolor for text (daycolor and nightcolor)
 */
Gabmi.renderMultiColor = function(themeId){
  var multiColor = Gabmi.isNight() ? "nightColor" : "dayColor";
  if (themeId > 0){
    multiColor = Gabmi.themes[themeId].className;
  }
	var multiTextColorElements = document.getElementsByClassName("multiTextColor");
	var i;
	var multiTextColorElement;
	for (i=0; i< multiTextColorElements.length;i++){
		multiTextColorElement = multiTextColorElements[i];
		multiTextColorElement.className =  multiTextColorElement.className + " " + multiColor;
	}
}

/**
 * Method to replace values to the html
 */
Gabmi.renderValues = function(jsonString){
    if (typeof jsonString != "string"){
        console.error("jsonString must be a string, current typeof input: " + typeof jsonString);
        return;
    }
    //decode string
    jsonString = decodeURIComponent(jsonString.replace(/\+/g, '%20'));
    var json = null;
    try{
      json = JSON.parse(jsonString);
    }catch(error){ }

    if (json == null){
        console.warn("Invalid JSON, current input: " + jsonString)
        json = {};
    }

    //render username
    var domUsername = document.getElementById("username");
    if (typeof domUsername === "object" && domUsername !== null && json["username"] !== null && typeof json["username"] === "string" && domUsername !== null){
      domUsername.innerHTML = "@" + json["username"]
    }
    //end: render username

    //render dictionary
    if (json["dictionary"] != null){
        var dictionary;
        dictionary = json["dictionary"];

        if (typeof dictionary === "string"){
            dictionary = JSON.parse(dictionary);
        }
        else if (typeof dictionary !== "object"){
          console.error("invalid type of dictionary, current type" + typeof dictionary);
          return;
        }
        var resultDictionary = dictionary["results"] !== null && typeof dictionary["results"] === "object" && dictionary["results"].length > 0 ?  dictionary["results"][0]: null;

        if (resultDictionary != null){
          var container = document.getElementById("phrase-day-container");
          container.innerHTML = "";
          container.className += " hidden";

          var node, element, resultEntries, resultLexicalEntries, resultEtimologies, resultSenses, resultDefinitions, resultExamples, resultSubsenses;
          var i;

          element = document.createElement("p");
          element.className = "text-label";
          node = document.createTextNode("Featured positive trait");
          element.appendChild(node);
          container.appendChild(element);

          if (resultDictionary["id"] != null && typeof resultDictionary["id"] === "string"){
            element = document.createElement("h1");
            element.className = "text-word";
            node = document.createTextNode(resultDictionary["id"]);
            element.appendChild(node);
            container.appendChild(element);
          }

          if (dictionary["metadata"] != null && typeof dictionary["metadata"] == "object" && dictionary["metadata"]["provider"] != null){
            element = document.createElement("p");
            element.className = "text-source";
            element.innerHTML = "Source: <a href=\"#\">" +  dictionary["metadata"]["provider"] + "</a>"
            container.appendChild(element);
          }

          resultLexicalEntries = resultDictionary["lexicalEntries"] != null &&  typeof resultDictionary["lexicalEntries"] == "object" && resultDictionary["lexicalEntries"].length > 0 ? resultDictionary["lexicalEntries"] : null;
          if (resultLexicalEntries != null){
              if (resultLexicalEntries.length > 1){
                //find the adjective type
                resultSenses = null;
                for(k in resultLexicalEntries){
                  if (typeof resultLexicalEntries[k]["lexicalCategory"] === "string" && resultLexicalEntries[k]["lexicalCategory"] === "Adjective"){
                      resultSenses = resultLexicalEntries[k];
                      break;
                  }
                }
                //end: find the adjective type
              }

              if (resultSenses == null){
                resultSenses = resultLexicalEntries[0];
              }
          }else resultSenses = null;

          resultEntries = resultSenses != null && resultSenses["entries"] != null && typeof resultSenses["entries"] == "object" && resultSenses["entries"].length > 0  ? resultSenses["entries"][0] : null;

          if (resultEntries != null){
            resultSenses = resultEntries["senses"] != null && typeof resultEntries["senses"] == "object" && resultEntries["senses"].length > 0  ? resultEntries["senses"][0] : null;
            resultEtimologies = resultEntries["etymologies"] != null && typeof resultEntries["etymologies"] == "object" && resultEntries["etymologies"].length > 0  ? resultEntries["etymologies"] : null;
          }

          if (resultSenses != null){
            resultDefinitions =  resultSenses["definitions"] != null && typeof resultSenses["definitions"] === "object" && resultSenses["definitions"].length > 0 ? resultSenses["definitions"] : null;
            resultExamples =  resultSenses["examples"] != null && typeof resultSenses["examples"] === "object" && resultSenses["examples"].length > 0 ? resultSenses["examples"] : null;


            for(i=0;i<resultDefinitions.length;i++){
              element = document.createElement("p");
              element.className = "text-description";
              node = document.createTextNode(resultDefinitions[i]);
              element.appendChild(node);
              container.appendChild(element);
            }

            element = document.createElement("h4");
            element.className = "text-example-title";
            node = document.createTextNode("Examples:");
            element.appendChild(node);
            container.appendChild(element);

            for(i=0;i<resultExamples.length;i++){
              element = document.createElement("p");
              element.className = "text-example";
              node = document.createTextNode("\"" + resultExamples[i].text + "\"");
              element.appendChild(node);
              container.appendChild(element);
            }

            resultSubsenses = resultSenses["subsenses"] != null && typeof resultSenses["subsenses"] === "object" && resultSenses["subsenses"].length > 0 ? resultSenses["subsenses"] : null;
            if (resultSubsenses != null){
              element = document.createElement("h4");
              element.className = "text-another-definitions";
              node = document.createTextNode("Another Definitions:");
              element.appendChild(node);
              container.appendChild(element);

              for(i=0;i<resultSubsenses.length;i++){
                element = document.createElement("p");
                element.className = "text-description";
                node = document.createTextNode(resultSubsenses[i]["definitions"]);
                element.appendChild(node);
                container.appendChild(element);
              }
            }

            if (resultEtimologies != null){
              element = document.createElement("h4");
              element.className = "text-example-title";
              node = document.createTextNode("Etymologies:");
              element.appendChild(node);
              container.appendChild(element);

              for (i=0;i<resultEtimologies.length;i++){
                element = document.createElement("p");
                element.className = "text-description";
                node = document.createTextNode(resultEtimologies[i]);
                element.appendChild(node);
                container.appendChild(element);
              }
            }
          }
          Gabmi.removeClass(container,"hidden");
        }
    }
    //new superpower render
    else if (typeof json["sp_object"] === "object" && json["sp_object"] !== null){
        var userId = typeof json["sp_object"]['id_user'] === "number" ?  json["sp_object"]['id_user'] : null;
        var idReference = typeof json["sp_object"]['id_reference'] === "number" ?  json["sp_object"]['id_reference'] : null;
        var username = typeof json["sp_object"]['username'] === "string" ? json["sp_object"]['username'] : null;

        if (typeof json["sp_object"]['profile_thumbnail'] === "string"){
            var img = document.createElement("img");

            var renderImage = function(url){
              img.src = url;
              img.title = "Profile Picture";
              img.alt = "Profile Picture";
              var profileImageContainers = document.getElementsByClassName("profile-image-container");
              var lenContainers = profileImageContainers.length;
              for(var i=0;i<lenContainers;i++) {
                profileImageContainers[i].innerHTML = "";
                profileImageContainers[i].appendChild(img);
              }
            };

            var testImage = function(url){
              var tester=new Image();
              tester.onload= function(){
                renderImage(json["sp_object"]['profile_thumbnail']);
              };
              tester.onerror=function(){
                renderImage("image-profile.png");
              };
              tester.src=url;
            };
            testImage(json["sp_object"]['profile_thumbnail'])
        }

        var value = {
          "user_id": userId,
          "username": username
        };

        var actionObject = {
          "action": 6/*user profile*/,
          "value": JSON.stringify(value)
        };
        actionObject = decodeURIComponent(JSON.stringify(actionObject));
        $(".profile-image-container").attr("value",actionObject);

        //render the current messsage
        var messageLabel = typeof json["sp_object"]["description"] === "string" ? json["sp_object"]["description"] : "N/A";
        var gmMessage = document.getElementById("sp-message");
        if (gmMessage !== null){
          gmMessage.innerHTML = messageLabel;
        }
        delete type;
        delete gmMessage;
        //end: render the current messsage

        var superpower = typeof json["sp_object"]['superpower'] === "string" ? json["sp_object"]['superpower'] : null;
        var superpowerContainer = document.getElementById("lottie-superpower");
        superpowerContainer.innerHTML = "";
        if (superpower !== null && typeof superpowerContainer !== "undefined" && superpowerContainer !== null){

          var value = {
            "badge_id": idReference,
            "user_id": userId,
            "type": Gabmi.BadgeReceivedLevel.SuperPower,
            "username": username
          };
          var actionObject = {
            "action": 7 /*badge detail*/,
            "value": JSON.stringify(value)
          }
          actionObject = JSON.stringify(actionObject);
          actionObject = decodeURIComponent(actionObject);
          superpowerContainer.setAttribute("value",actionObject);

          lottie.loadAnimation({
            container: superpowerContainer,
            loop: true,
            autoplay: true,
            path: superpower
          });
        }
        delete superpower;
        delete superpowerContainer;

        setTimeout(function(){
          $("#container-superpower").fadeIn();
        },1000);
    }
    //new goodmeter lever render
    else if (typeof json["gm_object"] === "object" && json["gm_object"] !== null){
        var userId = typeof json["gm_object"]['id_user'] === "number" ?  json["gm_object"]['id_user'] : null;
        var username = typeof json["gm_object"]['username'] === "string" ?  json["gm_object"]['username'] : null;

        if (typeof json["gm_object"]['profile_thumbnail'] === "string"){
            var img = document.createElement("img");

            var renderImage = function(url){
              img.src = url;
              img.title = "Profile Picture";
              img.alt = "Profile Picture";
              var profileImageContainers = document.getElementsByClassName("profile-image-container");
              var lenContainers = profileImageContainers.length;
              for(var i=0;i<lenContainers;i++) {
                profileImageContainers[i].innerHTML = "";
                profileImageContainers[i].appendChild(img);
              }
            };

            var testImage = function(url){
              var tester=new Image();
              tester.onload= function(){
                renderImage(json["gm_object"]['profile_thumbnail']);
              };
              tester.onerror=function(){
                renderImage("image-profile.png");
              };
              tester.src=url;
            };
            testImage(json["gm_object"]['profile_thumbnail'])
        }

        var value = {
          "user_id": userId,
          "username": username
        };

        var actionObject = {
          "action": 6/*user profile*/,
          "value": JSON.stringify(value)
        };
        actionObject = decodeURIComponent(JSON.stringify(actionObject));
        $(".profile-image-container").attr("value",actionObject);

        //render the current messsage
        var messageLabel = typeof json["gm_object"]["description"] === "string" ? json["gm_object"]["description"] : "N/A";
        var gmMessage = document.getElementById("gm-message");
        if (gmMessage !== null){
          gmMessage.innerHTML = messageLabel;
        }
        delete type;
        delete gmMessage;
        //end: render the current messsage

        //render the current level
        var currentLevel = typeof json["gm_object"]['goodmeter_level'] === "number" ? json["gm_object"]['goodmeter_level'] : null;
        if (currentLevel !== null){
            document.getElementById("gm_evolved_level").innerHTML = currentLevel;
        }
        delete currentLevel;
        //end: render the current level

        var goodmeter = typeof json["gm_object"]['goodmeter'] === "string" ? json["gm_object"]['goodmeter'] : null;
        var goodmeterContainer = document.getElementById("lottie-goodmeter-current-level");
        goodmeterContainer.innerHTML = "";
        if (goodmeter !== null && typeof goodmeterContainer !== "undefined" && goodmeterContainer !== null){
          var action = "{\"action\":5, \"value\": " + userId + "}";
          action = decodeURIComponent(action);
          goodmeterContainer.setAttribute("value",action);

          lottie.loadAnimation({
            container: goodmeterContainer,
            loop: true,
            autoplay: true,
            path: goodmeter
          });
        }
        delete goodmeter;
        delete goodmeterContainer;

        setTimeout(function(){
          $("#container-gm-evolved").fadeIn();
        },1000);
    }
    else{
      var titleWordNotAvailable = document.getElementById("title-word-not-available");
      var phraseDayContainer = document.getElementById("phrase-day-container");
      if (titleWordNotAvailable && phraseDayContainer === null){
        Gabmi.removeClass(titleWordNotAvailable,"hidden");
      }
    }
    //end: render dictionary

    var themeId = 0;
    if (typeof json["theme_id"] === "number" && typeof Gabmi.themes[json["theme_id"]] === "object"){
      themeId = json["theme_id"];
    }
    Gabmi.renderMultiColor(themeId);
}

/**
 * Initialization
 */
Gabmi.init = function(){
	var region = [];
	var tap;
	var clickables;
	var containersElement = document.getElementsByClassName("container");
	var i;


	for (i=0; i< containersElement.length;i++){
		containerElement = containersElement[i];
		region[i] = new ZingTouch.Region(containerElement);
		tap = new ZingTouch.Tap({numInputs: 1 });

		clickables = containerElement.getElementsByClassName("clickable");
		var x;
		for (x = 0; x < clickables.length; x++) {

      clickables[x].addEventListener("focus",function(event){
          event.preventDefault();
      });
			clickables[x].addEventListener("click", function(event){
				event.preventDefault();
			});

			region[i].bind(clickables[x], tap, function(event){
				Gabmi.onClickElement(event.target)
			});
		}
	}
}

Gabmi.init();

$(document).ready(function(){
  if($("#container-gm-evolved, #container-superpower").length){
      $("#container-gm-evolved, #container-superpower").addClass(Gabmi.isNight() ? "night" : "day")
  }

  if ($(".more-wrapper").length){
    $(".more-wrapper").find(".lnk-more").addClass(Gabmi.isNight() ? "nightColor" : "dayColor").click(function(){
      var wrapper = $(this).parent();
      var container = $(wrapper).find(".more-content");

      Gabmi.sendMessageToDevice(JSON.stringify({
        action: 8 /*action to send event*/,
        value: $(wrapper).attr("data-value")
      }));
      $(container).show();
      $(this).hide();
    });
  }


});
