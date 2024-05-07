export async function fileToBlob(file: File) {
    return new Blob([new Uint8Array(await file.arrayBuffer())], {
        type: file.type,
    });
}
