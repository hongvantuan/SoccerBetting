import web3 from './web3';
import matchBet from './build/matchBet.json'


export default(address) =>{
  return new web3.eth.Contract(
    JSON.parse(matchBet.interface),
    address
  );
};
