import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 150 },
    { duration: '10s', target: 200 },
    { duration: '10s', target: 150 },
    { duration: '10s', target: 100 },
    { duration: '10s', target: 50 },
  ],
};

const directedTraffic = [
  3352999,
  6921999,
  8115999,
  3984999,
  3473999,
  855999,
  1103999,
  4168999,
  1477999,
  1579992,
  9905999,
  6549999,
  5399992,
  8537999,
  6858999,
  8009992,
  4499999,
  1017999,
  8508999,
  9967999,
];

const getDirectedTrafic = () => {
  let rand = Math.random() * 100;
  if (rand < 75) {
    return directedTraffic[Math.floor(Math.random() * directedTraffic.length)];
  } else {
    return Math.ceil(Math.random() * 10000000);
  }
};

export default function() {
  let res = http.get(`http://localhost:3001/restaurants/${getDirectedTrafic()}/profile`);
  check(res, {
    'status was 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 200,
  });
}
