#!/bin/bash
#
pkill next-server
nohup pnpm start > ./logs/boot.log 2>&1 &
