FROM alpine-3.20.2

RUN apk add --update --no-cache \
  icecast \
  mailcap

EXPOSE 8000
RUN chown -R 1001:1001 /var/log/icecast
USER 1001


CMD ["icecast", "-c", "/etc/icecast/icecast.xml"]
