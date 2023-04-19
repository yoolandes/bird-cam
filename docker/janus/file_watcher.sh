#!/bin/bash

frame_count=0

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


inotifywait -q -m /home/recordings/ | while read DIRECTORY EVENT FILE; do
  if [[ "$FILE" == *"mjr"* ]]
  then
     case $EVENT in
        CREATE)
	    frame_count=0
        ;;
        MODIFY)
	    frame_count=$(( $frame_count + 1 ))
            if [ $frame_count -eq 24 ]
            then
	        handle_brightness
            fi
        ;;
        CLOSE)
            if [ $frame_count -lt 24 ]
            then
	        handle_brightness
            fi
        ;;
    esac
  fi
done

