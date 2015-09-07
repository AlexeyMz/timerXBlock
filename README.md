timerXBlock
=========

### Description ###

This XBlock provides an easy way to set a time limit to a particular vertical in course.

### Install / Update the XBlock ###

    # Move to the folder where you want to download the XBlock
    cd /edx/app/edxapp
    # Download the XBlock
    sudo -u edxapp git clone https://github.com/vismartltd/timerXBlock.git
    # Install the XBlock
    sudo -u edxapp /edx/bin/pip.edxapp install timerXBlock/
    # Upgrade the XBlock if it is already installed, using --upgrade
    sudo -u edxapp /edx/bin/pip.edxapp install timerXBlock/ --upgrade
    # Remove the installation files
    sudo rm -r timerXBlock

### Reboot if something isn't right ###

    sudo /edx/bin/supervisorctl -c /edx/etc/supervisord.conf restart edxapp:

### Activate the XBlock in your course ###
Go to `Settings -> Advanced Settings` and set `advanced_modules` to `["timer"]`.

### Use the XBlock in a unit ###
Select `Advanced -> Time Limit` in your unit.
