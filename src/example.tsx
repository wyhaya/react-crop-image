
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Crop from '../lib/index'

class Entry extends React.Component<any> {

    state = {
        url: ''
    }

    render() {
        return <div>
            <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                    this.setState({
                        url: URL.createObjectURL(e.target.files[0])
                    })
                }}
            />
            {
                this.state.url && <Crop url={this.state.url} />
            }
        </div>
    }

}

ReactDOM.render(<Entry />, document.getElementById('root'))


