// errors.js - definizione errori custom protocollo FXPLC
// errors.js - custom error hierarchy for FX PLC protocol

/** Base class for all FX PLC related errors */
export class FXPLCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FXPLCError";
  }
}
/** PLC responded with NAK / unsupported command */
export class NotSupportedCommandError extends FXPLCError {
  constructor(msg = "Command not supported") {
    super(msg);
    this.name = "NotSupportedCommandError";
  }
}
/** No data received within expected timeframe */
export class NoResponseError extends FXPLCError {
  constructor(msg = "No response from PLC") {
    super(msg);
    this.name = "NoResponseError";
  }
}
/** Response frame failed structural / checksum validation */
export class ResponseMalformedError extends FXPLCError {
  constructor(msg = "Malformed response") {
    super(msg);
    this.name = "ResponseMalformedError";
  }
}
/** Operation attempted while transport not connected/open */
export class NotConnectedError extends FXPLCError {
  constructor(msg = "Not connected") {
    super(msg);
    this.name = "NotConnectedError";
  }
}

export default {
  FXPLCError,
  NotSupportedCommandError,
  NoResponseError,
  ResponseMalformedError,
  NotConnectedError,
};
