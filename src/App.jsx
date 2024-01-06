import React, { Component } from "react";

//Algorithms
import bs from "./algorithms/BubbleSort.jsx";
// icons
import Play from "@mui/icons-material/PlayCircleOutlineRounded.js";
import Forward from "@mui/icons-material/SkipNextRounded.js";
import Backward from "@mui/icons-material/SkipPreviousRounded.js";
import RotateLeft from "@mui/icons-material/RotateLeft.js";

import Bar from "./components/Bar.jsx";
import "./App.css";
import "./mediaQueries.css";
import bubblesort from "./algorithms/BubbleSort.jsx";

class App extends Component {
  state = {
    array: [],
    arraySteps: [],
    colorkey: [],
    colorSteps: [],
    currentStep: 0,
    count: 10,
    delay: 100,
    algorithm: "Bubble Sort",
    timeouts: [],
  };

  ALGORITHMS = {
    "Bubble Sort": bubblesort,
  };
  componentDidMount() {
    this.generateRandomArray();
  }

  generateSteps = () => {
    let array = this.state.array.slice();
    let steps = this.state.arraySteps.slice();
    let colorSteps = this.state.colorSteps.slice();

    this.ALGORITHMS[this.state.algorithm](array, 0, steps, colorSteps);

    this.setState({
      arraySteps: steps,
      colorSteps: colorSteps,
    });
  };

  clearTimeouts = () => {
    this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.setState({
      timeout: [],
    });
  };
  clearColorKey = () => {
    let blankKey = new Array(this.state.count).fill(0);
    this.setState({
      colorkey: blankKey,
      colorSteps: [blankKey],
    });
  };

  generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  generateRandomArray = () => {
    this.clearTimeouts();
    this.clearColorKey();
    const count = this.state.count;
    const temp = [];

    for (let i = 0; i < count; i++) {
      temp.push(this.generateRandomNumber(50, 200));
    }

    this.setState(
      {
        array: temp,
        arraySteps: [temp],
        currentStep: 0,
      },
      () => {
        this.generateSteps();
      }
    );
  };

  changeArray = (index, value) => {
    let arr = this.state.array;
    arr[index] = value;
    this.setState(
      {
        array: arr,
        arraySteps: [arr],
        currentStep: 0,
      },
      () => {
        this.generateSteps();
      }
    );
  };

  previousStep = () => {
    let currentStep = this.state.currentStep;
    if (currentStep === 0) return;
    currentStep -= 1;
    this.setState({
      currentStep: currentStep,
      array: this.state.arraySteps[currentStep],
      colorkey: this.state.colorSteps[currentStep],
    });
  };

  nextStep = () => {
    let currentStep = this.state.currentStep;
    if (currentStep >= this.state.arraySteps.length - 1) return;
    currentStep += 1;
    this.setState({
      currentStep: currentStep,
      array: this.state.arraySteps[currentStep],
      colorkey: this.state.colorSteps[currentStep],
    });
  };

  //code for button to start sorting
  start = () => {
    let steps = this.state.arraySteps;
    let colorSteps = this.state.colorSteps;

    this.clearTimeouts();

    let timeouts = [];
    let i = 0;

    while (i < steps.length - this.state.currentStep) {
      let timeout = setTimeout(() => {
        let currentStep = this.state.currentStep;
        this.setState({
          array: steps[currentStep],
          colorkey: colorSteps[currentStep],
          currentStep: currentStep + 1,
        });
        timeouts.push(timeout);
      }, this.state.delay * i);
      i++;
    }

    this.setState({
      timeouts: timeouts,
    });
  };

  render() {
    let bars = this.state.array.map((value, index) => {
      return (
        <Bar
          key={index}
          index={index}
          length={value}
          color={this.state.colorkey[index]}
          changeArray={this.changeArray}
        />
      );
    });

    let playButton;

    if (this.state.arraySteps.length === this.state.currentStep) {
      playButton = (
        <button className="controller" onClick={this.generateRandomArray}>
          <RotateLeft />
        </button>
      );
    } else {
      playButton = (
        <button className="controller" onClick={this.start}>
          <Play />
        </button>
      );
    }
    return (
      <div className="app">
        <h1 className="title">Bubble Sort</h1>
        <div className="frame">
          <div className="barsDiv container card">{bars}</div>
        </div>
        <div className="cotrol-pannel">
          <div className="control-buttons">
            <button className="controller" onClick={this.previousStep}>
              <Backward />
            </button>
            {playButton}
            <button className="controller" onClick={this.nextStep}>
              <Forward />
            </button>
          </div>
        </div>
        <div className="pannel"></div>
      </div>
    );
  }
}

export default App;
