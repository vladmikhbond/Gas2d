import {page} from '../globals/globals.js';
import { dist, } from '../model/Geometry.js'
import Bomb from '../model/Bomb.js'
import { Options, confirmAction,} from '../globals/utils.js';
import Controller from './Controller.js';
import Handler from './Handlers.js';
import { getGasParams } from './params.js';

const CLICK_DIST = 3;

export default class BallHandler extends Handler {

    constructor(controller: Controller) {
       super(controller);
    }
   
    mousedown(e: MouseEvent) {
        super.mousedown(e);
        // якщо курсор в середені обраної кулі - таскати її
        let sel = this.space.selectedBall;
        if (sel && sel.isInside(e.offsetX, e.offsetY)) {
            this.draggingObject = sel;
        }          
    }

    mousemove(e: MouseEvent) {
        super.mousemove(e);
        if (!this.isDrawing) 
            return;

        this.view.draw();
        this.view.drawGrayRect(this.currentX, this.currentY, e.offsetX, e.offsetY);
        
    }

    mouseup(e: MouseEvent) {
        if (!this.isDrawing) 
            return;
        this.isDrawing = false;
        
        if (this.draggingObject) {
            this.draggingObject = null;
            return;
        }   
        let o = Options.str2obj(page.optionsNewElement.value);

        let x1 = this.currentX, y1 = this.currentY;
        let x2 = e.offsetX, y2 = e.offsetY;
        let drawDist = dist({ x: x1, y: y1 }, { x: x2, y: y2 });

        // just mouse click
        if (drawDist <= CLICK_DIST) {
            this.selectAndSwithState(x1, y1);
        } else {
            let ps = getGasParams();
            if (ps) {
                const [n, r, t, m] = ps;
                this.space.addBomb(new Bomb(n, x1, y1, x2, y2, 0, 0, t, r, m, "red"));
            }
        }
        this.view.draw();  
    }

    keydown(e: KeyboardEvent) 
    {
        if (document.activeElement == page.optionsNewElement || document.activeElement == page.optionsGloElement ) {
            return;
        }
        super.keydown(e);
        
        switch (e.key) {
            case 'Delete':
                if (this.space.selectedBall) {
                    this.space.removeSelectedBall();
                } else {
                    this.space.clearBalls()
                }
                this.view.draw();
                break;
            case 'c':
                if (e.ctrlKey && this.space.selectedBall) {
                    page.imageElement.value = Options.obj2str(this.space.selectedBall);
                    confirmAction('Data copied.');
                }
                break;
            case 'v':
                if (e.ctrlKey) {
                    let o = Options.str2obj(page.imageElement.value);
                    Object.assign(<Object>this.space.selectedBall, o);
                    confirmAction('Data readed.');
                    this.view.draw();                    
                }
                break;
            case 'ArrowUp':
                if (this.space.selectedBall) {
                    this.space.selectedBall.y -= 1;
                    this.view.draw();
                }
                break;
            case 'ArrowDown':
                if (this.space.selectedBall) {
                    this.space.selectedBall.y += 1;
                    this.view.draw();
                }
                break;
            case 'ArrowLeft':
                if (this.space.selectedBall) {
                    this.space.selectedBall.x -= 1;
                    this.view.draw();
                }
                break;
            case 'ArrowRight':
                if (this.space.selectedBall) {
                    this.space.selectedBall.x += 1;
                    this.view.draw();
                }
                break;
        }
    }

}





