
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
            top: -4px;
        }
        &.center{
            top: calc(50% - 3px);
        }
        &.bottom{
            bottom: -4px;
        }
        &.x-left{
            left: -4px;
        }
        &.x-center{
            left: calc(50% - 3px);
        }
        &.x-right{
            right: -4px;
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

enum MoveDirection {
    Position,
    LeftTop,
    TopCenter,
    RightTop,
    LeftCenter,
    RightCenter,
    LeftBottom,
    BottomCenter,
    RightBottom
}

export default class Entry extends React.Component<Props> {

    state = {
        mouseDown: null,
        moveDirection: null
    }

    cropMinWidth = 10
    cropMinHeight = 10

    componentDidMount() {
        document.body.addEventListener('mousemove', this.onMouseMove)
        document.body.addEventListener('mouseup', this.onMouseUp)
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousemove', this.onMouseMove)
        document.body.removeEventListener('mouseup', this.onMouseUp)
    }

    render() {

        return <Content
            style={{
                left: `${this.props.x}px`,
                top: `${this.props.y}px`,
                width: `${this.props.width}px`,
                height: `${this.props.height}px`,
            }}
            onMouseDown={(e) => this.onMouseDown(e, MoveDirection.Position)}
        >

            <div className='line one' />
            <div className='line two' />
            <div className='line three' />
            <div className='line four' />

            <div className='dot top x-left' style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.LeftTop)} />
            <div className='dot top x-center' style={{ cursor: 'ns-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.TopCenter)} />
            <div className='dot top x-right' style={{ cursor: 'nesw-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.RightTop)} />
            <div className='dot center x-left' style={{ cursor: 'ew-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.LeftCenter)} />
            <div className='dot center x-right' style={{ cursor: 'ew-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.RightCenter)} />
            <div className='dot bottom x-left' style={{ cursor: 'nesw-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.LeftBottom)} />
            <div className='dot bottom x-center' style={{ cursor: 'ns-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.BottomCenter)} />
            <div className='dot bottom x-right' style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => this.onMouseDown(e, MoveDirection.RightBottom)} />

            {this.props.option}

        </Content>
    }

    onMouseDown = (e, direction: MoveDirection) => {
        e.stopPropagation()
        this.setState({
            mouseDown: {
                clientX: e.clientX,
                clientY: e.clientY
            },
            moveDirection: direction
        })
    }

    onMouseMove = (e) => {
        e.stopPropagation()
        if (this.state.mouseDown === null) {
            return false
        }

        // Direction of movement
        let data = {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
        }

        switch (this.state.moveDirection) {
            case MoveDirection.Position: {
                data.x = this.props.x + (e.clientX - this.state.mouseDown.clientX)
                data.y = this.props.y + (e.clientY - this.state.mouseDown.clientY)
                break
            }
            case MoveDirection.LeftTop: {
                data.x = this.props.x + (e.clientX - this.state.mouseDown.clientX)
                data.y = this.props.y + (e.clientY - this.state.mouseDown.clientY)
                data.width = this.props.width - (e.clientX - this.state.mouseDown.clientX)
                data.height = this.props.height - (e.clientY - this.state.mouseDown.clientY)
                break
            }
            case MoveDirection.TopCenter: {
                data.y = this.props.y + (e.clientY - this.state.mouseDown.clientY)
                data.height = this.props.height - (e.clientY - this.state.mouseDown.clientY)
                break
            }
            case MoveDirection.RightTop: {
                data.y = this.props.y + (e.clientY - this.state.mouseDown.clientY)
                data.width = this.props.width + (e.clientX - this.state.mouseDown.clientX)
                data.height = this.props.height - (e.clientY - this.state.mouseDown.clientY)
                break
            }
            case MoveDirection.LeftCenter: {
                data.x = this.props.x + (e.clientX - this.state.mouseDown.clientX)
                data.width = this.props.width - (e.clientX - this.state.mouseDown.clientX)
                break
            }
            case MoveDirection.RightCenter: {
                data.width = this.props.width + (e.clientX - this.state.mouseDown.clientX)
                break
            }
            case MoveDirection.LeftBottom: {
                data.x = this.props.x + (e.clientX - this.state.mouseDown.clientX)
                data.width = this.props.width - (e.clientX - this.state.mouseDown.clientX)
                data.height = this.props.height + (e.clientY - this.state.mouseDown.clientY)
                break
            }
            case MoveDirection.BottomCenter: {
                data.height = this.props.height + (e.clientY - this.state.mouseDown.clientY)
                break
            }
            case MoveDirection.RightBottom: {
                data.width = this.props.width + (e.clientX - this.state.mouseDown.clientX)
                data.height = this.props.height + (e.clientY - this.state.mouseDown.clientY)
            }
        }

        // Restrict moving area

        if (data.width < this.cropMinWidth) {
            data.width = this.cropMinWidth
        }
        if (data.height < this.cropMinHeight) {
            data.height = this.cropMinHeight
        }
        // left
        if (data.x < 0) {
            data.x = 0
        }
        // top
        if (data.y < 0) {
            data.y = 0
        }
        // right
        if (data.x + this.props.width > this.props.contentWidth) {
            data.x = this.props.contentWidth - this.props.width
        }
        // bottom
        if (data.y + this.props.height > this.props.contentHeight) {
            data.y = this.props.contentHeight - this.props.height
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


