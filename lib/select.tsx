import * as React from 'react'
import styled from 'styled-components'

const Content = styled.div`
    position: absolute;
    z-index: 1;
    border: 1px solid #3da3ed;
    cursor: move;
    .line {
        border: 1px dashed #d4d4d4;
        position: absolute;
        pointer-events: none;
        &.one {
            width: 100%;
            top: 33.33333%;
            border-top: 1px;
        }
        &.two {
            width: 100%;
            bottom: 33.33333%;
            border-top: 1px;
        }
        &.three {
            height: 100%;
            left: 33.33333%;
            border-left: 1px;
        }
        &.four {
            height: 100%;
            right: 33.33333%;
            border-left: 1px;
        }
    }
    .dot {
        width: 7px;
        height: 7px;
        background-color: #1396ed;
        position: absolute;
        &.top {
            top: -4px;
        }
        &.center {
            top: calc(50% - 3px);
        }
        &.bottom {
            bottom: -4px;
        }
        &.x-left {
            left: -4px;
        }
        &.x-center {
            left: calc(50% - 3px);
        }
        &.x-right {
            right: -4px;
        }
    }
`

interface Props {
    x: number
    y: number
    width: number
    height: number
    scale?: [number, number]
    minCropWidth?: number
    minCropHeight?: number
    contentWidth: number
    contentHeight: number
    element?: JSX.Element
    onChange: (data: { x: number; y: number; width: number; height: number }) => void
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

    static defaultProps = {
        scale: [],
        minCropWidth: 50,
        minCropHeight: 50
    }

    componentDidMount() {
        document.body.addEventListener('mousemove', this.onMouseMove)
        document.body.addEventListener('mouseup', this.onMouseUp)
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousemove', this.onMouseMove)
        document.body.removeEventListener('mouseup', this.onMouseUp)
    }

