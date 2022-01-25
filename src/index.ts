import { Readable } from 'stream';

function StreamChunker(
    stream: Readable,
    callback: (chunk: Buffer) => void | Promise<void>,
    chunkSize: number
) {
    let buffer = Buffer.alloc(0);
    let counter = 0;
    let promise = Promise.resolve();

    stream.on('data', async (chunk: Buffer) => {
        const old_promise = promise;
        promise = new Promise(async (resolve) => {
            await old_promise;
            buffer = Buffer.concat([buffer, chunk]);
            while (buffer.length >= chunkSize) {
                ++counter;
                await callback(buffer.slice(0, chunkSize));
                buffer = buffer.slice(chunkSize);
            }
            resolve();
        });
    });

    let end_resolve: (value: number) => void;
    let ret = new Promise<number>((resolve) => (end_resolve = resolve));

    stream.on('end', async () => {
        await promise;
        if (buffer.length) {
            ++counter;
            await callback(buffer);
        }
        end_resolve(counter);
    });

    return ret;
}

export = StreamChunker;
