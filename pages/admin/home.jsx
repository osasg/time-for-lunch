import React from 'react';
import Router from 'next/router';

class AdminHome extends React.Component {
  static async getInitialProps({ res }) {
    if (res) {
      res.writeHead(302, {
        location: '/admin'
      });
      res.end();
    } else {
      Router.push('/admin');
    }

    return {};
  }
}

export default AdminHome;