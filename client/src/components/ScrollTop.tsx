import {Location} from 'history';
import {Component} from 'react'
import {withRouter} from 'react-router-dom'

interface State {
    location: Location
}

class ScrollToTop extends Component<State> {
    componentDidUpdate(prevState: State) {
        if (this.props.location.pathname !== prevState.location.pathname) {
            window.scrollTo(0, 0);
        }
        else if (this.props.location.hash) {
            const element = document.querySelector(this.props.location.hash);
            if (element) element.scrollIntoView({behavior: 'smooth'});
        }
    }

    render() {
        return this.props.children;
    }
}

// @ts-ignore
export default withRouter(ScrollToTop);
