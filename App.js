import notifee, { AndroidImportance } from "@notifee/react-native";

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


var ws;
var peerConnectionScreen;
var peerConnectionVideo;
var ref_id = "08ff504f6719cde7a883b060061357f1";
var auth = "61e5e183c48232cf566ca407d44fe1f0";
var mc_token;
var sessionIdForPeerVideo;
var sessionIDVideo = new Date().getTime().toString();
var sessionIDScreen = new Date().getTime().toString() + 11;
import QRCode from 'react-native-qrcode-svg';
import React from "react";
import Browser from './Browser';


import {
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      count: "Call Demo",
      localStream: null,
      remoteStream: null,
      localScreenStream: null,
      publicBroadCast: null,
      localForGroup: null,
      localForGroupScreen: null,
      qrCode: null

    };
  }

  SetCount = () => {
    // this.setPeerConnection()
    // this.setPeerConnectionForScreen()
  };

  screen = () => {

    // this.groupVideo();

    // setTimeout(() => {
    //   // this.setPeerConnectionForScreenStreamForGroup
    //
    this.groupVideo();

    // this.forgroupCall();
    // this.groupVideo();

    setTimeout(() => {
      this.forgroupCall();

    }, 3000);
    //
    // }, 3000);
    // this.setPeerConnectionForScreenStreamForGroup
    // this.setPeerConnectionForScreen()
  };

  publicBroadCastScreen = () => {
    this.setPeerConnectionForScreenStreamPublic();

  }

  onetomany = () => {


    // this.setPeerConnectionForVideoStream();

    // setTimeout(() => {
      this.setPeerConnectionForScreenStream();

    // }, 3000);

  };


  componentDidMount() {


    // let wsUrl = encodeURI()
    ws = new WebSocket("wss://q-signalling.vdotok.dev:8443/call");

    notifee.onForegroundEvent(async ({ type, detail }) => {
      console.log('notif notif',type,detail)
      // @ts-ignore:next-line
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
        await notifee.stopForegroundService()
        this.emit('stop_session',{
          type:"STOP_SESSION"
        })
      }
    });

    ws.onopen = () => {
      // connection opened
      console.log("open");

      let jsonbody = {
        requestType: "register",
        type: "request",
        requestID: new Date().getTime().toString(),
        tenantID: "6NE92I",
        projectID: "6NE92I",
        referenceID: ref_id,
        authorizationToken: auth,
        socketType: 0,
      };
      const regMessage = JSON.stringify(jsonbody);
      console.log("register", regMessage);
      ws.send(regMessage);
    };

    ws.onmessage = (e) => {
      var messageData = JSON.parse(e.data);

      console.log("onmessage", messageData.requestType);
      console.log("data", messageData);


      switch (messageData.requestType) {
        case "register":
          // alert('registered')
          if (messageData.responseCode === 200) {
            // this.mc_token = messageData.mcToken
            console.log("You are registered successfully with vidtok server.", messageData);
            console.log("data", e.data);
            mc_token = JSON.parse(e.data).mcToken;
            console.log("mc", messageData.mcToken);
            // this.setPeerConnection()

            // this.emit("registered", registered{ type: "REGISTER_RESPONSE", message: "You are connected successfully registered with VDOTOK server." });
            setInterval(() => {
              this.sendPing();
            }, 3000);

          } else {
            console.log("error.", messageData);

            // this.log('You are not registered with vidtok server.', messageData)
            // this.emit("error", { type: "REGISTER_RESPONSE", message: "registeration failed with vdotok.", response: messageData.responseMessage });
          }
          // RegisterEventHandler_1.default.SetRegisterResponse(messageData, this);
          break;
        case "iceCandidate":
          this.onIceCandidate(messageData);
          break;
        case "startCommunication":
          this.callResponse(messageData);
          // this.CallResponse(messageData);
          break;
        case "session_invite":
          console.log("session invite");
          break;
        case "session_cancel":
          console.log("before clear peerConnectionVideo", peerConnectionVideo)
          console.log("before clear peerConnectionScreen", peerConnectionScreen)

          break;
        case "ping":
          // this.SendPacket({ requestType: 'pong', "mcToken": this.McToken });
          break;
        case "callResponse":
          // console.warn(" CallResponse: ", messageData);
          this.callResponse(messageData);
          break;
        case "incomingCall":
          // sessionUuId = messageData.sessionUUID;
          //
          // this.call_from=messageData.from;
          this.incomingCall(messageData);
          break;
        case "publicURL":
          this.setState({qrCode: messageData.url})
          break;
        default:
        // console.error('Unrecognized message', messageData);
      }
      // a message was received


    };

    ws.onerror = (e) => {
      console.log("erro", e.message);

      // an error occurred
      console.log(e.message);
    };

  }

  onIceCandidate = (respone: any) => {
    if (respone.sessionUUID == sessionIDScreen) {
      // console.log("###adding ice candidate to peer connection122", respone);
      peerConnectionScreen.addIceCandidate(respone.candidate);

    } else {
      // console.warn("####adding ice candidate to peer connectio2222", respone);
      peerConnectionVideo.addIceCandidate(respone.candidate);

    }
    // console.log('##adding ice candidate to peer connection122', respone);
    // peerConnectionScreen.addIceCandidate(respone.candidate)
  };
  setPeerConnection = async () => {
    console.log("hlllll");
    // let uUID = new Date().getTime().toString();
    // this.session_uuid = uUID
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    peerConnectionScreen = new RTCPeerConnection(configuration);
    // peerConnectionScreen.createDataChannel()
    // try {
    //   local = mediaDevices.getDisplayMedia({ video: true })
    //     .then(this.handleSuccess);
    // } catch (error) {
    //   console.log("error", error)
    // }
    //  local =  await
    //   mediaDevices.getDisplayMedia({ video: true })
    //     .then(this.handleSuccess,console.log(this));


    // console.log("peer",peerConnectionScreen)
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // channel = peerConnectionScreen.createDataChannel("chat");
    // const local = await mediaDevices.getDisplayMedia()
    // const local = await mediaDevices.getDisplayMedia({
    //   video: true,
    //   audio: false
    // });
    console.log("local", local);

    peerConnectionScreen.addStream(local);
    //
    local.getTracks().forEach(track => {
      peerConnectionScreen.getLocalStreams()[0].addTrack(track);
    });

    // console.error("peer BEFORE",this.state.localStream)
    //
    this.setState({ localStream: local });
    console.log("locallllllstream", this.state.localStream);
    this.creatSdp();

    peerConnectionScreen.onicecandidate = (event) => {
      // console.warn("on ie candidate-->", event.candidate.candidate);


      let uUID = new Date().getTime().toString();

      var candidates = {
        requestType: "onIceCandidate",
        type: "request",
        candidate: event.candidate.candidate,
        referenceID: ref_id,
        sessionUUID: uUID,
      };
      console.log("*****sending ice candidate--->", candidates);

      var jsonMessage = JSON.stringify(candidates);
      ws.send(jsonMessage);


      //   send event.candidate to peer
    };
    peerConnectionScreen.onaddstream = (event) => {
      // console.warn("remote streammm--->", event.stream);
      this.setState({ remoteStream: event.stream });
      console.log("remote11", this.state.remoteStream);

    };


  };

  // sendMess = () => {
  //   const obj = {
  //     "message": "msg",
  //     "timestamp": new Date()
  //   }
  //   channel.send(JSON.stringify(obj));
  //   console.log("send message",obj)
  // }

  setPeerConnectionForScreen = async () => {
    console.log("hlllll");
    try {

      // let uUID = new Date().getTime().toString();
      // this.session_uuid = uUID
      const local = await mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
      peerConnectionScreen = new RTCPeerConnection(configuration);
      // console.log("peer",peerConnectionScreen)

      // console.log("local",local)

      peerConnectionScreen.addStream(new MediaStream(local));
      //
      // local.getTracks().forEach(track => {
      //   peerConnectionScreen.getLocalStreams()[0].addTrack(track);
      // });

      // console.error("peer BEFORE",this.state.localStream)
      //
      this.setState({ localStream: local });
      console.log("locallllll", this.state.localStream);
      this.creatSdp();

      peerConnectionScreen.onicecandidate = (event) => {
        // console.warn("on ie candidate-->", event.candidate.candidate);


        let uUID = new Date().getTime().toString();

        var candidates = {
          requestType: "onIceCandidate",
          type: "request",
          candidate: event.candidate.candidate,
          referenceID: ref_id,
          sessionUUID: uUID,
        };
        console.log("*****sending ice candidate--->", candidates);

        var jsonMessage = JSON.stringify(candidates);
        ws.send(jsonMessage);


        //   send event.candidate to peer
      };
      peerConnectionScreen.onaddstream = (event) => {
        // console.warn("remote streammm--->", event.stream);
        this.setState({ remoteStream: event.stream });
        console.log("remote11", this.state.remoteStream);

      };
    } catch (error) {
      console.log("holaa", error);
    }


  };
  // setPeerConnectionForonetomanyvideo = async () => {
  //   console.log("hlllll");
  //   try {
  //
  //     // let uUID = new Date().getTime().toString();
  //     // this.session_uuid = uUID
  //     const local = await mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //
  //     const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
  //     peervideo = new RTCPeerConnection(configuration);
  //     // console.log("peer",peerConnectionScreen)
  //
  //     // console.log("local",local)
  //
  //     peervideo.addStream(new MediaStream(local));
  //     //
  //     // local.getTracks().forEach(track => {
  //     //   peerConnectionScreen.getLocalStreams()[0].addTrack(track);
  //     // });
  //
  //     // console.error("peer BEFORE",this.state.localStream)
  //     //
  //     this.setState({ localStream: local });
  //     console.log("locallllll", this.state.localStream);
  //     this.creatSdpForOnetoManyVideo();
  //
  //     peervideo.onicecandidate = (event) => {
  //       // console.warn("on ie candidate-->", event.candidate.candidate);
  //
  //
  //       let uUID = new Date().getTime().toString();
  //
  //       var candidates = {
  //         requestType: "onIceCandidate",
  //         type: "request",
  //         candidate: event.candidate.candidate,
  //         referenceID: ref_id,
  //         sessionUUID: uUID,
  //       };
  //       console.log("*****sending ice candidate--->", candidates);
  //
  //       var jsonMessage = JSON.stringify(candidates);
  //       ws.send(jsonMessage);
  //
  //
  //       //   send event.candidate to peer
  //     };
  //     peervideo.onaddstream = (event) => {
  //       // console.warn("remote streammm--->", event.stream);
  //       this.setState({ remoteStream: event.stream });
  //       console.log("remote11", this.state.remoteStream);
  //
  //     };
  //   } catch (error) {
  //     console.log("holaa", error);
  //   }
  //
  //
  // };

  incomingCall = async () => {
    console.log("hlllll");
    // let uUID = new Date().getTime().toString();
    // this.session_uuid = uUID
    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    peerConnectionScreen = new RTCPeerConnection(configuration);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // channel = peerConnectionScreen.createDataChannel("chat");
    console.log("local", local);

    this.setState({ localStream: local });
    peerConnectionScreen.addStream(local);
    // local.getTracks().forEach(track => {
    //   peerConnectionScreen.getLocalStreams()[0].addTrack(track);
    // });

    console.log("locallllllstream", this.state.localStream);
    this.createSdpForReceiver();
    peerConnectionScreen.onicecandidate = (event) => {
      console.log("on ie candidate-->", event);


      var message = {
        id: "onIceCandidate",
        requestType: "onIceCandidate",
        type: "request",
        candidate: event.candidate.candidate,
        referenceID: this.call_from,//(offerSDP user ICE Candidate)
        sessionUUID: this.session_uuid,
      };
      console.log("*****sending ice candidate--->", message);

      var jsonMessage = JSON.stringify(message);
      ws.send(jsonMessage);


      //   send event.candidate to peer
    };
    peerConnectionScreen.onaddstream = (event) => {
      // console.warn("remote streammm--->", event.stream);
      this.setState({ remoteStream: event.stream });
      // this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });

      //   alert('got remote stream')

    };
  };

  setPeerConnectionForScreenStream = async () => {
    try {

      const channelId = await notifee.createChannel({
        id: 'screen_capture',
        name: 'Screen Capture',
        lights: false,
        vibration: false,
        importance: AndroidImportance.DEFAULT
      });

      await notifee.displayNotification({
        title: "Camera Capture",
        body: 'This notification will be here until you stop capturing.',
        android: {
          channelId,
          asForegroundService: true,


          actions: [
            {
              title: 'Stop',
              pressAction: {
                id: 'stop',
              },
            },
          ],

        }
      })

      // let uUID = new Date().getTime().toString();
      // this.session_uuid = uUID
      const local = await mediaDevices.getDisplayMedia({  video: {
          fps: 12,
        }});

      const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
      peerConnectionScreen = new RTCPeerConnection(configuration);

      peerConnectionScreen.addStream(new MediaStream(local));

      // this.setState({ localScreenStream: local });
      this.createSdpForOnetoManyScreen();

      peerConnectionScreen.onicecandidate = (event) => {
        // console.warn("on ie candidate-->", event.candidate.candidate);


        let uUID = new Date().getTime().toString();

        var candidates = {
          requestType: "onIceCandidate",
          type: "request",
          candidate: event.candidate.candidate.toArray(),
          referenceID: ref_id,
          sessionUUID: sessionIDScreen,
        };
        console.log("*****sending ice candidate--->", candidates);

        var jsonMessage = JSON.stringify(candidates);
        ws.send(jsonMessage);


        //   send event.candidate to peer
      };
      peerConnectionScreen.onaddstream = (event) => {
        // console.warn("remote streammm--->", event.stream);
        // this.setState({ remoteStream: event.stream });
        // console.log("remote11", this.state.remoteStream);

      };
    } catch (error) {
      console.log("holaa", error);
    }


  };
  setPeerConnectionForScreenStreamPublic = async () => {
    try {

      // const channelId = await notifee.createChannel({
      //   id: 'screen_capture',
      //   name: 'Screen Capture',
      //   lights: false,
      //   vibration: false,
      //   importance: AndroidImportance.DEFAULT
      // });
      //
      // await notifee.displayNotification({
      //   title: "Camera Capture",
      //   body: 'This notification will be here until you stop capturing.',
      //   android: {
      //     channelId,
      //     asForegroundService: true,
      //
      //
      //     actions: [
      //       {
      //         title: 'Stop',
      //         pressAction: {
      //           id: 'stop',
      //         },
      //       },
      //     ],
      //
      //   }
      // })

      // let uUID = new Date().getTime().toString();
      // this.session_uuid = uUID
      // const local = await mediaDevices.getUserMedia({  video: {
      //     fps: 12,
      //   }});
      const local = await mediaDevices.getUserMedia({  video: true, audio: true});

      const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
      peerConnectionScreen = new RTCPeerConnection(configuration);

      peerConnectionScreen.addStream(new MediaStream(local));

      this.setState({ localScreenStream: local });
      this.createSdpForOnetoManyScreenForPublic();

      peerConnectionScreen.onicecandidate = (event) => {
        // console.warn("on ie candidate-->", event.candidate.candidate);


        let uUID = new Date().getTime().toString();

        var candidates = {
          requestType: "onIceCandidate",
          type: "request",
          candidate: event.candidate.candidate.toArray(),
          referenceID: ref_id,
          sessionUUID: sessionIDScreen,
        };
        console.log("*****sending ice candidate--->", candidates);

        var jsonMessage = JSON.stringify(candidates);
        ws.send(jsonMessage);


        //   send event.candidate to peer
      };
      peerConnectionScreen.onaddstream = (event) => {
        // console.warn("remote streammm--->", event.stream);
        // this.setState({ remoteStream: event.stream });
        // console.log("remote11", this.state.remoteStream);

      };
    } catch (error) {
      console.log("holaa", error);
    }


  };
  forgroupCall = async () => {
    try {

      const channelId = await notifee.createChannel({
        id: 'screen_capture',
        name: 'Screen Capture',
        lights: false,
        vibration: false,
        importance: AndroidImportance.DEFAULT
      });

      await notifee.displayNotification({
        title: "Camera Capture",
        body: 'This notification will be here until you stop capturing.',
        android: {
          channelId,
          asForegroundService: true,


          actions: [
            {
              title: 'Stop',
              pressAction: {
                id: 'stop',
              },
            },
          ],

        }
      })

      // let uUID = new Date().getTime().toString();
      // this.session_uuid = uUID
      const local = await mediaDevices.getDisplayMedia({  video: {
          fps: 12,
        }});

      const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
      peerConnectionScreen = new RTCPeerConnection(configuration);

      peerConnectionScreen.addStream(new MediaStream(local));

      this.setState({ localScreenStream: local });
      this.createSdpForOnetoManyScreenForGroup();

      peerConnectionScreen.onicecandidate = (event) => {
        // console.warn("on ie candidate-->", event.candidate.candidate);


        let uUID = new Date().getTime().toString();

        var candidates = {
          requestType: "onIceCandidate",
          type: "request",
          candidate: event.candidate.candidate.toArray(),
          referenceID: ref_id,
          sessionUUID: sessionIDScreen,
        };
        console.log("*****sending ice candidate--->", candidates);

        var jsonMessage = JSON.stringify(candidates);
        ws.send(jsonMessage);


        //   send event.candidate to peer
      };
      peerConnectionScreen.onaddstream = (event) => {
        // console.warn("remote streammm--->", event.stream);
        // this.setState({ remoteStream: event.stream });
        // console.log("remote11", this.state.remoteStream);

      };
    } catch (error) {
      console.log("holaa", error);
    }
  }

  setPeerConnectionForVideoStream = async () => {
    try {


      const local = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
      peerConnectionVideo = new RTCPeerConnection(configuration);

      peerConnectionVideo.addStream(new MediaStream(local));

      this.setState({ localStream: local });
      this.createSdpForOnetoManyVideo();

      peerConnectionVideo.onicecandidate = (event) => {
        // console.warn("on ie candidate-->", event.candidate.candidate);


        let uUID = new Date().getTime().toString();

        var candidates = {
          requestType: "onIceCandidate",
          type: "request",
          candidate: event.candidate.candidate.toArray(),
          referenceID: ref_id,
          sessionUUID: sessionIDVideo,
        };
        console.log("*****sending ice candidate--->", candidates);

        var jsonMessage = JSON.stringify(candidates);
        ws.send(jsonMessage);


        //   send event.candidate to peer
      };
      peerConnectionVideo.onaddstream = (event) => {
        // console.warn("remote streammm--->", event.stream);
        // this.setState({ remoteStream: event.stream });
        // console.log("remote11", this.state.remoteStream);

      };
    } catch (error) {
      console.log("holaa", error);
    }


  };
  groupVideo = async () => {
    try {


      const local = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
      peerConnectionVideo = new RTCPeerConnection(configuration);

      peerConnectionVideo.addStream(new MediaStream(local));

      this.setState({ localForGroup: local });
      this.createSdpForOnetoManyVideoforGroup();

      peerConnectionVideo.onicecandidate = (event) => {
        // console.warn("on ie candidate-->", event.candidate.candidate);


        let uUID = new Date().getTime().toString();

        var candidates = {
          requestType: "onIceCandidate",
          type: "request",
          candidate: event.candidate.candidate.toArray(),
          referenceID: ref_id,
          sessionUUID: sessionIDVideo,
        };
        console.log("*****sending ice candidate--->", candidates);

        var jsonMessage = JSON.stringify(candidates);
        ws.send(jsonMessage);


        //   send event.candidate to peer
      };
      peerConnectionVideo.onaddstream = (event) => {
        // console.warn("remote streammm--->", event.stream);
        // this.setState({ remoteStream: event.stream });
        // console.log("remote11", this.state.remoteStream);

      };
    } catch (error) {
      console.log("holaa", error);
    }


  };


  callResponse = (messageData: any) => {

    if (messageData.sessionUUID == sessionIDScreen) {
      // console.warn("thiss", messageData.sdpAnswer);

      peerConnectionScreen.setRemoteDescription(new RTCSessionDescription({

        type: "answer",
        sdp: messageData.sdpAnswer,
      }));
    } else {
      console.warn("thiss", messageData.sdpAnswer);

      peerConnectionVideo.setRemoteDescription(new RTCSessionDescription({

        type: "answer",
        sdp: messageData.sdpAnswer,
      }));


    }



  };
  createSdpForReceiver = async () => {
    console.log("creatSdp");

    const offerDescription = await peerConnectionScreen.createOffer();
    await peerConnectionScreen.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    console.log("offer", offer);

    let uUID = new Date().getTime().toString();
    let data = {
      "type": "request",
      "requestType": "session_invite",
      "sdpOffer": offer.sdp,
      "requestID": uUID,
      "sessionUUID": sessionUuId,
      "responseCode": 200,
      "responseMessage": "accepted",
    };
    let reqMessage = JSON.stringify(data);
    console.log("sending call request now", reqMessage);
    ws.send(reqMessage);
  };
  creatSdp = async () => {
    console.log("creatSdp");

    const offerDescription = await peerConnectionScreen.createOffer();
    await peerConnectionScreen.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    console.log("offer", offer);

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: ["4235fa8cd3a66a80437dcdbfe6cd0142"],
      type: "request",
      requestType: "session_invite",
      session_type: "call",
      call_type: "one_to_one",
      media_type: "video",
      requestID: uUID,
      sessionUUID: uUID,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    console.log("sending call request now", reqMessage);
    ws.send(reqMessage);

  };


  creatSdpForOnetoMany = async () => {
    console.log("creatSdp");

    const offerDescription = await peerConnectionScreen.createOffer();
    await peerConnectionScreen.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: ["4235fa8cd3a66a80437dcdbfe6cd0142"],
      type: "request",
      requestType: "session_invite",
      session_type: "call",
      call_type: "one_to_one",
      media_type: "video",
      requestID: uUID,
      sessionUUID: uUID,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    console.log("sending call request now", reqMessage);
    ws.send(reqMessage);

  };
  creatSdpForOnetoManyVideo = async () => {
    // console.warn("creatSdpforfirst");

    const offerDescription = await peervideo.createOffer();
    await peervideo.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    // let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: [],
      type: "request",
      requestType: "session_invite",
      session_type: "call",
      call_type: "one_to_many",
      media_type: "video",
      requestID: sessionUuId,
      sessionUUID: sessionUuId,
      mcToken: mc_token,
      broadcastType: 1,
      // associatedSessionUUID: sessionUuId + 1,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    sessionIdForPeerVideo = data.sessionUUID;
    console.log("sending call request now for first", reqMessage);
    console.log("for first session id", data.sessionUUID);
    ws.send(reqMessage);

  };


  createSdpForOnetoManyScreen = async () => {
    // console.warn("creatSdpforsecond");

    const offerDescription = await peerConnectionScreen.createOffer();
    await peerConnectionScreen.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: [],
      type: "request",
      requestType: "session_invite",
      session_type: "screen",
      call_type: "one_to_many",
      media_type: "video",
      // associatedSessionUUID: sessionIDVideo,
      requestID: sessionIDScreen,
      sessionUUID: sessionIDScreen,
      broadcastType: 1,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    this.setState({localScreenStream: "hellooooo"})
    console.log("sending call request for second", reqMessage);
    ws.send(reqMessage);

  };
  createSdpForOnetoManyScreenForPublic = async () => {
    // console.warn("creatSdpforsecond");

    const offerDescription = await peerConnectionScreen.createOffer();
    await peerConnectionScreen.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: [],
      type: "request",
      requestType: "session_invite",
      session_type: "call",
      call_type: "one_to_many",
      media_type: "video",
      // associatedSessionUUID: sessionIDVideo,
      requestID: sessionIDScreen,
      sessionUUID: sessionIDScreen,
      broadcastType: 1,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    this.setState({publicBroadCast: "helloooossso"})
    console.log("sending call request for second", reqMessage);
    ws.send(reqMessage);

  };


  createSdpForOnetoManyScreenForGroup = async () => {
    // console.warn("creatSdpforsecond");

    const offerDescription = await peerConnectionScreen.createOffer();
    await peerConnectionScreen.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: ["8d02df691ac3a9eaa36f41b5a71b4340"],
      type: "request",
      requestType: "session_invite",
      session_type: "screen",
      call_type: "one_to_many",
      media_type: "video",
      associatedSessionUUID: sessionIDVideo,
      requestID: sessionIDScreen,
      sessionUUID: sessionIDScreen,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    // this.setState({publicBroadCast: "helloooossso"})
    console.log("sending call request for second", reqMessage);
    ws.send(reqMessage);

  };

  createSdpForOnetoManyVideo = async () => {
    // console.warn("creatSdpforsecond");

    const offerDescription = await peerConnectionVideo.createOffer();
    await peerConnectionVideo.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: [],
      type: "request",
      requestType: "session_invite",
      session_type: "call",
      call_type: "one_to_many",
      media_type: "video",
      associatedSessionUUID: sessionIDScreen,
      requestID: sessionIDVideo,
      sessionUUID: sessionIDVideo,
      broadcastType: 1,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    console.log("sending call request for second", reqMessage);
    ws.send(reqMessage);

  };
  createSdpForOnetoManyVideoforGroup = async () => {
    // console.warn("creatSdpforsecond");

    const offerDescription = await peerConnectionVideo.createOffer();
    await peerConnectionVideo.setLocalDescription(offerDescription);
    console.log("offerdescription");
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    // console.log("offer",offer )

    let uUID = new Date().getTime().toString();
    let data = {
      //"id":"call",
      from: ref_id,
      to: ["8d02df691ac3a9eaa36f41b5a71b4340"],
      type: "request",
      requestType: "session_invite",
      session_type: "call",
      call_type: "one_to_many",
      media_type: "video",
      associatedSessionUUID: sessionIDScreen,
      requestID: sessionIDVideo,
      sessionUUID: sessionIDVideo,
      mcToken: mc_token,
      sdpOffer: offer.sdp,
      data: {},
    };
    let reqMessage = JSON.stringify(data);
    console.log("sending call request for second", reqMessage);
    ws.send(reqMessage);

  };

  sendPing = () => {
    console.log("sending ping req");
    let p = {
      "requestID": new Date().getTime().toString(),
      "requestType": "ping",
      "mcToken": mc_token,
    };
    ws.send(JSON.stringify(p));
  };

  render() {
    // console.log("hunnn", this.state.remoteStream);
    // console.log("locallllllllll112", this.state.localStream);

    const { count } = this.state;

    return (
      <View style={{flex: 1}}>
        <Text style={{ fontSize: 50 }}>{count}</Text>

        <View style={{flexDirection: "row",width: "100%" }}>
        {this.state.qrCode && (
            <QRCode
              value={this.state.qrCode}/>
            )}


        {/*{ this.state.localStream && (*/}
        {/*  <>*/}

        {/*    <RTCView streamURL={this.state.localStream.toURL()}*/}
        {/*             style={{ height:"100%", width:"70%" }}></RTCView></>)*/}
        {/*}*/}

        </View>
        { this.state.localForGroup && (
          <>

            <RTCView streamURL={this.state.localForGroup.toURL()}
                     style={{ height:"30%", width:"30%" }}></RTCView></>)
        }

        <TouchableOpacity
          onPress={this.publicBroadCastScreen}>
          <Text>Public single screen share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.screen}>
          <Text>screen Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onetomany}>
          <Text>one to many screen Call</Text>
        </TouchableOpacity>


          {this.state.localScreenStream && (
            <View style={{height: "50%", width: "100%"}}>

              <RTCView  streamURL={this.state.localScreenStream.toURL()} style={{ height: '20%', width: '20%' }}></RTCView>
              {/*<Browser/>*/}
            </View>

            )}

        <View style={{height: "50%", width: "100%"}}>
          {/*{this.state.publicBroadCast && (*/}
          {/*  <>*/}

          {/*    <Browser/>*/}
          {/*  </>)}*/}




          {/*<QRCode*/}
          {/*  value={this.state.qrCode}*/}
          {/*  size={200} />*/}
        </View>






        {/*<TouchableOpacity*/}
        {/*  onPress={this.SetCount}>*/}
        {/*  <Text>Video Call</Text>*/}
        {/*</TouchableOpacity>*/}


        {/*{this.state.remoteStream && (*/}
        {/*  <>*/}

        {/*    <RTCView  streamURL={this.state.remoteStream.toURL()} style={{ height: '20%', width: '20%' }}></RTCView></>)}*/}

        {/*<TouchableOpacity*/}
        {/*  onPress={this.screen}>*/}
        {/*  <Text>screen Call</Text>*/}
        {/*</TouchableOpacity>*/}

        {/*<TouchableOpacity*/}
        {/*  onPress={this.onetomany}>*/}
        {/*  <Text>one to many screen Call</Text>*/}
        {/*</TouchableOpacity>*/}


        {/*{this.state.remoteStream && (*/}
        {/*  <>*/}

        {/*    <RTCView zOrder={2} zIndex={2} streamURL={this.state.remoteStream.toURL()} style={{ height: '30%', width: '30%',zIndex:2  }}></RTCView></>)}*/}

        {/*{this.state.localScreenStream && (*/}
        {/*  <>*/}

        {/*    <RTCView zOrder={2} zIndex={2} mirror={false} streamURL={this.state.localScreenStream.toURL()}*/}
        {/*             style={{ height: "40%", width: "40%", zIndex: 2 }}></RTCView></>)}*/}


      </View>
    );
  }
}

export default App;


