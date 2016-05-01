import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { codeChange } from '../actions/index';

import Ace from 'brace';
Ace.config.set('basePath', '/libs/ace');
import { Col } from 'react-bootstrap';
import ToggleDisplay from'react-toggle-display';

import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';

import 'brace/theme/tomorrow';
import 'brace/theme/tomorrow_night_eighties';

class Pad extends Component {
    constructor(props) {
        super(props);
        this.pads = [];
    }

    /**
    * Set up the right amount of dom nodes for each file to hold a pad (each node needs a unique name)
    */
    setUpDom() {
        let style = {
            pad: {
                height: this.props.height,
                borderRight: 'thin solid black',
                borderLeft: 'thin solid black'
            }
        };
        return this.props.files.map((file) => {
            return (
                <ToggleDisplay key={file.fileName} show={this.props.activeFile === file.fileName}>
                    <div
                        key={file.fileName}
                        id={file.fileName}
                        style={style.pad}
                        >
                    </div>
                </ToggleDisplay>
            );
        });
    }

    /**
    * react lifecycle, editor will mount onto the dom after dom has loaded
    */
    componentDidMount() {
        // create a new pad for each file in the project
        for (let i = 0, l = this.props.files.length; i < l; i++) {
            this.pads[i] = Ace.edit(this.props.files[i].fileName);
            this.setupEditor(this.pads[i], this.props.files[i].fileType, this.props.files[i].content, this.props.files[i].fileName);
        }
    }

    /**
    * This will happen on Open Project or an incoming change from the server
    * @param nextProps
    */
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.editorSettings);
        // loop through all pads in project and update them if they are different        
        for (let i = 0, l = this.pads.length; i < l; i++) {
            this.pads[i].setFontSize(parseInt(nextProps.editorSettings.fontSize));
            this.pads[i].setTheme(nextProps.editorSettings.theme);
            if (this.pads[i].getSession().getValue() !== nextProps.files[i].content) {
                this.updateEditorContent(this.pads[i], nextProps.files[i].content, nextProps.cursorPos);
            }
        }
    }

    /**
     * Updates editor content from external resource (local db or from server)
     * @param editor
     * @param code
     * @param cursor
     */
    updateEditorContent(editor, code, cursor) {
        this.silent = true;
        console.log(cursor);
        editor.setValue(code);
        editor.gotoLine(cursor.row + 1, cursor.column + 1);
        this.silent = false;
    }

    /**
    * Set up a new editor, pass in editor object, codeType string, and the actual code
    * @param editor
    * @param codeType
    * @param code
    */
    setupEditor(editor, codeType, code, fileName) {
        
        editor.$blockScrolling = Infinity;
        editor.setFontSize(this.props.editorSettings.fontSize);
        editor.setShowPrintMargin(false);
        editor.setHighlightActiveLine(true);
        editor.setTheme(this.props.editorSettings.theme);
        editor.getSession().setMode(`ace/mode/${codeType}`);
        editor.getSession().setValue(code);
        editor.getSession().on('change', () => {
            this.whenChanged(editor, fileName)
        });
        editor.moveCursorToPosition(this.props.cursorPos);
    }

    /**
    * Will call parent method when user makes changes on editor, pass editor object and codetype string
    * @param editor
    * @param codeType
    */
    whenChanged(editor, fileName) {
        this.props.codeChange(editor.getSession().getValue(), fileName, editor.getCursorPosition());
        this.props.onChange(this.pads);
    }

    render() {
        let style = {
            padParent: {
                height: this.props.height,
                paddingLeft: '2px',
                paddingRight: 0
            }
        };

        return (
            <Col lg={6} id="pad" style={style.padParent}>
                {this.setUpDom() }
            </Col>
        );
    }
}

// applications state to props, look in reducer/index; files will be found there
function mapStateToProps(state) {
    return {
        files: state.files,
        cursorPos: state.cursorPos,
        activeFile: state.activeFile,
        editorSettings: state.editorSettings
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    // when selectBook is called, result should be passed to reducers
    return bindActionCreators({ codeChange: codeChange }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(Pad);