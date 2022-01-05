## Usage

You can use the web-page.  Simply copy and paste your t3d file.

Or you can use the Node.js command-line tool, like this:

```
./ut99-map-cleaner input.t3d output.t3d

# See what changed
diff input.t3d output.t3d
```

### Can I open a local copy of the webpage

Not from the `file://` protocol.  That will likely produce [this error](https://stackoverflow.com/questions/52919331/access-to-script-at-from-origin-null-has-been-blocked-by-cors-policy)

But if you can serve the files using a local webserver, then it should work.

## TODO

- [ ] ...
