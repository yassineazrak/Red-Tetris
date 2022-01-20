import React from 'react';

import './App.css';



import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import store from './store';

import { isAuth } from './actions/auth';
import { refreshRoom } from './actions/room';
import { refreshInvite } from './actions/invite';

store.dispatch(isAuth());
store.dispatch(refreshRoom());
store.dispatch(refreshInvite());



function App() {

  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
