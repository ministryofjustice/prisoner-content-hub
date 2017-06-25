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

To run dev

    ansible-playbook -i dev site.yml

Once you have verified dev is still working as expected run prod 

    ansible-playbook -i prod site.yml

