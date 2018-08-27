// import { Store } from "./store";
import { StaticInjector } from "../../../node_modules/@angular/core/src/di/injector";

export class Product {
    constructor(
        public id : number,
        public frontId : number,
        public name : string,
        public description : string,
        public price : number,
        public quantity : number,
        public imageUrl: string = "") {
    }
}
