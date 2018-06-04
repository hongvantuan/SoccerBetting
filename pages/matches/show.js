import React, {Component} from 'react';
import Layout from '../../Components/Layout';
import matchBet from '../../ethereum/matchBet';
import {Label,Card, Grid, Button, Divider, Message} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import PlayBetForm from '../../Components/PlayBetForm';
import {Link} from '../../routes'
import moment from 'moment'
class matchBetShow extends Component{
  state ={
    claimLoading: false,
    claimErrorMessage: '',
    claimStatus:false,
    openBet: false
  };
  static async getInitialProps(props){
    const currentMatch = matchBet(props.query.address);

    const summary = await currentMatch.methods.getMatchSummary().call();

    return {
      address: props.query.address,
      home:summary[0],
      away:summary[1],
      matchDate: summary[2],
      minimalBet: summary[3],
      aBetAmount: summary[4],
      bBetAmount: summary[5],
      NbrAPlayer: summary[6],
      NbrBPlayer:summary[7],
      matchStatus: summary[8],
      betRate: summary[9],
      aScore: summary[10],
      bScore: summary[11]
    };
  }
  async handleClaim(event){
    event.preventDefault();
    this.setState({claimLoading: true, claimErrorMessage:''});
    const currentMatch = matchBet(this.props.address);
    try {
      const accounts = await web3.eth.getAccounts();
      await currentMatch.methods
         .getReward()
         .send({
           from: accounts[0]
         });

    } catch (e) {
        this.setState({claimErrorMessage: e.message});
    }
    this.setState ({claimLoading:false,
                    claimErrorMessage: 'Claim succes! Checkout wallet balance',
                    claimStatus:true
          });
  }
  renderCards(){
    const {
      address,
      home,
      away,
      matchDate,
      minimalBet,
      aBetAmount,
      bBetAmount,
      NbrAPlayer,
      NbrBPlayer,
      matchStatus,
      betRate,
      aScore,
      bScore
    } = this.props;
    var fDate =  new moment.unix(matchDate/1000);
    var now = new moment();
    this.state.openBet = (fDate > now);

    const items = [
        {
          header: home,
          meta: 'Number of bet ' + NbrAPlayer ,
          description: 'Total bet amount (eth) ' + web3.utils.fromWei(aBetAmount, 'ether'),
          style: { overflowWrap: 'break-word' }
        },
        {
          header: away,
          meta: 'Number of bet ' + NbrBPlayer ,
          description: 'Total bet amount (eth) ' + web3.utils.fromWei(bBetAmount, 'ether'),
          style: { overflowWrap: 'break-word' }
        },
        {
          header: fDate.format("dddd, MMM Do YYYY, h:mm"),
          meta: 'Play bet before this time',
          description:'Handicap: ' + ((betRate > 0) ? betRate/100 + ": 0" : "0:" + betRate/100)

        },
        {
          header: this.state.openBet ? 'Open':'Closed',
          meta: 'Status of match',
          description: aScore + ' - ' + bScore
        }
      ];

    return <Card.Group items = {items}/>;
  }
  render (){
    return (
        <Layout>
          <h3>Match information </h3>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                {this.renderCards()}

              </Grid.Column>
              <Grid.Column width={6}>
                <Grid.Row>
                    <PlayBetForm  matchStatus={this.state.openBet} address={this.props.address}
                                  home={this.props.home} away={this.props.away}/>
                </Grid.Row>
                <Grid.Row  style ={{marginTop:'10px' }}>
                    <Message  error={!this.state.claimStatus}
                              positive={this.state.claimStatus}
                              hidden={!this.state.claimErrorMessage}
                              header="Oops!" content = {this.state.claimErrorMessage} />
                    <Button loading ={this.state.claimLoading} color="orange" onClick={ (e) => this.handleClaim(e)}>Claim your reward</Button>
                </Grid.Row>
              </Grid.Column>
            </Grid.Row>
            <Divider/>
            <Label>For Manager</Label>
            <Grid.Row>
              <Grid.Column>
                <Link route={`/matches/${this.props.address}/inputMatchResult`}>
                  <a>
                    <Button primary disabled ={this.state.openBet} >Input Result</Button>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Layout>
      );
    }

  }
  export default matchBetShow;
