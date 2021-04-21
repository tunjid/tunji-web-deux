import {Location} from 'history';
import {Component} from 'react'
import {withRouter} from 'react-router-dom'

interface Props {
    location: Location
}

class ScrollToTop extends Component<Props> {
    componentDidUpdate(prevProps: Props) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
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
