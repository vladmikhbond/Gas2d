import { Options, confirmAction, getKindValue} from '../globals/utils.js';
import Controller from './Controller.js';
import {Measurer} from '../model/Measurer.js'
import {Heater} from '../model/Heaters.js';
import Image from '../data/Image.js';
import {globus, page} from '../globals/globals.js';
import Handler from './Handlers.js';


export default class DeviceHandler extends Handler 
{
    constructor(controller: Controller) {
        super(controller);
    }
    
 
    mousedown(e: MouseEvent) {
        super.mousedown(e);
        // якщо курсор в середені обраного девайсу - таскати його
        let dev = this.space.selectedDevice;
        if (dev && dev.isInside(e.offsetX, e.offsetY)) {
            this.draggingObject = dev;
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

        
        if (x2 - x1 < globus.quant && y2 - y1 < globus.quant) 
        {
            // just mouse click
            this.selectAndSwithState(x1, y1);
        } 
        else 
        {
            // create device
            let o = Options.str2obj(page.optionsNewElement.value);
            let kind = getKindValue();
            if (kind == '0') {
                let color = <string> o.c ?? '';
                this.space.addDevice(new Measurer(x1, y1, x2, y2, color, o.s));
            } 
            else if (kind == '1')
            {
                this.space.addDevice(new Heater(x1, y1, x2, y2, o.rate));                    
            }
        }
        this.view.draw();    
    }

    keydown(e: KeyboardEvent) {
        if (document.activeElement == page.optionsNewElement) {
            return;
        }
        super.keydown(e);

        switch (e.key) {
            case 'Delete':
                if (this.space.selectedDevice) {
                    this.space.removeSelectedDevice();
                } else {
                    this.space.clearDevices()
                }
                this.view.draw();
                break;
            case 'c':
                if (e.ctrlKey && this.space.selectedDevice) {
                    page.imageElement.value = Options.obj2str(this.space.selectedDevice);
                    confirmAction('Data copied.');
                }
                break;
            case 'v':
                if (e.ctrlKey) {
                    let o = Options.str2obj(page.imageElement.value);
                    Object.assign(<Object>this.space.selectedDevice, o);
                    this.view.draw();
                    confirmAction('Data readed.');                    
                }
                break;
            case 's':  // save image
            {
                new Image(this.space).save('[name]');
                break;
            }
               
        }
    }

}
