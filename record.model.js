/**
 * Copyright M.A.D. Computer Consulting LLC 2020
 *
 * @fileOverview /db/models/record.model.js
 * @author Michael A. Dennis <michaeladennis@yahoo.com>
 * @version 0.0.1
 */
 
 //Import Dependancies
const mongoose = require('mongoose');

//Initialize Schema
const Schema = mongoose.Schema;

//Create Validator Function
function isValidEmail(email, errors, keyName){
    let flag = true;
    const _errors = [];
    if(!typeof email === 'String' ) {
        _errors.push('Email value was of Invalid Type.');
        flag = false;
    }
    if(!email) {
        _errors.push('Email is required');
        flag = false;
    }
    if(email && (email.length <= 5 || email.length > 40)) {
        _errors.push('Please enter email between 6 to 40 characters long');
        flag = false;
    }
    if(email && !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
        _errors.push('Valid Email is required');
        flag = false;
    }
    const obj = {};
    obj[keyName] = _errors;
    if (!flag) {if (keyName) Object.assign(errors, obj); else Object.assign(errors, {email: _errors});}
    return flag; //we return the flag.
}

//Create Schema
const RecordSchema = Schema({
    email: {
      type: String,
      unique: true
    },
    internalUseOnly: {
        type: Boolean,
        default: true
    },
    followUp: Boolean,
    followUpDateRequested: Boolean,
    followUpDate: Date,
});

//Schema Validation
RecordSchema.path('email').validate(function(v) {
  return isValidEmail(v, {});
}, 'Error Parameter "email" is invalid.');

//No Filter Pagination
RecordSchema.statics.getRecords = function getNotes(page = 1, per_page = 100, cb) {
    return this.model('Record').find({}).skip((page - 1) * per_page)
        .limit(per_page).exec(cb);
}

//Filtered Pagination
RecordSchema.statics.getPendingFollowUpRequests = function getPendingFollowUpRequests(page = 1, per_page = 100, cb) {
    return this.model('Record').find({
            followUp: true,
            followUpDateRequested: true
        }).skip((page - 1) * per_page)
        .limit(per_page).exec(cb);
}

//export modules for application use.
module.exports = {
    RecordSchema,
    RecordModel: mongoose.model(
        'Record',
        RecordSchema
    ),
    isValidEmail
};
