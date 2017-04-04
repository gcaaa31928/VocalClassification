#!/usr/bin/env bash
npm run build
python manage.py collectstatic --noinput
