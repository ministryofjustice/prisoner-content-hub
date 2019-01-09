#!/usr/bin/env bash
set -e -u -o pipefail

# Asset transfer from stagingn to prod
# Requires the public key from staging placing in the authorized keys on prod

ssh -R 50000:wayland.mycloudgateway.co.uk:22 digital-hub-stage.hmpps.dsd.io 'rsync -n -riP --ignore-existing -e "ssh -p50000 -o PasswordAuthentication=yes -oStrictHostKeyChecking=no" /content/moj_dhub_prod001_app/usr/share/nginx/html/moj_be/sites/default/files/ root@localhost:/content/moj_dhub_prod001_app/usr/share/nginx/html/moj_be/sites/default/files/'
