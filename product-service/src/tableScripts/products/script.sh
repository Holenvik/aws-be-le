#!/bin/bash

aws dynamodb batch-write-item --request-items file://schema.json
