.PHONY: server

PORT ?= 8777

server:
	@if lsof -nP -iTCP:$(PORT) -sTCP:LISTEN >/dev/null 2>&1; then \
		echo "Port $(PORT) is already in use. Stop the existing server and try again."; \
		lsof -nP -iTCP:$(PORT) -sTCP:LISTEN || true; \
		exit 1; \
	fi
	@if ! command -v npx >/dev/null 2>&1; then \
		echo "Missing \`npx\`. Install Node.js or run a static file server manually."; \
		exit 1; \
	fi
	npx --yes http-server -p $(PORT) -c-1 .

