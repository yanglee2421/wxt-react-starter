import mqtt from "mqtt";
import type { Subscription } from "rxjs";
import {
  combineLatest,
  EMPTY,
  fromEventPattern,
  map,
  merge,
  Observable,
  retry,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwError,
  timer,
} from "rxjs";

export class MqttDemo {
  readonly mqttURI$ = new Subject<string>();
  readonly deviceId$ = new Subject<string>();
  private subscription: Subscription;

  constructor() {
    this.subscription = combineLatest([this.mqttURI$, this.deviceId$])
      .pipe(
        switchMap(([mqttURI, deviceId]) => {
          if (!mqttURI) {
            return EMPTY;
          }

          if (!deviceId) {
            return EMPTY;
          }

          return createMqtt(mqttURI).pipe(
            switchMap((client) => {
              return merge(
                createConnect(client).pipe(
                  switchMap(() => createDeviceUp(client)),
                  tap(([err]) => {
                    console.log("[MQTT] 已订阅主题 device/up", err);
                  }),
                  switchMap(() => createMessage(client)),
                  map(([, payload]) => payload.toString()),
                ),
                createReconnect(client),
                createError(client).pipe(switchMap(() => throwError(() => new Error("error")))),
                createOffline(client).pipe(switchMap(() => throwError(() => new Error("offline")))),
              ).pipe(takeUntil(createClose(client)));
            }),
          );
        }),
        retry({
          count: Infinity,
          resetOnSuccess: true,
          delay: () => timer(1000 * 2),
        }),
      )
      .subscribe();
  }
  dispose() {
    this.subscription.unsubscribe();
  }
}

const createMqtt = (mqttURI: string) => {
  return new Observable<mqtt.MqttClient>((sub) => {
    const client = mqtt.connect(mqttURI, {
      clientId: `location1-info-${Date.now()}`,
      connectTimeout: 5000,
      keepalive: 5,
      reconnectPeriod: 3000,
      clean: true,
    });
    sub.next(client);

    return () => {
      client.end();
    };
  });
};

const createConnect = (client: mqtt.MqttClient) => {
  const connect$ = fromEventPattern<never>(
    (f) => client.on("connect", f),
    (f) => client.off("connect", f),
  );

  return connect$;
};
const createReconnect = (client: mqtt.MqttClient) => {
  const reconnect$ = fromEventPattern(
    (f) => client.on("reconnect", f),
    (f) => client.off("reconnect", f),
  ).pipe(
    tap(() => {
      console.log("reconnect");
    }),
  );

  return reconnect$;
};
const createMessage = (client: mqtt.MqttClient) => {
  const message$ = fromEventPattern<[string, Buffer]>(
    (f) => client.on("message", f),
    (f) => client.off("message", f),
  );

  return message$;
};
const createError = (client: mqtt.MqttClient) => {
  const error$ = fromEventPattern(
    (f) => client.on("error", f),
    (f) => client.off("error", f),
  ).pipe(
    tap(() => {
      console.log("error");
    }),
  );

  return error$;
};
const createOffline = (client: mqtt.MqttClient) => {
  const offline$ = fromEventPattern(
    (f) => client.on("offline", f),
    (f) => client.off("offline", f),
  ).pipe(
    tap(() => {
      console.log("offline");
    }),
  );

  return offline$;
};
const createClose = (client: mqtt.MqttClient) => {
  const close$ = fromEventPattern(
    (f) => client.on("close", f),
    (f) => client.off("close", f),
  ).pipe(
    tap(() => {
      console.log("close");
    }),
  );

  return close$;
};
const createDeviceUp = (client: mqtt.MqttClient) => {
  const device_up$ = fromEventPattern<[unknown]>(
    (f) => client.subscribe("device/up", f),
    (f) => client.unsubscribe("device/up", f),
  );

  return device_up$;
};
