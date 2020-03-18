
# react-crop-image

React crop image component

![preview](https://user-images.githubusercontent.com/23690145/65479785-7422c180-dec1-11e9-99e5-e29411ab9e55.png)

## Example

```bash
yarn dev
```

## Install

```bash
yarn add @wyhaya/react-crop-image
```

## Use

> Component styles use [styled-components](https://github.com/styled-components/styled-components)

```typescript
import Crop from '@wyhaya/react-crop-image'

<Crop
    // Picture url
    src={this.state.url}
    // Selected area: x y width height
    crop={this.state.crop}
    // Additional content
    element={<div>Crop</div>}
    // Default area
    onLoad={(crop, imageWidth, imageHeight) => this.setState({
        crop
    })}
    // Change area
    onChange={(crop) => this.setState({
        crop
    })}
/>
```

### Type

```typescript
type Crop = {
    x: number
    y: number
    width: number
    height: number
}
interface Props {
    src: string
    crop: Crop
    scale?: [number, number]
    width?: number
    height?: number
    minCropWidth?: number
    minCropHeight?: number
    element?: JSX.Element
    onLoad?: (crop: Crop, imageWidth: number, imageHeight: number) => void
    onChange?: (crop: Crop) => void
    className?: string
    style?: React.CSSProperties
}
```


