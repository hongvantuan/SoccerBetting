import React, {Component} from 'react';
import Layout from '../../Components/Layout';
import moment from 'moment';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import matchBet from '../../ethereum/matchBet';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';
import ReactDOM from 'react-dom';
import InputMoment from 'input-moment';


class MatchResult extends Component{
  state = {
    errorMessage:'',
    loading: false,
    home: '',
    away: '',

  };
  static getInitialProps(props)
  {
    return {address:props.query.address};
  }

  onSubmit = async (event) =>{
    event.preventDefault();
    this.setState({loading: true, errorMessage:''});
    try {

      const accounts = await web3.eth.getAccounts();
      const currentMatch = matchBet(this.props.address);
      

      await currentMatch.methods
         .finalizeMatch(
            this.state.home,
            this.state.away
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
            label = "Home team score"
            labelPosition = "left"
            value = {this.state.home}
            onChange = {event => this.setState({home: event.target.value})}
          />
        </Form.Field>
        <Form.Field>
          <Input
            style ={{marginTop:'10px' }}
            label = "Away team score"
            labelPosition = "left"
            value = {this.state.away}
            onChange = {event => this.setState({away: event.target.value})}
          />
        </Form.Field>
        <Message error header="Oops!" content = {this.state.errorMessage} />
        <Button loading={this.state.loading} primary>Save</Button>
      </Form>
      </Layout>
    );
  }
}

export default MatchResult;
