STATIC=/usr/share
VAR=/var
PROJECT=freeports-trading-platform/backend

all: build

node_modules: build

build:
	npx yarn install
	npx yarn run build 

install: node_modules
	## Copy static files
	mkdir -p $(DESTDIR)$(STATIC)/$(PROJECT)/
	cp -R dist/* node_modules $(DESTDIR)$(STATIC)/$(PROJECT)/
	## Copy config template
	mkdir -p $(DESTDIR)/etc/$(PROJECT)
	cp .env $(DESTDIR)/etc/$(PROJECT).conf
	## Copy nginx sample
	cp debian/nginx-proxy debian/nginx-common $(DESTDIR)/etc/$(PROJECT)

clean:
	rm -rf dist/ node_modules/
