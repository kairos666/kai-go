import { Component, Prop, Watch, Element, State } from '@stencil/core';
import { StoneAnimationsConfig } from '../../../global/app';

@Component({
    tag: 'kaigo-stone',
    styleUrl: 'kaigo-stone.scss',
    shadow: false,
    scoped: true
})
export class Stone {
    @Element() stoneElt:HTMLElement;
    @Prop() stoneState:'black'|'white'|'empty' = 'empty';
    @Prop() isStarPoint:boolean;
    @Prop() isLatestMove:boolean;
    @Prop() isForbiddenMove:boolean;
    @State() _stoneState:'black'|'white'|'empty' = 'empty';

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
            this._stoneState = newValue;
            this.playedStoneAnimation();
        } else if((oldValue == 'black' || oldValue == 'white') && newValue == 'empty') {
            // stone was captured or removed from board (ex: undo)
            this.removedStoneAnimation();
        }
    }

    stoneClassesBuilder():string {
        // all other boolean states are handeld directly from boolean attributes styles
        let classes = 'gbn-Goban_Stone';
        
        // is white stone
        if(this._stoneState == 'white') classes += ' gbn-Goban_Stone-white';
        // is black stone
        if(this._stoneState == 'black') classes += ' gbn-Goban_Stone-black';

        return classes;
    }

    playedStoneAnimation() {
        const keyframes:Keyframe[] = [
            StoneAnimationsConfig.addStonesKeyframeStates.start,
            StoneAnimationsConfig.addStonesKeyframeStates.end
        ]
        const options:KeyframeAnimationOptions = {
                duration: StoneAnimationsConfig.standardMoveAnimationDuration,
                easing: 'ease-in'
        };
        this.applyAnimation(keyframes, options);
    }

    removedStoneAnimation() {
        const keyframes:Keyframe[] = [
            StoneAnimationsConfig.removeStoneKeyframeStates.start,
            StoneAnimationsConfig.removeStoneKeyframeStates.end
        ]
        const options:KeyframeAnimationOptions = {
                duration: StoneAnimationsConfig.standardMoveAnimationDuration,
                delay: StoneAnimationsConfig.standardMoveAnimationDuration, // start animation after stone has been played
                easing: 'ease-out'
        };
        this.applyAnimation(keyframes, options).then(() => {
            // after animation is finished update stone state
            this._stoneState = 'empty';
        });
    }

    public applyAnimation(keyframes:Keyframe|Keyframe[], options: number|KeyframeAnimationOptions):Promise<Animation> {
        const animation:Animation = this.stoneElt.animate(keyframes, options);

        if (animation.finished) return animation.finished;

        // emulate finished behavior for non supporting browsers
        return new Promise(resolve => { 
            animation.onfinish = resolve;
        }).then(() => animation);
    }
}
