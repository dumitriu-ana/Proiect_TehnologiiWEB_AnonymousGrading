const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Adauga nume']
    },
    surname: {
        type: String,
        required: [true, 'Adauga prenume']
    },
    username: {
        type: String,
        required: [true, 'Adauga username'],
        unique: true
        // match: [
        //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        //     'Adauga username',
        //   ]      
    },
    password: {
        type: String,
        required: [true, 'Adauga parola'],
        minlength: 6,
        select: false
    },
    team: {
        type: Number,
        required: [true, 'Adauga echipa']
    },
    type: {
        type: Number,
        enum: [0,1,2],
        default: 0
    },
  
    createdAt:{
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign( {id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



// Generate random lucky number to get a chance to become a reviewer
UserSchema.methods.assignRandomReviewer = function() {
    if (this.type === 0) {
        const stringRandom = crypto.randomBytes(20).toString('hex');

        this.dateRandom = Date.now() + Math.floor(Math.random() * 10);

        return this.dateRandom / stringRandom.charCodeAt(10);
    }
}


module.exports = mongoose.model('User', UserSchema);