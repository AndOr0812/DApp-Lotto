import React, { Component } from 'react';
import logo from './logo.svg';
import getWeb3 from './getWeb3'
import { default as contract } from 'truffle-contract'
import './App.css';

import loto_artifacts from './Loto.json'

var web3;
var Loto = contract(loto_artifacts);


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabled: true,
      date: new Date(),
      ticketsN: 0,
      timer: false,
      withdraw: false
    }
    this.sendMoney = this.sendMoney.bind(this);
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
    Loto.deployed().then((instance) => {return instance.currentState.call();}).then((value) => {
      if(value.toNumber() !== 0)
      that.setState({
        disabled: false
      })
      return value.toNumber();
    });
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


  sendMoney() {
    var LotoInstance;
    let amount = web3.toWei(document.getElementById('amount').value);
    Loto.deployed().then((instance) => {
      LotoInstance = instance;
      return instance.EnterRound({from: web3.eth.accounts[0], value: amount});
    }).then((result) => {
      return LotoInstance.ticketsN.call();
    }).then((value) => {
      this.setState({ ticketsN: value.toNumber()})
      return console.log(value.toNumber())
    }).then((result) => {
      return LotoInstance.currentState.call();
    }).then((value) => {
      this.setState({ timer: value.toNumber() == 2 ? true : false })
      return console.log(value.toNumber())
    });
  }
  check() {
      Loto.deployed().then((instance) => {return instance.get.call(1);}).then((value) => {return console.log('Number of tickets ' + value[1] +'\nTicket address' + value[2])});
      Loto.deployed().then((instance) => {return instance.winnerN.call();}).then((value) => {return console.log('The winner number is ' + value)});
      Loto.deployed().then((instance) => {return instance.currentState.call();}).then((value) => {return console.log(value.toNumber())});
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

  withdraw() {
        Loto.deployed().then((instance) => {return instance.withdraw({from: web3.eth.accounts[0]});});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to first install of our Dapp Lotto!</h1>
        </header>
        <p className="App-intro">
        <pre><label>Rules are simple, just enter the amount you wish to send, and wait for the draw!</label></pre>
        <pre><label>10% of incomes will go to Multi-sig(no) Escrow contract to form jackpot(not available)</label></pre>
        <pre><label>You will be notified if you're one of the winners!(not yet implemented){this.state.val}</label></pre>
        <label for="amount">Amount:</label><input disabled={this.state.disabled}  type="text" id="amount" placeholder="min. 0.05 ETH"></input>
        <pre><button disabled={this.state.disabled} onClick={this.sendMoney}>Enter round!</button></pre>
	      <pre><button onClick={this.check}>Check whats going on!</button></pre>
        <pre><label>If you appear to be the winner</label></pre>
        <pre><button disabled={this.state.withdraw} onClick={this.withdraw}>Withdraw!</button></pre>
        </p>
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