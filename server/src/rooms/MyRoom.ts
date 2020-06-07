import http from "http";
import { Room, Client } from "colyseus";

export class MyRoom extends Room {

  onCreate (options: any) {

    this.onMessage("type", (client, message) => {
      // handle "type" message
    });

  }

  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    const session = request.session;
    console.log(session);

    // send entire session back to the client for demonstration purposes
    // this.send(client, session);

    return true;
  }

  onJoin (client: Client, options: any) {
  }

  onLeave (client: Client, consented: boolean) {
  }

  onDispose() {
  }

}
