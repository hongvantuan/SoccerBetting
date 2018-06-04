import React, {Component} from 'react';
import {Button } from 'semantic-ui-react';
import {Link} from '../../../routes';
import Layout from '../../../Components/Layout';
class RequestIndex extends Component{
  static async getInitialProps(props){
    const {address} = props.query;
    return {address};

  }
  render(){
    return(
      <Layout>
        <h3>Request list</h3>;
        <Link route={`/Campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
      </Layout>
    )
  };
}

export default RequestIndex;
