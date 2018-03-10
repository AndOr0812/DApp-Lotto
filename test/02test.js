// Include web3 library so we can query accounts.
const Web3 = require('web3')
// Instantiate new web3 object pointing toward an Ethereum node.
let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
// Include AuthorDonation contract
let AuthorDonation = artifacts.require("./AuthorDonation")

// Test with Mocha
contract('AuthorDonation', function(accounts) {
  // Setup a variable to hold the contract object.
  var authorDonation
  // A convenience to view account balances in the console before making changes.
  printBalances(accounts)
  // Create a test case for retreiving the deployed contract.
  // We pass 'done' to allow us to step through each test synchronously.
  it("Should retrive deployed contract.", function(done) {
    // Check if our instance has deployed
    AuthorDonation.deployed().then(function(instance) {
      // Assign our contract instance for later use
      authorDonation = instance
      console.log('author donation', authorDonation)
      // Pass test if we have an object returned.
      assert.isOk(authorDonation)
      // Tell Mocha move on to the next sequential test.
      done()
    })
  })


  // Test for depositing 1 Ether
  it("Should deposit 1 ether.", function(done) {
    // Call the donate method on the contract. Since that method is tagged payable,
    // we can send Ether by passing an object containing from, to and amount.
    // All transactions are carried sent in wei. We use a web3 utility to convert from Ether.
    authorDonation.donate({from:accounts[3], to:authorDonation.address, value: web3.toWei(1, "ether")})
    .then(function(tx) {
      // Pass the test if we have a transaction reciept returned.
      assert.isOk(tx.receipt)
      // For convenience, show the balances of accounts after transaction.
      printBalances(accounts)
      done()
    }, function(error) {
        // Force an error if callback fails.
        assert.equal(true, false)
        console.error(error)
        done()
      })
  })

  // Utility function to display the balances of each account.
  function printBalances(accounts) {
    accounts.forEach(function(ac, i) {
      console.log(i, web3.fromWei(web3.eth.getBalance(ac), 'ether').toNumber())
    })
  }
})