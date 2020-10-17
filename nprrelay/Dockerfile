FROM alpine

RUN apk add --no-cache icecast;

EXPOSE 8000

# VOLUME ["/config", "/var/log/icecast", "/etc/icecast"]

COPY config/icecast.xml /etc/

RUN chown -R 1001:1001 /var/log/icecast

USER 1001

CMD ["icecast", "-c", "/etc/icecast.xml"]
