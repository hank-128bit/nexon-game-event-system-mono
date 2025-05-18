#!/bin/bash
NETWORK_NAME="event-system-network"

if [ "$1" == "create" ]; then
    if [ ! "$(docker network ls | grep "$NETWORK_NAME")" ]; then
        echo "Creating "$NETWORK_NAME""
        docker network create --driver=bridge "$NETWORK_NAME"
    else
        echo ""$NETWORK_NAME" already exists"
    fi
elif [ "$1" == "remove" ]; then
    if [ ! "$(docker network ls | grep "$NETWORK_NAME")" ]; then
        echo ""$NETWORK_NAME" does not exist"
    else
        echo "Removing "$NETWORK_NAME""
        docker network rm "$NETWORK_NAME"
    fi
else
    echo "Invalid argument"
fi
