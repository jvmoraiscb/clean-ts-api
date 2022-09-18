export class StudentMinorError extends Error{
    constructor(){
        super('minor student not allowed!')
        this.name = 'StudentMinorError'
    }
}