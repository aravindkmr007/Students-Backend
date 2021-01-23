import mongoose from 'mongoose'

const studentsSchema = mongoose.Schema(
    {
        stu_id : Number,
        firstname : String,
        lastname : String,
        email : String,
        dob : Date
    }
)
export default mongoose.model('StudentsDatabase', studentsSchema)