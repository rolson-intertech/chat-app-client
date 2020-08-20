import React from 'react';
import './App.scss';
import { MessageList } from './MessageList';
import { NewMessage } from './NewMessage';

function App() {
  return (
    <div className="App">
      <MessageList />

      <NewMessage userName={'Intertech User'} />
    </div>
  );
}

export default App;
