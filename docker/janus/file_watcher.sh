#!/bin/bash

frame_count=0
package_count=0
start=0
last_motion=0

handle_brightness() {
    /opt/janus/bin/janus-pp-rec /home/recordings/recording-video-0.mjr.tmp /home/recordings/recording.mp4
    ffmpeg -skip_frame nokey -i /home/recordings/recording.mp4 -vsync 0 -update true /home/recordings/recording.jpg -y
    brightness=`convert /home/recordings/recording.jpg -colorspace Gray -format "%[fx:mean]" info:`
    curl -X POST -H "Content-Type: application/json" -d "{\"brightness\": $brightness}" http://192.168.178.59:3333/api/brightness
}

handle_motion() {
    echo $package_count
    package_count=$((`/opt/janus/bin/janus-pp-rec /home/recordings/recording-video-0.mjr.tmp /home/recordings/motion.mp4 -i $package_count | grep -w 'RTP' | grep -o -E '[0-9]+'` + $package_count ))
    ffmpeg -skip_frame nokey -i /home/recordings/motion.mp4 -vsync 0 -update true /home/recordings/motion.jpg -y
    curl -X POST -F file=@/home/recordings/motion.jpg -F date=$(date -Is) http://192.168.178.59:3333/api/snapshot
}


inotifywait -q -m /home/recordings/ | while read DIRECTORY EVENT FILE; do
    if [[ "$FILE" == *"mjr"* ]]
    then
        case $EVENT in
            CREATE)
                frame_count=0
                package_count=0
                start=`date +%s`
		last_motion=0
                
            ;;
            MODIFY)
#		echo $frame_count
                frame_count=$(( $frame_count + 1 ))
                
                if [ $frame_count -eq 24 ]
                then
                    handle_brightness
                fi
                
                end=`date +%s`
                runtime=$((end-start))
                if ! (( $runtime % 5 )) && [ $runtime -ne $last_motion ]
                then
		    last_motion=$runtime
		    handle_motion
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

