#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  injected_html = 0,
  injected_python_block = 1,
  text = 2,
  doc = 3
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
      } else if (lexer->lookahead == '/') {
        lexer->advance(lexer, false);
	if (lexer->lookahead == '%') {
          return any_chars;
	}
      }
    } else if (lexer->lookahead == '#') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '#') {
        return any_chars;
      }
    } else if (lexer->lookahead == '\\') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '\n') {
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
  bool in_comment = false;
  bool in_apostro_str = false;
  bool in_quote_str = false;
  bool in_apostro_ml_str = false;
  bool in_quote_ml_str = false;
  bool escaping = false;
  int quotes = 0;
  int apostros = 0;
  while (lexer->lookahead != 0) {
    if (any_chars) {
      lexer->mark_end(lexer);
    }
    if (in_comment) {
      in_comment = lexer->lookahead != '\n';
      lexer->advance(lexer, false);
    } else if (in_apostro_str) {
      if (apostros > 0 && lexer->lookahead == '\'' && !escaping) {
        apostros++;
      } else {
        apostros = 0;
      }
      in_apostro_str = lexer->lookahead != '\n' && !(lexer->lookahead == '\'' && !escaping);
      escaping = !escaping && lexer->lookahead == '\\';
      lexer->advance(lexer, false);
    } else if (in_quote_str) {
      if (quotes > 0 && lexer->lookahead == '"' && !escaping) {
        quotes++;
      } else {
        quotes = 0;
      }
      in_quote_str = lexer->lookahead != '\n' && !(lexer->lookahead == '"' && !escaping);
      escaping = !escaping && lexer->lookahead == '\\';
      lexer->advance(lexer, false);
    } else if (in_apostro_ml_str) {
      if (lexer->lookahead == '\'') {
        apostros++;
      } else {
        apostros = 0;
      }
      if (apostros == 3) {
        apostros = 0;
	in_apostro_ml_str = false;
      }
      lexer->advance(lexer, false);
    } else if (in_quote_ml_str) {
      if (lexer->lookahead == '"') {
        quotes++;
      } else {
        quotes = 0;
      }
      if (quotes == 3) {
        quotes = 0;
	in_quote_ml_str = false;
      }
      lexer->advance(lexer, false);
    } else if (lexer->lookahead == '#') {
      lexer->advance(lexer, false);
      in_comment = true;
    } else if (lexer->lookahead == '\'') {
      lexer->advance(lexer, false);
      if (apostros == 2) {
        in_apostro_ml_str = true;
	apostros = 0;
      } else {
        apostros++;
        in_apostro_str = true;
      }
    } else if (lexer->lookahead == '"') {
      lexer->advance(lexer, false);
      if (quotes == 2) {
        in_quote_ml_str = true;
	quotes = 0;
      } else {
        in_quote_str = true;
        quotes++;
      }
    } else if (lexer->lookahead == '%') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '>') {
        return any_chars;
      }
    } else {
      apostros = 0;
      quotes = 0;
      lexer->advance(lexer, false);
    }
    any_chars = true;
    lexer->result_symbol = injected_python_block;
  }
  lexer->advance(lexer, false);
  lexer->mark_end(lexer);
  return any_chars;
}

static bool scan_text(TSLexer *lexer) {
  bool any_chars = false;
  while (lexer->lookahead != 0) {
    if (any_chars) {
      lexer->mark_end(lexer);
    }
    if (lexer->lookahead == '<') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '/') {
        lexer->advance(lexer, false);
	if (lexer->lookahead == '%') {
          lexer->advance(lexer, false);
          if (lexer->lookahead == 't') {
            lexer->advance(lexer, false);
            if (lexer->lookahead == 'e') {
              lexer->advance(lexer, false);
              if (lexer->lookahead == 'x') {
                lexer->advance(lexer, false);
                if (lexer->lookahead == 't') {
                  lexer->advance(lexer, false);
                  if (lexer->lookahead == '>') {
                    return any_chars;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      lexer->advance(lexer, false);
    }
    any_chars = true;
    lexer->result_symbol = text;
  }
  lexer->advance(lexer, false);
  lexer->mark_end(lexer);
  return any_chars;
}

static bool scan_doc(TSLexer *lexer) {
  bool any_chars = false;
  while (lexer->lookahead != 0) {
    if (any_chars) {
      lexer->mark_end(lexer);
    }
    if (lexer->lookahead == '<') {
      lexer->advance(lexer, false);
      if (lexer->lookahead == '/') {
        lexer->advance(lexer, false);
	if (lexer->lookahead == '%') {
          lexer->advance(lexer, false);
          if (lexer->lookahead == 'd') {
            lexer->advance(lexer, false);
            if (lexer->lookahead == 'o') {
              lexer->advance(lexer, false);
              if (lexer->lookahead == 'c') {
                lexer->advance(lexer, false);
                if (lexer->lookahead == '>') {
                  return any_chars;
                }
              }
            }
          }
        }
      }
    } else {
      lexer->advance(lexer, false);
    }
    any_chars = true;
    lexer->result_symbol = doc;
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
  if (valid_symbols[text]) return scan_text(lexer);
  if (valid_symbols[doc]) return scan_doc(lexer);
  return false;
}

