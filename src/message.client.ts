import { IChatMessage, EP_GET_ALL_MESSAGES, EP_SEND_NEW_MESSAGE, MSG_MESSAGE_RECEIVED, convertDates } from "./shared-definitions";
import io from 'socket.io-client';
import { Subject } from 'rxjs';


/** This class is responsible for all server interactions concerning messaging.
 *   Consumers of this class will be able to respond to its events. */
export class MessageClient {
    constructor() {
        // Initialize our socket for messaging.
        this.initializeSocket();
    }

    private initializeSocket(): void {
        // Initialize the socket so it will communicate with the server.
        this.socket = io('/');

        this.socket.open();

        // Add a handler for responding to new chat messages.
        this.socket.on(MSG_MESSAGE_RECEIVED, (message: IChatMessage) => {
            // Convert any date strings on this object to dates.
            convertDates(message);

            // Fire the event to inform observers that we got a new chat message.
            this.onMessageReceivedSubject.next(message);
        });
    }

    /** Private subject used to trigger events when receiving new chat messages. */
    private onMessageReceivedSubject = new Subject<IChatMessage>();

    /** Observable that fires when a new chat message is received from the server. 
     *   NOTE: By convention, observables typically end in $, but I didn't do this to avoid confusion. */
    readonly onMessageReceived = this.onMessageReceivedSubject.asObservable();

    /** The socket.io client we interact with.  This type syntax may
     *   look funny, but I think the type definitions are flawed, not emitting the
     *   type references themselves, but the function's return type.  This syntax
     *   is defining our field to be the same type as returned by the io() method.
     */
    private socket: ReturnType<typeof io>;

    /** Closes our socket connection with the server.  This should only be called when we're done with
     *   as there is no way to re-open the connection without creating a new instance. */
    close(): void {
        this.socket.close();
    }

    /** Wraps a basic server (POST) request in a promise, and returns the results from the body.  Arbitrary
     *   data may be sent with the request's body, if necessary. */
    private performRequest<T>(path: string, requestData?: object): Promise<T> {
        // If we have request data, then serialize it to JSON.
        let requestBody: string | null = null;

        if (requestData) {
            requestBody = JSON.stringify(requestData);
        }

        // Execute our request.  When it returns, parse and return the JSON object.  This is actually a Promise.
        return fetch(path, { method: 'POST', body: requestBody })
            .then(response => {
                return response.text().then(resultText => {
                    if (resultText.length > 2) {
                        let result = JSON.parse(resultText);
                        // Convert date strings on this object to dates.
                        convertDates(result);
                        return result;
                    } else {
                        return null;
                    }
                });
            });
    }

    /** Returns all messages from the server, in order of it's creation date/time. */
    getAllMessages(): Promise<Array<IChatMessage>> {
        return this.performRequest(EP_GET_ALL_MESSAGES);
    }

    /** Sends a new chat message to the server, and returns a promise that resolves when complete. */
    sendMessage(message: IChatMessage): Promise<void> {
        return this.performRequest(EP_SEND_NEW_MESSAGE, message);
    }
}