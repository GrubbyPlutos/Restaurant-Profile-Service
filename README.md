# Grubby Hub Restaurant Profile Microservice

Grubby Hub's Restaurant Profile Microservice was scaled in AWS EC2 to use an Nginx Load Balancing Server, 6 Host servers, 1 Redis Cache, and 1 PostgreSQL database. It currently supports a throughput of 2.9K RPS (scaled from 400 RPS) with response latency of 18 ms (down from 350 ms).

In particular, this was the order and sequence of events that led to this scaling success:
  1. Initial tests to service: 400 RPS, 350 ms (just terrible)
  2. Implement a Redis in-memory cache. Result: Increase throughput to about 1000 RPS, decrease latency to 50 ms.
  3. Implement an Nginx load balancer that round robinned 6 servers all querying same database. Result: Increase my throughput to 1700 RPS, decrease latency to 30 ms.
  4. Rewrite the routes to query a PostgreSQL open pool instead of opening new database connections every time. Result: Increase throughput to 2000 RPS, decrease latency to 25 ms.
	5. TODO: Clone PostgreSQL database using Streaming replication. Result: expect throughput to increase to about 3.5 K, latency decrease by several ms.


## Related Microservices

  - [Restaurant Menus](https://github.com/GrubbyPlutos/SDC-menu)
  - [Restaurant Reviews](https://github.com/GrubbyPlutos/SDC-Reviews)
  - [Suggested Restaurants](https://github.com/GrubbyPlutos/restaurants-suggestions)


## Requirements

See package.json file for details.


## About Grubby Hub

> Grubby Hub is a food ordering app where users can order food online from hundreds of restaurants around their area.
