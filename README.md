# mesh

Originally a 90 minute project with the theme "understand fast", **mesh** allows you to quickly and easily link data within a page.

The idea is to be to allow you to quickly understand how different values in formula affect it's outcome, demonstrate a mathematical function or give your users a deeper understanding of their data.

Click (or touch) and drag on a 'source' linked to a 'formula' to see how things change, and build your own using simple HTML with data attributes.

## Example usage:

**mesh** requires jQuery, and if you're planning to support older browsers, the **es5-shim**.

```html
I have <span data-mesh-source="bananas">6</span> bananas to split between
me and <span data-mesh-source="others">2</span> others. Each of us gets
<span data-mesh-formula="@bananas / (@others + 1)">2</span> bananas.

<script src="jquery.js"></script>
<script src="mesh.js"></script>
<script>
  $.mesh({
    // Configuration oject (see below)
  });
</script>
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
- How long mesh will wait for further changes to a source before updating the formulas.

### `decimalPlaces`

- Type: Number
- Default: 2
- The default number of decimal places mesh will use if a `decimal` attribute is found on a source or formula.

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

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE