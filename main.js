const fs = require("fs");
const path = require("path");
const net = require("net");
const zlib = require("zlib");
const os = require("os");

const SettingsDirectory = path.join(os.homedir(), "Opiumware", "modules");
const SettingsFile = path.join(SettingsDirectory, "settings");

/**
 * @param {string} code - Code to execute
 * @param {string|number} [port="ALL"] - Port to connect to, or "ALL" to try all ports
 * @returns {Promise<string>} - Result message
 */
async function execute(code, port) {
    const Ports = ["8392", "8393", "8394", "8395", "8396", "8397"];
    let ConnectedPort = null, Stream = null;

    for (const P of (port === "ALL" ? Ports : [port])) {
        try {
            Stream = await new Promise((Resolve, Reject) => {
                const Socket = net.createConnection({
                    host: "127.0.0.1",
                    port: parseInt(P)
                }, () => Resolve(Socket));
                Socket.on("error", Reject);
            });
            console.log(`Successfully connected to Opiumware on port: ${P}`);
            ConnectedPort = P;
            break;
        } catch (Err) {
            console.log(`Failed to connect to port ${P}: ${Err.message}`);
        }
    }

    if (!Stream) return "Failed to connect on all ports";

    if (code !== "NULL") {
        try {
            await new Promise((Resolve, Reject) => {
                zlib.deflate(Buffer.from(code, "utf8"), (Err, Compressed) => {
                    if (Err) return Reject(Err);
                    Stream.write(Compressed, (WriteErr) => {
                        if (WriteErr) return Reject(WriteErr);
                        console.log(`Script sent (${Compressed.length} bytes)`);
                        Resolve();
                    });
                });
            });
        } catch (Err) {
            Stream.destroy();
            return `Error sending script: ${Err.message}`;
        }
    }

    Stream.end();
    return `Successfully connected to Opiumware on port: ${ConnectedPort}`;
}

/**
 * @param {string} key - Only "WSToggle" and "RedirectErrors" are supported
 * @param {boolean} value - true or false
 */
async function setting(key, value) {
    if (!fs.existsSync(SettingsDirectory)) {
        fs.mkdirSync(SettingsDirectory, { recursive: true });
    }

    let existing = {};

    if (fs.existsSync(SettingsFile)) {
        const lines = fs.readFileSync(SettingsFile, "utf8").split("\n");
        lines.forEach(line => {
            const [k, v] = line.split(" ");
            if (k) existing[k] = v;
        });
    } else {
        existing["WSToggle"] = "true";
        existing["RedirectErrors"] = "false";
    }

    existing[key] = value ? "true" : "false";
    fs.writeFileSync(SettingsFile, Object.entries(existing).map(([k, v]) => `${k} ${v}`).join("\n"), "utf8");
}

// Export functions so electron-main can import them
module.exports = {
    execute,
    setting
};
