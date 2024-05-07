import clsx from 'clsx';
import { FaPen, FaUser, FaUserGroup } from 'react-icons/fa6';
import { CreateGroupConversationDialog } from './dialogs/create-group-conversation-dialog';
import { CreatePrivateConversationDialog } from './dialogs/create-private-conversation-dialog';

export function CreateConversationButton({
    className,
}: {
    className?: string;
}) {
    return (
        <div className={clsx(className, 'dropdown dropdown-top dropdown-end')}>
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
                    <CreateGroupConversationDialog
                        trigger={
                            <button>
                                <FaUserGroup />
                                Create new group
                            </button>
                        }
                    />
                </li>
                <li>
                    <CreatePrivateConversationDialog
                        trigger={
                            <button>
                                <FaUser /> New Message
                            </button>
                        }
                    />
                </li>
            </ul>
        </div>
    );
}
