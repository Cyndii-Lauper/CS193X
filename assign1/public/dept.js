//TODO: Write Department class here
export default class Department {
    constructor(name, code) {
        this.name = name;
        this.code = code;
        this.students = [];
    }

    toString() {
        return this.name;
    }

    declare(student) {
        if (student.isAlum === true) {
            throw Error("the student has graduated");
        }
        if (student.dept === this.name) {
            return;
        }
        if (student.dept !== null) {
            throw Error("the student is already under a different department");
        }
        this.students.push(student);
        student.dept = this.name;
    }

    graduate() {
        var res = [];
        var length = this.students.length;
        for (var i = 0; i < length; ++i) {
            if (this.students[i].canGraduate()) {
                this.students[i].isAlum = true;
                res.push(this.students[i]);
                this.students.splice(i, 1);
                i--;
                length--;
            }
        }
        return res;
    }
}
