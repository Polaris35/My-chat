/**
 * Generated by orval v6.25.0 🍺
 * Do not edit manually.
 * My-chat
 * OpenAPI spec version: 1.0
 */
import { createInstance } from './api-instace';
import type { BodyType } from './api-instace';
export type AuthControllerGoogleAuthParams = {
    token: string;
};

export type AuthControllerRefreshTokensParams = {
    refreshToken: string;
};

export type AuthControllerLogoutParams = {
    refreshToken: string;
};

export type ConversationsControllerCreateGroupConversationBody = {
    image?: Blob;
    title?: string;
};

export type ConversationsControllerCreatePrivateConversationBody = {
    userId?: number;
};

export type AttachmentsControllerGetAttachmentsDataParams = {
    ids: number[];
};

export type AttachmentsControllerGetFileAttachmentParams = {
    id: number;
};

export type AttachmentsControllerUploadImageBody = {
    image?: Blob;
};

export type AttachmentsControllerUploadFileBody = {
    file?: Blob;
};

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface ResponseUserWithTokens {
    accessToken: string;
    createdAt: string;
    email: string;
    id: number;
    image: string;
    name: string;
    refreshToken: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    passwordRepeat: string;
}

export type ConversationPreviewResponseMessageType =
    (typeof ConversationPreviewResponseMessageType)[keyof typeof ConversationPreviewResponseMessageType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ConversationPreviewResponseMessageType = {
    STANDALONE_MESSAGE: 'STANDALONE_MESSAGE',
    SHARED_MESSAGE: 'SHARED_MESSAGE',
    ANSWERED_MESSAGE: 'ANSWERED_MESSAGE',
    SYSTEM_MESSAGE: 'SYSTEM_MESSAGE',
} as const;

export interface ConversationPreviewResponse {
    avatarUrl: string;
    id: number;
    message: string;
    messageCount: number;
    messageType: ConversationPreviewResponseMessageType;
    senderName: string;
    time: string;
    title: string;
    type: string;
}

export interface ConversationPreviewListResponse {
    conversations: ConversationPreviewResponse[];
}

export type MessageResponseType =
    (typeof MessageResponseType)[keyof typeof MessageResponseType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageResponseType = {
    STANDALONE_MESSAGE: 'STANDALONE_MESSAGE',
    SHARED_MESSAGE: 'SHARED_MESSAGE',
    ANSWERED_MESSAGE: 'ANSWERED_MESSAGE',
    SYSTEM_MESSAGE: 'SYSTEM_MESSAGE',
} as const;

export type MessageResponseAttachmentType =
    (typeof MessageResponseAttachmentType)[keyof typeof MessageResponseAttachmentType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MessageResponseAttachmentType = {
    IMAGE: 'IMAGE',
    FILE: 'FILE',
} as const;

export interface MessageResponse {
    attachmentList: number[];
    attachmentType: MessageResponseAttachmentType;
    conversationId: number;
    createdAt: string;
    id: number;
    isReaded: boolean;
    message: string;
    referenceMessageId: number;
    senderAvatarUrl: string;
    senderId: number;
    senderName: string;
    type: MessageResponseType;
}

export interface CreateMessageDto {
    /** list of id attached files */
    attachmentList: number[];
    /** id of conversation */
    conversationId: number;
    message: string;
}

export interface AttachmentDataResponse {
    fileName: string;
    format: string;
    id: number;
    size: number;
}

export interface UserResponse {
    createdAt: string;
    email: string;
    id: number;
    image: string;
    name: string;
}

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const usersControllerFindById = (
    id: number,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/users/find/by-id/${id}`, method: 'GET' },
        options,
    );
};

export const usersControllerFindByEmail = (
    email: string,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/users/find/by-email/${email}`, method: 'GET' },
        options,
    );
};

export const usersControllerFindByPartOfEmail = (
    email: string,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<UserResponse[]>(
        { url: `/api/users/find/by-part-of-email/${email}`, method: 'GET' },
        options,
    );
};

export const usersControllerMe = (
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/users/me`, method: 'GET' },
        options,
    );
};

export const usersControllerRemove = (
    id: number,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/users/${id}`, method: 'DELETE' },
        options,
    );
};

