(this["webpackJsonpcard-dungeon"]=this["webpackJsonpcard-dungeon"]||[]).push([[0],{136:function(e,t,a){"use strict";a.r(t);var n,c=a(0),r=a.n(c),A=a(29),i=a.n(A),o=(a(83),a(5)),l=a(11),d=a(71),s=a.n(d),u=(a(97),a(98),a(39)),m=a(45),p=a.n(m),g=a(38),b=a.n(g),h=a(20),y=a.n(h),v=a(27),I=a(72),k=a.n(I),C="https?:\\/\\/(www\\.)?youtube.com\\/watch\\?v=.+",f=function(e){e.dispatch;var t=e.onClose,a=Object(c.useState)(""),n=Object(l.a)(a,2),A=n[0],i=n[1],o=Object(c.useState)(""),d=Object(l.a)(o,2),s=d[0],u=d[1],m=Object(c.useState)([]),p=Object(l.a)(m,2),g=p[0],h=p[1],I=Object(c.useCallback)((function(e){z.addCard({kind:"youtube",title:"video",icon:b.a,uri:e,layout:{x:0,y:0,i:Math.random().toString(),w:2,h:2},state:{playing:!1,playedProgress:0,playedSeconds:0,volume:1,muted:!1},author:z.me.id,manager:z.me.id,trashed:!1}),t()}),[t]),k=Object(c.useCallback)((function(e){e.preventDefault(),A.match(C)&&(I(A),i(""))}),[I,A]),f=Object(c.useCallback)(function(){var e=Object(v.a)(y.a.mark((function e(t){var a,n,c;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.prev=1,e.next=4,fetch("https://www.googleapis.com/youtube/v3/search?".concat(new URLSearchParams({key:"AIzaSyBCF-Pw6qu-pfJxoSYZ_eMnqwaVYmLiRUY",part:"snippet",q:s,type:"video",videoEmbeddable:"true",maxResults:"5"})),{method:"GET"});case 4:return a=e.sent,e.next=7,a.json();case 7:n=e.sent,c=n.items,h(c),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),console.log(e.t0);case 15:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(t){return e.apply(this,arguments)}}(),[s]);return r.a.createElement("div",{style:{height:"100%",overflow:"hidden",display:"flex",flexGrow:1,flexDirection:"column"}},r.a.createElement("div",null,r.a.createElement("label",null,"by URL",r.a.createElement("form",{onSubmit:k},r.a.createElement("input",{type:"url",value:A,onChange:function(e){i(e.target.value)},placeholder:"youtube url...",pattern:C}),r.a.createElement("input",{type:"submit",value:"cast!"}))),r.a.createElement("label",null,"search",r.a.createElement("form",{onSubmit:f},r.a.createElement("input",{type:"text",value:s,onChange:function(e){u(e.target.value)},autoFocus:!0,placeholder:"search query..."}),r.a.createElement("input",{type:"submit",value:"search!"})))),r.a.createElement("div",{style:{borderTop:"1px solid black",overflow:"auto",flexGrow:1,marginTop:"10px",width:"100%"}},r.a.createElement("div",null,g.map((function(e){return r.a.createElement("div",{key:e.id.videoId,style:{backgroundColor:"rgba(0,0,0,0.1)",margin:"10px",padding:"10px",cursor:"pointer",maxWidth:"200px",display:"inline-block"},onClick:function(){return I("https://youtube.com/watch?v=".concat(e.id.videoId))}},r.a.createElement("h2",{style:{margin:0,fontSize:"20px"}},r.a.createElement("img",{src:e.snippet.thumbnails.medium.url,width:200}),e.snippet.title),r.a.createElement("h3",{style:{margin:0,color:"gray"}},e.snippet.channelTitle))})))))},w=function(e){var t=e.card,a=(e.dispatch,Object(c.useState)(!1)),n=Object(l.a)(a,2),A=n[0],i=n[1],d=Object(c.useCallback)((function(e){var a=e.getInternalPlayer().getVideoData().title;z.updateCard(Object(o.a)(Object(o.a)({},t),{},{title:a})),i(!0)}),[t]),s=Object(c.useRef)(null),u=Object(c.useCallback)((function(e){console.log(e,"seeked")}),[]),m=Object(c.useCallback)((function(e){var a=Object(o.a)(Object(o.a)({},t.state),{},{playedProgress:e.played,playedSeconds:e.playedSeconds});z.updateCard(Object(o.a)(Object(o.a)({},t),{},{state:a}))}),[t]),p=Object(c.useCallback)((function(){var e=Object(o.a)(Object(o.a)({},t.state),{},{playing:!0});z.updateCard(Object(o.a)(Object(o.a)({},t),{},{state:e}))}),[t]),g=Object(c.useCallback)((function(){var e=Object(o.a)(Object(o.a)({},t.state),{},{playing:!1});z.updateCard(Object(o.a)(Object(o.a)({},t),{},{state:e}))}),[t]),b=Object(c.useCallback)((function(){var e=Object(o.a)(Object(o.a)({},t.state),{},{playing:!1,playedProgress:0,playedSeconds:0});z.updateCard(Object(o.a)(Object(o.a)({},t),{},{state:e}))}),[t]),h=Object(c.useCallback)((function(){var e=Object(o.a)(Object(o.a)({},t.state),{},{playing:!t.state.playing});z.updateCard(Object(o.a)(Object(o.a)({},t),{},{state:e}))}),[t]);Object(c.useEffect)((function(){s.current&&null!==s.current.getCurrentTime()&&Math.abs(s.current.getCurrentTime()-t.state.playedSeconds)>=1&&(console.log("Out of sync: ".concat(s.current.getCurrentTime()),t),s.current.seekTo(t.state.playedSeconds,"seconds"))}),[t]);var y=t.state.playedSeconds,v=Math.floor(y/3600).toString(),I=Math.floor(y%3600/60).toString().padStart(2,"0"),C=(Math.floor(y)%60).toString().padStart(2,"0");return r.a.createElement("div",{style:{display:"flex",flexDirection:"column",height:"100%"}},r.a.createElement("div",{style:{flexGrow:1,flexShrink:0,flexBasis:"auto"}},r.a.createElement(k.a,{url:t.uri,width:"100%",height:"100%",className:"react-player",onReady:d,ref:s,controls:!1,playing:t.state.playing,volume:t.state.volume,muted:t.state.muted,onSeek:u,onProgress:m,onPlay:p,onPause:g,onEnded:b,progressInterval:500,config:{youtube:{playerVars:{modestBranding:1,rel:1,start:t.state.playedSeconds}}}}),!A&&r.a.createElement("span",null,"loading... (insert snail here)")),r.a.createElement("div",{style:{flexGrow:0,flexShrink:0,flexBasis:"auto"}},r.a.createElement("span",null,"0"!==v&&v+":",I,":",C),r.a.createElement("button",{onClick:h,disabled:!A},t.state.playing?"pause":"play")))},j=a(46),E=a.n(j);!function(e){e[e.YOUTUBE=0]="YOUTUBE",e[e.NONE=1]="NONE"}(n||(n={}));var O,Y={overflow:"auto",borderRight:"1px solid black",maxWidth:"250px",flexBasis:"250px"},G=function(e){var t=e.show,a=e.onClose,A=e.dispatch,i=Object(c.useState)(n.NONE),o=Object(l.a)(i,2),d=o[0],s=o[1];return r.a.createElement(u.b,{style:{background:"none"},isOpen:t,onDismiss:a},r.a.createElement(u.a,{style:{boxShadow:"10px 10px hsla(0, 0%, 0%, 0.5)",fontFamily:'"Alagard"',padding:0,height:"70vh",maxWidth:"75vw",minWidth:"500px",display:"flex",flexDirection:"column"},"aria-label":"spell picker"},r.a.createElement("div",{style:{width:"100%",backgroundColor:T,userSelect:"none"}},r.a.createElement("img",{src:p.a,width:25}),"spells"),r.a.createElement("div",{style:{width:"100%",display:"flex",overflow:"hidden",alignItems:"stretch",flexGrow:1}},r.a.createElement("div",{style:Y},r.a.createElement("div",{style:d===n.YOUTUBE?{color:"#FFFFFF",backgroundColor:"#000000",verticalAlign:"middle"}:{color:"#000000",backgroundColor:"#FFFFFF",verticalAlign:"middle"},onClick:function(){return s(n.YOUTUBE)}},r.a.createElement("img",{src:b.a,width:30})," youtube ",">"),r.a.createElement("div",{onClick:function(){z.addMyAvatar(),a()},style:{verticalAlign:"middle"}},r.a.createElement("img",{src:E.a,width:30})," me")),d===n.YOUTUBE&&r.a.createElement(f,{onClose:a,dispatch:A}))))},B=function(e){var t=e.card,a=e.ticker,n=Object(c.useRef)(null),A=t.author===z.me.id?z.myStream:z.peerMap[t.author]?z.streamMap[z.peerMap[t.author].peerId]:void 0,i=Object(c.useCallback)((function(){var e=n.current;e?Object(v.a)(y.a.mark((function a(){return y.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(!e.paused||!A){a.next=4;break}return e.srcObject=A,a.next=4,e.play();case 4:t.author===z.me.id&&(e.muted=!0);case 5:case"end":return a.stop()}}),a)})))():console.log("no video yet2",a)}),[n,t,a,A]);return Object(c.useEffect)((function(){n?i():console.log("no video yet")}),[n,i,a]),r.a.createElement("div",null,r.a.createElement("video",{ref:n,style:{width:"100%",height:"100%",objectFit:"contain"}}),void 0===A&&"no stream")},M=a(42),Z=a.n(M);!function(e){e[e.YOUTUBE=0]="YOUTUBE",e[e.NONE=1]="NONE"}(O||(O={}));var R={overflow:"scroll",borderRight:"1px solid black",maxWidth:"300px",flexBasis:"200px"},S=function(e){var t=e.show,a=e.onClose,n=e.dispatch,A=e.backpack,i=Object(c.useState)(O.NONE),o=Object(l.a)(i,2),d=o[0],s=o[1],m=Object(c.useCallback)((function(){n({kind:"clear_backpack"})}),[n]),p=Object(c.useCallback)((function(e){z.addFromBackpack(e)}),[n]),g=A.filter((function(e){return"youtube"===e.kind}));return r.a.createElement(u.b,{style:{background:"none"},isOpen:t,onDismiss:a},r.a.createElement(u.a,{style:{boxShadow:"10px 10px hsla(0, 0%, 0%, 0.5)",fontFamily:'"Alagard"',padding:0,minHeight:"300px",display:"flex",flexDirection:"column"},"aria-label":"spell picker"},r.a.createElement("div",{style:{width:"100%",backgroundColor:T,userSelect:"none"}},r.a.createElement("img",{src:Z.a,width:30,style:{verticalAlign:"middle"}}),r.a.createElement("span",null,"backpack"),r.a.createElement("button",{onClick:a},"x"),r.a.createElement("button",{onClick:m},"clear")),r.a.createElement("div",{style:{width:"100%",display:"flex",overflow:"hidden",alignItems:"stretch",flexGrow:1}},r.a.createElement("div",{style:R},r.a.createElement("div",{style:d===O.YOUTUBE?{color:"#FFFFFF",backgroundColor:"#000000"}:{color:"#000000",backgroundColor:"#FFFFFF"},onClick:function(){return s(O.YOUTUBE)}},r.a.createElement("img",{src:b.a,width:30})," youtube (",g.length,")"," >")),r.a.createElement("div",{style:R},d===O.YOUTUBE?r.a.createElement("div",null,g.map((function(e){return r.a.createElement("div",{key:e.layout.i,style:{cursor:"pointer",margin:"10px"},onClick:function(){return p(e)}},e.title)}))):r.a.createElement("div",null)))))},x=a(47),D=a(16),F=a(3),N=a(4),W=a(30),J=a(74),Q=function(e){localStorage.setItem("myBackpack",JSON.stringify(e))};localStorage.setItem("log","false");var U=function(){return Math.random().toString(36).substr(2,9)},T="#C39B77",z=new(function(){function e(){var t=this;Object(F.a)(this,e),this.ydoc=void 0,this.provider=void 0,this.streamMap={},this.me=void 0,this.peerMap={},this.dispatch=void 0,this.myStream=void 0,this.cardsY=void 0,this.myAvatarID=void 0,this.connect=function(){var e=window.location.hash.match(/#!([a-z0-9]+)-([a-z0-9]+)/),a=U(),n=U();e?(a=e[1],n=e[2]):window.location.hash="!".concat(a,"-").concat(n),t.provider=new J.a(a,t.ydoc,{password:n,signaling:["wss://signaling.yjs.dev","wss://y-webrtc-signaling-eu.herokuapp.com","wss://y-webrtc-signaling-us.herokuapp.com"],filterBcConns:!1,maxConns:Number.POSITIVE_INFINITY,peerOpts:{objectMode:!1,streams:[]}}),t.setupStream()},this.setupWatchers=function(){t.cardsY=t.ydoc.getMap("cards"),t.cardsY.observe((function(e){t.dispatch&&t.dispatch({kind:"set_cards",cards:Array.from(t.cardsY.values()).filter((function(e){return!e.trashed}))})}))},this.incrementTicker=function(){t.dispatch&&t.dispatch({kind:"increment_ticker"})},this.addMyAvatar=Object(v.a)(y.a.mark((function e(){var a,n;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,navigator.mediaDevices.getUserMedia({video:!0,audio:!0});case 2:a=e.sent,t.myStream=a,t.streamMap[t.me.peerId]=a,t.provider&&t.provider.room&&t.provider.room.webrtcConns.forEach((function(e){e.peer.addStream(t.myStream),t.incrementTicker()})),n=Math.random().toString(),t.myAvatarID=n,t.addCard({kind:"avatar",title:t.me.name,icon:E.a,layout:{x:0,y:0,i:n,w:2,h:2},author:t.me.id,manager:t.me.id,trashed:!1});case 9:case"end":return e.stop()}}),e)}))),this.setupStream=Object(v.a)(y.a.mark((function e(){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:try{t.provider.on("peers",function(){var e=Object(v.a)(y.a.mark((function e(a){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.provider.room&&""===t.me.peerId&&t.dispatch&&(t.me.peerId=t.provider.room.peerId,t.peerMap[t.me.id]=t.me),a.removed.forEach((function(e){console.log("".concat(e," left")),t.dispatch({kind:"remove_peer",peerId:e})})),a.added.forEach((function(e){if(t.provider.room){var a=t.provider.room.webrtcConns.get(e);if(a){var n=a.peer;n&&(n.on("data",function(){var a=Object(v.a)(y.a.mark((function a(c){var r,A,i,o;return y.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:(r=c.toString()).length>0&&r.match(/packetKind/)&&(A=JSON.parse(r),i=A.docID.toString(),t.peerMap[i]||(o={name:A.myName,id:i,peerId:e},t.peerMap[i]=o,t.dispatch({kind:"add_peer",peer:o}),n.send(JSON.stringify({packetKind:"ID",docID:t.me.id,myName:t.me.name})),t.myStream&&(n.addStream(t.myStream),t.incrementTicker())));case 2:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()),n.on("stream",function(){var a=Object(v.a)(y.a.mark((function a(n){return y.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:console.log("stream",n),t.streamMap[e]=n,t.incrementTicker();case 3:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()),n.on("connect",(function(){n.send(JSON.stringify({packetKind:"ID",docID:t.me.id,myName:t.me.name}))})))}}}));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}catch(a){console.log("error",a)}case 1:case"end":return e.stop()}}),e)}))),this.defaultMe=function(){return{cards:Array.from(t.cardsY.values()).filter((function(e){return!e.trashed})),myBackpack:[],ticker:1,ready:!1,peers:[]}},this.updateLayouts=function(e){e.forEach((function(e){var a=t.cardsY.get(e.i);Object(x.isEqual)(a.layout,e)||t.cardsY.set(e.i,Object(o.a)(Object(o.a)({},a),{},{layout:JSON.parse(JSON.stringify(e))}))}))},this.addCard=function(e){t.cardsY.set(e.layout.i,e)},this.updateCard=function(e){t.cardsY.set(e.layout.i,e),e.author===t.me.id&&e.trashed&&"avatar"===e.kind&&(t.provider&&t.provider.room&&t.provider.room.webrtcConns.forEach((function(e){})),t.myStream.getTracks().forEach((function(e){e.stop()})))},this.addFromBackpack=function(e){t.dispatch&&(t.dispatch({kind:"add_from_backpack",cardID:e.layout.i}),t.cardsY.set(e.layout.i,e))},this.setNameAndConnect=function(e){t.me.name=e,t.dispatch({kind:"set_ready",myName:e}),t.connect()},this.reducer=function(e,a){var n,c;switch(a.kind){case"set_cards":return Object(o.a)(Object(o.a)({},e),{},{cards:a.cards});case"set_backpack":return Q(a.backpack),Object(o.a)(Object(o.a)({},e),{},{myBackpack:a.backpack});case"add_to_backpack":var r=Object(o.a)({},a.card);return"youtube"===r.kind&&(r.state=Object(o.a)(Object(o.a)({},r.state),{},{playing:!1})),n=e.myBackpack.some((function(e){return e.layout.i===r.layout.i}))?e.myBackpack.map((function(e){return e.layout.i===r.layout.i?r:e})):[].concat(Object(D.a)(e.myBackpack),[r]),Q(n),Object(o.a)(Object(o.a)({},e),{},{myBackpack:n});case"clear_backpack":return c=Object(o.a)(Object(o.a)({},e),{},{myBackpack:[]}),Q([]),c;case"add_from_backpack":return n=e.myBackpack.filter((function(e){return e.layout.i!==a.cardID})),Q(n),Object(o.a)(Object(o.a)({},e),{},{myBackpack:n});case"increment_ticker":return Object(o.a)(Object(o.a)({},e),{},{ticker:e.ticker+1});case"set_ready":return Object(o.a)(Object(o.a)({},e),{},{ready:!0,peers:[].concat(Object(D.a)(e.peers),[t.me])});case"add_peer":return Object(o.a)(Object(o.a)({},e),{},{peers:[].concat(Object(D.a)(e.peers),[a.peer])});case"remove_peer":return Object(o.a)(Object(o.a)({},e),{},{peers:e.peers.filter((function(e){return e.peerId!==a.peerId}))})}},this.ydoc=new W.a,this.me={id:this.ydoc.clientID.toString(),name:"",peerId:""},this.setupWatchers()}return Object(N.a)(e,[{key:"setDispatch",value:function(e){this.dispatch=e}}]),e}());var H=function(){var e=Object(c.useReducer)(z.reducer,z.defaultMe()),t=Object(l.a)(e,2),a=t[0],n=t[1];z.setDispatch(n),Object(c.useEffect)((function(){var e=localStorage.getItem("myBackpack");e&&n({kind:"set_backpack",backpack:JSON.parse(e)})}),[n]);var A=a.cards,i=a.ticker,d=Object(c.useState)(!1),u=Object(l.a)(d,2),m=u[0],g=u[1],b=Object(c.useState)(!1),h=Object(l.a)(b,2),y=h[0],v=h[1],I=Object(c.useCallback)((function(e){z.updateLayouts(e)}),[]);Object(c.useEffect)((function(){z.setDispatch(n)}),[n]);var k=Object(c.useState)(""),C=Object(l.a)(k,2),f=C[0],j=C[1],E=Object(c.useCallback)((function(e){e.preventDefault(),z.setNameAndConnect(f)}),[f]),O=Object(c.useCallback)((function(e){z.updateCard(Object(o.a)(Object(o.a)({},e),{},{trashed:!0}))}),[]);return a.ready?r.a.createElement("div",{className:"App"},r.a.createElement("header",{style:{backgroundColor:T,color:"#3A1915",height:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0px 0px 5px",borderBottom:"1px solid black",fontFamily:'"Alagard", serif',userSelect:"none"}},r.a.createElement("nav",null,r.a.createElement("div",{onClick:function(){return g(!0)},style:{cursor:"pointer",color:m?T:"#3A1915",background:m?"#3A1915":T,display:"inline-block",marginLeft:"10px"}},r.a.createElement("img",{src:p.a,width:20,style:{verticalAlign:"middle",marginRight:"5px"}}),r.a.createElement("span",null,"spells")),r.a.createElement("div",{onClick:function(){return v(!0)},style:{cursor:"pointer",color:y?T:"#3A1915",background:y?"#3A1915":T,display:"inline-block",marginLeft:"10px"}},r.a.createElement("img",{src:Z.a,width:20,style:{verticalAlign:"middle",marginRight:"5px"}}),r.a.createElement("span",null,"backpack"," ",a.myBackpack.length>0&&"(".concat(a.myBackpack.length,")")))),r.a.createElement("nav",null,r.a.createElement("div",{style:{display:"inline"}},a.peers.map((function(e){return r.a.createElement("div",{style:{color:"#FFFFFF",margin:"0 5px 0 5px",display:"inline-block",backgroundColor:"#3A1915"},key:e.id},e.name)}))),r.a.createElement("span",null,"Tavern Cards"))),r.a.createElement(G,{show:m,onClose:function(){return g(!1)},dispatch:n}),r.a.createElement(S,{show:y,onClose:function(){return v(!1)},dispatch:n,backpack:a.myBackpack}),r.a.createElement(s.a,{onLayoutChange:I,cols:12,rowHeight:window.innerWidth/12,width:window.innerWidth,autoSize:!0,compactType:null,layout:A.map((function(e){return e.layout})),margin:[30,30],isResizable:!0,resizeHandles:["se"],draggableHandle:".bar"},A.map((function(e,t){return r.a.createElement("div",{key:e.layout.i,style:{backgroundColor:"sandybrown",display:"flex",flexFlow:"column",boxShadow:"5px 5px hsla(0, 0%, 0%, 0.5)"}},r.a.createElement("div",{style:{flexShrink:0,fontFamily:'"Alagard"',fontSize:"18px",backgroundColor:"#C39B77",userSelect:"none",display:"flex",justifyContent:"space-between"},className:"bar"},r.a.createElement("div",null,r.a.createElement("img",{src:e.icon,width:20,style:{verticalAlign:"middle",marginLeft:"10px"}})," ",r.a.createElement("span",null,Object(x.truncate)(e.title,{length:24}))),r.a.createElement("div",null,!("avatar"===e.kind)&&r.a.createElement("button",{onClick:function(){return n({kind:"add_to_backpack",card:e})},style:{border:"none",background:"none",padding:0}},r.a.createElement("img",{width:20,src:Z.a,style:{verticalAlign:"middle"}})),r.a.createElement("button",{onClick:function(){return O(e)}},"x"))),r.a.createElement("div",{style:{overflow:"hidden",flexGrow:1}},"avatar"===e.kind?r.a.createElement(B,{card:e,ticker:i}):r.a.createElement(w,{card:e,dispatch:n})))})))):r.a.createElement("div",{className:"App",style:{padding:"1em",fontFamily:'"Alagard"'}},r.a.createElement("h1",null,"What is your name, traveller?"),r.a.createElement("form",{onSubmit:E},r.a.createElement("input",{type:"text",value:f,onChange:function(e){return j(e.target.value)}}),r.a.createElement("input",{type:"submit",value:"It is me".concat(f?", "+f:"","!")})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(H,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},38:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAqCAIAAACMZMq1AAAACXBIWXMAAAE7AAABOwEf329xAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA5LTI0VDIyOjExOjQzLTA0OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOS0yNFQyMjoxNToxNi0wNDowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOS0yNFQyMjoxNToxNi0wNDowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2ZmQ3ZmI4MC05YWM1LTRlNGYtOTJlNS1kZDQ2MGU4Mzg3ZWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4NzllODc2Mi0yY2MzLTUzNDEtOTJjMi1lZDczZTNjOWRmMzMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZmI4OTBjMi0wNjRhLTMwNDgtOWI0NC00Y2ZmMWU2ZmU0NWUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmVmYjg5MGMyLTA2NGEtMzA0OC05YjQ0LTRjZmYxZTZmZTQ1ZSIgc3RFdnQ6d2hlbj0iMjAyMC0wOS0yNFQyMjoxMTo0My0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZmQ3ZmI4MC05YWM1LTRlNGYtOTJlNS1kZDQ2MGU4Mzg3ZWMiIHN0RXZ0OndoZW49IjIwMjAtMDktMjRUMjI6MTU6MTYtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6DSZsXAAAA7ElEQVRYhe2ZwQ3DIAxFP1EnKAMwQ7L/DNkhA3gGegBRKeqhDTY/rniX5IT8ZBuMCDlnFOIGR8hevqEKxA04mAH9TCoOC+AxegBHKZmQn6vD6BtpYUfQyxRgMwXYTAE2U4DNQ20lkfoTo9qaX6An0BhrYllCIm8ZMwwycMI4IfYCjVM2lHx4u5BSgQ3MwEe6C+w258DVbNxGwHcGOhqa3QPdexFPQGkbZQionmjDe0D7PB6YAcejhOVYaixgP1GbCYy61hgIeL2RjY27cY9RooMpwGYKsPkDAdmBxA7jGgmyLwB8OtRn1uD9ofsFENoxZGkk/8cAAAAASUVORK5CYII="},42:function(e,t){e.exports="data:image/png;base64,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"},45:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYWlDQ1BrQ0dDb2xvclNwYWNlRGlzcGxheVAzAAAokWNgYFJJLCjIYWFgYMjNKykKcndSiIiMUmB/yMAOhLwMYgwKicnFBY4BAT5AJQwwGhV8u8bACKIv64LMOiU1tUm1XsDXYqbw1YuvRJsw1aMArpTU4mQg/QeIU5MLikoYGBhTgGzl8pICELsDyBYpAjoKyJ4DYqdD2BtA7CQI+whYTUiQM5B9A8hWSM5IBJrB+API1klCEk9HYkPtBQFul8zigpzESoUAYwKuJQOUpFaUgGjn/ILKosz0jBIFR2AopSp45iXr6SgYGRiaMzCAwhyi+nMgOCwZxc4gxJrvMzDY7v////9uhJjXfgaGjUCdXDsRYhoWDAyC3AwMJ3YWJBYlgoWYgZgpLY2B4dNyBgbeSAYG4QtAPdHFacZGYHlGHicGBtZ7//9/VmNgYJ/MwPB3wv//vxf9//93MVDzHQaGA3kAFSFl7jXH0fsAAAB4ZVhJZk1NACoAAAAIAAUBBgADAAAAAQACAAABGgAFAAAAAQAAAEoBGwAFAAAAAQAAAFIBKAADAAAAAQACAACHaQAEAAAAAQAAAFoAAAAAAAABLAAAAAEAAAEsAAAAAQACoAIABAAAAAEAAAAgoAMABAAAAAEAAAAgAAAAANuyGiYAAAAJcEhZcwAALiMAAC4jAXilP3YAAAIPaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+MzAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPjI8L3RpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+MzAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KDl5BLAAABBFJREFUWAntVk1IVFEUPm80a7J0aoYKS22SaYQoykWrCBT7EVpnBC3aRZC1cBG4qIjCZRBEuxa1aN+iH8JVbQuM0CFsGjWxcNI0FXKY1/vum288vvfmOUHLDry5551z7jnf/e55944l/1C6U5bNdK8/2Rb1sLGqICbQBWgLG4NA6Bzw14YlCPN1Hdlj3EPvJ4U6DNn5emPPjmUExQhCFzYBpZ+qATBBsi0tSI5CdXOjThpLAIJCMNmSgfO0/+v4hGTyLvlVAWASJM/Ou6kAAsUrCYHAT4DaxnlVAUAwJgN5toSc1DIRRgBFMbCUbFgsu1gY83e3NJftUKoGgGDShuIv7tvljj99xTJUwA4Qhh0PCMwPkr8CgAQs/ujaarreGtu+eE8EQMhMt2TsZKlRVyP9WlUA3KSTdnys2He2pmCz+OMSyxecxocNQIp20UCbdchFo+qt8JcP6yIV3RuxM7ZV2E/Tk8VaGV9x3z5OzciBpgRdMhArqVbxUz5Zm8Ib+wc6eoBfARYWgTFMzlr2K6fZ91vOilBYF9fzWja4b3fmSlY7ktqWXRrSMd4GhG9dAA7EEwgk3Vw5bBsLi9KxI2rGb8uLAhB4CGI2ubkLcWESCoCdjuIozOKgfXDMnxYg3rycMo78Pjc1PklI0Ophr9SE5rNisyEQMj7kJu851ST1uWnHslV2Rt2jF34AgHA7oHubEPuvJZCBw7Gbjc7qiwjk6qEvtNeZB3p6x1YMPkkdb5TLzgn98J2Zbr4E3g8IBhM8T/AeCGDw9o1Zvfrdw18ED2Xgx7xkvi/wNXTEfeFlQU+otAUmho33NrHJvJ+c+WXGZ8t7RaJLRiftAKRZ4XaZIPWDLUjHV0/VQAZUvFEjo0XBMzKVlVeJLWX3rdzq/tMI2/U2kbv97nXtbT7vFgReZz1iN1y9Lz+xDWCBnR37nZGJQwelXgoGULE9Ik+Xd7G2XMp/kdjRvXKpI7LmPwICeBHpQwj2QAZWUpGfcEJwzB5zuh7ScLpTmoc/yPbhEfOOnxutbudDfxj3F0cDsjhiKLziAxmgs7+vaM549gKYaOlqEpwDZAEJwcTgGRckr17YURiit4H/DWDHUewDgOJIwsD4Z/dzAojnuRnMMyw8SHXKueh0uTDs+n9A0KpJP2J5awZuAQIAIh23hScatqKnNWEunrm6tJzPTYUWRw4tQcXh9zEAI1mATiaggw2e82g0CI/asG+9UnHMDwQAhwahE8BH0ftNm3fEXAhPP1LPuDUAUJQB0BGEbYDoRjKGdX68hRHO3HqqD4B2sri2VQvEy1pQceRdAwAGTT3etSCpBsBVwuYtyHmVCtPvAwAH6WcQRrCBQroptV/r6xXVsYEAdAB1LyhvEfi9Ns79P4Yx8AcgFOX5N+knDQAAAABJRU5ErkJggg=="},46:function(e,t){e.exports="data:image/png;base64,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"},78:function(e,t,a){e.exports=a(136)},83:function(e,t,a){}},[[78,1,2]]]);
//# sourceMappingURL=main.8047ed2b.chunk.js.map