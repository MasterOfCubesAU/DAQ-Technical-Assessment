import net from "net";
import { WebSocket, WebSocketServer } from "ws";
import pino from "pino";
import prettyPino from "pino-pretty";
import SonicBoom from "sonic-boom";

const TCP_PORT = parseInt(process.env.TCP_PORT || "12000", 10);

const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: 8080 });

const MIN_OPERATING_RANGE = 20;
const MAX_OPERATING_RANGE = 80;

const MAX_BATTERY_WARNINGS = 3;
const BATTERY_WARNING_PERIOD = 5000;

const batteryTemperatureWarnings: number[] = [];

const LOGGER = pino(prettyPino({ destination: new SonicBoom({ dest: "./logs/incident.log", mkdir: true }), colorize: false }));

// Incoming data interface
interface VehicleData {
    battery_temperature: number,
    timestamp: number
}

function batteryExceedLimit(): boolean {
    const currentTime = Date.now();
    batteryTemperatureWarnings.filter(time => currentTime - time <= BATTERY_WARNING_PERIOD);
    batteryTemperatureWarnings.push(currentTime);
    return batteryTemperatureWarnings.length > MAX_BATTERY_WARNINGS;
}

tcpServer.on("connection", (socket) => {
    console.log("TCP client connected");

    socket.on("data", (msg) => {
        console.log(msg.toString());

        let jsonData: VehicleData | null = null;

        // Added try catch to see if the incoming str can be parsed to JSON. If not, we simply return
        try {
            jsonData = JSON.parse(msg.toString());
        } catch (error) {
            return;
        }

        // Check if temps exceed safe operating range
        if (jsonData && (jsonData.battery_temperature < MIN_OPERATING_RANGE || jsonData.battery_temperature > MAX_OPERATING_RANGE)) {
            if (batteryExceedLimit()) {
                LOGGER.warn(`Battery exceeded safe operating temperature > ${MAX_BATTERY_WARNINGS} times within ${BATTERY_WARNING_PERIOD}ms`);
            }
        }

        websocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });

    socket.on("end", () => {
        console.log("Closing connection with the TCP client");
    });

    socket.on("error", (err) => {
        console.log("TCP client error: ", err);
    });
});

websocketServer.on("listening", () => console.log("Websocket server started"));

websocketServer.on("connection", async (ws: WebSocket) => {
    console.log("Frontend websocket client connected to websocket server");
    ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
    console.log(`TCP server listening on port ${TCP_PORT}`);
});


