
import * as React from 'react'
import styled from 'styled-components'

const Content = styled.div`
    position: absolute;
    z-index: 1;
    border: 1px solid #3da3ed;
    cursor: move;
    .line{
        border: 1px dashed #d4d4d4;
        position: absolute;
        pointer-events: none;
        &.one {
            width: 100%;
            top: 33.33333%;
            border-top: 1px;
        }
        &.two{
            width: 100%;
            bottom: 33.33333%;
            border-top: 1px;
        }
        &.three{
            height: 100%;
            left: 33.33333%;
            border-left: 1px;
        }
        &.four{
            height: 100%;
            right: 33.33333%;
            border-left: 1px;
        }
    }
    .dot{
        width: 7px;
        height: 7px;
        background-color: #1396ed;
        position: absolute;
        &.top{
            top: -3px;
        }
        &.center{
            top: calc(50% - 3px);
        }
        &.bottom{
            bottom: -3px;
        }
        &.x-left{
            left: -3px;
        }
        &.x-center{
            left: calc(50% - 3px);
        }
        &.x-right{
            right: -3px;
        }
    }
`

interface Props {
    x: number
    y: number
    width: number
    height: number
    contentWidth: number
    contentHeight: number
    option?: JSX.Element
    onChange: (data: {
        x: number
        y: number,
        width: number,
        height: number
    }) => void
}

export default class Entry extends React.Component<Props> {

    state = {
        mouseDown: null,
    }

    cropMinWidth = 10
    cropMinHeight = 10

    render() {

        const baseProps = {
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp,
            onMouseOut: this.onMouseUp
        }

        return <Content
            style={{
                left: `${this.props.x}px`,
                top: `${this.props.y}px`,
                width: `${this.props.width}px`,
                height: `${this.props.height}px`,
            }}
            {...baseProps}
            onMouseMove={(e) => this.onMouseMove(e, () => {
                return {
                    x: this.props.x + (e.clientX - this.state.mouseDown.clientX),
                    y: this.props.y + (e.clientY - this.state.mouseDown.clientY),
                }
            })}
        >

            <div className='line one' />
            <div className='line two' />
            <div className='line three' />
            <div className='line four' />

            <div className='dot top x-left' style={{ cursor: 'nwse-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        x: this.props.x + (e.clientX - this.state.mouseDown.clientX),
                        y: this.props.y + (e.clientY - this.state.mouseDown.clientY),
                        width: this.props.width - (e.clientX - this.state.mouseDown.clientX),
                        height: this.props.height - (e.clientY - this.state.mouseDown.clientY),
                    }
                })}
            />
            <div className='dot top x-center' style={{ cursor: 'ns-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        y: this.props.y + (e.clientY - this.state.mouseDown.clientY),
                        height: this.props.height - (e.clientY - this.state.mouseDown.clientY),
                    }
                })}
            />
            <div className='dot top x-right' style={{ cursor: 'nesw-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        y: this.props.y + (e.clientY - this.state.mouseDown.clientY),
                        width: this.props.width + (e.clientX - this.state.mouseDown.clientX),
                        height: this.props.height - (e.clientY - this.state.mouseDown.clientY),
                    }
                })}
            />
            <div className='dot center x-left' style={{ cursor: 'ew-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        x: this.props.x + (e.clientX - this.state.mouseDown.clientX),
                        width: this.props.width - (e.clientX - this.state.mouseDown.clientX),
                    }
                })}
            />
            <div className='dot center x-right' style={{ cursor: 'ew-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        width: this.props.width + (e.clientX - this.state.mouseDown.clientX)
                    }
                })}
            />
            <div className='dot bottom x-left' style={{ cursor: 'nesw-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        x: this.props.x + (e.clientX - this.state.mouseDown.clientX),
                        width: this.props.width - (e.clientX - this.state.mouseDown.clientX),
                        height: this.props.height + (e.clientY - this.state.mouseDown.clientY),
                    }
                })}
            />
            <div className='dot bottom x-center' style={{ cursor: 'ns-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        height: this.props.height + (e.clientY - this.state.mouseDown.clientY)
                    }
                })}
            />
            <div className='dot bottom x-right' style={{ cursor: 'nwse-resize' }} {...baseProps}
                onMouseMove={(e) => this.onMouseMove(e, () => {
                    return {
                        width: this.props.width + (e.clientX - this.state.mouseDown.clientX),
                        height: this.props.height + (e.clientY - this.state.mouseDown.clientY)
                    }
                })}
            />

            {this.props.option}

        </Content>
    }

    onMouseDown = (e) => {
        e.stopPropagation()
        this.setState({
            mouseDown: {
                clientX: e.clientX,
                clientY: e.clientY
            }
        })
    }

    onMouseMove = (e, callBack) => {
        e.stopPropagation()
        if (this.state.mouseDown === null) {
            return false
        }
        let data = Object.assign({
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
        }, callBack())
    
        if(data.width < this.cropMinWidth) {
            data.width = this.cropMinWidth
        }
        if(data.height < this.cropMinHeight) {
            data.height = this.cropMinHeight
        }
        // left
        if(data.x < 0) {
            data.x = 0
        }
        // top
        if(data.y < 0) {
            data.y = 0
        }
        // right
        if(data.x + this.props.width > this.props.contentWidth - 2) {
            data.x = this.props.contentWidth - this.props.width - 2
        }
        // bottom
        if(data.y + this.props.height > this.props.contentHeight - 2) {
            data.y = this.props.contentHeight - this.props.height - 2
        }
        this.setState({
            mouseDown: {
                clientX: e.clientX,
                clientY: e.clientY
            }
        }, () => this.props.onChange(data))
    }

    onMouseUp = (e) => {
        e.stopPropagation()
        this.state.mouseDown !== null && this.setState({
            mouseDown: null
        })
    }

}


