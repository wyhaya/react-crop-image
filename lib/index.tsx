
import * as React from 'react'
import styled from 'styled-components'
import Select from './select'

const Content = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    .content{
        position: relative;
    }
    img{
        display: block;
        pointer-events: none;
    }
    svg{
        position: absolute;
        left: 0;
        top: 0;
        fill: rgba(0, 0, 0, .6);
    }
`

interface Props {
    url: string
}

export default class Entry extends React.Component<Props> {

    state = {
        contentWidth: 0,
        contentHeight: 0,
        x: 0,
        y: 0,
        width: 200,
        height: 200,
    }

    componentDidMount() {
        const img = new Image()
        img.src = this.props.url
        img.onload = (e) => {
            this.setState({
                contentWidth: e.target.width,
                contentHeight: e.target.height
            })
        }
    }

    render() {
        return <Content>
            <div className='content'>
                <img src={this.props.url} />
                <svg viewBox={`0 0 ${this.state.contentWidth} ${this.state.contentHeight}`}>
                    <path d={`
                        M ${this.state.x} ${this.state.y} 
                        l ${this.state.width + 2} 0 
                        l 0 ${this.state.height + 2} 
                        l -${this.state.width + 2} 0 
                        l 0 -${this.state.height + 2}
                        l -${this.state.x} 0
                        l 0 ${this.state.contentHeight - this.state.y}
                        l ${this.state.contentWidth} 0
                        l 0 -${this.state.contentHeight}
                        l -${this.state.contentWidth} 0
                        l 0 ${this.state.y}
                        `
                    } />
                </svg>
                <Select
                    x={this.state.x}
                    y={this.state.y}
                    width={this.state.width}
                    height={this.state.height}
                    onChange={data => {
                        if (
                            data.x >= 0 &&
                            data.y >= 0 &&
                            this.state.contentWidth - 2 - data.x >= this.state.width &&
                            this.state.contentHeight - 2 - data.y >= this.state.height
                        ) {
                            this.setState({
                                ...data
                            })
                        }
                    }}
                />
            </div>
        </Content>
    }
}


