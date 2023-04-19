#!/bin/bash

frameCount = 0

handle_brightness() {
    /opt/janus/bin/janus-pp-rec /home/recordings/recording-video-0.mjr.tmp /home/recordings/recording.mp4
    ffmpeg -skip_frame nokey -i /home/recordings/recording.mp4 -vsync 0 -update true /home/recordings/recording.png -y
    brightness=`convert /home/recordings/recording.png -colorspace Gray -format "%[fx:mean]" info:`
    curl -X POST -H "Content-Type: application/json" -d "{\"brightness\": $brightness}" http://192.168.178.59:3333/api/brightness
}

# handle_motion() {
#     /opt/janus/bin/janus-pp-rec /home/recordings/motion-video-0.mjr /home/recordings/motion.mp4
#     ffmpeg -skip_frame nokey -i /home/recordings/motion.mp4 -vsync 0 -update true /home/recordings/motion.jpg -y
#     #curl -X POST -H "Content-Type: application/json" -d "{\"brightness\": $brightness}" http://192.168.178.59:3333/api/brightness
# }


inotifywait -q -m -r -e move /home/recordings/ | while read DIRECTORY EVENT FILE; do
    case $EVENT in
        
        CREATE)
            $frameCount = 0
        ;;
        
        MODIFY)
            $frameCount++
            if [ $frameCount = 24 ]
            then
                handle_brightness
            fi
        ;;
        
        CLOSE)
            if [ $frameCount <= 24 ]
            then
                handle_brightness
            fi
        ;;
    esac
done
