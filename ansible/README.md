Ansible for Hub servers
=======================

This is the Ansible code for the servers that are used to run the Digital Hub.

Bounce servers
--------------

The bounce servers provide remote access into the hub installs.

Running Ansible
---------------

To run Ansible you will need to have this installed on your system.

### Setup

```
ansible-galaxy install -r requirements.yml
```

### Bounce Box

```
ansible-playbook -i prod site.yml --check
```

### Staging Site

The staging site can only be accessed via the production bounce box, you'll need to set up bastion SSH config to make this work.

If making a new VM from scratch via the terraform code, you'll need to use `-u provisioning` initially to create your local user, and then run ansible again using your own user to clean up the provisioning user.

```
Host prod.admin.hub.service.hmpps.dsd.io
  User glenmailer

Host digital-hub-stage.hmpps.dsd.io
  User glenmailer
  ProxyJump prod.admin.hub.service.hmpps.dsd.io
```

```
ansible-playbook -i stage site.yml --check
```

Managing Users
---------------

All users are now defined in `group_vars/all.yml`

Documentation for the role used to manage this can be found here https://github.com/singleplatform-eng/ansible-users

There are currently 3 groups:

 - `admin`, For WebOps in the Digital Studio
 - `studio`,  For development teams in the Digital Studio
 - `dxc`, For external DXC staff who will use the bounce box ssh tunnelling

To apply the changes run the `site.yml` playbook as above, you can scope to the `users` tag to speed things up if you like.

```
ansible-playbook -i prod site.yml -t users --check
```

New users will require both public key and password authentication.  To set an initial password do this manually for now.  As root user set a fresh password for the user and set the password as expired:
```
passwd [username]
passwd -e [username]
```
Send the password to the user, setting the `-e` will force the user to reset on first login.
