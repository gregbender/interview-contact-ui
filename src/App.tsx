import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Welcome from './components/Welcome.jsx';
import Contacts from './components/Contacts.jsx'
import NavBar from "./components/navbar";


class App extends Component {
  state = {
    isLoading: true,
    contacts: []
  };

  async componentDidMount() {
    const response = await fetch('/contact');
    const body = await response.json();
    this.setState({ contacts: body, isLoading: false });
  }

  async boom() {
    alert('greg');
  }

  render() {
    const {contacts, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }


    return (
        <div className="App">
          <Contacts/>
          {/*<header className="App-header">*/}
          {/*  <Contacts/>*/}
            {/*<Welcome name="Sara" />*/}
            {/*<img src={logo} className="App-logo" alt="logo" />*/}
            {/*<div className="App-intro">*/}
              {/*<h2>JUG List</h2>*/}
              {/*{groups.map(group =>*/}
              {/*    <div key={group.id}>*/}
              {/*      {group.name}*/}
              {/*    </div>*/}
              {/*)}*/}
        {/*    </div>*/}
        {/*  </header>*/}
        {/*</div>*/}
        </div>
    );
  }
}

export default App;