import React from "react";
import PropTypes from "prop-types";

import "./Message.css";

class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            yHeight: 0,
            bHasCompletedAnimation: false
        };

        this.fn_onAnimationEnd = this.fn_onAnimationEnd.bind(this);
    }

    componentWillMount() {
        // Determine at which % distance from the top of the window that this component will render
        // Need to use a combination of max and min because Math.clamp() does not exist
        this.setState({
            yHeight: Math.max( 5, Math.min( 95, Math.round( (100 * Math.random()) ) ) ),
        });
    }

    fn_onAnimationEnd() {
        this.setState({
            bHasCompletedAnimation: true
        });
        this.props.onCrawlCompleted();
    }

    render() {
        const {username, message, onCrawlCompleted} = this.props;
        const {yHeight, bHasCompletedAnimation} = this.state;

        return (
            <div className={"msg-container" + (bHasCompletedAnimation ? " hidden" : "")} style={{ top: yHeight + "%" }} onAnimationEnd={this.fn_onAnimationEnd}>
                <span className="msg-user">{username}</span>: <span className="msg-content">{message}</span>
            </div>
        );
    }
}

Message.propTypes = {
    username: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onCrawlCompleted: PropTypes.func.isRequired
};

export default Message;