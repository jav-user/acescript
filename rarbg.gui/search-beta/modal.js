$("#myModal").on("hidden.bs.modal", function (e) {
  // do something...
  console.log("hidden....", e);
});

$("#myModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var id = button.data("id"); // Extract info from data-* attributes
  var query = button.data("query");
  console.log("data",button.data())
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  modal.find(".modal-title").text("New message to " + id);
  modal.find(".modal-body input").val(query);
});
