#!/bin/bash

file_move() {
    if [ $1 = "brightness-video-0.mjr" ]
    then
        /opt/janus/bin/janus-pp-rec /home/recordings/brightness-video-0.mjr /home/recordings/brightness.mp4
        ffmpeg -skip_frame nokey -i /home/recordings/brightness.mp4 -vsync 0 -update true /home/recordings/brightness.png -y
        brightness=`convert /home/recordings/brightness.png -colorspace Gray -format "%[fx:mean]" info:`
        curl -X POST -H "Content-Type: application/json" -d "{\"brightness\": $brightness}" http://192.168.178.59:3333/api/brightness
    fi
}


inotifywait -q -m -r -e move /home/recordings/ | while read DIRECTORY EVENT FILE; do
    case $EVENT in
        MOVE*)
            file_move "$FILE"
        ;;
    esac
done
