#!/usr/bin/env bash
# Deploy the relevant container
set -e -u -o pipefail

. secrets.sh
. util.sh

# Used to prevent muxes hanging around
rm_ctrl_socket() {
  ssh ${ssh_mux_opts} root@berwyn.mycloudgateway.co.uk
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
  # current container name
  echo " [${STAR}] Retrieving current image name"
  local cur_name="$(ssh ${ssh_opts} root@berwyn.mycloudgateway.co.uk 'docker ps --filter "name=hub-node-" --format "{{.Names}}"')"

  echo " [${STAR}] Stopping container ${cur_name}"
  ssh ${ssh_opts} root@berwyn.mycloudgateway.co.uk "docker stop ${cur_name}"

  echo " [${STAR}] Removing container ${cur_name}"
  ssh ${ssh_opts} root@berwyn.mycloudgateway.co.uk "docker rm ${cur_name}"

  # Note that currently we don't change date suffix here due to link dependencies between containers
  echo " [${STAR}] Starting new container"
  ssh ${ssh_opts} root@berwyn.mycloudgateway.co.uk \
    "docker run -d \
      --name hub-node-20180924 \
      --link hub-be-20180914 \
      -e HUB_API_ENDPOINT=http://hub-be-20180914 \
      -e APP_NAME=\"${APP_NAME}\" \
      -e APP_TIMEOUT=\"60.0\" \
      -e MATOMO_URL=\"${MATOMO_URL}\" \
      -e NODE_ENV=production \
      -p 10002:3000 \
      --restart always \
       mojdigitalstudio/digital-hub-node"
}

main "${@}"

# vim: tabstop=2 expandtab
