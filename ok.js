// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */
//
// var ws
// var pc
// var channel
// var peervideo
// var ref_id = "08ff504f6719cde7a883b060061357f1"
// var auth = "61e5e183c48232cf566ca407d44fe1f0"
// var mc_token
// var sessionIdForPeerVideo
// var sessionUuId = new Date().getTime().toString();
// import React from 'react';
// import notifee, { AndroidImportance } from '@notifee/react-native';
//
// import {
//   TouchableOpacity,
//   Text,
//   View,
// } from 'react-native';
// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals
// } from 'react-native-webrtc';
// class App extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       count: "Call Demo",
//       localStream: null,
//       remoteStream: null,
//       localScreenStream: null
//
//     }
//   }
//   SetCount = () => {
//
//     this.setPeerConnection()
//     // this.setPeerConnectionForScreen()
//   }
//
//   screen = () => {
//
//     this.setPeerConnectionForScreen()
//   }
//
//   onetomany = () => {
//
//     this.setPeerConnectionForScreenStream2()
//     // this.setPeerConnectionForScreenStream3()
//
//
//     // setTimeout(() => {
//     //   this.setPeerConnectionForonetomanyvideo()
//     // }, 3000);
//     // this.setPeerConnectionForScreenStream2()
//   }
//
//
//   componentDidMount() {
//
//     // let wsUrl = encodeURI()
//     ws = new WebSocket('wss://q-signalling.vdotok.dev:8443/call');
//
//     ws.onopen = () => {
//       // connection opened
//       console.log("open")
//
//       let jsonbody = {
//         requestType: "register",
//         type: "request",
//         requestID: new Date().getTime().toString(),
//         tenantID: '6NE92I',
//         projectID: '6NE92I',
//         referenceID: ref_id,
//         authorizationToken: auth,
//         socketType: 0
//       }
//       const regMessage = JSON.stringify(jsonbody);
//       console.log("register", regMessage);
//       ws.send(regMessage);
//     };
//
//     ws.onmessage = (e) => {
//       var messageData = JSON.parse(e.data);
//
//       console.log("onmessage",messageData.requestType)
//       console.log("data",messageData)
//
//
//       switch (messageData.requestType) {
//         case 'register':
//           // alert('registered')
//           if (messageData.responseCode === 200) {
//             // this.mc_token = messageData.mcToken
//             console.log('You are registered successfully with vidtok server.', messageData)
//             console.log("data",e.data);
//             mc_token = JSON.parse(e.data).mcToken
//             console.log("mc", messageData.mcToken)
//             // this.setPeerConnection()
//
//             // this.emit("registered", registered{ type: "REGISTER_RESPONSE", message: "You are connected successfully registered with VDOTOK server." });
//             setInterval(() => {
//               this.sendPing();
//             }, 3000);
//
//           } else {
//             console.log('error.', messageData)
//
//             // this.log('You are not registered with vidtok server.', messageData)
//             // this.emit("error", { type: "REGISTER_RESPONSE", message: "registeration failed with vdotok.", response: messageData.responseMessage });
//           }
//           // RegisterEventHandler_1.default.SetRegisterResponse(messageData, this);
//           break;
//         case 'iceCandidate':
//           this.onIceCandidate(messageData)
//           break;
//         case 'startCommunication':
//           this.callResponse(messageData);
//           // this.CallResponse(messageData);
//           break;
//         case 'session_invite':
//           console.log('session invite');
//           break;
//         case 'session_cancel':
//           break;
//         case 'ping':
//           // this.SendPacket({ requestType: 'pong', "mcToken": this.McToken });
//           break;
//         case 'callResponse':
//           console.warn(' CallResponse: ', messageData);
//           this.callResponse(messageData);
//           break;
//         case 'incomingCall':
//           sessionUuId=messageData.sessionUUID;
//           //
//           // this.call_from=messageData.from;
//           this.incomingCall(messageData);
//           break;
//         default:
//         // console.error('Unrecognized message', messageData);
//       }
//       // a message was received
//
//
//
//
//     };
//
//     ws.onerror = (e) => {
//       console.log("erro", e.message)
//
//       // an error occurred
//       console.log(e.message);
//     };
//
//   }
//
//   onIceCandidate = (respone: any) => {
//     if (respone.sessionUUID == sessionIdForPeerVideo) {
//       console.log('###adding ice candidate to peer connection122', respone);
//       peervideo.addIceCandidate(respone.candidate)
//
//     } else {
//       console.warn('####adding ice candidate to peer connectio2222', respone);
//       pc.addIceCandidate(respone.candidate)
//
//     }
//     // console.log('##adding ice candidate to peer connection122', respone);
//     // pc.addIceCandidate(respone.candidate)
//   }
//   setPeerConnection = async () => {
//     console.log("hlllll")
//     // let uUID = new Date().getTime().toString();
//     // this.session_uuid = uUID
//     const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//     pc = new RTCPeerConnection(configuration);
//     // pc.createDataChannel()
//     // try {
//     //   local = mediaDevices.getDisplayMedia({ video: true })
//     //     .then(this.handleSuccess);
//     // } catch (error) {
//     //   console.log("error", error)
//     // }
//     //  local =  await
//     //   mediaDevices.getDisplayMedia({ video: true })
//     //     .then(this.handleSuccess,console.log(this));
//
//
//     // console.log("peer",pc)
//     const local = await mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//
//     // channel = pc.createDataChannel("chat");
//     // const local = await mediaDevices.getDisplayMedia()
//     // const local = await mediaDevices.getDisplayMedia({
//     //   video: true,
//     //   audio: false
//     // });
//     console.log("local",local)
//
//     pc.addStream(local);
//     //
//     local.getTracks().forEach(track => {
//       pc.getLocalStreams()[0].addTrack(track);
//     });
//
//     // console.error("peer BEFORE",this.state.localStream)
//     //
//     this.setState({localStream: local})
//     console.log("locallllllstream",this.state.localStream)
//     this.creatSdp()
//
//     pc.onicecandidate = (event)=> {
//       console.warn('on ie candidate-->',event.candidate.candidate);
//
//
//
//       let uUID = new Date().getTime().toString();
//
//       var candidates = {
//         requestType : 'onIceCandidate',
//         type:"request",
//         candidate : event.candidate.candidate,
//         referenceID:ref_id,
//         sessionUUID : uUID
//       };
//       console.log('*****sending ice candidate--->',candidates);
//
//       var jsonMessage = JSON.stringify(candidates);
//       ws.send(jsonMessage)
//
//
//       //   send event.candidate to peer
//     };
//     pc.onaddstream=(event)=>{
//       console.warn('remote streammm--->',event.stream);
//       this.setState({remoteStream: event.stream})
//       console.log("remote11", this.state.remoteStream)
//
//     };
//
//
//
//   }
//
//   // sendMess = () => {
//   //   const obj = {
//   //     "message": "msg",
//   //     "timestamp": new Date()
//   //   }
//   //   channel.send(JSON.stringify(obj));
//   //   console.log("send message",obj)
//   // }
//   handleSuccess = async (stream) => {
//     console.log("thisss", stream)
//
//     pc.addStream(local);
//     //
//     local.getTracks().forEach(track => {
//       pc.getLocalStreams()[0].addTrack(track);
//     });
//
//     // console.error("peer BEFORE",this.state.localStream)
//     //
//     this.setState({localStream: local})
//
//     // console.log("locallllllstream",this.state.localStream)
//     this.creatSdp()
//
//     console.log('streamvalue' + JSON.stringify(stream));
//
//
//
//     this.state.localStream.getVideoTracks().forEach((track) => {
//
//       console.log('streamvalue------whencalling' + JSON.stringify(this.state.localStream.getVideoTracks()));
//
//       this.state.localStream.removeTrack(track)
//
//
//       console.log('streamvalue------afterremoved' + JSON.stringify(this.state.localStream.getVideoTracks()));
//
//       console.log('streamvalue------first' + JSON.stringify(track));
//
//     });
//     console.log('streamvalue------' + JSON.stringify(stream.getTracks()[0]));
//
//
//     this.state.localStream.addTrack(stream.getTracks()[0]);
//
//
//     console.log('streamvalue------afterreplace' + JSON.stringify(this.state.localStream.getVideoTracks()));
//
//     this.setState({
//       localStream: stream
//     })
//
//     this.localSYS.addStream(stream)
//
//     // demonstrates how to detect that the user has stopped
//     // sharing the screen via the browser UI.
//     stream.getVideoTracks()[0].addEventListener('ended', () => {
//
//       // this.videoStreamSender
//       // .find((sender) => sender.track.kind === 'video')
//       // .replaceTrack(this.SharescreenReplace.getTracks()[1]);
//
//
//       console.log('The user has ended sharing the screen');
//
//     });
//   }
//
//   setPeerConnectionForScreen = async () => {
//     console.log("hlllll")
//     try {
//       const channelId = await notifee.createChannel({
//         id: 'screen_capture',
//         name: 'Screen Capture',
//         lights: false,
//         vibration: false,
//         importance: AndroidImportance.DEFAULT
//       });
//       await notifee.displayNotification({
//         title: 'Screen Capture',
//         body: 'This notification will be here until you stop capturing.',
//         android: {
//           channelId,
//           asForegroundService: true
//         }
//       });
//
//       // let uUID = new Date().getTime().toString();
//       // this.session_uuid = uUID
//       const local = await mediaDevices.getDisplayMedia({  video: true,
//         audio: true, });
//
//       const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
//       pc = new RTCPeerConnection(configuration);
//       // console.log("peer",pc)
//
//       // console.log("local",local)
//
//       pc.addStream(new MediaStream(local));
//       //
//       // local.getTracks().forEach(track => {
//       //   pc.getLocalStreams()[0].addTrack(track);
//       // });
//
//       // console.error("peer BEFORE",this.state.localStream)
//       //
//       this.setState({ localStream: local })
//       console.log("locallllll", this.state.localStream)
//       this.creatSdp()
//
//       pc.onicecandidate = (event) => {
//         console.warn('on ie candidate-->', event.candidate.candidate);
//
//
//         let uUID = new Date().getTime().toString();
//
//         var candidates = {
//           requestType: 'onIceCandidate',
//           type: "request",
//           candidate: event.candidate.candidate,
//           referenceID: ref_id,
//           sessionUUID: uUID
//         };
//         console.log('*****sending ice candidate--->', candidates);
//
//         var jsonMessage = JSON.stringify(candidates);
//         ws.send(jsonMessage)
//
//
//         //   send event.candidate to peer
//       };
//       pc.onaddstream = (event) => {
//         console.warn('remote streammm--->', event.stream);
//         this.setState({ remoteStream: event.stream })
//         console.log("remote11", this.state.remoteStream)
//
//       };
//     } catch (error) {
//       console.log("holaa", error)
//     }
//
//
//
//   }
//   setPeerConnectionForonetomanyvideo = async () => {
//     console.log("hlllll")
//     try {
//
//       // let uUID = new Date().getTime().toString();
//       // this.session_uuid = uUID
//       const local = await mediaDevices.getUserMedia({  video: true,
//         audio: true, });
//
//       const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
//       peervideo = new RTCPeerConnection(configuration);
//       // console.log("peer",pc)
//
//       // console.log("local",local)
//
//       peervideo.addStream(new MediaStream(local));
//       //
//       // local.getTracks().forEach(track => {
//       //   pc.getLocalStreams()[0].addTrack(track);
//       // });
//
//       // console.error("peer BEFORE",this.state.localStream)
//       //
//       this.setState({ localStream: local })
//       console.log("locallllll", this.state.localStream)
//       this.creatSdpForOnetoManyVideo()
//
//       peervideo.onicecandidate = (event) => {
//         console.warn('on ie candidate-->', event.candidate.candidate);
//
//
//         let uUID = new Date().getTime().toString();
//
//         var candidates = {
//           requestType: 'onIceCandidate',
//           type: "request",
//           candidate: event.candidate.candidate,
//           referenceID: ref_id,
//           sessionUUID: uUID
//         };
//         console.log('*****sending ice candidate--->', candidates);
//
//         var jsonMessage = JSON.stringify(candidates);
//         ws.send(jsonMessage)
//
//
//         //   send event.candidate to peer
//       };
//       peervideo.onaddstream = (event) => {
//         console.warn('remote streammm--->', event.stream);
//         this.setState({ remoteStream: event.stream })
//         console.log("remote11", this.state.remoteStream)
//
//       };
//     } catch (error) {
//       console.log("holaa", error)
//     }
//
//
//
//   }
//
//   incomingCall = async () => {
//     console.log("hlllll")
//     // let uUID = new Date().getTime().toString();
//     // this.session_uuid = uUID
//     const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
//     pc = new RTCPeerConnection(configuration);
//     const local =  await mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//
//     // channel = pc.createDataChannel("chat");
//     console.log("local",local)
//
//     this.setState({localStream: local})
//     pc.addStream(local);
//     // local.getTracks().forEach(track => {
//     //   pc.getLocalStreams()[0].addTrack(track);
//     // });
//
//     console.log("locallllllstream",this.state.localStream)
//     this.createSdpForReceiver()
//     pc.onicecandidate = (event) => {
//       console.log('on ie candidate-->', event);
//
//
//       var message = {
//         id: 'onIceCandidate',
//         requestType: 'onIceCandidate',
//         type: "request",
//         candidate: event.candidate.candidate,
//         referenceID: this.call_from,//(offerSDP user ICE Candidate)
//         sessionUUID: this.session_uuid
//       };
//       console.log('*****sending ice candidate--->', message);
//
//       var jsonMessage = JSON.stringify(message);
//       ws.send(jsonMessage)
//
//
//       //   send event.candidate to peer
//     };
//     pc.onaddstream = (event) => {
//       console.warn('remote streammm--->', event.stream);
//       this.setState({ remoteStream: event.stream })
//       // this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });
//
//       //   alert('got remote stream')
//
//     }
//     // Got stream!
//
//
//     // Log error
//     // });
//
//     // });
//     //
//     // this.log('adding stream in pc-->', pc);
//     // pc.addStream(new MediaStream(stream))
//     // this.log('adding stream in pc-->', pc);
//     // pc.createOffer({}).then(desc => {
//     //   this.log('desccccc', desc);
//     //   let description: any = new RTCSessionDescription(
//     //     {
//     //       // @ts-ignore:next-line
//     //       type: desc.type,
//     //       // @ts-ignore:next-line
//     //       sdp: desc.sdp
//     //     }
//     //   )
//     //   pc.setLocalDescription(description).then(() => {
//     //     this.log('GsetLocalDescription');
//     //     // Send pc.localDescription to peer
//     //     let response = {
//     //       "type": "request",
//     //       "requestType": "session_invite",
//     //       "sdpOffer": description.sdp,
//     //       "requestID": uUID,
//     //       "sessionUUID": this.session_uuid,
//     //       "responseCode": 200,
//     //       "responseMessage": "accepted"
//     //     };
//     //
//     //     let reqMessage = JSON.stringify(response);
//     //     this.log("===OnOffering Answer", reqMessage);
//     //
//     //     this.ws.send(reqMessage);
//     //   });
//     // });
//     // pc.onicecandidate = (event) => {
//     //   this.log('on ie candidate-->', event);
//     //
//     //
//     //   var message = {
//     //     id: 'onIceCandidate',
//     //     requestType: 'onIceCandidate',
//     //     type: "request",
//     //     candidate: event.candidate.candidate,
//     //     referenceID: this.call_from,//(offerSDP user ICE Candidate)
//     //     sessionUUID: this.session_uuid
//     //   };
//     //   this.log('*****sending ice candidate--->', message);
//     //
//     //   var jsonMessage = JSON.stringify(message);
//     //   this.ws.send(jsonMessage)
//     //
//     //
//     //   //   send event.candidate to peer
//     // };
//     //       pc.onaddstream = (event) => {
//     //         console.warn('remote streammm--->', event.stream);
//     //         this.setState({ remoteStream: event.stream })
//     //         // this.emit("remote_stream", { type: "GOT_REMOTE_STREAM", message: "this is remote stream", stream: (event as any).stream });
//     //
//     //         //   alert('got remote stream')
//     //
//     //       }
//     //       // Got stream!
//     //     })
//     //     .catch(error => {
//     //       console.log('error-->', error);
//     //
//     //       // Log error
//     //     });
//     // });
//   }
//   setPeerConnectionForScreenStream2 = async () => {
//     console.log("hlllll")
//     try {
//       const channelId = await notifee.createChannel({
//         id: 'screen_capture',
//         name: 'Screen Capture',
//         lights: false,
//         vibration: false,
//         importance: AndroidImportance.DEFAULT
//       });
//       await notifee.displayNotification({
//         title: 'Screen Capture',
//         body: 'This notification will be here until you stop capturing.',
//         android: {
//           channelId,
//           asForegroundService: true
//         }
//       });
//
//       // let uUID = new Date().getTime().toString();
//       // this.session_uuid = uUID
//       const local = await mediaDevices.getDisplayMedia({  video: true,
//         audio: true, });
//
//       const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
//       pc = new RTCPeerConnection(configuration);
//       // console.log("peer",pc)
//
//       // console.log("local",local)
//
//       pc.addStream(new MediaStream(local));
//       //
//       // local.getTracks().forEach(track => {
//       //   pc.getLocalStreams()[0].addTrack(track);
//       // });
//
//       // console.error("peer BEFORE",this.state.localStream)
//       //
//       this.setState({ localScreenStream: local })
//       // console.log("locallllll", this.state.localStream)
//       this.creatSdpForOnetoManyScreen()
//
//       pc.onicecandidate = (event) => {
//         console.warn('on ie candidate-->', event.candidate.candidate);
//
//
//         let uUID = new Date().getTime().toString();
//
//         var candidates = {
//           requestType: 'onIceCandidate',
//           type: "request",
//           candidate: event.candidate.candidate,
//           referenceID: ref_id,
//           sessionUUID: uUID
//         };
//         console.log('*****sending ice candidate--->', candidates);
//
//         var jsonMessage = JSON.stringify(candidates);
//         ws.send(jsonMessage)
//
//
//         //   send event.candidate to peer
//       };
//       pc.onaddstream = (event) => {
//         console.warn('remote streammm--->', event.stream);
//         this.setState({ remoteStream: event.stream })
//         console.log("remote11", this.state.remoteStream)
//
//       };
//     } catch (error) {
//       console.log("holaa", error)
//     }
//
//
//
//   }
//
//   setPeerConnectionForScreenStream3 = async () => {
//     console.log("hlllll")
//     try {
//       // let uUID = new Date().getTime().toString();
//       // this.session_uuid = uUID
//       const local = await mediaDevices.getUserMedia({  video: true,
//         audio: true, });
//
//       const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
//       pc = new RTCPeerConnection(configuration);
//       // console.log("peer",pc)
//
//       // console.log("local",local)
//
//       pc.addStream(new MediaStream(local));
//       //
//       // local.getTracks().forEach(track => {
//       //   pc.getLocalStreams()[0].addTrack(track);
//       // });
//
//       // console.error("peer BEFORE",this.state.localStream)
//       //
//       this.setState({ localScreenStream: local })
//       // console.log("locallllll", this.state.localStream)
//       this.creatSdpForOnetoManyScreen()
//
//       pc.onicecandidate = (event) => {
//         console.warn('on ie candidate-->', event.candidate.candidate);
//
//
//         let uUID = new Date().getTime().toString();
//
//         var candidates = {
//           requestType: 'onIceCandidate',
//           type: "request",
//           candidate: event.candidate.candidate,
//           referenceID: ref_id,
//           sessionUUID: uUID
//         };
//         console.log('*****sending ice candidate--->', candidates);
//
//         var jsonMessage = JSON.stringify(candidates);
//         ws.send(jsonMessage)
//
//
//         //   send event.candidate to peer
//       };
//       pc.onaddstream = (event) => {
//         console.warn('remote streammm--->', event.stream);
//         this.setState({ remoteStream: event.stream })
//         console.log("remote11", this.state.remoteStream)
//
//       };
//     } catch (error) {
//       console.log("holaa", error)
//     }
//
//
//
//   }
//
//
//
//
//   setPeerConnectionForScreenStream1 = async () => {
//     console.log("hlllll")
//     try {
//       const channelId = await notifee.createChannel({
//         id: 'screen_capture',
//         name: 'Screen Capture',
//         lights: false,
//         vibration: false,
//         importance: AndroidImportance.DEFAULT
//       });
//       await notifee.displayNotification({
//         title: 'Screen Capture',
//         body: 'This notification will be here until you stop capturing.',
//         android: {
//           channelId,
//           asForegroundService: true
//         }
//       });
//
//       // let uUID = new Date().getTime().toString();
//       // this.session_uuid = uUID
//       const local = await mediaDevices.getDisplayMedia({  video: true,
//         audio: true, });
//
//       const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
//       peervideo = new RTCPeerConnection(configuration);
//       // console.log("peer",pc)
//
//       // console.log("local",local)
//
//       peervideo.addStream(new MediaStream(local));
//       //
//       // local.getTracks().forEach(track => {
//       //   pc.getLocalStreams()[0].addTrack(track);
//       // });
//
//       // console.error("peer BEFORE",this.state.localStream)
//       //
//       this.setState({ localScreenStream: local })
//       // console.log("locallllll", this.state.localStream)
//       this.creatSdpForOnetoManyScreen1()
//
//       peervideo.onicecandidate = (event) => {
//         console.warn('on ie candidate-->', event.candidate.candidate);
//
//
//         let uUID = new Date().getTime().toString();
//
//         var candidates = {
//           requestType: 'onIceCandidate',
//           type: "request",
//           candidate: event.candidate.candidate,
//           referenceID: ref_id,
//           sessionUUID: uUID
//         };
//         console.log('*****sending ice candidate--->', candidates);
//
//         var jsonMessage = JSON.stringify(candidates);
//         ws.send(jsonMessage)
//
//
//         //   send event.candidate to peer
//       };
//       peervideo.onaddstream = (event) => {
//         console.warn('remote streammm--->', event.stream);
//         this.setState({ remoteStream: event.stream })
//         console.log("remote11", this.state.remoteStream)
//
//       };
//     } catch (error) {
//       console.log("holaa", error)
//     }
//
//
//
//   }
//
//
//
//
//   callResponse = (messageData: any) => {
//     console.warn("thiss", messageData.sdpAnswer)
//
//     pc.setRemoteDescription(new RTCSessionDescription({
//
//       type: 'answer',
//       sdp: messageData.sdpAnswer
//     }))
//
//
//   }
//   createSdpForReceiver = async () => {
//     console.log("creatSdp")
//
//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);
//     console.log("offerdescription" )
//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };
//     console.log("offer",offer )
//
//     let uUID = new Date().getTime().toString();
//     let data = {
//       "type":"request",
//       "requestType":"session_invite",
//       "sdpOffer":offer.sdp,
//       "requestID":uUID,
//       "sessionUUID":sessionUuId,
//       "responseCode":200,
//       "responseMessage":"accepted"
//     }
//     let reqMessage = JSON.stringify(data);
//     console.log("sending call request now", reqMessage);
//     ws.send(reqMessage);
//   }
//   creatSdp = async () => {
//     console.log("creatSdp")
//
//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);
//     console.log("offerdescription" )
//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };
//     console.log("offer",offer )
//
//     let uUID = new Date().getTime().toString();
//     let data = {
//       //"id":"call",
//       from: ref_id,
//       to: ["4235fa8cd3a66a80437dcdbfe6cd0142"],
//       type: "request",
//       requestType: "session_invite",
//       session_type: "call",
//       call_type: "one_to_one",
//       media_type: "video",
//       requestID: uUID,
//       sessionUUID: uUID,
//       mcToken: mc_token,
//       sdpOffer: offer.sdp,
//       data: {}
//     }
//     let reqMessage = JSON.stringify(data);
//     console.log("sending call request now", reqMessage);
//     ws.send(reqMessage);
//
//   }
//
//
//   creatSdpForOnetoMany = async () => {
//     console.log("creatSdp")
//
//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);
//     console.log("offerdescription" )
//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };
//     // console.log("offer",offer )
//
//     let uUID = new Date().getTime().toString();
//     let data = {
//       //"id":"call",
//       from: ref_id,
//       to: ["4235fa8cd3a66a80437dcdbfe6cd0142"],
//       type: "request",
//       requestType: "session_invite",
//       session_type: "call",
//       call_type: "one_to_one",
//       media_type: "video",
//       requestID: uUID,
//       sessionUUID: uUID,
//       mcToken: mc_token,
//       sdpOffer: offer.sdp,
//       data: {}
//     }
//     let reqMessage = JSON.stringify(data);
//     console.log("sending call request now", reqMessage);
//     ws.send(reqMessage);
//
//   }
//   creatSdpForOnetoManyVideo = async () => {
//     console.warn("creatSdpforfirst")
//
//     const offerDescription = await peervideo.createOffer();
//     await peervideo.setLocalDescription(offerDescription);
//     console.log("offerdescription" )
//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };
//     // console.log("offer",offer )
//
//     // let uUID = new Date().getTime().toString();
//     let data = {
//       //"id":"call",
//       from: ref_id,
//       to: [],
//       type: "request",
//       requestType: "session_invite",
//       session_type: "call",
//       call_type: "one_to_many",
//       media_type: "video",
//       requestID: sessionUuId,
//       sessionUUID: sessionUuId,
//       mcToken: mc_token,
//       broadcastType: 1,
//       // associatedSessionUUID: sessionUuId + 1,
//       sdpOffer: offer.sdp,
//       data: {}
//     }
//     let reqMessage = JSON.stringify(data);
//     sessionIdForPeerVideo = data.sessionUUID
//     console.log("sending call request now for first", reqMessage);
//     console.log("for first session id", data.sessionUUID);
//     ws.send(reqMessage);
//
//   }
//
//
//   creatSdpForOnetoManyScreen = async () => {
//     console.warn("creatSdpforsecond")
//
//     const offerDescription = await pc.createOffer();
//     await pc.setLocalDescription(offerDescription);
//     console.log("offerdescription" )
//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };
//     // console.log("offer",offer )
//
//     let uUID = new Date().getTime().toString();
//     let data = {
//       //"id":"call",
//       from: ref_id,
//       to: [],
//       type: "request",
//       requestType: "session_invite",
//       session_type: "screen",
//       call_type: "one_to_many",
//       media_type: "video",
//       // associatedSessionUUID: sessionUuId,
//       requestID: sessionUuId + 1,
//       sessionUUID: sessionUuId + 1,
//       broadcastType: 1,
//       mcToken: mc_token,
//       sdpOffer: offer.sdp,
//       data: {}
//     }
//     let reqMessage = JSON.stringify(data);
//     console.log("sending call request for second", reqMessage);
//     ws.send(reqMessage);
//
//   }
//   creatSdpForOnetoManyScreen1 = async () => {
//     console.warn("creatSdpforsecond")
//
//     const offerDescription = await peervideo.createOffer();
//     await peervideo.setLocalDescription(offerDescription);
//     console.log("offerdescription" )
//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };
//     // console.log("offer",offer )
//
//     let uUID = new Date().getTime().toString();
//     let data = {
//       //"id":"call",
//       from: ref_id,
//       to: [],
//       type: "request",
//       requestType: "session_invite",
//       session_type: "screen",
//       call_type: "one_to_many",
//       media_type: "video",
//       // associatedSessionUUID: sessionUuId,
//       requestID: sessionUuId + 1,
//       sessionUUID: sessionUuId + 1,
//       broadcastType: 1,
//       mcToken: mc_token,
//       sdpOffer: offer.sdp,
//       data: {}
//     }
//     let reqMessage = JSON.stringify(data);
//     console.log("sending call request for second", reqMessage);
//     ws.send(reqMessage);
//
//   }
//
//
//   sendPing = () => {
//     console.log('sending ping req')
//     let p= {
//       "requestID":new Date().getTime().toString(),
//       "requestType":"ping",
//       "mcToken":mc_token }
//     ws.send(JSON.stringify(p));
//   }
//
//   render() {
//     console.log("hunnn", this.state.remoteStream)
//     console.log("locallllllllll112", this.state.localStream)
//
//     const {count} = this.state;
//
//     return (
//       <View><Text style={{fontSize: 50}}>{count}</Text>
//         <TouchableOpacity
//           onPress={this.SetCount} >
//           <Text>Video Call</Text>
//         </TouchableOpacity>
//         {this.state.localStream && (
//           <>
//
//             <RTCView zOrder={2} zIndex={2} mirror={false} streamURL={this.state.localStream.toURL()} style={{ height: '40%', width: '40%',zIndex:2}}></RTCView></>)}
//
//         <TouchableOpacity
//           onPress={this.screen} >
//           <Text>screen Call</Text>
//         </TouchableOpacity>
//
//         <TouchableOpacity
//           onPress={this.onetomany} >
//           <Text>one to many screen Call</Text>
//         </TouchableOpacity>
//
//         {/*{this.state.remoteStream && (*/}
//         {/*  <>*/}
//
//         {/*    <RTCView zOrder={2} zIndex={2} streamURL={this.state.remoteStream.toURL()} style={{ height: '40%', width: '40%',zIndex:2  }}></RTCView></>)}*/}
//
//         {this.state.localScreenStream && (
//           <>
//
//             <RTCView zOrder={2} zIndex={2} mirror={false} streamURL={this.state.localScreenStream.toURL()} style={{ height: '40%', width: '40%',zIndex:2}}></RTCView></>)}
//       </View>
//     )
//   }
// }
//
// export default App;
//
