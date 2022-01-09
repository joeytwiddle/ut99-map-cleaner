## Usage

You can use the web-page.  Simply copy and paste your t3d file.

Or you can use the Node.js command-line tool, like this:

```bash
./ut99-map-cleaner input.t3d output.t3d

# See what changed
diff input.t3d output.t3d
```

## TODO

- [ ] Differentiate actors from brushes, maybe even types of actors, and allow different snapping to be applied.

- [x] We could offer snapping for textures, but I'm not sure that would really have any value.
