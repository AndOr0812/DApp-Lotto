pragma solidity ^0.4.17;

//import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";
import "./oraclizeAPI.sol";



contract Loto is usingOraclize {
    uint price = 50 finney;
    uint256 minUsers = 100;

    address private escrow;
    address public owner;
    mapping(uint256 => address) public tickets;
    uint256 public ticketsN = 0;
    mapping(address => bool) public rewardClaimable;
    uint private reward;
    //uint private jackpot;

    enum RoundState {noGame, roundStarted, timerStarted}
    RoundState public currentState;

    uint256 public winnerN;
    bytes32 public oraclizeID;

    uint256 gas = 500000;

    modifier ownerOnly {
        if (msg.sender != owner) 
        revert();
        _;
    }
    //DEPRECATE
    event RoundStarted(uint256 closingBlock);

    function Loto() public {
        owner = msg.sender;
        currentState = RoundState.noGame;
        //OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }

    //DEPRECATED, SHOULD BE SET ONCE ON DEPLOYING IN CONSTRUCTOR
    function setEscrow(address _escrow) ownerOnly public {
        escrow = _escrow;
    }

    function roundStart() public ownerOnly {
        //DEPRECATE THE F EVENT
        //RoundStarted(block.number + ROUND_LENGTH);
        require(currentState == RoundState.noGame);
        currentState = RoundState.roundStarted;
    }

    //Main and only accessible function to clients
    function EnterRound() payable public {
        require(msg.value >= price);
        require(currentState != RoundState.noGame);
            if (ticketsN <= 1000) {
                ticketsN++;
                tickets[ticketsN] = msg.sender;
                escrow.transfer((msg.value * 10)/100);
            } else {
                ticketsN++;
                tickets[ticketsN] = msg.sender;
                escrow.transfer(msg.value);
                //event maxUserReached(...);
            }
            if(ticketsN == 3) {
                //ALL YOU HAD TO DO WAS TO START THE DAMN TIMER CJ
                setTimer();
            }
    }

    function getWin() private {
        currentState = RoundState.noGame;
        oraclize_query("WolframAlpha", strConcat("random between 1 and ", uint2str(ticketsN)),gas);
    }

    function __callback(bytes32 _oraclizeID, string _result) {
        require(msg.sender == oraclize_cbAddress());
        //better check with Query ID but nah, it'll be easier to demonstrate
        //CHECK WITH QUERY ID
        if(currentState == RoundState.timerStarted) {
            getWin();
        } else {
            winnerN = parseInt(_result);
            rewardClaimable[tickets[winnerN]] = true;
            //CALCULATE REWARD, 10% - escrow, 2% - ours
            reward = ticketsN * 44 finney;
        }
    }

    function setTimer() private {
        //Move to server side, could be better
        currentState = RoundState.timerStarted;
        oraclize_query(20/*864000*/,"WolframAlpha","5 + 3", gas);
    }
    //Pull over push goes here
    function withdraw() public {
        //JUST LET HIM TAKE MONEY, JACKPOT SEPARATELLY
        //Looks bad
        require(msg.sender == tickets[winnerN]);
        require(rewardClaimable[msg.sender] == true);
        rewardClaimable[msg.sender] = false;
        msg.sender.transfer(reward);
    }

    //You don't need it, there're public accessors, just for UI sake
    function get(uint256 tick) constant public returns (uint,uint256,address) {
        return (price,ticketsN,tickets[tick]);
    }

    function selfDestruct() ownerOnly {
        selfdestruct(owner);
    }

    function () payable {    
    }
}