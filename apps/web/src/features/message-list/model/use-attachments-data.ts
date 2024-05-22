import {
    AttachmentDataResponse,
    attachmentsControllerGetAttachmentsData,
} from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

export function UseAttachmentDataMutation(ids: number[]) {
    return useQuery({
        queryKey: ['attachment-data', ids],
        queryFn: async (): Promise<AttachmentDataResponse[]> =>
            await attachmentsControllerGetAttachmentsData({ ids }),
    });
}
