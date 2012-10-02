SRC                 = src/
INTERFACE           = qunit
REPORTER            = spec

test:
    @NODE_ENV=test ./node_modules/.bin/mocha \
        --ui $(INTERFACE) \
        --reporter json \
        test

test-spec:
    @NODE_ENV=test ./node_modules/.bin/mocha \
        --ui $(INTERFACE) \
        --reporter $(REPORTER) \
        test

test-watch:
    @NODE_ENV=test ./node_modules/.bin/mocha \
        --watch \
        --ui $(INTERFACE)
        --reporter $(REPORTER) \
        test

coverage:
    mkdir -p ./coverage/noop
    rm -r ./coverage/*
    cp -r fixtures ./coverage/fixtures
    cp -r test ./coverage/test
    jscoverage src ./coverage/src
    @NODE_ENV=test CLASSICAL_COV=1 ./node_modules/.bin/mocha \
        --ui $(INTERFACE) \
        --reporter html-cov \
        ./coverage/test > coverage.html

.PHONY: coverage test test-spec test-watch