const Todo = require('../models/todo')
const CompletedExercise = require('../models/completed-exercise')
const Rehearsal = require('../models/rehearsal')
const Watering = require('../models/watering')
const Plant = require('../models/plant')
const CleaningTask = require('../models/cleaning-task')
const FoodProduct = require('../models/food-product')
var async = require('async')

exports.alerts_get_all = (req, res, next) => {
    async.parallel([
        function(callback) {
            var query = Todo.find({ userId: req.userData.userId })
                .select('name priority')
                .where({ priority: {$gt: 8} })
                .where({ completed: {$lt: 1} })
                .sort({ priority: 'desc', name: 'asc' })
            query.exec(function(err, importantTasks) {
                if (err) {
                    callback(err)
                }
                callback(null, importantTasks)
            })
        },
        function(callback) {
            var query = CompletedExercise.find({ userId: req.userData.userId })
                .select('date')
                .sort({ date: 'desc' })
                .limit(1)
            query.exec(function(err, lastExercise) {
                if (err) {
                    callback(err)
                }
        
                callback(null, lastExercise)
            })
        },
        function(callback) {
            var query = Rehearsal.find({ userId: req.userData.userId })
                .select('date')
                .sort({ date: 'desc' })
                .limit(1)
            query.exec(function(err, lastRehearsal) {
                if (err) {
                    callback(err)
                }
        
                callback(null, lastRehearsal)
            })
        },
        function(callback) {
            var query = Watering.find({ userId: req.userData.userId, container: 'AeroFlo' })
                .select('date')
                .sort({ date: 'desc' })
                .limit(1)
            query.exec(function(err, lastWateringFlo) {
                if (err) {
                    callback(err)
                }
        
                callback(null, lastWateringFlo)
            })
        },
        function(callback) {
            var query = Watering.find({ userId: req.userData.userId, container: 'AeroFarm' })
                .select('date')
                .sort({ date: 'desc' })
                .limit(1)
            query.exec(function(err, lastWateringFarm) {
                if (err) {
                    callback(err)
                }
        
                callback(null, lastWateringFarm)
            })
        },
        function(callback) {
            var query = Plant.find({ userId: req.userData.userId, "death" : {"$exists" : true, "$eq" : ""} })
                .select('name watering wateringFrequency')
                .sort({ name: 'asc' })
            query.exec(function(err, lastWatering) {
                if (err) {
                    callback(err)
                }
                callback(null, lastWatering)
            })
        },
        function(callback) {
            var query = CleaningTask.find({ userId: req.userData.userId })
                .select('place date tasks')
                .limit(100)
                .sort({ date: 'desc'})
            query.exec(function(err, cleaningTasks) {
                if (err) {
                    callback(err)
                }
                callback(null, cleaningTasks)
            })
        },        
        function(callback) {
            var query = FoodProduct.find({ userId: req.userData.userId })
                .select('name expiry')
                .limit(10)
                .sort({ expiry: 'asc'})
            query.exec(function(err, cleaningTasks) {
                if (err) {
                    callback(err)
                }
                callback(null, cleaningTasks)
            })
        }        
    ],
    function (err, response) {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }

        if (response == null || response[0] == null) {
            return res.send(400)
        }
     
        var alerts = {}
        alerts.importantTasks = response[0] || []
        alerts.lastExercise = response[1] || []
        alerts.lastRehearsal = response[2] || []
        alerts.lastWateringFlo = response[3] || []
        alerts.lastWateringFarm = response[4] || []
        alerts.lastWatering = response[5] || []
        alerts.cleaningTasks = response[6] || []
        alerts.foodProducts = response[7] || []
        return res.status(200).json(alerts)
    })
}

