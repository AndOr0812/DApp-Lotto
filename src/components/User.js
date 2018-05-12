import React, { Component } from 'react';
import { default as contract } from 'truffle-contract'
import getWeb3 from '.././getWeb3'


import loto_artifacts from '.././Loto.json'

var web3;
var Loto = contract(loto_artifacts);
let LotoInstance;

export default class User extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          disabled: true,
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
    
    async checkRound() {
        var that = this;
        LotoInstance = await Loto.deployed()

        await LotoInstance.currentState.call().then((value) => {
          if(value.toNumber() !== 0)
          that.setState({
            disabled: false
          })
          return value.toNumber();
        });
    }

    async check() {
      //I like it
      await LotoInstance.get.call(1).then((value) => {return console.log('Number of tickets ' + value[1] +'\nTicket address' + value[2])})
      await LotoInstance.winnerN.call().then((value) => {return console.log(`The winner number is ${value}`)})
      await LotoInstance.currentState.call().then((value) => {return console.log(value.toNumber())})
    }

    async sendMoney() {
        let amount = web3.toWei(document.getElementById('amount').value);
        await LotoInstance.EnterRound({from: web3.eth.accounts[0], value: amount})
        await LotoInstance.ticketsN.call()
          .then((value) => {
            this.setState({ ticketsN: value.toNumber()})
            return console.log(value.toNumber())
        })
        await LotoInstance.currentState.call()
          .then((value) => {
              //YOU SHOULD WORK ON SHARED STATES Or translating it as props
            this.setState({ timer: value.toNumber() == 2 ? true : false })
            return console.log(value.toNumber())
        });
    }

    async withdraw() {
        LotoInstance.withdraw({from: web3.eth.accounts[0]});
    }

    render() {
        return(
          <div className="App">
            <p className="App-intro">
              <pre><label>Rules are simple, just enter the amount you wish to send, and wait for the draw!</label></pre>
              <pre><label>10% of incomes will go to Multi-sig Escrow contract to form jackpot(not available)</label></pre>
              <pre><label>You will be notified if you're one of the winners!(not yet implemented)</label></pre>
              <label for="amount">Amount:</label><input disabled={this.state.disabled}  type="text" id="amount" placeholder="min. 0.05 ETH"></input>
              <pre><button disabled={this.state.disabled} onClick={this.sendMoney}>Enter round!</button></pre>
              <pre><button onClick={this.check}>Check whats going on!</button></pre>
              <pre><label>If you appear to be the winner</label></pre>
              <pre><button disabled={this.state.withdraw} onClick={this.withdraw}>Withdraw!</button></pre>
            </p>
          </div>        
        );
    }
}