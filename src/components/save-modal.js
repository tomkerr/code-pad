import React, { Component } from 'react';
import ReactBootstrap, { Modal, Input } from 'react-bootstrap';

import Button from './button';

export default class SaveModal extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.whenChanged = this.whenChanged.bind(this);
    }

    handleClick() {
        this.props.buttonClick();
    }

    whenChanged(event) {
        this.props.onChange('saveAsInput', event.target.value);
    }

    render() {
        return (
            <Modal show={this.props.show}>

                <Modal.Header>
                    <Modal.Title>{ this.props.modalTitle }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h6
                        key={this.props.modalTitle}>Save As:
                    </h6>
                    <Input key="133445323"
                           type="text"
                           value={this.props.inputValue}
                           onChange={this.whenChanged}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button whenClicked={this.handleClick} buttonTitle={this.props.buttonTitle}/>

                </Modal.Footer>

            </Modal>

        );
    }
}
