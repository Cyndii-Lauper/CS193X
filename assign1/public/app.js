//TODO: Add imports
import Department from './dept.js'
import Student from './student.js';

export default class App {
  constructor() {
    this.students = {};
    this.depts = {};
    let form = document.forms["Assignment1"];
    form.declare.addEventListener("click", (event)=>{
      try {
        this.declare(form.sunetid.value, form.departmentcode.value);
        alert(this.students[form.sunetid.value].toString() + " declared " + this.depts[form.departmentcode.value].toString())
      } catch(e) {
        alert(e.message);
      }
    });
    form.graduate.addEventListener("click", (event)=>{
      try {
        var res = this.graduate(form.departmentcode.value);
        var info = "";
        for (var i of res) {
          info += i.toString() + "\n";
        }
        alert("Graduates:\n" + info);
      } catch (e) {
        alert(e.message);
      }
    });
  }

  loadData(data) {
    this.students = {};
    this.depts = {};
    for (var i of data.students) {
      this.students[i.sunetid] = new Student(i.sunetid, i.givenName, i.surname)
    }
    const units = data.units;
    for (var i of Object.keys(units)) {
      this.students[i].addUnits(units[i]);
    }

    for (var i of data.depts) {
      this.depts[i.code] = new Department(i.name, i.code);
    }
  }

  declare(sunetid, deptCode) {
    var student = this.students[sunetid];
    var department = this.depts[deptCode];
    if (!student) {
      throw Error("can't find sunetid");
    }
    if (!department) {
      throw Error("can't find deptCode");
    }
    department.declare(student)
    return student;
  }

  graduate(deptCode) {
    var department = this.depts[deptCode];
    if (!department) {
      throw Error("can't find deptCode");
    }
    return department.graduate();
  }

  //TODO: Add additional methods here
}
