const style = {fontSize: "25px"};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 25 * 60,
      start: 1,
      leng: 5 * 60,
      sess: 25 * 60,
      label: "SESSION",
      interval: {}
    }
  }
  
  
  handleStartStop = () => {
    const start = this.state.start;
    start === 1 ? this.setState({start: 0}): this.setState({start: 1});
    if (start === 1) {
      let interval = setInterval(() => this.setState({min: this.state.min - 1}), 1000);
      this.setState({interval: interval})
    } else {clearInterval(this.state.interval)}
  }
  
  handleReset = () => {
    this.setState({
     start: 1,
      min: 25 * 60,
      leng: 5 * 60,
      sess: 25 * 60,
      label: "SESSION"
    });
    const audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.pause();
    clearInterval(this.state.interval);
  }
  
  handleBrInc = () => {
    const {leng} = this.state;
    const l = leng > 59 * 60 ? leng: leng + 60;
    if(this.state.start) {
      this.setState({leng: l})
    }
  }
  
  handleBrDec = () => {
    const {leng} = this.state;
    const l = leng <= 1 * 60? leng: leng - 60;
    if(this.state.start) {
      this.setState({leng: l})
    }
  }
  
  handleSesInc = () => {
    const {sess} = this.state;
    const s = sess > 59 * 60? sess: sess + 60;
    if(this.state.start) {
      this.setState({sess: s, min: s,})
    }
  }
  
  handleSesDec = () => {
   const {sess} = this.state;
    const s = sess <= 1 * 60? sess: sess - 60;
    if(this.state.start) {
      this.setState({sess: s, min: s,})
    }
  }
  
  formatLength = (leng) => {
    const length = Math.floor(leng / 60);
    return length;
  }
  
  formatSession = (sess) => {
    const session = Math.floor(sess / 60);
    return session;
  }
  
  formatTime = (min) => {
    const minute = Math.floor(min / 60);
    const second = min % 60;
    return (
      (minute < 10 ? "0" + minute : minute) +
      ":" +
      (second < 10 ? "0" + second : second)
    )
  }
  
  breakIsOn = () => {
    if(this.state.min < 0 && this.state.label === "SESSION") {
      this.setState({min: this.state.leng, label: "BREAK"});
    } else if(this.state.min < 0 && this.state.label === "BREAK") {
      this.setState({min: this.state.sess, label: "SESSION"});
    }
  }
  

  
  render() {
    this.breakIsOn(); 
    
    const {sess, min, leng, label} = this.state;
    if(label === "BREAK") {
      document.getElementById("beep").play();
    }
    const time = this.formatTime(min);
    const session = this.formatSession(sess);
    const length = this.formatLength(leng);
    
    return (
      <div id="app">
        <h1 className="m-4">25 + 5 Clock</h1>
        <div className="row">
          <BreakLength 
            leng={length} 
            handleBrInc={this.handleBrInc}
            handleBrDec={this.handleBrDec}
          />
          <BreakSession 
            sess={session}
            handleSesInc={this.handleSesInc}
            handleSesDec={this.handleSesDec}
          />
        </div>
        <Timer time={time} label={label}/>
        <StartReset 
          handleReset={this.handleReset}
          handleStartStop={this.handleStartStop}
        />
        <audio 
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    )
  }
}


function BreakLength({leng, handleBrDec, handleBrInc}) {
  return (
    <div style={style} className="col">
      <div id="break-label">
        Break Length
      </div>
      <i 
        id="break-decrement" 
        onClick={handleBrDec}
        className="fas fa-arrow-alt-circle-down fa-lg m-3"
      >
      </i>
      <span id="break-length" className="m-3">{leng}</span>
      <i 
        id="break-increment"
        onClick={handleBrInc}
        className="fas fa-arrow-alt-circle-up fa-lg m-3"
      >
      </i>
    </div>
  )
}


function BreakSession({sess,  handleSesDec, handleSesInc}) {
  
  return (
    <div style={style} className="col">
      <div id="session-label">
        Break Session
       </div>
       <i 
         id="session-decrement"
         onClick={handleSesDec}
         className="fas fa-arrow-alt-circle-down fa-lg m-3">
       </i>
       <span id="session-length" className="m-3">{sess}</span>
       <i
         id="session-increment"
         onClick={handleSesInc}
         className="fas fa-arrow-alt-circle-up fa-lg m-3"></i>

     </div> 
  )
}

function Timer({time, label}) {

  return (
    <div id="timer">
      <div 
        id="timer-label" 
        className="m-2 fs-5"
        style={label === "BREAK" ? {color: "lightsalmon"}: {color: "white"}}
      >
        {label}
      </div>
      <div id="time-left" className="fs-1" style={label === "BREAK" ? {color: "lightsalmon"}: {color: "white"}}>
        {time}
      </div>
    </div>
  )
}

function StartReset({handleReset, handleStartStop}) {
  
  return (
     <div id="start-btn">
       <span 
         id="start_stop" 
         className="m-4"
         onClick={handleStartStop}
       >
         <i class="fas fa-play fa-lg"></i>
         <i class="fas fa-pause fa-lg"></i>
       </span>
       <i id="reset" onClick={handleReset} class="fas fa-sync-alt fa-lg m-4"></i>
     </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root')
);