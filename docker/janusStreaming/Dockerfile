FROM balenalib/raspberrypi4-64
RUN apt-get update && apt-get upgrade -y
RUN apt-get install libmicrohttpd-dev
RUN apt-get install libjansson-dev
RUN apt-get install libssl-dev
RUN apt-get install libsrtp2-dev
RUN apt-get install libglib2.0-dev
RUN apt-get install libconfig-dev
RUN apt-get install pkg-config
RUN apt-get install libtool
RUN apt-get install automake
RUN apt-get install git
RUN apt-get install python3-pip
RUN apt-get install libcurl4-openssl-dev
RUN apt-get install libavutil-dev
RUN apt-get install libavcodec-dev
RUN apt-get install libavformat-dev
RUN apt-get install libogg-dev
RUN pip3 install meson
RUN apt-get install ninja-build
RUN git clone https://gitlab.freedesktop.org/libnice/libnice
WORKDIR /libnice
RUN meson --prefix=/usr build && ninja -C build && sudo ninja -C build install
WORKDIR /
RUN apt-get install make
RUN apt-get install cmake
RUN git clone https://libwebsockets.org/repo/libwebsockets
WORKDIR /libwebsockets
RUN git checkout v3.2-stable
RUN mkdir build
WORKDIR /libwebsockets/build
RUN cmake -DLWS_MAX_SMP=1 -DLWS_WITHOUT_EXTENSIONS=0 -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" ..
RUN make && sudo make install
WORKDIR /
RUN git clone https://github.com/meetecho/janus-gateway.git
WORKDIR /janus-gateway
RUN git checkout c684d43dd02e48e3fa7e072a39471507fe927e77
RUN sh autogen.sh
RUN ./configure --prefix=/opt/janus --enable-post-processing
RUN make
RUN make install
RUN make configs
WORKDIR /opt/janus/bin
COPY ./configs/* /opt/janus/etc/janus/ 
ENTRYPOINT ./janus
