import { Hono } from "hono";
import { cors } from "hono/cors";
import timestamp from "./routes/timestamp";
import auth from "./routes/auth";

const app = new Hono();
app.use("*", cors());
app.route("/timestamp", timestamp);
app.route("/auth", auth);
export default {
  port: 4000,
  fetch: app.fetch,
};
