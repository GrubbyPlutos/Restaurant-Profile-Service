# Grubby Hub Restaurant Profile Microservice

Grubby Hub's Restaurant Profile Microservice was scaled in AWS EC2 to use an Nginx Load Balancing
Server, 5 Host servers, Redis Caching, and 1 PostgreSQL database. It currently supports a throughput
of +2.5 K RPS (scaled from 400 RPS) with response latency of 3.56 ms (down from 400+ ms).



## Details


### Step 1:

Benchmarking databases.  Cassandra vs. PostgreSQL performance for a simple SELECT (read) query without indexing.


#### PostgreSQL: <br />
<img src="/screenshots/000_read-query-postgres.png" alt="PostgreSQL simple SELECT query execution time." width="700px" height="70px">
<br />

#### Cassandra:<br />
<img src="/screenshots/010_read-query-cassandra.png" alt="Cassandra simple SELECT query execution time." width="700px" height="224px">
<br />


#### Bottomline
| Database    |   time    | 
| ----------- | --------- |
| PostgreSQL  | 1.040 ms  |
| CassandraDB | 12.049 ms |



### Step 2: Database selection.

After indexing, PostgreSQL was chosen as the database for the project. Currently, the throughput was pretty low (about 400 RPS -- ignore the rpm in the picture below), and the latency high (328 ms / request).

#### New Relic Dashboard showing number of transactions <br />
<img src="/screenshots/020_metrics-w-o-caching.png" alt="New Relic Dashboard showing number of transactions." width="650px" height="316px">
<br />



### Step 3: Using Redis to cache previous queries

Redis key-value in-memory cache was used to add another layer of scalability between the server and the database. Restaurant
profiles requested from the client would now first ping the Redis cache before the database. If not found in the cache, the
database would be queried, the Redis cache would be augmented with the key-value pair, and then the response would be completed.
Next time around, the database would not be queried because the cache would contain the item.

GET, POST, PUT (todo: DELETE) routes were implemented with the Redis cache.


#### Before and after adding Redis Cache:<br />
You can see the left part of the graph is twice the size as the right part of the graph. The left part of the graph is the 
response time without caching, the right side is response time with caching. Clearly, the response time was more than halved.
<br />
<img src="/screenshots/050_metrics-w-caching-and-w-o-caching-side-by-side.png" alt="Before and after using in-memory Redis cache." width="650px" height="316px">
<br />


#### Bottomline
Latency time was halved from 400+ ms to 187 ms, throughput was more than doubled from 400 RPS to around 1050 RPS.



### Step 4: Implement Nginx Load Balancer with Round Robin algorithm around 5 host servers

More host servers were configured in AWS EC2. Another EC2 instance was configured to run Nginx Load Balancer. A Round Robin
algorithm was configured to request in sequential order each of the servers.

First, 2 host servers were configured:<br />
<img src="/screenshots/070_2-servers-w-LB.png" alt="2 host servers." width="650px" height="327px">
<br />

then, 5!<br />
<img src="/screenshots/080_100K_throughput_with_5_servers.png" alt="5 host servers." width="650px" height="334px">
<br />

Here, the servers:<br />
<img src="/screenshots/081_5-servers.png" alt="Individual server throughput, error rate, response time and CPU usage." width="450px" height="300px">
<br />


Clearly, the response time and throughput skyrocketed when this was done. The average response time latency was about 12.5 ms,
and the throughput was not at about 1.7 K RPS. Yay!


### Step 5: Change the database connection from a Client to a Pool

The newest bottleneck noticed in the system was that the requests were being canceled, because the timeout was exceeded.
It turns out, every time a request was being made to the server and the database was queried, this would establish a new
connection. Establishing a new connection requires a certain handshake that can create some overhead if done multiple times.
Essentially, creating a pool of open database connections that the server could make requests to would leave connections
open for queries. 

This is exactly what was done. 

#### Connection timeouts without requesting from the PostgreSQL pool, using k6 (stresstesting library):<br />
<img src="/screenshots/100_RPS-w-o-pool.png" alt="Using k6 to benchmark before connecting to the pool." width="700px" height="347px">
<br />

#### Results after to a pool:<br />
<img src="/screenshots/110_RPS-w-Pool.png" alt="Using k6 to benchmark after connecting to the pool." width="500px" height="203px">
<br />


#### Bottomline


Once again, the winner is leaving open database connections (i.e. a pool) for requests to come in. Notice, before, responses
wouldn't be completed, and, thus, status 200 codes weren't 100% of the time. After, there isn't time spent on checking the
validity of the connection, and thus it's way faster. And it doesn't seem that the latency in response decreased, rather
throughput increased from ~1.8 K RPS to ~2.0 K RPS because of open connections to the PostgreSQL pool.


### Final thoughts:

#### Final results, after stresstesting for optimal performance: 3.56 ms latency & +2.5 K RPS<br />
<img src="/screenshots/112_RPM-NewRelic.png" alt="Final results." width="650px" height="335px">
<br />

Further steps could involve: 
1. Cloning PostgreSQL database using Streaming replication. We should expect throughput to increase further. Latency might
decrease by few several ms.
2. Using AWS Load Balancers. Let them take care of it and explore around with all the tools at the disposal.
3. Vertically scaling. EC2 T2.micros were used during this entire scaling project. Using bigger computers will definitely 
yield more results.

This was a fun project to work on. I hope I can work on something something similar in the future!



## Related Microservices

  - [Restaurant Menus](https://github.com/GrubbyPlutos/SDC-menu)
  - [Restaurant Reviews](https://github.com/GrubbyPlutos/SDC-Reviews)
  - [Suggested Restaurants](https://github.com/GrubbyPlutos/restaurants-suggestions)


## Requirements

See package.json file for details.


## About Grubby Hub

> Grubby Hub is a food ordering app where users can order food online from hundreds of restaurants and
take outs around their area.
