pragma solidity ^0.4.17;

contract MatchFactory{


  address[] public deployedMatches;

    function createMatch(uint matchDateTime,string teamAName, string teamBName, int Betrate, uint minimum) public{
        address newMatch = new matchBet(matchDateTime, teamAName,  teamBName,  Betrate, minimum, msg.sender);
        deployedMatches.push(newMatch);
    }
    function getDeployMatches() public view returns (address []){
        return deployedMatches;
    }
}

contract matchBet
{


    uint public matchDate;
    string public teamA;
    string public teamB;
    int rate;
    uint public aBetAmount;
    uint public bBetAmount;
    bool public finish;
    mapping (address => uint) playerA;
    mapping (address => uint) playerB;
    address [] public addressPlayerA;
    address [] public addressPlayerB;
    int score;
    int public aScore;
    int public bScore;


  address public manager;
  uint public minimalBet;



    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
  function matchBet(uint matchDateTime,string teamAName, string teamBName, int Betrate, uint minBet, address creator) public {

      matchDate = matchDateTime;
      teamA = teamAName;
      teamB = teamBName;
      rate = Betrate;
      minimalBet = minBet;
      manager = creator;
      aBetAmount = 0;
      bBetAmount = 0;
      finish=  false;
      addressPlayerB =  new address[](0);
      addressPlayerA = new address[](0);
      score = 0;
      aScore = 0;
      bScore =0;
  }

  function playBet (uint chosen )public payable {

    //check not finish
    require(!finish);
    //check not start yet
   // require(matchDate > now );

    if(chosen == 0) //team A
    {
        playerA[msg.sender] = msg.value;
        aBetAmount += msg.value;
        addressPlayerA.push(msg.sender);

    }
    else //team B
    {
        playerB[msg.sender] = msg.value;
        bBetAmount += msg.value;
        addressPlayerB.push(msg.sender);
    }
  }
 function getMatchSummary () public view returns (string, string, uint, uint,uint, uint,uint,uint, bool,int, int,int) {
      return (
            teamA,
            teamB,
            matchDate,
            minimalBet,
            aBetAmount,
            bBetAmount,
            addressPlayerA.length,
            addressPlayerB.length,
            finish,
            rate,
            aScore,
            bScore
        );
  }
  function getReward() public payable{
     if(score - rate == -25)// A thua 1/2 tien, B an 1/2
     {
         transferMoney(playerA[msg.sender], msg.sender, 0, 2, 0);
         transferMoney(playerB[msg.sender], msg.sender, 1, 2, 1);
    }
     else if (score - rate <= -50) // a thua du tien, B an du
     {
         transferMoney(playerA[msg.sender], msg.sender, 0, 1, 0);
         transferMoney(playerB[msg.sender], msg.sender, 1, 1, 1);
     }
      else if(score - rate == 25)//A an 1/2 tien, B thua 1/2
     {
         transferMoney(playerA[msg.sender], msg.sender, 1, 2, 0);
         transferMoney(playerB[msg.sender], msg.sender, 0, 2, 1);
     }
     else if (score - rate >= 50) // a an du tien, B thua du
     {
         transferMoney(playerA[msg.sender], msg.sender, 1, 1,0);
     }
     else if(score - rate == 0) // hoa
     {
         transferMoney(playerA[msg.sender], msg.sender, 2, 2, 0);
         transferMoney(playerB[msg.sender], msg.sender, 2, 2, 0);
     }
    playerA[msg.sender] = 0;
    playerB[msg.sender] = 0;
  }

  function finalizeMatch(int aResult, int bResult ) public restricted {
    //check match is not finish
    require(!finish);

    //check started yet
    //require(matchDate > now );
    score = (aResult - bResult)*100;
    aScore = aResult;
    bScore = bResult;
    finish = true;
    }
    function  transferMoney(uint betAmount, address x, uint win, uint winRate, uint chosen) private
    {
            //winRate = 1 win all, winRate = 2 win 1/2
            //win = 0 -> loose, win_loose = 1 -> win, draw = 2
            //chosen = 0 -> calculate team a, calculate chosen = 1, team B
            uint refund =0;
            if(x != 0)
            {

                if(win == 1 && winRate != 0)// neu an du hoac an 1/2 ==> tính refund
                {    if(chosen == 0)
                        refund = ((betAmount * bBetAmount)/aBetAmount) / winRate;
                    else if(chosen == 1)
                        refund = ((betAmount * aBetAmount)/bBetAmount) / winRate;
                    refund = refund + betAmount;
                }
                else if(win == 0 && winRate == 2) // thua 1/2
                {
                    refund = betAmount /winRate;
                }
                else if (win == 2) //hoa
                    refund = betAmount;
                x.transfer(refund);
           }
    }

}
