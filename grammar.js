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

  externals: $ => [
    $.python_code,
  ],

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

    mako_comment: _ => /##[^\n]*/
  }
});

