// import { Client, StompSubscription } from '@stomp/stompjs';
// import {
//   ScenarioMessage,
//   ScenarioEventSchema,
// } from '@/features/websocket/types.ts';
//
// export class ScenarioWebSocketService {
//   private client: Client;
//   private subscriptions: Map<string, StompSubscription> = new Map();
//
//   constructor(scenarioId: number) {
//     this.client = new Client({
//       brokerURL: globalThis.process.env.APP_URL,
//       onConnect: () => {
//         this.subscribeToScenario(scenarioId);
//       },
//     });
//   }
//
//   connect() {
//     this.client.activate();
//   }
//
//   disconnect() {
//     void this.client.deactivate();
//   }
//
//   private subscribeToScenario(scenarioId: number) {
//     const subscription = this.client.subscribe(
//       `/topic/scenario/${scenarioId}`,
//       message => {
//         const data: ScenarioMessage = ScenarioEventSchema.parse(
//           JSON.parse(message.body),
//         );
//         this.handleScenarioMessage(data);
//         console.log('Otrzymano wiadomość:', data);
//       },
//     );
//
//     this.subscriptions.set('scenario', subscription);
//   }
//
//   private handleScenarioMessage(data: ScenarioMessage) {
//     switch (data.data.entityName) {
//       case 'Event': {
//         // to threads, events, branchings
//         break;
//       }
//       case 'ObjectInstance': {
//         // threads, branchings, instances, events
//         break;
//       }
//       case 'Scenario': {
//         // scenario - w sensie "metadane"
//         break;
//       }
//       case 'ScenarioPhase': {
//         //fazy
//         break;
//       }
//       case 'Branching': {
//         //thready, eventy, instancje, branchingi
//         break;
//       }
//       case 'Permission': {
//         //wszystko? albo cokolwiek czy są uprawnienia
//         break;
//       }
//       case 'UserToObject': {
//         // na przyszłość bo teraz nie ma perspektyw
//         break;
//       }
//     }
//   }
// }
