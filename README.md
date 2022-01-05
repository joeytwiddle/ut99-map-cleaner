## Can I open a local copy of the webpage

Not from the `file://` protocol.  That will likely produce [this error](https://stackoverflow.com/questions/52919331/access-to-script-at-from-origin-null-has-been-blocked-by-cors-policy)

But if you can serve the files using a local webserver, then it should work.

## TODO

- [ ] Align actors to grid, by looking for `Location=(X=_Y=_Z=_)` lines.
