
function setStorage(){
  console.log('ana fe storage');
    var request = new XMLHttpRequest;
    request.open('GET','/GetCurrentChannel');
    request.onload=()=>{
      console.log('ana fe onload')
      const data = JSON.parse(request.responseText);
      console.log(data);
      if(data.success){
        console.log(data.currentChannel);
        localStorage['currentChannel'] =data.currentChannel;
      }
    }

    request.send();

}
function createDeletebutton(div){
  btn = document.createElement('button');
  btn.innerHTML = "Delete";
  div.appendChild(btn);


}

document.addEventListener('DOMContentLoaded',()=>{
  console.log(localStorage.currentChannel);
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port+'/channel');

  document.querySelectorAll('div').forEach(div=>{
    console.log(div.firstElementChild.textContent);
    console.log(div.childNodes[3].innerHTML);
    if(div.childNodes[3].innerHTML!="This message was deleted"){console.log('ana leeh hna');}
    if(div.firstElementChild.textContent==localStorage.user && div.childNodes[3].innerHTML!="This message was deleted"){
      createDeletebutton(div);
    }
    div.appendChild(document.createElement('hr'));


  });
  socket.on('connect', () => {
    document.querySelectorAll('button').forEach(button=>{

        button.onclick=()=>{
          console.log('I am herererererr');
          if(button.id=="send"){
          const msg = document.querySelector('input').value;
          console.log(msg);
          socket.emit('send msg',{'user':localStorage.user,'msg':msg,'currentChannel':localStorage.currentChannel});
          console.log('ana leeh msh hna');
          console.log(button.id);}
          else{
          parent = button.parentElement;
          const msg = parent.children[1].innerHTML;
          socket.emit('delete msg',{"channel_name":localStorage.currentChannel,"user":localStorage.user,"msg":msg});
        }
      }
    });
  });
  socket.on('msg deleted',data=>{
    console.log('ana fe deleted')
      document.querySelectorAll('div').forEach(div=>{
        console.log(div.children[0].innerHTML);
        console.log(div.children[1].innerHTML);

        if(div.children[0].innerHTML==data.user &&div.children[1].innerHTML==data.msg){
          div.children[1].innerHTML = "This message was deleted";
          div.children[1].style = "color:#808080;";
          if(div.children.length==4)
          div.removeChild(div.children[2]);

        }
      });
  });
  socket.on('recieve msg',data=>{
    console.log(data)
    if(data.currentChannel==localStorage.currentChannel){
    div = document.createElement('div')
    user = document.createElement('h3');
    msg = document.createElement('p');
    text = document.createTextNode(data.user);
    user.appendChild(text);
    text = document.createTextNode(data.msg);
    msg.appendChild(text);
    div.appendChild(user);
    div.appendChild(msg);
    if(localStorage.user== data.user)
      {
        createDeletebutton(div);
      }
    div.appendChild(document.createElement('hr'));

    document.body.appendChild(div)
  }
  });

});
