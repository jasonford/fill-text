# fill-text
Automatically scale rendered DOM text to aesthetically fit inside its parent node.

Does it's best to break lines in text so the result fits the aspect ratio of the container.

## Dependencies
`jquery` is used for it's height and width functions

## Usage

```javascript
// element   = DOM element with text inside
// alignment = "center"|"top"|"left"|"bottom"|"right"|"topleft"|"topright"|"bottomleft"|"bottomright"

fillText(element, alignment);
// Now the text in your element should be scaled and broken into lines.
```

## TODO:
remove jQuery dependency
