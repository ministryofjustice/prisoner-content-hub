#!/bin/bash
# Pull an image from docker hub, save it, transfer it to Wayland and import to the local docker image repo
set -e -u -o pipefail

. util.sh

# Used to prevent muxes hanging around
rm_ctrl_socket() {
  ssh ${ssh_mux_opts} root@wayland.mycloudgateway.co.uk
}
trap rm_ctrl_socket EXIT

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

  # We enable SSH compression in this transfer as the Wayland connection isn't the fastest
  echo " [${STAR}] Transfering image to prod, you'll be prompted for the root password"
  sudo docker save "${image}" | pv -W | ssh ${ssh_opts} root@wayland.mycloudgateway.co.uk "docker load"

  echo " [${STAR}] Removing local copy"
  sudo docker rmi "${image}"
}

main "${@}"

# vim: tabstop=2 expandtab
