# Some terminal colour
GREEN="[1;32m"
DEF="[0m"
STAR="${GREEN}*${DEF}"

# enable multiplexing to reduce the number of times we need the root Wayland credentials
ssh_opts="-q -C -o ControlMaster=auto -S ~/.ssh/%r@%h:%p -o ControlPersist=yes -o PasswordAuthentication=yes"
ssh_mux_opts="-q -O stop -S ~/.ssh/%r@%h:%p"
