import { Hono } from "hono";
import timestamp from "./routes/timestamp";

const app = new Hono();
app.route("/timestamp", timestamp);

export default {
  port: 4000,
  fetch: app.fetch,
};
