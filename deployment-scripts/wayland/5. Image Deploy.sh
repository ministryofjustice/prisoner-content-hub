#!/usr/bin/env bash
# Deploy the relevant container
set -e -u -o pipefail

. secrets.sh
. util.sh

# Used to prevent muxes hanging around
rm_ctrl_socket() {
  ssh ${ssh_mux_opts} root@wayland.mycloudgateway.co.uk
}
trap rm_ctrl_socket EXIT

main() {
  case "${1:-}" in
  be)
    ;;
  fe)
    ;;
  node)
    deploy_node
    ;;
  db)
    ;;
  matomo)
    ;;
  matomo-db)
    ;;
  *)
    echo "Deploy container in prod, param can be (be|fe|node|db|matomo|matomo-db)"
    ;;
  esac
}

deploy_node() {
  local cur_name="hub-node"

  echo " [${STAR}] Stopping container ${cur_name}"
  ssh ${ssh_opts} root@wayland.mycloudgateway.co.uk "docker stop ${cur_name}"

  echo " [${STAR}] Removing container ${cur_name}"
  ssh ${ssh_opts} root@wayland.mycloudgateway.co.uk "docker rm ${cur_name}"

  # Note that currently we don't change date suffix here due to link dependencies between containers
  echo " [${STAR}] Starting new container"
    echo " [${STAR}] Starting new container"
  ssh ${ssh_opts} root@wayland.mycloudgateway.co.uk \
    "docker run -d \
      --name hub-node \
      --link hub-be \
      -e APP_NAME=\"${APP_NAME}\" \
      -e APP_TIMEOUT=\"60.0\" \
      -e DRUPAL_APP_URI=\"${DRUPAL_APP_URI}\" \
      -e ESTABLISHMENT_NAME=\"${ESTABLISHMENT_NAME}\" \
      -e HUB_API_ENDPOINT=\"http://hub-be\" \
      -e MATOMO_URL=\"${MATOMO_URL}\" \
      -e NODE_ENV=\"production\" \
      -e OLD_HUB_URL=\"${OLD_HUB_URL}\" \
      -p 10001:3000 \
      --restart always \
       mojdigitalstudio/digital-hub-node"
}

main "${@}"

# vim: tabstop=2 expandtab
