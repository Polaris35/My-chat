export class FileUrlUtils {
    static getFileUrl(id: number): string {
        return `/api/attachments/?id=${id}`;
    }
}
