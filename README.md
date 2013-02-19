# mesh

[![Demo](http://i.phuu.net/N1Bt/Screen%20Shot%202013-02-19%20at%2017.51.24.png)](http://phuu.github.com/mesh)

Originally a 90 minute project with the theme "understand fast", **mesh** allows you to quickly and easily link data within a page.

The idea is to be to allow you to quickly understand how different values in target affect it's outcome, demonstrate a mathematical function or give your users a deeper understanding of their data.

Click (or touch) and drag on a 'source' linked to a 'target' to see how things change, and build your own using simple HTML with data attributes.

## Example usage:

**mesh** requires [jQuery](http://cdnjs.com/#jquery), and if you're planning to support older browsers, the [es5-shim](https://github.com/kriskowal/es5-shim).

```html
I have <span data-mesh-source="bananas">6</span> bananas to split between
me and <span data-mesh-source="others">2</span> others. Each of us gets
<span data-mesh-target="@bananas / (@others + 1)">2</span> bananas.

<script src="jquery.js"></script>
<script src="mesh.js"></script>
<script>
  $.mesh({
    // Configuration oject (see below)
  });
</script>
```

See the [demo](http://phuu.github.com/mesh)




## Main Attributes

There are a number of attributes available to you with mesh. The prefix (`data-mesh-`) is configurable, see below.


### `data-mesh-source`

Specify a source (could also be called a variable) that can be modified by the user and used in targets. The value of the attribute is the name of the source, and can be referred to in targets using an `@` sign followed by the name.

Sources are incremented by integer values, which is configurable, and the initial text content of the element is used as the initial value.

You can configure a source with the Source Modifier attributes detailed below.

#### Example Usage

```html
I have <span data-mesh-source="bananas">6</span> bananas to split between
me and <span data-mesh-source="others">2</span> others.
```


### `data-mesh-target`

Combine sources, using the `@sourcename` syntax.

This is essentially a Javascript expression and therefore it's possible to use methods found in the `Math` object.

The value of the attribute is the expression to be used to calculate a value to be output.

The result expression is output straight on the page, including all available decimal places. To limit this, use on the of the Target Modifiers below.

#### Example Usage

```html
Each of us gets <span data-mesh-target="@bananas / (@others + 1)">2</span> bananas.
```




## Source Modifier attributes

### `data-mesh-positive`

Do not allow the value of the source to go below 0.

#### Example Usage

```html
I have <span data-mesh-source="apples" data-mesh-positive>12</span> apples.
```


### `data-mesh-min`

Do not allow the value of the source to go below the specified value.

#### Example Usage

```html
Including me, there are <span data-mesh-source="visitors" data-mesh-min="1">5</span> visitors.
```


### `data-mesh-max`

Do not allow the value of the source to go above the specified value.

#### Example Usage

```html
Tax is currently at <span data-mesh-source="tax" data-mesh-max="100" data-mesh-positive>20</span>%.
```


### `data-mesh-decimal`

Allow the source value to be incremented in decimal values (0.1).

I suggest you configure mesh to use a slower `dragSpeed` (about 0.1) if you're using this attribute a lot.

#### Example Usage

```html
Inflation is currently at  <span data-mesh-source="inflation" data-mesh-decimal>0.1</span>%.
```





## Target Modifier attributes

### `data-mesh-floor`

`floor', or round down to the nearest integer, the value output from the expression in the `data-mesh-target` attribute.

#### Example Usage

```html
Each of us gets <span data-mesh-target="@bananas / (@others + 1)" data-mesh-floor>2</span> bananas.
```


### `data-mesh-decimal`

Round the output value to a (optionally specified) number of decimal places, defaulting to 2.

### Example Usage

```html
The cube root of <span data-mesh-source="y">27</span> is <span data-mesh-target="Math.pow(@y, 1/3)" data-mesh-decimal="4">y ^ 1/3</span>.
```


### `data-mesh-currency`

Format the output as a currency, with 2 decimal places.

### Example Usage

```html
Our bill is £<span data-mesh-source="bill" data-mesh-positive>80</span> split between <span data-mesh-source="patrons" data-mesh-positive data-mesh-max="15">4</span> of us. Each of us pays £<span data-mesh-target="@bill / @patrons" data-mesh-currency>x</span>.
```




## Configuration options:

### `dragSpeed`

- Type: Number
- Default: 10
- Range: 1 - 15 (suggested, but have a play)
- How fast a source will change as it is dragged. Higher is faster.

### `saveDelay`

- Type Number
- Default: 300 (ms)
- How long mesh will wait for further changes before saving a source's
value to localStorage.

### `updateDelay`

- Type: Number
- Default: 50 (ms)
- How long mesh will wait for further changes to a source before updating the targets.

### `decimalPlaces`

- Type: Number
- Default: 2
- The default number of decimal places mesh will use if a `decimal` attribute is found on a source or target.

### `save`

- Type: Boolean
- Default: true (if localStorage is available)
- Enable saving of source values between page refreshes.

### `prefix`

- Type: String
- Default: 'data-mesh-'
- Change the prefix mesh looks for on its attributes. Should have a trailing hyphen.

### `touch`

- Type: Boolean
- Default: depends on the device (if `ontouchstart` is found in the `window`)
- Force mesh to use listen for touch events. You can probably ignore this.




## Good to know

- Multiple sources on the same page *will* conflict.
- You cannot currently make an element both a source and a target. This is planned, but introduces a whole heap of complexity.
- You can double click on a source to reset it.

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE