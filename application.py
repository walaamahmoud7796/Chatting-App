import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
from flask_jsglue import JSGlue
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

votes = {"yes": 0, "no": 0, "maybe": 0}
ava_channels = {"available_channels":[]}

# ava_msgs={"channel":[{"name":"","msgs":[{"msg":"","user":""}]}]}
currentChannel=""

ava_msgs={}
jsglue = JSGlue(app)
@app.route("/")
def index():
    return render_template("index.html", votes=votes)

@app.route('/IsOpen',methods=['GET'])
def IsOpen():
    if len(ava_channels['ava_channels'])==0:
        return jsonify({"success":False})

    return jsonify({"success":True})

@app.route('/GetCurrentChannel', methods=["GET"])
def GetCurrentChannel():
    print('ana hna fe current')

    print(currentChannel)
    if currentChannel=="":
        return jsonify({"success":False})
    return jsonify({"success":True,"currentChannel":currentChannel})

@socketio.on('get channels',namespace='/channels')
def get_channels():
    emit('channel list',ava_channels)
@socketio.on('add channel',namespace='/channels')
def add_channel(data):
    print(data)
    ava_channels['available_channels'].append(data['channel_name'])
    ava_msgs[data['channel_name']]=[]
    emit('new channel',data['channel_name'],broadcast = True)

@socketio.on('send msg',namespace='/channel')
def send_msg(data):
    print(data)
    msg = {'user':data['user'],'msg':data['msg']}
    ava_msgs[data['currentChannel']].append(msg)
    print(ava_msgs[data['currentChannel']])
    emit('recieve msg',data,broadcast=True)

@socketio.on('delete msg',namespace='/channel')
def delete_msg(data):
    print('ana fe delete')
    print(data)
    for i in range(len(ava_msgs[data['channel_name']])):
        print(ava_msgs[data['channel_name']][i]['user'])
        if ava_msgs[data['channel_name']][i]['user']==data['user'] and ava_msgs[data['channel_name']][i]['msg']==data['msg']:
            ava_msgs[data['channel_name']][i]['msg']="This message was deleted"

    emit('msg deleted',data,broadcast=True)
@app.route('/channels')
def channels():
    return render_template('channels.html')


@app.route('/channel/<string:channel_name>')
def channel(channel_name):
    print(channel_name)
    print("hello from channel")
    global currentChannel
    currentChannel=channel_name
    print(len(ava_msgs))
    return render_template('channel.html',channel_name=channel_name,ava_msgs=ava_msgs)
