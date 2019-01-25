import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 60,
  duration: '120s',
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
  let res = http.get(`http://54.215.144.139/restaurants/${getDirectedTrafic()}`);
  check(res, {
    'status was 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 200,
  });
}
