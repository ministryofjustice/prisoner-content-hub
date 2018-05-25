Ansible for Hub servers
=======================

This is the Ansible code for the servers that are used to run the Digital Hub.

Bounce servers
--------------

The bounce servers provide remote access into the hub installs.

Running Ansible
---------------

To run Ansible you will need to have this installed on your system.

Setup

    bundle install
    bundle exec librarian-ansible install

For the servers using 2FA you will need to create a control connection before trying to run Ansible.

As an example

    ssh -M -S ~/tmp/hub-bounce-dev hub-bounce-dev

To run dev

    ansible-playbook --ssh-common-args='-o ControlPath=~/tmp/hub-bounce-dev' -i bounce-dev site.yml

Once you have verified dev is still working as expected run prod 

    ansible-playbook --ssh-common-args='-o ControlPath=~/tmp/hub-bounce-prod' -i bounce-prod site.yml

Manage Users

   ansible-playbook --ssh-common-args='-o ControlPath=~/tmp/hub-bounce-prod' -i [bounce-prod OR bounce-dev] users.yml
