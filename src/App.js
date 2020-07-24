import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar'
import Users from './components/users/Users.js';
import User from './components/users/User.js';
import Search from './components/users/Search.js';
import Alert from './components/layout/Alert.js';
import About from './components/pages/About.js';
import './App.css';
import axios from 'axios';

// class App extends Component {
//   render() {
//     return (
//       <Fragment>
//         <h1>Howdy</h1>
//         <h2>Goodbye</h2>      
//       </Fragment>
//     )
//   }
// }

class App extends React.Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  }

  // async componentDidMount() {
  //   // .then(res => console.log(res.data));
  //   this.setState({ loading: true });
  //   const res = await axios.get(`https://api.github.com/users?clidentid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

  //   this.setState({ loading: false, users: res.data })
  // }

  searchUsers = async text => {
    this.setState({ loading: true });

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&clidentid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    )
    this.setState({ users: res.data.items, loading: false });
  }

  getUser = async (username) => {
    this.setState({ loading: true })

    const res = await axios.get(
      `https://api.github.com/users/${username}?clidentid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    )
    this.setState({ user: res.data, loading: false });
  }

  getUserRepos = async (username) => {
    this.setState({ loading: true })

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&clidentid=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    )
    this.setState({ repos: res.data, loading: false });
  }
  

  clearUsers = () => {
    this.setState({ users: [], loading: false });
  }

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type }})
    setTimeout(()=>{this.setState({ alert: null, })}, 1000)
  }

  render() {
    const { users, loading, alert, user, repos } = this.state;
    return (
      <Router>
        <Fragment>
          <Navbar title="Github Finder" icon="fab fa-github"/>
          <div className="container">
            <Alert alert={alert} />
            <Switch>
              <Route exact path='/' render={props => (
                <Fragment>
                  <Search 
                    searchUsers={this.searchUsers} 
                    clearUsers={this.clearUsers} 
                    showClear={users.length > 0 ? true : false}
                    setAlert={this.setAlert} />
                  <Users loading={loading} users={users} />
                </Fragment>
              )} />
              <Route exact path='/user/:login' render={props => (
                <User { ...props } getUser={this.getUser} user={user} loading={loading} getUserRepos={this.getUserRepos} repos={repos}/>
              )} />
              <Route exact path='/about' component={About}/>
            </Switch>
            
          </div>
        </Fragment>
      </Router>
    )
  }
}

export default App;