    render() {
        return (
            <Content
                style={{
                    left: `${this.props.x}px`,
                    top: `${this.props.y}px`,
                    width: `${this.props.width}px`,
                    height: `${this.props.height}px`
                }}
                onMouseDown={(e) => this.onMouseDown(e, MoveDirection.Position)}
            >
                <div className='line one' />
                <div className='line two' />
                <div className='line three' />
                <div className='line four' />

                <div
                    className='dot top x-left'
                    style={{ cursor: 'nwse-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.LeftTop)}
                />
                <div
                    className='dot top x-center'
                    style={{ cursor: 'ns-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.TopCenter)}
                />
                <div
                    className='dot top x-right'
                    style={{ cursor: 'nesw-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.RightTop)}
                />
                <div
                    className='dot center x-left'
                    style={{ cursor: 'ew-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.LeftCenter)}
                />
                <div
                    className='dot center x-right'
                    style={{ cursor: 'ew-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.RightCenter)}
                />
                <div
                    className='dot bottom x-left'
                    style={{ cursor: 'nesw-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.LeftBottom)}
                />
                <div
                    className='dot bottom x-center'
                    style={{ cursor: 'ns-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.BottomCenter)}
                />
                <div
                    className='dot bottom x-right'
                    style={{ cursor: 'nwse-resize' }}
                    onMouseDown={(e) => this.onMouseDown(e, MoveDirection.RightBottom)}
                />

                {this.props.element}
            </Content>
        )
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
        const { mouseDown } = this.state
        const { scale } = this.props
        if (mouseDown === null) {
            return false
        }

        // Direction of movement
        let data = {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height
        }

        const isScale = this.props.scale.length === 2
        const all = scale[0] + scale[1]
        const [w, h] = [scale[0] / all, scale[1] / all]

        // Get move direction
        const move = {
            left: () => {
                return this.props.width + (e.clientX - mouseDown.clientX) < this.props.width
            },
            right: () => {
                return this.props.width + (e.clientX - mouseDown.clientX) > this.props.width
            },
            top: () => {
                return this.props.height + (e.clientY - mouseDown.clientY) < this.props.height
            },
            bottom: () => {
                return this.props.height + (e.clientY - mouseDown.clientY) > this.props.height
            }
        }

        switch (this.state.moveDirection) {
            case MoveDirection.Position: {
                data.x = this.props.x + (e.clientX - mouseDown.clientX)
                data.y = this.props.y + (e.clientY - mouseDown.clientY)
                break
            }
            case MoveDirection.LeftTop: {
                if (isScale) {
                    if (move.left()) {
                        data.width = this.props.width - (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.right()) {
                        data.width = this.props.width - (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.top()) {
                        data.height = this.props.height - (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    } else if (move.bottom()) {
                        data.height = this.props.height - (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    }
                    data.x = this.props.x - (data.width - this.props.width)
                    data.y = this.props.y - (data.height - this.props.height)
                } else {
                    data.x = this.props.x + (e.clientX - mouseDown.clientX)
                    data.y = this.props.y + (e.clientY - mouseDown.clientY)
                    data.width = this.props.width - (e.clientX - mouseDown.clientX)
                    data.height = this.props.height - (e.clientY - mouseDown.clientY)
                }
                break
            }
            case MoveDirection.TopCenter: {
                if (isScale) {
                    if (move.top()) {
                        data.height = this.props.height - (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    } else if (move.bottom()) {
                        data.height = this.props.height - (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    }
                    data.x = this.props.x - (data.width - this.props.width) / 2
                    data.y = this.props.y - (data.height - this.props.height)
                } else {
                    data.y = this.props.y + (e.clientY - mouseDown.clientY)
                    data.height = this.props.height - (e.clientY - mouseDown.clientY)
                }
                break
            }
            case MoveDirection.RightTop: {
                if (isScale) {
                    if (move.left()) {
                        data.width = this.props.width + (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.right()) {
                        data.width = this.props.width + (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.top()) {
                        data.height = this.props.height + (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    } else if (move.bottom()) {
                        data.height = this.props.height + (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    }
                    data.y = this.props.y - (data.height - this.props.height)
                } else {
                    data.y = this.props.y + (e.clientY - mouseDown.clientY)
                    data.width = this.props.width + (e.clientX - mouseDown.clientX)
                    data.height = this.props.height - (e.clientY - mouseDown.clientY)
                }
                break
            }
            case MoveDirection.LeftCenter: {
                if (isScale) {
                    if (move.left()) {
                        data.width = this.props.width - (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.right()) {
                        data.width = this.props.width - (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    }
                    data.x = this.props.x - (data.width - this.props.width)
                    data.y = this.props.y - (data.height - this.props.height) / 2
                } else {
                    data.x = this.props.x + (e.clientX - mouseDown.clientX)
                    data.width = this.props.width - (e.clientX - mouseDown.clientX)
                }
                break
            }
            case MoveDirection.RightCenter: {
                if (isScale) {
                    if (move.left()) {
                        data.width = this.props.width + (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.right()) {
                        data.width = this.props.width + (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    }
                    data.y = this.props.y - (data.height - this.props.height) / 2
                } else {
                    data.width = this.props.width + (e.clientX - mouseDown.clientX)
                }
                break
            }
            case MoveDirection.LeftBottom: {
                if (isScale) {
                    if (move.left()) {
                        data.width = this.props.width - (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.right()) {
                        data.width = this.props.width - (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.top()) {
                        data.height = this.props.height - (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    } else if (move.bottom()) {
                        data.height = this.props.height - (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    }
                    data.x = this.props.x - (data.width - this.props.width)
                } else {
                    data.x = this.props.x + (e.clientX - mouseDown.clientX)
                    data.width = this.props.width - (e.clientX - mouseDown.clientX)
                    data.height = this.props.height + (e.clientY - mouseDown.clientY)
                }
                break
            }
            case MoveDirection.BottomCenter: {
                if (isScale) {
                    if (move.top()) {
                        data.height = this.props.height + (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    } else if (move.bottom()) {
                        data.height = this.props.height + (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    }
                    data.x = this.props.x - (data.width - this.props.width) / 2
                } else {
                    data.height = this.props.height + (e.clientY - mouseDown.clientY)
                }
                break
            }
            case MoveDirection.RightBottom: {
                if (isScale) {
                    if (move.left()) {
                        data.width = this.props.width + (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.right()) {
                        data.width = this.props.width + (e.clientX - mouseDown.clientX)
                        data.height = (data.width / w) * h
                    } else if (move.top()) {
                        data.height = this.props.height + (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    } else if (move.bottom()) {
                        data.height = this.props.height + (e.clientY - mouseDown.clientY)
                        data.width = (data.height / h) * w
                    }
                } else {
                    data.width = this.props.width + (e.clientX - mouseDown.clientX)
                    data.height = this.props.height + (e.clientY - mouseDown.clientY)
                }
                break
            }
        }

        // Restrict moving area

        // min
        if (data.width < this.props.minCropWidth) {
            data.width = this.props.minCropWidth
        }
        if (data.height < this.props.minCropHeight) {
            data.height = this.props.minCropHeight
        }

        // max
        if (data.width > this.props.contentWidth) {
            data.width = this.props.contentWidth
        }
        if (data.height > this.props.contentHeight) {
            data.height = this.props.contentHeight
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
        this.setState(
            {
                mouseDown: {
                    clientX: e.clientX,
                    clientY: e.clientY
                }
            },
            () => this.props.onChange(data)
        )
    }

    onMouseUp = (e) => {
        e.stopPropagation()
        this.state.mouseDown !== null &&
            this.setState({
                mouseDown: null
            })
    }
}
