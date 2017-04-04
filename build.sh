#!/usr/bin/env bash
npm run build
rm -r static/*
python manage.py collectstatic --noinput
