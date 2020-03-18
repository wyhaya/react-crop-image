import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'
import Crop from '../lib/index'

const Content = styled.div`
    .option {
        position: absolute;
        top: calc(100% + 12px);
        left: 0;
        right: 0;
        border: 1px solid red;
    }
`

class Entry extends React.Component {
    state = {
        url: require('./image.png'),
        imageWidth: 0,
        imageHeight: 0,
        scale: [3, 2],
        minCropWidth: 60,
        minCropHeight: 60,
        crop: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    }

    appendImage(blob) {
        let url = URL.createObjectURL(blob)
        let img = document.createElement('img')
        img.src = url
        document.body.append(img)
    }

    onCrop = () => {
        const img = new Image()
        img.src = this.state.url

        img.onload = () => {
            const x = (this.state.crop.x / this.state.imageWidth) * img.width
            const y = (this.state.crop.y / this.state.imageHeight) * img.height
            const width = (this.state.crop.width / this.state.imageWidth) * img.width
            const height = (this.state.crop.height / this.state.imageHeight) * img.height

            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, x, y, width, height, 0, 0, width, height)

            // base64
            const dataURL = canvas.toDataURL('image/png')
            // blob
            const blob = this.dataURLtoBlob(dataURL)

            this.appendImage(blob)
        }
    }

    render() {
        return (
            <Content>
                <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                        this.setState({
                            url: URL.createObjectURL(e.target.files[0])
                        })
                    }}
                />
                {this.state.url && (
                    <Crop
                        // width={200}
                        // height={308}
                        src={this.state.url}
                        crop={this.state.crop}
                        scale={this.state.scale as [number, number]}
                        minCropWidth={this.state.minCropWidth}
                        minCropHeight={this.state.minCropHeight}
                        className='crop'
                        element={
                            <div className='option' onClick={this.onCrop}>
                                Crop
                            </div>
                        }
                        onLoad={(crop, imageWidth, imageHeight) => {
                            console.log(imageWidth, imageHeight)
                            this.setState({
                                crop,
                                imageWidth,
                                imageHeight
                            })
                        }}
                        onChange={(crop) => {
                            this.setState({
                                crop
                            })
                        }}
                    />
                )}
            </Content>
        )
    }
}

ReactDOM.render(<Entry />, document.getElementById('root'))
