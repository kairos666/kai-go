import { Component, Prop, Watch, Listen, State } from '@stencil/core';
import WGO from 'wgo';
import { BoardEvents, StoneStates, indexConverter } from '../../../global/app';

@Component({
    tag: 'kaigo-game',
    styleUrl: 'kaigo-game.scss',
    shadow: true
})
export class GoGame {
    @Prop() size:9|13|19 = 19;
    @State() schema:StoneStates[];
    @State() positionMoveStatus:{ position1DIndex:number, position2DIndex:{ x:number, y:number }, isValidMove:boolean }|null = null;
    @State() latestMove:{ position1DIndex:number, position2DIndex:{ x:number, y:number }}|null = null;
    private goGame;

    componentWillLoad() {
        this.goGame = new WGO.Game(this.size);
        this.schema = this.getPosition().schema as StoneStates[];

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
            this.schema = this.getPosition().schema as StoneStates[];
        }
    }

    @Listen('positionInteraction')
    gobanInteractionsHandler(event: CustomEvent) {
        const eventDetails = event.detail;
        switch(eventDetails.interactionType) {
            case BoardEvents.POS_FOCUS:
                this.positionMoveStatus = {
                    position1DIndex: eventDetails.position1DIndex,
                    position2DIndex: eventDetails.position2DIndex,
                    isValidMove: this.isValid(eventDetails.position2DIndex.x, eventDetails.position2DIndex.y, this.goGame.turn)
                }
            break;
            case BoardEvents.POS_ACTION:
                // leave early if forbidden move (before updating latest move)
                if(!this.isValid(eventDetails.position2DIndex.x, eventDetails.position2DIndex.y, this.goGame.turn)) return;

                // update last move BEFORE actually moving to ensure correct registration in stack proxy
                this.latestMove = {
                    position1DIndex: eventDetails.position1DIndex,
                    position2DIndex: eventDetails.position2DIndex
                };

                // play move and update board
                const moveResult = this.play(eventDetails.position2DIndex.x, eventDetails.position2DIndex.y, this.goGame.turn);
                this.schema = this.extendSchemaAfterMove(this.getPosition().schema, moveResult);
            break;
            case BoardEvents.OUT_OF_BOARD:
                // remove position markers when cursor leaves board
                this.positionMoveStatus = null;
            break;
        }
    }

    private extendSchemaAfterMove(afterMoveSchema:StoneStates.BLACK|StoneStates.WHITE|StoneStates.EMPTY[], moveResult:{x:number, y:number}[]|0|1|2|3|4|boolean):StoneStates[] {
        // leave early if invalid move or no stones captured
        if(!Array.isArray(moveResult) || moveResult.length == 0) return afterMoveSchema as StoneStates[];

        // captured stones are always from opponent color
        const captureState:StoneStates.BLACK_CAPTURE|StoneStates.WHITE_CAPTURE = (this.goGame.turn == StoneStates.BLACK) ? StoneStates.WHITE_CAPTURE : StoneStates.BLACK_CAPTURE;
        const needExtensions = moveResult.map(index2D => {
            return indexConverter(index2D, this.size);
        });

        // clone initial schema and mutate (tus avoiding bugging WGO model)
        const clonedSchema = (afterMoveSchema as number[]).slice(0);
        needExtensions.forEach(capturedStone => {
            clonedSchema[capturedStone as number] = captureState;
        });

        return clonedSchema as StoneStates[];
    }

    render() {
        return [
            <p>captured stones: W = { this.getCaptureCount(StoneStates.WHITE) } / B = { this.getCaptureCount(StoneStates.BLACK) }</p>,
            <menu>
                <button type="button" onClick={ this.popPosition.bind(this) }>undo</button>
                <button type="button" onClick={ this.firstPosition.bind(this) }>clear game</button>
            </menu>,
            <kaigo-goban 
                size={ this.size } 
                schema={ this.schema } 
                cursorState={ this.positionMoveStatus } 
                latestMove={ this.latestMove }
                turn={ this.goGame.turn }
            />
        ];
    }

    // replicate WGO methods (http://waltheri.github.io/wgo.js/Game.html)
    addStone(x:number, y:number, c:StoneStates.BLACK|StoneStates.WHITE):boolean {
        // /!\ reversed axis
        return this.goGame.addStone(y, x, c);
    }

    removeStone(x:number, y:number):boolean {
        // /!\ reversed axis
        return this.goGame.removeStone(y, x);
    }

    getStone(x:number, y:number):StoneStates.BLACK|StoneStates.WHITE|null {
        return this.goGame.getStone(y, x);
    }

    setStone(x:number, y:number, c:StoneStates.BLACK|StoneStates.WHITE):boolean {
        // /!\ reversed axis
        return this.goGame.setStone(y, x, c);
    }

    firstPosition():void {
        this.goGame.firstPosition();

        // update last move & schema
        const undonePosition:Position = this.getPosition();
        this.latestMove = null;
        this.positionMoveStatus = null;
        this.schema = undonePosition.schema as StoneStates[];
    }

    getCaptureCount(color:StoneStates.BLACK|StoneStates.WHITE):number {
        return this.goGame.getCaptureCount(color);
    }

    getPosition():Position {
        return this.goGame.getPosition();
    }

    isOnBoard(x:number, y:number):boolean {
        return this.goGame.isOnBoard(y, x);
    }

    isValid(x:number, y:number, c:StoneStates.BLACK|StoneStates.WHITE):boolean {
        // /!\ reversed axis
        return this.goGame.isValid(y, x, c);
    }

    pass(color:StoneStates.BLACK|StoneStates.WHITE):number {
        return this.goGame.pass(color);
    }

    play(x:number, y:number, c:StoneStates.BLACK|StoneStates.WHITE, noplay:boolean = false):{x:number, y:number}[]|0|1|2|3|4|boolean {
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
        this.schema = undonePosition.schema as StoneStates[];
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
    schema: StoneStates.BLACK|StoneStates.WHITE|StoneStates.EMPTY[],
    lastMove: { position1DIndex:number, position2DIndex:{ x:number, y:number }}|null
}