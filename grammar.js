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
    $.injected_python_block,
    $.text,
    $.doc
  ],

  rules: {
    source_file: $ => repeat(choice(
      $.comment,
      $.include_block,
      $.inherit_block,
      $.injected_html,
      $.module_block,
      $.newline_filter,
      $.namespace_block,
      $.python_block,
      $.text_block,
      $.doc_block,
      $.page_block)),

    _ws_opt: $ => /\s*/,
    _ws_req: $ => /\s+/,

    attribute: $ => seq($.identifier, $._ws_opt, '=', $._ws_opt, $.string, $._ws_opt),

    // See https://docs.makotemplates.org/en/latest/syntax.html#comments
    comment: $ => seq('##', repeat(/[^\n]/)),

    identifier: $ => /[A-Za-z_][0-9A-Za-z_]*/,

    // See https://docs.makotemplates.org/en/latest/syntax.html#include
    include_block: $ => seq('<%include', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', '</%include>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#inherit
    inherit_block: $ => seq('<%inherit', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', '</%inherit>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#module-level-blocks
    module_block: $ => seq('<%!', $._ws_req, $.injected_python_block, '%>'),

    // See https://docs.makotemplates.org/en/latest/syntax.html#newline-filters
    newline_filter: $ => seq('\\', '\n'),

    // See https://docs.makotemplates.org/en/latest/syntax.html#namespace
    namespace_block: $ => seq('<%namespace', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', '</%namespace>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#python-blocks
    python_block: $ => seq('<%', $._ws_req, $.injected_python_block, '%>'),

    // See https://docs.makotemplates.org/en/latest/syntax.html#text
    text_block: $ => seq('<%text', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', optional($.text), '</%text>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#comments
    doc_block: $ => seq('<%doc', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', optional($.doc), '</%doc>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#page
    page_block: $ => seq('<%page', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', $._ws_opt, '</%page>'))),

    string: $ => choice(seq('"', repeat(/[^"]/), '"'), seq("'", repeat(/[^']/), "'"))
  }
});

