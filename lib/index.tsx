import * as React from 'react'
import styled from 'styled-components'
import Select from './select'

const Content = styled.div`
    position: relative;
    display: inline-flex;
    user-select: none;
    * {
        box-sizing: border-box;
    }
    img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        pointer-events: none;
    }
    svg {
        position: absolute;
        left: 0;
        top: 0;
        fill: rgba(0, 0, 0, 0.6);
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
    width?: number
    height?: number
    crop: Crop
    scale?: [number, number]
    minCropWidth?: number
    minCropHeight?: number
    element?: JSX.Element
    onLoad?: (crop: Crop, imageWidth: number, imageHeight: number) => void
    onChange?: (crop: Crop) => void
    className?: string
    style?: React.CSSProperties
}

export default class Entry extends React.Component<Props> {
    state = {
        contentWidth: 0,
        contentHeight: 0
    }
    imgRef = React.createRef<HTMLImageElement>()

    componentDidMount() {
        this.imgRef.current.onload = () => {
            const { width, height } = this.imgRef.current

            this.setState({
                contentWidth: width,
                contentHeight: height
            })
            // Default
            const max = width > height ? height * 0.8 : width * 0.8
            let data = {
                width: max,
                height: max,
                x: (width - max) / 2,
                y: (height - max) / 2
            }

            if (this.props.scale) {
                const [a, b] = this.props.scale
                // Try to fill the width
                if ((width / a) * b < height) {
                    data = {
                        width: width * 0.8,
                        height: (width / a) * b * 0.8,
                        x: (width - width * 0.8) / 2,
                        y: (height - (width / a) * b * 0.8) / 2
                    }
                }
                // Try to fill the height
                if ((height / b) * a < width) {
                    data = {
                        width: (height / b) * a * 0.8,
                        height: height * 0.8,
                        x: (width - (height / b) * a * 0.8) / 2,
                        y: (height - height * 0.8) / 2
                    }
                }
            }

            this.props.onLoad && this.props.onLoad(data, width, height)
        }
    }

    render() {
        const { x, y, width, height } = this.props.crop

        return (
            <Content className={this.props.className} style={this.props.style}>
                <img
                    src={this.props.src}
                    ref={this.imgRef}
                    width={this.props.width}
                    height={this.props.height}
                />
                <svg viewBox={`0 0 ${this.state.contentWidth} ${this.state.contentHeight}`}>
                    <path
                        d={`
                    M ${x} ${y} 
                    l ${width} 0 
                    l 0 ${height} 
                    l -${width} 0
                    l 0 -${height}
                    l -${x} 0
                    l 0 ${this.state.contentHeight - y}
                    l ${this.state.contentWidth} 0
                    l 0 -${this.state.contentHeight}
                    l -${this.state.contentWidth} 0
                    l 0 ${y}
                    `}
                    />
                </svg>
                <Select
                    {...this.props.crop}
                    contentWidth={this.state.contentWidth}
                    contentHeight={this.state.contentHeight}
                    scale={this.props.scale}
                    minCropWidth={this.props.minCropWidth}
                    minCropHeight={this.props.minCropHeight}
                    element={this.props.element}
                    onChange={(data) => {
                        this.props.onChange && this.props.onChange(data)
                    }}
                />
            </Content>
        )
    }
}
