(mako_declaration
  "<%!" @punctuation.bracket
  (python_code) @injection.content
  "%>" @punctuation.bracket)

(mako_attribute name: (attribute_name) @attribute)
(mako_attribute "=" @operator)
(quoted_attribute_value) @string

["<%block"] @punctuation.bracket
["</%block>"] @punctuation.bracket
