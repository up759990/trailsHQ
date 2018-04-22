function start() {
  placeLoginandLogout();
  //if (window.location.pathname == "/account.html" || window.location.pathname == "/trick1.html") {
  if (document.getElementById("vidBox")) {
    placeVideo()
  }
}
function placeLoginandLogout() {
  var username = readCookie("username");
  var loginBox = document.getElementById("loginBox");
  if (username == null) {
  var login = document.createElement('button');
  var t = document.createTextNode("Login");
  login.appendChild(t);
  login.id = "loginButton";
  login.onclick = function() {
    window.location.pathname = "/login.html";
  }

  loginBox.appendChild(login);
}
else {
  var button = document.createElement('p');
  var loggedInAs = document.createTextNode("Logged In As: "+username)
  button.id = "loginButton";
  button.appendChild(loggedInAs)
  loginBox.appendChild(button);
}
var logOutButton = document.createElement('button');
logOutButton.id = "loginButton";
var logOut = document.createTextNode("Logout");
logOutButton.onclick = function() {
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.pathname = "/login.html";
}
logOutButton.appendChild(logOut);
loginBox.appendChild(logOutButton);
}

function placeVideo() {
      var info = getTrickInfo(null);
      var link = info[0];
      var trickName = info[1];

      var iframe = document.createElement('iframe');
      iframe.src = link;
      iframe.width="853";
      iframe.height="480";
      iframe.align= "middle";
      iframe.frameborder= "0";
      var vidDiv = document.getElementById("vidBox");
      if (vidDiv.innerHTML != "") {
        vidDiv.innerHTML = "";
      }
      var title = document.createElement('h2');
      title.textContent = trickName;
      vidDiv.appendChild(title);
      vidDiv.appendChild(iframe);
      //var iframe = document.createElement('div');
      addCommentSection();

}

function createCookie(name,value) {
  var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
  if (name ==  "trick") {
  window.location.pathname = "/trick1.html";
}

}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function addCommentSection() {
  var trickNum = readCookie("trick");
  var commentBox = document.createElement('div');
  commentBox.id = "commentBox";
  var button = document.createElement('button');
  button.id = "uploadButton"
  button.addEventListener("click", function() {
    window.location.href = '/upload.html';
  }, false);
  var text = document.createTextNode("Upload a Video");
  button.appendChild(text);
  commentBox.appendChild(button);
  document.body.appendChild(commentBox);
  var username = null;
  loadVideos(trickNum,username);
}

function getTrickInfo(trickNum) {
  var link;
  var name;
  if (trickNum == null) {
  var trickNum = Number(readCookie("trick"));
  }
  //alert(trickNum);
  switch (trickNum) {
    case 1:
      link = "https://www.youtube.com/embed/iG3IyREyFVc";
      name = "Balancing";
      break;
    case 2:
      link="https://www.youtube.com/embed/TfO_TFd9bO4";
      name ="Full Lock Turns and Pivot Points";
      break;
    case 3:
      link="https://www.youtube.com/embed/HF5LFJ3Tx3w";
      name = "Body Positioning";
      break;
    case 4:
      link="https://www.youtube.com/embed/ZvKPgeMwEcM";
      name = "Wheelies";
      break;
    case 5:
      link="https://www.youtube.com/embed/H0LkqiGjD3U";
      name ="Riding With Confidence";
      break;
    case 6:
      link="http://www.youtube.com/embed/5S_vkkhGMsM";
      name = "Hoping the Front Wheel";
      break;
    case 7:
      link="http://www.youtube.com/embed/FeHjMyG98EE";
      name = "Hoping the Rear Wheel";
      break;
    case 8:
      link="http://www.youtube.com/embed/HBDQWUoOb2Y";
      name = "Double Blips and Zaps";
      break;
    case 9:
      link="https://www.youtube.com/embed/5ZFmP3VaHJg";
      name = "Using the Bashplate";
      break;
    case 10:
      link="http://www.youtube.com/embed/fyndlwvizNA";
      name = "Steep Climbs and Ascents";
      break;
    case 11:
      link="https://www.youtube.com/embed/z2UDTJBxPMM";
      name = "Descents, Drop Offs and Downhill";
      break;
    case 12:
      link="http://www.youtube.com/embed/m4giPVsfyf0";
      name = "Splatters and Jumping Gaps";
      break;
    case 13:
      link="http://www.youtube.com/embed/RL3VPlxd8_o";
      name ="Holding Pressure";
      break;
    case 14:
      link="https://www.youtube.com/embed/9BrJ7qk--ng";
      name ="Floater Turns";
      break;
    case 15:
      link="https://www.youtube.com/embed/PlheArfSYVk";
      name = "Jumping Gaps";
      break;
    case 16:
      link="http://www.youtube.com/embed/j_fBr82ii-0";
      name = "Flip Turns";
      break;
    case 17:
      link="http://www.youtube.com/embed/gG4Bafcq2WM";
      name = "Hopping for Traction";
      break;
    default:
      link="https://www.youtube.com/embed/iG3IyREyFVc";
      name = "Balancing";
  }
  return [link, name];
}
