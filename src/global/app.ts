export enum BoardEvents {
    POS_FOCUS = 'hover',
    POS_ACTION = 'click',
    OUT_OF_BOARD = 'out-of-board'
}

// convert 1D index to 2D index
export function indexConverter(position:number|{x:number, y:number}, size:number):number|{x:number, y:number} {
    if(typeof position == 'number') {
        // from 1D to 2D index
        return { x: Number(position) % size ,y: Math.floor(Number(position) / size) }
    } else {
        // from 2D to 1D index
        return (position as any).y * size + (position as any).x;
    }
}