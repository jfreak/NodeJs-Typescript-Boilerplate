"use strict";
exports.__esModule = true;
var express_1 = require("express");
var moment = require("moment");
var Trips = require('../../../server/models/').Trips;
var UserRouter = /** @class */ (function () {
    function UserRouter() {
        var _this = this;
        this.updateTripLocation = function (req, res, next) {
            // let locations = {
            //     lat: req.body.locations.lat,
            //     lng: req.body.locations.lng
            // };
            return Trips
                .create({
                rider_id: req.body.rider_id,
                driver_id: req.body.driver_id
            })
                .then(function (success) {
                return res.status(200).send({
                    response: {
                        message: "Success",
                        response_code: 200,
                        trip_id: success.id
                    }
                });
            })["catch"](function (err) {
                return res.status(400).send({
                    response: {
                        message: "Something went wrong",
                        response_code: 400
                    }
                });
            });
        };
        this.endTripLocation = function (req, res, next) {
            return Trips
                .findOne({
                where: {
                    id: req.body.trip_id
                }
            })
                .then(function (success) {
                if (success) {
                    var a_1 = [];
                    var d = moment.duration(moment().diff(success.createdAt));
                    var min_1 = Math.round(moment.duration(d).asMinutes());
                    a_1.push(success.locations);
                    a_1.push({
                        lat: req.body.locations.lat,
                        lng: req.body.locations.lng
                    });
                    var e = [];
                    for (var i = 0; i <= a_1.length - 1; i++) {
                        e.push([
                            a_1[i].lat,
                            a_1[i].lng,
                        ]);
                    }
                    _this.client.getDirections([
                        { latitude: a_1[0].lat, longitude: a_1[0].lng },
                        { latitude: a_1[1].lat, longitude: a_1[1].lng }
                    ], {
                        profile: 'driving',
                        alternatives: false,
                        geometry: 'polyline'
                    }, function (err, results) {
                        // console.log(JSON.stringify(results));
                        success.update({
                            locations: a_1
                        })
                            .then(function (data) {
                            // console.log(JSON.stringify(data));
                            return res.status(200).send({
                                response: {
                                    message: "Success",
                                    response_code: 200,
                                    time: min_1,
                                    distance: results.routes[0].distance,
                                    duration: results.routes[0].duration,
                                    coordinates: results.routes[0].geometry.coordinates
                                }
                            });
                        })["catch"](function (err) {
                            console.log(err);
                            return res.status(401).send({
                                response: {
                                    message: "Error",
                                    response_code: 401
                                }
                            });
                        });
                    });
                }
            })["catch"](function (err) {
                return res.status(400).send({
                    response: {
                        message: "Something went wrong",
                        response_code: 400
                    }
                });
            });
        };
        this.router = express_1.Router();
        this.init();
    }
    UserRouter.prototype.init = function () {
        this.router.post('/start/location', this.updateTripLocation);
        this.router.post('/end/location', this.endTripLocation);
    };
    return UserRouter;
}());
exports.UserRouter = UserRouter;
// Create the UserRouter, and export its configured Express.Router.
var userRoutes = new UserRouter();
userRoutes.init();
exports["default"] = userRoutes.router;
