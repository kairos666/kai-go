import { Component } from '@stencil/core';

@Component({
    tag: 'app-goban',
    styleUrl: 'app-goban.scss',
    shadow: true
})
export class AppGoban {

    render() {
        return (
            <div class='app-goban'>
                <p>goban page</p>
            </div>
        );
    }
}
