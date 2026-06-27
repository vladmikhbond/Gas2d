import {page} from './globals/globals.js';
import Space from './model/Space.js';
import View from './view/View.js';
import Controller from './controller/Controller.js';


const space = new Space(page.canvasElement.width, page.canvasElement.height);
const view = new View(space);
new Controller(space, view);





