import {globus, page} from '../globals/globals.js';
import Space from '../model/Space.js';
import View from '../view/View.js';
import { Options, DesignerState} from '../globals/utils.js';
import Handler from './Handlers.js';
import BallHandler from './BallHandler.js';
import LineHandler from './LineHandler.js';
import DeviceHandler from './DeviceHandler.js';


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

        // switch state to State.Lines
        page.linesRadio.checked = true; 
        page.linesRadio.dispatchEvent(new Event("change"));
        
        this.startFooter();
    }

    private bindHandlers() {
        page.ballsRadio.addEventListener("change", () => {
            if (!page.ballsRadio.checked)
                return;
            this.switchState(DesignerState.Balls);
        });

        page.linesRadio.addEventListener("change", () => {
            if (!page.linesRadio.checked)
                return;
            this.switchState(DesignerState.Lines);
        });

        page.noneRadio.addEventListener("change", () => {
            if (!page.noneRadio.checked)
                return;
            this.switchState(DesignerState.Devices);
        });

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

        page.optionsGloElement.addEventListener("change", () => {
            let o = Options.str2obj(page.optionsGloElement.value);
            Object.assign(globus, o);
        });


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


    // stateKeyHints: string[] = [
    //     '<b>Keys:</b> Del, ctrl-c, ctrl-v, arrows, s, Pp,Tt,Ee,Vv,Xx 0, f, 1,2',
    //     '<b>Keys:</b> Del, ctrl-c, ctrl-v, Pp,Tt,Ee,Vv,Xx 0, f, 1,2',
    //     '<b>Keys:</b> Del, ctrl-c, ctrl-v, arrows, +,-, Pp,Tt,Ee,Vv,Xx 0, f, 1,2', ];
    

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
        page.canvasElement.onmousedown = (e) => handler.mousedown(e);
        page.canvasElement.onmousemove = (e) => handler.mousemove(e);
        page.canvasElement.onmouseup = (e) => handler.mouseup(e);
        page.canvasElement.onkeydown = (e) => handler.keydown(e);
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

            let strikes = globus.strikes * 100 / globus.N || 0;
            
            this.view.showFooter({
                'steps': this.space.time,
                'freq': freq,
                'strikes': strikes.toFixed(1) + '%' ,
                'N': globus.N,
            });            
        }, 1000)
    }


}
