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
      $.mako_block,
      $.mako_expression,
      $.mako_declaration,
      $.mako_comment,
      $.text,
    )),

    text: _ => token(prec(-1, /.+/)),

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

    mako_block: $ => seq(
      '<%block',
      repeat($.mako_attribute),
      '>',
      repeat(choice(
        $.text,
        $.mako_comment
      )),
      '</%block>'
    ),

    mako_comment: _ => /##[^\n]*/,

    mako_attribute: $ => seq(
      field('name', $.attribute_name),
      '=',
      field('value', $.quoted_attribute_value)
    ),
    
    attribute_name: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    
    quoted_attribute_value: $ => choice(
      seq('"', optional($.double_quoted_content), '"'),
      seq("'", optional($.single_quoted_content), "'")
    ),
    
    double_quoted_content: $ => /[^"]*/,
    single_quoted_content: $ => /[^']*/,
  }
});

