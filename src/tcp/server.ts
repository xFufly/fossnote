/// <reference types="bun" />
import { mkdirSync } from "node:fs";
import { join } from "node:path";

export function startTcpServer(port: number = 49300) {
    // Ensure dump directory exists
    const dumpDir = join(process.cwd(), "tcp", "dump");
    mkdirSync(dumpDir, { recursive: true });

    const tcpServer = Bun.listen({
        hostname: "0.0.0.0",
        port: port,
        socket: {
            open(socket) {
                console.log(`[TCP] New connection from : ${socket.remoteAddress}`);
            },
            data(socket, data) {
                console.log(`[TCP] Received ${socket.remoteAddress} : ${data.length} bytes`);
                
                // Dump binary data to file
                const filename = join(dumpDir, `dump_${Date.now()}.bin`);
                Bun.write(filename, data).then(() => {
                    console.log(`[TCP] Dump saved to ${filename}`);
                });
            },
            close(socket) {
                console.log(`[TCP] Connection closed : ${socket.remoteAddress}`);
            },
            error(socket, error) {
                console.error(`[TCP] Error on socket ${socket.remoteAddress}:`, error);
            },
        },
    });

    console.log(`[TCP] Server listening on port ${tcpServer.port}`);
    return tcpServer;
}
