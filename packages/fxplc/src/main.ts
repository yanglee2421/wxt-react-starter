import {
  BehaviorSubject,
  concatMap,
  defaultIfEmpty,
  distinctUntilChanged,
  EMPTY,
  last,
  NEVER,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  using,
} from "rxjs";
import { SerialPort } from "serialport";
import { Controls, registersMapData } from "./constants";
import { readByte, writeByte } from "./fxplc";
import { number2WordSigned } from "./number-type";
import { calcByteAddress } from "./register";

const createPort = (path: string) => {
  const port = new SerialPort({
    path,
    baudRate: 9600,
    dataBits: 7,
    stopBits: 1,
    parity: "even",
    autoOpen: true,
    lock: false,
  });

  return port;
};

const path$ = new BehaviorSubject<string>("");
const serialport$ = new BehaviorSubject<SerialPort | null>(null);
const cmd$ = new Subject<Buffer>();

path$
  .pipe(
    distinctUntilChanged(),
    switchMap((path) => {
      if (!path) {
        return EMPTY;
      }

      return using(
        () => {
          const port = createPort(path);

          return {
            unsubscribe: () => {
              port.close();
            },
            port,
          };
        },
        (c) => {
          const port = Reflect.get(Object(c), "port") as SerialPort;

          return NEVER.pipe(startWith(port), takeUntil(path$.pipe(last(), defaultIfEmpty(null))));
        },
      ).pipe(shareReplay({ bufferSize: 1, refCount: true }));
    }),
  )
  .subscribe(serialport$);

cmd$
  .pipe(
    concatMap((cmd) => {
      const port = serialport$.getValue();

      if (!port) {
        return EMPTY;
      }

      return new Observable<Buffer>((sub) => {
        const handler = (buf: Buffer) => {
          sub.next(buf);
        };

        port.on("data", handler);
        port.write(cmd);

        return () => {
          sub.unsubscribe();
          port.off("data", handler);
        };
      }).pipe(take(1));
    }),
    tap((buf) => {
      if (Controls.ACK.buf.equals(buf)) {
        console.log("ACK");
        return;
      }

      if (Controls.NAK.buf.equals(buf)) {
        console.log("NAK");
        return;
      }
    }),
  )
  .subscribe();

path$.next("COM1");

cmd$.next(writeByte(calcByteAddress(registersMapData.D, 1), number2WordSigned(258)));

cmd$.next(readByte(calcByteAddress(registersMapData.D, 1), 2));
