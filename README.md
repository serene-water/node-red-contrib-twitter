# Twitter for NodeRED

An set of nodes that map the Twitter [REST](https://dev.twitter.com/rest/public) and [Streaming](https://dev.twitter.com/streaming/overview) API's.

## Installation

`npm install node-red-contrib-twitter`

## Quick Start

You will need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys.  You can get these [here](https://apps.twitter.com/).  Do not forgot to adjust your permissions - most POST request require write permissions.

## REST API

You simply need to pass the variables required by the endpoint in the payload.  Take a look at the [documentation site](https://dev.twitter.com/rest/public) to reference available endpoints.

## Implemented Nodes

Search Node - [https://dev.twitter.com/rest/reference/get/search/tweets](https://dev.twitter.com/rest/reference/get/search/tweets)

