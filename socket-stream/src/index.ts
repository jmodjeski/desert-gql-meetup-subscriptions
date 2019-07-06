import WebSocket = require('ws');
import cuid = require('cuid');

const wss = new WebSocket.Server({ port: 80 }, () => {
  console.log(`🚀 Server ready at port 80`);
});

interface SocketMessage {
  type: 'configure' | 'start' | 'stop',
  payload?: any
}

interface SetupPayload {
  intervalMs: number,
}

interface SendHandler {
  (type: string, payload: any) : void;
}

class IntervalSendClient {
  public id: string;
  private intervalHandle?: NodeJS.Timeout;
  private intervalMs: number = 1000;
  private sendHandler: SendHandler;

  constructor(id: string, sendHandler: SendHandler) {
    this.id = id;
    this.sendHandler = sendHandler;
  }

  public configure(intervalMs: number) {
    this.stop();
    this.intervalMs = intervalMs;
  }

  public start() {
    this.intervalHandle = setInterval(
      () => this.sendHandler('message', cuid())
    , this.intervalMs);
  }

  public stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = undefined;
    }
  }
}

wss.on('connection', function connection(ws) {
  const sendHandler: SendHandler = (type: string, payload: any) => {
    try {
      ws.send(JSON.stringify({
        type,
        payload
      }))
    } catch(err) {
      ws.send(JSON.stringify({
        type: 'error',
        payload: `Client Error: ${err.message}`
      }));
      ws.close(1011, err.message);
    }
  }
  const client = new IntervalSendClient(cuid(), sendHandler);
  console.log('client connection: %s', client.id);
  ws.on('close', () => {
    console.log('client closed: %s', client.id);
    client.stop();
  });
  
  ws.on('message', (message: SocketMessage) => {
    console.log('received: %s', message);
    switch(message.type) {
      case 'configure':
        const setupPayload = message.payload as SetupPayload;
        client.configure(setupPayload.intervalMs);
        break;
      case 'start':
        client.start();
        break;
      case 'stop':
        client.stop();
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          payload: new Error('ProtocolError: Invalid Message (ignored)'),
        }));
        break;
    }
  });
});