export const usersControllerChangeImage = (
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/users/change-image`, method: 'PUT' },
        options,
    );
};

export const attachmentsControllerUploadFile = (
    attachmentsControllerUploadFileBody: BodyType<AttachmentsControllerUploadFileBody>,
    options?: SecondParameter<typeof createInstance>,
) => {
    const formData = new FormData();
    if (attachmentsControllerUploadFileBody.file !== undefined) {
        formData.append('file', attachmentsControllerUploadFileBody.file);
    }

    return createInstance<number>(
        {
            url: `/api/attachments/upload/file`,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
        },
        options,
    );
};

export const attachmentsControllerUploadImage = (
    attachmentsControllerUploadImageBody: BodyType<AttachmentsControllerUploadImageBody>,
    options?: SecondParameter<typeof createInstance>,
) => {
    const formData = new FormData();
    if (attachmentsControllerUploadImageBody.image !== undefined) {
        formData.append('image', attachmentsControllerUploadImageBody.image);
    }

    return createInstance<number>(
        {
            url: `/api/attachments/upload/image`,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
        },
        options,
    );
};

export const attachmentsControllerGetFileAttachment = (
    params: AttachmentsControllerGetFileAttachmentParams,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/attachments`, method: 'GET', params },
        options,
    );
};

export const attachmentsControllerGetAttachmentsData = (
    params: AttachmentsControllerGetAttachmentsDataParams,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<AttachmentDataResponse[]>(
        { url: `/api/attachments/data`, method: 'GET', params },
        options,
    );
};

export const messagesControllerCreateMessage = (
    createMessageDto: BodyType<CreateMessageDto>,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<MessageResponse>(
        {
            url: `/api/messages`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: createMessageDto,
        },
        options,
    );
};

export const messagesControllerDeleteMessage = (
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/messages`, method: 'DELETE' },
        options,
    );
};

export const messagesControllerConversationMessagesList = (
    conversationId: number,
    skip: number,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<MessageResponse[]>(
        { url: `/api/messages/list/${conversationId}&${skip}`, method: 'GET' },
        options,
    );
};

export const messagesControllerGetFirstMessage = (
    conversationId: number,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<MessageResponse>(
        { url: `/api/messages/first/${conversationId}`, method: 'GET' },
        options,
    );
};

export const conversationsControllerCreatePrivateConversation = (
    conversationsControllerCreatePrivateConversationBody: BodyType<ConversationsControllerCreatePrivateConversationBody>,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<ConversationPreviewResponse>(
        {
            url: `/api/conversations/private`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: conversationsControllerCreatePrivateConversationBody,
        },
        options,
    );
};

export const conversationsControllerCreateGroupConversation = (
    conversationsControllerCreateGroupConversationBody: BodyType<ConversationsControllerCreateGroupConversationBody>,
    options?: SecondParameter<typeof createInstance>,
) => {
    const formData = new FormData();
    if (
        conversationsControllerCreateGroupConversationBody.title !== undefined
    ) {
        formData.append(
            'title',
            conversationsControllerCreateGroupConversationBody.title,
        );
    }
    if (
        conversationsControllerCreateGroupConversationBody.image !== undefined
    ) {
        formData.append(
            'image',
            conversationsControllerCreateGroupConversationBody.image,
        );
    }

    return createInstance<ConversationPreviewResponse>(
        {
            url: `/api/conversations/group`,
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
        },
        options,
    );
};

export const conversationsControllerConversationPreviewList = (
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<ConversationPreviewListResponse>(
        { url: `/api/conversations/list`, method: 'GET' },
        options,
    );
};

export const conversationsControllerDeleteConversation = (
    id: number,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/conversations/${id}`, method: 'DELETE' },
        options,
    );
};

export const authControllerCredentialsRegister = (
    registerDto: BodyType<RegisterDto>,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        {
            url: `/api/auth/credentials/register`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: registerDto,
        },
        options,
    );
};

export const authControllerCredentialsLogin = (
    loginDto: BodyType<LoginDto>,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<ResponseUserWithTokens>(
        {
            url: `/api/auth/credentials/login`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: loginDto,
        },
        options,
    );
};

