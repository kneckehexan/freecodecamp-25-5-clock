import React from "react";
import "./App.css";

import sessionStart from "./audio/sessionStart.wav";

class Sound extends React.Component {
  render() {
    return (
      <div>
        <audio id="beep" src={sessionStart} type="audio/mpeg">
          Browser doesn't support the audio element.
        </audio>
      </div>
    );
  }
}

class Change extends React.Component {
  handleChange = this.props.handleChange;
  render() {
    return (
      <div>
        <div
          id={this.props.changeID}
          onClick={() => this.handleChange(this.props.val, this.props.stateKey)}
          className={this.props.classType}
        ></div>
      </div>
    );
  }
}

class Break extends React.Component {
  render() {
    return (
      <div id="break-label">
        <h2>Break Length</h2>
        <div className="flexirow">
          <div>
            <Change
              changeID="break-increment"
              stateKey="breakLength"
              val="+"
              handleChange={this.props.handleChange}
              classType="up"
            />
            <Change
              changeID="break-decrement"
              stateKey="breakLength"
              val="-"
              handleChange={this.props.handleChange}
              classType="down"
            />
          </div>
          <div id="break-length">{this.props.breakLength}</div>
          min
        </div>
      </div>
    );
  }
}

class Session extends React.Component {
  render() {
    return (
      <div id="session-label">
        <h2>Session Length</h2>
        <div className="flexirow">
          <div>
            <Change
              changeID="session-increment"
              stateKey="sessionLength"
              val="+"
              handleChange={this.props.handleChange}
              classType="up"
            />
            <Change
              changeID="session-decrement"
              stateKey="sessionLength"
              val="-"
              handleChange={this.props.handleChange}
              classType="down"
            />
          </div>
          <div id="session-length">{this.props.sessionLength}</div>
          min
        </div>
      </div>
    );
  }
}

class Timer extends React.Component {
  render() {
    let minutes = String(this.props.minutes).padStart(2, "0");
    let seconds = String(this.props.seconds).padStart(2, "0");
    return (
      <div>
        <div id="timer-label">
          <h2>{this.props.timerLabel}</h2>
          <div id="time-left">
            {minutes}:{seconds}
          </div>
        </div>
      </div>
    );
  }
}

class Controls extends React.Component {
  handleToggle = this.props.handleToggle;

  handleReset = this.props.handleReset;

  render() {
    return (
      <div className="flexirow flexrowcentered">
        <div
          id="start_stop"
          className={!this.props.paused ? "pause" : "play"}
          onClick={() => this.handleToggle()}
        ></div>
        <div id="reset" onClick={() => this.handleReset()}>
          &#11119;
        </div>
      </div>
    );
  }
}

const INIT = {
  break: 5,
  session: 25,
  seconds: 0,
  timerLabel: "Session",
  paused: true,
  sndsrc: null
};

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: INIT.break,
      sessionLength: INIT.session,
      timerLabel: INIT.timerLabel,
      minutes: INIT.session,
      seconds: INIT.seconds,
      paused: INIT.paused,
      soundsrc: INIT.sndsrc
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick() {
    if (this.state.minutes === 0 && this.state.seconds === 0) {
      if (this.state.timerLabel === "Session") {
        this.setState({
          timerLabel: "Break",
          minutes: this.state.breakLength,
          seconds: 0
        });
        document.getElementById("beep").play();
      } else {
        this.setState({
          timerLabel: "Session",
          minutes: this.state.sessionLength,
          seconds: 0
        });
        document.getElementById("beep").play();
      }
      this.setState({
        seconds: 0
      });
      return;
    }
    if (this.state.seconds > 0) {
      this.setState((prevState) => ({
        seconds: prevState.seconds - 1
      }));
    } else if (this.state.seconds === 0) {
      this.setState((prevState) => ({
        minutes: prevState.minutes - 1,
        seconds: 59
      }));
    }
  }

  handleToggle() {
    this.setState(
      {
        paused: !this.state.paused
      },
      () => {
        if (!this.state.paused) {
          this.timer = setInterval(this.tick, 1000);
        } else {
          clearInterval(this.timer);
        }
      }
    );
  }

  handleChange(val, key) {
    if (val === "+") {
      if (this.state[key] < 60) {
        this.setState((prevState) => ({
          [key]: prevState[key] + 1
        }));
        if (key === "sessionLength") {
          this.setState((prevState) => ({
            minutes: prevState.minutes + 1
          }));
        }
      }
    } else if (val === "-") {
      if (this.state[key] > 1) {
        this.setState((prevState) => ({
          [key]: prevState[key] - 1
        }));
        if (key === "sessionLength") {
          this.setState((prevState) => ({
            minutes: prevState.minutes - 1
          }));
        }
      }
    }
  }

  handleReset() {
    this.setState(
      {
        breakLength: INIT.break,
        sessionLength: INIT.session,
        timerLabel: INIT.timerLabel,
        minutes: INIT.session,
        seconds: 0,
        paused: true
      },
      () => {
        if (this.timer != null) {
          clearInterval(this.timer);
        }
      }
    );
    var audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  render() {
    return (
      <div id="clock" className="flexicol">
        <div className="flexirow">
          <Break
            breakLength={this.state.breakLength}
            handleChange={this.handleChange}
          />
          <Session
            sessionLength={this.state.sessionLength}
            handleChange={this.handleChange}
          />
        </div>
        <Timer
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          timerLabel={this.state.timerLabel}
        />
        <Controls
          handleReset={this.handleReset}
          handleToggle={this.handleToggle}
          paused={this.state.paused}
        />
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clock />
        <Sound />
      </header>
    </div>
  );
}

export default App;
