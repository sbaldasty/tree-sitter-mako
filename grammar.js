/**
 * @file Mako grammar for tree-sitter
 * @author Steven Baldasty <sbaldasty@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
//

module.exports = grammar({
  name: 'mako',

  extras: $ => [/\s/],

  rules: {
    source_file: $ => repeat(choice(
      $.mako_expression,
      $.mako_declaration,
      $.mako_comment,
      $.text,
    )),

    text: _ => /.+/,

    mako_expression: $ => seq(
      '${',
      field('code', $.python_code),
      '}'
    ),

    mako_declaration: $ => seq(
      '<%!',
      $.python_code,
      '%>'
    ),

    mako_comment: _ => /##[^\n]*/,
python_code: _ => token(prec(-1, /([^%]|%[^>])*/))
	  //python_code: _ => token(choice(/[^%]+/))
    //python_code: _ => /\n[^\n]*/ // /[^%{}<>]+/,  // placeholder - "raw with opaque contents
  }
});

