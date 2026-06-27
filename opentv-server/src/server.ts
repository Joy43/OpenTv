import { Server } from "http";
import app from "./app";
import config from "./config";

let server: Server;
const main = async () => {
  server = app.listen(config.port, () => {
    console.log("Server is running on port :", config.port);
    // server url for client
    console.log("Server URL:", `http://localhost:${config.port}`);
    // swager 
    console.log("swagger url" , `http://localhost:${config.port}/api-docs`)
  });
};
main();