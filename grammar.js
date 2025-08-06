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
    $.doc,
    $.injected_python_expression
  ],

  rules: {
    source_file: $ => optional($._general_content),

    _general_content: $ => seq($._content, repeat($._content)),

    _content: $ => choice(
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
      $.page_block,
      $.general_block,
      $.def_block,
      $.call_block,
      $.python_expression),

    _ws_opt: $ => /\s*/,
    _ws_req: $ => /\s+/,

    attribute: $ => seq($.identifier, $._ws_opt, '=', $._ws_opt, $.string, $._ws_opt),
    identifier: $ => /[A-Za-z_][0-9A-Za-z_]*/,
    qualified_identifier: $ => prec.left(1000, choice($.identifier, seq($.identifier, '.', $.identifier))),
    string: $ => choice(seq('"', repeat(/[^"]/), '"'), seq("'", repeat(/[^']/), "'")),

    // See https://docs.makotemplates.org/en/latest/syntax.html#comments
    comment: $ => seq('##', repeat(/[^\n]/)),

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

    // See https://docs.makotemplates.org/en/latest/syntax.html#block
    general_block: $ => seq('<%block', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', optional($._general_content), '</%block>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#def
    def_block: $ => seq('<%def', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', optional($._general_content), '</%def>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#def
    call_block: $ => seq('<%call', optional(seq($._ws_req, repeat($.attribute))), choice('/>', seq('>', optional($._general_content), '</%call>'))),

    // See https://docs.makotemplates.org/en/latest/syntax.html#expression-substitution
    // See also https://docs.makotemplates.org/en/latest/syntax.html#expression-escaping
    python_expression: $ => choice(
      seq(
        '${', $.injected_python_expression, '}'),
      seq(
        '${',
        $.injected_python_expression,
        '|',
        choice($.identifier, $.qualified_identifier),
        repeat(seq($._ws_opt, ',', $._ws_opt, choice($.identifier, $.qualified_identifier))),
        '}'))
  }
});

