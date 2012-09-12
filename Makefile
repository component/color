
build: components index.js RGBA.js HSLA.js
	@component build --dev

components:
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
