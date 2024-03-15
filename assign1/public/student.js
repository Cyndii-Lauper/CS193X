//TODO: Write Student class here
export default class Student {
    constructor(sunetid, givenName, surname) {
        this.sunetid = sunetid;
        this.givenName = givenName;
        this.surname = surname;
        this.dept = null;
        this.unitsCompleted = 0;
        this.isAlum = false;
    }

    fullName() {
        return this.givenName + " " + this.surname;
    }

    addUnits(units) {
        this.unitsCompleted += units;
    }

    toString() {
        return this.fullName() + " (" + this.sunetid + ")"; 
    }

    canGraduate() {
        if (this.isAlum) {
            throw Error("the student has graduated");
        }

        if (this.dept !== null && this.unitsCompleted >= 180) {
            return true;
        }
        return false;
    }
}
