// var keystone = require('keystone');
// var async = require('async');
// var Meta = keystone.list('Meta');

// function updateCanonical (meta, done) {
//   Meta.model.update({ _id: meta._id }, { $set: { canonical: meta._id } }, function (err) {
//     done();
//   });
// }

// module.exports = function (done) {
//   Meta.model.find({}, function (err, docs) {
//     if (!err) {
//       async.forEach(docs, updateCanonical, done);
//     } else {
//       done(err);
//     }
//   });
// };

module.exports = () => {};
