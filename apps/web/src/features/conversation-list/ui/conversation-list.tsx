import { useConversationListQuery } from '@/entities/conversation-list/queries';
import { UiSpinner } from '@/shared/ui';
import { Conversation } from './conversation';
import { FaPen } from 'react-icons/fa';
import { FaUser, FaUserGroup } from 'react-icons/fa6';
import { Drawer } from '@/entities/menu-drawer';

export function ConversationList() {
    const { sessionStatus, data, isLoading } = useConversationListQuery();

    return (
        <div className="flex flex-col border-r border-neutral min-h-screen max-h-screen relative">
            <div className="flex p-4 gap-4 border-b border-neutral justify-between">
                <Drawer />
                <label className="input input-bordered flex items-center gap-2 flex-1">
                    <input type="text" className="grow" placeholder="Search" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>
            </div>
            {isLoading || sessionStatus === 'loading' ? (
                <div className="flex-1 flex justify-center items-center">
                    <UiSpinner />
                </div>
            ) : (
                <ul className="flex flex-col">
                    {data?.conversations.map((conversation) => {
                        return (
                            <Conversation
                                key={conversation.id}
                                title={conversation.title}
                                senderName={conversation.senderName}
                                avatarUrl={conversation.avatarUrl}
                                message={conversation.message}
                                time={conversation.time}
                                messageCount={conversation.messageCount}
                                messageType={conversation.messageType}
                            />
                        );
                    })}
                </ul>
            )}

            <div className="dropdown dropdown-top dropdown-end absolute right-4 bottom-4">
                <div
                    tabIndex={0}
                    role="button"
                    className="w-12 h-12 mt-3 btn-circle btn btn-primary text-white"
                >
                    <FaPen size={16} />
                </div>
                <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-48"
                >
                    <li>
                        <button>
                            <FaUserGroup /> New Group
                        </button>
                    </li>
                    <li>
                        <button>
                            <FaUser /> New Message
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
