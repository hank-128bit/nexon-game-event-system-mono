#!/bin/bash

if [ ! -f /data/mongo-init.flag ]; then
    echo "Starting replica set initialize"
    until mongosh --host mongo --eval "print(\"waited for connection\")"
    do
        sleep 2
    done
    echo "Connection finished"
    echo "Creating replica set"
    mongosh --host mongo <<EOF
    rs.initiate(
        {
        _id : 'rs0',
        members: [
            { _id : 0, host : "mongo:27017" },
        ]
        }
    )
EOF
    echo "replica set created"
    touch /data/mongo-init.flag
else
    echo "ReplicaSet already initialized"
fi
