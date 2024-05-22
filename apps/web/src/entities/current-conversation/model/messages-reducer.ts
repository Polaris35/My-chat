import {
    MessageAction,
    MessageActionKind,
    MessageState,
} from '../interfaces/interfaces';

export function messagesReducer(state: MessageState, action: MessageAction) {
    const { type, payload } = action;
    switch (type) {
        case MessageActionKind.ADD:
            return {
                ...state,
                messages: [...state.messages, payload],
            };
        case MessageActionKind.DELETE:
            return {
                ...state,
                messages: state.messages.filter(
                    (message) => message.id !== payload,
                ),
            };
        case MessageActionKind.UPDATE:
            return {
                ...state,
                messages: state.messages.map((message) => {
                    if (message.id === payload.id) {
                        return payload;
                    }
                    return message;
                }),
            };
        case MessageActionKind.SET:
            return {
                ...state,
                messages: payload,
            };
        default:
            return state;
    }
}
