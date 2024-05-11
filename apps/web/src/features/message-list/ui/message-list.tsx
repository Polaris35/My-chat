import clsx from 'clsx';
import { Message } from './message';

type MessageListProps = {
    className: string;
};
export function MessageList({ className }: MessageListProps) {
    return (
        <div
            className={clsx(
                className,
                'flex flex-col gap-3 overflow-y-auto no-scrollbar',
            )}
        >
            <Message
                avatarUrl={'/api/attachments/?id=1'}
                autor={'Some dude'}
                time={'20:31'}
                message={'Hello world'}
                status={'sended'}
                type={'send'}
            />
            <Message
                avatarUrl={'/api/attachments/?id=1'}
                autor={'Some dude'}
                time={'20:31'}
                message={
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                }
                status={'sended'}
                type={'recive'}
            />
            <Message
                avatarUrl={'/api/attachments/?id=1'}
                autor={'Some dude'}
                time={'20:31'}
                message={'Hello world'}
                status={'sended'}
                type={'send'}
            />
            <Message
                avatarUrl={'/api/attachments/?id=1'}
                autor={'Some dude'}
                time={'20:31'}
                message={'Hello world'}
                status={'sended'}
                type={'recive'}
            />
        </div>
    );
}
