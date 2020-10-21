FROM alpine

RUN apk add --update --no-cache \
  icecast \
  mailcap

# COPY /etc/icecast/icecast.xml /etc/icecast.xml

EXPOSE 8000
RUN chown -R 1001:1001 /var/log/icecast
USER 1001


CMD ["icecast", "-c", "/etc/icecast/icecast.xml"]
