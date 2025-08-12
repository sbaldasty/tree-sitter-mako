((injected_html) @injection.content
 (#set! injection.language "html")
 (#set! injection.combined))

((injected_python_expression) @injection.content
  (#set! injection.language "python"))

((injected_python_line) @injection.content
  (#set! injection.language "python"))


((injected_python_block) @injection.content
  (#set! injection.language "python"))
