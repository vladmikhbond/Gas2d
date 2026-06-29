import {glo, doc} from './globals/globals.js';
import Space from './model/Space.js';
import View from './view/View.js';
import Controller from './controller/Controller.js';
import { getSizeParams, getSpaceParams } from "./controller/params.js";

// params from index.html         
[glo.g, glo.gBall] = getSpaceParams()!;

const space = new Space(...getSizeParams()!);

const view = new View(space);
new Controller(space, view);

view.draw();




