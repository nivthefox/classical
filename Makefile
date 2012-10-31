SHELL			= /bin/bash
YUICOMPRESS		= /usr/bin/yuicompressor
FILES 			= index.js src/Class.js src/Interface.js
GETVERSION	 	:= grep 'version' package.json | awk '{print substr($$3, 2, length($$3)-3)}'

clean:
	if [[ -e index.min.js ]] ; then \
		rm index.min.js ; \
	fi

minify: clean
	for i in $(FILES) ; do \
		$(YUICOMPRESS) --type js $$i >> index.min.js ; \
		echo "" ; \
	done

validate:
	node .bin/validate.js

package: validate minify
	npm publish
	bower register classical git://github.com/Writh/classical

.PHONY: clean minify package validate
