env: dev

certbot_auto_renew: false

nginx_vhosts:
  - listen: "443 ssl http2"
    server_name: "dev.hub.service.hmpps.dsd.io"
    state: "present"
    extra_parameters: |
      ssl_certificate     /etc/letsencrypt/live/dev.hub.service.hmpps.dsd.io/fullchain.pem;
      ssl_certificate_key /etc/letsencrypt/live/dev.hub.service.hmpps.dsd.io/privkey.pem;
      ssl_protocols       TLSv1.2;
      ssl_ciphers         'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
      ignore_invalid_headers off;
      location / {
        proxy_pass http://hub-fe;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
      }
