import dotenv from "dotenv";

import app from "./app";
import "./tracing";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
