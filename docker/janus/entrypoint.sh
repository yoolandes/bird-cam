#!/bin/bash

./janus &

/home/./file_watcher.sh &

wait -n

exit $?