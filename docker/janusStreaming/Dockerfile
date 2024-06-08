FROM debian
RUN apt-get update && apt-get upgrade -y
RUN apt-get install libmicrohttpd-dev -y
RUN apt-get install libjansson-dev -y
RUN apt-get install libssl-dev -y
RUN apt-get install libsrtp2-dev -y
RUN apt-get install libglib2.0-dev -y
RUN apt-get install libconfig-dev -y
RUN apt-get install pkg-config -y
RUN apt-get install libtool -y
RUN apt-get install automake -y
RUN apt-get install git -y
RUN apt-get install python3-pip -y
RUN apt-get install libcurl4-openssl-dev -y
RUN apt-get install libavutil-dev -y
RUN apt-get install libavcodec-dev -y
RUN apt-get install libavformat-dev -y
RUN apt-get install libogg-dev -y
RUN pip3 install meson --break-system-packages
RUN apt-get install ninja-build -y
RUN git clone https://gitlab.freedesktop.org/libnice/libnice
WORKDIR /libnice
RUN meson --prefix=/usr build && ninja -C build && ninja -C build install
WORKDIR /
RUN apt-get install make -y
RUN apt-get install cmake -y
RUN git clone https://libwebsockets.org/repo/libwebsockets
WORKDIR /libwebsockets
RUN git checkout v4.3-stable
RUN mkdir build
WORKDIR /libwebsockets/build
RUN cmake -DLWS_MAX_SMP=1 -DLWS_WITHOUT_EXTENSIONS=0 -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" ..
RUN make && make install
WORKDIR /
RUN git clone https://github.com/meetecho/janus-gateway.git
WORKDIR /janus-gateway
#RUN git checkout c684d43dd02e48e3fa7e072a39471507fe927e77
RUN sh autogen.sh
RUN ./configure --prefix=/opt/janus --enable-post-processing
RUN make
RUN make install
RUN make configs
WORKDIR /opt/janus/bin
COPY ./configs/* /opt/janus/etc/janus/
ENTRYPOINT ./janus
