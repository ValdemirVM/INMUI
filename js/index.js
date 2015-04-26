/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
//$.mobile.activePage[0].id //id da pagina atual
//pagina atual (fromPage)
//nova pagina(toPage)
// $( '#aboutPage' ).on( 'pageinit',function(event){  //na inicialização de pagina
//  alert( 'This page was just enhanced by jQuery Mobile!' );
//});
//

//Acelera toque
$.event.special.tap = {
  setup: function() {
    var self = this,
      $self = $(self);

    // Bind touch start
    $self.on('touchstart', function(startEvent) {
      // Save the target element of the start event
      var target = startEvent.target;

     // Quando um toque começa, vincular um manipulador touchend exatamente uma vez,
      $self.one('touchend', function(endEvent) {
       // Quando o final toque fogos de eventos, verificar se o alvo do
         // Fim do toque é o mesmo que o alvo do começo, e se
         // Então, disparar um clique.
        if (target == endEvent.target) {
          $.event.simulate('tap', self, endEvent);
        }
      });
    });
  }
};
 
//Check o tipo de conexão
function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            //alert('Connection type: ' + states[networkState]);		
}

//BOTÃO SAIR OU VOLTAR
function onBackPress(e) {
	//if($.mobile.activePage.is("#page_init")){
		e.preventDefault();
		
		sair = confirm("SAIR?");
		if (sair){
			navigator.app.exitApp();
		}
		
   // }else{
        //navigator.app.backHistory();
    //}
}
function onLoad_back() {
    document.addEventListener("deviceready", onDeviceReady_back, false);
}
function onDeviceReady_back() {
	document.getElementsByClassName("ui-btn ui-shadow ui-corner-all ui-btn-icon-left ui-icon-power").addEventListener("click", onBackPress, false);
}

//Função Carregamento
function showLoading_Mobile(){ 
		$.mobile.loading( 'show', {
			text: "Aguarde...",
			textVisible: true,
			theme: "a",
			textonly: false,
			html: ""
		});
}
function hideLoading_Mobile(){
		$.mobile.loading('hide');
}

//Caminho raiz android phonegap
function getPhoneGapPath() { 
    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;

};

//AUDIO
function playAudioId(id) { //Executar audio com botões chamando os ids dos audios	
    var audioElement = document.getElementById(id);
    var url = getPhoneGapPath() + audioElement.getAttribute('src');
    var my_media = new Media(url
            // success callback
             //,function () { console.log("playAudioId():Audio Success"); }
            // error callback
             //,function (err) { console.log("playAudioId():Audio Error: " + err); }
    );
           // Play audio
    my_media.play();
}

function playAudio(name_sound) { //Executar audio
	var som = new Media(getPhoneGapPath() + name_sound);
	//var som = new Media(getPhoneGapPath() + name_sound, this.onSuccess, this.mediaError);
	som.play();
	//som.release();// libera som da memória
}

//WEBSOCKETS
        var loadScript = function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };     


function resize_text_websockets () {
	alturaTela = $(window).height(); //Altura da tela
	document.getElementById('taLog').style.height = Math.ceil(alturaTela/2) +'px'; //Define altura
	//document.getElementById('taLog').style.height = document.getElementById('taLog').scrollHeight+'px'; //Aumenta altura a medida que insere texto
	document.getElementById('taLog').scrollTop = document.getElementById('taLog').scrollHeight;
}

        var ortcClient = null,
            url = 'http://ortc-developers.realtime.co/server/2.1/',
            applicationKey = 'X4Qz1S',
            authenticationToken = 'mtnmcpNrerWb',
            channel = 'my_channel';

        // Log function
        var Log = function (text) {
            document.getElementById('taLog').value += "\n" + text;
        }

        // Sends a message
        function send() {
            var message = document.getElementById('txtMessage').value;
            Log("Message sent to channel: " + channel + ": " + message);
            ortcClient.send(channel, message);
        };

        // Displays a message received
        var onMessage = function (client, channel, message) {
			playAudio("sounds/do.mp3");
            Log('Message received from channel ' + channel + ': ' + message);
			resize_text_websockets();      
           			
        };

        // Creates the client and the connection
        var createClient = function () {
            loadOrtcFactory(IbtRealTimeSJType, function (factory, error) {
                // Checks if we have successfuly created the factory
                if (error != null) {
                    console.error(error);
                }
                else {
                    // Creates the factory
                    ortcClient = factory.createClient();                    
                    ortcClient.setClusterUrl(url);

                    // Callback for when we're connected
                    ortcClient.onConnected = function (ortc) {
                        Log("Connected to Realtime server " + ortcClient.getUrl());
                        Log("Transport used: " + ortcClient.getProtocol());
                        ortcClient.subscribe(channel, true, onMessage);
                    };

                    // Callback for when we're subscribed to a channel
                    ortcClient.onSubscribed = function (ortc, channel) {
                        Log("Subscribed channel " + channel);
                    };

                    // Callback for when we get an exception
                    ortcClient.onException = function (ortc, exception) {
                        Log('Exception: ' + exception);
                    };

                    // Connects to the ORTC server
                    Log("Connecting...");
                    ortcClient.connect(applicationKey, authenticationToken);
                }
            });
        };

	//NOTIFICAÇÃO NATIVA
	// alert dialog dismissed
	function alertDismissed() {
		// do something
	}
 	// Show a custom alert
   function showAlert() {
        navigator.notification.alert(
            'Isso é uma notificação!',  // message
			alertDismissed,         // callback
            'INMUI',            // title
            'Ok'                  // buttonName
        );
    }
    // Beep three times
    function playBeep() {
        navigator.notification.beep(3);
    }
    // Vibrate for 2 seconds
    function vibrate() {
        navigator.notification.vibrate(2000);
    }
	
 
