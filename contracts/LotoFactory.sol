pragma solidity ^0.4.17;

import "./Loto.sol";

contract LotoFactory {

  // index of created contracts

  address[] public contracts;

  // useful to know the row count in contracts index

  function getContractCount() 
    public
    constant
    returns(uint contractCount)
  {
    return contracts.length;
  }

  // deploy a new contract

  function newCookie()
    public
    returns(address newContract)
  {
    Loto c = new Loto();
    contracts.push(c);
    return c;
  }
}