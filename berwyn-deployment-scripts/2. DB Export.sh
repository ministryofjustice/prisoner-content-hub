#!/usr/bin/env bash
set -e -u -o pipefail

. util.sh

# Used to prevent muxes hanging around
rm_ctrl_socket() {
  ssh ${ssh_mux_opts} root@berwyn.mycloudgateway.co.uk
}
trap rm_ctrl_socket EXIT

sql_filename="hubdb-$(date +%Y%m%d).sql"

echo " [${STAR}] Extracting MySQL root password"
mysql_pass=$(ssh ${ssh_opts} digital-hub-stage.hmpps.dsd.io 'sudo cat /etc/docker-decomposed-secrets-MYSQL_ROOT_PASSWORD')

echo " [${STAR}] Dumping staging database"
ssh ${ssh_opts} digital-hub-stage.hmpps.dsd.io "sudo docker exec hub-db mysqldump -p'${mysql_pass}' hubdb" | pv -W > "/tmp/${sql_filename}"
