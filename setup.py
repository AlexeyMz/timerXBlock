"""Setup for timerXBlock."""

import os
from setuptools import setup


def package_data(pkg, root):
    """Generic function to find package_data for `pkg` under `root`."""
    data = []
    for dirname, _, files in os.walk(os.path.join(pkg, root)):
        for fname in files:
            data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='timer-xblock',
    version='0.2.34',
    description='This XBlock provides a way to setup a time limit of exam course.',
    packages=[
        'timer',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'timer = timer:timerXBlock',
        ]
    },
    package_data=package_data("timer", "static"),
)