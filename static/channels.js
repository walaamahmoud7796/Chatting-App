document.addEventListener('DOMContentLoaded', () => {


    // Connect to websocket

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port+'/channels');

    if(!localStorage.getItem('currentChannel')){
      localStorage.setItem('currentChannel','');
    }
    console.log('hello');

    socket.on('connect',() => {
      console.log("ana fe connect");
      document.querySelector('p').innerHTML ="ana fe connect";
      socket.emit('get channels');


    });


    socket.on('channel list',data=>{
          // As long as <ul> has a child node, remove it

        for(i=0;i<data.available_channels.length;i++){
          console.log("ana fe channel list")
        // console.log(data.available_channels[i]);
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.innerHTML = data.available_channels[i];
        // var str= "{{url_for('channel',channel_name=`${data.available_channels[i]}`)}}"
        // console.log(str);
        // link.href = str;
        link.href = Flask.url_for('channel',{channel_name:data.available_channels[i]});

        item.appendChild(link);

        document.querySelector('#channel-list').appendChild(item);
      }
      document.querySelector('p').innerHTML ="Available Channels";
      console.log(data);
    });


    document.querySelector('button').onclick = ()=>{
      var channel_name = document.querySelector('input').value;
      console.log(channel_name);
      console.log("ana fe add channel");

      socket.emit('add channel',{"channel_name":channel_name});
    };


    socket.on('new channel',data=>{
      document.querySelector('p').innerHTML ="ana fe new channel";
      console.log("ana fe new channel");
      console.log(data);
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.innerHTML=data;
      link.href = Flask.url_for('channel',{channel_name:data});
      link.value = data;

      // link.href = "https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_anchor_href2"
      // link.href = Flask.url_for({{'channel',channel_name = data}});
      item.appendChild(link);
      document.querySelector('#channel-list').appendChild(item);
    });

});
