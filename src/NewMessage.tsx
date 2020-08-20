import React from 'react';
import './NewMessage.scss';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { MessageClient } from './message.client';
import { IChatMessage } from './shared-definitions';

interface INewMessageState {
    /** The message being typed by the user, and sent to others when the
     *   user presses the send button. */
    newMessage: string;
}
export interface INewMessageProps {
    /** The name of the user.  This is passed to the control by the App component. */
    userName: string;
}

export class NewMessage extends React.Component<INewMessageProps, INewMessageState>{
    constructor(props: INewMessageProps) {
        super(props);

        // Initialize our state, so we have a newMessage to display (blank string).
        this.state = { newMessage: '' };
    }

    /** Called when the user changes text in our text input.  This updates our
     *   application state to reflect their changes. */
    private onMessageChanged(newValue: string): void {
        // Simply update the state on this control.
        this.setState(prevState => ({ ...prevState, newMessage: newValue }));
    }

    /** Called when the user presses the send button. */
    private onSendClicked(): void {
        // We could do this better, but keeping it simple, we'll create a client just to
        //  send our message in this scope.  NOTE: We're not subscribing to any events,
        //  so we're not going to bother closing it.
        const client = new MessageClient();

        // Create the new message to send to the server.
        let newMessage: IChatMessage = {
            dateTime: new Date(Date.now()),
            senderName: this.props.userName,
            message: this.state.newMessage
        }

        // We could block the page or something while the request is sent,
        //  but we won't do that today.
        client.sendMessage(newMessage);

        // Now that the message is sent, clear it so the user can type another one.
        this.setState(prevState => ({ ...prevState, newMessage: '' }));
    }

    render(): React.ReactNode {
        return (<div className="NewMessage">
            <Card>
                <div className="control-layout">
                    <InputTextarea cols={80} rows={4} value={this.state.newMessage} onChange={e => this.onMessageChanged((e.target as HTMLTextAreaElement).value)} />
                    <Button label="Send" onClick={e => this.onSendClicked()} />
                </div>
            </Card>
        </div>)
    }
}