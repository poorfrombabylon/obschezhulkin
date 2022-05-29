class TProfileScreen {
    constructor(student) {
        this.student = student
    }

    fill() {
        // $(document.getElementById("icon"))

        $(document.getElementById("name"))
            .html(this.student.surname + " " + this.student.name + " " + this.student.patronymic)
        $(document.getElementById("birthDate"))
            .html("Дата рождения: " + this.student.birthDate)
        $(document.getElementById("roomId"))
            .html("Номер комнаты: " + this.student.roomId)
        $(document.getElementById("enrollmentDate"))
            .html("Дата зачисления: " + this.student.enrolmentDate)
        $(document.getElementById("placeOfBirth"))
            .html("Место рождения: " + this.student.placeOfBirth)
        
        for (var i = 0; i < this.student.positiveChar.length; i++) {
            $(document.getElementById("positiveChar"))
                .append(
                    $(document.createElement("p"))
                        .addClass("card-text")
                        .html(" - " + this.student.positiveChar[i])
                )
        }
        for (var i = 0; i < this.student.negativeChar.length; i++) {
            $(document.getElementById("negativeChar"))
                .append(
                    $(document.createElement("p"))
                        .addClass("card-text")
                        .html(" - " + this.student.negativeChar[i])
                )
        }
    }
}

var profileScreen = new TProfileScreen(TStudent.example)
profileScreen.fill()
