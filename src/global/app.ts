export enum BoardEvents {
    POS_FOCUS = 'hover',
    POS_ACTION = 'click',
    OUT_OF_BOARD = 'out-of-board'
}

// replicate WGO states + captured states
export enum StoneStates {
    WHITE = -1,
    BLACK = 1,
    EMPTY = 0,
    WHITE_CAPTURE = -2,
    BLACK_CAPTURE = 2
}

export const StoneAnimationsConfig = {
    standardMoveAnimationDuration: 250, // ms
    addStonesKeyframeStates: {
        start: { transform: 'translate3D(0, 0, 900px)' },
        end: { transform: 'translate3D(0, 0, 0)' }
    },
    removeStoneKeyframeStates: {
        start: { opacity: 1, transform: 'translate3D(0, 0, 0)' },
        end: { opacity:0, transform: 'translate3D(0, 0, 900px)' }
    },
    capturedStoneKeyframeStates: {
        start: { transform: 'translate3D(0, 0, 0)' },
        end: { transform: 'translate3D(0, 0, 900px)' }
    },
    shockwaveStoneKeyframeStatesBuilder: function(shockWaveAmplitude:number):Keyframe[] {
        return [
            { transform: 'translate3D(0, 0, 0)' },
            { transform: `translate3D(0, 0, ${ 900 * shockWaveAmplitude }px)` },
            { transform: 'translate3D(0, 0, 0)' }
        ]
    }
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