#!/usr/bin/env bash
set -e -u -o pipefail

. secrets.sh
. util.sh

# Used to prevent muxes hanging around
rm_ctrl_socket() {
  ssh ${ssh_mux_opts} root@berwyn.mycloudgateway.co.uk
}
trap rm_ctrl_socket EXIT

sql_filename="hubdb-$(date +%Y%m%d).sql"
db_name="hubdb"

echo " [${STAR}] Dumpinig importing database to Berwyn prod"
pv -W "/tmp/${sql_filename}" | ssh ${ssh_opts} root@berwyn.mycloudgateway.co.uk "docker exec -i hub-db-20180914 mysql -p'${MYSQL_ROOT_PASSWORD}' ${db_name}"

rm -f "/tmp/${sql_filename}"
