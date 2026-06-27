import Process from './Process.js';
import Controller from './Controller.js';
import { Options } from '../globals/utils.js';
import Bomb from '../model/Bomb.js';
import {globus, page} from '../globals/globals.js';
import { Plunger } from '../model/Plunger.js';
import Image from '../data/Image.js';


export enum ProcessState {
    Pause = 0,
    Run = 1,
    Stop = 2,
}

export class ProcessInterpreter {
    script: string;
    controller: Controller;

    static process: Process;
    static procState = ProcessState.Pause;    // 0-pause,   1-run,   2-stop,

    constructor(script: string, controller: Controller) {
        this.script = script;
        this.controller = controller
    }

    private parse(line: string) {
        let pos = line.indexOf(':');
        let command = line.slice(0, pos).trim();
        let rest = line.slice(pos + 1).trim()
        let params = Options.str2obj(rest);
        return [command, rest, params]
    }

    async interpret() {

        const lines = this.script.split('\n').map(l => l.trim());
        for (let line of lines) {
            if (!line)
                continue;
            this.controller.view.hilightCommand(line);
            // елементи чергової команди
            let [command, restLine, params] = this.parse(line);

            switch (command) {
                case 'load':
                    this.load(restLine.trim());
                    break;
                case 'run':
                    await this.run(params);
                    break;

                case 'title':
                    page.pageTitle.innerHTML = restLine;
                    break;
                case 'plunger':
                    this.createDefaultPlunger(params);
                    this.startProcess();
                    await ProcessInterpreter.process.calm(1000);
                    break;
                case 'scale':
                    const plunger = this.controller.space.plunger;
                    if (plunger) {
                        Object.assign(plunger.scales, params);
                    }
                    break;
                case 'adiabatic':
                    if (params.dir.startsWith('inc')) {
                        await ProcessInterpreter.process!.adiabaticExtention(params.m);
                    } else if (params.dir.startsWith('dec')) {
                        await ProcessInterpreter.process!.adiabaticCompression(params.m);
                    }
                    break;
                case 'isobaric':
                    if (params.dir.startsWith('inc')) {
                        await ProcessInterpreter.process!.isobaricExtention(params.v);
                    } else if (params.dir.startsWith('dec')) {
                        await ProcessInterpreter.process!.isobaricCompression(params.v);
                    }
                    break;
                case 'isothermic':
                    if (params.dir.startsWith('inc')) {
                        await ProcessInterpreter.process!.isothermicExtention(params.m);
                    } else if (params.dir.startsWith('dec')) {
                        await ProcessInterpreter.process!.isothermicCompression(params.m);
                    }
                    break;
                case 'isohoric':
                    if (params.dir.startsWith('inc')) {
                        await ProcessInterpreter.process!.isohoricExtention(params.m);
                    } else if (params.dir.startsWith('dec')) {
                        await ProcessInterpreter.process!.isohoricCompression(params.m);
                    }
                    break;

                //#region Цикл Отто (бензиновий)

                case 'intake':
                    this.startProcess();
                    await ProcessInterpreter.process!.intake(10000, params.v);  // n = 10 000
                    break;
                case 'compression':
                    await ProcessInterpreter.process!.compression(params.m, params.v);
                    break;
                case 'ignition':
                    await ProcessInterpreter.process!.ignition(params.rate, params.t);
                    break;
                case 'expansion':
                    await ProcessInterpreter.process!.expansion(params.m, params.v);
                    break;
                case 'exhaust':
                    await ProcessInterpreter.process!.exhaust(params.m, params.v);
                    break;
                //#endregion

                default:
                    alert(`Wrong command: ${command}`);
                    break;
            }
        }
    }

    private startProcess() {
        ProcessInterpreter.process = new Process(this.controller);
    }

    private load(imgName: string) 
    {
        let str = page.dbArea.value;
        let beg = str.indexOf(imgName + ':') + imgName.length + 1;
        str = str.slice(beg).trim();
        let end = str.indexOf('\n');
        let imgStr = str.slice(1, end-2).trim();
        new Image(this.controller.space).load(imgStr); 
        
        this.controller.view.draw();
    }


    private async run(params: any) 
    {
        params.t ??= 100500;
        try {      
            this.startProcess();
            let limit:number = globus.steps + params.t;

            await ProcessInterpreter.process.whileAsync(
                    () => globus.steps < limit, 
                    () => {this.controller.space.warming()});
        } catch(er) {  
            console.error(er);
        }        
    }


    private createDefaultPlunger(params: any) {
        this.controller.space.clear();

        // default values
        let x1 = 100, y1 = 20, x2 = 300, y2 = 480, m = 100, gas_n = 10000, gas_m = 0.4, gas_r = 0.5, gas_c = 'red', gas_t = 100;

        gas_t = params.T ?? gas_t;
        gas_n = params.n ?? gas_n;

        m = params.m ?? m;

        const y = gas_n * globus.BOLTZ * gas_t / (m * globus.g);
        // add plunger
        let plun = this.controller.space.addPlunger(x1, y1, x2, y2, "blue");
        plun.m = m;
        plun.move(0, -y + Plunger.GAP);
        // add gass
        this.controller.space.addBomb(
            new Bomb(gas_n, x1, plun.realBottom - y, x2, plun.realBottom, 0, 0, gas_t, gas_r, gas_m, gas_c));        
    }
    



}