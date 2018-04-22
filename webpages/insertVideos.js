function loadVideos(trickNum,username) {
  var url = '/videos/';
  if (trickNum == null & username != null) {
    var parameters = "username="+username;
  }
  else if (username == null & trickNum != null) {
  var parameters =  "trickNum="+trickNum;
}
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url+parameters, true);
  xhr.onload = function() {
  var videos = JSON.parse(xhr.responseText);
  var commentBox = document.getElementById("commentBox");
  for (i=1; i < videos.length; i=i+6) {
    if (window.location.pathname == "/account.html") {

      var trickName = document.createElement('h4')
      trickName.textContent = getTrickInfo(videos[i+5])[1]
      commentBox.appendChild(trickName);
      }

    var video = document.createElement('video');
    video.id= "userUpload"
    var info = document.createElement('div');
    info.id = "info";
    info.textContent = videos[i+1];
    info.classList.add(videos[i-1]);

    var downArrow = document.createElement("img");
    downArrow.src = "down-arrow.png"
    downArrow.classList.add("arrow");
    downArrow.id= videos[i-1];
    downArrow.onclick = function() {
      var url = '/videos/vote/';
      var parameters = "vote=-1 "+",id="+this.id;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url+parameters, true);
      xhr.onload = function() {

      }
      xhr.send();
      location.reload();

    }
    var upArrow = document.createElement("img");
    upArrow.src = "up-arrow.png";
    upArrow.classList.add("arrow");
    upArrow.id = videos[i-1];
    upArrow.onclick = function() {
      var thisUpVotes = document.getElementsByClassName("up",1);
      //alert(thisUpVotes.textContent);
      //thisUpVotes.innerHTML = "thisUpVotes.innerHTML +1";
      var url = '/videos/vote/';
      var parameters = "vote=1 "+",id="+this.id;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url+parameters, true);
      xhr.onload = function() {
      }
      xhr.send();
      location.reload();

    }

    video.src = "/videosFolder/"+videos[i];
    video.setAttribute("controls","controls")

    var downVotes = document.createElement('div');
    var upVotes = document.createElement("div");
    downVotes.id = "votes";
    upVotes.id = "votes";

    upVotes.textContent = videos[i+2];
    upVotes.classList.add(videos[i-1],"up");
    downVotes.textContent = videos[i+3];
    downVotes.classList.add(videos[i-1],"down");
    var commentsSection = document.createElement('div');
    var postComment = document.createElement('button');
    postComment.innerHTML = "Comment";
    postComment.id = videos[i-1];

    var commentInput = document.createElement('textarea');
    commentInput.id = "commentInput";
    commentInput.classList.add(videos[i-1]);
    commentInput.classList.add("comment");
    //commentInput.size= "1";
    commentsSection.appendChild(commentInput);
    commentsSection.appendChild(postComment);
    postComment.onclick = function() {
      if (readCookie("username") != null) {
      var vidIDVar = this.id;
      var commentVar = escape(document.getElementsByClassName("comment "+this.id)[0].value);
      //console.log(commentVar);
      var usernameVar = readCookie("username");
       //alert(commentVar + usernameVar);
       var http = new XMLHttpRequest();
       var parameters = usernameVar+"&"+commentVar+"&"+this.id;
       var url = "/videos/postComment/"
       http.open('POST',url+parameters,true);
       http.onload = function() {
         location.reload();
       }
       http.send();
    }
    else {
      alert("You must loggin to use this feature");
    }
  }


    commentBox.appendChild(video);
    commentBox.appendChild(info);
    var commentArea= document.createElement('div');
    commentArea.classList.add("commentArea");
    commentArea.classList.add(videos[i-1]);
    commentBox.appendChild(commentArea);
    commentBox.appendChild(commentsSection);

    info.appendChild(downVotes);
    info.appendChild(upVotes);
    downVotes.appendChild(downArrow);
    upVotes.appendChild(upArrow);


    insertComments(videos,i);
  }

  }
  xhr.send();
}

function insertComments(videos,i) {
  //add comments

  var videoID = videos[i-1];
  //alert(i);
  var parameters = videoID;

  var http = new XMLHttpRequest();
  var url = '/videos/comments/';
  console.log("called with videoID of "+videoID)
  http.open('GET', url+parameters,true);
  http.onload = function() {
    var comments = JSON.parse(http.responseText);
    //console.log(http.responseText);
    for (var y=2; y < comments.length; y=y+5) {
      var oneComment = document.createElement('div')
      oneComment.textContent = comments[y-1];
      oneComment.id = "oneComment";
      var upVotes = document.createElement('div');
      var downVotes = document.createElement('div');

      downVotes.textContent = comments[y+2];
      upVotes.textContent = comments[y+1];
      upVotes.id = "votes";
      downVotes.id = "votes";

      downVotes.classList.add(comments[y-3],"down");
      upVotes.classList.add(comments[y-3],"up");

      var downArrow = document.createElement("img");
      downArrow.src = "down-arrow.png";
      downArrow.classList.add("arrow");
      downArrow.id = comments[y-2];
      downArrow.onclick = function() {
        var url = '/comment/vote/';
        var parameters = "vote=-1 "+",id="+this.id;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url+parameters, true);
        xhr.onload = function() {

        }
        xhr.send();
        location.reload();
      }
      var upArrow = document.createElement("img");
      upArrow.src = "up-arrow.png";
      upArrow.classList.add("arrow");
      upArrow.id = comments[y-2];
      upArrow.onclick = function() {
        var url = '/comment/vote/';
        var parameters = "vote=+1 "+",id="+this.id;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url+parameters,true);
        xhr.onload = function() {

        }
        xhr.send();
        location.reload();
      }


      upVotes.appendChild(upArrow);
      oneComment.appendChild(upVotes);

      downVotes.appendChild(downArrow);
      oneComment.appendChild(downVotes);


      var post = document.createElement('p');
      post.textContent = comments[y]
      post.classList.add("wordwrap");


      var commentSec = document.getElementsByClassName('commentArea '+videoID)[0];
      commentSec.appendChild(oneComment);
      commentSec.appendChild(post);
    }
  }
  http.send();
}
