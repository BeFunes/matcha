import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import SignUpForm from "./containers/SignUpForm/SignUpForm";
import SignInForm from "./containers/SignInForm/SignInForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch> /* with switch, the route will consider only the first match rather than cascading down!*/
          <Route path="/signup" component={SignUpForm} />
          <Route path="/" exact component={SignInForm} />
        </Switch>
      </div>
    );
  }
}

export default App;



/// direct components that are accessed through routing have access to
// special props 'history' and 'match'. Nested components don't
// If we need the special props in other places, lookup 'withRouter'