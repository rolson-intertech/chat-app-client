import React from 'react';
import './UserNameInput.scss';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

interface IUserNameInputState {
    /** User name the user shown in our text input. */
    newUserName: string;
}
export interface IUserNameInputProps {
    /** Callback used to tell the App component that the user has set their name, and we're done here. */
    userNameEnteredCallback: (newName: string) => void;
}

export class UserNameInput extends React.Component<IUserNameInputProps, IUserNameInputState>{
    constructor(props: IUserNameInputProps) {
        super(props);

        /** Initialize the state. */
        this.state = { newUserName: '' };
    }

    /** Called when our user name input is changed (i.e. the user is typing) */
    onUserNameChanged(newName: string): void {
        // Update our state.
        this.setState(prevState => ({ ...prevState, newUserName: newName }));
    }

    /** Called when the user clicks the OK button. */
    private onOkClicked(): void {
        // Inform the App component of the name that the user entered.
        this.props.userNameEnteredCallback(this.state.newUserName);
    }

    render(): React.ReactNode {
        return (<div className="UserNameInput">
            <Card>
                <div className="name-field">
                    <label>Your Name</label>
                    <InputText value={this.state.newUserName} onChange={e => this.onUserNameChanged((e.target as HTMLInputElement).value)} />
                </div>

                <Button label="OK" onClick={e => this.onOkClicked()} />
            </Card>
        </div>)
    }
}