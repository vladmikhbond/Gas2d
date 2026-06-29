
import { Options, confirmAction, getKindValue} from '../globals/utils.js';
import Controller from './Controller.js';
import Line from '../model/Line.js';
import {Plunger} from '../model/Plunger.js';
import Handler from './Handlers.js';
import {globus, page} from '../globals/globals.js';
import { getWallParams } from './params.js';


export default class LineHandler extends Handler {

    constructor(controller: Controller) {
       super(controller);
    }
   
    mousedown(e: MouseEvent) {
        super.mousedown(e);
        // якщо курсор в середені обраної лінії - таскати її
        let sel = this.space.selectedLine;
        if (sel && sel.isInside(e.offsetX, e.offsetY)) {
            this.draggingObject = sel;
        }          
    }


    mouseup(e: MouseEvent) {
        if (!this.isDrawing) 
            return;
        this.isDrawing = false;

        if (this.draggingObject) {
            this.draggingObject.justify();
            this.view.draw();
            this.draggingObject = null;
            return;
        }   
        let x1 = this.currentX, y1 = this.currentY;
        let x2 = e.offsetX, y2 = e.offsetY;
        
        // just mouse click
        if (x2 - x1 < globus.quant && y2 - y1 < globus.quant) {
            this.selectAndSwithState(x1, y1);
        } else {
            const t = getWallParams();
            // якщо прямокутник занадто плаский, додавати лінію
            if (Math.abs(y1 - y2) < globus.quant) {
                this.space.addLine(new Line(x1, y1, x2, y1, "blue"));
            } else if (Math.abs(x1 - x2) < globus.quant) {
                this.space.addLine(new Line(x1, y1, x1, y2, "blue"));
            } else if (t == 'r') {
                this.space.addRect(x1, y1, x2, y2, "blue" );                
            } else if (t == 'p') {
                this.space.addPlunger(x1, y1, x2, y2, "blue");
            }          
        }
        this.view.draw();
    }

    keydown(e: KeyboardEvent) 
    {

        super.keydown(e);

        if (e.ctrlKey) {
            switch (e.key) {
                case 'c':
                    if (this.space.selectedLine) {
                        page.imageElement.value = Options.obj2str(this.space.selectedLine);
                        confirmAction('Data copied.');
                    }
                    break;
                case 'v':
                    let o = Options.str2obj(page.imageElement.value);
                    Object.assign(<Object>this.space.selectedLine, o);
                    this.view.draw();
                    confirmAction('Data readed.');
                    break;                                
            }    
            return;
        }

        switch (e.key) {
            case 'Delete':
                if (this.space.selectedLine) {
                    this.space.removeSelectedLine();
                } else {
                    this.space.clearLines();
                }
                this.view.draw();
                break;
            case 'ArrowUp':
                if (this.space.selectedLine) {
                    this.space.selectedLine.move(0, -globus.quant);
                    this.view.draw();
                }
                break;
            case 'ArrowDown':
                if (this.space.selectedLine) {
                    this.space.selectedLine.move(0, globus.quant);
                    this.view.draw();
                }
                break;
            case 'ArrowLeft':
                if (this.space.selectedLine) {
                    this.space.selectedLine.move(-globus.quant, 0);
                    this.view.draw();
                }
                break;
            case 'ArrowRight':
                if (this.space.selectedLine) {
                    this.space.selectedLine.move(globus.quant, 0);
                    this.view.draw();
                }
                break;

            case '+': case '-':
                // збільшити-зменшити навантаження на поршень  
                var plun = this.space.plunger;   
                if (plun instanceof Plunger) {
                    let dm = e.key == '+' ? 10 : -10;
                    plun.m += dm;
                    if (plun.m < 0) plun.m = 0;
                    this.view.draw();
                    confirmAction('New weight: ' + plun.m);
                }
                break;
       }
    }

}
