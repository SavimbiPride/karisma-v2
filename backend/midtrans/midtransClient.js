const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-XPw3F_xcgAvwMDukyJ2FwlSh",
});

module.exports = snap;
