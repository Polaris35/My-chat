import type { MessageResponse } from '@/shared/api';

export enum MessageActionKind {
    ADD = 'ADD',
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    SET = 'SET',
}

export interface MessageDisplay extends MessageResponse {
    status: 'sended' | 'loading' | 'readed';
}

// Define discriminated unions for MessageAction
interface AddMessageAction {
    type: MessageActionKind.ADD;
    payload: MessageDisplay[];
}

interface DeleteMessageAction {
    type: MessageActionKind.DELETE;
    payload: number; // ID of the message to delete
}

interface UpdateMessageAction {
    type: MessageActionKind.UPDATE;
    payload: MessageDisplay;
}

interface SetMessagesAction {
    type: MessageActionKind.SET;
    payload: MessageDisplay[];
}

export type MessageAction =
    | AddMessageAction
    | DeleteMessageAction
    | UpdateMessageAction
    | SetMessagesAction;

export interface MessageState {
    messages: MessageDisplay[];
}
