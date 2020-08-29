async function saveHistory() {
	// console.log("from history", Files);
	const batch = db.batch();
	for (var key in Files) {
		var File = Files[key];
		// console.log(key, File);
		const UploaderDoc = UploadersRef.doc(File.uploaderID);
		batch.set(UploaderDoc, Uploaders[File.uploaderID], { merge: true });
		batch.set(UploaderDoc.collection("uploads").doc(key), {
			url: File.url,
		});
		batch.set(HistoryRef.doc(key), File, { merge: true });
	}
	return batch.commit();
}
// async function updateUploadsCount() {
// 	// const batch = db.batch()
// 	for (var id in Uploaders) {
// 		const UploaderDoc = UploadersRef.doc(id);
// 		const UploadsList = UploaderDoc.collection("uploads");
// 		UploadsList.
// 		// batch.set(UploaderDoc)
// 	}
// }
async function getHistory() {
	return HistoryRef.orderBy("updated", "desc")
		.limit(5)
		.get()
		.then((q) => {
			return q.forEach((doc) => {
				// console.log("history", doc.data());
			});
		});
}

async function getUploaders() {
	return UploadersRef.orderBy("updated", "desc")
		.get()
		.then((q) => {
			return q.forEach((doc) => {
				console.log("uploader", doc.data().name);
			});
		});
}


async function loadHistory() {
	const ids = Object.keys(Files);
	// console.log(ids)
	const refs = ids.map((id) => HistoryRef.doc(id).get());
	return Promise.all(refs).then((q) => {
		return q.forEach((doc) => {
			const $name = $Files[doc.id].$name;
			if (doc.exists) {
				$name.after(` <span class="msg msg-seen" title="seen"><i class="fa fa-eye"></i></span>`);
			} else {
				$name.after(` <span class="msg msg-not-seen" title="not seen"><i class="fa fa-eye-slash"></i></span>`);
			}
		});
	});
}
