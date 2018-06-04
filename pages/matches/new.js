import React, {Component} from 'react';
import Layout from '../../Components/Layout';
import moment from 'moment';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import ReactDOM from 'react-dom';
import InputMoment from 'input-moment';


class MatchNew extends Component{
  state = {
    minimumBet: '',
    errorMessage:'',
    loading: false,
    matchDate: moment(),
    home: '',
    away: '',
    betRate:0
  };
  handleChange = matchDate => {
   this.setState({ matchDate });
 };

 handleSave = () => {
   console.log('saved', this.state.matchDate.format('llll'));
 };
  onSubmit = async (event) =>{
    event.preventDefault();
    this.setState({loading: true, errorMessage:''});
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
         .createMatch(
            this.state.matchDate.format('x'),
            this.state.home,
            this.state.away,
            this.state.betRate,
            web3.utils.toWei(this.state.minimumBet, 'ether')
            )
         .send({
           from: accounts[0]
         });
      Router.pushRoute('/');
    } catch (e) {
        this.setState({errorMessage: e.message});
    } finally {

    }
    this.setState({loading:false});
  };
  render(){
    return (
      <Layout>
      <h3>Create a Match</h3>
      <Form onSubmit ={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <Input
            label = "Home team"
            labelPosition = "left"
            value = {this.state.home}
            onChange = {event => this.setState({home: event.target.value})}
          />
          <Input
            style ={{marginTop:'10px' }}
            label = "Away team"
            labelPosition = "left"
            value = {this.state.away}
            onChange = {event => this.setState({away: event.target.value})}
          />
          <Input
            style ={{marginTop:'10px' }}
            label = "Bet Rate"
            labelPosition = "left"
            value = {this.state.betRate}
            onChange = {event => this.setState({betRate: event.target.value})}
          />

          <label>Minimum Bet (eth)</label>
          <Input
            label = "eth"
            labelPosition = "left"
            value = {this.state.minimumBet}
            onChange = {event => this.setState({minimumBet: event.target.value})}
          />
        <label>Match Date time</label>
        <input type="text" value={this.state.matchDate.format('llll')} readOnly />
          <InputMoment
            moment={this.state.matchDate}
            minStep={5}
            onChange={this.handleChange}
            onSave={this.handleSave}
          />
        </Form.Field>
        <Message error header="Oops!" content = {this.state.errorMessage} />
        <Button loading={this.state.loading} primary>Create</Button>
      </Form>
      </Layout>
    );
  }
}

export default MatchNew;
