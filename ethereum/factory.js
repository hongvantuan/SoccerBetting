import web3 from './web3';
import MatchFactory from './build/MatchFactory.json';
const instance = new web3.eth.Contract(
  JSON.parse(MatchFactory.interface),
  '0x33Fb663660210925F346dcD38A469Bb8d59813C5'
);

// edit code
export default instance;
