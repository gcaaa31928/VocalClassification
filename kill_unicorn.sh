#!/usr/bin/env bash
kill -9 $(ps aux | grep '[u]nicorn' | awk '{print $2}')
