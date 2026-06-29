type N1 = [number];
type N2 = [number, number];
type N4 = [number, number, number, number];

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

export function getGasParams(): N4 | null
{
    const paramsElement = (document.getElementById("gasParams") as HTMLInputElement)!;
    let ps: N4;
    try {
        ps = (new Function("", 
            "let n, r, t, m;" + 
            paramsElement.value + 
            "; return [n, r, t, m]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    const [n, r, t, m] = ps;
    if (n == undefined || n < 0) 
        return errMesage("n: n > 0", paramsElement);
    if (r == undefined || r < 0) 
        return errMesage("r: r > 0", paramsElement);
    if (t == undefined || t < 0) 
        return errMesage("t: t > 0", paramsElement);
    if (m == undefined || m < 0) 
        return errMesage("m: m > 0", paramsElement);

    paramsElement.style.backgroundColor = "";
    return ps;
}

export function getWallParams(): string | null 
{
    const paramsElement = (document.getElementById("wallParams") as HTMLInputElement)!;
    let t: string | null ;
    try {
        t = (new Function("", 
            "let type;" + 
            paramsElement.value + 
            "; return type" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // validation
    if (!t || t != 'r' && t != 'p' )
        return errMesage("type = 'r'|'p'", paramsElement);
 
    paramsElement.style.backgroundColor = "";
    return t;
}


export function getDevsParams(): [string, number, string] | null 
{
    const paramsElement = (document.getElementById("devsParams") as HTMLInputElement)!;
    let ps: [string, number, string] | null ;
    try {
        ps = (new Function("", 
            "let type, r, c;" + 
            paramsElement.value + 
            "; return [type, r, c]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }

    // validation
    const [type_, r, c] = ps!;
    if (type_ == undefined|| type_ != 'm' && type_ != 'h' )
        return errMesage("type = 'm'[eter] | 'h'[eater]", paramsElement);
    if (r == undefined || r < 0.9 || r > 1.1 )
        return errMesage("r: o.9 < r < 1.1", paramsElement);
    if (c == undefined )
        return errMesage("c: color", paramsElement);

    paramsElement.style.backgroundColor = "";
    return ps;
}



function errMesage(mes: string, el: HTMLInputElement) {
    alert (mes);
    el.style.backgroundColor = "pink";
    return null;
}
