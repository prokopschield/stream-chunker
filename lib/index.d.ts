/// <reference types="node" />
import { Readable } from 'stream';
declare function StreamChunker(
    stream: Readable,
    callback: (chunk: Buffer) => void | Promise<void>,
    chunkSize: number
): Promise<number>;
export = StreamChunker;
