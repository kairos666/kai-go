import { Component, Prop, Watch, Listen, State } from '@stencil/core';
import WGO from 'wgo';
import { BoardEvents } from '../../../global/app';

@Component({
    tag: 'kaigo-game',
    styleUrl: 'kaigo-game.scss',
    shadow: true
})
export class GoGame {
    @Prop() size:9|13|19 = 19;
    @State() schema:WGO.BLACK|WGO.WHITE|WGO.EMPTY[];
    @State() positionMoveStatus:{ position1DIndex:number, position2DIndex:{ x:number, y:number }, isValidMove:boolean }|null = null;
    @State() latestMove:{ position1DIndex:number, position2DIndex:{ x:number, y:number }}|null = null;
    private goGame;

    componentWillLoad() {
        this.goGame = new WGO.Game(this.size);
        this.schema = this.getPosition().schema;

        // proxy game stack to extend it with last move property
        this.goGame.stack = new Proxy(this.goGame.stack, {
            set: (target, prop, receiver) => {
                // check if setting is a WGO.Position object before acting
                if(receiver.size) receiver.lastMove = this.latestMove;
                // apply regular action with eventually modified object
                Reflect.set( target, prop, receiver );

                return true;
            }
        });
    }

    @Watch('size')
    sizeChangeHandler(newValue:number, oldValue:number) {
        // only act when size is different
        if(newValue !== oldValue) {
            this.goGame = null;
            this.goGame = new WGO.Game(newValue);
            this.schema = this.getPosition().schema;
        }
    }

    @Listen('positionInteraction')
    gobanInteractionsHandler(event: CustomEvent) {
        const eventDetails = event.detail;
        switch(eventDetails.interactionType) {
            case BoardEvents.POS_FOCUS:
                // simulate move and update board cursor
                const simulatedMoveResult = this.play(eventDetails.position2DIndex.x, eventDetails.position2DIndex.y, this.goGame.turn, true);
                this.positionMoveStatus = {
                    position1DIndex: eventDetails.position1DIndex,
                    position2DIndex: eventDetails.position2DIndex,
                    isValidMove: (typeof simulatedMoveResult !== 'number')
                }
            break;
            case BoardEvents.POS_ACTION:
                // update last move BEFORE actually moving to ensure correct registration in stack proxy
                this.latestMove = {
                    position1DIndex: eventDetails.position1DIndex,
                    position2DIndex: eventDetails.position2DIndex
                };

                // play move and update board
                this.play(eventDetails.position2DIndex.x, eventDetails.position2DIndex.y, this.goGame.turn);
                this.schema = this.getPosition().schema;
            break;
            case BoardEvents.OUT_OF_BOARD:
                // remove position markers when cursor leaves board
                this.positionMoveStatus = null;
            break;
        }
    }

    render() {
        return [
            <p>captured stones: W = { this.getCaptureCount(WGO.WHITE) } / B = { this.getCaptureCount(WGO.BLACK) }</p>,
            <p>player turn: { (this.goGame.turn == 1) ? 'BLACK' : 'WHITE' }</p>,
            <menu>
                <button type="button" onClick={ this.popPosition.bind(this) }>undo</button>
            </menu>,
            <kaigo-goban size={ this.size } schema={ this.schema } cursorState={ this.positionMoveStatus } latestMove={ this.latestMove }></kaigo-goban>
        ];
    }

    // replicate WGO methods (http://waltheri.github.io/wgo.js/Game.html)
    addStone(x:number, y:number, c:WGO.BLACK|WGO.WHITE):boolean {
        // /!\ reversed axis
        return this.goGame.addStone(y, x, c);
    }

    removeStone(x:number, y:number):boolean {
        // /!\ reversed axis
        return this.goGame.removeStone(y, x);
    }

    getStone(x:number, y:number):WGO.BLACK|WGO.WHITE|null {
        return this.goGame.getStone(y, x);
    }

    setStone(x:number, y:number, c:WGO.BLACK|WGO.WHITE):boolean {
        // /!\ reversed axis
        return this.goGame.setStone(y, x, c);
    }

    firstPosition():void {
        this.goGame.firstPosition();
    }

    getCaptureCount(color:WGO.BLACK|WGO.WHITE):number {
        return this.goGame.getCaptureCount(color);
    }

    getPosition():Position {
        return this.goGame.getPosition();
    }

    isOnBoard(x:number, y:number):boolean {
        return this.goGame.isOnBoard(y, x);
    }

    isValid(x:number, y:number, c:WGO.BLACK|WGO.WHITE):boolean {
        // /!\ reversed axis
        return this.goGame.isValid(y, x, c);
    }

    pass(color:WGO.BLACK|WGO.WHITE):number {
        return this.goGame.pass(color);
    }

    play(x:number, y:number, c:WGO.BLACK|WGO.WHITE, noplay:boolean = false):{x:number, y:number}[]|0|1|2|3|4|boolean {
        /**
         * error codes
         * 0 = wrong turn (black tried to played instead of white or reverse)
         * 1 = given coordinates are not on board 
         * 2 = on given coordinates already is a stone 
         * 3 = suicide (currently they are forbbiden) 
         * 4 = repeated position
         */
        let result = this.goGame.play(y, x, c, noplay);

        // reverse axis in results (array of captured stones)
        if(Array.isArray(result)) result = result.map(capturedStone => {
            return { x: capturedStone.y, y: capturedStone.x };
        });

        return result;
    }

    validatePosition():{x:number, y:number}[] {
        let result = this.goGame.validatePosition();

        // reverse axis in results (array of captured stones)
        if(Array.isArray(result)) result = result.map(capturedStone => {
            return { x: capturedStone.y, y: capturedStone.x };
        });

        return result;
    }

    popPosition():void {
        // leave early if no stacked positions besides empty board
        if(this.goGame.stack.length <= 1) return;

        this.goGame.popPosition();

        // update last move & schema
        const undonePosition:Position = this.getPosition();
        this.latestMove = undonePosition.lastMove;
        this.schema = undonePosition.schema;
    }

    pushPosition(tmp?:Position):void {
        this.goGame.pushPosition(tmp);
    }
}

interface Position {
    capCount: {
        black: number,
        white: number
    },
    size: number,
    schema: WGO.BLACK|WGO.WHITE|WGO.EMPTY[],
    lastMove: { position1DIndex:number, position2DIndex:{ x:number, y:number }}|null
}