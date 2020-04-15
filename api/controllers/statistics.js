const CompletedExercise = require('../models/completed-exercise')
const Exercise = require('../models/exercise')
const CleaningTask = require('../models/cleaning-task')
var async = require('async')

exports.statistics_get_all = (req, res, next) => {
    var weekAgo = new Date(new Date() - 7 * 60 * 60 * 24 * 1000).toISOString()
    console.log(weekAgo)
    async.parallel([
        function(callback) {
            var query = CompletedExercise.find({ userId: req.userData.userId } )
            .select('exerciseId date')
            .where({ date: { $gt: weekAgo } })
                
            query.exec(function(err, completedExercisesSinceLastWeek) {
                if (err) {
                    callback(err)
                }
                callback(null, completedExercisesSinceLastWeek)
            })
        },
        function(callback) {
            var query = Exercise.find({ userId: req.userData.userId } )
            .select('_id name category bodyParts')
                
            query.exec(function(err, exercises) {
                if (err) {
                    callback(err)
                }
                callback(null, exercises)
            })
        },
        function(callback) {
            var query = CleaningTask.find({ userId: req.userData.userId } )
            .select('_id place date tasks')
            .where({ date: { $gt: weekAgo } })
                
            query.exec(function(err, cleaningTasksSinceLastWeek) {
                if (err) {
                    callback(err)
                }
                callback(null, cleaningTasksSinceLastWeek)
            })
        },
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
     
        var stats = {}
        stats.completedExercisesSinceLastWeek = response[0] || []
        stats.exercises = response[1] || []
        stats.cleaningTasksSinceLastWeek = response[2] || []
        return res.status(200).json(stats)
    })
}