export const authControllerLogout = (
    params: AuthControllerLogoutParams,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<void>(
        { url: `/api/auth/logout`, method: 'GET', params },
        options,
    );
};

export const authControllerRefreshTokens = (
    params: AuthControllerRefreshTokensParams,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<Tokens>(
        { url: `/api/auth/refresh-tokens`, method: 'GET', params },
        options,
    );
};

export const authControllerGoogleAuth = (
    params: AuthControllerGoogleAuthParams,
    options?: SecondParameter<typeof createInstance>,
) => {
    return createInstance<ResponseUserWithTokens>(
        { url: `/api/auth/google`, method: 'GET', params },
        options,
    );
};

export type UsersControllerFindByIdResult = NonNullable<
    Awaited<ReturnType<typeof usersControllerFindById>>
>;
export type UsersControllerFindByEmailResult = NonNullable<
    Awaited<ReturnType<typeof usersControllerFindByEmail>>
>;
export type UsersControllerFindByPartOfEmailResult = NonNullable<
    Awaited<ReturnType<typeof usersControllerFindByPartOfEmail>>
>;
export type UsersControllerMeResult = NonNullable<
    Awaited<ReturnType<typeof usersControllerMe>>
>;
export type UsersControllerRemoveResult = NonNullable<
    Awaited<ReturnType<typeof usersControllerRemove>>
>;
export type UsersControllerChangeImageResult = NonNullable<
    Awaited<ReturnType<typeof usersControllerChangeImage>>
>;
export type AttachmentsControllerUploadFileResult = NonNullable<
    Awaited<ReturnType<typeof attachmentsControllerUploadFile>>
>;
export type AttachmentsControllerUploadImageResult = NonNullable<
    Awaited<ReturnType<typeof attachmentsControllerUploadImage>>
>;
export type AttachmentsControllerGetFileAttachmentResult = NonNullable<
    Awaited<ReturnType<typeof attachmentsControllerGetFileAttachment>>
>;
export type AttachmentsControllerGetAttachmentsDataResult = NonNullable<
    Awaited<ReturnType<typeof attachmentsControllerGetAttachmentsData>>
>;
export type MessagesControllerCreateMessageResult = NonNullable<
    Awaited<ReturnType<typeof messagesControllerCreateMessage>>
>;
export type MessagesControllerDeleteMessageResult = NonNullable<
    Awaited<ReturnType<typeof messagesControllerDeleteMessage>>
>;
export type MessagesControllerConversationMessagesListResult = NonNullable<
    Awaited<ReturnType<typeof messagesControllerConversationMessagesList>>
>;
export type MessagesControllerGetFirstMessageResult = NonNullable<
    Awaited<ReturnType<typeof messagesControllerGetFirstMessage>>
>;
export type ConversationsControllerCreatePrivateConversationResult =
    NonNullable<
        Awaited<
            ReturnType<typeof conversationsControllerCreatePrivateConversation>
        >
    >;
export type ConversationsControllerCreateGroupConversationResult = NonNullable<
    Awaited<ReturnType<typeof conversationsControllerCreateGroupConversation>>
>;
export type ConversationsControllerConversationPreviewListResult = NonNullable<
    Awaited<ReturnType<typeof conversationsControllerConversationPreviewList>>
>;
export type ConversationsControllerDeleteConversationResult = NonNullable<
    Awaited<ReturnType<typeof conversationsControllerDeleteConversation>>
>;
export type AuthControllerCredentialsRegisterResult = NonNullable<
    Awaited<ReturnType<typeof authControllerCredentialsRegister>>
>;
export type AuthControllerCredentialsLoginResult = NonNullable<
    Awaited<ReturnType<typeof authControllerCredentialsLogin>>
>;
export type AuthControllerLogoutResult = NonNullable<
    Awaited<ReturnType<typeof authControllerLogout>>
>;
export type AuthControllerRefreshTokensResult = NonNullable<
    Awaited<ReturnType<typeof authControllerRefreshTokens>>
>;
export type AuthControllerGoogleAuthResult = NonNullable<
    Awaited<ReturnType<typeof authControllerGoogleAuth>>
>;
