function getCompleted() {
  var username = readCookie("username");
  //alert(username);
  if (username == null) {
    window.location.pathname = "/login";
  }
  else {
    var url = '/completed/';
    var parameters = "username="+username;
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url+parameters, true);
    xhr.onload = function() {
      var completedTricks = JSON.parse(xhr.responseText);
      //alert(completedTricks);
      var completedTrickNames = []
      for (var i=0; i<completedTricks.length;i++) {
        completedTrickNames.push(getTrickInfo(completedTricks[i])[1]);
      }
      var list = makeList(completedTrickNames);
      var completedTricksDiv = document.getElementById("completedTricks");
      var heading = document.createElement('h3');
      heading.textContent = "Completed Tricks";
      completedTricksDiv.appendChild(heading);
      completedTricksDiv.appendChild(list);

    }
    xhr.send();
    var trickNum = null;
    loadVideos(trickNum,username);
  }
}
getCompleted();

function makeList(completedTrickList) {
  var list = document.createElement('ul');
  for (var i=0; i< completedTrickList.length; i++) {
  var trick = document.createElement('li');
  trick.appendChild(document.createTextNode(completedTrickList[i]));
  list.appendChild(trick);
}
return list;
}
