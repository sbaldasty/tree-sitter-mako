#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  injected_html = 0,
  injected_python_block = 1
};

static bool scan_injected_html(TSLexer *lexer) {
  bool any_chars = false;
  while (lexer->lookahead != 0) {
    if (any_chars) {
      lexer->mark_end(lexer);
    }
    if (lexer->lookahead == '<') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '%') {
        return any_chars;
      }
    } else {
      lexer->advance(lexer, false);
    }
    any_chars = true;
    lexer->result_symbol = injected_html;
  }
  lexer->advance(lexer, false);
  lexer->mark_end(lexer);
  return any_chars;
}

static bool scan_injected_python_block(TSLexer *lexer) {
  bool any_chars = false;
  while (lexer->lookahead != 0) {
    if (any_chars) {
      lexer->mark_end(lexer);
    }
    if (lexer->lookahead == '%') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '>') {
        return any_chars;
      }
    } else {
      lexer->advance(lexer, false);
    }
    any_chars = true;
    lexer->result_symbol = injected_python_block;
  }
  lexer->advance(lexer, false);
  lexer->mark_end(lexer);
  return any_chars;
}

void *tree_sitter_mako_external_scanner_create() {
  return NULL;
}

void tree_sitter_mako_external_scanner_destroy(void *payload) {
  // Nothing to destroy
}

unsigned tree_sitter_mako_external_scanner_serialize(void *payload, char *buffer) {
  return 0; // No state to serialize
}

void tree_sitter_mako_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  // No state to deserialize
}

bool tree_sitter_mako_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (valid_symbols[injected_html]) return scan_injected_html(lexer);
  if (valid_symbols[injected_python_block]) return scan_injected_python_block(lexer);
  return false;
}

