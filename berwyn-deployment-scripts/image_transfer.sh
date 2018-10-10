#!/bin/bash
# Pull an image from docker hub, save it, transfer it to Berwyn and import to the local docker image repo
set -e -u -o pipefail

# Some terminal colour
GREEN="[1;32m"
DEF="[39m"
STAR="${GREEN}*${DEF}"

main() {
  case ${1:-} in
  be)
    transfer_image mojdigitalstudio/digital-hub-be:latest
    ;;
  fe)
    echo "This is now legacy, did you mean to transfer the node image instead?"
    ;;
  node)
    transfer_image mojdigitalstudio/digital-hub-node:latest
    ;;
  db)
    transfer_image mojdigitalstudio/digital-hub-db:latest
    ;;
  matomo)
    transfer_image matomo:3-apache
    ;;
  matomo-db)
    transfer_image mariadb:latest
    ;;
  *)
    echo "Transfer docker images to prod, param can be (be|fe|node|db|matomo|matomo-db)"
    ;;
  esac
}

transfer_image() {
  local image="${1}"
  local filename="${image//:/_}"
  local filename="${filename//\//_}.tar"

  echo " [${STAR}] Pulling ${image}"
  sudo docker pull "${image}"

  echo " [${STAR}] Saving image ${image} as ${filename}"
  sudo docker save -o "/mnt/${filename}" "${image}"
  sudo chmod 0644 "/mnt/${filename}"

  # We enable SSH compression in this transfer as the Berwyn connection isn't the fastest
  echo " [${STAR}] Transfering image to prod, you'll be prompted for the root password"
  scp -q -C -o PasswordAuthentication=yes "/mnt/${filename}" root@berwyn.mycloudgateway.co.uk:~

  echo " [${STAR}] Importing image to Berwyn local docker repo, you'll be prompted for the root password"
  ssh -q -o PasswordAuthentication=yes root@berwyn.mycloudgateway.co.uk "docker load -i ${filename} && rm ${filename}"

  echo " [${STAR}] Removing local copies"
  sudo rm "/mnt/${filename}"
  sudo docker rmi "${image}"
}

main "${@}"

# vim: tabstop=2 expandtab
