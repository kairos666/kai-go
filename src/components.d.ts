/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';

import '@stencil/router';
import '@stencil/state-tunnel';
import {
  MatchResults,
} from '@stencil/router';
import {
  StoneStates,
} from './global/app';


export namespace Components {

  interface AppGoban {}
  interface AppGobanAttributes extends StencilHTMLAttributes {}

  interface AppHome {}
  interface AppHomeAttributes extends StencilHTMLAttributes {}

  interface AppProfile {
    'match': MatchResults;
  }
  interface AppProfileAttributes extends StencilHTMLAttributes {
    'match'?: MatchResults;
  }

  interface AppRoot {}
  interface AppRootAttributes extends StencilHTMLAttributes {}

  interface KaigoGame {
    'size': 9|13|19;
  }
  interface KaigoGameAttributes extends StencilHTMLAttributes {
    'size'?: 9|13|19;
  }

  interface KaigoGoban {
    'cursorState': { position1DIndex:number, position2DIndex:{ x:number, y:number }, isValidMove:boolean }|null;
    'latestMove': { position1DIndex:number, position2DIndex:{ x:number, y:number }}|null;
    'schema': StoneStates[];
    'size': 9|13|19;
    'turn': StoneStates.BLACK|StoneStates.WHITE|null;
  }
  interface KaigoGobanAttributes extends StencilHTMLAttributes {
    'cursorState'?: { position1DIndex:number, position2DIndex:{ x:number, y:number }, isValidMove:boolean }|null;
    'latestMove'?: { position1DIndex:number, position2DIndex:{ x:number, y:number }}|null;
    'onPositionInteraction'?: (event: CustomEvent) => void;
    'schema'?: StoneStates[];
    'size'?: 9|13|19;
    'turn'?: StoneStates.BLACK|StoneStates.WHITE|null;
  }

  interface KaigoStone {
    'isForbiddenMove': boolean;
    'isLatestMove': boolean;
    'isStarPoint': boolean;
    'stoneState': StoneStates;
  }
  interface KaigoStoneAttributes extends StencilHTMLAttributes {
    'isForbiddenMove'?: boolean;
    'isLatestMove'?: boolean;
    'isStarPoint'?: boolean;
    'stoneState'?: StoneStates;
  }
}

declare global {
  interface StencilElementInterfaces {
    'AppGoban': Components.AppGoban;
    'AppHome': Components.AppHome;
    'AppProfile': Components.AppProfile;
    'AppRoot': Components.AppRoot;
    'KaigoGame': Components.KaigoGame;
    'KaigoGoban': Components.KaigoGoban;
    'KaigoStone': Components.KaigoStone;
  }

  interface StencilIntrinsicElements {
    'app-goban': Components.AppGobanAttributes;
    'app-home': Components.AppHomeAttributes;
    'app-profile': Components.AppProfileAttributes;
    'app-root': Components.AppRootAttributes;
    'kaigo-game': Components.KaigoGameAttributes;
    'kaigo-goban': Components.KaigoGobanAttributes;
    'kaigo-stone': Components.KaigoStoneAttributes;
  }


  interface HTMLAppGobanElement extends Components.AppGoban, HTMLStencilElement {}
  var HTMLAppGobanElement: {
    prototype: HTMLAppGobanElement;
    new (): HTMLAppGobanElement;
  };

  interface HTMLAppHomeElement extends Components.AppHome, HTMLStencilElement {}
  var HTMLAppHomeElement: {
    prototype: HTMLAppHomeElement;
    new (): HTMLAppHomeElement;
  };

  interface HTMLAppProfileElement extends Components.AppProfile, HTMLStencilElement {}
  var HTMLAppProfileElement: {
    prototype: HTMLAppProfileElement;
    new (): HTMLAppProfileElement;
  };

  interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {}
  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };

  interface HTMLKaigoGameElement extends Components.KaigoGame, HTMLStencilElement {}
  var HTMLKaigoGameElement: {
    prototype: HTMLKaigoGameElement;
    new (): HTMLKaigoGameElement;
  };

  interface HTMLKaigoGobanElement extends Components.KaigoGoban, HTMLStencilElement {}
  var HTMLKaigoGobanElement: {
    prototype: HTMLKaigoGobanElement;
    new (): HTMLKaigoGobanElement;
  };

  interface HTMLKaigoStoneElement extends Components.KaigoStone, HTMLStencilElement {}
  var HTMLKaigoStoneElement: {
    prototype: HTMLKaigoStoneElement;
    new (): HTMLKaigoStoneElement;
  };

  interface HTMLElementTagNameMap {
    'app-goban': HTMLAppGobanElement
    'app-home': HTMLAppHomeElement
    'app-profile': HTMLAppProfileElement
    'app-root': HTMLAppRootElement
    'kaigo-game': HTMLKaigoGameElement
    'kaigo-goban': HTMLKaigoGobanElement
    'kaigo-stone': HTMLKaigoStoneElement
  }

  interface ElementTagNameMap {
    'app-goban': HTMLAppGobanElement;
    'app-home': HTMLAppHomeElement;
    'app-profile': HTMLAppProfileElement;
    'app-root': HTMLAppRootElement;
    'kaigo-game': HTMLKaigoGameElement;
    'kaigo-goban': HTMLKaigoGobanElement;
    'kaigo-stone': HTMLKaigoStoneElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
