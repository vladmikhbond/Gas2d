
export enum DesignerState {
    Devices,
    Balls,
    Lines
}

export class Options 
{
    // Перетворює рядок "x1 = 200, y1 = 0, x2 = 200, y2 = 450, c = blue, "
    // на об'єкт {x1: 200, y1: 0, x2: 200, y2: 450, c: "blue", }
    static str2obj(str: string)
    {
        const reg = /([^=]+)=([^=]+)[,;]/g;
        str = str.trim();
        if (!str.endsWith(',')) 
            str += ',';

        const matches = str.matchAll(reg);
        const o: any = {}; 
        for(let match of matches) {
            const str = match[2].trim();
            o[match[1].trim()] = isNaN(+str) ? str : +str;
        }
        return o;
    }

    // obj -> "x1 = 200, y1 = 0, x2 = 200, y2 = 450, c = blue, "
    static obj2str(obj: object): string 
    {
        const ignore = ['space', 'impulse', 'a', 'vx', 'vy', 'v'];
        let str = '';
        const entries = Object.entries(obj);
        for (const [key, value] of entries) {
            if (ignore.includes(key))
                continue;   
            str += `${key} = ${value}, `;
        }
        return str;
    }
  
}

export function getKindValue(): string | undefined {   
    for (let i = 0; i < 3; i++) {
        const radio = <HTMLInputElement>document.getElementById('kind-radio' + i)!;
        if (radio.checked) {
            return radio.dataset.val;
        }
    }
    return undefined;
}

export function confirmAction(message: string) {
    let confirm = document.getElementById('confirm')!;
    confirm.innerHTML = message;
    confirm.style.display = "inline"
    setTimeout(function() {
        confirm.innerHTML = "";
        confirm.style.display = "none";
    }, 500);
}
