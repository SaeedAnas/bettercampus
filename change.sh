#!/bin/bash

if [ -f manifest.json ]; then
	rm manifest.json
fi

if [ $# -eq 0 ]; then
	echo "No arguments supplied, using default manifest.json"
	cp chrome_manifest.json manifest.json
else
	if [ $1 = "firefox" ]; then
		cp firefox_manifest.json manifest.json
	elif [ $1 = "chrome" ]; then
		cp chrome_manifest.json manifest.json
	fi
fi
