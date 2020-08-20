import React from 'react';
import './App.scss';
import { UserNameInput } from './UserNameInput';
import { MessageList } from './MessageList';
import { NewMessage } from './NewMessage';

export type AppViewTypes = 'user-name' | 'messages';

interface IAppState {
  /** Controls which view to show to the user. */
  viewType: AppViewTypes;

  /** The name our user entered in the UserNameInput component. */
  userName?: string;
}

export interface IAppProps { }

export default class App extends React.Component<IAppProps, IAppState>{
  constructor(props: IAppProps) {
    super(props);
    // Initialize the state.
    this.state = { viewType: 'user-name' };
  }

  /** Callback for the UserNameInput to tell us that the user has entered a name and we're ready to show messages. */
  private onNameUpdated(newName: string): void {
    // Set the user name in our state.  Then, change our view to show messages.
    this.setState(prevState => ({ ...prevState, userName: newName, viewType: 'messages' }));
  }

  render(): React.ReactNode {
    // Here, we'll show the appropriate view, based on the viewType in our state.
    return (

      <div className="App">

        <div className="app-wrapper">
          {this.state.viewType === 'messages'
            ? <React.Fragment>
              <MessageList />

              <NewMessage userName={this.state.userName} /></React.Fragment>
            : <UserNameInput userNameEnteredCallback={newName => this.onNameUpdated(newName)} />}

        </div>
      </div>
    );
  }
}

