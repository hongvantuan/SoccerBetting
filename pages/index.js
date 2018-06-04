import React, {Component} from 'react';
import factory from '../ethereum/factory';
import {Card, Button, Table} from 'semantic-ui-react'
import Layout from '../Components/Layout'
import matchBet from '../ethereum/matchBet'
import web3 from '../ethereum/web3'
import {Link} from '../routes'
import moment from 'moment'
import _ from 'lodash'
class BettingIndex extends Component{

  static async getInitialProps()
  {
    const matches = await factory.methods.getDeployMatches().call();
    var currentMatchArray = [];
  //  for (var variable in matches) {
    //  currentMatchArray.push(matchBet(variable));
    //  console.log(variable);
    //}
    var fDate;
    var now = new moment();;
    if(matches.length > 0)
    {
      for (let i = 0; i < matches.length; i++) {
        const currentMatch =  matchBet(matches[i]);
        const summary = await currentMatch.methods.getMatchSummary().call();
        fDate =  new moment.unix(summary[2]/1000);

        currentMatchArray.push( {
          address: currentMatch.options.address,
          home: summary[0],
          away: summary[1],
          matchStatus: (fDate > now)?"Open":"Closed",
          matchDate: fDate.format("MMM Do, h:mm"),
          aBetAmount: web3.utils.fromWei(summary[4],'Ether'),
          bBetAmount: web3.utils.fromWei(summary[5], 'Ether'),
          betRate: summary[9] > 0 ? summary[9]/100 + ": 0" : "0:" + summary[9]/100
        });

      }

    }
    return {  currentMatchArray  };
  }
  renderMatches(){

    const items = this.props.currentMatchArray.map((object)  =>{
      return{
          address: object.address,
          home: object.home,
          away: object.away,
          matchDate: object.matchDate,
          totalBet: parseFloat(object.aBetAmount) + parseFloat(object.bBetAmount),
          matchStatus: object.matchStatus,
          rate: object.betRate,
          link:(
          <Link route={`/matches/${object.address}`}>
           <a>View Match</a>
          </Link>
          ),
          style:{overflowWrap:'break-word'},
      };

    });

    return (
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell  >
              Address
            </Table.HeaderCell>
            <Table.HeaderCell  >
              Home
            </Table.HeaderCell>
            <Table.HeaderCell  >
              Away
            </Table.HeaderCell>
            <Table.HeaderCell  >
              Handicap rate
            </Table.HeaderCell>
            <Table.HeaderCell >
              Match Date
            </Table.HeaderCell>
            <Table.HeaderCell >
              Total Bet (Eth)
            </Table.HeaderCell>
            <Table.HeaderCell >
              Status
            </Table.HeaderCell>
            <Table.HeaderCell >
              Link
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(items, ({home,away,rate, totalBet, address, matchDate, matchStatus, link }) => (
            <Table.Row key={address}>
              <Table.Cell>{address}</Table.Cell>
              <Table.Cell>{home}</Table.Cell>
              <Table.Cell>{away}</Table.Cell>
              <Table.Cell>{rate}</Table.Cell>
              <Table.Cell>{matchDate}</Table.Cell>
              <Table.Cell>{totalBet}</Table.Cell>
              <Table.Cell>{matchStatus}</Table.Cell>
              <Table.Cell>{link}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
  render(){
      return (
      <Layout>
        <div>
          <h3>Match list</h3>
          <Link route = "/matches/new">
          <a>
            <Button
              floated = "right"
              content="Create match"
              icon = "add circle"
              primary
            />
          </a>
          </Link>
        {this.renderMatches()}
        </div>
      </Layout>
    );
  }
}

export default BettingIndex;
