#!/bin/bash
# Pull an image from docker hub, save it, transfer it to Berwyn and import to the local docker image repo
set -e -u -o pipefail

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

  echo " [*] Pulling ${image}"
  sudo docker pull "${image}"

  echo " [*] Saving image ${image} as ${image//:/_}.tar"
  sudo docker save -o "/mnt/${image//:/_}.tar" "${image}"
  sudo chmod 0644 "/mnt/${image//:/_}.tar"

  # We enable SSH compression in this transfer as the Berwyn connection isn't the fastest
  echo " [*] Transfering image to prod, you'll be prompted for the root password"
  scp -q -C -o PasswordAuthentication=yes "/mnt/${image//:/_}.tar" root@berwyn.mycloudgateway.co.uk:~

  echo " [*] Importing image to Berwyn local docker repo, you'll be prompted for the root password"
  ssh -q -o PasswordAuthentication=yes root@berwyn.mycloudgateway.co.uk "docker load -i ${image//:/_}.tar && rm ${image//:/_}.tar"

  echo " [*] Removing local copies"
  sudo rm "/mnt/${image//:/_}.tar"
  sudo docker rmi "${image}"
}

main "${@}"

# vim: tabstop=2 expandtab
