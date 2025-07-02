(mako_declaration
  "<%!" @punctuation.bracket
  (python_code) @injection.content
  "%>" @punctuation.bracket)

(attribute
  name: (identifier) @attribute
  "=" @operator)

(string) @string

["<%block"] @punctuation.bracket
["</%block>"] @punctuation.bracket
