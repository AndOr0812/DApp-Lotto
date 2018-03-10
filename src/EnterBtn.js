import React, { Component } from 'react';

export default class EnterBtn extends Component {


    render() {
        return (
        <div>
            <pre><button name={this.props.name} onClick= {this.props.handle} >Check whats going on!</button></pre>
        </div>
        );
    }
}