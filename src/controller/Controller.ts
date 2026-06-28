import {globus, page} from '../globals/globals.js';
import Space, { CreateMode } from '../model/Space.js';
import View from '../view/View.js';
import { Options, DesignerState} from '../globals/utils.js';
import Handler from './Handlers.js';
import BallHandler from './BallHandler.js';
import LineHandler from './LineHandler.js';
import DeviceHandler from './DeviceHandler.js';
import { getSizeParams, getSpaceParams } from './params.js';


export default class Controller 
{
    state = DesignerState.Devices;
    substate = 0;

    space: Space;
    view: View;

    private ballHandler: BallHandler;
    private lineHandler: LineHandler;
    private deviceHandler: DeviceHandler;

    timer: ReturnType<typeof setInterval> | 0 = 0;

    private _createMode = CreateMode.Gas;

    constructor(space: Space, view: View) 
    {
        this.space = space;
        this.view = view;
        this.ballHandler = new BallHandler(this);
        this.lineHandler = new LineHandler(this);
        this.deviceHandler = new DeviceHandler(this);
        this.space.time = 0;
        globus.strikes = 0;
        
        this.bindHandlers()
        this.setModelSize();
        this.createMode = CreateMode.Gas;
        
        this.startFooter();

        
    }

    set createMode(value: CreateMode) 
    {
        this._createMode = value;
        switch(value) {
            case CreateMode.Info:
                break;
            case CreateMode.Gas:
                this.switchHandlers(this.ballHandler);
                break;
            case CreateMode.Wall:
                this.switchState(DesignerState.Lines);
                break;
            case CreateMode.Devs:
                this.switchState(DesignerState.Devices)
                break;
        }

        
    }

    get createMode() {
        return this._createMode;
    }


    setModelSize() {
        let [w, h] = [this.space.width, this.space.height];
        document.documentElement.style.setProperty('--canvas-width', w+'px');
        document.documentElement.style.setProperty('--canvas-height', h+'px');
        // document.getElementById("savedSceneText")!.style.width = (w - 125)+'px';             
        page.canvas.height = h;
        page.canvas.width = w;
        page.canvas2.height = h;
        page.canvas2.width = w;
    }

    private bindHandlers() {

        // Size params changed 
        document.getElementById("sizeParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                const size = getSizeParams();
                if (size) {
                    [this.space.width, this.space.height] = size;
                    this.setModelSize();
                }
            }                
        }); 

        // Space params changed
        document.getElementById("spaceParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                const ps = getSpaceParams();
                if (ps) {
                    [globus.g, globus.gBall] = ps!;                
                }
            }      
        });

        // page.ballsRadio.addEventListener("change", () => {
        //     if (!page.ballsRadio.checked)
        //         return;
        //     this.switchState(DesignerState.Balls);
        // });

        // page.linesRadio.addEventListener("change", () => {
        //     if (!page.linesRadio.checked)
        //         return;
        //     this.switchState(DesignerState.Lines);
        // });

        // page.noneRadio.addEventListener("change", () => {
        //     if (!page.noneRadio.checked)
        //         return;
        //     this.switchState(DesignerState.Devices);
        // });

        page.kindRadios[0].addEventListener("change", () => {
            this.switchSubstate(0);
        });
        
        page.kindRadios[1].addEventListener("change", () => {
            this.switchSubstate(1)
        });

        document.getElementById('pause-process-btn')!.addEventListener('click', () => {
            if (this.timer == 0) 
                this.run();
            else
                this.stop();
        })

        page.stepButton.addEventListener('click', () => {
            this.step();
        })

        // page.optionsGloElement.addEventListener("change", () => {
        //     let o = Options.str2obj(page.optionsGloElement.value);
        //     Object.assign(globus, o);
        // });


        // page.canvas2Element.addEventListener("mousemove", (e) => {
        //    const plunger = this.space.plunger;
        //    if (!plunger) return;
        //    this.view.showFooter2(plunger, e.offsetX, e.offsetY);
            
        // });

    } 
    

    // 0-device, 1-balls, 2-lines
    stateOptions: string[][] = [
        ['c = red, s = 0', 'rate = 1.001'] ,     
        ['n = 5000, r = 0.5, vx=2, vy = 2, c = red, m = 1', 'n = 5000, r = 0.5, t = 120, c = red, m = 1'],  
        ['c = blue', 'c = black' ]];




    stateRadioSpans: string[][] = [
        ['Meter', 'Heater'],     
        ['Determine', 'Random'],  
        ['Rectangle', 'Plunger']];
    

    private switchState(newState: DesignerState) 
    {
        // switch Handlers
        switch (newState) {
            case DesignerState.Balls:
                this.switchHandlers(this.ballHandler);
                break;
            case DesignerState.Lines:
                this.switchHandlers(this.lineHandler);
                break;
            case DesignerState.Devices:
                this.switchHandlers(this.deviceHandler);
                break;
        }
        // save previous opts
        this.stateOptions[this.state][this.substate] = page.optionsNewElement.value
        this.state = newState;
        // restore current opts
        page.optionsNewElement.value = this.stateOptions[this.state][this.substate];

        // change radio buttons UI

        let kindValues =  this.stateRadioSpans[newState];
        for (let i = 0; i < 3; i++) {
            const radio = page.kindRadios[i];
            const span = page.kindSpans[i];
            if (i < kindValues.length) {  
                const text = kindValues[i];
                span.innerText = text;
                radio.dataset.val = i.toString();
                radio.style.display = span.style.display = 'inline';
            } else {
                radio.style.display = span.style.display = 'none';
            }
        }
        let substate = 0;
        this.substate = substate;
        page.kindRadios[substate].checked = true;
        page.optionsNewElement.value = this.stateOptions[this.state][substate];
    };


    private switchSubstate(newSubstate: number) {
        if (page.kindRadios[newSubstate].checked) {
            // save previous opts
            this.stateOptions[this.state][this.substate] = page.optionsNewElement.value
            this.substate= newSubstate;
            // restore current opts
            page.optionsNewElement.value = this.stateOptions[this.state][this.substate];
        }      
    } 
    

    private switchHandlers(handler: Handler)  {
        page.canvas.onmousedown = (e) => handler.mousedown(e);
        page.canvas.onmousemove = (e) => handler.mousemove(e);
        page.canvas.onmouseup = (e) => handler.mouseup(e);
        page.canvas.onkeydown = (e) => handler.keydown(e);
        // page.canvas2Element.onkeydown = (e) => handler.keydown(e);
    }

    step() {
        this.space.time++;
        this.space.step();
        // віміри через кожні Q кроків
        if (this.space.time % globus.metr == 0) {
            this.space.measure();
            // this.view.drawMeasure();
        }
        this.view.draw();
    }


    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = 0;
        }
    }

    run() {
        if (this.timer) return;
        this.timer = setInterval(() => { 
            this.step();
        }, 1);
    }




    private startFooter() {
        let prevSteps = this.space.time;
        setInterval(() => {
            let freq = this.space.time - prevSteps;
            prevSteps = this.space.time;

            let strikes = globus.strikes * 100 / this.space.N || 0;
            
            this.view.showFooter({
                'steps': this.space.time,
                'freq': freq,
                'strikes': strikes.toFixed(1) + '%' ,
                'N': this.space.N,
            });            
        }, 1000)
    }


}
