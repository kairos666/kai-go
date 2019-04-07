import { Component, Prop } from '@stencil/core';

@Component({
    tag: 'kaigo-stone',
    styleUrl: 'kaigo-stone.scss',
    shadow: false,
    scoped: true
})
export class Stone {
    @Prop() stoneState:'black'|'white'|'empty';
    @Prop() isStarPoint:boolean;
    @Prop() isLatestMove:boolean;
    @Prop() isForbiddenMove:boolean;

    hostData() {
        return { 
            'tabIndex': 0,
            'class': this.stoneClassesBuilder()
        };
    }

    stoneClassesBuilder():string {
        // all other boolean states are handeld directly from boolean attributes styles
        let classes = 'gbn-Goban_Stone';
        
        // is white stone
        if(this.stoneState == 'white') classes += ' gbn-Goban_Stone-white';
        // is black stone
        if(this.stoneState == 'black') classes += ' gbn-Goban_Stone-black';

        return classes;
    }
}
