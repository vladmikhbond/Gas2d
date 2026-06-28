type N2 = [number, number];
type N5 = [number, number, number, number, number];

export function getSizeParams(): N2 | null
{
    const paramsElement = (document.getElementById("sizeParams") as HTMLInputElement)!;
    let ps: N2;
    try {
        ps = (new Function("", 
            "let W, H;" + 
            paramsElement.value + 
            "; return [W, H]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if (ps[0] == undefined || ps[0] <= 0) 
        return errMesage("W: W > 0", paramsElement);

    if (ps[1] == undefined || ps[1] <= 0) 
        return errMesage("H: H > 0", paramsElement);

    paramsElement.style.backgroundColor = "";
    return ps;
}


export function getSpaceParams(): N2 | null 
{
    const paramsElement = (document.getElementById("spaceParams") as HTMLInputElement)!;
    let ps: N2;
    try {
        ps = (new Function("", 
            "let g, gBall;" + 
            paramsElement.value + 
            "; return [g, gBall]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // validation
    const [g, gBall] = ps;

    if (g == undefined || g < -10 || g > 10 )
        return errMesage("g: -10 < k < 10", paramsElement);

    if ( !(gBall != undefined && (gBall == 0 || gBall == 1)) )
        return errMesage("w: 0 <= w < 1", paramsElement);
 
    paramsElement.style.backgroundColor = "";
    return ps;
}


function errMesage(mes: string, el: HTMLInputElement) {
    alert (mes);
    el.style.backgroundColor = "pink";
    return null;
}
