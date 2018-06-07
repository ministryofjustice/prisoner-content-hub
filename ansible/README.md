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

The hub bounce server requires 2FA, password and public key.  Ensure you ssh config works.

To run dev:

    ansible-playbook -i bounce-dev site.yml --check

Once you have verified dev is still working as expected run prod 

    ansible-playbook -i bounce-prod site.yml --check


Managing Users
---------------

All user are now defined in `group_vars/all.yml`

Documentation for the role used to manage this can be found here https://github.com/singleplatform-eng/ansible-users

There are currently 3 groups:

 - `admin`, For WebOps in the Digital Studio
 - `studio`,  For developement teams in the Digital Studio
 - `dxc`, For external DXC staff who will use the bounce box ssh tunneling 

To apply the changes run the `users.yml` playbook, e.g.

   ```ansible-playbook -i [bounce-prod OR bounce-dev] users.yml```

New users will require both public key and password authentication.  To set an initial password do this manually for now.  As root user set a fresh password for the user and set the password as expired:
```
passwd [username]
passwd -e [username]
```
Send the password to the user, setting the `-e` will force the user to reset on first login.
