function server_is_working(){
  var request = new XMLHttpRequest;
  request.open('GET','/IsOpen');
  request.send();
  request.onload=()=>{
  const data = JSON.parse(request.responseText);
    return data.sucess;
  }

}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('button').onclick = ()=>{
    display_name = document.querySelector('input').value;
    localStorage.setItem('user',display_name);
    location.replace('channels');

  }
  if(server_is_working())
  {
  if(!localStorage.getItem('user')){
    localStorage.setItem('user','');
  }else{
    console.log('hello');
    location.replace('channels');
    if(!localStorage.getItem('currentChannel')){
      localStorage.setItem('currentChannel','');
    }
    else{
      location.replace(`channel/${localStorage.currentChannel}`);
    }
  }
}
else{
  localStorage.clear()
}

});
