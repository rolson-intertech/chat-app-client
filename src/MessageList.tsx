import React from 'react';
import { IChatMessage } from './shared-definitions';
import './MessageList.scss';
import { MessageClient } from './message.client';
import { Subscription } from 'rxjs';
import { Card } from 'primereact/card';

interface IMessageListState {
    /** Holds all messages from the server, to show in the current view. */
    messages: Array<IChatMessage>;
}

export interface IMessageListProps { }

export class MessageList extends React.Component<IMessageListProps, IMessageListState>{
    constructor(props: IMessageListProps) {
        super(props);

        // Initialize the state for this component.  We'll get the message
        //  list in the mount event.
        this.state = { messages: [] };
    }

    /** Called on all React Components after they've been created and initialized. */
    componentDidMount(): void {
        // Initialize the MessageClient here (not in the constructor).
        //  This avoids attempts to update our display before it's fully setup.
        this.messageClient = new MessageClient();

        // Subscribe to its events.  Remember to keep the returned unsubscribe function
        //  so we can cleanup this component later, if it ever gets unmounted.
        this.eventSubscription = this.messageClient.onMessageReceived.subscribe(newMessage => {
            // React does not allow us to edit state objects directly.  We need to copy it, and
            //  make changes to our copy.  NOTE: It's ok to reuse state properties if they and
            //  their children are not changed.
            let newMessages = this.state.messages.slice();
            newMessages.push(newMessage);

            // Add this message to our messages list.  Though, the state only contains
            //  a messages property, using this pattern for all components every time
            //  makes future additions a trivial routine.
            //  IMPORTANT NOTE: This is a function, that returns an object!  This is why the braces are
            //   surrounded by parenthesis.
            this.setState(prevState => ({ ...prevState, messages: newMessages }), () => {
                // Wait a brief time for everything to update before we perform our scroll.
                //  If not, things may not be updated, and we won't scroll the full length.
                setTimeout(() => {
                    this.messageListRef.current.scroll({ top: this.messageListRef.current.scrollHeight, behavior: 'smooth' });
                });
            });
        });

        // Get all of the messages from the server.
        this.messageClient.getAllMessages().then(result => {
            // Set the messages in our state.  This will trigger the component to update.
            this.setState(prevState => ({ ...prevState, messages: result }), () => {
                // Wait a brief time for everything to update before we perform our scroll.
                //  If not, things may not be updated, and we won't scroll the full length.
                setTimeout(() => {
                    this.messageListRef.current.scroll({ top: this.messageListRef.current.scrollHeight, behavior: 'smooth' });
                });
            });
        });
    }

    /** Reference to the component's outer-most div element. */
    private messageListRef = React.createRef<HTMLDivElement>();

    /** Called on all React Components when they are about to be removed/destroyed. */
    componentWillUnmount(): void {
        // Cleanup our event handler (subscription).
        this.eventSubscription.unsubscribe();
    }

    /** The subscription to message events on our messageClient.
     *   This should be unsubscribed from when this component is unmounted. */
    private eventSubscription: Subscription;

    /** The MessageClient that handles all server communications for us. */
    private messageClient: MessageClient;

    /** This is the standard render method for all React Component classes, which
     *   returns the way our component looks in the browser. */
    render(): React.ReactNode {
        return (<div className="MessageList" ref={this.messageListRef}>
            {this.state.messages.map(m => <div key={m._id} className="card-wrapper">
                <Card>
                    <div className="message-wrapper">
                        <div className="message-header"> {m.dateTime.toLocaleTimeString()}: {m.senderName} </div>
                        <div className="message-body"> <pre>{m.message}</pre> </div>
                    </div>
                </Card>
            </div>)}
        </div>)
    }
}