import { Component } from '@stencil/core';
import WGO from 'wgo';

@Component({
    tag: 'kaigo-game',
    styleUrl: 'kaigo-game.scss',
    shadow: true
})
export class GoGame {
    private goGame;

    componentWillLoad() {
        this.goGame = new WGO.Game(19);
        console.log(this.addStone(0, 0, WGO.BLACK));
        console.log(this.play(1, 0, WGO.BLACK));
        console.log(this.play(2, 0, WGO.WHITE));
        console.log(this.play(3, 0, WGO.BLACK));
        console.log(this.play(3, 0, WGO.WHITE));
        console.log(this.play(2, 1, WGO.BLACK));
        this.popPosition();
        console.log(this.getStone(2, 0));
        console.log(this.getPosition());
    }

    render() {
        return [
            <span>captured stones: W = { this.getCaptureCount(WGO.WHITE) } / B = { this.getCaptureCount(WGO.BLACK) }</span>,
            <kaigo-goban size={19} schema={ this.getPosition().schema }></kaigo-goban>
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

    play(x:number, y:number, c:WGO.BLACK|WGO.WHITE, noplay:boolean = false):{x:number, y:number}[]|1|2|3|4 {
        /**
         * error codes
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
        this.goGame.popPosition();
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
    schema: WGO.BLACK|WGO.WHITE|WGO.EMPTY[]
}