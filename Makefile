SHELL			= /bin/bash
YUICOMPRESS		= /usr/bin/yuicompressor
FILES 			= index.js src/Class.js src/Interface.js
GETVERSION	 	:= grep 'version' package.json | awk '{print substr($$3, 2, length($$3)-3)}'
SRC				= src
TESTS			= test
INTERFACE		= qunit
REPORTER		= spec
TIMEOUT			= 5000
ENV				= test
JSDOC			= /usr/lib/node_modules/jsdoc/jsdoc
MOCHA			= ./node_modules/.bin/mocha

clean:
	rm -f index.min.js

install: clean node_modules


minify: clean
	for i in $(FILES) ; do \
		$(YUICOMPRESS) --type js $$i >> index.min.js ; \
		echo "" >> index.min.js ; \
	done

node_modules:
	@NODE_ENV="$(ENV)" npm install

package: validate
	npm publish
	bower register classical git://github.com/Writh/classical

realclean: clean
	rm -rf node_modules

test:
	@NODE_ENV=$(ENV) NOLOG=1 $(MOCHA) \
		--ui $(INTERFACE) \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

test-watch:
	@NODE_ENV=$(ENV) NOLOG=1 $(MOCHA) \
		--ui $(INTERFACE) \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--watch \
		$(TESTS)

validate:
	node .bin/validate.js

.PHONY: clean minify package test test-watch validate 