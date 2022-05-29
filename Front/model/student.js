class TStudentCard {
    constructor(id, name, surname, icon) {
        this.id = id
        this.name = name
        this.surname = surname
        this.icon = icon
    }
}

class TStudent {
    constructor(
        id, name, surname, patronymic, birthDate, photo, dormitoryOrderID, roomId, enrolmentOrderId, enrolmentDate, placeOfBirth, positiveChar, negativeChar
    ) {
        this.id = id
        this.name = name
        this.surname = surname
        this.patronymic = patronymic
        this.birthDate = birthDate
        this.photo = photo
        this.dormitoryOrderID = dormitoryOrderID
        this.roomId = roomId
        this.enrolmentOrderId = enrolmentOrderId
        this.enrolmentDate = enrolmentDate
        this.placeOfBirth = placeOfBirth

        this.positiveChar = positiveChar
        this.negativeChar = negativeChar
    }

    static example = new TStudent(
        "123", "Nikita", "Ratashnyuk", "Andreevich", "12.04.2002", "BYTES", "123123", "1", "123123132", "1.09.2020", "Vladivostok", 
        ["Крутой чел", "Вовремя сдал подушку"], ["Курил на балконе"] 
    )
}
