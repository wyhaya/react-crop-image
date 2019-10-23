
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import Crop from '../lib/index'

const Content = styled.div`
    .option{
        position: absolute;
        top: calc(100% + 12px);
        left: 0;
        right: 0;
        border: 1px solid red;
    }
`

class Entry extends React.Component {

    state = {
        url: '',
        crop: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    }

    render() {
        return <Content>
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
                this.state.url && <Crop
                    // width={500}
                    // height={308}
                    src={this.state.url}
                    crop={this.state.crop}
                    className='crop'
                    option={
                        <div
                            className='option'
                            onClick={(e) => {
                                console.log(e)
                            }}
                        >
                            Hello
                        </div>
                    }
                    onInit={(crop, imageWidth, imageHeight) => {
                        console.log(imageWidth, imageHeight)
                        this.setState({
                            crop
                        })
                    }}
                    onChange={(crop) => {
                        this.setState({
                            crop
                        })
                    }}
                />
            }
        </Content>
    }

}

ReactDOM.render(<Entry />, document.getElementById('root'))


