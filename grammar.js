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

  externals: $ => [
    $.injected_html,
    $.injected_python_block
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.inherit_block,
      $.injected_html,
      $.module_block,
      $.namespace_block,
      $.python_block)),

    _ws_opt: $ => /\s*/,
    _ws_req: $ => /\s+/,

    attribute: $ => seq($.identifier, $._ws_opt, '=', $._ws_opt, $.string, $._ws_opt),
    identifier: $ => /[A-Za-z_][0-9A-Za-z_]*/,
    inherit_block: $ => seq('<%inherit', $._ws_req, repeat($.attribute), choice('/>', seq('>', '</%inherit>'))),
    module_block: $ => seq('<%!', $._ws_req, $.injected_python_block, '%>'),
    namespace_block: $ => seq('<%namespace', $._ws_req, repeat($.attribute), choice('/>', seq('>', '</%namespace>'))),
    python_block: $ => seq('<%', $._ws_req, $.injected_python_block, '%>'),
    string: $ => choice(seq('"', repeat(/[^"]/), '"'), seq("'", repeat(/[^']/), "'"))

	    /*
    text_block: $ => seq(
      '<%text', repeat($.attribute),
      choice('/>', seq('>', optional($.text), '</%text>'))),

    general_block: $ => seq(
      '<%block', repeat($.attribute),
      choice('/>', seq('>', $.html, '</%block>'))),

    mako_expression: $ => seq(
      '${',
      field('code', $.python_code),
      '}'
    ),

    tag: $ => seq(
      seq(
        optional(
          seq(
            field('namespace', $.identifier),
            ':'))),
        field('tagname', $.identifier)),

*/
  }
});

