
async function saveSearch() {
	SEARCH = SEARCH.trim();
	if (!SEARCH) return new Promise((solve) => solve(false));
	return db
		.runTransaction(function(tr) {
			return tr.get(SearchDoc).then((doc) => {
				var now = Date.now();
				var Access = {
					ip: Lockr.get("ipdata").ip,
					ipdata: Lockr.get("ipdata"),
					date: now,
					datestr: new Date().toLocaleString(),
					results: pages * resultspp,
					url: window.location.href,
				};

				var Search = {
					query: SEARCH,
					category: CATEGORY,
				};

				if (doc.exists) {
					var data = doc.data();
					var hours = moment().diff(moment(data.last), "hours");

					if (hours < 12) {
						tr.delete(AccessList.doc(data.last + ""));
					}
					// tr.delete(SearchDoc)

					tr.update(SearchDoc, Access);
				} else {
					tr.set(SearchDoc, Object.assign(Search, Access));
				}
				// var obj = Object.assign(Search, Access);
				// console.log("obj", obj);
				// tr.set(SearchDoc, obj);

				tr.set(AccessList.doc(now + ""), Access);
			});
		})
		.then(() => {
			return AccessList.get().then((sn) => {
				var count = sn.size;
				return SearchDoc.update({
					times: count,
				});
			});
		})
		.then(() => {
			return SearchList.orderBy("updated", "desc")
				.limit(5)
				.get()
				.then((sn) => {
					return sn.forEach((doc) => {
						console.log(doc.data());
					});
				});
		});
}
