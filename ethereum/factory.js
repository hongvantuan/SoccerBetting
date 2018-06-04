import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xeA06cBF54c183606F8Bb0b37026D0c26c60eB884'
);

// edit code
export default instance;
