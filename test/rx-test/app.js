const fromEvent = rxjs.fromEvent;
// import { FromEvent } from 'rxjs';
const op = rxjs.operators;
const scan = op.scan;
const throttleTime = op.throttleTime;
const map = op.map;
const Observable = rxjs.Observable;

// xfromEvent($(".btn-test"), "click")
// 	.pipe(
// 		xthrottleTime(1000),
// 		xscan((count) => count + 1, 0)
// 	)
// 	.subscribe((count) => console.log(`Clicked ${count} times`));

fromEvent($(".btn-test"), "click")
	.pipe(
		throttleTime(1000),
		map((event) => event.clientX)
		// 	// scan((count, clientX) => count + clientX, 0)
	)
	// .map((event) => event.clientX)
	.subscribe((clientX) => console.log(clientX));

const observable = new Observable((subscriber) => {
	subscriber.next(1);
	subscriber.next(2);
	subscriber.next(3);
	setTimeout(() => {
		subscriber.next(4);
		subscriber.complete();
	}, 1000);
});

console.log("just before subscribe");
observable.subscribe({
	next(x) {
		console.log("got value " + x);
	},
	error(err) {
		console.error("something wrong occurred: " + err);
	},
	complete() {
		console.log("done");
	},
});
console.log("just after subscribe");
