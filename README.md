# [ut99-map-cleaner](https://github.com/joeytwiddle/ut99-map-cleaner)

## What it does

It looks for brush vertices and actor locations which are almost on the grid but not quite, and it snaps them onto the grid.

(In other words, it converts numbers like `4.999992` to `5.000000`)

It takes a t3d file as input, and produces a t3d file as output.

## Usage

You can use the [web version here](./ut99-map-cleaner.html).  Simply copy and paste your t3d file.

Or you can use the Node.js command-line tool, like this:

```bash
./ut99-map-cleaner input.t3d output.t3d

# See what changed
diff input.t3d output.t3d
```

## TODO

- [ ] Differentiate actors from brushes, maybe even types of actors, and allow different snapping to be applied.

- [x] We could offer snapping for textures, but I'm not sure that would really have any value.

