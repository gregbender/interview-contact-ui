import React, { Component } from 'react';
import './App.css';
import Contacts from './components/Contacts.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    isLoading: true,
    contacts: []
  };

  async componentDidMount() {
    const response = await fetch('http://ec2-34-207-162-62.compute-1.amazonaws.com:8080/contact');
    const body = await response.json();
    this.setState({ contacts: body, isLoading: false });
  }

  render() {
    const {contacts, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
        <div className="App">
          <ToastContainer />
          <Contacts/>
        </div>
    );
  }
}

export default App;