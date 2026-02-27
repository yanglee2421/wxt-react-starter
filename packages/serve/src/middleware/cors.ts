import cors from "cors";

export const corsHandle = () => {
  return cors((req, callback) => {
    const origin = ["http://localhost", "http://127.0.0.1"].includes(
      req.headers.origin || "",
    );
    callback(null, { origin });
  });
};
