import React, { Component } from 'react';
import { Form, Input, Message, Button, Checkbox } from 'semantic-ui-react';
import matchBet from '../ethereum/matchBet';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class PlayBetForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
    chosen:'0',
    transactionHash:'',
    betStatus:''
  };
    handleChange (e)
    {
      this.setState({chosen : event.target.value});
    }


   onSubmit = async event => {
    event.preventDefault();

    const currentMatch = matchBet(this.props.address);

    this.setState({ loading: true, errorMessage: '' });
    var that = this;
    try {
      const accounts = await web3.eth.getAccounts();
      await currentMatch.methods.playBet(
        this.state.chosen
      ).send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      }).on('transactionHash',function(hash){
          that.setState({transactionHash: 'https://rinkeby.etherscan.io/tx/' + hash});
          that.setState({betStatus: 'pending'});
          })
        .on('confirmation', function(receipt){
          that.setState({betStatus: 'Transaction confirmed'});
          })
        .on('error', function(error){
          that.setState({betStatus:'error'});
          })


      Router.replaceRoute(`/matches/${this.props.address}`);

    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <Checkbox
            radio
            label={this.props.home}
            name='checkboxRadioGroup'
            value='0'
            checked={this.state.chosen==='0'}
            onChange={event => this.setState({ chosen: '0' })}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            radio
            label={this.props.away}
            name='checkboxRadioGroup'
            value='1'
            checked={this.state.chosen === '1'}
            onChange={event => this.setState({ chosen: '1' })}
          />
        </Form.Field>
        <Form.Field>
          <label>Bet Amount (Eth)</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Message  positive = {this.state.betStatus !=='error'}
                  header={this.state.betStatus} content={this.state.transactionHash}
                  hidden = {!this.state.transactionHash}
          />
        <Button primary loading={this.state.loading} disabled={!this.props.matchStatus}>
          Play bet
        </Button>
      </Form>
    );
  }
}

export default PlayBetForm;
