const HDWalletProvider = require ('truffle-hdwallet-provider');
const Web3 = require ('Web3');

const compiledFactory = require('./build/MatchFactory.json');
const compiledCampaign = require('./build/matchBet.json');

const provider = new HDWalletProvider(
    'oppose wrong grass armor index wire chase hurdle ride lonely equal pyramid',
    'https://rinkeby.infura.io/15fzSshnYD5QGCNBYX73'
);
const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

const result =  await new web3.eth.Contract (JSON.parse(compiledFactory.interface))
        .deploy({data: '0x' + compiledFactory.bytecode})
        .send({gas:'3000000', from: accounts[0]});


console.log('Contract deploy to', result.options.address );
};
deploy();
