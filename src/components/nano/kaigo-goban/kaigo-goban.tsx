import { Component, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'kaigo-goban',
    styleUrl: 'kaigo-goban.scss',
    shadow: true
})
export class Goban {
    @Prop() size:9|13|19 = 19;
    @Prop() schema:number[] = new Array(Math.pow(this.size, 2)).fill(0);
    @Prop() cursorState:{ position1DIndex:number, position2DIndex:{ x:number, y:number }, isValidMove:boolean }|null = null;
    @Prop() latestMove:{ position1DIndex:number, position2DIndex:{ x:number, y:number }}|null = null;
    @Event() positionInteraction: EventEmitter;

    private boardOuterMargins:string = '10vmin';
    private lineThickness:string = '2px';
    private starPoints = {
        9: [20, 24, 40, 56, 60],
        13: [42, 48, 84, 120, 126],
        19: [60, 72, 180, 288, 300]
    };

    componentWillLoad() {
        // hack binded functions
        this.positionInteractionHandler = this.positionInteractionHandler.bind(this);
    }

    render() {
        return (
            <section class="gbn-Goban">
                <div class="gbn-Goban_Board" style={ this.boardDynamicStyles(this.size) }>
                    {new Array(Math.pow(this.size - 1, 2)).fill(0).map(() => <span class="gbn-Goban_BoardCell"></span>)}
                </div>
                <div class="gbn-Goban_StonesContainer" style={ this.stoneContainerDynamicStyles(this.size) }>
                    {this.schema.map((schemaValue, index) => {
                        const isStarPoint = this.isStarPoint(index, this.size);
                        const isLatestMove = (this.latestMove && index == this.latestMove.position1DIndex);
                        const isValidMove = (this.cursorState && index == this.cursorState.position1DIndex) ? this.cursorState.isValidMove : true;
                        let classes = 'gbn-Goban_Stone';
                        // is star point
                        if(isStarPoint) classes += ' gbn-Goban_Stone-star-point';
                        // is white stone
                        if(schemaValue == -1) classes += ' gbn-Goban_Stone-white';
                        // is black stone
                        if(schemaValue == 1) classes += ' gbn-Goban_Stone-black';
                        // is latest move
                        if(isLatestMove) classes += ' gbn-Goban_Stone-latest';
                        // forbidden move
                        if(!isValidMove) classes += ' gbn-Goban_Stone-forbidden';
                        
                        return <span tabIndex={ 0 } class={ classes }
                                onClick={ () => this.positionInteractionHandler('click', index) }
                                onFocus={ () => this.positionInteractionHandler('hover', index) }
                                onMouseOver={ () => this.positionInteractionHandler('hover', index) }
                            ></span>;
                    })}
                </div>
            </section>
        );
    }

    positionInteractionHandler(interactionType:'hover'|'click', position1DIndex:number) {
        const position2DIndex = this.indexConverter(position1DIndex, this.size);
        this.positionInteraction.emit({ interactionType, position1DIndex, position2DIndex });
    }

    // convert 1D index to 2D index
    indexConverter(position:number|{x:number, y:number}, size:number):number|{x:number, y:number} {
        if(typeof position == 'number') {
            // from 1D to 2D index
            return { x: Number(position) % size ,y: Math.floor(Number(position) / size) }
        } else {
            // from 2D to 1D index
            return (position as any).y * size + (position as any).x;
        }
    }

    boardDynamicStyles(size:number):any {
        return {
            top: this.boardOuterMargins,
            bottom: this.boardOuterMargins,
            left: this.boardOuterMargins,
            right: this.boardOuterMargins,
            gridTemplate: `repeat(${size - 1}, 1fr) / repeat(${size - 1}, 1fr)`,
            gridGap: `${this.lineThickness} ${this.lineThickness}`,
            borderWidth: this.lineThickness
        }
    }

    stoneContainerDynamicStyles(size:number):any {
        const edgeposition = `calc((100vmin - ${size/(size - 1)} * (100vmin - 2 * ${this.boardOuterMargins}))/2 + ${this.lineThickness})`;

        return {
            top: edgeposition,
            bottom: edgeposition,
            left: edgeposition,
            right: edgeposition,
            gridTemplate: `repeat(${size}, 1fr) / repeat(${size}, 1fr)`,
            gridGap: `${this.lineThickness} ${this.lineThickness}`
        }
    }

    isStarPoint(stonePosIndex:number, boardSize:number):boolean {
        return this.starPoints[boardSize].includes(stonePosIndex);
    }
}
