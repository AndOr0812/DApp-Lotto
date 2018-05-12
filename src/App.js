import React, { Component } from 'react';
import logo from './logo.svg';
import getWeb3 from './getWeb3'
import { default as contract } from 'truffle-contract'
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import User from './components/User';


import loto_artifacts from './Loto.json'

var web3;
var Loto = contract(loto_artifacts);


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabled: true,
      ticketsN: 0,
      timer: false,
      withdraw: false
    }
  }
  
  componentWillMount() {
    //Get network provider
    getWeb3
    .then(results => {
        web3 = results.web3;
        Loto.setProvider(web3.currentProvider);
        
        if (typeof Loto.currentProvider.sendAsync !== "function") {
          Loto.currentProvider.sendAsync = () => {
            return Loto.currentProvider.send.apply(
              Loto.currentProvider,
                  arguments
            );
          };
        }
        this.checkRound();
    })
  }

  checkRound() {
    var that = this;
    Loto.deployed().then((instance) => {return instance.ticketsN.call();}).then((value) => {
      that.setState({ ticketsN: value.toNumber()})});
      Loto.deployed()
        .then((instance) => {
        return instance.currentState.call();
      }).then((value) => {
        this.setState({ timer: value.toNumber() == 2 ? true : false })
        return console.log(value.toNumber())
      })
  }

  events() {
    //screw this it's not working
    Loto.deployed().then((instance) => { 
    return instance.roundStart({from: web3.eth.accounts[0]});
    });

    Loto.deployed().then((instance) => {
      return instance.RoundStarted({},{fromBlock: 0, toBlock: 'latest'});
    }).then((result) => {
      return result.watch((error,result) => { 
        console.log('Found him!')
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to first install of our Dapp Lotto!</h1>
              <Link to="/admin">Admin</Link>
              <Link to="/">Market List</Link>
            </header>
            <Route exact path="/" component={User} />
            <Route exact path="/admin" component={Admin} />
          </div>
        </Router>
        <div id="Stats">
          <span className="left">Number of users</span>
          <span className="right">Is timer started?</span>
        </div>
        <div  id="Nums">
          <span className="left">{this.state.ticketsN}</span>
          <span className="right">{this.state.timer ? 'Yes' : 'No'}</span>
        </div>
      </div>
    );
  }
}

export default App;