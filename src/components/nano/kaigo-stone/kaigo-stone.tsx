import { Component, Prop, Watch } from '@stencil/core';

@Component({
    tag: 'kaigo-stone',
    styleUrl: 'kaigo-stone.scss',
    shadow: false,
    scoped: true
})
export class Stone {
    @Prop() stoneState:'black'|'white'|'empty' = 'empty';
    @Prop() isStarPoint:boolean;
    @Prop() isLatestMove:boolean;
    @Prop() isForbiddenMove:boolean;

    hostData() {
        return { 
            'tabIndex': 0,
            'class': this.stoneClassesBuilder()
        };
    }

    componentDidLoad() {
        // initial stone state solving
        this.stoneStateChangeHandler(this.stoneState, 'empty');
    }

    @Watch('stoneState')
    stoneStateChangeHandler(newValue:'black'|'white'|'empty', oldValue:'black'|'white'|'empty'):void {
        if (oldValue == 'empty' && (newValue == 'black' || newValue == 'white')) {
            // new move was played
            console.log('played stone');
        } else if((oldValue == 'black' || oldValue == 'white') && newValue == 'empty') {
            // stone was captured or removed from board (ex: undo)
            console.log('captured or removed stone');
        }
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
