import { DisplayDriver } from "./display";
import ws from "./ws";

const drivers = {
    ws,
    display: new DisplayDriver(),
};

export type Drivers = typeof drivers;
export default drivers;
