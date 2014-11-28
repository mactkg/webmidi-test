var MIDI = function() {
  
  this.inputs = [];
  this.outputs = [];
  
  var that = this;
  
  this.init = function() {
    return navigator.requestMIDIAccess( {sysex: true} ).then(that._success, that._failure);
  }
  
  this._success = function(midi) {
    console.log(midi);
    that.ctx = midi;

    var it = midi.inputs.values();
    for(var i = it.next(); !i.done; i = it.next()) {
      that.inputs.push(i.value);
      console.log(i.value);
    }
    
    it = midi.outputs.values();
    for(var o = it.next(); !o.done; o = it.next()) {
      that.outputs.push(o.value);
      console.log(o.value);
    }
  }
  
  this._failure = function(error) {
    console.log(error);
  }
}

var nanoKONTROL = function() {
  this.callback;

  var that = this;
  var NOTE_ON = 0x7f;
  var NOTE_OFF = 0x00;

  this.init = function(midi, callback) {
    that.callback = callback;
    for (var i = 0; i < midi.inputs.length; i++) {
      if(midi.inputs[i].name === "SLIDER/KNOB") {
        midi.inputs[i].onmidimessage = that._onEvent;
      }
    }
  }
  
  this._onEvent = function(e) {
    console.log(e);
    var id = -1;
    var kind = "";
    var value = e.data[2];
    
    if(0 <= e.data[1] && e.data[1] < 8) {
      id = e.data[1];
      kind = "SLIDER";
    } else if(16 <= e.data[1] && e.data[1] < 24) {
      id = e.data[1] - 16;
      kind = "KNOB"
    } else if(32 <= e.data[1] && e.data[1] < 40 ) {
      id = e.data[1] - 32;
      kind = "BUTTON/S";
    } else if(48 <= e.data[1] && e.data[1] < 56 ) {
      id = e.data[1] - 48;
      kind = "BUTTON/M";
    } else if(64 <= e.data[1] && e.data[1] < 72 ) {
      id = e.data[1] - 64;
      kind = "BUTTON/R";
    } else {
      switch (e.data[1]) {
        case 41:
          kind = "BUTTON/PLAY";
          break;
        case 42:
          kind = "BUTTON/STOP";
          break;
        case 43:
          kind = "BUTTON/SEARCH_PREVIEW";
          break;
        case 44:
          kind = "BUTTON/SEARCH_FORWARD";
          break;
        case 45:
          kind = "BUTTON/REC";
          break;
        case 46:
          kind = "BUTTON/CYCLE";
          break;
        case 58:
          kind = "BUTTON/TRACK_PREVIEW";
          break;
        case 59:
          kind = "BUTTON/TRACK_FORWARD";
          break;
        case 60:
          kind = "BUTTON/MARKER_SET";
          break;
        case 61:
          kind = "BUTTON/MARKER_PREVIEW";
          break;
        case 62:
          kind = "BUTTON/MARKER_FORWARD";
          break;
      }
    }
        
    that.callback(id, kind, value)
  }
}

window.onload = function() {
  console.log("onload!!!!");
  midi = new MIDI();
  midi.init().then(function() {
    kontrol = new nanoKONTROL();
    console.log(kontrol);
    kontrol.init(midi, cb);
  }, null);
}

var cb = function(id, kind, value) {
  console.log(id, kind, value);
}