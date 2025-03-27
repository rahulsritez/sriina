exports.stateDeliveryCharge = function (req, res) {
  let title = "State Develiery Charge Page";
  let sql = "SELECT * FROM state";
  var userType = req.session.type;

  if (userType != 1) {
    res.redirect("/");
  }
  let query = db.query(sql, function (err, result) {
    res.render("admin/statelist", {
      title: title,
      productlist: result,
      message: req.flash("message"),
    });
  });
};

exports.updateStateDeliveryCharge = (req, res) => {
  if (req.url == "/updatestatedeliverycharge") {
    let data = req.body;
    let slqupdate =
      "UPDATE `state1` set `delivery_charges`='" +
      data.edit_shipping_charge +
      "', `status`='" +
      data.edit_status +
      "' where `id`='" +
      data.edit_id +
      "'";
    let query = db.query(slqupdate, function (error, result) {
      if (error) throw new Error("State shipping charge update problem");
      req.flash("message", "Shipping charge has been successfully updated.");
      res.redirect("/statedeliverycharge");
    });
  }
};
