
<p align="center">
  <a href="http://metamorphosis.app/">
 <img src="./client/assets/logo.png" width="400" height="320"></p>
<h1 align="center"><strong>Metamorphosis</strong></h1></a>


# Metamorphosis
Monitor and visualize your Kafka clusters with Metamorphosis

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/license/oslabs-beta/metamorphosis">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/oslabs-beta/metamorphosis?color=yellow">
  <img alt="GitHub All Releases" src="https://img.shields.io/github/downloads/oslabs-beta/metamorphosis/total?color=green">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/oslabs-beta/metamorphosis?color=orange">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/oslabs-beta/metamorphosis?style=social">  
</p>

![license](https://img.shields.io/github/license/oslabs-beta/metamorphosis?color=%2357d3af) ![issues](https://img.shields.io/github/issues-raw/oslabs-beta/metamorphosis?color=yellow) ![last commit](https://img.shields.io/github/last-commit/oslabs-beta/metamorphosis?color=%2357d3af)​ [![Actions Status](https://github.com/oslabs-beta/metamorphosis/workflows/CI/CD%20with%20Github%20Actions/badge.svg)](https://github.com/oslabs-beta/metamorphosis/actions) [​![npm version](https://img.shields.io/npm/v/metamorphosis?color=%2344cc11&label=stable)​](https://www.npmjs.com/package/metamorphosis)​‌


## Table of Contents

[Overview](#overview)  
[Demo](#demo)  
[Companion Website](#companion-website)  
[Quick Start](#quick-start)  
[Viewing your metrics](#viewing-your-metrics)  
[See Metamorphosis in action using our Kafka application simulator](#see-Metamorphosis-in-action-using-our-kafka-application-simulator)
[Engineers](#authors)

## Overview
Monitor and visualize your Kafka clusters with Metamorphosis:
Metamorphosis is a monitoring and visualization tool for your Kafka cluster that allows developers to quickly test whether new services are functioning correctly. It provides a set of dashboards to inspect each component in the cluster and debug problems when they occur. The tool can be deployed on-premise, so you don’t have to rely on expensive cloud solutions.

## Demo

![Metamorphosis-events](./client/assets/events.gif 'Metamorphosis Event Metrics')
![Metamorphosis-throughput](./client/assets/throughput.gif 'Metamorphosis Throughput Metrics')<br>


## Companion Website
Coming soon!

## Quick Start

Metamorphosis is incredibly easy to incorporate into your application. Let's walk through the steps you'll need to take.


The Metamorphosis App can be used to view your metrics.

1. Clone this repo (https://github.com/oslabs-beta/Metamorphosis.git)
2. cd into Metamorphosis
3. Start the application with npm start
4. Navigate to localhost:3000
5. Within the GUI, navigate to the setting page and enter the location (e.g. port 9092) of your Kafka cluster.



## Viewing your metrics

To view your metrics, you will need to use the metamorphosis app built in this repo. Follow these instructions.

1. Clone this repo (`git clone https://github.com/oslabs-beta/Metamorphosis.git`) and cd into it (`cd Metamorphosis`).
2. Start the application with `npm run metamorphosis`. This allows Metamorphosis to send its metrics to our  UI.

You're all set! You should be able to track analytics as data moves through your Kafka application, and make vital decisions about scaling your distributed system.


# See Metamorphosis in action using our Kafka monitor and visualizer



## Authors
Metamorphosis Engineers

[Josephine Chen](https://github.com/ChenJosephine)  
[Chris Inoue](https://github.com/Chrisxesq)   
[Tristyn Ruiz](https://github.com/Tristyn-Ruiz)  
[Alessandro Battellino](https://github.com/AlessBattellino)  
[Adam Rodriguez](https://github.com/AdamXRodriguez)  


We welcome contributions, so please feel free to fork, clone, and help Metamorphosis grow! Remember to leave a [![GitHub stars](https://img.shields.io/github/stars/oslabs-beta/metamorphosis?style=social&label=Star&)](https://github.com/oslabs-beta/metamorphosis/stargazers) if you'd like to support our work!

So go:
    Add a GitHub Star to the project.
    Write a review or tutorial on Medium, Dev.to or personal blog.
    Contribute to this project by raising a new issue or making a PR to solve an issue.


## License
Released under the MIT License

Disclaimer: Apache Kafka is a registered trademark of the ASF and that `Metamorphosis` is an independent product and not endorsed by the ASF.