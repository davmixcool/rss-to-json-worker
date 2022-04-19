# Rss to Json Worker

A Cloudflare worker that gets the json data of an rss feed. 

I made this for my personal use for one of my projects that needs it.


## Requirements

* Node v10 and above


## Features

* Transform Medium Rss Url to Json Data


## Worker Setup

First clone the repo and then `cd` into it.

`git clone https://github.com/hackwithdavid/rss-to-json-worker.git`

`cd rss-to-json-worker`

### Install Modules

`npm install`


### Configuration

You can tweak the `wrangler.toml` file to what you want.


### Development

```
wrangler dev
```


### Production

```
wrangler build
```


### Maintainers

This package is maintained by [David Oti](http://github.com/davmixcool) and you!


