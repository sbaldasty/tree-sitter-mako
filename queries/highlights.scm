; Mako template syntax highlighting for TreeSitter

; Comments
(comment) @comment.line

; Identifiers and attributes
(identifier) @variable
(qualified_identifier) @variable.other.member

; Strings
(string) @string

; Block tags and delimiters
["<%" "%>" "<%" "/>" "</%"] @keyword.directive

; Block keywords
["<%include" "<%inherit" "<%namespace" "<%text" "<%doc" "<%page" 
 "<%block" "<%def" "<%call" "<%!"] @keyword.directive

; Closing tags
["</%include>" "</%inherit>" "</%namespace>" "</%text>" "</%doc>" 
 "</%page>" "</%block>" "</%def>" "</%call>"] @keyword.directive

[">"] @keyword.directive

; Python control structures
["endif" "endfor"] @keyword.control

; Expression delimiters
["${" "}"] @punctuation.bracket

; User-defined tags
(user_tag
  (identifier) @namespace
  ":" @punctuation.separator
  (identifier) @tag)

; User block closing tags
(user_block
  "</%"
  (user_tag
    (identifier) @namespace
    ":" @punctuation.separator
    (identifier) @tag)
  ">" @keyword.directive)

; Python line prefix is handled as part of python_line

; Attribute assignments
(attribute
  (identifier) @variable.parameter
  "=" @operator)

; Newline filters
(newline_filter) @keyword.directive

; Escaped line percent
(escaped_line_percent) @constant.character.escape

; Expression filters
(python_expression_filter
  (qualified_identifier) @function)

; Punctuation
["=" "," "|" "." ":"] @punctuation.separator

; Injected content highlighting
(injected_html) @markup.raw
(injected_python_block) @source.python
(injected_python_expression) @source.python
(injected_python_line) @source.python
(text) @markup.raw
(doc) @comment.block

