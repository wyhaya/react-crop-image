
import * as React from 'react'
import styled from 'styled-components'
import Select from './select'

const Content = styled.div`
    position: relative;
    display: inline-block;
    user-select: none;
    img{
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
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

export type Crop = {
    x: number
    y: number
    width: number
    height: number
}

interface Props {
    src: string
    crop: Crop
    option?: JSX.Element
    onInit?: (crop: Crop) => void
    onChange?: (crop: Crop) => void
    className?: string
    style?: React.CSSProperties
}

export default class Entry extends React.Component<Props> {

    state = {
        contentWidth: 0,
        contentHeight: 0
    }
    imgRef = React.createRef()

    componentDidMount() {
        this.imgRef.current.onload = (e) => {
            let {width, height} = e.target
            let max = width > height ? (height * .8) : (width * .8)
            this.setState({
                contentWidth: width,
                contentHeight: height,
            })
            this.props.onInit && this.props.onInit({
                width: max,
                height: max,
                x: (width - max) / 2,
                y: (height - max) / 2
            })
        }
    }

    render() {

        const {x, y, width, height} = this.props.crop

        return <Content 
            className={this.props.className}
            style={this.props.style}
        >
            <img src={this.props.src} ref={this.imgRef} />
            <svg viewBox={`0 0 ${this.state.contentWidth} ${this.state.contentHeight}`}>
                <path d={`
                    M ${x} ${y} 
                    l ${width + 2} 0 
                    l 0 ${height + 2} 
                    l -${width + 2} 0 
                    l 0 -${height + 2}
                    l -${x} 0
                    l 0 ${this.state.contentHeight - y}
                    l ${this.state.contentWidth} 0
                    l 0 -${this.state.contentHeight}
                    l -${this.state.contentWidth} 0
                    l 0 ${y}
                    `
                } />
            </svg>
            <Select
                {...this.props.crop}
                contentWidth={this.state.contentWidth}
                contentHeight={this.state.contentHeight}
                option={this.props.option}
                onChange={data => {
                    this.props.onChange && this.props.onChange(data)
                }}
            />
        </Content>
    }
}


