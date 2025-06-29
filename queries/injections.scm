((text) @injection.content
 (#set! injection.language "html")
 (#set! injection.combined))

(mako_declaration
  "<%!" @injection.start
  "%>" @injection.end
  (#set! injection.language "python")
  (#set! injection.include-children))
