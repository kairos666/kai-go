import { Component, Prop, Watch, Element, State } from '@stencil/core';
import { StoneAnimationsConfig, StoneStates } from '../../../global/app';

@Component({
    tag: 'kaigo-stone',
    styleUrl: 'kaigo-stone.scss',
    shadow: false,
    scoped: true
})
export class Stone {
    @Element() stoneElt:HTMLElement;
    @Prop() stoneState:StoneStates = StoneStates.EMPTY;
    @Prop() isStarPoint:boolean;
    @Prop() isLatestMove:boolean;
    @Prop() isForbiddenMove:boolean;
    @State() _stoneState:StoneStates.BLACK|StoneStates.WHITE|StoneStates.EMPTY = StoneStates.EMPTY;

    hostData() {
        return { 
            'tabIndex': 0,
            'class': this.stoneClassesBuilder()
        };
    }

    componentDidLoad() {
        // initial stone state solving
        this.stoneStateChangeHandler(this.stoneState, StoneStates.EMPTY);
    }

    @Watch('stoneState')
    stoneStateChangeHandler(newValue:StoneStates, oldValue:StoneStates):void {
        // in case web animation api is not supported
        if (!this.stoneElt.animate) {
            this._stoneState = (newValue == StoneStates.BLACK_CAPTURE || newValue == StoneStates.WHITE_CAPTURE) ? StoneStates.EMPTY : newValue;
            return;
        }

        if (oldValue == StoneStates.EMPTY && (newValue == StoneStates.BLACK || newValue == StoneStates.WHITE)) {
            // new move was played
            this._stoneState = newValue;
            this.playedStoneAnimation();
        } else if((oldValue == StoneStates.BLACK || oldValue == StoneStates.WHITE) && newValue == StoneStates.EMPTY) {
            // stone was removed from board (ex: undo)
            this.removedStoneAnimation();
        } else if((oldValue == StoneStates.BLACK || oldValue == StoneStates.WHITE) && (newValue == StoneStates.BLACK_CAPTURE || newValue == StoneStates.WHITE_CAPTURE)) {
            // stone was captured
            this.capturedStoneAnimation();
        }
    }

    stoneClassesBuilder():string {
        // all other boolean states are handeld directly from boolean attributes styles
        let classes = 'gbn-Goban_Stone';
        
        // is white stone
        if(this._stoneState == StoneStates.WHITE) classes += ' gbn-Goban_Stone-white';
        // is black stone
        if(this._stoneState == StoneStates.BLACK) classes += ' gbn-Goban_Stone-black';

        return classes;
    }

    private playedStoneAnimation() {
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

    private removedStoneAnimation() {
        const keyframes:Keyframe[] = [
            StoneAnimationsConfig.removeStoneKeyframeStates.start,
            StoneAnimationsConfig.removeStoneKeyframeStates.end
        ]
        const options:KeyframeAnimationOptions = {
                duration: StoneAnimationsConfig.standardMoveAnimationDuration,
                easing: 'ease-out'
        };
        this.applyAnimation(keyframes, options).then(() => {
            // after animation is finished update stone state
            this._stoneState = StoneStates.EMPTY;
        });
    }

    private capturedStoneAnimation() {
        const keyframes:Keyframe[] = [
            StoneAnimationsConfig.capturedStoneKeyframeStates.start,
            StoneAnimationsConfig.capturedStoneKeyframeStates.end
        ]
        const options:KeyframeAnimationOptions = {
                duration: StoneAnimationsConfig.standardMoveAnimationDuration,
                delay: StoneAnimationsConfig.standardMoveAnimationDuration, // start animation after stone has been played
                easing: 'ease-out'
        };
        this.applyAnimation(keyframes, options).then(() => {
            // after animation is finished update stone state
            this._stoneState = StoneStates.EMPTY;
        });
    }

    public applyAnimation(keyframes:Keyframe|Keyframe[], options: number|KeyframeAnimationOptions):Promise<Animation> {
        // in case web animation api is not supported
        if (!this.stoneElt.animate) return Promise.reject('Web animation API is not supported');

        const animation:Animation = this.stoneElt.animate(keyframes, options);

        if (animation.finished) return animation.finished;

        // emulate finished behavior for non supporting browsers
        return new Promise(resolve => { 
            animation.onfinish = resolve;
        }).then(() => animation);
    }
}
