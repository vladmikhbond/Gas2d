
// Основне газове рівняння: P * V = N * BOLTZ * T
// На сторінці:   "g = 0.1, gBall = 0, cell = 20, viz = 10, quant = 5, loss = 0, metr = 1"
export const globus = 
{

    BOLTZ: 1/30, // 0.005,       // стала Больцмана (в житті = 1.380649e−23) // was 1/30

    g: 0.1,            // сила тяжіння
    gBall: 0,          // чи впливає тяжіння на кулі (0-ні, 1-впливає) 
    metr: 10,          // інтервал між вимірюваннями (у кроках)
    quant: 5,          // квант простору             


    strikes: 0,        // заг. кількість зіткнень    

};

export const page = { 
    canvas: <HTMLCanvasElement>document.getElementById('canvas'),
    canvas2: <HTMLCanvasElement>document.getElementById('canvas2'),

    noneRadio: <HTMLInputElement>document.getElementById('none')!,
    ballsRadio: <HTMLInputElement>document.getElementById('balls')!,
    linesRadio: <HTMLInputElement>document.getElementById('lines')!,

    optionsGloElement: <HTMLInputElement>document.getElementById('options-glo')!,


    stepButton: <HTMLButtonElement>document.getElementById('step')!,
    keysSpan: <HTMLSpanElement>document.getElementById('keys')!,


    processArea: <HTMLTextAreaElement>document.getElementById('process-script')!,
    imageElement: <HTMLInputElement>document.getElementById('image-json')!,

    footer: <HTMLElement>document.getElementById('footer')!,
    footer2: <HTMLElement>document.getElementById('footer2')!,
    pageTitle: <HTMLElement>document.getElementById('page-title')!,

    kindRadios: [<HTMLInputElement>document.getElementById('kind-radio0')!,  
                <HTMLInputElement>document.getElementById('kind-radio1')!,  
                <HTMLInputElement>document.getElementById('kind-radio2')!,],
    kindSpans: [<HTMLSpanElement>document.getElementById('kind-span0')!,
                <HTMLSpanElement>document.getElementById('kind-span1')!,
                <HTMLSpanElement>document.getElementById('kind-span2')!],
    dbArea: <HTMLTextAreaElement>document.getElementById('db')!,

}
