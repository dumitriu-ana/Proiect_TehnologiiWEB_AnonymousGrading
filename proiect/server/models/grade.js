const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    grade: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must not be more than 10']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user', 
        required: true
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'project', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Static method to get the average grade(without 1 min && 1 max)
ReviewSchema.statics.getAverageGrade = async function (projectId) {
    const obj = await this.aggregate([
        {
            $match: { project: projectId}
        },
        {
            $group: {
                _id: '$project',
                avg: {$avg: '$grade'},
                myMax: {$max: '$grade'},
                myMin: {$min: '$grade'},
                mySum: {$sum: '$grade'},
                count: {$sum: 1}
            }
        }
    ]);
   
    try {
        let avg = 0;
        if(obj[0].count > 2){
            avg = (obj[0].mySum-obj[0].myMax-obj[0].myMin)/(obj[0].count-2)
        } else {
            avg = obj[0].avg;
        }
        
        await this.model('Project').findByIdAndUpdate(projectId, {
            averageGrade: obj[0].avg.toFixed(2)
        });
    } catch (err) {
        console.error(err)
    }
};
// Call getavggrade after save
GradeSchema.post('save', async function () {
    await this.constructor.getAverageGrade(this.project);
})

// Call getavggrade before remove
GradeSchema.pre('remove', async function () {
    await this.constructor.getAverageGrade(this.project);
})

module.exports = mongoose.model('Grade', GradeSchema);