/* --------------------- PUSH ------------------------- */
function initPushwoosh() {
	var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
	if(device.platform == "Android")
	{
		registerPushwooshAndroid();
	}

	if(device.platform == "iPhone" || device.platform == "iOS")
	{
		registerPushwooshIOS();
	}
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		document.addEventListener("offline", this.onOffline, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("touchmove", function (e) { e.preventDefault(); return false; }, false);
		document.addEventListener("touchstart", function (e) { e.preventDefault(); return false; }, false);	
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() { //Insira aqui todas as funções p inicializar
		app.receivedEvent('deviceready');
		
        initPushwoosh(); //Função de push
		
		loadScript("phonegap-websocket.js",function(){ //websockets
			createClient();
			resize_text_websockets (); //Para redimencionar textarea que recebe os textos		
		});
		
		onLoad_back(); //BT SAIR
		   
		//Carrega audio do show
		if($.mobile.activePage[0].id== "page_init"){
			html5audio.play();
			return false;
		}else{
			html5audio.stop();
			return false;
		}
			LowLatencyAudio.preloadFX('do', 'sounds/do.mp3');
            LowLatencyAudio.preloadFX('dosu', 'sounds/dosu.mp3');
			LowLatencyAudio.preloadFX('re', 'sounds/re.mp3');
            LowLatencyAudio.preloadFX('resu', 'sounds/resu.mp3');
			LowLatencyAudio.preloadFX('mi', 'sounds/mi.mp3');
            LowLatencyAudio.preloadFX('fa', 'sounds/fa.mp3');
			LowLatencyAudio.preloadFX('fasu', 'sounds/fasu.mp3');
			LowLatencyAudio.preloadFX('sol', 'sounds/sol.mp3');
            LowLatencyAudio.preloadFX('solsu', 'sounds/solsu.mp3');
			LowLatencyAudio.preloadFX('la', 'sounds/la.mp3');
            LowLatencyAudio.preloadFX('lasu', 'sounds/lasu.mp3');
			LowLatencyAudio.preloadFX('si', 'sounds/si.mp3');  
		
		function do_ui() {
			document.getElementById("do_ui").className = "touched";
            LowLatencyAudio.play('do');
        } 
		function dosu() {
			document.getElementById("dosu").className = "touched";
            LowLatencyAudio.play('dosu');
        } 
		function re() {
			document.getElementById("re").className = "touched";
            LowLatencyAudio.play('re');
        } 
		function resu() {
			document.getElementById("resu").className = "touched";
            LowLatencyAudio.play('resu');
        } 
		function mi() {
			document.getElementById("mi").className = "touched";
            LowLatencyAudio.play('mi');
        } 
		function fa() {
			document.getElementById("fa").className = "touched";
            LowLatencyAudio.play('fa');
        } 
		function fasu() {
			document.getElementById("fasu").className = "touched";
            LowLatencyAudio.play('fasu');
        } 
		function sol() {
			document.getElementById("sol").className = "touched";
            LowLatencyAudio.play('sol');
        } 
		function solsu() {
			document.getElementById("solsu").className = "touched";
            LowLatencyAudio.play('solsu');
        } 
		function la() {
			document.getElementById("la").className = "touched";
            LowLatencyAudio.play('la');
        } 
		function lasu() {
			document.getElementById("lasu").className = "touched";
            LowLatencyAudio.play('lasu');
        } 
		function si() {
			document.getElementById("si").className = "touched";
            LowLatencyAudio.play('si');
        }
		function touchend( event ) {
            event.target.className = "";
        } 
		
    },
	onOffline: function() { 
		alert("sem conexão");
		navigator.app.exitApp();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//INICIALIZA FUNÇÕES
app.initialize(); 