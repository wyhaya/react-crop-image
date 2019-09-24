
# react-crop-image

React crop image component

![2](https://user-images.githubusercontent.com/23690145/65479785-7422c180-dec1-11e9-99e5-e29411ab9e55.png)

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
    option={<div>Hello</div>}
    // Default area
    onInit={(crop) => this.setState({
        crop
    })}
    // Change area
    onChange={(crop) => this.setState({
        crop
    })}
/>
```


