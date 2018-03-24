import React, { Component } from 'react';
import { default as contract } from 'truffle-contract'
import getWeb3 from './getWeb3'

import loto_artifacts from './Loto.json'

var web3;
var Loto = contract(loto_artifacts);


export default class Admin extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          disabled: true
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

    updBalance() {
        let amount = web3.toWei(document.getElementById('amount').value);
        web3.eth.sendTransaction({from:web3.eth.accounts[0], to:Loto.address, value: amount},(err, transactionHash) => {
          if (!err)
            console.log(transactionHash);});
    }
    
    getBalance() {
        web3.eth.getBalance(Loto.address,(err, res) => {
          if (!err)
            console.log(web3.fromWei(res.toNumber()));});
    }

    async check() {
      //I like it
      let LotoInstance
      LotoInstance = await Loto.deployed()
      await LotoInstance.get.call(1).then((value) => {return console.log('Number of tickets ' + value[1] +'\nTicket address' + value[2])})
      await LotoInstance.winnerN.call().then((value) => {return console.log('The winner number is ' + value)})
      await LotoInstance.currentState.call().then((value) => {return console.log(value.toNumber())})
    }
  
    start() {
      Loto.deployed().then(function(instance){return instance.roundStart({from: web3.eth.accounts[0]});});
    }
    destruct() {
      Loto.deployed().then(function(instance){return instance.selfDestruct({from: web3.eth.accounts[0]});});
  
      //Loto.deployed().then(function(instance){return instance.withdraw({from: web3.eth.accounts[0]});});
    }


    render() {
        return (
          <div className="App">
            <p className="App-intro">
            <label for="amount">ETH to contract:</label><input  type="text" id="amount"></input>
            <pre><button onClick= {this.updBalance}>Send</button></pre>
              <pre><button onClick= {this.check} >Check whats going on!</button></pre>
            <pre><button onClick= {this.getBalance} >The contract balance</button></pre>
            <pre><button onClick= {this.start} >Start round!</button></pre>
            </p>
          </div>
        );
      }
}